// src/admin/careers/applications.jsx
import { Fragment, useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { adminApi } from "../../lib/api";

const STATUS_OPTIONS = ["New", "Reviewing", "Shortlisted", "Rejected", "Hired"];
const STATUS_COLORS = {
  New: "rgba(153,178,221,0.18)",
  Reviewing: "rgba(249,222,201,0.35)",
  Shortlisted: "rgba(39,174,96,0.10)",
  Rejected: "rgba(192,57,43,0.10)",
  Hired: "rgba(39,174,96,0.20)",
};
const STATUS_TEXT = {
  New: "#3a405a",
  Reviewing: "#8b5e3c",
  Shortlisted: "#27ae60",
  Rejected: "#c0392b",
  Hired: "#1e7e34",
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

export default function ApplicationsPage() {
  const { id } = useParams();
  const [apps, setApps] = useState([]);
  const [job, setJob] = useState(null);
  const [loading, setLoading] = useState(true);
  const [expanded, setExpanded] = useState(null);
  const [error, setError] = useState("");
  const [updatingId, setUpdatingId] = useState(null);

  useEffect(() => {
    let mounted = true;

   async function loadData() {
  try {
    setLoading(true);
    setError("");

    const [appsData, jobData] = await Promise.all([
      adminApi.getApplications(id),
      adminApi.getAdminJob(id),
    ]);

    if (!mounted) return;

    // FIX: ensure apps is always array
    const appsPayload = appsData?.data ?? appsData ?? {};
    const appsList = Array.isArray(appsPayload)
      ? appsPayload
      : appsPayload.applications || appsPayload.apps || [];

    setApps(appsList);

    setJob(jobData?.data ?? jobData ?? null);

  } catch (err) {
    console.error(err);
    if (mounted) {
      setError(err?.message || "Failed to load applications.");
      setApps([]);
      setJob(null);
    }
  } finally {
    if (mounted) setLoading(false);
  }
}

    if (id) loadData();

    return () => {
      mounted = false;
    };
  }, [id]);

  async function updateStatus(appId, status) {
    try {
      setUpdatingId(appId);
      await adminApi.updateApplication(appId, { status });

      setApps((prev) =>
        prev.map((item) => (item.id === appId ? { ...item, status } : item)),
      );
    } catch (err) {
      console.error(err);
      alert(err?.message || "Failed to update status");
    } finally {
      setUpdatingId(null);
    }
  }

  return (
    <div className="ap-root">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@300;400;600&family=DM+Sans:wght@300;400;500&display=swap');
        .ap-root{display:flex;flex-direction:column;gap:24px;animation:apFade 0.4s ease both;}
        @keyframes apFade{from{opacity:0;transform:translateY(8px)}to{opacity:1;transform:translateY(0)}}
        .ap-topbar{display:flex;align-items:center;gap:12px;flex-wrap:wrap;}
        .ap-heading{font-family:'Cormorant Garamond',serif;font-size:28px;font-weight:400;color:#3a405a;margin:0;flex:1;}
        .ap-job-tag{font-family:'DM Sans',sans-serif;font-size:11px;font-weight:400;color:rgba(104,80,68,0.50);background:rgba(104,80,68,0.06);padding:4px 12px;border-radius:20px;}
        .ap-table{background:#ffffff;border:1px solid rgba(104,80,68,0.09);border-radius:16px;overflow:hidden;}
        .ap-table-wrap{overflow-x:auto;}
        .ap-table table{width:100%;border-collapse:collapse;min-width:780px;}
        .ap-table th{font-family:'DM Sans',sans-serif;font-size:9.5px;font-weight:500;letter-spacing:0.16em;text-transform:uppercase;color:rgba(104,80,68,0.40);padding:14px 20px;text-align:left;border-bottom:1px solid rgba(104,80,68,0.07);background:#fdfaf8;}
        .ap-table td{font-family:'DM Sans',sans-serif;font-size:13px;font-weight:300;color:#3a405a;padding:14px 20px;border-bottom:1px solid rgba(104,80,68,0.06);vertical-align:middle;}
        .ap-table tr:last-child td{border-bottom:none;}
        .ap-row-toggle{cursor:pointer;user-select:none;}
        .ap-row-toggle:hover td{background:rgba(104,80,68,0.02);}
        .ap-expand{background:rgba(249,246,242,0.60);border-bottom:1px solid rgba(104,80,68,0.06);}
        .ap-expand td{padding:20px 28px;}
        .ap-detail-grid{display:grid;grid-template-columns:1fr 1fr;gap:16px;}
        .ap-detail-label{font-family:'DM Sans',sans-serif;font-size:9.5px;font-weight:500;letter-spacing:0.14em;text-transform:uppercase;color:rgba(104,80,68,0.40);margin:0 0 4px;}
        .ap-detail-val{font-family:'DM Sans',sans-serif;font-size:13px;font-weight:300;color:#3a405a;word-break:break-word;}
        .ap-status-sel{padding:5px 10px;border-radius:20px;border:none;font-family:'DM Sans',sans-serif;font-size:11px;font-weight:500;cursor:pointer;outline:none;}
        .ap-status-sel:disabled{opacity:0.65;cursor:not-allowed;}
        .ap-empty{text-align:center;padding:60px 20px;font-family:'DM Sans',sans-serif;font-size:14px;font-weight:300;color:rgba(104,80,68,0.40);}
        .ap-error{color:#c0392b;}
        @media (max-width: 768px){
          .ap-detail-grid{grid-template-columns:1fr;}
        }
      `}</style>

      <div className="ap-topbar">
        <Link
          to="/admin/careers"
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: 6,
            fontFamily: "'DM Sans',sans-serif",
            fontSize: 12,
            color: "rgba(104,80,68,0.55)",
            textDecoration: "none",
            padding: "7px 13px",
            borderRadius: 8,
            border: "1px solid rgba(104,80,68,0.12)",
            background: "#ffffff",
          }}
        >
          ← Back
        </Link>

        <h1 className="ap-heading">Applications</h1>
        {job && <span className="ap-job-tag">{job.title}</span>}
      </div>

      <div className="ap-table">
        <div className="ap-table-wrap">
          <table>
            <thead>
              <tr>
                <th></th>
                <th>Name</th>
                <th>Email</th>
                <th>Applied</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={5} className="ap-empty">
                    Loading…
                  </td>
                </tr>
              ) : error ? (
                <tr>
                  <td colSpan={5} className="ap-empty ap-error">
                    {error}
                  </td>
                </tr>
              ) : apps.length === 0 ? (
                <tr>
                  <td colSpan={5} className="ap-empty">
                    No applications yet.
                  </td>
                </tr>
              ) : (
                apps.map((app) => (
                  <Fragment key={app.id}>
                    <tr
                      className="ap-row-toggle"
                      onClick={() =>
                        setExpanded(expanded === app.id ? null : app.id)
                      }
                    >
                      <td
                        style={{
                          width: 32,
                          color: "rgba(104,80,68,0.35)",
                          fontSize: 12,
                        }}
                      >
                        {expanded === app.id ? "▼" : "▶"}
                      </td>
                      <td style={{ fontWeight: 400 }}>{app.name || "—"}</td>
                      <td style={{ color: "rgba(104,80,68,0.55)" }}>
                        {app.email || "—"}
                      </td>
                      <td
                        style={{ color: "rgba(104,80,68,0.45)", fontSize: 12 }}
                      >
                        {formatDate(app.createdAt || app.created_at)}
                      </td>
                      <td onClick={(e) => e.stopPropagation()}>
                        <select
                          className="ap-status-sel"
                          value={app.status || "New"}
                          disabled={updatingId === app.id}
                          style={{
                            background:
                              STATUS_COLORS[app.status || "New"] ||
                              "rgba(104,80,68,0.06)",
                            color:
                              STATUS_TEXT[app.status || "New"] || "#3a405a",
                          }}
                          onChange={(e) => updateStatus(app.id, e.target.value)}
                        >
                          {STATUS_OPTIONS.map((s) => (
                            <option key={s} value={s}>
                              {s}
                            </option>
                          ))}
                        </select>
                      </td>
                    </tr>

                    {expanded === app.id && (
                      <tr className="ap-expand">
                        <td colSpan={5}>
                          <div className="ap-detail-grid">
                            <div>
                              <p className="ap-detail-label">Phone</p>
                              <p className="ap-detail-val">
                                {app.phone || "—"}
                              </p>
                            </div>

                            <div>
                              <p className="ap-detail-label">LinkedIn</p>
                              <p className="ap-detail-val">
                                {app.linkedin ? (
                                  <a
                                    href={app.linkedin}
                                    target="_blank"
                                    rel="noreferrer"
                                    style={{ color: "#3a405a" }}
                                  >
                                    {app.linkedin}
                                  </a>
                                ) : (
                                  "—"
                                )}
                              </p>
                            </div>

                            {(app.resume ||
                              app.resumeUrl ||
                              app.resume_url) && (
                                <div>
                                  <p className="ap-detail-label">Resume</p>
                                  <p className="ap-detail-val">
                                    <a
                                      href={
                                        app.resume ||
                                        app.resumeUrl ||
                                        app.resume_url
                                      }
                                      target="_blank"
                                      rel="noreferrer"
                                      style={{ color: "#3a405a" }}
                                    >
                                      Download
                                    </a>
                                  </p>
                                </div>
                              )}

                            {(app.coverLetter || app.cover_letter) && (
                              <div style={{ gridColumn: "1/-1" }}>
                                <p className="ap-detail-label">Cover Letter</p>
                                <p
                                  className="ap-detail-val"
                                  style={{
                                    whiteSpace: "pre-wrap",
                                    lineHeight: 1.7,
                                  }}
                                >
                                  {app.coverLetter || app.cover_letter}
                                </p>
                              </div>
                            )}
                          </div>
                        </td>
                      </tr>
                    )}
                  </Fragment>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
