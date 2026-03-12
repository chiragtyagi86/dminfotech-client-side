// app/admin/blog/new/page.tsx
// ─────────────────────────────────────────────────────────────────────────────
// Create new blog post page.
// CMS NOTE: Replace the fetch call with your real API/DB endpoint.
// ─────────────────────────────────────────────────────────────────────────────

"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import BlogForm, { type BlogFormData } from "../components/BlogForm";

export default function NewBlogPage() {
  const router   = useRouter();
  const [saving, setSaving]  = useState(false);
  const [error,  setError]   = useState("");

  async function handleSubmit(data: BlogFormData) {
    setSaving(true);
    setError("");

    try {
      const res = await fetch("/api/admin/blog", {
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

      // Success — go back to blog list
      router.push("/admin/blog");
      router.refresh();
    } catch {
      setError("Network error. Please try again.");
      setSaving(false);
    }
  }

  return (
    <div className="newblog-root">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@300;400;600&family=DM+Sans:wght@300;400;500&display=swap');

        .newblog-root {
          display: flex; flex-direction: column; gap: 24px;
          animation: nbFade 0.4s ease both;
          max-width: 860px;
        }

        @keyframes nbFade {
          from { opacity: 0; transform: translateY(8px); }
          to   { opacity: 1; transform: translateY(0); }
        }

        .newblog-topbar {
          display: flex; align-items: center; gap: 14px; flex-wrap: wrap;
        }

        .newblog-back {
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

        .newblog-back:hover { background: rgba(104,80,68,0.04); }

        .newblog-heading {
          font-family: 'Cormorant Garamond', serif;
          font-size: 28px; font-weight: 400;
          color: var(--color-primary, #3a405a);
        }

        .newblog-error {
          font-family: 'DM Sans', sans-serif;
          font-size: 13px; font-weight: 400;
          color: #c0392b;
          background: rgba(192,57,43,0.06);
          border: 1px solid rgba(192,57,43,0.14);
          border-radius: 10px;
          padding: 12px 16px;
        }
      `}</style>

      <div className="newblog-topbar">
        <Link href="/admin/blog" className="newblog-back">← Back</Link>
        <h1 className="newblog-heading">New Blog Post</h1>
      </div>

      {error && <p className="newblog-error">⚠ {error}</p>}

      <BlogForm onSubmit={handleSubmit} isSaving={saving} />
    </div>
  );
}