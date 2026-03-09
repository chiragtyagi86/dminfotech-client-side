import Container from "@/app/components/common/Container";
import SectionHeading from "@/app/components/common/SectionHeading";

const principles = [
  {
    num: "01",
    title: "Clarity before complexity",
    desc: "Every project starts with a clear brief. We ask the right questions before writing a single line of code or designing a single screen. Clarity is faster than assumption.",
  },
  {
    num: "02",
    title: "Design with purpose",
    desc: "Beautiful design that doesn't serve a goal is decoration. Every visual decision we make — layout, typography, colour, spacing — serves the user and the business objective.",
  },
  {
    num: "03",
    title: "Performance with elegance",
    desc: "A website that looks premium but loads slowly defeats itself. We build for speed, SEO and accessibility without compromising on the visual quality that builds trust.",
  },
  {
    num: "04",
    title: "Built for growth, not just launch",
    desc: "We design systems that scale. Whether it's a website, software platform or publishing workflow — the architecture is planned for what comes next, not just what's needed today.",
  },
];

export default function AboutPhilosophy() {
  return (
    <section className="about-phil">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,600;1,300&family=DM+Sans:wght@300;400;500&display=swap');

        .about-phil {
          padding: 96px 0;
          background: var(--color-primary);
          position: relative;
          overflow: hidden;
        }

        /* Background elements */
        .about-phil-grid {
          position: absolute;
          inset: 0;
          background-image:
            linear-gradient(rgba(255,250,247,0.03) 1px, transparent 1px),
            linear-gradient(90deg, rgba(255,250,247,0.03) 1px, transparent 1px);
          background-size: 64px 64px;
          pointer-events: none;
        }

        .about-phil-orb {
          position: absolute;
          width: 500px; height: 500px;
          border-radius: 50%;
          top: 50%; left: 50%;
          transform: translate(-50%, -50%);
          background: radial-gradient(circle, rgba(153,178,221,0.08) 0%, transparent 65%);
          pointer-events: none;
        }

        .about-phil-rule {
          position: absolute;
          top: 0; left: 0; right: 0;
          height: 1px;
          background: linear-gradient(90deg, transparent, rgba(249,222,201,0.15), transparent);
        }

        .about-phil-inner {
          position: relative;
          z-index: 1;
        }

        /* Overrides for SectionHeading on dark bg */
        .about-phil .sh-title {
          color: var(--color-surface) !important;
        }

        .about-phil .sh-desc {
          color: rgba(249,222,201,0.55) !important;
        }

        .about-phil .sh-eyebrow {
          color: rgba(249,222,201,0.45) !important;
        }

        /* Principles layout */
        .about-phil-list {
          display: grid;
          grid-template-columns: 1fr;
          gap: 2px;
          margin-top: 60px;
          border: 1px solid rgba(249,222,201,0.08);
          border-radius: 22px;
          overflow: hidden;
        }

        @media (min-width: 768px) {
          .about-phil-list { grid-template-columns: repeat(2, 1fr); }
        }

        .about-phil-item {
          padding: 44px 40px;
          background: rgba(255,255,255,0.03);
          border: 1px solid rgba(249,222,201,0.05);
          position: relative;
          overflow: hidden;
          transition: background 0.35s ease;
          cursor: default;
        }

        .about-phil-item:hover {
          background: rgba(255,255,255,0.06);
        }

        /* Corner accent shape */
        .about-phil-item::after {
          content: '';
          position: absolute;
          bottom: -30px; right: -30px;
          width: 100px; height: 100px;
          border-radius: 50%;
          background: radial-gradient(circle, rgba(153,178,221,0.10) 0%, transparent 70%);
          transition: transform 0.4s ease;
        }

        .about-phil-item:hover::after {
          transform: scale(1.5);
        }

        .about-phil-num {
          font-family: 'Cormorant Garamond', serif;
          font-size: 13px;
          font-weight: 300;
          letter-spacing: 0.18em;
          color: var(--color-accent-blush);
          margin-bottom: 20px;
          display: block;
          opacity: 0.7;
        }

        .about-phil-divider {
          width: 32px; height: 1px;
          background: linear-gradient(90deg, rgba(153,178,221,0.40), transparent);
          margin-bottom: 18px;
        }

        .about-phil-title {
          font-family: 'Cormorant Garamond', serif;
          font-size: 26px;
          font-weight: 300;
          font-style: italic;
          line-height: 1.25;
          color: var(--color-surface);
          margin: 0 0 16px;
        }

        .about-phil-desc {
          font-family: 'DM Sans', sans-serif;
          font-size: 13.5px;
          font-weight: 300;
          line-height: 1.80;
          color: rgba(249,222,201,0.55);
          margin: 0;
        }
      `}</style>

      <div className="about-phil-grid" />
      <div className="about-phil-orb" />
      <div className="about-phil-rule" />

      <Container>
        <div className="about-phil-inner">
          <SectionHeading
            eyebrow="How We Work"
            title="Our philosophy in practice"
            description="Four principles that govern how we approach every brief, every project and every client relationship."
          />

          <div className="about-phil-list">
            {principles.map((p) => (
              <div key={p.num} className="about-phil-item">
                <span className="about-phil-num">{p.num}</span>
                <div className="about-phil-divider" />
                <h3 className="about-phil-title">{p.title}</h3>
                <p className="about-phil-desc">{p.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </Container>
    </section>
  );
}