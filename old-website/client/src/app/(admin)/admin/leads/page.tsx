// app/admin/leads/page.tsx
// ─────────────────────────────────────────────────────────────────────────────
// Leads Management — view, manage, and respond to contact form submissions
// Database-driven with status tracking and filtering
// ─────────────────────────────────────────────────────────────────────────────

'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

interface Lead {
  id: number;
  name: string;
  email: string;
  phone?: string;
  message: string;
  sourcePage?: string;
  inquiryType?: string;
  status: 'new' | 'contacted' | 'closed';
  ipAddress?: string;
  submittedAt: string;
  views: number;
  lastViewedAt?: string;
}

const STATUS_STYLES = {
  new: { background: '#dbeafe', color: '#1d4ed8', label: 'New' },
  contacted: { background: '#dcfce7', color: '#15803d', label: 'Contacted' },
  closed: { background: '#f3f4f6', color: '#6b7280', label: 'Closed' },
};

const formatDate = (iso: string) => {
  const d = new Date(iso);
  return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
};

const formatTime = (iso: string) => {
  const d = new Date(iso);
  return d.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
};

export default function LeadsPage() {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [loading, setLoading] = useState(true);
  const [viewingId, setViewingId] = useState<number | null>(null);
  const [filterStatus, setFilterStatus] = useState<'all' | 'new' | 'contacted' | 'closed'>('all');
  const [search, setSearch] = useState('');
  const [deleteConfirm, setDeleteConfirm] = useState<number | null>(null);

  useEffect(() => {
    fetchLeads();
  }, [filterStatus, search]);

  async function fetchLeads() {
    try {
      setLoading(true);
      const params = new URLSearchParams();
      if (filterStatus !== 'all') params.append('status', filterStatus);
      if (search) params.append('search', search);

      const res = await fetch(`/api/admin/leads?${params.toString()}`);
      const json = await res.json();
      setLeads(json.data || []);
    } catch (err) {
      console.error('Failed to fetch leads:', err);
    } finally {
      setLoading(false);
    }
  }

  const viewingLead = leads.find(l => l.id === viewingId);

  async function updateStatus(id: number, status: 'new' | 'contacted' | 'closed') {
    try {
      const res = await fetch(`/api/admin/leads/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status }),
      });

      if (res.ok) {
        setLeads(leads.map(l => l.id === id ? { ...l, status } : l));
      }
    } catch (err) {
      console.error('Failed to update status:', err);
    }
  }

  async function deleteLead(id: number) {
    try {
      const res = await fetch(`/api/admin/leads/${id}`, { method: 'DELETE' });

      if (res.ok) {
        setLeads(leads.filter(l => l.id !== id));
        if (viewingId === id) setViewingId(null);
        setDeleteConfirm(null);
      }
    } catch (err) {
      console.error('Failed to delete lead:', err);
    }
  }

  const filtered = leads;

  const counts = {
    all: leads.length,
    new: leads.filter(l => l.status === 'new').length,
    contacted: leads.filter(l => l.status === 'contacted').length,
    closed: leads.filter(l => l.status === 'closed').length,
  };

  return (
    <div className="leads-page">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@300;400;600&family=DM+Sans:wght@300;400;500&display=swap');

        .leads-page {
          max-width: 1200px;
          margin: 0 auto;
          padding: 40px 24px 80px;
          font-family: 'DM Sans', sans-serif;
          color: #3a405a;
        }

        .page-header {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          margin-bottom: 28px;
          flex-wrap: wrap;
          gap: 16px;
        }

        .breadcrumb {
          font-size: 12px;
          color: #685044;
          margin-bottom: 6px;
          opacity: 0.7;
        }

        .page-title {
          font-family: 'Cormorant Garamond', serif;
          font-size: 28px;
          font-weight: 600;
          color: #3a405a;
          margin: 0;
        }

        .page-subtitle {
          margin: 4px 0 0;
          color: #685044;
          font-size: 14px;
          font-weight: 300;
        }

        .stats-badges {
          display: flex;
          gap: 10px;
          flex-wrap: wrap;
        }

        .stat-badge {
          background: #f0f2f7;
          border-radius: 12px;
          padding: 10px 18px;
          text-align: center;
        }

        .stat-value {
          font-size: 22px;
          font-weight: 800;
          color: #3a405a;
        }

        .stat-label {
          font-size: 11px;
          color: #685044;
          opacity: 0.75;
          font-weight: 600;
          letter-spacing: 0.5px;
          margin-top: 2px;
        }

        .filter-row {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 20px;
          flex-wrap: wrap;
          gap: 12px;
        }

        .tab-bar {
          display: flex;
          gap: 8px;
          flex-wrap: wrap;
        }

        .tab-btn {
          padding: 8px 18px;
          border-radius: 999px;
          border: 1.5px solid rgba(104,80,68,0.18);
          background: #ffffff;
          color: #685044;
          font-weight: 500;
          font-size: 13px;
          cursor: pointer;
          font-family: 'DM Sans', sans-serif;
          transition: all 0.2s;
        }

        .tab-btn.active {
          border-color: #3a405a;
          background: #3a405a;
          color: #f9dec9;
          font-weight: 700;
        }

        .tab-btn:hover:not(.active) {
          border-color: #3a405a;
        }

        .search-input {
          padding: 9px 14px;
          border-radius: 10px;
          border: 1.5px solid rgba(104,80,68,0.18);
          background: #fff;
          color: #3a405a;
          font-size: 13px;
          outline: none;
          width: 260px;
          font-family: 'DM Sans', sans-serif;
          transition: border-color 0.2s;
        }

        .search-input:focus {
          border-color: #3a405a;
        }

        .card {
          background: #ffffff;
          border-radius: 18px;
          box-shadow: 0 12px 40px rgba(58,64,90,0.08);
          border: 1px solid rgba(104,80,68,0.12);
          overflow: hidden;
        }

        .empty-state {
          padding: 60px 20px;
          text-align: center;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 12px;
        }

        .empty-icon {
          width: 52px;
          height: 52px;
          border-radius: 50%;
          background: #fdf3eb;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 22px;
        }

        .empty-text {
          color: #685044;
          margin: 0;
        }

        table {
          width: 100%;
          border-collapse: collapse;
          font-size: 14px;
        }

        thead {
          background: #fdf3eb;
        }

        th {
          text-align: left;
          padding: 12px 16px;
          border-bottom: 2px solid rgba(104,80,68,0.1);
          font-size: 11px;
          font-weight: 700;
          letter-spacing: 1px;
          text-transform: uppercase;
          color: #685044;
        }

        tr {
          border-bottom: 1px solid rgba(104,80,68,0.07);
        }

        tr:hover {
          background: #fdf3eb;
        }

        td {
          padding: 14px 16px;
          vertical-align: top;
          color: #3a405a;
        }

        .name-col {
          font-weight: 600;
        }

        .email-col {
          font-size: 12px;
          color: #685044;
          margin-top: 2px;
        }

        .phone-col {
          font-size: 11px;
          color: #685044;
          opacity: 0.6;
        }

        .message-preview {
          max-width: 260px;
          font-size: 13px;
          color: #685044;
          line-height: 1.5;
          overflow: hidden;
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
        }

        .inquiry-tag {
          background: #f0f2f7;
          color: #3a405a;
          font-size: 11px;
          font-weight: 600;
          padding: 2px 8px;
          border-radius: 6px;
          display: inline-block;
          margin-top: 6px;
        }

        .code {
          background: #fdf3eb;
          padding: 3px 8px;
          border-radius: 6px;
          font-size: 12px;
          color: #685044;
          font-family: monospace;
        }

        .status-badge {
          padding: 4px 10px;
          border-radius: 999px;
          font-size: 11px;
          font-weight: 700;
          display: inline-block;
        }

        .date-col {
          font-size: 13px;
          font-weight: 500;
        }

        .time-col {
          font-size: 11px;
          color: #685044;
          opacity: 0.65;
        }

        .actions {
          display: flex;
          gap: 8px;
          align-items: center;
        }

        .view-btn {
          background: #3a405a;
          color: #f9dec9;
          border: none;
          border-radius: 8px;
          padding: 6px 14px;
          font-size: 12px;
          font-weight: 600;
          cursor: pointer;
          font-family: 'DM Sans', sans-serif;
          transition: all 0.2s;
        }

        .view-btn:hover {
          transform: translateY(-1px);
          box-shadow: 0 4px 12px rgba(58,64,90,0.2);
        }

        .delete-btn {
          background: none;
          border: 1.5px solid rgba(233,175,163,0.5);
          color: #e9afa3;
          border-radius: 8px;
          padding: 6px 10px;
          font-size: 12px;
          cursor: pointer;
          font-family: 'DM Sans', sans-serif;
          transition: all 0.2s;
        }

        .delete-btn:hover {
          border-color: #e9afa3;
          background: rgba(233,175,163,0.1);
        }

        .overlay {
          position: fixed;
          inset: 0;
          background: rgba(58,64,90,0.45);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 1000;
          padding: 20px;
        }

        .modal {
          background: #fff;
          border-radius: 20px;
          width: 100%;
          max-width: 580px;
          max-height: 90vh;
          display: flex;
          flex-direction: column;
          box-shadow: 0 30px 80px rgba(58,64,90,0.2);
          overflow: hidden;
        }

        .modal-header {
          padding: 24px 28px 18px;
          border-bottom: 1px solid rgba(104,80,68,0.1);
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
        }

        .modal-title {
          font-size: 20px;
          font-weight: 700;
          color: #3a405a;
          margin: 0 0 4px;
        }

        .modal-email {
          font-size: 13px;
          color: #99b2dd;
        }

        .close-btn {
          background: none;
          border: none;
          font-size: 18px;
          cursor: pointer;
          color: #685044;
          padding: 4px;
        }

        .modal-body {
          padding: 24px 28px;
          overflow-y: auto;
          flex: 1;
        }

        .meta-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 16px 20px;
          background: #fdf3eb;
          padding: 20px;
          border-radius: 12px;
          margin-bottom: 20px;
        }

        @media (max-width: 768px) {
          .meta-grid {
            grid-template-columns: 1fr;
          }
        }

        .meta-label {
          font-size: 11px;
          font-weight: 700;
          letter-spacing: 1px;
          text-transform: uppercase;
          color: #685044;
          margin-bottom: 5px;
        }

        .meta-value {
          font-size: 13px;
          color: #3a405a;
          font-weight: 500;
        }

        .section-label {
          font-size: 11px;
          font-weight: 700;
          letter-spacing: 1.4px;
          text-transform: uppercase;
          color: #685044;
          margin-bottom: 12px;
          padding-bottom: 8px;
          border-bottom: 1px solid rgba(104,80,68,0.1);
        }

        .message-box {
          background: #fdf3eb;
          border-radius: 12px;
          padding: 16px 20px;
          font-size: 14px;
          line-height: 1.7;
          color: #3a405a;
          white-space: pre-wrap;
          margin-bottom: 20px;
        }

        .status-actions {
          display: flex;
          gap: 10px;
          flex-wrap: wrap;
          margin-bottom: 20px;
        }

        .status-action-btn {
          padding: 9px 20px;
          border-radius: 10px;
          font-size: 13px;
          font-weight: 600;
          cursor: pointer;
          border: 1.5px solid;
          font-family: 'DM Sans', sans-serif;
          transition: all 0.2s;
        }

        .modal-footer {
          padding: 16px 28px;
          border-top: 1px solid rgba(104,80,68,0.1);
          display: flex;
          justify-content: space-between;
          gap: 12px;
        }

        .delete-action-btn {
          background: #fef2f2;
          color: #dc2626;
          border: 1.5px solid rgba(220,38,38,0.2);
          border-radius: 10px;
          padding: 10px 20px;
          font-size: 13px;
          font-weight: 600;
          cursor: pointer;
          font-family: 'DM Sans', sans-serif;
          transition: all 0.2s;
        }

        .delete-action-btn:hover {
          background: #fee2e2;
        }

        .reply-btn {
          background: #3a405a;
          color: #f9dec9;
          border: none;
          border-radius: 10px;
          padding: 10px 22px;
          font-size: 13px;
          font-weight: 700;
          cursor: pointer;
          text-decoration: none;
          display: inline-flex;
          align-items: center;
          font-family: 'DM Sans', sans-serif;
          transition: all 0.2s;
        }

        .reply-btn:hover {
          transform: translateY(-1px);
          box-shadow: 0 4px 12px rgba(58,64,90,0.2);
        }

        .confirm-modal {
          max-width: 400px;
          padding: 0;
        }

        .confirm-content {
          padding: 32px 28px;
          text-align: center;
        }

        .confirm-icon {
          width: 56px;
          height: 56px;
          border-radius: 50%;
          background: #fef2f2;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 24px;
          margin: 0 auto;
        }

        .confirm-title {
          margin: 16px 0 8px;
          color: #3a405a;
          font-weight: 700;
          font-family: 'Cormorant Garamond', serif;
          font-size: 18px;
        }

        .confirm-text {
          color: #685044;
          font-size: 14px;
          margin: 0;
        }

        .confirm-actions {
          padding: 0 28px 28px;
          display: flex;
          gap: 12px;
        }

        .cancel-btn {
          background: none;
          border: 1.5px solid rgba(104,80,68,0.25);
          color: #685044;
          border-radius: 10px;
          padding: 10px 0;
          font-size: 14px;
          font-weight: 600;
          cursor: pointer;
          font-family: 'DM Sans', sans-serif;
          flex: 1;
        }

        .cancel-btn:hover {
          background: rgba(104,80,68,0.05);
        }

        .loading {
          text-align: center;
          padding: 40px;
          color: #685044;
        }
      `}</style>

      {/* Header */}
      <div className="page-header">
        <div>
          <div className="breadcrumb">Admin / Leads Management</div>
          <h1 className="page-title">Leads</h1>
          <p className="page-subtitle">Manage inquiries submitted through your contact form.</p>
        </div>
        <div className="stats-badges">
          <div className="stat-badge">
            <div className="stat-value">{counts.all}</div>
            <div className="stat-label">Total</div>
          </div>
          <div className="stat-badge" style={{ color: '#1d4ed8' }}>
            <div className="stat-value" style={{ color: '#1d4ed8' }}>{counts.new}</div>
            <div className="stat-label" style={{ color: '#1d4ed8' }}>New</div>
          </div>
          <div className="stat-badge" style={{ color: '#15803d' }}>
            <div className="stat-value" style={{ color: '#15803d' }}>{counts.contacted}</div>
            <div className="stat-label" style={{ color: '#15803d' }}>Contacted</div>
          </div>
          <div className="stat-badge" style={{ color: '#6b7280' }}>
            <div className="stat-value" style={{ color: '#6b7280' }}>{counts.closed}</div>
            <div className="stat-label" style={{ color: '#6b7280' }}>Closed</div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="filter-row">
        <div className="tab-bar">
          {(['all', 'new', 'contacted', 'closed'] as const).map(s => (
            <button
              key={s}
              onClick={() => setFilterStatus(s)}
              className={`tab-btn ${filterStatus === s ? 'active' : ''}`}
            >
              {s.charAt(0).toUpperCase() + s.slice(1)} <span style={{ marginLeft: 5, opacity: 0.7 }}>({counts[s]})</span>
            </button>
          ))}
        </div>
        <input
          type="text"
          placeholder="Search name, email, message…"
          value={search}
          onChange={e => setSearch(e.target.value)}
          className="search-input"
        />
      </div>

      {/* Table */}
      <div className="card">
        {loading ? (
          <div className="loading">Loading leads...</div>
        ) : filtered.length === 0 ? (
          <div className="empty-state">
            <div className="empty-icon">✉</div>
            <p className="empty-text">No leads found.</p>
          </div>
        ) : (
          <div style={{ overflowX: 'auto' }}>
            <table>
              <thead>
                <tr>
                  <th>Name & Email</th>
                  <th>Message Preview</th>
                  <th>Source</th>
                  <th>Date</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map(lead => (
                  <tr key={lead.id}>
                    <td>
                      <div className="name-col">{lead.name}</div>
                      <div className="email-col">{lead.email}</div>
                      {lead.phone && <div className="phone-col">{lead.phone}</div>}
                    </td>
                    <td>
                      <div className="message-preview">{lead.message}</div>
                      {lead.inquiryType && <span className="inquiry-tag">{lead.inquiryType}</span>}
                    </td>
                    <td><code className="code">{lead.sourcePage || '—'}</code></td>
                    <td>
                      <div className="date-col">{formatDate(lead.submittedAt)}</div>
                      <div className="time-col">{formatTime(lead.submittedAt)}</div>
                    </td>
                    <td>
                      <span className="status-badge" style={STATUS_STYLES[lead.status]}>
                        {STATUS_STYLES[lead.status].label}
                      </span>
                    </td>
                    <td>
                      <div className="actions">
                        <button onClick={() => setViewingId(lead.id)} className="view-btn">View</button>
                        <button onClick={() => setDeleteConfirm(lead.id)} className="delete-btn">✕</button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* View Modal */}
      {viewingLead && (
        <div className="overlay" onClick={() => setViewingId(null)}>
          <div className="modal" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <div>
                <h2 className="modal-title">{viewingLead.name}</h2>
                <a href={`mailto:${viewingLead.email}`} className="modal-email">{viewingLead.email}</a>
              </div>
              <button onClick={() => setViewingId(null)} className="close-btn">✕</button>
            </div>

            <div className="modal-body">
              {/* Meta Grid */}
              <div className="meta-grid">
                <div>
                  <div className="meta-label">Phone</div>
                  <div className="meta-value">{viewingLead.phone || '—'}</div>
                </div>
                <div>
                  <div className="meta-label">Source Page</div>
                  <code className="code">{viewingLead.sourcePage || '—'}</code>
                </div>
                <div>
                  <div className="meta-label">Inquiry Type</div>
                  <div className="meta-value">{viewingLead.inquiryType || '—'}</div>
                </div>
                <div>
                  <div className="meta-label">Submitted</div>
                  <div className="meta-value">{formatDate(viewingLead.submittedAt)} at {formatTime(viewingLead.submittedAt)}</div>
                </div>
                <div>
                  <div className="meta-label">IP Address</div>
                  <code className="code">{viewingLead.ipAddress || '—'}</code>
                </div>
                <div>
                  <div className="meta-label">Status</div>
                  <span className="status-badge" style={STATUS_STYLES[viewingLead.status]}>
                    {STATUS_STYLES[viewingLead.status].label}
                  </span>
                </div>
              </div>

              {/* Message */}
              <div style={{ marginTop: 24 }}>
                <div className="section-label">Full Message</div>
                <div className="message-box">{viewingLead.message}</div>
              </div>

              {/* Status Actions */}
              <div>
                <div className="section-label">Update Status</div>
                <div className="status-actions">
                  {(['new', 'contacted', 'closed'] as const).map(s => (
                    <button
                      key={s}
                      onClick={() => updateStatus(viewingLead.id, s)}
                      className="status-action-btn"
                      style={{
                        background: viewingLead.status === s ? '#3a405a' : '#fdf3eb',
                        color: viewingLead.status === s ? '#f9dec9' : '#685044',
                        borderColor: viewingLead.status === s ? '#3a405a' : 'rgba(104,80,68,0.2)',
                      }}
                    >
                      {s.charAt(0).toUpperCase() + s.slice(1)}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div className="modal-footer">
              <button
                onClick={() => {
                  setDeleteConfirm(viewingLead.id);
                  setViewingId(null);
                }}
                className="delete-action-btn"
              >
                Delete Lead
              </button>
              <a href={`mailto:${viewingLead.email}`} className="reply-btn">
                Reply by Email
              </a>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirm Modal */}
      {deleteConfirm && (
        <div className="overlay" onClick={() => setDeleteConfirm(null)}>
          <div className="modal confirm-modal" onClick={e => e.stopPropagation()}>
            <div className="confirm-content">
              <div className="confirm-icon">⚠</div>
              <h3 className="confirm-title">Delete this lead?</h3>
              <p className="confirm-text">This action cannot be undone.</p>
            </div>
            <div className="confirm-actions">
              <button onClick={() => setDeleteConfirm(null)} className="cancel-btn">Cancel</button>
              <button onClick={() => deleteLead(deleteConfirm)} className="delete-action-btn" style={{ flex: 1, borderRadius: 10, padding: '11px 0' }}>Delete</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}