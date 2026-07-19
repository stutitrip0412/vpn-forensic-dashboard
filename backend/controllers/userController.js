const { body, validationResult } = require('express-validator');
const User = require('../models/User');
const { recordAudit } = require('../utils/auditLogger');
const { AUDIT_ACTIONS, ROLES } = require('../config/constants');

const createUserValidators = [
  body('username').trim().isLength({ min: 3, max: 64 }),
  body('password').isLength({ min: 8 }).withMessage('Password must be at least 8 characters.'),
  body('role').isIn(Object.values(ROLES)),
];

/**
 * POST /api/users
 * Admin-only (FR7.2: System Administrator manages accounts/roles).
 * Route-level requireRole('admin', { exact: true }) enforces this;
 * this controller assumes it already ran.
 */
async function createUser(req, res) {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { username, password, role } = req.body;

  const existing = await User.findOne({ username: username.trim() });
  if (existing) {
    return res.status(409).json({ error: 'Username already exists.' });
  }

  const passwordHash = await User.hashPassword(password);
  const user = await User.create({ username: username.trim(), passwordHash, role });

  await recordAudit({
    actorUserId: req.user._id,
    actorUsername: req.user.username,
    action: AUDIT_ACTIONS.USER_CREATED,
    targetType: 'User',
    targetId: user._id,
    ipAddress: req.ip,
    metadata: { createdUsername: user.username, role: user.role },
  });

  res.status(201).json({ user: user.toSafeObject() });
}

/**
 * GET /api/users
 * Admin-only listing of platform accounts.
 */
async function listUsers(req, res) {
  const users = await User.find().sort({ createdAt: -1 });
  res.json({ users: users.map((u) => u.toSafeObject()) });
}

/**
 * PATCH /api/users/:id/deactivate
 * Soft-disable an account rather than deleting it — preserves referential
 * integrity for audit entries and case history that reference this user.
 */
async function deactivateUser(req, res) {
  const user = await User.findById(req.params.id);
  if (!user) {
    return res.status(404).json({ error: 'User not found.' });
  }

  user.isActive = false;
  await user.save();

  await recordAudit({
    actorUserId: req.user._id,
    actorUsername: req.user.username,
    action: AUDIT_ACTIONS.USER_DEACTIVATED,
    targetType: 'User',
    targetId: user._id,
    ipAddress: req.ip,
    metadata: { username: user.username },
  });

  res.json({ user: user.toSafeObject() });
}

module.exports = { createUser, listUsers, deactivateUser, createUserValidators };
