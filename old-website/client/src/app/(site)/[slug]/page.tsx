// app/pages/[slug]/page.tsx
"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

interface PageContent {
  heroHeadline?: string;
  heroSubheading?: string;
  heroImage?: string;
  sections?: Array<{
    id: string;
    title: string;
    content: string;
    type: "text" | "image" | "two-column";
    imageUrl?: string;
  }>;
  ctaText?: string;
  ctaLink?: string;
  seoTitle?: string;
  seoDescription?: string;
  [key: string]: any;
}

interface PageData {
  id: number;
  slug: string;
  title: string;
  description: string;
  content: PageContent;
  isPublished: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export default function PageRenderer({ params }: { params: Promise<{ slug: string }> }) {
  const [slug, setSlug] = useState<string | null>(null);
  const [page, setPage] = useState<PageData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    params.then((p) => setSlug(p.slug));
  }, [params]);

  useEffect(() => {
    if (slug) fetchPage();
  }, [slug]);

  async function fetchPage() {
    try {
      setLoading(true);
      setError("");
      const res = await fetch(`/api/admin/pages/${slug}`, { cache: "no-store" });
      if (!res.ok) {
        setError(res.status === 404 ? "Page not found" : "Failed to load page");
        return;
      }
      const json = await res.json();
      setPage(json.data);
    } catch {
      setError("Failed to load page");
    } finally {
      setLoading(false);
    }
  }

  if (loading) {
    return (
      <main className="pr-state-page">
        <style>{STYLES}</style>
        <div className="pr-state-inner">
          <div className="pr-spinner" />
          <p className="pr-state-text">Loading…</p>
        </div>
      </main>
    );
  }

  if (error || !page || !page.isPublished) {
    return (
      <main className="pr-state-page">
        <style>{STYLES}</style>
        <div className="pr-state-inner">
          <p className="pr-state-eyebrow">404</p>
          <h1 className="pr-state-title">
            {error === "Page not found" || !page ? "Page Not Found" : "Page Unavailable"}
          </h1>
          <p className="pr-state-text">
            {error || "This page is not currently published."}
          </p>
          <Link href="/" className="pr-state-btn">← Back to Home</Link>
        </div>
      </main>
    );
  }

  const content = page.content as PageContent;

  return (
    <main>
      <style>{STYLES}</style>

      {/* ── Hero ── */}
      {content.heroHeadline && (
        <section className="pr-hero">
          <div className="pr-hero-orb1" />
          <div className="pr-hero-orb2" />
          <div className="pr-hero-grid" />

          {content.heroImage && (
            <>
              <img src={content.heroImage} alt={content.heroHeadline} className="pr-hero-img" />
              <div className="pr-hero-img-overlay" />
            </>
          )}

          <div className="pr-hero-body">
            <div className="pr-container">
              <div className="pr-hero-inner">
                <nav className="pr-breadcrumb">
                  <Link href="/">Home</Link>
                  <span className="pr-bc-sep">›</span>
                  <span>{page.title}</span>
                </nav>

                <h1 className="pr-hero-h1">{content.heroHeadline}</h1>

                {content.heroSubheading && (
                  <p className="pr-hero-sub">{content.heroSubheading}</p>
                )}

                {content.ctaText && content.ctaLink && (
                  <div className="pr-hero-btns">
                    <Link href={content.ctaLink} className="pr-btn-primary">
                      {content.ctaText} →
                    </Link>
                  </div>
                )}
              </div>
            </div>
          </div>
        </section>
      )}

      {/* ── No hero — just page title ── */}
      {!content.heroHeadline && (
        <section className="pr-title-section">
          <div className="pr-hero-orb1" />
          <div className="pr-hero-grid" />
          <div className="pr-container" style={{ position: "relative", zIndex: 1 }}>
            <nav className="pr-breadcrumb">
              <Link href="/">Home</Link>
              <span className="pr-bc-sep">›</span>
              <span>{page.title}</span>
            </nav>
            <h1 className="pr-page-title">{page.title}</h1>
            {page.description && <p className="pr-page-desc">{page.description}</p>}
          </div>
        </section>
      )}

      {/* ── Sections ── */}
      {content.sections && content.sections.length > 0 && (
        <div className="pr-sections">
          <div className="pr-container">
            {content.sections.map((section, idx) => (
              <section key={section.id} className="pr-section">

                {/* Alternating accent bar */}
                <div className={`pr-section-bar pr-bar-${idx % 2}`} />

                {section.type === "text" && (
                  <div className="pr-section-card">
                    {section.title && <h2 className="pr-section-title">{section.title}</h2>}
                    <div
                      className="pr-rich-text"
                      dangerouslySetInnerHTML={{ __html: section.content }}
                    />
                  </div>
                )}

                {section.type === "image" && (
                  <div className="pr-section-card">
                    {section.title && <h2 className="pr-section-title">{section.title}</h2>}
                    <div className="pr-img-wrap">
                      <img src={section.content} alt={section.title} className="pr-section-img" loading="lazy" />
                    </div>
                  </div>
                )}

                {section.type === "two-column" && (() => {
                  // Support legacy data: if content looks like a URL, treat it as imageUrl
                  const isUrl = (s: string) => /^https?:\/\/|^\//.test(s?.trim() || "");
                  const textContent = isUrl(section.content) ? "" : section.content;
                  const imageUrl = section.imageUrl || (isUrl(section.content) ? section.content : "");
                  return (
                    <div className="pr-section-card">
                      {section.title && <h2 className="pr-section-title">{section.title}</h2>}
                      <div className="pr-two-col">
                        <div
                          className="pr-col pr-rich-text"
                          dangerouslySetInnerHTML={{ __html: textContent }}
                        />
                        <div className="pr-col">
                          {imageUrl ? (
                            <div className="pr-img-wrap">
                              <img src={imageUrl} alt={section.title} className="pr-section-img" loading="lazy" />
                            </div>
                          ) : (
                            <div className="pr-col-placeholder">
                              <span>Add an image URL in the CMS editor</span>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })()}

              </section>
            ))}
          </div>
        </div>
      )}

      {/* ── Footer CTA (only shown if no hero) ── */}
      {content.ctaText && content.ctaLink && !content.heroHeadline && (
        <section className="pr-footer-cta">
          <div className="pr-container">
            <div className="pr-footer-cta-card">
              <div className="pr-footer-cta-grid" />
              <p className="pr-footer-eyebrow">Ready to get started?</p>
              <h2 className="pr-footer-title">{content.ctaText}</h2>
              <Link href={content.ctaLink} className="pr-btn-light">
                Get in Touch →
              </Link>
            </div>
          </div>
        </section>
      )}

    </main>
  );
}

// ── Styles ────────────────────────────────────────────────────────────────────
const STYLES = `
  @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,600;1,300;1,400&family=DM+Sans:wght@300;400;500&display=swap');

  /* ── Container ── */
  .pr-container {
    max-width: 1200px;
    margin: 0 auto;
    padding: 0 24px;
  }
  @media (min-width: 1280px) { .pr-container { padding: 0 40px; } }

  /* ── State pages (loading / 404) ── */
  .pr-state-page {
    min-height: 72vh;
    display: flex;
    align-items: center;
    justify-content: center;
    background: var(--color-bg);
    padding: 40px 24px;
  }
  .pr-state-inner {
    text-align: center;
    max-width: 480px;
  }
  .pr-spinner {
    width: 40px; height: 40px;
    border-radius: 50%;
    border: 3px solid rgba(153,178,221,0.25);
    border-top-color: var(--color-primary);
    animation: prSpin 0.8s linear infinite;
    margin: 0 auto 20px;
  }
  @keyframes prSpin { to { transform: rotate(360deg); } }
  .pr-state-eyebrow {
    font-family: 'DM Sans', sans-serif;
    font-size: 10px; font-weight: 500;
    letter-spacing: 0.22em; text-transform: uppercase;
    color: var(--color-primary-2); margin: 0 0 12px;
  }
  .pr-state-title {
    font-family: 'Cormorant Garamond', serif;
    font-size: clamp(32px, 5vw, 52px); font-weight: 300;
    line-height: 1.1; color: var(--color-primary);
    margin: 0 0 14px;
  }
  .pr-state-text {
    font-family: 'DM Sans', sans-serif;
    font-size: 15px; font-weight: 300;
    line-height: 1.75; color: var(--color-text-soft);
    margin: 0 0 28px;
  }
  .pr-state-btn {
    display: inline-flex; align-items: center; gap: 6px;
    padding: 11px 24px; border-radius: 3px;
    background: var(--color-primary); color: var(--color-surface);
    font-family: 'DM Sans', sans-serif;
    font-size: 12px; font-weight: 500;
    letter-spacing: 0.09em; text-transform: uppercase;
    text-decoration: none;
    transition: opacity 0.25s ease;
  }
  .pr-state-btn:hover { opacity: 0.88; }

  /* ── Hero ── */
  .pr-hero {
    position: relative; overflow: hidden;
    padding: 100px 0 88px;
    background: var(--color-bg);
  }
  .pr-hero-orb1 {
    position: absolute; width: 560px; height: 560px; border-radius: 50%;
    top: -200px; right: -120px; pointer-events: none;
    background: radial-gradient(circle, rgba(153,178,221,0.16) 0%, transparent 65%);
  }
  .pr-hero-orb2 {
    position: absolute; width: 320px; height: 320px; border-radius: 50%;
    bottom: -100px; left: 4%; pointer-events: none;
    background: radial-gradient(circle, rgba(233,175,163,0.11) 0%, transparent 70%);
  }
  .pr-hero-grid {
    position: absolute; inset: 0; pointer-events: none;
    background-image:
      linear-gradient(rgba(58,64,90,0.03) 1px, transparent 1px),
      linear-gradient(90deg, rgba(58,64,90,0.03) 1px, transparent 1px);
    background-size: 64px 64px;
    mask-image: radial-gradient(ellipse 70% 90% at 15% 50%, black 10%, transparent 100%);
  }
  .pr-hero-img {
    position: absolute; inset: 0;
    width: 100%; height: 100%; object-fit: cover;
    z-index: 0;
  }
  .pr-hero-img-overlay {
    position: absolute; inset: 0; z-index: 1;
    background: linear-gradient(to bottom, rgba(255,250,247,0.82), rgba(255,250,247,0.70));
  }
  .pr-hero-body {
    position: relative; z-index: 2;
  }
  .pr-hero-inner {
    max-width: 800px;
    animation: prFadeUp 0.8s ease both;
  }
  @keyframes prFadeUp {
    from { opacity: 0; transform: translateY(18px); }
    to   { opacity: 1; transform: translateY(0); }
  }

  /* ── Breadcrumb ── */
  .pr-breadcrumb {
    display: flex; align-items: center; gap: 8px;
    margin-bottom: 28px;
    font-family: 'DM Sans', sans-serif;
    font-size: 11.5px; font-weight: 400;
    color: var(--color-text-soft);
  }
  .pr-breadcrumb a { color: var(--color-text-soft); text-decoration: none; transition: color 0.2s; }
  .pr-breadcrumb a:hover { color: var(--color-primary); }
  .pr-breadcrumb span:last-child { color: var(--color-primary); font-weight: 500; }
  .pr-bc-sep { font-size: 10px; opacity: 0.4; }

  /* ── Hero typography ── */
  .pr-hero-h1 {
    font-family: 'Cormorant Garamond', serif;
    font-size: clamp(36px, 5.5vw, 68px); font-weight: 300; line-height: 1.06;
    color: var(--color-primary); margin: 0 0 22px;
    animation: prFadeUp 0.85s ease 0.1s both;
  }
  .pr-hero-sub {
    font-family: 'DM Sans', sans-serif;
    font-size: 16px; font-weight: 300; line-height: 1.80;
    color: var(--color-text-soft); margin: 0 0 36px;
    max-width: 580px;
    animation: prFadeUp 0.85s ease 0.18s both;
  }
  .pr-hero-btns {
    display: flex; flex-wrap: wrap; gap: 12px;
    animation: prFadeUp 0.85s ease 0.25s both;
  }

  /* ── Buttons ── */
  .pr-btn-primary {
    display: inline-flex; align-items: center; gap: 6px;
    padding: 12px 28px; border-radius: 3px;
    background: var(--color-primary); color: var(--color-surface);
    font-family: 'DM Sans', sans-serif;
    font-size: 12.5px; font-weight: 500;
    letter-spacing: 0.09em; text-transform: uppercase;
    text-decoration: none;
    transition: transform 0.25s ease, box-shadow 0.25s ease;
  }
  .pr-btn-primary:hover { transform: translateY(-1px); box-shadow: 0 8px 24px rgba(58,64,90,0.22); }

  .pr-btn-light {
    display: inline-flex; align-items: center; gap: 6px;
    padding: 12px 28px; border-radius: 3px;
    background: var(--color-surface); color: var(--color-primary);
    font-family: 'DM Sans', sans-serif;
    font-size: 12.5px; font-weight: 500;
    letter-spacing: 0.09em; text-transform: uppercase;
    text-decoration: none;
    transition: transform 0.25s ease, box-shadow 0.25s ease;
  }
  .pr-btn-light:hover { transform: translateY(-1px); box-shadow: 0 8px 24px rgba(0,0,0,0.18); }

  /* ── Title section (no hero) ── */
  .pr-title-section {
    position: relative; overflow: hidden;
    padding: 96px 0 72px;
    background: var(--color-bg);
  }
  .pr-page-title {
    font-family: 'Cormorant Garamond', serif;
    font-size: clamp(34px, 5vw, 60px); font-weight: 300; line-height: 1.1;
    color: var(--color-primary); margin: 0 0 18px;
    animation: prFadeUp 0.8s ease both;
  }
  .pr-page-desc {
    font-family: 'DM Sans', sans-serif;
    font-size: 16px; font-weight: 300; line-height: 1.78;
    color: var(--color-text-soft); margin: 0;
    max-width: 600px;
    animation: prFadeUp 0.85s ease 0.1s both;
  }

  /* ── Content sections ── */
  .pr-sections {
    padding: 72px 0 80px;
    background: var(--color-bg);
    position: relative;
  }
  .pr-sections::before {
    content: '';
    position: absolute; top: 0; left: 0; right: 0; height: 1px;
    background: linear-gradient(90deg, transparent, rgba(104,80,68,0.10), transparent);
  }
  .pr-section { margin-bottom: 32px; position: relative; }
  .pr-section:last-child { margin-bottom: 0; }

  .pr-section-bar {
    position: absolute; left: 0; top: 0;
    width: 3px; height: 100%; border-radius: 0 3px 3px 0;
  }
  .pr-bar-0 { background: linear-gradient(180deg, var(--color-accent-blue), var(--color-accent-blush)); }
  .pr-bar-1 { background: linear-gradient(180deg, var(--color-accent-blush), var(--color-accent-blue)); }

  .pr-section-card {
    margin-left: 20px;
    border-radius: 20px;
    border: 1px solid rgba(104,80,68,0.09);
    background: rgba(255,255,255,0.65);
    backdrop-filter: blur(10px);
    padding: 40px 44px;
  }
  @media (max-width: 640px) {
    .pr-section-card { margin-left: 14px; padding: 28px 22px; }
  }

  .pr-section-title {
    font-family: 'Cormorant Garamond', serif;
    font-size: clamp(24px, 3.5vw, 38px); font-weight: 600; line-height: 1.15;
    color: var(--color-primary); margin: 0 0 20px;
    padding-bottom: 16px;
    border-bottom: 1px solid rgba(104,80,68,0.07);
    position: relative;
  }
  .pr-section-title::after {
    content: '';
    position: absolute; bottom: -1px; left: 0;
    width: 40px; height: 1px;
    background: linear-gradient(90deg, var(--color-accent-blue), var(--color-accent-blush));
  }

  /* ── Rich text ── */
  .pr-rich-text {
    font-family: 'DM Sans', sans-serif;
    font-size: 15px; font-weight: 300; line-height: 1.88;
    color: var(--color-text-soft);
    white-space: pre-wrap;
  }
  .pr-rich-text p { margin: 0 0 16px; }
  .pr-rich-text p:last-child { margin: 0; }
  .pr-rich-text h2 {
    font-family: 'Cormorant Garamond', serif;
    font-size: clamp(20px, 2.8vw, 28px); font-weight: 600;
    color: var(--color-primary); margin: 32px 0 12px;
  }
  .pr-rich-text h3 {
    font-family: 'Cormorant Garamond', serif;
    font-size: clamp(17px, 2.2vw, 22px); font-weight: 600;
    color: var(--color-primary); margin: 24px 0 10px;
  }
  .pr-rich-text ul, .pr-rich-text ol { padding-left: 20px; margin: 0 0 16px; }
  .pr-rich-text li { margin-bottom: 8px; }
  .pr-rich-text strong { color: var(--color-primary); font-weight: 500; }
  .pr-rich-text a {
    color: var(--color-primary); font-weight: 500;
    border-bottom: 1px solid rgba(58,64,90,0.22);
    text-decoration: none; transition: border-color 0.2s;
  }
  .pr-rich-text a:hover { border-color: var(--color-accent-blue); }
  .pr-rich-text blockquote {
    border-left: 3px solid var(--color-accent-blue);
    padding: 12px 20px; margin: 20px 0;
    background: rgba(153,178,221,0.06);
    border-radius: 0 12px 12px 0;
    font-style: italic; color: var(--color-primary);
  }
  .pr-rich-text img { width: 100%; border-radius: 12px; margin: 20px 0; }

  /* ── Image section ── */
  .pr-img-wrap {
    border-radius: 14px; overflow: hidden;
    border: 1px solid rgba(104,80,68,0.09);
  }
  .pr-section-img {
    width: 100%; height: auto; max-height: 600px; object-fit: cover;
    display: block;
  }

  /* ── Two column ── */
  .pr-two-col {
    display: grid; grid-template-columns: 1fr 1fr; gap: 24px;
    align-items: start;
  }
  @media (max-width: 768px) { .pr-two-col { grid-template-columns: 1fr; } }
  .pr-col { min-width: 0; }
  .pr-col-placeholder {
    min-height: 260px; border-radius: 14px;
    border: 1.5px dashed rgba(104,80,68,0.18);
    background: linear-gradient(135deg, rgba(153,178,221,0.08), rgba(233,175,163,0.06));
    display: flex; align-items: center; justify-content: center;
    font-family: 'DM Sans', sans-serif;
    font-size: 13px; font-weight: 300;
    color: var(--color-text-soft);
  }

  /* ── Footer CTA ── */
  .pr-footer-cta { padding: 0 0 96px; background: var(--color-bg); }
  .pr-footer-cta-card {
    border-radius: 24px;
    background: var(--color-primary);
    padding: 64px 48px; text-align: center;
    position: relative; overflow: hidden;
  }
  .pr-footer-cta-grid {
    position: absolute; inset: 0; pointer-events: none;
    background-image:
      linear-gradient(rgba(255,250,247,0.03) 1px, transparent 1px),
      linear-gradient(90deg, rgba(255,250,247,0.03) 1px, transparent 1px);
    background-size: 40px 40px;
  }
  .pr-footer-eyebrow {
    font-family: 'DM Sans', sans-serif;
    font-size: 10px; font-weight: 500;
    letter-spacing: 0.22em; text-transform: uppercase;
    color: rgba(249,222,201,0.50); margin: 0 0 14px;
    position: relative; z-index: 1;
  }
  .pr-footer-title {
    font-family: 'Cormorant Garamond', serif;
    font-size: clamp(28px, 4vw, 48px); font-weight: 300; line-height: 1.15;
    color: var(--color-surface); margin: 0 0 28px;
    position: relative; z-index: 1;
  }
  .pr-footer-cta .pr-btn-light { position: relative; z-index: 1; }

  @media (max-width: 640px) {
    .pr-hero { padding: 80px 0 64px; }
    .pr-footer-cta-card { padding: 44px 24px; }
    .pr-btn-primary, .pr-btn-light, .pr-state-btn { width: 100%; justify-content: center; }
  }
`;