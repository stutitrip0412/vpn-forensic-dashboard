# VPN Forensic Log Analyzer — Backend (Phase 1: Foundation)

This phase delivers the backend skeleton: Express app, MongoDB/Mongoose models
for every entity in the PRD's data model, JWT authentication, and role-based
access control (RBAC). Upload/parsing/GeoIP/anomaly detection routes are
stubbed out (commented in `app.js`) and land in Phase 2+.

## What's included

- **Models**: `User`, `Case`, `Evidence`, `LogEntry`, `Anomaly`, `AuditLogEntry`
  — matching PRD section 8 field-for-field, plus a couple of practical
  additions (e.g. `parseStatus`, `lastVerificationResult`) that later phases
  will populate.
- **Auth**: `POST /api/auth/login`, `POST /api/auth/logout`, `GET /api/auth/me`.
  Passwords hashed with bcrypt (cost factor 12). JWT issued on login,
  required on every protected route via `middleware/auth.js`.
- **RBAC**: `middleware/rbac.js` implements a role hierarchy
  (`admin > lead_investigator > analyst > viewer`) so `requireRole('analyst')`
  also allows higher roles. Every route enforces this server-side (FR7.3) —
  there is no frontend-only gate anywhere in this codebase.
- **User management**: Admin-only `POST /api/users` (create),
  `GET /api/users` (list), `PATCH /api/users/:id/deactivate`. There is
  intentionally no public signup route — accounts are admin-provisioned.
- **Audit trail foundation**: `AuditLogEntry` model + `utils/auditLogger.js`
  as the single write path. Login success/failure, logout, and user creation
  are already wired up. Evidence/case audit events land in Phase 2-3.
- **Security middleware**: Helmet, CORS (env-configured origin allowlist),
  rate limiting on `/api/auth/login`, input validation via express-validator.

## Setup

```bash
cd backend
npm install
cp .env.example .env
# edit .env — set a real JWT_SECRET, MONGO_URI, and SEED_ADMIN_PASSWORD

# requires a running MongoDB instance (local or Atlas) matching MONGO_URI
npm run seed:admin   # creates the first admin account
npm run dev           # starts on http://localhost:5000 (nodemon)
```

Health check: `GET http://localhost:5000/api/health`

## Trying it out

```bash
# Log in as the seeded admin
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"username":"admin","password":"<your SEED_ADMIN_PASSWORD>"}'

# Use the returned token to create an analyst account
curl -X POST http://localhost:5000/api/users \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <token>" \
  -d '{"username":"jdoe","password":"SomeStrongPass123","role":"analyst"}'
```

## Hardening notes (production, not enforced by this code)

- **Append-only audit log**: `AuditLogEntry` is only ever written via
  `create()` in this codebase — no update/delete path exists in the app
  layer. For real evidentiary use, also create a dedicated MongoDB user
  whose role grants `insert`/`find` but not `update`/`remove` on the
  `auditlogentries` collection, so a compromised app server still can't
  rewrite history (FR6.3).
- **JWT revocation**: JWTs are stateless; logout is audit-logged but the
  token remains valid until expiry. Add a server-side blocklist (e.g. Redis)
  if you need immediate revocation.
- Rotate `JWT_SECRET` and `SEED_ADMIN_PASSWORD` before any real deployment.

## Phase 2: Case management, evidence upload, and the parsing engine

Added on top of Phase 1:

- **Case CRUD**: `POST /api/cases` (analyst+), `GET /api/cases`,
  `GET /api/cases/:id` (any authenticated role — matches the Case
  Supervisor persona), `PATCH /api/cases/:id` (lead_investigator+, for
  rename/status/legalHold/retention), `POST /api/cases/:id/assign`.
- **Evidence upload**: `POST /api/cases/:caseId/evidence` — Multer saves
  the raw file to `uploads/<caseId>/` under a randomized filename (never
  trusting the original filename), immediately computes a streaming
  SHA-256 hash (FR1.3), then kicks off parsing against a **transient
  working copy** — the original on disk is never touched by the parser
  (FR1.4).
- **Pluggable parsers** (`services/parsers/`): `openvpnParser.js`,
  `wireguardParser.js`, `syslogParser.js`, all sharing the same
  `{ sourceType, processLine, finalize }` shape (FR2.4). A registry in
  `parsers/index.js` also auto-detects format by sampling lines against
  every parser and picking the best match rate, if `sourceType` isn't
  specified on upload.
  - OpenVPN parser correlates `Peer Connection Initiated` /
    `SIGTERM...exiting` pairs into sessions and folds `MULTI: Learn:`
    lines into the matching connect event's `vpnAssignedIp`.
  - WireGuard parser treats completed/failed handshakes as
    `auth_success`/`auth_failure` (WireGuard is connectionless — there's
    no disconnect event to pair against).
  - Syslog/auth.log parser handles both `user 'x' authentication
    succeeded/failed` and sshd-style `Accepted/Failed password for`
    lines; assumes the upload year since classic syslog timestamps omit it.
- **Quarantine + coverage** (FR2.3): unparseable lines are counted, not
  dropped or silently ignored; `Evidence.parseCoverage` and
  `quarantinedLineCount` are set after each parse job. A single bad line
  can't crash the whole ingestion (NFR Reliability) — it's caught and
  counted per-line.
- **Hash verification** (FR6.2): `GET /api/evidence/:id/verify` re-hashes
  the file on disk and compares against the hash recorded at upload.
  `GET /api/evidence/:id/download` does the same check before serving and
  flags a mismatch via response headers rather than blocking the download
  outright (an investigator may still need the file).
- **Filterable log query** (FR8.4): `GET /api/cases/:id/logs` supports
  `user`, `sourceIp`, `action`, `from`/`to` date range, and pagination.
- **Audit coverage extended**: case create/update, evidence upload/view/
  download/verify (and hash-mismatch as a distinct event) are all now
  logged through the same append-only `auditLogger`.

### Verified against sample data

All three parsers were run against representative sample logs
(connect/disconnect pairs, auth failures, garbage lines mixed in) —
format auto-detection correctly identified each file, session
correlation and VPN-IP merging worked as intended for OpenVPN, and
unparseable lines were correctly quarantined rather than silently
dropped or crashing the job.

### Setup additions

```bash
# .env additions for Phase 2
UPLOAD_ROOT=./uploads       # where evidence files are stored
MAX_UPLOAD_MB=100           # matches FR1.1's configurable size limit
```

```bash
# Try an upload (after logging in and creating a case)
curl -X POST http://localhost:5000/api/cases \
  -H "Authorization: Bearer <token>" -H "Content-Type: application/json" \
  -d '{"name":"Case 2026-0001"}'

curl -X POST http://localhost:5000/api/cases/<caseId>/evidence \
  -H "Authorization: Bearer <token>" \
  -F "file=@/path/to/sample_openvpn.log"

curl http://localhost:5000/api/cases/<caseId>/logs \
  -H "Authorization: Bearer <token>"
```

### Known simplifications (flagged, not hidden)

- Parsing runs **inline** on the request (awaited before responding),
  not on a background job queue. The NFR calls for a queueable pipeline
  so large files don't block the API thread — `parseEvidenceFile()`
  already takes just an `evidenceId`, so swapping it behind a Bull/Redis
  worker later is a small, isolated change, not a rewrite.
- Regex-based parsers cover the log shapes described in the PRD's
  examples; real-world VPN log formats vary by vendor/version and will
  likely need additional patterns added to each parser file over time —
  that's exactly what FR2.4's pluggable design is for.

## Phase 3: GeoIP enrichment and anomaly detection

- **GeoIP enrichment** (`services/geoEnrichment.js`, FR3.1): every parsed
  entry's `sourceIp` is resolved via `geoip-lite` (country/region/city/
  lat-long) during parsing, batched by unique IP and cached (24h TTL) to
  avoid redundant lookups (FR3.2). **ASN is not populated** — geoip-lite's
  bundled database doesn't include it; that needs a separate MaxMind
  GeoLite2-ASN database, noted as a follow-up rather than faked. Every
  result carries `geo.isApproximate: true` (FR3.3).
- **Cache** (`utils/cache.js`): in-memory TTL cache with the same
  `get`/`set` shape a Redis-backed cache would have, so swapping in
  `ioredis` later (per the PRD's "Optional: Redis" line) means changing
  one file, not every caller. Not multi-process-safe as-is — that's the
  gap Redis would close.
- **Anomaly detection engine** (`services/runAnomalyDetection.js` +
  `services/anomalyRules/`): four independently-testable rule modules,
  each taking log entries and returning anomaly objects that always cite
  the specific `relatedLogEntryIds` behind the flag (FR4.5 — never a
  black-box score):
  - `impossibleTravel.js` — haversine distance between consecutive
    authenticated locations for a user vs. elapsed time; flags implied
    speeds over a configurable threshold (default 900 km/h).
  - `bruteForce.js` — sliding-window count of auth failures, grouped
    independently by user AND by source IP (catches both credential
    stuffing against one account and spray attacks from one IP).
  - `offHours.js` — connections outside a configurable UTC hour window,
    default 07:00-19:00, overridable per-case via
    `Case.normalHoursStart/normalHoursEnd`.
  - `newIpOrAsn.js` — flags a user's first appearance from an IP not
    seen earlier in that user's timeline within the case (their very
    first-ever entry establishes the baseline and is never flagged).
  - All thresholds live in `config/anomalyConfig.js`, env-overridable.
- **Endpoints**: `POST /api/cases/:id/analyze` (analyst+, runs/re-runs
  detection across the whole case), `GET /api/cases/:id/anomalies`
  (filterable by status/severity/type), `PATCH /api/anomalies/:id`
  (FR4.6 — mark reviewed/false_positive/confirmed with a note).
- **Re-run safety**: re-running analysis clears only anomalies still in
  the default `open` state and regenerates them — anything an analyst
  has already triaged is left untouched, so re-analyzing after a new
  evidence upload can't silently erase prior review decisions.

### Verified against synthetic data

Ran all four rules directly against hand-built fixtures: a same-user
authentication from New York then London an hour later (correctly
flagged as impossible travel, ~5,571 km/h implied speed); six auth
failures for one user/IP within five minutes (correctly flagged as
brute force, both by-user and by-IP grouping fired); a 3am UTC connect
against the default 07:00-19:00 window (correctly flagged off-hours);
and a user's third connection from a never-before-seen IP after two
from a known IP (correctly flagged, baseline entry correctly excluded).

### Setup additions

```bash
# .env additions for Phase 3 (all optional — sensible defaults apply)
ANOMALY_IMPOSSIBLE_TRAVEL_KMH=900
ANOMALY_MIN_DISTANCE_KM=80
ANOMALY_BRUTEFORCE_THRESHOLD=5
ANOMALY_BRUTEFORCE_WINDOW_MINUTES=10
ANOMALY_DEFAULT_HOURS_START=7
ANOMALY_DEFAULT_HOURS_END=19
```

```bash
curl -X POST http://localhost:5000/api/cases/<caseId>/analyze \
  -H "Authorization: Bearer <token>"

curl http://localhost:5000/api/cases/<caseId>/anomalies?severity=critical \
  -H "Authorization: Bearer <token>"
```

## Phase 4: Chain of custody, case notes, and export

- **Case notes** (`models/Note.js`, FR5.3): notes attachable to a case,
  a specific session (`sessionId` string), or a specific anomaly
  (Anomaly `_id`). `POST /api/cases/:id/notes`, `GET /api/cases/:id/notes`
  (optionally filtered by `targetType`/`targetId`).
- **Case-level audit trail** (`GET /api/cases/:id/audit`, FR6.1): a
  case's chain-of-custody trail isn't stored as its own thing — it's
  assembled on read by pulling every `AuditLogEntry` that targets the
  case itself, or any evidence/anomaly belonging to it. Keeps
  `AuditLogEntry` a single flat append-only collection, which is simpler
  to lock down at the DB permission level (FR6.3) than per-case
  sub-collections would be.
- **Evidence custody report** (`GET /api/evidence/:id/custody`, FR6.4):
  full chronological history for one piece of evidence — every upload,
  view, download, and verify event — plus its current hash-verification
  status. This is the artifact that demonstrates a file hasn't been
  tampered with since ingestion.
- **Case export** (`GET /api/cases/:id/export?format=pdf|csv`, FR5.4):
  PDF and CSV deliberately carry *different* content rather than the
  same data in two containers:
  - **PDF** (`services/exportService.js`, via `pdfkit`): a narrative
    report — case details, evidence list with hashes, a timeline
    *summary* (counts by action type + first/last timestamp — not every
    row; a case can have up to 1M entries per the NFR, which doesn't
    belong in a printed report), flagged anomalies, analyst notes, and a
    disclaimer that GeoIP data is approximate and findings need analyst
    review before evidentiary use.
  - **CSV**: the full flat timeline of parsed log entries, one row per
    event — the artifact meant for further analysis in a spreadsheet.
  Every export is audit-logged regardless of format.

### Honesty note on testing this phase

The CSV serializer (`utils/csv.js`) was run directly and correctly
escapes commas, embedded newlines, and quotes. The PDF generation
(`services/exportService.js`) was **not** runtime-tested — `pdfkit`
isn't installed in this build environment and there's no network access
here to `npm install` it — so I can't confirm the rendered PDF looks
right beyond reviewing the code against pdfkit's documented chainable
API. Run `npm install && node -e "require('./services/exportService')"`
locally, then hit `/api/cases/:id/export?format=pdf` against a real
case, as your first check after pulling this phase in.

### Setup additions

No new environment variables this phase. Just run `npm install` to pick
up `pdfkit`.

```bash
curl "http://localhost:5000/api/cases/<caseId>/export?format=pdf" \
  -H "Authorization: Bearer <token>" -o case-summary.pdf

curl "http://localhost:5000/api/cases/<caseId>/export?format=csv" \
  -H "Authorization: Bearer <token>" -o case-timeline.csv

curl http://localhost:5000/api/evidence/<evidenceId>/custody \
  -H "Authorization: Bearer <token>"
```

## What's left vs. the PRD

At this point every functional requirement (FR1-FR8) and the illustrative
API table have a backend implementation, with two flagged exceptions:
- The parsing pipeline runs inline rather than on a background job queue
  (NFR Scalability) — noted in Phase 2, still true.
- ASN enrichment isn't populated (needs a separate MaxMind database) —
  noted in Phase 3, still true.

Not yet built: the React frontend (dashboard, map, charts, upload UI) —
this backend has been the whole focus so far. Say the word when you want
to move on to that.
