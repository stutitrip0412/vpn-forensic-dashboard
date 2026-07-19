const fs = require('fs');
const readline = require('readline');
const LogEntry = require('../models/LogEntry');
const Evidence = require('../models/Evidence');
const { getParser, detectSourceType } = require('./parsers');
const { lookupIps } = require('./geoEnrichment');

const BATCH_SIZE = 1000;
const DETECTION_SAMPLE_SIZE = 200;

/**
 * Reads the first N lines of a file for format auto-detection without
 * loading the whole thing into memory (NFR: streaming reads for large files).
 */
async function sampleLines(filePath, count) {
  const rl = readline.createInterface({ input: fs.createReadStream(filePath), crlfDelay: Infinity });
  const lines = [];
  for await (const line of rl) {
    lines.push(line);
    if (lines.length >= count) break;
  }
  rl.close();
  return lines;
}

/**
 * Parses an evidence file end-to-end and persists LogEntry records.
 *
 * Design notes (see FR1.4, FR2.3, NFR Reliability/Scalability):
 *  - Operates on a transient working copy, never the immutable original
 *    at evidence.storagePath.
 *  - Streams line-by-line via readline rather than reading the whole
 *    file into memory, so large files don't blow up server RAM.
 *  - A malformed/unparseable line is quarantined (counted, not inserted)
 *    rather than crashing the whole job — one bad line can't sink the
 *    ingestion of the other 999,999.
 *  - Inserts LogEntry docs in batches to avoid a single giant insertMany.
 *  - This runs inline (awaited by the caller) for now. The PRD's NFR
 *    Scalability calls for a queueable job (e.g. Redis + Bull) so large
 *    files don't block the API thread — noted as a follow-up; wiring
 *    parseEvidenceFile() behind a queue worker instead of calling it
 *    directly from the upload controller is a drop-in change since this
 *    function already takes just an evidenceId.
 */
async function parseEvidenceFile(evidenceId) {
  const evidence = await Evidence.findById(evidenceId);
  if (!evidence) {
    throw new Error(`Evidence ${evidenceId} not found.`);
  }

  evidence.parseStatus = 'processing';
  await evidence.save();

  const workingCopyPath = `${evidence.storagePath}.parsecopy-${Date.now()}-${Math.random().toString(36).slice(2)}`;

  try {
    await fs.promises.copyFile(evidence.storagePath, workingCopyPath);

    let sourceType = evidence.sourceType;
    if (!sourceType || sourceType === 'unknown') {
      const sample = await sampleLines(workingCopyPath, DETECTION_SAMPLE_SIZE);
      const detected = detectSourceType(sample);
      sourceType = detected.sourceType;
      evidence.sourceType = sourceType;
    }

    if (sourceType === 'unknown') {
      evidence.parseStatus = 'failed';
      evidence.parseCoverage = 0;
      await evidence.save();
      return { sourceType, parseCoverage: 0, totalLines: 0, quarantinedLineCount: 0 };
    }

    const parser = getParser(sourceType);

    const rl = readline.createInterface({ input: fs.createReadStream(workingCopyPath), crlfDelay: Infinity });

    let totalNonEmptyLines = 0;
    let matchedLines = 0;
    const rawEntries = [];

    for await (const line of rl) {
      if (!line.trim()) continue;
      totalNonEmptyLines++;

      let result;
      try {
        result = parser.processLine(line);
      } catch (lineErr) {
        // A single bad line must never crash the whole ingestion job
        // (NFR Reliability). Treat it as unparseable and move on.
        result = { matched: false };
      }

      if (result.matched) {
        matchedLines++;
        if (result.entry) rawEntries.push(result.entry);
      }
    }

    const finalEntries = parser.finalize ? parser.finalize(rawEntries) : rawEntries;

    // GeoIP enrichment (FR3.1) — resolve every unique source IP once via
    // the cached lookup, then attach to each entry. Doing this as a batch
    // keyed by unique IP avoids redundant lookups when thousands of lines
    // share a handful of source IPs.
    const geoByIp = await lookupIps(finalEntries.filter(Boolean).map((e) => e.sourceIp));

    const docs = finalEntries
      .filter((e) => e && e.timestampUTC && e.action)
      .map((e) => ({
        evidenceId: evidence._id,
        caseId: evidence.caseId,
        timestampUTC: e.timestampUTC,
        timestampRaw: e.timestampRaw || null,
        originalTimezone: e.originalTimezone || null,
        user: e.user || null,
        sourceIp: e.sourceIp || null,
        vpnAssignedIp: e.vpnAssignedIp || null,
        action: e.action,
        sessionId: e.sessionId || null,
        rawLine: e.rawLine,
        geo: geoByIp.get(e.sourceIp) || { isApproximate: true },
      }));

    for (let i = 0; i < docs.length; i += BATCH_SIZE) {
      await LogEntry.insertMany(docs.slice(i, i + BATCH_SIZE), { ordered: false });
    }

    const parseCoverage = totalNonEmptyLines === 0 ? 0 : Math.round((matchedLines / totalNonEmptyLines) * 10000) / 100;
    const quarantinedLineCount = totalNonEmptyLines - matchedLines;

    evidence.parseStatus = 'completed';
    evidence.parseCoverage = parseCoverage;
    evidence.quarantinedLineCount = quarantinedLineCount;
    await evidence.save();

    return {
      sourceType,
      parseCoverage,
      totalLines: totalNonEmptyLines,
      quarantinedLineCount,
      logEntriesCreated: docs.length,
    };
  } catch (err) {
    evidence.parseStatus = 'failed';
    await evidence.save();
    throw err;
  } finally {
    await fs.promises.unlink(workingCopyPath).catch(() => {});
  }
}

module.exports = { parseEvidenceFile };
