// src/admin/settings/index.jsx
import { useEffect, useRef, useState } from "react";
import { adminApi } from "../../lib/api";

// ── Sub-components defined OUTSIDE main component ──────────────────────────
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
// ────────────────────────────────────────────────────────────────────────────

const TABS = ["general", "contact", "brand", "social", "footer"];

const DEFAULT_SETTINGS = {
  siteName: "",
  tagline: "",
  timezone: "",
  language: "en",

  email: "",
  phone: "",
  address: "",
  mapEmbed: "",

  logoUrl: "",
  faviconUrl: "",
  primaryColor: "#3a405a",
  accentColor: "#e9afa3",

  facebook: "",
  twitter: "",
  instagram: "",
  linkedin: "",
  youtube: "",

  footerText: "",
  footerLinks: [],
};

function normalizeSettings(input = {}) {
  return {
    ...DEFAULT_SETTINGS,
    ...input,
    footerLinks: Array.isArray(input.footerLinks) ? input.footerLinks : [],
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

  const [logoPreview, setLogoPreview] = useState("");
  const [faviconPreview, setFaviconPreview] = useState("");

  useEffect(() => {
    let mounted = true;

    async function loadSettings() {
      try {
        setLoading(true);
        setError("");

        const d = await adminApi.getSettings();
        const payload = d?.data ?? d ?? {};
        const normalized = normalizeSettings(payload);

        if (!mounted) return;

        setSettings(normalized);
        setLogoPreview(normalized.logoUrl || "");
        setFaviconPreview(normalized.faviconUrl || "");
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
      if (logoPreview && logoPreview.startsWith("blob:")) {
        URL.revokeObjectURL(logoPreview);
      }
      if (faviconPreview && faviconPreview.startsWith("blob:")) {
        URL.revokeObjectURL(faviconPreview);
      }
    };
  }, [logoPreview, faviconPreview]);

  function set(key, value) {
    setSettings((prev) => ({ ...prev, [key]: value }));
  }

  function handleLogoFile(file) {
    if (logoPreview && logoPreview.startsWith("blob:")) {
      URL.revokeObjectURL(logoPreview);
    }
    setLogoFile(file);
    setLogoPreview(URL.createObjectURL(file));
  }

  function handleFaviconFile(file) {
    if (faviconPreview && faviconPreview.startsWith("blob:")) {
      URL.revokeObjectURL(faviconPreview);
    }
    setFaviconFile(file);
    setFaviconPreview(URL.createObjectURL(file));
  }

  function addFooterLink() {
    set("footerLinks", [...settings.footerLinks, { label: "", href: "" }]);
  }

  function setFL(i, k, v) {
    set(
      "footerLinks",
      settings.footerLinks.map((l, idx) => (idx === i ? { ...l, [k]: v } : l))
    );
  }

  function remFL(i) {
    set(
      "footerLinks",
      settings.footerLinks.filter((_, idx) => idx !== i)
    );
  }

  async function uploadIfNeeded(fieldName, file) {
    if (!file) return null;

    const fd = new FormData();
    fd.append("file", file);

    const res = await adminApi.uploadMedia(fd);
    const payload = res?.data ?? res ?? {};

    return (
      payload.url ||
      payload.fileUrl ||
      payload.path ||
      payload.location ||
      payload.secure_url ||
      payload.src ||
      payload[fieldName] ||
      null
    );
  }

  async function handleSave() {
    try {
      setSaving(true);
      setSaved(false);
      setError("");

      let nextLogoUrl = settings.logoUrl;
      let nextFaviconUrl = settings.faviconUrl;

      if (logoFile) {
        const uploadedLogo = await uploadIfNeeded("logoUrl", logoFile);
        if (uploadedLogo) nextLogoUrl = uploadedLogo;
      }

      if (faviconFile) {
        const uploadedFavicon = await uploadIfNeeded("faviconUrl", faviconFile);
        if (uploadedFavicon) nextFaviconUrl = uploadedFavicon;
      }

      const payload = {
        ...settings,
        logoUrl: nextLogoUrl,
        faviconUrl: nextFaviconUrl,
        footerLinks: Array.isArray(settings.footerLinks)
          ? settings.footerLinks
              .map((item) => ({
                label: (item?.label || "").trim(),
                href: (item?.href || "").trim(),
              }))
              .filter((item) => item.label || item.href)
          : [],
      };

      await adminApi.updateSettings(payload);

      setSettings(normalizeSettings(payload));
      setLogoFile(null);
      setFaviconFile(null);
      setLogoPreview(nextLogoUrl || "");
      setFaviconPreview(nextFaviconUrl || "");

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
        .fl-row{display:grid;grid-template-columns:1fr 1fr auto;gap:10px;align-items:center;margin-bottom:10px;}
        .fl-inp{padding:9px 12px;border-radius:8px;border:1px solid rgba(104,80,68,0.12);background:#fdfaf8;font-family:'DM Sans',sans-serif;font-size:13px;color:#3a405a;width:100%;outline:none;}
        .fl-add{padding:8px 16px;border-radius:8px;border:1px dashed rgba(104,80,68,0.20);background:none;font-family:'DM Sans',sans-serif;font-size:12px;color:rgba(104,80,68,0.50);cursor:pointer;margin-top:4px;}
        .ss-color-wrap{display:flex;align-items:center;gap:12px;flex-wrap:wrap;}
        .ss-color-preview{width:36px;height:36px;border-radius:8px;border:1px solid rgba(104,80,68,0.12);}
        @media (max-width: 768px){
          .ss-card{padding:18px;}
          .fl-row{grid-template-columns:1fr;}
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
              <Field label="Site Name" value={settings.siteName} onChange={(v) => set("siteName", v)} />
              <Field label="Tagline" value={settings.tagline} onChange={(v) => set("tagline", v)} />
              <Row2>
                <Field
                  label="Language"
                  value={settings.language}
                  onChange={(v) => set("language", v)}
                  placeholder="en"
                />
                <Field
                  label="Timezone"
                  value={settings.timezone}
                  onChange={(v) => set("timezone", v)}
                  placeholder="Asia/Kolkata"
                />
              </Row2>
            </>
          )}

          {tab === "contact" && (
            <>
              <Row2>
                <Field
                  label="Email"
                  value={settings.email}
                  onChange={(v) => set("email", v)}
                  type="email"
                />
                <Field
                  label="Phone"
                  value={settings.phone}
                  onChange={(v) => set("phone", v)}
                />
              </Row2>
              <Field
                label="Address"
                value={settings.address}
                onChange={(v) => set("address", v)}
                multiline
              />
              <Field
                label="Map Embed URL"
                value={settings.mapEmbed}
                onChange={(v) => set("mapEmbed", v)}
                placeholder="Google Maps embed URL"
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
                  Primary Colour
                </label>
                <div className="ss-color-wrap">
                  <div className="ss-color-preview" style={{ background: settings.primaryColor }} />
                  <input
                    type="color"
                    value={settings.primaryColor}
                    onChange={(e) => set("primaryColor", e.target.value)}
                  />
                  <span
                    style={{
                      fontFamily: "'DM Sans',sans-serif",
                      fontSize: 13,
                      color: "rgba(104,80,68,0.50)",
                    }}
                  >
                    {settings.primaryColor}
                  </span>
                </div>
              </div>

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
                  Accent Colour
                </label>
                <div className="ss-color-wrap">
                  <div className="ss-color-preview" style={{ background: settings.accentColor }} />
                  <input
                    type="color"
                    value={settings.accentColor}
                    onChange={(e) => set("accentColor", e.target.value)}
                  />
                  <span
                    style={{
                      fontFamily: "'DM Sans',sans-serif",
                      fontSize: 13,
                      color: "rgba(104,80,68,0.50)",
                    }}
                  >
                    {settings.accentColor}
                  </span>
                </div>
              </div>
            </>
          )}

          {tab === "social" && (
            <>
              {[
                ["Facebook", "facebook"],
                ["Twitter / X", "twitter"],
                ["Instagram", "instagram"],
                ["LinkedIn", "linkedin"],
                ["YouTube", "youtube"],
              ].map(([label, key]) => (
                <Field
                  key={key}
                  label={label}
                  value={settings[key] || ""}
                  onChange={(v) => set(key, v)}
                  placeholder="https://…"
                />
              ))}
            </>
          )}

          {tab === "footer" && (
            <>
              <Field
                label="Footer Text"
                value={settings.footerText}
                onChange={(v) => set("footerText", v)}
                multiline
                placeholder="© 2024 Dhanamitra. All rights reserved."
              />

              <div style={{ marginBottom: 18 }}>
                <label
                  style={{
                    fontFamily: "'DM Sans',sans-serif",
                    fontSize: 10.5,
                    fontWeight: 500,
                    letterSpacing: "0.13em",
                    textTransform: "uppercase",
                    color: "rgba(104,80,68,0.55)",
                    display: "block",
                    marginBottom: 10,
                  }}
                >
                  Footer Links
                </label>

                {(settings.footerLinks || []).map((link, i) => (
                  <div key={i} className="fl-row">
                    <input
                      className="fl-inp"
                      placeholder="Label"
                      value={link.label}
                      onChange={(e) => setFL(i, "label", e.target.value)}
                    />
                    <input
                      className="fl-inp"
                      placeholder="URL"
                      value={link.href}
                      onChange={(e) => setFL(i, "href", e.target.value)}
                    />
                    <button
                      type="button"
                      onClick={() => remFL(i)}
                      style={{
                        padding: "9px 12px",
                        border: "1px solid rgba(192,57,43,0.18)",
                        borderRadius: 8,
                        background: "rgba(192,57,43,0.05)",
                        color: "#c0392b",
                        cursor: "pointer",
                        fontSize: 16,
                        flexShrink: 0,
                      }}
                    >
                      ×
                    </button>
                  </div>
                ))}

                <button type="button" className="fl-add" onClick={addFooterLink}>
                  + Add Link
                </button>
              </div>
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