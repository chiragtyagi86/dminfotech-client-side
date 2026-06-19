import { Helmet } from "react-helmet-async";
import { useEffect, useMemo, useState } from "react";
import { useSiteConfig } from "../../context/SiteConfigContext.jsx";
import { api } from "../../lib/api";

export default function Seo({
  title = "",
  description = "",
  keywords = [],
  image = "",
  url = "",
  type = "website",
  entityType = "page",
  slug = "",
  indexEnabled = true,
  jsonLd = [],
}) {
  const { siteConfig } = useSiteConfig();
  const [cmsSeo, setCmsSeo] = useState(null);

  useEffect(() => {
    let mounted = true;

    if (!slug) {
      queueMicrotask(() => {
        if (mounted) setCmsSeo(null);
      });
      return () => {
        mounted = false;
      };
    }

    api
      .getPageSeo(entityType, slug)
      .then((res) => {
        if (mounted) setCmsSeo(res?.data || res || null);
      })
      .catch(() => {
        if (mounted) setCmsSeo(null);
      });

    return () => {
      mounted = false;
    };
  }, [entityType, slug]);

  const siteUrl =
    import.meta.env.VITE_SITE_URL ||
    siteConfig?.url ||
    window.location.origin;

  const cleanSiteUrl = siteUrl.replace(/\/$/, "");
  const canonicalPath = cmsSeo?.canonicalUrl || url;
  const cleanUrl = canonicalPath
    ? String(canonicalPath).startsWith("http")
      ? String(canonicalPath)
      : `/${String(canonicalPath).replace(/^\/+/, "")}`
    : window.location.pathname;
  const fullUrl = cleanUrl.startsWith("http") ? cleanUrl : `${cleanSiteUrl}${cleanUrl}`;

  const pageTitle = useMemo(
    () => cmsSeo?.ogTitle || cmsSeo?.metaTitle || title || siteConfig?.name || "Dhanamitra Infotech LLP",
    [cmsSeo, title, siteConfig?.name]
  );

  const pageDescription = useMemo(
    () =>
      cmsSeo?.ogDescription ||
      cmsSeo?.metaDescription ||
      description ||
      siteConfig?.description ||
      "Dhanamitra Infotech LLP delivers website development, software solutions, ERP systems, digital marketing and business automation services.",
    [cmsSeo, description, siteConfig?.description]
  );

  const resolvedImage = cmsSeo?.ogImage || image || siteConfig?.ogImage || "/logo.png";
  const fullImage = resolvedImage.startsWith("http")
    ? resolvedImage
    : `${cleanSiteUrl}/${resolvedImage.replace(/^\/+/, "")}`;

  const resolvedKeywords = cmsSeo?.keywords || keywords;
  const keywordString = Array.isArray(resolvedKeywords)
    ? resolvedKeywords.filter(Boolean).join(", ")
    : String(resolvedKeywords || "");

  const robots = cmsSeo?.indexEnabled === false || indexEnabled === false
    ? "noindex, nofollow"
    : "index, follow";

  return (
    <Helmet prioritizeSeoTags>
      <title>{pageTitle}</title>

      <meta name="description" content={pageDescription} />
      <meta name="robots" content={robots} />

      {keywordString && <meta name="keywords" content={keywordString} />}

      <link rel="canonical" href={fullUrl} />

      <meta property="og:type" content={type} />
      <meta property="og:site_name" content={siteConfig?.name || "Dhanamitra Infotech LLP"} />
      <meta property="og:title" content={pageTitle} />
      <meta property="og:description" content={pageDescription} />
      <meta property="og:url" content={fullUrl} />
      <meta property="og:image" content={fullImage} />

      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={pageTitle} />
      <meta name="twitter:description" content={pageDescription} />
      <meta name="twitter:image" content={fullImage} />

      {(Array.isArray(jsonLd) ? jsonLd : [jsonLd])
        .filter(Boolean)
        .map((schema, i) => (
          <script key={i} type="application/ld+json">
            {JSON.stringify(schema)}
          </script>
        ))}
    </Helmet>
  );
}
