// src/App.jsx
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import { useEffect } from "react";
import Header from "./components/layout/Header";
import Footer from "./components/layout/Footer";

// Public pages
import HomePage            from "./pages/HomePage";
import AboutPage           from "./pages/AboutPage";
import ServicesPage        from "./pages/ServicesPage";
import ServiceDetailPage   from "./pages/ServiceDetailPage";
import PortfolioPage       from "./pages/PortfolioPage";
import PortfolioDetailPage from "./pages/PortfolioDetailPage";
import BlogPage            from "./pages/blog/BlogPage";
import BlogArticlePage     from "./pages/blog/BlogArticlePage";
import BlogCategoryPage    from "./pages/blog/BlogCategoryPage";
import ContactPageWrapper  from "./pages/ContactPageWrapper";
import CareersPage         from "./pages/CareersPage";
import CareerDetailPage    from "./pages/CareerDetailPage";
import TestimonialsPage    from "./pages/TestimonialsPage";
import TeamPage            from "./pages/TeamPage";
import TeamDetailPage      from "./pages/TeamDetailPage";
import DynamicPage         from "./pages/DynamicPage";

// Admin pages
import AdminLayout           from "./admin/layout/AdminLayout";
import ProtectedRoute        from "./components/ProtectedRoute";
import AdminLoginPage        from "./admin/login";
import DashboardPage         from "./admin/dashboard";
import AdminBlogPage         from "./admin/blog";
import NewBlogPage           from "./admin/blog/new";
import BlogEditor            from "./admin/blog/edit";
import AdminPortfolioPage    from "./admin/portfolio";
import NewPortfolioPage      from "./admin/portfolio/new";
import EditPortfolioPage     from "./admin/portfolio/edit";
import AdminServicesPage     from "./admin/services";
import NewServicePage        from "./admin/services/new";
import EditServicePage       from "./admin/services/edit";
import AdminCareersPage      from "./admin/careers";
import AdminCareerEditor     from "./admin/careers/editor";
import ApplicationsPage      from "./admin/careers/applications";
import LeadsPage             from "./admin/leads";
import TeamAdminPage         from "./admin/pages/team/TeamAdminPage";
import TestimonialsAdminPage from "./admin/pages/testimonials/TestimonialsAdminPage";
import SeoPage               from "./admin/seo";
import SiteSettingsPage      from "./admin/settings";
import AdminPagesPage        from "./admin/pages/pages/AdminPagesPage";
import HomePageEditor        from "./admin/pages/pages/HomePageEditor";
import AboutPageEditor       from "./admin/pages/pages/AboutPageEditor";
import ContactPageEditor     from "./admin/pages/pages/ContactPageEditor";
import PageEditor            from "./admin/pages/pages/PageEditor";

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

// Wraps every protected admin page — no Header/Footer, has sidebar
const A = ({ children }) => (
  <ProtectedRoute>
    <AdminLayout>{children}</AdminLayout>
  </ProtectedRoute>
);

// Splits public layout (Header/Footer) from admin layout
function AppShell() {
  const { pathname } = useLocation();
  const isAdmin = pathname.startsWith("/admin");

  return (
    <>
      {!isAdmin && <Header />}
      <Routes>

        {/* ── Public routes ── */}
        <Route path="/"                    element={<HomePage />} />
        <Route path="/about"               element={<AboutPage />} />
        <Route path="/services"            element={<ServicesPage />} />
        <Route path="/services/:slug"      element={<ServiceDetailPage />} />
        <Route path="/portfolio"           element={<PortfolioPage />} />
        <Route path="/portfolio/:slug"     element={<PortfolioDetailPage />} />
        <Route path="/blog"                element={<BlogPage />} />
        <Route path="/blog/:slug"          element={<BlogArticlePage />} />
        <Route path="/blog/category/:slug" element={<BlogCategoryPage />} />
        <Route path="/contact"             element={<ContactPageWrapper />} />
        <Route path="/careers"             element={<CareersPage />} />
        <Route path="/careers/:slug"       element={<CareerDetailPage />} />
        <Route path="/testimonials"        element={<TestimonialsPage />} />
        <Route path="/team"                element={<TeamPage />} />
        <Route path="/team/:id"            element={<TeamDetailPage />} />
        <Route path="/:slug"         element={<DynamicPage />} />

        {/* ── Admin: login (no layout, no protection) ── */}
        <Route path="/admin/login" element={<AdminLoginPage />} />

        {/* ── Admin: protected + wrapped in AdminLayout ── */}
        <Route path="/admin"                           element={<A><DashboardPage /></A>} />
        <Route path="/admin/blog"                      element={<A><AdminBlogPage /></A>} />
        <Route path="/admin/blog/new"                  element={<A><NewBlogPage /></A>} />
        <Route path="/admin/blog/:slug"                element={<A><BlogEditor /></A>} />
        <Route path="/admin/portfolio"                 element={<A><AdminPortfolioPage /></A>} />
        <Route path="/admin/portfolio/new"             element={<A><NewPortfolioPage /></A>} />
        <Route path="/admin/portfolio/edit/:slug"      element={<A><EditPortfolioPage /></A>} />
        <Route path="/admin/services"                  element={<A><AdminServicesPage /></A>} />
        <Route path="/admin/services/new"              element={<A><NewServicePage /></A>} />
        <Route path="/admin/services/edit/:slug"       element={<A><EditServicePage /></A>} />
        <Route path="/admin/careers"                   element={<A><AdminCareersPage /></A>} />
        <Route path="/admin/careers/new"               element={<A><AdminCareerEditor /></A>} />
        <Route path="/admin/careers/:id"               element={<A><AdminCareerEditor /></A>} />
        <Route path="/admin/careers/:id/applications"  element={<A><ApplicationsPage /></A>} />
        <Route path="/admin/leads"                     element={<A><LeadsPage /></A>} />
        <Route path="/admin/team"                      element={<A><TeamAdminPage /></A>} />
        <Route path="/admin/testimonials"              element={<A><TestimonialsAdminPage /></A>} />
        <Route path="/admin/seo"                       element={<A><SeoPage /></A>} />
        <Route path="/admin/settings"                  element={<A><SiteSettingsPage /></A>} />
        <Route path="/admin/pages"                     element={<A><AdminPagesPage /></A>} />
        <Route path="/admin/pages/home"                element={<A><HomePageEditor /></A>} />
        <Route path="/admin/pages/about"               element={<A><AboutPageEditor /></A>} />
        <Route path="/admin/pages/contact"             element={<A><ContactPageEditor /></A>} />
        <Route path="/admin/pages/:slug"               element={<A><PageEditor /></A>} />

        <Route path="*" element={<NotFoundPage />} />
      </Routes>
      {!isAdmin && <Footer />}
    </>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <ScrollToTop />
      <AppShell />
    </BrowserRouter>
  );
}