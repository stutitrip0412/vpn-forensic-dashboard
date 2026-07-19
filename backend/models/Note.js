const mongoose = require('mongoose');

/**
 * FR5.3: timestamped notes attachable to a case, a specific session, or a
 * specific anomaly. `targetId` is Mixed rather than a strict ObjectId ref
 * because a "session" isn't its own collection — sessionId is a string
 * correlated across LogEntry docs (see parsers), while an anomaly target
 * IS an ObjectId. targetId is null for case-level notes.
 */
const NoteSchema = new mongoose.Schema(
  {
    caseId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Case',
      required: true,
      index: true,
    },
    targetType: {
      type: String,
      enum: ['case', 'session', 'anomaly'],
      required: true,
    },
    targetId: {
      type: mongoose.Schema.Types.Mixed, // string sessionId, ObjectId anomaly id, or null for case-level
      default: null,
    },
    authorId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    body: {
      type: String,
      required: true,
      trim: true,
      maxlength: 5000,
    },
  },
  { timestamps: true }
);

NoteSchema.index({ caseId: 1, targetType: 1, targetId: 1 });

module.exports = mongoose.model('Note', NoteSchema);
