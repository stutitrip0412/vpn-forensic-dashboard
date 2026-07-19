/**
 * Parser for classic OpenVPN server logs, e.g.:
 *
 *   Tue Jul 15 03:22:10 2026 client1/203.0.113.5:54821 VERIFY OK: depth=0, CN=client1
 *   Tue Jul 15 03:22:11 2026 client1/203.0.113.5:54821 Peer Connection Initiated with [AF_INET]203.0.113.5:54821
 *   Tue Jul 15 03:22:11 2026 client1/203.0.113.5:54821 MULTI: Learn: 10.8.0.6 -> client1/203.0.113.5:54821
 *   Tue Jul 15 03:25:41 2026 client2/198.51.100.9:41102 TLS Error: TLS handshake failed
 *   Tue Jul 15 04:10:02 2026 client1/203.0.113.5:54821 SIGTERM[soft,remote-exit] received, client-instance exiting
 *
 * This is a regex-based, best-effort parser (FR2.1) — real-world OpenVPN
 * deployments vary in verbosity/format. Unmatched lines are quarantined
 * (FR2.3) rather than dropped, and the format is intentionally isolated
 * in this file so it can be extended without touching the pipeline (FR2.4).
 *
 * Two-pass design:
 *  - processLine(): fast per-line regex match, tags each match with a
 *    _type ('connect' | 'disconnect' | 'multi' | 'auth_failure' | 'auth_success')
 *    and a clientKey so related lines can be correlated later.
 *  - finalize(): merges MULTI vpn-ip lines into their preceding connect
 *    event and pairs connect/disconnect events into sessions (FR2.2).
 */

const CLIENT_PREFIX_RE =
  /^(?<ts>\w{3}\s+\w{3}\s+\d{1,2}\s+\d{2}:\d{2}:\d{2}\s+\d{4})\s+(?<client>[^/\s]+)\/(?<ip>\d{1,3}(?:\.\d{1,3}){3}):(?<port>\d+)\s+(?<rest>.*)$/;

const MULTI_LEARN_RE = /MULTI: Learn:\s*(?<vpnip>\d{1,3}(?:\.\d{1,3}){3})/;
const CONNECT_RE = /Peer Connection Initiated/i;
const DISCONNECT_RE = /(SIGTERM|SIGHUP|process exiting|client-instance exiting|Inactivity timeout)/i;
const TLS_FAIL_RE = /(TLS Error|TLS handshake failed|VERIFY ERROR|AUTH-FAIL)/i;
const VERIFY_OK_RE = /VERIFY OK/i;

function parseOpenVpnTimestamp(ts) {
  const d = new Date(ts);
  return Number.isNaN(d.getTime()) ? null : d;
}

function createParser() {
  return {
    sourceType: 'openvpn',

    processLine(line) {
      const m = CLIENT_PREFIX_RE.exec(line);
      if (!m) {
        return { matched: false };
      }

      const { ts, client, ip, rest } = m.groups;
      const timestampUTC = parseOpenVpnTimestamp(ts);
      if (!timestampUTC) {
        return { matched: false };
      }

      const clientKey = `${client}/${ip}`;
      const base = {
        timestampUTC,
        timestampRaw: ts,
        originalTimezone: null, // OpenVPN default log format has no explicit TZ; assumed local/server time
        user: client,
        sourceIp: ip,
        rawLine: line,
        clientKey,
      };

      if (MULTI_LEARN_RE.test(rest)) {
        const vm = MULTI_LEARN_RE.exec(rest);
        return { matched: true, entry: { ...base, _type: 'multi', vpnAssignedIp: vm.groups.vpnip } };
      }
      if (CONNECT_RE.test(rest)) {
        return { matched: true, entry: { ...base, _type: 'connect', action: 'connect' } };
      }
      if (DISCONNECT_RE.test(rest)) {
        return { matched: true, entry: { ...base, _type: 'disconnect', action: 'disconnect' } };
      }
      if (TLS_FAIL_RE.test(rest)) {
        return { matched: true, entry: { ...base, _type: 'auth_failure', action: 'auth_failure' } };
      }
      if (VERIFY_OK_RE.test(rest)) {
        return { matched: true, entry: { ...base, _type: 'auth_success', action: 'auth_success' } };
      }

      // Line matched the client-prefix format but isn't an event type we
      // track (e.g. routine cipher negotiation logs) — not an error, just
      // not forensically interesting. We count it as matched (the parser
      // understood the line) but it produces no LogEntry.
      return { matched: true, entry: null };
    },

    finalize(rawEntries) {
      const openSessions = new Map(); // clientKey -> in-progress connect entry
      const finalEntries = [];

      for (const entry of rawEntries) {
        if (!entry) continue;

        if (entry._type === 'multi') {
          const pending = openSessions.get(entry.clientKey);
          if (pending) {
            pending.vpnAssignedIp = entry.vpnAssignedIp;
          }
          continue; // MULTI lines never become their own LogEntry
        }

        if (entry._type === 'connect') {
          const sessionId = `${entry.clientKey}_${entry.timestampUTC.getTime()}`;
          entry.sessionId = sessionId;
          openSessions.set(entry.clientKey, entry);
          finalEntries.push(entry);
          continue;
        }

        if (entry._type === 'disconnect') {
          const pending = openSessions.get(entry.clientKey);
          if (pending) {
            entry.sessionId = pending.sessionId;
            openSessions.delete(entry.clientKey);
          }
          finalEntries.push(entry);
          continue;
        }

        // auth_success / auth_failure — not session-paired, stand alone
        finalEntries.push(entry);
      }

      return finalEntries.map(({ _type, clientKey, ...rest }) => rest);
    },
  };
}

module.exports = { createParser };
