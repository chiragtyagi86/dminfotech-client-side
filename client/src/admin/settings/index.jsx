// src/admin/settings/index.jsx
import { useEffect, useRef, useState } from "react";
import { adminApi } from "../../lib/api";

function Field({ label, value, onChange, placeholder, multiline, type = "text" }) {
  const base = {
    fontFamily: "'DM Sans',sans-serif",
    fontSize: 14,
    fontWeight: 300,
    color: "#3a405a",
    padding: "11px 14px",
    borderRadius: 10,
    border: "1px solid rgba(104,80,68,0.14)",
    background: "#fdfaf8",
    width: "100%",
    outline: "none",
    boxSizing: "border-box",
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 6, marginBottom: 18 }}>
      <label
        style={{
          fontFamily: "'DM Sans',sans-serif",
          fontSize: 10.5,
          fontWeight: 500,
          letterSpacing: "0.13em",
          textTransform: "uppercase",
          color: "rgba(104,80,68,0.55)",
        }}
      >
        {label}
      </label>

      {multiline ? (
        <textarea
          style={{ ...base, minHeight: 80, resize: "vertical" }}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
        />
      ) : (
        <input
          style={base}
          type={type}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
        />
      )}
    </div>
  );
}

function FileUpload({ label, current, onFile }) {
  const ref = useRef(null);

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 6, marginBottom: 18 }}>
      <label
        style={{
          fontFamily: "'DM Sans',sans-serif",
          fontSize: 10.5,
          fontWeight: 500,
          letterSpacing: "0.13em",
          textTransform: "uppercase",
          color: "rgba(104,80,68,0.55)",
        }}
      >
        {label}
      </label>

      <div style={{ display: "flex", alignItems: "center", gap: 12, flexWrap: "wrap" }}>
        {current ? (
          <img
            src={current}
            alt={label}
            style={{
              height: 36,
              objectFit: "contain",
              border: "1px solid rgba(104,80,68,0.10)",
              borderRadius: 6,
              padding: 4,
              background: "#fff",
            }}
          />
        ) : null}

        <button
          type="button"
          onClick={() => ref.current?.click()}
          style={{
            padding: "9px 18px",
            borderRadius: 8,
            border: "1px dashed rgba(104,80,68,0.20)",
            background: "none",
            fontFamily: "'DM Sans',sans-serif",
            fontSize: 12,
            color: "rgba(104,80,68,0.55)",
            cursor: "pointer",
          }}
        >
          {current ? "Replace" : "Upload"} File
        </button>
      </div>

      <input
        ref={ref}
        type="file"
        accept="image/*"
        style={{ display: "none" }}
        onChange={(e) => {
          const file = e.target.files?.[0];
          if (file) onFile(file);
          e.target.value = "";
        }}
      />
    </div>
  );
}

function Row2({ children }) {
  return <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>{children}</div>;
}

const TABS = ["general", "contact", "brand", "social", "footer"];

const DEFAULT_SETTINGS = {
  siteName: "",
  siteTagline: "",
  companyDescription: "",

  email: "",
  phone: "",
  whatsapp: "",
  address: "",

  facebookUrl: "",
  linkedinUrl: "",
  instagramUrl: "",
  twitterUrl: "",
  youtubeUrl: "",

  copyrightText: "",
  footerDescription: "",

  logoUrl: "",
  faviconUrl: "",
  defaultSocialImage: "",
};

function normalizeSettings(payload = {}) {
  const settings = payload.settings || {};
  const media = payload.media || {};

  return {
    ...DEFAULT_SETTINGS,

    siteName: settings.siteName || "",
    siteTagline: settings.siteTagline || "",
    companyDescription: settings.companyDescription || "",

    email: settings.email || "",
    phone: settings.phone || "",
    whatsapp: settings.whatsapp || "",
    address: settings.address || "",

    facebookUrl: settings.facebookUrl || "",
    linkedinUrl: settings.linkedinUrl || "",
    instagramUrl: settings.instagramUrl || "",
    twitterUrl: settings.twitterUrl || "",
    youtubeUrl: settings.youtubeUrl || "",

    copyrightText: settings.copyrightText || "",
    footerDescription: settings.footerDescription || "",

    logoUrl: media.logo?.filePath || "",
    faviconUrl: media.favicon?.filePath || "",
    defaultSocialImage: media.defaultSocialImage?.filePath || "",
  };
}

export default function SiteSettingsPage() {
  const [tab, setTab] = useState("general");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState("");

  const [settings, setSettings] = useState(DEFAULT_SETTINGS);

  const [logoFile, setLogoFile] = useState(null);
  const [faviconFile, setFaviconFile] = useState(null);
  const [socialImageFile, setSocialImageFile] = useState(null);

  const [logoPreview, setLogoPreview] = useState("");
  const [faviconPreview, setFaviconPreview] = useState("");
  const [socialPreview, setSocialPreview] = useState("");

  useEffect(() => {
    let mounted = true;

    async function loadSettings() {
      try {
        setLoading(true);
        setError("");

        const res = await adminApi.getSettings();
        const payload = res?.data ?? res ?? {};
        const normalized = normalizeSettings(payload);

        if (!mounted) return;

        setSettings(normalized);
        setLogoPreview(normalized.logoUrl || "");
        setFaviconPreview(normalized.faviconUrl || "");
        setSocialPreview(normalized.defaultSocialImage || "");
      } catch (err) {
        console.error(err);
        if (mounted) setError(err?.message || "Failed to load settings.");
      } finally {
        if (mounted) setLoading(false);
      }
    }

    loadSettings();

    return () => {
      mounted = false;
    };
  }, []);

  useEffect(() => {
    return () => {
      if (logoPreview?.startsWith("blob:")) URL.revokeObjectURL(logoPreview);
      if (faviconPreview?.startsWith("blob:")) URL.revokeObjectURL(faviconPreview);
      if (socialPreview?.startsWith("blob:")) URL.revokeObjectURL(socialPreview);
    };
  }, [logoPreview, faviconPreview, socialPreview]);

  function set(key, value) {
    setSettings((prev) => ({ ...prev, [key]: value }));
  }

  function handleLogoFile(file) {
    if (logoPreview?.startsWith("blob:")) URL.revokeObjectURL(logoPreview);
    setLogoFile(file);
    setLogoPreview(URL.createObjectURL(file));
  }

  function handleFaviconFile(file) {
    if (faviconPreview?.startsWith("blob:")) URL.revokeObjectURL(faviconPreview);
    setFaviconFile(file);
    setFaviconPreview(URL.createObjectURL(file));
  }

  function handleSocialImageFile(file) {
    if (socialPreview?.startsWith("blob:")) URL.revokeObjectURL(socialPreview);
    setSocialImageFile(file);
    setSocialPreview(URL.createObjectURL(file));
  }

  async function uploadIfNeeded(mediaKey, file) {
    if (!file) return null;

    const fd = new FormData();
    fd.append("file", file);
    fd.append("mediaKey", mediaKey);

    const res = await adminApi.uploadMedia(fd);
    const payload = res?.data ?? res ?? {};

    return payload.filePath || null;
  }

  async function handleSave() {
    try {
      setSaving(true);
      setSaved(false);
      setError("");

      let nextLogoUrl = settings.logoUrl;
      let nextFaviconUrl = settings.faviconUrl;
      let nextSocialImage = settings.defaultSocialImage;

      if (logoFile) {
        const uploaded = await uploadIfNeeded("logo", logoFile);
        if (uploaded) nextLogoUrl = uploaded;
      }

      if (faviconFile) {
        const uploaded = await uploadIfNeeded("favicon", faviconFile);
        if (uploaded) nextFaviconUrl = uploaded;
      }

      if (socialImageFile) {
        const uploaded = await uploadIfNeeded("default_social_image", socialImageFile);
        if (uploaded) nextSocialImage = uploaded;
      }

      const payload = {
        siteName: settings.siteName,
        siteTagline: settings.siteTagline,
        companyDescription: settings.companyDescription,

        email: settings.email,
        phone: settings.phone,
        whatsapp: settings.whatsapp,
        address: settings.address,

        facebookUrl: settings.facebookUrl,
        linkedinUrl: settings.linkedinUrl,
        instagramUrl: settings.instagramUrl,
        twitterUrl: settings.twitterUrl,
        youtubeUrl: settings.youtubeUrl,

        copyrightText: settings.copyrightText,
        footerDescription: settings.footerDescription,
      };

      await adminApi.updateSettings(payload);

      setSettings((prev) => ({
        ...prev,
        ...payload,
        logoUrl: nextLogoUrl,
        faviconUrl: nextFaviconUrl,
        defaultSocialImage: nextSocialImage,
      }));

      setLogoFile(null);
      setFaviconFile(null);
      setSocialImageFile(null);

      setLogoPreview(nextLogoUrl || "");
      setFaviconPreview(nextFaviconUrl || "");
      setSocialPreview(nextSocialImage || "");

      setSaved(true);
      setTimeout(() => setSaved(false), 2500);
    } catch (err) {
      console.error(err);
      setError(err?.message || "Failed to save settings.");
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="ss-root">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@300;400;600&family=DM+Sans:wght@300;400;500&display=swap');
        *{box-sizing:border-box;}
        .ss-root{display:flex;flex-direction:column;gap:24px;animation:ssFade 0.4s ease both;}
        @keyframes ssFade{from{opacity:0;transform:translateY(8px)}to{opacity:1;transform:translateY(0)}}
        .ss-heading{font-family:'Cormorant Garamond',serif;font-size:32px;font-weight:400;color:#3a405a;margin:0;}
        .ss-tabs{display:flex;gap:4;border-bottom:1px solid rgba(104,80,68,0.09);flex-wrap:wrap;}
        .ss-tab{padding:11px 20px;border:none;background:none;font-family:'DM Sans',sans-serif;font-size:12px;font-weight:400;color:rgba(104,80,68,0.50);cursor:pointer;border-bottom:2px solid transparent;margin-bottom:-1px;transition:color 0.2s,border-color 0.2s;text-transform:capitalize;}
        .ss-tab.active{color:#3a405a;font-weight:500;border-bottom-color:#3a405a;}
        .ss-card{background:#ffffff;border:1px solid rgba(104,80,68,0.09);border-radius:16px;padding:28px;}
        .ss-save{padding:11px 28px;border-radius:10px;border:none;background:#3a405a;color:#f9dec9;font-family:'DM Sans',sans-serif;font-size:12px;font-weight:500;letter-spacing:0.10em;text-transform:uppercase;cursor:pointer;transition:transform 0.2s,box-shadow 0.2s;}
        .ss-save:hover:not(:disabled){transform:translateY(-1px);box-shadow:0 6px 20px rgba(58,64,90,0.20);}
        .ss-save:disabled{opacity:0.65;cursor:not-allowed;}
        .ss-saved{font-family:'DM Sans',sans-serif;font-size:12px;color:#27ae60;}
        .ss-error{font-family:'DM Sans',sans-serif;font-size:12px;color:#c0392b;}
        @media (max-width: 768px){
          .ss-card{padding:18px;}
        }
      `}</style>

      <h1 className="ss-heading">Site Settings</h1>

      <div className="ss-tabs">
        {TABS.map((t) => (
          <button
            key={t}
            className={`ss-tab${tab === t ? " active" : ""}`}
            onClick={() => setTab(t)}
          >
            {t}
          </button>
        ))}
      </div>

      {loading ? (
        <p
          style={{
            fontFamily: "'DM Sans',sans-serif",
            fontSize: 13,
            color: "rgba(104,80,68,0.45)",
          }}
        >
          Loading…
        </p>
      ) : error && !saving ? (
        <div className="ss-card">
          <p className="ss-error" style={{ margin: 0 }}>
            {error}
          </p>
        </div>
      ) : (
        <div className="ss-card">
          {tab === "general" && (
            <>
              <Field
                label="Site Name"
                value={settings.siteName}
                onChange={(v) => set("siteName", v)}
              />

              <Field
                label="Site Tagline"
                value={settings.siteTagline}
                onChange={(v) => set("siteTagline", v)}
              />

              <Field
                label="Company Description"
                value={settings.companyDescription}
                onChange={(v) => set("companyDescription", v)}
                multiline
              />
            </>
          )}

          {tab === "contact" && (
            <>
              <Row2>
                <Field
                  label="Email"
                  type="email"
                  value={settings.email}
                  onChange={(v) => set("email", v)}
                />
                <Field
                  label="Phone"
                  value={settings.phone}
                  onChange={(v) => set("phone", v)}
                />
              </Row2>

              <Field
                label="WhatsApp"
                value={settings.whatsapp}
                onChange={(v) => set("whatsapp", v)}
                placeholder="https://wa.me/..."
              />

              <Field
                label="Address"
                value={settings.address}
                onChange={(v) => set("address", v)}
                multiline
              />
            </>
          )}

          {tab === "brand" && (
            <>
              <FileUpload
                label="Logo"
                current={logoPreview || settings.logoUrl}
                onFile={handleLogoFile}
              />

              <FileUpload
                label="Favicon"
                current={faviconPreview || settings.faviconUrl}
                onFile={handleFaviconFile}
              />

              <FileUpload
                label="Default Social Image"
                current={socialPreview || settings.defaultSocialImage}
                onFile={handleSocialImageFile}
              />
            </>
          )}

          {tab === "social" && (
            <>
              <Field
                label="Facebook URL"
                value={settings.facebookUrl}
                onChange={(v) => set("facebookUrl", v)}
                placeholder="https://facebook.com/..."
              />

              <Field
                label="LinkedIn URL"
                value={settings.linkedinUrl}
                onChange={(v) => set("linkedinUrl", v)}
                placeholder="https://linkedin.com/..."
              />

              <Field
                label="Instagram URL"
                value={settings.instagramUrl}
                onChange={(v) => set("instagramUrl", v)}
                placeholder="https://instagram.com/..."
              />

              <Field
                label="Twitter / X URL"
                value={settings.twitterUrl}
                onChange={(v) => set("twitterUrl", v)}
                placeholder="https://x.com/..."
              />

              <Field
                label="YouTube URL"
                value={settings.youtubeUrl}
                onChange={(v) => set("youtubeUrl", v)}
                placeholder="https://youtube.com/..."
              />
            </>
          )}

          {tab === "footer" && (
            <>
              <Field
                label="Copyright Text"
                value={settings.copyrightText}
                onChange={(v) => set("copyrightText", v)}
                multiline
                placeholder="© 2026 Dhanamitra Infotech LLP. All rights reserved."
              />

              <Field
                label="Footer Description"
                value={settings.footerDescription}
                onChange={(v) => set("footerDescription", v)}
                multiline
                placeholder="Short footer description..."
              />
            </>
          )}

          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 16,
              paddingTop: 8,
              borderTop: "1px solid rgba(104,80,68,0.07)",
              flexWrap: "wrap",
            }}
          >
            <button className="ss-save" disabled={saving} onClick={handleSave}>
              {saving ? "Saving…" : "Save Settings"}
            </button>

            {saved && <span className="ss-saved">✓ Saved</span>}
            {error && <span className="ss-error">{error}</span>}
          </div>
        </div>
      )}
    </div>
  );
}