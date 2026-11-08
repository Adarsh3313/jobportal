import { apiFetch, json, text } from "./http";

export const getAllCompanies = async () => json(await apiFetch("/api/companies"));
export const getCompanyById = async (id) => json(await apiFetch(`/api/companies/${id}`));
export const createCompany = async (company) => json(await apiFetch("/api/companies", { method: "POST", body: JSON.stringify(company) }));
export const deleteCompany = async (id) => text(await apiFetch(`/api/companies/${id}`, { method: "DELETE" }));
