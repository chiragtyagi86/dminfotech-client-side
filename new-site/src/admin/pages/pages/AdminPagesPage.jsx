// pages/pages/AdminPagesPage.jsx
// Pages management — list, create, delete editable pages

import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { adminApi } from "../../../lib/api";

export default function AdminPagesPage() {
  const [pages, setPages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newPageForm, setNewPageForm] = useState({
    slug: "",
    title: "",
    description: "",
  });
  const [creating, setCreating] = useState(false);

  useEffect(() => {
    fetchPages();
  }, []);

  async function fetchPages() {
    try {
      setLoading(true);

      const json = await adminApi.getPages();
      const list = Array.isArray(json?.data)
        ? json.data
        : Array.isArray(json)
        ? json
        : [];

      setPages(list);
    } catch (err) {
      console.error("Failed to fetch pages:", err);
      setPages([]);
    } finally {
      setLoading(false);
    }
  }

  async function handleCreatePage() {
    if (!newPageForm.slug.trim() || !newPageForm.title.trim()) {
      alert("Slug and title are required");
      return;
    }

    try {
      setCreating(true);

      await adminApi.createPage({
        slug: newPageForm.slug.trim(),
        title: newPageForm.title.trim(),
        description: newPageForm.description.trim(),
        content: {},
      });

      alert("Page created successfully!");
      setNewPageForm({ slug: "", title: "", description: "" });
      setShowCreateModal(false);
      await fetchPages();
    } catch (err) {
      console.error("Failed to create page:", err);
      alert(err.message || "Error creating page");
    } finally {
      setCreating(false);
    }
  }

  async function handleDeletePage(slug) {
    if (!window.confirm(`Delete page "${slug}"?`)) return;

    try {
      await adminApi.deletePage(slug);
      alert("Page deleted successfully!");
      await fetchPages();
    } catch (err) {
      console.error("Failed to delete page:", err);
      alert(err.message || "Error deleting page");
    }
  }

  const filteredPages = useMemo(() => {
    const q = search.toLowerCase().trim();

    if (!q) return pages;

    return pages.filter((p) => {
      const title = (p?.title || "").toLowerCase();
      const slug = (p?.slug || "").toLowerCase();
      return title.includes(q) || slug.includes(q);
    });
  }, [pages, search]);

  function getPageIcon(slug) {
    if (slug === "home") return "🏠";
    if (slug === "about") return "ℹ️";
    if (slug === "contact") return "✉️";
    return "📄";
  }

  function getEditLink(page) {
    return page?.href || `/admin/pages/${page.slug}`;
  }

  return (
    <div className="apages-root">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@300;400;600&family=DM+Sans:wght@300;400;500&display=swap');

        .apages-root { display: flex; flex-direction: column; gap: 24px; animation: apFade 0.4s ease both; }
        @keyframes apFade { from { opacity: 0; transform: translateY(8px); } to { opacity: 1; transform: translateY(0); } }

        .apages-heading { font-family: 'Cormorant Garamond', serif; font-size: 28px; font-weight: 400; color: #3a405a; margin: 0; }
        .apages-sub { font-family: 'DM Sans', sans-serif; font-size: 13px; font-weight: 300; color: rgba(104,80,68,0.50); margin: 4px 0 0; }

        .apages-controls { display: flex; gap: 12px; flex-wrap: wrap; align-items: center; }
        .apages-search { flex: 1; min-width: 200px; padding: 10px 13px; border-radius: 9px; border: 1px solid rgba(104,80,68,0.14); background: #fdfaf8; font-family: 'DM Sans', sans-serif; font-size: 13px; color: #3a405a; outline: none; }
        .apages-search:focus { border-color: rgba(153,178,221,0.55); box-shadow: 0 0 0 3px rgba(153,178,221,0.10); background: #ffffff; }

        .apages-btn { padding: 10px 20px; border-radius: 9px; border: none; background: #3a405a; color: #f9dec9; font-family: 'DM Sans', sans-serif; font-size: 12px; font-weight: 500; letter-spacing: 0.08em; text-transform: uppercase; cursor: pointer; transition: transform 0.2s ease, box-shadow 0.2s ease; }
        .apages-btn:hover { transform: translateY(-1px); box-shadow: 0 6px 18px rgba(58,64,90,0.18); }

        .apages-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(280px, 1fr)); gap: 16px; }

        .apages-card { background: #ffffff; border: 1px solid rgba(104,80,68,0.09); border-radius: 18px; overflow: hidden; text-decoration: none; display: flex; flex-direction: column; transition: transform 0.25s ease, box-shadow 0.25s ease; position: relative; }
        .apages-card:hover { transform: translateY(-4px); box-shadow: 0 16px 40px rgba(58,64,90,0.09); }

        .apages-card-top { height: 3px; background: linear-gradient(90deg, #99b2dd, #e9afa3); }

        .apages-card-body { padding: 24px 22px; flex: 1; display: flex; flex-direction: column; gap: 10px; }

        .apages-card-icon { width: 36px; height: 36px; border-radius: 10px; background: rgba(58,64,90,0.06); display: flex; align-items: center; justify-content: center; font-size: 16px; }

        .apages-card-title { font-family: 'Cormorant Garamond', serif; font-size: 22px; font-weight: 600; color: #3a405a; margin: 0; }
        .apages-card-desc { font-family: 'DM Sans', sans-serif; font-size: 12.5px; font-weight: 300; line-height: 1.65; color: rgba(104,80,68,0.55); margin: 0; flex: 1; }

        .apages-card-footer { display: flex; align-items: center; justify-content: space-between; padding: 14px 22px; border-top: 1px solid rgba(104,80,68,0.07); background: rgba(104,80,68,0.02); }
        .apages-card-actions { display: flex; gap: 8px; align-items: center; }

        .apages-card-action { font-family: 'DM Sans', sans-serif; font-size: 11px; font-weight: 500; color: #3a405a; background: none; border: none; cursor: pointer; padding: 4px 8px; transition: color 0.2s; }
        .apages-card-action:hover { color: #99b2dd; }
        .apages-card-action.delete { color: #c0392b; }
        .apages-card-action.delete:hover { color: #a93226; }

        .apages-card-cta { font-family: 'DM Sans', sans-serif; font-size: 11.5px; font-weight: 500; letter-spacing: 0.08em; text-transform: uppercase; color: #3a405a; display: flex; align-items: center; gap: 5px; text-decoration: none; transition: gap 0.2s ease; }
        .apages-card:hover .apages-card-cta { gap: 9px; color: #99b2dd; }

        /* Modal */
        .apages-modal-overlay { position: fixed; top: 0; left: 0; right: 0; bottom: 0; background: rgba(0,0,0,0.5); display: flex; align-items: center; justify-content: center; z-index: 1000; }
        .apages-modal { background: white; border-radius: 16px; padding: 32px; max-width: 500px; width: 90%; box-shadow: 0 20px 60px rgba(0,0,0,0.2); }
        .apages-modal-title { font-family: 'Cormorant Garamond', serif; font-size: 24px; font-weight: 400; margin: 0 0 20px; color: #3a405a; }

        .apages-modal-field { display: flex; flex-direction: column; gap: 6px; margin-bottom: 16px; }
        .apages-modal-label { font-family: 'DM Sans', sans-serif; font-size: 11px; font-weight: 500; text-transform: uppercase; color: rgba(104,80,68,0.55); letter-spacing: 0.13em; }
        .apages-modal-input { padding: 10px 13px; border-radius: 9px; border: 1px solid rgba(104,80,68,0.14); background: #fdfaf8; font-family: 'DM Sans', sans-serif; font-size: 13px; color: #3a405a; outline: none; }
        .apages-modal-input:focus { border-color: rgba(153,178,221,0.55); box-shadow: 0 0 0 3px rgba(153,178,221,0.10); background: #ffffff; }

        .apages-modal-actions { display: flex; gap: 12px; justify-content: flex-end; margin-top: 24px; }
        .apages-modal-btn { padding: 10px 20px; border-radius: 9px; border: none; font-family: 'DM Sans', sans-serif; font-size: 12px; font-weight: 500; text-transform: uppercase; cursor: pointer; transition: all 0.2s; }
        .apages-modal-btn-primary { background: #3a405a; color: #f9dec9; }
        .apages-modal-btn-primary:hover { transform: translateY(-1px); box-shadow: 0 6px 18px rgba(58,64,90,0.18); }
        .apages-modal-btn-cancel { background: rgba(104,80,68,0.10); color: #3a405a; }
        .apages-modal-btn-cancel:hover { background: rgba(104,80,68,0.15); }

        .apages-loading { text-align: center; padding: 40px; font-family: 'DM Sans', sans-serif; color: rgba(104,80,68,0.55); }
      `}</style>

      <div>
        <h1 className="apages-heading">Page Content</h1>
        <p className="apages-sub">Manage all your editable pages. Create new pages anytime.</p>
      </div>

      <div className="apages-controls">
        <input
          type="text"
          className="apages-search"
          placeholder="Search pages..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <button className="apages-btn" onClick={() => setShowCreateModal(true)}>
          + New Page
        </button>
      </div>

      {loading ? (
        <div className="apages-loading">Loading pages...</div>
      ) : filteredPages.length === 0 ? (
        <div className="apages-loading">No pages found</div>
      ) : (
        <div className="apages-grid">
          {filteredPages.map((page) => (
            <div key={page.id || page.slug} className="apages-card">
              <div className="apages-card-top" />
              <div className="apages-card-body">
                <div className="apages-card-icon">{getPageIcon(page.slug)}</div>
                <h2 className="apages-card-title">{page.title || "Untitled Page"}</h2>
                <p className="apages-card-desc">
                  {page.description || "No description available for this page."}
                </p>
              </div>
              <div className="apages-card-footer">
                <span style={{ fontSize: "11px", color: "rgba(104,80,68,0.45)" }}>
                  /{page.slug}
                </span>
                <div className="apages-card-actions">
                  <Link to={getEditLink(page)} className="apages-card-cta">
                    Edit →
                  </Link>

                  {!["home", "about", "contact"].includes(page.slug) && (
                    <button
                      type="button"
                      className="apages-card-action delete"
                      onClick={() => handleDeletePage(page.slug)}
                    >
                      Delete
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {showCreateModal && (
        <div
          className="apages-modal-overlay"
          onClick={() => {
            if (!creating) setShowCreateModal(false);
          }}
        >
          <div className="apages-modal" onClick={(e) => e.stopPropagation()}>
            <h2 className="apages-modal-title">Create New Page</h2>

            <div className="apages-modal-field">
              <label className="apages-modal-label">Page Slug</label>
              <input
                type="text"
                className="apages-modal-input"
                placeholder="e.g., privacy-policy"
                value={newPageForm.slug}
                onChange={(e) =>
                  setNewPageForm({
                    ...newPageForm,
                    slug: e.target.value
                      .toLowerCase()
                      .trim()
                      .replace(/\s+/g, "-")
                      .replace(/[^a-z0-9-]/g, ""),
                  })
                }
              />
            </div>

            <div className="apages-modal-field">
              <label className="apages-modal-label">Page Title</label>
              <input
                type="text"
                className="apages-modal-input"
                placeholder="e.g., Privacy Policy"
                value={newPageForm.title}
                onChange={(e) =>
                  setNewPageForm({ ...newPageForm, title: e.target.value })
                }
              />
            </div>

            <div className="apages-modal-field">
              <label className="apages-modal-label">Description (Optional)</label>
              <input
                type="text"
                className="apages-modal-input"
                placeholder="Page description"
                value={newPageForm.description}
                onChange={(e) =>
                  setNewPageForm({ ...newPageForm, description: e.target.value })
                }
              />
            </div>

            <div className="apages-modal-actions">
              <button
                className="apages-modal-btn apages-modal-btn-cancel"
                onClick={() => setShowCreateModal(false)}
                disabled={creating}
              >
                Cancel
              </button>
              <button
                className="apages-modal-btn apages-modal-btn-primary"
                onClick={handleCreatePage}
                disabled={creating}
              >
                {creating ? "Creating..." : "Create Page"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}