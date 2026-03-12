// app/blog/page.tsx
// ─────────────────────────────────────────────────────────────────────────────
// Blog listing page — fully connected to dhanamitra_cms DB.
// Fetches posts + categories server-side for full SEO.
// ─────────────────────────────────────────────────────────────────────────────

import type { Metadata } from "next";
import Link from "next/link";
import Container from "@/app/components/common/Container";
import CTASection from "@/app/components/home/CTASection";
import {
  getAllPosts,
  getAllCategories,
  getCategoryPostCounts,
  formatDate,
} from "../../../../lib/blog-data";
import type { BlogPost, BlogCategory } from "../../../../lib/blog-data";

// ── SEO Metadata ──────────────────────────────────────────────────────────────

export const metadata: Metadata = {
  title: "Blog | Digital Insights, Web Development & Business Technology — Dhanamitra Infotech LLP",
  description:
    "Articles on website development, custom software, digital strategy, SEO architecture and business technology. Practical insights for modern businesses.",
  keywords: [
    "web development blog",
    "digital strategy articles",
    "SEO guides India",
    "business technology insights",
    "custom software development tips",
    "Dhanamitra Infotech blog",
  ],
};

// ── Page ──────────────────────────────────────────────────────────────────────

export default async function BlogPage() {
  // Parallel DB fetches
  const [posts, categories, counts] = await Promise.all([
    getAllPosts(),
    getAllCategories(),
    getCategoryPostCounts(),
  ]);

  const featured = posts[0] ?? null;
  const rest = posts.slice(1);

  return (
    <main>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,600;1,300;1,400&family=DM+Sans:wght@300;400;500&display=swap');

        /* ── Hero ── */
        .blog-hero {
          position: relative; overflow: hidden;
          padding: 100px 0 72px;
          background: var(--color-bg);
        }
        .blog-hero-orb1 {
          position: absolute; width: 500px; height: 500px; border-radius: 50%;
          top: -180px; right: -80px;
          background: radial-gradient(circle, rgba(153,178,221,0.15) 0%, transparent 65%);
          pointer-events: none;
        }
        .blog-hero-orb2 {
          position: absolute; width: 320px; height: 320px; border-radius: 50%;
          bottom: -60px; left: 3%;
          background: radial-gradient(circle, rgba(233,175,163,0.10) 0%, transparent 70%);
          pointer-events: none;
        }
        .blog-hero-grid {
          position: absolute; inset: 0;
          background-image:
            linear-gradient(rgba(58,64,90,0.03) 1px, transparent 1px),
            linear-gradient(90deg, rgba(58,64,90,0.03) 1px, transparent 1px);
          background-size: 64px 64px;
          mask-image: radial-gradient(ellipse 60% 80% at 15% 50%, black 10%, transparent 100%);
          pointer-events: none;
        }
        .blog-hero-inner {
          position: relative; z-index: 1;
          max-width: 680px;
          animation: blogFadeUp 0.8s ease both;
        }
        .blog-eyebrow {
          font-family: 'DM Sans', sans-serif;
          font-size: 10.5px; font-weight: 500;
          letter-spacing: 0.22em; text-transform: uppercase;
          color: var(--color-primary-2); margin-bottom: 16px;
          display: flex; align-items: center; gap: 10px;
        }
        .blog-eyebrow::before {
          content: ''; width: 28px; height: 1px;
          background: var(--color-primary-2);
        }
        .blog-h1 {
          font-family: 'Cormorant Garamond', serif;
          font-size: clamp(36px, 6vw, 68px);
          font-weight: 300; line-height: 1.08;
          color: var(--color-primary);
          margin: 0 0 20px;
        }
        .blog-h1 em { font-style: italic; color: var(--color-primary-2); }
        .blog-sub {
          font-family: 'DM Sans', sans-serif;
          font-size: 15px; font-weight: 300; line-height: 1.75;
          color: var(--color-text-soft);
          margin: 0;
        }

        /* ── Category filter bar ── */
        .blog-filter-bar {
          padding: 0 0 40px;
          background: var(--color-bg);
        }
        .blog-filter-inner {
          display: flex; flex-wrap: wrap; gap: 8px;
          padding-top: 36px;
          border-top: 1px solid rgba(104,80,68,0.08);
        }
        .blog-filter-btn {
          display: inline-flex; align-items: center; gap: 6px;
          padding: 7px 16px; border-radius: 100px;
          border: 1px solid rgba(104,80,68,0.12);
          background: transparent;
          font-family: 'DM Sans', sans-serif;
          font-size: 12px; font-weight: 400;
          color: var(--color-primary);
          text-decoration: none;
          transition: background 0.2s ease, border-color 0.2s ease;
          cursor: pointer;
        }
        .blog-filter-btn:hover,
        .blog-filter-btn.active {
          background: var(--color-primary);
          color: var(--color-surface);
          border-color: var(--color-primary);
        }
        .blog-filter-count {
          font-size: 10px; opacity: 0.55;
        }

        /* ── Featured post ── */
        .blog-featured-section {
          padding: 0 0 64px;
          background: var(--color-bg);
        }
        .blog-section-label {
          font-family: 'DM Sans', sans-serif;
          font-size: 10.5px; font-weight: 500;
          letter-spacing: 0.22em; text-transform: uppercase;
          color: var(--color-primary-2);
          display: flex; align-items: center; gap: 12px;
          margin-bottom: 24px;
        }
        .blog-section-label::after {
          content: ''; flex: 1; height: 1px;
          background: rgba(104,80,68,0.09);
        }
        .blog-featured-card {
          display: grid; grid-template-columns: 1fr;
          gap: 0; border-radius: 24px;
          border: 1px solid rgba(104,80,68,0.09);
          overflow: hidden;
          background: rgba(255,255,255,0.65);
          backdrop-filter: blur(12px);
          text-decoration: none;
          transition: transform 0.35s ease, box-shadow 0.35s ease;
        }
        @media (min-width: 768px) {
          .blog-featured-card { grid-template-columns: 1fr 1fr; }
        }
        .blog-featured-card:hover {
          transform: translateY(-4px);
          box-shadow: 0 24px 56px rgba(58,64,90,0.10);
        }
        .blog-featured-img {
          min-height: 260px; position: relative; overflow: hidden;
        }
        @media (min-width: 768px) { .blog-featured-img { min-height: 360px; } }
        .blog-featured-img-bg { position: absolute; inset: 0; }
        .blog-featured-img-grid {
          position: absolute; inset: 0;
          background-image:
            linear-gradient(rgba(58,64,90,0.06) 1px, transparent 1px),
            linear-gradient(90deg, rgba(58,64,90,0.06) 1px, transparent 1px);
          background-size: 28px 28px;
        }
        .blog-featured-img-label {
          position: absolute; top: 16px; left: 16px;
          font-family: 'DM Sans', sans-serif;
          font-size: 9.5px; font-weight: 500;
          letter-spacing: 0.14em; text-transform: uppercase;
          color: var(--color-surface);
          background: var(--color-primary);
          padding: 4px 12px; border-radius: 100px;
        }
        .blog-featured-body {
          padding: 36px 32px;
          display: flex; flex-direction: column; justify-content: center;
        }
        .blog-featured-cat {
          font-family: 'DM Sans', sans-serif;
          font-size: 10px; font-weight: 500;
          letter-spacing: 0.16em; text-transform: uppercase;
          color: var(--color-primary-2);
          margin-bottom: 14px;
        }
        .blog-featured-title {
          font-family: 'Cormorant Garamond', serif;
          font-size: clamp(24px, 3.5vw, 38px);
          font-weight: 300; line-height: 1.15;
          color: var(--color-primary); margin: 0 0 16px;
          transition: color 0.25s ease;
        }
        .blog-featured-card:hover .blog-featured-title { color: var(--color-primary-2); }
        .blog-featured-excerpt {
          font-family: 'DM Sans', sans-serif;
          font-size: 14px; font-weight: 300; line-height: 1.80;
          color: var(--color-text-soft); margin: 0 0 24px;
        }
        .blog-featured-meta {
          display: flex; align-items: center; gap: 10px;
          font-family: 'DM Sans', sans-serif;
          font-size: 12px; font-weight: 300;
          color: var(--color-text-soft);
        }
        .blog-featured-meta-dot {
          width: 3px; height: 3px; border-radius: 50%;
          background: rgba(104,80,68,0.25);
        }
        .blog-featured-link {
          display: inline-flex; align-items: center; gap: 6px;
          margin-top: 20px;
          font-family: 'DM Sans', sans-serif;
          font-size: 11.5px; font-weight: 500;
          letter-spacing: 0.10em; text-transform: uppercase;
          color: var(--color-primary);
          transition: gap 0.25s ease, color 0.25s ease;
        }
        .blog-featured-card:hover .blog-featured-link { gap: 10px; color: var(--color-accent-blue); }

        /* ── Post grid ── */
        .blog-grid-section {
          padding: 0 0 96px;
          background: var(--color-bg);
        }
        .blog-grid {
          display: grid; grid-template-columns: 1fr;
          gap: 20px;
        }
        @media (min-width: 640px) { .blog-grid { grid-template-columns: repeat(2, 1fr); } }
        @media (min-width: 1024px) { .blog-grid { grid-template-columns: repeat(3, 1fr); } }

        .blog-card {
          border-radius: 20px;
          border: 1px solid rgba(104,80,68,0.09);
          background: rgba(255,255,255,0.65);
          backdrop-filter: blur(10px);
          overflow: hidden; display: flex; flex-direction: column;
          text-decoration: none;
          transition: transform 0.35s ease, box-shadow 0.35s ease;
          position: relative;
        }
        .blog-card:hover {
          transform: translateY(-5px);
          box-shadow: 0 20px 52px rgba(58,64,90,0.10);
        }
        .blog-card-topbar {
          height: 2px;
          background: linear-gradient(90deg, var(--color-accent-blue), var(--color-accent-blush));
          transform: scaleX(0); transform-origin: left;
          transition: transform 0.4s ease;
        }
        .blog-card:hover .blog-card-topbar { transform: scaleX(1); }
        .blog-card-img {
          height: 160px; position: relative; overflow: hidden;
        }
        .blog-card-img-bg { position: absolute; inset: 0; }
        .blog-card-img-grid {
          position: absolute; inset: 0;
          background-image:
            linear-gradient(rgba(58,64,90,0.05) 1px, transparent 1px),
            linear-gradient(90deg, rgba(58,64,90,0.05) 1px, transparent 1px);
          background-size: 20px 20px;
        }
        .blog-card-body { padding: 20px 22px 22px; flex: 1; display: flex; flex-direction: column; }
        .blog-card-cat {
          font-family: 'DM Sans', sans-serif;
          font-size: 9.5px; font-weight: 500;
          letter-spacing: 0.14em; text-transform: uppercase;
          color: var(--color-primary-2); margin-bottom: 10px;
        }
        .blog-card-title {
          font-family: 'Cormorant Garamond', serif;
          font-size: 20px; font-weight: 600; line-height: 1.25;
          color: var(--color-primary); margin: 0 0 10px;
          transition: color 0.25s ease;
        }
        .blog-card:hover .blog-card-title { color: var(--color-primary-2); }
        .blog-card-excerpt {
          font-family: 'DM Sans', sans-serif;
          font-size: 13px; font-weight: 300; line-height: 1.70;
          color: var(--color-text-soft); margin: 0 0 16px; flex: 1;
        }
        .blog-card-footer {
          display: flex; align-items: center; justify-content: space-between;
          padding-top: 12px;
          border-top: 1px solid rgba(104,80,68,0.06);
        }
        .blog-card-date {
          font-family: 'DM Sans', sans-serif;
          font-size: 11.5px; font-weight: 300;
          color: var(--color-text-soft);
        }
        .blog-card-read {
          font-family: 'DM Sans', sans-serif;
          font-size: 11px; font-weight: 500;
          letter-spacing: 0.10em; text-transform: uppercase;
          color: var(--color-primary);
          display: flex; align-items: center; gap: 4px;
          transition: gap 0.25s ease, color 0.25s ease;
        }
        .blog-card:hover .blog-card-read { gap: 8px; color: var(--color-accent-blue); }

        /* ── Empty state ── */
        .blog-empty {
          text-align: center; padding: 80px 0;
        }
        .blog-empty-icon {
          font-size: 40px; margin-bottom: 16px;
        }
        .blog-empty-title {
          font-family: 'Cormorant Garamond', serif;
          font-size: 26px; font-weight: 300;
          color: var(--color-primary); margin: 0 0 10px;
        }
        .blog-empty-sub {
          font-family: 'DM Sans', sans-serif;
          font-size: 14px; font-weight: 300;
          color: var(--color-text-soft);
        }

        @keyframes blogFadeUp {
          from { opacity: 0; transform: translateY(18px); }
          to   { opacity: 1; transform: translateY(0); }
        }
      `}</style>

      {/* ── 1. Hero ── */}
      <section className="blog-hero">
        <div className="blog-hero-orb1" />
        <div className="blog-hero-orb2" />
        <div className="blog-hero-grid" />
        <Container>
          <div className="blog-hero-inner">
            <p className="blog-eyebrow">Insights & Articles</p>
            <h1 className="blog-h1">
              Digital insights for<br /><em>modern businesses</em>
            </h1>
            <p className="blog-sub">
              Articles on website development, custom software, digital strategy,
              SEO architecture and business technology.
            </p>
          </div>
        </Container>
      </section>

      {/* ── 2. Category filter ── */}
      <section className="blog-filter-bar">
        <Container>
          <div className="blog-filter-inner">
            <Link href="/blog" className="blog-filter-btn active">
              All Posts
              <span className="blog-filter-count">({posts.length})</span>
            </Link>
            {categories.map((cat) => (
              <Link
                key={cat.slug}
                href={`/blog/category/${cat.slug}`}
                className="blog-filter-btn"
              >
                {cat.icon} {cat.name}
                <span className="blog-filter-count">({counts[cat.slug] ?? 0})</span>
              </Link>
            ))}
          </div>
        </Container>
      </section>

      {/* ── 3. Featured post ── */}
      {featured && (
        <section className="blog-featured-section">
          <Container>
            <p className="blog-section-label">Featured Article</p>
            <Link href={`/blog/${featured.slug}`} className="blog-featured-card">
              {/* Image */}
              <div className="blog-featured-img">
                {featured.cover_image ? (
                  <img
                    src={featured.cover_image}
                    alt={featured.title}
                    style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover" }}
                  />
                ) : (
                  <>
                    <div
                      className="blog-featured-img-bg"
                      style={{ background: `linear-gradient(145deg, ${featured.coverAccent}, rgba(255,250,247,0.50))` }}
                    />
                    <div className="blog-featured-img-grid" />
                  </>
                )}
                <span className="blog-featured-img-label">Featured</span>
              </div>
              {/* Body */}
              <div className="blog-featured-body">
                <p className="blog-featured-cat">
                  {featured.category_icon} {featured.category}
                </p>
                <h2 className="blog-featured-title">{featured.title}</h2>
                <p className="blog-featured-excerpt">
                  {featured.excerpt?.slice(0, 180)}{featured.excerpt?.length > 180 ? "…" : ""}
                </p>
                <div className="blog-featured-meta">
                  <span>{formatDate(featured.published_at)}</span>
                  <span className="blog-featured-meta-dot" />
                  <span>{featured.readTime} min read</span>
                </div>
                <span className="blog-featured-link">Read Article →</span>
              </div>
            </Link>
          </Container>
        </section>
      )}

      {/* ── 4. Posts grid ── */}
      <section className="blog-grid-section">
        <Container>
          {rest.length > 0 ? (
            <>
              <p className="blog-section-label">All Articles</p>
              <div className="blog-grid">
                {rest.map((post) => (
                  <BlogCard key={post.slug} post={post} />
                ))}
              </div>
            </>
          ) : posts.length === 0 ? (
            <div className="blog-empty">
              <div className="blog-empty-icon">✍️</div>
              <h2 className="blog-empty-title">No articles yet</h2>
              <p className="blog-empty-sub">Check back soon — we publish regularly.</p>
            </div>
          ) : null}
        </Container>
      </section>

      {/* ── 5. CTA ── */}
      <CTASection />
    </main>
  );
}

// ── Blog Card Component ───────────────────────────────────────────────────────

function BlogCard({ post }: { post: BlogPost }) {
  return (
    <Link href={`/blog/${post.slug}`} className="blog-card">
      <div className="blog-card-topbar" />
      <div className="blog-card-img">
        {post.cover_image ? (
          <img
            src={post.cover_image}
            alt={post.title}
            style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover" }}
          />
        ) : (
          <>
            <div
              className="blog-card-img-bg"
              style={{ background: `linear-gradient(145deg, ${post.coverAccent}, rgba(255,250,247,0.45))` }}
            />
            <div className="blog-card-img-grid" />
          </>
        )}
      </div>
      <div className="blog-card-body">
        <p className="blog-card-cat">{post.category_icon} {post.category}</p>
        <h3 className="blog-card-title">{post.title}</h3>
        <p className="blog-card-excerpt">
          {post.excerpt?.slice(0, 110)}{post.excerpt?.length > 110 ? "…" : ""}
        </p>
        <div className="blog-card-footer">
          <span className="blog-card-date">{formatDate(post.published_at)}</span>
          <span className="blog-card-read">{post.readTime} min →</span>
        </div>
      </div>
    </Link>
  );
}