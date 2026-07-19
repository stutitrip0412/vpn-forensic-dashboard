const { body, validationResult } = require('express-validator');
const Case = require('../models/Case');
const LogEntry = require('../models/LogEntry');
const { recordAudit } = require('../utils/auditLogger');
const { AUDIT_ACTIONS } = require('../config/constants');

const createCaseValidators = [
  body('name').trim().isLength({ min: 1, max: 200 }).withMessage('Case name is required.'),
  body('description').optional().trim().isLength({ max: 5000 }),
];

/**
 * POST /api/cases (FR5.1)
 */
async function createCase(req, res) {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { name, description = '' } = req.body;

  const newCase = await Case.create({
    name,
    description,
    createdBy: req.user._id,
    assignedUsers: [req.user._id],
  });

  await recordAudit({
    actorUserId: req.user._id,
    actorUsername: req.user.username,
    action: AUDIT_ACTIONS.CASE_CREATED,
    targetType: 'Case',
    targetId: newCase._id,
    ipAddress: req.ip,
    metadata: { name: newCase.name },
  });

  res.status(201).json({ case: newCase });
}

/**
 * GET /api/cases
 * All authenticated roles (including Viewer) can list cases — matches the
 * "Case Supervisor / Legal Reviewer" persona, who needs visibility without
 * touching raw logs.
 */
async function listCases(req, res) {
  const { status } = req.query;
  const filter = {};
  if (status) filter.status = status;

  const cases = await Case.find(filter).sort({ createdAt: -1 }).populate('createdBy', 'username');
  res.json({ cases });
}

/**
 * GET /api/cases/:id
 */
async function getCase(req, res) {
  const found = await Case.findById(req.params.id)
    .populate('createdBy', 'username')
    .populate('assignedUsers', 'username role');

  if (!found) {
    return res.status(404).json({ error: 'Case not found.' });
  }

  res.json({ case: found });
}

/**
 * PATCH /api/cases/:id (FR5.1 rename/archive, section 8 legalHold/retention)
 * Restricted to lead_investigator+ — renaming/archiving/legal-hold are
 * case-level administrative actions, not routine analyst work.
 */
async function updateCase(req, res) {
  const found = await Case.findById(req.params.id);
  if (!found) {
    return res.status(404).json({ error: 'Case not found.' });
  }

  const allowedFields = [
    'name',
    'description',
    'status',
    'legalHold',
    'retentionPolicyDays',
    'normalHoursStart',
    'normalHoursEnd',
  ];
  const changes = {};

  for (const field of allowedFields) {
    if (req.body[field] !== undefined) {
      found[field] = req.body[field];
      changes[field] = req.body[field];
    }
  }

  if (Object.keys(changes).length === 0) {
    return res.status(400).json({ error: 'No valid fields provided to update.' });
  }

  await found.save();

  await recordAudit({
    actorUserId: req.user._id,
    actorUsername: req.user.username,
    action: AUDIT_ACTIONS.CASE_UPDATED,
    targetType: 'Case',
    targetId: found._id,
    ipAddress: req.ip,
    metadata: { changes },
  });

  res.json({ case: found });
}

/**
 * POST /api/cases/:id/assign (FR5.2: multiple analysts per case)
 */
async function assignUser(req, res) {
  const { userId } = req.body;
  if (!userId) {
    return res.status(400).json({ error: 'userId is required.' });
  }

  const found = await Case.findById(req.params.id);
  if (!found) {
    return res.status(404).json({ error: 'Case not found.' });
  }

  if (!found.assignedUsers.some((id) => id.toString() === userId)) {
    found.assignedUsers.push(userId);
    await found.save();
  }

  await recordAudit({
    actorUserId: req.user._id,
    actorUsername: req.user.username,
    action: AUDIT_ACTIONS.CASE_UPDATED,
    targetType: 'Case',
    targetId: found._id,
    ipAddress: req.ip,
    metadata: { assignedUserId: userId },
  });

  res.json({ case: found });
}

/**
 * GET /api/cases/:id/logs (FR8.4: filterable/searchable table of parsed entries)
 * Supports filtering by user, sourceIp, action, and a date range, plus
 * simple pagination. Full free-text search / advanced filtering can be
 * layered on in the dashboard phase without changing this contract.
 */
async function getCaseLogs(req, res) {
  const { user, sourceIp, action, from, to, page = 1, limit = 100 } = req.query;

  const filter = { caseId: req.params.id };
  if (user) filter.user = user;
  if (sourceIp) filter.sourceIp = sourceIp;
  if (action) filter.action = action;
  if (from || to) {
    filter.timestampUTC = {};
    if (from) filter.timestampUTC.$gte = new Date(from);
    if (to) filter.timestampUTC.$lte = new Date(to);
  }

  const pageNum = Math.max(1, parseInt(page, 10) || 1);
  const limitNum = Math.min(1000, Math.max(1, parseInt(limit, 10) || 100));

  const [entries, total] = await Promise.all([
    LogEntry.find(filter)
      .sort({ timestampUTC: 1 })
      .skip((pageNum - 1) * limitNum)
      .limit(limitNum),
    LogEntry.countDocuments(filter),
  ]);

  res.json({
    entries,
    pagination: { page: pageNum, limit: limitNum, total, totalPages: Math.ceil(total / limitNum) },
  });
}

module.exports = {
  createCase,
  listCases,
  getCase,
  updateCase,
  assignUser,
  getCaseLogs,
  createCaseValidators,
};
