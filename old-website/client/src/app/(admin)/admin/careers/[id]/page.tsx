// app/admin/careers/[id]/page.tsx
// Works for both create (/admin/careers/new) and edit (/admin/careers/123)
"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

interface JobForm {
  title: string;
  slug: string;
  department: string;
  location: string;
  location_type: string;
  job_type: string;
  salary_label: string;
  description: string;
  requirements: string;
  benefits: string;
  status: string;
  sort_order: string;
  meta_title: string;
  meta_description: string;
}

const BLANK: JobForm = {
  title: "",
  slug: "",
  department: "",
  location: "",
  location_type: "onsite",
  job_type: "full-time",
  salary_label: "",
  description: "",
  requirements: "",
  benefits: "",
  status: "draft",
  sort_order: "0",
  meta_title: "",
  meta_description: "",
};

function toSlug(s: string) {
  return s
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

export default function AdminCareerEditor({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const [id, setId] = useState<string | null>(null);
  const isNew = id === "new";
  const [form, setForm] = useState<JobForm>(BLANK);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState("");
  const [activeTab, setActiveTab] = useState<"basic" | "content" | "seo">("basic");

  useEffect(() => {
    params.then((p) => setId(p.id));
  }, [params]);

  useEffect(() => {
    if (id === null) return;
    if (isNew) {
      setLoading(false);
      return;
    }
    fetchJob(id);
  }, [id, isNew]);

  async function fetchJob(jobId: string) {
    try {
      const res = await fetch(`/api/admin/careers/${jobId}`);
      const json = await res.json();

      if (!res.ok) {
        setError("Job not found");
        return;
      }

      const j = json.job;
      setForm({
        title: j.title ?? "",
        slug: j.slug ?? "",
        department: j.department ?? "",
        location: j.location ?? "",
        location_type: j.location_type ?? "onsite",
        job_type: j.job_type ?? "full-time",
        salary_label: j.salary_label ?? "",
        description: j.description ?? "",
        requirements: j.requirements ?? "",
        benefits: j.benefits ?? "",
        status: j.status ?? "draft",
        sort_order: String(j.sort_order ?? 0),
        meta_title: j.meta_title ?? "",
        meta_description: j.meta_description ?? "",
      });
    } catch {
      setError("Failed to load job");
    } finally {
      setLoading(false);
    }
  }

  function setField(key: keyof JobForm, value: string) {
    setSaved(false);

    setForm((prev) => {
      const next = { ...prev, [key]: value };

      if (key === "title" && isNew) {
        next.slug = toSlug(value);
      }

      return next;
    });
  }

  async function handleSave() {
    if (!form.title.trim()) {
      setError("Title is required.");
      return;
    }

    if (!form.slug.trim()) {
      setError("Slug is required.");
      return;
    }

    setError("");

    try {
      setSaving(true);

      const url = isNew ? "/api/admin/careers" : `/api/admin/careers/${id}`;
      const method = isNew ? "POST" : "PUT";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...form,
          sort_order: parseInt(form.sort_order, 10) || 0,
        }),
      });

      const json = await res.json();

      if (!res.ok) {
        setError(json.message || "Failed to save");
        return;
      }

      setSaved(true);
      setTimeout(() => setSaved(false), 3000);

      if (isNew && json.id) {
        window.location.href = `/admin/careers/${json.id}`;
      }
    } catch {
      setError("Network error. Please try again.");
    } finally {
      setSaving(false);
    }
  }

  if (loading) {
    return (
      <div
        style={{
          padding: "40px",
          fontFamily: "'DM Sans', sans-serif",
          color: "rgba(104,80,68,0.55)",
        }}
      >
        Loading…
      </div>
    );
  }

  return (
    <div className="ace-root">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@300;400;600&family=DM+Sans:wght@300;400;500;700&display=swap');

        .ace-root {
          display: flex;
          flex-direction: column;
          gap: 24px;
          max-width: 950px;
          animation: aceFade 0.4s ease both;
        }

        @keyframes aceFade {
          from { opacity: 0; transform: translateY(8px); }
          to { opacity: 1; transform: none; }
        }

        .ace-topbar {
          display: flex;
          align-items: center;
          gap: 14px;
          flex-wrap: wrap;
        }

        .ace-back {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          font-family: 'DM Sans', sans-serif;
          font-size: 12px;
          color: rgba(104,80,68,0.55);
          text-decoration: none;
          padding: 7px 13px;
          border-radius: 8px;
          border: 1px solid rgba(104,80,68,0.12);
          background: #fff;
        }

        .ace-back:hover {
          background: rgba(104,80,68,0.04);
        }

        .ace-heading {
          font-family: 'Cormorant Garamond', serif;
          font-size: 28px;
          font-weight: 400;
          color: var(--color-primary, #3a405a);
          margin: 0;
          flex: 1;
        }

        .ace-card {
          background: #fff;
          border: 1px solid rgba(104,80,68,0.09);
          border-radius: 16px;
          overflow: hidden;
          box-shadow: 0 12px 40px rgba(58, 64, 90, 0.08);
        }

        .ace-tabs {
          display: flex;
          border-bottom: 1px solid rgba(104,80,68,0.09);
          background: rgba(104,80,68,0.02);
        }

        .ace-tab {
          padding: 13px 20px;
          font-family: 'DM Sans', sans-serif;
          font-size: 11.5px;
          font-weight: 400;
          color: rgba(104,80,68,0.50);
          border: none;
          background: none;
          cursor: pointer;
          border-bottom: 2px solid transparent;
          margin-bottom: -1px;
        }

        .ace-tab.active {
          color: var(--color-primary, #3a405a);
          border-bottom-color: var(--color-primary, #3a405a);
          font-weight: 500;
        }

        .ace-body {
          padding: 24px;
          display: flex;
          flex-direction: column;
          gap: 18px;
        }

        .ace-row {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 16px;
        }

        @media (max-width: 640px) {
          .ace-row {
            grid-template-columns: 1fr;
          }
        }

        .ace-field {
          display: flex;
          flex-direction: column;
          gap: 6px;
        }

        .ace-label {
          font-family: 'DM Sans', sans-serif;
          font-size: 10.5px;
          font-weight: 500;
          letter-spacing: 0.13em;
          text-transform: uppercase;
          color: rgba(104,80,68,0.55);
        }

        .ace-input,
        .ace-select,
        .ace-textarea {
          width: 100%;
          padding: 11px 13px;
          border-radius: 9px;
          border: 1px solid rgba(104,80,68,0.14);
          background: #fdfaf8;
          font-family: 'DM Sans', sans-serif;
          font-size: 13.5px;
          font-weight: 300;
          color: var(--color-primary, #3a405a);
          outline: none;
          box-sizing: border-box;
          transition: border-color 0.2s ease, box-shadow 0.2s ease, background 0.2s ease;
        }

        .ace-input:focus,
        .ace-select:focus,
        .ace-textarea:focus {
          border-color: rgba(153,178,221,0.55);
          box-shadow: 0 0 0 3px rgba(153,178,221,0.10);
          background: #fff;
        }

        .ace-textarea {
          resize: vertical;
          min-height: 130px;
          line-height: 1.7;
        }

        .ace-textarea--editor {
          min-height: 240px;
        }

        .ace-hint {
          font-family: 'DM Sans', sans-serif;
          font-size: 10.5px;
          font-weight: 300;
          color: rgba(104,80,68,0.40);
          margin: 0;
        }

        .ace-section-label {
          font-size: 9.5px;
          font-weight: 500;
          letter-spacing: 0.20em;
          text-transform: uppercase;
          color: rgba(104,80,68,0.35);
          padding-bottom: 8px;
          border-bottom: 1px solid rgba(104,80,68,0.07);
          margin: 4px 0 -4px;
          font-family: 'DM Sans', sans-serif;
        }

        .ace-error {
          font-family: 'DM Sans', sans-serif;
          font-size: 12px;
          color: #c0392b;
          background: rgba(192,57,43,0.07);
          border: 1px solid rgba(192,57,43,0.18);
          border-radius: 8px;
          padding: 10px 14px;
        }

        .ace-save-bar {
          display: flex;
          align-items: center;
          gap: 12px;
          justify-content: flex-end;
          padding: 16px 22px;
          background: rgba(255,255,255,0.85);
          border: 1px solid rgba(104,80,68,0.09);
          border-radius: 14px;
          position: sticky;
          bottom: 16px;
          backdrop-filter: blur(12px);
        }

        .ace-saved {
          font-family: 'DM Sans', sans-serif;
          font-size: 12px;
          color: #3a7a3a;
          flex: 1;
        }

        .ace-save-btn {
          padding: 10px 24px;
          border-radius: 9px;
          border: none;
          background: var(--color-primary, #3a405a);
          color: #f9dec9;
          font-family: 'DM Sans', sans-serif;
          font-size: 12.5px;
          font-weight: 500;
          cursor: pointer;
          text-transform: uppercase;
          display: flex;
          align-items: center;
          gap: 8px;
        }

        .ace-save-btn:hover:not(:disabled) {
          transform: translateY(-1px);
          box-shadow: 0 6px 18px rgba(58,64,90,0.18);
        }

        .ace-save-btn:disabled {
          opacity: 0.6;
          cursor: not-allowed;
        }

        .ace-spinner {
          width: 13px;
          height: 13px;
          border: 2px solid rgba(249,222,201,0.30);
          border-top-color: #f9dec9;
          border-radius: 50%;
          animation: aceSpin 0.7s linear infinite;
        }

        @keyframes aceSpin {
          to { transform: rotate(360deg); }
        }
      `}</style>

      <div className="ace-topbar">
        <Link href="/admin/careers" className="ace-back">
          ← Back
        </Link>
        <h1 className="ace-heading">
          {isNew ? "Post a Job" : `Edit: ${form.title}`}
        </h1>
      </div>

      <div className="ace-card">
        <div className="ace-tabs">
          {(["basic", "content", "seo"] as const).map((t) => (
            <button
              key={t}
              type="button"
              className={`ace-tab ${activeTab === t ? "active" : ""}`}
              onClick={() => setActiveTab(t)}
            >
              {t === "basic" ? "Basic Info" : t === "content" ? "Description" : "SEO"}
            </button>
          ))}
        </div>

        {activeTab === "basic" && (
          <div className="ace-body">
            <p className="ace-section-label">Job Details</p>

            <div className="ace-row">
              <div className="ace-field">
                <label className="ace-label">Job Title *</label>
                <input
                  className="ace-input"
                  value={form.title}
                  placeholder="e.g. Frontend Developer"
                  onChange={(e) => setField("title", e.target.value)}
                />
              </div>

              <div className="ace-field">
                <label className="ace-label">URL Slug *</label>
                <input
                  className="ace-input"
                  value={form.slug}
                  placeholder="frontend-developer"
                  onChange={(e) => setField("slug", toSlug(e.target.value))}
                />
                <p className="ace-hint">/careers/{form.slug || "slug"}</p>
              </div>
            </div>

            <div className="ace-row">
              <div className="ace-field">
                <label className="ace-label">Department</label>
                <input
                  className="ace-input"
                  value={form.department}
                  placeholder="e.g. Engineering"
                  onChange={(e) => setField("department", e.target.value)}
                />
              </div>

              <div className="ace-field">
                <label className="ace-label">Status</label>
                <select
                  className="ace-select"
                  value={form.status}
                  onChange={(e) => setField("status", e.target.value)}
                >
                  <option value="draft">Draft</option>
                  <option value="open">Open</option>
                  <option value="closed">Closed</option>
                </select>
              </div>
            </div>

            <p className="ace-section-label">Location & Type</p>

            <div className="ace-row">
              <div className="ace-field">
                <label className="ace-label">Location</label>
                <input
                  className="ace-input"
                  value={form.location}
                  placeholder="e.g. Meerut, India"
                  onChange={(e) => setField("location", e.target.value)}
                />
              </div>

              <div className="ace-field">
                <label className="ace-label">Work Mode</label>
                <select
                  className="ace-select"
                  value={form.location_type}
                  onChange={(e) => setField("location_type", e.target.value)}
                >
                  <option value="onsite">On-site</option>
                  <option value="remote">Remote</option>
                  <option value="hybrid">Hybrid</option>
                </select>
              </div>
            </div>

            <div className="ace-row">
              <div className="ace-field">
                <label className="ace-label">Job Type</label>
                <select
                  className="ace-select"
                  value={form.job_type}
                  onChange={(e) => setField("job_type", e.target.value)}
                >
                  <option value="full-time">Full-time</option>
                  <option value="part-time">Part-time</option>
                  <option value="contract">Contract</option>
                  <option value="internship">Internship</option>
                </select>
              </div>

              <div className="ace-field">
                <label className="ace-label">Salary Label</label>
                <input
                  className="ace-input"
                  value={form.salary_label}
                  placeholder="e.g. ₹3–6 LPA"
                  onChange={(e) => setField("salary_label", e.target.value)}
                />
                <p className="ace-hint">Displayed on the job card and listing page.</p>
              </div>
            </div>

            <div className="ace-row">
              <div className="ace-field">
                <label className="ace-label">Sort Order</label>
                <input
                  type="number"
                  className="ace-input"
                  value={form.sort_order}
                  min={0}
                  onChange={(e) => setField("sort_order", e.target.value)}
                />
                <p className="ace-hint">Lower = shown first. Default 0.</p>
              </div>
            </div>
          </div>
        )}

        {activeTab === "content" && (
          <div className="ace-body">
            <p className="ace-section-label">About the Role</p>
            <div className="ace-field">
              <textarea
                className="ace-textarea ace-textarea--editor"
                value={form.description}
                placeholder={`Write the job description here...

Example:
We are looking for a skilled Frontend Developer who can build responsive, modern, and high-performance web interfaces for our products.`}
                onChange={(e) => setField("description", e.target.value)}
              />
              <p className="ace-hint">
                Plain text for now. You can later upgrade this to a rich editor after installing one.
              </p>
            </div>

            <p className="ace-section-label">Requirements</p>
            <div className="ace-field">
              <textarea
                className="ace-textarea"
                value={form.requirements}
                placeholder={`One requirement per line:
Proficiency in React / Next.js
1+ years experience`}
                onChange={(e) => setField("requirements", e.target.value)}
              />
              <p className="ace-hint">
                One item per line — displayed as a checklist on the job page.
              </p>
            </div>

            <p className="ace-section-label">What We Offer / Benefits</p>
            <div className="ace-field">
              <textarea
                className="ace-textarea"
                value={form.benefits}
                placeholder={`One benefit per line:
Competitive salary
Flexible hours`}
                onChange={(e) => setField("benefits", e.target.value)}
              />
              <p className="ace-hint">
                One item per line — displayed as a highlights list.
              </p>
            </div>
          </div>
        )}

        {activeTab === "seo" && (
          <div className="ace-body">
            <p className="ace-section-label">Search Engine Optimization</p>

            <div className="ace-field">
              <label className="ace-label">
                SEO Title{" "}
                <span
                  style={{
                    color: "rgba(104,80,68,0.40)",
                    fontWeight: 300,
                    textTransform: "none",
                    letterSpacing: 0,
                  }}
                >
                  ({(form.meta_title || "").length}/60)
                </span>
              </label>
              <input
                className="ace-input"
                value={form.meta_title}
                placeholder="Frontend Developer — Dhanamitra Infotech"
                onChange={(e) => setField("meta_title", e.target.value)}
              />
            </div>

            <div className="ace-field">
              <label className="ace-label">
                SEO Description{" "}
                <span
                  style={{
                    color: "rgba(104,80,68,0.40)",
                    fontWeight: 300,
                    textTransform: "none",
                    letterSpacing: 0,
                  }}
                >
                  ({(form.meta_description || "").length}/160)
                </span>
              </label>
              <textarea
                className="ace-textarea"
                style={{ minHeight: 90 }}
                value={form.meta_description}
                placeholder="We're hiring a Frontend Developer at Dhanamitra Infotech LLP…"
                onChange={(e) => setField("meta_description", e.target.value)}
              />
            </div>
          </div>
        )}
      </div>

      {error && <div className="ace-error">{error}</div>}

      <div className="ace-save-bar">
        {saved && <span className="ace-saved">✓ Saved successfully</span>}
        <button className="ace-save-btn" onClick={handleSave} disabled={saving}>
          {saving ? (
            <>
              <span className="ace-spinner" />
              Saving…
            </>
          ) : isNew ? (
            "Post Job"
          ) : (
            "Save Changes"
          )}
        </button>
      </div>
    </div>
  );
}