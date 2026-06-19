// src/config/site.js
const siteConfig = {
  name: "Dhanamitra Infotech LLP",
  shortName: "DMIFOTECH",
  description:
    "Dhanamitra Infotech LLP is an ISO 9001:2015 certified company offering website development, software solutions, digital services, publishing support, and trading education.",
  url: "https://dmifotech.com",
  // TODO: add a 1200x630 branded OG image at /public/og-image.jpg for best
  // social cards. Falls back to existing raster icon until then.
  ogImage: "/android-chrome-512x512.png",
  contactEmail: "info@dmifotech.com",
  phone: "+91-9458766648",
  whatsapp: "https://wa.me/918192968687",
  address: "O-912, Gaur City Center, Sector 4, Greater Noida West, Uttar Pradesh 201318",
  siteTagline: "Crafting Digital Excellence",

  // ── Local SEO: structured NAP for LocalBusiness JSON-LD ──
  // TODO: replace placeholders with the exact registered address.
  addressDetails: {
    streetAddress: "O-912, Gaur City Center, Sector 4",
    addressLocality: "Greater Noida West",
    addressRegion: "Uttar Pradesh",
    postalCode: "201318",
    addressCountry: "IN",
  },
  // Map coordinates for geo schema. Approximate Gaur City Center pin —
  // refine from Google Business Profile for exact local-pack placement.
  geo: { latitude: "28.6076", longitude: "77.4286" },
  // Google Business Profile / Maps listing URL (strengthens entity graph).
  mapUrl: "",
  // Areas the business serves (used in LocalBusiness areaServed + GEO signals).
  areaServed: ["Greater Noida", "Noida", "Delhi NCR", "Ghaziabad", "India"],
  foundingDate: "2023",
  priceRange: "₹₹",
  openingHours: "Mo-Sa 10:00-19:00",
  // Default keyword theme for fallback meta + entity context.
  defaultKeywords: [
    "best website developer",
    "website development company India",
    "digital marketing agency",
    "ERP software development",
    "custom software solutions",
    "Dhanamitra Infotech LLP",
  ],
  // Core service offerings surfaced in Organization/Service schema.
  serviceOfferings: [
    "Website Development",
    "Digital Marketing",
    "ERP Software Development",
    "Custom Software Solutions",
    "IT Placements",
  ],
  facebookUrl: "https://www.facebook.com/people/dmifotech/61570497154705/",
  linkedinUrl: "https://www.linkedin.com/company/dmifotech/",
  instagramUrl: "https://www.instagram.com/dmifotech/",
  twitterUrl: "",
  youtubeUrl: "",
  copyrightText: `© ${new Date().getFullYear()} Dhanamitra Infotech LLP. All rights reserved.`,
  footerDescription: "",
  cmsPages: [],
  navLinks: [
    { label: "Home", href: "/" },
    { label: "About", href: "/about" },
    { label: "Services", href: "/services" },
    { label: "Portfolio", href: "/portfolio" },
    { label: "Blog", href: "/blog" },
    { label: "Team", href: "/team" },
    { label: "Contact", href: "/contact" },
  ],
};

export default siteConfig;