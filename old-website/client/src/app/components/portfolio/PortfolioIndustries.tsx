import Container from "@/app/components/common/Container";
import SectionHeading from "@/app/components/common/SectionHeading";
import type { CaseStudyItem } from "../../../../lib/portfolio-data";

const industries = [
  {
    name: "Education",
    desc: "Learning platforms, institution websites, portals and admission systems.",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
        <path d="M2 10L12 5l10 5-10 5-10-5z" />
        <path d="M6 12v5c0 1.7 2.7 3 6 3s6-1.3 6-3v-5" />
      </svg>
    ),
  },
  {
    name: "Healthcare",
    desc: "Patient portals, appointment systems and professional medical websites.",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
        <path d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z" />
      </svg>
    ),
  },
  {
    name: "Finance & Investments",
    desc: "Fintech platforms, advisory websites and investment training systems.",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
        <polyline points="22,12 18,12 15,21 9,3 6,12 2,12" />
      </svg>
    ),
  },
  {
    name: "Startups",
    desc: "Brand launches, MVP websites and digital identity for new ventures.",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
        <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z" />
      </svg>
    ),
  },
  {
    name: "Professional Services",
    desc: "Corporate websites, consulting firms and B2B digital presence.",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
        <rect x="2" y="7" width="20" height="14" rx="2" />
        <path d="M16 7V5a2 2 0 00-2-2h-4a2 2 0 00-2 2v2" />
      </svg>
    ),
  },
  {
    name: "Research & Academia",
    desc: "Journal publishing, institutional portals and academic digital platforms.",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
        <path d="M4 4h16v14H4z" /><line x1="8" y1="9" x2="16" y2="9" />
        <line x1="8" y1="13" x2="13" y2="13" />
      </svg>
    ),
  },
];

// ── Static fallback case study ────────────────────────────────────────────────
const STATIC_CASE_STUDY: CaseStudyItem = {
  title:    "Corporate Website Redesign",
  industry: "Professional Services",
  problem:  "The client had an outdated website that failed to communicate authority, generated no organic traffic and had no mobile experience. Potential clients were dropping off within seconds.",
  solution: "We redesigned the entire digital presence — new information architecture, mobile-first UI, SEO-structured content, CMS integration and performance optimisation — in a focused 6-week engagement.",
  results: [
    { metric: "3×",    label: "Increase in session time" },
    { metric: "SEO",   label: "Architecture indexed within 2 weeks" },
    { metric: "100%",  label: "Mobile-responsive across all devices" },
  ],
};

export default function PortfolioIndustries({
  caseStudy,
}: {
  caseStudy: CaseStudyItem | null;
}) {
  // Use DB data when available, fall back to static
  const cs = caseStudy && (caseStudy.problem || caseStudy.solution)
    ? caseStudy
    : STATIC_CASE_STUDY;

  // Use static results if DB results are empty
  const results = cs.results.length > 0 ? cs.results : STATIC_CASE_STUDY.results;

  return (
    <>
      {/* Industries */}
      <section className="port-ind-section">
        <style>{`
          @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,600&family=DM+Sans:wght@300;400;500&display=swap');

          .port-ind-section {
            padding: 96px 0;
            background: var(--color-bg);
            position: relative;
          }

          .port-ind-section::before {
            content: '';
            position: absolute; top: 0; left: 0; right: 0; height: 1px;
            background: linear-gradient(90deg, transparent, rgba(104,80,68,0.10), transparent);
          }

          .port-ind-grid {
            display: grid;
            grid-template-columns: repeat(2, 1fr);
            gap: 16px;
            margin-top: 52px;
          }

          @media (min-width: 768px) { .port-ind-grid { grid-template-columns: repeat(3, 1fr); } }
          @media (min-width: 1280px) { .port-ind-grid { grid-template-columns: repeat(6, 1fr); } }

          .port-ind-card {
            border-radius: 18px;
            border: 1px solid rgba(104,80,68,0.08);
            background: rgba(255,255,255,0.60);
            backdrop-filter: blur(8px);
            padding: 24px 18px;
            text-align: center;
            display: flex; flex-direction: column; align-items: center;
            gap: 12px;
            transition: transform 0.3s ease, box-shadow 0.3s ease;
            cursor: default;
          }

          .port-ind-card:hover {
            transform: translateY(-4px);
            box-shadow: 0 14px 40px rgba(58,64,90,0.09);
          }

          .port-ind-icon {
            width: 44px; height: 44px; border-radius: 12px;
            background: linear-gradient(135deg, rgba(153,178,221,0.18), rgba(233,175,163,0.12));
            border: 1px solid rgba(104,80,68,0.10);
            display: flex; align-items: center; justify-content: center;
            transition: background 0.3s ease;
          }

          .port-ind-card:hover .port-ind-icon {
            background: var(--color-primary);
          }

          .port-ind-icon svg {
            width: 20px; height: 20px;
            color: var(--color-primary);
            transition: color 0.3s ease;
          }

          .port-ind-card:hover .port-ind-icon svg { color: var(--color-surface); }

          .port-ind-name {
            font-family: 'DM Sans', sans-serif;
            font-size: 13px; font-weight: 500;
            color: var(--color-primary); margin: 0;
          }

          .port-ind-desc {
            font-family: 'DM Sans', sans-serif;
            font-size: 11.5px; font-weight: 300;
            line-height: 1.6; color: var(--color-text-soft); margin: 0;
          }

          /* ── Case Study ── */
          .port-cs-section {
            padding: 0 0 96px;
            background: var(--color-bg);
          }

          .port-cs-card {
            border-radius: 24px;
            border: 1px solid rgba(104,80,68,0.09);
            background: rgba(255,255,255,0.65);
            backdrop-filter: blur(12px);
            overflow: hidden;
            position: relative;
          }

          .port-cs-top-rule {
            height: 3px;
            background: linear-gradient(90deg, var(--color-accent-blue), var(--color-accent-blush));
          }

          .port-cs-inner {
            display: grid;
            grid-template-columns: 1fr;
            gap: 40px;
            padding: 48px 40px;
          }

          @media (min-width: 1024px) {
            .port-cs-inner { grid-template-columns: 1fr 1fr; gap: 64px; }
          }

          .port-cs-badge {
            display: inline-flex; align-items: center; gap: 8px;
            margin-bottom: 20px;
            font-family: 'DM Sans', sans-serif;
            font-size: 10px; font-weight: 500;
            letter-spacing: 0.18em; text-transform: uppercase;
            color: var(--color-primary-2);
            border: 1px solid rgba(104,80,68,0.12);
            background: rgba(249,222,201,0.25);
            padding: 4px 12px 4px 6px; border-radius: 100px;
          }

          .port-cs-badge-dot {
            width: 16px; height: 16px; border-radius: 50%;
            background: var(--color-primary);
            display: flex; align-items: center; justify-content: center;
          }

          .port-cs-badge-dot::after {
            content: ''; width: 5px; height: 5px;
            border-radius: 50%; background: var(--color-surface);
          }

          .port-cs-client {
            font-family: 'Cormorant Garamond', serif;
            font-size: 30px; font-weight: 600; line-height: 1.15;
            color: var(--color-primary); margin: 0 0 8px;
          }

          .port-cs-industry-tag {
            font-family: 'DM Sans', sans-serif;
            font-size: 11px; font-weight: 400; letter-spacing: 0.08em;
            color: var(--color-text-soft);
            border: 1px solid rgba(104,80,68,0.10);
            padding: 2px 10px; border-radius: 100px;
            display: inline-block; margin-bottom: 28px;
          }

          .port-cs-block { margin-bottom: 24px; }
          .port-cs-block:last-child { margin-bottom: 0; }

          .port-cs-label {
            font-family: 'DM Sans', sans-serif;
            font-size: 10px; font-weight: 500;
            letter-spacing: 0.18em; text-transform: uppercase;
            color: var(--color-accent-blue); margin: 0 0 8px;
            display: flex; align-items: center; gap: 8px;
          }

          .port-cs-label::after {
            content: ''; flex: 1; height: 1px;
            background: rgba(104,80,68,0.08);
          }

          .port-cs-text {
            font-family: 'DM Sans', sans-serif;
            font-size: 14px; font-weight: 300;
            line-height: 1.80; color: var(--color-text-soft); margin: 0;
          }

          /* Results */
          .port-cs-results {
            display: grid; grid-template-columns: repeat(3, 1fr);
            gap: 12px; margin-top: 32px;
          }

          .port-cs-result {
            border-radius: 14px;
            background: var(--color-primary);
            padding: 20px 16px; text-align: center;
          }

          .port-cs-result-metric {
            font-family: 'Cormorant Garamond', serif;
            font-size: 28px; font-weight: 600;
            color: var(--color-surface); display: block;
            line-height: 1;
          }

          .port-cs-result-label {
            font-family: 'DM Sans', sans-serif;
            font-size: 11px; font-weight: 300;
            color: rgba(249,222,201,0.60); margin: 6px 0 0;
            line-height: 1.4;
          }
        `}</style>

        <Container>
          <SectionHeading
            eyebrow="Industries"
            title="Sectors we serve"
            description="We work across industries where digital quality, trust and performance matter most."
          />
          <div className="port-ind-grid">
            {industries.map((ind) => (
              <div key={ind.name} className="port-ind-card">
                <div className="port-ind-icon">{ind.icon}</div>
                <p className="port-ind-name">{ind.name}</p>
                <p className="port-ind-desc">{ind.desc}</p>
              </div>
            ))}
          </div>
        </Container>
      </section>

      {/* Case Study */}
      <section className="port-cs-section">
        <Container>
          <SectionHeading
            eyebrow="Case Study"
            title="A closer look at impact"
            description="Real problems, real solutions, real results."
          />

          <div className="port-cs-card">
            <div className="port-cs-top-rule" />
            <div className="port-cs-inner">
              <div>
                <div className="port-cs-badge">
                  <span className="port-cs-badge-dot" />
                  Case Study
                </div>
                <h3 className="port-cs-client">{cs.title}</h3>
                {cs.industry && (
                  <span className="port-cs-industry-tag">{cs.industry}</span>
                )}

                {cs.problem && (
                  <div className="port-cs-block">
                    <p className="port-cs-label">The Problem</p>
                    <p className="port-cs-text">{cs.problem}</p>
                  </div>
                )}

                {cs.solution && (
                  <div className="port-cs-block">
                    <p className="port-cs-label">Our Solution</p>
                    <p className="port-cs-text">{cs.solution}</p>
                  </div>
                )}
              </div>

              <div>
                <p className="port-cs-label">Results</p>
                <div className="port-cs-results">
                  {results.map((r) => (
                    <div key={r.label} className="port-cs-result">
                      <span className="port-cs-result-metric">{r.metric}</span>
                      <p className="port-cs-result-label">{r.label}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </Container>
      </section>
    </>
  );
}