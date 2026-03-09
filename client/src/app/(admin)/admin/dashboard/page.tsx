// app/admin/page.tsx
// ─────────────────────────────────────────────────────────────────────────────
// Admin Dashboard — displays real-time stats from database
// Shows counts for pages, blog posts, leads, etc.
// Quick action links for common tasks
// ─────────────────────────────────────────────────────────────────────────────

'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

interface DashboardStats {
  pages: number;
  blogPosts: number;
  draftPosts: number;
  leads: number;
  newLeads: number;
  teamMembers: number;
}

const quickActions = [
  { label: 'New Blog Post', href: '/admin/blog', icon: '✒', color: '#99b2dd' },
  { label: 'New Page', href: '/admin/pages', icon: '📄', color: '#e9afa3' },
  { label: 'View Leads', href: '/admin/leads', icon: '📨', color: '#c8d8a8' },
  { label: 'SEO Settings', href: '/admin/seo', icon: '🔍', color: '#f0b96e' },
  { label: 'Site Settings', href: '/admin/settings', icon: '⚙', color: '#99b2dd' },
  { label: 'Team Members', href: '/admin/team', icon: '👥', color: '#e9afa3' },
];

export default function DashboardPage() {
  const [stats, setStats] = useState<DashboardStats>({
    pages: 0,
    blogPosts: 0,
    draftPosts: 0,
    leads: 0,
    newLeads: 0,
    teamMembers: 0,
  });

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchStats();
  }, []);

  async function fetchStats() {
    try {
      setLoading(true);
      const res = await fetch('/api/admin/dashboard');
      const json = await res.json();

      if (json.data) {
        setStats(json.data);
      }
    } catch (err) {
      console.error('Failed to fetch dashboard stats:', err);
      setError('Failed to load stats');
    } finally {
      setLoading(false);
    }
  }

  const statCards = [
    {
      label: 'Pages',
      value: stats.pages,
      sub: 'Total pages',
      color: '#99b2dd',
      href: '/admin/pages',
    },
    {
      label: 'Blog Posts',
      value: stats.blogPosts,
      sub: `${stats.draftPosts} draft${stats.draftPosts !== 1 ? 's' : ''}`,
      color: '#e9afa3',
      href: '/admin/blog',
    },
    {
      label: 'Contact Leads',
      value: stats.leads,
      sub: `${stats.newLeads} new`,
      color: '#c8d8a8',
      href: '/admin/leads',
    },
    {
      label: 'Team Members',
      value: stats.teamMembers,
      sub: 'Active members',
      color: '#f0b96e',
      href: '/admin/team',
    },
  ];

  return (
    <div className="dashboard-root">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@300;400;600&family=DM+Sans:wght@300;400;500&display=swap');

        .dashboard-root {
          display: flex;
          flex-direction: column;
          gap: 32px;
          animation: dashFade 0.5s ease both;
        }

        @keyframes dashFade {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }

        .dash-header {
          display: flex;
          flex-direction: column;
          gap: 4px;
        }

        .dash-title {
          font-family: 'Cormorant Garamond', serif;
          font-size: 32px;
          font-weight: 400;
          color: #3a405a;
          margin: 0;
        }

        .dash-subtitle {
          font-family: 'DM Sans', sans-serif;
          font-size: 14px;
          font-weight: 300;
          color: #685044;
          margin: 0;
        }

        .dash-stats-grid {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 14px;
        }

        @media (min-width: 768px) {
          .dash-stats-grid {
            grid-template-columns: repeat(4, 1fr);
          }
        }

        .dash-stat-card {
          background: #ffffff;
          border: 1px solid rgba(104,80,68,0.09);
          border-radius: 16px;
          padding: 20px 18px;
          text-decoration: none;
          display: flex;
          flex-direction: column;
          gap: 8px;
          transition: transform 0.25s ease, box-shadow 0.25s ease;
          cursor: pointer;
        }

        .dash-stat-card:hover {
          transform: translateY(-3px);
          box-shadow: 0 12px 32px rgba(58,64,90,0.08);
        }

        .dash-stat-dot {
          width: 8px;
          height: 8px;
          border-radius: 50%;
          margin-bottom: 4px;
        }

        .dash-stat-value {
          font-family: 'Cormorant Garamond', serif;
          font-size: 38px;
          font-weight: 300;
          line-height: 1;
          color: #3a405a;
        }

        .dash-stat-label {
          font-family: 'DM Sans', sans-serif;
          font-size: 12px;
          font-weight: 500;
          color: #3a405a;
        }

        .dash-stat-sub {
          font-family: 'DM Sans', sans-serif;
          font-size: 11px;
          font-weight: 300;
          color: #685044;
        }

        .dash-section-label {
          font-family: 'DM Sans', sans-serif;
          font-size: 10px;
          font-weight: 500;
          letter-spacing: 0.20em;
          text-transform: uppercase;
          color: rgba(104,80,68,0.45);
          margin: 0;
        }

        .dash-actions-grid {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 10px;
        }

        @media (min-width: 768px) {
          .dash-actions-grid {
            grid-template-columns: repeat(3, 1fr);
          }
        }

        .dash-action-card {
          background: #ffffff;
          border: 1px solid rgba(104,80,68,0.09);
          border-radius: 14px;
          padding: 14px 16px;
          text-decoration: none;
          display: flex;
          align-items: center;
          gap: 12px;
          font-family: 'DM Sans', sans-serif;
          font-size: 13px;
          font-weight: 400;
          color: #3a405a;
          transition: background 0.2s ease, transform 0.2s ease;
        }

        .dash-action-card:hover {
          background: #fdf3eb;
          transform: translateX(3px);
        }

        .dash-action-icon {
          width: 32px;
          height: 32px;
          border-radius: 8px;
          background: rgba(58,64,90,0.06);
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 14px;
          flex-shrink: 0;
          color: #3a405a;
        }

        .dash-action-arrow {
          margin-left: auto;
          font-size: 11px;
          color: rgba(104,80,68,0.30);
          transition: color 0.2s ease, margin-left 0.2s ease;
        }

        .dash-action-card:hover .dash-action-arrow {
          color: #3a405a;
          margin-left: calc(100% + 4px);
        }

        .dash-card {
          background: #ffffff;
          border: 1px solid rgba(104,80,68,0.09);
          border-radius: 16px;
          padding: 24px;
        }

        .dash-card-title {
          font-family: 'Cormorant Garamond', serif;
          font-size: 18px;
          font-weight: 600;
          color: #3a405a;
          margin: 0 0 16px 0;
          padding-bottom: 12px;
          border-bottom: 1px solid rgba(104,80,68,0.07);
        }

        .dash-empty {
          font-family: 'DM Sans', sans-serif;
          font-size: 13px;
          font-weight: 300;
          color: rgba(104,80,68,0.45);
          text-align: center;
          padding: 24px 0;
        }

        .dash-loading {
          text-align: center;
          padding: 40px;
          color: #685044;
        }

        .dash-error {
          background: #fef2f2;
          border: 1px solid rgba(220,38,38,0.2);
          color: #c0392b;
          padding: 16px;
          border-radius: 10px;
          font-size: 13px;
        }
      `}</style>

      {/* Header */}
      <div className="dash-header">
        <h1 className="dash-title">Dashboard</h1>
        <p className="dash-subtitle">Welcome to your admin panel. Here's your website overview.</p>
      </div>

      {/* Error State */}
      {error && (
        <div className="dash-error">
          ⚠️ {error}
        </div>
      )}

      {/* Stats Grid */}
      {loading ? (
        <div className="dash-loading">Loading statistics...</div>
      ) : (
        <>
          <div className="dash-stats-grid">
            {statCards.map((card) => (
              <Link key={card.label} href={card.href} className="dash-stat-card">
                <div className="dash-stat-dot" style={{ background: card.color }} />
                <div className="dash-stat-value">{card.value}</div>
                <div className="dash-stat-label">{card.label}</div>
                <div className="dash-stat-sub">{card.sub}</div>
              </Link>
            ))}
          </div>

          {/* Quick Actions */}
          <p className="dash-section-label">Quick Actions</p>
          <div className="dash-actions-grid">
            {quickActions.map((action) => (
              <Link key={action.href} href={action.href} className="dash-action-card">
                <div className="dash-action-icon">{action.icon}</div>
                <span>{action.label}</span>
                <span className="dash-action-arrow">→</span>
              </Link>
            ))}
          </div>

          {/* Recent Activity Placeholder */}
          <div className="dash-card">
            <h2 className="dash-card-title">Recent Activity</h2>
            <p className="dash-empty">
              Activity log will appear here. Create, edit, or update your content to see activity.
            </p>
          </div>
        </>
      )}
    </div>
  );
}