import axios from "axios";
import { API_BASE } from "./baseUrl";

// Customer-facing axios instance: used by the storefront (browsing,
// sign in/up, placing orders). Attaches the CUSTOMER token, never the
// admin token. See adminApi.js for the separate admin-panel instance.

const api = axios.create({ baseURL: API_BASE });

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("ga_customer_token");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

export default api;
