import { createContext, useContext, useEffect, useMemo, useState } from "react";
import siteConfigFallback from "../config/site";
import { api } from "../lib/api";

const SiteConfigContext = createContext({
  siteConfig: siteConfigFallback,
  loading: true,
  error: "",
});

function buildAbsoluteMediaUrl(path) {
  if (!path) return "";
  if (path.startsWith("http://") || path.startsWith("https://")) return path;

  const base = import.meta.env.VITE_API_URL || "";
  return `${base}${path}`;
}

function mergeSiteConfig(fallback, payload = {}, cmsPages = []) {
  const settings = payload.settings || {};
  const media = payload.media || {};

  const publicPages = Array.isArray(cmsPages)
    ? cmsPages.filter((page) => page && page.href && page.label)
    : [];

  return {
    ...fallback,

    name: settings.siteName || fallback.name,
    description: settings.companyDescription || fallback.description,
    contactEmail: settings.email || fallback.contactEmail,
    phone: settings.phone || fallback.phone,
    whatsapp: settings.whatsapp || fallback.whatsapp,
    address: settings.address || fallback.address,
    siteTagline: settings.siteTagline || fallback.siteTagline,

    facebookUrl: settings.facebookUrl || fallback.facebookUrl,
    linkedinUrl: settings.linkedinUrl || fallback.linkedinUrl,
    instagramUrl: settings.instagramUrl || fallback.instagramUrl,
    twitterUrl: settings.twitterUrl || fallback.twitterUrl,
    youtubeUrl: settings.youtubeUrl || fallback.youtubeUrl,

    copyrightText: settings.copyrightText || fallback.copyrightText,
    footerDescription: settings.footerDescription || fallback.footerDescription,

    ogImage:
      buildAbsoluteMediaUrl(media.defaultSocialImage?.filePath) || fallback.ogImage,

    logo:
      buildAbsoluteMediaUrl(media.logo?.filePath) || fallback.logo || "/mobile-logo.svg",

    favicon:
      buildAbsoluteMediaUrl(media.favicon?.filePath) || fallback.favicon || "",

    navLinks: fallback.navLinks,
    cmsPages: publicPages,
    shortName: fallback.shortName,
    url: fallback.url,
  };
}

export function SiteConfigProvider({ children }) {
  const [siteConfig, setSiteConfig] = useState(siteConfigFallback);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let mounted = true;

    async function loadConfig() {
      try {
        setLoading(true);
        setError("");

        const [settingsResult, pagesResult] = await Promise.allSettled([
          api.getPublicSettings(),
          api.getPages(),
        ]);

        const payload = settingsResult.status === "fulfilled"
          ? settingsResult.value?.data ?? settingsResult.value ?? {}
          : {};

        let cmsPages = [];
        if (pagesResult.status === "fulfilled") {
          const pagesData = pagesResult.value ?? [];
          // Handle both array and wrapped response
          cmsPages = Array.isArray(pagesData) ? pagesData : (pagesData.data ?? []);
        }

        if (!mounted) return;

        setSiteConfig(mergeSiteConfig(siteConfigFallback, payload, cmsPages));

        if (settingsResult.status === "rejected") {
          console.error("Failed to load public site settings:", settingsResult.reason);
          setError(settingsResult.reason?.message || "Failed to load site settings.");
        }
        if (pagesResult.status === "rejected") {
          console.error("Failed to load CMS pages:", pagesResult.reason);
        }
      } catch (err) {
        console.error("Failed to load public site settings:", err);

        if (!mounted) return;

        setSiteConfig(siteConfigFallback);
        setError(err?.message || "Failed to load site settings.");
      } finally {
        if (mounted) setLoading(false);
      }
    }

    loadConfig();

    return () => {
      mounted = false;
    };
  }, []);

  const value = useMemo(
    () => ({ siteConfig, loading, error }),
    [siteConfig, loading, error]
  );

  return (
    <SiteConfigContext.Provider value={value}>
      {children}
    </SiteConfigContext.Provider>
  );
}

export function useSiteConfig() {
  return useContext(SiteConfigContext);
}