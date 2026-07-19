const { ROLE_HIERARCHY } = require('../config/constants');

/**
 * Role-gate factory. Usage:
 *   router.post('/cases', requireAuth, requireRole('analyst'), createCase)
 *
 * By default this is a MINIMUM-role check using ROLE_HIERARCHY (e.g.
 * requireRole('analyst') also allows lead_investigator and admin, since
 * they outrank analyst). Pass { exact: true } for an exact-role-only gate.
 *
 * Must always run AFTER requireAuth — it reads req.user set there.
 */
function requireRole(minimumRole, { exact = false } = {}) {
  return (req, res, next) => {
    if (!req.user) {
      // Defensive — should never happen if requireAuth ran first.
      return res.status(401).json({ error: 'Not authenticated.' });
    }

    const userLevel = ROLE_HIERARCHY[req.user.role];
    const requiredLevel = ROLE_HIERARCHY[minimumRole];

    if (userLevel === undefined || requiredLevel === undefined) {
      return res.status(500).json({ error: 'Unknown role in access check.' });
    }

    const allowed = exact ? req.user.role === minimumRole : userLevel >= requiredLevel;

    if (!allowed) {
      return res.status(403).json({
        error: `This action requires role '${minimumRole}' or higher.`,
      });
    }

    next();
  };
}

module.exports = { requireRole };
