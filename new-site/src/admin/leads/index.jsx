// src/admin/leads/index.jsx
import { useEffect, useMemo, useState } from "react";
import { adminApi } from "../../lib/api";

const TABS = ["all", "new", "contacted", "converted", "rejected"];
const STATUS_OPTIONS = ["new", "contacted", "converted", "rejected"];

const STATUS_BG = {
  new: "rgba(153,178,221,0.15)",
  contacted: "rgba(249,222,201,0.40)",
  converted: "rgba(39,174,96,0.10)",
  rejected: "rgba(192,57,43,0.10)",
};

const STATUS_COL = {
  new: "#3a405a",
  contacted: "#8b5e3c",
  converted: "#27ae60",
  rejected: "#c0392b",
};

function formatDate(date) {
  if (!date) return "—";
  const d = new Date(date);
  if (Number.isNaN(d.getTime())) return "—";
  return d.toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

export default function LeadsPage() {
  const [leads, setLeads] = useState([]);
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState("all");
  const [search, setSearch] = useState("");
  const [viewing, setViewing] = useState(null);
  const [error, setError] = useState("");
  const [deletingId, setDeletingId] = useState(null);
  const [updatingStatusId, setUpdatingStatusId] = useState(null);

  useEffect(() => {
    fetchLeads();
  }, [tab, search]);

  async function fetchLeads() {
    setLoading(true);
    setError("");

    try {
      const params = {};
      if (tab !== "all") params.status = tab;
      if (search.trim()) params.search = search.trim();

      const res = await adminApi.getLeads(params);
      const payload = res?.data ?? res ?? [];
      setLeads(Array.isArray(payload) ? payload : []);
    } catch (e) {
      console.error(e);
      setError(e?.message || "Failed to load leads.");
      setLeads([]);
    } finally {
      setLoading(false);
    }
  }

  async function handleDelete(id) {
    if (!window.confirm("Delete this lead?")) return;

    try {
      setDeletingId(id);
      await adminApi.deleteLead(id);

      setLeads((prev) => prev.filter((x) => x.id !== id));
      setViewing((prev) => (prev?.id === id ? null : prev));
    } catch (e) {
      console.error(e);
      alert(e?.message || "Failed to delete lead.");
    } finally {
      setDeletingId(null);
    }
  }

  async function updateStatus(id, status) {
    try {
      setUpdatingStatusId(id);

      const current = leads.find((x) => x.id === id) || viewing || {};
      const payload = {
        ...current,
        status,
      };

      await adminApi.updateLead(id, payload);

      setLeads((prev) =>
        prev.map((x) => (x.id === id ? { ...x, status } : x))
      );

      setViewing((prev) =>
        prev?.id === id ? { ...prev, status } : prev
      );
    } catch (e) {
      console.error(e);
      alert(e?.message || "Failed to update lead.");
    } finally {
      setUpdatingStatusId(null);
    }
  }

  const tableContent = useMemo(() => {
    if (loading) {
      return (
        <tr>
          <td colSpan={6} className="ld-empty">
            Loading…
          </td>
        </tr>
      );
    }

    if (error) {
      return (
        <tr>
          <td colSpan={6} className="ld-empty" style={{ color: "#c0392b" }}>
            {error}
          </td>
        </tr>
      );
    }

    if (leads.length === 0) {
      return (
        <tr>
          <td colSpan={6} className="ld-empty">
            No leads found.
          </td>
        </tr>
      );
    }

    return leads.map((lead) => {
      const status = lead.status || "new";

      return (
        <tr key={lead.id}>
          <td style={{ fontWeight: 400 }}>{lead.name || "—"}</td>
          <td style={{ color: "rgba(104,80,68,0.55)" }}>{lead.email || "—"}</td>
          <td style={{ color: "rgba(104,80,68,0.45)", fontSize: 12 }}>
            {lead.service || "—"}
          </td>
          <td style={{ color: "rgba(104,80,68,0.45)", fontSize: 12 }}>
            {formatDate(lead.createdAt || lead.created_at)}
          </td>
          <td>
            <span
              className="ld-badge"
              style={{
                background:
                  STATUS_BG[status] || "rgba(104,80,68,0.06)",
                color: STATUS_COL[status] || "#3a405a",
              }}
            >
              {status}
            </span>
          </td>
          <td>
            <button className="ld-view-btn" onClick={() => setViewing(lead)}>
              View
            </button>
          </td>
        </tr>
      );
    });
  }, [loading, error, leads]);

  return (
    <div className="ld-root">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@300;400;600&family=DM+Sans:wght@300;400;500&display=swap');
        *{box-sizing:border-box;}
        .ld-root{display:flex;flex-direction:column;gap:24px;animation:ldFade 0.4s ease both;}
        @keyframes ldFade{from{opacity:0;transform:translateY(8px)}to{opacity:1;transform:translateY(0)}}
        .ld-heading{font-family:'Cormorant Garamond',serif;font-size:32px;font-weight:400;color:#3a405a;margin:0;}
        .ld-toolbar{display:flex;gap:10px;flex-wrap:wrap;align-items:center;}
        .ld-search{flex:1;min-width:200px;padding:10px 14px;border-radius:10px;border:1px solid rgba(104,80,68,0.14);background:#fdfaf8;font-family:'DM Sans',sans-serif;font-size:13px;color:#3a405a;outline:none;}
        .ld-tab{padding:8px 16px;border-radius:8px;border:1px solid rgba(104,80,68,0.14);background:#ffffff;font-family:'DM Sans',sans-serif;font-size:11px;font-weight:400;color:rgba(104,80,68,0.55);cursor:pointer;transition:all 0.15s;text-transform:capitalize;}
        .ld-tab.active{background:#3a405a;color:#f9dec9;border-color:#3a405a;}
        .ld-table{background:#ffffff;border:1px solid rgba(104,80,68,0.09);border-radius:16px;overflow:hidden;}
        .ld-table-wrap{overflow-x:auto;}
        .ld-table table{width:100%;border-collapse:collapse;min-width:760px;}
        .ld-table th{font-family:'DM Sans',sans-serif;font-size:9.5px;font-weight:500;letter-spacing:0.16em;text-transform:uppercase;color:rgba(104,80,68,0.40);padding:14px 20px;text-align:left;border-bottom:1px solid rgba(104,80,68,0.07);background:#fdfaf8;}
        .ld-table td{font-family:'DM Sans',sans-serif;font-size:13px;font-weight:300;color:#3a405a;padding:14px 20px;border-bottom:1px solid rgba(104,80,68,0.06);vertical-align:middle;}
        .ld-table tr:last-child td{border-bottom:none;}
        .ld-table tr:hover td{background:rgba(104,80,68,0.015);}
        .ld-badge{display:inline-block;padding:3px 10px;border-radius:20px;font-family:'DM Sans',sans-serif;font-size:10.5px;font-weight:500;text-transform:capitalize;}
        .ld-view-btn{padding:6px 14px;border-radius:7px;border:1px solid rgba(104,80,68,0.14);background:#fdfaf8;font-family:'DM Sans',sans-serif;font-size:11px;color:#3a405a;cursor:pointer;}
        .ld-view-btn:hover{background:#f7f1ee;}
        .ld-empty{text-align:center;padding:60px 20px;font-family:'DM Sans',sans-serif;font-size:14px;font-weight:300;color:rgba(104,80,68,0.40);}

        .ld-overlay{position:fixed;inset:0;background:rgba(0,0,0,0.35);z-index:200;display:flex;align-items:center;justify-content:center;padding:20px;}
        .ld-modal{background:#ffffff;border-radius:20px;padding:36px;max-width:560px;width:100%;max-height:90vh;overflow-y:auto;position:relative;box-shadow:0 20px 60px rgba(0,0,0,0.15);}
        .ld-modal-close{position:absolute;top:16px;right:16px;background:none;border:none;font-size:20px;cursor:pointer;color:rgba(104,80,68,0.40);}
        .ld-modal-name{font-family:'Cormorant Garamond',serif;font-size:24px;font-weight:400;color:#3a405a;margin:0 0 4px;}
        .ld-modal-email{font-family:'DM Sans',sans-serif;font-size:13px;font-weight:300;color:rgba(104,80,68,0.55);margin:0 0 20px;}
        .ld-modal-field{margin-bottom:16px;}
        .ld-modal-label{font-family:'DM Sans',sans-serif;font-size:9.5px;font-weight:500;letter-spacing:0.14em;text-transform:uppercase;color:rgba(104,80,68,0.40);margin:0 0 4px;}
        .ld-modal-val{font-family:'DM Sans',sans-serif;font-size:13px;font-weight:300;color:#3a405a;white-space:pre-wrap;line-height:1.7;}
        .ld-modal-actions{display:flex;gap:10px;margin-top:24px;flex-wrap:wrap;}
        .ld-status-sel{padding:9px 14px;border-radius:10px;border:1px solid rgba(104,80,68,0.14);background:#fdfaf8;font-family:'DM Sans',sans-serif;font-size:13px;color:#3a405a;outline:none;flex:1;}
        .ld-del-btn{padding:9px 20px;border-radius:10px;border:1px solid rgba(192,57,43,0.18);background:rgba(192,57,43,0.05);font-family:'DM Sans',sans-serif;font-size:12px;color:#c0392b;cursor:pointer;}
        .ld-del-btn:disabled,.ld-status-sel:disabled{opacity:0.65;cursor:not-allowed;}

        @media (max-width: 768px){
          .ld-modal{padding:24px;}
        }
      `}</style>

      <h1 className="ld-heading">Leads</h1>

      <div className="ld-toolbar">
        <input
          className="ld-search"
          placeholder="Search by name or email…"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

        {TABS.map((t) => (
          <button
            key={t}
            className={`ld-tab${tab === t ? " active" : ""}`}
            onClick={() => setTab(t)}
          >
            {t}
          </button>
        ))}
      </div>

      <div className="ld-table">
        <div className="ld-table-wrap">
          <table>
            <thead>
              <tr>
                <th>Name</th>
                <th>Email</th>
                <th>Service</th>
                <th>Date</th>
                <th>Status</th>
                <th></th>
              </tr>
            </thead>
            <tbody>{tableContent}</tbody>
          </table>
        </div>
      </div>

      {viewing && (
        <div className="ld-overlay" onClick={() => setViewing(null)}>
          <div className="ld-modal" onClick={(e) => e.stopPropagation()}>
            <button className="ld-modal-close" onClick={() => setViewing(null)}>
              ×
            </button>

            <p className="ld-modal-name">{viewing.name || "Lead"}</p>
            <p className="ld-modal-email">{viewing.email || "—"}</p>

            {[
              ["Phone", viewing.phone],
              ["Service", viewing.service],
              ["Budget", viewing.budget],
              ["Timeline", viewing.timeline],
              ["Date", formatDate(viewing.createdAt || viewing.created_at)],
            ]
              .filter(([, v]) => v)
              .map(([label, val]) => (
                <div key={label} className="ld-modal-field">
                  <p className="ld-modal-label">{label}</p>
                  <p className="ld-modal-val">{val}</p>
                </div>
              ))}

            {viewing.message && (
              <div className="ld-modal-field">
                <p className="ld-modal-label">Message</p>
                <p className="ld-modal-val">{viewing.message}</p>
              </div>
            )}

            <div className="ld-modal-actions">
              <select
                className="ld-status-sel"
                value={viewing.status || "new"}
                disabled={updatingStatusId === viewing.id}
                onChange={(e) => updateStatus(viewing.id, e.target.value)}
              >
                {STATUS_OPTIONS.map((s) => (
                  <option key={s} value={s}>
                    {s}
                  </option>
                ))}
              </select>

              <button
                className="ld-del-btn"
                disabled={deletingId === viewing.id}
                onClick={() => handleDelete(viewing.id)}
              >
                {deletingId === viewing.id ? "Deleting…" : "Delete"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}