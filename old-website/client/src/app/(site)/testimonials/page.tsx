import Container from "@/app/components/common/Container";
import SectionHeading from "@/app/components/common/SectionHeading";

export type Testimonial = {
  id: number;
  clientName: string;
  clientCompany: string;
  clientRole: string;
  clientPhoto?: string;
  quote: string;
  rating: number; // 1-5
  shortHighlight?: string;
  featured?: boolean;
};

// ── Fetch testimonials from database ──────────────────────────────────────────
async function getTestimonials(): Promise<Testimonial[]> {
  try {
    const { getAllTestimonials } = await import("../../../../lib/testimonials-data");
    const testimonials = await getAllTestimonials();
    
    // If we got data from database, return it
    if (testimonials && testimonials.length > 0) {
      return testimonials;
    }
    
    // Otherwise fall back to static data
    console.warn("No testimonials found in database, using static fallback");
    return STATIC_TESTIMONIALS;
  } catch (error) {
    console.warn("Could not fetch testimonials from database, using static fallback:", error);
    return STATIC_TESTIMONIALS;
  }
}

// ── Static fallback testimonials ──────────────────────────────────────────────
const STATIC_TESTIMONIALS: Testimonial[] = [
  {
    id: 1,
    clientName: "Vikram Patel",
    clientCompany: "TechStart India",
    clientRole: "Founder & CEO",
    clientPhoto: "/testimonials/vikram-patel.jpg",
    quote: "Dhanamitra transformed our digital presence completely. Their team understood our vision, delivered beyond expectations, and provided ongoing support that truly sets them apart.",
    rating: 5,
    shortHighlight: "Exceptional execution & support",
    featured: true,
  },
  {
    id: 2,
    clientName: "Anjali Sharma",
    clientCompany: "Global Education Foundation",
    clientRole: "Director of Operations",
    clientPhoto: "/testimonials/anjali-sharma.jpg",
    quote: "The platform they built for us is intuitive, scalable, and has revolutionized how we manage our operations. The attention to detail is remarkable.",
    rating: 5,
    shortHighlight: "Intuitive & scalable solution",
    featured: true,
  },
  {
    id: 3,
    clientName: "Rajesh Gupta",
    clientCompany: "FinServe Analytics",
    clientRole: "Chief Technology Officer",
    clientPhoto: "/testimonials/rajesh-gupta.jpg",
    quote: "Working with Dhanamitra was refreshing. They combined technical excellence with genuine care for our business outcomes. Highly recommend them.",
    rating: 5,
    shortHighlight: "Technical excellence combined with care",
    featured: false,
  },
  {
    id: 4,
    clientName: "Priya Desai",
    clientCompany: "Healthcare Solutions Ltd",
    clientRole: "VP Product",
    clientPhoto: "/testimonials/priya-desai.jpg",
    quote: "From strategy to execution, every step was professional and transparent. The final product exceeded our requirements and launched on time.",
    rating: 5,
    shortHighlight: "Professional & transparent process",
    featured: false,
  },
  {
    id: 5,
    clientName: "Arjun Kapoor",
    clientCompany: "E-Commerce Innovations",
    clientRole: "Founder",
    clientPhoto: "/testimonials/arjun-kapoor.jpg",
    quote: "The SEO architecture and performance optimization they implemented significantly improved our search rankings and conversion rates. Game-changing work.",
    rating: 5,
    shortHighlight: "Significant ranking improvements",
    featured: false,
  },
  {
    id: 6,
    clientName: "Meera Singh",
    clientCompany: "Business Consulting Group",
    clientRole: "Managing Director",
    clientPhoto: "/testimonials/meera-singh.jpg",
    quote: "Their strategic approach to digital transformation helped us position our brand as a premium player in our market. Results speak for themselves.",
    rating: 5,
    shortHighlight: "Premium brand positioning achieved",
    featured: false,
  },
];

export default async function TestimonialsPage() {
  const testimonials = await getTestimonials();

  // Separate featured and regular testimonials
  const featured = testimonials.filter((t) => t.featured);
  const regular = testimonials.filter((t) => !t.featured);

  return (
    <main className="testimonials-page">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,600;1,300&family=DM+Sans:wght@300;400;500&display=swap');

        .testimonials-page {
          background: var(--color-bg);
          min-height: 100vh;
        }

        /* ── Hero ── */
        .testimonials-hero {
          position: relative;
          overflow: hidden;
          padding: 100px 0 72px;
          background: var(--color-bg);
        }

        .testimonials-hero-orb1 {
          position: absolute;
          width: 500px;
          height: 500px;
          border-radius: 50%;
          top: -180px;
          right: -80px;
          background: radial-gradient(circle, rgba(153,178,221,0.12) 0%, transparent 65%);
          pointer-events: none;
        }

        .testimonials-hero-orb2 {
          position: absolute;
          width: 320px;
          height: 320px;
          border-radius: 50%;
          bottom: -60px;
          left: 3%;
          background: radial-gradient(circle, rgba(233,175,163,0.08) 0%, transparent 70%);
          pointer-events: none;
        }

        .testimonials-hero-inner {
          position: relative;
          z-index: 1;
          max-width: 680px;
          animation: testHeroFade 0.8s ease both;
        }

        @keyframes testHeroFade {
          from { opacity: 0; transform: translateY(18px); }
          to { opacity: 1; transform: translateY(0); }
        }

        .testimonials-eyebrow {
          font-family: 'DM Sans', sans-serif;
          font-size: 10.5px;
          font-weight: 500;
          letter-spacing: 0.22em;
          text-transform: uppercase;
          color: var(--color-primary-2);
          margin-bottom: 16px;
          display: flex;
          align-items: center;
          gap: 10px;
        }

        .testimonials-eyebrow::before {
          content: '';
          width: 28px;
          height: 1px;
          background: var(--color-primary-2);
        }

        .testimonials-h1 {
          font-family: 'Cormorant Garamond', serif;
          font-size: clamp(36px, 6vw, 68px);
          font-weight: 300;
          line-height: 1.08;
          color: var(--color-primary);
          margin: 0 0 20px;
        }

        .testimonials-h1 em {
          font-style: italic;
          color: var(--color-primary-2);
        }

        .testimonials-sub {
          font-family: 'DM Sans', sans-serif;
          font-size: 15px;
          font-weight: 300;
          line-height: 1.75;
          color: var(--color-text-soft);
          margin: 0;
        }

        /* ── Testimonials Section ── */
        .testimonials-section {
          padding: 80px 0 96px;
          background: var(--color-bg);
        }

        .testimonials-featured-section {
          margin-bottom: 80px;
        }

        .testimonials-featured-label {
          font-family: 'DM Sans', sans-serif;
          font-size: 10.5px;
          font-weight: 500;
          letter-spacing: 0.22em;
          text-transform: uppercase;
          color: var(--color-primary-2);
          display: flex;
          align-items: center;
          gap: 12px;
          margin-bottom: 24px;
        }

        .testimonials-featured-label::after {
          content: '';
          flex: 1;
          height: 1px;
          background: rgba(104,80,68,0.09);
        }

        .testimonials-featured-grid {
          display: grid;
          grid-template-columns: 1fr;
          gap: 20px;
          margin-bottom: 40px;
        }

        @media (min-width: 768px) {
          .testimonials-featured-grid {
            grid-template-columns: repeat(2, 1fr);
          }
        }

        /* ── Testimonial Card (Same as Preview) ── */
        .testimonial-card {
          border-radius: 24px;
          border: 1px solid rgba(104,80,68,0.09);
          background: rgba(255,255,255,0.60);
          backdrop-filter: blur(12px);
          padding: 32px 28px;
          display: flex;
          flex-direction: column;
          position: relative;
          overflow: hidden;
          transition: transform 0.35s cubic-bezier(0.4,0,0.2,1), box-shadow 0.35s ease;
        }

        .testimonial-card:hover {
          transform: translateY(-5px);
          box-shadow: 0 20px 56px rgba(58,64,90,0.09);
        }

        /* Top gradient line */
        .testimonial-card::before {
          content: '';
          position: absolute;
          top: 0; left: 0; right: 0;
          height: 2px;
          background: linear-gradient(90deg, var(--color-accent-blue), var(--color-accent-blush));
          border-radius: 24px 24px 0 0;
          opacity: 0;
          transition: opacity 0.35s ease;
        }

        .testimonial-card:hover::before {
          opacity: 1;
        }

        /* Quote mark */
        .t-quote-mark {
          font-family: 'Cormorant Garamond', serif;
          font-size: 56px;
          font-weight: 600;
          font-style: italic;
          line-height: 0.8;
          color: var(--color-accent-blush);
          margin-bottom: 16px;
          display: block;
        }

        /* Star rating */
        .t-stars {
          display: flex;
          gap: 3px;
          margin-bottom: 18px;
        }

        .t-star {
          width: 12px; height: 12px;
          background: linear-gradient(135deg, var(--color-accent-blue), var(--color-accent-blush));
          clip-path: polygon(50% 0%, 61% 35%, 98% 35%, 68% 57%, 79% 91%, 50% 70%, 21% 91%, 32% 57%, 2% 35%, 39% 35%);
        }

        .t-star.empty {
          background: rgba(104,80,68,0.15);
        }

        .t-text {
          font-family: 'Cormorant Garamond', serif;
          font-size: 18px;
          font-weight: 300;
          font-style: italic;
          line-height: 1.7;
          color: var(--color-primary);
          flex: 1;
          margin: 0 0 28px;
        }

        .t-footer {
          display: flex;
          align-items: center;
          gap: 12px;
          padding-top: 20px;
          border-top: 1px solid rgba(104,80,68,0.07);
        }

        .t-avatar {
          width: 38px; height: 38px;
          border-radius: 50%;
          background: linear-gradient(135deg, var(--color-accent-blue), var(--color-accent-blush));
          display: flex;
          align-items: center;
          justify-content: center;
          font-family: 'Cormorant Garamond', serif;
          font-size: 16px;
          font-weight: 600;
          color: white;
          flex-shrink: 0;
        }

        .t-name {
          font-family: 'DM Sans', sans-serif;
          font-size: 13.5px;
          font-weight: 500;
          color: var(--color-primary);
          margin: 0 0 2px;
        }

        .t-role {
          font-family: 'DM Sans', sans-serif;
          font-size: 11px;
          font-weight: 400;
          letter-spacing: 0.08em;
          color: var(--color-text-soft);
          margin: 0;
        }

        /* ── All Testimonials Grid ── */
        .testimonials-grid {
          display: grid;
          grid-template-columns: 1fr;
          gap: 20px;
        }

        @media (min-width: 768px) {
          .testimonials-grid {
            grid-template-columns: repeat(2, 1fr);
          }
        }

        @media (min-width: 1024px) {
          .testimonials-grid {
            grid-template-columns: repeat(3, 1fr);
          }
        }

        .testimonials-empty {
          text-align: center;
          padding: 80px 20px;
          color: var(--color-text-soft);
          font-family: 'DM Sans', sans-serif;
        }
      `}</style>

      {/* Hero */}
      <section className="testimonials-hero">
        <div className="testimonials-hero-orb1" />
        <div className="testimonials-hero-orb2" />
        <Container>
          <div className="testimonials-hero-inner">
            <p className="testimonials-eyebrow">Client Testimonials</p>
            <h1 className="testimonials-h1">
              What our clients say about <em>our work</em>
            </h1>
            <p className="testimonials-sub">
              Real feedback from real clients. Discover how we've helped businesses achieve their digital goals through strategy, design, and technology.
            </p>
          </div>
        </Container>
      </section>

      {/* Testimonials Grid */}
      <section className="testimonials-section">
        <Container>
          {testimonials.length === 0 ? (
            <div className="testimonials-empty">
              <p>No testimonials to display yet.</p>
            </div>
          ) : (
            <>
              {/* Featured Testimonials */}
              {featured.length > 0 && (
                <div className="testimonials-featured-section">
                  <p className="testimonials-featured-label">Featured Testimonials</p>
                  <div className="testimonials-featured-grid">
                    {featured.map((testimonial) => (
                      <div key={testimonial.id} className="testimonial-card">
                        <span className="t-quote-mark">"</span>
                        <div className="t-stars">
                          {[...Array(5)].map((_, i) => (
                            <span 
                              key={i} 
                              className={`t-star ${i < testimonial.rating ? "" : "empty"}`}
                            />
                          ))}
                        </div>
                        <p className="t-text">{testimonial.quote}</p>
                        <div className="t-footer">
                          <div className="t-avatar">
                            {testimonial.clientName.charAt(0).toUpperCase()}
                          </div>
                          <div>
                            <p className="t-name">{testimonial.clientName}</p>
                            <p className="t-role">{testimonial.clientRole}</p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* All Testimonials (including non-featured) */}
              {(featured.length > 0 || regular.length > 0) && (
                <div>
                  {featured.length > 0 && regular.length > 0 && (
                    <p className="testimonials-featured-label">More Testimonials</p>
                  )}
                  {regular.length > 0 && (
                    <div className="testimonials-grid">
                      {regular.map((testimonial) => (
                        <div key={testimonial.id} className="testimonial-card">
                          <span className="t-quote-mark">"</span>
                          <div className="t-stars">
                            {[...Array(5)].map((_, i) => (
                              <span 
                                key={i} 
                                className={`t-star ${i < testimonial.rating ? "" : "empty"}`}
                              />
                            ))}
                          </div>
                          <p className="t-text">{testimonial.quote}</p>
                          <div className="t-footer">
                            <div className="t-avatar">
                              {testimonial.clientName.charAt(0).toUpperCase()}
                            </div>
                            <div>
                              <p className="t-name">{testimonial.clientName}</p>
                              <p className="t-role">{testimonial.clientRole}</p>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </>
          )}
        </Container>
      </section>
    </main>
  );
}