import Hero from "@/app/components/home/Hero";
import TrustBar from "@/app/components/home/TrustBar";
import ServicesPreview from "@/app/components/home/ServicesPreview";
import WhyChooseUs from "@/app/components/home/WhyChooseUs";
import PortfolioPreview from "@/app/components/home/PortfolioPreview";
import TestimonialsPreview from "@/app/components/home/TestimonialsPreview";
import BlogPreview from "@/app/components/home/BlogPreview";
import CTASection from "@/app/components/home/CTASection";

export default function HomePage() {
  return (
    <>
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