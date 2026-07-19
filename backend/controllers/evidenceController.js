const fs = require('fs');
const path = require('path');
const Evidence = require('../models/Evidence');
const Case = require('../models/Case');
const { sha256File } = require('../utils/hash');
const { recordAudit } = require('../utils/auditLogger');
const { AUDIT_ACTIONS } = require('../config/constants');
const { parseEvidenceFile } = require('../services/parseEvidenceFile');
const { SUPPORTED_SOURCE_TYPES } = require('../services/parsers');

/**
 * POST /api/cases/:caseId/evidence (FR1.1-FR1.4)
 * multer (uploadEvidence.single('file')) must run before this handler —
 * by the time we get here the raw file is already saved to disk unmodified.
 *
 * Order of operations matters for evidentiary integrity:
 *   1. File is already on disk untouched (multer did this).
 *   2. Hash it immediately, before anything else touches it (FR1.3).
 *   3. Persist the Evidence record with that hash.
 *   4. THEN kick off parsing, which only ever reads a working copy (FR1.4)
 *      — never the file we just hashed.
 */
async function uploadEvidence(req, res) {
  if (!req.file) {
    return res.status(400).json({ error: 'No file uploaded (field name must be "file").' });
  }

  const foundCase = await Case.findById(req.params.caseId);
  if (!foundCase) {
    await fs.promises.unlink(req.file.path).catch(() => {});
    return res.status(404).json({ error: 'Case not found.' });
  }

  const requestedSourceType = req.body.sourceType;
  if (requestedSourceType && !SUPPORTED_SOURCE_TYPES.includes(requestedSourceType)) {
    await fs.promises.unlink(req.file.path).catch(() => {});
    return res.status(400).json({
      error: `Unsupported sourceType. Must be one of: ${SUPPORTED_SOURCE_TYPES.join(', ')}, or omitted for auto-detection.`,
    });
  }

  const sha256Hash = await sha256File(req.file.path);
  const stats = await fs.promises.stat(req.file.path);

  const evidence = await Evidence.create({
    caseId: foundCase._id,
    originalFilename: req.file.originalname,
    storagePath: req.file.path,
    sha256Hash,
    fileSizeBytes: stats.size,
    sourceType: requestedSourceType || 'unknown', // 'unknown' triggers auto-detection during parsing
    uploadedBy: req.user._id,
    parseStatus: 'pending',
  });

  await recordAudit({
    actorUserId: req.user._id,
    actorUsername: req.user.username,
    action: AUDIT_ACTIONS.EVIDENCE_UPLOADED,
    targetType: 'Evidence',
    targetId: evidence._id,
    ipAddress: req.ip,
    metadata: { caseId: foundCase._id, originalFilename: evidence.originalFilename, sha256Hash },
  });

  // Parse inline for now (see services/parseEvidenceFile.js header comment
  // re: swapping this for a queue worker under NFR Scalability). A parse
  // failure is surfaced via evidence.parseStatus, not thrown to the client
  // — the upload itself succeeded and the evidence is safely hashed/stored
  // regardless of whether parsing works.
  try {
    const result = await parseEvidenceFile(evidence._id);
    return res.status(201).json({ evidence: await Evidence.findById(evidence._id), parseResult: result });
  } catch (err) {
    console.error('[evidence] Parsing failed:', err.message);
    return res.status(201).json({
      evidence: await Evidence.findById(evidence._id),
      parseResult: null,
      parseError: 'Parsing failed after upload; evidence is safely stored. See server logs.',
    });
  }
}

/**
 * GET /api/cases/:caseId/evidence
 */
async function listEvidenceForCase(req, res) {
  const evidence = await Evidence.find({ caseId: req.params.caseId })
    .sort({ createdAt: -1 })
    .populate('uploadedBy', 'username');
  res.json({ evidence });
}

/**
 * GET /api/evidence/:id/verify (FR6.2)
 * Re-hashes the file currently on disk and compares it to the hash
 * recorded at upload time. This is the core evidentiary-integrity check —
 * a mismatch means the file changed (or was corrupted) since ingestion.
 */
async function verifyEvidence(req, res) {
  const evidence = await Evidence.findById(req.params.id);
  if (!evidence) {
    return res.status(404).json({ error: 'Evidence not found.' });
  }

  let currentHash;
  try {
    currentHash = await sha256File(evidence.storagePath);
  } catch (err) {
    return res.status(500).json({ error: 'Could not read stored evidence file to verify.' });
  }

  const match = currentHash === evidence.sha256Hash;

  evidence.lastVerifiedAt = new Date();
  evidence.lastVerificationResult = match ? 'match' : 'mismatch';
  await evidence.save();

  await recordAudit({
    actorUserId: req.user._id,
    actorUsername: req.user.username,
    action: match ? AUDIT_ACTIONS.EVIDENCE_VERIFIED : AUDIT_ACTIONS.EVIDENCE_HASH_MISMATCH,
    targetType: 'Evidence',
    targetId: evidence._id,
    ipAddress: req.ip,
    metadata: { originalHash: evidence.sha256Hash, currentHash, match },
  });

  const status = match ? 200 : 409;
  res.status(status).json({
    match,
    originalHash: evidence.sha256Hash,
    currentHash,
    verifiedAt: evidence.lastVerifiedAt,
  });
}

/**
 * GET /api/evidence/:id/download (chain-of-custody: every download audited)
 * Re-verifies the hash before serving (FR6.2) — if it doesn't match, the
 * download is still allowed (an investigator may need the file regardless)
 * but the response is flagged so the discrepancy can't be missed.
 */
async function downloadEvidence(req, res) {
  const evidence = await Evidence.findById(req.params.id);
  if (!evidence) {
    return res.status(404).json({ error: 'Evidence not found.' });
  }

  let currentHash = null;
  let match = null;
  try {
    currentHash = await sha256File(evidence.storagePath);
    match = currentHash === evidence.sha256Hash;
  } catch (err) {
    // File missing/unreadable — still log the attempt, then 404.
  }

  await recordAudit({
    actorUserId: req.user._id,
    actorUsername: req.user.username,
    action: AUDIT_ACTIONS.EVIDENCE_DOWNLOADED,
    targetType: 'Evidence',
    targetId: evidence._id,
    ipAddress: req.ip,
    metadata: { hashMatchAtDownload: match },
  });

  if (currentHash === null) {
    return res.status(404).json({ error: 'Evidence file is missing from storage.' });
  }

  res.setHeader('X-Evidence-Hash-Match', String(match));
  if (!match) {
    res.setHeader('X-Evidence-Warning', 'Stored file hash does not match hash recorded at upload time.');
  }
  res.download(evidence.storagePath, evidence.originalFilename);
}

/**
 * GET /api/evidence/:id (metadata view, counts as chain-of-custody "view")
 */
async function getEvidence(req, res) {
  const evidence = await Evidence.findById(req.params.id).populate('uploadedBy', 'username');
  if (!evidence) {
    return res.status(404).json({ error: 'Evidence not found.' });
  }

  await recordAudit({
    actorUserId: req.user._id,
    actorUsername: req.user.username,
    action: AUDIT_ACTIONS.EVIDENCE_VIEWED,
    targetType: 'Evidence',
    targetId: evidence._id,
    ipAddress: req.ip,
  });

  res.json({ evidence });
}

module.exports = {
  uploadEvidence,
  listEvidenceForCase,
  verifyEvidence,
  downloadEvidence,
  getEvidence,
};
