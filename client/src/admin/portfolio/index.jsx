// src/admin/portfolio/index.jsx
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { adminApi } from "../../lib/api";

function getProjectsList(payload) {
  if (Array.isArray(payload)) return payload;
  if (Array.isArray(payload?.projects)) return payload.projects;
  if (Array.isArray(payload?.portfolio)) return payload.portfolio;
  if (Array.isArray(payload?.items)) return payload.items;
  return [];
}

function normalizeProject(item = {}) {
  return {
    ...item,
    id: item.id ?? item.project_id ?? item.slug,
    title: item.title ?? "",
    slug: item.slug ?? "",
    category: item.category ?? item.project_category ?? "",
    year: item.year ?? item.project_year ?? "",
    coverImage: item.coverImage ?? item.cover_image ?? item.image ?? "",
    published:
      typeof item.published === "boolean"
        ? item.published
        : item.status === "published" || item.status === "active" || item.status === "live",
  };
}

export default function AdminPortfolioPage() {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    loadProjects();
  }, []);

  async function loadProjects() {
    try {
      setLoading(true);
      setError("");

      const res = await adminApi.getPortfolio();
      const payload = res?.data ?? res ?? {};
      const list = getProjectsList(payload).map(normalizeProject);

      setProjects(list);
    } catch (err) {
      console.error(err);
      setError(err?.message || "Failed to load portfolio.");
      setProjects([]);
    } finally {
      setLoading(false);
    }
  }

  async function handleDelete(slug) {
    if (!window.confirm("Delete this project?")) return;

    setDeleting(slug);
    try {
      await adminApi.deletePortfolioItem(slug);
      setProjects((prev) => prev.filter((item) => item.slug !== slug));
    } catch (err) {
      console.error(err);
      alert(err?.message || "Failed to delete");
    } finally {
      setDeleting(null);
    }
  }

  return (
    <div className="po-root">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@300;400;600&family=DM+Sans:wght@300;400;500&display=swap');
        .po-root{display:flex;flex-direction:column;gap:24px;animation:poFade 0.4s ease both;}
        @keyframes poFade{from{opacity:0;transform:translateY(8px)}to{opacity:1;transform:translateY(0)}}
        .po-topbar{display:flex;align-items:center;gap:12px;flex-wrap:wrap;}
        .po-heading{font-family:'Cormorant Garamond',serif;font-size:32px;font-weight:400;color:#3a405a;margin:0;flex:1;}
        .po-new{padding:10px 20px;border-radius:10px;border:none;background:#3a405a;color:#f9dec9;font-family:'DM Sans',sans-serif;font-size:11.5px;font-weight:500;letter-spacing:0.09em;text-transform:uppercase;text-decoration:none;}
        .po-grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(280px,1fr));gap:16px;}
        .po-card{background:#ffffff;border:1px solid rgba(104,80,68,0.09);border-radius:16px;overflow:hidden;}
        .po-card-img{width:100%;height:160px;object-fit:cover;background:rgba(104,80,68,0.05);}
        .po-card-body{padding:16px 18px;}
        .po-card-title{font-family:'Cormorant Garamond',serif;font-size:18px;font-weight:400;color:#3a405a;margin:0 0 4px;}
        .po-card-cat{font-family:'DM Sans',sans-serif;font-size:11px;color:rgba(104,80,68,0.45);margin:0 0 14px;}
        .po-card-actions{display:flex;gap:8px;flex-wrap:wrap;}
        .po-edit{padding:6px 14px;border-radius:7px;border:1px solid rgba(104,80,68,0.14);background:#fdfaf8;font-family:'DM Sans',sans-serif;font-size:11px;color:#3a405a;text-decoration:none;}
        .po-del{padding:6px 14px;border-radius:7px;border:1px solid rgba(192,57,43,0.18);background:rgba(192,57,43,0.05);font-family:'DM Sans',sans-serif;font-size:11px;color:#c0392b;cursor:pointer;}
        .po-del:disabled{opacity:0.5;cursor:not-allowed;}
        .po-badge{display:inline-block;padding:3px 10px;border-radius:20px;font-family:'DM Sans',sans-serif;font-size:10px;margin-left:8px;}
        .po-badge.pub{background:rgba(39,174,96,0.10);color:#27ae60;}
        .po-badge.dft{background:rgba(104,80,68,0.08);color:rgba(104,80,68,0.50);}
        .po-empty{text-align:center;padding:60px 20px;font-family:'DM Sans',sans-serif;font-size:14px;font-weight:300;color:rgba(104,80,68,0.40);background:#ffffff;border-radius:16px;border:1px solid rgba(104,80,68,0.09);}
        .po-error{color:#c0392b;}
      `}</style>

      <div className="po-topbar">
        <h1 className="po-heading">Portfolio</h1>
        <Link to="/admin/portfolio/new" className="po-new">
          + New Project
        </Link>
      </div>

      {loading ? (
        <p style={{ fontFamily: "'DM Sans',sans-serif", fontSize: 13, color: "rgba(104,80,68,0.45)" }}>
          Loading…
        </p>
      ) : error ? (
        <div className="po-empty po-error">{error}</div>
      ) : projects.length === 0 ? (
        <div className="po-empty">No projects yet.</div>
      ) : (
        <div className="po-grid">
          {projects.map((p) => (
            <div key={p.slug ?? p.id} className="po-card">
              {p.coverImage ? (
<img
  src={`${import.meta.env.VITE_API_URL}${p.coverImage}`}
  alt={p.title}
  className="po-card-img"
/>              ) : (
                <div className="po-card-img" />
              )}

              <div className="po-card-body">
                <p className="po-card-title">
                  {p.title}
                  <span className={`po-badge ${p.published ? "pub" : "dft"}`}>
                    {p.published ? "Live" : "Draft"}
                  </span>
                </p>

                <p className="po-card-cat">
                  {p.category || "—"}
                  {p.year ? ` · ${p.year}` : ""}
                </p>

                <div className="po-card-actions">
                  <Link to={`/admin/portfolio/edit/${p.slug}`} className="po-edit">
                    Edit
                  </Link>
                  <button
                    className="po-del"
                    disabled={deleting === p.slug}
                    onClick={() => handleDelete(p.slug)}
                  >
                    {deleting === p.slug ? "…" : "Delete"}
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}