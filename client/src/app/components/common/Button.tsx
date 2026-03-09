import Link from "next/link";
import { ReactNode } from "react";

type Props = {
  href: string;
  children: ReactNode;
  variant?: "primary" | "secondary" | "accent";
};

export default function Button({
  href,
  children,
  variant = "primary",
}: Props) {
  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500&display=swap');

        .btn-base {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          gap: 6px;
          padding: 11px 26px;
          border-radius: 3px;
          font-family: 'DM Sans', sans-serif;
          font-size: 12.5px;
          font-weight: 500;
          letter-spacing: 0.08em;
          text-transform: uppercase;
          text-decoration: none;
          position: relative;
          overflow: hidden;
          transition: transform 0.3s cubic-bezier(0.4,0,0.2,1),
                      box-shadow 0.3s ease,
                      opacity 0.25s ease;
        }

        .btn-base:hover {
          transform: translateY(-1px);
        }

        .btn-base:active {
          transform: translateY(0);
        }

        /* Primary */
        .btn-primary {
          background: var(--color-btn-primary);
          color: var(--color-btn-primary-text);
          border: 1px solid transparent;
        }

        .btn-primary::before {
          content: '';
          position: absolute;
          inset: 0;
          background: linear-gradient(135deg, rgba(153,178,221,0.15) 0%, transparent 60%);
          opacity: 0;
          transition: opacity 0.3s ease;
        }

        .btn-primary:hover::before {
          opacity: 1;
        }

        .btn-primary:hover {
          box-shadow: 0 8px 28px rgba(58,64,90,0.22);
        }

        /* Secondary */
        .btn-secondary {
          background: transparent;
          color: var(--color-primary);
          border: 1px solid rgba(104,80,68,0.22);
        }

        .btn-secondary:hover {
          background: rgba(104,80,68,0.06);
          border-color: rgba(104,80,68,0.35);
          box-shadow: 0 4px 16px rgba(58,64,90,0.08);
        }

        /* Accent */
        .btn-accent {
          background: var(--color-btn-accent);
          color: var(--color-btn-accent-text);
          border: 1px solid transparent;
        }

        .btn-accent:hover {
          opacity: 0.88;
          box-shadow: 0 8px 24px rgba(233,175,163,0.30);
        }
      `}</style>

      <Link
        href={href}
        className={`btn-base btn-${variant}`}
      >
        {children}
      </Link>
    </>
  );
}