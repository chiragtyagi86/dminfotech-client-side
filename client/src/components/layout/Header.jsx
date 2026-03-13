// src/components/layout/Header.jsx
import React, { useState, useEffect, useRef } from "react";
import { Link, useLocation } from "react-router-dom";
import Container from "../common/Container";
import { useSiteConfig } from "../../context/SiteConfigContext";

function ChevronRightIcon({ size = 14, strokeWidth = 1.5, style = {}, className = "" }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
      style={style}
      className={className}
      aria-hidden="true"
    >
      <path d="m9 18 6-6-6-6" />
    </svg>
  );
}

function MenuIcon({ size = 18, strokeWidth = 1.5 }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <line x1="4" y1="12" x2="20" y2="12" />
      <line x1="4" y1="6" x2="20" y2="6" />
      <line x1="4" y1="18" x2="20" y2="18" />
    </svg>
  );
}

function XIcon({ size = 18, strokeWidth = 1.5 }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <line x1="18" y1="6" x2="6" y2="18" />
      <line x1="6" y1="6" x2="18" y2="18" />
    </svg>
  );
}

export default function Header() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();
  const { siteConfig } = useSiteConfig();

  const ticking = useRef(false);
  const lastScrolled = useRef(false);

  useEffect(() => {
    const updateScrollState = () => {
      const next = window.scrollY > 20;
      if (next !== lastScrolled.current) {
        lastScrolled.current = next;
        setScrolled(next);
      }
      ticking.current = false;
    };

    const onScroll = () => {
      if (!ticking.current) {
        ticking.current = true;
        window.requestAnimationFrame(updateScrollState);
      }
    };

    updateScrollState();
    window.addEventListener("scroll", onScroll, { passive: true });

    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    const onResize = () => {
      if (window.innerWidth >= 930) setOpen(false);
    };
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  useEffect(() => {
    setOpen(false);
  }, [location.pathname]);

  const isHome = location.pathname === "/";

  return (
    <>
      <style>{`
        .header-root {
          position: sticky;
          top: 0;
          z-index: 80;
          width: 100%;
        }

        .header-glass {
          background: rgba(255, 250, 247, 0.92);
          border-bottom: 1px solid rgba(104, 80, 68, 0.10);
          transition: background 0.25s ease, box-shadow 0.25s ease, border-color 0.25s ease;
        }

        .header-glass.scrolled {
          background: rgba(255, 250, 247, 0.97);
          box-shadow: 0 6px 20px rgba(58, 64, 90, 0.08);
        }

        @supports ((-webkit-backdrop-filter: blur(10px)) or (backdrop-filter: blur(10px))) {
          .header-glass {
            backdrop-filter: blur(10px) saturate(130%);
            -webkit-backdrop-filter: blur(10px) saturate(130%);
          }
        }

        .header-topbar {
          height: 2px;
          background: linear-gradient(
            90deg,
            transparent 0%,
            rgba(104, 80, 68, 0.18) 20%,
            rgba(153, 178, 221, 0.58) 50%,
            rgba(104, 80, 68, 0.18) 80%,
            transparent 100%
          );
          transition: opacity 0.2s ease;
        }

        .header-topbar.hidden-bar {
          opacity: 0;
        }

        .header-inner {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 20px;
          min-height: 96px;
          transition: min-height 0.25s ease;
          font-family: 'DM Sans', sans-serif;
        }

        .header-inner.scrolled {
          min-height: 82px;
        }

        .logo-wrap {
          display: flex;
          align-items: center;
          gap: 18px;
          text-decoration: none;
          min-width: 0;
          flex-shrink: 0;
        }

        .logo-image {
          width: auto;
          height: auto;
          max-height: 88px;
          transition: max-height 0.25s ease, transform 0.2s ease;
          display: block;
        }

        .header-inner.scrolled .logo-image {
          max-height: 78px;
        }

        .logo-wrap:hover .logo-image {
          transform: translateY(-1px);
        }

        .logo-divider {
          width: 1px;
          height: 38px;
          background: linear-gradient(
            180deg,
            transparent,
            rgba(104, 80, 68, 0.26),
            transparent
          );
          flex-shrink: 0;
        }

        .logo-tagline {
          font-family: 'Cormorant Garamond', serif;
          font-size: 12px;
          font-weight: 500;
          letter-spacing: 0.18em;
          text-transform: uppercase;
          color: var(--color-primary-2);
          opacity: 0.82;
          line-height: 1.35;
          max-width: 145px;
          white-space: normal;
        }

        .desktop-nav {
          display: flex;
          align-items: center;
          gap: 24px;
          min-width: 0;
        }

        .nav-link {
          position: relative;
          font-family: 'DM Sans', sans-serif;
          font-size: 13.5px;
          font-weight: 400;
          letter-spacing: 0.03em;
          color: var(--color-text);
          text-decoration: none;
          padding: 4px 0;
          transition: color 0.25s ease;
          white-space: nowrap;
        }

        .nav-link::after {
          content: '';
          position: absolute;
          bottom: -1px;
          left: 0;
          width: 0;
          height: 1px;
          background: linear-gradient(
            90deg,
            var(--color-accent-blue),
            var(--color-accent-blush)
          );
          transition: width 0.25s ease;
        }

        .nav-link:hover {
          color: var(--color-primary);
        }

        .nav-link:hover::after,
        .nav-link.active::after {
          width: 100%;
        }

        .nav-link.active {
          color: var(--color-primary);
        }

        .nav-sep {
          width: 3px;
          height: 3px;
          border-radius: 50%;
          background: rgba(104, 80, 68, 0.22);
          flex-shrink: 0;
        }

        .desktop-divider {
          width: 1px;
          height: 22px;
          background: rgba(104,80,68,0.15);
          margin: 0 2px;
          flex-shrink: 0;
        }

        .cta-btn {
          position: relative;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          gap: 6px;
          min-height: 42px;
          padding: 10px 18px;
          border-radius: 4px;
          background: var(--color-btn-primary, var(--color-primary));
          color: var(--color-btn-primary-text, var(--color-surface));
          font-family: 'DM Sans', sans-serif;
          font-size: 12px;
          font-weight: 500;
          letter-spacing: 0.08em;
          text-transform: uppercase;
          text-decoration: none;
          overflow: hidden;
          white-space: nowrap;
          transition: transform 0.2s ease, box-shadow 0.2s ease;
          flex-shrink: 0;
        }

        .cta-btn:hover {
          transform: translateY(-1px);
          box-shadow: 0 8px 20px rgba(58, 64, 90, 0.18);
        }

        .cta-chevron {
          transition: transform 0.22s ease;
        }

        .cta-btn:hover .cta-chevron {
          transform: translateX(3px);
        }

        .menu-btn {
          display: none;
          align-items: center;
          justify-content: center;
          width: 42px;
          height: 42px;
          border-radius: 6px;
          border: 1px solid var(--color-border, rgba(104,80,68,0.12));
          background: rgba(255,255,255,0.82);
          cursor: pointer;
          color: var(--color-text);
          transition: background 0.2s ease, transform 0.2s ease;
          flex-shrink: 0;
          -webkit-tap-highlight-color: transparent;
        }

        .menu-btn:hover {
          background: var(--color-bg-soft);
          transform: translateY(-1px);
        }

        .mobile-drawer {
          overflow: hidden;
          max-height: 0;
          opacity: 0;
          transition: max-height 0.28s ease, opacity 0.2s ease;
          border-top: 1px solid rgba(104, 80, 68, 0.08);
          background: rgba(255, 250, 247, 0.98);
        }

        .mobile-drawer.open {
          max-height: 560px;
          opacity: 1;
        }

        .mobile-drawer-inner {
          padding: 14px 0 22px;
          display: flex;
          flex-direction: column;
          gap: 0;
        }

        .mobile-nav-link {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 16px;
          padding: 14px 0;
          font-family: 'DM Sans', sans-serif;
          font-size: 14px;
          font-weight: 400;
          letter-spacing: 0.02em;
          color: var(--color-text);
          text-decoration: none;
          border-bottom: 1px solid rgba(104, 80, 68, 0.07);
          transition: color 0.2s ease, padding-left 0.2s ease;
        }

        .mobile-nav-link:hover,
        .mobile-nav-link.active {
          color: var(--color-primary);
          padding-left: 4px;
        }

        .mobile-cta {
          margin-top: 18px;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          gap: 6px;
          padding: 12px 20px;
          border-radius: 4px;
          background: var(--color-btn-primary, var(--color-primary));
          color: var(--color-btn-primary-text, var(--color-surface));
          font-family: 'DM Sans', sans-serif;
          font-size: 12px;
          font-weight: 500;
          letter-spacing: 0.08em;
          text-transform: uppercase;
          text-decoration: none;
          width: 100%;
          transition: opacity 0.2s ease;
        }

        .mobile-cta:hover {
          opacity: 0.9;
        }

        @media (max-width: 1199px) {
          .desktop-nav { gap: 18px; }
          .nav-link { font-size: 13px; }
          .cta-btn { padding: 10px 15px; font-size: 11.5px; }
          .logo-tagline { max-width: 128px; font-size: 11px; }
        }

        @media (max-width: 1031px) {
          .header-inner { min-height: 88px; }
          .header-inner.scrolled { min-height: 76px; }
          .logo-image { max-height: 78px; }
          .header-inner.scrolled .logo-image { max-height: 60px; }
          .logo-divider { height: 34px; }
          .logo-tagline { font-size: 10px; max-width: 110px; }
          .desktop-nav { gap: 14px; }
          .nav-link { font-size: 12.5px; }
        }

        @media (max-width: 930px) {
          .desktop-nav {
            display: none !important;
          }

          .menu-btn {
            display: flex;
          }

          .header-inner {
            min-height: 82px;
            gap: 12px;
          }

          .header-inner.scrolled {
            min-height: 72px;
          }

          .logo-wrap {
            gap: 12px;
            min-width: 0;
            flex: 1;
          }

          .logo-image {
            max-height: 78px;
          }

          .header-inner.scrolled .logo-image {
            max-height: 68px;
          }

          .logo-divider,
          .logo-tagline {
            display: none;
          }

          .header-glass,
          .header-glass.scrolled {
            backdrop-filter: none;
            -webkit-backdrop-filter: none;
            background: rgba(255, 250, 247, 0.98);
            box-shadow: none;
          }
        }

        @media (max-width: 480px) {
          .header-inner { min-height: 74px; }
          .header-inner.scrolled { min-height: 66px; }
          .logo-image { max-height: 52px; }
          .header-inner.scrolled .logo-image { max-height: 46px; }
          .menu-btn { width: 40px; height: 40px; }
          .mobile-drawer-inner { padding: 10px 0 18px; }
          .mobile-nav-link { padding: 13px 0; font-size: 13.5px; }
        }

        /* Extra optimization for home page on slower mobile devices */
        @media (max-width: 930px) {
          .header-root.home-mobile .header-topbar {
            display: none;
          }

          .header-root.home-mobile .header-glass,
          .header-root.home-mobile .header-glass.scrolled {
            background: #fffaf7;
            border-bottom: 1px solid rgba(104, 80, 68, 0.08);
          }
        }
      `}</style>

      <header className={`header-root${isHome ? " home-mobile" : ""}`}>
        <div className={`header-topbar${scrolled ? " hidden-bar" : ""}`} />

        <div className={`header-glass${scrolled ? " scrolled" : ""}`}>
          <Container>
            <div className={`header-inner${scrolled ? " scrolled" : ""}`}>
              <Link to="/" className="logo-wrap" onClick={() => setOpen(false)}>
                <img
                  src="/mobile-logo.svg"
                  alt="Dhanamitra Infotech LLP"
                  width="260"
                  height="78"
                  className="logo-image"
                  loading="eager"
                  decoding="async"
                />
                <div className="logo-divider" />
                <span className="logo-tagline">{siteConfig.siteTagline}</span>
              </Link>

              <nav className="desktop-nav">
                {siteConfig.navLinks.map((link, i) => (
                  <React.Fragment key={link.href}>
                    {i > 0 && <span className="nav-sep" />}
                    <Link
                      to={link.href}
                      className={`nav-link${location.pathname === link.href ? " active" : ""}`}
                    >
                      {link.label}
                    </Link>
                  </React.Fragment>
                ))}

                <div className="desktop-divider" />

                <Link to="/contact" className="cta-btn">
                  Get Consultation
                  <ChevronRightIcon size={13} className="cta-chevron" />
                </Link>
              </nav>

              <button
                className="menu-btn"
                onClick={() => setOpen((v) => !v)}
                aria-label="Toggle navigation"
                aria-expanded={open}
                type="button"
              >
                {open ? <XIcon size={18} strokeWidth={1.5} /> : <MenuIcon size={18} strokeWidth={1.5} />}
              </button>
            </div>
          </Container>

          <div className={`mobile-drawer${open ? " open" : ""}`}>
            <Container>
              <div className="mobile-drawer-inner">
                {siteConfig.navLinks.map((link) => (
                  <Link
                    key={link.href}
                    to={link.href}
                    className={`mobile-nav-link${location.pathname === link.href ? " active" : ""}`}
                    onClick={() => setOpen(false)}
                  >
                    {link.label}
                    <ChevronRightIcon
                      size={14}
                      strokeWidth={1.5}
                      style={{ opacity: 0.35 }}
                    />
                  </Link>
                ))}

                <Link
                  to="/contact"
                  className="mobile-cta"
                  onClick={() => setOpen(false)}
                >
                  Get Consultation
                  <ChevronRightIcon size={13} strokeWidth={1.5} />
                </Link>
              </div>
            </Container>
          </div>
        </div>
      </header>
    </>
  );
}