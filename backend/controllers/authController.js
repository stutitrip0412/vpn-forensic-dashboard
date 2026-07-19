const { body, validationResult } = require('express-validator');
const User = require('../models/User');
const { signToken } = require('../utils/jwt');
const { recordAudit } = require('../utils/auditLogger');
const { AUDIT_ACTIONS } = require('../config/constants');

const loginValidators = [
  body('username').trim().isLength({ min: 1 }).withMessage('Username is required.'),
  body('password').isLength({ min: 1 }).withMessage('Password is required.'),
];

/**
 * POST /api/auth/login
 * FR7.1/FR7.4: authenticate via bcrypt-compared password, issue JWT,
 * and log the attempt (success or failure) to the platform audit trail —
 * distinct from the VPN evidence audit trail per FR7.4.
 */
async function login(req, res) {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { username, password } = req.body;
  const ipAddress = req.ip;

  const user = await User.findOne({ username: username.trim() });

  // Compare against a dummy hash even when user doesn't exist, so response
  // timing doesn't leak whether a username is valid.
  const DUMMY_HASH = '$2a$12$CwTycUXWue0Thq9StjUM0uJ8Nv2gLNqXlj5FbA9zpvR9v8H4pKV.a';
  const passwordMatches = user
    ? await user.comparePassword(password)
    : await require('bcryptjs').compare(password, DUMMY_HASH);

  if (!user || !user.isActive || !passwordMatches) {
    await recordAudit({
      actorUsername: username,
      action: AUDIT_ACTIONS.LOGIN_FAILURE,
      targetType: 'Auth',
      ipAddress,
      metadata: { reason: !user ? 'no_such_user' : !user.isActive ? 'inactive' : 'bad_password' },
    });
    return res.status(401).json({ error: 'Invalid username or password.' });
  }

  user.lastLoginAt = new Date();
  await user.save();

  const token = signToken(user);

  await recordAudit({
    actorUserId: user._id,
    actorUsername: user.username,
    action: AUDIT_ACTIONS.LOGIN_SUCCESS,
    targetType: 'Auth',
    ipAddress,
  });

  res.json({
    token,
    user: user.toSafeObject(),
  });
}

/**
 * POST /api/auth/logout
 * JWTs are stateless, so "logout" here is primarily an audit event —
 * the frontend discards the token client-side. (A production hardening
 * step would be a server-side token blocklist; noted for later, not
 * built into v1 per the PRD's stated stack.)
 */
async function logout(req, res) {
  await recordAudit({
    actorUserId: req.user._id,
    actorUsername: req.user.username,
    action: AUDIT_ACTIONS.LOGOUT,
    targetType: 'Auth',
    ipAddress: req.ip,
  });
  res.json({ message: 'Logged out.' });
}

/**
 * GET /api/auth/me
 * Lets the frontend verify the current token and fetch fresh user info.
 */
async function me(req, res) {
  res.json({ user: req.user.toSafeObject() });
}

module.exports = { login, logout, me, loginValidators };
