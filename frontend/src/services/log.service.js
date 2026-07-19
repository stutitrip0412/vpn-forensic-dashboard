import api from "../api/axios";

/**
 * Get parsed VPN log entries for a case
 */
export const fetchCaseLogs = async (
  caseId,
  params = {}
) => {
  const response = await api.get(
    `/cases/${caseId}/logs`,
    {
      params,
    }
  );

  return response.data;
};