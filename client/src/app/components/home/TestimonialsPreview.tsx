import Link from "next/link";
import Container from "@/app/components/common/Container";
import SectionHeading from "@/app/components/common/SectionHeading";
import Button from "../common/Button";

export type TestimonialPreview = {
  id: number;
  clientName: string;
  clientCompany: string;
  clientRole: string;
  quote: string;
  rating: number;
  featured?: boolean;
};

// ── Fetch featured testimonials from database ──────────────────────────────────
async function getFeaturedTestimonials(): Promise<TestimonialPreview[]> {
  try {
    const { getFeaturedTestimonials: dbGetFeatured } = await import("../../../../lib/testimonials-data");
    const testimonials = await dbGetFeatured();

    if (testimonials && testimonials.length > 0) {
      return testimonials.map((t) => ({
        id: t.id,
        clientName: t.clientName,
        clientCompany: t.clientCompany,
        clientRole: t.clientRole,
        quote: t.quote,
        rating: t.rating,
        featured: t.featured,
      }));
    }

    return [];
  } catch (error) {
    console.warn("Could not fetch featured testimonials from database:", error);
    return [];
  }
}

// ── Static fallback testimonials ──────────────────────────────────────────────
const STATIC_TESTIMONIALS: TestimonialPreview[] = [
  {
    id: 1,
    clientName: "Business Client",
    clientCompany: "Enterprise Partner",
    clientRole: "Enterprise Partner",
    quote: "The redesign direction feels premium, clean and highly professional. It instantly improves trust.",
    rating: 5,
    featured: true,
  },
  {
    id: 2,
    clientName: "Startup Founder",
    clientCompany: "Tech Venture",
    clientRole: "Tech Venture",
    quote: "The website structure is not only attractive but also strategic. It clearly supports lead generation.",
    rating: 5,
    featured: true,
  },
  {
    id: 3,
    clientName: "Institution Partner",
    clientCompany: "Education Sector",
    clientRole: "Education Sector",
    quote: "The team understands both presentation and performance. The result feels modern and credible.",
    rating: 5,
    featured: true,
  },
];

export default async function TestimonialsPreview() {
  const dbTestimonials = await getFeaturedTestimonials();
  const testimonials = dbTestimonials.length > 0 ? dbTestimonials : STATIC_TESTIMONIALS;

  // show maximum 3, but if only 1 or 2 exist then show those only
  const displayTestimonials = testimonials.slice(0, 3);

  // show button only if more than 3 testimonials exist


  return (
    <section className="testimonials-section">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,600;1,300;1,400&family=DM+Sans:wght@300;400;500&display=swap');

        .testimonials-section {
          padding: 96px 0;
          background: var(--color-bg);
          position: relative;
          overflow: hidden;
        }

        .testimonials-section::before {
          content: '';
          position: absolute;
          top: 0; left: 0; right: 0;
          height: 1px;
          background: linear-gradient(90deg, transparent, rgba(104,80,68,0.10), transparent);
        }

        .testimonials-bg-quote {
          position: absolute;
          top: 40px;
          left: 50%;
          transform: translateX(-50%);
          font-family: 'Cormorant Garamond', serif;
          font-size: 320px;
          font-weight: 600;
          line-height: 1;
          color: rgba(58,64,90,0.03);
          pointer-events: none;
          user-select: none;
          z-index: 0;
        }

        .testimonials-grid {
          display: grid;
          grid-template-columns: 1fr;
          gap: 20px;
          margin-top: 56px;
          position: relative;
          z-index: 1;
        }

        @media (min-width: 768px) {
          .testimonials-grid {
            grid-template-columns: repeat(3, 1fr);
          }
        }

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
          width: 38px;
          height: 38px;
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

        .t-stars {
          display: flex;
          gap: 3px;
          margin-bottom: 18px;
        }

        .t-star {
          width: 12px;
          height: 12px;
          background: linear-gradient(135deg, var(--color-accent-blue), var(--color-accent-blush));
          clip-path: polygon(50% 0%, 61% 35%, 98% 35%, 68% 57%, 79% 91%, 50% 70%, 21% 91%, 32% 57%, 2% 35%, 39% 35%);
        }

        .t-star.empty {
          background: rgba(104,80,68,0.15);
        }

        .testimonials-actions {
          margin-top: 36px;
          display: flex;
          justify-content: center;
          position: relative;
          z-index: 1;
        }

        .show-more-btn {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          padding: 14px 26px;
          text-decoration: none;
          font-family: 'DM Sans', sans-serif;
          font-size: 14px;
          font-weight: 500;
          letter-spacing: 0.04em;
          color: var(--color-primary);
          border: 1px solid rgba(104,80,68,0.14);
          background: rgba(255,255,255,0.72);
          backdrop-filter: blur(10px);
          transition: all 0.3s ease;
        }

        .show-more-btn:hover {
          transform: translateY(-2px);
          box-shadow: 0 16px 40px rgba(58,64,90,0.08);
          border-color: rgba(104,80,68,0.24);
        }
      `}</style>

      <div className="testimonials-bg-quote">"</div>

      <Container>
        <SectionHeading
          eyebrow="Testimonials"
          title="What strong digital positioning should feel like"
          description="Real client feedback powering your digital transformation."
        />

        <div className="testimonials-grid">
          {displayTestimonials.map((item) => (
            <div key={item.id} className="testimonial-card">
              <span className="t-quote-mark">"</span>

              <div className="t-stars">
                {[...Array(5)].map((_, i) => (
                  <span
                    key={i}
                    className={`t-star ${i < item.rating ? "" : "empty"}`}
                  />
                ))}
              </div>

              <p className="t-text">{item.quote}</p>

              <div className="t-footer">
                <div className="t-avatar">
                  {item.clientName?.charAt(0)?.toUpperCase() || "C"}
                </div>
                <div>
                  <p className="t-name">{item.clientName}</p>
                  <p className="t-role">{item.clientRole}</p>
                </div>
              </div>
            </div>
          ))}
        </div>


          <div className="testimonials-actions">
            <Link href="/testimonials" className="show-more-btn">
              View All Testimonials
            </Link>
          </div>
      </Container>
    </section>
  );
}