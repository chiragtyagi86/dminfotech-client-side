import fs from "fs/promises";
import fsSync from "fs";
import path from "path";
import { getPublicEntitySeo } from "./seo.service";

type SeoPayload = {
  title: string;
  description: string;
  image: string;
  url: string;
  keywords?: string;
  indexEnabled?: boolean;
  type?: string;
  ogTitle?: string;
  ogDescription?: string;
  ogImageAlt?: string;
  twitterTitle?: string;
  twitterDescription?: string;
  twitterImage?: string;
};

type SeoRoute = Omit<SeoPayload, "url"> & {
  slug?: string;
  entityType?: "page" | "blog";
  canonicalPath?: string;
};

const DEFAULT_OG_IMAGE = "https://dmifotech.com/ticket.png";
const DEFAULT_OG_ALT = "Dhanamitra Infotech LLP digital solutions and technology services";

const defaultSeo: SeoRoute = {
  title: "Dhanamitra Infotech LLP | Website, Software & Digital Marketing Company",
  description:
    "Dhanamitra Infotech LLP delivers website development, software solutions, ERP systems, digital marketing, business automation and IT consulting services.",
  image: DEFAULT_OG_IMAGE,
  ogImageAlt: DEFAULT_OG_ALT,
  entityType: "page",
  slug: "home",
  canonicalPath: "/",
};

const homeSeo: SeoRoute = {
  slug: "home",
  entityType: "page",
  canonicalPath: "/",
  title: "Dhanamitra Infotech LLP | Website, Software & Digital Marketing Company",
  description:
    "Dhanamitra Infotech LLP delivers website development, software solutions, ERP systems, digital marketing, business automation and IT consulting services.",
  image: DEFAULT_OG_IMAGE,
  ogImageAlt: DEFAULT_OG_ALT,
};

const fallbackByPath: Record<string, SeoRoute> = {
  "/": {
    ...homeSeo,
    canonicalPath: "/",
  },
  "/home": {
    ...homeSeo,
  },
  "/about": {
    slug: "about",
    entityType: "page",
    title: "About | Dhanamitra Infotech LLP — Digital Solutions, Software & Business Growth",
    description:
      "Dhanamitra Infotech LLP is an ISO 9001:2015 certified digital solutions company delivering website development, custom software, IT placements, journal publishing and stock market training for modern businesses.",
    image: DEFAULT_OG_IMAGE,
    ogImageAlt: "About Dhanamitra Infotech LLP digital solutions company",
  },
  "/services": {
    slug: "services",
    entityType: "page",
    title: "Services | Dhanamitra Infotech LLP — Digital Solutions, Software & Business Growth",
    description:
      "Discover Dhanamitra Infotech LLP's comprehensive services including website development, custom software solutions, IT placements, journal publishing and stock market training for modern businesses.",
    image: DEFAULT_OG_IMAGE,
    ogImageAlt: "Dhanamitra Infotech LLP services for web software and digital growth",
  },
  "/portfolio": {
    slug: "portfolio",
    entityType: "page",
    title: "Portfolio | Dhanamitra Infotech LLP — Digital Solutions, Software & Business Growth",
    description:
      "Explore Dhanamitra Infotech LLP's portfolio showcasing our expertise in website development, custom software, IT placements, journal publishing and stock market training for modern businesses.",
    image: DEFAULT_OG_IMAGE,
    ogImageAlt: "Dhanamitra Infotech LLP portfolio and technology projects",
  },
  "/blog": {
    slug: "blog",
    entityType: "page",
    title: "Blog | Dhanamitra Infotech LLP — Digital Solutions, Software & Business Growth",
    description:
      "Explore Dhanamitra Infotech LLP's blog for insights on website development, custom software, digital strategy, SEO architecture and business technology for modern businesses.",
    image: DEFAULT_OG_IMAGE,
    ogImageAlt: "Dhanamitra Infotech LLP blog and digital insights",
  },
  "/careers": {
    slug: "careers",
    entityType: "page",
    title: "Careers | Dhanamitra Infotech LLP — Join Our Team of Digital Innovators",
    description:
      "Explore career opportunities at Dhanamitra Infotech LLP, an ISO 9001:2015 certified digital solutions company. Join us to work on real projects, grow your skills, and make an impact in the tech industry.",
    image: DEFAULT_OG_IMAGE,
    ogImageAlt: "Careers at Dhanamitra Infotech LLP",
  },
  "/contact": {
    slug: "contact",
    entityType: "page",
    title: "Contact Us | Dhanamitra Infotech LLP — Digital Solutions, Software & Business Growth",
    description:
      "Get in touch with Dhanamitra Infotech LLP for website development, software solutions, IT placements, journal publishing and stock market training. Contact us today!",
    image: DEFAULT_OG_IMAGE,
    ogImageAlt: "Contact Dhanamitra Infotech LLP",
  },
  "/team": {
    slug: "team",
    entityType: "page",
    title: "Our Team | Dhanamitra Infotech LLP — Digital Solutions, Software & Business Growth",
    description:
      "Meet the passionate team behind Dhanamitra Infotech LLP, delivering innovative digital solutions, software development and business growth services with expertise and dedication.",
    image: DEFAULT_OG_IMAGE,
    ogImageAlt: "Dhanamitra Infotech LLP team",
  },
  "/testimonials": {
    slug: "testimonials",
    entityType: "page",
    title: "Client Testimonials | Dhanamitra Infotech LLP — Digital Solutions, Software & Business Growth",
    description:
      "Discover what our clients have to say about their experience working with Dhanamitra Infotech LLP. Read real testimonials highlighting our commitment to excellence in digital solutions, software development, and business growth.",
    image: DEFAULT_OG_IMAGE,
    ogImageAlt: "Client testimonials for Dhanamitra Infotech LLP",
  },
  "/privacy-policy": {
    slug: "privacy-policy",
    entityType: "page",
    title: "Privacy Policy | Dhanamitra Infotech LLP",
    description:
      "Read the privacy policy for Dhanamitra Infotech LLP, including how we collect, use and protect information shared with our website and services.",
    image: DEFAULT_OG_IMAGE,
    ogImageAlt: DEFAULT_OG_ALT,
  },
  "/terms-and-conditions": {
    slug: "terms-and-conditions",
    entityType: "page",
    title: "Terms and Conditions | Dhanamitra Infotech LLP",
    description:
      "Read the terms and conditions for using Dhanamitra Infotech LLP services, website and digital platforms.",
    image: DEFAULT_OG_IMAGE,
    ogImageAlt: DEFAULT_OG_ALT,
  },
  "/refund-policy": {
    slug: "refund-policy",
    entityType: "page",
    title: "Refund Policy | Dhanamitra Infotech LLP",
    description:
      "Read the refund policy for Dhanamitra Infotech LLP products, services and digital solutions.",
    image: DEFAULT_OG_IMAGE,
    ogImageAlt: DEFAULT_OG_ALT,
  },
};

function getFrontendDistPath() {
  const candidates = [
    process.env.FRONTEND_DIST_PATH,
    path.resolve(process.cwd(), "public"),
    path.resolve(process.cwd(), "dist", "public"),
    path.resolve(process.cwd(), "..", "client", "dist"),
    path.resolve(__dirname, "..", "public"),
  ].filter(Boolean) as string[];

  return (
    candidates.find((candidate) =>
      fsSync.existsSync(path.join(candidate, "index.html"))
    ) || candidates[0]
  );
}

function siteUrl() {
  return (process.env.SITE_URL || process.env.CLIENT_URL || "https://dmifotech.com").replace(/\/$/, "");
}

function escapeHtml(value: unknown) {
  return String(value ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function normalizePath(requestPath: string) {
  if (!requestPath || requestPath === "/") return "/home";
  const withoutQuery = requestPath.split("?")[0] || "";
  const withLeadingSlash = withoutQuery.startsWith("/") ? withoutQuery : `/${withoutQuery}`;
  const clean = withLeadingSlash.replace(/\/{2,}/g, "/").replace(/\/+$/, "");
  return clean || "/home";
}

function absoluteUrl(value: string | undefined, fallback = DEFAULT_OG_IMAGE) {
  const raw = value || fallback;
  if (/^https?:\/\//i.test(raw)) return raw;
  return `${siteUrl()}/${raw.replace(/^\/+/, "")}`;
}

function pathToSeoLookup(requestPath: string) {
  const cleanPath = normalizePath(requestPath);

  if (fallbackByPath[cleanPath]) {
    return fallbackByPath[cleanPath];
  }

  const blogMatch = cleanPath.match(/^\/blog\/([^/]+)$/);
  if (blogMatch) {
    return {
      slug: blogMatch[1],
      entityType: "blog" as const,
      title: "Dhanamitra Infotech LLP Blog",
      description:
        "Read our latest insights and updates on digital solutions, software development, IT placements, journal publishing, and stock market training.",
      image: DEFAULT_OG_IMAGE,
      ogImageAlt: "Dhanamitra Infotech LLP blog article",
    };
  }

  const dynamicSlug = cleanPath.replace(/^\/+/, "");
  if (dynamicSlug && !dynamicSlug.startsWith("admin") && !dynamicSlug.startsWith("intern")) {
    return {
      slug: dynamicSlug,
      entityType: "page" as const,
      title: "Dhanamitra Infotech LLP",
      description:
        "Dhanamitra Infotech LLP delivers website development, software solutions, ERP systems, digital marketing and business automation services.",
      image: DEFAULT_OG_IMAGE,
      ogImageAlt: DEFAULT_OG_ALT,
    };
  }

  return defaultSeo;
}

async function resolveSeo(requestPath: string): Promise<SeoPayload> {
  const cleanPath = normalizePath(requestPath);
  const fallback = pathToSeoLookup(cleanPath);
  const canonicalPath = cleanPath === "/home" ? "/" : fallback.canonicalPath || cleanPath;
  const url = `${siteUrl()}${canonicalPath === "/" ? "" : canonicalPath}`;

  try {
    if (fallback.slug && fallback.entityType) {
      const cmsSeo = await getPublicEntitySeo(fallback.entityType, fallback.slug);
      const title = cmsSeo.metaTitle || fallback.title;
      const description = cmsSeo.metaDescription || fallback.description;
      const ogTitle = cmsSeo.ogTitle || title;
      const ogDescription = cmsSeo.ogDescription || description;
      const image = cmsSeo.ogImage || fallback.image;
      return {
        title,
        description,
        ogTitle,
        ogDescription,
        image,
        keywords: cmsSeo.keywords || fallback.keywords,
        indexEnabled: cmsSeo.indexEnabled !== false,
        type: fallback.entityType === "blog" ? "article" : "website",
        url: cleanPath === "/" ? url : cmsSeo.canonicalUrl || url,
        ogImageAlt: fallback.ogImageAlt || DEFAULT_OG_ALT,
        twitterTitle: fallback.twitterTitle || ogTitle,
        twitterDescription: fallback.twitterDescription || ogDescription,
        twitterImage: fallback.twitterImage || image,
      };
    }
  } catch {
    // Fall back to static route metadata when CMS SEO is absent.
  }

  return {
    title: fallback.title,
    description: fallback.description,
    image: fallback.image,
    keywords: fallback.keywords,
    indexEnabled: fallback.indexEnabled,
    type: fallback.entityType === "blog" ? "article" : "website",
    url,
    ogTitle: fallback.ogTitle || fallback.title,
    ogDescription: fallback.ogDescription || fallback.description,
    ogImageAlt: fallback.ogImageAlt || DEFAULT_OG_ALT,
    twitterTitle: fallback.twitterTitle || fallback.ogTitle || fallback.title,
    twitterDescription: fallback.twitterDescription || fallback.ogDescription || fallback.description,
    twitterImage: fallback.twitterImage || fallback.image,
  };
}

function metaBlock(seo: SeoPayload) {
  const title = escapeHtml(seo.title);
  const description = escapeHtml(seo.description);
  const ogTitle = escapeHtml(seo.ogTitle || seo.title);
  const ogDescription = escapeHtml(seo.ogDescription || seo.description);
  const image = escapeHtml(absoluteUrl(seo.image));
  const imageAlt = escapeHtml(seo.ogImageAlt || DEFAULT_OG_ALT);
  const twitterTitle = escapeHtml(seo.twitterTitle || seo.ogTitle || seo.title);
  const twitterDescription = escapeHtml(seo.twitterDescription || seo.ogDescription || seo.description);
  const twitterImage = escapeHtml(absoluteUrl(seo.twitterImage || seo.image));
  const url = escapeHtml(seo.url);
  const robots = seo.indexEnabled === false ? "noindex, nofollow" : "index, follow";
  const keywords = seo.keywords ? escapeHtml(seo.keywords) : "";

  return [
    `<title>${title}</title>`,
    `<meta name="description" content="${description}" />`,
    `<meta name="robots" content="${robots}" />`,
    keywords ? `<meta name="keywords" content="${keywords}" />` : "",
    `<link rel="canonical" href="${url}" />`,
    `<meta property="og:type" content="${seo.type || "website"}" />`,
    `<meta property="og:site_name" content="Dhanamitra Infotech LLP" />`,
    `<meta property="og:title" content="${ogTitle}" />`,
    `<meta property="og:description" content="${ogDescription}" />`,
    `<meta property="og:url" content="${url}" />`,
    `<meta property="og:image" content="${image}" />`,
    `<meta property="og:image:alt" content="${imageAlt}" />`,
    `<meta name="twitter:card" content="summary_large_image" />`,
    `<meta name="twitter:title" content="${twitterTitle}" />`,
    `<meta name="twitter:description" content="${twitterDescription}" />`,
    `<meta name="twitter:image" content="${twitterImage}" />`,
  ]
    .filter(Boolean)
    .map((line) => `  ${line}`)
    .join("\n");
}

function stripManagedMeta(html: string) {
  return html
    .replace(/\s*<title>[\s\S]*?<\/title>/gi, "")
    .replace(/\s*<meta name="description"[\s\S]*?>/gi, "")
    .replace(/\s*<meta name="robots"[\s\S]*?>/gi, "")
    .replace(/\s*<meta name="keywords"[\s\S]*?>/gi, "")
    // Attribute-order-independent: strips both `<link rel="canonical" href>`
    // and `<link href rel="canonical">` so we never emit duplicate canonicals.
    .replace(/\s*<link[^>]*rel=["']canonical["'][^>]*>/gi, "")
    .replace(/\s*<meta property="og:[\s\S]*?>/gi, "")
    .replace(/\s*<meta name="twitter:[\s\S]*?>/gi, "")
    // Drop any previously-injected JSON-LD so re-renders never stack schema.
    .replace(/\s*<script type="application\/ld\+json">[\s\S]*?<\/script>/gi, "");
}

// ── Server-side JSON-LD (crawler-visible: works without JS) ──
// Mirrors client config so search engines + AI engines read the brand
// entity, local-pack signals and FAQs from the raw HTML.
const SCHEMA_SITE = {
  name: "Dhanamitra Infotech LLP",
  shortName: "DMIFOTECH",
  phone: "+91-9458766648",
  email: "info@dmifotech.com",
  priceRange: "₹₹",
  openingHours: "Mo-Sa 10:00-19:00",
  foundingDate: "2023",
  address: {
    streetAddress: "O-912, Gaur City Center, Sector 4",
    addressLocality: "Greater Noida West",
    addressRegion: "Uttar Pradesh",
    postalCode: "201318",
    addressCountry: "IN",
  },
  geo: { latitude: "28.6076", longitude: "77.4286" },
  areaServed: ["Greater Noida", "Noida", "Delhi NCR", "Ghaziabad", "India"],
  sameAs: [
    "https://www.facebook.com/people/dmifotech/61570497154705/",
    "https://www.linkedin.com/company/dmifotech/",
    "https://www.instagram.com/dmifotech/",
  ],
  knowsAbout: [
    "Website Development",
    "Digital Marketing",
    "ERP Software Development",
    "Custom Software Solutions",
    "IT Placements",
  ],
};

const HOME_FAQS = [
  {
    question: "What services does Dhanamitra Infotech LLP offer?",
    answer:
      "Dhanamitra Infotech LLP offers website development, digital marketing, ERP software development, custom software solutions and IT placements. We are an ISO 9001:2015 certified company serving startups and growing businesses.",
  },
  {
    question: "Where is Dhanamitra Infotech LLP located?",
    answer:
      "Our office is at O-912, Gaur City Center, Sector 4, Greater Noida West, Uttar Pradesh 201318. We serve clients across Greater Noida, Noida, Delhi NCR, Ghaziabad and all of India.",
  },
  {
    question: "Who is the best website developer in Greater Noida?",
    answer:
      "Dhanamitra Infotech LLP is a leading website development company in Greater Noida West, building fast, responsive and SEO-friendly websites for businesses across Delhi NCR.",
  },
  {
    question: "Do you build custom ERP software?",
    answer:
      "Yes. We design and develop custom ERP software tailored to your business processes, including inventory, billing, CRM, HR and reporting modules.",
  },
];

function buildSchemaGraph(requestPath: string) {
  const base = siteUrl();
  const orgId = `${base}/#organization`;
  const postalAddress = {
    "@type": "PostalAddress",
    ...SCHEMA_SITE.address,
  };

  const organization = {
    "@context": "https://schema.org",
    "@type": "Organization",
    "@id": orgId,
    name: SCHEMA_SITE.name,
    alternateName: SCHEMA_SITE.shortName,
    url: base,
    logo: `${base}/logo.svg`,
    email: SCHEMA_SITE.email,
    telephone: SCHEMA_SITE.phone,
    foundingDate: SCHEMA_SITE.foundingDate,
    address: postalAddress,
    areaServed: SCHEMA_SITE.areaServed,
    sameAs: SCHEMA_SITE.sameAs,
    knowsAbout: SCHEMA_SITE.knowsAbout,
  };

  const localBusiness = {
    "@context": "https://schema.org",
    "@type": "ProfessionalService",
    "@id": `${base}/#localbusiness`,
    name: SCHEMA_SITE.name,
    url: base,
    image: `${base}/logo.svg`,
    telephone: SCHEMA_SITE.phone,
    email: SCHEMA_SITE.email,
    priceRange: SCHEMA_SITE.priceRange,
    address: postalAddress,
    geo: { "@type": "GeoCoordinates", ...SCHEMA_SITE.geo },
    areaServed: SCHEMA_SITE.areaServed,
    openingHours: SCHEMA_SITE.openingHours,
    sameAs: SCHEMA_SITE.sameAs,
    parentOrganization: { "@id": orgId },
  };

  const website = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "@id": `${base}/#website`,
    url: base,
    name: SCHEMA_SITE.name,
    publisher: { "@id": orgId },
    potentialAction: {
      "@type": "SearchAction",
      target: {
        "@type": "EntryPoint",
        urlTemplate: `${base}/blog?q={search_term_string}`,
      },
      "query-input": "required name=search_term_string",
    },
  };

  const graph: Record<string, unknown>[] = [organization, localBusiness, website];

  const clean = normalizePath(requestPath);
  if (clean === "/home" || clean === "/") {
    graph.push({
      "@context": "https://schema.org",
      "@type": "FAQPage",
      mainEntity: HOME_FAQS.map((f) => ({
        "@type": "Question",
        name: f.question,
        acceptedAnswer: { "@type": "Answer", text: f.answer },
      })),
    });
  }

  return graph;
}

function schemaBlock(requestPath: string) {
  return buildSchemaGraph(requestPath)
    .map(
      (node) =>
        `  <script type="application/ld+json">${JSON.stringify(node)}</script>`
    )
    .join("\n");
}

export async function frontendDistExists() {
  try {
    await fs.access(path.join(getFrontendDistPath(), "index.html"));
    return true;
  } catch {
    return false;
  }
}

export function getFrontendStaticPath() {
  return getFrontendDistPath();
}

export async function renderFrontendHtml(requestPath: string) {
  const html = await fs.readFile(path.join(getFrontendDistPath(), "index.html"), "utf8");
  const seo = await resolveSeo(requestPath);
  const head = `${metaBlock(seo)}\n${schemaBlock(requestPath)}\n`;
  return stripManagedMeta(html).replace("</head>", `${head}</head>`);
}
