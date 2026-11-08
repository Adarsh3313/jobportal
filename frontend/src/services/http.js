// One place that knows where the backend is and how to authenticate.
// In dev, Vite proxies /api to the backend (see vite.config.js).
// In production the backend serves the frontend, so "/api" just works.
// If the frontend is hosted separately (e.g. Vercel), set VITE_API_URL=https://your-backend.com
export const API_BASE = (import.meta.env.VITE_API_URL || "").replace(/\/$/, "");

export function apiFetch(path, options = {}) {
  const token = localStorage.getItem("token");
  const headers = { ...(options.headers || {}) };
  if (token) headers.Authorization = `Bearer ${token}`;
  if (options.body && !(options.body instanceof FormData) && !headers["Content-Type"]) {
    headers["Content-Type"] = "application/json";
  }
  return fetch(`${API_BASE}${path}`, { ...options, headers }).then((res) => {
    // Expired / invalid session -> send to login (but not for the login call itself)
    if (res.status === 401 && !path.startsWith("/api/auth/login")) {
      localStorage.clear();
      window.dispatchEvent(new Event("storage"));
      if (window.location.pathname !== "/login") window.location.href = "/login";
    }
    return res;
  });
}

// Reads a response as JSON, throwing the server's message on errors.
export async function json(res) {
  if (!res.ok) throw new Error((await res.text()) || `Request failed (${res.status})`);
  return res.json();
}
export async function text(res) {
  const t = await res.text();
  if (!res.ok) throw new Error(t || `Request failed (${res.status})`);
  return t;
}
