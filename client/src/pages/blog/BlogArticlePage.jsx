// src/pages/blog/BlogArticlePage.jsx
import { useParams, Link } from "react-router-dom";
import { useApi } from "../../lib/useApi";
import { api, formatDate } from "../../lib/api";
import Container from "../../components/common/Container";
import Seo from "../../components/common/Seo";

export default function BlogArticlePage() {
  const { slug } = useParams();

  const { data: post, loading, error } = useApi(() => api.getPost(slug), [slug]);

  const { data: related = [] } = useApi(
    () =>
      post
        ? api.getPostsByCategory(post.category_slug || post.category)
        : Promise.resolve([]),
    [post?.slug]
  );

  if (loading) return <PageState type="loading" />;
  if (error || !post) return <PageState type="404" />;

  const siteUrl = import.meta.env.VITE_SITE_URL || window.location.origin;
  const articleUrl = `${siteUrl}/blog/${post.slug}`;

  const filteredRelated = (related || [])
    .filter((rel) => rel.slug !== slug)
    .slice(0, 3);

  return (
    <>
    <Seo
      title={`${post.title} | Dhanamitra Infotech LLP Blog`}
      description={post.excerpt || post.description || "Read our latest insights and updates on digital solutions, software development, IT placements, journal publishing, and stock market training."}
      keywords={[post.category, ...(post.tags || [])].filter(Boolean)}
      image={post.cover_image || "/logo.png"}
      url={`/blog/${post.slug}`}
    />
    <main>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,600;1,300;1,400&family=DM+Sans:wght@300;400;500&display=swap');

        /* ── Article Hero ── */
        .art-hero {
          position: relative; overflow: hidden;
          padding: 100px 0 72px;
          background: var(--color-bg);
        }
        .art-hero-orb1 {
          position: absolute; width: 500px; height: 500px; border-radius: 50%;
          top: -180px; right: -100px;
          background: radial-gradient(circle, rgba(153,178,221,0.16) 0%, transparent 65%);
          pointer-events: none;
        }
        .art-hero-orb2 {
          position: absolute; width: 300px; height: 300px; border-radius: 50%;
          bottom: -80px; left: 5%;
          background: radial-gradient(circle, rgba(233,175,163,0.11) 0%, transparent 70%);
          pointer-events: none;
        }
        .art-hero-grid {
          position: absolute; inset: 0;
          background-image:
            linear-gradient(rgba(58,64,90,0.03) 1px, transparent 1px),
            linear-gradient(90deg, rgba(58,64,90,0.03) 1px, transparent 1px);
          background-size: 64px 64px;
          -webkit-mask-image: radial-gradient(ellipse 60% 80% at 15% 50%, black 10%, transparent 100%);
          mask-image: radial-gradient(ellipse 60% 80% at 15% 50%, black 10%, transparent 100%);
          pointer-events: none;
        }
        .art-hero-inner {
          position: relative; z-index: 1;
          max-width: 780px;
          animation: artFadeUp 0.8s ease both;
        }
        .art-breadcrumb {
          display: flex; align-items: center; gap: 8px;
          margin-bottom: 20px;
          font-family: 'DM Sans', sans-serif;
          font-size: 11.5px; font-weight: 400;
          color: var(--color-text-soft);
        }
        .art-breadcrumb a { color: var(--color-text-soft); text-decoration: none; transition: color 0.2s ease; }
        .art-breadcrumb a:hover { color: var(--color-primary); }
        .art-breadcrumb-sep { font-size: 10px; opacity: 0.4; }
        .art-breadcrumb-current {
          color: var(--color-primary); font-weight: 500;
          max-width: 260px; white-space: nowrap; overflow: hidden; text-overflow: ellipsis;
        }
        .art-meta-strip {
          display: flex; flex-wrap: wrap; align-items: center; gap: 10px;
          margin-bottom: 22px;
        }
        .art-meta-cat {
          font-family: 'DM Sans', sans-serif;
          font-size: 10px; font-weight: 500;
          letter-spacing: 0.16em; text-transform: uppercase;
          color: var(--color-primary);
          background: rgba(153,178,221,0.18);
          border: 1px solid rgba(153,178,221,0.30);
          padding: 4px 12px; border-radius: 100px;
        }
        .art-meta-sep { width: 3px; height: 3px; border-radius: 50%; background: rgba(104,80,68,0.25); }
        .art-meta-text {
          font-family: 'DM Sans', sans-serif;
          font-size: 12px; font-weight: 300;
          color: var(--color-text-soft);
        }
        .art-h1 {
          font-family: 'Cormorant Garamond', serif;
          font-size: clamp(32px, 5.5vw, 62px);
          font-weight: 300; line-height: 1.10;
          color: var(--color-primary);
          margin: 0 0 24px;
          animation: artFadeUp 0.85s ease 0.1s both;
        }
        .art-h1 em { font-style: italic; color: var(--color-primary-2); }
        .art-cover {
          width: 100%; border-radius: 20px;
          overflow: hidden; position: relative;
          margin-top: 40px;
          animation: artFadeUp 0.85s ease 0.2s both;
        }
        .art-cover-placeholder {
          height: 340px; position: relative;
        }
        @media (min-width: 768px) { .art-cover-placeholder { height: 440px; } }
        .art-cover-bg { position: absolute; inset: 0; }
        .art-cover-grid {
          position: absolute; inset: 0;
          background-image:
            linear-gradient(rgba(58,64,90,0.06) 1px, transparent 1px),
            linear-gradient(90deg, rgba(58,64,90,0.06) 1px, transparent 1px);
          background-size: 32px 32px;
        }
        .art-cover-label {
          position: absolute; bottom: 18px; left: 18px;
          font-family: 'DM Sans', sans-serif;
          font-size: 10px; font-weight: 500;
          letter-spacing: 0.14em; text-transform: uppercase;
          color: var(--color-primary);
          background: rgba(255,255,255,0.88); backdrop-filter: blur(8px);
          border: 1px solid rgba(104,80,68,0.12);
          padding: 5px 14px; border-radius: 100px;
        }
        @keyframes artFadeUp {
          from { opacity: 0; transform: translateY(18px); }
          to   { opacity: 1; transform: translateY(0); }
        }

        /* ── Article body layout ── */
        .art-layout {
          padding: 64px 0 80px;
          background: var(--color-bg);
          position: relative;
        }
        .art-layout::before {
          content: '';
          position: absolute; top: 0; left: 0; right: 0; height: 1px;
          background: linear-gradient(90deg, transparent, rgba(104,80,68,0.10), transparent);
        }
        .art-layout-grid {
          display: grid; grid-template-columns: 1fr;
          gap: 48px; align-items: start;
        }
        @media (min-width: 1024px) {
          .art-layout-grid { grid-template-columns: 1fr 280px; gap: 64px; }
        }

        /* ── Main prose ── */
        .art-prose { max-width: 100%; }
        .art-intro {
          font-family: 'DM Sans', sans-serif;
          font-size: 16.5px; font-weight: 300;
          line-height: 1.90; color: var(--color-text-soft);
          margin: 0 0 48px;
          padding-bottom: 40px;
          border-bottom: 1px solid rgba(104,80,68,0.08);
        }
        .art-intro p { margin: 0 0 20px; }
        .art-intro p:last-child { margin: 0; }

        .art-content {
          font-family: 'DM Sans', sans-serif;
          font-size: 15px; font-weight: 300;
          line-height: 1.88; color: var(--color-text-soft);
          margin: 0 0 48px;
        }
        .art-content h2 {
          font-family: 'Cormorant Garamond', serif;
          font-size: clamp(22px, 3vw, 32px); font-weight: 600; line-height: 1.2;
          color: var(--color-primary); margin: 44px 0 16px;
          padding-bottom: 12px;
          border-bottom: 1px solid rgba(104,80,68,0.07);
          position: relative;
        }
        .art-content h2::before {
          content: '';
          position: absolute; bottom: -1px; left: 0;
          width: 40px; height: 1px;
          background: linear-gradient(90deg, var(--color-accent-blue), var(--color-accent-blush));
        }
        .art-content h3 {
          font-family: 'Cormorant Garamond', serif;
          font-size: clamp(18px, 2.5vw, 24px); font-weight: 600;
          color: var(--color-primary); margin: 32px 0 12px;
        }
        .art-content p { margin: 0 0 18px; }
        .art-content p:last-child { margin: 0; }
        .art-content ul, .art-content ol {
          padding-left: 20px; margin: 0 0 18px;
        }
        .art-content li { margin-bottom: 8px; }
        .art-content a {
          color: var(--color-primary); font-weight: 500;
          border-bottom: 1px solid rgba(58,64,90,0.25);
          text-decoration: none; transition: border-color 0.2s ease;
        }
        .art-content a:hover { border-color: var(--color-accent-blue); }
        .art-content blockquote {
          border-left: 3px solid var(--color-accent-blue);
          padding: 12px 20px; margin: 24px 0;
          background: rgba(153,178,221,0.06);
          border-radius: 0 12px 12px 0;
          font-style: italic; color: var(--color-primary);
        }
        .art-content img {
          width: 100%; border-radius: 12px; margin: 24px 0;
        }

        /* ── Internal Links Block ── */
        .art-links-block {
          background: var(--color-bg-soft);
          border: 1px solid rgba(104,80,68,0.09);
          border-radius: 16px; padding: 24px; margin: 40px 0;
        }
        .art-links-title {
          font-family: 'DM Sans', sans-serif;
          font-size: 10.5px; font-weight: 500;
          letter-spacing: 0.18em; text-transform: uppercase;
          color: var(--color-text-soft); margin: 0 0 14px;
        }
        .art-link-row {
          display: flex; align-items: center; justify-content: space-between;
          gap: 12px; padding: 11px 0;
          border-bottom: 1px solid rgba(104,80,68,0.06);
          text-decoration: none;
          transition: padding-left 0.25s ease;
        }
        .art-link-row:last-child { border-bottom: none; }
        .art-link-row:hover { padding-left: 4px; }
        .art-link-row-text {
          font-family: 'DM Sans', sans-serif;
          font-size: 13.5px; font-weight: 400; color: var(--color-primary);
        }
        .art-link-row-tag {
          font-family: 'DM Sans', sans-serif;
          font-size: 9.5px; font-weight: 500;
          letter-spacing: 0.12em; text-transform: uppercase;
          color: var(--color-text-soft);
          border: 1px solid rgba(104,80,68,0.12);
          padding: 2px 8px; border-radius: 100px; white-space: nowrap;
        }

        /* ── Article CTA ── */
        .art-cta {
          border-radius: 20px; background: var(--color-primary);
          padding: 44px 36px; text-align: center;
          position: relative; overflow: hidden; margin: 48px 0 0;
        }
        .art-cta::before {
          content: ''; position: absolute; inset: 0;
          background-image:
            linear-gradient(rgba(255,250,247,0.03) 1px, transparent 1px),
            linear-gradient(90deg, rgba(255,250,247,0.03) 1px, transparent 1px);
          background-size: 40px 40px;
        }
        .art-cta-inner { position: relative; z-index: 1; }
        .art-cta-eyebrow {
          font-family: 'DM Sans', sans-serif;
          font-size: 10px; font-weight: 500;
          letter-spacing: 0.20em; text-transform: uppercase;
          color: rgba(249,222,201,0.50); margin-bottom: 12px;
        }
        .art-cta-title {
          font-family: 'Cormorant Garamond', serif;
          font-size: clamp(22px, 3.5vw, 32px);
          font-weight: 300; line-height: 1.2;
          color: var(--color-surface); margin: 0 0 20px;
        }
        .art-cta-title em { font-style: italic; color: var(--color-accent-blush); }
        .art-cta-btns { display: flex; flex-wrap: wrap; gap: 10px; justify-content: center; }
        .art-cta-btn-primary {
          display: inline-flex; align-items: center; gap: 6px;
          padding: 11px 24px; border-radius: 3px;
          background: var(--color-surface); color: var(--color-primary);
          font-family: 'DM Sans', sans-serif;
          font-size: 12px; font-weight: 500;
          letter-spacing: 0.09em; text-transform: uppercase;
          text-decoration: none;
          transition: transform 0.25s ease, box-shadow 0.25s ease;
        }
        .art-cta-btn-primary:hover { transform: translateY(-1px); box-shadow: 0 8px 24px rgba(0,0,0,0.20); }
        .art-cta-btn-secondary {
          display: inline-flex; align-items: center; gap: 6px;
          padding: 11px 24px; border-radius: 3px;
          background: transparent; color: rgba(249,222,201,0.70);
          border: 1px solid rgba(249,222,201,0.20);
          font-family: 'DM Sans', sans-serif;
          font-size: 12px; font-weight: 500;
          letter-spacing: 0.09em; text-transform: uppercase;
          text-decoration: none;
          transition: background 0.25s ease, color 0.25s ease;
        }
        .art-cta-btn-secondary:hover { background: rgba(249,222,201,0.08); color: var(--color-surface); }

        /* ── Author ── */
        .art-author {
          display: flex; align-items: center; gap: 18px;
          padding: 28px 0; margin-top: 48px;
          border-top: 1px solid rgba(104,80,68,0.08);
          border-bottom: 1px solid rgba(104,80,68,0.08);
        }
        .art-author-avatar {
          width: 52px; height: 52px; border-radius: 50%;
          background: var(--color-primary);
          display: flex; align-items: center; justify-content: center;
          font-family: 'Cormorant Garamond', serif;
          font-size: 22px; font-weight: 600;
          color: var(--color-surface); flex-shrink: 0;
        }
        .art-author-label {
          font-family: 'DM Sans', sans-serif;
          font-size: 10px; font-weight: 500;
          letter-spacing: 0.16em; text-transform: uppercase;
          color: var(--color-text-soft); margin: 0 0 4px;
        }
        .art-author-name {
          font-family: 'Cormorant Garamond', serif;
          font-size: 20px; font-weight: 600;
          color: var(--color-primary); margin: 0 0 4px;
        }
        .art-author-role {
          font-family: 'DM Sans', sans-serif;
          font-size: 12.5px; font-weight: 300;
          color: var(--color-text-soft); margin: 0;
        }

        /* ── Sidebar ── */
        .art-sidebar { display: flex; flex-direction: column; gap: 20px; }
        @media (min-width: 1024px) { .art-sidebar { position: sticky; top: 96px; } }
        .art-share-card {
          border-radius: 18px;
          border: 1px solid rgba(104,80,68,0.09);
          background: rgba(255,255,255,0.65);
          backdrop-filter: blur(10px);
          padding: 20px 22px; text-align: center;
        }
        .art-share-title {
          font-family: 'DM Sans', sans-serif;
          font-size: 10px; font-weight: 500;
          letter-spacing: 0.16em; text-transform: uppercase;
          color: var(--color-text-soft); margin: 0 0 14px;
        }
        .art-share-btns { display: flex; flex-direction: column; gap: 8px; }
        .art-share-btn {
          display: flex; align-items: center; gap: 10px;
          padding: 10px 14px; border-radius: 10px;
          border: 1px solid rgba(104,80,68,0.10);
          background: transparent; cursor: pointer;
          text-decoration: none;
          font-family: 'DM Sans', sans-serif;
          font-size: 12.5px; font-weight: 400;
          color: var(--color-primary);
          transition: background 0.25s ease;
        }
        .art-share-btn:hover { background: var(--color-bg-soft); }

        .art-share-icon {
          width: 22px; height: 22px; border-radius: 6px;
          display: flex; align-items: center; justify-content: center;
          font-size: 12px;
        }

        /* ── Related Articles ── */
        .art-related-section {
          padding: 80px 0 96px; background: var(--color-bg-soft); position: relative;
        }
        .art-related-section::before {
          content: '';
          position: absolute; top: 0; left: 0; right: 0; height: 1px;
          background: linear-gradient(90deg, transparent, rgba(104,80,68,0.10), transparent);
        }
        .art-related-grid {
          display: grid; grid-template-columns: 1fr; gap: 18px; margin-top: 44px;
        }
        @media (min-width: 640px) { .art-related-grid { grid-template-columns: repeat(3, 1fr); } }
        .art-rel-card {
          border-radius: 20px;
          border: 1px solid rgba(104,80,68,0.09);
          background: rgba(255,255,255,0.65);
          backdrop-filter: blur(10px);
          overflow: hidden; display: flex; flex-direction: column;
          text-decoration: none;
          transition: transform 0.35s ease, box-shadow 0.35s ease;
        }
        .art-rel-card:hover { transform: translateY(-5px); box-shadow: 0 20px 52px rgba(58,64,90,0.10); }
        .art-rel-top-bar {
          height: 2px;
          background: linear-gradient(90deg, var(--color-accent-blue), var(--color-accent-blush));
          transform: scaleX(0); transform-origin: left; transition: transform 0.4s ease;
        }
        .art-rel-card:hover .art-rel-top-bar { transform: scaleX(1); }
        .art-rel-img { height: 140px; position: relative; overflow: hidden; }
        .art-rel-img-bg { position: absolute; inset: 0; }
        .art-rel-img-grid {
          position: absolute; inset: 0;
          background-image:
            linear-gradient(rgba(58,64,90,0.05) 1px, transparent 1px),
            linear-gradient(90deg, rgba(58,64,90,0.05) 1px, transparent 1px);
          background-size: 20px 20px;
        }
        .art-rel-body { padding: 18px 20px 20px; flex: 1; display: flex; flex-direction: column; }
        .art-rel-cat {
          font-family: 'DM Sans', sans-serif;
          font-size: 9.5px; font-weight: 500;
          letter-spacing: 0.14em; text-transform: uppercase;
          color: var(--color-primary-2); margin-bottom: 8px;
        }
        .art-rel-title {
          font-family: 'Cormorant Garamond', serif;
          font-size: 18px; font-weight: 600; line-height: 1.25;
          color: var(--color-primary); margin: 0 0 8px; transition: color 0.25s ease;
        }
        .art-rel-card:hover .art-rel-title { color: var(--color-primary-2); }
        .art-rel-excerpt {
          font-family: 'DM Sans', sans-serif;
          font-size: 12.5px; font-weight: 300; line-height: 1.65;
          color: var(--color-text-soft); margin: 0 0 14px; flex: 1;
        }
        .art-rel-link {
          font-family: 'DM Sans', sans-serif;
          font-size: 11px; font-weight: 500;
          letter-spacing: 0.10em; text-transform: uppercase;
          color: var(--color-primary);
          display: flex; align-items: center; gap: 5px;
          transition: gap 0.25s ease, color 0.25s ease;
        }
        .art-rel-card:hover .art-rel-link { gap: 9px; color: var(--color-accent-blue); }
        .art-related-label {
          font-family: 'DM Sans', sans-serif;
          font-size: 10.5px; font-weight: 500;
          letter-spacing: 0.22em; text-transform: uppercase;
          color: var(--color-primary-2);
          display: flex; align-items: center; gap: 12px; margin-bottom: 0;
        }
        .art-related-label::after { content: ''; flex: 1; height: 1px; background: rgba(104,80,68,0.09); }

        @keyframes spin {
          to { transform: rotate(360deg); }
        }
      `}</style>

      <section className="art-hero">
        <div className="art-hero-orb1" />
        <div className="art-hero-orb2" />
        <div className="art-hero-grid" />

        <Container>
          <div className="art-hero-inner">
            <nav className="art-breadcrumb" aria-label="breadcrumb">
              <Link to="/">Home</Link>
              <span className="art-breadcrumb-sep">›</span>
              <Link to="/blog">Blog</Link>
              <span className="art-breadcrumb-sep">›</span>
              <span className="art-breadcrumb-current">{post.title}</span>
            </nav>

            <div className="art-meta-strip">
              <span className="art-meta-cat">
                {post.category_icon} {post.category}
              </span>
              <span className="art-meta-sep" />
              <span className="art-meta-text">{formatDate(post.published_at)}</span>
              <span className="art-meta-sep" />
              <span className="art-meta-text">{post.readTime} min read</span>
            </div>

            <h1 className="art-h1">{post.title}</h1>
          </div>

          <div className="art-cover">
            {post.cover_image ? (
              <img
                src={`${import.meta.env.VITE_API_URL}${post.cover_image}`}
                alt={post.title}
                style={{
                  width: "100%",
                  maxHeight: "440px",
                  objectFit: "cover",
                  borderRadius: "20px",
                }}
              />
            ) : (
              <div className="art-cover-placeholder">
                <div
                  className="art-cover-bg"
                  style={{
                    background: `linear-gradient(145deg, ${
                      post.coverAccent || "rgba(153,178,221,0.30)"
                    }, rgba(255,250,247,0.50))`,
                  }}
                />
                <div className="art-cover-grid" />
                <span className="art-cover-label">
                  {post.category_icon} {post.category}
                </span>
              </div>
            )}
          </div>
        </Container>
      </section>

      <section className="art-layout">
        <Container>
          <div className="art-layout-grid">
            <article className="art-prose">
              {post.excerpt && (
                <div className="art-intro">
                  {post.excerpt.split("\n\n").map((para, i) => (
                    <p key={i}>{para}</p>
                  ))}
                </div>
              )}

              {post.content && (
                <div
                  className="art-content"
                  dangerouslySetInnerHTML={{ __html: post.content }}
                />
              )}

              <div className="art-links-block">
                <p className="art-links-title">Explore More</p>
                {[
                  { text: "Explore our services", href: "/services", label: "Services" },
                  { text: "View our portfolio", href: "/portfolio", label: "Portfolio" },
                  { text: "Book a free consultation", href: "/contact", label: "Contact" },
                ].map((link) => (
                  <Link key={link.href} to={link.href} className="art-link-row">
                    <span className="art-link-row-text">{link.text}</span>
                    <span className="art-link-row-tag">{link.label}</span>
                  </Link>
                ))}
              </div>

              <div className="art-cta">
                <div className="art-cta-inner">
                  <p className="art-cta-eyebrow">Ready to take action?</p>
                  <h3 className="art-cta-title">
                    Need a modern website or
                    <br />
                    <em>custom software solution?</em>
                  </h3>
                  <div className="art-cta-btns">
                    <Link to="/contact" className="art-cta-btn-primary">
                      Book Free Consultation →
                    </Link>
                    <Link to="/services" className="art-cta-btn-secondary">
                      View Services
                    </Link>
                  </div>
                </div>
              </div>

              {post.author && (
                <div className="art-author">
                  <div className="art-author-avatar">
                    {(post.author.name || "A").charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <p className="art-author-label">Written by</p>
                    <p className="art-author-name">{post.author.name}</p>
                    <p className="art-author-role">
                      {post.author.role} · Dhanamitra Infotech LLP
                    </p>
                  </div>
                </div>
              )}
            </article>

            <aside className="art-sidebar">
              <div className="art-share-card">
                <p className="art-share-title">Share This Article</p>
                <div className="art-share-btns">
                  {[
                    {
                      label: "Share on LinkedIn",
                      bg: "#0077B5",
                      icon: "in",
                      href: `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(
                        articleUrl
                      )}`,
                    },
                    {
                      label: "Share on Twitter / X",
                      bg: "#000",
                      icon: "𝕏",
                      href: `https://twitter.com/intent/tweet?url=${encodeURIComponent(
                        articleUrl
                      )}&text=${encodeURIComponent(post.title)}`,
                    },
                    {
                      label: "Share on WhatsApp",
                      bg: "#25D366",
                      icon: "W",
                      href: `https://wa.me/?text=${encodeURIComponent(
                        `${post.title} — ${articleUrl}`
                      )}`,
                    },
                  ].map((s) => (
                    <a
                      key={s.label}
                      href={s.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="art-share-btn"
                    >
                      <span
                        className="art-share-icon"
                        style={{
                          background: s.bg,
                          color: "white",
                          fontSize: "11px",
                          fontWeight: 600,
                          borderRadius: 6,
                        }}
                      >
                        {s.icon}
                      </span>
                      {s.label}
                    </a>
                  ))}
                </div>
              </div>

              <Link
                to="/blog"
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "8px",
                  padding: "12px 16px",
                  borderRadius: "12px",
                  border: "1px solid rgba(104,80,68,0.09)",
                  background: "rgba(255,255,255,0.55)",
                  fontFamily: "'DM Sans', sans-serif",
                  fontSize: "12.5px",
                  fontWeight: 400,
                  color: "var(--color-primary)",
                  textDecoration: "none",
                  transition: "background 0.25s ease",
                }}
              >
                ← Back to Blog
              </Link>
            </aside>
          </div>
        </Container>
      </section>

      {filteredRelated.length > 0 && (
        <section className="art-related-section">
          <Container>
            <p className="art-related-label">Continue Reading</p>
            <div className="art-related-grid">
              {filteredRelated.map((rel) => (
                <Link key={rel.slug} to={`/blog/${rel.slug}`} className="art-rel-card">
                  <div className="art-rel-top-bar" />
                  <div className="art-rel-img">
                    {rel.cover_image ? (
                      <img
                        src={`${import.meta.env.VITE_API_URL}${rel.cover_image}`}
                        alt={rel.title}
                        style={{
                          position: "absolute",
                          inset: 0,
                          width: "100%",
                          height: "100%",
                          objectFit: "cover",
                        }}
                      />
                    ) : (
                      <>
                        <div
                          className="art-rel-img-bg"
                          style={{
                            background: `linear-gradient(145deg, ${
                              rel.coverAccent || "rgba(153,178,221,0.30)"
                            }, rgba(255,250,247,0.45))`,
                          }}
                        />
                        <div className="art-rel-img-grid" />
                      </>
                    )}
                  </div>
                  <div className="art-rel-body">
                    <p className="art-rel-cat">
                      {rel.category_icon} {rel.category}
                    </p>
                    <h3 className="art-rel-title">{rel.title}</h3>
                    <p className="art-rel-excerpt">
                      {rel.excerpt ? `${rel.excerpt.slice(0, 100)}…` : ""}
                    </p>
                    <span className="art-rel-link">Read Article →</span>
                  </div>
                </Link>
              ))}
            </div>
          </Container>
        </section>
      )}
    </main>
    </>
  );
}

function PageState({ type }) {
  return (
    <div
      style={{
        minHeight: "60vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "var(--color-bg)",
      }}
    >
      {type === "loading" ? (
        <div
          style={{
            width: 40,
            height: 40,
            borderRadius: "50%",
            border: "3px solid rgba(153,178,221,0.25)",
            borderTopColor: "var(--color-primary)",
            animation: "spin 0.8s linear infinite",
          }}
        />
      ) : (
        <div style={{ textAlign: "center" }}>
          <h1
            style={{
              fontFamily: "'Cormorant Garamond', serif",
              fontSize: 52,
              fontWeight: 300,
              color: "var(--color-primary)",
            }}
          >
            Article Not Found
          </h1>
          <Link to="/blog" style={{ color: "var(--color-primary)" }}>
            ← Back to Blog
          </Link>
        </div>
      )}
    </div>
  );
}