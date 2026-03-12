// src/components/about/AboutIntro.jsx
import Container from "../common/Container";

const pillars = [
  { label: "Design", desc: "Interfaces built for trust, clarity and conversion." },
  { label: "Technology", desc: "Scalable software engineered for performance." },
  { label: "Strategy", desc: "Business thinking embedded in every solution." },
];

export default function AboutIntro() {
  return (
    <section className="about-intro">
      <style>{`
        .about-intro {
          padding: 96px 0;
          background: var(--color-bg-soft);
          position: relative;
        }

        .about-intro::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          height: 1px;
          background: linear-gradient(90deg, transparent, rgba(104,80,68,0.10), transparent);
        }

        .about-intro-layout {
          display: grid;
          grid-template-columns: 1fr;
          gap: 64px;
          align-items: start;
        }

        @media (min-width: 1024px) {
          .about-intro-layout {
            grid-template-columns: 1.1fr 1fr;
            gap: 96px;
          }
        }

        .about-intro-eyebrow {
          font-family: 'DM Sans', sans-serif;
          font-size: 10.5px;
          font-weight: 500;
          letter-spacing: 0.22em;
          text-transform: uppercase;
          color: var(--color-primary-2);
          display: flex;
          align-items: center;
          gap: 10px;
          margin-bottom: 20px;
        }

        .about-intro-eyebrow::after {
          content: '';
          display: block;
          width: 32px;
          height: 1px;
          background: linear-gradient(90deg, var(--color-accent-blue), var(--color-accent-blush));
        }

        .about-intro-h2 {
          font-family: 'Cormorant Garamond', serif;
          font-size: clamp(32px, 4vw, 52px);
          font-weight: 300;
          line-height: 1.12;
          color: var(--color-primary);
          margin: 0 0 28px;
        }

        .about-intro-h2 em {
          font-style: italic;
          color: var(--color-primary-2);
        }

        .about-intro-body {
          display: flex;
          flex-direction: column;
          gap: 18px;
        }

        .about-intro-p {
          font-family: 'DM Sans', sans-serif;
          font-size: 15px;
          font-weight: 300;
          line-height: 1.85;
          color: var(--color-text-soft);
          margin: 0;
        }

        .about-intro-p strong {
          font-weight: 500;
          color: var(--color-primary);
        }

        .about-intro-right {
          display: flex;
          flex-direction: column;
          gap: 20px;
        }

        .about-intro-quote {
          border-radius: 20px;
          border: 1px solid rgba(104,80,68,0.09);
          background: var(--color-primary);
          padding: 36px 32px;
          position: relative;
          overflow: hidden;
        }

        .about-intro-quote::before {
          content: '"';
          position: absolute;
          top: -20px;
          right: 20px;
          font-family: 'Cormorant Garamond', serif;
          font-size: 180px;
          font-weight: 600;
          color: rgba(249,222,201,0.06);
          line-height: 1;
          pointer-events: none;
        }

        .about-quote-text {
          font-family: 'Cormorant Garamond', serif;
          font-size: 22px;
          font-weight: 300;
          font-style: italic;
          line-height: 1.55;
          color: var(--color-surface, rgba(255,250,247,0.95));
          margin: 0 0 20px;
          position: relative;
          z-index: 1;
        }

        .about-quote-attr {
          font-family: 'DM Sans', sans-serif;
          font-size: 10.5px;
          font-weight: 500;
          letter-spacing: 0.16em;
          text-transform: uppercase;
          color: rgba(249,222,201,0.45);
          display: flex;
          align-items: center;
          gap: 10px;
          position: relative;
          z-index: 1;
        }

        .about-quote-attr::before {
          content: '';
          width: 20px;
          height: 1px;
          background: rgba(249,222,201,0.30);
        }

        .about-pillars {
          display: flex;
          flex-direction: column;
          gap: 10px;
        }

        .about-pillar {
          display: flex;
          align-items: center;
          gap: 16px;
          padding: 16px 20px;
          border-radius: 14px;
          border: 1px solid rgba(104,80,68,0.08);
          background: rgba(255,255,255,0.65);
          backdrop-filter: blur(8px);
          transition: transform 0.3s ease, box-shadow 0.3s ease;
          cursor: default;
        }

        .about-pillar:hover {
          transform: translateX(4px);
          box-shadow: 0 8px 24px rgba(58,64,90,0.08);
        }

        .about-pillar-num {
          font-family: 'Cormorant Garamond', serif;
          font-size: 28px;
          font-weight: 600;
          color: var(--color-accent-blue);
          line-height: 1;
          flex-shrink: 0;
          width: 32px;
        }

        .about-pillar-label {
          font-family: 'DM Sans', sans-serif;
          font-size: 13.5px;
          font-weight: 500;
          color: var(--color-primary);
          margin: 0 0 3px;
        }

        .about-pillar-desc {
          font-family: 'DM Sans', sans-serif;
          font-size: 12px;
          font-weight: 300;
          color: var(--color-text-soft);
          margin: 0;
        }

        @media (max-width: 767px) {
          .about-intro {
            padding: 80px 0;
          }

          .about-intro-layout {
            gap: 48px;
          }

          .about-intro-h2 {
            font-size: clamp(28px, 9vw, 42px);
          }

          .about-intro-p {
            font-size: 14px;
          }

          .about-intro-quote {
            padding: 30px 24px;
          }

          .about-quote-text {
            font-size: 20px;
          }
        }
      `}</style>

      <Container>
        <div className="about-intro-layout">
          <div>
            <div className="about-intro-eyebrow">Who We Are</div>

            <h2 className="about-intro-h2">
              Where <em>design, technology</em>
              <br />
              and business thinking meet
            </h2>

            <div className="about-intro-body">
              <p className="about-intro-p">
                <strong>Dhanamitra Infotech LLP</strong> is a full-spectrum digital solutions company
                serving businesses, institutions and entrepreneurs who want to establish a
                credible, high-performance digital presence.
              </p>

              <p className="about-intro-p">
                We work across website development, custom software engineering, IT staffing,
                academic journal publishing and structured investment training — bringing
                the same standard of precision and intentionality to every engagement.
              </p>

              <p className="about-intro-p">
                Our approach is built on a single belief: <strong>technology should serve business
                goals, not the other way around.</strong> Every solution we deliver — from a corporate
                website to a complex software platform — is shaped first by strategy, then by design,
                then by technical execution.
              </p>

              <p className="about-intro-p">
                ISO 9001:2015 certified, we apply structured quality processes to ensure every
                project is delivered on time, on brief, and built to last.
              </p>
            </div>
          </div>

          <div className="about-intro-right">
            <div className="about-intro-quote">
              <p className="about-quote-text">
                "Technology should serve business goals — not the other way around."
              </p>
              <span className="about-quote-attr">Our Core Belief</span>
            </div>

            <div className="about-pillars">
              {pillars.map((p, i) => (
                <div key={p.label} className="about-pillar">
                  <span className="about-pillar-num">0{i + 1}</span>
                  <div>
                    <p className="about-pillar-label">{p.label}</p>
                    <p className="about-pillar-desc">{p.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}