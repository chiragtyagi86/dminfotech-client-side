// src/pages/HomePage.jsx
import Hero from "../components/home/Hero";
import TrustBar from "../components/home/TrustBar";
import ServicesPreview from "../components/home/Servicespreview";
import WhyChooseUs from "../components/home/WhyChooseUs";
import PortfolioPreview from "../components/home/Portfoliopreview";
import TestimonialsPreview from "../components/home/Testimonialspreview";
import BlogPreview from "../components/home/Blogpreview";
import CTASection from "../components/home/Ctasection";
import Seo from "../components/common/Seo";
export default function HomePage() {
  return (
    <>
    <Seo
      title="Dhanamitra Infotech LLP — Digital Solutions, Software & Business Growth"
      description="Dhanamitra Infotech LLP is an ISO 9001:2015 certified digital solutions company delivering website development, custom software, IT placements, journal publishing and stock market training for modern businesses."
      keywords={[
        "Dhanamitra Infotech LLP",
        "digital solutions company",
        "website development",
        "software solutions",
        "business growth",
        "ISO certified digital services",
        "modern digital solutions India",
      ]}
    />
      <Hero />
      <TrustBar />
      <ServicesPreview />
      <WhyChooseUs />
      <PortfolioPreview />
      <TestimonialsPreview />
      <BlogPreview />
      <CTASection />
    </>
  );
}
