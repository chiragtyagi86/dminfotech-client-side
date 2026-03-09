import Link from "next/link";
import Container from "@/app/components/common/Container";
import SectionHeading from "@/app/components/common/SectionHeading";
import type { ServiceItem } from "../../../../lib/types";

// ── Accent colour cycle (fallback when DB row has no accent) ──────────────────
const ACCENTS = [
  "rgba(153,178,221,0.30)",
  "rgba(233,175,163,0.28)",
  "rgba(249,222,201,0.50)",
  "rgba(153,178,221,0.20)",
  "rgba(233,175,163,0.22)",
  "rgba(249,222,201,0.40)",
];

function parseContent(raw: string | null | undefined): Record<string, any> {
  if (!raw) return {};
  try {
    return JSON.parse(raw);
  } catch {
    return {};
  }
}

function toDisplayProject(p: ServiceItem, index: number) {
  const c = parseContent(p.content || null);

  return {
    slug: p.slug,
    title: p.title,
    tag: c.tag || p.icon || "Service",
    tagline: c.tagline || "",
    desc: p.short_desc || "",
    accent: c.accent || ACCENTS[index % ACCENTS.length],
    num: String(index + 1).padStart(2, "0"),
  };
}

// ── Static fallback — shown if DB returns 0 rows ──────────────────────────────
const STATIC_SERVICES = [
  {
    num: "01",
    slug: "website-development",
    title: "Website Development",
    tag: "Web",
    tagline: "Business websites that convert",
    desc: "Fast, responsive and conversion-focused business websites designed for credibility and growth.",
    accent: "rgba(153,178,221,0.25)",
  },
  {
    num: "02",
    slug: "software-development",
    title: "Software Solutions",
    tag: "Software",
    tagline: "Built for your operations",
    desc: "Custom platforms, automation systems and operational tools built for scalability.",
    accent: "rgba(233,175,163,0.22)",
  },
  {
    num: "03",
    slug: "digital-strategy",
    title: "Digital Growth",
    tag: "SEO & Growth",
    tagline: "Visibility & performance",
    desc: "SEO-ready architecture, lead funnels, performance pages and strategic digital support.",
    accent: "rgba(249,222,201,0.45)",
  },
  {
    num: "04",
    slug: "brand-support",
    title: "Brand Support",
    tag: "Branding",
    tagline: "Look premium, build trust",
    desc: "Corporate presentation, content structure and trust-first online positioning for your company.",
    accent: "rgba(153,178,221,0.18)",
  },
];

// ── Get latest 4 services from database ────────────────────────────────────────
async function getLatestServices(): Promise<ServiceItem[]> {
  try {
    const { getAllServices } = await import("../../../../lib/services-data");
    const services = await getAllServices();
    return services.slice(0, 4);
  } catch (error) {
    console.warn("Could not fetch services from database, using static fallback");
    return [];
  }
}

// ── Component ─────────────────────────────────────────────────────────────────

export default async function ServicesPreview() {
  const dbServices = await getLatestServices();

  const displayServices =
    dbServices.length > 0
      ? dbServices.map((svc, i) => toDisplayProject(svc, i))
      : STATIC_SERVICES;

  return (
    <section className="services-section">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,600;1,300&family=DM+Sans:wght@300;400;500&display=swap');

        .services-section {
          padding: 96px 0;
          position: relative;
          background: var(--color-bg-soft);
        }

        .services-section::before {
          content: '';
          position: absolute;
          top: 0; left: 0; right: 0;
          height: 1px;
          background: linear-gradient(90deg, transparent, rgba(104,80,68,0.12), transparent);
        }

        .services-grid {
          display: grid;
          gap: 20px;
          grid-template-columns: 1fr;
          margin-top: 56px;
        }

        @media (min-width: 768px) {
          .services-grid { grid-template-columns: repeat(2, 1fr); }
        }

        @media (min-width: 1280px) {
          .services-grid { grid-template-columns: repeat(4, 1fr); }
        }

        .service-card {
          position: relative;
          border-radius: 20px;
          border: 1px solid rgba(104,80,68,0.09);
          background: rgba(255,255,255,0.65);
          backdrop-filter: blur(10px);
          padding: 32px 28px 28px;
          display: flex;
          flex-direction: column;
          overflow: hidden;
          transition: transform 0.35s cubic-bezier(0.4,0,0.2,1), box-shadow 0.35s ease;
        }

        .service-card::before {
          content: '';
          position: absolute;
          inset: 0;
          background: linear-gradient(145deg, rgba(153,178,221,0.10) 0%, transparent 50%);
          opacity: 0;
          transition: opacity 0.35s ease;
        }

        .service-card:hover {
          transform: translateY(-6px);
          box-shadow: 0 20px 56px rgba(58,64,90,0.10);
        }

        .service-card:hover::before {
          opacity: 1;
        }

        .service-card-accent {
          position: absolute;
          top: 0; left: 0; right: 0;
          height: 2px;
          background: linear-gradient(90deg, var(--color-accent-blue), var(--color-accent-blush));
          border-radius: 20px 20px 0 0;
          transform: scaleX(0);
          transform-origin: left;
          transition: transform 0.45s cubic-bezier(0.4,0,0.2,1);
        }

        .service-card:hover .service-card-accent {
          transform: scaleX(1);
        }

        .service-num {
          font-family: 'Cormorant Garamond', serif;
          font-size: 13px;
          font-weight: 300;
          letter-spacing: 0.15em;
          color: var(--color-accent-blue);
          margin-bottom: 20px;
        }

        .service-tag {
          display: inline-block;
          font-family: 'DM Sans', sans-serif;
          font-size: 10px;
          font-weight: 500;
          letter-spacing: 0.14em;
          text-transform: uppercase;
          color: var(--color-primary-2);
          background: rgba(104,80,68,0.07);
          border-radius: 100px;
          padding: 3px 10px;
          margin-bottom: 14px;
        }

        .service-title {
          font-family: 'Cormorant Garamond', serif;
          font-size: 24px;
          font-weight: 600;
          line-height: 1.2;
          color: var(--color-primary);
          margin: 0 0 14px;
          flex-shrink: 0;
        }

        .service-desc {
          font-family: 'DM Sans', sans-serif;
          font-size: 13.5px;
          font-weight: 300;
          line-height: 1.75;
          color: var(--color-text-soft);
          flex: 1;
          margin: 0;
        }

        .service-link {
          margin-top: 24px;
          display: inline-flex;
          align-items: center;
          gap: 6px;
          font-family: 'DM Sans', sans-serif;
          font-size: 12px;
          font-weight: 500;
          letter-spacing: 0.08em;
          text-transform: uppercase;
          color: var(--color-primary);
          text-decoration: none;
          transition: gap 0.25s ease, color 0.25s ease;
        }

        .service-link:hover {
          gap: 10px;
          color: var(--color-accent-blue);
        }

        .service-link-arrow {
          transition: transform 0.25s ease;
        }

        .service-link:hover .service-link-arrow {
          transform: translateX(3px);
        }

        .service-divider {
          width: 28px;
          height: 1px;
          background: linear-gradient(90deg, var(--color-accent-blush), transparent);
          margin-bottom: 16px;
        }

        .service-tagline {
          font-family: 'DM Sans', sans-serif;
          font-size: 11px;
          font-weight: 400;
          letter-spacing: 0.12em;
          text-transform: uppercase;
          color: var(--color-text-soft);
          margin-bottom: 10px;
        }
      `}</style>

      <Container>
        <SectionHeading
          eyebrow="Our Services"
          title="Strategic digital solutions built for business impact"
          description="We combine design, performance and structure to create web experiences that support visibility, trust and conversions."
        />

        <div className="services-grid">
          {displayServices.map((service) => (
            <Link key={service.slug} href={`/services/${service.slug}`} className="service-card">
              <div className="service-card-accent" />
              <div className="service-num">{service.num}</div>
              <div className="service-divider" />
              <span className="service-tag">{service.tag}</span>
              {service.tagline && <p className="service-tagline">{service.tagline}</p>}
              <h3 className="service-title">{service.title}</h3>
              <p className="service-desc">{service.desc}</p>
              <span className="service-link">
                Learn more
                <span className="service-link-arrow">→</span>
              </span>
            </Link>
          ))}
        </div>
      </Container>
    </section>
  );
}