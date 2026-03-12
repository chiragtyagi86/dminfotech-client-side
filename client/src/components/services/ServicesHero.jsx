// src/components/services/ServicesHero.jsx
import Container from "../common/Container";

export default function ServicesHero() {
  return (
    <section className="svc-hero">
      <style>{`
        .svc-hero {
          position: relative;
          overflow: hidden;
          padding: 112px 0 88px;
          background: var(--color-bg);
        }

        .svc-hero-orb-1 {
          position: absolute;
          width: 600px;
          height: 600px;
          border-radius: 50%;
          top: -220px;
          right: -160px;
          background: radial-gradient(circle, rgba(153,178,221,0.20) 0%, transparent 70%);
          pointer-events: none;
          animation: svcOrbFloat 14s ease-in-out infinite;
        }

        .svc-hero-orb-2 {
          position: absolute;
          width: 400px;
          height: 400px;
          border-radius: 50%;
          bottom: -120px;
          left: -80px;
          background: radial-gradient(circle, rgba(233,175,163,0.15) 0%, transparent 70%);
          pointer-events: none;
          animation: svcOrbFloat 10s ease-in-out infinite reverse;
        }

        @keyframes svcOrbFloat {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-24px); }
        }

        .svc-hero-grid {
          position: absolute;
          inset: 0;
          background-image:
            linear-gradient(rgba(58,64,90,0.04) 1px, transparent 1px),
            linear-gradient(90deg, rgba(58,64,90,0.04) 1px, transparent 1px);
          background-size: 64px 64px;
          mask-image: radial-gradient(ellipse 70% 80% at 30% 50%, black 20%, transparent 100%);
          -webkit-mask-image: radial-gradient(ellipse 70% 80% at 30% 50%, black 20%, transparent 100%);
          pointer-events: none;
        }

        .svc-hero-inner {
          position: relative;
          z-index: 1;
          display: grid;
          grid-template-columns: 1fr;
          gap: 48px;
          align-items: center;
        }

        @media (min-width: 1024px) {
          .svc-hero-inner {
            grid-template-columns: 1fr 1fr;
            gap: 80px;
          }
        }

        .svc-hero-eyebrow {
          display: inline-flex;
          align-items: center;
          gap: 10px;
          padding: 5px 16px 5px 8px;
          border-radius: 100px;
          border: 1px solid rgba(104,80,68,0.14);
          background: rgba(255,255,255,0.55);
          backdrop-filter: blur(8px);
          margin-bottom: 24px;
          animation: svchFadeUp 0.7s ease both;
        }

        .svc-hero-eyebrow-dot {
          width: 22px;
          height: 22px;
          border-radius: 50%;
          background: var(--color-primary);
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .svc-hero-eyebrow-dot::after {
          content: '';
          width: 7px;
          height: 7px;
          border-radius: 50%;
          background: var(--color-surface, #fff);
        }

        .svc-hero-eyebrow-text {
          font-family: 'DM Sans', sans-serif;
          font-size: 11px;
          font-weight: 500;
          letter-spacing: 0.16em;
          text-transform: uppercase;
          color: var(--color-primary-2);
        }

        .svc-hero-h1 {
          font-family: 'Cormorant Garamond', serif;
          font-size: clamp(38px, 5.5vw, 72px);
          font-weight: 300;
          line-height: 1.08;
          color: var(--color-primary);
          margin: 0 0 24px;
          animation: svchFadeUp 0.8s ease 0.1s both;
        }

        .svc-hero-h1 em {
          font-style: italic;
          color: var(--color-primary-2);
        }

        .svc-hero-desc {
          font-family: 'DM Sans', sans-serif;
          font-size: 15px;
          font-weight: 300;
          line-height: 1.80;
          color: var(--color-text-soft);
          margin: 0 0 36px;
          max-width: 480px;
          animation: svchFadeUp 0.8s ease 0.2s both;
        }

        .svc-hero-pills {
          display: flex;
          flex-wrap: wrap;
          gap: 8px;
          animation: svchFadeUp 0.8s ease 0.3s both;
        }

        .svc-hero-pill {
          font-family: 'DM Sans', sans-serif;
          font-size: 11px;
          font-weight: 400;
          letter-spacing: 0.08em;
          color: var(--color-primary);
          border: 1px solid rgba(104,80,68,0.14);
          background: rgba(255,255,255,0.50);
          backdrop-filter: blur(6px);
          padding: 5px 14px;
          border-radius: 100px;
          transition: background 0.25s ease, border-color 0.25s ease;
          cursor: default;
        }

        .svc-hero-pill:hover {
          background: rgba(153,178,221,0.15);
          border-color: rgba(153,178,221,0.4);
        }

        .svc-hero-cards {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 14px;
          animation: svchFadeUp 0.9s ease 0.25s both;
        }

        .svc-hero-card {
          border-radius: 18px;
          border: 1px solid rgba(104,80,68,0.09);
          background: rgba(255,255,255,0.60);
          backdrop-filter: blur(12px);
          padding: 22px 20px;
          transition: transform 0.3s ease, box-shadow 0.3s ease;
        }

        .svc-hero-card:hover {
          transform: translateY(-4px);
          box-shadow: 0 16px 40px rgba(58,64,90,0.09);
        }

        .svc-hero-card:nth-child(2) {
          margin-top: 20px;
        }

        .svc-hero-card:nth-child(4) {
          margin-top: -20px;
        }

        .svc-hero-card-icon {
          width: 36px;
          height: 36px;
          border-radius: 10px;
          background: linear-gradient(135deg, var(--color-accent-blue), var(--color-accent-blush));
          display: flex;
          align-items: center;
          justify-content: center;
          margin-bottom: 14px;
        }

        .svc-hero-card-icon svg {
          width: 18px;
          height: 18px;
          stroke: white;
          stroke-width: 1.5;
          fill: none;
        }

        .svc-hero-card-title {
          font-family: 'DM Sans', sans-serif;
          font-size: 13px;
          font-weight: 500;
          color: var(--color-primary);
          margin: 0 0 5px;
        }

        .svc-hero-card-label {
          font-family: 'DM Sans', sans-serif;
          font-size: 11px;
          font-weight: 300;
          color: var(--color-text-soft);
          margin: 0;
          line-height: 1.5;
        }

        @keyframes svchFadeUp {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }

        @media (max-width: 767px) {
          .svc-hero {
            padding: 88px 0 72px;
          }

          .svc-hero-cards {
            grid-template-columns: 1fr;
          }

          .svc-hero-card:nth-child(2),
          .svc-hero-card:nth-child(4) {
            margin-top: 0;
          }

          .svc-hero-h1 {
            font-size: clamp(34px, 10vw, 54px);
          }

          .svc-hero-desc {
            font-size: 14px;
            max-width: 100%;
          }
        }
      `}</style>

      <div className="svc-hero-orb-1" />
      <div className="svc-hero-orb-2" />
      <div className="svc-hero-grid" />

      <Container>
        <div className="svc-hero-inner">
          <div>
            <div>
              <div className="svc-hero-eyebrow">
                <span className="svc-hero-eyebrow-dot" />
                <span className="svc-hero-eyebrow-text">Professional Digital Solutions</span>
              </div>
            </div>

            <h1 className="svc-hero-h1">
              Website Development,
              <br />
              Custom Software &amp;
              <br />
              <em>Digital Solutions</em>
            </h1>

            <p className="svc-hero-desc">
              End-to-end digital services for modern businesses — from premium
              website development and custom software to IT placements, research
              publishing, and stock market training.
            </p>

            <div className="svc-hero-pills">
              {[
                "Website Development",
                "Software Solutions",
                "IT Placements",
                "Journal Publishing",
                "Stock Market Training",
                "SEO & UI/UX",
              ].map((p) => (
                <span key={p} className="svc-hero-pill">{p}</span>
              ))}
            </div>
          </div>

          <div className="svc-hero-cards">
            {[
              {
                title: "Web & Software",
                label: "Business websites, apps & automation",
                icon: (
                  <>
                    <rect x="3" y="3" width="18" height="18" rx="3" />
                    <polyline points="9,9 15,9" />
                    <polyline points="9,13 13,13" />
                  </>
                ),
              },
              {
                title: "IT Placements",
                label: "Talent sourcing & tech staffing",
                icon: (
                  <>
                    <circle cx="12" cy="8" r="3" />
                    <path d="M6 20v-2a6 6 0 0112 0v2" />
                  </>
                ),
              },
              {
                title: "Research Journals",
                label: "Academic & professional publishing",
                icon: (
                  <>
                    <path d="M4 4h16v14H4z" />
                    <line x1="8" y1="9" x2="16" y2="9" />
                    <line x1="8" y1="13" x2="13" y2="13" />
                  </>
                ),
              },
              {
                title: "Stock Training",
                label: "Market analysis & investment learning",
                icon: (
                  <>
                    <polyline points="3,17 8,12 12,14 17,7 21,9" />
                    <line x1="3" y1="20" x2="21" y2="20" />
                  </>
                ),
              },
            ].map((card) => (
              <div key={card.title} className="svc-hero-card">
                <div className="svc-hero-card-icon">
                  <svg viewBox="0 0 24 24">{card.icon}</svg>
                </div>
                <p className="svc-hero-card-title">{card.title}</p>
                <p className="svc-hero-card-label">{card.label}</p>
              </div>
            ))}
          </div>
        </div>
      </Container>
    </section>
  );
}