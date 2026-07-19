const AuditLogEntry = require('../models/AuditLogEntry');

/**
 * Single choke point for writing audit entries. Controllers should always
 * call this rather than touching the AuditLogEntry model directly, so the
 * "insert-only" contract is easy to verify by code review (grep for
 * `AuditLogEntry.` outside this file — there should be none doing writes).
 *
 * Failures to write an audit entry are logged loudly but do not throw,
 * so a logging hiccup never blocks the underlying user action. In a
 * stricter forensic deployment you may want the opposite tradeoff
 * (fail the request if the audit write fails) — flagged here for that
 * future decision rather than silently baked in.
 */
async function recordAudit({
  actorUserId = null,
  actorUsername = null,
  action,
  targetType,
  targetId = null,
  metadata = {},
  ipAddress = null,
}) {
  try {
    await AuditLogEntry.create({
      actorUserId,
      actorUsername,
      action,
      targetType,
      targetId,
      metadata,
      ipAddress,
      timestamp: new Date(),
    });
  } catch (err) {
    console.error('[audit] Failed to write audit log entry:', err.message, {
      action,
      targetType,
      targetId,
    });
  }
}

module.exports = { recordAudit };
