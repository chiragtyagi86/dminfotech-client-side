// app/(site)/services/[slug]/page.tsx
// Individual service page — fetches from dhanamitra_cms `services` table.

import { notFound } from "next/navigation";
import type { Metadata } from "next";
import Link from "next/link";
import Container from "@/app/components/common/Container";
import CTASection from "@/app/components/home/CTASection";
import {
    getServiceBySlug,
    getAllServiceSlugs,
} from "../../../../../lib/services-data";

export async function generateStaticParams() {
    const slugs = await getAllServiceSlugs();
    return slugs.map((slug) => ({ slug }));
}

export async function generateMetadata({
    params,
}: {
    params: Promise<{ slug: string }>;
}): Promise<Metadata> {
    const { slug } = await params;
    const service = await getServiceBySlug(slug);

    if (!service) {
        return {
            title: "Service Not Found | Dhanamitra Infotech LLP",
            description: "The requested service page could not be found.",
        };
    }

    return {
        title: service.meta_title
            ? `${service.meta_title} | Dhanamitra Infotech LLP`
            : `${service.title} | Dhanamitra Infotech LLP`,
        description:
            service.meta_description || service.short_desc || service.title,
    };
}

// ── Helpers ───────────────────────────────────────────────────────────────────

function parseContent(raw: string | null): Record<string, any> {
    if (!raw) return {};
    try {
        return JSON.parse(raw);
    } catch {
        return {};
    }
}

/**
 * Strip inline dark-mode background-color / color styles injected by Quill
 * when the editor was open in a dark theme. Keeps the HTML otherwise intact.
 */
function stripQuillDarkStyles(html: string): string {
    return html
        .replace(/background-color\s*:\s*[^;"]+(;)?/gi, "")
        .replace(/(?<![a-z-])color\s*:\s*[^;"]+(;)?/gi, "")
        .replace(/style="\s*"/gi, "")
        .replace(/style=''/gi, "");
}

// ── Page ──────────────────────────────────────────────────────────────────────

export default async function ServicePage({
    params,
}: {
    params: Promise<{ slug: string }>;
}) {
    const { slug } = await params;
    const service = await getServiceBySlug(slug);
    if (!service) notFound();

    // content column is ALWAYS JSON — fullDesc, features, highlights all live inside it
    const content = parseContent(service.content);

    const features: string[] = content.features
        ? typeof content.features === "string"
            ? content.features.split(",").map((f: string) => f.trim()).filter(Boolean)
            : Array.isArray(content.features)
                ? content.features.filter(Boolean)
                : []
        : [];

    const highlights: { label: string; detail: string }[] = Array.isArray(content.highlights)
        ? content.highlights.filter((h: any) => h && (h.label || h.detail))
        : [];

    // fullDesc is Quill HTML stored inside the JSON — strip dark editor styles
    const fullDesc: string = content.fullDesc
        ? stripQuillDarkStyles(content.fullDesc)
        : "";

    return (
        <main>
            <style>
                {`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,600;1,300;1,400&family=DM+Sans:wght@300;400;500&display=swap');

        .svc-hero {
          position: relative;
          overflow: hidden;
          padding: 100px 0 80px;
          background: var(--color-bg);
        }
        .svc-hero-orb1 {
          position: absolute;
          width: 520px; height: 520px; border-radius: 50%;
          top: -180px; right: -100px; pointer-events: none;
          background: radial-gradient(circle, rgba(153,178,221,0.15) 0%, transparent 65%);
        }
        .svc-hero-orb2 {
          position: absolute;
          width: 300px; height: 300px; border-radius: 50%;
          bottom: -80px; left: 4%; pointer-events: none;
          background: radial-gradient(circle, rgba(233,175,163,0.10) 0%, transparent 70%);
        }
        .svc-hero-grid {
          position: absolute; inset: 0; pointer-events: none;
          background-image:
            linear-gradient(rgba(58,64,90,0.03) 1px, transparent 1px),
            linear-gradient(90deg, rgba(58,64,90,0.03) 1px, transparent 1px);
          background-size: 64px 64px;
          mask-image: radial-gradient(ellipse 60% 80% at 15% 50%, black 10%, transparent 100%);
        }
        .svc-hero-inner {
          position: relative; z-index: 1; max-width: 780px;
          animation: svcFadeUp 0.8s ease both;
        }
        .svc-breadcrumb {
          display: flex; align-items: center; gap: 8px;
          margin-bottom: 24px;
          font-family: 'DM Sans', sans-serif;
          font-size: 11.5px; font-weight: 400;
          color: var(--color-text-soft); flex-wrap: wrap;
        }
        .svc-breadcrumb a { color: var(--color-text-soft); text-decoration: none; transition: color 0.2s ease; }
        .svc-breadcrumb a:hover { color: var(--color-primary); }
        .svc-breadcrumb-sep { font-size: 10px; opacity: 0.4; }
        .svc-meta-strip { display: flex; flex-wrap: wrap; align-items: center; gap: 10px; margin-bottom: 22px; }
        .svc-tag {
          font-family: 'DM Sans', sans-serif;
          font-size: 10px; font-weight: 500;
          letter-spacing: 0.16em; text-transform: uppercase;
          color: var(--color-primary);
          background: rgba(153,178,221,0.18);
          border: 1px solid rgba(153,178,221,0.30);
          padding: 4px 12px; border-radius: 100px;
        }
        .svc-meta-sep { width: 3px; height: 3px; border-radius: 50%; background: rgba(104,80,68,0.25); }
        .svc-meta-text { font-family: 'DM Sans', sans-serif; font-size: 12px; font-weight: 300; color: var(--color-text-soft); }
        .svc-h1 {
          font-family: 'Cormorant Garamond', serif;
          font-size: clamp(34px, 5.5vw, 64px); font-weight: 300; line-height: 1.08;
          color: var(--color-primary); margin: 0 0 20px;
        }
        .svc-tagline { font-family: 'DM Sans', sans-serif; font-size: 16px; font-weight: 300; line-height: 1.75; color: var(--color-text-soft); margin: 0 0 32px; }
        .svc-hero-btns { display: flex; flex-wrap: wrap; gap: 12px; }
        .svc-btn-primary {
          display: inline-flex; align-items: center; gap: 6px;
          padding: 12px 28px; border-radius: 3px;
          background: var(--color-primary); color: var(--color-surface);
          font-family: 'DM Sans', sans-serif; font-size: 12.5px; font-weight: 500;
          letter-spacing: 0.09em; text-transform: uppercase; text-decoration: none;
          transition: transform 0.25s ease, box-shadow 0.25s ease;
        }
        .svc-btn-primary:hover { transform: translateY(-1px); box-shadow: 0 8px 24px rgba(58,64,90,0.22); }
        .svc-btn-secondary {
          display: inline-flex; align-items: center; gap: 6px;
          padding: 12px 28px; border-radius: 3px;
          background: transparent; color: var(--color-primary);
          border: 1px solid rgba(104,80,68,0.20);
          font-family: 'DM Sans', sans-serif; font-size: 12.5px; font-weight: 500;
          letter-spacing: 0.09em; text-transform: uppercase; text-decoration: none;
          transition: background 0.25s ease, border-color 0.25s ease;
        }
        .svc-btn-secondary:hover { background: var(--color-bg-soft); border-color: rgba(104,80,68,0.35); }

        @keyframes svcFadeUp {
          from { opacity: 0; transform: translateY(18px); }
          to   { opacity: 1; transform: translateY(0); }
        }

        .svc-body { padding: 72px 0 96px; background: var(--color-bg); position: relative; }
        .svc-body::before {
          content: ''; position: absolute; top: 0; left: 0; right: 0; height: 1px;
          background: linear-gradient(90deg, transparent, rgba(104,80,68,0.10), transparent);
        }
        .svc-body-grid { display: grid; grid-template-columns: 1fr; gap: 48px; align-items: start; }
        @media (min-width: 1024px) {
          .svc-body-grid { grid-template-columns: 1fr 300px; gap: 64px; }
        }

        /* ── Rich text content (Quill fullDesc) ── */
        .svc-content {
          font-family: 'DM Sans', sans-serif;
          font-size: 15px; font-weight: 300; line-height: 1.88;
          color: var(--color-text-soft);
        }
        /* Override any dark Quill inline styles that slipped through */
        .svc-content span {
          background-color: transparent !important;
          color: inherit !important;
        }
        .svc-content h2 {
          font-family: 'Cormorant Garamond', serif;
          font-size: clamp(22px, 3vw, 32px); font-weight: 600;
          color: var(--color-primary); margin: 40px 0 16px;
          padding-bottom: 12px; border-bottom: 1px solid rgba(104,80,68,0.07);
          position: relative;
        }
        .svc-content h2::before {
          content: ''; position: absolute; bottom: -1px; left: 0;
          width: 40px; height: 1px;
          background: linear-gradient(90deg, var(--color-accent-blue), var(--color-accent-blush));
        }
        .svc-content h3 {
          font-family: 'Cormorant Garamond', serif;
          font-size: clamp(18px, 2.5vw, 24px); font-weight: 600;
          color: var(--color-primary); margin: 28px 0 10px;
        }
        .svc-content p { margin: 0 0 18px; }
        .svc-content ul, .svc-content ol { padding-left: 20px; margin: 0 0 18px; }
        .svc-content li { margin-bottom: 8px; }

        .svc-intro {
          font-family: 'DM Sans', sans-serif;
          font-size: 16.5px; font-weight: 300; line-height: 1.90;
          color: var(--color-text-soft);
          margin: 0 0 40px; padding-bottom: 36px;
          border-bottom: 1px solid rgba(104,80,68,0.08);
        }

        .svc-features-block { margin: 40px 0; }
        .svc-features-label {
          font-family: 'DM Sans', sans-serif;
          font-size: 10.5px; font-weight: 500;
          letter-spacing: 0.20em; text-transform: uppercase;
          color: var(--color-text-soft); margin: 0 0 16px;
        }
        .svc-features-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(160px, 1fr)); gap: 10px; }
        .svc-feature-chip {
          display: flex; align-items: center; gap: 8px;
          padding: 10px 14px; border-radius: 10px;
          border: 1px solid rgba(104,80,68,0.10);
          background: rgba(255,255,255,0.60);
          font-family: 'DM Sans', sans-serif; font-size: 12.5px; font-weight: 400;
          color: var(--color-primary);
        }
        .svc-feature-dot {
          width: 6px; height: 6px; border-radius: 50%; flex-shrink: 0;
          background: linear-gradient(135deg, var(--color-accent-blue), var(--color-accent-blush));
        }

        .svc-highlights {
          margin: 40px 0; border-radius: 20px;
          border: 1px solid rgba(104,80,68,0.09);
          background: rgba(255,255,255,0.65); backdrop-filter: blur(12px);
          overflow: hidden; position: relative;
        }
        .svc-highlights::before {
          content: ''; position: absolute; top: 0; left: 0; right: 0; height: 3px;
          background: linear-gradient(90deg, var(--color-accent-blue), var(--color-accent-blush));
        }
        .svc-highlight-row {
          display: flex; align-items: flex-start; gap: 20px;
          padding: 20px 24px; border-bottom: 1px solid rgba(104,80,68,0.06);
        }
        .svc-highlight-row:last-child { border-bottom: none; }
        .svc-highlight-label { font-family: 'DM Sans', sans-serif; font-size: 12px; font-weight: 500; color: var(--color-primary); min-width: 140px; }
        .svc-highlight-detail { font-family: 'DM Sans', sans-serif; font-size: 13px; font-weight: 300; color: var(--color-text-soft); line-height: 1.65; }

        .svc-sidebar { display: flex; flex-direction: column; gap: 20px; }
        @media (min-width: 1024px) { .svc-sidebar { position: sticky; top: 96px; } }

        .svc-sidebar-card {
          border-radius: 18px; border: 1px solid rgba(104,80,68,0.09);
          background: rgba(255,255,255,0.65); backdrop-filter: blur(10px);
          padding: 24px 22px; position: relative; overflow: hidden;
        }
        .svc-sidebar-card::before {
          content: ''; position: absolute; top: 0; left: 0; right: 0; height: 2px;
          background: linear-gradient(90deg, var(--color-accent-blue), var(--color-accent-blush));
        }
        .svc-sidebar-title { font-family: 'DM Sans', sans-serif; font-size: 10px; font-weight: 500; letter-spacing: 0.18em; text-transform: uppercase; color: var(--color-text-soft); margin: 0 0 16px; }
        .svc-sidebar-cta-title { font-family: 'Cormorant Garamond', serif; font-size: 22px; font-weight: 300; line-height: 1.25; color: var(--color-primary); margin: 0 0 12px; }
        .svc-sidebar-cta-sub { font-family: 'DM Sans', sans-serif; font-size: 13px; font-weight: 300; line-height: 1.65; color: var(--color-text-soft); margin: 0 0 20px; }
        .svc-sidebar-btn {
          display: flex; align-items: center; justify-content: center; gap: 6px;
          padding: 11px 20px; border-radius: 3px;
          background: var(--color-primary); color: var(--color-surface);
          font-family: 'DM Sans', sans-serif; font-size: 12px; font-weight: 500;
          letter-spacing: 0.09em; text-transform: uppercase; text-decoration: none;
          transition: opacity 0.25s ease;
        }
        .svc-sidebar-btn:hover { opacity: 0.88; }

        .svc-fact-row {
          display: flex; align-items: center; justify-content: space-between;
          gap: 12px; padding: 10px 0;
          border-bottom: 1px solid rgba(104,80,68,0.06);
          font-family: 'DM Sans', sans-serif;
        }
        .svc-fact-row:last-child { border-bottom: none; }
        .svc-fact-label { font-size: 12px; font-weight: 300; color: var(--color-text-soft); }
        .svc-fact-value { font-size: 12.5px; font-weight: 500; color: var(--color-primary); text-align: right; }

        .svc-back {
          display: flex; align-items: center; gap: 8px;
          padding: 12px 16px; border-radius: 12px;
          border: 1px solid rgba(104,80,68,0.09);
          background: rgba(255,255,255,0.55);
          font-family: 'DM Sans', sans-serif; font-size: 12.5px; font-weight: 400;
          color: var(--color-primary); text-decoration: none;
          transition: background 0.25s ease;
        }
        .svc-back:hover { background: var(--color-bg-soft); }
      `}
            </style>

            {/* ── Hero ── */}
            <section className="svc-hero">
                <div className="svc-hero-orb1" />
                <div className="svc-hero-orb2" />
                <div className="svc-hero-grid" />

                <Container>
                    <div className="svc-hero-inner">
                        <nav className="svc-breadcrumb" aria-label="breadcrumb">
                            <Link href="/">Home</Link>
                            <span className="svc-breadcrumb-sep">›</span>
                            <Link href="/services">Services</Link>
                            <span className="svc-breadcrumb-sep">›</span>
                            <span style={{ color: "var(--color-primary)", fontWeight: 500 }}>
                                {service.title}
                            </span>
                        </nav>

                        <div className="svc-meta-strip">
                            {(content.tag || service.icon) && (
                                <span className="svc-tag">{content.tag || service.icon}</span>
                            )}
                            {content.tagline && (
                                <>
                                    <span className="svc-meta-sep" />
                                    <span className="svc-meta-text">{content.tagline}</span>
                                </>
                            )}
                        </div>

                        <h1 className="svc-h1">{service.title}</h1>

                        {service.short_desc && (
                            <p className="svc-tagline">{service.short_desc}</p>
                        )}

                        <div className="svc-hero-btns">
                            <Link href="/contact" className="svc-btn-primary">
                                Get a Free Consultation →
                            </Link>
                            <Link href="/services" className="svc-btn-secondary">
                                All Services
                            </Link>
                        </div>
                    </div>
                </Container>
            </section>

            {/* ── Body ── */}
            <section className="svc-body">
                <Container>
                    <div className="svc-body-grid">

                        {/* ── Main ── */}
                        <div>
                            {/* Short desc always shown as intro */}
                            {service.short_desc && (
                                <p className="svc-intro">{service.short_desc}</p>
                            )}

                            {/* Quill rich HTML — injected when written in admin */}
                            {fullDesc && (
                                <div
                                    className="svc-content"
                                    dangerouslySetInnerHTML={{ __html: fullDesc }}
                                />
                            )}

                            {/* Features — always shown if present */}
                            {features.length > 0 && (
                                <div className="svc-features-block">
                                    <p className="svc-features-label">What's Included</p>
                                    <div className="svc-features-grid">
                                        {features.map((f) => (
                                            <div key={f} className="svc-feature-chip">
                                                <span className="svc-feature-dot" />
                                                {f}
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* Highlights — always shown if present */}
                            {highlights.length > 0 && (
                                <div className="svc-highlights">
                                    {highlights.map((h, i) => (
                                        <div key={i} className="svc-highlight-row">
                                            <span className="svc-highlight-label">{h.label}</span>
                                            <span className="svc-highlight-detail">{h.detail}</span>
                                        </div>
                                    ))}
                                </div>
                            )}

                            {/* Empty state — only if nothing at all */}
                            {!service.short_desc && !fullDesc && features.length === 0 && highlights.length === 0 && (
                                <div className="svc-content">
                                    <p>No service content available yet.</p>
                                </div>
                            )}
                        </div>

                        {/* ── Sidebar ── */}
                        <aside className="svc-sidebar">
                            <div className="svc-sidebar-card">
                                <p className="svc-sidebar-title">Get Started</p>
                                <p className="svc-sidebar-cta-title">
                                    Interested in {service.title}?
                                </p>
                                <p className="svc-sidebar-cta-sub">
                                    Talk to our team and get a free consultation tailored to your
                                    business needs.
                                </p>
                                <Link href="/contact" className="svc-sidebar-btn">
                                    Book Free Consultation →
                                </Link>
                            </div>

                            <div className="svc-sidebar-card">
                                <p className="svc-sidebar-title">Quick Facts</p>
                                {[
                                    { label: "Service", value: service.title },
                                    { label: "Category", value: content.tag || "Digital Services" },
                                    { label: "Certification", value: "ISO 9001:2015" },
                                    { label: "Availability", value: "Mon–Sat, 9AM–6PM IST" },
                                    { label: "Response Time", value: "Within 1 business day" },
                                ].map((fact) => (
                                    <div key={fact.label} className="svc-fact-row">
                                        <span className="svc-fact-label">{fact.label}</span>
                                        <span className="svc-fact-value">{fact.value}</span>
                                    </div>
                                ))}
                            </div>

                            <Link href="/services" className="svc-back">
                                ← Back to Services
                            </Link>
                        </aside>

                    </div>
                </Container>
            </section>

            <CTASection />
        </main>
    );
}