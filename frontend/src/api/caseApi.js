import api from "./axios";

export const getCases = () => {
  return api.get("/cases");
};

export const createCaseApi = (data) => {
  return api.post("/cases", data);
};

export const getCaseById = (id) => {
  return api.get(`/cases/${id}`);
};