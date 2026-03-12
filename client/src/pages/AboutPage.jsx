// src/pages/AboutPage.jsx
import AboutHero from "../components/about/AboutHero";
import AboutIntro from "../components/about/Aboutintro";
import AboutMissionVision from "../components/about/Aboutmissionvision";
import AboutTrust from "../components/about/Abouttrust";
import WhyChooseUs from "../components/home/WhyChooseUs";
import AboutPhilosophy from "../components/about/Aboutphilosophy";
import CTASection from "../components/home/Ctasection";
import Seo from "../components/common/Seo";
export default function AboutPage() {
  return (
    <>
      <Seo
        title="About | Dhanamitra Infotech LLP — Digital Solutions, Software & Business Growth"
        description="Dhanamitra Infotech LLP is an ISO 9001:2015 certified digital solutions company delivering website development, custom software, IT placements, journal publishing and stock market training for modern businesses."
        keywords={[
    "Dhanamitra Infotech LLP",
    "about us",
    "digital solutions company",
    "website development",
    "software solutions",
    "business growth",
    "ISO certified digital services",
    "modern digital solutions India",
  ]}
      />

      <main>
        <AboutHero />
        <AboutIntro />
        <AboutMissionVision />
        <AboutTrust />
        <WhyChooseUs />
        <AboutPhilosophy />
        <CTASection />
      </main>
    </>
  );
}
