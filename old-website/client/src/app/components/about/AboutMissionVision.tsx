import Container from "@/app/components/common/Container";
import SectionHeading from "@/app/components/common/SectionHeading";

export default function AboutMissionVision() {
  return (
    
    <section className="about-mv">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,600;1,300;1,400&family=DM+Sans:wght@300;400;500&display=swap');

        .about-mv {
          padding: 96px 0;
          background: var(--color-bg);
          position: relative;
          overflow: hidden;
        }

        .about-mv::before {
          content: '';
          position: absolute;
          top: 0; left: 0; right: 0;
          height: 1px;
          background: linear-gradient(90deg, transparent, rgba(104,80,68,0.10), transparent);
        }

        /* Big decorative letter */
        .about-mv-deco {
          position: absolute;
          bottom: -60px;
          right: -20px;
          font-family: 'Cormorant Garamond', serif;
          font-size: 340px;
          font-weight: 600;
          color: rgba(58,64,90,0.025);
          line-height: 1;
          pointer-events: none;
          user-select: none;
        }

        .about-mv-grid {
          display: grid;
          grid-template-columns: 1fr;
          gap: 24px;
          margin-top: 60px;
          position: relative;
          z-index: 1;
        }

        @media (min-width: 768px) {
          .about-mv-grid {
            grid-template-columns: 1fr 1fr;
          }
        }

        .about-mv-card {
          border-radius: 24px;
          padding: 48px 40px;
          position: relative;
          overflow: hidden;
          transition: transform 0.35s ease, box-shadow 0.35s ease;
        }

        .about-mv-card:hover {
          transform: translateY(-4px);
          box-shadow: 0 20px 56px rgba(58,64,90,0.10);
        }

        /* Mission: light card */
        .about-mv-mission {
          border: 1px solid rgba(104,80,68,0.10);
          background: rgba(255,255,255,0.65);
          backdrop-filter: blur(12px);
        }

        /* Vision: dark card */
        .about-mv-vision {
          border: 1px solid rgba(249,222,201,0.08);
          background: var(--color-primary);
        }

        /* Card corner accent */
        .about-mv-card::before {
          content: '';
          position: absolute;
          top: 0; right: 0;
          width: 120px; height: 120px;
          border-radius: 0 24px 0 120px;
          opacity: 0.08;
          transition: opacity 0.35s ease;
        }

        .about-mv-mission::before {
          background: linear-gradient(135deg, var(--color-accent-blue), var(--color-accent-blush));
        }

        .about-mv-vision::before {
          background: linear-gradient(135deg, rgba(249,222,201,0.5), transparent);
          opacity: 0.06;
        }

        .about-mv-card:hover::before { opacity: 0.14; }

        /* Label badge */
        .about-mv-badge {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          margin-bottom: 24px;
          padding: 5px 14px 5px 5px;
          border-radius: 100px;
        }

        .about-mv-mission .about-mv-badge {
          border: 1px solid rgba(104,80,68,0.12);
          background: rgba(249,222,201,0.30);
        }

        .about-mv-vision .about-mv-badge {
          border: 1px solid rgba(249,222,201,0.14);
          background: rgba(249,222,201,0.08);
        }

        .about-mv-badge-dot {
          width: 24px; height: 24px;
          border-radius: 50%;
          display: flex; align-items: center; justify-content: center;
          flex-shrink: 0;
        }

        .about-mv-mission .about-mv-badge-dot {
          background: var(--color-primary);
        }

        .about-mv-vision .about-mv-badge-dot {
          background: rgba(249,222,201,0.20);
        }

        .about-mv-badge-dot svg {
          width: 12px; height: 12px;
          stroke: var(--color-surface);
          stroke-width: 2;
          fill: none;
        }

        .about-mv-badge-label {
          font-family: 'DM Sans', sans-serif;
          font-size: 10.5px;
          font-weight: 500;
          letter-spacing: 0.18em;
          text-transform: uppercase;
        }

        .about-mv-mission .about-mv-badge-label {
          color: var(--color-primary-2);
        }

        .about-mv-vision .about-mv-badge-label {
          color: rgba(249,222,201,0.55);
        }

        /* Card headline */
        .about-mv-card-title {
          font-family: 'Cormorant Garamond', serif;
          font-size: 32px;
          font-weight: 300;
          line-height: 1.2;
          margin: 0 0 20px;
        }

        .about-mv-mission .about-mv-card-title {
          color: var(--color-primary);
        }

        .about-mv-vision .about-mv-card-title {
          color: var(--color-surface);
        }

        .about-mv-card-title em {
          font-style: italic;
        }

        .about-mv-mission .about-mv-card-title em {
          color: var(--color-primary-2);
        }

        .about-mv-vision .about-mv-card-title em {
          color: var(--color-accent-blush);
        }

        /* Divider */
        .about-mv-divider {
          width: 40px; height: 1px;
          margin-bottom: 20px;
        }

        .about-mv-mission .about-mv-divider {
          background: linear-gradient(90deg, var(--color-accent-blue), transparent);
        }

        .about-mv-vision .about-mv-divider {
          background: linear-gradient(90deg, rgba(249,222,201,0.30), transparent);
        }

        /* Card body */
        .about-mv-card-body {
          font-family: 'DM Sans', sans-serif;
          font-size: 14.5px;
          font-weight: 300;
          line-height: 1.85;
          margin: 0;
        }

        .about-mv-mission .about-mv-card-body {
          color: var(--color-text-soft);
        }

        .about-mv-vision .about-mv-card-body {
          color: rgba(249,222,201,0.62);
        }
      `}</style>

      <div className="about-mv-deco">M</div>

      <Container>
        <SectionHeading
          eyebrow="Mission & Vision"
          title="Intentional by design. Clear in direction."
          description="Two ideas that drive every decision we make — from the smallest design detail to the largest technical architecture."
        />

        <div className="about-mv-grid">
          {/* Mission */}
          <div className="about-mv-card about-mv-mission">
            <div className="about-mv-badge">
              <span className="about-mv-badge-dot">
                <svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="4" fill="currentColor" stroke="none"/></svg>
              </span>
              <span className="about-mv-badge-label">Our Mission</span>
            </div>
            <h3 className="about-mv-card-title">
              Deliver digital solutions that<br /><em>genuinely move businesses forward</em>
            </h3>
            <div className="about-mv-divider" />
            <p className="about-mv-card-body">
              To provide modern businesses with the websites, software, talent and knowledge
              they need to operate effectively, appear credibly and grow consistently in
              the digital economy. Every engagement we take on is measured by one question:
              does this create real, lasting value for our client?
            </p>
          </div>

          {/* Vision */}
          <div className="about-mv-card about-mv-vision">
            <div className="about-mv-badge">
              <span className="about-mv-badge-dot">
                <svg viewBox="0 0 24 24"><path d="M12 2l3 7h7l-6 4 2 7-6-4-6 4 2-7-6-4h7z" strokeLinejoin="round"/></svg>
              </span>
              <span className="about-mv-badge-label">Our Vision</span>
            </div>
            <h3 className="about-mv-card-title">
              To be the <em>most trusted</em> digital partner<br />for businesses across India
            </h3>
            <div className="about-mv-divider" />
            <p className="about-mv-card-body">
              We are building toward a future where every business — regardless of size
              or sector — has access to premium-quality digital infrastructure, expert
              software and the knowledge to compete confidently. Dhanamitra Infotech LLP
              aims to be the name businesses turn to first when they are ready to grow.
            </p>
          </div>
        </div>
      </Container>
    </section>
  );
}