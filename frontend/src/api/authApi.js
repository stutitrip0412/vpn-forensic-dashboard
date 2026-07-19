import api from "./axios";

export const loginRequest = (credentials) => {
  return api.post("/auth/login", credentials);
};

export const logoutRequest = () => {
  return api.post("/auth/logout");
};

export const meRequest = () => {
  return api.get("/auth/me");
};