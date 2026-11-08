import { apiFetch, text } from "./http";

export const registerUser = async (userData) =>
  text(await apiFetch("/api/auth/register", { method: "POST", body: JSON.stringify(userData) }));

export const loginUser = async (loginData) => {
  const response = await apiFetch("/api/auth/login", { method: "POST", body: JSON.stringify(loginData) });
  const data = await response.json().catch(() => ({}));
  if (!response.ok) throw new Error(data.message || "Login Failed");
  return data;
};
