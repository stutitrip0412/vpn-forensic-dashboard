const Case = require('../models/Case');
const { buildCaseSummaryPdf, buildCaseLogsCsv } = require('../services/exportService');
const { recordAudit } = require('../utils/auditLogger');
const { AUDIT_ACTIONS } = require('../config/constants');

/**
 * GET /api/cases/:id/export?format=pdf|csv (FR5.4)
 * See services/exportService.js header comment for why PDF and CSV carry
 * different content rather than the same data in two containers.
 * Every export is audit-logged (FR6.1) regardless of format.
 */
async function exportCase(req, res) {
  const format = (req.query.format || 'pdf').toLowerCase();
  if (!['pdf', 'csv'].includes(format)) {
    return res.status(400).json({ error: 'format must be "pdf" or "csv".' });
  }

  const foundCase = await Case.findById(req.params.id);
  if (!foundCase) {
    return res.status(404).json({ error: 'Case not found.' });
  }

  await recordAudit({
    actorUserId: req.user._id,
    actorUsername: req.user.username,
    action: AUDIT_ACTIONS.CASE_EXPORTED,
    targetType: 'Case',
    targetId: foundCase._id,
    ipAddress: req.ip,
    metadata: { format },
  });

  if (format === 'csv') {
    const csv = await buildCaseLogsCsv(foundCase._id);
    res.setHeader('Content-Type', 'text/csv');
    res.setHeader('Content-Disposition', `attachment; filename="case-${foundCase._id}-timeline.csv"`);
    return res.send(csv);
  }

  res.setHeader('Content-Type', 'application/pdf');
  res.setHeader('Content-Disposition', `attachment; filename="case-${foundCase._id}-summary.pdf"`);
  return buildCaseSummaryPdf(foundCase._id, res).catch((err) => {
    console.error('[export] PDF generation failed:', err.message);
    if (!res.headersSent) {
      res.status(500).json({ error: 'Failed to generate PDF export.' });
    } else {
      res.end();
    }
  });
}

module.exports = { exportCase };
