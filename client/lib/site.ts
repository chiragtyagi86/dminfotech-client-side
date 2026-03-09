// lib/site.ts
// ─────────────────────────────────────────────────────────────────────────────
// SAFE FOR CLIENT + SERVER — no DB imports here.
// Client components import { siteConfig } from this file.
// Server components use getSiteConfig() from lib/site.server.ts instead.
// ─────────────────────────────────────────────────────────────────────────────

export type SiteConfig = {
  name: string;
  shortName: string;
  description: string;
  url: string;
  ogImage: string;
  contactEmail: string;
  phone: string;
  whatsapp: string;
  address: string;
  navLinks: { label: string; href: string }[];
  siteTagline: string;
  facebookUrl: string;
  linkedinUrl: string;
  instagramUrl: string;
  twitterUrl: string;
  youtubeUrl: string;
  copyrightText: string;
  footerDescription: string;
};

export const siteConfig: SiteConfig = {
  name:              "Dhanamitra Infotech LLP",
  shortName:         "DMIFOTECH",
  description:       "Dhanamitra Infotech LLP is an ISO 9001:2015 certified company offering website development, software solutions, digital services, publishing support, and trading education.",
  url:               "https://dmifotech.com",
  ogImage:           "/images/og-image.jpg",
  contactEmail:      "info@dmifotech.com",
  phone:             "+91-9458766648",
  whatsapp:          "https://wa.me/918192968687",
  address:           "India",
  siteTagline:       "Crafting Digital Excellence",
  facebookUrl:       "https://www.facebook.com/people/dmifotech/61570497154705/",
  linkedinUrl:       "https://www.linkedin.com/company/dmifotech/",
  instagramUrl:      "https://www.instagram.com/dmifotech/",
  twitterUrl:        "",
  youtubeUrl:        "",
  copyrightText:     `© ${new Date().getFullYear()} Dhanamitra Infotech LLP. All rights reserved.`,
  footerDescription: "",
  navLinks: [
    { label: "Home",      href: "/"          },
    { label: "About",     href: "/about"     },
    { label: "Services",  href: "/services"  },
    { label: "Portfolio", href: "/portfolio" },
    { label: "Team",      href: "/team"      },
    { label: "Blog",      href: "/blog"      },
    { label: "Contact",   href: "/contact"   },
  ],
};