// src/lib/api.js
const BASE = import.meta.env.VITE_API_URL || "";

async function apiFetch(path, options = {}) {
  const res = await fetch(`${BASE}/api${path}`, {
    credentials: "include",
    headers: { "Content-Type": "application/json", ...options.headers },
    ...options,
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
  getPage: (slug) => apiFetch(`/pages/${slug}`),

  // Leads
  submitLead: (data) =>
    apiFetch("/leads", { method: "POST", body: JSON.stringify(data) }),

  // Job application
  applyJob: async (formData) => {
    const res = await fetch(`${BASE}/api/careers/apply`, {
      method: "POST",
      credentials: "include",
      body: formData,
    });

    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.message || `API error ${res.status}`);
    }

    return res.json();
  },
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

  // Team
  getTeam: (params = {}) => apiFetch(`/admin/team?${new URLSearchParams(params)}`),
  getTeamMember: (id) => apiFetch(`/admin/team/${id}`),
  createTeamMember: (data) =>
    apiFetch("/admin/team", { method: "POST", body: JSON.stringify(data) }),

  updateTeamMember: async (id, fd) => {
    const res = await fetch(`${BASE}/api/admin/team/${id}`, {
      method: "PUT",
      credentials: "include",
      body: fd,
    });

    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.message || `API error ${res.status}`);
    }

    return res.json();
  },

  deleteTeamMember: (id) =>
    apiFetch(`/admin/team/${id}`, { method: "DELETE" }),

  // Testimonials
  getTestimonials: (params = {}) =>
    apiFetch(`/admin/testimonials?${new URLSearchParams(params)}`),
  getTestimonial: (id) =>
    apiFetch(`/admin/testimonials/${id}`),
  createTestimonial: (data) =>
    apiFetch("/admin/testimonials", { method: "POST", body: JSON.stringify(data) }),

  updateTestimonial: async (id, fd) => {
    const res = await fetch(`${BASE}/api/admin/testimonials/${id}`, {
      method: "PUT",
      credentials: "include",
      body: fd,
    });

    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.message || `API error ${res.status}`);
    }

    return res.json();
  },

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

  uploadPortfolioImage: async (fd) => {
    const res = await fetch(`${BASE}/api/admin/portfolio/upload`, {
      method: "POST",
      credentials: "include",
      body: fd,
    });

    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.message || `API error ${res.status}`);
    }

    return res.json();
  },

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

  uploadMedia: async (fd) => {
    const res = await fetch(`${BASE}/api/admin/settings/media`, {
      method: "POST",
      credentials: "include",
      body: fd,
    });

    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.message || `API error ${res.status}`);
    }

    return res.json();
  },

  deleteMedia: (key) =>
    apiFetch(`/admin/settings/media/${key}`, { method: "DELETE" }),
};

export function formatDate(dateStr) {
  if (!dateStr) return "";
  return new Date(dateStr).toLocaleDateString("en-IN", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}