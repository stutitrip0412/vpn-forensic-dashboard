import client from './client';

export function listCases(params = {}) {
  return client.get('/cases', { params }).then((res) => res.data.cases);
}

export function getCase(id) {
  return client.get(`/cases/${id}`).then((res) => res.data.case);
}

export function createCase(payload) {
  return client.post('/cases', payload).then((res) => res.data.case);
}

export function updateCase(id, payload) {
  return client.patch(`/cases/${id}`, payload).then((res) => res.data.case);
}

export function assignUserToCase(id, userId) {
  return client.post(`/cases/${id}/assign`, { userId }).then((res) => res.data.case);
}

export function getCaseLogs(id, params = {}) {
  return client.get(`/cases/${id}/logs`, { params }).then((res) => res.data);
}

export function getCaseStats(id) {
  return client.get(`/cases/${id}/stats`).then((res) => res.data);
}

export function getCaseAudit(id, params = {}) {
  return client.get(`/cases/${id}/audit`, { params }).then((res) => res.data);
}

/**
 * Case export has to go through axios (not a plain <a href>) so the JWT
 * goes in the Authorization header the backend actually checks — a bare
 * href can't attach auth headers, and putting the token in the URL as a
 * query param (which the backend doesn't even read) would just leak it
 * into browser history for no benefit. Fetches the file as a blob, then
 * triggers a normal browser download from it.
 */
export async function downloadCaseExport(id, format, filename) {
  const res = await client.get(`/cases/${id}/export`, {
    params: { format },
    responseType: 'blob',
  });

  const url = window.URL.createObjectURL(new Blob([res.data]));
  const link = document.createElement('a');
  link.href = url;
  link.download = filename || `case-${id}-summary.${format}`;
  document.body.appendChild(link);
  link.click();
  link.remove();
  window.URL.revokeObjectURL(url);
}

export function listNotes(caseId, params = {}) {
  return client.get(`/cases/${caseId}/notes`, { params }).then((res) => res.data.notes);
}

export function createNote(caseId, payload) {
  return client.post(`/cases/${caseId}/notes`, payload).then((res) => res.data.note);
}
