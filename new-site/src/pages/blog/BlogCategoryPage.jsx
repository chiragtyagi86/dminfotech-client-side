// src/pages/blog/BlogCategoryPage.jsx
import { useParams, Link } from "react-router-dom";
import { useApi } from "../../lib/useApi";
import { api, formatDate } from "../../lib/api";
import Container from "../../components/common/Container";
import CTASection from "../../components/home/Ctasection";
import Seo from "../../components/common/Seo";

export default function BlogCategoryPage() {
  const { slug } = useParams();
  const { data: posts }  = useApi(() => api.getPostsByCategory(slug), [slug]);
  const { data: cats }   = useApi(api.getCategories);
  const { data: counts } = useApi(api.getCategoryPostCounts);
  const currentCat = (cats || []).find(c => c.slug === slug);

  return (
    <>
    <Seo
      title={`${currentCat?.name || slug} Articles | Dhanamitra Infotech LLP — Digital Solutions, Software & Business Growth`}
      description={`Explore articles in the ${currentCat?.name || slug} category on Dhanamitra Infotech LLP's blog, covering insights on digital solutions, software development, IT placements, journal publishing and stock market training for modern businesses.`}
      keywords={[
        "Dhanamitra Infotech LLP",
        `${currentCat?.name || slug} articles`,
        "digital solutions insights",
        "software development tips",
        "IT placements advice",
        "journal publishing trends",
        "stock market training strategies",
        "modern business growth",
      ]}
    />
      <style>{`
        .catpage { background: var(--color-bg); min-height: 100vh; }
        .catpage-hero { position: relative; overflow: hidden; padding: 100px 0 72px; }
        .catpage-orb { position: absolute; width: 500px; height: 500px; border-radius: 50%; top: -180px; right: -80px; background: radial-gradient(circle, rgba(153,178,221,0.15) 0%, transparent 65%); pointer-events: none; }
        .catpage-inner { position: relative; z-index: 1; max-width: 680px; }
        .catpage-back { display: inline-flex; align-items: center; gap: 6px; font-family: 'DM Sans', sans-serif; font-size: 12px; color: var(--color-text-soft); text-decoration: none; margin-bottom: 20px; transition: color 0.2s; }
        .catpage-back:hover { color: var(--color-primary); }
        .catpage-eyebrow { font-family: 'DM Sans', sans-serif; font-size: 10.5px; font-weight: 500; letter-spacing: 0.22em; text-transform: uppercase; color: var(--color-primary-2); display: flex; align-items: center; gap: 8px; margin-bottom: 14px; }
        .catpage-eyebrow::before { content: ''; width: 28px; height: 1px; background: var(--color-primary-2); }
        .catpage-h1 { font-family: 'Cormorant Garamond', serif; font-size: clamp(32px, 5.5vw, 60px); font-weight: 300; line-height: 1.10; color: var(--color-primary); margin: 0 0 16px; }
        .catpage-h1 em { font-style: italic; color: var(--color-primary-2); }
        .catpage-sub { font-family: 'DM Sans', sans-serif; font-size: 14.5px; font-weight: 300; color: var(--color-text-soft); }
        .catpage-filter { padding: 0 0 40px; }
        .catpage-filter-row { display: flex; flex-wrap: wrap; gap: 8px; padding-top: 36px; border-top: 1px solid rgba(104,80,68,0.08); }
        .catpage-filter-btn { display: inline-flex; align-items: center; gap: 6px; padding: 7px 16px; border-radius: 100px; border: 1px solid rgba(104,80,68,0.12); background: transparent; text-decoration: none; font-family: 'DM Sans', sans-serif; font-size: 12px; color: var(--color-primary); transition: background 0.2s, color 0.2s; }
        .catpage-filter-btn:hover, .catpage-filter-btn.active { background: var(--color-primary); color: white; border-color: var(--color-primary); }
        .catpage-filter-count { font-size: 10px; opacity: 0.55; }
        .catpage-grid-section { padding: 0 0 96px; }
        .catpage-label { font-family: 'DM Sans', sans-serif; font-size: 10.5px; font-weight: 500; letter-spacing: 0.22em; text-transform: uppercase; color: var(--color-primary-2); display: flex; align-items: center; gap: 12px; margin-bottom: 28px; }
        .catpage-label::after { content: ''; flex: 1; height: 1px; background: rgba(104,80,68,0.09); }
        .catpage-grid { display: grid; grid-template-columns: 1fr; gap: 20px; }
        @media (min-width: 640px) { .catpage-grid { grid-template-columns: repeat(2, 1fr); } }
        @media (min-width: 1024px) { .catpage-grid { grid-template-columns: repeat(3, 1fr); } }
        .catpage-card { border-radius: 20px; border: 1px solid rgba(104,80,68,0.09); background: rgba(255,255,255,0.65); backdrop-filter: blur(10px); overflow: hidden; display: flex; flex-direction: column; text-decoration: none; transition: transform 0.35s ease, box-shadow 0.35s ease; }
        .catpage-card:hover { transform: translateY(-5px); box-shadow: 0 20px 52px rgba(58,64,90,0.10); }
        .catpage-card-topbar { height: 2px; background: linear-gradient(90deg, var(--color-accent-blue), var(--color-accent-blush)); transform: scaleX(0); transform-origin: left; transition: transform 0.4s ease; }
        .catpage-card:hover .catpage-card-topbar { transform: scaleX(1); }
        .catpage-card-img { height: 160px; position: relative; overflow: hidden; }
        .catpage-card-img-bg { position: absolute; inset: 0; }
        .catpage-card-img-grid { position: absolute; inset: 0; background-image: linear-gradient(rgba(58,64,90,0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(58,64,90,0.05) 1px, transparent 1px); background-size: 20px 20px; }
        .catpage-card-body { padding: 20px 22px 22px; flex: 1; display: flex; flex-direction: column; }
        .catpage-card-cat { font-family: 'DM Sans', sans-serif; font-size: 9.5px; font-weight: 500; letter-spacing: 0.14em; text-transform: uppercase; color: var(--color-primary-2); margin-bottom: 8px; }
        .catpage-card-title { font-family: 'Cormorant Garamond', serif; font-size: 20px; font-weight: 600; line-height: 1.25; color: var(--color-primary); margin: 0 0 10px; transition: color 0.25s; }
        .catpage-card:hover .catpage-card-title { color: var(--color-primary-2); }
        .catpage-card-excerpt { font-family: 'DM Sans', sans-serif; font-size: 13px; font-weight: 300; line-height: 1.70; color: var(--color-text-soft); flex: 1; margin: 0 0 14px; }
        .catpage-card-footer { display: flex; align-items: center; justify-content: space-between; padding-top: 12px; border-top: 1px solid rgba(104,80,68,0.06); }
        .catpage-card-date { font-family: 'DM Sans', sans-serif; font-size: 11.5px; font-weight: 300; color: var(--color-text-soft); }
        .catpage-card-read { font-family: 'DM Sans', sans-serif; font-size: 11px; font-weight: 500; letter-spacing: 0.10em; text-transform: uppercase; color: var(--color-primary); }
        .catpage-empty { text-align: center; padding: 80px 0; }
        .catpage-empty-title { font-family: 'Cormorant Garamond', serif; font-size: 28px; font-weight: 300; color: var(--color-primary); margin: 0 0 12px; }
        .catpage-empty-sub { font-family: 'DM Sans', sans-serif; font-size: 14px; color: var(--color-text-soft); }
      `}</style>
      <main className="catpage">
        <section className="catpage-hero">
          <div className="catpage-orb" />
          <Container>
            <div className="catpage-inner">
              <Link to="/blog" className="catpage-back">← Back to all articles</Link>
              <p className="catpage-eyebrow">{currentCat?.icon} {currentCat?.name || "Category"}</p>
              <h1 className="catpage-h1">Articles in <em>{currentCat?.name || slug}</em></h1>
              <p className="catpage-sub">{(posts || []).length} article{(posts || []).length !== 1 ? "s" : ""} in this category</p>
            </div>
          </Container>
        </section>

        <section className="catpage-filter">
          <Container>
            <div className="catpage-filter-row">
              <Link to="/blog" className="catpage-filter-btn">All Posts</Link>
              {(cats || []).map(cat => (
                <Link key={cat.slug} to={`/blog/category/${cat.slug}`} className={`catpage-filter-btn${cat.slug === slug ? " active" : ""}`}>
                  {cat.icon} {cat.name} <span className="catpage-filter-count">({(counts || {})[cat.slug] || 0})</span>
                </Link>
              ))}
            </div>
          </Container>
        </section>

        <section className="catpage-grid-section">
          <Container>
            {(posts || []).length === 0 ? (
              <div className="catpage-empty">
                <h2 className="catpage-empty-title">No articles in this category yet</h2>
                <p className="catpage-empty-sub">Check back soon or <Link to="/blog" style={{ color: "var(--color-primary)" }}>browse all articles</Link>.</p>
              </div>
            ) : (
              <>
                <p className="catpage-label">{(posts || []).length} Articles</p>
                <div className="catpage-grid">
                  {(posts || []).map(post => (
                    <Link key={post.slug} to={`/blog/${post.slug}`} className="catpage-card">
                      <div className="catpage-card-topbar" />
                      <div className="catpage-card-img">
                        {post.cover_image
                          ? <img src={post.cover_image} alt={post.title} style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover" }} />
                          : <><div className="catpage-card-img-bg" style={{ background: `linear-gradient(145deg, ${post.coverAccent || "rgba(153,178,221,0.30)"}, rgba(255,250,247,0.45))` }} /><div className="catpage-card-img-grid" /></>
                        }
                      </div>
                      <div className="catpage-card-body">
                        <p className="catpage-card-cat">{post.category_icon} {post.category}</p>
                        <h3 className="catpage-card-title">{post.title}</h3>
                        <p className="catpage-card-excerpt">{(post.excerpt || "").slice(0, 110)}{(post.excerpt || "").length > 110 ? "…" : ""}</p>
                        <div className="catpage-card-footer">
                          <span className="catpage-card-date">{formatDate(post.published_at)}</span>
                          <span className="catpage-card-read">{post.readTime} min →</span>
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              </>
            )}
          </Container>
        </section>
        <CTASection />
      </main>
    </>
  );
}