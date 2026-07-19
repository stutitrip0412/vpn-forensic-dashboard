const AuditLogEntry = require('../models/AuditLogEntry');
const Evidence = require('../models/Evidence');
const Anomaly = require('../models/Anomaly');
const { recordAudit } = require('../utils/auditLogger');
const { AUDIT_ACTIONS } = require('../config/constants');

/**
 * GET /api/cases/:id/audit (FR6.1: retrieve chain-of-custody trail)
 * A case's audit trail isn't stored as its own thing — it's assembled by
 * pulling every AuditLogEntry that targets the case itself, OR any piece
 * of evidence/anomaly that belongs to it. This keeps AuditLogEntry a
 * single flat append-only collection (simpler to lock down at the DB
 * permission level per FR6.3) rather than needing case-scoped audit
 * sub-collections.
 */
async function getCaseAudit(req, res) {
  const caseId = req.params.id;
  const { page = 1, limit = 100 } = req.query;

  const [evidenceIds, anomalyIds] = await Promise.all([
    Evidence.find({ caseId }).distinct('_id'),
    Anomaly.find({ caseId }).distinct('_id'),
  ]);

  const filter = {
    $or: [
      { targetType: 'Case', targetId: caseId },
      { targetType: 'Evidence', targetId: { $in: evidenceIds } },
      { targetType: 'Anomaly', targetId: { $in: anomalyIds } },
    ],
  };

  const pageNum = Math.max(1, parseInt(page, 10) || 1);
  const limitNum = Math.min(500, Math.max(1, parseInt(limit, 10) || 100));

  const [entries, total] = await Promise.all([
    AuditLogEntry.find(filter)
      .sort({ timestamp: -1 })
      .skip((pageNum - 1) * limitNum)
      .limit(limitNum)
      .populate('actorUserId', 'username'),
    AuditLogEntry.countDocuments(filter),
  ]);

  res.json({
    entries,
    pagination: { page: pageNum, limit: limitNum, total, totalPages: Math.ceil(total / limitNum) },
  });
}

/**
 * GET /api/evidence/:id/custody (FR6.4: custody report per piece of evidence)
 * Full chronological history for one piece of evidence — every upload,
 * view, download, and verify event, plus its current hash-verification
 * status. This is the artifact an analyst would print/export to
 * demonstrate the file hasn't been tampered with since ingestion.
 */
async function getEvidenceCustody(req, res) {
  const evidence = await Evidence.findById(req.params.id).populate('uploadedBy', 'username');
  if (!evidence) {
    return res.status(404).json({ error: 'Evidence not found.' });
  }

  const custodyTrail = await AuditLogEntry.find({ targetType: 'Evidence', targetId: evidence._id })
    .sort({ timestamp: 1 })
    .populate('actorUserId', 'username');

  await recordAudit({
    actorUserId: req.user._id,
    actorUsername: req.user.username,
    action: AUDIT_ACTIONS.EVIDENCE_VIEWED,
    targetType: 'Evidence',
    targetId: evidence._id,
    ipAddress: req.ip,
    metadata: { event: 'custody_report_viewed' },
  });

  res.json({
    evidence,
    custodyTrail,
    currentIntegrityStatus: evidence.lastVerificationResult || 'not_yet_verified',
  });
}

module.exports = { getCaseAudit, getEvidenceCustody };
