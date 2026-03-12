// app/portfolio/[slug]/page.tsx
import { notFound } from "next/navigation";
import Link from "next/link";
import type { Metadata } from "next";
import Container from "@/app/components/common/Container";
import {
  getPortfolioItemBySlug,
  getAllPortfolioSlugs,
  getAllPortfolioItems,
  type PortfolioItem,
} from "../../../../../lib/portfolio-data";

// ── Helpers ───────────────────────────────────────────────────────────────────
function parseContent(raw: string | null): Record<string, any> {
  if (!raw) return {};
  try { return JSON.parse(raw); } catch { return {}; }
}

// ── generateStaticParams — pulled from DB at build time ───────────────────────
export async function generateStaticParams() {
  const slugs = await getAllPortfolioSlugs();
  return slugs.map((slug) => ({ slug }));
}

// ── generateMetadata — SEO from DB fields ─────────────────────────────────────
export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const item = await getPortfolioItemBySlug(slug);
  if (!item) return { title: "Project Not Found" };
  return {
    title: item.meta_title || item.title,
    description: item.meta_description || item.short_desc,
  };
}

// ── Page ──────────────────────────────────────────────────────────────────────
export default async function PortfolioSlugPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const [item, allItems] = await Promise.all([
    getPortfolioItemBySlug(slug),
    getAllPortfolioItems(),
  ]);

  if (!item) notFound();

  const c = parseContent(item.content);

  const services: string[]  = Array.isArray(c.services) ? c.services : [];
  const outcome: string     = c.outcome || "";
  const longDesc: string    = c.longDesc || c.description || item.short_desc;
  const year: string        = c.year || String(new Date().getFullYear());
  const accent: string      = c.accent || "rgba(153,178,221,0.30)";
  const projectLink: string = c.projectLink || item.project_url || "";

  // Gallery — JSON array or comma-separated string
  let gallery: string[] = [];
  try {
    gallery = item.gallery ? JSON.parse(item.gallery) : [];
  } catch {
    gallery = item.gallery ? item.gallery.split(",").map((s) => s.trim()) : [];
  }

  const otherItems = allItems.filter((p) => p.slug !== slug).slice(0, 3);

  return (
    <>
      <style>{STYLES}</style>

      {/* ── Hero ── */}
      <section className="ps-hero">
        <div
          className="ps-hero-bg"
          style={
            !item.image
              ? { background: `linear-gradient(145deg, ${accent}, rgba(255,250,247,0.55))` }
              : undefined
          }
        >
          {item.image && (
            <img src={item.image} alt={item.title} className="ps-hero-img" />
          )}
          <div className="ps-hero-overlay" />
          <div className="ps-hero-grid" />
        </div>

        <Container>
          <div className="ps-hero-inner">
            <Link href="/portfolio" className="ps-back">← Back to Portfolio</Link>

            <div className="ps-tags">
              <span className="ps-tag">{item.category}</span>
              {c.industry && <span className="ps-tag ps-tag-light">{c.industry}</span>}
              <span className="ps-tag ps-tag-light">{year}</span>
              {item.client && <span className="ps-tag ps-tag-light">{item.client}</span>}
            </div>

            <h1 className="ps-title">{item.title}</h1>
            <p className="ps-subtitle">{item.short_desc}</p>

            {projectLink && (
              <a href={projectLink} target="_blank" rel="noopener noreferrer" className="ps-hero-link">
                View Live Project ↗
              </a>
            )}
          </div>
        </Container>
      </section>

      {/* ── Body ── */}
      <section className="ps-body">
        <Container>
          <div className="ps-layout">

            {/* Main content */}
            <div className="ps-main">
              <h2 className="ps-section-label">About this project</h2>
              <p className="ps-prose">{longDesc}</p>

           

              {/* ── Case Study card ── */}
              {(c.problem || c.solution || (Array.isArray(c.results) && c.results.length > 0) || outcome) && (
                <div className="ps-cs-card">
                  <div className="ps-cs-top-rule" />
                  <div className="ps-cs-inner">

                    <div className="ps-cs-left">
                      <div className="ps-cs-badge">
                        <span className="ps-cs-badge-dot" />
                        Case Study
                      </div>
                      <h3 className="ps-cs-client">{item.title}</h3>
                      {c.industry && (
                        <span className="ps-cs-industry-tag">{c.industry}</span>
                      )}
                      {c.problem && (
                        <div className="ps-cs-block">
                          <p className="ps-cs-label">The Problem</p>
                          <p className="ps-cs-text">{c.problem}</p>
                        </div>
                      )}
                      {c.solution && (
                        <div className="ps-cs-block">
                          <p className="ps-cs-label">Our Solution</p>
                          <p className="ps-cs-text">{c.solution}</p>
                        </div>
                      )}
                    </div>

                    <div className="ps-cs-right">
                      <p className="ps-cs-label">Results</p>
                      <div className="ps-cs-results">
                        {Array.isArray(c.results) && c.results.length > 0
                          ? c.results.map((r: { metric: string; label: string }, i: number) => (
                              <div key={i} className="ps-cs-result">
                                <span className="ps-cs-result-metric">{r.metric}</span>
                                <p className="ps-cs-result-label">{r.label}</p>
                              </div>
                            ))
                          : outcome && (
                              <div className="ps-cs-result">
                                <span className="ps-cs-result-metric">↑</span>
                                <p className="ps-cs-result-label">{outcome}</p>
                              </div>
                            )
                        }
                      </div>
                    </div>

                  </div>
                </div>
              )}

              {/* Gallery */}
              {gallery.length > 0 && (
                <div className="ps-gallery">
                  <h2 className="ps-section-label" style={{ marginBottom: 20 }}>Gallery</h2>
                  <div className="ps-gallery-grid">
                    {gallery.map((src, i) => (
                      <div key={i} className="ps-gallery-item">
                        <img src={src} alt={`${item.title} — ${i + 1}`} />
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Sidebar */}
            <aside className="ps-sidebar">
              {services.length > 0 && (
                <div className="ps-sidebar-card">
                  <h3 className="ps-sidebar-title">Services</h3>
                  <ul className="ps-services">
                    {services.map((s) => (
                      <li key={s} className="ps-service-item">
                        <span className="ps-dot" />
                        {s}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {c.industry && (
                <div className="ps-sidebar-card">
                  <h3 className="ps-sidebar-title">Industry</h3>
                  <p className="ps-sidebar-value">{c.industry}</p>
                </div>
              )}

              {item.client && (
                <div className="ps-sidebar-card">
                  <h3 className="ps-sidebar-title">Client</h3>
                  <p className="ps-sidebar-value">{item.client}</p>
                </div>
              )}

              <div className="ps-sidebar-card">
                <h3 className="ps-sidebar-title">Year</h3>
                <p className="ps-sidebar-value">{year}</p>
              </div>

              {projectLink && (
                <a
                  href={projectLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="ps-cta ps-cta-secondary"
                >
                  View Live Site ↗
                </a>
              )}

              <Link href="/contact" className="ps-cta">
                Start a similar project ↗
              </Link>
            </aside>
          </div>
        </Container>
      </section>

      {/* ── More work ── */}
      {otherItems.length > 0 && (
        <section className="ps-more">
          <Container>
            <h2 className="ps-more-heading">More work</h2>
            <div className="ps-more-grid">
              {otherItems.map((p) => {
                const pc = parseContent(p.content);
                return (
                  <Link key={p.slug} href={`/portfolio/${p.slug}`} className="ps-more-card">
                    <div
                      className="ps-more-img"
                      style={
                        !p.image
                          ? { background: `linear-gradient(145deg, ${pc.accent || "rgba(153,178,221,0.30)"}, rgba(255,250,247,0.45))` }
                          : undefined
                      }
                    >
                      {p.image && <img src={p.image} alt={p.title} className="ps-more-img-tag" />}
                    </div>
                    <div className="ps-more-body">
                      <span className="ps-more-cat">{p.category}</span>
                      <h3 className="ps-more-name">{p.title}</h3>
                    </div>
                  </Link>
                );
              })}
            </div>
          </Container>
        </section>
      )}
    </>
  );
}

// ── Styles ────────────────────────────────────────────────────────────────────
const STYLES = `
  @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,600;1,300&family=DM+Sans:wght@300;400;500&display=swap');

  .ps-hero {
    position: relative; min-height: 480px;
    display: flex; align-items: flex-end; overflow: hidden;
  }
  .ps-hero-bg { position: absolute; inset: 0; }
  .ps-hero-img { position: absolute; inset: 0; width: 100%; height: 100%; object-fit: cover; }
  .ps-hero-overlay {
    position: absolute; inset: 0;
    background: linear-gradient(180deg, rgba(255,250,247,0.08) 0%, rgba(255,250,247,0.82) 100%);
  }
  .ps-hero-grid {
    position: absolute; inset: 0;
    background-image:
      linear-gradient(rgba(58,64,90,0.05) 1px, transparent 1px),
      linear-gradient(90deg, rgba(58,64,90,0.05) 1px, transparent 1px);
    background-size: 32px 32px;
  }
  .ps-hero-inner { position: relative; z-index: 2; padding: 80px 0 60px; max-width: 760px; }

  .ps-back {
    font-family: 'DM Sans', sans-serif; font-size: 11px; font-weight: 500;
    letter-spacing: 0.12em; text-transform: uppercase;
    color: var(--color-primary); text-decoration: none;
    display: inline-flex; align-items: center; gap: 6px;
    margin-bottom: 28px; opacity: 0.65; transition: opacity 0.2s;
  }
  .ps-back:hover { opacity: 1; }

  .ps-tags { display: flex; flex-wrap: wrap; gap: 8px; margin-bottom: 20px; }
  .ps-tag {
    font-family: 'DM Sans', sans-serif; font-size: 10px; font-weight: 500;
    letter-spacing: 0.14em; text-transform: uppercase; color: var(--color-primary);
    background: rgba(104,80,68,0.09); border: 1px solid rgba(104,80,68,0.13);
    padding: 4px 12px; border-radius: 100px;
  }
  .ps-tag-light { background: rgba(255,255,255,0.65); color: var(--color-text-soft); }

  .ps-title {
    font-family: 'Cormorant Garamond', serif;
    font-size: clamp(32px, 6vw, 58px); font-weight: 600;
    line-height: 1.1; color: var(--color-primary); margin: 0 0 16px;
  }
  .ps-subtitle {
    font-family: 'DM Sans', sans-serif; font-size: 15px; font-weight: 300;
    line-height: 1.8; color: var(--color-text-soft); margin: 0 0 24px; max-width: 580px;
  }
  .ps-hero-link {
    font-family: 'DM Sans', sans-serif; font-size: 11.5px; font-weight: 500;
    letter-spacing: 0.10em; text-transform: uppercase;
    color: var(--color-primary); text-decoration: none;
    border-bottom: 1px solid rgba(104,80,68,0.25); padding-bottom: 2px;
    transition: border-color 0.2s, color 0.2s;
  }
  .ps-hero-link:hover { color: var(--color-primary-2); border-color: var(--color-primary-2); }

  .ps-body { padding: 72px 0 80px; background: var(--color-bg-soft); }
  .ps-layout { display: grid; grid-template-columns: 1fr; gap: 48px; }
  @media (min-width: 900px) { .ps-layout { grid-template-columns: 1fr 300px; gap: 64px; } }

  .ps-section-label {
    font-family: 'DM Sans', sans-serif; font-size: 9.5px; font-weight: 500;
    letter-spacing: 0.20em; text-transform: uppercase; color: var(--color-primary-2); margin: 0 0 20px;
  }
  .ps-prose {
    font-family: 'DM Sans', sans-serif; font-size: 15px; font-weight: 300;
    line-height: 1.9; color: var(--color-text-soft); margin: 0 0 40px;
  }

  .ps-blocks { display: grid; grid-template-columns: 1fr; gap: 16px; margin-bottom: 40px; }
  @media (min-width: 640px) { .ps-blocks { grid-template-columns: 1fr 1fr; } }
  .ps-block {
    background: rgba(255,255,255,0.70); backdrop-filter: blur(12px);
    border: 1px solid rgba(104,80,68,0.09); border-radius: 14px; padding: 20px 22px;
  }
  .ps-block-label {
    font-family: 'DM Sans', sans-serif; font-size: 9.5px; font-weight: 500;
    letter-spacing: 0.16em; text-transform: uppercase;
    color: var(--color-primary-2); display: block; margin-bottom: 10px;
  }
  .ps-block-text {
    font-family: 'DM Sans', sans-serif; font-size: 13.5px; font-weight: 300;
    line-height: 1.75; color: var(--color-text-soft); margin: 0;
  }

  .ps-results {
    display: grid; grid-template-columns: repeat(auto-fit, minmax(120px, 1fr));
    gap: 14px; margin-bottom: 40px;
  }
  .ps-result-card {
    background: rgba(255,255,255,0.70); backdrop-filter: blur(12px);
    border: 1px solid rgba(104,80,68,0.09); border-radius: 14px;
    padding: 18px 16px; display: flex; flex-direction: column; gap: 6px;
  }
  .ps-result-metric {
    font-family: 'Cormorant Garamond', serif;
    font-size: 28px; font-weight: 600; color: var(--color-primary); line-height: 1;
  }
  .ps-result-label {
    font-family: 'DM Sans', sans-serif; font-size: 11px; font-weight: 400;
    letter-spacing: 0.04em; color: var(--color-text-soft);
  }

  .ps-outcome {
    background: rgba(255,255,255,0.70); backdrop-filter: blur(12px);
    border: 1px solid rgba(104,80,68,0.10); border-left: 3px solid var(--color-primary);
    border-radius: 12px; padding: 20px 24px; margin-bottom: 40px;
  }
  .ps-outcome-label {
    font-family: 'DM Sans', sans-serif; font-size: 9.5px; font-weight: 500;
    letter-spacing: 0.16em; text-transform: uppercase;
    color: var(--color-primary-2); display: block; margin-bottom: 8px;
  }
  .ps-outcome-text {
    font-family: 'Cormorant Garamond', serif; font-size: 20px; font-weight: 600;
    color: var(--color-primary); margin: 0; line-height: 1.4;
  }

  .ps-gallery { margin-top: 48px; }
  .ps-gallery-grid { display: grid; grid-template-columns: 1fr; gap: 14px; }
  @media (min-width: 640px) { .ps-gallery-grid { grid-template-columns: repeat(2, 1fr); } }
  .ps-gallery-item { border-radius: 14px; overflow: hidden; border: 1px solid rgba(104,80,68,0.09); }
  .ps-gallery-item img { width: 100%; height: 220px; object-fit: cover; display: block; }

  .ps-sidebar { display: flex; flex-direction: column; gap: 14px; }
  .ps-sidebar-card {
    background: rgba(255,255,255,0.70); backdrop-filter: blur(12px);
    border: 1px solid rgba(104,80,68,0.09); border-radius: 16px; padding: 18px 20px;
  }
  .ps-sidebar-title {
    font-family: 'DM Sans', sans-serif; font-size: 9.5px; font-weight: 500;
    letter-spacing: 0.16em; text-transform: uppercase; color: var(--color-text-soft); margin: 0 0 12px;
  }
  .ps-sidebar-value {
    font-family: 'Cormorant Garamond', serif; font-size: 18px; font-weight: 600;
    color: var(--color-primary); margin: 0;
  }
  .ps-services { list-style: none; margin: 0; padding: 0; display: flex; flex-direction: column; gap: 8px; }
  .ps-service-item {
    font-family: 'DM Sans', sans-serif; font-size: 13px; font-weight: 300;
    color: var(--color-text-soft); display: flex; align-items: center; gap: 10px;
  }
  .ps-dot { width: 5px; height: 5px; border-radius: 50%; background: var(--color-primary); flex-shrink: 0; opacity: 0.45; }

  .ps-cta {
    font-family: 'DM Sans', sans-serif; font-size: 12px; font-weight: 500;
    letter-spacing: 0.10em; text-transform: uppercase; color: var(--color-surface);
    background: var(--color-primary); border-radius: 100px; padding: 14px 24px;
    text-decoration: none; text-align: center; display: block;
    transition: opacity 0.25s ease, transform 0.25s ease;
  }
  .ps-cta:hover { opacity: 0.85; transform: translateY(-2px); }
  .ps-cta-secondary {
    background: transparent; color: var(--color-primary);
    border: 1px solid rgba(104,80,68,0.20);
  }
  .ps-cta-secondary:hover { background: rgba(104,80,68,0.05); }

  .ps-more {
    padding: 64px 0 80px; background: rgba(255,255,255,0.40);
    border-top: 1px solid rgba(104,80,68,0.08);
  }
  .ps-more-heading {
    font-family: 'DM Sans', sans-serif; font-size: 9.5px; font-weight: 500;
    letter-spacing: 0.20em; text-transform: uppercase; color: var(--color-primary-2); margin: 0 0 32px;
  }
  .ps-more-grid { display: grid; grid-template-columns: 1fr; gap: 16px; }
  @media (min-width: 640px) { .ps-more-grid { grid-template-columns: repeat(3, 1fr); } }
  .ps-more-card {
    border-radius: 18px; border: 1px solid rgba(104,80,68,0.09);
    background: rgba(255,255,255,0.65); backdrop-filter: blur(12px);
    overflow: hidden; text-decoration: none;
    transition: transform 0.32s cubic-bezier(0.4,0,0.2,1), box-shadow 0.32s ease;
  }
  .ps-more-card:hover { transform: translateY(-5px); box-shadow: 0 20px 52px rgba(58,64,90,0.10); }
  .ps-more-img { height: 140px; width: 100%; position: relative; overflow: hidden; }
  .ps-more-img-tag { position: absolute; inset: 0; width: 100%; height: 100%; object-fit: cover; }
  .ps-more-body { padding: 16px 18px 18px; }
  .ps-more-cat {
    font-family: 'DM Sans', sans-serif; font-size: 9.5px; font-weight: 500;
    letter-spacing: 0.14em; text-transform: uppercase; color: var(--color-primary-2); display: block; margin-bottom: 6px;
  }

  /* ── Case Study card ── */
  .ps-cs-card {
    margin-bottom: 40px;
    background: rgba(255,255,255,0.72);
    backdrop-filter: blur(14px);
    border: 1px solid rgba(104,80,68,0.10);
    border-radius: 20px;
    overflow: hidden;
  }
  .ps-cs-top-rule {
    height: 3px;
    background: linear-gradient(90deg, var(--color-primary), rgba(233,175,163,0.60), transparent);
  }
  .ps-cs-inner {
    padding: 32px 28px 36px;
    display: grid;
    grid-template-columns: 1fr;
    gap: 32px;
  }
  @media (min-width: 700px) {
    .ps-cs-inner { grid-template-columns: 1fr 1fr; gap: 40px; }
  }

  .ps-cs-badge {
    display: inline-flex; align-items: center; gap: 7px;
    font-family: 'DM Sans', sans-serif;
    font-size: 9.5px; font-weight: 500;
    letter-spacing: 0.16em; text-transform: uppercase;
    color: var(--color-primary);
    background: rgba(104,80,68,0.07);
    border: 1px solid rgba(104,80,68,0.13);
    padding: 4px 12px 4px 10px; border-radius: 100px;
    margin-bottom: 16px;
  }
  .ps-cs-badge-dot {
    width: 6px; height: 6px; border-radius: 50%;
    background: var(--color-primary); flex-shrink: 0;
    animation: ps-pulse 2s ease-in-out infinite;
  }
  @keyframes ps-pulse {
    0%, 100% { opacity: 1; transform: scale(1); }
    50%       { opacity: 0.5; transform: scale(0.8); }
  }

  .ps-cs-client {
    font-family: 'Cormorant Garamond', serif;
    font-size: 22px; font-weight: 600; line-height: 1.2;
    color: var(--color-primary); margin: 0 0 10px;
  }
  .ps-cs-industry-tag {
    display: inline-block;
    font-family: 'DM Sans', sans-serif;
    font-size: 10px; font-weight: 400;
    letter-spacing: 0.08em;
    color: var(--color-text-soft);
    border: 1px solid rgba(104,80,68,0.12);
    padding: 2px 10px; border-radius: 100px;
    margin-bottom: 20px;
  }

  .ps-cs-block { margin-top: 20px; }
  .ps-cs-label {
    font-family: 'DM Sans', sans-serif;
    font-size: 9.5px; font-weight: 500;
    letter-spacing: 0.16em; text-transform: uppercase;
    color: var(--color-primary-2); margin: 0 0 8px;
  }
  .ps-cs-text {
    font-family: 'DM Sans', sans-serif;
    font-size: 13.5px; font-weight: 300; line-height: 1.75;
    color: var(--color-text-soft); margin: 0;
  }

  .ps-cs-right { display: flex; flex-direction: column; }
  .ps-cs-results {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(100px, 1fr));
    gap: 14px; margin-top: 14px;
  }
  .ps-cs-result {
    background: rgba(255,255,255,0.80);
    border: 1px solid rgba(104,80,68,0.09);
    border-radius: 14px; padding: 16px 14px;
    display: flex; flex-direction: column; gap: 6px;
  }
  .ps-cs-result-metric {
    font-family: 'Cormorant Garamond', serif;
    font-size: 30px; font-weight: 600;
    color: var(--color-primary); line-height: 1;
  }
  .ps-cs-result-label {
    font-family: 'DM Sans', sans-serif;
    font-size: 11px; font-weight: 400;
    letter-spacing: 0.04em; color: var(--color-text-soft); margin: 0;
  }
`;