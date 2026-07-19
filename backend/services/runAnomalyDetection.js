const LogEntry = require('../models/LogEntry');
const Anomaly = require('../models/Anomaly');
const Case = require('../models/Case');
const { detectImpossibleTravel } = require('./anomalyRules/impossibleTravel');
const { detectBruteForce } = require('./anomalyRules/bruteForce');
const { detectOffHours } = require('./anomalyRules/offHours');
const { detectNewIpOrAsn } = require('./anomalyRules/newIpOrAsn');

/**
 * Runs all four anomaly rules (FR4.1-FR4.4) across every parsed LogEntry
 * in a case, and persists the results as Anomaly documents.
 *
 * Re-run behavior: this is meant to be safely re-runnable (e.g. after
 * uploading more evidence to the same case). It deletes previously
 * generated anomalies that are still in their default 'open' state and
 * replaces them with a fresh computation, but deliberately leaves alone
 * any anomaly an analyst has already triaged (status reviewed /
 * false_positive / confirmed) — a re-run must never silently erase an
 * analyst's prior judgment call (FR4.6).
 *
 * Each emitted anomaly always references the specific LogEntry ids that
 * justify it (FR4.5 — never a black-box score).
 */
async function runAnomalyDetection(caseId) {
  const foundCase = await Case.findById(caseId);
  if (!foundCase) {
    throw new Error(`Case ${caseId} not found.`);
  }

  // Only connect/auth_success entries are meaningful for travel/off-hours/
  // new-IP checks; auth_failure entries feed brute-force separately.
  const successEntries = await LogEntry.find({
    caseId,
    action: { $in: ['connect', 'auth_success'] },
  }).sort({ user: 1, timestampUTC: 1 });

  const failureEntries = await LogEntry.find({
    caseId,
    action: 'auth_failure',
  }).sort({ timestampUTC: 1 });

  // Group success entries by user for the per-user rules.
  const byUser = new Map();
  for (const entry of successEntries) {
    const key = entry.user || '(unknown user)';
    if (!byUser.has(key)) byUser.set(key, []);
    byUser.get(key).push(entry);
  }

  const computed = [];

  for (const [, entries] of byUser) {
    computed.push(...detectImpossibleTravel(entries));
    computed.push(
      ...detectOffHours(entries, {
        normalHoursStart: foundCase.normalHoursStart,
        normalHoursEnd: foundCase.normalHoursEnd,
      })
    );
    computed.push(...detectNewIpOrAsn(entries));
  }

  computed.push(...detectBruteForce(failureEntries));

  // Preserve analyst-triaged anomalies; only clear out the previous
  // 'open' (untouched) batch before inserting the fresh computation.
  await Anomaly.deleteMany({ caseId, status: 'open' });

  const docs = computed.map((a) => ({
    caseId,
    type: a.type,
    severity: a.severity,
    relatedLogEntryIds: a.relatedLogEntryIds,
    description: a.description,
    status: 'open',
  }));

  if (docs.length > 0) {
    await Anomaly.insertMany(docs, { ordered: false });
  }

  const summary = docs.reduce((acc, d) => {
    acc[d.type] = (acc[d.type] || 0) + 1;
    return acc;
  }, {});

  return { anomaliesCreated: docs.length, byType: summary };
}

module.exports = { runAnomalyDetection };
