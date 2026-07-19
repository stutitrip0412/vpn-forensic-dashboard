import {
  getCases,
  createCaseApi,
  getCaseById,
} from "../api/caseApi";
import api from "../api/axios";

export const fetchCaseById = async (id) => {
    const response = await api.get(`/cases/${id}`);
    return response.data.case;
};


export const fetchCases = async () => {
  const response = await getCases();
  return response.data.cases;
};

export const createCase = async (caseData) => {
  const response = await createCaseApi(caseData);
  return response.data.case;
};

export const fetchCase = async (id) => {
  const response = await getCaseById(id);
  return response.data.case;
};