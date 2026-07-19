/**
 * Central place for enums/constants used across the app so route,
 * middleware, and model files never hardcode role strings separately.
 */

const ROLES = Object.freeze({
  ADMIN: 'admin',
  LEAD_INVESTIGATOR: 'lead_investigator',
  ANALYST: 'analyst',
  VIEWER: 'viewer',
});

const ROLE_HIERARCHY = Object.freeze({
  [ROLES.ADMIN]: 4,
  [ROLES.LEAD_INVESTIGATOR]: 3,
  [ROLES.ANALYST]: 2,
  [ROLES.VIEWER]: 1,
});

const AUDIT_ACTIONS = Object.freeze({
  LOGIN_SUCCESS: 'login_success',
  LOGIN_FAILURE: 'login_failure',
  LOGOUT: 'logout',
  USER_CREATED: 'user_created',
  USER_DEACTIVATED: 'user_deactivated',
  CASE_CREATED: 'case_created',
  CASE_UPDATED: 'case_updated',
  EVIDENCE_UPLOADED: 'evidence_uploaded',
  EVIDENCE_DOWNLOADED: 'evidence_downloaded',
  EVIDENCE_VIEWED: 'evidence_viewed',
  EVIDENCE_VERIFIED: 'evidence_verified',
  EVIDENCE_HASH_MISMATCH: 'evidence_hash_mismatch',
  CASE_EXPORTED: 'case_exported',
  ANOMALY_UPDATED: 'anomaly_updated',
  NOTE_CREATED: 'note_created',
});

module.exports = { ROLES, ROLE_HIERARCHY, AUDIT_ACTIONS };
