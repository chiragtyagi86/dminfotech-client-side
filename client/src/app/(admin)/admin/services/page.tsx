"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";

type Service = {
  id:         number;
  title:      string;
  slug:       string;
  short_desc: string;
  icon:       string;
  status:     string;
  sort_order: number;
  created_at: string;
};

export default function AdminServicesPage() {
  const [services, setServices] = useState<Service[]>([]);
  const [loading,  setLoading]  = useState(true);
  const [error,    setError]    = useState("");
  const [deleting, setDeleting] = useState<string | null>(null);

  const fetchServices = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const res  = await fetch("/api/admin/services");
      const json = await res.json();
      if (!res.ok) throw new Error(json.message || "Failed to load.");
      setServices(json.data);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchServices(); }, [fetchServices]);

  async function handleDelete(slug: string) {
    if (!confirm("Delete this service? This cannot be undone.")) return;
    setDeleting(slug);
    try {
      const res = await fetch(`/api/admin/services/${slug}`, { method: "DELETE" });
      if (!res.ok) { const j = await res.json(); alert(j.message || "Delete failed."); return; }
      setServices(prev => prev.filter(s => s.slug !== slug));
    } catch {
      alert("Network error. Please try again.");
    } finally {
      setDeleting(null);
    }
  }

  async function moveOrder(idx: number, dir: "up" | "down") {
    const updated = [...services];
    const swapIdx = dir === "up" ? idx - 1 : idx + 1;
    [updated[idx], updated[swapIdx]] = [updated[swapIdx], updated[idx]];
    setServices(updated);

    // Persist new order for both swapped items
    try {
      await Promise.all([
        fetch(`/api/admin/services/${updated[idx].slug}`,     { method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ ...updated[idx],     order: idx + 1 }) }),
        fetch(`/api/admin/services/${updated[swapIdx].slug}`, { method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ ...updated[swapIdx], order: swapIdx + 1 }) }),
      ]);
    } catch {
      // Revert on failure
      fetchServices();
    }
  }

  return (
    <div className="asvc-root">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@300;400;600&family=DM+Sans:wght@300;400;500&display=swap');
        .asvc-root { display:flex; flex-direction:column; gap:24px; animation:asvcFade 0.4s ease both; }
        @keyframes asvcFade { from{opacity:0;transform:translateY(8px)} to{opacity:1;transform:translateY(0)} }
        .asvc-topbar { display:flex; align-items:center; gap:12px; flex-wrap:wrap; }
        .asvc-heading { font-family:'Cormorant Garamond',serif; font-size:28px; font-weight:400; color:#3a405a; flex:1; }
        .asvc-count { font-family:'DM Sans',sans-serif; font-size:12px; font-weight:300; color:rgba(104,80,68,0.45); }
        .asvc-new-btn {
          display:inline-flex; align-items:center; gap:7px; padding:9px 18px; border-radius:9px;
          background:#3a405a; color:#f9dec9; font-family:'DM Sans',sans-serif; font-size:12px; font-weight:500;
          letter-spacing:0.08em; text-transform:uppercase; text-decoration:none;
          transition:transform 0.2s ease, box-shadow 0.2s ease; white-space:nowrap;
        }
        .asvc-new-btn:hover { transform:translateY(-1px); box-shadow:0 6px 18px rgba(58,64,90,0.18); }
        .asvc-hint {
          font-family:'DM Sans',sans-serif; font-size:12px; font-weight:300;
          color:rgba(104,80,68,0.45); background:rgba(153,178,221,0.08);
          border:1px solid rgba(153,178,221,0.18); border-radius:9px; padding:10px 16px;
        }
        .asvc-table-wrap { background:#ffffff; border:1px solid rgba(104,80,68,0.09); border-radius:16px; overflow:hidden; }
        .asvc-table { width:100%; border-collapse:collapse; }
        .asvc-th {
          font-family:'DM Sans',sans-serif; font-size:9.5px; font-weight:500;
          letter-spacing:0.18em; text-transform:uppercase; color:rgba(104,80,68,0.45);
          padding:13px 18px; text-align:left; background:rgba(104,80,68,0.03);
          border-bottom:1px solid rgba(104,80,68,0.08); white-space:nowrap;
        }
        .asvc-tr { border-bottom:1px solid rgba(104,80,68,0.06); transition:background 0.15s ease; }
        .asvc-tr:last-child { border-bottom:none; }
        .asvc-tr:hover { background:rgba(104,80,68,0.02); }
        .asvc-td { padding:14px 18px; vertical-align:middle; }
        .asvc-order-cell { display:flex; align-items:center; gap:4px; }
        .asvc-order-num { font-family:'Cormorant Garamond',serif; font-size:16px; font-weight:300; color:rgba(104,80,68,0.45); width:28px; text-align:center; }
        .asvc-order-btn {
          width:24px; height:24px; border-radius:6px; border:1px solid rgba(104,80,68,0.12);
          background:transparent; cursor:pointer; font-size:10px; color:rgba(104,80,68,0.50);
          display:flex; align-items:center; justify-content:center; transition:background 0.2s ease;
        }
        .asvc-order-btn:hover:not(:disabled) { background:rgba(104,80,68,0.08); color:#3a405a; }
        .asvc-order-btn:disabled { opacity:0.25; cursor:not-allowed; }
        .asvc-title { font-family:'DM Sans',sans-serif; font-size:13.5px; font-weight:400; color:#3a405a; margin-bottom:2px; }
        .asvc-slug  { font-family:'DM Sans',sans-serif; font-size:11px; font-weight:300; color:rgba(104,80,68,0.40); }
        .asvc-badge {
          display:inline-flex; align-items:center; padding:3px 10px; border-radius:100px;
          font-family:'DM Sans',sans-serif; font-size:10px; font-weight:500;
          letter-spacing:0.08em; text-transform:uppercase;
        }
        .asvc-badge-active   { background:rgba(100,180,100,0.10); color:#3a7a3a; border:1px solid rgba(100,180,100,0.20); }
        .asvc-badge-inactive { background:rgba(192,57,43,0.06);   color:#c0392b; border:1px solid rgba(192,57,43,0.14); }
        .asvc-actions-cell { display:flex; align-items:center; gap:6px; }
        .asvc-act-btn {
          padding:6px 12px; border-radius:7px; font-family:'DM Sans',sans-serif; font-size:11.5px; font-weight:400;
          cursor:pointer; text-decoration:none; border:1px solid transparent;
          transition:background 0.2s ease, color 0.2s ease; display:inline-flex; align-items:center; white-space:nowrap;
        }
        .asvc-act-edit { background:rgba(58,64,90,0.06); color:#3a405a; border-color:rgba(58,64,90,0.10); }
        .asvc-act-edit:hover { background:#3a405a; color:#f9dec9; }
        .asvc-act-del  { background:rgba(192,57,43,0.06); color:#c0392b; border-color:rgba(192,57,43,0.12); }
        .asvc-act-del:hover { background:#c0392b; color:white; }
        .asvc-act-del:disabled { opacity:0.5; cursor:not-allowed; }
        .asvc-empty  { text-align:center; padding:48px; font-family:'DM Sans',sans-serif; font-size:13px; font-weight:300; color:rgba(104,80,68,0.40); }
        .asvc-error  { padding:12px 16px; border-radius:10px; background:rgba(192,57,43,0.06); border:1px solid rgba(192,57,43,0.14); color:#c0392b; font-family:'DM Sans',sans-serif; font-size:13px; }
        .asvc-loading { text-align:center; padding:48px; font-family:'DM Sans',sans-serif; font-size:13px; color:rgba(104,80,68,0.45); }
        @media(max-width:768px){ .asvc-col-status{ display:none; } }
      `}</style>

      <div className="asvc-topbar">
        <h1 className="asvc-heading">Services</h1>
        <span className="asvc-count">{services.length} services</span>
        <Link href="/admin/services/new" className="asvc-new-btn">+ New Service</Link>
      </div>

      <p className="asvc-hint">↕ Use arrow buttons to reorder. Order controls how services appear on the frontend.</p>

      {error && <p className="asvc-error">⚠ {error}</p>}

      <div className="asvc-table-wrap">
        {loading ? (
          <p className="asvc-loading">Loading services…</p>
        ) : services.length === 0 ? (
          <p className="asvc-empty">No services yet. Create your first service!</p>
        ) : (
          <table className="asvc-table">
            <thead>
              <tr>
                <th className="asvc-th">Order</th>
                <th className="asvc-th">Title / Slug</th>
                <th className="asvc-th asvc-col-status">Status</th>
                <th className="asvc-th">Actions</th>
              </tr>
            </thead>
            <tbody>
              {services.map((svc, idx) => (
                <tr key={svc.slug} className="asvc-tr">
                  <td className="asvc-td">
                    <div className="asvc-order-cell">
                      <div style={{ display:"flex", flexDirection:"column", gap:2 }}>
                        <button className="asvc-order-btn" onClick={() => moveOrder(idx, "up")}
                          disabled={idx === 0} title="Move up">▲</button>
                        <button className="asvc-order-btn" onClick={() => moveOrder(idx, "down")}
                          disabled={idx === services.length - 1} title="Move down">▼</button>
                      </div>
                      <span className="asvc-order-num">{String(idx + 1).padStart(2, "0")}</span>
                    </div>
                  </td>
                  <td className="asvc-td">
                    <div className="asvc-title">{svc.title}</div>
                    <div className="asvc-slug">/{svc.slug}</div>
                  </td>
                  <td className="asvc-td asvc-col-status">
                    <span className={`asvc-badge ${svc.status === "published" ? "asvc-badge-active" : "asvc-badge-inactive"}`}>
                      {svc.status === "published" ? "active" : "inactive"}
                    </span>
                  </td>
                  <td className="asvc-td">
                    <div className="asvc-actions-cell">
                      <Link href={`/admin/services/edit/${svc.slug}`} className="asvc-act-btn asvc-act-edit">Edit</Link>
                      <button className="asvc-act-btn asvc-act-del"
                        onClick={() => handleDelete(svc.slug)} disabled={deleting === svc.slug}>
                        {deleting === svc.slug ? "…" : "Delete"}
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