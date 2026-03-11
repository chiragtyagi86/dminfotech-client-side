import { Helmet } from "react-helmet-async";

export default function Seo({
  title = "Dhanamitra Infotech LLP",
  description = "ISO 9001:2015 certified company delivering website development, software solutions, and digital transformation services.",
  keywords = [],
  image = "/logo.png",
  url = "",
  type = "website",
}) {
  const siteUrl = import.meta.env.VITE_SITE_URL || window.location.origin;
  const fullUrl = url ? `${siteUrl}${url}` : window.location.href;
  const fullImage = image?.startsWith("http") ? image : `${siteUrl}${image}`;

  const keywordString = Array.isArray(keywords)
    ? keywords.join(", ")
    : keywords;

  return (
    <Helmet>
      <title>{title}</title>

      <meta name="description" content={description} />

      {keywordString && (
        <meta name="keywords" content={keywordString} />
      )}

      <meta name="robots" content="index, follow" />

      <link rel="canonical" href={fullUrl} />

      {/* Open Graph */}
      <meta property="og:type" content={type} />
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:url" content={fullUrl} />
      <meta property="og:image" content={fullImage} />

      {/* Twitter */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={fullImage} />
    </Helmet>
  );
}