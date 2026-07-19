import api from "../api/axios";

/**
 * Get all evidence for a case
 * GET /api/cases/:caseId/evidence
 */
export const fetchEvidence = async (caseId) => {
  const response = await api.get(`/cases/${caseId}/evidence`);
  return response.data.evidence;
};

/**
 * Get evidence metadata
 * GET /api/evidence/:id
 */
export const getEvidence = async (evidenceId) => {
  const response = await api.get(`/evidence/${evidenceId}`);
  return response.data.evidence;
};

/**
 * Verify SHA-256 integrity
 * GET /api/evidence/:id/verify
 */
export const verifyEvidence = async (evidenceId) => {
  const response = await api.get(`/evidence/${evidenceId}/verify`);
  return response.data;
};

/**
 * Download evidence file
 * GET /api/evidence/:id/download
 */
export const downloadEvidence = async (evidenceId) => {
  const response = await api.get(
    `/evidence/${evidenceId}/download`,
    {
      responseType: "blob",
    }
  );

  return response;
};

/**
 * Get chain of custody
 * GET /api/evidence/:id/custody
 */
export const getEvidenceCustody = async (evidenceId) => {
  const response = await api.get(
    `/evidence/${evidenceId}/custody`
  );

  return response.data;
};