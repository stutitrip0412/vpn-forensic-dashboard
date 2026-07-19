const express = require('express');
const {
  createCase,
  listCases,
  getCase,
  updateCase,
  assignUser,
  getCaseLogs,
  createCaseValidators,
} = require('../controllers/caseController');
const { uploadEvidence: uploadEvidenceHandler, listEvidenceForCase } = require('../controllers/evidenceController');
const { analyzeCase, listAnomaliesForCase } = require('../controllers/anomalyController');
const { createNote, listNotesForCase, createNoteValidators } = require('../controllers/noteController');
const { getCaseAudit } = require('../controllers/auditController');
const { exportCase } = require('../controllers/exportController');
const { requireAuth } = require('../middleware/auth');
const { requireRole } = require('../middleware/rbac');
const { uploadEvidence } = require('../middleware/upload');
const { ROLES } = require('../config/constants');

const router = express.Router();

router.use(requireAuth);

router.post('/', requireRole(ROLES.ANALYST), createCaseValidators, createCase);
router.get('/', requireRole(ROLES.VIEWER), listCases);
router.get('/:id', requireRole(ROLES.VIEWER), getCase);
router.patch('/:id', requireRole(ROLES.LEAD_INVESTIGATOR), updateCase);
router.post('/:id/assign', requireRole(ROLES.LEAD_INVESTIGATOR), assignUser);

router.get('/:id/logs', requireRole(ROLES.VIEWER), getCaseLogs);

// Nested evidence routes — :caseId matches upload.js's use of req.params.caseId
router.post(
  '/:caseId/evidence',
  requireRole(ROLES.ANALYST),
  uploadEvidence.single('file'),
  uploadEvidenceHandler
);
router.get('/:caseId/evidence', requireRole(ROLES.VIEWER), listEvidenceForCase);

// Anomaly detection — analyst+ can trigger a (re-)run, any authenticated
// role can view results (matches the Case Supervisor persona again).
router.post('/:id/analyze', requireRole(ROLES.ANALYST), analyzeCase);
router.get('/:id/anomalies', requireRole(ROLES.VIEWER), listAnomaliesForCase);

// Notes (FR5.3)
router.post('/:id/notes', requireRole(ROLES.ANALYST), createNoteValidators, createNote);
router.get('/:id/notes', requireRole(ROLES.VIEWER), listNotesForCase);

// Chain of custody + export (FR6.1, FR5.4) — viewer+ so the Case
// Supervisor / Legal Reviewer persona can pull these without needing
// analyst-level access to touch raw logs.
router.get('/:id/audit', requireRole(ROLES.VIEWER), getCaseAudit);
router.get('/:id/export', requireRole(ROLES.VIEWER), exportCase);

module.exports = router;
