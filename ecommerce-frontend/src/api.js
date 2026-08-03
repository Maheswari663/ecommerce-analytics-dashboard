import axios from 'axios';

const API_BASE_URL = 'https://ecommerce-analytics-dashboard-r14t.onrender.com/api';

export const api = axios.create({
  baseURL: API_BASE_URL,
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('authToken');
  if (token) {
    config.headers.Authorization = `Token ${token}`;
  }
  return config;
});

export default api;