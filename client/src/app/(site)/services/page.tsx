// app/(site)/services/page.tsx
// ─────────────────────────────────────────────────────────────────────────────
// Services page — fetches from dhanamitra_cms DB server-side.
// ─────────────────────────────────────────────────────────────────────────────

import type { Metadata } from "next";
import ServicesHero from "@/app/components/services/ServicesHero";
import ServicesGrid from "@/app/components/services/ServicesGrid";
import ServiceBlocks from "@/app/components/services/ServiceBlocks";
import ServiceProcess from "@/app/components/services/ServiceProcess";
import WhyChooseUs from "@/app/components/home/WhyChooseUs";
import CTASection from "@/app/components/home/CTASection";
import { getAllServices } from "../../../../lib/services-data";

export const metadata: Metadata = {
  title:
    "Services | Website Development, Software Solutions & Digital Services — Dhanamitra Infotech LLP",
  description:
    "Professional website development, custom software, IT placements, research journal publishing and stock market training. ISO 9001:2015 certified digital solutions for modern businesses.",
  keywords: [
    "website development services",
    "custom software development",
    "digital solutions for businesses",
    "IT placement services",
    "research journal publishing",
    "stock market training",
    "business website design",
    "SEO-ready website architecture",
  ],
};

export default async function ServicesPage() {
  const services = await getAllServices();

  return (
    <main>
      <ServicesHero />
      <ServicesGrid services={services} />
      <ServiceBlocks />
      <ServiceProcess />
      <WhyChooseUs />
      <CTASection />
    </main>
  );
}