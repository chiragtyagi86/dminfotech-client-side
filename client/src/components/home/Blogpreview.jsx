// src/components/home/BlogPreview.jsx
import { Link } from "react-router-dom";
import Container from "../common/Container";
import SectionHeading from "../common/SectionHeading";
import { useApi } from "../../lib/useApi";
import { api, formatDate } from "../../lib/api";

export default function BlogPreview() {
  const { data } = useApi(api.getPosts);
  const posts = Array.isArray(data) ? data.slice(0, 3) : [];

  return (
    <section className="blog-section">
      <style>{`
        .blog-section {
          padding: 96px 0;
          background: var(--color-bg-soft);
          position: relative;
        }

        .blog-section::before,
        .blog-section::after {
          content: '';
          position: absolute;
          left: 0;
          right: 0;
          height: 1px;
          background: linear-gradient(90deg, transparent, rgba(104,80,68,0.10), transparent);
        }

        .blog-section::before { top: 0; }
        .blog-section::after { bottom: 0; }

        .blog-grid {
          display: grid;
          grid-template-columns: 1fr;
          gap: 20px;
          margin-top: 56px;
        }

        @media (min-width: 768px) {
          .blog-grid {
            grid-template-columns: repeat(3, 1fr);
          }
        }

        .blog-card {
          border-radius: 24px;
          border: 1px solid rgba(104,80,68,0.09);
          background: rgba(255,255,255,0.60);
          backdrop-filter: blur(12px);
          overflow: hidden;
          display: flex;
          flex-direction: column;
          transition: transform 0.35s cubic-bezier(0.4,0,0.2,1), box-shadow 0.35s ease;
          cursor: pointer;
          text-decoration: none;
        }

        .blog-card:hover {
          transform: translateY(-6px);
          box-shadow: 0 20px 56px rgba(58,64,90,0.10);
        }

        .blog-img {
          height: 176px;
          position: relative;
          overflow: hidden;
          flex-shrink: 0;
        }

        .blog-img-tag {
          position: absolute;
          inset: 0;
          width: 100%;
          height: 100%;
          object-fit: cover;
          display: block;
          transition: transform 0.45s ease;
        }

        .blog-card:hover .blog-img-tag {
          transform: scale(1.04);
        }

        .blog-img-grid {
          position: absolute;
          inset: 0;
          background-image:
            linear-gradient(rgba(58,64,90,0.05) 1px, transparent 1px),
            linear-gradient(90deg, rgba(58,64,90,0.05) 1px, transparent 1px);
          background-size: 28px 28px;
        }

        .blog-img-deco {
          position: absolute;
          inset: 0;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 10px;
        }

        .blog-deco-line {
          width: 1px;
          height: 80px;
          background: linear-gradient(180deg, transparent, rgba(104,80,68,0.18), transparent);
          transform: rotate(20deg);
        }

        .blog-img-overlay {
          position: absolute;
          inset: 0;
          background: linear-gradient(180deg, rgba(0,0,0,0.02) 0%, rgba(0,0,0,0.08) 100%);
          pointer-events: none;
        }

        .blog-tag-overlay {
          position: absolute;
          bottom: 14px;
          left: 14px;
          font-family: 'DM Sans', sans-serif;
          font-size: 10px;
          font-weight: 500;
          letter-spacing: 0.14em;
          text-transform: uppercase;
          color: var(--color-primary);
          background: rgba(255,255,255,0.88);
          backdrop-filter: blur(8px);
          border: 1px solid rgba(104,80,68,0.12);
          padding: 4px 10px;
          border-radius: 100px;
        }

        .blog-read-overlay {
          position: absolute;
          bottom: 14px;
          right: 14px;
          font-family: 'DM Sans', sans-serif;
          font-size: 10px;
          font-weight: 400;
          letter-spacing: 0.06em;
          color: var(--color-text-soft);
          background: rgba(255,255,255,0.75);
          backdrop-filter: blur(8px);
          padding: 4px 10px;
          border-radius: 100px;
        }

        .blog-body {
          padding: 24px 26px 26px;
          flex: 1;
          display: flex;
          flex-direction: column;
        }

        .blog-title {
          font-family: 'Cormorant Garamond', serif;
          font-size: 21px;
          font-weight: 600;
          line-height: 1.25;
          color: var(--color-primary);
          margin: 0 0 12px;
          transition: color 0.25s ease;
        }

        .blog-card:hover .blog-title {
          color: var(--color-primary-2);
        }

        .blog-desc {
          font-family: 'DM Sans', sans-serif;
          font-size: 13px;
          font-weight: 300;
          line-height: 1.75;
          color: var(--color-text-soft);
          margin: 0;
          flex: 1;
        }

        .blog-footer {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-top: 20px;
          padding-top: 16px;
          border-top: 1px solid rgba(104,80,68,0.07);
        }

        .blog-date {
          font-family: 'DM Sans', sans-serif;
          font-size: 11.5px;
          font-weight: 300;
          color: var(--color-text-soft);
        }

        .blog-link {
          font-family: 'DM Sans', sans-serif;
          font-size: 11.5px;
          font-weight: 500;
          letter-spacing: 0.10em;
          text-transform: uppercase;
          color: var(--color-primary);
          text-decoration: none;
          display: flex;
          align-items: center;
          gap: 6px;
          transition: gap 0.25s ease, color 0.25s ease;
        }

        .blog-card:hover .blog-link {
          gap: 10px;
          color: var(--color-accent-blue);
        }

        .blog-arrow {
          width: 28px;
          height: 28px;
          border-radius: 50%;
          border: 1px solid rgba(104,80,68,0.14);
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 13px;
          color: var(--color-primary);
          transition: background 0.25s ease, transform 0.25s ease;
        }

        .blog-card:hover .blog-arrow {
          background: var(--color-primary);
          color: var(--color-surface, #fff);
          transform: rotate(45deg);
        }

        .blog-empty {
          text-align: center;
          padding: 60px 20px;
          color: var(--color-text-soft);
          font-family: 'DM Sans', sans-serif;
          margin-top: 24px;
        }

        .blog-cta {
          margin-top: 48px;
          text-align: center;
        }

        .blog-cta-link {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          padding: 13px 32px;
          border-radius: 3px;
          background: transparent;
          color: var(--color-primary);
          border: 1px solid rgba(104,80,68,0.22);
          font-family: 'DM Sans', sans-serif;
          font-size: 12.5px;
          font-weight: 500;
          letter-spacing: 0.09em;
          text-transform: uppercase;
          text-decoration: none;
          transition: background 0.25s, border-color 0.25s;
        }

        .blog-cta-link:hover {
          background: rgba(104,80,68,0.06);
          border-color: rgba(104,80,68,0.35);
        }

        @media (max-width: 767px) {
          .blog-section {
            padding: 80px 0;
          }

          .blog-grid {
            margin-top: 42px;
          }

          .blog-body {
            padding: 20px 18px 20px;
          }

          .blog-title {
            font-size: 20px;
          }

          .blog-desc {
            font-size: 12.5px;
          }
        }
      `}</style>

      <Container>
        <SectionHeading
          eyebrow="Insights"
          title="Content that supports traffic, trust and authority"
          description="Practical insights on web development, digital strategy and business technology."
        />

        {posts.length === 0 ? (
          <p className="blog-empty">Articles coming soon. Check back shortly.</p>
        ) : (
          <div className="blog-grid">
            {posts.map((post) => {
              const accent = post?.coverAccent || "rgba(153,178,221,0.28)";
              const excerpt = post?.excerpt || "";
              const readTime = post?.readTime || 5;

              return (
                <Link key={post.slug} to={`/blog/${post.slug}`} className="blog-card">
                  <div className="blog-img">
                    {post.cover_image ? (
                      <>
                        <img
                          src={`${import.meta.env.VITE_API_URL}${post.cover_image}`}
                          alt={post.title}
                          className="blog-img-tag"
                        />
                        <div className="blog-img-overlay" />
                      </>
                    ) : (
                      <>
                        <div
                          style={{
                            position: "absolute",
                            inset: 0,
                            background: `linear-gradient(145deg, ${accent}, rgba(255,250,247,0.5))`,
                          }}
                        />
                        <div className="blog-img-grid" />
                        <div className="blog-img-deco">
                          {[...Array(6)].map((_, i) => (
                            <div key={i} className="blog-deco-line" />
                          ))}
                        </div>
                      </>
                    )}

                    <span className="blog-tag-overlay">
                      {post.category_icon ? `${post.category_icon} ` : ""}
                      {post.category}
                    </span>
                    <span className="blog-read-overlay">{readTime} min read</span>
                  </div>

                  <div className="blog-body">
                    <h3 className="blog-title">{post.title}</h3>
                    <p className="blog-desc">
                      {excerpt.slice(0, 110)}
                      {excerpt.length > 110 ? "…" : ""}
                    </p>

                    <div className="blog-footer">
                      <span className="blog-date">
                        {post.published_at ? formatDate(post.published_at) : ""}
                      </span>
                      <span className="blog-link">
                        Read Article
                        <span className="blog-arrow">↗</span>
                      </span>
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        )}

        <div className="blog-cta">
          <Link to="/blog" className="blog-cta-link">
            Read More Articles →
          </Link>
        </div>
      </Container>
    </section>
  );
}