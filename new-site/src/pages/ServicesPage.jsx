// src/pages/ServicesPage.jsx
import ServicesHero from "../components/services/ServicesHero";
import ServicesGrid from "../components/services/ServiceGrid";
import ServiceBlocks from "../components/services/ServiceBlocks";
import ServiceProcess from "../components/services/ServiceProcess";
import WhyChooseUs from "../components/home/WhyChooseUs";
import CTASection from "../components/home/Ctasection";
import { useApi } from "../lib/useApi";
import { api } from "../lib/api";
import Seo from "../components/common/Seo";
export default function ServicesPage() {
  const { data } = useApi(api.getServices);
  return (
    <>
    <Seo
      title="Services | Dhanamitra Infotech LLP — Digital Solutions, Software & Business Growth"
      description="Discover Dhanamitra Infotech LLP's comprehensive services including website development, custom software solutions, IT placements, journal publishing and stock market training for modern businesses."
      keywords={[
        "Dhanamitra Infotech LLP",
        "services",
        "digital solutions company services",
        "website development services",
        "software solutions services",
        "business growth services",
        "ISO certified digital services",
        "modern digital solutions India services",
      ]}
    />
    <main>
      <ServicesHero />
      <ServicesGrid services={data || []} />
      <ServiceBlocks />
      <ServiceProcess />
      <WhyChooseUs />
      <CTASection />
    </main>
    </>
  );
}
