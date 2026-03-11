// src/admin/layout/index.jsx
// Main admin shell — sidebar + content area
// Takes {children} instead of <Outlet /> since we use ProtectedRoute pattern

import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { adminApi } from "../../lib/api";

const NAV = [
  {
    group: "Overview",
    items: [{ label: "Dashboard", href: "/admin", icon: "◈" }],
  },
  {
    group: "Content",
    items: [
      { label: "Pages", href: "/admin/pages", icon: "▤" },
      { label: "Blog", href: "/admin/blog", icon: "✦" },
      { label: "Portfolio", href: "/admin/portfolio", icon: "◉" },
      { label: "Services", href: "/admin/services", icon: "◎" },
    ],
  },
  {
    group: "Manage",
    items: [
      { label: "Leads", href: "/admin/leads", icon: "◆" },
      { label: "Careers", href: "/admin/careers", icon: "◇" },
      { label: "Team", href: "/admin/team", icon: "◑" },
      { label: "Testimonials", href: "/admin/testimonials", icon: "❝" },
      { label: "SEO", href: "/admin/seo", icon: "◐" },
      { label: "Settings", href: "/admin/settings", icon: "◍" },
    ],
  },
];

export default function AdminLayout({ children }) {
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [loggingOut, setLoggingOut] = useState(false);

  async function handleLogout() {
    try {
      setLoggingOut(true);
      await adminApi.logout();
    } catch (err) {
      console.error("Logout failed:", err);
    } finally {
      setLoggingOut(false);
      navigate("/admin/login", { replace: true });
    }
  }

  function isActive(href) {
    if (href === "/admin") return pathname === "/admin";
    return pathname.startsWith(href);
  }

  function getCurrentPathLabel() {
    const matched = NAV.flatMap((group) => group.items).find((item) =>
      isActive(item.href)
    );
    return matched?.label || "Dashboard";
  }

  return (
    <div className="adm-shell">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@300;400;600&family=DM+Sans:wght@300;400;500&display=swap');

        *, *::before, *::after { box-sizing: border-box; }

        .adm-shell {
          display: flex;
          min-height: 100vh;
          background: #f5f0eb;
          font-family: 'DM Sans', sans-serif;
        }

        /* ── Sidebar ── */
        .adm-sidebar {
          width: 240px;
          flex-shrink: 0;
          background: #ffffff;
          border-right: 1px solid rgba(104,80,68,0.09);
          display: flex;
          flex-direction: column;
          position: sticky;
          top: 0;
          height: 100vh;
          overflow-y: auto;
        }

        .adm-logo {
          padding: 24px 20px 20px;
          border-bottom: 1px solid rgba(104,80,68,0.07);
        }

        .adm-logo-text {
          font-family: 'Cormorant Garamond', serif;
          font-size: 20px;
          font-weight: 600;
          color: #3a405a;
          text-decoration: none;
          display: block;
        }

        .adm-logo-sub {
          font-family: 'DM Sans', sans-serif;
          font-size: 10px;
          font-weight: 400;
          letter-spacing: 0.14em;
          text-transform: uppercase;
          color: rgba(104,80,68,0.40);
          margin-top: 2px;
        }

        .adm-nav {
          flex: 1;
          padding: 16px 12px;
          display: flex;
          flex-direction: column;
          gap: 20px;
        }

        .adm-nav-group-label {
          font-size: 9px;
          font-weight: 500;
          letter-spacing: 0.18em;
          text-transform: uppercase;
          color: rgba(104,80,68,0.35);
          padding: 0 8px;
          margin-bottom: 4px;
        }

        .adm-nav-items {
          display: flex;
          flex-direction: column;
          gap: 2px;
        }

        .adm-nav-link {
          display: flex;
          align-items: center;
          gap: 10px;
          padding: 9px 10px;
          border-radius: 8px;
          font-family: 'DM Sans', sans-serif;
          font-size: 13px;
          font-weight: 400;
          color: rgba(104,80,68,0.60);
          text-decoration: none;
          transition: background 0.15s ease, color 0.15s ease;
        }

        .adm-nav-link:hover {
          background: rgba(104,80,68,0.05);
          color: #3a405a;
        }

        .adm-nav-link.active {
          background: rgba(58,64,90,0.08);
          color: #3a405a;
          font-weight: 500;
        }

        .adm-nav-icon {
          font-size: 14px;
          width: 18px;
          text-align: center;
          opacity: 0.7;
        }

        .adm-sidebar-footer {
          padding: 16px 12px;
          border-top: 1px solid rgba(104,80,68,0.07);
        }

        .adm-logout-btn {
          width: 100%;
          padding: 9px 10px;
          border-radius: 8px;
          border: none;
          background: none;
          font-family: 'DM Sans', sans-serif;
          font-size: 12px;
          font-weight: 400;
          color: rgba(104,80,68,0.50);
          cursor: pointer;
          text-align: left;
          display: flex;
          align-items: center;
          gap: 8px;
          transition: background 0.15s ease, color 0.15s ease;
        }

        .adm-logout-btn:hover:not(:disabled) {
          background: rgba(192,57,43,0.06);
          color: #c0392b;
        }

        .adm-logout-btn:disabled {
          opacity: 0.6;
          cursor: not-allowed;
        }

        /* ── Main content ── */
        .adm-main {
          flex: 1;
          display: flex;
          flex-direction: column;
          min-width: 0;
        }

        .adm-topbar {
          height: 56px;
          background: #ffffff;
          border-bottom: 1px solid rgba(104,80,68,0.09);
          display: flex;
          align-items: center;
          padding: 0 24px;
          gap: 12px;
          position: sticky;
          top: 0;
          z-index: 10;
        }

        .adm-mobile-toggle {
          display: none;
          background: none;
          border: none;
          font-size: 20px;
          cursor: pointer;
          color: #3a405a;
          padding: 4px;
        }

        .adm-topbar-title {
          font-family: 'DM Sans', sans-serif;
          font-size: 12px;
          font-weight: 400;
          color: rgba(104,80,68,0.45);
          letter-spacing: 0.05em;
        }

        .adm-topbar-path {
          font-weight: 500;
          color: #3a405a;
        }

        .adm-content {
          flex: 1;
          padding: 32px 28px;
          overflow-y: auto;
        }

        /* ── Mobile ── */
        @media (max-width: 768px) {
          .adm-sidebar {
            position: fixed;
            left: 0; top: 0; bottom: 0;
            z-index: 100;
            transform: translateX(-100%);
            transition: transform 0.25s ease;
          }

          .adm-sidebar.open {
            transform: translateX(0);
            box-shadow: 4px 0 24px rgba(0,0,0,0.12);
          }

          .adm-mobile-toggle { display: block; }

          .adm-content { padding: 20px 16px; }
        }

        .adm-mobile-overlay {
          display: none;
          position: fixed;
          inset: 0;
          background: rgba(0,0,0,0.35);
          z-index: 99;
        }

        .adm-mobile-overlay.open { display: block; }
      `}</style>

      <aside className={`adm-sidebar ${mobileOpen ? "open" : ""}`}>
        <div className="adm-logo">
          <Link to="/admin" className="adm-logo-text" onClick={() => setMobileOpen(false)}>
            Dhanamitra
          </Link>
          <p className="adm-logo-sub">Admin Panel</p>
        </div>

        <nav className="adm-nav">
          {NAV.map((group) => (
            <div key={group.group}>
              <p className="adm-nav-group-label">{group.group}</p>
              <div className="adm-nav-items">
                {group.items.map((item) => (
                  <Link
                    key={item.href}
                    to={item.href}
                    className={`adm-nav-link ${isActive(item.href) ? "active" : ""}`}
                    onClick={() => setMobileOpen(false)}
                  >
                    <span className="adm-nav-icon">{item.icon}</span>
                    {item.label}
                  </Link>
                ))}
              </div>
            </div>
          ))}
        </nav>

        <div className="adm-sidebar-footer">
          <button
            className="adm-logout-btn"
            onClick={handleLogout}
            disabled={loggingOut}
            type="button"
          >
            ⎋ &nbsp;{loggingOut ? "Logging out..." : "Log out"}
          </button>
        </div>
      </aside>

      <div
        className={`adm-mobile-overlay ${mobileOpen ? "open" : ""}`}
        onClick={() => setMobileOpen(false)}
      />

      <div className="adm-main">
        <header className="adm-topbar">
          <button
            className="adm-mobile-toggle"
            onClick={() => setMobileOpen(true)}
            type="button"
          >
            ☰
          </button>
          <span className="adm-topbar-title">
            Admin &nbsp;/&nbsp;
            <span className="adm-topbar-path">{getCurrentPathLabel()}</span>
          </span>
        </header>

        <main className="adm-content">{children}</main>
      </div>
    </div>
  );
}