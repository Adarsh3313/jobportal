import { apiFetch, json, text } from "./http";

export const applyJob = async (applicationData) =>
  text(await apiFetch("/api/applications", { method: "POST", body: JSON.stringify(applicationData) }));

export const getAllApplications = async () => json(await apiFetch("/api/applications"));
export const getApplicationsByJobId = async (jobId) => json(await apiFetch(`/api/applications/job/${jobId}`));
export const getUserApplications = async (email) => json(await apiFetch(`/api/applications/user/${encodeURIComponent(email)}`));
export const updateApplicationStatus = async (id, status) =>
  json(await apiFetch(`/api/applications/${id}/status?status=${encodeURIComponent(status)}`, { method: "PUT" }));
