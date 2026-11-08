import { apiFetch, json } from "./http";

export const getAllJobs = async () => json(await apiFetch("/api/jobs"));
export const getJobById = async (id) => json(await apiFetch(`/api/jobs/${id}`));
