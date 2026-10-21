// Accept either a backend origin or a full /api URL in hosting settings.
export function normalizeApiUrl(value) {
  const base = (value || "http://localhost:5000/api").trim().replace(/\/+$/, "");
  return base.endsWith("/api") ? base : `${base}/api`;
}

export const API_BASE = normalizeApiUrl(import.meta.env.VITE_API_URL);
