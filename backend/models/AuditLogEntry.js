const mongoose = require('mongoose');
const { AUDIT_ACTIONS } = require('../config/constants');

/**
 * Append-only audit trail (FR6.1, FR6.3).
 *
 * Enforcement is two-layered:
 *  1. Application layer: no route/controller in this codebase ever calls
 *     updateOne/deleteOne/findByIdAndUpdate/etc. on this model. Only
 *     `create()` is used, via the auditLogger util.
 *  2. Infrastructure layer (do this in production, not covered by app code):
 *     create a dedicated MongoDB DB user for this app whose role grants
 *     `insert` and `find` on the auditlogentries collection but NOT
 *     `update` or `remove`, so a compromised app server still can't
 *     rewrite history. See README "Hardening" section.
 */
const AuditLogEntrySchema = new mongoose.Schema(
  {
    actorUserId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      default: null, // null for pre-auth events like failed logins with unknown username
    },
    actorUsername: {
      type: String,
      default: null,
    },
    action: {
      type: String,
      enum: Object.values(AUDIT_ACTIONS),
      required: true,
    },
    targetType: {
      type: String,
      enum: ['User', 'Case', 'Evidence', 'LogEntry', 'Anomaly', 'Auth'],
      required: true,
    },
    targetId: {
      type: mongoose.Schema.Types.ObjectId,
      default: null,
    },
    metadata: {
      type: mongoose.Schema.Types.Mixed,
      default: {},
    },
    ipAddress: {
      type: String,
      default: null,
    },
    timestamp: {
      type: Date,
      default: Date.now,
      immutable: true,
    },
  },
  { timestamps: false } // we manage `timestamp` explicitly; no updatedAt on an append-only log
);

AuditLogEntrySchema.index({ targetType: 1, targetId: 1, timestamp: -1 });
AuditLogEntrySchema.index({ actorUserId: 1, timestamp: -1 });

module.exports = mongoose.model('AuditLogEntry', AuditLogEntrySchema);
