"use client";

import { useState } from "react";
import Container from "@/app/components/common/Container";
import SectionHeading from "@/app/components/common/SectionHeading";
import type { ServiceBlock } from "../../../../lib/types";

const blocks: ServiceBlock[] = [
  {
    id: "web",
    num: "01",
    title: "Website Development Services",
    subtitle: "Business websites that perform and convert",
    desc: "We design and build fast, responsive, SEO-ready websites tailored to your business goals. From corporate portals and product landing pages to full CMS-powered websites, every pixel is crafted for credibility, clarity and conversion.",
    highlights: [
      { label: "Business & Corporate Websites", detail: "Professional sites that establish authority and drive inquiries." },
      { label: "Landing Pages", detail: "High-conversion, campaign-focused pages built to capture leads." },
      { label: "CMS Websites", detail: "Scalable content management systems — easy to update and grow." },
      { label: "E-Commerce Platforms", detail: "Online stores designed for revenue and user experience." },
    ],
    color: "rgba(153,178,221,0.18)",
  },
  {
    id: "software",
    num: "02",
    title: "Custom Software Development",
    subtitle: "Technology built around your operations",
    desc: "We engineer custom software — business applications, automation platforms, ERP systems and API-driven tools — that streamline operations, reduce overhead and scale with your business. Every solution is built to your exact specifications.",
    highlights: [
      { label: "Business Applications", detail: "Tailored software solving specific operational challenges." },
      { label: "ERP & Management Systems", detail: "Integrated platforms managing finance, HR, inventory and more." },
      { label: "Automation Tools", detail: "Reduce manual effort and human error through smart automation." },
      { label: "API & SaaS Platforms", detail: "Cloud-ready systems built for integration and scale." },
    ],
    color: "rgba(233,175,163,0.18)",
  },
  {
    id: "placements",
    num: "03",
    title: "IT Placement Services",
    subtitle: "The right technology talent, at the right time",
    desc: "Our IT placement division connects businesses with skilled, pre-screened technology professionals. From permanent placements to project-based contract staffing, we source software engineers, UI/UX designers, project managers and technology leadership roles.",
    highlights: [
      { label: "Permanent Placements", detail: "Long-term hires matched to your culture and technical requirements." },
      { label: "Contract & Project Staffing", detail: "Flexible talent for short-term projects and seasonal demands." },
      { label: "Team Augmentation", detail: "Extend your existing team with specialist skills on demand." },
      { label: "Skills Assessment", detail: "Technical screening and evaluation before placement." },
    ],
    color: "rgba(249,222,201,0.40)",
  },
  {
    id: "journals",
    num: "04",
    title: "Research Journal Publishing",
    subtitle: "Academic and professional publishing done right",
    desc: "We provide end-to-end research journal publishing services for institutions, researchers and academic organisations. From editorial management and peer-review coordination to digital formatting, ISSN registration and global indexing support.",
    highlights: [
      { label: "Editorial & Peer Review Management", detail: "Structured manuscript review and editorial workflow support." },
      { label: "ISSN Registration", detail: "Official journal identification for print and online editions." },
      { label: "Digital Formatting & Layout", detail: "Professional typesetting and publication-ready design." },
      { label: "Indexing & Distribution", detail: "Support for Google Scholar, Scopus and online journal directories." },
    ],
    color: "rgba(153,178,221,0.14)",
  },
  {
    id: "stocks",
    num: "05",
    title: "Stock Market Training",
    subtitle: "Invest smarter with structured education",
    desc: "Our structured stock market training programs take students from absolute beginners to confident market participants. Covering fundamental analysis, technical charting, portfolio construction, risk management and live market sessions.",
    highlights: [
      { label: "Fundamentals of Stock Markets", detail: "How exchanges work, reading financials, valuation basics." },
      { label: "Technical Analysis", detail: "Chart reading, indicators, candlestick patterns and trend analysis." },
      { label: "Portfolio Management", detail: "Diversification, asset allocation and long-term wealth strategy." },
      { label: "Live Trading Sessions", detail: "Real-market practice under expert guidance." },
    ],
    color: "rgba(233,175,163,0.15)",
  },
];

export default function ServiceBlocks() {
  const [open, setOpen] = useState<string | null>("web");

  return (
    <section className="svcblocks-section">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,600;1,300&family=DM+Sans:wght@300;400;500&display=swap');

        .svcblocks-section {
          padding: 96px 0;
          background: var(--color-bg);
          position: relative;
        }

        .svcblocks-section::before {
          content: '';
          position: absolute;
          top: 0; left: 0; right: 0;
          height: 1px;
          background: linear-gradient(90deg, transparent, rgba(104,80,68,0.10), transparent);
        }

        .svcblocks-list {
          margin-top: 60px;
          display: flex;
          flex-direction: column;
          gap: 0;
          border: 1px solid rgba(104,80,68,0.09);
          border-radius: 22px;
          overflow: hidden;
          background: rgba(255,255,255,0.55);
          backdrop-filter: blur(12px);
        }

        .svcblock-item {
          border-bottom: 1px solid rgba(104,80,68,0.07);
        }

        .svcblock-item:last-child {
          border-bottom: none;
        }

        /* Trigger row */
        .svcblock-trigger {
          width: 100%;
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 20px;
          padding: 24px 32px;
          background: transparent;
          border: none;
          cursor: pointer;
          text-align: left;
          transition: background 0.25s ease;
        }

        .svcblock-trigger:hover {
          background: rgba(153,178,221,0.06);
        }

        .svcblock-trigger.active {
          background: rgba(153,178,221,0.08);
        }

        .svcblock-trigger-left {
          display: flex;
          align-items: center;
          gap: 20px;
        }

        .svcblock-num {
          font-family: 'Cormorant Garamond', serif;
          font-size: 14px;
          font-weight: 300;
          letter-spacing: 0.15em;
          color: var(--color-accent-blue);
          flex-shrink: 0;
          width: 28px;
        }

        .svcblock-trigger-title {
          font-family: 'Cormorant Garamond', serif;
          font-size: 22px;
          font-weight: 600;
          color: var(--color-primary);
          margin: 0;
        }

        .svcblock-trigger-sub {
          font-family: 'DM Sans', sans-serif;
          font-size: 12px;
          font-weight: 300;
          color: var(--color-text-soft);
          margin: 2px 0 0;
        }

        .svcblock-chevron {
          width: 32px; height: 32px;
          border-radius: 50%;
          border: 1px solid rgba(104,80,68,0.12);
          display: flex; align-items: center; justify-content: center;
          flex-shrink: 0;
          transition: transform 0.35s ease, background 0.25s ease, border-color 0.25s ease;
        }

        .svcblock-chevron.open {
          transform: rotate(180deg);
          background: var(--color-primary);
          border-color: var(--color-primary);
        }

        .svcblock-chevron svg {
          width: 14px; height: 14px;
          stroke: var(--color-primary);
          stroke-width: 2;
          fill: none;
          transition: stroke 0.25s ease;
        }

        .svcblock-chevron.open svg {
          stroke: var(--color-surface);
        }

        /* Expanded body */
        .svcblock-body {
          overflow: hidden;
          max-height: 0;
          opacity: 0;
          transition: max-height 0.5s cubic-bezier(0.4,0,0.2,1), opacity 0.35s ease;
        }

        .svcblock-body.open {
          max-height: 600px;
          opacity: 1;
        }

        .svcblock-body-inner {
          padding: 0 32px 32px 80px;
          display: grid;
          grid-template-columns: 1fr;
          gap: 32px;
        }

        @media (min-width: 768px) {
          .svcblock-body-inner {
            grid-template-columns: 1fr 1fr;
            gap: 48px;
          }
        }

        .svcblock-desc {
          font-family: 'DM Sans', sans-serif;
          font-size: 14px;
          font-weight: 300;
          line-height: 1.80;
          color: var(--color-text-soft);
          margin: 0;
        }

        .svcblock-highlights {
          display: flex;
          flex-direction: column;
          gap: 14px;
        }

        .svcblock-hl {
          display: flex;
          gap: 12px;
          align-items: flex-start;
        }

        .svcblock-hl-dot {
          width: 18px; height: 18px;
          border-radius: 50%;
          background: linear-gradient(135deg, var(--color-accent-blue), var(--color-accent-blush));
          display: flex; align-items: center; justify-content: center;
          flex-shrink: 0;
          margin-top: 2px;
        }

        .svcblock-hl-dot::after {
          content: '';
          width: 6px; height: 6px;
          border-radius: 50%;
          background: white;
        }

        .svcblock-hl-text {
          flex: 1;
        }

        .svcblock-hl-label {
          font-family: 'DM Sans', sans-serif;
          font-size: 13.5px;
          font-weight: 500;
          color: var(--color-primary);
          margin: 0 0 3px;
        }

        .svcblock-hl-detail {
          font-family: 'DM Sans', sans-serif;
          font-size: 12.5px;
          font-weight: 300;
          color: var(--color-text-soft);
          margin: 0;
          line-height: 1.55;
        }
      `}</style>

      <Container>
        <SectionHeading
          eyebrow="Service Details"
          title="What we deliver — in depth"
          description="Click any service to explore what's included, what we deliver and how it benefits your business."
        />

        <div className="svcblocks-list">
          {blocks.map((block) => {
            const isOpen = open === block.id;
            return (
              <div key={block.id} className="svcblock-item">
                <button
                  className={`svcblock-trigger${isOpen ? " active" : ""}`}
                  onClick={() => setOpen(isOpen ? null : block.id)}
                  aria-expanded={isOpen}
                >
                  <div className="svcblock-trigger-left">
                    <span className="svcblock-num">{block.num}</span>
                    <div>
                      <p className="svcblock-trigger-title">{block.title}</p>
                      <p className="svcblock-trigger-sub">{block.subtitle}</p>
                    </div>
                  </div>
                  <div className={`svcblock-chevron${isOpen ? " open" : ""}`}>
                    <svg viewBox="0 0 24 24">
                      <polyline points="6,9 12,15 18,9" />
                    </svg>
                  </div>
                </button>

                <div className={`svcblock-body${isOpen ? " open" : ""}`}>
                  <div className="svcblock-body-inner">
                    <p className="svcblock-desc">{block.desc}</p>
                    <div className="svcblock-highlights">
                      {block.highlights.map((hl) => (
                        <div key={hl.label} className="svcblock-hl">
                          <div className="svcblock-hl-dot" />
                          <div className="svcblock-hl-text">
                            <p className="svcblock-hl-label">{hl.label}</p>
                            <p className="svcblock-hl-detail">{hl.detail}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </Container>
    </section>
  );
}