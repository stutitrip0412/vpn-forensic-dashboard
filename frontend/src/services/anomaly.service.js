import api from "../api/axios";

/**
 * Run anomaly analysis for a case
 * POST /api/cases/:id/analyze
 */
export const analyzeCase = async (caseId) => {
  const response = await api.post(
    `/cases/${caseId}/analyze`
  );

  return response.data;
};

/**
 * Get detected anomalies
 * GET /api/cases/:id/anomalies
 */
export const fetchCaseAnomalies = async (
  caseId,
  filters = {}
) => {
  const response = await api.get(
    `/cases/${caseId}/anomalies`,
    {
      params: filters,
    }
  );

  return response.data.anomalies || [];
};