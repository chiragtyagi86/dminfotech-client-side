import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { adminApi } from "../../lib/api";

const QUICK_ACTIONS = [
  { label: "New Blog Post", href: "/admin/blog/new", icon: "✦" },
  { label: "New Project", href: "/admin/portfolio/new", icon: "◉" },
  { label: "New Service", href: "/admin/services/new", icon: "◎" },
  { label: "New Job", href: "/admin/careers/new", icon: "◇" },
];

export default function DashboardPage() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    adminApi
      .getDashboard()
      .then((d) => setStats(d.data ?? d))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const cards = [
    { label: "Pages", key: "pages" },
    { label: "Blog Posts", key: "blogPosts" },
    { label: "Draft Posts", key: "draftPosts" },
    { label: "Leads", key: "leads" },
    { label: "New Leads", key: "newLeads" },
    { label: "Team Members", key: "teamMembers" },
  ];

  return (
    <div className="dash-root">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@300;400;600&family=DM+Sans:wght@300;400;500&display=swap');
        .dash-root { display:flex; flex-direction:column; gap:32px; animation:dashFade 0.4s ease both; }
        @keyframes dashFade { from{opacity:0;transform:translateY(8px)} to{opacity:1;transform:translateY(0)} }

        .dash-heading { font-family:'Cormorant Garamond',serif; font-size:34px; font-weight:300; color:#3a405a; margin:0; }
        .dash-sub     { font-family:'DM Sans',sans-serif; font-size:13px; font-weight:300; color:rgba(104,80,68,0.50); margin:4px 0 0; }

        .dash-stats { display:grid; grid-template-columns:repeat(auto-fill,minmax(180px,1fr)); gap:16px; }

        .stat-card {
          background:#ffffff; border:1px solid rgba(104,80,68,0.09); border-radius:14px;
          padding:20px 22px; display:flex; flex-direction:column; gap:6px;
        }
        .stat-label { font-family:'DM Sans',sans-serif; font-size:10px; font-weight:500; letter-spacing:0.14em; text-transform:uppercase; color:rgba(104,80,68,0.42); }
        .stat-value { font-family:'Cormorant Garamond',serif; font-size:36px; font-weight:300; color:#3a405a; line-height:1; }
        .stat-skel  { height:36px; border-radius:6px; background:rgba(104,80,68,0.07); animation:pulse 1.4s ease infinite alternate; }
        @keyframes pulse { from{opacity:0.5} to{opacity:1} }

        .dash-section-title { font-family:'DM Sans',sans-serif; font-size:10px; font-weight:500; letter-spacing:0.16em; text-transform:uppercase; color:rgba(104,80,68,0.40); margin:0 0 12px; }

        .quick-grid { display:grid; grid-template-columns:repeat(auto-fill,minmax(160px,1fr)); gap:12px; }
        .quick-card {
          display:flex; flex-direction:column; align-items:center; justify-content:center; gap:10px;
          padding:24px 16px; border-radius:14px; border:1px solid rgba(104,80,68,0.09);
          background:#ffffff; text-decoration:none;
          transition:transform 0.2s ease, box-shadow 0.2s ease;
        }
        .quick-card:hover { transform:translateY(-2px); box-shadow:0 8px 24px rgba(58,64,90,0.08); }
        .quick-icon  { font-size:22px; color:#3a405a; }
        .quick-label { font-family:'DM Sans',sans-serif; font-size:12px; font-weight:400; color:#3a405a; text-align:center; }
      `}</style>

      <div>
        <h1 className="dash-heading">Dashboard</h1>
        <p className="dash-sub">Welcome back to Dhanamitra admin.</p>
      </div>

      <div>
        <p className="dash-section-title">Overview</p>
        <div className="dash-stats">
          {cards.map(({ label, key }) => (
            <div className="stat-card" key={key}>
              <span className="stat-label">{label}</span>
              {loading ? (
                <div className="stat-skel" />
              ) : (
                <span className="stat-value">{stats?.[key] ?? "—"}</span>
              )}
            </div>
          ))}
        </div>
      </div>

      <div>
        <p className="dash-section-title">Quick Actions</p>
        <div className="quick-grid">
          {QUICK_ACTIONS.map((a) => (
            <Link key={a.href} to={a.href} className="quick-card">
              <span className="quick-icon">{a.icon}</span>
              <span className="quick-label">{a.label}</span>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}