const API_ROOT = import.meta.env.VITE_API_URL ?? "/api/v1";

async function request(path, options = {}) {
  const headers = { ...(options.headers || {}) };
  if (!(options.body instanceof FormData)) {
    headers["Content-Type"] = "application/json";
  }

  const response = await fetch(`${API_ROOT}${path}`, {
    credentials: "include",
    headers,
    ...options,
  });

  const payload = await response.json().catch(() => null);

  if (!response.ok) {
    const message = payload?.message || `Request failed with status ${response.status}`;
    throw new Error(message);
  }

  return payload;
}

export const login = (body) => request("/auth/login", { method: "POST", body: JSON.stringify(body) });
export const register = (body) => request("/auth/register", { method: "POST", body: JSON.stringify(body) });
export const logout = () => request("/auth/logout", { method: "POST" });
export const getCurrentUser = () => request("/auth/me");
export const getJobs = (query = "") => request(`/jobs${query}`);
export const getJob = (jobId) => request(`/jobs/${jobId}`);
export const getEmployerJobs = () => request("/jobs/employer/me");
export const getMyApplications = () => request("/applications/me");
export const getJobApplicants = (jobId) => request(`/applications/jobs/${jobId}/applicants`);
export const updateApplicationStatus = (applicationId, status) =>
  request(`/applications/${applicationId}/status`, {
    method: "PATCH",
    body: JSON.stringify({ status }),
  });
export const createJob = (body) => request("/jobs", { method: "POST", body: JSON.stringify(body) });
export const updateCandidateProfile = (body) => request("/profile/candidate", { method: "PATCH", body: JSON.stringify(body) });
export const uploadCandidateResume = (file) => {
  const formData = new FormData();
  formData.append("resume", file);
  return request("/profile/candidate/resume", { method: "POST", body: formData, headers: {} });
};
export const applyToJob = (jobId, resumeFile) => {
  const formData = new FormData();
  if (resumeFile) {
    formData.append("resume", resumeFile);
  }
  return request(`/applications/jobs/${jobId}`, { method: "POST", body: formData, headers: {} });
};
export const getAdminUsers = (role) => request(`/admin/users${role ? `?role=${encodeURIComponent(role)}` : ""}`);
export const getAdminJobs = (query = "") => request(`/admin/jobs${query}`);
export const getAdminCompanies = () => request("/admin/companies");
export const getAdminApplications = () => request("/admin/applications");
export const getAdminStats = () => request("/admin/stats");
export const sendChatMessage = (message) => request("/chatbot/message", { method: "POST", body: JSON.stringify({ message }) });
