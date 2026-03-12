// src/components/about/AboutTrust.jsx
import Container from "../common/Container";
import SectionHeading from "../common/SectionHeading";

const stats = [
  { value: "ISO", sub: "9001:2015", label: "Certified Quality Process" },
  { value: "7+", sub: "Core Services", label: "Spanning web, software & training" },
  { value: "100%", sub: "Client-First", label: "Every decision starts with your goals" },
  { value: "Pan", sub: "India", label: "Serving businesses across the country" },
];

const badges = [
  {
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
        <polyline points="20,6 9,17 4,12" />
        <circle cx="12" cy="12" r="9" />
      </svg>
    ),
    title: "ISO 9001:2015 Certified",
    desc: "Internationally recognised quality management standards applied to every project.",
  },
  {
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
        <rect x="3" y="11" width="18" height="11" rx="2" />
        <path d="M7 11V7a5 5 0 0110 0v4" />
      </svg>
    ),
    title: "Data & Process Security",
    desc: "Client confidentiality and project data are protected under strict internal protocols.",
  },
  {
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
        <circle cx="12" cy="8" r="3" />
        <path d="M6 20v-2a6 6 0 0112 0v2" />
        <polyline points="16,3 18,5 22,1" />
      </svg>
    ),
    title: "Vetted Professionals",
    desc: "Every team member and placement candidate is evaluated against rigorous quality benchmarks.",
  },
  {
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
        <polyline points="22,12 18,12 15,21 9,3 6,12 2,12" />
      </svg>
    ),
    title: "Performance-Focused Delivery",
    desc: "Speed, uptime, SEO readiness and conversion performance are built into every deliverable.",
  },
  {
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
        <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z" />
      </svg>
    ),
    title: "Premium Delivery Standards",
    desc: "We don't ship unless it meets the brief. Quality checks are non-negotiable at every stage.",
  },
  {
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
        <path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z" />
      </svg>
    ),
    title: "Transparent Communication",
    desc: "Clients are kept informed at every stage — no surprises, no hidden changes.",
  },
];

export default function AboutTrust() {
  return (
    <section className="about-trust">
      <style>{`
        .about-trust {
          padding: 96px 0;
          background: var(--color-bg-soft);
          position: relative;
        }

        .about-trust::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          height: 1px;
          background: linear-gradient(90deg, transparent, rgba(104,80,68,0.10), transparent);
        }

        .about-trust-stats {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 1px;
          background: rgba(104,80,68,0.08);
          border: 1px solid rgba(104,80,68,0.08);
          border-radius: 20px;
          overflow: hidden;
          margin-top: 60px;
          margin-bottom: 48px;
        }

        @media (min-width: 768px) {
          .about-trust-stats {
            grid-template-columns: repeat(4, 1fr);
          }
        }

        .about-trust-stat {
          background: rgba(255,255,255,0.65);
          backdrop-filter: blur(8px);
          padding: 32px 24px;
          text-align: center;
          transition: background 0.3s ease;
          cursor: default;
        }

        .about-trust-stat:hover {
          background: rgba(255,255,255,0.90);
        }

        .about-stat-value {
          font-family: 'Cormorant Garamond', serif;
          font-size: 40px;
          font-weight: 600;
          line-height: 1;
          color: var(--color-primary);
          display: block;
        }

        .about-stat-sub {
          font-family: 'DM Sans', sans-serif;
          font-size: 11px;
          font-weight: 500;
          letter-spacing: 0.10em;
          color: var(--color-accent-blue);
          text-transform: uppercase;
          display: block;
          margin: 4px 0 8px;
        }

        .about-stat-label {
          font-family: 'DM Sans', sans-serif;
          font-size: 12px;
          font-weight: 300;
          color: var(--color-text-soft);
          line-height: 1.4;
          margin: 0;
        }

        .about-trust-badges {
          display: grid;
          grid-template-columns: 1fr;
          gap: 16px;
        }

        @media (min-width: 640px) {
          .about-trust-badges {
            grid-template-columns: repeat(2, 1fr);
          }
        }

        @media (min-width: 1024px) {
          .about-trust-badges {
            grid-template-columns: repeat(3, 1fr);
          }
        }

        .about-trust-badge {
          display: flex;
          gap: 16px;
          align-items: flex-start;
          padding: 22px 20px;
          border-radius: 16px;
          border: 1px solid rgba(104,80,68,0.08);
          background: rgba(255,255,255,0.60);
          backdrop-filter: blur(8px);
          transition: transform 0.3s ease, box-shadow 0.3s ease;
          cursor: default;
        }

        .about-trust-badge:hover {
          transform: translateY(-3px);
          box-shadow: 0 12px 36px rgba(58,64,90,0.09);
        }

        .badge-icon-wrap {
          width: 40px;
          height: 40px;
          border-radius: 10px;
          background: linear-gradient(135deg, rgba(153,178,221,0.20), rgba(233,175,163,0.15));
          border: 1px solid rgba(104,80,68,0.10);
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
          transition: background 0.3s ease;
        }

        .about-trust-badge:hover .badge-icon-wrap {
          background: var(--color-primary);
        }

        .badge-icon-wrap svg {
          width: 18px;
          height: 18px;
          color: var(--color-primary);
          transition: color 0.3s ease;
        }

        .about-trust-badge:hover .badge-icon-wrap svg {
          color: var(--color-surface, #fff);
        }

        .badge-body-title {
          font-family: 'DM Sans', sans-serif;
          font-size: 13.5px;
          font-weight: 500;
          color: var(--color-primary);
          margin: 0 0 5px;
        }

        .badge-body-desc {
          font-family: 'DM Sans', sans-serif;
          font-size: 12.5px;
          font-weight: 300;
          line-height: 1.65;
          color: var(--color-text-soft);
          margin: 0;
        }

        @media (max-width: 767px) {
          .about-trust {
            padding: 80px 0;
          }

          .about-trust-stats {
            margin-top: 48px;
            margin-bottom: 36px;
          }

          .about-trust-stat {
            padding: 24px 16px;
          }

          .about-stat-value {
            font-size: 34px;
          }

          .badge-body-desc {
            font-size: 12px;
          }
        }
      `}</style>

      <Container>
        <SectionHeading
          eyebrow="Why Trust Us"
          title="Credentials that speak before we do"
          description="We believe trust is earned through consistency, transparency and certified standards — not just promises."
        />

        <div className="about-trust-stats">
          {stats.map((s) => (
            <div key={s.label} className="about-trust-stat">
              <span className="about-stat-value">{s.value}</span>
              <span className="about-stat-sub">{s.sub}</span>
              <p className="about-stat-label">{s.label}</p>
            </div>
          ))}
        </div>

        <div className="about-trust-badges">
          {badges.map((b) => (
            <div key={b.title} className="about-trust-badge">
              <div className="badge-icon-wrap">{b.icon}</div>
              <div>
                <p className="badge-body-title">{b.title}</p>
                <p className="badge-body-desc">{b.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </Container>
    </section>
  );
}