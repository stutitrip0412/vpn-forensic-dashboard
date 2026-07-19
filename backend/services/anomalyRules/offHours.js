const config = require('../../config/anomalyConfig');

/**
 * FR4.3: Detects connections outside a configurable "normal" time window
 * for a given user/case.
 *
 * Uses UTC hour-of-day, not the log's original local timezone. This is a
 * deliberate, documented simplification: LogEntry stores `originalTimezone`
 * per-entry where the source format provides it (WireGuard does; OpenVPN's
 * default format and classic syslog don't), but a case's "normal hours"
 * are analyst-defined against a single reference frame. Mixing per-entry
 * local time would make the window meaningless when entries carry
 * different offsets. If a case's activity is known to concentrate in a
 * specific timezone, set normalHoursStart/End on the Case adjusted for
 * that offset.
 *
 * Input: a single user's connect/auth_success entries (any order).
 */
function detectOffHours(userEntries, { normalHoursStart, normalHoursEnd } = {}) {
  const start = normalHoursStart ?? config.DEFAULT_NORMAL_HOURS_START;
  const end = normalHoursEnd ?? config.DEFAULT_NORMAL_HOURS_END;

  const anomalies = [];

  for (const entry of userEntries) {
    const hour = entry.timestampUTC.getUTCHours();
    const isOffHours = start <= end ? hour < start || hour >= end : hour < start && hour >= end;

    if (isOffHours) {
      anomalies.push({
        type: 'off_hours_access',
        severity: 'low',
        relatedLogEntryIds: [entry._id],
        description:
          `User "${entry.user}" connected at ${entry.timestampUTC.toISOString()} (${hour}:00 UTC), outside the ` +
          `configured normal access window of ${start}:00-${end}:00 UTC for this case.`,
      });
    }
  }

  return anomalies;
}

module.exports = { detectOffHours };
