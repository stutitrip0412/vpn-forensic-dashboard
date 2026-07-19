const geoip = require('geoip-lite');
const cache = require('../utils/cache');

const CACHE_TTL_SECONDS = 60 * 60 * 24; // 24h — GeoIP data doesn't change fast enough to need shorter

/**
 * Looks up geolocation for a single IP, cached (FR3.2).
 *
 * geoip-lite's bundled database gives country/region/city/lat-long but
 * NOT ASN — that requires a separate database (e.g. MaxMind GeoLite2-ASN),
 * which isn't bundled here. `asn` is left null rather than faked; FR3.1
 * lists ASN as "if available", and it genuinely isn't with this library.
 * A production deployment wanting ASN would swap this lookup for one
 * that also queries a GeoLite2-ASN mmdb (e.g. via the `maxmind` package).
 *
 * Every result is marked `isApproximate: true` (FR3.3) — GeoIP accuracy
 * varies significantly for mobile/CGNAT IPs, and this tool never presents
 * it as ground truth.
 */
async function lookupIp(ip) {
  if (!ip) {
    return { country: null, region: null, city: null, lat: null, long: null, asn: null, isApproximate: true };
  }

  const cacheKey = `geoip:${ip}`;
  const cached = await cache.get(cacheKey);
  if (cached) return cached;

  const result = geoip.lookup(ip);

  const geo = result
    ? {
        country: result.country || null,
        region: result.region || null,
        city: result.city || null,
        lat: Array.isArray(result.ll) ? result.ll[0] : null,
        long: Array.isArray(result.ll) ? result.ll[1] : null,
        asn: null, // see comment above
        isApproximate: true,
      }
    : { country: null, region: null, city: null, lat: null, long: null, asn: null, isApproximate: true };

  await cache.set(cacheKey, geo, CACHE_TTL_SECONDS);
  return geo;
}

/**
 * Batch version — resolves unique IPs once (cache already dedupes, but
 * this avoids kicking off N redundant lookups+cache round trips when a
 * file has thousands of lines from a handful of source IPs).
 * Returns a Map<ip, geo>.
 */
async function lookupIps(ips) {
  const unique = [...new Set(ips.filter(Boolean))];
  const results = new Map();

  await Promise.all(
    unique.map(async (ip) => {
      results.set(ip, await lookupIp(ip));
    })
  );

  return results;
}

module.exports = { lookupIp, lookupIps };
