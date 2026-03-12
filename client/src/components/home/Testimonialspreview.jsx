// src/components/home/TestimonialsPreview.jsx
import { Link } from "react-router-dom";
import Container from "../common/Container";
import SectionHeading from "../common/SectionHeading";
import { useApi } from "../../lib/useApi";
import { api } from "../../lib/api";

const STATIC = [
  {
    id: 1,
    clientName: "Vikram Patel",
    clientRole: "Founder & CEO",
    clientCompany: "TechStart India",
    quote:
      "Dhanamitra transformed our digital presence completely. Their team understood our vision and delivered beyond expectations.",
    rating: 5,
  },
  {
    id: 2,
    clientName: "Anjali Sharma",
    clientRole: "Director of Operations",
    clientCompany: "Global Education Foundation",
    quote:
      "The platform they built is intuitive, scalable, and has revolutionized how we manage our operations.",
    rating: 5,
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
        clientimg: String(clientimg).trim(),
        clientCompany: String(clientCompany).trim(),
        quote:
          String(quote).trim() || "Great service and professional support.",
        rating,
      };
    })
    .filter((item) => item.quote);
}

function getInitial(name) {
  return (
    String(name || "?")
      .trim()
      .charAt(0)
      .toUpperCase() || "?"
  );
}

export default function TestimonialsPreview() {
  const { data, loading, error } = useApi(api.getTestimonials);

  const normalized = normalizeTestimonials(data);
  const items = (normalized.length ? normalized : STATIC).slice(0, 3);

  return (
    <section className="testimonials-section">
      <style>{`
        .testimonials-section {
          padding: 96px 0;
          background: var(--color-bg);
          position: relative;
          overflow: hidden;
        }

        .testimonials-section::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
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
          top: 0;
          left: 0;
          right: 0;
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

        .testimonials-actions {
          margin-top: 36px;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 10px;
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

        .testimonials-note {
          font-family: 'DM Sans', sans-serif;
          font-size: 12px;
          color: var(--color-text-soft);
          text-align: center;
        }

        @media (max-width: 767px) {
          .testimonials-section {
            padding: 80px 0;
          }

          .testimonials-grid {
            margin-top: 42px;
          }

          .testimonial-card {
            padding: 24px 20px;
          }

          .t-text {
            font-size: 17px;
          }

          .testimonials-bg-quote {
            font-size: 220px;
            top: 60px;
          }
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
          {items.map((item) => (
            <div key={item.id} className="testimonial-card">
              <span className="t-quote-mark">"</span>

              <div className="t-stars">
                {[...Array(5)].map((_, i) => (
                  <span
                    key={i}
                    className={`t-star${i < item.rating ? "" : " empty"}`}
                  />
                ))}
              </div>

              <p className="t-text">{item.quote}</p>

              <div className="t-footer">
                
               <div className="t-avatar">
  {item.clientimg ? (
    <img
      className="t-avatar"
      src={`${import.meta.env.VITE_API_URL}${item.clientimg}`}
      alt={item.name}
    />
  ) : (
    <div className="t-avatar-fallback">
      {getInitial(item.clientName)}
    </div>
  )}
</div>
                <div>
                  <p className="t-name">{item.clientName}</p>
                  <p className="t-role">
                    {item.clientRole}
                    {item.clientCompany ? ` · ${item.clientCompany}` : ""}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="testimonials-actions">
          <Link to="/testimonials" className="show-more-btn">
            View All Testimonials
          </Link>

          {error && (
            <div className="testimonials-note">
              Live testimonials could not be loaded, showing fallback content.
            </div>
          )}

          {loading && (
            <div className="testimonials-note">Loading testimonials...</div>
          )}
        </div>
      </Container>
    </section>
  );
}
