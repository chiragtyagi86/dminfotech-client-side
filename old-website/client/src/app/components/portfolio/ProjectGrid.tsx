import Link from "next/link";
import Container from "@/app/components/common/Container";
import SectionHeading from "@/app/components/common/SectionHeading";
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

// ── Static fallback (shown if DB returns 0 rows) ──────────────────────────────
const STATIC_PROJECTS = [
  {
    slug: "corporate-website-redesign",
    title: "Corporate Website Redesign",
    category: "Web Development",
    industry: "Professional Services",
    desc: "Full brand presence rebuild with modern UI, CMS integration and SEO-optimised architecture for a professional services firm.",
    accent: "rgba(153,178,221,0.30)",
    year: "2024",
    featured: true,
    image: "/portfolio/corp-website-redesign.jpg",
  },
  {
    slug: "education-platform-ui",
    title: "Education Platform Interface",
    category: "UI/UX Design",
    industry: "Education",
    desc: "Scalable learning platform interface with intuitive navigation, accessibility-first design and responsive layout.",
    accent: "rgba(233,175,163,0.28)",
    year: "2024",
    featured: false,
    image: "/portfolio/education-platform-ui.jpg",
  },
  {
    slug: "business-landing-system",
    title: "Business Landing Page System",
    category: "Digital Strategy",
    industry: "Startups",
    desc: "Conversion-focused landing pages with structured SEO architecture, A/B-ready components and lead funnel integration.",
    accent: "rgba(249,222,201,0.50)",
    year: "2024",
    featured: false,
    image: "/portfolio/business-landing-system.jpg",
  },
  {
    slug: "erp-management-platform",
    title: "ERP Management Platform",
    category: "Software",
    industry: "Finance",
    desc: "Custom business management system covering procurement, HR and reporting workflows for a mid-size enterprise.",
    accent: "rgba(153,178,221,0.20)",
    year: "2024",
    featured: false,
    image: "/portfolio/erp-management-platform.jpg",
  },
  {
    slug: "healthcare-portal",
    title: "Healthcare Information Portal",
    category: "Web Development",
    industry: "Healthcare",
    desc: "Patient-facing information portal with appointment structure, trust-oriented design and mobile-first layout.",
    accent: "rgba(233,175,163,0.22)",
    year: "2024",
    featured: false,
    image: "/portfolio/healthcare-portal.jpg",
  },
  {
    slug: "startup-brand-launch",
    title: "Startup Digital Brand Launch",
    category: "Branding",
    industry: "Startups",
    desc: "Complete digital identity for a technology startup — from visual system to website architecture and content strategy.",
    accent: "rgba(249,222,201,0.40)",
    year: "2024",
    featured: false,
    image: "/portfolio/startup-brand-launch.jpg",
  },
];

// ── Normalise DB row → same shape static array used ───────────────────────────
function toDisplayProjects(dbRows: PortfolioItem[]) {
  return dbRows.map((p, i) => {
    const c = parseContent(p.content);
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
      industry: c.industry || "",
      desc: p.short_desc,
      accent: c.accent || ACCENTS[i % ACCENTS.length],
      year: c.year || String(new Date().getFullYear()),
      featured: c.featured === true,
      image:
        row.image ||
        row.cover_image ||
        row.featured_image ||
        row.thumbnail ||
        c.image ||
        "",
    };
  });
}

// ── Component ─────────────────────────────────────────────────────────────────
export default function ProjectGrid({ projects }: { projects: PortfolioItem[] }) {
  // Use DB data when available, fall back to static
  const displayProjects = projects.length > 0 ? toDisplayProjects(projects) : STATIC_PROJECTS;

  return (
    <section className="projgrid-section">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,600&family=DM+Sans:wght@300;400;500&display=swap');

        .projgrid-section {
          padding: 80px 0 96px;
          background: var(--color-bg-soft);
          position: relative;
        }
.proj-img-tag {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
  transition: transform 0.45s ease;
}

.proj-card:hover .proj-img-tag {
  transform: scale(1.04);
}

.proj-img-overlay {
  position: absolute;
  inset: 0;
  background: linear-gradient(180deg, rgba(0,0,0,0.02) 0%, rgba(0,0,0,0.08) 100%);
  pointer-events: none;
}
        .projgrid-section::before {
          content: '';
          position: absolute; top: 0; left: 0; right: 0;
          height: 1px;
          background: linear-gradient(90deg, transparent, rgba(104,80,68,0.10), transparent);
        }

        .projgrid {
          display: grid;
          grid-template-columns: 1fr;
          gap: 20px;
          margin-top: 52px;
        }

        @media (min-width: 768px) { .projgrid { grid-template-columns: repeat(2, 1fr); } }
        @media (min-width: 1280px) { .projgrid { grid-template-columns: repeat(3, 1fr); } }

        /* Featured card spans full width on lg */
        @media (min-width: 768px) {
          .proj-card-featured { grid-column: 1 / -1; }
        }

        @media (min-width: 1280px) {
          .proj-card-featured { grid-column: span 2; }
        }

        .proj-card {
          border-radius: 22px;
          border: 1px solid rgba(104,80,68,0.09);
          background: rgba(255,255,255,0.65);
          backdrop-filter: blur(12px);
          overflow: hidden;
          display: flex; flex-direction: column;
          transition: transform 0.38s cubic-bezier(0.4,0,0.2,1), box-shadow 0.38s ease;
          cursor: pointer;
        }

        .proj-card:hover {
          transform: translateY(-6px);
          box-shadow: 0 24px 64px rgba(58,64,90,0.11);
        }

        /* Image placeholder */
        .proj-img {
          width: 100%; position: relative; overflow: hidden; flex-shrink: 0;
          height: 196px;
        }

        .proj-card-featured .proj-img { height: 300px; }

        .proj-img-bg {
          position: absolute; inset: 0;
        }

        .proj-img-grid {
          position: absolute; inset: 0;
          background-image:
            linear-gradient(rgba(58,64,90,0.06) 1px, transparent 1px),
            linear-gradient(90deg, rgba(58,64,90,0.06) 1px, transparent 1px);
          background-size: 28px 28px;
        }

        .proj-img-center {
          position: absolute; inset: 0;
          display: flex; align-items: center; justify-content: center; gap: 12px;
        }

        .proj-img-deco {
          width: 1px; height: 72px;
          background: linear-gradient(180deg, transparent, rgba(104,80,68,0.18), transparent);
          transform: rotate(18deg);
        }

        .proj-cms-label {
          font-family: 'DM Sans', sans-serif;
          font-size: 9.5px; font-weight: 500;
          letter-spacing: 0.16em; text-transform: uppercase;
          color: var(--color-primary);
          background: rgba(255,255,255,0.85);
          backdrop-filter: blur(8px);
          border: 1px solid rgba(104,80,68,0.12);
          padding: 4px 12px; border-radius: 100px;
          position: absolute; bottom: 14px; left: 14px;
        }

        .proj-year-label {
          font-family: 'Cormorant Garamond', serif;
          font-size: 11px; font-weight: 300;
          letter-spacing: 0.16em;
          color: var(--color-text-soft);
          background: rgba(255,255,255,0.75);
          padding: 4px 10px; border-radius: 100px;
          position: absolute; bottom: 14px; right: 14px;
        }

        /* Shimmer on hover */
        .proj-card::after {
          content: '';
          position: absolute; top: 0; left: -100%;
          width: 60%; height: 100%;
          background: linear-gradient(90deg, transparent, rgba(255,255,255,0.10), transparent);
          transform: skewX(-20deg);
          transition: left 0.6s ease;
          pointer-events: none; z-index: 2;
        }
        .proj-card:hover::after { left: 140%; }

        /* Card body */
        .proj-body {
          padding: 24px 26px 26px;
          flex: 1; display: flex; flex-direction: column;
        }

        .proj-meta {
          display: flex; align-items: center;
          justify-content: space-between;
          margin-bottom: 12px;
        }

        .proj-category {
          font-family: 'DM Sans', sans-serif;
          font-size: 10px; font-weight: 500;
          letter-spacing: 0.16em; text-transform: uppercase;
          color: var(--color-primary-2);
        }

        .proj-industry {
          font-family: 'DM Sans', sans-serif;
          font-size: 10px; font-weight: 400;
          letter-spacing: 0.08em;
          color: var(--color-text-soft);
          border: 1px solid rgba(104,80,68,0.10);
          padding: 2px 8px; border-radius: 100px;
        }

        .proj-title {
          font-family: 'Cormorant Garamond', serif;
          font-size: 22px; font-weight: 600;
          line-height: 1.2; color: var(--color-primary);
          margin: 0 0 10px;
          transition: color 0.25s ease;
        }

        .proj-card-featured .proj-title { font-size: 28px; }
        .proj-card:hover .proj-title { color: var(--color-primary-2); }

        .proj-desc {
          font-family: 'DM Sans', sans-serif;
          font-size: 13px; font-weight: 300;
          line-height: 1.75; color: var(--color-text-soft);
          margin: 0; flex: 1;
        }

        .proj-footer {
          display: flex; align-items: center;
          justify-content: space-between;
          margin-top: 20px; padding-top: 16px;
          border-top: 1px solid rgba(104,80,68,0.07);
        }

        .proj-link {
          font-family: 'DM Sans', sans-serif;
          font-size: 11.5px; font-weight: 500;
          letter-spacing: 0.10em; text-transform: uppercase;
          color: var(--color-primary); text-decoration: none;
          display: flex; align-items: center; gap: 6px;
          transition: gap 0.25s ease, color 0.25s ease;
        }

        .proj-card:hover .proj-link { gap: 10px; color: var(--color-accent-blue); }

        .proj-arrow {
          width: 30px; height: 30px; border-radius: 50%;
          border: 1px solid rgba(104,80,68,0.14);
          display: flex; align-items: center; justify-content: center;
          font-size: 14px; color: var(--color-primary);
          transition: background 0.25s ease, transform 0.25s ease, border-color 0.25s ease;
        }

        .proj-card:hover .proj-arrow {
          background: var(--color-primary);
          border-color: var(--color-primary);
          color: var(--color-surface);
          transform: rotate(45deg);
        }

        /* Featured badge */
        .proj-featured-badge {
          position: absolute; top: 14px; right: 14px; z-index: 3;
          font-family: 'DM Sans', sans-serif;
          font-size: 9px; font-weight: 500;
          letter-spacing: 0.16em; text-transform: uppercase;
          color: var(--color-primary);
          background: rgba(255,255,255,0.90);
          backdrop-filter: blur(8px);
          border: 1px solid rgba(104,80,68,0.14);
          padding: 4px 10px; border-radius: 100px;
        }
      `}</style>

      <Container>
        <SectionHeading
          eyebrow="Projects"
          title="Work that speaks for itself"
          description="Each project represents a real brief, a real challenge and a solution built for lasting results. CMS integration coming soon — these cards will fill with live project data."
        />

        <div className="projgrid">
          {displayProjects.map((proj) => (
            <Link
              key={proj.slug}
              href={`/portfolio/${proj.slug}`}
              className={`proj-card${proj.featured ? " proj-card-featured" : ""}`}
              style={{ position: "relative", textDecoration: "none" }}
            >
              {proj.featured && <span className="proj-featured-badge">Featured</span>}

              <div className={`proj-img${!proj.featured ? " proj-img-regular" : ""}`}>
  {proj.image ? (
    <>
      <img
        src={proj.image}
        alt={proj.title}
        className="proj-img-tag"
      />
      <div className="proj-img-overlay" />
    </>
  ) : (
    <>
      <div
        className="proj-img-bg"
        style={{ background: `linear-gradient(145deg, ${proj.accent}, rgba(255,250,247,0.45))` }}
      />
      <div className="proj-img-grid" />
      <div className="proj-img-center">
        {[...Array(5)].map((_, i) => (
          <div key={i} className="proj-img-deco" />
        ))}
      </div>
      <span className="proj-cms-label">Preview Coming Soon</span>
    </>
  )}

  <span className="proj-year-label">{proj.year}</span>
</div>

              <div className="proj-body">
                <div className="proj-meta">
                  <span className="proj-category">{proj.category}</span>
                  <span className="proj-industry">{proj.industry}</span>
                </div>
                <h2 className="proj-title">{proj.title}</h2>
                <p className="proj-desc">{proj.desc}</p>
                <div className="proj-footer">
                  <span className="proj-link">View Project</span>
                  <span className="proj-arrow">↗</span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </Container>
    </section>
  );
}