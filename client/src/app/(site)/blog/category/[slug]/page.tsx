// app/blog/category/[slug]/page.tsx
// ─────────────────────────────────────────────────────────────────────────────
// Blog category filter page — /blog/category/technology etc.
// ─────────────────────────────────────────────────────────────────────────────

import { notFound } from "next/navigation";
import type { Metadata } from "next";
import Link from "next/link";
import Container from "@/app/components/common/Container";
import {
  getPostsByCategory,
  getAllCategories,
  getCategoryPostCounts,
  formatDate,
} from "../../../../../..//lib/blog-data";
import type { BlogPost, BlogCategory } from "../../../../../..//lib/blog-data";

export async function generateStaticParams() {
  const categories = await getAllCategories();
  return categories.map((c) => ({ slug: c.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const categories = await getAllCategories();
  const cat = categories.find((c) => c.slug === slug);
  if (!cat) return { title: "Category Not Found" };

  return {
    title: `${cat.name} Articles | Dhanamitra Infotech LLP Blog`,
    description: cat.description ?? `Browse all ${cat.name} articles from Dhanamitra Infotech LLP.`,
  };
}

export default async function CategoryPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  const [posts, categories, counts] = await Promise.all([
    getPostsByCategory(slug),
    getAllCategories(),
    getCategoryPostCounts(),
  ]);

  const currentCat = categories.find((c) => c.slug === slug);
  if (!currentCat) notFound();

  return (
    <main>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,600;1,300;1,400&family=DM+Sans:wght@300;400;500&display=swap');

        .cat-hero {
          position: relative; overflow: hidden;
          padding: 100px 0 72px; background: var(--color-bg);
        }
        .cat-hero-orb {
          position: absolute; width: 500px; height: 500px; border-radius: 50%;
          top: -180px; right: -80px; pointer-events: none;
          background: radial-gradient(circle, rgba(153,178,221,0.15) 0%, transparent 65%);
        }
        .cat-hero-inner { position: relative; z-index: 1; max-width: 680px; }
        .cat-eyebrow {
          font-family: 'DM Sans', sans-serif;
          font-size: 10.5px; font-weight: 500;
          letter-spacing: 0.22em; text-transform: uppercase;
          color: var(--color-primary-2); margin-bottom: 16px;
          display: flex; align-items: center; gap: 10px;
        }
        .cat-eyebrow::before { content: ''; width: 28px; height: 1px; background: var(--color-primary-2); }
        .cat-h1 {
          font-family: 'Cormorant Garamond', serif;
          font-size: clamp(36px, 6vw, 64px);
          font-weight: 300; line-height: 1.08;
          color: var(--color-primary); margin: 0 0 16px;
        }
        .cat-sub {
          font-family: 'DM Sans', sans-serif;
          font-size: 15px; font-weight: 300; line-height: 1.75;
          color: var(--color-text-soft); margin: 0 0 24px;
        }
        .cat-back {
          display: inline-flex; align-items: center; gap: 6px;
          font-family: 'DM Sans', sans-serif;
          font-size: 12px; font-weight: 400;
          color: var(--color-text-soft); text-decoration: none;
          transition: color 0.2s ease;
        }
        .cat-back:hover { color: var(--color-primary); }

        /* Filter bar */
        .cat-filter-bar { padding: 0 0 40px; background: var(--color-bg); }
        .cat-filter-inner {
          display: flex; flex-wrap: wrap; gap: 8px;
          padding-top: 36px; border-top: 1px solid rgba(104,80,68,0.08);
        }
        .cat-filter-btn {
          display: inline-flex; align-items: center; gap: 6px;
          padding: 7px 16px; border-radius: 100px;
          border: 1px solid rgba(104,80,68,0.12);
          background: transparent; text-decoration: none;
          font-family: 'DM Sans', sans-serif;
          font-size: 12px; font-weight: 400;
          color: var(--color-primary);
          transition: background 0.2s ease, border-color 0.2s ease;
        }
        .cat-filter-btn:hover, .cat-filter-btn.active {
          background: var(--color-primary); color: var(--color-surface);
          border-color: var(--color-primary);
        }
        .cat-filter-count { font-size: 10px; opacity: 0.55; }

        /* Grid */
        .cat-grid-section { padding: 0 0 96px; background: var(--color-bg); }
        .cat-section-label {
          font-family: 'DM Sans', sans-serif;
          font-size: 10.5px; font-weight: 500;
          letter-spacing: 0.22em; text-transform: uppercase;
          color: var(--color-primary-2);
          display: flex; align-items: center; gap: 12px; margin-bottom: 24px;
        }
        .cat-section-label::after { content: ''; flex: 1; height: 1px; background: rgba(104,80,68,0.09); }
        .cat-grid {
          display: grid; grid-template-columns: 1fr; gap: 20px;
        }
        @media (min-width: 640px) { .cat-grid { grid-template-columns: repeat(2, 1fr); } }
        @media (min-width: 1024px) { .cat-grid { grid-template-columns: repeat(3, 1fr); } }

        .cat-card {
          border-radius: 20px; border: 1px solid rgba(104,80,68,0.09);
          background: rgba(255,255,255,0.65); backdrop-filter: blur(10px);
          overflow: hidden; display: flex; flex-direction: column;
          text-decoration: none;
          transition: transform 0.35s ease, box-shadow 0.35s ease;
        }
        .cat-card:hover { transform: translateY(-5px); box-shadow: 0 20px 52px rgba(58,64,90,0.10); }
        .cat-card-topbar {
          height: 2px;
          background: linear-gradient(90deg, var(--color-accent-blue), var(--color-accent-blush));
          transform: scaleX(0); transform-origin: left; transition: transform 0.4s ease;
        }
        .cat-card:hover .cat-card-topbar { transform: scaleX(1); }
        .cat-card-img { height: 160px; position: relative; overflow: hidden; }
        .cat-card-img-bg { position: absolute; inset: 0; }
        .cat-card-img-grid {
          position: absolute; inset: 0;
          background-image:
            linear-gradient(rgba(58,64,90,0.05) 1px, transparent 1px),
            linear-gradient(90deg, rgba(58,64,90,0.05) 1px, transparent 1px);
          background-size: 20px 20px;
        }
        .cat-card-body { padding: 20px 22px 22px; flex: 1; display: flex; flex-direction: column; }
        .cat-card-title {
          font-family: 'Cormorant Garamond', serif;
          font-size: 20px; font-weight: 600; line-height: 1.25;
          color: var(--color-primary); margin: 0 0 10px; transition: color 0.25s ease;
        }
        .cat-card:hover .cat-card-title { color: var(--color-primary-2); }
        .cat-card-excerpt {
          font-family: 'DM Sans', sans-serif;
          font-size: 13px; font-weight: 300; line-height: 1.70;
          color: var(--color-text-soft); margin: 0 0 16px; flex: 1;
        }
        .cat-card-footer {
          display: flex; align-items: center; justify-content: space-between;
          padding-top: 12px; border-top: 1px solid rgba(104,80,68,0.06);
        }
        .cat-card-date {
          font-family: 'DM Sans', sans-serif;
          font-size: 11.5px; font-weight: 300; color: var(--color-text-soft);
        }
        .cat-card-read {
          font-family: 'DM Sans', sans-serif;
          font-size: 11px; font-weight: 500;
          letter-spacing: 0.10em; text-transform: uppercase;
          color: var(--color-primary); display: flex; align-items: center; gap: 4px;
          transition: gap 0.25s ease, color 0.25s ease;
        }
        .cat-card:hover .cat-card-read { gap: 8px; color: var(--color-accent-blue); }

        .cat-empty { text-align: center; padding: 80px 0; }
        .cat-empty-icon { font-size: 40px; margin-bottom: 16px; }
        .cat-empty-title {
          font-family: 'Cormorant Garamond', serif;
          font-size: 26px; font-weight: 300; color: var(--color-primary); margin: 0 0 10px;
        }
        .cat-empty-sub {
          font-family: 'DM Sans', sans-serif;
          font-size: 14px; font-weight: 300; color: var(--color-text-soft);
        }
      `}</style>

      {/* ── Hero ── */}
      <section className="cat-hero">
        <div className="cat-hero-orb" />
        <Container>
          <div className="cat-hero-inner">
            <Link href="/blog" className="cat-back">← All Articles</Link>
            <p className="cat-eyebrow" style={{ marginTop: "16px" }}>
              {currentCat.icon} Category
            </p>
            <h1 className="cat-h1">{currentCat.name}</h1>
            {currentCat.description && (
              <p className="cat-sub">{currentCat.description}</p>
            )}
          </div>
        </Container>
      </section>

      {/* ── Category filter ── */}
      <section className="cat-filter-bar">
        <Container>
          <div className="cat-filter-inner">
            <Link href="/blog" className="cat-filter-btn">
              All Posts <span className="cat-filter-count">({Object.values(counts).reduce((a, b) => a + b, 0)})</span>
            </Link>
            {categories.map((cat) => (
              <Link
                key={cat.slug}
                href={`/blog/category/${cat.slug}`}
                className={`cat-filter-btn${cat.slug === slug ? " active" : ""}`}
              >
                {cat.icon} {cat.name}
                <span className="cat-filter-count">({counts[cat.slug] ?? 0})</span>
              </Link>
            ))}
          </div>
        </Container>
      </section>

      {/* ── Grid ── */}
      <section className="cat-grid-section">
        <Container>
          {posts.length > 0 ? (
            <>
              <p className="cat-section-label">
                {posts.length} Article{posts.length !== 1 ? "s" : ""} in {currentCat.name}
              </p>
              <div className="cat-grid">
                {posts.map((post) => (
                  <Link key={post.slug} href={`/blog/${post.slug}`} className="cat-card">
                    <div className="cat-card-topbar" />
                    <div className="cat-card-img">
                      {post.cover_image ? (
                        <img src={post.cover_image} alt={post.title}
                          style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover" }} />
                      ) : (
                        <>
                          <div className="cat-card-img-bg"
                            style={{ background: `linear-gradient(145deg, ${post.coverAccent}, rgba(255,250,247,0.45))` }} />
                          <div className="cat-card-img-grid" />
                        </>
                      )}
                    </div>
                    <div className="cat-card-body">
                      <h3 className="cat-card-title">{post.title}</h3>
                      <p className="cat-card-excerpt">{post.excerpt?.slice(0, 110)}…</p>
                      <div className="cat-card-footer">
                        <span className="cat-card-date">{formatDate(post.published_at)}</span>
                        <span className="cat-card-read">{post.readTime} min →</span>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </>
          ) : (
            <div className="cat-empty">
              <div className="cat-empty-icon">{currentCat.icon}</div>
              <h2 className="cat-empty-title">No articles in {currentCat.name} yet</h2>
              <p className="cat-empty-sub">Check back soon or browse all articles.</p>
            </div>
          )}
        </Container>
      </section>
    </main>
  );
}