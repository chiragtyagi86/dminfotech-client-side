import Container from "@/app/components/common/Container";
import SectionHeading from "@/app/components/common/SectionHeading";

const steps = [
  {
    num: "01",
    title: "Discovery & Brief",
    desc: "We begin with a structured consultation to understand your business goals, audience, technical needs and success metrics.",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
        <circle cx="11" cy="11" r="8" />
        <line x1="21" y1="21" x2="16.65" y2="16.65" />
        <line x1="11" y1="8" x2="11" y2="14" />
        <line x1="8" y1="11" x2="14" y2="11" />
      </svg>
    ),
  },
  {
    num: "02",
    title: "Strategy & Planning",
    desc: "We define the architecture, technology stack, content structure and project roadmap with clear milestones and deliverables.",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
        <rect x="3" y="3" width="18" height="18" rx="3" />
        <line x1="9" y1="9" x2="15" y2="9" />
        <line x1="9" y1="13" x2="13" y2="13" />
        <line x1="9" y1="17" x2="11" y2="17" />
      </svg>
    ),
  },
  {
    num: "03",
    title: "Design & Development",
    desc: "Our team builds your solution with precision — responsive UI, clean code, performance optimization and continuous review cycles.",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
        <polyline points="16,18 22,12 16,6" />
        <polyline points="8,6 2,12 8,18" />
        <line x1="19" y1="12" x2="5" y2="12" strokeDasharray="2 2" />
      </svg>
    ),
  },
  {
    num: "04",
    title: "Review & Refine",
    desc: "We conduct structured testing, client reviews and quality assurance to ensure everything meets your expectations before launch.",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
        <polyline points="20,6 9,17 4,12" />
        <circle cx="12" cy="12" r="9" />
      </svg>
    ),
  },
  {
    num: "05",
    title: "Launch & Handover",
    desc: "We deploy your project, provide full documentation, team training and a smooth transition with post-launch support.",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
        <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z" />
      </svg>
    ),
  },
];

export default function ServiceProcess() {
  return (
    <section className="svcprocess-section">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,600&family=DM+Sans:wght@300;400;500&display=swap');

        .svcprocess-section {
          padding: 96px 0;
          background: var(--color-bg-soft);
          position: relative;
          overflow: hidden;
        }

        .svcprocess-section::before {
          content: '';
          position: absolute;
          top: 0; left: 0; right: 0;
          height: 1px;
          background: linear-gradient(90deg, transparent, rgba(104,80,68,0.10), transparent);
        }

        /* Background orb */
        .svcprocess-orb {
          position: absolute;
          width: 500px; height: 500px;
          border-radius: 50%;
          left: 50%;
          top: 50%;
          transform: translate(-50%, -50%);
          background: radial-gradient(circle, rgba(153,178,221,0.10) 0%, transparent 65%);
          pointer-events: none;
        }

        .svcprocess-grid {
          display: grid;
          grid-template-columns: 1fr;
          gap: 0;
          margin-top: 60px;
          position: relative;
          z-index: 1;
        }

        @media (min-width: 768px) {
          .svcprocess-grid {
            grid-template-columns: repeat(5, 1fr);
            gap: 0;
          }
        }

        .svcprocess-step {
          position: relative;
          padding: 32px 24px;
          text-align: center;
          display: flex;
          flex-direction: column;
          align-items: center;
        }

        /* Connector line between steps */
        @media (min-width: 768px) {
          .svcprocess-step:not(:last-child)::after {
            content: '';
            position: absolute;
            top: 52px;
            right: -1px;
            width: 2px;
            height: 40px;
            background: linear-gradient(180deg, var(--color-accent-blue), var(--color-accent-blush));
            opacity: 0.30;
          }
        }

        .svcprocess-icon-wrap {
          width: 60px; height: 60px;
          border-radius: 18px;
          border: 1px solid rgba(104,80,68,0.10);
          background: rgba(255,255,255,0.70);
          backdrop-filter: blur(8px);
          display: flex;
          align-items: center;
          justify-content: center;
          margin-bottom: 20px;
          transition: transform 0.3s ease, box-shadow 0.3s ease, background 0.3s ease;
          position: relative;
        }

        .svcprocess-step:hover .svcprocess-icon-wrap {
          transform: translateY(-4px);
          box-shadow: 0 12px 32px rgba(58,64,90,0.10);
          background: var(--color-primary);
        }

        .svcprocess-icon-wrap svg {
          width: 24px; height: 24px;
          color: var(--color-primary);
          transition: color 0.3s ease;
        }

        .svcprocess-step:hover .svcprocess-icon-wrap svg {
          color: var(--color-surface);
        }

        .svcprocess-num {
          position: absolute;
          top: -8px; right: -8px;
          width: 20px; height: 20px;
          border-radius: 50%;
          background: linear-gradient(135deg, var(--color-accent-blue), var(--color-accent-blush));
          font-family: 'DM Sans', sans-serif;
          font-size: 9px;
          font-weight: 500;
          color: white;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .svcprocess-title {
          font-family: 'Cormorant Garamond', serif;
          font-size: 18px;
          font-weight: 600;
          color: var(--color-primary);
          margin: 0 0 10px;
        }

        .svcprocess-desc {
          font-family: 'DM Sans', sans-serif;
          font-size: 12.5px;
          font-weight: 300;
          line-height: 1.70;
          color: var(--color-text-soft);
          margin: 0;
        }
      `}</style>

      <div className="svcprocess-orb" />

      <Container>
        <SectionHeading
          eyebrow="Our Process"
          title="How we work with you"
          description="A structured, transparent workflow that keeps you informed and in control — from first brief to final launch."
        />

        <div className="svcprocess-grid">
          {steps.map((step) => (
            <div key={step.num} className="svcprocess-step">
              <div className="svcprocess-icon-wrap">
                {step.icon}
                <span className="svcprocess-num">{step.num}</span>
              </div>
              <h3 className="svcprocess-title">{step.title}</h3>
              <p className="svcprocess-desc">{step.desc}</p>
            </div>
          ))}
        </div>
      </Container>
    </section>
  );
}