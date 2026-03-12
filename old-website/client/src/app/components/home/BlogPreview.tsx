import Link from "next/link";
import Container from "@/app/components/common/Container";
import SectionHeading from "@/app/components/common/SectionHeading";
import Button from "@/app/components/common/Button";
import { getAllPosts, formatDate } from "../../../../lib/blog-data";
import type { BlogPost } from "../../../../lib/blog-data";

export default async function BlogPreview() {
  // Fetch all posts from database
  const allPosts = await getAllPosts();
  
  // Get latest 3 posts
  const posts = allPosts.slice(0, 3);
  return (
    <section className="blog-section">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,600;1,300&family=DM+Sans:wght@300;400;500&display=swap');

        .blog-section {
          padding: 96px 0;
          background: var(--color-bg-soft);
          position: relative;
        }

        .blog-section::before,
        .blog-section::after {
          content: '';
          position: absolute;
          left: 0; right: 0;
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
          .blog-grid { grid-template-columns: repeat(3, 1fr); }
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
        }

        .blog-card:hover {
          transform: translateY(-6px);
          box-shadow: 0 20px 56px rgba(58,64,90,0.10);
        }

        /* Image area */
        .blog-img {
          height: 176px;
          position: relative;
          overflow: hidden;
          flex-shrink: 0;
        }

        .blog-img-grid {
          position: absolute;
          inset: 0;
          background-image:
            linear-gradient(rgba(58,64,90,0.05) 1px, transparent 1px),
            linear-gradient(90deg, rgba(58,64,90,0.05) 1px, transparent 1px);
          background-size: 28px 28px;
        }

        /* Animated diagonal lines decoration */
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
          width: 28px; height: 28px;
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
          color: var(--color-surface);
          transform: rotate(45deg);
        }

        .blog-cta {
          margin-top: 48px;
          text-align: center;
        }
      `}</style>

      <Container>
        <SectionHeading
          eyebrow="Insights"
          title="Content that supports traffic, trust and authority"
          description="This blog block will later connect with the CMS to display your latest SEO-focused articles."
        />

        <div className="blog-grid">
          {posts.map((post) => (
            <Link key={post.slug} href={`/blog/${post.slug}`} className="blog-card">
              <div className="blog-img">
                {post.cover_image ? (
                  <img
                    src={post.cover_image}
                    alt={post.title}
                    style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover" }}
                  />
                ) : (
                  <>
                    <div
                      style={{ position: "absolute", inset: 0, background: `linear-gradient(145deg, ${post.coverAccent || 'rgba(153,178,221,0.28)'}, rgba(255,250,247,0.5))` }}
                    />
                    <div className="blog-img-grid" />
                    <div className="blog-img-deco">
                      {[...Array(6)].map((_, i) => <div key={i} className="blog-deco-line" />)}
                    </div>
                  </>
                )}
                <span className="blog-tag-overlay">{post.category_icon} {post.category}</span>
                <span className="blog-read-overlay">{post.readTime} min read</span>
              </div>

              <div className="blog-body">
                <h3 className="blog-title">{post.title}</h3>
                <p className="blog-desc">{post.excerpt?.slice(0, 110)}{post.excerpt?.length > 110 ? "…" : ""}</p>
                <div className="blog-footer">
                  <span className="blog-link">Read Article</span>
                  <span className="blog-arrow">↗</span>
                </div>
              </div>
            </Link>
          ))}
        </div>

        <div className="blog-cta">
          <Button href="/blog" variant="secondary">Read More Articles</Button>
        </div>
      </Container>
    </section>
  );
}