import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { adminApi, api } from "../../lib/api";

function normalizePost(post) {
  return {
    ...post,
    published:
      typeof post.published === "boolean"
        ? post.published
        : post.status === "published" || post.status === "active",
    createdAt:
      post.createdAt ??
      post.created_at ??
      post.publishedAt ??
      post.published_at ??
      null,
  };
}

export default function AdminBlogPage() {
  const [posts, setPosts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [categoriesLoading, setCategoriesLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("all");
  const [deleting, setDeleting] = useState(null);

  useEffect(() => {
    fetchPosts();
  }, [search, filter]);

  useEffect(() => {
    fetchCategories();
  }, []);

  async function fetchPosts() {
    setLoading(true);
    try {
      const params = {};
      if (search) params.search = search;
      if (filter !== "all") params.status = filter;

      const json = await adminApi.getBlogPosts(params);
      const list = json.data ?? json ?? [];
      setPosts(Array.isArray(list) ? list.map(normalizePost) : []);
    } catch (e) {
      console.error(e);
      setPosts([]);
    } finally {
      setLoading(false);
    }
  }

  async function fetchCategories() {
    setCategoriesLoading(true);
    try {
      const json = await api.getCategories();
      const list = json.data ?? json ?? [];
      setCategories(Array.isArray(list) ? list : []);
    } catch (e) {
      console.error("Failed to load categories:", e);
      setCategories([]);
    } finally {
      setCategoriesLoading(false);
    }
  }

  async function handleDelete(slug) {
    if (!confirm("Delete this post?")) return;
    setDeleting(slug);
    try {
      await adminApi.deleteBlogPost(slug);
      setPosts((p) => p.filter((x) => x.slug !== slug));
    } catch {
      alert("Failed to delete");
    } finally {
      setDeleting(null);
    }
  }

  const categoryMap = useMemo(() => {
    const map = {};
    categories.forEach((cat) => {
      map[cat.id] = cat;
    });
    return map;
  }, [categories]);

  return (
    <div className="bl-root">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@300;400;600&family=DM+Sans:wght@300;400;500&display=swap');
        .bl-root { display:flex; flex-direction:column; gap:24px; animation:blFade 0.4s ease both; }
        @keyframes blFade { from{opacity:0;transform:translateY(8px)} to{opacity:1;transform:translateY(0)} }

        .bl-topbar { display:flex; align-items:center; gap:12px; flex-wrap:wrap; }
        .bl-heading { font-family:'Cormorant Garamond',serif; font-size:32px; font-weight:400; color:#3a405a; margin:0; flex:1; }
        .bl-new-btn { padding:10px 20px; border-radius:10px; border:none; background:#3a405a; color:#f9dec9; font-family:'DM Sans',sans-serif; font-size:11.5px; font-weight:500; letter-spacing:0.09em; text-transform:uppercase; cursor:pointer; text-decoration:none; }
        .bl-new-btn:hover { opacity:0.88; }

        .bl-filters { display:flex; gap:10px; flex-wrap:wrap; align-items:center; }
        .bl-search { flex:1; min-width:200px; padding:10px 14px; border-radius:10px; border:1px solid rgba(104,80,68,0.14); background:#fdfaf8; font-family:'DM Sans',sans-serif; font-size:13px; color:#3a405a; outline:none; }
        .bl-filter-btn { padding:8px 16px; border-radius:8px; border:1px solid rgba(104,80,68,0.14); background:#ffffff; font-family:'DM Sans',sans-serif; font-size:11px; font-weight:400; color:rgba(104,80,68,0.55); cursor:pointer; transition:all 0.15s; }
        .bl-filter-btn.active { background:#3a405a; color:#f9dec9; border-color:#3a405a; }

        .bl-layout {
          display:grid;
          grid-template-columns: minmax(0, 1fr) 320px;
          gap:24px;
          align-items:start;
        }

        .bl-table { background:#ffffff; border:1px solid rgba(104,80,68,0.09); border-radius:16px; overflow:hidden; }
        .bl-table-wrap { overflow-x:auto; }
        .bl-table table { width:100%; border-collapse:collapse; min-width:600px; }
        .bl-table th { font-family:'DM Sans',sans-serif; font-size:9.5px; font-weight:500; letter-spacing:0.16em; text-transform:uppercase; color:rgba(104,80,68,0.40); padding:14px 20px; text-align:left; border-bottom:1px solid rgba(104,80,68,0.07); background:#fdfaf8; }
        .bl-table td { font-family:'DM Sans',sans-serif; font-size:13px; font-weight:300; color:#3a405a; padding:16px 20px; border-bottom:1px solid rgba(104,80,68,0.06); vertical-align:middle; }
        .bl-table tr:last-child td { border-bottom:none; }
        .bl-table tr:hover td { background:rgba(104,80,68,0.02); }

        .bl-badge { display:inline-block; padding:3px 10px; border-radius:20px; font-family:'DM Sans',sans-serif; font-size:10.5px; font-weight:500; }
        .bl-badge.pub { background:rgba(39,174,96,0.10); color:#27ae60; }
        .bl-badge.dft { background:rgba(104,80,68,0.08); color:rgba(104,80,68,0.55); }

        .bl-actions { display:flex; gap:8px; }
        .bl-edit-btn { padding:6px 14px; border-radius:7px; border:1px solid rgba(104,80,68,0.14); background:#fdfaf8; font-family:'DM Sans',sans-serif; font-size:11px; color:#3a405a; cursor:pointer; text-decoration:none; }
        .bl-del-btn  { padding:6px 14px; border-radius:7px; border:1px solid rgba(192,57,43,0.18); background:rgba(192,57,43,0.05); font-family:'DM Sans',sans-serif; font-size:11px; color:#c0392b; cursor:pointer; }
        .bl-del-btn:disabled { opacity:0.5; cursor:not-allowed; }

        .bl-empty { text-align:center; padding:60px 20px; font-family:'DM Sans',sans-serif; font-size:14px; font-weight:300; color:rgba(104,80,68,0.40); }

        .bl-sidecard {
          background:#ffffff;
          border:1px solid rgba(104,80,68,0.09);
          border-radius:16px;
          padding:18px;
        }

        .bl-side-title {
          font-family:'Cormorant Garamond',serif;
          font-size:24px;
          font-weight:500;
          color:#3a405a;
          margin:0 0 14px;
        }

        .bl-cat-list {
          display:flex;
          flex-direction:column;
          gap:10px;
        }

        .bl-cat-item {
          display:flex;
          align-items:center;
          justify-content:space-between;
          gap:12px;
          padding:12px 14px;
          border:1px solid rgba(104,80,68,0.08);
          border-radius:12px;
          background:#fdfaf8;
        }

        .bl-cat-left {
          display:flex;
          align-items:center;
          gap:10px;
          min-width:0;
        }

        .bl-cat-icon {
          width:32px;
          height:32px;
          border-radius:10px;
          display:flex;
          align-items:center;
          justify-content:center;
          color:#fff;
          font-size:14px;
          flex-shrink:0;
        }

        .bl-cat-name {
          font-family:'DM Sans',sans-serif;
          font-size:13px;
          font-weight:500;
          color:#3a405a;
        }

        .bl-cat-slug {
          font-family:'DM Sans',sans-serif;
          font-size:11px;
          color:rgba(104,80,68,0.50);
        }

        .bl-cat-count {
          font-family:'DM Sans',sans-serif;
          font-size:11px;
          font-weight:500;
          color:rgba(104,80,68,0.65);
          background:rgba(104,80,68,0.08);
          border-radius:999px;
          padding:4px 8px;
          white-space:nowrap;
        }

        @media (max-width: 1100px) {
          .bl-layout {
            grid-template-columns: 1fr;
          }
        }
      `}</style>

      <div className="bl-topbar">
        <h1 className="bl-heading">Blog Posts</h1>
        <Link to="/admin/blog/new" className="bl-new-btn">
          + New Post
        </Link>
       
      </div>

      <div className="bl-filters">
        <input
          className="bl-search"
          placeholder="Search posts…"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        {["all", "published", "draft"].map((f) => (
          <button
            key={f}
            className={`bl-filter-btn${filter === f ? " active" : ""}`}
            onClick={() => setFilter(f)}
          >
            {f.charAt(0).toUpperCase() + f.slice(1)}
          </button>
        ))}
      </div>

      <div className="bl-layout">
        <div className="bl-table">
          <div className="bl-table-wrap">
            <table>
              <thead>
                <tr>
                  <th>Title</th>
                  <th>Category</th>
                  <th>Status</th>
                  <th>Date</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr>
                    <td colSpan={5} className="bl-empty">
                      Loading…
                    </td>
                  </tr>
                ) : posts.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="bl-empty">
                      No posts found.
                    </td>
                  </tr>
                ) : (
                  posts.map((post) => {
                    const cat = post.category_id ? categoryMap[post.category_id] : null;

                    return (
                      <tr key={post.slug ?? post.id}>
                        <td style={{ fontWeight: 400 }}>{post.title}</td>
                        <td style={{ color: "rgba(104,80,68,0.55)" }}>
                          {cat ? `${cat.icon ? `${cat.icon} ` : ""}${cat.name}` : "—"}
                        </td>
                        <td>
                          <span className={`bl-badge ${post.published ? "pub" : "dft"}`}>
                            {post.published ? "Published" : "Draft"}
                          </span>
                        </td>
                        <td style={{ color: "rgba(104,80,68,0.45)", fontSize: 12 }}>
                          {post.createdAt
                            ? new Date(post.createdAt).toLocaleDateString("en-IN", {
                                year: "numeric",
                                month: "short",
                                day: "numeric",
                              })
                            : "—"}
                        </td>
                        <td>
                          <div className="bl-actions">
                            <Link to={`/admin/blog/${post.slug}`} className="bl-edit-btn">
                              Edit
                            </Link>
                            <button
                              className="bl-del-btn"
                              disabled={deleting === post.slug}
                              onClick={() => handleDelete(post.slug)}
                            >
                              {deleting === post.slug ? "…" : "Delete"}
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>

        <aside className="bl-sidecard">
          <h2 className="bl-side-title">Categories</h2>

          {categoriesLoading ? (
            <div className="bl-empty" style={{ padding: "24px 10px" }}>Loading…</div>
          ) : categories.length === 0 ? (
            <div className="bl-empty" style={{ padding: "24px 10px" }}>No categories found.</div>
          ) : (
            <div className="bl-cat-list">
              {categories.map((cat) => {
                const count = posts.filter((p) => p.category_id === cat.id).length;

                return (
                  <div key={cat.id} className="bl-cat-item">
                    <div className="bl-cat-left">
                      <div
                        className="bl-cat-icon"
                        style={{ background: cat.color || "#99b2dd" }}
                      >
                        {cat.icon || "•"}
                      </div>
                      <div>
                        <div className="bl-cat-name">{cat.name}</div>
                        <div className="bl-cat-slug">/{cat.slug}</div>
                      </div>
                    </div>
                    <div className="bl-cat-count">{count} posts</div>
                  </div>
                );
              })}
            </div>
          )}
        </aside>
      </div>
    </div>
  );
}