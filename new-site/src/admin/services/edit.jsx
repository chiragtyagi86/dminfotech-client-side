// src/admin/services/edit.jsx
import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { adminApi } from "../../lib/api";
import ServiceForm from "./components/ServiceForm";

function extractService(payload) {
  if (!payload) return null;
  return payload.service ?? payload.data ?? payload;
}

export default function EditServicePage() {
  const { slug } = useParams();
  const navigate = useNavigate();

  const [service, setService] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    let mounted = true;

    async function loadService() {
      try {
        setLoading(true);
        setError("");

        const res = await adminApi.getService(slug);
        const root = res?.data ?? res ?? {};
        const item = extractService(root);

        if (!mounted) return;
        setService(item);
      } catch (err) {
        console.error(err);
        if (mounted) setError(err?.message || "Failed to load.");
      } finally {
        if (mounted) setLoading(false);
      }
    }

    if (slug) loadService();

    return () => {
      mounted = false;
    };
  }, [slug]);

  async function handleSubmit(data) {
    setSaving(true);
    setError("");

    try {
      const payload = {
        id: service?.id,
        slug: service?.slug,                              // always use original slug, not URL param
        title: data.title,
        short_desc: data.short_desc,
        icon: data.icon ?? service?.icon ?? "",
        sort_order: data.sort_order ?? service?.sort_order ?? 0,
        status: data.status ?? service?.status ?? "draft",
        published: (data.status ?? service?.status) === "published", // explicitly derive boolean
        meta_title: data.meta_title ?? service?.meta_title ?? "",
        meta_description: data.meta_description ?? service?.meta_description ?? "",
        content: data.content,                            // already a JSON string from ServiceForm
        image: service?.image ?? "",
      };

      await adminApi.updateService(service.slug, payload); // use service.slug, not URL param slug
      navigate("/admin/services");
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
          to="/admin/services"
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
          Edit Service
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
      ) : service ? (
        <ServiceForm initialData={service} onSubmit={handleSubmit} isSaving={saving} />
      ) : (
        <p
          style={{
            fontFamily: "'DM Sans',sans-serif",
            fontSize: 13,
            color: "rgba(104,80,68,0.45)",
          }}
        >
          Service not found.
        </p>
      )}
    </div>
  );
}