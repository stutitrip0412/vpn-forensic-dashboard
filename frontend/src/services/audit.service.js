import api from "../api/axios";

/**
 * Get complete audit timeline for a case
 * GET /api/cases/:id/audit
 */
export const fetchAuditTimeline = async (caseId) => {
  const response = await api.get(`/cases/${caseId}/audit`);
  return response.data.audit || [];
};