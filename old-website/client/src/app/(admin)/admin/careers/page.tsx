// app/admin/careers/page.tsx
"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

interface Job {
  id: number;
  title: string;
  slug: string;
  department: string | null;
  location: string | null;
  job_type: string;
  location_type: string;
  status: "open" | "closed" | "draft";
  sort_order: number;
  _applicationCount?: number;
}

export default function AdminCareersPage() {
  const [jobs, setJobs]       = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => { fetchJobs(); }, []);

  async function fetchJobs() {
    try {
      const res  = await fetch("/api/admin/careers");
      const json = await res.json();
      setJobs(json.jobs || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  async function toggleStatus(job: Job) {
    const next = job.status === "open" ? "closed" : "open";
    await fetch(`/api/admin/careers/${job.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status: next }),
    });
    setJobs((js) => js.map((j) => j.id === job.id ? { ...j, status: next } : j));
  }

  async function deleteJob(id: number) {
    if (!confirm("Delete this job listing? All applications will also be deleted.")) return;
    await fetch(`/api/admin/careers/${id}`, { method: "DELETE" });
    setJobs((js) => js.filter((j) => j.id !== id));
  }

  const statusColor: Record<string, string> = {
    open:   "rgba(58,120,58,0.12)",
    closed: "rgba(192,57,43,0.10)",
    draft:  "rgba(104,80,68,0.08)",
  };
  const statusText: Record<string, string> = {
    open: "#3a7a3a", closed: "#c0392b", draft: "#685044",
  };

  return (
    <div className="ac-root">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@300;400;600&family=DM+Sans:wght@300;400;500&display=swap');

        .ac-root { display: flex; flex-direction: column; gap: 24px; max-width: 1000px; animation: acFade 0.4s ease both; }
        @keyframes acFade { from { opacity:0; transform:translateY(8px); } to { opacity:1; transform:none; } }

        .ac-topbar { display: flex; align-items: center; gap: 14px; flex-wrap: wrap; }
        .ac-heading { font-family: 'Cormorant Garamond', serif; font-size: 28px; font-weight: 400; color: var(--color-primary, #3a405a); margin: 0; flex: 1; }
        .ac-new-btn {
          display: inline-flex; align-items: center; gap: 6px;
          padding: 10px 22px; border-radius: 9px; border: none;
          background: var(--color-primary, #3a405a); color: #f9dec9;
          font-family: 'DM Sans', sans-serif; font-size: 12.5px; font-weight: 500;
          text-transform: uppercase; letter-spacing: 0.08em; cursor: pointer;
          text-decoration: none; transition: transform 0.2s, box-shadow 0.2s;
        }
        .ac-new-btn:hover { transform: translateY(-1px); box-shadow: 0 6px 18px rgba(58,64,90,0.18); }

        .ac-card { background: #fff; border: 1px solid rgba(104,80,68,0.09); border-radius: 16px; overflow: hidden; }

        .ac-table { width: 100%; border-collapse: collapse; font-family: 'DM Sans', sans-serif; }
        .ac-th {
          text-align: left; padding: 11px 16px;
          font-size: 10px; font-weight: 500; letter-spacing: 0.14em; text-transform: uppercase;
          color: rgba(104,80,68,0.50);
          border-bottom: 1px solid rgba(104,80,68,0.09);
          background: rgba(104,80,68,0.02);
        }
        .ac-tr { border-bottom: 1px solid rgba(104,80,68,0.07); transition: background 0.15s; }
        .ac-tr:last-child { border-bottom: none; }
        .ac-tr:hover { background: rgba(104,80,68,0.02); }
        .ac-td { padding: 14px 16px; vertical-align: middle; color: var(--color-primary, #3a405a); font-size: 13.5px; }

        .ac-title { font-weight: 500; color: var(--color-primary, #3a405a); }
        .ac-dept { font-size: 11px; font-weight: 300; color: rgba(104,80,68,0.55); margin-top: 2px; }

        .ac-tag {
          display: inline-flex; align-items: center; gap: 4px;
          font-size: 11px; font-weight: 400; color: rgba(104,80,68,0.60);
          background: rgba(104,80,68,0.05); border: 1px solid rgba(104,80,68,0.08);
          padding: 2px 9px; border-radius: 100px;
        }

        .ac-status-badge {
          display: inline-block; padding: 3px 11px; border-radius: 100px;
          font-size: 11px; font-weight: 500;
        }

        .ac-apps {
          font-family: 'Cormorant Garamond', serif;
          font-size: 20px; font-weight: 600;
          color: var(--color-primary, #3a405a);
        }

        .ac-actions { display: flex; gap: 8px; align-items: center; flex-wrap: wrap; }
        .ac-edit-btn {
          padding: 5px 13px; border-radius: 6px;
          border: 1.5px solid rgba(104,80,68,0.18); background: none;
          font-family: 'DM Sans', sans-serif; font-size: 11.5px; font-weight: 500;
          color: var(--color-primary, #3a405a); cursor: pointer; text-decoration: none;
          transition: background 0.15s;
        }
        .ac-edit-btn:hover { background: rgba(104,80,68,0.05); }
        .ac-toggle-btn {
          padding: 5px 13px; border-radius: 6px; border: none;
          font-family: 'DM Sans', sans-serif; font-size: 11.5px; font-weight: 500;
          cursor: pointer; transition: opacity 0.15s;
        }
        .ac-toggle-open { background: rgba(192,57,43,0.10); color: #c0392b; }
        .ac-toggle-open:hover { background: rgba(192,57,43,0.16); }
        .ac-toggle-closed { background: rgba(58,120,58,0.10); color: #3a7a3a; }
        .ac-toggle-closed:hover { background: rgba(58,120,58,0.18); }
        .ac-del-btn {
          padding: 5px 10px; border-radius: 6px; border: none;
          background: rgba(192,57,43,0.08); color: #c0392b;
          font-family: 'DM Sans', sans-serif; font-size: 11.5px; cursor: pointer;
          transition: background 0.15s;
        }
        .ac-del-btn:hover { background: rgba(192,57,43,0.16); }

        .ac-empty { padding: 48px; text-align: center; color: rgba(104,80,68,0.45); font-family: 'DM Sans', sans-serif; font-size: 14px; }
        .ac-loading { padding: 40px; text-align: center; color: rgba(104,80,68,0.45); font-family: 'DM Sans', sans-serif; }

        @media (max-width: 768px) {
          .ac-table, .ac-table tbody, .ac-table tr, .ac-table td { display: block; }
          .ac-table thead { display: none; }
          .ac-tr { padding: 14px 16px; border-bottom: 1px solid rgba(104,80,68,0.09); }
          .ac-td { padding: 4px 0; border: none; }
        }
      `}</style>

      <div className="ac-topbar">
        <h1 className="ac-heading">Job Listings</h1>
        <Link href="/admin/careers/new" className="ac-new-btn">+ Post a Job</Link>
      </div>

      <div className="ac-card">
        {loading ? (
          <div className="ac-loading">Loading jobs…</div>
        ) : jobs.length === 0 ? (
          <div className="ac-empty">
            No job listings yet. <Link href="/admin/careers/new" style={{ color: "var(--color-primary)", fontWeight: 500 }}>Post your first role →</Link>
          </div>
        ) : (
          <table className="ac-table">
            <thead>
              <tr>
                {["Role", "Type / Location", "Status", "Applications", "Actions"].map((h) => (
                  <th key={h} className="ac-th">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {jobs.map((job) => (
                <tr key={job.id} className="ac-tr">
                  <td className="ac-td">
                    <div className="ac-title">{job.title}</div>
                    {job.department && <div className="ac-dept">{job.department}</div>}
                  </td>
                  <td className="ac-td">
                    <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
                      <span className="ac-tag">
                        {{ "full-time": "Full-time", "part-time": "Part-time", "contract": "Contract", "internship": "Internship" }[job.job_type] ?? job.job_type}
                      </span>
                      {job.location && <span className="ac-tag">{job.location}</span>}
                    </div>
                  </td>
                  <td className="ac-td">
                    <span
                      className="ac-status-badge"
                      style={{ background: statusColor[job.status], color: statusText[job.status] }}
                    >
                      {job.status.charAt(0).toUpperCase() + job.status.slice(1)}
                    </span>
                  </td>
                  <td className="ac-td">
                    <Link href={`/admin/careers/${job.id}/applications`} style={{ textDecoration: "none" }}>
                      <span className="ac-apps">{job._applicationCount ?? "—"}</span>
                    </Link>
                  </td>
                  <td className="ac-td">
                    <div className="ac-actions">
                      <Link href={`/admin/careers/${job.id}`} className="ac-edit-btn">Edit</Link>
                      <button
                        className={`ac-toggle-btn ${job.status === "open" ? "ac-toggle-open" : "ac-toggle-closed"}`}
                        onClick={() => toggleStatus(job)}
                      >
                        {job.status === "open" ? "Close" : "Open"}
                      </button>
                      <button className="ac-del-btn" onClick={() => deleteJob(job.id)}>✕</button>
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