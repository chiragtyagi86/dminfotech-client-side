      "use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";

type Post = {
  id:           number;
  title:        string;
  slug:         string;
  status:       "published" | "draft";
  cover_image:  string;
  created_at:   string;
  published_at: string | null;
};

export default function AdminBlogPage() {
  const [posts,    setPosts]    = useState<Post[]>([]);
  const [loading,  setLoading]  = useState(true);
  const [error,    setError]    = useState("");
  const [search,   setSearch]   = useState("");
  const [filter,   setFilter]   = useState<"all" | "published" | "draft">("all");
  const [deleting, setDeleting] = useState<string | null>(null);
  const [total,    setTotal]    = useState(0);

  const fetchPosts = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const params = new URLSearchParams({ limit: "50" });
      if (search) params.set("search", search);
      if (filter !== "all") params.set("status", filter);

      const res  = await fetch(`/api/admin/blog?${params}`);
      const json = await res.json();
      if (!res.ok) throw new Error(json.message || "Failed to load posts.");
      setPosts(json.data);
      setTotal(json.meta.total);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [search, filter]);

  useEffect(() => { fetchPosts(); }, [fetchPosts]);

  async function handleDelete(slug: string) {
    if (!confirm("Delete this post? This cannot be undone.")) return;
    setDeleting(slug);
    try {
      const res = await fetch(`/api/admin/blog/${slug}`, { method: "DELETE" });
      if (!res.ok) { const j = await res.json(); alert(j.message || "Delete failed."); return; }
      setPosts(p => p.filter(post => post.slug !== slug));
      setTotal(t => t - 1);
    } catch {
      alert("Network error. Please try again.");
    } finally {
      setDeleting(null);
    }
  }

  const fmt = (iso: string | null) => {
    if (!iso) return "—";
    return new Date(iso).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" });
  };

  return (
    <div className="ablog-root">
  <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@300;400;600&family=DM+Sans:wght@300;400;500&display=swap');

        .ablog-root {
          display: flex; flex-direction: column; gap: 24px;
          animation: blogFade 0.4s ease both;
        }

        @keyframes blogFade {
          from { opacity: 0; transform: translateY(8px); }
          to   { opacity: 1; transform: translateY(0); }
        }

        /* Top bar */
        .ablog-topbar {
          display: flex; align-items: center; gap: 12px; flex-wrap: wrap;
        }

        .ablog-heading {
          font-family: 'Cormorant Garamond', serif;
          font-size: 28px; font-weight: 400;
          color: var(--color-primary, #3a405a);
          flex: 1;
        }

        .ablog-new-btn {
          display: inline-flex; align-items: center; gap: 7px;
          padding: 9px 18px; border-radius: 9px;
          background: var(--color-primary, #3a405a);
          color: #f9dec9;
          font-family: 'DM Sans', sans-serif;
          font-size: 12px; font-weight: 500;
          letter-spacing: 0.08em; text-transform: uppercase;
          text-decoration: none;
          transition: transform 0.2s ease, box-shadow 0.2s ease;
          white-space: nowrap;
        }

        .ablog-new-btn:hover {
          transform: translateY(-1px);
          box-shadow: 0 6px 18px rgba(58,64,90,0.18);
        }

        /* Controls */
        .ablog-controls {
          display: flex; gap: 10px; flex-wrap: wrap;
        }

        .ablog-search {
          flex: 1; min-width: 200px;
          padding: 9px 14px;
          border-radius: 9px;
          border: 1px solid rgba(104,80,68,0.14);
          background: #ffffff;
          font-family: 'DM Sans', sans-serif;
          font-size: 13.5px; font-weight: 300;
          color: var(--color-primary, #3a405a);
          outline: none;
          transition: border-color 0.2s ease;
        }

        .ablog-search:focus {
          border-color: rgba(153,178,221,0.55);
          box-shadow: 0 0 0 3px rgba(153,178,221,0.10);
        }

        .ablog-search::placeholder { color: rgba(104,80,68,0.35); }

        .ablog-filter-group {
          display: flex; border-radius: 9px; overflow: hidden;
          border: 1px solid rgba(104,80,68,0.13);
          background: #ffffff;
        }

        .ablog-filter-btn {
          padding: 9px 14px;
          border: none; background: transparent; cursor: pointer;
          font-family: 'DM Sans', sans-serif;
          font-size: 12px; font-weight: 400;
          color: rgba(104,80,68,0.55);
          transition: background 0.2s ease, color 0.2s ease;
          border-right: 1px solid rgba(104,80,68,0.10);
        }

        .ablog-filter-btn:last-child { border-right: none; }

        .ablog-filter-btn.active {
          background: var(--color-primary, #3a405a);
          color: #f9dec9;
        }

        /* Table */
        .ablog-table-wrap {
          background: #ffffff;
          border: 1px solid rgba(104,80,68,0.09);
          border-radius: 16px;
          overflow: hidden;
        }

        .ablog-table {
          width: 100%; border-collapse: collapse;
        }

        .ablog-th {
          font-family: 'DM Sans', sans-serif;
          font-size: 9.5px; font-weight: 500;
          letter-spacing: 0.18em; text-transform: uppercase;
          color: rgba(104,80,68,0.45);
          padding: 13px 18px;
          text-align: left;
          background: rgba(104,80,68,0.03);
          border-bottom: 1px solid rgba(104,80,68,0.08);
          white-space: nowrap;
        }

        .ablog-tr {
          border-bottom: 1px solid rgba(104,80,68,0.06);
          transition: background 0.15s ease;
        }

        .ablog-tr:last-child { border-bottom: none; }
        .ablog-tr:hover { background: rgba(104,80,68,0.02); }

        .ablog-td {
          padding: 14px 18px;
          vertical-align: middle;
        }

        .ablog-post-title {
          font-family: 'DM Sans', sans-serif;
          font-size: 13.5px; font-weight: 400;
          color: var(--color-primary, #3a405a);
          margin-bottom: 3px;
          display: -webkit-box;
          -webkit-line-clamp: 1;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }

        .ablog-post-slug {
          font-family: 'DM Sans', sans-serif;
          font-size: 11px; font-weight: 300;
          color: rgba(104,80,68,0.45);
        }

        .ablog-badge {
          display: inline-flex; align-items: center;
          padding: 3px 10px; border-radius: 100px;
          font-family: 'DM Sans', sans-serif;
          font-size: 10px; font-weight: 500;
          letter-spacing: 0.08em; text-transform: uppercase;
          white-space: nowrap;
        }

        .ablog-badge-published {
          background: rgba(100,180,100,0.10);
          color: #3a7a3a;
          border: 1px solid rgba(100,180,100,0.20);
        }

        .ablog-badge-draft {
          background: rgba(200,160,60,0.10);
          color: #7a5a10;
          border: 1px solid rgba(200,160,60,0.20);
        }

        .ablog-cat {
          font-family: 'DM Sans', sans-serif;
          font-size: 11.5px; font-weight: 300;
          color: var(--color-text-soft, #685044);
        }

        .ablog-date {
          font-family: 'DM Sans', sans-serif;
          font-size: 12px; font-weight: 300;
          color: rgba(104,80,68,0.55);
          white-space: nowrap;
        }

        /* Action buttons */
        .ablog-actions-cell {
          display: flex; align-items: center; gap: 6px;
        }

        .ablog-act-btn {
          padding: 6px 12px; border-radius: 7px;
          font-family: 'DM Sans', sans-serif;
          font-size: 11.5px; font-weight: 400;
          cursor: pointer; text-decoration: none;
          border: 1px solid transparent;
          transition: background 0.2s ease, color 0.2s ease;
          display: inline-flex; align-items: center;
          white-space: nowrap;
        }

        .ablog-act-edit {
          background: rgba(58,64,90,0.06);
          color: var(--color-primary, #3a405a);
          border-color: rgba(58,64,90,0.10);
        }

        .ablog-act-edit:hover {
          background: var(--color-primary, #3a405a);
          color: #f9dec9;
        }

        .ablog-act-del {
          background: rgba(192,57,43,0.06);
          color: #c0392b;
          border-color: rgba(192,57,43,0.12);
        }

        .ablog-act-del:hover {
          background: #c0392b;
          color: white;
        }

        .ablog-act-del:disabled { opacity: 0.5; cursor: not-allowed; }

        /* Hide some columns on mobile */
        @media (max-width: 768px) {
          .ablog-col-cat, .ablog-col-date { display: none; }
        }

        .ablog-empty {
          text-align: center; padding: 48px;
          font-family: 'DM Sans', sans-serif;
          font-size: 13px; font-weight: 300;
          color: rgba(104,80,68,0.40);
        }

        .ablog-count {
          font-family: 'DM Sans', sans-serif;
          font-size: 12px; font-weight: 300;
          color: rgba(104,80,68,0.45);
        }
      `}</style>

      <div className="ablog-topbar">
        <h1 className="ablog-heading">Blog Posts</h1>
        <span className="ablog-count">{total} posts</span>
        <Link href="/admin/blog/new" className="ablog-new-btn">+ New Post</Link>
      </div>

      <div className="ablog-controls">
        <input
          className="ablog-search" type="text" placeholder="Search by title…"
          value={search} onChange={e => setSearch(e.target.value)}
        />
        <div className="ablog-filter-group">
          {(["all", "published", "draft"] as const).map(f => (
            <button key={f} className={`ablog-filter-btn ${filter === f ? "active" : ""}`}
              onClick={() => setFilter(f)}>
              {f.charAt(0).toUpperCase() + f.slice(1)}
            </button>
          ))}
        </div>
      </div>

      {error && <p className="ablog-error">⚠ {error}</p>}

      <div className="ablog-table-wrap">
        {loading ? (
          <p className="ablog-loading">Loading posts…</p>
        ) : posts.length === 0 ? (
          <p className="ablog-empty">
            {search || filter !== "all" ? "No posts match your filters." : "No posts yet. Create your first post!"}
          </p>
        ) : (
          <table className="ablog-table">
            <thead>
              <tr>
                <th className="ablog-th">Title / Slug</th>
                <th className="ablog-th">Status</th>
                <th className="ablog-th ablog-col-date">Published</th>
                <th className="ablog-th">Actions</th>
              </tr>
            </thead>
            <tbody>
              {posts.map(post => (
                <tr key={post.slug} className="ablog-tr">
                  <td className="ablog-td">
                    <div className="ablog-post-title">{post.title}</div>
                    <div className="ablog-post-slug">/{post.slug}</div>
                  </td>
                  <td className="ablog-td">
                    <span className={`ablog-badge ${post.status === "published" ? "ablog-badge-published" : "ablog-badge-draft"}`}>
                      {post.status}
                    </span>
                  </td>
                  <td className="ablog-td ablog-col-date">
                    <span className="ablog-date">{fmt(post.published_at)}</span>
                  </td>
                  <td className="ablog-td">
                    <div className="ablog-actions-cell">
                      <Link href={`/admin/blog/edit/${post.slug}`} className="ablog-act-btn ablog-act-edit">
                        Edit
                      </Link>
                      <button className="ablog-act-btn ablog-act-del"
                        onClick={() => handleDelete(post.slug)}
                        disabled={deleting === post.slug}>
                        {deleting === post.slug ? "…" : "Delete"}
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}