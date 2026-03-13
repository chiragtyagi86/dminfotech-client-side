// src/components/home/Hero.jsx
import { Link } from "react-router-dom";
import Container from "../common/Container";

export default function Hero() {
  return (
    <section className="hero-section">
      <style>{`
        .hero-section {
          position: relative;
          overflow: hidden;
          padding: 120px 0 100px;
          background:
            radial-gradient(circle at 10% 10%, rgba(153, 178, 221, 0.14), transparent 30%),
            radial-gradient(circle at 90% 20%, rgba(233, 175, 163, 0.12), transparent 28%),
            radial-gradient(circle at 50% 85%, rgba(249, 222, 201, 0.14), transparent 24%),
            var(--color-bg);
        }

        .hero-orb {
          position: absolute;
          border-radius: 50%;
          pointer-events: none;
          opacity: 0.6;
        }

        .hero-orb-1 {
          width: 320px;
          height: 320px;
          top: -80px;
          left: -60px;
          background: radial-gradient(circle, rgba(153, 178, 221, 0.18) 0%, transparent 70%);
        }

        .hero-orb-2 {
          width: 260px;
          height: 260px;
          top: 40px;
          right: -50px;
          background: radial-gradient(circle, rgba(233, 175, 163, 0.16) 0%, transparent 70%);
        }

        .hero-orb-3 {
          width: 220px;
          height: 220px;
          bottom: -40px;
          left: 42%;
          background: radial-gradient(circle, rgba(249, 222, 201, 0.18) 0%, transparent 70%);
        }

        .hero-grid {
          position: absolute;
          inset: 0;
          background-image:
            linear-gradient(rgba(58, 64, 90, 0.03) 1px, transparent 1px),
            linear-gradient(90deg, rgba(58, 64, 90, 0.03) 1px, transparent 1px);
          background-size: 64px 64px;
          pointer-events: none;
          opacity: 0.45;
        }

        .hero-content {
          position: relative;
          z-index: 1;
          text-align: center;
          max-width: 980px;
          margin: 0 auto;
        }

        .hero-eyebrow-wrap {
          display: flex;
          justify-content: center;
        }

        .hero-eyebrow {
          display: inline-flex;
          align-items: center;
          gap: 10px;
          padding: 6px 18px 6px 8px;
          border-radius: 100px;
          border: 1px solid rgba(104, 80, 68, 0.12);
          background: rgba(255, 255, 255, 0.88);
          margin-bottom: 32px;
          animation: heroFadeUp 0.6s ease both;
          box-shadow: 0 8px 24px rgba(58, 64, 90, 0.05);
        }

        .eyebrow-dot {
          display: flex;
          align-items: center;
          justify-content: center;
          width: 24px;
          height: 24px;
          border-radius: 50%;
          background: var(--color-primary);
          flex-shrink: 0;
        }

        .eyebrow-dot::after {
          content: '';
          display: block;
          width: 7px;
          height: 7px;
          border-radius: 50%;
          background: var(--color-surface, #fff);
        }

        .eyebrow-text {
          font-family: 'DM Sans', sans-serif;
          font-size: 11.5px;
          font-weight: 500;
          letter-spacing: 0.14em;
          text-transform: uppercase;
          color: var(--color-primary-2);
        }

        .hero-headline {
          font-family: 'Cormorant Garamond', serif;
          font-size: clamp(42px, 7vw, 88px);
          font-weight: 300;
          line-height: 1.08;
          letter-spacing: -0.01em;
          color: var(--color-primary);
          margin: 0 0 8px;
          animation: heroFadeUp 0.7s ease 0.08s both;
        }

        .hero-headline em {
          font-style: italic;
          font-weight: 300;
          color: var(--color-primary-2);
        }

        .hero-headline strong {
          font-weight: 600;
          font-style: normal;
          position: relative;
          display: inline-block;
        }

        .hero-headline strong::after {
          content: '';
          position: absolute;
          bottom: 4px;
          left: 0;
          width: 100%;
          height: 2px;
          background: linear-gradient(90deg, var(--color-accent-blue), var(--color-accent-blush));
          border-radius: 2px;
          transform-origin: left;
          animation: lineGrow 0.8s ease 0.5s both;
        }

        @keyframes lineGrow {
          from { transform: scaleX(0); opacity: 0; }
          to { transform: scaleX(1); opacity: 1; }
        }

        .hero-ornament {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 12px;
          margin: 28px auto 0;
          width: fit-content;
          animation: heroFadeUp 0.7s ease 0.16s both;
        }

        .ornament-line {
          width: 60px;
          height: 1px;
          background: linear-gradient(90deg, transparent, rgba(104, 80, 68, 0.25));
        }

        .ornament-line.right {
          background: linear-gradient(90deg, rgba(104, 80, 68, 0.25), transparent);
        }

        .ornament-diamond {
          width: 6px;
          height: 6px;
          border: 1px solid rgba(104, 80, 68, 0.30);
          transform: rotate(45deg);
          background: var(--color-accent-blush);
        }

        .hero-sub {
          font-family: 'DM Sans', sans-serif;
          font-size: clamp(15px, 2vw, 18px);
          font-weight: 300;
          line-height: 1.8;
          color: var(--color-text-soft);
          max-width: 650px;
          margin: 24px auto 0;
          animation: heroFadeUp 0.7s ease 0.12s both;
        }

        .hero-cta {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 14px;
          margin-top: 44px;
          flex-wrap: wrap;
          animation: heroFadeUp 0.7s ease 0.2s both;
        }

        .hero-btn-primary,
        .hero-btn-secondary {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          gap: 6px;
          min-width: 210px;
          padding: 14px 28px;
          border-radius: 3px;
          font-family: 'DM Sans', sans-serif;
          font-size: 12.5px;
          font-weight: 500;
          letter-spacing: 0.09em;
          text-transform: uppercase;
          text-decoration: none;
          transition: transform 0.2s ease, box-shadow 0.2s ease, background 0.2s ease, border-color 0.2s ease, color 0.2s ease;
        }

        .hero-btn-primary {
          background: var(--color-primary);
          color: #fff;
          box-shadow: 0 10px 22px rgba(58, 64, 90, 0.12);
        }

        .hero-btn-primary:hover {
          transform: translateY(-2px);
          box-shadow: 0 14px 28px rgba(58, 64, 90, 0.16);
        }

        .hero-btn-secondary {
          background: #fff;
          color: var(--color-primary);
          border: 1px solid rgba(104, 80, 68, 0.16);
        }

        .hero-btn-secondary:hover {
          background: rgba(104, 80, 68, 0.05);
          border-color: rgba(104, 80, 68, 0.28);
          transform: translateY(-2px);
        }

        .hero-stats {
          display: grid;
          grid-template-columns: repeat(3, minmax(0, 1fr));
          gap: 18px;
          max-width: 820px;
          margin: 64px auto 0;
          animation: heroFadeUp 0.7s ease 0.24s both;
        }

        .stat-card {
          position: relative;
          border-radius: 18px;
          border: 1px solid rgba(104, 80, 68, 0.10);
          background: rgba(255, 255, 255, 0.9);
          padding: 24px 20px;
          text-align: center;
          overflow: hidden;
          transition: transform 0.25s ease, box-shadow 0.25s ease;
          box-shadow: 0 10px 24px rgba(58, 64, 90, 0.05);
        }

        .stat-card::before {
          content: '';
          position: absolute;
          inset: 0;
          background: linear-gradient(135deg, rgba(153, 178, 221, 0.08) 0%, transparent 55%);
          opacity: 0;
          transition: opacity 0.25s ease;
        }

        .stat-card:hover {
          transform: translateY(-3px);
          box-shadow: 0 14px 30px rgba(58, 64, 90, 0.08);
        }

        .stat-card:hover::before {
          opacity: 1;
        }

        .stat-accent {
          position: absolute;
          top: 0;
          left: 50%;
          transform: translateX(-50%);
          width: 42px;
          height: 2px;
          border-radius: 0 0 4px 4px;
          background: linear-gradient(90deg, var(--color-accent-blue), var(--color-accent-blush));
        }

        .stat-label-top {
          font-family: 'Cormorant Garamond', serif;
          font-size: 28px;
          font-weight: 600;
          color: var(--color-primary);
          line-height: 1;
          margin-bottom: 8px;
        }

        .stat-label-bottom {
          font-family: 'DM Sans', sans-serif;
          font-size: 12px;
          font-weight: 400;
          letter-spacing: 0.04em;
          color: var(--color-text-soft);
          line-height: 1.55;
        }

        @keyframes heroFadeUp {
          from { opacity: 0; transform: translateY(18px); }
          to { opacity: 1; transform: translateY(0); }
        }

        @media (max-width: 900px) {
          .hero-section {
            padding: 100px 0 84px;
          }

          .hero-stats {
            gap: 14px;
          }
        }

        @media (max-width: 640px) {
          .hero-section {
            padding: 88px 0 72px;
          }

          .hero-headline {
            font-size: clamp(36px, 11vw, 54px);
            line-height: 1.12;
          }

          .hero-sub {
            max-width: 100%;
            margin-top: 20px;
          }

          .hero-cta {
            margin-top: 34px;
          }

          .hero-stats {
            grid-template-columns: 1fr;
            max-width: 340px;
            margin-top: 48px;
          }

          .hero-orb-1 {
            width: 220px;
            height: 220px;
            top: -50px;
            left: -40px;
          }

          .hero-orb-2 {
            width: 180px;
            height: 180px;
            right: -40px;
          }

          .hero-orb-3 {
            width: 160px;
            height: 160px;
            left: 30%;
          }
        }

        @media (prefers-reduced-motion: reduce) {
          .hero-eyebrow,
          .hero-headline,
          .hero-headline strong::after,
          .hero-ornament,
          .hero-sub,
          .hero-cta,
          .hero-stats {
            animation: none !important;
          }

          .hero-btn-primary,
          .hero-btn-secondary,
          .stat-card {
            transition: none !important;
          }
        }
      `}</style>

      <div className="hero-orb hero-orb-1" />
      <div className="hero-orb hero-orb-2" />
      <div className="hero-orb hero-orb-3" />
      <div className="hero-grid" />

      <Container>
        <div className="hero-content">
          <div className="hero-eyebrow-wrap">
            <div className="hero-eyebrow">
              <span className="eyebrow-dot" />
              <span className="eyebrow-text">Premium Digital Solutions</span>
            </div>
          </div>

          <h1 className="hero-headline">
            Build <em>Powerful</em> Websites,
            <br />
            Software &amp; <strong>Growth Systems</strong>
            <br />
            for Modern Brands
          </h1>

          <div className="hero-ornament">
            <div className="ornament-line" />
            <div className="ornament-diamond" />
            <div className="ornament-line right" />
          </div>

          <p className="hero-sub">
            Dhanamitra Infotech LLP helps businesses grow with modern websites,
            software solutions, digital strategy, and performance-focused user
            experiences.
          </p>

          <div className="hero-cta">
            <Link to="/contact" className="hero-btn-primary">
              Get Free Consultation
            </Link>
            <Link to="/services" className="hero-btn-secondary">
              Explore Services
            </Link>
          </div>

          <div className="hero-stats">
            <div className="stat-card">
              <div className="stat-accent" />
              <div className="stat-label-top">ISO</div>
              <div className="stat-label-bottom">
                9001:2015 Certified
                <br />
                Process Standards
              </div>
            </div>

            <div className="stat-card">
              <div className="stat-accent" />
              <div className="stat-label-top">UI/UX</div>
              <div className="stat-label-bottom">
                Modern, responsive &amp;
                <br />
                conversion-ready design
              </div>
            </div>

            <div className="stat-card">
              <div className="stat-accent" />
              <div className="stat-label-top">SEO</div>
              <div className="stat-label-bottom">
                Architecture built for
                <br />
                visibility &amp; growth
              </div>
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}