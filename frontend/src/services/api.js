// Legacy axios instance kept for compatibility; nothing else should need it.
import axios from "axios";
import { API_BASE } from "./http";

const api = axios.create({ baseURL: API_BASE, headers: { "Content-Type": "application/json" } });
api.interceptors.request.use((cfg) => {
  const t = localStorage.getItem("token");
  if (t) cfg.headers.Authorization = `Bearer ${t}`;
  return cfg;
});
export default api;
