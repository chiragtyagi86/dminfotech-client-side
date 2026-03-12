import Container from "@/app/components/common/Container";

export default function PortfolioHero() {
  return (
    <section className="port-hero">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,600;1,300;1,400&family=DM+Sans:wght@300;400;500&display=swap');

        .port-hero {
          position: relative;
          overflow: hidden;
          padding: 120px 0 88px;
          background: var(--color-bg);
        }

        .port-hero-orb1 {
          position: absolute;
          width: 500px; height: 500px; border-radius: 50%;
          top: -180px; left: -100px;
          background: radial-gradient(circle, rgba(153,178,221,0.18) 0%, transparent 70%);
          pointer-events: none;
          animation: portFloat 13s ease-in-out infinite;
        }
        .port-hero-orb2 {
          position: absolute;
          width: 380px; height: 380px; border-radius: 50%;
          bottom: -100px; right: -60px;
          background: radial-gradient(circle, rgba(233,175,163,0.14) 0%, transparent 70%);
          pointer-events: none;
          animation: portFloat 9s ease-in-out infinite reverse;
        }

        @keyframes portFloat {
          0%,100% { transform: translateY(0); }
          50% { transform: translateY(-28px); }
        }

        .port-hero-grid {
          position: absolute; inset: 0;
          background-image:
            linear-gradient(rgba(58,64,90,0.035) 1px, transparent 1px),
            linear-gradient(90deg, rgba(58,64,90,0.035) 1px, transparent 1px);
          background-size: 64px 64px;
          mask-image: radial-gradient(ellipse 80% 60% at 50% 40%, black 30%, transparent 100%);
          pointer-events: none;
        }

        .port-hero-inner {
          position: relative;
          z-index: 1;
          text-align: center;
          max-width: 760px;
          margin: 0 auto;
        }

        .port-eyebrow {
          display: inline-flex; align-items: center; gap: 10px;
          padding: 5px 16px 5px 8px;
          border-radius: 100px;
          border: 1px solid rgba(104,80,68,0.14);
          background: rgba(255,255,255,0.55);
          backdrop-filter: blur(8px);
          margin-bottom: 28px;
          animation: portFadeUp 0.7s ease both;
        }

        .port-eyebrow-dot {
          width: 22px; height: 22px; border-radius: 50%;
          background: var(--color-primary);
          display: flex; align-items: center; justify-content: center;
        }
        .port-eyebrow-dot::after {
          content: ''; width: 7px; height: 7px;
          border-radius: 50%; background: var(--color-surface);
        }

        .port-eyebrow-text {
          font-family: 'DM Sans', sans-serif;
          font-size: 11px; font-weight: 500;
          letter-spacing: 0.16em; text-transform: uppercase;
          color: var(--color-primary-2);
        }

        .port-h1 {
          font-family: 'Cormorant Garamond', serif;
          font-size: clamp(42px, 7vw, 84px);
          font-weight: 300; line-height: 1.06;
          color: var(--color-primary);
          margin: 0 0 24px;
          animation: portFadeUp 0.85s ease 0.1s both;
        }

        .port-h1 em { font-style: italic; color: var(--color-primary-2); }

        .port-ornament {
          display: flex; align-items: center; justify-content: center;
          gap: 12px; margin: 0 auto 24px;
          animation: portFadeUp 0.85s ease 0.18s both;
        }

        .port-orn-line {
          width: 48px; height: 1px;
          background: linear-gradient(90deg, transparent, rgba(104,80,68,0.25));
        }
        .port-orn-line.r { background: linear-gradient(90deg, rgba(104,80,68,0.25), transparent); }
        .port-orn-diamond {
          width: 5px; height: 5px;
          border: 1px solid rgba(104,80,68,0.28); transform: rotate(45deg);
          background: var(--color-accent-blush); flex-shrink: 0;
        }

        .port-desc {
          font-family: 'DM Sans', sans-serif;
          font-size: 16px; font-weight: 300; line-height: 1.85;
          color: var(--color-text-soft);
          max-width: 560px; margin: 0 auto 48px;
          animation: portFadeUp 0.85s ease 0.22s both;
        }

        /* Category filter pills */
        .port-filters {
          display: flex; flex-wrap: wrap;
          gap: 8px; justify-content: center;
          animation: portFadeUp 0.85s ease 0.3s both;
        }

        .port-filter-pill {
          font-family: 'DM Sans', sans-serif;
          font-size: 11.5px; font-weight: 400;
          letter-spacing: 0.08em;
          color: var(--color-primary);
          border: 1px solid rgba(104,80,68,0.15);
          background: rgba(255,255,255,0.55);
          backdrop-filter: blur(6px);
          padding: 6px 18px; border-radius: 100px;
          transition: background 0.25s ease, border-color 0.25s ease, color 0.25s ease;
          cursor: pointer;
        }

        .port-filter-pill:hover, .port-filter-pill.active {
          background: var(--color-primary);
          border-color: var(--color-primary);
          color: var(--color-surface);
        }

        @keyframes portFadeUp {
          from { opacity: 0; transform: translateY(20px); }
          to   { opacity: 1; transform: translateY(0); }
        }
      `}</style>

      <div className="port-hero-orb1" /><div className="port-hero-orb2" />
      <div className="port-hero-grid" />

      <Container>
        <div className="port-hero-inner">
          <div style={{ display: "flex", justifyContent: "center" }}>
            <div className="port-eyebrow">
              <span className="port-eyebrow-dot" />
              <span className="port-eyebrow-text">Our Work</span>
            </div>
          </div>

          <h1 className="port-h1">Digital solutions <em>delivered</em></h1>

          <div className="port-ornament">
            <div className="port-orn-line" />
            <div className="port-orn-diamond" />
            <div className="port-orn-line r" />
          </div>

          <p className="port-desc">
            A showcase of websites, software systems and digital experiences built
            for businesses that needed more than just a presence — they needed results.
          </p>

          <div className="port-filters">
            {["All Work", "Web Development", "Software", "UI/UX Design", "Digital Strategy", "Branding"].map((f) => (
              <span key={f} className={`port-filter-pill${f === "All Work" ? " active" : ""}`}>{f}</span>
            ))}
          </div>
        </div>
      </Container>
    </section>
  );
}