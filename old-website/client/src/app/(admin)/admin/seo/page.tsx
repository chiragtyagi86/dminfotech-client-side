// app/admin/seo/page.tsx
// ─────────────────────────────────────────────────────────────────────────────
// SEO Settings Management — global and per-page/post SEO configuration
// Control meta tags, Open Graph, canonical URLs, and indexing
// ─────────────────────────────────────────────────────────────────────────────

'use client';

import { useState, useEffect } from 'react';

interface SeoData {
  metaTitle: string;
  metaDescription: string;
  canonicalUrl: string;
  ogTitle: string;
  ogDescription: string;
  ogImage: string;
  indexEnabled: boolean;
}

interface PageItem {
  id: number;
  title: string;
  slug: string;
  seo?: SeoData;
}

const TABS = ['Global SEO', 'Pages', 'Blog Posts'];

const charCount = (str: string, max: number) => {
  const len = (str || '').length;
  const color = len > max ? '#e9afa3' : len > max * 0.85 ? '#f0b96e' : '#99b2dd';
  return { len, color };
};

export default function SeoPage() {
  const [activeTab, setActiveTab] = useState('Global SEO');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  
  const [globalSeo, setGlobalSeo] = useState({
    defaultMetaTitle: '',
    defaultMetaDescription: '',
    defaultOgImage: '',
    canonicalDomain: '',
    siteKeywords: '',
  });

  const [pages, setPages] = useState<PageItem[]>([]);
  const [blogs, setBlogs] = useState<PageItem[]>([]);
  
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editingType, setEditingType] = useState<'page' | 'blog' | null>(null);
  const [editData, setEditData] = useState<SeoData | null>(null);

  useEffect(() => {
    fetchSeoData();
  }, []);

  async function fetchSeoData() {
    try {
      setLoading(true);
      const res = await fetch('/api/admin/seo');
      const json = await res.json();
      
      setGlobalSeo(json.global || {});
      setPages(json.pages || []);
      setBlogs(json.blogs || []);
    } catch (err) {
      console.error('Failed to fetch SEO data:', err);
    } finally {
      setLoading(false);
    }
  }

  const setGlobal = (key: string, value: string) => {
    setGlobalSeo(p => ({ ...p, [key]: value }));
    setSaved(false);
  };

  const openEdit = (item: PageItem, type: 'page' | 'blog') => {
    setEditingId(item.id);
    setEditingType(type);
    setEditData(item.seo || {
      metaTitle: '',
      metaDescription: '',
      canonicalUrl: '',
      ogTitle: '',
      ogDescription: '',
      ogImage: '',
      indexEnabled: true,
    });
  };

  const closeEdit = () => {
    setEditingId(null);
    setEditingType(null);
    setEditData(null);
  };

  const saveEdit = async () => {
    if (!editingId || !editingType || !editData) return;

    try {
      setSaving(true);
      const res = await fetch(`/api/admin/seo/${editingType}/${editingId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(editData),
      });

      if (res.ok) {
        if (editingType === 'page') {
          setPages(p => p.map(pg => pg.id === editingId ? { ...pg, seo: editData } : pg));
        } else {
          setBlogs(p => p.map(b => b.id === editingId ? { ...b, seo: editData } : b));
        }
        closeEdit();
      }
    } catch (err) {
      console.error('Failed to save SEO:', err);
    } finally {
      setSaving(false);
    }
  };

  const saveGlobal = async () => {
    try {
      setSaving(true);
      const res = await fetch('/api/admin/seo', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(globalSeo),
      });

      if (res.ok) {
        setSaved(true);
        setTimeout(() => setSaved(false), 3000);
      }
    } catch (err) {
      console.error('Failed to save global SEO:', err);
    } finally {
      setSaving(false);
    }
  };

  const setEditField = (key: string, value: any) => {
    setEditData(p => p ? { ...p, [key]: value } : null);
  };

  // UI Components
  const Field = ({ label, id, placeholder, value, onChange, hint, maxLen }: any) => {
    const { len, color } = maxLen ? charCount(value, maxLen) : {};
    return (
      <div className="field-wrap">
        <div className="field-header">
          <label className="field-label" htmlFor={id}>{label}</label>
          {maxLen && <span className="char-count" style={{ color }}>{len}/{maxLen}</span>}
        </div>
        {hint && <p className="field-hint">{hint}</p>}
        <input
          id={id}
          type="text"
          placeholder={placeholder}
          value={value}
          onChange={e => onChange(e.target.value)}
          className="field-input"
        />
      </div>
    );
  };

  const TextArea = ({ label, id, placeholder, value, onChange, hint, maxLen, rows = 3 }: any) => {
    const { len, color } = maxLen ? charCount(value, maxLen) : {};
    return (
      <div className="field-wrap">
        <div className="field-header">
          <label className="field-label" htmlFor={id}>{label}</label>
          {maxLen && <span className="char-count" style={{ color }}>{len}/{maxLen}</span>}
        </div>
        {hint && <p className="field-hint">{hint}</p>}
        <textarea
          id={id}
          placeholder={placeholder}
          value={value}
          onChange={e => onChange(e.target.value)}
          rows={rows}
          className="field-textarea"
        />
      </div>
    );
  };

  const Toggle = ({ label, checked, onChange, hint }: any) => (
    <div className="toggle-wrap">
      <button
        onClick={() => onChange(!checked)}
        className={`toggle-btn ${checked ? 'active' : ''}`}
      >
        <span className="toggle-dot" />
      </button>
      <div>
        <div className="toggle-label">{label}</div>
        {hint && <div className="toggle-hint">{hint}</div>}
      </div>
    </div>
  );

  const SeoPreview = ({ title, description, slug }: any) => {
    const displayTitle = title || 'Page Title · Site Name';
    const displayDesc = description || 'Page description will appear here in search results…';
    const displaySlug = slug || '/your-page';
    return (
      <div className="seo-preview">
        <div className="preview-label">Search Preview</div>
        <div className="preview-slug">yourwebsite.com{displaySlug}</div>
        <div className="preview-title">{displayTitle}</div>
        <div className="preview-desc">{displayDesc.slice(0, 160)}</div>
      </div>
    );
  };

  const PageTable = ({ items, type }: any) => (
    <div className="table-wrap">
      <table className="table">
        <thead>
          <tr>
            {['Page', 'Slug', 'Meta Title', 'Index', 'Actions'].map(h => (
              <th key={h} className="table-th">{h}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {items.map((item: PageItem) => (
            <tr key={item.id} className="table-tr">
              <td className="table-td table-td-name">{item.title}</td>
              <td className="table-td"><code className="table-code">{item.slug}</code></td>
              <td className="table-td">
                <span style={{ color: item.seo?.metaTitle ? '#3a405a' : '#685044', opacity: item.seo?.metaTitle ? 1 : 0.45 }}>
                  {item.seo?.metaTitle || '— not set —'}
                </span>
              </td>
              <td className="table-td">
                <span className="table-badge" style={{
                  background: item.seo?.indexEnabled !== false ? '#e8f0e9' : '#fdf3eb',
                  color: item.seo?.indexEnabled !== false ? '#3a6644' : '#685044'
                }}>
                  {item.seo?.indexEnabled !== false ? 'Index' : 'NoIndex'}
                </span>
              </td>
              <td className="table-td">
                <button onClick={() => openEdit(item, type)} className="table-edit-btn">Edit SEO</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );

  if (loading) {
    return <div className="seo-page"><div className="loading">Loading SEO settings...</div></div>;
  }

  return (
    <div className="seo-page">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@300;400;600&family=DM+Sans:wght@300;400;500&display=swap');

        .seo-page {
          max-width: 1000px;
          margin: 0 auto;
          padding: 40px 24px 80px;
          font-family: 'DM Sans', sans-serif;
          color: #3a405a;
        }

        .page-header {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          margin-bottom: 32px;
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

        .save-btn {
          background: #3a405a;
          color: #f9dec9;
          border: none;
          border-radius: 10px;
          padding: 12px 28px;
          font-weight: 700;
          font-size: 14px;
          cursor: pointer;
          font-family: 'DM Sans', sans-serif;
          transition: all 0.2s;
        }

        .save-btn:hover:not(:disabled) {
          transform: translateY(-1px);
          box-shadow: 0 6px 18px rgba(58,64,90,0.18);
        }

        .save-btn:disabled {
          opacity: 0.7;
        }

        .tab-bar {
          display: flex;
          gap: 8px;
          margin-bottom: 24px;
          flex-wrap: wrap;
        }

        .tab-btn {
          padding: 8px 20px;
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

        .card {
          background: #ffffff;
          border-radius: 18px;
          box-shadow: 0 12px 40px rgba(58,64,90,0.08);
          border: 1px solid rgba(104,80,68,0.12);
          padding: 32px 36px;
        }

        .card-header {
          margin-bottom: 28px;
          padding-bottom: 16px;
          border-bottom: 1px solid rgba(104,80,68,0.1);
        }

        .card-label {
          font-size: 11px;
          font-weight: 700;
          letter-spacing: 1.5px;
          text-transform: uppercase;
          color: #685044;
        }

        .card-subtitle {
          margin: 4px 0 0;
          font-size: 13px;
          color: #685044;
          font-weight: 300;
        }

        .grid-2 {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 20px 28px;
        }

        @media (max-width: 768px) {
          .grid-2 {
            grid-template-columns: 1fr;
          }
        }

        .field-wrap {
          display: flex;
          flex-direction: column;
          gap: 6px;
        }

        .field-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
        }

        .field-label {
          font-size: 13px;
          font-weight: 600;
          color: #3a405a;
        }

        .char-count {
          font-size: 11px;
          font-weight: 600;
        }

        .field-hint {
          margin: 0;
          font-size: 12px;
          color: #685044;
          opacity: 0.75;
          line-height: 1.4;
        }

        .field-input,
        .field-textarea {
          padding: 10px 14px;
          border-radius: 10px;
          border: 1.5px solid rgba(104,80,68,0.18);
          background: #fffaf7;
          color: #3a405a;
          font-size: 14px;
          outline: none;
          transition: border-color 0.15s;
          font-family: inherit;
        }

        .field-input:focus,
        .field-textarea:focus {
          border-color: #3a405a;
        }

        .field-textarea {
          resize: vertical;
          line-height: 1.6;
          min-height: 80px;
        }

        .section-mini {
          font-size: 11px;
          font-weight: 700;
          letter-spacing: 1.4px;
          text-transform: uppercase;
          color: #685044;
          margin: 20px 0 16px;
          padding-bottom: 8px;
          border-bottom: 1px solid rgba(104,80,68,0.1);
        }

        .seo-preview {
          background: #fdf3eb;
          border-radius: 12px;
          padding: 20px 24px;
          border: 1px solid rgba(104,80,68,0.12);
          margin-top: 24px;
        }

        .preview-label {
          font-size: 11px;
          font-weight: 700;
          letter-spacing: 1.2px;
          text-transform: uppercase;
          color: #685044;
          margin-bottom: 10px;
        }

        .preview-slug {
          font-size: 13px;
          color: #3a6644;
          margin-bottom: 4px;
        }

        .preview-title {
          font-size: 18px;
          color: #1a0dab;
          font-weight: 600;
          margin-bottom: 4px;
          line-height: 1.3;
        }

        .preview-desc {
          font-size: 13px;
          color: #545454;
          line-height: 1.5;
        }

        .toggle-wrap {
          display: flex;
          align-items: flex-start;
          gap: 12px;
          padding: 14px 0;
          border-top: 1px solid rgba(104,80,68,0.08);
        }

        .toggle-btn {
          width: 44px;
          height: 24px;
          border-radius: 999px;
          background: rgba(104,80,68,0.18);
          border: none;
          cursor: pointer;
          position: relative;
          transition: background 0.2s;
          flex-shrink: 0;
          margin-top: 2px;
        }

        .toggle-btn.active {
          background: #3a405a;
        }

        .toggle-dot {
          position: absolute;
          top: 3px;
          left: 3px;
          width: 18px;
          height: 18px;
          border-radius: 50%;
          background: #fff;
          transition: left 0.2s;
        }

        .toggle-btn.active .toggle-dot {
          left: 22px;
        }

        .toggle-label {
          font-size: 13px;
          font-weight: 600;
          color: #3a405a;
        }

        .toggle-hint {
          font-size: 12px;
          color: #685044;
          opacity: 0.75;
          margin-top: 2px;
        }

        .table-wrap {
          overflow-x: auto;
        }

        .table {
          width: 100%;
          border-collapse: collapse;
          font-size: 14px;
        }

        .table-th {
          text-align: left;
          padding: 10px 14px;
          border-bottom: 2px solid rgba(104,80,68,0.12);
          font-size: 11px;
          font-weight: 700;
          letter-spacing: 1px;
          text-transform: uppercase;
          color: #685044;
        }

        .table-tr {
          border-bottom: 1px solid rgba(104,80,68,0.08);
          transition: background 0.12s;
        }

        .table-tr:hover {
          background: rgba(104,80,68,0.02);
        }

        .table-td {
          padding: 14px;
          vertical-align: middle;
          color: #3a405a;
        }

        .table-td-name {
          font-weight: 600;
        }

        .table-code {
          background: #fdf3eb;
          padding: 3px 8px;
          border-radius: 6px;
          font-size: 12px;
          color: #685044;
          font-family: monospace;
        }

        .table-badge {
          padding: 3px 10px;
          border-radius: 999px;
          font-size: 12px;
          font-weight: 600;
          display: inline-block;
        }

        .table-edit-btn {
          background: none;
          border: 1.5px solid #3a405a;
          color: #3a405a;
          border-radius: 8px;
          padding: 6px 14px;
          font-size: 12px;
          font-weight: 600;
          cursor: pointer;
          font-family: 'DM Sans', sans-serif;
          transition: all 0.2s;
        }

        .table-edit-btn:hover {
          background: #3a405a;
          color: #f9dec9;
        }

        .modal-overlay {
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
          max-width: 620px;
          max-height: 90vh;
          display: flex;
          flex-direction: column;
          box-shadow: 0 30px 80px rgba(58,64,90,0.2);
        }

        .modal-header {
          padding: 24px 28px 20px;
          border-bottom: 1px solid rgba(104,80,68,0.12);
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
        }

        .modal-title {
          font-size: 18px;
          font-weight: 700;
          color: #3a405a;
          margin: 0 0 4px;
        }

        .modal-slug {
          font-size: 12px;
          color: #99b2dd;
          font-family: monospace;
        }

        .close-btn {
          background: none;
          border: none;
          font-size: 18px;
          cursor: pointer;
          color: #685044;
          line-height: 1;
          padding: 4px;
        }

        .modal-body {
          padding: 24px 28px;
          overflow-y: auto;
          flex: 1;
        }

        .modal-footer {
          padding: 16px 28px;
          border-top: 1px solid rgba(104,80,68,0.12);
          display: flex;
          justify-content: flex-end;
          gap: 12px;
        }

        .cancel-btn {
          background: none;
          border: 1.5px solid rgba(104,80,68,0.25);
          color: #685044;
          border-radius: 10px;
          padding: 10px 22px;
          font-size: 14px;
          font-weight: 600;
          cursor: pointer;
          font-family: 'DM Sans', sans-serif;
          transition: all 0.2s;
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
          <div className="breadcrumb">Admin / SEO Settings</div>
          <h1 className="page-title">SEO Settings</h1>
          <p className="page-subtitle">Control meta information for search engines and social sharing.</p>
        </div>
        {activeTab === 'Global SEO' && (
          <button onClick={saveGlobal} disabled={saving} className="save-btn">
            {saving ? 'Saving…' : saved ? '✓ Saved' : 'Save Changes'}
          </button>
        )}
      </div>

      {/* Tabs */}
      <div className="tab-bar">
        {TABS.map(tab => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`tab-btn ${activeTab === tab ? 'active' : ''}`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Global SEO Tab */}
      {activeTab === 'Global SEO' && (
        <div className="card">
          <div className="card-header">
            <span className="card-label">Global Defaults</span>
            <p className="card-subtitle">Applied site-wide when no page-specific values are set.</p>
          </div>
          <div className="grid-2">
            <div style={{ gridColumn: '1 / -1' }}>
              <Field
                label="Default Meta Title"
                id="defaultMetaTitle"
                placeholder="My Company — Crafting Experiences"
                value={globalSeo.defaultMetaTitle}
                onChange={(v: string) => setGlobal('defaultMetaTitle', v)}
                maxLen={60}
                hint="Shown in browser tabs and search results."
              />
            </div>
            <div style={{ gridColumn: '1 / -1' }}>
              <TextArea
                label="Default Meta Description"
                id="defaultMetaDesc"
                placeholder="We help businesses grow through exceptional design and technology."
                value={globalSeo.defaultMetaDescription}
                onChange={(v: string) => setGlobal('defaultMetaDescription', v)}
                maxLen={160}
                hint="Summary shown beneath your title in search results."
              />
            </div>
            <Field
              label="Default OG Image URL"
              id="defaultOgImage"
              placeholder="https://yoursite.com/og-image.jpg"
              value={globalSeo.defaultOgImage}
              onChange={(v: string) => setGlobal('defaultOgImage', v)}
              hint="Image shown when pages are shared on social."
            />
            <Field
              label="Canonical Domain"
              id="canonicalDomain"
              placeholder="https://yourwebsite.com"
              value={globalSeo.canonicalDomain}
              onChange={(v: string) => setGlobal('canonicalDomain', v)}
              hint="Your primary domain for canonical URLs."
            />
            <div style={{ gridColumn: '1 / -1' }}>
              <Field
                label="Site Keywords"
                id="siteKeywords"
                placeholder="design, technology, branding, web development"
                value={globalSeo.siteKeywords}
                onChange={(v: string) => setGlobal('siteKeywords', v)}
                hint="Comma-separated keywords (reference only)."
              />
            </div>
          </div>
          <SeoPreview
            title={globalSeo.defaultMetaTitle}
            description={globalSeo.defaultMetaDescription}
            slug="/"
          />
        </div>
      )}

      {/* Pages Tab */}
      {activeTab === 'Pages' && (
        <div className="card">
          <div className="card-header">
            <span className="card-label">Pages SEO</span>
            <p className="card-subtitle">Click "Edit SEO" to configure meta tags for each page.</p>
          </div>
          <PageTable items={pages} type="page" />
        </div>
      )}

      {/* Blog Posts Tab */}
      {activeTab === 'Blog Posts' && (
        <div className="card">
          <div className="card-header">
            <span className="card-label">Blog Posts SEO</span>
            <p className="card-subtitle">Click "Edit SEO" to configure meta tags for each blog post.</p>
          </div>
          <PageTable items={blogs} type="blog" />
        </div>
      )}

      {/* Edit Modal */}
      {editingId && editingType && editData && (
        <div className="modal-overlay" onClick={closeEdit}>
          <div className="modal" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <div>
                <h2 className="modal-title">SEO for: {editingType === 'page' ? pages.find(p => p.id === editingId)?.title : blogs.find(b => b.id === editingId)?.title}</h2>
                <div className="modal-slug">{editingType === 'page' ? pages.find(p => p.id === editingId)?.slug : blogs.find(b => b.id === editingId)?.slug}</div>
              </div>
              <button onClick={closeEdit} className="close-btn">✕</button>
            </div>

            <div className="modal-body">
              {/* Meta Tags Section */}
              <div className="section-mini">Meta Tags</div>
              <Field
                label="Meta Title"
                id="metaTitle"
                placeholder="Page Title · Company"
                value={editData.metaTitle}
                onChange={(v: string) => setEditField('metaTitle', v)}
                maxLen={60}
              />
              <div style={{ marginTop: 16 }}>
                <TextArea
                  label="Meta Description"
                  id="metaDesc"
                  placeholder="Short description for search engines…"
                  value={editData.metaDescription}
                  onChange={(v: string) => setEditField('metaDescription', v)}
                  maxLen={160}
                />
              </div>
              <div style={{ marginTop: 16 }}>
                <Field
                  label="Canonical URL"
                  id="canonical"
                  placeholder="https://yoursite.com/page"
                  value={editData.canonicalUrl}
                  onChange={(v: string) => setEditField('canonicalUrl', v)}
                  hint="Leave blank to use the default canonical."
                />
              </div>

              {/* Index Toggle */}
              <Toggle
                label="Allow Search Engines to Index"
                checked={editData.indexEnabled}
                onChange={(v: boolean) => setEditField('indexEnabled', v)}
                hint={editData.indexEnabled ? 'This page will appear in search results.' : 'This page will be hidden from search results.'}
              />

              {/* Open Graph Section */}
              <div className="section-mini">Open Graph (Social Sharing)</div>
              <Field
                label="OG Title"
                id="ogTitle"
                placeholder="Title for social sharing"
                value={editData.ogTitle}
                onChange={(v: string) => setEditField('ogTitle', v)}
                maxLen={60}
              />
              <div style={{ marginTop: 16 }}>
                <TextArea
                  label="OG Description"
                  id="ogDesc"
                  placeholder="Description for social sharing"
                  value={editData.ogDescription}
                  onChange={(v: string) => setEditField('ogDescription', v)}
                  maxLen={160}
                />
              </div>
              <div style={{ marginTop: 16 }}>
                <Field
                  label="OG Image URL"
                  id="ogImage"
                  placeholder="https://yoursite.com/og-page.jpg"
                  value={editData.ogImage}
                  onChange={(v: string) => setEditField('ogImage', v)}
                />
              </div>

              <SeoPreview
                title={editData.metaTitle}
                description={editData.metaDescription}
                slug={editingType === 'page' ? pages.find(p => p.id === editingId)?.slug : blogs.find(b => b.id === editingId)?.slug}
              />
            </div>

            <div className="modal-footer">
              <button onClick={closeEdit} className="cancel-btn">Cancel</button>
              <button onClick={saveEdit} disabled={saving} className="save-btn">{saving ? 'Saving…' : 'Save SEO'}</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}