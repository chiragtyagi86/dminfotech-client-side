// src/admin/careers/editor.jsx
// Handles both new (/admin/careers/new) and edit (/admin/careers/:id)
import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { adminApi } from "../../lib/api";

const DEFAULT_FORM = {
  title: "",
  slug: "",
  department: "",
  location: "",
  location_type: "remote",
  job_type: "full-time",
  salary_min: "",
  salary_max: "",
  salary_label: "",
  description: "",
  requirements: "",
  benefits: "",
  status: "open",
  sort_order: 1,
  meta_title: "",
  meta_description: "",
};

function normalizeCareerForm(input = {}) {
  return {
    ...DEFAULT_FORM,
    ...input,
    salary_min: input.salary_min ?? "",
    salary_max: input.salary_max ?? "",
    salary_label: input.salary_label ?? "",
    description: input.description ?? "",
    requirements: input.requirements ?? "",
    benefits: input.benefits ?? "",
    meta_title: input.meta_title ?? "",
    meta_description: input.meta_description ?? "",
    status: input.status ?? "open",
    sort_order: input.sort_order ?? 1,
  };
}

export default function AdminCareerEditor() {
  const { id } = useParams();
  const isEdit = Boolean(id && id !== "new");
  const navigate = useNavigate();

  const [form, setForm] = useState(DEFAULT_FORM);
  const [loading, setLoading] = useState(!!isEdit);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [tab, setTab] = useState("basic");

  useEffect(() => {
    let mounted = true;

    async function loadJob() {
      try {
        setLoading(true);
        setError("");

        const d = await adminApi.getAdminJob(id);

        // FIX: handle { job: {...} } shape
        const root = d?.data ?? d ?? {};
        const payload = root.job ?? root.data ?? root ?? {};

        if (!mounted) return;
        setForm(normalizeCareerForm(payload));
      } catch (err) {
        console.error(err);
        if (mounted) setError(err?.message || "Failed to load.");
      } finally {
        if (mounted) setLoading(false);
      }
    }

    if (isEdit) loadJob();

    return () => {
      mounted = false;
    };
  }, [id, isEdit]);

  function set(key, value) {
    setForm((prev) => ({ ...prev, [key]: value }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setSaving(true);
    setError("");

    try {
      const payload = {
        ...form,
        salary_min: form.salary_min === "" ? null : Number(form.salary_min),
        salary_max: form.salary_max === "" ? null : Number(form.salary_max),
        sort_order: Number(form.sort_order || 1),
      };

      if (isEdit) {
        await adminApi.updateJob(id, payload);
      } else {
        await adminApi.createJob(payload);
      }

      navigate("/admin/careers");
    } catch (err) {
      console.error(err);
      setError(err?.message || "Failed to save.");
    } finally {
      setSaving(false);
    }
  }

  const inp = {
    fontFamily: "'DM Sans',sans-serif",
    fontSize: 14,
    fontWeight: 300,
    color: "#3a405a",
    padding: "11px 14px",
    borderRadius: 10,
    border: "1px solid rgba(104,80,68,0.14)",
    background: "#fdfaf8",
    width: "100%",
    outline: "none",
    boxSizing: "border-box",
  };

  const lbl = {
    fontFamily: "'DM Sans',sans-serif",
    fontSize: 10.5,
    fontWeight: 500,
    letterSpacing: "0.13em",
    textTransform: "uppercase",
    color: "rgba(104,80,68,0.55)",
    display: "block",
    marginBottom: 6,
  };

  const fld = { display: "flex", flexDirection: "column", gap: 4, marginBottom: 18 };

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        gap: 24,
        maxWidth: 920,
        animation: "fade 0.4s ease both",
      }}
    >
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@300;400;600&family=DM+Sans:wght@300;400;500&display=swap');
        @keyframes fade{from{opacity:0;transform:translateY(8px)}to{opacity:1;transform:translateY(0)}}
        .ce-tabs{display:flex;gap:4;margin-bottom:24px;border-bottom:1px solid rgba(104,80,68,0.09);flex-wrap:wrap;}
        .ce-tab{padding:10px 18px;border:none;background:none;font-family:'DM Sans',sans-serif;font-size:12px;font-weight:400;color:rgba(104,80,68,0.50);cursor:pointer;border-bottom:2px solid transparent;margin-bottom:-1px;transition:color 0.2s,border-color 0.2s;}
        .ce-tab.active{color:#3a405a;font-weight:500;border-bottom-color:#3a405a;}
        .ce-row2{display:grid;grid-template-columns:1fr 1fr;gap:16px;}
        .ce-row3{display:grid;grid-template-columns:1fr 1fr 1fr;gap:16px;}
        .ce-save{padding:12px 32px;border-radius:10px;border:none;background:#3a405a;color:#f9dec9;font-family:'DM Sans',sans-serif;font-size:12px;font-weight:500;letter-spacing:0.10em;text-transform:uppercase;cursor:pointer;}
        .ce-save:disabled{opacity:0.65;cursor:not-allowed;}
        @media (max-width: 768px){
          .ce-row2,.ce-row3{grid-template-columns:1fr;}
        }
      `}</style>

      <div style={{ display: "flex", alignItems: "center", gap: 14, flexWrap: "wrap" }}>
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

        <h1
          style={{
            fontFamily: "'Cormorant Garamond',serif",
            fontSize: 28,
            fontWeight: 400,
            color: "#3a405a",
            margin: 0,
          }}
        >
          {isEdit ? "Edit Job" : "New Job"}
        </h1>
      </div>

      {error && (
        <p
          style={{
            fontFamily: "'DM Sans',sans-serif",
            fontSize: 13,
            color: "#c0392b",
            background: "rgba(192,57,43,0.06)",
            border: "1px solid rgba(192,57,43,0.14)",
            borderRadius: 10,
            padding: "12px 16px",
          }}
        >
          ⚠ {error}
        </p>
      )}

      {loading ? (
        <p
          style={{
            fontFamily: "'DM Sans',sans-serif",
            fontSize: 13,
            color: "rgba(104,80,68,0.45)",
          }}
        >
          Loading…
        </p>
      ) : (
        <form
          onSubmit={handleSubmit}
          style={{
            background: "#ffffff",
            border: "1px solid rgba(104,80,68,0.09)",
            borderRadius: 16,
            padding: 28,
          }}
        >
          <div className="ce-tabs">
            {["basic", "description", "seo"].map((t) => (
              <button
                key={t}
                type="button"
                className={`ce-tab${tab === t ? " active" : ""}`}
                onClick={() => setTab(t)}
              >
                {t === "basic" ? "Basic" : t === "description" ? "Description" : "SEO"}
              </button>
            ))}
          </div>

          {tab === "basic" && (
            <>
              <div style={fld}>
                <label style={lbl}>Job Title</label>
                <input
                  style={inp}
                  value={form.title}
                  onChange={(e) => set("title", e.target.value)}
                  required
                />
              </div>

              <div className="ce-row2">
                <div style={fld}>
                  <label style={lbl}>Slug</label>
                  <input
                    style={inp}
                    value={form.slug}
                    onChange={(e) => set("slug", e.target.value)}
                  />
                </div>

                <div style={fld}>
                  <label style={lbl}>Department</label>
                  <input
                    style={inp}
                    value={form.department}
                    onChange={(e) => set("department", e.target.value)}
                  />
                </div>
              </div>

              <div className="ce-row3">
                <div style={fld}>
                  <label style={lbl}>Location</label>
                  <input
                    style={inp}
                    value={form.location}
                    onChange={(e) => set("location", e.target.value)}
                    placeholder="Meerut, India"
                  />
                </div>

                <div style={fld}>
                  <label style={lbl}>Location Type</label>
                  <select
                    style={inp}
                    value={form.location_type}
                    onChange={(e) => set("location_type", e.target.value)}
                  >
                    <option value="remote">Remote</option>
                    <option value="onsite">Onsite</option>
                    <option value="hybrid">Hybrid</option>
                  </select>
                </div>

                <div style={fld}>
                  <label style={lbl}>Job Type</label>
                  <select
                    style={inp}
                    value={form.job_type}
                    onChange={(e) => set("job_type", e.target.value)}
                  >
                    <option value="full-time">Full-time</option>
                    <option value="part-time">Part-time</option>
                    <option value="contract">Contract</option>
                    <option value="internship">Internship</option>
                    <option value="freelance">Freelance</option>
                  </select>
                </div>
              </div>

              <div className="ce-row3">
                <div style={fld}>
                  <label style={lbl}>Salary Min</label>
                  <input
                    style={inp}
                    type="number"
                    value={form.salary_min}
                    onChange={(e) => set("salary_min", e.target.value)}
                  />
                </div>

                <div style={fld}>
                  <label style={lbl}>Salary Max</label>
                  <input
                    style={inp}
                    type="number"
                    value={form.salary_max}
                    onChange={(e) => set("salary_max", e.target.value)}
                  />
                </div>

                <div style={fld}>
                  <label style={lbl}>Salary Label</label>
                  <input
                    style={inp}
                    value={form.salary_label}
                    onChange={(e) => set("salary_label", e.target.value)}
                    placeholder="₹3–6 LPA"
                  />
                </div>
              </div>

              <div className="ce-row2">
                <div style={fld}>
                  <label style={lbl}>Sort Order</label>
                  <input
                    style={inp}
                    type="number"
                    value={form.sort_order}
                    onChange={(e) => set("sort_order", e.target.value)}
                  />
                </div>

                <div style={fld}>
                  <label style={lbl}>Status</label>
                  <select
                    style={inp}
                    value={form.status}
                    onChange={(e) => set("status", e.target.value)}
                  >
                    <option value="open">Open</option>
                    <option value="closed">Closed</option>
                    <option value="draft">Draft</option>
                  </select>
                </div>
              </div>
            </>
          )}

          {tab === "description" && (
            <>
              <div style={fld}>
                <label style={lbl}>Job Description</label>
                <textarea
                  style={{ ...inp, minHeight: 140, resize: "vertical" }}
                  value={form.description}
                  onChange={(e) => set("description", e.target.value)}
                />
              </div>

              <div style={fld}>
                <label style={lbl}>Requirements</label>
                <textarea
                  style={{ ...inp, minHeight: 120, resize: "vertical" }}
                  value={form.requirements}
                  onChange={(e) => set("requirements", e.target.value)}
                  placeholder="List requirements, one per line…"
                />
              </div>

              <div style={fld}>
                <label style={lbl}>Benefits</label>
                <textarea
                  style={{ ...inp, minHeight: 100, resize: "vertical" }}
                  value={form.benefits}
                  onChange={(e) => set("benefits", e.target.value)}
                />
              </div>
            </>
          )}

          {tab === "seo" && (
            <>
              <div style={fld}>
                <label style={lbl}>Meta Title</label>
                <input
                  style={inp}
                  value={form.meta_title}
                  onChange={(e) => set("meta_title", e.target.value)}
                />
              </div>

              <div style={fld}>
                <label style={lbl}>Meta Description</label>
                <textarea
                  style={{ ...inp, minHeight: 100, resize: "vertical" }}
                  value={form.meta_description}
                  onChange={(e) => set("meta_description", e.target.value)}
                />
              </div>
            </>
          )}

          <div
            style={{
              display: "flex",
              justifyContent: "flex-end",
              paddingTop: 8,
              borderTop: "1px solid rgba(104,80,68,0.07)",
              marginTop: 8,
            }}
          >
            <button type="submit" className="ce-save" disabled={saving}>
              {saving ? "Saving…" : isEdit ? "Update Job" : "Create Job"}
            </button>
          </div>
        </form>
      )}
    </div>
  );
}