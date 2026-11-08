import { apiFetch, json } from "./http";

export const scheduleInterview = async (interviewData) =>
  json(await apiFetch("/api/interviews", { method: "POST", body: JSON.stringify(interviewData) }));
export const getCandidateInterviews = async (email) => json(await apiFetch(`/api/interviews/candidate/${encodeURIComponent(email)}`));
export const getAllInterviews = async () => json(await apiFetch("/api/interviews"));
