import axios from "axios";

// Separate axios instance for the ADMIN panel only. Kept apart from the
// customer-facing `api` instance so an admin token and a customer token
// can never be mixed up or accidentally sent to the wrong routes.
const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

const adminApi = axios.create({ baseURL: API_BASE });

adminApi.interceptors.request.use((config) => {
  const token = localStorage.getItem("ga_admin_token");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

export default adminApi;
