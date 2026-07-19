const { body, validationResult } = require('express-validator');
const Anomaly = require('../models/Anomaly');
const { runAnomalyDetection } = require('../services/runAnomalyDetection');
const { recordAudit } = require('../utils/auditLogger');
const { AUDIT_ACTIONS } = require('../config/constants');

/**
 * POST /api/cases/:id/analyze
 * Runs (or re-runs) anomaly detection across all parsed evidence in the
 * case. Analyst+ — this is a routine investigative action, not an admin one.
 */
async function analyzeCase(req, res) {
  const result = await runAnomalyDetection(req.params.id);

  await recordAudit({
    actorUserId: req.user._id,
    actorUsername: req.user.username,
    action: AUDIT_ACTIONS.ANOMALY_UPDATED,
    targetType: 'Case',
    targetId: req.params.id,
    ipAddress: req.ip,
    metadata: { event: 'analysis_run', ...result },
  });

  res.json(result);
}

/**
 * GET /api/cases/:id/anomalies (FR8.5)
 * Filterable by status/severity/type.
 */
async function listAnomaliesForCase(req, res) {
  const { status, severity, type } = req.query;
  const filter = { caseId: req.params.id };
  if (status) filter.status = status;
  if (severity) filter.severity = severity;
  if (type) filter.type = type;

  const anomalies = await Anomaly.find(filter)
    .sort({ severity: 1, createdAt: -1 })
    .populate('relatedLogEntryIds')
    .populate('reviewedBy', 'username');

  res.json({ anomalies });
}

const updateAnomalyValidators = [
  body('status').optional().isIn(['open', 'reviewed', 'false_positive', 'confirmed']),
  body('analystNote').optional().trim().isLength({ max: 5000 }),
];

/**
 * PATCH /api/anomalies/:id (FR4.6)
 * Analyst marks an anomaly reviewed/false-positive/confirmed with a note.
 */
async function updateAnomaly(req, res) {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const anomaly = await Anomaly.findById(req.params.id);
  if (!anomaly) {
    return res.status(404).json({ error: 'Anomaly not found.' });
  }

  const { status, analystNote } = req.body;
  if (status !== undefined) {
    anomaly.status = status;
    anomaly.reviewedBy = req.user._id;
    anomaly.reviewedAt = new Date();
  }
  if (analystNote !== undefined) {
    anomaly.analystNote = analystNote;
  }

  await anomaly.save();

  await recordAudit({
    actorUserId: req.user._id,
    actorUsername: req.user.username,
    action: AUDIT_ACTIONS.ANOMALY_UPDATED,
    targetType: 'Anomaly',
    targetId: anomaly._id,
    ipAddress: req.ip,
    metadata: { status: anomaly.status },
  });

  res.json({ anomaly });
}

module.exports = { analyzeCase, listAnomaliesForCase, updateAnomaly, updateAnomalyValidators };
