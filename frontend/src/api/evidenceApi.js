import api from "./axios";

/**
 * Get all evidence for a case
 */
export const getEvidence = (caseId) => {
  return api.get(`/cases/${caseId}/evidence`);
};

/**
 * Get single evidence details
 */
export const getEvidenceById = (id) => {
  return api.get(`/evidence/${id}`);
};

/**
 * Verify SHA-256 hash
 */
export const verifyEvidence = (id) => {
  return api.get(`/evidence/${id}/verify`);
};

/**
 * Download original evidence
 */
export const downloadEvidence = (id) => {
  return api.get(`/evidence/${id}/download`, {
    responseType: "blob",
  });
};

/**
 * Chain of Custody
 */
export const getEvidenceCustody = (id) => {
  return api.get(`/evidence/${id}/custody`);
};