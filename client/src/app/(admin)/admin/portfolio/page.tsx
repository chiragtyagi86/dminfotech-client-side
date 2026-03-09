"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";

type Project = {
  id:         number;
  title:      string;
  slug:       string;
  category:   string;
  short_desc: string;
  image:      string;
  status:     string;
  sort_order: number;
  created_at: string;
};

export default function AdminPortfolioPage() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading,  setLoading]  = useState(true);
  const [error,    setError]    = useState("");
  const [deleting, setDeleting] = useState<string | null>(null);

  const fetchProjects = useCallback(async () => {
    setLoading(true); setError("");
    try {
      const res  = await fetch("/api/admin/portfolio");
      const json = await res.json();
      if (!res.ok) throw new Error(json.message || "Failed to load.");
      setProjects(json.data);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchProjects(); }, [fetchProjects]);

  async function handleDelete(slug: string) {
    if (!confirm("Delete this project? This cannot be undone.")) return;
    setDeleting(slug);
    try {
      const res = await fetch(`/api/admin/portfolio/${slug}`, { method: "DELETE" });
      if (!res.ok) { const j = await res.json(); alert(j.message || "Delete failed."); return; }
      setProjects(prev => prev.filter(p => p.slug !== slug));
    } catch {
      alert("Network error. Please try again.");
    } finally {
      setDeleting(null);
    }
  }

  return (
    <div className="apf-root">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@300;400;600&family=DM+Sans:wght@300;400;500&display=swap');
        .apf-root { display:flex; flex-direction:column; gap:24px; animation:apfFade 0.4s ease both; }
        @keyframes apfFade { from{opacity:0;transform:translateY(8px)} to{opacity:1;transform:translateY(0)} }
        .apf-topbar { display:flex; align-items:center; gap:12px; flex-wrap:wrap; }
        .apf-heading { font-family:'Cormorant Garamond',serif; font-size:28px; font-weight:400; color:#3a405a; flex:1; }
        .apf-count { font-family:'DM Sans',sans-serif; font-size:12px; font-weight:300; color:rgba(104,80,68,0.45); }
        .apf-new-btn {
          display:inline-flex; align-items:center; gap:7px; padding:9px 18px; border-radius:9px;
          background:#3a405a; color:#f9dec9; font-family:'DM Sans',sans-serif; font-size:12px; font-weight:500;
          letter-spacing:0.08em; text-transform:uppercase; text-decoration:none;
          transition:transform 0.2s ease, box-shadow 0.2s ease; white-space:nowrap;
        }
        .apf-new-btn:hover { transform:translateY(-1px); box-shadow:0 6px 18px rgba(58,64,90,0.18); }
        .apf-table-wrap { background:#ffffff; border:1px solid rgba(104,80,68,0.09); border-radius:16px; overflow:hidden; }
        .apf-table { width:100%; border-collapse:collapse; }
        .apf-th {
          font-family:'DM Sans',sans-serif; font-size:9.5px; font-weight:500;
          letter-spacing:0.18em; text-transform:uppercase; color:rgba(104,80,68,0.45);
          padding:13px 18px; text-align:left; background:rgba(104,80,68,0.03);
          border-bottom:1px solid rgba(104,80,68,0.08); white-space:nowrap;
        }
        .apf-tr { border-bottom:1px solid rgba(104,80,68,0.06); transition:background 0.15s ease; }
        .apf-tr:last-child { border-bottom:none; }
        .apf-tr:hover { background:rgba(104,80,68,0.02); }
        .apf-td { padding:14px 18px; vertical-align:middle; }
        .apf-title { font-family:'DM Sans',sans-serif; font-size:13.5px; font-weight:400; color:#3a405a; margin-bottom:2px; }
        .apf-slug  { font-family:'DM Sans',sans-serif; font-size:11px; font-weight:300; color:rgba(104,80,68,0.40); }
        .apf-meta  { font-family:'DM Sans',sans-serif; font-size:11.5px; font-weight:300; color:#685044; }
        .apf-badge {
          display:inline-flex; align-items:center; padding:3px 10px; border-radius:100px;
          font-family:'DM Sans',sans-serif; font-size:10px; font-weight:500;
          letter-spacing:0.08em; text-transform:uppercase;
        }
        .apf-badge-published { background:rgba(100,180,100,0.10); color:#3a7a3a; border:1px solid rgba(100,180,100,0.20); }
        .apf-badge-draft     { background:rgba(200,160,60,0.10);  color:#7a5a10; border:1px solid rgba(200,160,60,0.20); }
        .apf-actions { display:flex; align-items:center; gap:6px; }
        .apf-act-btn {
          padding:6px 12px; border-radius:7px; font-family:'DM Sans',sans-serif; font-size:11.5px; font-weight:400;
          cursor:pointer; text-decoration:none; border:1px solid transparent;
          transition:background 0.2s ease, color 0.2s ease; display:inline-flex; align-items:center; white-space:nowrap;
        }
        .apf-act-edit { background:rgba(58,64,90,0.06); color:#3a405a; border-color:rgba(58,64,90,0.10); }
        .apf-act-edit:hover { background:#3a405a; color:#f9dec9; }
        .apf-act-del  { background:rgba(192,57,43,0.06); color:#c0392b; border-color:rgba(192,57,43,0.12); }
        .apf-act-del:hover { background:#c0392b; color:white; }
        .apf-act-del:disabled { opacity:0.5; cursor:not-allowed; }
        .apf-empty  { text-align:center; padding:48px; font-family:'DM Sans',sans-serif; font-size:13px; font-weight:300; color:rgba(104,80,68,0.40); }
        .apf-error  { padding:12px 16px; border-radius:10px; background:rgba(192,57,43,0.06); border:1px solid rgba(192,57,43,0.14); color:#c0392b; font-family:'DM Sans',sans-serif; font-size:13px; }
        .apf-loading { text-align:center; padding:48px; font-family:'DM Sans',sans-serif; font-size:13px; color:rgba(104,80,68,0.45); }
        @media(max-width:768px){ .apf-col-cat{ display:none; } }
      `}</style>

      <div className="apf-topbar">
        <h1 className="apf-heading">Portfolio</h1>
        <span className="apf-count">{projects.length} projects</span>
        <Link href="/admin/portfolio/new" className="apf-new-btn">+ New Project</Link>
      </div>

      {error && <p className="apf-error">⚠ {error}</p>}

      <div className="apf-table-wrap">
        {loading ? (
          <p className="apf-loading">Loading projects…</p>
        ) : projects.length === 0 ? (
          <p className="apf-empty">No projects yet. Create your first project!</p>
        ) : (
          <table className="apf-table">
            <thead>
              <tr>
                <th className="apf-th">Title / Slug</th>
                <th className="apf-th apf-col-cat">Category</th>
                <th className="apf-th">Status</th>
                <th className="apf-th">Actions</th>
              </tr>
            </thead>
            <tbody>
              {projects.map(proj => (
                <tr key={proj.slug} className="apf-tr">
                  <td className="apf-td">
                    <div className="apf-title">{proj.title}</div>
                    <div className="apf-slug">/{proj.slug}</div>
                  </td>
                  <td className="apf-td apf-col-cat">
                    <span className="apf-meta">{proj.category}</span>
                  </td>
                  <td className="apf-td">
                    <span className={`apf-badge ${proj.status === "published" ? "apf-badge-published" : "apf-badge-draft"}`}>
                      {proj.status}
                    </span>
                  </td>
                  <td className="apf-td">
                    <div className="apf-actions">
                      <Link href={`/admin/portfolio/edit/${proj.slug}`} className="apf-act-btn apf-act-edit">Edit</Link>
                      <button className="apf-act-btn apf-act-del"
                        onClick={() => handleDelete(proj.slug)} disabled={deleting === proj.slug}>
                        {deleting === proj.slug ? "…" : "Delete"}
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}