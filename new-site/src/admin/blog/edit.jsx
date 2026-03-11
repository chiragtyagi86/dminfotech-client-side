// src/admin/blog/edit.jsx
import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { adminApi } from "../../lib/api";
import BlogForm from "./components/BlogForm";

export default function BlogEditor() {
  const { slug }  = useParams();
  const navigate  = useNavigate();
  const [post,    setPost]    = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving,  setSaving]  = useState(false);
  const [error,   setError]   = useState("");

  useEffect(() => {
    adminApi.getBlogPost(slug)
      .then((d) => setPost(d.data ?? d))
      .catch(() => setError("Failed to load post."))
      .finally(() => setLoading(false));
  }, [slug]);

  async function handleSubmit(data) {
    setSaving(true);
    setError("");

    try {
      const { _imageFile, ...rest } = data;

      // If a new image was chosen, upload it first to get the URL,
      // then send everything as JSON so the backend always gets req.body fields.
      let featuredImageUrl = rest.featured_image || "";
      if (_imageFile) {
        const fd = new FormData();
        fd.append("file", _imageFile);
        const BASE = import.meta.env.VITE_API_URL || "";
        const uploadRes = await fetch(`${BASE}/api/admin/settings/media`, {
          method: "POST",
          credentials: "include",
          body: fd,
        });
        if (!uploadRes.ok) {
          const j = await uploadRes.json().catch(() => ({}));
          setError(j.message || "Image upload failed.");
          return;
        }
        const uploaded = await uploadRes.json();
        // backend returns url or key — adjust if your upload endpoint differs
        featuredImageUrl = uploaded.url ?? uploaded.key ?? uploaded.path ?? featuredImageUrl;
      }

      await adminApi.updateBlogPost(post.slug, {
        ...rest,
        featured_image: featuredImageUrl,
        featuredImage:  featuredImageUrl,   // send both so backend finds it
      });

      navigate("/admin/blog");
    } catch {
      setError("Network error.");
    } finally {
      setSaving(false);
    }
  }

  return (
    <div style={{display:"flex",flexDirection:"column",gap:24,maxWidth:860,animation:"fade 0.4s ease both"}}>
      <style>{`@keyframes fade{from{opacity:0;transform:translateY(8px)}to{opacity:1;transform:translateY(0)}}`}</style>

      <div style={{display:"flex",alignItems:"center",gap:14,flexWrap:"wrap"}}>
        <Link to="/admin/blog" style={{display:"inline-flex",alignItems:"center",gap:6,fontFamily:"'DM Sans',sans-serif",fontSize:12,color:"rgba(104,80,68,0.55)",textDecoration:"none",padding:"7px 13px",borderRadius:8,border:"1px solid rgba(104,80,68,0.12)",background:"#ffffff"}}>← Back</Link>
        <h1 style={{fontFamily:"'Cormorant Garamond',serif",fontSize:28,fontWeight:400,color:"#3a405a",margin:0}}>Edit Post</h1>
      </div>

      {error && (
        <p style={{fontFamily:"'DM Sans',sans-serif",fontSize:13,color:"#c0392b",background:"rgba(192,57,43,0.06)",border:"1px solid rgba(192,57,43,0.14)",borderRadius:10,padding:"12px 16px"}}>
          ⚠ {error}
        </p>
      )}

      {loading
        ? <p style={{fontFamily:"'DM Sans',sans-serif",fontSize:13,color:"rgba(104,80,68,0.45)"}}>Loading…</p>
        : post
          ? <BlogForm initialData={post} onSubmit={handleSubmit} isSaving={saving} />
          : <p style={{fontFamily:"'DM Sans',sans-serif",fontSize:13,color:"rgba(104,80,68,0.45)"}}>Post not found.</p>
      }
    </div>
  );
}