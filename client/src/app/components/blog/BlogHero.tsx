import Container from "@/app/components/common/Container";

export default function BlogHero() {
  return (
    <section className="blog-hero">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,600;1,300;1,400&family=DM+Sans:wght@300;400;500&display=swap');

        .blog-hero {
          position: relative;
          overflow: hidden;
          padding: 120px 0 80px;
          background: var(--color-bg);
        }

        .bh-orb1 {
          position: absolute;
          width: 600px; height: 600px; border-radius: 50%;
          top: -200px; right: -140px;
          background: radial-gradient(circle, rgba(153,178,221,0.16) 0%, transparent 65%);
          pointer-events: none;
          animation: bhFloat 14s ease-in-out infinite;
        }

        .bh-orb2 {
          position: absolute;
          width: 300px; height: 300px; border-radius: 50%;
          bottom: -60px; left: 10%;
          background: radial-gradient(circle, rgba(233,175,163,0.12) 0%, transparent 70%);
          pointer-events: none;
          animation: bhFloat 10s ease-in-out infinite reverse;
        }

        @keyframes bhFloat {
          0%,100% { transform: translateY(0); }
          50% { transform: translateY(-22px); }
        }

        .bh-grid {
          position: absolute; inset: 0;
          background-image:
            linear-gradient(rgba(58,64,90,0.033) 1px, transparent 1px),
            linear-gradient(90deg, rgba(58,64,90,0.033) 1px, transparent 1px);
          background-size: 64px 64px;
          mask-image: radial-gradient(ellipse 80% 60% at 50% 40%, black 30%, transparent 100%);
          pointer-events: none;
        }

        .bh-inner {
          position: relative; z-index: 1;
          text-align: center;
          max-width: 760px;
          margin: 0 auto;
        }

        .bh-eyebrow {
          display: inline-flex; align-items: center; gap: 10px;
          padding: 5px 16px 5px 8px; border-radius: 100px;
          border: 1px solid rgba(104,80,68,0.14);
          background: rgba(255,255,255,0.55); backdrop-filter: blur(8px);
          margin-bottom: 28px;
          animation: bhFadeUp 0.7s ease both;
        }

        .bh-eyebrow-dot {
          width: 22px; height: 22px; border-radius: 50%;
          background: var(--color-primary);
          display: flex; align-items: center; justify-content: center;
        }
        .bh-eyebrow-dot::after {
          content: ''; width: 7px; height: 7px;
          border-radius: 50%; background: var(--color-surface);
          animation: bhPulse 2.5s ease infinite;
        }
        @keyframes bhPulse {
          0%,100% { transform: scale(1); opacity: 1; }
          50% { transform: scale(1.4); opacity: 0.65; }
        }

        .bh-eyebrow-text {
          font-family: 'DM Sans', sans-serif;
          font-size: 11px; font-weight: 500;
          letter-spacing: 0.16em; text-transform: uppercase;
          color: var(--color-primary-2);
        }

        .bh-h1 {
          font-family: 'Cormorant Garamond', serif;
          font-size: clamp(40px, 7vw, 82px);
          font-weight: 300; line-height: 1.07;
          color: var(--color-primary);
          margin: 0 0 8px;
          animation: bhFadeUp 0.85s ease 0.1s both;
        }

        .bh-h1 em { font-style: italic; color: var(--color-primary-2); }

        .bh-h1-sub {
          font-family: 'Cormorant Garamond', serif;
          font-size: clamp(22px, 3.5vw, 40px);
          font-weight: 300; font-style: italic;
          color: var(--color-primary-2);
          opacity: 0.65;
          margin: 0 0 28px;
          animation: bhFadeUp 0.85s ease 0.15s both;
        }

        .bh-ornament {
          display: flex; align-items: center; justify-content: center;
          gap: 12px; margin: 0 auto 24px;
          animation: bhFadeUp 0.85s ease 0.2s both;
        }
        .bh-orn-line {
          width: 48px; height: 1px;
          background: linear-gradient(90deg, transparent, rgba(104,80,68,0.25));
        }
        .bh-orn-line.r { background: linear-gradient(90deg, rgba(104,80,68,0.25), transparent); }
        .bh-orn-diamond {
          width: 5px; height: 5px;
          border: 1px solid rgba(104,80,68,0.28); transform: rotate(45deg);
          background: var(--color-accent-blush); flex-shrink: 0;
        }

        .bh-desc {
          font-family: 'DM Sans', sans-serif;
          font-size: 16px; font-weight: 300; line-height: 1.85;
          color: var(--color-text-soft);
          max-width: 560px; margin: 0 auto;
          animation: bhFadeUp 0.85s ease 0.25s both;
        }

        @keyframes bhFadeUp {
          from { opacity: 0; transform: translateY(20px); }
          to   { opacity: 1; transform: translateY(0); }
        }
      `}</style>

      <div className="bh-orb1" /><div className="bh-orb2" />
      <div className="bh-grid" />

      <Container>
        <div className="bh-inner">
          <div style={{ display: "flex", justifyContent: "center" }}>
            <div className="bh-eyebrow">
              <span className="bh-eyebrow-dot" />
              <span className="bh-eyebrow-text">Insights & Ideas</span>
            </div>
          </div>

          <h1 className="bh-h1">Digital Insights</h1>
          <p className="bh-h1-sub">Web Development & Business Technology</p>

          <div className="bh-ornament">
            <div className="bh-orn-line" />
            <div className="bh-orn-diamond" />
            <div className="bh-orn-line r" />
          </div>

          <p className="bh-desc">
            Articles on website development, custom software, digital strategy,
            SEO architecture and modern business technology — written to help
            businesses make smarter digital decisions.
          </p>
        </div>
      </Container>
    </section>
  );
}