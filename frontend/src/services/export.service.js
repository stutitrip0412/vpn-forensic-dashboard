import api from "../api/axios";

/**
 * Download Case PDF Report
 * GET /api/cases/:id/export?format=pdf
 */
export const exportCasePdf = async (caseId) => {
  const response = await api.get(
    `/cases/${caseId}/export?format=pdf`,
    {
      responseType: "blob",
    }
  );

  return response.data;
};

/**
 * Download Case CSV Timeline
 * GET /api/cases/:id/export?format=csv
 */
export const exportCaseCsv = async (caseId) => {
  const response = await api.get(
    `/cases/${caseId}/export?format=csv`,
    {
      responseType: "blob",
    }
  );

  return response.data;
};