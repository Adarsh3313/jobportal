import { apiFetch, json, text } from "./http";

export const uploadResume = async (formData) =>
  text(await apiFetch("/api/resumes/upload", { method: "POST", body: formData }));
export const getAllResumes = async () => json(await apiFetch("/api/resumes"));
