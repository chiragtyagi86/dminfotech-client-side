"use client";

import { useState, useEffect, use } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import ServiceForm, { type ServiceFormData } from "../../_components/ServiceForm";

export default function EditServicePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = use(params);
  const router   = useRouter();

  const [initial,  setInitial]  = useState<Partial<ServiceFormData> | null>(null);
  const [loading,  setLoading]  = useState(true);
  const [notFound, setNotFound] = useState(false);
  const [saving,   setSaving]   = useState(false);
  const [error,    setError]    = useState("");

  useEffect(() => {
    async function load() {
      try {
        const res  = await fetch(`/api/admin/services/${slug}`);
        if (res.status === 404) { setNotFound(true); setLoading(false); return; }
        const json = await res.json();
        if (!res.ok) throw new Error(json.message || "Failed to load.");

        setInitial({
          num:            json.num            ?? "",
          slug:           json.slug           ?? "",
          title:          json.title          ?? "",
          tag:            json.tag            ?? "",
          tagline:        json.tagline         ?? "",
          desc:           json.desc            ?? json.short_desc ?? "",
          features:       json.features        ?? "",
          keywords:       json.keywords        ?? "",
          accent:         json.accent          ?? "rgba(153,178,221,0.25)",
          subtitle:       json.subtitle        ?? "",
          fullDesc:       json.fullDesc        ?? "",
          highlights:     Array.isArray(json.highlights) && json.highlights.length
                            ? json.highlights
                            : [{ label: "", detail: "" }],
          status:         json.status          ?? "active",
          order:          json.order           ?? json.sort_order ?? 1,
          seoTitle:       json.seoTitle        ?? json.meta_title        ?? "",
          seoDescription: json.seoDescription  ?? json.meta_description  ?? "",
        });
      } catch (err: any) {
        setError(err.message || "Failed to load service.");
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [slug]);

  async function handleSubmit(data: ServiceFormData) {
    setSaving(true);
    setError("");
    try {
      const res  = await fetch(`/api/admin/services/${slug}`, {
        method:  "PUT",
        headers: { "Content-Type": "application/json" },
        body:    JSON.stringify(data),
      });
      const json = await res.json();
      if (!res.ok) { setError(json.message || "Failed to save."); setSaving(false); return; }
      router.push("/admin/services");
      router.refresh();
    } catch {
      setError("Network error. Please try again.");
      setSaving(false);
    }
  }

  if (loading) return <p style={hint}>Loading service…</p>;
  if (notFound) return (
    <p style={hint}>Service not found. <Link href="/admin/services" style={{ color: "#3a405a" }}>← Back</Link></p>
  );

  return (
    <div style={{ display:"flex", flexDirection:"column", gap:24, maxWidth:860 }}>
      <div style={{ display:"flex", alignItems:"center", gap:14, flexWrap:"wrap" }}>
        <Link href="/admin/services" style={backBtn}>← Back</Link>
        <h1 style={heading}>Edit Service</h1>
        <span style={slugBadge}>/{slug}</span>
      </div>
      {error && <p style={errorBox}>⚠ {error}</p>}
      {initial && <ServiceForm initialData={initial} onSubmit={handleSubmit} isSaving={saving} />}
    </div>
  );
}

const hint:      React.CSSProperties = { fontFamily:"DM Sans,sans-serif", fontSize:14, color:"#685044", padding:"48px 0", textAlign:"center" };
const backBtn:   React.CSSProperties = { display:"inline-flex", alignItems:"center", fontFamily:"DM Sans,sans-serif", fontSize:12, fontWeight:400, color:"rgba(104,80,68,0.55)", textDecoration:"none", padding:"7px 13px", borderRadius:8, border:"1px solid rgba(104,80,68,0.12)", background:"#ffffff" };
const heading:   React.CSSProperties = { fontFamily:"Cormorant Garamond,serif", fontSize:28, fontWeight:400, color:"#3a405a", margin:0, flex:1 };
const slugBadge: React.CSSProperties = { fontFamily:"DM Sans,sans-serif", fontSize:11, fontWeight:300, color:"rgba(104,80,68,0.45)", background:"rgba(104,80,68,0.05)", border:"1px solid rgba(104,80,68,0.10)", padding:"4px 12px", borderRadius:100 };
const errorBox:  React.CSSProperties = { fontFamily:"DM Sans,sans-serif", fontSize:13, color:"#c0392b", background:"rgba(192,57,43,0.06)", border:"1px solid rgba(192,57,43,0.14)", borderRadius:10, padding:"12px 16px" };