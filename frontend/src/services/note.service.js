import api from "../api/axios";

/**
 * GET /api/cases/:id/notes
 */
export const fetchCaseNotes = async (caseId) => {
  const response = await api.get(`/cases/${caseId}/notes`);
  return response.data.notes;
};

/**
 * POST /api/cases/:id/notes
 */
export const createCaseNote = async (caseId, noteBody) => {
  const response = await api.post(
    `/cases/${caseId}/notes`,
    {
      targetType: "case",
      body: noteBody,
    }
  );

  return response.data.note;
};