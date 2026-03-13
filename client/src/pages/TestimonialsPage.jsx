// src/pages/TestimonialsPage.jsx
import { useApi } from "../lib/useApi";
import { api } from "../lib/api";
import Container from "../components/common/Container";
import SectionHeading from "../components/common/Sectionheading";
import CTASection from "../components/home/Ctasection";
import Seo from "../components/common/Seo";

const STATIC = [
  {
    id: 1,
    clientName: "Vikram Patel",
    clientRole: "Founder & CEO",
    clientCompany: "TechStart India",
    quote:
      "Dhanamitra transformed our digital presence completely. Their team understood our vision and delivered beyond expectations.",
    rating: 5,
    featured: true,
  },
  {
    id: 2,
    clientName: "Anjali Sharma",
    clientRole: "Director of Operations",
    clientCompany: "Global Education Foundation",
    quote:
      "The platform they built is intuitive, scalable, and has revolutionised how we manage our operations.",
    rating: 5,
    featured: true,
  },
  {
    id: 3,
    clientName: "Rajesh Gupta",
    clientRole: "Chief Technology Officer",
    clientCompany: "FinServe Analytics",
    quote:
      "Working with Dhanamitra was refreshing — technical excellence combined with genuine care for our outcomes.",
    rating: 5,
  },
  {
    id: 4,
    clientName: "Priya Mehta",
    clientRole: "Marketing Director",
    clientCompany: "EduLearn Platform",
    quote:
      "Our website traffic doubled within three months of launch. The SEO architecture they built is exceptional.",
    rating: 5,
  },
  {
    id: 5,
    clientName: "Saurabh Singh",
    clientRole: "Founder",
    clientCompany: "HealthFirst Clinics",
    quote:
      "They delivered a complex healthcare portal on time and under budget. Communication was transparent throughout.",
    rating: 5,
  },
  {
    id: 6,
    clientName: "Neha Joshi",
    clientRole: "CEO",
    clientCompany: "StartupXcel",
    quote:
      "The attention to detail in both design and development sets Dhanamitra apart from every other agency we've worked with.",
    rating: 5,
  },
];

function normalizeTestimonials(raw) {
  const source = Array.isArray(raw)
    ? raw
    : Array.isArray(raw?.data)
    ? raw.data
    : Array.isArray(raw?.testimonials)
    ? raw.testimonials
    : [];

  return source
    .map((item, index) => {
      const clientName =
        item?.clientName ||
        item?.name ||
        item?.client_name ||
        item?.authorName ||
        "Anonymous Client";

      const clientimg = 
        item?.client_photo ||
        item?.photo ||
        item?.client_photo_url ||
        item?.avatar ||
        "";
      const clientRole =
        item?.clientRole ||
        item?.role ||
        item?.client_role ||
        item?.designation ||
        "Client";

      const clientCompany =
        item?.clientCompany ||
        item?.company ||
        item?.client_company ||
        item?.organization ||
        "";

      const quote =
        item?.quote ||
        item?.testimonial ||
        item?.message ||
        item?.review ||
        "Great service and professional support.";

      const ratingValue = Number(item?.rating);
      const rating = Number.isFinite(ratingValue)
        ? Math.max(0, Math.min(5, ratingValue))
        : 5;

      return {
        id: item?.id ?? index + 1,
        clientName: String(clientName).trim() || "Anonymous Client",
        clientRole: String(clientRole).trim() || "Client",
        clientCompany: String(clientCompany).trim(),
        clientimg: String(clientimg).trim(),
        quote: String(quote).trim() || "Great service and professional support.",
        rating,
        featured: Boolean(item?.featured),
      };
    })
    .filter((item) => item.quote);
}

function getInitial(name) {
  return String(name || "?").trim().charAt(0).toUpperCase() || "?";
}

function StarRating({ rating }) {
  const safeRating = Number.isFinite(Number(rating))
    ? Math.max(0, Math.min(5, Number(rating)))
    : 5;

  return (
    <div style={{ display: "flex", gap: 3 }}>
      {[...Array(5)].map((_, i) => (
        <span
          key={i}
          style={{
            width: 12,
            height: 12,
            display: "inline-block",
            background:
              i < safeRating
                ? "linear-gradient(135deg, var(--color-accent-blue), var(--color-accent-blush))"
                : "rgba(104,80,68,0.12)",
            clipPath:
              "polygon(50% 0%,61% 35%,98% 35%,68% 57%,79% 91%,50% 70%,21% 91%,32% 57%,2% 35%,39% 35%)",
          }}
        />
      ))}
    </div>
  );
}

function TestimonialCard({ t, large }) {
  return (
    <div
      style={{
        borderRadius: 24,
        border: "1px solid rgba(104,80,68,0.09)",
        background: "rgba(255,255,255,0.65)",
        backdropFilter: "blur(12px)",
        padding: large ? "40px 36px" : "28px 26px",
        display: "flex",
        flexDirection: "column",
        position: "relative",
        overflow: "hidden",
        transition: "transform 0.35s ease, box-shadow 0.35s ease",
      }}
    >
      <span
        style={{
          fontFamily: "'Cormorant Garamond', serif",
          fontSize: 52,
          fontWeight: 600,
          fontStyle: "italic",
          lineHeight: 0.8,
          color: "var(--color-accent-blush)",
          marginBottom: 16,
          display: "block",
        }}
      >
        "
      </span>

      <StarRating rating={t.rating} />

      <p
        style={{
          fontFamily: "'Cormorant Garamond', serif",
          fontSize: large ? 22 : 18,
          fontWeight: 300,
          fontStyle: "italic",
          lineHeight: 1.7,
          color: "var(--color-primary)",
          flex: 1,
          margin: "18px 0 28px",
        }}
      >
        {t.quote}
      </p>

      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 12,
          paddingTop: 20,
          borderTop: "1px solid rgba(104,80,68,0.07)",
        }}
      >
        <div
          
        >
          {t.clientimg ? (<img style={{
            width: 40,
            height: 40,
            borderRadius: "50%",
            background:
              "linear-gradient(135deg, var(--color-accent-blue), var(--color-accent-blush))",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontFamily: "'Cormorant Garamond', serif",
            fontSize: 18,
            fontWeight: 600,
            color: "white",
            flexShrink: 0,
          }} src={`${import.meta.env.VITE_API_URL}${t.clientimg}`} alt={t.clientName} />):(
            <div style={{
            width: 40,
            height: 40,
            borderRadius: "50%",
            background:
              "linear-gradient(135deg, var(--color-accent-blue), var(--color-accent-blush))",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontFamily: "'Cormorant Garamond', serif",
            fontSize: 18,
            fontWeight: 600,
            color: "white",
            flexShrink: 0,
          }}>
      {getInitial(t.clientName)}
    </div>
          )}
          
        </div>

        <div>
          <p
            style={{
              fontFamily: "'DM Sans', sans-serif",
              fontSize: 13.5,
              fontWeight: 500,
              color: "var(--color-primary)",
              margin: "0 0 2px",
            }}
          >
            {t.clientName}
          </p>
          <p
            style={{
              fontFamily: "'DM Sans', sans-serif",
              fontSize: 11,
              color: "var(--color-text-soft)",
              margin: 0,
            }}
          >
            {t.clientRole}
            {t.clientCompany ? ` · ${t.clientCompany}` : ""}
          </p>
        </div>
      </div>
    </div>
  );
}

export default function TestimonialsPage() {
  const { data, error } = useApi(api.getTestimonials);

  const normalized = normalizeTestimonials(data);
  const all = normalized.length ? normalized : STATIC;
  const featured = all.filter((t) => t.featured);
  const regular = all.filter((t) => !t.featured);

  return (
    <>
    <Seo
      title="Client Testimonials | Dhanamitra Infotech LLP — Digital Solutions, Software & Business Growth"
      description="Discover what our clients have to say about their experience working with Dhanamitra Infotech LLP. Read real testimonials highlighting our commitment to excellence in digital solutions, software development, and business growth."
      keywords={[
        "Dhanamitra Infotech LLP",
        "client testimonials",
        "customer reviews",
        "digital solutions feedback",
        "software development testimonials",
        "business growth reviews",
        "ISO certified digital services testimonials",
        "modern digital solutions India feedback",
      ]}
    />  
      <style>{`
        .tpage { background: var(--color-bg); min-height: 100vh; }
        .tpage-hero { position: relative; overflow: hidden; padding: 100px 0 72px; }
        .tpage-orb1 { position: absolute; width: 520px; height: 520px; border-radius: 50%; top: -180px; right: -100px; background: radial-gradient(circle, rgba(153,178,221,0.14) 0%, transparent 65%); pointer-events: none; }
        .tpage-orb2 { position: absolute; width: 300px; height: 300px; border-radius: 50%; bottom: -60px; left: 3%; background: radial-gradient(circle, rgba(233,175,163,0.10) 0%, transparent 70%); pointer-events: none; }
        .tpage-hero-inner { position: relative; z-index: 1; max-width: 680px; animation: tFade 0.8s ease both; }
        @keyframes tFade { from{opacity:0;transform:translateY(18px);}to{opacity:1;transform:translateY(0);} }
        .tpage-eyebrow { font-family: 'DM Sans', sans-serif; font-size: 10.5px; font-weight: 500; letter-spacing: 0.22em; text-transform: uppercase; color: var(--color-primary-2); display: flex; align-items: center; gap: 8px; margin-bottom: 14px; }
        .tpage-eyebrow::before { content: ''; width: 28px; height: 1px; background: var(--color-primary-2); }
        .tpage-h1 { font-family: 'Cormorant Garamond', serif; font-size: clamp(36px, 6vw, 68px); font-weight: 300; line-height: 1.08; color: var(--color-primary); margin: 0 0 18px; }
        .tpage-h1 em { font-style: italic; color: var(--color-primary-2); }
        .tpage-sub { font-family: 'DM Sans', sans-serif; font-size: 15px; font-weight: 300; line-height: 1.80; color: var(--color-text-soft); }
        .tpage-featured { padding: 80px 0; background: var(--color-bg); }
        .tpage-label { font-family: 'DM Sans', sans-serif; font-size: 10.5px; font-weight: 500; letter-spacing: 0.22em; text-transform: uppercase; color: var(--color-primary-2); display: flex; align-items: center; gap: 12px; margin-bottom: 28px; }
        .tpage-label::after { content: ''; flex: 1; height: 1px; background: rgba(104,80,68,0.09); }
        .tpage-featured-grid { display: grid; grid-template-columns: 1fr; gap: 20px; }
        @media (min-width: 768px) { .tpage-featured-grid { grid-template-columns: repeat(2, 1fr); } }
        .tpage-regular { padding: 0 0 96px; background: var(--color-bg); }
        .tpage-regular-grid { display: grid; grid-template-columns: 1fr; gap: 20px; }
        @media (min-width: 640px) { .tpage-regular-grid { grid-template-columns: repeat(2, 1fr); } }
        @media (min-width: 1024px) { .tpage-regular-grid { grid-template-columns: repeat(3, 1fr); } }
        .tpage-stats { padding: 64px 0; background: var(--color-bg-soft); }
        .tpage-stats-grid { display: grid; grid-template-columns: repeat(2, 1fr); gap: 1px; background: rgba(104,80,68,0.08); border-radius: 20px; overflow: hidden; }
        @media (min-width: 768px) { .tpage-stats-grid { grid-template-columns: repeat(4, 1fr); } }
        .tpage-stat { background: var(--color-bg-soft); padding: 28px 20px; text-align: center; }
        .tpage-stat-num { font-family: 'Cormorant Garamond', serif; font-size: 38px; font-weight: 600; color: var(--color-primary); display: block; line-height: 1; margin-bottom: 6px; }
        .tpage-stat-label { font-family: 'DM Sans', sans-serif; font-size: 12px; color: var(--color-text-soft); }
        .tpage-note { margin-top: 18px; font-family: 'DM Sans', sans-serif; font-size: 12px; color: var(--color-text-soft); }
      `}</style>

      <main className="tpage">
        <section className="tpage-hero">
          <div className="tpage-orb1" />
          <div className="tpage-orb2" />
          <Container>
            <div className="tpage-hero-inner">
              <p className="tpage-eyebrow">Client Testimonials</p>
              <h1 className="tpage-h1">
                What our clients
                <br />
                <em>say about us</em>
              </h1>
              <p className="tpage-sub">
                Real feedback from real clients who trusted us with their digital
                presence. These words mean everything to us.
              </p>
              {error && (
                <p className="tpage-note">
                  Live testimonials could not be loaded, so fallback testimonials
                  are being shown.
                </p>
              )}
            </div>
          </Container>
        </section>

        <section className="tpage-stats">
          <Container>
            <div className="tpage-stats-grid">
              {[
                { num: "100%", label: "Client Satisfaction" },
                { num: "50+", label: "Projects Delivered" },
                { num: "5★", label: "Average Rating" },
                { num: "ISO", label: "9001:2015 Certified" },
              ].map((s) => (
                <div key={s.num} className="tpage-stat">
                  <span className="tpage-stat-num">{s.num}</span>
                  <span className="tpage-stat-label">{s.label}</span>
                </div>
              ))}
            </div>
          </Container>
        </section>

        {featured.length > 0 && (
          <section className="tpage-featured">
            <Container>
              <p className="tpage-label">Featured Reviews</p>
              <div className="tpage-featured-grid">
                {featured.map((t) => (
                  <TestimonialCard key={t.id} t={t} large />
                ))}
              </div>
            </Container>
          </section>
        )}

        {regular.length > 0 && (
          <section className="tpage-regular">
            <Container>
              {featured.length > 0 && <p className="tpage-label">More Reviews</p>}
              <div className="tpage-regular-grid">
                {regular.map((t) => (
                  <TestimonialCard key={t.id} t={t} />
                ))}
              </div>
            </Container>
          </section>
        )}

        <CTASection />
      </main>
    </>
  );
}