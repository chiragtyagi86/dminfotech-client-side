import Link from "next/link";
import Container from "@/app/components/common/Container";
import SectionHeading from "@/app/components/common/SectionHeading";
import Button from "@/app/components/common/Button";
import { getAllPortfolioItems } from "../../../../lib/portfolio-data";
import type { PortfolioItem } from "../../../../lib/portfolio-data";

// ── Accent colour cycle (fallback when DB row has no accent) ──────────────────
const ACCENTS = [
  "rgba(153,178,221,0.30)",
  "rgba(233,175,163,0.28)",
  "rgba(249,222,201,0.50)",
  "rgba(153,178,221,0.20)",
  "rgba(233,175,163,0.22)",
  "rgba(249,222,201,0.40)",
];

function parseContent(raw: string | null): Record<string, any> {
  if (!raw) return {};
  try { return JSON.parse(raw); } catch { return {}; }
}

function toDisplayProject(p: PortfolioItem, index: number) {
  const c = parseContent(p.content || null);
  const row = p as PortfolioItem & {
    image?: string;
    cover_image?: string;
    featured_image?: string;
    thumbnail?: string;
  };

  return {
    slug: p.slug,
    title: p.title,
    category: p.category,
desc: p.short_desc || "",
    accent: c.accent || ACCENTS[index % ACCENTS.length],
    year: c.year || String(new Date().getFullYear()),
    status: p.status || "in-progress",
    image:
      row.image ||
      row.cover_image ||
      row.featured_image ||
      row.thumbnail ||
      c.image ||
      "",
  };
}

export default async function PortfolioPreview() {
  // Fetch all portfolio items from database
  const allProjects = await getAllPortfolioItems();
  
  // Get latest 3 projects and transform them
  const projects = allProjects.slice(0, 3).map((p, i) => toDisplayProject(p, i));

  return (
    <section className="portfolio-section">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,600;1,300&family=DM+Sans:wght@300;400;500&display=swap');

        .portfolio-section {
          padding: 96px 0;
          background: var(--color-bg-soft);
          position: relative;
        }

        .portfolio-section::before,
        .portfolio-section::after {
          content: '';
          position: absolute;
          left: 0; right: 0;
          height: 1px;
          background: linear-gradient(90deg, transparent, rgba(104,80,68,0.10), transparent);
        }
        .portfolio-section::before { top: 0; }
        .portfolio-section::after { bottom: 0; }

        .portfolio-grid {
          display: grid;
          grid-template-columns: 1fr;
          gap: 20px;
          margin-top: 56px;
        }

        @media (min-width: 768px) {
          .portfolio-grid {
            grid-template-columns: repeat(2, 1fr);
            grid-template-rows: auto auto;
          }
          .portfolio-card-large {
            grid-row: span 2;
          }
        }

        @media (min-width: 1024px) {
          .portfolio-grid {
            grid-template-columns: 1.4fr 1fr 1fr;
            grid-template-rows: 1fr;
          }
          .portfolio-card-large {
            grid-row: span 1;
          }
        }

        .portfolio-card {
          position: relative;
          border-radius: 24px;
          border: 1px solid rgba(104,80,68,0.09);
          background: rgba(255,255,255,0.60);
          backdrop-filter: blur(12px);
          overflow: hidden;
          display: flex;
          flex-direction: column;
          transition: transform 0.4s cubic-bezier(0.4,0,0.2,1), box-shadow 0.4s ease;
          cursor: pointer;
          text-decoration: none;
        }

        .portfolio-card:hover {
          transform: translateY(-6px) scale(1.01);
          box-shadow: 0 24px 64px rgba(58,64,90,0.12);
        }

        /* Image placeholder */
        .portfolio-img {
          width: 100%;
          position: relative;
          overflow: hidden;
          flex-shrink: 0;
        }

        .portfolio-card-large .portfolio-img {
          height: 260px;
        }

        .portfolio-card-small .portfolio-img {
          height: 160px;
        }

        @media (min-width: 768px) {
          .portfolio-card-large .portfolio-img { height: 320px; }
        }

        .portfolio-img-inner {
          position: absolute;
          inset: 0;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        /* Animated placeholder pattern */
        .portfolio-img-pattern {
          position: absolute;
          inset: 0;
          opacity: 0.5;
        }

        .portfolio-img-label {
          position: relative;
          z-index: 1;
          font-family: 'Cormorant Garamond', serif;
          font-size: 11px;
          font-weight: 300;
          letter-spacing: 0.20em;
          text-transform: uppercase;
          color: var(--color-primary);
          opacity: 0.55;
          border: 1px solid rgba(58,64,90,0.15);
          padding: 6px 16px;
          border-radius: 100px;
        }

        /* Shimmer overlay on hover */
        .portfolio-card::after {
          content: '';
          position: absolute;
          top: 0; left: -100%;
          width: 60%;
          height: 100%;
          background: linear-gradient(90deg, transparent, rgba(255,255,255,0.12), transparent);
          transform: skewX(-20deg);
          transition: left 0.6s ease;
          pointer-events: none;
          z-index: 2;
        }

        .portfolio-card:hover::after {
          left: 140%;
        }

        .portfolio-body {
          padding: 24px 26px 26px;
          flex: 1;
          display: flex;
          flex-direction: column;
        }

        .portfolio-category {
          font-family: 'DM Sans', sans-serif;
          font-size: 10px;
          font-weight: 500;
          letter-spacing: 0.16em;
          text-transform: uppercase;
          color: var(--color-primary-2);
          margin-bottom: 10px;
        }

        .portfolio-title {
          font-family: 'Cormorant Garamond', serif;
          font-size: 22px;
          font-weight: 600;
          line-height: 1.2;
          color: var(--color-primary);
          margin: 0 0 10px;
        }

        .portfolio-card-large .portfolio-title {
          font-size: 28px;
        }

        .portfolio-desc {
          font-family: 'DM Sans', sans-serif;
          font-size: 13px;
          font-weight: 300;
          line-height: 1.7;
          color: var(--color-text-soft);
          margin: 0;
          flex: 1;
        }

        .portfolio-footer {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-top: 20px;
          padding-top: 16px;
          border-top: 1px solid rgba(104,80,68,0.07);
        }

        .portfolio-status {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          font-family: 'DM Sans', sans-serif;
          font-size: 11px;
          font-weight: 400;
          letter-spacing: 0.06em;
          color: var(--color-text-soft);
        }

        .portfolio-status-dot {
          width: 6px; height: 6px;
          border-radius: 50%;
          background: var(--color-accent-blue);
          animation: statusPulse 2.5s ease infinite;
        }

        @keyframes statusPulse {
          0%, 100% { opacity: 1; transform: scale(1); }
          50% { opacity: 0.5; transform: scale(0.8); }
        }

        .portfolio-arrow {
          width: 32px; height: 32px;
          border-radius: 50%;
          border: 1px solid rgba(104,80,68,0.14);
          background: transparent;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 14px;
          color: var(--color-primary);
          transition: background 0.25s ease, border-color 0.25s ease, transform 0.25s ease;
        }

        .portfolio-card:hover .portfolio-arrow {
          background: var(--color-primary);
          border-color: var(--color-primary);
          color: var(--color-surface);
          transform: rotate(45deg);
        }

        .portfolio-cta {
          margin-top: 48px;
          text-align: center;
        }

        /* Status badges */
        .portfolio-badge {
          position: absolute;
          top: 16px;
          right: 16px;
          z-index: 3;
          font-family: 'DM Sans', sans-serif;
          font-size: 9px;
          font-weight: 500;
          letter-spacing: 0.14em;
          text-transform: uppercase;
          color: var(--color-primary);
          background: rgba(255,255,255,0.85);
          backdrop-filter: blur(8px);
          border: 1px solid rgba(104,80,68,0.12);
          padding: 4px 10px;
          border-radius: 100px;
        }

        .portfolio-badge.published {
          color: var(--color-accent-green, #22863a);
          background: rgba(34, 134, 58, 0.08);
          border-color: rgba(34, 134, 58, 0.2);
        }

        .portfolio-badge.in-progress {
          color: var(--color-accent-blue);
          background: rgba(153, 178, 221, 0.1);
          border-color: rgba(153, 178, 221, 0.3);
        }
      `}</style>

      <Container>
        <SectionHeading
          eyebrow="Portfolio"
          title="A premium direction for modern digital presence"
          description="This section will later connect with your CMS and showcase live projects, design work, case studies and transformation stories."
        />

        <div className="portfolio-grid">
          {projects.map((project, index) => {
            // Assign sizes: first large, rest small
            const size = index === 0 ? "large" : "small";
            const statusColor = project.status === "published" ? "published" : "in-progress";
            
            return (
              <Link
                key={project.slug}
                href={`/portfolio/${project.slug}`}
                className={`portfolio-card portfolio-card-${size}`}
              >
                <span className={`portfolio-badge ${statusColor}`}>
                  {project.status === "published" ? "Live" : "Coming Soon"}
                </span>

                {/* Image with cover image or placeholder */}
                <div className="portfolio-img">
                  {project.image ? (
                    <img
                      src={project.image}
                      alt={project.title}
                      style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover" }}
                    />
                  ) : (
                    <>
                      {/* Animated colored background */}
                      <div
                        style={{
                          position: "absolute",
                          inset: 0,
                          background: `linear-gradient(145deg, ${project.accent}, rgba(255,250,247,0.4))`,
                        }}
                      />
                      {/* Grid pattern overlay */}
                      <div
                        style={{
                          position: "absolute",
                          inset: 0,
                          backgroundImage:
                            "linear-gradient(rgba(58,64,90,0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(58,64,90,0.05) 1px, transparent 1px)",
                          backgroundSize: "32px 32px",
                        }}
                      />
                      <div className="portfolio-img-inner">
                        <span className="portfolio-img-label">Preview Coming Soon</span>
                      </div>
                    </>
                  )}
                </div>

                <div className="portfolio-body">
                  <span className="portfolio-category">{project.category}</span>
                  <h3 className="portfolio-title">{project.title}</h3>
                  <p className="portfolio-desc">{project.desc?.slice(0, 120)}{project.desc?.length > 120 ? "…" : ""}</p>

                  <div className="portfolio-footer">
                    <span className="portfolio-status">
                      <span className="portfolio-status-dot" />
                      {project.status === "published" ? "Live" : "In Progress"}
                    </span>
                    <span className="portfolio-arrow">↗</span>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>

        <div className="portfolio-cta">
          <Button href="/portfolio" variant="secondary">
            View Portfolio
          </Button>
        </div>
      </Container>
    </section>
  );
}