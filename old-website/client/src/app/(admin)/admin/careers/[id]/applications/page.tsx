// app/admin/careers/[id]/applications/page.tsx
"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

interface Application {
  id:           number;
  name:         string;
  email:        string;
  phone:        string | null;
  linkedin_url: string | null;
  resume_url:   string | null;
  resume_name:  string | null;
  status:       string;
  notes:        string | null;
  created_at:   string;
}

interface Job { id: number; title: string; slug: string; status: string; }

const STATUS_OPTS = ["new", "reviewing", "shortlisted", "rejected", "hired"];

const STATUS_STYLE: Record<string, { bg: string; color: string }> = {
  new:         { bg: "rgba(153,178,221,0.15)", color: "#2a4a8a" },
  reviewing:   { bg: "rgba(240,185,110,0.18)", color: "#7a4e10" },
  shortlisted: { bg: "rgba(58,120,58,0.12)",   color: "#3a7a3a" },
  rejected:    { bg: "rgba(192,57,43,0.10)",   color: "#c0392b" },
  hired:       { bg: "rgba(58,64,90,0.12)",    color: "#3a405a" },
};

function fmt(d: string) {
  return new Date(d).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" });
}

export default function ApplicationsPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const [id, setId]               = useState<string | null>(null);
  const [job, setJob]             = useState<Job | null>(null);
  const [apps, setApps]           = useState<Application[]>([]);
  const [loading, setLoading]     = useState(true);
  const [filter, setFilter]       = useState("all");
  const [expanded, setExpanded]   = useState<number | null>(null);
  const [savingId, setSavingId]   = useState<number | null>(null);
  const [noteEdits, setNoteEdits] = useState<Record<number, string>>({});

  useEffect(() => { params.then((p) => setId(p.id)); }, [params]);
  useEffect(() => { if (id) fetch_(); }, [id]);

  async function fetch_() {
    try {
      const res  = await fetch(`/api/admin/careers/${id}/applications`);
      const json = await res.json();
      setJob(json.job);
      setApps(json.applications || []);
    } finally {
      setLoading(false);
    }
  }

  async function updateApp(appId: number, patch: { status?: string; notes?: string }) {
    setSavingId(appId);
    await fetch(`/api/admin/careers/${id}/applications`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ appId, ...patch }),
    });
    setApps((as) => as.map((a) => a.id === appId ? { ...a, ...patch } : a));
    setSavingId(null);
  }

  const displayed = filter === "all" ? apps : apps.filter((a) => a.status === filter);
  const counts    = STATUS_OPTS.reduce((acc, s) => {
    acc[s] = apps.filter((a) => a.status === s).length;
    return acc;
  }, {} as Record<string, number>);

  return (
    <div className="aav-root">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@300;400;600&family=DM+Sans:wght@300;400;500&display=swap');

        .aav-root { display:flex; flex-direction:column; gap:20px; max-width:1020px; animation:aavFade 0.4s ease both; }
        @keyframes aavFade { from{opacity:0;transform:translateY(8px)}to{opacity:1;transform:none} }

        .aav-topbar { display:flex; align-items:center; gap:12px; flex-wrap:wrap; }
        .aav-back { display:inline-flex;align-items:center;gap:6px;font-family:'DM Sans',sans-serif;font-size:12px;color:rgba(104,80,68,0.55);text-decoration:none;padding:7px 13px;border-radius:8px;border:1px solid rgba(104,80,68,0.12);background:#fff; }
        .aav-back:hover{background:rgba(104,80,68,0.04);}
        .aav-heading{font-family:'Cormorant Garamond',serif;font-size:26px;font-weight:400;color:var(--color-primary,#3a405a);margin:0;flex:1;}
        .aav-sub{font-family:'DM Sans',sans-serif;font-size:12px;font-weight:300;color:rgba(104,80,68,0.50);}

        /* Stats row */
        .aav-stats { display:flex; flex-wrap:wrap; gap:10px; }
        .aav-stat {
          padding:10px 18px; border-radius:10px;
          border:1px solid rgba(104,80,68,0.09); background:#fff;
          font-family:'DM Sans',sans-serif; cursor:pointer;
          display:flex; align-items:center; gap:8px;
          transition:border-color 0.2s, box-shadow 0.2s;
        }
        .aav-stat.active { border-color:var(--color-primary,#3a405a); box-shadow:0 2px 10px rgba(58,64,90,0.10); }
        .aav-stat-count { font-family:'Cormorant Garamond',serif; font-size:22px; font-weight:600; color:var(--color-primary,#3a405a); line-height:1; }
        .aav-stat-label { font-size:10.5px; font-weight:400; color:rgba(104,80,68,0.50); text-transform:capitalize; }

        /* Application cards */
        .aav-list { display:flex; flex-direction:column; gap:10px; }
        .aav-app {
          border-radius:14px; border:1px solid rgba(104,80,68,0.09); background:#fff; overflow:hidden;
          transition:box-shadow 0.2s;
        }
        .aav-app:hover { box-shadow:0 4px 18px rgba(58,64,90,0.07); }

        .aav-app-header {
          display:grid; grid-template-columns:1fr auto; gap:12px; align-items:center;
          padding:16px 20px; cursor:pointer;
        }
        .aav-app-left { min-width:0; }
        .aav-app-name { font-family:'DM Sans',sans-serif; font-size:14.5px; font-weight:500; color:var(--color-primary,#3a405a); margin:0 0 3px; }
        .aav-app-meta { font-family:'DM Sans',sans-serif; font-size:12px; font-weight:300; color:rgba(104,80,68,0.55); display:flex; gap:12px; flex-wrap:wrap; }
        .aav-app-meta a { color:rgba(104,80,68,0.55); text-decoration:none; }
        .aav-app-meta a:hover { color:var(--color-primary,#3a405a); text-decoration:underline; }

        .aav-app-right { display:flex; flex-direction:column; align-items:flex-end; gap:8px; }

        .aav-badge {
          display:inline-block; padding:3px 11px; border-radius:100px;
          font-family:'DM Sans',sans-serif; font-size:11px; font-weight:500; text-transform:capitalize;
        }
        .aav-date { font-family:'DM Sans',sans-serif; font-size:11px; font-weight:300; color:rgba(104,80,68,0.40); }

        /* Expanded detail */
        .aav-app-detail {
          padding:16px 20px 20px; border-top:1px solid rgba(104,80,68,0.07);
          background:rgba(104,80,68,0.015);
          display:flex; flex-direction:column; gap:16px;
        }
        .aav-detail-row { display:flex; gap:12px; flex-wrap:wrap; align-items:flex-start; }
        .aav-detail-label { font-family:'DM Sans',sans-serif; font-size:10px; font-weight:500; letter-spacing:0.14em; text-transform:uppercase; color:rgba(104,80,68,0.40); margin-bottom:4px; }
        .aav-detail-val { font-family:'DM Sans',sans-serif; font-size:13px; font-weight:300; color:var(--color-primary,#3a405a); }

        .aav-resume-btn {
          display:inline-flex; align-items:center; gap:6px; padding:7px 15px; border-radius:8px;
          border:1px solid rgba(104,80,68,0.18); background:#fff;
          font-family:'DM Sans',sans-serif; font-size:12px; font-weight:400; color:var(--color-primary,#3a405a);
          text-decoration:none; transition:background 0.15s;
        }
        .aav-resume-btn:hover { background:rgba(104,80,68,0.05); }

        .aav-status-sel {
          padding:7px 12px; border-radius:8px; border:1px solid rgba(104,80,68,0.14); background:#fdfaf8;
          font-family:'DM Sans',sans-serif; font-size:12.5px; color:var(--color-primary,#3a405a); outline:none;
          cursor:pointer;
        }
        .aav-notes-area {
          width:100%; box-sizing:border-box; padding:9px 12px; border-radius:9px;
          border:1px solid rgba(104,80,68,0.14); background:#fdfaf8;
          font-family:'DM Sans',sans-serif; font-size:13px; font-weight:300; color:var(--color-primary,#3a405a);
          resize:vertical; min-height:70px; outline:none; line-height:1.65;
        }
        .aav-notes-area:focus { border-color:rgba(153,178,221,0.55); background:#fff; }
        .aav-save-note-btn {
          padding:7px 16px; border-radius:7px; border:none; background:var(--color-primary,#3a405a);
          color:#f9dec9; font-family:'DM Sans',sans-serif; font-size:11.5px; cursor:pointer;
          align-self:flex-end; opacity:1; transition:opacity 0.15s;
        }
        .aav-save-note-btn:disabled { opacity:0.55; }

        .aav-empty { padding:48px; text-align:center; background:#fff; border-radius:14px; border:1px solid rgba(104,80,68,0.09); font-family:'DM Sans',sans-serif; color:rgba(104,80,68,0.45); font-size:14px; }
        .aav-loading { padding:40px; text-align:center; font-family:'DM Sans',sans-serif; color:rgba(104,80,68,0.45); }
      `}</style>

      {/* Top bar */}
      <div className="aav-topbar">
        <Link href="/admin/careers" className="aav-back">← Jobs</Link>
        <div style={{ flex: 1 }}>
          <h1 className="aav-heading">{job ? `Applications — ${job.title}` : "Applications"}</h1>
          {job && <p className="aav-sub">{apps.length} total application{apps.length !== 1 ? "s" : ""}</p>}
        </div>
        {job && (
          <Link href={`/admin/careers/${id}`} className="aav-back">Edit Job</Link>
        )}
      </div>

      {loading ? (
        <div className="aav-loading">Loading applications…</div>
      ) : (
        <>
          {/* Stats / filter row */}
          <div className="aav-stats">
            <div
              className={`aav-stat ${filter === "all" ? "active" : ""}`}
              onClick={() => setFilter("all")}
            >
              <span className="aav-stat-count">{apps.length}</span>
              <span className="aav-stat-label">All</span>
            </div>
            {STATUS_OPTS.map((s) => counts[s] > 0 && (
              <div
                key={s}
                className={`aav-stat ${filter === s ? "active" : ""}`}
                onClick={() => setFilter(s)}
              >
                <span className="aav-stat-count" style={{ color: STATUS_STYLE[s].color }}>{counts[s]}</span>
                <span className="aav-stat-label">{s}</span>
              </div>
            ))}
          </div>

          {/* Application list */}
          {displayed.length === 0 ? (
            <div className="aav-empty">
              {filter === "all" ? "No applications yet." : `No ${filter} applications.`}
            </div>
          ) : (
            <div className="aav-list">
              {displayed.map((app) => (
                <div key={app.id} className="aav-app">
                  {/* Header row */}
                  <div className="aav-app-header" onClick={() =>
                    setExpanded((e) => e === app.id ? null : app.id)
                  }>
                    <div className="aav-app-left">
                      <p className="aav-app-name">{app.name}</p>
                      <div className="aav-app-meta">
                        <a href={`mailto:${app.email}`}>{app.email}</a>
                        {app.phone && <span>{app.phone}</span>}
                        {app.linkedin_url && (
                          <a href={app.linkedin_url} target="_blank" rel="noreferrer">LinkedIn ↗</a>
                        )}
                      </div>
                    </div>
                    <div className="aav-app-right">
                      <span
                        className="aav-badge"
                        style={{
                          background: STATUS_STYLE[app.status]?.bg ?? "rgba(104,80,68,0.08)",
                          color:      STATUS_STYLE[app.status]?.color ?? "#685044",
                        }}
                      >
                        {app.status}
                      </span>
                      <span className="aav-date">{fmt(app.created_at)}</span>
                    </div>
                  </div>

                  {/* Expanded detail */}
                  {expanded === app.id && (
                    <div className="aav-app-detail">
                      <div className="aav-detail-row">
                        {/* Resume */}
                        <div>
                          <p className="aav-detail-label">Resume</p>
                          {app.resume_url ? (
                            <a href={app.resume_url} target="_blank" rel="noreferrer" className="aav-resume-btn">
                              📄 {app.resume_name ?? "Download Resume"}
                            </a>
                          ) : (
                            <span className="aav-detail-val" style={{ opacity: 0.4 }}>No resume uploaded</span>
                          )}
                        </div>

                        {/* Status changer */}
                        <div>
                          <p className="aav-detail-label">Status</p>
                          <select
                            className="aav-status-sel"
                            value={app.status}
                            onChange={(e) => updateApp(app.id, { status: e.target.value })}
                            disabled={savingId === app.id}
                          >
                            {STATUS_OPTS.map((s) => (
                              <option key={s} value={s}>{s.charAt(0).toUpperCase() + s.slice(1)}</option>
                            ))}
                          </select>
                        </div>
                      </div>

                      {/* Notes */}
                      <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                        <p className="aav-detail-label">Notes</p>
                        <textarea
                          className="aav-notes-area"
                          placeholder="Add notes about this applicant…"
                          value={noteEdits[app.id] ?? (app.notes ?? "")}
                          onChange={(e) =>
                            setNoteEdits((n) => ({ ...n, [app.id]: e.target.value }))
                          }
                        />
                        <button
                          className="aav-save-note-btn"
                          disabled={savingId === app.id}
                          onClick={() =>
                            updateApp(app.id, { notes: noteEdits[app.id] ?? app.notes ?? "" })
                          }
                        >
                          {savingId === app.id ? "Saving…" : "Save Note"}
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );
}