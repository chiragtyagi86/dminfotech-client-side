// src/lib/api.js
// ─────────────────────────────────────────────────────────────────────────────
// API client — all paths match the Express server exactly.
// Set VITE_API_URL in your .env:
//   VITE_API_URL=http://localhost:5000   (dev)
//   VITE_API_URL=https://api.dmifotech.com  (prod)
// ─────────────────────────────────────────────────────────────────────────────

const BASE = import.meta.env.VITE_API_URL || "";

// ── Core fetch wrapper ────────────────────────────────────────────────────────

async function apiFetch(path, options = {}) {
  const res = await fetch(`${BASE}/api${path}`, {
    credentials: "include",               // sends httpOnly cookie for admin auth
    headers: { "Content-Type": "application/json", ...options.headers },
    ...options,
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.message || `API error ${res.status}`);
  }

  return res.json();
}

// ── Public API ────────────────────────────────────────────────────────────────

export const api = {

  // Blog
  // Server: GET /api/blog/posts
  getPosts: () => apiFetch("/blog/posts"),

  // Server: GET /api/blog/posts/:slug
  getPost: (slug) => apiFetch(`/blog/posts/${slug}`),

  // Server: GET /api/blog/posts/:slug/related
  getRelatedPosts: (slug) => apiFetch(`/blog/posts/${slug}/related`),

  // Server: GET /api/blog/category/:slug
  getPostsByCategory: (slug) => apiFetch(`/blog/category/${slug}`),

  // Server: GET /api/blog/categories
  getCategories: () => apiFetch("/blog/categories"),

  // Server: GET /api/blog/category-counts
  getCategoryPostCounts: () => apiFetch("/blog/category-counts"),

  // Portfolio
  // Server: GET /api/portfolio
  getPortfolioItems: () => apiFetch("/portfolio"),

  // Server: GET /api/portfolio/:slug
  getPortfolioItem: (slug) => apiFetch(`/portfolio/${slug}`),

  // Services
  // Server: GET /api/services
  getServices: () => apiFetch("/services"),

  // Server: GET /api/services/:slug
  getService: (slug) => apiFetch(`/services/${slug}`),

  // Testimonials
  // Server: GET /api/testimonials
  getTestimonials: () => apiFetch("/testimonials"),

  // Team
  // Server: GET /api/team
  getTeamMembers: () => apiFetch("/team"),

  // Server: GET /api/team/:id
  getTeamMember: (id) => apiFetch(`/team/${id}`),

  // Jobs / Careers
  // Server: GET /api/careers/jobs
  getJobs: () => apiFetch("/careers/jobs"),

  // Server: GET /api/careers/jobs/:slug
  getJob: (slug) => apiFetch(`/careers/jobs/${slug}`),

  // Pages (CMS-managed content)
  // Server: GET /api/pages/:slug
  getPage: (slug) => apiFetch(`/pages/${slug}`),

  // Contact / Lead form
  // Server: POST /api/leads
  submitLead: (data) =>
    apiFetch("/leads", { method: "POST", body: JSON.stringify(data) }),

  // Job application (multipart — resume file upload)
  // Server: POST /api/careers/apply
  applyJob: async (formData) => {
    const res = await fetch(`${BASE}/api/careers/apply`, {
      method: "POST",
      credentials: "include",
      body: formData,             // FormData — do NOT set Content-Type header
    });

    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.message || `API error ${res.status}`);
    }

    return res.json();
  },
};

// ── Admin API (requires admin_token cookie) ───────────────────────────────────

export const adminApi = {

  // Auth
  login:  (email, password) => apiFetch("/admin/auth/login",  { method: "POST", body: JSON.stringify({ email, password }) }),
  logout: ()                 => apiFetch("/admin/auth/logout", { method: "POST" }),

  // Dashboard
  getDashboard: () => apiFetch("/admin/dashboard"),

  // Blog
  getBlogPosts:    (params = {}) => apiFetch(`/admin/blog?${new URLSearchParams(params)}`),
  getBlogPost:     (slug)        => apiFetch(`/admin/blog/${slug}`),
  createBlogPost:  (data)        => apiFetch("/admin/blog",        { method: "POST",   body: JSON.stringify(data) }),
  updateBlogPost:  (slug, data)  => apiFetch(`/admin/blog/${slug}`, { method: "PUT",    body: JSON.stringify(data) }),
  deleteBlogPost:  (slug)        => apiFetch(`/admin/blog/${slug}`, { method: "DELETE" }),

  // Careers
  getAdminJobs:    ()           => apiFetch("/admin/careers"),
  getAdminJob:     (id)         => apiFetch(`/admin/careers/${id}`),
  createJob:       (data)       => apiFetch("/admin/careers",       { method: "POST",   body: JSON.stringify(data) }),
  updateJob:       (id, data)   => apiFetch(`/admin/careers/${id}`, { method: "PUT",    body: JSON.stringify(data) }),
  patchJobStatus:  (id, status) => apiFetch(`/admin/careers/${id}`, { method: "PATCH",  body: JSON.stringify({ status }) }),
  deleteJob:       (id)         => apiFetch(`/admin/careers/${id}`, { method: "DELETE" }),
  getApplications: (id)         => apiFetch(`/admin/careers/${id}/applications`),
  updateApplication: (id, data) => apiFetch(`/admin/careers/${id}/applications`, { method: "PATCH", body: JSON.stringify(data) }),

  // Leads
  getLeads:    (params = {}) => apiFetch(`/admin/leads?${new URLSearchParams(params)}`),
  getLead:     (id)          => apiFetch(`/admin/leads/${id}`),
  updateLead:  (id, data)    => apiFetch(`/admin/leads/${id}`,  { method: "PUT",    body: JSON.stringify(data) }),
  deleteLead:  (id)          => apiFetch(`/admin/leads/${id}`,  { method: "DELETE" }),

  // Team
  getTeam:           (params = {}) => apiFetch(`/admin/team?${new URLSearchParams(params)}`),
  getTeamMember:     (id)          => apiFetch(`/admin/team/${id}`),
  createTeamMember:  (data)        => apiFetch("/admin/team",        { method: "POST", body: JSON.stringify(data) }),
  updateTeamMember:  (id, fd)      => {
    // fd is FormData (may include photo/signature files)
    return fetch(`${BASE}/api/admin/team/${id}`, { method: "PUT", credentials: "include", body: fd }).then(r => r.json());
  },
  deleteTeamMember:  (id)          => apiFetch(`/admin/team/${id}`,  { method: "DELETE" }),

  // Testimonials
  getTestimonials:      (params = {}) => apiFetch(`/admin/testimonials?${new URLSearchParams(params)}`),
  getTestimonial:       (id)          => apiFetch(`/admin/testimonials/${id}`),
  createTestimonial:    (data)        => apiFetch("/admin/testimonials",              { method: "POST",   body: JSON.stringify(data) }),
  updateTestimonial:    (id, fd)      => {
    return fetch(`${BASE}/api/admin/testimonials/${id}`, { method: "PUT", credentials: "include", body: fd }).then(r => r.json());
  },
  deleteTestimonial:    (id)          => apiFetch(`/admin/testimonials/${id}`,        { method: "DELETE" }),
  toggleFeatured:       (id)          => apiFetch(`/admin/testimonials/${id}/toggle-featured`, { method: "PUT" }),

  // Pages
  getPages:      (params = {}) => apiFetch(`/admin/pages?${new URLSearchParams(params)}`),
  getPage:       (slug)        => apiFetch(`/admin/pages/${slug}`),
  createPage:    (data)        => apiFetch("/admin/pages",         { method: "POST",   body: JSON.stringify(data) }),
  updatePage:    (slug, data)  => apiFetch(`/admin/pages/${slug}`, { method: "PUT",    body: JSON.stringify(data) }),
  deletePage:    (slug)        => apiFetch(`/admin/pages/${slug}`, { method: "DELETE" }),

  // Portfolio
  getPortfolio:       ()           => apiFetch("/admin/portfolio"),
  getPortfolioItem:   (slug)       => apiFetch(`/admin/portfolio/${slug}`),
  createPortfolioItem:(data)       => apiFetch("/admin/portfolio",         { method: "POST",   body: JSON.stringify(data) }),
  updatePortfolioItem:(slug, data) => apiFetch(`/admin/portfolio/${slug}`, { method: "PUT",    body: JSON.stringify(data) }),
  deletePortfolioItem:(slug)       => apiFetch(`/admin/portfolio/${slug}`, { method: "DELETE" }),

  // Services
  getServices:    ()           => apiFetch("/admin/services"),
  getService:     (slug)       => apiFetch(`/admin/services/${slug}`),
  createService:  (data)       => apiFetch("/admin/services",         { method: "POST",   body: JSON.stringify(data) }),
  updateService:  (slug, data) => apiFetch(`/admin/services/${slug}`, { method: "PUT",    body: JSON.stringify(data) }),
  deleteService:  (slug)       => apiFetch(`/admin/services/${slug}`, { method: "DELETE" }),

  // SEO
  getSeo:             ()            => apiFetch("/admin/seo"),
  updateGlobalSeo:    (data)        => apiFetch("/admin/seo",              { method: "PUT", body: JSON.stringify(data) }),
  updateEntitySeo:    (type, id, d) => apiFetch(`/admin/seo/${type}/${id}`,{ method: "PUT", body: JSON.stringify(d)    }),

  // Settings
  getSettings:    ()     => apiFetch("/admin/settings"),
  updateSettings: (data) => apiFetch("/admin/settings", { method: "PUT", body: JSON.stringify(data) }),
  uploadMedia:    (fd)   => fetch(`${BASE}/api/admin/settings/media`,       { method: "POST", credentials: "include", body: fd }).then(r => r.json()),
  deleteMedia:    (key)  => apiFetch(`/admin/settings/media/${key}`,        { method: "DELETE" }),
};

// ── Helpers ───────────────────────────────────────────────────────────────────

export function formatDate(dateStr) {
  if (!dateStr) return "";
  return new Date(dateStr).toLocaleDateString("en-IN", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}