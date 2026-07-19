const { haversineDistanceKm } = require('./haversine');
const config = require('../../config/anomalyConfig');

/**
 * FR4.1: Detects the same user authenticating from two geographically
 * distant locations within a time window too short for real travel.
 *
 * Input: a single user's log entries, already sorted ascending by
 * timestampUTC, each with a `geo` object (may have null lat/long if
 * GeoIP couldn't resolve the IP — those entries are skipped, not
 * treated as "no travel").
 *
 * Only entries with action connect/auth_success are meaningful here —
 * caller is expected to pre-filter, but this function defensively
 * ignores entries without usable geo data either way.
 */
function detectImpossibleTravel(userEntries) {
  const anomalies = [];

  const withGeo = userEntries.filter(
    (e) => e.geo && typeof e.geo.lat === 'number' && typeof e.geo.long === 'number'
  );

  for (let i = 1; i < withGeo.length; i++) {
    const prev = withGeo[i - 1];
    const curr = withGeo[i];

    const distanceKm = haversineDistanceKm(prev.geo.lat, prev.geo.long, curr.geo.lat, curr.geo.long);
    if (distanceKm < config.IMPOSSIBLE_TRAVEL_MIN_DISTANCE_KM) continue;

    const hoursElapsed = (curr.timestampUTC.getTime() - prev.timestampUTC.getTime()) / (1000 * 60 * 60);
    if (hoursElapsed <= 0) continue; // simultaneous/out-of-order timestamps — not a travel-speed question

    const impliedSpeedKmh = distanceKm / hoursElapsed;

    if (impliedSpeedKmh > config.IMPOSSIBLE_TRAVEL_SPEED_KMH) {
      anomalies.push({
        type: 'impossible_travel',
        severity: 'critical',
        relatedLogEntryIds: [prev._id, curr._id],
        description:
          `User "${curr.user}" authenticated from ${prev.geo.city || prev.geo.country || 'an unknown location'} ` +
          `and then from ${curr.geo.city || curr.geo.country || 'an unknown location'} ` +
          `${distanceKm.toFixed(0)} km away only ${hoursElapsed.toFixed(2)} hours later — an implied speed of ` +
          `${impliedSpeedKmh.toFixed(0)} km/h, which is not physically plausible for real travel. ` +
          `GeoIP location is approximate (FR3.3); this should be corroborated before conclusions are drawn.`,
      });
    }
  }

  return anomalies;
}

module.exports = { detectImpossibleTravel };
