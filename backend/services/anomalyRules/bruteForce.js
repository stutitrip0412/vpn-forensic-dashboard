const config = require('../../config/anomalyConfig');

/**
 * FR4.2: Detects repeated auth failures for a user/IP exceeding a
 * configurable threshold within a configurable time window.
 *
 * Input: ALL auth_failure entries for a case (not pre-grouped), sorted
 * ascending by timestampUTC. Groups by both `user` and `sourceIp`
 * independently, since a brute-force attempt might target one account
 * from many IPs (credential stuffing against a single user) or many
 * accounts from one IP (spray attack) — grouping by only one dimension
 * would miss the other pattern.
 *
 * Uses a sliding window per group: walks failures in order, and whenever
 * a window of BRUTE_FORCE_WINDOW_MINUTES contains >= threshold failures,
 * emits one anomaly covering that window (not one anomaly per failure).
 */
function slidingWindowGroups(failures, keyFn) {
  const grouped = new Map();
  for (const entry of failures) {
    const key = keyFn(entry);
    if (!key) continue;
    if (!grouped.has(key)) grouped.set(key, []);
    grouped.get(key).push(entry);
  }
  return grouped;
}

function findWindowAnomalies(entries, dimensionLabel, keyLabel) {
  const anomalies = [];
  const windowMs = config.BRUTE_FORCE_WINDOW_MINUTES * 60 * 1000;

  let windowStart = 0;
  for (let i = 0; i < entries.length; i++) {
    // Advance windowStart so entries[windowStart..i] all fall within the window ending at entries[i]
    while (entries[i].timestampUTC.getTime() - entries[windowStart].timestampUTC.getTime() > windowMs) {
      windowStart++;
    }

    const countInWindow = i - windowStart + 1;
    if (countInWindow === config.BRUTE_FORCE_THRESHOLD) {
      // Fire exactly once per window crossing the threshold (avoid one
      // anomaly per subsequent failure past the threshold within the
      // same burst — that would flood the anomaly list).
      const windowEntries = entries.slice(windowStart, i + 1);
      const severity =
        countInWindow >= config.BRUTE_FORCE_THRESHOLD * config.BRUTE_FORCE_CRITICAL_MULTIPLIER
          ? 'critical'
          : 'high';

      anomalies.push({
        type: 'brute_force',
        severity,
        relatedLogEntryIds: windowEntries.map((e) => e._id),
        description:
          `${countInWindow} authentication failures for ${dimensionLabel} "${keyLabel}" within ` +
          `${config.BRUTE_FORCE_WINDOW_MINUTES} minutes (${windowEntries[0].timestampUTC.toISOString()} to ` +
          `${windowEntries[windowEntries.length - 1].timestampUTC.toISOString()}), exceeding the configured ` +
          `threshold of ${config.BRUTE_FORCE_THRESHOLD}.`,
      });
    }
  }

  return anomalies;
}

function detectBruteForce(authFailureEntries) {
  const anomalies = [];

  const byUser = slidingWindowGroups(authFailureEntries, (e) => e.user);
  for (const [user, entries] of byUser) {
    anomalies.push(...findWindowAnomalies(entries, 'user', user));
  }

  const byIp = slidingWindowGroups(authFailureEntries, (e) => e.sourceIp);
  for (const [ip, entries] of byIp) {
    anomalies.push(...findWindowAnomalies(entries, 'source IP', ip));
  }

  return anomalies;
}

module.exports = { detectBruteForce };
