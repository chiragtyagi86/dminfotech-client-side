// src/components/home/PortfolioPreview.jsx
import { Link } from "react-router-dom";
import Container from "../common/Container";
import SectionHeading from "../common/SectionHeading";
import { useApi } from "../../lib/useApi";
import { api } from "../../lib/api";

const ACCENTS = [
  "rgba(153,178,221,0.30)",
  "rgba(233,175,163,0.28)",
  "rgba(249,222,201,0.50)",
  "rgba(153,178,221,0.20)",
  "rgba(233,175,163,0.22)",
  "rgba(249,222,201,0.40)",
];

const STATIC = [
  {
    slug: "sample-1",
    title: "E-Commerce Platform",
    category: "Web Development",
    short_desc: "A fast, scalable online store built for conversion.",
    content: JSON.stringify({ accent: "rgba(153,178,221,0.30)", year: "2024", status: "published" }),
  },
  {
    slug: "sample-2",
    title: "Healthcare Portal",
    category: "Software",
    short_desc: "Streamlined patient and appointment management.",
    content: JSON.stringify({ accent: "rgba(233,175,163,0.30)", year: "2024", status: "in-progress" }),
  },
  {
    slug: "sample-3",
    title: "Finance Dashboard",
    category: "UI/UX Design",
    short_desc: "Real-time analytics at a glance.",
    content: JSON.stringify({ accent: "rgba(153,178,221,0.20)", year: "2024", status: "in-progress" }),
  },
];

function parseContent(raw) {
  if (!raw) return {};
  try {
    return JSON.parse(raw);
  } catch {
    return {};
  }
}

function toDisplayProjects(items) {
  return items.map((p, i) => {
    const c = parseContent(p.content);
    return {
      slug: p.slug,
      title: p.title,
      category: p.category || "Project",
      desc: p.short_desc || "",
      accent: c.accent || ACCENTS[i % ACCENTS.length],
      year: c.year || "2024",
      status: c.status || p.status || (i === 0 ? "published" : "in-progress"),
      image: p.image || p.cover_image || p.featured_image || p.thumbnail || c.image || "",
    };
  });
}

export default function PortfolioPreview() {
  const { data, loading } = useApi(api.getPortfolioItems);
  const rawItems = Array.isArray(data) && data.length > 0 ? data.slice(0, 3) : STATIC;
  const projects = toDisplayProjects(rawItems);

  return (
    <section className="portfolio-section">
      <style>{`
        .portfolio-section {
          padding: 96px 0;
          background: var(--color-bg-soft);
          position: relative;
        }

        .portfolio-section::before,
        .portfolio-section::after {
          content: '';
          position: absolute;
          left: 0;
          right: 0;
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
          .portfolio-card-large .portfolio-img {
            height: 320px;
          }
        }

        .portfolio-img-tag {
          position: absolute;
          inset: 0;
          width: 100%;
          height: 100%;
          object-fit: cover;
          display: block;
          transition: transform 0.45s ease;
        }

        .portfolio-card:hover .portfolio-img-tag {
          transform: scale(1.04);
        }

        .portfolio-img-inner {
          position: absolute;
          inset: 0;
          display: flex;
          align-items: center;
          justify-content: center;
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

        .portfolio-img-overlay {
          position: absolute;
          inset: 0;
          background: linear-gradient(180deg, rgba(0,0,0,0.02) 0%, rgba(0,0,0,0.08) 100%);
          pointer-events: none;
        }

        .portfolio-card::after {
          content: '';
          position: absolute;
          top: 0;
          left: -100%;
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
          width: 6px;
          height: 6px;
          border-radius: 50%;
          background: var(--color-accent-blue);
          animation: statusPulse 2.5s ease infinite;
        }

        @keyframes statusPulse {
          0%, 100% { opacity: 1; transform: scale(1); }
          50% { opacity: 0.5; transform: scale(0.8); }
        }

        .portfolio-arrow {
          width: 32px;
          height: 32px;
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
          color: var(--color-surface, #fff);
          transform: rotate(45deg);
        }

        .portfolio-cta {
          margin-top: 48px;
          text-align: center;
        }

        .portfolio-cta-link {
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

        .portfolio-cta-link:hover {
          background: rgba(104,80,68,0.06);
          border-color: rgba(104,80,68,0.35);
        }

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

        .portfolio-loading {
          display: grid;
          grid-template-columns: 1fr;
          gap: 20px;
          margin-top: 56px;
        }

        @media (min-width: 768px) {
          .portfolio-loading {
            grid-template-columns: repeat(3, 1fr);
          }
        }

        .portfolio-skeleton {
          min-height: 220px;
          border-radius: 24px;
          border: 1px solid rgba(104,80,68,0.07);
          background: rgba(255,255,255,0.45);
        }

        @media (max-width: 767px) {
          .portfolio-section {
            padding: 80px 0;
          }

          .portfolio-card-large .portfolio-img,
          .portfolio-card-small .portfolio-img {
            height: 220px;
          }

          .portfolio-body {
            padding: 20px 18px 20px;
          }

          .portfolio-title,
          .portfolio-card-large .portfolio-title {
            font-size: 22px;
          }
        }
      `}</style>

      <Container>
        <SectionHeading
          eyebrow="Portfolio"
          title="A premium direction for modern digital presence"
          description="A curated selection of live projects, design work and digital solutions."
        />

        {loading ? (
          <div className="portfolio-loading">
            {[0, 1, 2].map((i) => (
              <div key={i} className="portfolio-skeleton" />
            ))}
          </div>
        ) : (
          <div className="portfolio-grid">
            {projects.map((project, index) => {
              const size = index === 0 ? "large" : "small";
              const statusColor = project.status === "published" ? "published" : "in-progress";

              return (
                <Link
                  key={project.slug}
                  to={`/portfolio/${project.slug}`}
                  className={`portfolio-card portfolio-card-${size}`}
                >
                  <span className={`portfolio-badge ${statusColor}`}>
                    {project.status === "published" ? "Live" : "Coming Soon"}
                  </span>

                  <div className="portfolio-img">
                    {project.image ? (
                      <>
                        <img
                          src={`${import.meta.env.VITE_API_URL}${project.image}`}
                          alt={project.title}
                          className="portfolio-img-tag"
                        />
                        <div className="portfolio-img-overlay" />
                      </>
                    ) : (
                      <>
                        <div
                          style={{
                            position: "absolute",
                            inset: 0,
                            background: `linear-gradient(145deg, ${project.accent}, rgba(255,250,247,0.4))`,
                          }}
                        />
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
                    <p className="portfolio-desc">
                      {project.desc?.slice(0, 120)}
                      {project.desc?.length > 120 ? "…" : ""}
                    </p>

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
        )}

        <div className="portfolio-cta">
          <Link to="/portfolio" className="portfolio-cta-link">
            View Portfolio →
          </Link>
        </div>
      </Container>
    </section>
  );
}