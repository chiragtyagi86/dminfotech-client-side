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
  const siteUrl = import.meta.env.VITE_SITE_URL || siteConfig.url || window.location.origin;
  const fullUrl = url ? `${siteUrl}${url}` : window.location.href;
  const resolvedImage = image || siteConfig.ogImage || "/logo.png";
  const fullImage = resolvedImage.startsWith("http")
    ? resolvedImage
    : `${siteUrl}${resolvedImage}`;

  const pageTitle = title || siteConfig.name;
  const pageDescription = description || siteConfig.description;
  const keywordString = Array.isArray(keywords)
    ? keywords.join(", ")
    : keywords;

  return (
    <Helmet>
      <title>{pageTitle}</title>

      <meta name="description" content={pageDescription} />

      {keywordString && (
        <meta name="keywords" content={keywordString} />
      )}

      <meta name="robots" content="index, follow" />

      <link rel="canonical" href={fullUrl} />

      {/* Open Graph */}
      <meta property="og:type" content={type} />
      <meta property="og:site_name" content={siteConfig.name} />
      <meta property="og:title" content={pageTitle} />
      <meta property="og:description" content={pageDescription} />
      <meta property="og:url" content={fullUrl} />
      <meta property="og:image" content={fullImage} />

      {/* Twitter */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={pageTitle} />
      <meta name="twitter:description" content={pageDescription} />
      <meta name="twitter:image" content={fullImage} />
    </Helmet>
  );
}