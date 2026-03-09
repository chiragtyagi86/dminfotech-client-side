import AboutHero from "@/app/components/about/AboutHero";
import AboutIntro from "@/app/components/about/AboutIntro";
import AboutMissionVision from "@/app/components/about/AboutMissionVision";
import AboutTrust from "@/app/components/about/AboutTrust";
import AboutPhilosophy from "@/app/components/about/AboutPhilosophy";
import WhyChooseUs from "@/app/components/home/WhyChooseUs";
import CTASection from "@/app/components/home/CTASection";

export const metadata = {
  title: "About | Dhanamitra Infotech LLP — Digital Solutions, Software & Business Growth",
  description:
    "Dhanamitra Infotech LLP is an ISO 9001:2015 certified digital solutions company delivering website development, custom software, IT placements, journal publishing and stock market training for modern businesses.",
  keywords: [
    "Dhanamitra Infotech LLP",
    "about us",
    "digital solutions company",
    "website development",
    "software solutions",
    "business growth",
    "ISO certified digital services",
    "modern digital solutions India",
  ],
};

export default function AboutPage() {
  return (
    <main>
      {/* 1. Who you are — first impression */}
      <AboutHero />

      {/* 2. What you do — brand statement */}
      <AboutIntro />

      {/* 3. Why you exist — mission & vision */}
      <AboutMissionVision />

      {/* 4. Why trust you — credentials & standards */}
      <AboutTrust />

      {/* 5. Why choose you — practical differentiators */}
      <WhyChooseUs />

      {/* 6. How you work — brand philosophy */}
      <AboutPhilosophy />

      {/* 7. What to do next — CTA */}
      <CTASection />
    </main>
  );
}