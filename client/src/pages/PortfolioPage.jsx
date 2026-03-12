// src/pages/PortfolioPage.jsx
import PortfolioHero from "../components/portfolio/PortfolioHero";
import ProjectGrid from "../components/portfolio/ProjectGrid";
import PortfolioIndustries from "../components/portfolio/PortfolioIndustries";
import CTASection from "../components/home/Ctasection";
import { useApi } from "../lib/useApi";
import { api } from "../lib/api";
import Seo from "../components/common/Seo";
export default function PortfolioPage() {
  const { data: projects } = useApi(api.getPortfolioItems);
  return (
    <>
    <Seo
      title="Portfolio | Dhanamitra Infotech LLP — Digital Solutions, Software & Business Growth"
      description="Explore Dhanamitra Infotech LLP's portfolio showcasing our expertise in website development, custom software, IT placements, journal publishing and stock market training for modern businesses."
      keywords={[
        "Dhanamitra Infotech LLP",
        "portfolio",
        "digital solutions projects",
        "website development portfolio",
        "software solutions portfolio",
        "business growth case studies",
        "ISO certified digital services portfolio",
        "modern digital solutions India portfolio",
      ]}
    />
    <main>
      <PortfolioHero />
      <ProjectGrid projects={projects || []} />
      <PortfolioIndustries caseStudy={null} />
      <CTASection />
    </main>
    </>
  );
}
