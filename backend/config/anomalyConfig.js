/**
 * Detection thresholds — deliberately centralized and env-overridable
 * rather than hardcoded inside each rule, since FR4.2/FR4.3 explicitly
 * call these out as "configurable" and different cases/deployments will
 * want different sensitivity.
 */

module.exports = {
  // Impossible travel: implied speed (km/h) above which travel between
  // two auth locations is physically implausible. ~900 km/h is roughly
  // commercial jet cruising speed; anything faster than that between two
  // consecutive logins is treated as a strong signal, not a subtle one.
  IMPOSSIBLE_TRAVEL_SPEED_KMH: Number(process.env.ANOMALY_IMPOSSIBLE_TRAVEL_KMH) || 900,

  // Ignore location changes over very short distances entirely (avoids
  // flagging GeoIP jitter between two nearby CGNAT exit points as "travel").
  IMPOSSIBLE_TRAVEL_MIN_DISTANCE_KM: Number(process.env.ANOMALY_MIN_DISTANCE_KM) || 80,

  // Brute force: N+ auth failures for the same user OR same source IP
  // within the given sliding window counts as brute force.
  BRUTE_FORCE_THRESHOLD: Number(process.env.ANOMALY_BRUTEFORCE_THRESHOLD) || 5,
  BRUTE_FORCE_WINDOW_MINUTES: Number(process.env.ANOMALY_BRUTEFORCE_WINDOW_MINUTES) || 10,
  BRUTE_FORCE_CRITICAL_MULTIPLIER: 2, // 2x threshold within the window bumps severity to critical

  // Off-hours: default normal-activity window if a case doesn't override
  // it (Case.normalHoursStart/normalHoursEnd). Expressed in UTC hours —
  // see the off-hours rule module for why local time isn't used.
  DEFAULT_NORMAL_HOURS_START: Number(process.env.ANOMALY_DEFAULT_HOURS_START) || 7,
  DEFAULT_NORMAL_HOURS_END: Number(process.env.ANOMALY_DEFAULT_HOURS_END) || 19,
};
