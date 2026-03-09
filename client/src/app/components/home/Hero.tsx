import Button from "@/app/components/common/Button";
import Container from "@/app/components/common/Container";

export default function Hero() {
  return (
    <section className="hero-section">
      <style>{`
        .hero-section {
          position: relative;
          overflow: hidden;
          padding: 120px 0 100px;
          background: var(--color-bg);
        }

        .hero-orb {
          position: absolute;
          border-radius: 50%;
          filter: blur(90px);
          pointer-events: none;
          animation: heroFloat 12s ease-in-out infinite;
        }

        .hero-orb-1 {
          width: 560px;
          height: 560px;
          top: -180px;
          left: -120px;
          background: radial-gradient(circle, rgba(153, 178, 221, 0.28) 0%, transparent 70%);
          animation-delay: 0s;
        }

        .hero-orb-2 {
          width: 420px;
          height: 420px;
          top: 40px;
          right: -100px;
          background: radial-gradient(circle, rgba(233, 175, 163, 0.22) 0%, transparent 70%);
          animation-delay: -4s;
        }

        .hero-orb-3 {
          width: 300px;
          height: 300px;
          bottom: -60px;
          left: 40%;
          background: radial-gradient(circle, rgba(249, 222, 201, 0.35) 0%, transparent 70%);
          animation-delay: -8s;
        }

        @keyframes heroFloat {
          0%, 100% { transform: translateY(0px) scale(1); }
          50% { transform: translateY(-30px) scale(1.05); }
        }

        .hero-section::before {
          content: '';
          position: absolute;
          inset: 0;
          background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' opacity='0.03'/%3E%3C/svg%3E");
          pointer-events: none;
          z-index: 0;
          opacity: 0.55;
        }

        .hero-grid {
          position: absolute;
          inset: 0;
          background-image:
            linear-gradient(rgba(58, 64, 90, 0.04) 1px, transparent 1px),
            linear-gradient(90deg, rgba(58, 64, 90, 0.04) 1px, transparent 1px);
          background-size: 64px 64px;
          mask-image: radial-gradient(ellipse 80% 60% at 50% 40%, black 30%, transparent 100%);
          pointer-events: none;
        }

        .hero-content {
          position: relative;
          z-index: 1;
          text-align: center;
          max-width: 980px;
          margin: 0 auto;
        }

        .hero-eyebrow {
          display: inline-flex;
          align-items: center;
          gap: 10px;
          padding: 6px 18px 6px 8px;
          border-radius: 100px;
          border: 1px solid rgba(104, 80, 68, 0.15);
          background: rgba(255, 255, 255, 0.65);
          backdrop-filter: blur(8px);
          margin-bottom: 32px;
          animation: heroFadeUp 0.7s cubic-bezier(0.4, 0, 0.2, 1) both;
          box-shadow: var(--shadow-soft);
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
          background: var(--color-surface);
          animation: eyebrowPulse 2.5s ease infinite;
        }

        @keyframes eyebrowPulse {
          0%, 100% { transform: scale(1); opacity: 1; }
          50% { transform: scale(1.4); opacity: 0.7; }
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
          animation: heroFadeUp 0.8s cubic-bezier(0.4, 0, 0.2, 1) 0.1s both;
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
          animation: lineGrow 1s cubic-bezier(0.4, 0, 0.2, 1) 0.9s both;
        }

        @keyframes lineGrow {
          from { transform: scaleX(0); opacity: 0; }
          to { transform: scaleX(1); opacity: 1; }
        }

        .hero-sub {
          font-family: 'DM Sans', sans-serif;
          font-size: clamp(15px, 2vw, 18px);
          font-weight: 300;
          line-height: 1.8;
          color: var(--color-text-soft);
          max-width: 650px;
          margin: 24px auto 0;
          animation: heroFadeUp 0.8s cubic-bezier(0.4, 0, 0.2, 1) 0.2s both;
        }

        .hero-cta {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 14px;
          margin-top: 44px;
          flex-wrap: wrap;
          animation: heroFadeUp 0.8s cubic-bezier(0.4, 0, 0.2, 1) 0.3s both;
        }

        .hero-stats {
          display: grid;
          grid-template-columns: repeat(3, minmax(0, 1fr));
          gap: 18px;
          max-width: 820px;
          margin: 64px auto 0;
          animation: heroFadeUp 0.8s cubic-bezier(0.4, 0, 0.2, 1) 0.45s both;
        }

        .stat-card {
          position: relative;
          border-radius: 18px;
          border: 1px solid rgba(104, 80, 68, 0.10);
          background: rgba(255, 255, 255, 0.62);
          backdrop-filter: blur(12px);
          padding: 24px 20px;
          text-align: center;
          overflow: hidden;
          transition: transform 0.3s ease, box-shadow 0.3s ease;
          box-shadow: var(--shadow-soft);
        }

        .stat-card::before {
          content: '';
          position: absolute;
          inset: 0;
          background: linear-gradient(135deg, rgba(153, 178, 221, 0.12) 0%, transparent 55%);
          opacity: 0;
          transition: opacity 0.35s ease;
        }

        .stat-card:hover {
          transform: translateY(-4px);
          box-shadow: 0 16px 48px rgba(58, 64, 90, 0.10);
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

        .hero-ornament {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 12px;
          margin: 28px auto 0;
          width: fit-content;
          animation: heroFadeUp 0.8s cubic-bezier(0.4, 0, 0.2, 1) 0.35s both;
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

        @keyframes heroFadeUp {
          from { opacity: 0; transform: translateY(22px); }
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
            width: 360px;
            height: 360px;
            top: -120px;
            left: -100px;
          }

          .hero-orb-2 {
            width: 280px;
            height: 280px;
            right: -80px;
          }

          .hero-orb-3 {
            width: 220px;
            height: 220px;
            left: 30%;
          }
        }
      `}</style>

      <div className="hero-orb hero-orb-1" />
      <div className="hero-orb hero-orb-2" />
      <div className="hero-orb hero-orb-3" />
      <div className="hero-grid" />

      <Container>
        <div className="hero-content">
          <div style={{ display: "flex", justifyContent: "center" }}>
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
            software solutions, digital strategy, and performance-focused user experiences.
          </p>

          <div className="hero-cta">
            <Button href="/contact">Get Free Consultation</Button>
            <Button href="/services" variant="secondary">
              Explore Services
            </Button>
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