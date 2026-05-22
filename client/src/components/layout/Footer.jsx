// src/components/layout/Footer.jsx
import { Link } from "react-router-dom";
import { useState, useEffect, useRef, useCallback } from "react";
import Container from "../common/Container";
import { useSiteConfig } from "../../context/SiteConfigContext";

// ─── Icons ────────────────────────────────────────────────────────────────────

const FacebookIcon = ({ size = 15 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
  </svg>
);

const LinkedinIcon = ({ size = 15 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
    <rect x="2" y="9" width="4" height="12" /><circle cx="4" cy="4" r="2" />
  </svg>
);

const InstagramIcon = ({ size = 15 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
    <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
  </svg>
);

const TwitterIcon = ({ size = 15 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M4 4l16 16M4 20L20 4" />
  </svg>
);

const YoutubeIcon = ({ size = 15 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M22.54 6.42a2.78 2.78 0 0 0-1.95-1.96C18.88 4 12 4 12 4s-6.88 0-8.59.46A2.78 2.78 0 0 0 1.46 6.42 29 29 0 0 0 1 12a29 29 0 0 0 .46 5.58 2.78 2.78 0 0 0 1.95 1.96C5.12 20 12 20 12 20s6.88 0 8.59-.46a2.78 2.78 0 0 0 1.95-1.96A29 29 0 0 0 23 12a29 29 0 0 0-.46-5.58z" />
    <polygon points="9.75 15.02 15.5 12 9.75 8.98 9.75 15.02" />
  </svg>
);

const SearchIcon = ({ size = 14 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" />
  </svg>
);

const CloseIcon = ({ size = 14 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
  </svg>
);

const GridIcon = ({ size = 13 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <rect x="3" y="3" width="7" height="7" /><rect x="14" y="3" width="7" height="7" />
    <rect x="3" y="14" width="7" height="7" /><rect x="14" y="14" width="7" height="7" />
  </svg>
);

const ArrowRight = ({ size = 11 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <line x1="5" y1="12" x2="19" y2="12" /><polyline points="12 5 19 12 12 19" />
  </svg>
);

// ─── Resources Drawer ─────────────────────────────────────────────────────────
// Handles any number of pages gracefully: search + virtualized-feel scroll

const PREVIEW_COUNT = 5;

function ResourcesDrawer({ pages, isOpen, onClose }) {
  const [query, setQuery] = useState("");
  const inputRef = useRef(null);
  const drawerRef = useRef(null);

  const filtered = query.trim()
    ? pages.filter((p) =>
        p.label.toLowerCase().includes(query.toLowerCase())
      )
    : pages;

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 120);
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
      setQuery("");
    }
    return () => { document.body.style.overflow = ""; };
  }, [isOpen]);

  // Close on Escape
  useEffect(() => {
    const handler = (e) => { if (e.key === "Escape") onClose(); };
    document.addEventListener("keydown", handler);
    return () => document.removeEventListener("keydown", handler);
  }, [onClose]);

  // Close on backdrop click
  const handleBackdrop = (e) => {
    if (e.target === e.currentTarget) onClose();
  };

  return (
    <>
      <style>{`
        .res-backdrop {
          position: fixed;
          inset: 0;
          z-index: 9000;
          background: rgba(10,10,14,0.72);
          backdrop-filter: blur(6px);
          display: flex;
          align-items: flex-end;
          justify-content: flex-end;
          opacity: 0;
          pointer-events: none;
          transition: opacity 0.3s ease;
        }
        .res-backdrop.open {
          opacity: 1;
          pointer-events: all;
        }
        .res-drawer {
          width: 100%;
          max-width: 460px;
          height: 100dvh;
          background: #0f1117;
          border-left: 1px solid rgba(249,222,201,0.08);
          display: flex;
          flex-direction: column;
          transform: translateX(100%);
          transition: transform 0.35s cubic-bezier(0.32,0.72,0,1);
        }
        .res-backdrop.open .res-drawer {
          transform: translateX(0);
        }
        .res-drawer-header {
          padding: 28px 28px 20px;
          border-bottom: 1px solid rgba(249,222,201,0.06);
          flex-shrink: 0;
        }
        .res-drawer-title-row {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-bottom: 18px;
        }
        .res-drawer-title {
          font-family: 'Cormorant Garamond', serif;
          font-size: 22px;
          font-weight: 400;
          font-style: italic;
          color: rgba(249,222,201,0.85);
          margin: 0;
        }
        .res-drawer-count {
          font-family: 'DM Sans', sans-serif;
          font-size: 11px;
          font-weight: 400;
          color: rgba(249,222,201,0.30);
          letter-spacing: 0.06em;
        }
        .res-close-btn {
          width: 32px;
          height: 32px;
          border-radius: 8px;
          border: 1px solid rgba(249,222,201,0.10);
          background: transparent;
          color: rgba(249,222,201,0.45);
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: all 0.2s ease;
        }
        .res-close-btn:hover {
          background: rgba(249,222,201,0.06);
          color: rgba(249,222,201,0.85);
        }
        .res-search-wrap {
          position: relative;
        }
        .res-search-icon {
          position: absolute;
          left: 12px;
          top: 50%;
          transform: translateY(-50%);
          color: rgba(249,222,201,0.28);
          pointer-events: none;
        }
        .res-search-input {
          width: 100%;
          padding: 10px 12px 10px 36px;
          background: rgba(249,222,201,0.04);
          border: 1px solid rgba(249,222,201,0.08);
          border-radius: 8px;
          color: rgba(249,222,201,0.80);
          font-family: 'DM Sans', sans-serif;
          font-size: 13px;
          font-weight: 300;
          outline: none;
          box-sizing: border-box;
          transition: border-color 0.2s ease;
        }
        .res-search-input::placeholder {
          color: rgba(249,222,201,0.22);
        }
        .res-search-input:focus {
          border-color: rgba(249,222,201,0.18);
        }
        .res-list-wrap {
          flex: 1;
          overflow-y: auto;
          padding: 8px 0;
          scrollbar-width: thin;
          scrollbar-color: rgba(249,222,201,0.10) transparent;
        }
        .res-list-wrap::-webkit-scrollbar { width: 4px; }
        .res-list-wrap::-webkit-scrollbar-thumb { background: rgba(249,222,201,0.10); border-radius: 4px; }
        .res-empty {
          padding: 48px 28px;
          text-align: center;
          font-family: 'DM Sans', sans-serif;
          font-size: 13px;
          color: rgba(249,222,201,0.25);
        }
        .res-item-link {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 11px 28px;
          text-decoration: none;
          color: rgba(249,222,201,0.55);
          font-family: 'DM Sans', sans-serif;
          font-size: 13.5px;
          font-weight: 300;
          transition: background 0.15s ease, color 0.15s ease, padding-left 0.2s ease;
          border-left: 2px solid transparent;
        }
        .res-item-link:hover {
          background: rgba(249,222,201,0.04);
          color: rgba(249,222,201,0.90);
          border-left-color: rgba(249,222,201,0.20);
          padding-left: 32px;
        }
        .res-item-arrow {
          opacity: 0;
          transition: opacity 0.15s ease;
        }
        .res-item-link:hover .res-item-arrow {
          opacity: 1;
        }
        .res-drawer-footer {
          padding: 16px 28px;
          border-top: 1px solid rgba(249,222,201,0.06);
          flex-shrink: 0;
        }
        .res-result-count {
          font-family: 'DM Sans', sans-serif;
          font-size: 11px;
          color: rgba(249,222,201,0.22);
          text-align: center;
        }
        @media (max-width: 480px) {
          .res-drawer {
            max-width: 100%;
          }
        }
      `}</style>

      <div
        className={`res-backdrop${isOpen ? " open" : ""}`}
        onClick={handleBackdrop}
        role="dialog"
        aria-modal="true"
        aria-label="All Resources"
      >
        <div className="res-drawer" ref={drawerRef}>
          <div className="res-drawer-header">
            <div className="res-drawer-title-row">
              <div>
                <p className="res-drawer-title">All Resources</p>
                <p className="res-drawer-count">{pages.length} pages</p>
              </div>
              <button className="res-close-btn" onClick={onClose} aria-label="Close resources panel">
                <CloseIcon />
              </button>
            </div>
            <div className="res-search-wrap">
              <span className="res-search-icon"><SearchIcon /></span>
              <input
                ref={inputRef}
                className="res-search-input"
                type="text"
                placeholder={`Search ${pages.length} resources…`}
                value={query}
                onChange={(e) => setQuery(e.target.value)}
              />
            </div>
          </div>

          <div className="res-list-wrap" role="list">
            {filtered.length === 0 ? (
              <div className="res-empty">No results for "{query}"</div>
            ) : (
              filtered.map((page) => (
                <Link
                  key={page.href}
                  to={page.href}
                  className="res-item-link"
                  role="listitem"
                  onClick={onClose}
                >
                  <span>{page.label}</span>
                  <span className="res-item-arrow"><ArrowRight /></span>
                </Link>
              ))
            )}
          </div>

          <div className="res-drawer-footer">
            <p className="res-result-count">
              {filtered.length === pages.length
                ? `Showing all ${pages.length} resources`
                : `${filtered.length} of ${pages.length} matched`}
            </p>
          </div>
        </div>
      </div>
    </>
  );
}

// ─── Main Footer ──────────────────────────────────────────────────────────────

export default function Footer() {
  const { siteConfig } = useSiteConfig();
  const [drawerOpen, setDrawerOpen] = useState(false);

  const cmsPages = siteConfig.cmsPages || [];
  const hasResources = cmsPages.length > 0;
  const previewPages = cmsPages.slice(0, PREVIEW_COUNT);
  const overflowCount = cmsPages.length - PREVIEW_COUNT;
  const openDrawer = useCallback(() => setDrawerOpen(true), []);
  const closeDrawer = useCallback(() => setDrawerOpen(false), []);

  return (
    <footer className="footer-root">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;1,300;1,400&family=DM+Sans:wght@300;400;500&display=swap');

        /* ── Base ── */
        .footer-root {
          background: var(--color-primary);
          position: relative;
          overflow: hidden;
        }

        /* ── Subtle grid texture ── */
        .footer-root::before {
          content: '';
          position: absolute;
          inset: 0;
          background-image:
            linear-gradient(rgba(255,250,247,0.025) 1px, transparent 1px),
            linear-gradient(90deg, rgba(255,250,247,0.025) 1px, transparent 1px);
          background-size: 60px 60px;
          pointer-events: none;
        }

        /* ── Atmospheric orbs ── */
        .footer-orb {
          position: absolute;
          border-radius: 50%;
          pointer-events: none;
          filter: blur(100px);
        }
        .footer-orb-1 {
          width: 500px; height: 500px;
          bottom: -200px; left: -120px;
          background: radial-gradient(circle, rgba(153,178,221,0.09) 0%, transparent 70%);
        }
        .footer-orb-2 {
          width: 360px; height: 360px;
          top: -100px; right: -60px;
          background: radial-gradient(circle, rgba(233,175,163,0.07) 0%, transparent 70%);
        }
        .footer-orb-3 {
          width: 200px; height: 200px;
          top: 40%; left: 40%;
          background: radial-gradient(circle, rgba(249,222,201,0.04) 0%, transparent 70%);
        }

        /* ── Top rule ── */
        .footer-top-rule {
          height: 1px;
          background: linear-gradient(90deg, transparent, rgba(249,222,201,0.15) 30%, rgba(249,222,201,0.15) 70%, transparent);
        }

        /* ── Inner layout ── */
        .footer-inner {
          position: relative;
          z-index: 1;
          padding: 72px 0 0;
        }

        /* ── Main grid ── */
        .footer-grid {
          display: grid;
          grid-template-columns: 1fr;
          gap: 52px;
        }
        @media (min-width: 768px) {
          .footer-grid {
            grid-template-columns: 1.9fr 1fr 1fr 1fr;
            gap: 48px;
          }
        }
        @media (min-width: 1024px) {
          .footer-grid {
            gap: 64px;
          }
        }

        /* ── Brand col ── */
        .footer-brand-logo {
          margin-bottom: 22px;
          display: inline-block;
          text-decoration: none;
        }
        .footer-brand-logo img {
          display: block;
          width: 240px;
          height: auto;
          filter: brightness(0) invert(1);
          opacity: 0.80;
        }
        .footer-brand-desc {
          font-family: 'DM Sans', sans-serif;
          font-size: 13px;
          font-weight: 300;
          line-height: 1.85;
          color: rgba(249,222,201,0.48);
          max-width: 320px;
          margin: 0 0 28px;
        }

        /* ── ISO badge ── */
        .footer-iso-badge {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          border: 1px solid rgba(249,222,201,0.12);
          border-radius: 6px;
          padding: 7px 13px;
          width: fit-content;
        }
        .footer-iso-dot {
          width: 5px; height: 5px;
          border-radius: 50%;
          background: var(--color-accent-blush, rgba(233,175,163,0.9));
          flex-shrink: 0;
        }
        .footer-iso-text {
          font-family: 'DM Sans', sans-serif;
          font-size: 10px;
          font-weight: 500;
          letter-spacing: 0.14em;
          text-transform: uppercase;
          color: rgba(249,222,201,0.42);
        }

        /* ── Socials ── */
        .footer-socials {
          display: flex;
          align-items: center;
          gap: 10px;
          margin-top: 24px;
        }
        .footer-social-link {
          width: 34px; height: 34px;
          border-radius: 7px;
          border: 1px solid rgba(249,222,201,0.10);
          display: flex;
          align-items: center;
          justify-content: center;
          color: rgba(249,222,201,0.50);
          transition: all 0.22s ease;
          text-decoration: none;
        }
        .footer-social-link:hover {
          background: rgba(249,222,201,0.07);
          color: rgba(249,222,201,0.90);
          border-color: rgba(249,222,201,0.20);
          transform: translateY(-2px);
        }

        /* ── Column headings ── */
        .footer-col-heading {
          font-family: 'DM Sans', sans-serif;
          font-size: 9.5px;
          font-weight: 500;
          letter-spacing: 0.22em;
          text-transform: uppercase;
          color: rgba(249,222,201,0.32);
          margin-bottom: 18px;
          display: flex;
          align-items: center;
          gap: 10px;
        }
        .footer-col-heading::after {
          content: '';
          flex: 1;
          height: 1px;
          background: rgba(249,222,201,0.07);
        }

        /* ── Nav links ── */
        .footer-links {
          display: flex;
          flex-direction: column;
          gap: 0;
        }
        .footer-link {
          font-family: 'DM Sans', sans-serif;
          font-size: 13px;
          font-weight: 300;
          color: rgba(249,222,201,0.55);
          text-decoration: none;
          padding: 8px 0;
          border-bottom: 1px solid rgba(249,222,201,0.045);
          display: flex;
          align-items: center;
          justify-content: space-between;
          transition: color 0.2s ease, padding-left 0.2s ease;
          gap: 8px;
        }
        .footer-link:hover {
          color: rgba(249,222,201,0.90);
          padding-left: 6px;
        }
        .footer-link-arrow {
          opacity: 0;
          flex-shrink: 0;
          transition: opacity 0.2s ease;
        }
        .footer-link:hover .footer-link-arrow {
          opacity: 1;
        }

        /* ── Resources col ── */
        .footer-resources-preview {
          display: flex;
          flex-direction: column;
          gap: 0;
        }

        /* "View all" trigger button */
        .footer-resources-trigger {
          display: flex;
          align-items: center;
          gap: 8px;
          margin-top: 10px;
          padding: 9px 13px;
          background: rgba(249,222,201,0.04);
          border: 1px solid rgba(249,222,201,0.10);
          border-radius: 7px;
          cursor: pointer;
          width: 100%;
          color: rgba(249,222,201,0.55);
          font-family: 'DM Sans', sans-serif;
          font-size: 12px;
          font-weight: 400;
          letter-spacing: 0.03em;
          transition: all 0.22s ease;
          text-align: left;
        }
        .footer-resources-trigger:hover {
          background: rgba(249,222,201,0.08);
          border-color: rgba(249,222,201,0.18);
          color: rgba(249,222,201,0.85);
        }
        .footer-resources-trigger-icon {
          flex-shrink: 0;
          opacity: 0.6;
        }
        .footer-resources-badge {
          margin-left: auto;
          font-family: 'DM Sans', sans-serif;
          font-size: 10px;
          font-weight: 500;
          background: rgba(249,222,201,0.08);
          border-radius: 4px;
          padding: 2px 6px;
          color: rgba(249,222,201,0.45);
          letter-spacing: 0.04em;
        }

        /* ── Contact col ── */
        .footer-contact-item {
          padding: 9px 0;
          border-bottom: 1px solid rgba(249,222,201,0.045);
        }
        .footer-contact-label {
          font-family: 'DM Sans', sans-serif;
          font-size: 9.5px;
          font-weight: 500;
          letter-spacing: 0.14em;
          text-transform: uppercase;
          color: rgba(249,222,201,0.25);
          margin: 0 0 3px;
        }
        .footer-contact-text {
          font-family: 'DM Sans', sans-serif;
          font-size: 13px;
          font-weight: 300;
          line-height: 1.60;
          color: rgba(249,222,201,0.52);
          margin: 0;
        }
        .footer-contact-text a {
          color: inherit;
          text-decoration: none;
          transition: color 0.2s ease;
        }
        .footer-contact-text a:hover {
          color: rgba(249,222,201,0.85);
        }

        /* ── Bottom bar ── */
        .footer-bottom {
          margin-top: 64px;
          padding: 20px 0 24px;
          border-top: 1px solid rgba(249,222,201,0.06);
          display: flex;
          align-items: center;
          justify-content: space-between;
          flex-wrap: wrap;
          gap: 12px;
        }
        .footer-copyright {
          font-family: 'DM Sans', sans-serif;
          font-size: 11.5px;
          font-weight: 300;
          color: rgba(249,222,201,0.25);
          margin: 0;
        }
        .footer-tagline {
          font-family: 'Cormorant Garamond', serif;
          font-size: 14px;
          font-weight: 300;
          font-style: italic;
          color: rgba(249,222,201,0.20);
        }
        .footer-bottom-links {
          display: flex;
          align-items: center;
          gap: 18px;
        }
        .footer-bottom-link {
          font-family: 'DM Sans', sans-serif;
          font-size: 11px;
          font-weight: 300;
          color: rgba(249,222,201,0.22);
          text-decoration: none;
          transition: color 0.2s ease;
        }
        .footer-bottom-link:hover {
          color: rgba(249,222,201,0.55);
        }
        .footer-bottom-sep {
          width: 1px;
          height: 12px;
          background: rgba(249,222,201,0.10);
        }
      `}</style>

      {/* Atmospheric elements */}
      <div className="footer-orb footer-orb-1" />
      <div className="footer-orb footer-orb-2" />
      <div className="footer-orb footer-orb-3" />
      <div className="footer-top-rule" />

      {/* Resources Drawer — handles any number of pages */}
      {hasResources && (
        <ResourcesDrawer
          pages={cmsPages}
          isOpen={drawerOpen}
          onClose={closeDrawer}
        />
      )}

      <Container>
        <div className="footer-inner">
          <div className="footer-grid">

            {/* ── Brand ── */}
            <div>
              <Link to="/" className="footer-brand-logo">
                <img src="/logo.svg" alt={siteConfig.name} />
              </Link>
              <p className="footer-brand-desc">{siteConfig.footerDescription}</p>
              <div className="footer-iso-badge">
                <span className="footer-iso-dot" />
                <span className="footer-iso-text">ISO 9001:2015 Certified</span>
              </div>
              <div className="footer-socials">
                {siteConfig.facebookUrl && (
                  <a href={siteConfig.facebookUrl} className="footer-social-link" target="_blank" rel="noopener noreferrer" aria-label="Facebook">
                    <FacebookIcon />
                  </a>
                )}
                {siteConfig.linkedinUrl && (
                  <a href={siteConfig.linkedinUrl} className="footer-social-link" target="_blank" rel="noopener noreferrer" aria-label="LinkedIn">
                    <LinkedinIcon />
                  </a>
                )}
                {siteConfig.instagramUrl && (
                  <a href={siteConfig.instagramUrl} className="footer-social-link" target="_blank" rel="noopener noreferrer" aria-label="Instagram">
                    <InstagramIcon />
                  </a>
                )}
                {siteConfig.twitterUrl && (
                  <a href={siteConfig.twitterUrl} className="footer-social-link" target="_blank" rel="noopener noreferrer" aria-label="X / Twitter">
                    <TwitterIcon />
                  </a>
                )}
                {siteConfig.youtubeUrl && (
                  <a href={siteConfig.youtubeUrl} className="footer-social-link" target="_blank" rel="noopener noreferrer" aria-label="YouTube">
                    <YoutubeIcon />
                  </a>
                )}
              </div>
            </div>

            {/* ── Quick Links ── */}
            <div>
              <div className="footer-col-heading">Quick Links</div>
              <div className="footer-links">
                {siteConfig.navLinks.map((link) => (
                  <Link key={link.href} to={link.href} className="footer-link">
                    <span>{link.label}</span>
                    <span className="footer-link-arrow"><ArrowRight /></span>
                  </Link>
                ))}
                <Link to="/careers" className="footer-link">
                  <span>Career Opportunities</span>
                  <span className="footer-link-arrow"><ArrowRight /></span>
                </Link>
              </div>
            </div>

            {/* ── Resources — scales to 100+ pages ── */}
            {hasResources && (
              <div>
                <div className="footer-col-heading">Resources</div>
                <div className="footer-resources-preview">
                  {previewPages.map((page) => (
                    <Link key={page.href} to={page.href} className="footer-link">
                      <span>{page.label}</span>
                      <span className="footer-link-arrow"><ArrowRight /></span>
                    </Link>
                  ))}
                </div>

                {/* Only show the "View all" trigger if there are more than PREVIEW_COUNT pages */}
                {cmsPages.length > PREVIEW_COUNT && (
                  <button
                    className="footer-resources-trigger"
                    onClick={openDrawer}
                    aria-expanded={drawerOpen}
                    aria-haspopup="dialog"
                  >
                    <span className="footer-resources-trigger-icon"><GridIcon /></span>
                    <span>Browse all resources</span>
                    <span className="footer-resources-badge">+{overflowCount} more</span>
                  </button>
                )}
              </div>
            )}

            {/* ── Contact ── */}
            <div>
              <div className="footer-col-heading">Contact</div>

              {siteConfig.contactEmail && (
                <div className="footer-contact-item">
                  <p className="footer-contact-label">Email</p>
                  <p className="footer-contact-text">
                    <a href={`mailto:${siteConfig.contactEmail}`}>{siteConfig.contactEmail}</a>
                  </p>
                </div>
              )}

              {siteConfig.phone && (
                <div className="footer-contact-item">
                  <p className="footer-contact-label">Phone</p>
                  <p className="footer-contact-text">
                    <a href={`tel:${siteConfig.phone}`}>{siteConfig.phone}</a>
                  </p>
                </div>
              )}

              {siteConfig.address && (
                <div className="footer-contact-item">
                  <p className="footer-contact-label">Address</p>
                  <p className="footer-contact-text">{siteConfig.address}</p>
                </div>
              )}
            </div>
          </div>

          {/* ── Bottom bar ── */}
          <div className="footer-bottom">
            <p className="footer-copyright">
              © {new Date().getFullYear()} {siteConfig.name}
              {siteConfig.copyrightText ? ` — ${siteConfig.copyrightText}` : ""}
            </p>

            <span className="footer-tagline">{siteConfig.siteTagline}</span>

            <div className="footer-bottom-links">
              <Link to="/privacy" className="footer-bottom-link">Privacy</Link>
              <span className="footer-bottom-sep" />
              <Link to="/terms" className="footer-bottom-link">Terms</Link>
            </div>
          </div>
        </div>
      </Container>
    </footer>
  );
}