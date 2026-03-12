// src/admin/portfolio/edit.jsx
import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { adminApi } from "../../lib/api";
import PortfolioForm from "./components/PortfolioForm";

function extractProject(payload) {
  if (!payload) return null;
  return payload.project ?? payload.portfolioItem ?? payload.item ?? payload.data ?? payload;
}

export default function EditPortfolioPage() {
  const { slug } = useParams();
  const navigate = useNavigate();

  const [project, setProject] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    let mounted = true;

    async function loadProject() {
      try {
        setLoading(true);
        setError("");

        const res = await adminApi.getPortfolioItem(slug);
        const root = res?.data ?? res ?? {};
        const item = extractProject(root);

        if (!mounted) return;
        setProject(item);
      } catch (err) {
        console.error(err);
        if (mounted) setError(err?.message || "Failed to load.");
      } finally {
        if (mounted) setLoading(false);
      }
    }

    if (slug) loadProject();

    return () => { mounted = false; };
  }, [slug]);

  async function handleSubmit(data) {
    setSaving(true);
    setError("");

    try {
      // PortfolioForm already sends correct field names matching the DB schema.
      // Only preserve fields the form doesn't touch: gallery, og_*, canonical_url etc.
      const payload = {
        ...data,
        gallery:       project?.gallery ?? "[]",
        og_title:      project?.og_title ?? "",
        og_description: project?.og_description ?? "",
        canonical_url: project?.canonical_url ?? "",
        index_enabled: project?.index_enabled ?? 1,
      };

      await adminApi.updatePortfolioItem(project.slug, payload);
      navigate("/admin/portfolio");
    } catch (err) {
      console.error(err);
      setError(err?.message || "Failed to save.");
    } finally {
      setSaving(false);
    }
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 24, maxWidth: 860, animation: "fade 0.4s ease both" }}>
      <style>{`@keyframes fade{from{opacity:0;transform:translateY(8px)}to{opacity:1;transform:translateY(0)}}`}</style>

      <div style={{ display: "flex", alignItems: "center", gap: 14, flexWrap: "wrap" }}>
        <Link
          to="/admin/portfolio"
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

        <h1 style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: 28, fontWeight: 400, color: "#3a405a", margin: 0 }}>
          Edit Project
        </h1>
      </div>

      {error && (
        <p style={{ fontFamily: "'DM Sans',sans-serif", fontSize: 13, color: "#c0392b", background: "rgba(192,57,43,0.06)", border: "1px solid rgba(192,57,43,0.14)", borderRadius: 10, padding: "12px 16px" }}>
          ⚠ {error}
        </p>
      )}

      {loading ? (
        <p style={{ fontFamily: "'DM Sans',sans-serif", fontSize: 13, color: "rgba(104,80,68,0.45)" }}>Loading…</p>
      ) : project ? (
        <PortfolioForm initialData={project} onSubmit={handleSubmit} isSaving={saving} />
      ) : (
        <p style={{ fontFamily: "'DM Sans',sans-serif", fontSize: 13, color: "rgba(104,80,68,0.45)" }}>Project not found.</p>
      )}
    </div>
  );
}