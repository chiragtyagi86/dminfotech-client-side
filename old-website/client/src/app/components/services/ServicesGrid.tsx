// app/components/services/ServicesGrid.tsx
// ─────────────────────────────────────────────────────────────────────────────
// Exact same UI as original — data now comes from DB via `services` prop.
// Falls back to static data if DB returns nothing (safe for dev).
// ─────────────────────────────────────────────────────────────────────────────

import Link from "next/link";
import Container from "@/app/components/common/Container";
import SectionHeading from "@/app/components/common/SectionHeading";
import type { ServiceItem } from "../../../../lib/types";

// ── Accent colours — cycles if more services are added ────────────────────────
const ACCENTS = [
  "rgba(153,178,221,0.25)",
  "rgba(233,175,163,0.22)",
  "rgba(249,222,201,0.45)",
  "rgba(153,178,221,0.18)",
  "rgba(233,175,163,0.18)",
  "rgba(249,222,201,0.38)",
  "rgba(153,178,221,0.20)",
];

// ── Parse the JSON `content` field from the services table ────────────────────
function parseContent(raw: string | null | undefined) {
  if (!raw) return { tag: "", tagline: "", features: [] as string[] };

  try {
    const p = JSON.parse(raw);
    return {
      tag: p.tag ?? "",
      tagline: p.tagline ?? "",
      features: p.features
        ? typeof p.features === "string"
          ? p.features
              .split(",")
              .map((f: string) => f.trim())
              .filter(Boolean)
          : Array.isArray(p.features)
            ? p.features
            : []
        : ([] as string[]),
    };
  } catch {
    return { tag: "", tagline: "", features: [] as string[] };
  }
}

// ── Static fallback — shown if DB returns 0 rows ──────────────────────────────
const STATIC_SERVICES = [
  {
    num: "01",
    slug: "website-development",
    title: "Website Development",
    tag: "Web",
    tagline: "Business websites that convert",
    desc: "Fast, responsive and conversion-focused business websites, corporate portals, landing pages and CMS-powered platforms designed for credibility and growth.",
    features: [
      "Business Websites",
      "Corporate Portals",
      "Landing Pages",
      "CMS Integration",
      "E-Commerce",
    ],
    accent: "rgba(153,178,221,0.25)",
  },
  {
    num: "02",
    slug: "software-development",
    title: "Custom Software Development",
    tag: "Software",
    tagline: "Built for your operations",
    desc: "Custom business applications, automation systems, ERP tools and operational platforms engineered for scalability, reliability and long-term performance.",
    features: [
      "Business Applications",
      "ERP Systems",
      "Automation Tools",
      "API Integrations",
      "SaaS Platforms",
    ],
    accent: "rgba(233,175,163,0.22)",
  },
  {
    num: "03",
    slug: "digital-strategy",
    title: "Digital Strategy & SEO",
    tag: "Growth",
    tagline: "Visibility & performance",
    desc: "SEO-ready architecture, performance-focused pages, UI/UX optimization, lead funnels and strategic digital support built to improve search ranking and conversions.",
    features: [
      "SEO Architecture",
      "Performance Optimization",
      "Lead Funnels",
      "UI/UX Consulting",
      "Analytics Setup",
    ],
    accent: "rgba(249,222,201,0.45)",
  },
  {
    num: "04",
    slug: "it-placements",
    title: "IT Placement Services",
    tag: "Staffing",
    tagline: "The right talent, fast",
    desc: "End-to-end IT talent sourcing and placement services — connecting businesses with vetted software engineers, designers, project managers and technology specialists.",
    features: [
      "Tech Talent Sourcing",
      "Contract Staffing",
      "Permanent Placements",
      "Team Augmentation",
      "Skills Assessment",
    ],
    accent: "rgba(153,178,221,0.18)",
  },
  {
    num: "05",
    slug: "journal-publishing",
    title: "Research Journal Publishing",
    tag: "Publishing",
    tagline: "Academic excellence published",
    desc: "Professional academic and research journal publishing services — editorial support, peer-review management, digital formatting, ISSN registration and online distribution.",
    features: [
      "Editorial Support",
      "Peer Review Management",
      "ISSN Registration",
      "Digital Distribution",
      "Indexing Support",
    ],
    accent: "rgba(233,175,163,0.18)",
  },
  {
    num: "06",
    slug: "stock-market-training",
    title: "Stock Market Training",
    tag: "Finance",
    tagline: "Invest with knowledge",
    desc: "Structured stock market and investment training programs — from fundamentals to technical analysis, portfolio management and real-market trading strategies.",
    features: [
      "Fundamentals Training",
      "Technical Analysis",
      "Portfolio Management",
      "Live Market Sessions",
      "Risk Management",
    ],
    accent: "rgba(249,222,201,0.38)",
  },
  {
    num: "07",
    slug: "brand-support",
    title: "Brand & Digital Presence",
    tag: "Branding",
    tagline: "Look premium, build trust",
    desc: "Corporate digital identity, website redesign, content structure and trust-first online positioning that makes your brand stand out in a competitive market.",
    features: [
      "Website Redesign",
      "Brand Identity",
      "Content Strategy",
      "Trust Positioning",
      "Digital Collateral",
    ],
    accent: "rgba(153,178,221,0.20)",
  },
];

// ── Component ─────────────────────────────────────────────────────────────────

export default function ServicesGrid({ services }: { services: ServiceItem[] }) {
  const displayServices =
    services.length > 0
      ? services.map((svc, i) => {
          const c = parseContent(svc.content);
          return {
            num: String(i + 1).padStart(2, "0"),
            slug: svc.slug,
            title: svc.title,
            tag: c.tag || svc.icon || "",
            tagline: c.tagline || "",
            desc: svc.short_desc,
            features: c.features,
            accent: ACCENTS[i % ACCENTS.length],
          };
        })
      : STATIC_SERVICES;

  return (
    <section className="svcgrid-section">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,600;1,300&family=DM+Sans:wght@300;400;500&display=swap');

        .svcgrid-section {
          padding: 96px 0;
          background: var(--color-bg-soft);
          position: relative;
        }

        .svcgrid-section::before {
          content: '';
          position: absolute;
          top: 0; left: 0; right: 0;
          height: 1px;
          background: linear-gradient(90deg, transparent, rgba(104,80,68,0.10), transparent);
        }

        .svcgrid {
          display: grid;
          grid-template-columns: 1fr;
          gap: 20px;
          margin-top: 60px;
        }

        @media (min-width: 768px) {
          .svcgrid { grid-template-columns: repeat(2, 1fr); }
        }

        @media (min-width: 1280px) {
          .svcgrid { grid-template-columns: repeat(3, 1fr); }
          .svcgrid-card:nth-child(7) {
            grid-column: 2;
          }
        }

        .svcgrid-card {
          position: relative;
          border-radius: 22px;
          border: 1px solid rgba(104,80,68,0.09);
          background: rgba(255,255,255,0.65);
          backdrop-filter: blur(12px);
          padding: 32px 28px 28px;
          display: flex;
          flex-direction: column;
          overflow: hidden;
          transition: transform 0.38s cubic-bezier(0.4,0,0.2,1), box-shadow 0.38s ease;
        }

        .svcgrid-card:hover {
          transform: translateY(-6px);
          box-shadow: 0 24px 64px rgba(58,64,90,0.11);
        }

        .svcgrid-card-bar {
          position: absolute;
          top: 0; left: 0; right: 0;
          height: 2px;
          background: linear-gradient(90deg, var(--color-accent-blue), var(--color-accent-blush));
          border-radius: 22px 22px 0 0;
          transform: scaleX(0);
          transform-origin: left;
          transition: transform 0.45s cubic-bezier(0.4,0,0.2,1);
        }

        .svcgrid-card:hover .svcgrid-card-bar {
          transform: scaleX(1);
        }

        .svcgrid-card-bg {
          position: absolute;
          top: -40px; right: -40px;
          width: 160px; height: 160px;
          border-radius: 50%;
          opacity: 0.5;
          transition: opacity 0.35s ease, transform 0.35s ease;
          pointer-events: none;
        }

        .svcgrid-card:hover .svcgrid-card-bg {
          opacity: 0.8;
          transform: scale(1.15);
        }

        .svcgrid-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-bottom: 20px;
        }

        .svcgrid-num {
          font-family: 'Cormorant Garamond', serif;
          font-size: 13px;
          font-weight: 300;
          letter-spacing: 0.18em;
          color: var(--color-accent-blue);
        }

        .svcgrid-tag {
          font-family: 'DM Sans', sans-serif;
          font-size: 9.5px;
          font-weight: 500;
          letter-spacing: 0.16em;
          text-transform: uppercase;
          color: var(--color-primary-2);
          background: rgba(104,80,68,0.07);
          border-radius: 100px;
          padding: 3px 10px;
        }

        .svcgrid-divider {
          width: 32px; height: 1px;
          background: linear-gradient(90deg, var(--color-accent-blush), transparent);
          margin-bottom: 16px;
        }

        .svcgrid-tagline {
          font-family: 'DM Sans', sans-serif;
          font-size: 11px;
          font-weight: 400;
          letter-spacing: 0.12em;
          text-transform: uppercase;
          color: var(--color-text-soft);
          margin-bottom: 10px;
        }

        .svcgrid-title {
          font-family: 'Cormorant Garamond', serif;
          font-size: 26px;
          font-weight: 600;
          line-height: 1.15;
          color: var(--color-primary);
          margin: 0 0 14px;
        }

        .svcgrid-desc {
          font-family: 'DM Sans', sans-serif;
          font-size: 13.5px;
          font-weight: 300;
          line-height: 1.75;
          color: var(--color-text-soft);
          margin: 0 0 22px;
          flex: 1;
        }

        .svcgrid-features {
          display: flex;
          flex-wrap: wrap;
          gap: 6px;
          margin-bottom: 24px;
        }

        .svcgrid-feature {
          font-family: 'DM Sans', sans-serif;
          font-size: 10.5px;
          font-weight: 400;
          letter-spacing: 0.04em;
          color: var(--color-primary);
          border: 1px solid rgba(104,80,68,0.12);
          background: rgba(255,255,255,0.60);
          border-radius: 6px;
          padding: 3px 9px;
          transition: border-color 0.25s ease, background 0.25s ease;
        }

        .svcgrid-card:hover .svcgrid-feature {
          border-color: rgba(153,178,221,0.35);
          background: rgba(153,178,221,0.08);
        }

        .svcgrid-link {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          font-family: 'DM Sans', sans-serif;
          font-size: 11.5px;
          font-weight: 500;
          letter-spacing: 0.10em;
          text-transform: uppercase;
          color: var(--color-primary);
          text-decoration: none;
          padding-top: 16px;
          border-top: 1px solid rgba(104,80,68,0.07);
          transition: gap 0.25s ease, color 0.25s ease;
        }

        .svcgrid-card:hover .svcgrid-link {
          gap: 10px;
          color: var(--color-accent-blue);
        }

        .svcgrid-link-arrow {
          transition: transform 0.25s ease;
        }

        .svcgrid-card:hover .svcgrid-link-arrow {
          transform: translateX(3px);
        }
      `}</style>

      <Container>
        <SectionHeading
          eyebrow="Our Services"
          title="Professional Digital Solutions for Modern Businesses"
          description="From web development and custom software to IT staffing, academic publishing and financial education — we deliver end-to-end digital excellence."
        />

        <div className="svcgrid">
          {displayServices.map((svc) => (
            <div key={svc.slug} className="svcgrid-card">
              <div className="svcgrid-card-bar" />
              <div
                className="svcgrid-card-bg"
                style={{ background: `radial-gradient(circle, ${svc.accent}, transparent 70%)` }}
              />

              <div className="svcgrid-header">
                <span className="svcgrid-num">{svc.num}</span>
                <span className="svcgrid-tag">{svc.tag}</span>
              </div>

              <div className="svcgrid-divider" />
              <p className="svcgrid-tagline">{svc.tagline}</p>
              <h2 className="svcgrid-title">{svc.title}</h2>
              <p className="svcgrid-desc">{svc.desc}</p>

              <div className="svcgrid-features">
               {svc.features.map((f: string) => (
  <span key={f} className="svcgrid-feature">{f}</span>
))}
              </div>

              <Link href={`/services/${svc.slug}`} className="svcgrid-link">
                Explore Service
                <span className="svcgrid-link-arrow">→</span>
              </Link>
            </div>
          ))}
        </div>
      </Container>
    </section>
  );
}