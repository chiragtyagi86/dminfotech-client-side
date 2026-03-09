import Link from "next/link";
import Container from "@/app/components/common/Container";
import SectionHeading from "@/app/components/common/SectionHeading";
import { blogPosts, formatDate } from "../../../../lib/blog-data";

// ── CMS NOTE: Replace blogPosts import with async CMS fetch ──
// e.g.  const posts = await getPosts()  ← your CMS function
// The rest of this component works unchanged.
const featured = blogPosts.find((p) => p.featured)!;
const grid = blogPosts.filter((p) => !p.featured);

export default function BlogContent() {
  return (
    <>
      {/* ─── Featured Article ─────────────────────────────────────── */}
      <section className="blog-featured-section">
        <style>{`
          @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,600;1,300&family=DM+Sans:wght@300;400;500&display=swap');

          .blog-featured-section {
            padding: 72px 0 0;
            background: var(--color-bg-soft);
            position: relative;
          }

          .blog-featured-section::before {
            content: '';
            position: absolute; top: 0; left: 0; right: 0; height: 1px;
            background: linear-gradient(90deg, transparent, rgba(104,80,68,0.10), transparent);
          }

          .blog-featured-label {
            display: inline-flex; align-items: center; gap: 10px;
            margin-bottom: 28px;
            font-family: 'DM Sans', sans-serif;
            font-size: 10.5px; font-weight: 500;
            letter-spacing: 0.20em; text-transform: uppercase;
            color: var(--color-primary-2);
          }

          .blog-featured-label::before {
            content: '';
            display: block; width: 24px; height: 1px;
            background: linear-gradient(90deg, var(--color-accent-blue), var(--color-accent-blush));
          }

          /* Featured card */
          .blog-featured-card {
            display: grid; grid-template-columns: 1fr;
            border-radius: 24px;
            border: 1px solid rgba(104,80,68,0.09);
            background: rgba(255,255,255,0.70);
            backdrop-filter: blur(14px);
            overflow: hidden;
            transition: box-shadow 0.35s ease;
            text-decoration: none;
          }

          @media (min-width: 1024px) {
            .blog-featured-card { grid-template-columns: 1.2fr 1fr; }
          }

          .blog-featured-card:hover {
            box-shadow: 0 24px 64px rgba(58,64,90,0.11);
          }

          /* Cover image placeholder */
          .bfc-img {
            position: relative; min-height: 280px; overflow: hidden;
          }

          @media (min-width: 1024px) { .bfc-img { min-height: 420px; } }

          .bfc-img-bg {
            position: absolute; inset: 0;
          }

          .bfc-img-grid {
            position: absolute; inset: 0;
            background-image:
              linear-gradient(rgba(58,64,90,0.055) 1px, transparent 1px),
              linear-gradient(90deg, rgba(58,64,90,0.055) 1px, transparent 1px);
            background-size: 32px 32px;
          }

          /* Animated diagonal stripes decoration */
          .bfc-img-deco {
            position: absolute; inset: 0;
            display: flex; align-items: center; justify-content: center; gap: 14px;
          }

          .bfc-deco-stripe {
            width: 1px; height: 100px;
            background: linear-gradient(180deg, transparent, rgba(104,80,68,0.15), transparent);
            transform: rotate(22deg);
          }

          /* Top accent bar */
          .bfc-accent-bar {
            position: absolute; top: 0; left: 0; right: 0; height: 3px;
            background: linear-gradient(90deg, var(--color-accent-blue), var(--color-accent-blush));
          }

          .bfc-cat-badge {
            position: absolute; top: 18px; left: 18px;
            font-family: 'DM Sans', sans-serif;
            font-size: 10px; font-weight: 500;
            letter-spacing: 0.14em; text-transform: uppercase;
            color: var(--color-primary);
            background: rgba(255,255,255,0.90); backdrop-filter: blur(8px);
            border: 1px solid rgba(104,80,68,0.12);
            padding: 4px 12px; border-radius: 100px;
          }

          /* Body */
          .bfc-body {
            padding: 40px 36px 40px;
            display: flex; flex-direction: column;
            justify-content: center; gap: 0;
          }

          .bfc-meta {
            display: flex; align-items: center; gap: 12px;
            margin-bottom: 16px;
          }

          .bfc-meta-date {
            font-family: 'DM Sans', sans-serif;
            font-size: 11.5px; font-weight: 300;
            color: var(--color-text-soft);
          }

          .bfc-meta-sep {
            width: 3px; height: 3px; border-radius: 50%;
            background: rgba(104,80,68,0.25);
          }

          .bfc-meta-read {
            font-family: 'DM Sans', sans-serif;
            font-size: 11.5px; font-weight: 300;
            color: var(--color-text-soft);
          }

          .bfc-title {
            font-family: 'Cormorant Garamond', serif;
            font-size: clamp(24px, 3vw, 38px);
            font-weight: 600; line-height: 1.18;
            color: var(--color-primary); margin: 0 0 16px;
            transition: color 0.25s ease;
          }

          .blog-featured-card:hover .bfc-title { color: var(--color-primary-2); }

          .bfc-excerpt {
            font-family: 'DM Sans', sans-serif;
            font-size: 14.5px; font-weight: 300;
            line-height: 1.80; color: var(--color-text-soft);
            margin: 0 0 28px;
          }

          .bfc-link {
            display: inline-flex; align-items: center; gap: 8px;
            font-family: 'DM Sans', sans-serif;
            font-size: 12px; font-weight: 500;
            letter-spacing: 0.10em; text-transform: uppercase;
            color: var(--color-primary);
            padding: 10px 22px; border-radius: 3px;
            background: var(--color-btn-primary);
            color: var(--color-btn-primary-text);
            transition: transform 0.25s ease, box-shadow 0.25s ease;
            width: fit-content;
          }

          .blog-featured-card:hover .bfc-link {
            transform: translateY(-1px);
            box-shadow: 0 8px 24px rgba(58,64,90,0.20);
          }

          .bfc-link-arrow { transition: transform 0.25s ease; }
          .blog-featured-card:hover .bfc-link-arrow { transform: translateX(4px); }

          .bfc-author {
            display: flex; align-items: center; gap: 10px;
            margin-top: 32px; padding-top: 24px;
            border-top: 1px solid rgba(104,80,68,0.07);
          }

          .bfc-author-avatar {
            width: 32px; height: 32px; border-radius: 50%;
            background: linear-gradient(135deg, var(--color-accent-blue), var(--color-accent-blush));
            display: flex; align-items: center; justify-content: center;
            font-family: 'Cormorant Garamond', serif;
            font-size: 14px; font-weight: 600; color: white;
            flex-shrink: 0;
          }

          .bfc-author-name {
            font-family: 'DM Sans', sans-serif;
            font-size: 12.5px; font-weight: 500; color: var(--color-primary); margin: 0;
          }

          .bfc-author-role {
            font-family: 'DM Sans', sans-serif;
            font-size: 11px; font-weight: 300; color: var(--color-text-soft); margin: 0;
          }

          /* ─── Blog Grid ─────────────────────────────── */
          .blog-grid-section {
            padding: 72px 0 96px;
            background: var(--color-bg-soft);
          }

          .blog-grid {
            display: grid; grid-template-columns: 1fr;
            gap: 20px; margin-top: 52px;
          }

          @media (min-width: 640px) { .blog-grid { grid-template-columns: repeat(2, 1fr); } }
          @media (min-width: 1280px) { .blog-grid { grid-template-columns: repeat(3, 1fr); } }

          .blog-card {
            border-radius: 22px;
            border: 1px solid rgba(104,80,68,0.09);
            background: rgba(255,255,255,0.65);
            backdrop-filter: blur(12px);
            overflow: hidden;
            display: flex; flex-direction: column;
            text-decoration: none;
            transition: transform 0.38s cubic-bezier(0.4,0,0.2,1), box-shadow 0.38s ease;
          }

          .blog-card:hover {
            transform: translateY(-6px);
            box-shadow: 0 24px 60px rgba(58,64,90,0.10);
          }

          /* Shimmer sweep */
          .blog-card::after {
            content: '';
            position: absolute; top: 0; left: -100%;
            width: 60%; height: 100%;
            background: linear-gradient(90deg, transparent, rgba(255,255,255,0.10), transparent);
            transform: skewX(-20deg);
            transition: left 0.6s ease;
            pointer-events: none; z-index: 2;
          }
          .blog-card:hover::after { left: 140%; }
          .blog-card { position: relative; }

          /* Image */
          .bc-img {
            height: 168px; position: relative; overflow: hidden; flex-shrink: 0;
          }

          .bc-img-bg { position: absolute; inset: 0; }

          .bc-img-grid {
            position: absolute; inset: 0;
            background-image:
              linear-gradient(rgba(58,64,90,0.05) 1px, transparent 1px),
              linear-gradient(90deg, rgba(58,64,90,0.05) 1px, transparent 1px);
            background-size: 24px 24px;
          }

          .bc-img-deco {
            position: absolute; inset: 0;
            display: flex; align-items: center; justify-content: center; gap: 10px;
          }

          .bc-deco-line {
            width: 1px; height: 64px;
            background: linear-gradient(180deg, transparent, rgba(104,80,68,0.16), transparent);
            transform: rotate(18deg);
          }

          .bc-cat {
            position: absolute; bottom: 12px; left: 12px;
            font-family: 'DM Sans', sans-serif;
            font-size: 9.5px; font-weight: 500;
            letter-spacing: 0.14em; text-transform: uppercase;
            color: var(--color-primary);
            background: rgba(255,255,255,0.90); backdrop-filter: blur(8px);
            border: 1px solid rgba(104,80,68,0.10);
            padding: 3px 10px; border-radius: 100px;
          }

          .bc-read {
            position: absolute; bottom: 12px; right: 12px;
            font-family: 'DM Sans', sans-serif;
            font-size: 9.5px; font-weight: 300;
            color: var(--color-text-soft);
            background: rgba(255,255,255,0.75);
            padding: 3px 10px; border-radius: 100px;
          }

          /* Top bar that reveals on hover */
          .bc-top-bar {
            position: absolute; top: 0; left: 0; right: 0; height: 2px;
            background: linear-gradient(90deg, var(--color-accent-blue), var(--color-accent-blush));
            border-radius: 22px 22px 0 0;
            transform: scaleX(0); transform-origin: left;
            transition: transform 0.45s cubic-bezier(0.4,0,0.2,1);
          }

          .blog-card:hover .bc-top-bar { transform: scaleX(1); }

          /* Body */
          .bc-body {
            padding: 22px 24px 24px;
            flex: 1; display: flex; flex-direction: column;
          }

          .bc-date {
            font-family: 'DM Sans', sans-serif;
            font-size: 11px; font-weight: 300;
            color: var(--color-text-soft); margin-bottom: 10px;
          }

          .bc-title {
            font-family: 'Cormorant Garamond', serif;
            font-size: 21px; font-weight: 600;
            line-height: 1.22; color: var(--color-primary);
            margin: 0 0 10px;
            transition: color 0.25s ease;
          }

          .blog-card:hover .bc-title { color: var(--color-primary-2); }

          .bc-excerpt {
            font-family: 'DM Sans', sans-serif;
            font-size: 13px; font-weight: 300;
            line-height: 1.75; color: var(--color-text-soft);
            margin: 0; flex: 1;
          }

          .bc-footer {
            display: flex; align-items: center;
            justify-content: space-between;
            margin-top: 18px; padding-top: 14px;
            border-top: 1px solid rgba(104,80,68,0.07);
          }

          .bc-link {
            font-family: 'DM Sans', sans-serif;
            font-size: 11px; font-weight: 500;
            letter-spacing: 0.10em; text-transform: uppercase;
            color: var(--color-primary); text-decoration: none;
            display: flex; align-items: center; gap: 5px;
            transition: gap 0.25s ease, color 0.25s ease;
          }

          .blog-card:hover .bc-link { gap: 9px; color: var(--color-accent-blue); }

          .bc-arrow {
            width: 28px; height: 28px; border-radius: 50%;
            border: 1px solid rgba(104,80,68,0.14);
            display: flex; align-items: center; justify-content: center;
            font-size: 13px; color: var(--color-primary);
            transition: background 0.25s ease, transform 0.25s ease, border-color 0.25s ease;
          }

          .blog-card:hover .bc-arrow {
            background: var(--color-primary);
            border-color: var(--color-primary);
            color: var(--color-surface);
            transform: rotate(45deg);
          }

          /* Tags row */
          .bc-tags {
            display: flex; flex-wrap: wrap; gap: 5px; margin-top: 12px;
          }

          .bc-tag {
            font-family: 'DM Sans', sans-serif;
            font-size: 10px; font-weight: 400;
            color: var(--color-primary);
            border: 1px solid rgba(104,80,68,0.11);
            background: rgba(255,255,255,0.50);
            padding: 2px 8px; border-radius: 5px;
          }
        `}</style>

        <Container>
          {/* Featured label */}
          <div className="blog-featured-label">Featured Article</div>

          {/* Featured card */}
          <Link href={`/blog/${featured.slug}`} className="blog-featured-card">
            {/* Cover */}
            <div className="bfc-img">
              <div className="bfc-img-bg"
                style={{ background: `linear-gradient(145deg, ${featured.coverAccent}, rgba(255,250,247,0.50))` }} />
              <div className="bfc-img-grid" />
              <div className="bfc-img-deco">
                {[...Array(7)].map((_, i) => <div key={i} className="bfc-deco-stripe" />)}
              </div>
              <div className="bfc-accent-bar" />
              <span className="bfc-cat-badge">{featured.category}</span>
            </div>

            {/* Body */}
            <div className="bfc-body">
              <div className="bfc-meta">
                <span className="bfc-meta-date">{formatDate(featured.publishDate)}</span>
                <span className="bfc-meta-sep" />
                <span className="bfc-meta-read">{featured.readTime} min read</span>
              </div>

              <h2 className="bfc-title">{featured.title}</h2>
              <p className="bfc-excerpt">{featured.excerpt}</p>

              <span className="bfc-link">
                Read Article
                <span className="bfc-link-arrow">→</span>
              </span>

              <div className="bfc-author">
                <div className="bfc-author-avatar">D</div>
                <div>
                  <p className="bfc-author-name">{featured.author.name}</p>
                  <p className="bfc-author-role">{featured.author.role}</p>
                </div>
              </div>
            </div>
          </Link>
        </Container>
      </section>

      {/* ─── Blog Grid ─────────────────────────────────────────────── */}
      <section className="blog-grid-section">
        <Container>
          <SectionHeading
            eyebrow="All Articles"
            title="Insights worth reading"
            description="Practical knowledge on web development, digital strategy, software and business technology — updated regularly."
          />

          <div className="blog-grid">
            {grid.map((post) => (
              <Link key={post.slug} href={`/blog/${post.slug}`} className="blog-card">
                <div className="bc-top-bar" />

                {/* Image */}
                <div className="bc-img">
                  <div className="bc-img-bg"
                    style={{ background: `linear-gradient(145deg, ${post.coverAccent}, rgba(255,250,247,0.45))` }} />
                  <div className="bc-img-grid" />
                  <div className="bc-img-deco">
                    {[...Array(5)].map((_, i) => <div key={i} className="bc-deco-line" />)}
                  </div>
                  <span className="bc-cat">{post.category}</span>
                  <span className="bc-read">{post.readTime} min</span>
                </div>

                {/* Body */}
                <div className="bc-body">
                  <p className="bc-date">{formatDate(post.publishDate)}</p>
                  <h3 className="bc-title">{post.title}</h3>
                  <p className="bc-excerpt">{post.excerpt}</p>

                  <div className="bc-tags">
                    {post.tags.slice(0, 3).map((t) => (
                      <span key={t} className="bc-tag">#{t}</span>
                    ))}
                  </div>

                  <div className="bc-footer">
                    <span className="bc-link">Read More</span>
                    <span className="bc-arrow">↗</span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </Container>
      </section>
    </>
  );
}