# VPN Forensic Log Analyzer — Frontend

React + Vite + Tailwind, talking to the backend built in earlier phases.

## Sub-phase 2: Dashboard, map, charts, and anomaly review

Adds everything FR8.1-FR8.5 asked for, plus one backend addition this
phase needed to do properly:

- **New backend endpoint**: `GET /api/cases/:id/stats`
  (`backend/controllers/statsController.js`) — real MongoDB aggregation
  pipelines (the "Analytics Engine" box in the PRD's architecture
  diagram), not client-side reduction over raw rows. A case can have up
  to 1M log entries (NFR Performance), so charts and the map are built
  from database-computed summaries, not by shipping every row to the
  browser. The map's "clustering for high-volume cases" (FR8.2) happens
  **server-side** here too — points are grouped into ~11km grid cells by
  the aggregation itself, so the browser never receives more points than
  there are grid cells with activity, however many raw entries exist
  underneath.
- **Backend tweak**: `GET /api/cases/:id/logs` now accepts a
  comma-separated `action` list (e.g. `connect,disconnect`), needed so
  the session timeline can pull both event types in one request.
- **Session timeline** (FR8.1): `components/dashboard/SessionTimeline.jsx`
  — pairs connect/disconnect events sharing a `sessionId` into rows with
  a computed duration; entries without a pair (open sessions, or formats
  like WireGuard/syslog that don't produce a `sessionId` at all — see
  backend parser comments) show as standalone events.
- **Geographic map** (FR8.2): `components/dashboard/GeoMap.jsx` — React
  Leaflet, circle markers sized by the server-clustered count. Uses
  plain `CircleMarker`s instead of Leaflet's default pin icon
  specifically to sidestep the well-known bundler asset-path breakage
  with Leaflet's default marker images — no icon files to configure.
- **Summary charts** (FR8.3): `components/dashboard/SummaryCharts.jsx`
  — Recharts: connections over time, top users, top source countries,
  anomaly counts by type, events by action type. All fed by the new
  `/stats` endpoint.
- **Filterable log table** (FR8.4): `components/dashboard/LogEntryTable.jsx`
  — user/IP/action/date-range filters, server-side pagination.
- **Anomaly review panel** (FR8.5 + FR4.6): `components/anomaly/AnomalyPanel.jsx`
  — lists flagged anomalies with severity/status, a "run detection" button
  for analyst+, and inline status/note editing.

### Verified before handoff

Same verification approach as sub-phase 1: every file transpiled with
esbuild, every relative import checked against real files on disk, every
named/default import cross-checked against its target file's actual
exports — all clean after this phase's additions. I still can't spin up
a browser + live MongoDB in this environment, so click-through behavior
(does the map actually render tiles, does Recharts lay out correctly
with real data) has **not** been visually verified — only that nothing
will crash on missing modules or undefined imports the moment you run it.

## Setup

```bash
cd frontend
npm install
cp .env.example .env
npm run dev
```

Requires the backend running (see `backend/README.md`), with the
`/stats` endpoint from this phase available.

## Design direction (carried over from sub-phase 1)

"Case-file / evidence-room" identity — charcoal surfaces, steel-blue
signal color, muted severity colors, IBM Plex Mono for data. The
signature element is the **custody seal**
(`components/common/CustodySeal.jsx`) — a radial badge procedurally
generated from each evidence file's actual SHA-256 hash, colored by
verification status. Chart/map colors were pulled from the same token
set rather than Recharts/Leaflet defaults, so the dashboard doesn't look
like a bolted-on library demo.

## What's not here yet

- Session/anomaly-scoped notes UI (API support exists; only case-level
  notes have a page).
- Chain-of-custody report view (`GET /api/cases/:id/audit`,
  `GET /api/evidence/:id/custody` — wired up in the API client, no page).
- Case export buttons in the UI (`downloadCaseExport` exists in
  `api/cases.js`, not yet wired to a button anywhere).

Those three are what's left to reach full PRD parity on the frontend.

