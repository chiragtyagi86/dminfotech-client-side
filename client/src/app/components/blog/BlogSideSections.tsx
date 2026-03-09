"use client";

import { useState } from "react";
import Container from "@/app/components/common/Container";

export default function NewsletterSection() {
  const [email, setEmail] = useState("");
  const [done, setDone] = useState(false);

  return (
    <section className="newsletter-section">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,600&family=DM+Sans:wght@300;400;500&display=swap');

        .newsletter-section {
          padding: 80px 0;
          background: var(--color-bg-soft);
          position: relative;
        }

        .newsletter-section::before {
          content: '';
          position: absolute; top: 0; left: 0; right: 0; height: 1px;
          background: linear-gradient(90deg, transparent, rgba(104,80,68,0.10), transparent);
        }

        .newsletter-card {
          border-radius: 24px;
          border: 1px solid rgba(104,80,68,0.09);
          background: rgba(255,255,255,0.65);
          backdrop-filter: blur(14px);
          padding: 56px 48px;
          text-align: center;
          position: relative; overflow: hidden;
          max-width: 680px; margin: 0 auto;
        }

        .newsletter-card::before,
        .newsletter-card::after {
          content: '';
          position: absolute; width: 200px; height: 200px; border-radius: 50%;
          pointer-events: none;
        }

        .newsletter-card::before {
          top: -70px; left: -70px;
          background: radial-gradient(circle, rgba(153,178,221,0.18), transparent 70%);
        }

        .newsletter-card::after {
          bottom: -70px; right: -70px;
          background: radial-gradient(circle, rgba(233,175,163,0.15), transparent 70%);
        }

        .newsletter-eyebrow {
          font-family: 'DM Sans', sans-serif;
          font-size: 10.5px; font-weight: 500;
          letter-spacing: 0.20em; text-transform: uppercase;
          color: var(--color-primary-2); margin-bottom: 14px;
          display: flex; align-items: center; justify-content: center; gap: 10px;
        }

        .newsletter-eyebrow::before, .newsletter-eyebrow::after {
          content: ''; display: block; width: 24px; height: 1px;
          background: linear-gradient(90deg, var(--color-accent-blue), var(--color-accent-blush));
        }

        .newsletter-title {
          font-family: 'Cormorant Garamond', serif;
          font-size: clamp(26px, 4vw, 40px);
          font-weight: 300; line-height: 1.2;
          color: var(--color-primary); margin: 0 0 12px;
          position: relative; z-index: 1;
        }

        .newsletter-title em { font-style: italic; color: var(--color-primary-2); }

        .newsletter-desc {
          font-family: 'DM Sans', sans-serif;
          font-size: 14px; font-weight: 300; line-height: 1.75;
          color: var(--color-text-soft); margin: 0 0 32px;
          position: relative; z-index: 1;
        }

        .newsletter-form {
          display: flex; flex-direction: column; gap: 10px;
          max-width: 440px; margin: 0 auto;
          position: relative; z-index: 1;
        }

        @media (min-width: 500px) { .newsletter-form { flex-direction: row; } }

        .newsletter-input {
          flex: 1; padding: 12px 18px; border-radius: 8px;
          border: 1px solid rgba(104,80,68,0.15);
          background: rgba(255,255,255,0.85);
          font-family: 'DM Sans', sans-serif;
          font-size: 14px; font-weight: 300;
          color: var(--color-primary); outline: none;
          transition: border-color 0.25s ease, box-shadow 0.25s ease;
        }

        .newsletter-input::placeholder { color: rgba(104,80,68,0.35); }

        .newsletter-input:focus {
          border-color: var(--color-accent-blue);
          box-shadow: 0 0 0 3px rgba(153,178,221,0.15);
        }

        .newsletter-btn {
          padding: 12px 24px; border: none; border-radius: 8px;
          background: var(--color-btn-primary);
          color: var(--color-btn-primary-text);
          font-family: 'DM Sans', sans-serif;
          font-size: 12.5px; font-weight: 500;
          letter-spacing: 0.09em; text-transform: uppercase;
          cursor: pointer; white-space: nowrap;
          transition: transform 0.25s ease, box-shadow 0.25s ease;
        }

        .newsletter-btn:hover {
          transform: translateY(-1px);
          box-shadow: 0 6px 20px rgba(58,64,90,0.20);
        }

        .newsletter-note {
          font-family: 'DM Sans', sans-serif;
          font-size: 11px; font-weight: 300;
          color: var(--color-text-soft); margin-top: 14px;
          position: relative; z-index: 1;
        }

        .newsletter-success {
          display: flex; flex-direction: column;
          align-items: center; gap: 12px;
          position: relative; z-index: 1;
        }

        .newsletter-success-icon {
          width: 48px; height: 48px; border-radius: 50%;
          background: linear-gradient(135deg, var(--color-accent-blue), var(--color-accent-blush));
          display: flex; align-items: center; justify-content: center;
        }

        .newsletter-success-icon svg {
          width: 22px; height: 22px;
          stroke: white; stroke-width: 2.5; fill: none;
        }

        .newsletter-success-text {
          font-family: 'Cormorant Garamond', serif;
          font-size: 22px; font-weight: 600; color: var(--color-primary); margin: 0;
        }

        .newsletter-success-sub {
          font-family: 'DM Sans', sans-serif;
          font-size: 13.5px; font-weight: 300;
          color: var(--color-text-soft); margin: 0;
        }
      `}</style>

      <Container>
        <div className="newsletter-card">
          {!done ? (
            <>
              <div className="newsletter-eyebrow">Stay Updated</div>
              <h2 className="newsletter-title">
                <em>Digital insights</em> delivered<br />to your inbox
              </h2>
              <p className="newsletter-desc">
                No noise. Just practical articles on web development, digital strategy
                and business technology — when we publish them.
              </p>

              <div className="newsletter-form">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="your@email.com"
                  className="newsletter-input"
                />
                <button
                  type="button"
                  className="newsletter-btn"
                  onClick={() => email.includes("@") && setDone(true)}
                >
                  Subscribe
                </button>
              </div>

              <p className="newsletter-note">No spam. Unsubscribe any time.</p>
            </>
          ) : (
            <div className="newsletter-success">
              <div className="newsletter-success-icon">
                <svg viewBox="0 0 24 24"><polyline points="20,6 9,17 4,12" /></svg>
              </div>
              <p className="newsletter-success-text">You're subscribed</p>
              <p className="newsletter-success-sub">
                We'll notify you when new articles are published.
              </p>
            </div>
          )}
        </div>
      </Container>
    </section>
  );
}