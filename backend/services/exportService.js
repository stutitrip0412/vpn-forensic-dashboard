const PDFDocument = require('pdfkit');
const mongoose = require('mongoose');
const Case = require('../models/Case');
const Evidence = require('../models/Evidence');
const Anomaly = require('../models/Anomaly');
const LogEntry = require('../models/LogEntry');
const Note = require('../models/Note');
const { toCsv } = require('../utils/csv');

/**
 * FR5.4 case summary export. Two formats, deliberately serving different
 * purposes rather than the same content in two containers:
 *
 *  - PDF: a narrative report — case details, evidence list with hashes,
 *    a timeline SUMMARY (counts by action type + first/last timestamp,
 *    not every row — a case can have up to 1M log entries per the NFR,
 *    which doesn't belong in a printed report), flagged anomalies, and
 *    analyst notes. This is the artifact meant for a case file or a
 *    non-technical reviewer (Usability NFR).
 *  - CSV: the full flat timeline of parsed log entries, one row per
 *    event. This is the artifact meant for further analysis in a
 *    spreadsheet — exactly what CSV is good for and PDF is not.
 *
 * Both pull live from the database at export time rather than caching a
 * report, so an export always reflects the current state (including
 * whatever an analyst has since marked reviewed/confirmed).
 */

async function buildCaseSummaryPdf(caseId, outputStream) {
  const [foundCase, evidenceList, anomalies, notes, timelineStats] = await Promise.all([
    Case.findById(caseId).populate('createdBy', 'username'),
    Evidence.find({ caseId }).populate('uploadedBy', 'username'),
    Anomaly.find({ caseId }).sort({ severity: 1, createdAt: -1 }),
    Note.find({ caseId, targetType: 'case' }).populate('authorId', 'username').sort({ createdAt: 1 }),
    LogEntry.aggregate([
      { $match: { caseId: new mongoose.Types.ObjectId(caseId) } },
      {
        $group: {
          _id: '$action',
          count: { $sum: 1 },
          first: { $min: '$timestampUTC' },
          last: { $max: '$timestampUTC' },
        },
      },
    ]),
  ]);

  if (!foundCase) {
    throw new Error('Case not found.');
  }

  const doc = new PDFDocument({ margin: 50 });
  doc.pipe(outputStream);

  // --- Header ---
  doc.fontSize(20).text('VPN Forensic Case Summary Report', { align: 'center' });
  doc.moveDown(0.3);
  doc.fontSize(9).fillColor('gray').text(`Generated ${new Date().toISOString()}`, { align: 'center' });
  doc.fillColor('black');
  doc.moveDown(2);

  // --- Case details ---
  doc.fontSize(14).text('Case Details', { underline: true });
  doc.moveDown(0.3);
  doc.fontSize(10);
  doc.text(`Name: ${foundCase.name}`);
  doc.text(`Status: ${foundCase.status}${foundCase.legalHold ? '  (LEGAL HOLD)' : ''}`);
  doc.text(`Created by: ${foundCase.createdBy?.username || 'unknown'} on ${foundCase.createdAt.toISOString()}`);
  if (foundCase.description) doc.text(`Description: ${foundCase.description}`);
  doc.moveDown(1.5);

  // --- Evidence ---
  doc.fontSize(14).text('Evidence', { underline: true });
  doc.moveDown(0.3);
  doc.fontSize(9);
  if (evidenceList.length === 0) {
    doc.text('No evidence uploaded to this case.');
  }
  evidenceList.forEach((e) => {
    doc.font('Helvetica-Bold').text(e.originalFilename);
    doc.font('Helvetica');
    doc.text(`SHA-256: ${e.sha256Hash}`);
    doc.text(
      `Source type: ${e.sourceType} | Uploaded by: ${e.uploadedBy?.username || 'unknown'} on ${e.createdAt.toISOString()}`
    );
    doc.text(
      `Parse coverage: ${e.parseCoverage != null ? e.parseCoverage + '%' : 'n/a'} | Quarantined lines: ${e.quarantinedLineCount}`
    );
    doc.text(
      `Last integrity check: ${e.lastVerifiedAt ? `${e.lastVerifiedAt.toISOString()} — ${e.lastVerificationResult}` : 'not yet verified'}`
    );
    doc.moveDown(0.5);
  });

  // --- Timeline summary ---
  doc.addPage();
  doc.fontSize(14).text('Timeline Summary', { underline: true });
  doc.moveDown(0.3);
  doc.fontSize(9);
  if (timelineStats.length === 0) {
    doc.text('No parsed log entries for this case.');
  } else {
    timelineStats.forEach((s) => {
      doc.text(`${s._id}: ${s.count} events (${s.first.toISOString()} to ${s.last.toISOString()})`);
    });
  }
  doc.moveDown(0.5);
  doc
    .fontSize(8)
    .fillColor('gray')
    .text('Full per-entry timeline is available via the CSV export or GET /api/cases/:id/logs.');
  doc.fillColor('black');
  doc.moveDown(1.5);

  // --- Anomalies ---
  doc.fontSize(14).text('Flagged Anomalies', { underline: true });
  doc.moveDown(0.3);
  doc.fontSize(9);
  if (anomalies.length === 0) {
    doc.text('No anomalies flagged.');
  }
  anomalies.forEach((a) => {
    doc.font('Helvetica-Bold').text(`[${a.severity.toUpperCase()}] ${a.type} — ${a.status}`);
    doc.font('Helvetica').text(a.description);
    if (a.analystNote) doc.text(`Analyst note: ${a.analystNote}`);
    doc.moveDown(0.5);
  });

  // --- Notes ---
  doc.addPage();
  doc.fontSize(14).text('Analyst Notes', { underline: true });
  doc.moveDown(0.3);
  doc.fontSize(9);
  if (notes.length === 0) {
    doc.text('No case-level notes recorded.');
  }
  notes.forEach((n) => {
    doc.font('Helvetica-Bold').text(`${n.authorId?.username || 'unknown'} — ${n.createdAt.toISOString()}`);
    doc.font('Helvetica').text(n.body);
    doc.moveDown(0.5);
  });

  // --- Disclaimer (Risks & Mitigations: GeoIP is approximate; NFR Usability) ---
  doc.moveDown(1);
  doc
    .fontSize(7)
    .fillColor('gray')
    .text(
      'GeoIP-based location data referenced in this report is approximate and must not be treated as ground ' +
        'truth (accuracy varies, particularly for mobile/CGNAT-assigned IPs). This report was generated by an ' +
        'automated tool; findings should be reviewed and corroborated by a qualified analyst before any ' +
        'evidentiary or legal use.',
      { align: 'left' }
    );

  doc.end();
}

async function buildCaseLogsCsv(caseId) {
  const entries = await LogEntry.find({ caseId }).sort({ timestampUTC: 1 });

  const rows = entries.map((e) => ({
    timestampUTC: e.timestampUTC.toISOString(),
    user: e.user || '',
    sourceIp: e.sourceIp || '',
    vpnAssignedIp: e.vpnAssignedIp || '',
    action: e.action,
    sessionId: e.sessionId || '',
    country: e.geo?.country || '',
    city: e.geo?.city || '',
  }));

  return toCsv(rows, [
    'timestampUTC',
    'user',
    'sourceIp',
    'vpnAssignedIp',
    'action',
    'sessionId',
    'country',
    'city',
  ]);
}

module.exports = { buildCaseSummaryPdf, buildCaseLogsCsv };
