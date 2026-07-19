/**
 * Parser for generic BSD-style syslog / auth.log lines carrying VPN auth
 * events, e.g. an OpenVPN daemon logging through syslog instead of its own
 * log file, or a PAM-based VPN auth module:
 *
 *   Jul 15 03:22:10 vpnhost openvpn[1234]: user 'jdoe' authentication succeeded from 203.0.113.5
 *   Jul 15 03:25:41 vpnhost openvpn[1234]: user 'jdoe' authentication failed from 198.51.100.9
 *
 * Classic syslog timestamps have no year, so we assume the year the
 * evidence file was uploaded (configurable via options). This is a
 * documented limitation, not silently guessed — it's surfaced in the
 * Evidence record so an analyst can correct it if the log actually spans
 * a year boundary.
 */

const LINE_RE =
  /^(?<ts>\w{3}\s+\d{1,2}\s+\d{2}:\d{2}:\d{2})\s+(?<host>\S+)\s+(?<proc>[\w./-]+)(?:\[\d+\])?:\s+(?<msg>.*)$/;

const AUTH_RE =
  /user\s+'(?<user>[^']+)'\s+authentication\s+(?<result>succeeded|failed)\s+from\s+(?<ip>\d{1,3}(?:\.\d{1,3}){3})/i;

// Fallback pattern for sshd-style lines, common in auth.log alongside VPN entries
const SSHD_RE =
  /(?<result>Accepted|Failed)\s+password\s+for\s+(?:invalid user\s+)?(?<user>\S+)\s+from\s+(?<ip>\d{1,3}(?:\.\d{1,3}){3})/i;

function createParser({ assumedYear = new Date().getFullYear() } = {}) {
  return {
    sourceType: 'syslog_auth',

    processLine(line) {
      const m = LINE_RE.exec(line);
      if (!m) {
        return { matched: false };
      }

      const { ts, msg } = m.groups;
      const timestampUTC = new Date(`${ts} ${assumedYear}`);
      if (Number.isNaN(timestampUTC.getTime())) {
        return { matched: false };
      }

      const authMatch = AUTH_RE.exec(msg) || SSHD_RE.exec(msg);
      if (!authMatch) {
        // Line matched syslog format but isn't an auth event we track
        // (e.g. daemon startup message) — understood, not forensically useful.
        return { matched: true, entry: null };
      }

      const result = authMatch.groups.result.toLowerCase();
      const action = result === 'succeeded' || result === 'accepted' ? 'auth_success' : 'auth_failure';

      return {
        matched: true,
        entry: {
          timestampUTC,
          timestampRaw: ts,
          originalTimezone: null, // syslog default format carries no explicit TZ
          user: authMatch.groups.user,
          sourceIp: authMatch.groups.ip,
          vpnAssignedIp: null,
          action,
          sessionId: null,
          rawLine: line,
        },
      };
    },

    finalize(rawEntries) {
      return rawEntries.filter(Boolean);
    },
  };
}

module.exports = { createParser };
