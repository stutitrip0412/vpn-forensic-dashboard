const express = require('express');
const rateLimit = require('express-rate-limit');
const { login, logout, me, loginValidators } = require('../controllers/authController');
const { requireAuth } = require('../middleware/auth');

const router = express.Router();

// FR: rate limiting on auth endpoints (NFR Security) — mitigates brute-force
// against the platform's own login, separate from the VPN brute-force
// *detection* feature (which analyzes uploaded evidence, not this API).
const loginLimiter = rateLimit({
  windowMs: Number(process.env.AUTH_RATE_LIMIT_WINDOW_MS) || 15 * 60 * 1000,
  max: Number(process.env.AUTH_RATE_LIMIT_MAX) || 10,
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: 'Too many login attempts. Please try again later.' },
});

router.post('/login', loginLimiter, loginValidators, login);
router.post('/logout', requireAuth, logout);
router.get('/me', requireAuth, me);

module.exports = router;
