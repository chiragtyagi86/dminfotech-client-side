// app/careers/page.tsx
import Link from "next/link";
import Container from "@/app/components/common/Container";
import SectionHeading from "@/app/components/common/SectionHeading";
import { getAllOpenJobs, salaryDisplay, locationTypeLabel, jobTypeLabel } from "../../../../lib/careers-data";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Careers | Dhanamitra Infotech LLP",
  description: "Join our team. We're hiring passionate people who care about craft, code and creating things that last.",
};

export default async function CareersPage() {
  const jobs = await getAllOpenJobs();

  return (
    <main>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,600;1,300&family=DM+Sans:wght@300;400;500&display=swap');

        /* ── Hero ── */
        .car-hero {
          position: relative; overflow: hidden;
          padding: 104px 0 88px;
          background: var(--color-bg);
        }
        .car-hero-orb {
          position: absolute; border-radius: 50%; pointer-events: none;
        }
        .car-hero-orb1 {
          width: 500px; height: 500px;
          top: -180px; right: -80px;
          background: radial-gradient(circle, rgba(153,178,221,0.14) 0%, transparent 65%);
        }
        .car-hero-orb2 {
          width: 300px; height: 300px;
          bottom: -80px; left: 5%;
          background: radial-gradient(circle, rgba(233,175,163,0.10) 0%, transparent 70%);
        }
        .car-hero-grid {
          position: absolute; inset: 0; pointer-events: none;
          background-image:
            linear-gradient(rgba(58,64,90,0.03) 1px, transparent 1px),
            linear-gradient(90deg, rgba(58,64,90,0.03) 1px, transparent 1px);
          background-size: 56px 56px;
          mask-image: radial-gradient(ellipse 60% 80% at 10% 50%, black, transparent);
        }
        .car-hero-inner {
          position: relative; z-index: 1;
          max-width: 760px;
          animation: carFadeUp 0.8s ease both;
        }
        @keyframes carFadeUp {
          from { opacity: 0; transform: translateY(16px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        .car-eyebrow {
          display: inline-flex; align-items: center; gap: 8px;
          font-family: 'DM Sans', sans-serif;
          font-size: 10px; font-weight: 500; letter-spacing: 0.22em; text-transform: uppercase;
          color: var(--color-primary-2);
          margin-bottom: 20px;
        }
        .car-eyebrow-line {
          width: 28px; height: 1px;
          background: linear-gradient(90deg, var(--color-accent-blue), var(--color-accent-blush));
        }
        .car-hero-h1 {
          font-family: 'Cormorant Garamond', serif;
          font-size: clamp(38px, 5.5vw, 68px); font-weight: 300; line-height: 1.06;
          color: var(--color-primary); margin: 0 0 22px;
          animation: carFadeUp 0.85s ease 0.08s both;
        }
        .car-hero-h1 em { font-style: italic; color: var(--color-primary-2); }
        .car-hero-sub {
          font-family: 'DM Sans', sans-serif;
          font-size: 16px; font-weight: 300; line-height: 1.80;
          color: var(--color-text-soft); margin: 0;
          max-width: 540px;
          animation: carFadeUp 0.85s ease 0.15s both;
        }

        /* ── Jobs section ── */
        .car-jobs-section {
          padding: 80px 0 96px;
          background: var(--color-bg-soft);
          position: relative;
        }
        .car-jobs-section::before {
          content: '';
          position: absolute; top: 0; left: 0; right: 0; height: 1px;
          background: linear-gradient(90deg, transparent, rgba(104,80,68,0.10), transparent);
        }

        /* ── Job card ── */
        .car-grid {
          display: flex; flex-direction: column; gap: 16px;
          margin-top: 52px;
        }
        .car-card {
          border-radius: 20px;
          border: 1px solid rgba(104,80,68,0.09);
          background: rgba(255,255,255,0.68);
          backdrop-filter: blur(10px);
          padding: 28px 32px;
          display: grid;
          grid-template-columns: 1fr auto;
          gap: 16px 24px;
          align-items: center;
          text-decoration: none;
          transition: transform 0.32s cubic-bezier(0.4,0,0.2,1), box-shadow 0.32s ease;
          position: relative; overflow: hidden;
        }
        .car-card::before {
          content: '';
          position: absolute; left: 0; top: 0; bottom: 0; width: 3px;
          background: linear-gradient(180deg, var(--color-accent-blue), var(--color-accent-blush));
          opacity: 0; transition: opacity 0.3s ease;
        }
        .car-card:hover { transform: translateY(-4px); box-shadow: 0 20px 52px rgba(58,64,90,0.10); }
        .car-card:hover::before { opacity: 1; }

        .car-card-left { min-width: 0; }

        .car-card-dept {
          font-family: 'DM Sans', sans-serif;
          font-size: 10px; font-weight: 500; letter-spacing: 0.18em; text-transform: uppercase;
          color: var(--color-primary-2); margin: 0 0 8px;
        }
        .car-card-title {
          font-family: 'Cormorant Garamond', serif;
          font-size: 24px; font-weight: 600; line-height: 1.2;
          color: var(--color-primary); margin: 0 0 14px;
          transition: color 0.25s;
        }
        .car-card:hover .car-card-title { color: var(--color-primary-2); }

        .car-tags { display: flex; flex-wrap: wrap; gap: 8px; }
        .car-tag {
          font-family: 'DM Sans', sans-serif;
          font-size: 11px; font-weight: 400;
          color: var(--color-text-soft);
          background: rgba(104,80,68,0.06);
          border: 1px solid rgba(104,80,68,0.10);
          padding: 4px 12px; border-radius: 100px;
          display: flex; align-items: center; gap: 5px;
        }
        .car-tag-dot {
          width: 5px; height: 5px; border-radius: 50%;
          background: var(--color-accent-blue); flex-shrink: 0;
        }

        .car-card-right {
          display: flex; flex-direction: column; align-items: flex-end; gap: 12px;
        }
        .car-salary {
          font-family: 'Cormorant Garamond', serif;
          font-size: 20px; font-weight: 600;
          color: var(--color-primary); white-space: nowrap;
        }
        .car-apply-btn {
          display: inline-flex; align-items: center; gap: 6px;
          padding: 9px 20px; border-radius: 3px;
          background: var(--color-primary); color: var(--color-surface);
          font-family: 'DM Sans', sans-serif;
          font-size: 11px; font-weight: 500; letter-spacing: 0.10em; text-transform: uppercase;
          transition: transform 0.22s ease, box-shadow 0.22s ease;
          white-space: nowrap;
        }
        .car-card:hover .car-apply-btn {
          transform: translateY(-1px);
          box-shadow: 0 6px 18px rgba(58,64,90,0.22);
        }

        /* ── Empty state ── */
        .car-empty {
          text-align: center; padding: 64px 24px;
          border: 1.5px dashed rgba(104,80,68,0.16);
          border-radius: 20px;
          background: rgba(255,255,255,0.40);
          margin-top: 52px;
        }
        .car-empty-icon {
          font-size: 32px; margin-bottom: 16px; opacity: 0.4;
        }
        .car-empty-title {
          font-family: 'Cormorant Garamond', serif;
          font-size: 26px; font-weight: 300;
          color: var(--color-primary); margin: 0 0 10px;
        }
        .car-empty-text {
          font-family: 'DM Sans', sans-serif;
          font-size: 14px; font-weight: 300;
          color: var(--color-text-soft); margin: 0;
        }

        /* ── Values strip ── */
        .car-values {
          padding: 80px 0;
          background: var(--color-bg);
        }
        .car-values-grid {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 20px;
          margin-top: 48px;
        }
        @media (min-width: 768px) { .car-values-grid { grid-template-columns: repeat(4, 1fr); } }
        .car-value-card {
          border-radius: 16px;
          border: 1px solid rgba(104,80,68,0.08);
          background: rgba(255,255,255,0.55);
          padding: 24px 20px;
          text-align: center;
        }
        .car-value-num {
          font-family: 'Cormorant Garamond', serif;
          font-size: 38px; font-weight: 300;
          color: var(--color-primary); line-height: 1;
          margin-bottom: 8px;
        }
        .car-value-label {
          font-family: 'DM Sans', sans-serif;
          font-size: 12px; font-weight: 400;
          color: var(--color-text-soft);
        }

        @media (max-width: 640px) {
          .car-card { grid-template-columns: 1fr; padding: 22px 20px; }
          .car-card-right { align-items: flex-start; }
        }
      `}</style>

      {/* ── Hero ── */}
      <section className="car-hero">
        <div className="car-hero-orb car-hero-orb1" />
        <div className="car-hero-orb car-hero-orb2" />
        <div className="car-hero-grid" />
        <Container>
          <div className="car-hero-inner">
            <p className="car-eyebrow">
              <span className="car-eyebrow-line" />
              Careers at Dhanamitra
            </p>
            <h1 className="car-hero-h1">
              Build things that<br /><em>actually matter</em>
            </h1>
            <p className="car-hero-sub">
              We're a small team that moves fast, works on real problems and cares about the quality of everything we ship. If that sounds like you, read on.
            </p>
          </div>
        </Container>
      </section>

      {/* ── Job Listings ── */}
      <section className="car-jobs-section">
        <Container>
          <SectionHeading
            eyebrow="Open Roles"
            title="We're hiring"
            description={jobs.length > 0
              ? `${jobs.length} open position${jobs.length > 1 ? "s" : ""} — click any role to read more and apply.`
              : "No open positions right now — check back soon."}
          />

          {jobs.length === 0 ? (
            <div className="car-empty">
              <div className="car-empty-icon">📭</div>
              <h2 className="car-empty-title">No openings right now</h2>
              <p className="car-empty-text">We'll post new roles here as we grow. Follow us on LinkedIn to stay updated.</p>
            </div>
          ) : (
            <div className="car-grid">
              {jobs.map((job) => (
                <Link key={job.id} href={`/careers/${job.slug}`} className="car-card">
                  <div className="car-card-left">
                    {job.department && <p className="car-card-dept">{job.department}</p>}
                    <h2 className="car-card-title">{job.title}</h2>
                    <div className="car-tags">
                      {job.location && (
                        <span className="car-tag">
                          <span className="car-tag-dot" />
                          {job.location}
                        </span>
                      )}
                      <span className="car-tag">
                        <span className="car-tag-dot" />
                        {locationTypeLabel(job.location_type)}
                      </span>
                      <span className="car-tag">
                        <span className="car-tag-dot" />
                        {jobTypeLabel(job.job_type)}
                      </span>
                    </div>
                  </div>
                  <div className="car-card-right">
                    <span className="car-salary">{salaryDisplay(job)}</span>
                    <span className="car-apply-btn">Apply Now →</span>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </Container>
      </section>

      {/* ── Values strip ── */}
      <section className="car-values">
        <Container>
          <SectionHeading
            eyebrow="Why Join Us"
            title="A place to do your best work"
            description="We invest in the people who build with us."
          />
          <div className="car-values-grid">
            {[
              { num: "Real", label: "Client projects from day one" },
              { num: "Flex", label: "Hybrid & remote-friendly culture" },
              { num: "Fast", label: "Move quickly, own your work" },
              { num: "Grow", label: "Mentorship and skill development" },
            ].map((v) => (
              <div key={v.label} className="car-value-card">
                <div className="car-value-num">{v.num}</div>
                <div className="car-value-label">{v.label}</div>
              </div>
            ))}
          </div>
        </Container>
      </section>
    </main>
  );
}