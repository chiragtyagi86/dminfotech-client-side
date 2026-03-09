// app/admin/blog/[slug]/page.tsx
// ─────────────────────────────────────────────────────────────────────────────
// Blog post editor using SLUG (not ID)
// Fixed for Next.js 15+ (params is Promise)
// ─────────────────────────────────────────────────────────────────────────────

"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

interface BlogPost {
  id: number;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  featuredImage: string;
  category: string;
  tags: string[];
  status: "draft" | "published";
  seoTitle: string;
  seoDescription: string;
}

export default function BlogEditor({ params }: { params: Promise<{ slug: string }> }) {
  const [slug, setSlug] = useState<string | null>(null);
  const [post, setPost] = useState<BlogPost | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState("");
  const [activeTab, setActiveTab] = useState<"content" | "meta" | "seo">("content");
  const [tagInput, setTagInput] = useState("");

  // Unwrap params Promise
  useEffect(() => {
    params.then((p) => setSlug(p.slug));
  }, [params]);

  // Fetch post when slug is ready
  useEffect(() => {
    if (slug) fetchPost();
  }, [slug]);

  async function fetchPost() {
    try {
      setLoading(true);
      setError("");

      const res = await fetch(`/api/admin/blog/${slug}`);

      if (!res.ok) {
        setError("Post not found");
        return;
      }

      const json = await res.json();
      setPost(json.data);
    } catch (err) {
      console.error("Failed to fetch post:", err);
      setError("Failed to load post");
    } finally {
      setLoading(false);
    }
  }

  function updatePost(field: string, value: any) {
    if (post) {
      setPost({ ...post, [field]: value });
      setSaved(false);
    }
  }

  function addTag() {
    if (tagInput.trim() && post) {
      const newTags = [...(post.tags || []), tagInput.trim()];
      updatePost("tags", newTags);
      setTagInput("");
    }
  }

  function removeTag(index: number) {
    if (post) {
      const newTags = post.tags.filter((_, i) => i !== index);
      updatePost("tags", newTags);
    }
  }

  async function handleSave() {
    if (!post) return;

    try {
      setSaving(true);
      const res = await fetch(`/api/admin/blog/${slug}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(post),
      });

      const json = await res.json();

      if (!res.ok) {
        alert(json.message || "Failed to save post");
        return;
      }

      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    } catch (err) {
      console.error("Failed to save post:", err);
      alert("Error saving post");
    } finally {
      setSaving(false);
    }
  }

  if (loading) {
    return <div style={{ padding: "40px", textAlign: "center" }}>Loading post...</div>;
  }

  if (error) {
    return (
      <div style={{ padding: "40px", textAlign: "center", color: "#c0392b" }}>
        {error}
        <br />
        <Link href="/admin/blog">← Back to Blog</Link>
      </div>
    );
  }

  if (!post) {
    return <div style={{ padding: "40px", textAlign: "center" }}>Post not found</div>;
  }

  const seoTitleLen = post.seoTitle?.length || 0;
  const seoDescLen = post.seoDescription?.length || 0;

  return (
    <div className="be-root">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@300;400;600&family=DM+Sans:wght@300;400;500&display=swap');

        .be-root {
          display: flex; flex-direction: column; gap: 24px;
          max-width: 1000px;
          animation: beFade 0.4s ease both;
        }

        @keyframes beFade {
          from { opacity: 0; transform: translateY(8px); }
          to { opacity: 1; transform: translateY(0); }
        }

        .be-topbar {
          display: flex; align-items: center; gap: 14px; flex-wrap: wrap;
        }

        .be-back {
          display: inline-flex; align-items: center; gap: 6px;
          font-family: 'DM Sans', sans-serif; font-size: 12px;
          color: rgba(104,80,68,0.55); text-decoration: none;
          padding: 7px 13px; border-radius: 8px;
          border: 1px solid rgba(104,80,68,0.12); background: #ffffff;
        }
        .be-back:hover { background: rgba(104,80,68,0.04); }

        .be-heading {
          font-family: 'Cormorant Garamond', serif;
          font-size: 24px; font-weight: 400;
          color: var(--color-primary, #3a405a); margin: 0; flex: 1;
        }

        .be-status {
          font-family: 'DM Sans', sans-serif; font-size: 11px; font-weight: 500;
          text-transform: uppercase; padding: 4px 12px; border-radius: 100px;
          background: ${post?.status === "published" ? "rgba(60,160,60,0.12)" : "rgba(200,140,40,0.12)"};
          color: ${post?.status === "published" ? "#3a7a3a" : "#b8860b"};
        }

        .be-card {
          background: #ffffff; border: 1px solid rgba(104,80,68,0.09);
          border-radius: 16px; overflow: hidden;
        }

        .be-tabs {
          display: flex; border-bottom: 1px solid rgba(104,80,68,0.09);
          background: rgba(104,80,68,0.02);
        }

        .be-tab {
          padding: 13px 20px; font-family: 'DM Sans', sans-serif;
          font-size: 11.5px; font-weight: 400; color: rgba(104,80,68,0.50);
          border: none; background: none; cursor: pointer;
          border-bottom: 2px solid transparent; margin-bottom: -1px;
        }
        .be-tab.active {
          color: var(--color-primary, #3a405a);
          border-bottom-color: var(--color-primary, #3a405a); font-weight: 500;
        }

        .be-body {
          padding: 24px; display: flex; flex-direction: column; gap: 20px;
        }

        .be-field {
          display: flex; flex-direction: column; gap: 6px;
        }

        .be-label {
          font-family: 'DM Sans', sans-serif; font-size: 10.5px; font-weight: 500;
          letter-spacing: 0.13em; text-transform: uppercase;
          color: rgba(104,80,68,0.55);
        }

        .be-input, .be-textarea {
          width: 100%; padding: 12px 13px; border-radius: 9px;
          border: 1px solid rgba(104,80,68,0.14); background: #fdfaf8;
          font-family: 'DM Sans', sans-serif; font-size: 13.5px; font-weight: 300;
          color: var(--color-primary, #3a405a); outline: none;
          box-sizing: border-box;
        }

        .be-input:focus, .be-textarea:focus {
          border-color: rgba(153,178,221,0.55);
          box-shadow: 0 0 0 3px rgba(153,178,221,0.10); background: #ffffff;
        }

        .be-textarea {
          resize: vertical; min-height: 300px; line-height: 1.7;
          font-family: 'Courier New', monospace; font-size: 12px;
        }

        .be-section-label {
          font-size: 9.5px; font-weight: 500; letter-spacing: 0.20em;
          text-transform: uppercase; color: rgba(104,80,68,0.35);
          padding-bottom: 8px; border-bottom: 1px solid rgba(104,80,68,0.07);
          margin: 12px 0 -6px;
        }

        .be-row {
          display: grid; grid-template-columns: 1fr 1fr; gap: 16px;
        }

        @media (max-width: 640px) { .be-row { grid-template-columns: 1fr; } }

        .be-tags {
          display: flex; flex-wrap: wrap; gap: 8px; margin-top: 8px;
        }

        .be-tag {
          display: inline-flex; align-items: center; gap: 6px;
          background: rgba(153,178,221,0.20); color: var(--color-primary, #3a405a);
          padding: 6px 12px; border-radius: 20px;
          font-family: 'DM Sans', sans-serif; font-size: 12px;
        }

        .be-tag-remove {
          background: none; border: none; cursor: pointer; color: inherit;
          font-weight: bold; padding: 0;
        }

        .be-char-counter {
          font-size: 10.5px; font-weight: 300; text-align: right; margin-top: -10px;
        }

        .be-char-ok { color: rgba(60,160,60,0.70); }
        .be-char-warn { color: rgba(200,140,40,0.80); }
        .be-char-over { color: #c0392b; }

        .be-save-bar {
          display: flex; align-items: center; gap: 12px; justify-content: flex-end;
          padding: 16px 22px; background: rgba(255,255,255,0.85);
          border: 1px solid rgba(104,80,68,0.09); border-radius: 14px;
          position: sticky; bottom: 16px; backdrop-filter: blur(12px);
        }

        .be-saved-msg {
          font-family: 'DM Sans', sans-serif; font-size: 12px;
          color: #3a7a3a; flex: 1;
        }

        .be-save-btn {
          padding: 10px 24px; border-radius: 9px; border: none;
          background: var(--color-primary, #3a405a); color: #f9dec9;
          font-family: 'DM Sans', sans-serif; font-size: 12.5px; font-weight: 500;
          cursor: pointer; text-transform: uppercase;
          display: flex; align-items: center; gap: 8px;
        }

        .be-save-btn:hover:not(:disabled) {
          transform: translateY(-1px); box-shadow: 0 6px 18px rgba(58,64,90,0.18);
        }

        .be-save-btn:disabled { opacity: 0.6; cursor: not-allowed; }

        .be-spinner {
          width: 13px; height: 13px;
          border: 2px solid rgba(249,222,201,0.30); border-top-color: #f9dec9;
          border-radius: 50%; animation: bespin 0.7s linear infinite;
        }

        @keyframes bespin { to { transform: rotate(360deg); } }
      `}</style>

      <div className="be-topbar">
        <Link href="/admin/blog" className="be-back">
          ← Back
        </Link>
        <h1 className="be-heading">{post.title}</h1>
        <span className="be-status">{post.status}</span>
      </div>

      <div className="be-card">
        <div className="be-tabs">
          {(["content", "meta", "seo"] as const).map((t) => (
            <button
              key={t}
              type="button"
              className={`be-tab ${activeTab === t ? "active" : ""}`}
              onClick={() => setActiveTab(t)}
            >
              {t === "content" ? "Content" : t === "meta" ? "Meta" : "SEO"}
            </button>
          ))}
        </div>

        {/* CONTENT TAB */}
        {activeTab === "content" && (
          <div className="be-body">
            <div className="be-field">
              <label className="be-label">Post Title</label>
              <input
                type="text"
                className="be-input"
                value={post.title}
                onChange={(e) => updatePost("title", e.target.value)}
              />
            </div>

            <div className="be-field">
              <label className="be-label">Excerpt / Summary</label>
              <textarea
                className="be-textarea"
                style={{ minHeight: "80px" }}
                value={post.excerpt}
                onChange={(e) => updatePost("excerpt", e.target.value)}
                placeholder="Short summary that appears in post lists"
              />
            </div>

            <p className="be-section-label">Post Content (Markdown)</p>

            <div className="be-field">
              <label className="be-label">Write Your Blog Post</label>
              <textarea
                className="be-textarea"
                value={post.content}
                onChange={(e) => updatePost("content", e.target.value)}
                placeholder="Write your blog post here... You can use Markdown formatting:

# Heading 1
## Heading 2
**Bold text**
*Italic text*
- List item
[Link text](https://example.com)"
              />
            </div>
          </div>
        )}

        {/* META TAB */}
        {activeTab === "meta" && (
          <div className="be-body">
            <div className="be-row">
              <div className="be-field">
                <label className="be-label">Category</label>
                <select
                  className="be-input"
                  value={post.category}
                  onChange={(e) => updatePost("category", e.target.value)}
                >
                  <option value="technology">Technology</option>
                  <option value="business">Business</option>
                  <option value="design">Design</option>
                  <option value="other">Other</option>
                </select>
              </div>

              <div className="be-field">
                <label className="be-label">Status</label>
                <select
                  className="be-input"
                  value={post.status}
                  onChange={(e) => updatePost("status", e.target.value)}
                >
                  <option value="draft">Draft</option>
                  <option value="published">Published</option>
                </select>
              </div>
            </div>

            <div className="be-field">
              <label className="be-label">Featured Image URL</label>
              <input
                type="text"
                className="be-input"
                placeholder="/images/blog/post-image.jpg"
                value={post.featuredImage}
                onChange={(e) => updatePost("featuredImage", e.target.value)}
              />
            </div>

            <p className="be-section-label">Tags</p>

            <div className="be-field">
              <div style={{ display: "flex", gap: "8px" }}>
                <input
                  type="text"
                  className="be-input"
                  placeholder="Add a tag..."
                  value={tagInput}
                  onChange={(e) => setTagInput(e.target.value)}
                  onKeyPress={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault();
                      addTag();
                    }
                  }}
                />
                <button
                  style={{
                    padding: "10px 16px",
                    borderRadius: "6px",
                    border: "none",
                    background: "rgba(153,178,221,0.20)",
                    color: "var(--color-primary, #3a405a)",
                    cursor: "pointer",
                    fontSize: "12px",
                    fontWeight: "500",
                  }}
                  onClick={addTag}
                >
                  Add
                </button>
              </div>

              {post.tags.length > 0 && (
                <div className="be-tags">
                  {post.tags.map((tag, idx) => (
                    <span key={idx} className="be-tag">
                      {tag}
                      <button
                        className="be-tag-remove"
                        onClick={() => removeTag(idx)}
                      >
                        ×
                      </button>
                    </span>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {/* SEO TAB */}
        {activeTab === "seo" && (
          <div className="be-body">
            <div className="be-field">
              <label className="be-label">SEO Title (50–60 chars)</label>
              <input
                type="text"
                className="be-input"
                value={post.seoTitle}
                onChange={(e) => updatePost("seoTitle", e.target.value)}
              />
              <span
                className={`be-char-counter ${
                  seoTitleLen <= 60
                    ? "be-char-ok"
                    : seoTitleLen <= 70
                      ? "be-char-warn"
                      : "be-char-over"
                }`}
              >
                {seoTitleLen} / 60
              </span>
            </div>

            <div className="be-field">
              <label className="be-label">SEO Description (120–160 chars)</label>
              <textarea
                className="be-textarea"
                style={{ minHeight: "100px" }}
                value={post.seoDescription}
                onChange={(e) => updatePost("seoDescription", e.target.value)}
              />
              <span
                className={`be-char-counter ${
                  seoDescLen <= 160
                    ? "be-char-ok"
                    : seoDescLen <= 180
                      ? "be-char-warn"
                      : "be-char-over"
                }`}
              >
                {seoDescLen} / 160
              </span>
            </div>

            <div
              style={{
                padding: "16px",
                background: "rgba(104,80,68,0.03)",
                borderRadius: "10px",
                border: "1px solid rgba(104,80,68,0.08)",
              }}
            >
              <p
                style={{
                  fontSize: "9.5px",
                  fontWeight: 500,
                  letterSpacing: "0.16em",
                  textTransform: "uppercase",
                  color: "rgba(104,80,68,0.38)",
                  marginBottom: "10px",
                }}
              >
                Search Preview
              </p>
              <p style={{ fontSize: 18, color: "#1a0dab", marginBottom: 3 }}>
                {post.seoTitle || post.title}
              </p>
              <p style={{ fontSize: 12, color: "#006621", marginBottom: 4 }}>
                dhanamitra.com/blog/{post.slug}
              </p>
              <p style={{ fontSize: 13, color: "#545454", lineHeight: 1.5 }}>
                {post.seoDescription || post.excerpt}
              </p>
            </div>
          </div>
        )}
      </div>

      <div className="be-save-bar">
        {saved && <span className="be-saved-msg">✓ Changes saved successfully</span>}
        <button className="be-save-btn" onClick={handleSave} disabled={saving}>
          {saving ? (
            <>
              <span className="be-spinner" />
              Saving…
            </>
          ) : (
            "Save Post"
          )}
        </button>
      </div>
    </div>
  );
}