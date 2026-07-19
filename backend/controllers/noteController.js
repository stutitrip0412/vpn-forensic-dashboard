const { body, validationResult } = require('express-validator');
const Note = require('../models/Note');
const { recordAudit } = require('../utils/auditLogger');
const { AUDIT_ACTIONS } = require('../config/constants');

const createNoteValidators = [
  body('targetType').isIn(['case', 'session', 'anomaly']),
  body('targetId').optional({ nullable: true }),
  body('body').trim().isLength({ min: 1, max: 5000 }),
];

/**
 * POST /api/cases/:id/notes (FR5.3)
 * targetType 'case' should omit targetId (or send null); 'session' expects
 * a sessionId string; 'anomaly' expects an Anomaly _id.
 */
async function createNote(req, res) {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { targetType, targetId = null, body: noteBody } = req.body;

  const note = await Note.create({
    caseId: req.params.id,
    targetType,
    targetId: targetType === 'case' ? null : targetId,
    authorId: req.user._id,
    body: noteBody,
  });

  await recordAudit({
    actorUserId: req.user._id,
    actorUsername: req.user.username,
    action: AUDIT_ACTIONS.NOTE_CREATED,
    targetType: 'Case',
    targetId: req.params.id,
    ipAddress: req.ip,
    metadata: { noteId: note._id, noteTargetType: targetType, noteTargetId: targetId },
  });

  res.status(201).json({ note });
}

/**
 * GET /api/cases/:id/notes
 * Optional ?targetType=&targetId= filters to scope to one session/anomaly.
 */
async function listNotesForCase(req, res) {
  const { targetType, targetId } = req.query;
  const filter = { caseId: req.params.id };
  if (targetType) filter.targetType = targetType;
  if (targetId) filter.targetId = targetId;

  const notes = await Note.find(filter).sort({ createdAt: -1 }).populate('authorId', 'username');
  res.json({ notes });
}

module.exports = { createNote, listNotesForCase, createNoteValidators };
