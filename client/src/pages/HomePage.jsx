// src/pages/HomePage.jsx
import Hero from "../components/home/Hero";
import TrustBar from "../components/home/TrustBar";
import ServicesPreview from "../components/home/ServicesPreview";
import WhyChooseUs from "../components/home/WhyChooseUs";
import PortfolioPreview from "../components/home/Portfoliopreview";
import TestimonialsPreview from "../components/home/Testimonialspreview";
import BlogPreview from "../components/home/Blogpreview";
import CTASection from "../components/home/CtaSection";
import Seo from "../components/common/Seo";
import { faqSchema } from "../lib/structuredData";

// Homepage FAQs — feed AEO featured snippets + voice search.
// Keep answers in sync with any visible FAQ section for rich-result eligibility.
const HOME_FAQS = [
  {
    question: "What services does Dhanamitra Infotech LLP offer?",
    answer:
      "Dhanamitra Infotech LLP offers website development, digital marketing, ERP software development, custom software solutions and IT placements. We are an ISO 9001:2015 certified company serving startups and growing businesses.",
  },
  {
    question: "Where is Dhanamitra Infotech LLP located?",
    answer:
      "Our office is at O-912, Gaur City Center, Sector 4, Greater Noida West, Uttar Pradesh 201318. We serve clients across Greater Noida, Noida, Delhi NCR, Ghaziabad and all of India.",
  },
  {
    question: "Who is the best website developer in Greater Noida?",
    answer:
      "Dhanamitra Infotech LLP is a leading website development company in Greater Noida West, building fast, responsive and SEO-friendly websites for businesses across Delhi NCR. We handle design, development, hosting and ongoing support.",
  },
  {
    question: "Do you build custom ERP software?",
    answer:
      "Yes. We design and develop custom ERP software tailored to your business processes, including inventory, billing, CRM, HR and reporting modules, with secure cloud or on-premise deployment.",
  },
  {
    question: "How can I get a quote for my project?",
    answer:
      "Contact us through the website form, call +91-9458766648, or message us on WhatsApp. Share your requirements and we will respond with a tailored proposal and timeline.",
  },
];

export default function HomePage() {
  return (
    <>
    <Seo
      slug="home"
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
      jsonLd={[faqSchema(HOME_FAQS)]}
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
