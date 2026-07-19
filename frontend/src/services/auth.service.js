import {
  loginRequest,
  logoutRequest,
  meRequest,
} from "../api/authApi";

export const login = async (username, password) => {
  const response = await loginRequest({
    username,
    password,
  });

  return response.data;
};

export const logout = async () => {
  const response = await logoutRequest();
  return response.data;
};

export const getCurrentUser = async () => {
  const response = await meRequest();
  return response.data;
};