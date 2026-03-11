// src/admin/careers/index.jsx
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { adminApi } from "../../lib/api";

export default function AdminCareersPage() {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [updatingId, setUpdatingId] = useState(null);
  const [deletingId, setDeletingId] = useState(null);

  useEffect(() => {
    loadJobs();
  }, []);

  async function loadJobs() {
    try {
      setLoading(true);
      setError("");

      const res = await adminApi.getAdminJobs();
      const payload = res?.data ?? res ?? {};
      const list = Array.isArray(payload) ? payload : payload.jobs || [];

      setJobs(list);
    } catch (err) {
      console.error(err);
      setError(err?.message || "Failed to load jobs.");
      setJobs([]);
    } finally {
      setLoading(false);
    }
  }

  async function toggleStatus(job) {
    const nextStatus = job.status === "open" ? "closed" : "open";

    try {
      setUpdatingId(job.id);
      await adminApi.patchJobStatus(job.id, nextStatus);

      setJobs((prev) =>
        prev.map((item) =>
          item.id === job.id
            ? {
                ...item,
                status: nextStatus,
              }
            : item
        )
      );
    } catch (err) {
      console.error(err);
      alert(err?.message || "Failed to update status");
    } finally {
      setUpdatingId(null);
    }
  }

  async function handleDelete(id) {
    if (!window.confirm("Delete this job?")) return;

    try {
      setDeletingId(id);
      await adminApi.deleteJob(id);
      setJobs((prev) => prev.filter((item) => item.id !== id));
    } catch (err) {
      console.error(err);
      alert(err?.message || "Failed to delete");
    } finally {
      setDeletingId(null);
    }
  }

  return (
    <div className="cr-root">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@300;400;600&family=DM+Sans:wght@300;400;500&display=swap');
        .cr-root{display:flex;flex-direction:column;gap:24px;animation:crFade 0.4s ease both;}
        @keyframes crFade{from{opacity:0;transform:translateY(8px)}to{opacity:1;transform:translateY(0)}}
        .cr-topbar{display:flex;align-items:center;gap:12px;flex-wrap:wrap;}
        .cr-heading{font-family:'Cormorant Garamond',serif;font-size:32px;font-weight:400;color:#3a405a;margin:0;flex:1;}
        .cr-new{padding:10px 20px;border-radius:10px;border:none;background:#3a405a;color:#f9dec9;font-family:'DM Sans',sans-serif;font-size:11.5px;font-weight:500;letter-spacing:0.09em;text-transform:uppercase;text-decoration:none;}
        .cr-table{background:#ffffff;border:1px solid rgba(104,80,68,0.09);border-radius:16px;overflow:hidden;}
        .cr-table-wrap{overflow-x:auto;}
        .cr-table table{width:100%;border-collapse:collapse;min-width:920px;}
        .cr-table th{font-family:'DM Sans',sans-serif;font-size:9.5px;font-weight:500;letter-spacing:0.16em;text-transform:uppercase;color:rgba(104,80,68,0.40);padding:14px 20px;text-align:left;border-bottom:1px solid rgba(104,80,68,0.07);background:#fdfaf8;}
        .cr-table td{font-family:'DM Sans',sans-serif;font-size:13px;font-weight:300;color:#3a405a;padding:16px 20px;border-bottom:1px solid rgba(104,80,68,0.06);vertical-align:middle;}
        .cr-table tr:last-child td{border-bottom:none;}
        .cr-badge{display:inline-block;padding:3px 10px;border-radius:20px;font-family:'DM Sans',sans-serif;font-size:10.5px;font-weight:500;cursor:pointer;border:none;}
        .cr-badge:disabled{opacity:0.65;cursor:not-allowed;}
        .cr-badge.open{background:rgba(39,174,96,0.10);color:#27ae60;}
        .cr-badge.closed{background:rgba(104,80,68,0.08);color:rgba(104,80,68,0.50);}
        .cr-actions{display:flex;gap:8px;flex-wrap:wrap;}
        .cr-btn{padding:6px 14px;border-radius:7px;border:1px solid rgba(104,80,68,0.14);background:#fdfaf8;font-family:'DM Sans',sans-serif;font-size:11px;color:#3a405a;text-decoration:none;cursor:pointer;}
        .cr-del{padding:6px 14px;border-radius:7px;border:1px solid rgba(192,57,43,0.18);background:rgba(192,57,43,0.05);font-family:'DM Sans',sans-serif;font-size:11px;color:#c0392b;cursor:pointer;}
        .cr-del:disabled{opacity:0.65;cursor:not-allowed;}
        .cr-apps{padding:6px 14px;border-radius:7px;border:1px solid rgba(153,178,221,0.25);background:rgba(153,178,221,0.07);font-family:'DM Sans',sans-serif;font-size:11px;color:#3a405a;text-decoration:none;}
        .cr-empty{text-align:center;padding:60px 20px;font-family:'DM Sans',sans-serif;font-size:14px;font-weight:300;color:rgba(104,80,68,0.40);}
        .cr-error{color:#c0392b;}
      `}</style>

      <div className="cr-topbar">
        <h1 className="cr-heading">Careers</h1>
        <Link to="/admin/careers/new" className="cr-new">
          + New Job
        </Link>
      </div>

      <div className="cr-table">
        <div className="cr-table-wrap">
          <table>
            <thead>
              <tr>
                <th>Title</th>
                <th>Department</th>
                <th>Location</th>
                <th>Type</th>
                <th>Applications</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>

            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={7} className="cr-empty">Loading…</td>
                </tr>
              ) : error ? (
                <tr>
                  <td colSpan={7} className="cr-empty cr-error">{error}</td>
                </tr>
              ) : jobs.length === 0 ? (
                <tr>
                  <td colSpan={7} className="cr-empty">No jobs posted yet.</td>
                </tr>
              ) : (
                jobs.map((job) => (
                  <tr key={job.id}>
                    <td style={{ fontWeight: 400 }}>{job.title}</td>
                    <td style={{ color: "rgba(104,80,68,0.50)" }}>{job.department || "—"}</td>
                    <td style={{ color: "rgba(104,80,68,0.50)" }}>
                      {job.location || "—"}
                      {job.location_type ? ` (${job.location_type})` : ""}
                    </td>
                    <td style={{ color: "rgba(104,80,68,0.50)", textTransform: "capitalize" }}>
                      {job.job_type || "—"}
                    </td>
                    <td style={{ color: "rgba(104,80,68,0.50)" }}>
                      {job._applicationCount ?? 0}
                    </td>
                    <td>
                      <button
                        type="button"
                        className={`cr-badge ${job.status === "open" ? "open" : "closed"}`}
                        onClick={() => toggleStatus(job)}
                        disabled={updatingId === job.id}
                        title="Click to toggle"
                      >
                        {updatingId === job.id
                          ? "Updating..."
                          : job.status === "open"
                          ? "Open"
                          : "Closed"}
                      </button>
                    </td>
                    <td>
                      <div className="cr-actions">
                        <Link to={`/admin/careers/${job.id}`} className="cr-btn">
                          Edit
                        </Link>
                        <Link to={`/admin/careers/${job.id}/applications`} className="cr-apps">
                          Applications
                        </Link>
                        <button
                          className="cr-del"
                          onClick={() => handleDelete(job.id)}
                          disabled={deletingId === job.id}
                        >
                          {deletingId === job.id ? "Deleting..." : "Delete"}
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