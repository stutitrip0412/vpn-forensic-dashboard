/**
 * Parser for WireGuard activity as exported from the systemd journal, e.g.:
 *
 *   2026-07-15T03:22:10+0000 vpn-host wireguard: [wg0] peer (AbC123dEfG...=) - New handshake, endpoint 203.0.113.5:51820
 *   2026-07-15T04:10:44+0000 vpn-host wireguard: [wg0] peer (AbC123dEfG...=) - Handshake did not complete after 5 seconds
 *
 * WireGuard is connectionless (UDP + periodic handshakes) — there's no
 * "disconnect" event the way OpenVPN has SIGTERM. A completed handshake
 * is treated as a `connect` action; a failed one as `auth_failure`.
 * There's also no username concept — the peer's public key is used as the
 * `user` field, since that's the only stable per-client identifier WireGuard
 * logs expose (FR2.2 "username/client ID").
 */

const LINE_RE =
  /^(?<ts>\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(?:[+-]\d{4}|Z))\s+\S+\s+wireguard(?:\[\d+\])?:\s+\[(?<iface>\S+)\]\s+peer\s+\((?<peer>[^)]+)\)\s+-\s+(?<msg>.*)$/;

const ENDPOINT_RE = /endpoint\s+(?<ip>\d{1,3}(?:\.\d{1,3}){3}):(?<port>\d+)/;
const HANDSHAKE_OK_RE = /handshake/i;
const HANDSHAKE_FAIL_RE = /did not complete|handshake did not complete/i;

function createParser() {
  return {
    sourceType: 'wireguard',

    processLine(line) {
      const m = LINE_RE.exec(line);
      if (!m) {
        return { matched: false };
      }

      const { ts, peer, msg } = m.groups;
      const timestampUTC = new Date(ts);
      if (Number.isNaN(timestampUTC.getTime())) {
        return { matched: false };
      }

      const em = ENDPOINT_RE.exec(msg);
      const sourceIp = em ? em.groups.ip : null;

      let action = 'other';
      if (HANDSHAKE_FAIL_RE.test(msg)) {
        action = 'auth_failure';
      } else if (HANDSHAKE_OK_RE.test(msg)) {
        action = 'auth_success';
      }

      return {
        matched: true,
        entry: {
          timestampUTC,
          timestampRaw: ts,
          originalTimezone: ts.slice(-5), // e.g. "+0000"
          user: peer.slice(0, 16), // truncated pubkey as client identifier
          sourceIp,
          vpnAssignedIp: null, // not exposed in this log format
          action,
          sessionId: null, // WireGuard has no discrete session concept in this format
          rawLine: line,
        },
      };
    },

    // No cross-line correlation needed for WireGuard in this format.
    finalize(rawEntries) {
      return rawEntries.filter(Boolean);
    },
  };
}

module.exports = { createParser };
