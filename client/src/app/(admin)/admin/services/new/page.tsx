// app/admin/services/new/page.tsx
// ─────────────────────────────────────────────────────────────────────────────
// Create new service page.
// CMS NOTE: Replace fetch with your real API/DB endpoint.
// ─────────────────────────────────────────────────────────────────────────────

"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import ServiceForm, { type ServiceFormData } from "../_components/ServiceForm";

export default function NewServicePage() {
  const router  = useRouter();
  const [saving, setSaving] = useState(false);
  const [error,  setError]  = useState("");

  async function handleSubmit(data: ServiceFormData) {
    setSaving(true);
    setError("");

    try {
      const res = await fetch("/api/admin/services", {
        method:  "POST",
        headers: { "Content-Type": "application/json" },
        body:    JSON.stringify(data),
      });

      if (!res.ok) {
        const json = await res.json();
        setError(json.message || "Failed to save. Please try again.");
        setSaving(false);
        return;
      }

      router.push("/admin/services");
      router.refresh();
    } catch {
      setError("Network error. Please try again.");
      setSaving(false);
    }
  }

  return (
    <div className="newsvc-root">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@300;400;600&family=DM+Sans:wght@300;400;500&display=swap');

        .newsvc-root {
          display: flex; flex-direction: column; gap: 24px;
          max-width: 860px;
          animation: nsvFade 0.4s ease both;
        }

        @keyframes nsvFade {
          from { opacity: 0; transform: translateY(8px); }
          to   { opacity: 1; transform: translateY(0); }
        }

        .newsvc-topbar {
          display: flex; align-items: center; gap: 14px; flex-wrap: wrap;
        }

        .newsvc-back {
          display: inline-flex; align-items: center; gap: 6px;
          font-family: 'DM Sans', sans-serif;
          font-size: 12px; font-weight: 400;
          color: rgba(104,80,68,0.55);
          text-decoration: none;
          padding: 7px 13px; border-radius: 8px;
          border: 1px solid rgba(104,80,68,0.12);
          background: #ffffff;
          transition: background 0.2s ease;
        }

        .newsvc-back:hover { background: rgba(104,80,68,0.04); }

        .newsvc-heading {
          font-family: 'Cormorant Garamond', serif;
          font-size: 28px; font-weight: 400;
          color: var(--color-primary, #3a405a);
        }

        .newsvc-error {
          font-family: 'DM Sans', sans-serif;
          font-size: 13px;
          color: #c0392b;
          background: rgba(192,57,43,0.06);
          border: 1px solid rgba(192,57,43,0.14);
          border-radius: 10px;
          padding: 12px 16px;
        }
      `}</style>

      <div className="newsvc-topbar">
        <Link href="/admin/services" className="newsvc-back">← Back</Link>
        <h1 className="newsvc-heading">New Service</h1>
      </div>

      {error && <p className="newsvc-error">⚠ {error}</p>}

      <ServiceForm onSubmit={handleSubmit} isSaving={saving} />
    </div>
  );
}