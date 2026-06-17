import { Helmet } from "react-helmet-async";
import { useSiteConfig } from "../../context/SiteConfigContext.jsx";

export default function Seo({
  title = "",
  description = "",
  keywords = [],
  image = "",
  url = "",
  type = "website",
}) {
  const { siteConfig } = useSiteConfig();

  const siteUrl =
    import.meta.env.VITE_SITE_URL ||
    siteConfig?.url ||
    window.location.origin;

  const cleanSiteUrl = siteUrl.replace(/\/$/, "");
  const cleanUrl = url ? `/${String(url).replace(/^\/+/, "")}` : window.location.pathname;
  const fullUrl = `${cleanSiteUrl}${cleanUrl}`;

  const resolvedImage = image || siteConfig?.ogImage || "/logo.png";
  const fullImage = resolvedImage.startsWith("http")
    ? resolvedImage
    : `${cleanSiteUrl}/${resolvedImage.replace(/^\/+/, "")}`;

  const pageTitle =
    title || siteConfig?.name || "Dhanamitra Infotech LLP";

  const pageDescription =
    description ||
    siteConfig?.description ||
    "Dhanamitra Infotech LLP delivers website development, software solutions, ERP systems, digital marketing and business automation services.";

  const keywordString = Array.isArray(keywords)
    ? keywords.filter(Boolean).join(", ")
    : String(keywords || "");

  return (
    <Helmet prioritizeSeoTags>
      <title>{pageTitle}</title>

      <meta name="description" content={pageDescription} />
      <meta name="robots" content="index, follow" />

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
    </Helmet>
  );
}