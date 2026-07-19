import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api';

const client = axios.create({
  baseURL: API_BASE_URL,
});

// Attach the JWT to every request if we have one. Token lives in
// localStorage — simplest approach for a portfolio-grade SPA. A hardened
// production deployment would prefer an httpOnly cookie (immune to XSS
// token theft) issued by the backend instead; that's a backend + CORS
// change, not just a frontend one, so it's flagged here rather than done.
client.interceptors.request.use((config) => {
  const token = localStorage.getItem('vpn_forensic_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// A 401 means the token is missing/expired/invalid — clear it and let the
// app's routing redirect to login rather than showing a confusing error.
client.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      localStorage.removeItem('vpn_forensic_token');
      localStorage.removeItem('vpn_forensic_user');
      if (window.location.pathname !== '/login') {
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);

export default client;
