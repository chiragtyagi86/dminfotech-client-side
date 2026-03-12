import Button from "@/app/components/common/Button";
import Container from "@/app/components/common/Container";

export default function CTASection() {
  return (
    <section className="cta-section">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,600;1,300&family=DM+Sans:wght@300;400;500&display=swap');

        .cta-section {
          padding: 40px 0 96px;
        }

        .cta-card {
          position: relative;
          border-radius: 28px;
          overflow: hidden;
          border: 1px solid rgba(104,80,68,0.12);
          background: var(--color-primary);
          padding: 80px 40px;
          text-align: center;
        }

        /* Multi-layer background */
        .cta-bg-orb-1 {
          position: absolute;
          width: 500px; height: 500px;
          border-radius: 50%;
          top: -200px; left: -150px;
          background: radial-gradient(circle, rgba(153,178,221,0.18) 0%, transparent 70%);
          pointer-events: none;
        }

        .cta-bg-orb-2 {
          position: absolute;
          width: 400px; height: 400px;
          border-radius: 50%;
          bottom: -150px; right: -100px;
          background: radial-gradient(circle, rgba(233,175,163,0.15) 0%, transparent 70%);
          pointer-events: none;
        }

        /* Subtle grid */
        .cta-bg-grid {
          position: absolute;
          inset: 0;
          background-image:
            linear-gradient(rgba(255,250,247,0.04) 1px, transparent 1px),
            linear-gradient(90deg, rgba(255,250,247,0.04) 1px, transparent 1px);
          background-size: 64px 64px;
          pointer-events: none;
        }

        .cta-inner {
          position: relative;
          z-index: 1;
        }

        .cta-eyebrow {
          display: inline-flex;
          align-items: center;
          gap: 10px;
          margin-bottom: 28px;
          font-family: 'DM Sans', sans-serif;
          font-size: 11px;
          font-weight: 500;
          letter-spacing: 0.20em;
          text-transform: uppercase;
          color: var(--color-surface);
          opacity: 0.65;
        }

        .cta-eyebrow::before,
        .cta-eyebrow::after {
          content: '';
          display: block;
          width: 32px;
          height: 1px;
          background: rgba(249,222,201,0.35);
        }

        .cta-headline {
          font-family: 'Cormorant Garamond', serif;
          font-size: clamp(32px, 5vw, 58px);
          font-weight: 300;
          line-height: 1.15;
          color: var(--color-surface);
          margin: 0 auto 20px;
          max-width: 780px;
        }

        .cta-headline em {
          font-style: italic;
          font-weight: 300;
          color: var(--color-accent-blush);
        }

        .cta-desc {
          font-family: 'DM Sans', sans-serif;
          font-size: 15px;
          font-weight: 300;
          line-height: 1.80;
          color: rgba(249,222,201,0.65);
          max-width: 560px;
          margin: 0 auto 44px;
        }

        .cta-buttons {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 14px;
          flex-wrap: wrap;
        }

        /* Ornament line below headline */
        .cta-ornament {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 10px;
          margin: 0 auto 28px;
          width: fit-content;
        }

        .cta-orn-line {
          width: 48px; height: 1px;
          background: linear-gradient(90deg, transparent, rgba(249,222,201,0.25));
        }

        .cta-orn-line.r {
          background: linear-gradient(90deg, rgba(249,222,201,0.25), transparent);
        }

        .cta-orn-diamond {
          width: 5px; height: 5px;
          border: 1px solid rgba(249,222,201,0.35);
          transform: rotate(45deg);
          background: rgba(233,175,163,0.50);
        }
      `}</style>

      <Container>
        <div className="cta-card">
          <div className="cta-bg-orb-1" />
          <div className="cta-bg-orb-2" />
          <div className="cta-bg-grid" />

          <div className="cta-inner">
            <div className="cta-eyebrow">
              Let's Build Something Strong
            </div>

            <h2 className="cta-headline">
              Ready to redesign your digital presence with <em>premium UI</em>,
              clean structure and future-ready scalability?
            </h2>

            <div className="cta-ornament">
              <div className="cta-orn-line" />
              <div className="cta-orn-diamond" />
              <div className="cta-orn-line r" />
            </div>

            <p className="cta-desc">
              Start with a strong frontend foundation now, and expand into CMS,
              SEO content and growth systems in the next phase.
            </p>

            <div className="cta-buttons">
              <Button href="/contact">Book Free Consultation</Button>
              <Button href="/services">View Services</Button>
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}