import client from './client';

export function listAnomaliesForCase(caseId, params = {}) {
  return client.get(`/cases/${caseId}/anomalies`, { params }).then((res) => res.data.anomalies);
}

export function runAnalysis(caseId) {
  return client.post(`/cases/${caseId}/analyze`).then((res) => res.data);
}

export function updateAnomaly(id, payload) {
  return client.patch(`/anomalies/${id}`, payload).then((res) => res.data.anomaly);
}
