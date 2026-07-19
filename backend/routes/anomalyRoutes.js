const express = require('express');
const { updateAnomaly, updateAnomalyValidators } = require('../controllers/anomalyController');
const { requireAuth } = require('../middleware/auth');
const { requireRole } = require('../middleware/rbac');
const { ROLES } = require('../config/constants');

const router = express.Router();

router.use(requireAuth);

router.patch('/:id', requireRole(ROLES.ANALYST), updateAnomalyValidators, updateAnomaly);

module.exports = router;
