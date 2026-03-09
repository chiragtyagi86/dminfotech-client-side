import Container from "@/app/components/common/Container";

const items = [
  "Website Development",
  "Software Solutions",
  "SEO-Ready Architecture",
  "Premium UI/UX",
  "Business Growth Support",
];

export default function TrustBar() {
  // Duplicate for seamless loop
  const doubled = [...items, ...items];

  return (
    <section className="trustbar-section">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@400;500&family=DM+Sans:wght@300;400;500&display=swap');

        .trustbar-section {
          padding: 0 0 40px;
          margin-top: 44px;
          position: relative;
        }

        .trustbar-wrap {
          border-radius: 20px;
          border: 1px solid rgba(104,80,68,0.10);
          background: rgba(255,255,255,0.55);
          backdrop-filter: blur(12px);
          padding: 0;
          overflow: hidden;
          position: relative;
        }

        /* Fade edges */
        .trustbar-wrap::before,
        .trustbar-wrap::after {
          content: '';
          position: absolute;
          top: 0; bottom: 0;
          width: 80px;
          z-index: 2;
          pointer-events: none;
        }
        .trustbar-wrap::before {
          left: 0;
          background: linear-gradient(90deg, rgba(255,250,247,0.95), transparent);
        }
        .trustbar-wrap::after {
          right: 0;
          background: linear-gradient(270deg, rgba(255,250,247,0.95), transparent);
        }

        .trustbar-track {
          display: flex;
          align-items: center;
          gap: 0;
          animation: trustScroll 28s linear infinite;
          width: max-content;
          padding: 18px 0;
        }

        .trustbar-track:hover {
          animation-play-state: paused;
        }

        @keyframes trustScroll {
          from { transform: translateX(0); }
          to   { transform: translateX(-50%); }
        }

        .trustbar-item {
          display: inline-flex;
          align-items: center;
          gap: 14px;
          padding: 0 28px;
          white-space: nowrap;
        }

        .trustbar-label {
          font-family: 'DM Sans', sans-serif;
          font-size: 12.5px;
          font-weight: 400;
          letter-spacing: 0.12em;
          text-transform: uppercase;
          color: var(--color-primary);
        }

        .trustbar-sep {
          width: 4px; height: 4px;
          border-radius: 50%;
          background: linear-gradient(135deg, var(--color-accent-blue), var(--color-accent-blush));
          flex-shrink: 0;
        }
      `}</style>

      <Container>
        <div className="trustbar-wrap">
          <div className="trustbar-track">
            {doubled.map((item, i) => (
              <span className="trustbar-item" key={i}>
                <span className="trustbar-sep" />
                <span className="trustbar-label">{item}</span>
              </span>
            ))}
          </div>
        </div>
      </Container>
    </section>
  );
}