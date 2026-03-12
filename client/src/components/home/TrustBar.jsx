// src/components/home/TrustBar.jsx
import {
  BadgeCheck,
  Code2,
  Smartphone,
  SearchCheck,
  Rocket,
} from "lucide-react";

const ITEMS = [
  { icon: BadgeCheck, text: "ISO 9001:2015 Certified" },
  { icon: Code2, text: "Full-Stack Web Development" },
  { icon: Smartphone, text: "Responsive & Mobile-First" },
  { icon: SearchCheck, text: "SEO Architecture Built-In" },
  { icon: Rocket, text: "High-Performance Delivery" },
];

export default function TrustBar() {
  const doubled = [...ITEMS, ...ITEMS];

  return (
    <>
      <style>{`
        .trustbar {
          position: relative;
          overflow: hidden;
          background:
            linear-gradient(135deg, #0f172a 0%, #111827 50%, #1e293b 100%);
          border-top: 1px solid rgba(255,255,255,0.06);
          border-bottom: 1px solid rgba(255,255,255,0.06);
          padding: 16px 0;
        }

        .trustbar::before,
        .trustbar::after {
          content: "";
          position: absolute;
          top: 0;
          bottom: 0;
          width: 120px;
          z-index: 2;
          pointer-events: none;
        }

        .trustbar::before {
          left: 0;
          background: linear-gradient(90deg, #0f172a 0%, rgba(15,23,42,0) 100%);
        }

        .trustbar::after {
          right: 0;
          background: linear-gradient(-90deg, #0f172a 0%, rgba(15,23,42,0) 100%);
        }

        .trustbar-track {
          display: flex;
          width: max-content;
          animation: trustbar-scroll 24s linear infinite;
        }

        .trustbar:hover .trustbar-track {
          animation-play-state: paused;
        }

        @keyframes trustbar-scroll {
          from {
            transform: translateX(0);
          }
          to {
            transform: translateX(-50%);
          }
        }

        .trustbar-item {
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 0 18px;
          margin-right: 14px;
          min-height: 46px;
          border-radius: 999px;
          background: rgba(255, 255, 255, 0.05);
          border: 1px solid rgba(255, 255, 255, 0.08);
          box-shadow:
            inset 0 1px 0 rgba(255,255,255,0.05),
            0 8px 24px rgba(0,0,0,0.18);
          backdrop-filter: blur(10px);
          -webkit-backdrop-filter: blur(10px);
          white-space: nowrap;
          transition: transform 0.25s ease, background 0.25s ease, border-color 0.25s ease;
        }

        .trustbar-item:hover {
          transform: translateY(-1px);
          background: rgba(255, 255, 255, 0.08);
          border-color: rgba(255, 255, 255, 0.14);
        }

        .trustbar-icon-wrap {
          width: 30px;
          height: 30px;
          border-radius: 50%;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
          background: linear-gradient(135deg, rgba(255,255,255,0.16), rgba(255,255,255,0.06));
          border: 1px solid rgba(255,255,255,0.08);
          color: #f8fafc;
        }

        .trustbar-icon {
          width: 15px;
          height: 15px;
          stroke-width: 2.1;
        }

        .trustbar-text {
          font-family: "DM Sans", sans-serif;
          font-size: 13px;
          font-weight: 500;
          letter-spacing: 0.01em;
          color: rgba(248, 250, 252, 0.92);
        }

        .trustbar-dot {
          width: 5px;
          height: 5px;
          border-radius: 50%;
          background: rgba(255,255,255,0.2);
          flex-shrink: 0;
        }

        @media (max-width: 768px) {
          .trustbar {
            padding: 14px 0;
          }

          .trustbar::before,
          .trustbar::after {
            width: 56px;
          }

          .trustbar-track {
            animation-duration: 20s;
          }

          .trustbar-item {
            min-height: 40px;
            padding: 0 14px;
            gap: 10px;
            margin-right: 10px;
          }

          .trustbar-icon-wrap {
            width: 26px;
            height: 26px;
          }

          .trustbar-icon {
            width: 14px;
            height: 14px;
          }

          .trustbar-text {
            font-size: 12px;
          }
        }

        @media (prefers-reduced-motion: reduce) {
          .trustbar-track {
            animation: none;
          }
        }
      `}</style>

      <section className="trustbar" aria-label="Trust highlights">
        <div className="trustbar-track">
          {doubled.map((item, i) => {
            const Icon = item.icon;
            return (
              <div className="trustbar-item" key={i}>
                <span className="trustbar-icon-wrap">
                  <Icon className="trustbar-icon" />
                </span>
                <span className="trustbar-text">{item.text}</span>
                <span className="trustbar-dot" />
              </div>
            );
          })}
        </div>
      </section>
    </>
  );
}