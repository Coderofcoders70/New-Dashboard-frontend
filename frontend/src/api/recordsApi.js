const BASE_URL = "https://dashboard-backend-lmd9.onrender.com/api/records";

const buildQuery = (filters = {}) => {
  const params = new URLSearchParams();
  for (const [k, v] of Object.entries(filters || {})) {
    if (v === undefined || v === null) continue;
    // treat empty string as no filter
    if (typeof v === "string" && v.trim() === "") continue;
    params.append(k, v);
  }
  const qs = params.toString();
  return qs ? `?${qs}` : "";
};

export const fetchRecords = async (filters = {}) => {
  const qs = buildQuery(filters);
  const res = await fetch(`${BASE_URL}${qs}`);
  if (!res.ok) throw new Error("Failed to fetch records");
  return res.json();
};

export const fetchIntensityByYear = async () => {
  const res = await fetch(`${BASE_URL}/agg/intensity-by-year`);
  if (!res.ok) throw new Error("Failed to fetch intensity by year");
  return res.json();
};

export const fetchLikelihoodByCountry = async () => {
  const res = await fetch(`${BASE_URL}/agg/likelihood-by-country`);
  if (!res.ok) throw new Error("Failed to fetch likelihood by country");
  return res.json();
};

export const fetchTopicFrequency = async () => {
  const res = await fetch(`${BASE_URL}/agg/topic-frequency`);
  if (!res.ok) throw new Error("Failed to fetch topic frequency");
  return res.json();
};

export const fetchFilters = async () => {
  const res = await fetch(`${BASE_URL}/filters`);
  if (!res.ok) throw new Error("Failed to fetch filters");
  return res.json();
};
