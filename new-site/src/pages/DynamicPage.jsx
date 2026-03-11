// src/pages/DynamicPage.jsx
import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { api } from "../lib/api";
import Container from "../components/common/Container";
import Seo from "../components/common/Seo";

function isAbsoluteUrl(url) {
  return /^https?:\/\//i.test(url || "");
}

function resolveMediaUrl(path) {
  if (!path) return null;
  if (isAbsoluteUrl(path)) return path;

  const apiBase = import.meta.env.VITE_API_URL || "";
  return apiBase ? `${apiBase}${path}` : path;
}

function escapeHtml(str = "") {
  return String(str)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}

function textToHtml(text = "") {
  if (!text) return "";
  return escapeHtml(text)
    .replace(/\n\n+/g, "</p><p>")
    .replace(/\n/g, "<br />");
}

function normalizeSection(section, index) {
  if (!section || typeof section !== "object") return null;

  const type = section.type || "text";

  if (type === "text") {
    return {
      id: section.id || index,
      type: "text",
      title: section.title || "",
      content: `<p>${textToHtml(section.content || "")}</p>`,
    };
  }

  if (type === "image") {
    return {
      id: section.id || index,
      type: "image",
      src: resolveMediaUrl(section.src || section.imageUrl || section.image || ""),
      alt: section.alt || section.title || "",
      caption: section.caption || "",
    };
  }

  if (type === "two-column") {
    const rawText = String(section.content || "").trim();

    return {
      id: section.id || index,
      type: "two-column",
      title: section.title || "",
      left: `<p>${textToHtml(rawText)}</p>`,
      right: section.imageUrl
        ? `<img src="${resolveMediaUrl(section.imageUrl)}" alt="${escapeHtml(
            section.title || "Section image"
          )}" style="width:100%;border-radius:16px;display:block;" />`
        : `<p>${textToHtml(rawText)}</p>`,
    };
  }

  return {
    id: section.id || index,
    type: "text",
    title: section.title || "",
    content: `<p>${textToHtml(section.content || "")}</p>`,
  };
}

function normalizePage(raw) {
  if (!raw || typeof raw !== "object") return null;

  const content = raw.content && typeof raw.content === "object" ? raw.content : {};

  const sections = Array.isArray(content.sections)
    ? content.sections.map(normalizeSection).filter(Boolean)
    : [];

  const heroHeadline = content.heroHeadline || raw.title || "";
  const heroSubheading = content.heroSubheading || raw.description || "";
  const heroImage = resolveMediaUrl(content.heroImage || "");

  const ctaText = content.ctaText || "";
  const ctaLink = content.ctaLink || "/contact";

  return {
    id: raw.id,
    slug: raw.slug,
    title: raw.title || heroHeadline || "Page",
    subtitle: raw.description || "",
    description: raw.description || "",
    hero: {
      eyebrow: raw.slug
        ? raw.slug.replace(/-/g, " ").replace(/\b\w/g, (c) => c.toUpperCase())
        : "",
      heading: heroHeadline,
      subtitle: heroSubheading,
      image: heroImage,
    },
    sections,
    footerCta: ctaText
      ? {
          heading: ctaText,
          links: [{ label: ctaText, href: ctaLink }],
        }
      : null,
    seoTitle: content.seoTitle || raw.title || "",
    seoDescription: content.seoDescription || raw.description || "",
    isPublished: raw.isPublished,
  };
}

export default function DynamicPage() {
  const { slug } = useParams();
  const [pageData, setPageData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    setLoading(true);
    setNotFound(false);
    setPageData(null);

    api
      .getPage(slug)
      .then((res) => {
        const raw = res?.data || res;
        const normalized = normalizePage(raw);
        if (!normalized) throw new Error("Invalid page data");
        setPageData(normalized);
      })
      .catch(() => setNotFound(true))
      .finally(() => setLoading(false));
  }, [slug]);

  if (loading) return <Spinner />;
  if (notFound || !pageData) return <NotFoundState />;

  const sections = Array.isArray(pageData.sections) ? pageData.sections : [];

  return (
    <>
      <Seo
        title={pageData.seoTitle || pageData.title}
        description={pageData.seoDescription || pageData.subtitle}
        keywords={pageData.keywords || []}
        image={pageData.hero?.image || "/logo.png"}
        url={`/pages/${pageData.slug || ""}`}
      />  
      <style>{`
        .dynpage { background: var(--color-bg); min-height: 100vh; }
        .dynpage-hero { position: relative; overflow: hidden; padding: 100px 0 72px; }
        .dynpage-hero-orb { position: absolute; width: 500px; height: 500px; border-radius: 50%; top: -180px; right: -80px; background: radial-gradient(circle, rgba(153,178,221,0.14) 0%, transparent 65%); pointer-events: none; }
        .dynpage-hero-inner { position: relative; z-index: 1; }
        .dynpage-hero-img { width: 100%; max-height: 420px; object-fit: cover; border-radius: 20px; margin-top: 32px; }
        .dynpage-eyebrow { font-family: 'DM Sans', sans-serif; font-size: 10.5px; font-weight: 500; letter-spacing: 0.22em; text-transform: uppercase; color: var(--color-primary-2); display: flex; align-items: center; gap: 8px; margin-bottom: 14px; }
        .dynpage-eyebrow::before { content: ''; width: 28px; height: 1px; background: var(--color-primary-2); }
        .dynpage-h1 { font-family: 'Cormorant Garamond', serif; font-size: clamp(36px, 6vw, 72px); font-weight: 300; line-height: 1.08; color: var(--color-primary); margin: 0 0 18px; }
        .dynpage-subtitle { font-family: 'DM Sans', sans-serif; font-size: 16px; font-weight: 300; line-height: 1.80; color: var(--color-text-soft); max-width: 640px; }
        .dynpage-sections { padding: 64px 0 96px; background: var(--color-bg); }
        .dynpage-section-text { margin-bottom: 48px; }
        .dynpage-section-text-prose { font-family: 'DM Sans', sans-serif; font-size: 15px; font-weight: 300; line-height: 1.88; color: var(--color-text-soft); }
        .dynpage-section-text-prose h2 { font-family: 'Cormorant Garamond', serif; font-size: clamp(22px,3vw,34px); font-weight: 600; color: var(--color-primary); margin: 40px 0 14px; }
        .dynpage-section-text-prose h3 { font-family: 'Cormorant Garamond', serif; font-size: clamp(18px,2.5vw,26px); font-weight: 600; color: var(--color-primary); margin: 30px 0 10px; }
        .dynpage-section-text-prose p { margin: 0 0 18px; }
        .dynpage-section-text-prose ul { padding-left: 20px; margin: 0 0 18px; }
        .dynpage-section-text-prose li { margin-bottom: 8px; }
        .dynpage-section-image { margin-bottom: 48px; }
        .dynpage-section-image img { width: 100%; border-radius: 16px; }
        .dynpage-section-two-col { display: grid; grid-template-columns: 1fr; gap: 36px; margin-bottom: 48px; }
        @media (min-width: 768px) { .dynpage-section-two-col { grid-template-columns: 1fr 1fr; } }
        .dynpage-footer-cta { border-radius: 24px; background: var(--color-primary); padding: 56px 48px; text-align: center; position: relative; overflow: hidden; margin-top: 48px; }
        .dynpage-footer-cta::before { content: ''; position: absolute; inset: 0; background-image: linear-gradient(rgba(255,250,247,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(255,250,247,0.03) 1px, transparent 1px); background-size: 40px 40px; pointer-events: none; }
        .dynpage-cta-inner { position: relative; z-index: 1; }
        .dynpage-cta-title { font-family: 'Cormorant Garamond', serif; font-size: clamp(24px, 4vw, 42px); font-weight: 300; color: rgba(255,250,247,0.95); margin: 0 0 20px; }
        .dynpage-cta-btns { display: flex; flex-wrap: wrap; gap: 12px; justify-content: center; }
        .dynpage-cta-btn { display: inline-flex; align-items: center; gap: 6px; padding: 12px 28px; border-radius: 3px; background: rgba(255,250,247,0.95); color: var(--color-primary); font-family: 'DM Sans', sans-serif; font-size: 12px; font-weight: 500; letter-spacing: 0.09em; text-transform: uppercase; text-decoration: none; }
        .dynpage-404 { min-height: 60vh; display: flex; align-items: center; justify-content: center; flex-direction: column; gap: 16px; text-align: center; }
        .dynpage-404-title { font-family: 'Cormorant Garamond', serif; font-size: 52px; font-weight: 300; color: var(--color-primary); }
        .dynpage-404-sub { font-family: 'DM Sans', sans-serif; font-size: 14px; color: var(--color-text-soft); }
        .dynpage-404-link { font-family: 'DM Sans', sans-serif; font-size: 12.5px; font-weight: 500; color: var(--color-primary); text-decoration: none; letter-spacing: 0.08em; text-transform: uppercase; border-bottom: 1px solid rgba(104,80,68,0.20); padding-bottom: 2px; }
      `}</style>

      <main className="dynpage">
        {pageData.hero ? (
          <section className="dynpage-hero">
            <div className="dynpage-hero-orb" />
            <Container>
              <div className="dynpage-hero-inner">
                {pageData.hero.eyebrow && (
                  <p className="dynpage-eyebrow">{pageData.hero.eyebrow}</p>
                )}
                <h1 className="dynpage-h1">
                  {pageData.hero.heading || pageData.title}
                </h1>
                {pageData.hero.subtitle && (
                  <p className="dynpage-subtitle">{pageData.hero.subtitle}</p>
                )}
                {pageData.hero.image && (
                  <img
                    src={pageData.hero.image}
                    alt={pageData.title}
                    className="dynpage-hero-img"
                  />
                )}
              </div>
            </Container>
          </section>
        ) : (
          <section className="dynpage-hero">
            <div className="dynpage-hero-orb" />
            <Container>
              <div className="dynpage-hero-inner" style={{ maxWidth: 720 }}>
                <h1 className="dynpage-h1">{pageData.title}</h1>
                {pageData.subtitle && (
                  <p className="dynpage-subtitle">{pageData.subtitle}</p>
                )}
              </div>
            </Container>
          </section>
        )}

        {sections.length > 0 && (
          <section className="dynpage-sections">
            <Container>
              {sections.map((sec, i) => {
                if (sec.type === "text") {
                  return (
                    <div key={sec.id || i} className="dynpage-section-text">
                      {sec.title ? (
                        <h2
                          style={{
                            fontFamily: "'Cormorant Garamond', serif",
                            fontSize: "clamp(22px,3vw,34px)",
                            fontWeight: 600,
                            color: "var(--color-primary)",
                            margin: "0 0 14px",
                          }}
                        >
                          {sec.title}
                        </h2>
                      ) : null}
                      <div
                        className="dynpage-section-text-prose"
                        dangerouslySetInnerHTML={{ __html: sec.content }}
                      />
                    </div>
                  );
                }

                if (sec.type === "image") {
                  return (
                    <div key={sec.id || i} className="dynpage-section-image">
                      <img src={sec.src} alt={sec.alt || ""} />
                      {sec.caption && (
                        <p
                          style={{
                            fontFamily: "'DM Sans',sans-serif",
                            fontSize: 12,
                            color: "var(--color-text-soft)",
                            textAlign: "center",
                            marginTop: 8,
                          }}
                        >
                          {sec.caption}
                        </p>
                      )}
                    </div>
                  );
                }

                if (sec.type === "two-column") {
                  return (
                    <div key={sec.id || i} className="dynpage-section-two-col">
                      <div
                        className="dynpage-section-text-prose"
                        dangerouslySetInnerHTML={{ __html: sec.left }}
                      />
                      <div
                        className="dynpage-section-text-prose"
                        dangerouslySetInnerHTML={{ __html: sec.right }}
                      />
                    </div>
                  );
                }

                return null;
              })}

              {pageData.footerCta && (
                <div className="dynpage-footer-cta">
                  <div className="dynpage-cta-inner">
                    <h2 className="dynpage-cta-title">
                      {pageData.footerCta.heading || "Ready to get started?"}
                    </h2>
                    <div className="dynpage-cta-btns">
                      {(pageData.footerCta.links || [
                        { label: "Contact Us", href: "/contact" },
                      ]).map((l, idx) => (
                        <Link
                          key={`${l.href}-${idx}`}
                          to={l.href}
                          className="dynpage-cta-btn"
                        >
                          {l.label} →
                        </Link>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </Container>
          </section>
        )}
      </main>
    </>
  );
}

function Spinner() {
  return (
    <div
      style={{
        minHeight: "60vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <div
        style={{
          width: 40,
          height: 40,
          borderRadius: "50%",
          border: "3px solid rgba(153,178,221,0.25)",
          borderTopColor: "var(--color-primary)",
          animation: "spin 0.8s linear infinite",
        }}
      />
    </div>
  );
}

function NotFoundState() {
  return (
    <div className="dynpage">
      <div className="dynpage-404">
        <h1 className="dynpage-404-title">404</h1>
        <p className="dynpage-404-sub">This page could not be found.</p>
        <Link to="/" className="dynpage-404-link">
          ← Back to Home
        </Link>
      </div>
    </div>
  );
}