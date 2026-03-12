// src/components/home/WhyChooseUs.jsx
import Container from "../common/Container";
import SectionHeading from "../common/SectionHeading";

const reasons = [
  {
    title: "Modern Premium UI/UX",
    desc: "Interfaces crafted for beauty and conversion — not just aesthetics.",
  },
  {
    title: "SEO-Conscious Structure",
    desc: "Search-visible architecture built in from day one, not bolted on.",
  },
  {
    title: "Business-Oriented Planning",
    desc: "Every page serves a strategic purpose aligned with your goals.",
  },
  {
    title: "Scalable Architecture",
    desc: "Future-ready code and CMS integration paths that grow with you.",
  },
  {
    title: "Trust, Clarity & Conversion",
    desc: "We obsess over the moments that turn visitors into customers.",
  },
  {
    title: "Fully Responsive Design",
    desc: "Pixel-perfect layouts across every screen size and device.",
  },
];

export default function WhyChooseUs() {
  return (
    <section className="why-section">
      <style>{`
        .why-section {
          padding: 96px 0;
          background: var(--color-bg);
          position: relative;
          overflow: hidden;
        }

        .why-bg-shape {
          position: absolute;
          right: -200px;
          top: 50%;
          transform: translateY(-50%);
          width: 600px;
          height: 600px;
          border-radius: 50%;
          background: radial-gradient(circle, rgba(153,178,221,0.10) 0%, transparent 70%);
          pointer-events: none;
        }

        .why-layout {
          display: grid;
          grid-template-columns: 1fr;
          gap: 60px;
          margin-top: 56px;
          position: relative;
          z-index: 1;
        }

        @media (min-width: 1024px) {
          .why-layout {
            grid-template-columns: 1fr 1fr;
            align-items: start;
            gap: 80px;
          }
        }

        .why-pullquote {
          display: none;
        }

        @media (min-width: 1024px) {
          .why-pullquote {
            display: flex;
            flex-direction: column;
            justify-content: center;
            padding: 48px;
            border-radius: 24px;
            border: 1px solid rgba(104,80,68,0.09);
            background: linear-gradient(145deg, rgba(255,255,255,0.7), rgba(249,222,201,0.18));
            backdrop-filter: blur(12px);
            position: sticky;
            top: 100px;
          }
        }

        .pullquote-text {
          font-family: 'Cormorant Garamond', serif;
          font-size: 36px;
          font-weight: 300;
          font-style: italic;
          line-height: 1.35;
          color: var(--color-primary);
          margin: 0 0 24px;
        }

        .pullquote-text em {
          font-style: normal;
          font-weight: 600;
          color: var(--color-primary-2);
        }

        .pullquote-attr {
          font-family: 'DM Sans', sans-serif;
          font-size: 11px;
          font-weight: 500;
          letter-spacing: 0.16em;
          text-transform: uppercase;
          color: var(--color-text-soft);
          display: flex;
          align-items: center;
          gap: 10px;
        }

        .pullquote-attr::before {
          content: '';
          display: block;
          width: 24px;
          height: 1px;
          background: var(--color-accent-blush);
        }

        .why-stat-row {
          display: flex;
          gap: 32px;
          margin-top: 36px;
          padding-top: 32px;
          border-top: 1px solid rgba(104,80,68,0.08);
        }

        .why-stat {
          display: flex;
          flex-direction: column;
        }

        .why-stat-num {
          font-family: 'Cormorant Garamond', serif;
          font-size: 42px;
          font-weight: 600;
          line-height: 1;
          color: var(--color-primary);
        }

        .why-stat-label {
          font-family: 'DM Sans', sans-serif;
          font-size: 11px;
          font-weight: 400;
          letter-spacing: 0.10em;
          text-transform: uppercase;
          color: var(--color-text-soft);
          margin-top: 4px;
        }

        .why-list {
          display: flex;
          flex-direction: column;
          gap: 4px;
        }

        .why-item {
          display: flex;
          align-items: flex-start;
          gap: 16px;
          padding: 20px 0;
          border-bottom: 1px solid rgba(104,80,68,0.07);
          transition: padding-left 0.3s ease;
          cursor: default;
        }

        .why-item:last-child {
          border-bottom: none;
        }

        .why-item:hover {
          padding-left: 4px;
        }

        .why-check {
          flex-shrink: 0;
          margin-top: 3px;
          width: 20px;
          height: 20px;
          border-radius: 50%;
          background: linear-gradient(135deg, var(--color-accent-blue), var(--color-accent-blush));
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .why-check svg {
          width: 10px;
          height: 10px;
          stroke: white;
          stroke-width: 2.5;
          fill: none;
        }

        .why-item-body {
          flex: 1;
        }

        .why-item-title {
          font-family: 'DM Sans', sans-serif;
          font-size: 14.5px;
          font-weight: 500;
          color: var(--color-primary);
          margin: 0 0 4px;
        }

        .why-item-desc {
          font-family: 'DM Sans', sans-serif;
          font-size: 13px;
          font-weight: 300;
          line-height: 1.65;
          color: var(--color-text-soft);
          margin: 0;
        }

        @media (max-width: 1023px) {
          .why-layout {
            margin-top: 42px;
            gap: 24px;
          }

          .why-mobile-pullquote {
            display: block;
            padding: 28px 22px;
            border-radius: 20px;
            border: 1px solid rgba(104,80,68,0.09);
            background: linear-gradient(145deg, rgba(255,255,255,0.7), rgba(249,222,201,0.18));
            backdrop-filter: blur(12px);
          }

          .why-mobile-pullquote .pullquote-text {
            font-size: 28px;
            margin-bottom: 16px;
          }

          .why-mobile-stats {
            display: flex;
            gap: 24px;
            margin-top: 24px;
            padding-top: 20px;
            border-top: 1px solid rgba(104,80,68,0.08);
          }

          .why-section {
            padding: 80px 0;
          }
        }

        @media (min-width: 1024px) {
          .why-mobile-pullquote {
            display: none;
          }
        }
      `}</style>

      <div className="why-bg-shape" />

      <Container>
        <SectionHeading
          eyebrow="Why Choose Us"
          title="Designed for trust. Built for growth."
          description="We don't just build pages. We build digital foundations that help businesses look premium, communicate clearly and scale efficiently."
        />

        <div className="why-layout">
          <div className="why-mobile-pullquote">
            <p className="pullquote-text">
              "We build digital foundations that help businesses <em>look premium</em>,
              communicate clearly and scale efficiently."
            </p>
            <span className="pullquote-attr">Dhanamitra Infotech LLP</span>

            <div className="why-mobile-stats">
              <div className="why-stat">
                <span className="why-stat-num">ISO</span>
                <span className="why-stat-label">9001:2015 Certified</span>
              </div>
              <div className="why-stat">
                <span className="why-stat-num">100%</span>
                <span className="why-stat-label">Client-First Focus</span>
              </div>
            </div>
          </div>

          <div className="why-pullquote">
            <p className="pullquote-text">
              "We build digital foundations that help businesses <em>look premium</em>,
              communicate clearly and scale efficiently."
            </p>
            <span className="pullquote-attr">Dhanamitra Infotech LLP</span>

            <div className="why-stat-row">
              <div className="why-stat">
                <span className="why-stat-num">ISO</span>
                <span className="why-stat-label">9001:2015 Certified</span>
              </div>
              <div className="why-stat">
                <span className="why-stat-num">100%</span>
                <span className="why-stat-label">Client-First Focus</span>
              </div>
            </div>
          </div>

          <div className="why-list">
            {reasons.map((reason) => (
              <div key={reason.title} className="why-item">
                <div className="why-check">
                  <svg viewBox="0 0 12 12">
                    <polyline points="2,6 5,9 10,3" />
                  </svg>
                </div>
                <div className="why-item-body">
                  <p className="why-item-title">{reason.title}</p>
                  <p className="why-item-desc">{reason.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </Container>
    </section>
  );
}