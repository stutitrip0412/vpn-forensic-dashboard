const express = require('express');
const { verifyEvidence, downloadEvidence, getEvidence } = require('../controllers/evidenceController');
const { getEvidenceCustody } = require('../controllers/auditController');
const { requireAuth } = require('../middleware/auth');
const { requireRole } = require('../middleware/rbac');
const { ROLES } = require('../config/constants');

const router = express.Router();

router.use(requireAuth);

router.get('/:id', requireRole(ROLES.VIEWER), getEvidence);
router.get('/:id/verify', requireRole(ROLES.VIEWER), verifyEvidence);
router.get('/:id/download', requireRole(ROLES.ANALYST), downloadEvidence);
router.get('/:id/custody', requireRole(ROLES.VIEWER), getEvidenceCustody);

module.exports = router;
