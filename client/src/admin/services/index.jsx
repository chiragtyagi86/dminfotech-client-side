// src/admin/services/index.jsx
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { adminApi } from "../../lib/api";

function getServicesList(payload) {
  if (Array.isArray(payload)) return payload;
  if (Array.isArray(payload?.services)) return payload.services;
  if (Array.isArray(payload?.items)) return payload.items;
  if (Array.isArray(payload?.rows)) return payload.rows;
  return [];
}

function normalizeService(service = {}) {
  return {
    ...service,
    id: service.id ?? service.service_id ?? service.slug,
    title: service.title ?? "",
    slug: service.slug ?? "",
    sort_order: service.sort_order ?? service.order ?? 0,
    published:
      typeof service.published === "boolean"
        ? service.published
        : service.status === "published" || service.status === "active",
    status: service.status ?? (service.published ? "published" : "draft"),
  };
}

export default function AdminServicesPage() {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [deletingSlug, setDeletingSlug] = useState(null);

  useEffect(() => {
    loadServices();
  }, []);

  async function loadServices() {
    try {
      setLoading(true);
      setError("");

      const res = await adminApi.getServices();
      const payload = res?.data ?? res ?? {};
      const list = getServicesList(payload)
        .map(normalizeService)
        .sort((a, b) => (a.sort_order ?? 0) - (b.sort_order ?? 0));

      setServices(list);
    } catch (err) {
      console.error(err);
      setError(err?.message || "Failed to load services.");
      setServices([]);
    } finally {
      setLoading(false);
    }
  }

  async function move(index, dir) {
    const swap = index + dir;
    if (swap < 0 || swap >= services.length) return;

    const next = [...services];
    [next[index], next[swap]] = [next[swap], next[index]];

    const reordered = next.map((item, i) => ({
      ...item,
      sort_order: i + 1,
    }));

    setServices(reordered);
    setSaving(true);

    try {
      await Promise.all(
        reordered.map((svc) =>
          adminApi.updateService(svc.slug, {
            ...svc,
            sort_order: svc.sort_order,
          })
        )
      );
    } catch (e) {
      console.error(e);
      setError(e?.message || "Failed to save order.");
      await loadServices();
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete(slug) {
    if (!window.confirm("Delete this service?")) return;

    try {
      setDeletingSlug(slug);
      await adminApi.deleteService(slug);
      setServices((prev) => prev.filter((item) => item.slug !== slug));
    } catch (err) {
      console.error(err);
      alert(err?.message || "Failed to delete");
    } finally {
      setDeletingSlug(null);
    }
  }

  return (
    <div className="sv-root">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@300;400;600&family=DM+Sans:wght@300;400;500&display=swap');
        .sv-root{display:flex;flex-direction:column;gap:24px;animation:svFade 0.4s ease both;}
        @keyframes svFade{from{opacity:0;transform:translateY(8px)}to{opacity:1;transform:translateY(0)}}
        .sv-topbar{display:flex;align-items:center;gap:12px;flex-wrap:wrap;}
        .sv-heading{font-family:'Cormorant Garamond',serif;font-size:32px;font-weight:400;color:#3a405a;margin:0;flex:1;}
        .sv-new{padding:10px 20px;border-radius:10px;border:none;background:#3a405a;color:#f9dec9;font-family:'DM Sans',sans-serif;font-size:11.5px;font-weight:500;letter-spacing:0.09em;text-transform:uppercase;text-decoration:none;}
        .sv-table{background:#ffffff;border:1px solid rgba(104,80,68,0.09);border-radius:16px;overflow:hidden;}
        .sv-table-wrap{overflow-x:auto;}
        .sv-table table{width:100%;border-collapse:collapse;min-width:760px;}
        .sv-table th{font-family:'DM Sans',sans-serif;font-size:9.5px;font-weight:500;letter-spacing:0.16em;text-transform:uppercase;color:rgba(104,80,68,0.40);padding:14px 20px;text-align:left;border-bottom:1px solid rgba(104,80,68,0.07);background:#fdfaf8;}
        .sv-table td{font-family:'DM Sans',sans-serif;font-size:13px;font-weight:300;color:#3a405a;padding:16px 20px;border-bottom:1px solid rgba(104,80,68,0.06);vertical-align:middle;}
        .sv-table tr:last-child td{border-bottom:none;}
        .sv-order-btns{display:flex;gap:4px;}
        .sv-order-btn{width:28px;height:28px;border-radius:6px;border:1px solid rgba(104,80,68,0.12);background:#fdfaf8;cursor:pointer;font-size:13px;display:flex;align-items:center;justify-content:center;}
        .sv-order-btn:disabled{opacity:0.30;cursor:default;}
        .sv-actions{display:flex;gap:8px;flex-wrap:wrap;}
        .sv-edit{padding:6px 14px;border-radius:7px;border:1px solid rgba(104,80,68,0.14);background:#fdfaf8;font-family:'DM Sans',sans-serif;font-size:11px;color:#3a405a;text-decoration:none;}
        .sv-del{padding:6px 14px;border-radius:7px;border:1px solid rgba(192,57,43,0.18);background:rgba(192,57,43,0.05);font-family:'DM Sans',sans-serif;font-size:11px;color:#c0392b;cursor:pointer;}
        .sv-del:disabled{opacity:0.65;cursor:not-allowed;}
        .sv-badge{display:inline-block;padding:3px 10px;border-radius:20px;font-family:'DM Sans',sans-serif;font-size:10.5px;font-weight:500;}
        .sv-badge.pub{background:rgba(39,174,96,0.10);color:#27ae60;}
        .sv-badge.dft{background:rgba(104,80,68,0.08);color:rgba(104,80,68,0.50);}
        .sv-empty{text-align:center;padding:60px 20px;font-family:'DM Sans',sans-serif;font-size:14px;font-weight:300;color:rgba(104,80,68,0.40);}
        .sv-error{color:#c0392b;}
      `}</style>

      <div className="sv-topbar">
        <h1 className="sv-heading">
          Services
          {saving && (
            <span
              style={{
                fontFamily: "'DM Sans',sans-serif",
                fontSize: 12,
                fontWeight: 300,
                color: "rgba(104,80,68,0.40)",
                marginLeft: 10,
              }}
            >
              Saving order…
            </span>
          )}
        </h1>
        <Link to="/admin/services/new" className="sv-new">
          + New Service
        </Link>
      </div>

      <div className="sv-table">
        <div className="sv-table-wrap">
          <table>
            <thead>
              <tr>
                <th>Order</th>
                <th>Title</th>
                <th>Slug</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={5} className="sv-empty">Loading…</td>
                </tr>
              ) : error ? (
                <tr>
                  <td colSpan={5} className="sv-empty sv-error">{error}</td>
                </tr>
              ) : services.length === 0 ? (
                <tr>
                  <td colSpan={5} className="sv-empty">No services yet.</td>
                </tr>
              ) : (
                services.map((svc, i) => (
                  <tr key={svc.slug ?? svc.id}>
                    <td>
                      <div className="sv-order-btns">
                        <button className="sv-order-btn" disabled={i === 0 || saving} onClick={() => move(i, -1)}>↑</button>
                        <button className="sv-order-btn" disabled={i === services.length - 1 || saving} onClick={() => move(i, 1)}>↓</button>
                      </div>
                    </td>
                    <td style={{ fontWeight: 400 }}>{svc.title}</td>
                    <td style={{ color: "rgba(104,80,68,0.45)", fontSize: 12 }}>{svc.slug}</td>
                    <td>
                      <span className={`sv-badge ${svc.published ? "pub" : "dft"}`}>
                        {svc.published ? "Published" : "Draft"}
                      </span>
                    </td>
                    <td>
                      <div className="sv-actions">
                        <Link to={`/admin/services/edit/${svc.slug}`} className="sv-edit">Edit</Link>
                        <button
                          className="sv-del"
                          onClick={() => handleDelete(svc.slug)}
                          disabled={deletingSlug === svc.slug}
                        >
                          {deletingSlug === svc.slug ? "Deleting..." : "Delete"}
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}