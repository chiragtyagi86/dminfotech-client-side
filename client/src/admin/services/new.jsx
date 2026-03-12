// src/admin/services/new.jsx
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { adminApi } from "../../lib/api";
import ServiceForm from "./components/ServiceForm";

export default function NewServicePage() {
  const navigate = useNavigate();
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(data) {
    setSaving(true);
    setError("");

    try {
      await adminApi.createService(data);
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
          New Service
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

      <ServiceForm onSubmit={handleSubmit} isSaving={saving} />
    </div>
  );
}