/**
 * FR4.4: Detects a new/unseen IP (or ASN, if available) for a previously
 * established user pattern.
 *
 * Input: a single user's entries, sorted ascending by timestampUTC. The
 * user's FIRST entry establishes the baseline — it can't be "new" against
 * nothing, so it's never flagged. Every entry after that whose sourceIp
 * hasn't been seen before for this user gets flagged, then added to the
 * seen set (so returning to a previously-seen IP later doesn't re-flag).
 *
 * ASN is included in the seen-set key when available; geoip-lite doesn't
 * provide ASN in this build (see services/geoEnrichment.js), so in
 * practice this currently keys on IP alone. The shape supports ASN
 * without further changes once an ASN-capable GeoIP source is wired in.
 */
function detectNewIpOrAsn(userEntries) {
  const anomalies = [];
  const seen = new Set();

  userEntries.forEach((entry, index) => {
    if (!entry.sourceIp) return;

    const key = entry.geo && entry.geo.asn ? `${entry.sourceIp}|${entry.geo.asn}` : entry.sourceIp;

    if (index === 0) {
      seen.add(key);
      return; // baseline entry — nothing to compare against yet
    }

    if (!seen.has(key)) {
      anomalies.push({
        type: 'new_ip_or_asn',
        severity: 'medium',
        relatedLogEntryIds: [entry._id],
        description:
          `User "${entry.user}" connected from ${entry.sourceIp}` +
          `${entry.geo && entry.geo.city ? ` (${entry.geo.city}, ${entry.geo.country || ''})` : ''} at ` +
          `${entry.timestampUTC.toISOString()} — an IP not previously seen for this user in this case's evidence.`,
      });
    }

    seen.add(key);
  });

  return anomalies;
}

module.exports = { detectNewIpOrAsn };
