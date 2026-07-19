import client from './client';

export function listEvidenceForCase(caseId) {
  return client.get(`/cases/${caseId}/evidence`).then((res) => res.data.evidence);
}

export function getEvidence(id) {
  return client.get(`/evidence/${id}`).then((res) => res.data.evidence);
}

export function getEvidenceCustody(id) {
  return client.get(`/evidence/${id}/custody`).then((res) => res.data);
}

export function verifyEvidence(id) {
  // Backend returns 409 on a hash mismatch rather than 200 — that's a
  // meaningful result for the caller, not just an error, so surface the
  // response body either way instead of letting the mismatch case throw.
  return client
    .get(`/evidence/${id}/verify`)
    .then((res) => res.data)
    .catch((err) => {
      if (err.response && err.response.status === 409) {
        return err.response.data;
      }
      throw err;
    });
}

/**
 * Uploads a log file to a case. Reports progress via onProgress(percent)
 * so the UI can show a real progress bar for large files (FR1.1 up to
 * ~100MB) instead of an indefinite spinner.
 */
export function uploadEvidence(caseId, file, sourceType, onProgress) {
  const formData = new FormData();
  formData.append('file', file);
  if (sourceType) formData.append('sourceType', sourceType);

  return client
    .post(`/cases/${caseId}/evidence`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
      onUploadProgress: (evt) => {
        if (onProgress && evt.total) {
          onProgress(Math.round((evt.loaded / evt.total) * 100));
        }
      },
    })
    .then((res) => res.data);
}

/**
 * Same auth-header reasoning as downloadCaseExport in api/cases.js — a
 * bare href can't carry the Authorization header the backend requires.
 */
export async function downloadEvidenceFile(id, filename) {
  const res = await client.get(`/evidence/${id}/download`, { responseType: 'blob' });

  const hashMatchHeader = res.headers['x-evidence-hash-match'];
  const url = window.URL.createObjectURL(new Blob([res.data]));
  const link = document.createElement('a');
  link.href = url;
  link.download = filename || `evidence-${id}`;
  document.body.appendChild(link);
  link.click();
  link.remove();
  window.URL.revokeObjectURL(url);

  return { hashMatch: hashMatchHeader === 'true' };
}
