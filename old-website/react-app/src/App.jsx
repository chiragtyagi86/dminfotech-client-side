// src/App.jsx
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import { useEffect } from "react";
import Header from "./components/layout/Header";
import Footer from "./components/layout/Footer";

import HomePage          from "./pages/HomePage";
import AboutPage         from "./pages/AboutPage";
import ServicesPage      from "./pages/ServicesPage";
import ServiceDetailPage from "./pages/ServiceDetailPage";
import PortfolioPage     from "./pages/PortfolioPage";
import PortfolioDetailPage from "./pages/PortfolioDetailPage";
import BlogPage          from "./pages/blog/BlogPage";
import BlogArticlePage   from "./pages/blog/BlogArticlePage";
import BlogCategoryPage  from "./pages/blog/BlogCategoryPage";
import ContactPageWrapper from "./pages/ContactPageWrapper";
import CareersPage       from "./pages/CareersPage";
import CareerDetailPage  from "./pages/CareerDetailPage";
import TestimonialsPage  from "./pages/TestimonialsPage";
import TeamPage          from "./pages/TeamPage";
import TeamDetailPage    from "./pages/TeamDetailPage";
import DynamicPage       from "./pages/DynamicPage";

// Scroll to top on route change
function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => { window.scrollTo(0, 0); }, [pathname]);
  return null;
}

function NotFoundPage() {
  return (
    <div style={{ minHeight: "80vh", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", background: "var(--color-bg)", textAlign: "center", padding: 40 }}>
      <h1 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 72, fontWeight: 300, color: "var(--color-primary)", margin: "0 0 16px", lineHeight: 1 }}>404</h1>
      <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 16, fontWeight: 300, color: "var(--color-text-soft)", margin: "0 0 32px" }}>The page you're looking for doesn't exist.</p>
      <a href="/" style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 12.5, fontWeight: 500, letterSpacing: "0.09em", textTransform: "uppercase", color: "var(--color-primary)", textDecoration: "none", borderBottom: "1px solid rgba(104,80,68,0.22)", paddingBottom: 2 }}>← Back to Home</a>
    </div>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <ScrollToTop />
      <Header />
      <Routes>
        <Route path="/"                         element={<HomePage />} />
        <Route path="/about"                    element={<AboutPage />} />
        <Route path="/services"                 element={<ServicesPage />} />
        <Route path="/services/:slug"           element={<ServiceDetailPage />} />
        <Route path="/portfolio"                element={<PortfolioPage />} />
        <Route path="/portfolio/:slug"          element={<PortfolioDetailPage />} />
        <Route path="/blog"                     element={<BlogPage />} />
        <Route path="/blog/:slug"               element={<BlogArticlePage />} />
        <Route path="/blog/category/:slug"      element={<BlogCategoryPage />} />
        <Route path="/contact"                  element={<ContactPageWrapper />} />
        <Route path="/careers"                  element={<CareersPage />} />
        <Route path="/careers/:slug"            element={<CareerDetailPage />} />
        <Route path="/testimonials"             element={<TestimonialsPage />} />
        <Route path="/team"                     element={<TeamPage />} />
        <Route path="/team/:id"                 element={<TeamDetailPage />} />
        <Route path="/pages/:slug"              element={<DynamicPage />} />
        <Route path="*"                         element={<NotFoundPage />} />
      </Routes>
      <Footer />
    </BrowserRouter>
  );
}