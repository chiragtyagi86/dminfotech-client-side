// src/lib/structuredData.js
// JSON-LD schema.org builders for SEO / GEO / AEO.
// Each builder returns a plain object; <Seo jsonLd={[...]} /> serialises them.
import siteConfig from "../config/site";

const SITE_URL = (
  import.meta.env.VITE_SITE_URL ||
  siteConfig.url ||
  "https://dmifotech.com"
).replace(/\/$/, "");

/** Absolute URL from a path or pass-through if already absolute. */
export function abs(path = "") {
  if (!path) return SITE_URL;
  const s = String(path);
  if (s.startsWith("http")) return s;
  return `${SITE_URL}/${s.replace(/^\/+/, "")}`;
}

/** Social profile URLs → sameAs entity graph. */
function sameAs() {
  return [
    siteConfig.facebookUrl,
    siteConfig.linkedinUrl,
    siteConfig.instagramUrl,
    siteConfig.twitterUrl,
    siteConfig.youtubeUrl,
  ].filter(Boolean);
}

/** PostalAddress node from structured NAP, only if a locality exists. */
function postalAddress() {
  const a = siteConfig.addressDetails || {};
  if (!a.addressLocality) return null;
  return {
    "@type": "PostalAddress",
    streetAddress: a.streetAddress || undefined,
    addressLocality: a.addressLocality,
    addressRegion: a.addressRegion || undefined,
    postalCode: a.postalCode || undefined,
    addressCountry: a.addressCountry || "IN",
  };
}

function geoPoint() {
  const g = siteConfig.geo || {};
  if (!g.latitude || !g.longitude) return null;
  return { "@type": "GeoCoordinates", latitude: g.latitude, longitude: g.longitude };
}

/** Stable @id so schema nodes can reference one entity. */
export const ORG_ID = `${SITE_URL}/#organization`;
export const WEBSITE_ID = `${SITE_URL}/#website`;

/** Organization — the brand entity. Anchor for E-E-A-T + GEO. */
export function organizationSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    "@id": ORG_ID,
    name: siteConfig.name,
    alternateName: siteConfig.shortName || undefined,
    url: SITE_URL,
    logo: abs(siteConfig.logo || "/logo.svg"),
    image: abs(siteConfig.ogImage || "/logo.svg"),
    description: siteConfig.description,
    email: siteConfig.contactEmail || undefined,
    telephone: siteConfig.phone || undefined,
    foundingDate: siteConfig.foundingDate || undefined,
    address: postalAddress() || undefined,
    areaServed: siteConfig.areaServed || undefined,
    sameAs: sameAs(),
    knowsAbout: siteConfig.serviceOfferings || undefined,
  };
}

/** LocalBusiness — drives Google local pack + "near me" + voice search. */
export function localBusinessSchema() {
  const addr = postalAddress();
  return {
    "@context": "https://schema.org",
    "@type": "ProfessionalService",
    "@id": `${SITE_URL}/#localbusiness`,
    name: siteConfig.name,
    image: abs(siteConfig.ogImage || "/logo.svg"),
    url: SITE_URL,
    telephone: siteConfig.phone || undefined,
    email: siteConfig.contactEmail || undefined,
    priceRange: siteConfig.priceRange || undefined,
    address: addr || undefined,
    geo: geoPoint() || undefined,
    hasMap: siteConfig.mapUrl || undefined,
    areaServed: siteConfig.areaServed || undefined,
    openingHours: siteConfig.openingHours || undefined,
    sameAs: sameAs(),
    parentOrganization: { "@id": ORG_ID },
  };
}

/** WebSite + SearchAction — enables sitelinks search box. */
export function websiteSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "@id": WEBSITE_ID,
    url: SITE_URL,
    name: siteConfig.name,
    description: siteConfig.description,
    publisher: { "@id": ORG_ID },
    potentialAction: {
      "@type": "SearchAction",
      target: {
        "@type": "EntryPoint",
        urlTemplate: `${SITE_URL}/blog?q={search_term_string}`,
      },
      "query-input": "required name=search_term_string",
    },
  };
}

/** BreadcrumbList from [{name, path}] crumbs. */
export function breadcrumbSchema(crumbs = []) {
  if (!crumbs.length) return null;
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: crumbs.map((c, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: c.name,
      item: abs(c.path),
    })),
  };
}

/** Service node — for service detail pages. */
export function serviceSchema({ name, description, url, image, category } = {}) {
  return {
    "@context": "https://schema.org",
    "@type": "Service",
    name,
    description: description || undefined,
    serviceType: category || undefined,
    url: abs(url),
    image: image ? abs(image) : undefined,
    provider: { "@id": ORG_ID },
    areaServed: siteConfig.areaServed || undefined,
  };
}

/** Article node — for blog posts (GEO/AEO citation signal). */
export function articleSchema({
  title,
  description,
  url,
  image,
  datePublished,
  dateModified,
  author,
  category,
} = {}) {
  return {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: title,
    description: description || undefined,
    image: image ? abs(image) : undefined,
    url: abs(url),
    mainEntityOfPage: { "@type": "WebPage", "@id": abs(url) },
    datePublished: datePublished || undefined,
    dateModified: dateModified || datePublished || undefined,
    articleSection: category || undefined,
    author: author
      ? { "@type": "Person", name: author }
      : { "@id": ORG_ID },
    publisher: { "@id": ORG_ID },
  };
}

/** FAQPage node from [{question, answer}] — wins AEO featured snippets. */
export function faqSchema(items = []) {
  const valid = (items || []).filter((i) => i && i.question && i.answer);
  if (!valid.length) return null;
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: valid.map((i) => ({
      "@type": "Question",
      name: i.question,
      acceptedAnswer: { "@type": "Answer", text: i.answer },
    })),
  };
}
