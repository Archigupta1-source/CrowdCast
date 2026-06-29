import axios from 'axios';

const api = axios.create({
  baseURL: 'https://amusing-analysis-production-a05d.up.railway.app/api',
});

// Har request mein JWT token automatically attach hoga
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default api;
