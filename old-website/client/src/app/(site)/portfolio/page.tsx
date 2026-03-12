// app/portfolio/page.tsx
import PortfolioHero from "@/app/components/portfolio/PortfolioHero";
import ProjectGrid from "@/app/components/portfolio/ProjectGrid";
import PortfolioIndustries from "@/app/components/portfolio/PortfolioIndustries";
import CTASection from "@/app/components/home/CTASection";
import { getAllPortfolioItems, getFeaturedCaseStudy } from "../../../../lib/portfolio-data";

export const metadata = {
  title: "Portfolio | Digital Work by Dhanamitra Infotech LLP",
  description:
    "Websites, software systems and digital experiences built for businesses across education, healthcare, finance, startups and professional services.",
  keywords: [
    "web development portfolio",
    "software projects India",
    "business website examples",
    "digital solutions portfolio",
    "Dhanamitra Infotech projects",
  ],
};


export default async function PortfolioPage() {
  const [projects, caseStudy] = await Promise.all([
    getAllPortfolioItems(),
    getFeaturedCaseStudy(),
  ]);

  return (
    <main>
      <PortfolioHero />
      <ProjectGrid projects={projects} />
      <PortfolioIndustries caseStudy={caseStudy} />
      <CTASection />
    </main>
  );
}