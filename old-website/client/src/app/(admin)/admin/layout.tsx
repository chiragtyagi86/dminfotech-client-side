"use client";

import { usePathname, useRouter } from "next/navigation";
import Link from "next/link";
import { useState } from "react";

const NAV = [
  {
    group: "Overview",
    items: [
      { label: "Dashboard", href: "/admin/dashboard", icon: "⊞" },
    ],
  },
  {
    group: "Content",
    items: [
      { label: "Blog Posts", href: "/admin/blog",      icon: "✦" },
      { label: "Services",   href: "/admin/services",  icon: "◈" },
      { label: "Portfolio",  href: "/admin/portfolio", icon: "◻" },
      { label: "Team",       href: "/admin/team",      icon: "✹" },
      {label: "Testimonials", href: "/admin/testimonials", icon: "✪" },
      {label: "Carrers", href: "/admin/careers", icon: "✷" },
      { label: "Pages",      href: "/admin/pages",     icon: "❐" },
    ],
  },
  {
    group: "Manage",
    items: [
      { label: "Leads",    href: "/admin/leads",    icon: "◎" },
      { label: "SEO",      href: "/admin/seo",      icon: "◉" },
      { label: "Settings", href: "/admin/settings", icon: "◌" },
    ],
  },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname   = usePathname();
  const router     = useRouter();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [loggingOut, setLoggingOut]   = useState(false);

  // Don't wrap the login page
  if (pathname === "/admin/login") return <>{children}</>;

  async function handleLogout() {
    setLoggingOut(true);
    await fetch("/api/admin/auth/logout", { method: "POST" });
    router.push("/admin/login");
  }

  const currentLabel =
    NAV.flatMap((g) => g.items)
      .find((i) => pathname.startsWith(i.href))?.label ?? "Admin";

  return (
    <div className="adm-root">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@300;400;600&family=DM+Sans:wght@300;400;500&display=swap');

        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

        .adm-root {
          display: flex;
          min-height: 100vh;
          background: #f5f0eb;
          font-family: 'DM Sans', sans-serif;
        }

        /* ── Sidebar ── */
        .adm-sidebar {
          width: 240px;
          flex-shrink: 0;
          background: #3a405a;
          display: flex;
          flex-direction: column;
          position: fixed;
          top: 0; left: 0; bottom: 0;
          z-index: 50;
          transition: transform 0.3s ease;
        }

        @media (max-width: 768px) {
          .adm-sidebar { transform: translateX(-100%); }
          .adm-sidebar.open { transform: translateX(0); }
        }

        .adm-sidebar-brand {
          padding: 24px 20px 20px;
          border-bottom: 1px solid rgba(249,222,201,0.08);
          flex-shrink: 0;
        }

        .adm-sidebar-logo {
          display: flex;
          align-items: center;
          gap: 10px;
          text-decoration: none;
        }

        .adm-sidebar-logo-icon {
          width: 34px; height: 34px;
          border-radius: 9px;
          background: rgba(249,222,201,0.12);
          border: 1px solid rgba(249,222,201,0.15);
          display: flex; align-items: center; justify-content: center;
          font-family: 'Cormorant Garamond', serif;
          font-size: 16px; font-weight: 600;
          color: #f9dec9;
        }

        .adm-sidebar-logo-text {
          font-family: 'Cormorant Garamond', serif;
          font-size: 17px; font-weight: 400;
          color: #f9dec9; line-height: 1.2;
        }

        .adm-sidebar-logo-sub {
          font-family: 'DM Sans', sans-serif;
          font-size: 9px; font-weight: 400;
          letter-spacing: 0.14em; text-transform: uppercase;
          color: rgba(249,222,201,0.40);
        }

        .adm-sidebar-nav {
          flex: 1; overflow-y: auto;
          padding: 16px 12px;
          display: flex; flex-direction: column; gap: 24px;
        }

        .adm-nav-group-label {
          font-size: 9px; font-weight: 500;
          letter-spacing: 0.20em; text-transform: uppercase;
          color: rgba(249,222,201,0.28);
          padding: 0 8px; margin-bottom: 4px;
        }

        .adm-nav-items {
          display: flex; flex-direction: column; gap: 2px;
        }

        .adm-nav-link {
          display: flex; align-items: center; gap: 10px;
          padding: 9px 10px;
          border-radius: 9px;
          text-decoration: none;
          font-size: 13px; font-weight: 400;
          color: rgba(249,222,201,0.60);
          transition: background 0.2s ease, color 0.2s ease;
          position: relative;
        }

        .adm-nav-link:hover {
          background: rgba(249,222,201,0.07);
          color: rgba(249,222,201,0.90);
        }

        .adm-nav-link.active {
          background: rgba(249,222,201,0.12);
          color: #f9dec9;
        }

        .adm-nav-link.active::before {
          content: '';
          position: absolute; left: 0; top: 25%; bottom: 25%;
          width: 2px; border-radius: 2px;
          background: linear-gradient(180deg, #99b2dd, #e9afa3);
        }

        .adm-nav-icon {
          font-size: 14px; width: 18px;
          text-align: center; flex-shrink: 0;
          opacity: 0.70;
        }

        .adm-nav-link.active .adm-nav-icon { opacity: 1; }

        .adm-sidebar-footer {
          padding: 16px 12px;
          border-top: 1px solid rgba(249,222,201,0.08);
          flex-shrink: 0;
        }

        .adm-logout-btn {
          width: 100%;
          display: flex; align-items: center; gap: 10px;
          padding: 9px 10px; border-radius: 9px;
          border: none; background: transparent; cursor: pointer;
          font-family: 'DM Sans', sans-serif;
          font-size: 13px; font-weight: 400;
          color: rgba(249,222,201,0.50);
          transition: background 0.2s ease, color 0.2s ease;
        }

        .adm-logout-btn:hover:not(:disabled) {
          background: rgba(233,175,163,0.12);
          color: #e9afa3;
        }

        .adm-logout-btn:disabled { opacity: 0.5; cursor: not-allowed; }

        /* ── Main ── */
        .adm-main {
          flex: 1;
          margin-left: 240px;
          display: flex; flex-direction: column;
          min-height: 100vh;
        }

        @media (max-width: 768px) { .adm-main { margin-left: 0; } }

        .adm-header {
          height: 56px; flex-shrink: 0;
          background: rgba(255,255,255,0.80);
          backdrop-filter: blur(12px);
          border-bottom: 1px solid rgba(104,80,68,0.09);
          display: flex; align-items: center;
          padding: 0 28px; gap: 16px;
          position: sticky; top: 0; z-index: 40;
        }

        .adm-header-menu-btn {
          display: none;
          background: none; border: none; cursor: pointer;
          font-size: 18px; color: #3a405a; padding: 4px;
        }

        @media (max-width: 768px) { .adm-header-menu-btn { display: block; } }

        .adm-header-title {
          font-size: 14px; font-weight: 500;
          color: #3a405a; flex: 1;
        }

        .adm-header-badge {
          font-size: 10px; font-weight: 500;
          letter-spacing: 0.12em; text-transform: uppercase;
          color: rgba(104,80,68,0.45);
          background: rgba(104,80,68,0.07);
          border: 1px solid rgba(104,80,68,0.10);
          padding: 3px 10px; border-radius: 100px;
        }

        .adm-content {
          flex: 1;
          padding: 32px 28px;
          max-width: 1200px;
          width: 100%;
        }

        .adm-overlay {
          display: none;
          position: fixed; inset: 0; z-index: 49;
          background: rgba(58,64,90,0.40);
          backdrop-filter: blur(2px);
        }

        @media (max-width: 768px) {
          .adm-overlay.open { display: block; }
        }
      `}</style>

      {/* Sidebar */}
      <aside className={`adm-sidebar ${sidebarOpen ? "open" : ""}`}>
        <div className="adm-sidebar-brand">
          <Link
            href="/admin/dashboard"
            className="adm-sidebar-logo"
            onClick={() => setSidebarOpen(false)}
          >
            <div className="adm-sidebar-logo-icon">D</div>
            <div>
              <div className="adm-sidebar-logo-text">Dhanamitra</div>
              <div className="adm-sidebar-logo-sub">CMS Panel</div>
            </div>
          </Link>
        </div>

        <nav className="adm-sidebar-nav">
          {NAV.map((group) => (
            <div key={group.group}>
              <p className="adm-nav-group-label">{group.group}</p>
              <div className="adm-nav-items">
                {group.items.map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={`adm-nav-link ${pathname.startsWith(item.href) ? "active" : ""}`}
                    onClick={() => setSidebarOpen(false)}
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
          >
            <span className="adm-nav-icon">↩</span>
            {loggingOut ? "Signing out…" : "Sign Out"}
          </button>
        </div>
      </aside>

      {/* Mobile overlay */}
      <div
        className={`adm-overlay ${sidebarOpen ? "open" : ""}`}
        onClick={() => setSidebarOpen(false)}
      />

      {/* Main */}
      <div className="adm-main">
        <header className="adm-header">
          <button
            className="adm-header-menu-btn"
            onClick={() => setSidebarOpen((v) => !v)}
            aria-label="Toggle sidebar"
          >
            ☰
          </button>
          <span className="adm-header-title">{currentLabel}</span>
          <span className="adm-header-badge">Admin</span>
        </header>

        <main className="adm-content">
          {children}
        </main>
      </div>
    </div>
  );
}