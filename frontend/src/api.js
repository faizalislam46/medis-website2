import axios from "axios";

const api = axios.create({
  baseURL: "https://medis-website2-production.up.railway.app/api"
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("medis_token");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

export default api;