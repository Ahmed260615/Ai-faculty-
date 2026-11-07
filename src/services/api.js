import axios from 'axios';

/** Single Express client. No URL is hard-coded: configure VITE_API_BASE_URL. */
const baseURL = import.meta.env.VITE_API_BASE_URL || '';
export const USE_MOCK = import.meta.env.VITE_USE_MOCK === 'true' || !baseURL;

export const AI_TIMEOUT_MS = 45000;

const api = axios.create({ baseURL, timeout: 15000, headers: { 'Content-Type': 'application/json' } });
api.interceptors.request.use((cfg) => {
  const token = localStorage.getItem('astrohealth.token');
  if (token) cfg.headers.Authorization = `Bearer ${token}`;
  return cfg;
});

/** Normalise failures so the UI can distinguish timeout / API error. */
api.interceptors.response.use((r) => r, (err) => {
  if (axios.isCancel(err)) return Promise.reject({ kind: 'cancelled' });
  if (err.code === 'ECONNABORTED' || err.code === 'ETIMEDOUT') return Promise.reject({ kind: 'timeout', message: 'The analysis service did not respond in time.' });
  return Promise.reject({ kind: 'api', status: err.response?.status, message: err.response?.data?.message || err.message || 'Request failed.' });
});

export default api;
