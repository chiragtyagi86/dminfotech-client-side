// src/components/about/AboutHero.jsx
import { Link } from "react-router-dom";
import Container from "../common/Container";

export default function AboutHero() {
  return (
    <section className="about-hero">
      <style>{`
        .about-hero {
          position: relative;
          overflow: hidden;
          padding: 120px 0 96px;
          background: var(--color-bg);
        }

        .about-hero-orb1 {
          position: absolute;
          width: 700px;
          height: 700px;
          border-radius: 50%;
          top: -300px;
          right: -200px;
          background: radial-gradient(circle, rgba(153,178,221,0.16) 0%, transparent 65%);
          pointer-events: none;
        }

        .about-hero-orb2 {
          position: absolute;
          width: 350px;
          height: 350px;
          border-radius: 50%;
          bottom: -80px;
          left: 5%;
          background: radial-gradient(circle, rgba(233,175,163,0.13) 0%, transparent 70%);
          pointer-events: none;
        }

        .about-hero-grid {
          position: absolute;
          inset: 0;
          background-image:
            linear-gradient(rgba(58,64,90,0.035) 1px, transparent 1px),
            linear-gradient(90deg, rgba(58,64,90,0.035) 1px, transparent 1px);
          background-size: 72px 72px;
          mask-image: radial-gradient(ellipse 65% 70% at 15% 50%, black 10%, transparent 100%);
          -webkit-mask-image: radial-gradient(ellipse 65% 70% at 15% 50%, black 10%, transparent 100%);
          pointer-events: none;
        }

        .about-hero-inner {
          position: relative;
          z-index: 1;
          max-width: 820px;
        }

        .about-hero-eyebrow {
          display: inline-flex;
          align-items: center;
          gap: 10px;
          padding: 5px 16px 5px 8px;
          border-radius: 100px;
          border: 1px solid rgba(104,80,68,0.14);
          background: rgba(255,255,255,0.55);
          backdrop-filter: blur(8px);
          margin-bottom: 28px;
          animation: aboutFadeUp 0.7s ease both;
        }

        .about-eyebrow-dot {
          width: 22px;
          height: 22px;
          border-radius: 50%;
          background: var(--color-primary);
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
        }

        .about-eyebrow-dot::after {
          content: '';
          width: 7px;
          height: 7px;
          border-radius: 50%;
          background: var(--color-surface, #fff);
          animation: aboutPulse 2.5s ease infinite;
        }

        @keyframes aboutPulse {
          0%,100% { transform: scale(1); opacity: 1; }
          50% { transform: scale(1.4); opacity: 0.65; }
        }

        .about-eyebrow-text {
          font-family: 'DM Sans', sans-serif;
          font-size: 11px;
          font-weight: 500;
          letter-spacing: 0.16em;
          text-transform: uppercase;
          color: var(--color-primary-2);
        }

        .about-hero-h1 {
          font-family: 'Cormorant Garamond', serif;
          font-size: clamp(44px, 7vw, 88px);
          font-weight: 300;
          line-height: 1.06;
          letter-spacing: -0.015em;
          color: var(--color-primary);
          margin: 0 0 28px;
          animation: aboutFadeUp 0.85s ease 0.1s both;
        }

        .about-hero-h1 em {
          font-style: italic;
          color: var(--color-primary-2);
        }

        .about-hero-rule {
          display: flex;
          align-items: center;
          gap: 12px;
          margin-bottom: 28px;
          animation: aboutFadeUp 0.85s ease 0.18s both;
        }

        .ahr-line {
          width: 48px;
          height: 1px;
          background: linear-gradient(90deg, var(--color-accent-blue), var(--color-accent-blush));
        }

        .ahr-diamond {
          width: 5px;
          height: 5px;
          border: 1px solid rgba(104,80,68,0.30);
          transform: rotate(45deg);
          background: var(--color-accent-blush);
          flex-shrink: 0;
        }

        .about-hero-desc {
          font-family: 'DM Sans', sans-serif;
          font-size: 17px;
          font-weight: 300;
          line-height: 1.85;
          color: var(--color-text-soft);
          max-width: 620px;
          margin: 0 0 44px;
          animation: aboutFadeUp 0.85s ease 0.22s both;
        }

        .about-hero-cta {
          animation: aboutFadeUp 0.85s ease 0.3s both;
        }

        .about-hero-btn {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          padding: 12px 28px;
          border-radius: 3px;
          background: var(--color-primary);
          color: #fff;
          font-family: 'DM Sans', sans-serif;
          font-size: 12.5px;
          font-weight: 500;
          letter-spacing: 0.09em;
          text-transform: uppercase;
          text-decoration: none;
          position: relative;
          overflow: hidden;
          transition: transform 0.3s ease, box-shadow 0.3s ease;
        }

        .about-hero-btn::before {
          content: '';
          position: absolute;
          inset: 0;
          background: linear-gradient(135deg, rgba(153,178,221,0.15), transparent 60%);
          opacity: 0;
          transition: opacity 0.3s ease;
        }

        .about-hero-btn:hover::before {
          opacity: 1;
        }

        .about-hero-btn:hover {
          transform: translateY(-2px);
          box-shadow: 0 10px 32px rgba(58,64,90,0.22);
        }

        .about-hero-btn-arrow {
          transition: transform 0.3s ease;
        }

        .about-hero-btn:hover .about-hero-btn-arrow {
          transform: translateX(4px);
        }

        .about-hero-credential {
          position: absolute;
          bottom: 40px;
          right: 0;
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 14px 20px;
          border-radius: 16px;
          border: 1px solid rgba(104,80,68,0.10);
          background: rgba(255,255,255,0.70);
          backdrop-filter: blur(16px);
          box-shadow: 0 8px 32px rgba(58,64,90,0.07);
          animation: aboutFadeUp 1s ease 0.45s both;
        }

        .credential-icon {
          width: 40px;
          height: 40px;
          border-radius: 10px;
          background: var(--color-primary);
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
        }

        .credential-icon svg {
          width: 20px;
          height: 20px;
          stroke: var(--color-surface, #fff);
          stroke-width: 1.5;
          fill: none;
        }

        .credential-text-top {
          font-family: 'Cormorant Garamond', serif;
          font-size: 15px;
          font-weight: 600;
          color: var(--color-primary);
          display: block;
        }

        .credential-text-bottom {
          font-family: 'DM Sans', sans-serif;
          font-size: 11px;
          font-weight: 300;
          color: var(--color-text-soft);
          display: block;
          letter-spacing: 0.04em;
        }

        @keyframes aboutFadeUp {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }

        @media (max-width: 767px) {
          .about-hero {
            padding: 88px 0 72px;
          }

          .about-hero-credential {
            display: none;
          }

          .about-hero-h1 {
            font-size: clamp(36px, 11vw, 56px);
          }

          .about-hero-desc {
            font-size: 15px;
          }

          .about-hero-orb1 {
            width: 420px;
            height: 420px;
            top: -180px;
            right: -120px;
          }

          .about-hero-orb2 {
            width: 260px;
            height: 260px;
            left: -20px;
          }
        }
      `}</style>

      <div className="about-hero-orb1" />
      <div className="about-hero-orb2" />
      <div className="about-hero-grid" />

      <Container>
        <div style={{ position: "relative" }}>
          <div className="about-hero-inner">
            <div>
              <div className="about-hero-eyebrow">
                <span className="about-eyebrow-dot" />
                <span className="about-eyebrow-text">About Dhanamitra Infotech LLP</span>
              </div>
            </div>

            <h1 className="about-hero-h1">
              Built on <em>purpose.</em>
              <br />
              Driven by results.
            </h1>

            <div className="about-hero-rule">
              <div className="ahr-line" />
              <div className="ahr-diamond" />
            </div>

            <p className="about-hero-desc">
              Dhanamitra Infotech LLP is an ISO 9001:2015 certified digital solutions company
              helping businesses grow through modern websites, custom software, strategic
              digital services, IT placements and professional training programs.
            </p>

            <div className="about-hero-cta">
              <Link to="/contact" className="about-hero-btn">
                Start a Conversation
                <span className="about-hero-btn-arrow">→</span>
              </Link>
            </div>
          </div>

          <div className="about-hero-credential">
            <div className="credential-icon">
              <svg viewBox="0 0 24 24">
                <polyline points="20,6 9,17 4,12" />
                <circle cx="12" cy="12" r="9" />
              </svg>
            </div>
            <div>
              <span className="credential-text-top">ISO 9001:2015</span>
              <span className="credential-text-bottom">Certified Quality Standards</span>
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}