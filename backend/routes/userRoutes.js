const express = require('express');
const {
  createUser,
  listUsers,
  deactivateUser,
  createUserValidators,
} = require('../controllers/userController');
const { requireAuth } = require('../middleware/auth');
const { requireRole } = require('../middleware/rbac');
const { ROLES } = require('../config/constants');

const router = express.Router();

// Every route below requires authentication AND the admin role, enforced
// server-side (FR7.3) — never rely on the frontend hiding the "Users" nav item.
router.use(requireAuth, requireRole(ROLES.ADMIN, { exact: true }));

router.get('/', listUsers);
router.post('/', createUserValidators, createUser);
router.patch('/:id/deactivate', deactivateUser);

module.exports = router;
