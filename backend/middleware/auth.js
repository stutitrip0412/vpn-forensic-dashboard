const { verifyToken } = require('../utils/jwt');
const User = require('../models/User');

/**
 * Requires a valid Bearer JWT. Attaches the full (safe) user document to
 * req.user. This is the ONLY thing that establishes identity — the RBAC
 * middleware (rbac.js) then decides if that identity is allowed to proceed.
 * FR7.3: every protected endpoint uses this + requireRole, never a
 * frontend-only check.
 */
async function requireAuth(req, res, next) {
  const authHeader = req.headers.authorization || '';
  const [scheme, token] = authHeader.split(' ');

  if (scheme !== 'Bearer' || !token) {
    return res.status(401).json({ error: 'Missing or malformed Authorization header.' });
  }

  let decoded;
  try {
    decoded = verifyToken(token);
  } catch (err) {
    return res.status(401).json({ error: 'Invalid or expired token.' });
  }

  const user = await User.findById(decoded.sub);

  if (!user || !user.isActive) {
    return res.status(401).json({ error: 'User account not found or deactivated.' });
  }

  req.user = user; // full mongoose doc — controllers can call .toSafeObject()
  next();
}

module.exports = { requireAuth };
