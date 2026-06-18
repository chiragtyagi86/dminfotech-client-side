import fs from "fs/promises";
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
};

const fallbackByPath: Record<string, Omit<SeoPayload, "url"> & { slug?: string; entityType?: "page" | "blog" }> = {
  "/": {
    slug: "home",
    entityType: "page",
    title: "Dhanamitra Infotech LLP — Digital Solutions, Software & Business Growth",
    description:
      "Dhanamitra Infotech LLP is an ISO 9001:2015 certified digital solutions company delivering website development, custom software, IT placements, journal publishing and stock market training for modern businesses.",
    image: "/logo.svg",
  },
  "/about": {
    slug: "about",
    entityType: "page",
    title: "About | Dhanamitra Infotech LLP — Digital Solutions, Software & Business Growth",
    description:
      "Dhanamitra Infotech LLP is an ISO 9001:2015 certified digital solutions company delivering website development, custom software, IT placements, journal publishing and stock market training for modern businesses.",
    image: "/logo.svg",
  },
  "/services": {
    slug: "services",
    entityType: "page",
    title: "Services | Dhanamitra Infotech LLP — Digital Solutions, Software & Business Growth",
    description:
      "Discover Dhanamitra Infotech LLP's comprehensive services including website development, custom software solutions, IT placements, journal publishing and stock market training for modern businesses.",
    image: "/logo.svg",
  },
  "/portfolio": {
    slug: "portfolio",
    entityType: "page",
    title: "Portfolio | Dhanamitra Infotech LLP — Digital Solutions, Software & Business Growth",
    description:
      "Explore Dhanamitra Infotech LLP's portfolio showcasing our expertise in website development, custom software, IT placements, journal publishing and stock market training for modern businesses.",
    image: "/logo.svg",
  },
  "/blog": {
    slug: "blog",
    entityType: "page",
    title: "Blog | Dhanamitra Infotech LLP — Digital Solutions, Software & Business Growth",
    description:
      "Explore Dhanamitra Infotech LLP's blog for insights on website development, custom software, digital strategy, SEO architecture and business technology for modern businesses.",
    image: "/logo.svg",
  },
  "/careers": {
    slug: "careers",
    entityType: "page",
    title: "Careers | Dhanamitra Infotech LLP — Join Our Team of Digital Innovators",
    description:
      "Explore career opportunities at Dhanamitra Infotech LLP, an ISO 9001:2015 certified digital solutions company. Join us to work on real projects, grow your skills, and make an impact in the tech industry.",
    image: "/logo.svg",
  },
  "/contact": {
    slug: "contact",
    entityType: "page",
    title: "Contact Us | Dhanamitra Infotech LLP — Digital Solutions, Software & Business Growth",
    description:
      "Get in touch with Dhanamitra Infotech LLP for website development, software solutions, IT placements, journal publishing and stock market training. Contact us today!",
    image: "/logo.svg",
  },
  "/team": {
    slug: "team",
    entityType: "page",
    title: "Our Team | Dhanamitra Infotech LLP — Digital Solutions, Software & Business Growth",
    description:
      "Meet the passionate team behind Dhanamitra Infotech LLP, delivering innovative digital solutions, software development and business growth services with expertise and dedication.",
    image: "/logo.svg",
  },
  "/testimonials": {
    slug: "testimonials",
    entityType: "page",
    title: "Client Testimonials | Dhanamitra Infotech LLP — Digital Solutions, Software & Business Growth",
    description:
      "Discover what our clients have to say about their experience working with Dhanamitra Infotech LLP. Read real testimonials highlighting our commitment to excellence in digital solutions, software development, and business growth.",
    image: "/logo.svg",
  },
};

function getFrontendDistPath() {
  return (
    process.env.FRONTEND_DIST_PATH ||
    path.resolve(__dirname, "public")
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
  const clean = requestPath.split("?")[0].replace(/\/+$/, "");
  return clean || "/";
}

function absoluteUrl(value: string | undefined, fallback = "/logo.svg") {
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
      image: "/logo.svg",
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
      image: "/logo.svg",
    };
  }

  return fallbackByPath["/"];
}

async function resolveSeo(requestPath: string): Promise<SeoPayload> {
  const cleanPath = normalizePath(requestPath);
  const fallback = pathToSeoLookup(cleanPath);
  const url = `${siteUrl()}${cleanPath === "/" ? "" : cleanPath}`;

  try {
    if (fallback.slug && fallback.entityType) {
      const cmsSeo = await getPublicEntitySeo(fallback.entityType, fallback.slug);
      return {
        title: cmsSeo.ogTitle || cmsSeo.metaTitle || fallback.title,
        description: cmsSeo.ogDescription || cmsSeo.metaDescription || fallback.description,
        image: cmsSeo.ogImage || fallback.image,
        keywords: cmsSeo.keywords || fallback.keywords,
        indexEnabled: cmsSeo.indexEnabled !== false,
        type: fallback.entityType === "blog" ? "article" : "website",
        url: cmsSeo.canonicalUrl || url,
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
  };
}

function metaBlock(seo: SeoPayload) {
  const title = escapeHtml(seo.title);
  const description = escapeHtml(seo.description);
  const image = escapeHtml(absoluteUrl(seo.image));
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
    `<meta property="og:title" content="${title}" />`,
    `<meta property="og:description" content="${description}" />`,
    `<meta property="og:url" content="${url}" />`,
    `<meta property="og:image" content="${image}" />`,
    `<meta name="twitter:card" content="summary_large_image" />`,
    `<meta name="twitter:title" content="${title}" />`,
    `<meta name="twitter:description" content="${description}" />`,
    `<meta name="twitter:image" content="${image}" />`,
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
    .replace(/\s*<link rel="canonical"[\s\S]*?>/gi, "")
    .replace(/\s*<meta property="og:[\s\S]*?>/gi, "")
    .replace(/\s*<meta name="twitter:[\s\S]*?>/gi, "");
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
  return stripManagedMeta(html).replace("</head>", `${metaBlock(seo)}\n</head>`);
}
