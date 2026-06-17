// src/lib/api.js
const BASE = import.meta.env.VITE_API_URL || "";

async function apiFetch(path, options = {}) {
  const isFormData = options.body instanceof FormData;

  const res = await fetch(`${BASE}/api${path}`, {
    credentials: "include",
    ...options,
    headers: {
      ...(isFormData ? {} : { "Content-Type": "application/json" }),
      ...(options.headers || {}),
    },
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.message || `API error ${res.status}`);
  }

  return res.json();
}

export const api = {
  // Blog
  getPosts: () => apiFetch("/blog/posts"),
  getPost: (slug) => apiFetch(`/blog/posts/${slug}`),
  getRelatedPosts: (slug) => apiFetch(`/blog/posts/${slug}/related`),
  getPostsByCategory: (slug) => apiFetch(`/blog/category/${slug}`),
  getCategories: () => apiFetch("/blog/categories"),
  getCategoryPostCounts: () => apiFetch("/blog/category-counts"),

  getPublicSettings: () => apiFetch("/settings/public"),

  // Portfolio
  getPortfolioItems: () => apiFetch("/portfolio"),
  getPortfolioItem: (slug) => apiFetch(`/portfolio/${slug}`),

  // Services
  getServices: () => apiFetch("/services"),
  getService: (slug) => apiFetch(`/services/${slug}`),

  // Testimonials
  getTestimonials: () => apiFetch("/testimonials"),

  // Team
  getTeamMembers: () => apiFetch("/team"),
  getTeamMember: (id) => apiFetch(`/team/${id}`),

  // Careers
  getJobs: () => apiFetch("/careers/jobs"),
  getJob: (slug) => apiFetch(`/careers/jobs/${slug}`),

  // Pages
  getPages: () => apiFetch(`/pages`),
  getPage: (slug) => apiFetch(`/pages/${slug}`),

  // SEO
  getPageSeo: (type, slug) => apiFetch(`/seo/${type}/${slug}`),

  // Leads
  submitLead: (data) =>
    apiFetch("/leads", { method: "POST", body: JSON.stringify(data) }),

  // Job application
  applyJob: (formData) =>
    apiFetch("/careers/apply", {
      method: "POST",
      body: formData,
    }),
};

export const internApi = {
  login: (email, password) =>
    apiFetch("/intern/auth/login", {
      method: "POST",
      body: JSON.stringify({ email, password }),
    }),
  logout: () => apiFetch("/intern/auth/logout", { method: "POST" }),
  forgotPassword: (email) =>
    apiFetch("/intern/auth/forgot-password", {
      method: "POST",
      body: JSON.stringify({ email }),
    }),
  resetPassword: (token, newPassword) =>
    apiFetch("/intern/auth/reset-password", {
      method: "POST",
      body: JSON.stringify({ token, newPassword }),
    }),
  me: () => apiFetch("/intern/auth/me"),
  getDashboard: () => apiFetch("/intern/dashboard"),
  updateProfile: (data) =>
    apiFetch("/intern/profile", { method: "PUT", body: JSON.stringify(data) }),
  uploadProfilePhoto: (formData) =>
    apiFetch("/intern/profile/photo", { method: "POST", body: formData }),
  uploadFile: (formData) =>
    apiFetch("/intern/files", { method: "POST", body: formData }),
  changePassword: (currentPassword, newPassword) =>
    apiFetch("/intern/password", {
      method: "POST",
      body: JSON.stringify({ currentPassword, newPassword }),
    }),
  checkIn: () => apiFetch("/intern/attendance/check-in", { method: "POST" }),
  checkOut: () => apiFetch("/intern/attendance/check-out", { method: "POST" }),
  submitReport: (data) =>
    apiFetch("/intern/reports", { method: "POST", body: JSON.stringify(data) }),
  updateTask: (id, data) =>
    apiFetch(`/intern/tasks/${id}`, { method: "PATCH", body: JSON.stringify(data) }),
};

export const adminApi = {
  // Auth
  login: (email, password) =>
    apiFetch("/admin/auth/login", {
      method: "POST",
      body: JSON.stringify({ email, password }),
    }),

  logout: () =>
    apiFetch("/admin/auth/logout", { method: "POST" }),

  getCurrentAdmin: () => apiFetch("/admin/auth/me"),

  // Dashboard
  getDashboard: () => apiFetch("/admin/dashboard"),

  // Blog
  getBlogPosts: (params = {}) => apiFetch(`/admin/blog?${new URLSearchParams(params)}`),
  getBlogPost: (slug) => apiFetch(`/admin/blog/${slug}`),
  createBlogPost: (data) =>
    apiFetch("/admin/blog", { method: "POST", body: JSON.stringify(data) }),
  updateBlogPost: (slug, data) =>
    apiFetch(`/admin/blog/${slug}`, { method: "PUT", body: JSON.stringify(data) }),
  deleteBlogPost: (slug) =>
    apiFetch(`/admin/blog/${slug}`, { method: "DELETE" }),

  // Careers
  getAdminJobs: () => apiFetch("/admin/careers"),
  getAdminJob: (id) => apiFetch(`/admin/careers/${id}`),
  createJob: (data) =>
    apiFetch("/admin/careers", { method: "POST", body: JSON.stringify(data) }),
  updateJob: (id, data) =>
    apiFetch(`/admin/careers/${id}`, { method: "PUT", body: JSON.stringify(data) }),
  patchJobStatus: (id, status) =>
    apiFetch(`/admin/careers/${id}`, { method: "PATCH", body: JSON.stringify({ status }) }),
  deleteJob: (id) =>
    apiFetch(`/admin/careers/${id}`, { method: "DELETE" }),
  getApplications: (id) =>
    apiFetch(`/admin/careers/${id}/applications`),
  updateApplication: (id, data) =>
    apiFetch(`/admin/careers/${id}/applications`, {
      method: "PATCH",
      body: JSON.stringify(data),
    }),

  // Leads
  getLeads: (params = {}) => apiFetch(`/admin/leads?${new URLSearchParams(params)}`),
  getLead: (id) => apiFetch(`/admin/leads/${id}`),
  updateLead: (id, data) =>
    apiFetch(`/admin/leads/${id}`, { method: "PUT", body: JSON.stringify(data) }),
  deleteLead: (id) =>
    apiFetch(`/admin/leads/${id}`, { method: "DELETE" }),

  // Team,

  // Testimonials
 // Team
getTeam: (params = {}) => apiFetch(`/admin/team?${new URLSearchParams(params)}`),
getTeamMember: (id) => apiFetch(`/admin/team/${id}`),

createTeamMember: (fd) =>
  apiFetch("/admin/team", {
    method: "POST",
    body: fd,
  }),

updateTeamMember: (id, fd) =>
  apiFetch(`/admin/team/${id}`, {
    method: "PUT",
    body: fd,
  }),

deleteTeamMember: (id) =>
  apiFetch(`/admin/team/${id}`, { method: "DELETE" }),
 
  getTestimonials: (params = {}) =>
    apiFetch(`/admin/testimonials?${new URLSearchParams(params)}`),
  getTestimonial: (id) =>
    apiFetch(`/admin/testimonials/${id}`),
  createTestimonial: (data) =>
    apiFetch("/admin/testimonials", { method: "POST", body: JSON.stringify(data) }),

  updateTestimonial: (id, fd) =>
    apiFetch(`/admin/testimonials/${id}`, {
      method: "PUT",
      body: fd,
    }),

  deleteTestimonial: (id) =>
    apiFetch(`/admin/testimonials/${id}`, { method: "DELETE" }),
  toggleFeatured: (id) =>
    apiFetch(`/admin/testimonials/${id}/toggle-featured`, { method: "PUT" }),

  // Pages
  getPages: (params = {}) => apiFetch(`/admin/pages?${new URLSearchParams(params)}`),
  getPage: (slug) => apiFetch(`/admin/pages/${slug}`),
  createPage: (data) =>
    apiFetch("/admin/pages", { method: "POST", body: JSON.stringify(data) }),
  updatePage: (slug, data) =>
    apiFetch(`/admin/pages/${slug}`, { method: "PUT", body: JSON.stringify(data) }),
  deletePage: (slug) =>
    apiFetch(`/admin/pages/${slug}`, { method: "DELETE" }),

  // Portfolio
  getPortfolio: () => apiFetch("/admin/portfolio"),
  getPortfolioItem: (slug) => apiFetch(`/admin/portfolio/${slug}`),
  createPortfolioItem: (data) =>
    apiFetch("/admin/portfolio", { method: "POST", body: JSON.stringify(data) }),
  updatePortfolioItem: (slug, data) =>
    apiFetch(`/admin/portfolio/${slug}`, { method: "PUT", body: JSON.stringify(data) }),
  deletePortfolioItem: (slug) =>
    apiFetch(`/admin/portfolio/${slug}`, { method: "DELETE" }),

  uploadPortfolioImage: (fd) =>
    apiFetch("/admin/portfolio/upload", {
      method: "POST",
      body: fd,
    }),

  // Services
  getServices: () => apiFetch("/admin/services"),
  getService: (slug) => apiFetch(`/admin/services/${slug}`),
  createService: (data) =>
    apiFetch("/admin/services", { method: "POST", body: JSON.stringify(data) }),
  updateService: (slug, data) =>
    apiFetch(`/admin/services/${slug}`, { method: "PUT", body: JSON.stringify(data) }),
  deleteService: (slug) =>
    apiFetch(`/admin/services/${slug}`, { method: "DELETE" }),

  // SEO
  getSeo: () => apiFetch("/admin/seo"),
  updateGlobalSeo: (data) =>
    apiFetch("/admin/seo", { method: "PUT", body: JSON.stringify(data) }),
  updateEntitySeo: (type, id, d) =>
    apiFetch(`/admin/seo/${type}/${id}`, { method: "PUT", body: JSON.stringify(d) }),

  // Settings
  getSettings: () => apiFetch("/admin/settings"),
  updateSettings: (data) =>
    apiFetch("/admin/settings", { method: "PUT", body: JSON.stringify(data) }),

  uploadMedia: (fd) =>
    apiFetch("/admin/settings/media", {
      method: "POST",
      body: fd,
    }),

  deleteMedia: (key) =>
    apiFetch(`/admin/settings/media/${key}`, { method: "DELETE" }),

  // Internship Management
  getInternships: () => apiFetch("/admin/internships"),
  createIntern: (data) =>
    apiFetch("/admin/internships/interns", { method: "POST", body: JSON.stringify(data) }),
  updateIntern: (id, data) =>
    apiFetch(`/admin/internships/interns/${id}`, { method: "PUT", body: JSON.stringify(data) }),
  deleteIntern: (id) =>
    apiFetch(`/admin/internships/interns/${id}`, { method: "DELETE" }),
  saveInternAttendance: (data) =>
    apiFetch("/admin/internships/attendance", { method: "POST", body: JSON.stringify(data) }),
  saveInternReport: (data) =>
    apiFetch("/admin/internships/reports", { method: "POST", body: JSON.stringify(data) }),
  reviewInternReport: (id, data) =>
    apiFetch(`/admin/internships/reports/${id}/review`, { method: "PATCH", body: JSON.stringify(data) }),
  createInternTask: (data) =>
    apiFetch("/admin/internships/tasks", { method: "POST", body: JSON.stringify(data) }),
  updateInternTask: (id, data) =>
    apiFetch(`/admin/internships/tasks/${id}`, { method: "PATCH", body: JSON.stringify(data) }),
};

export function formatDate(dateStr) {
  if (!dateStr) return "";
  return new Date(dateStr).toLocaleDateString("en-IN", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}
