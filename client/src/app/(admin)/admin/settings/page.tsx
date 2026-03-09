// app/admin/settings/page.tsx
// ─────────────────────────────────────────────────────────────────────────────
// Site Settings — manage global configuration, branding, contact info, social
// ─────────────────────────────────────────────────────────────────────────────

'use client';

import { useState, useEffect, useRef, useCallback } from 'react';

interface Settings {
  siteName: string;
  siteTagline: string;
  companyDescription: string;
  email: string;
  phone: string;
  whatsapp: string;
  address: string;
  facebookUrl: string;
  linkedinUrl: string;
  instagramUrl: string;
  twitterUrl: string;
  youtubeUrl: string;
  copyrightText: string;
  footerDescription: string;
}

interface MediaItem {
  filePath: string;
  fileName?: string;
}

interface Media {
  logo: MediaItem | null;
  favicon: MediaItem | null;
  defaultSocialImage: MediaItem | null;
}

interface Previews {
  logo: string | null;
  favicon: string | null;
  defaultSocialImage: string | null;
}

type TabType = 'General' | 'Contact' | 'Brand' | 'Social' | 'Footer';

const TABS: TabType[] = ['General', 'Contact', 'Brand', 'Social', 'Footer'];

// Move these OUTSIDE to prevent remounting
function Field({
  label,
  id,
  placeholder,
  value,
  onChange,
  type = 'text',
  hint,
}: {
  label: string;
  id: string;
  placeholder: string;
  value: string;
  onChange: (v: string) => void;
  type?: string;
  hint?: string;
}) {
  return (
    <div className="field-wrap">
      <label className="field-label" htmlFor={id}>
        {label}
      </label>
      {hint && <p className="field-hint">{hint}</p>}
      <input
        id={id}
        type={type}
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange(e.currentTarget.value)}
        className="field-input"
      />
    </div>
  );
}

function TextArea({
  label,
  id,
  placeholder,
  value,
  onChange,
  hint,
}: {
  label: string;
  id: string;
  placeholder: string;
  value: string;
  onChange: (v: string) => void;
  hint?: string;
}) {
  return (
    <div className="field-wrap">
      <label className="field-label" htmlFor={id}>
        {label}
      </label>
      {hint && <p className="field-hint">{hint}</p>}
      <textarea
        id={id}
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange(e.currentTarget.value)}
        rows={4}
        className="field-textarea"
      />
    </div>
  );
}

function UploadField({
  label,
  fieldKey,
  inputRef,
  hint,
  dimensions,
  preview,
  onUpload,
  onRemove,
}: {
  label: string;
  fieldKey: string;
  inputRef: React.RefObject<HTMLInputElement>;
  hint?: string;
  dimensions?: string;
  preview: string | null;
  onUpload: (file: File | null) => void;
  onRemove: () => void;
}) {
  return (
    <div className="field-wrap">
      <label className="field-label">{label}</label>
      {hint && (
        <p className="field-hint">
          {hint}
          {dimensions && (
            <span style={{ color: '#99b2dd', marginLeft: 6 }}>
              Recommended: {dimensions}
            </span>
          )}
        </p>
      )}
      <div className="upload-zone" onClick={() => inputRef.current?.click()}>
        {preview ? (
          <img src={preview} alt="preview" className="upload-preview" />
        ) : (
          <div style={{ textAlign: 'center' }}>
            <div className="upload-icon">↑</div>
            <p className="upload-text">Click to upload</p>
          </div>
        )}
        <input
          ref={inputRef}
          type="file"
          accept="image/*"
          style={{ display: 'none' }}
          onChange={(e) => {
            const target = e.currentTarget;
            onUpload(target.files?.[0] || null);
          }}
        />
      </div>
      {preview && (
        <button className="remove-btn" onClick={onRemove}>
          Remove
        </button>
      )}
    </div>
  );
}

function SocialField({
  label,
  id,
  icon,
  value,
  onChange,
  placeholder,
}: {
  label: string;
  id: string;
  icon: string;
  value: string;
  onChange: (v: string) => void;
  placeholder: string;
}) {
  return (
    <div className="field-wrap">
      <label className="field-label" htmlFor={id}>
        {label}
      </label>
      <div className="input-prefix-wrap">
        <span className="input-prefix">{icon}</span>
        <input
          id={id}
          type="url"
          placeholder={placeholder}
          value={value}
          onChange={(e) => onChange(e.currentTarget.value)}
          className="field-input input-with-prefix"
        />
      </div>
    </div>
  );
}

export default function SiteSettingsPage() {
  const [activeTab, setActiveTab] = useState<TabType>('General');
  const [settings, setSettings] = useState<Settings>({
    siteName: '',
    siteTagline: '',
    companyDescription: '',
    email: '',
    phone: '',
    whatsapp: '',
    address: '',
    facebookUrl: '',
    linkedinUrl: '',
    instagramUrl: '',
    twitterUrl: '',
    youtubeUrl: '',
    copyrightText: '',
    footerDescription: '',
  });

  const [media, setMedia] = useState<Media>({
    logo: null,
    favicon: null,
    defaultSocialImage: null,
  });

  const [previews, setPreviews] = useState<Previews>({
    logo: null,
    favicon: null,
    defaultSocialImage: null,
  });

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  const logoRef = useRef<HTMLInputElement>(null!);
  const faviconRef = useRef<HTMLInputElement>(null!);
  const socialImageRef = useRef<HTMLInputElement>(null!);

  useEffect(() => {
    fetchSettings();
  }, []);

  async function fetchSettings() {
    try {
      setLoading(true);
      const res = await fetch('/api/admin/settings');
      const json = await res.json();
      
      if (json.data) {
        setSettings(json.data.settings);
        setMedia(json.data.media);
        
        if (json.data.media.logo?.filePath) {
          setPreviews((p: Previews) => ({ ...p, logo: json.data.media.logo.filePath }));
        }
        if (json.data.media.favicon?.filePath) {
          setPreviews((p: Previews) => ({ ...p, favicon: json.data.media.favicon.filePath }));
        }
        if (json.data.media.defaultSocialImage?.filePath) {
          setPreviews((p: Previews) => ({ ...p, defaultSocialImage: json.data.media.defaultSocialImage.filePath }));
        }
      }
    } catch (err) {
      console.error('Failed to fetch settings:', err);
    } finally {
      setLoading(false);
    }
  }

  const updateSetting = useCallback((key: keyof Settings, value: string) => {
    setSettings((p: Settings) => ({ ...p, [key]: value }));
    setSaved(false);
  }, []);

  const handleFileUpload = useCallback(async (key: keyof Previews, file: File | null) => {
    if (!file) return;

    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('mediaKey', key);

      const res = await fetch('/api/admin/settings/media', {
        method: 'POST',
        body: formData,
      });

      const json = await res.json();

      if (res.ok) {
        const reader = new FileReader();
       reader.onload = (e: ProgressEvent<FileReader>) => {
  const target = e.target as FileReader;  // ✅ Explicitly cast
  if (target?.result) {
    setPreviews((p: Previews) => ({ ...p, [key]: target.result as string }));
  }
};
        reader.readAsDataURL(file);
      } else {
        alert(json.message || 'Failed to upload file');
      }
    } catch (err) {
      console.error('Failed to upload file:', err);
    }
  }, []);

  const removeMedia = useCallback(async (key: keyof Previews) => {
    try {
      const res = await fetch(`/api/admin/settings/media/${key}`, {
        method: 'DELETE',
      });

      if (res.ok) {
        setPreviews((p: Previews) => ({ ...p, [key]: null }));
        setMedia((m: Media) => ({ ...m, [key]: null }));
      }
    } catch (err) {
      console.error('Failed to remove media:', err);
    }
  }, []);

  const handleSave = useCallback(async () => {
    try {
      setSaving(true);
      const res = await fetch('/api/admin/settings', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(settings),
      });

      const json = await res.json();

      if (res.ok) {
        setSaved(true);
        setTimeout(() => setSaved(false), 3000);
      } else {
        alert(json.message || 'Failed to save settings');
      }
    } catch (err) {
      console.error('Failed to save settings:', err);
    } finally {
      setSaving(false);
    }
  }, [settings]);

  if (loading) {
    return (
      <div className="settings-page">
        <div className="loading">Loading settings...</div>
      </div>
    );
  }

  return (
    <div className="settings-page">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@300;400;600&family=DM+Sans:wght@300;400;500&display=swap');

        .settings-page {
          max-width: 900px;
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

        .field-label {
          font-size: 13px;
          font-weight: 600;
          color: #3a405a;
        }

        .field-hint {
          margin: 0;
          font-size: 12px;
          color: #685044;
          opacity: 0.75;
          line-height: 1.4;
        }

        .field-input {
          padding: 10px 14px;
          border-radius: 10px;
          border: 1.5px solid rgba(104,80,68,0.18);
          background: #fffaf7;
          color: #3a405a;
          font-size: 14px;
          outline: none;
          transition: border-color 0.15s;
          width: 100%;
          font-family: inherit;
          box-sizing: border-box;
        }

        .field-input:focus {
          border-color: #3a405a;
        }

        .field-textarea {
          padding: 10px 14px;
          border-radius: 10px;
          border: 1.5px solid rgba(104,80,68,0.18);
          background: #fffaf7;
          color: #3a405a;
          font-size: 14px;
          outline: none;
          transition: border-color 0.15s;
          width: 100%;
          font-family: inherit;
          resize: vertical;
          line-height: 1.6;
          box-sizing: border-box;
        }

        .field-textarea:focus {
          border-color: #3a405a;
        }

        .input-prefix-wrap {
          position: relative;
        }

        .input-prefix {
          position: absolute;
          left: 14px;
          top: 50%;
          transform: translateY(-50%);
          color: #99b2dd;
          font-weight: 700;
          font-size: 12px;
          pointer-events: none;
        }

        .input-with-prefix {
          padding-left: 44px;
        }

        .upload-zone {
          border: 2px dashed rgba(104,80,68,0.22);
          border-radius: 12px;
          background: #fdf3eb;
          padding: 28px 20px;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          min-height: 100px;
          transition: border-color 0.15s;
        }

        .upload-zone:hover {
          border-color: #3a405a;
        }

        .upload-preview {
          max-height: 80px;
          max-width: 240px;
          border-radius: 8px;
          object-fit: contain;
        }

        .upload-icon {
          width: 36px;
          height: 36px;
          border-radius: 50%;
          background: #3a405a;
          color: #f9dec9;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 18px;
          font-weight: 700;
          margin: 0 auto;
        }

        .upload-text {
          margin: 6px 0 0;
          color: #685044;
          font-size: 13px;
        }

        .remove-btn {
          align-self: flex-start;
          background: none;
          border: none;
          color: #e9afa3;
          font-size: 12px;
          cursor: pointer;
          padding: 0;
          font-weight: 600;
          text-decoration: underline;
          font-family: 'DM Sans', sans-serif;
          transition: color 0.2s;
        }

        .remove-btn:hover {
          color: #c0392b;
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
          <div className="breadcrumb">Admin / Site Settings</div>
          <h1 className="page-title">Site Settings</h1>
          <p className="page-subtitle">Global configuration for your website.</p>
        </div>
        <button onClick={handleSave} disabled={saving} className="save-btn">
          {saving ? 'Saving…' : saved ? '✓ Saved' : 'Save Changes'}
        </button>
      </div>

      {/* Tabs */}
      <div className="tab-bar">
        {TABS.map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`tab-btn ${activeTab === tab ? 'active' : ''}`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Card */}
      <div className="card">
        <div className="card-header">
          <span className="card-label">{activeTab}</span>
        </div>

        <div className="grid-2">
          {/* General Tab */}
          {activeTab === 'General' && (
            <>
              <div style={{ gridColumn: '1 / -1' }}>
                <Field
                  label="Site Name"
                  id="siteName"
                  placeholder="My Awesome Company"
                  value={settings.siteName}
                  onChange={(v) => updateSetting('siteName', v)}
                  hint="Appears in the browser tab and header."
                />
              </div>
              <Field
                label="Site Tagline"
                id="siteTagline"
                placeholder="Crafting experiences that matter"
                value={settings.siteTagline}
                onChange={(v) => updateSetting('siteTagline', v)}
              />
              <div style={{ gridColumn: '1 / -1' }}>
                <TextArea
                  label="Company Description"
                  id="companyDescription"
                  placeholder="A short paragraph about your company..."
                  value={settings.companyDescription}
                  onChange={(v) => updateSetting('companyDescription', v)}
                  hint="Used in About sections and default SEO descriptions."
                />
              </div>
            </>
          )}

          {/* Contact Tab */}
          {activeTab === 'Contact' && (
            <>
              <Field
                label="Email Address"
                id="email"
                type="email"
                placeholder="hello@company.com"
                value={settings.email}
                onChange={(v) => updateSetting('email', v)}
              />
              <Field
                label="Phone Number"
                id="phone"
                type="tel"
                placeholder="+1 (555) 000-0000"
                value={settings.phone}
                onChange={(v) => updateSetting('phone', v)}
              />
              <Field
                label="WhatsApp Number"
                id="whatsapp"
                type="tel"
                placeholder="+1 (555) 000-0000"
                value={settings.whatsapp}
                onChange={(v) => updateSetting('whatsapp', v)}
                hint="Include country code for WhatsApp links."
              />
              <div style={{ gridColumn: '1 / -1' }}>
                <TextArea
                  label="Address"
                  id="address"
                  placeholder="123 Main St, Suite 100&#10;New York, NY 10001"
                  value={settings.address}
                  onChange={(v) => updateSetting('address', v)}
                />
              </div>
            </>
          )}

          {/* Brand Tab */}
          {activeTab === 'Brand' && (
            <>
              <UploadField
                label="Logo"
                fieldKey="logo"
                inputRef={logoRef}
                hint="Main logo used in header."
                dimensions="200×60px SVG or PNG"
                preview={previews.logo}
                onUpload={(file) => handleFileUpload('logo', file)}
                onRemove={() => removeMedia('logo')}
              />
              <UploadField
                label="Favicon"
                fieldKey="favicon"
                inputRef={faviconRef}
                hint="Small icon in browser tab."
                dimensions="32×32px ICO or PNG"
                preview={previews.favicon}
                onUpload={(file) => handleFileUpload('favicon', file)}
                onRemove={() => removeMedia('favicon')}
              />
              <div style={{ gridColumn: '1 / -1' }}>
                <UploadField
                  label="Default Social Share Image"
                  fieldKey="defaultSocialImage"
                  inputRef={socialImageRef}
                  hint="Shown when pages are shared on social media."
                  dimensions="1200×630px"
                  preview={previews.defaultSocialImage}
                  onUpload={(file) => handleFileUpload('defaultSocialImage', file)}
                  onRemove={() => removeMedia('defaultSocialImage')}
                />
              </div>
            </>
          )}

          {/* Social Tab */}
          {activeTab === 'Social' && (
            <>
              <SocialField
                label="Facebook"
                id="facebook"
                icon="f"
                placeholder="https://facebook.com/yourpage"
                value={settings.facebookUrl}
                onChange={(v) => updateSetting('facebookUrl', v)}
              />
              <SocialField
                label="LinkedIn"
                id="linkedin"
                icon="in"
                placeholder="https://linkedin.com/company/yourco"
                value={settings.linkedinUrl}
                onChange={(v) => updateSetting('linkedinUrl', v)}
              />
              <SocialField
                label="Instagram"
                id="instagram"
                icon="📷"
                placeholder="https://instagram.com/yourhandle"
                value={settings.instagramUrl}
                onChange={(v) => updateSetting('instagramUrl', v)}
              />
              <SocialField
                label="Twitter / X"
                id="twitter"
                icon="𝕏"
                placeholder="https://twitter.com/yourhandle"
                value={settings.twitterUrl}
                onChange={(v) => updateSetting('twitterUrl', v)}
              />
              <SocialField
                label="YouTube"
                id="youtube"
                icon="▶"
                placeholder="https://youtube.com/@yourchannel"
                value={settings.youtubeUrl}
                onChange={(v) => updateSetting('youtubeUrl', v)}
              />
            </>
          )}

          {/* Footer Tab */}
          {activeTab === 'Footer' && (
            <>
              <div style={{ gridColumn: '1 / -1' }}>
                <Field
                  label="Copyright Text"
                  id="copyrightText"
                  placeholder="© 2025 My Company. All rights reserved."
                  value={settings.copyrightText}
                  onChange={(v) => updateSetting('copyrightText', v)}
                  hint="Displayed at the bottom of every page."
                />
              </div>
              <div style={{ gridColumn: '1 / -1' }}>
                <TextArea
                  label="Footer Description"
                  id="footerDescription"
                  placeholder="A short tagline or description shown in the footer..."
                  value={settings.footerDescription}
                  onChange={(v) => updateSetting('footerDescription', v)}
                />
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}