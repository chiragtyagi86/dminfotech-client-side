// app/careers/[slug]/page.tsx
import { notFound } from "next/navigation";
import Container from "@/app/components/common/Container";
import { getJobBySlug, getAllJobSlugs, salaryDisplay, locationTypeLabel, jobTypeLabel } from "../../../../../lib/careers-data";
import JobApplicationForm from "@/app/components/careers/JobApplicationForm";
import type { Metadata } from "next";

export async function generateStaticParams() {
  const slugs = await getAllJobSlugs();
  return slugs.map((s) => ({ slug: s.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const job = await getJobBySlug(slug);
  if (!job) return { title: "Job Not Found" };
  return {
    title: `${job.title} | Careers — Dhanamitra Infotech LLP`,
    description: job.meta_description || `Apply for ${job.title} at Dhanamitra Infotech LLP. ${job.location ?? ""} · ${jobTypeLabel(job.job_type)}`,
  };
}

export default async function JobPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const job = await getJobBySlug(slug);
  if (!job || job.status !== "open") notFound();

  const tags = [
    job.location            && { label: job.location },
    job.location_type       && { label: locationTypeLabel(job.location_type) },
    job.job_type            && { label: jobTypeLabel(job.job_type) },
    job.department          && { label: job.department },
  ].filter(Boolean) as { label: string }[];

  const salary = salaryDisplay(job);
  const requirementLines = (job.requirements ?? "").split("\n").map((l) => l.trim()).filter(Boolean);
  const benefitLines     = (job.benefits     ?? "").split("\n").map((l) => l.trim()).filter(Boolean);

  return (
    <main>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,600;1,300&family=DM+Sans:wght@300;400;500&display=swap');

        .jd-hero {
          position: relative; overflow: hidden;
          padding: 96px 0 72px;
          background: var(--color-bg);
        }
        .jd-hero-orb {
          position: absolute; border-radius: 50%; pointer-events: none;
          width: 480px; height: 480px; top: -160px; right: -60px;
          background: radial-gradient(circle, rgba(153,178,221,0.13) 0%, transparent 65%);
        }
        .jd-hero-grid {
          position: absolute; inset: 0; pointer-events: none;
          background-image:
            linear-gradient(rgba(58,64,90,0.03) 1px, transparent 1px),
            linear-gradient(90deg, rgba(58,64,90,0.03) 1px, transparent 1px);
          background-size: 56px 56px;
          mask-image: radial-gradient(ellipse 70% 90% at 5% 50%, black, transparent);
        }
        .jd-hero-body { position: relative; z-index: 1; animation: jdFade 0.8s ease both; }
        @keyframes jdFade { from { opacity:0; transform: translateY(14px); } to { opacity:1; transform:none; } }

        .jd-back {
          display: inline-flex; align-items: center; gap: 6px;
          font-family: 'DM Sans', sans-serif;
          font-size: 11px; font-weight: 500; letter-spacing: 0.08em; text-transform: uppercase;
          color: var(--color-text-soft); text-decoration: none;
          margin-bottom: 28px;
          transition: color 0.2s;
        }
        .jd-back:hover { color: var(--color-primary); }

        .jd-dept {
          font-family: 'DM Sans', sans-serif;
          font-size: 10px; font-weight: 500; letter-spacing: 0.20em; text-transform: uppercase;
          color: var(--color-primary-2); margin: 0 0 12px;
        }
        .jd-title {
          font-family: 'Cormorant Garamond', serif;
          font-size: clamp(32px, 5vw, 58px); font-weight: 300; line-height: 1.08;
          color: var(--color-primary); margin: 0 0 20px;
        }
        .jd-tags { display: flex; flex-wrap: wrap; gap: 8px; margin-bottom: 24px; }
        .jd-tag {
          font-family: 'DM Sans', sans-serif;
          font-size: 11.5px; font-weight: 400;
          color: var(--color-text-soft);
          background: rgba(104,80,68,0.05);
          border: 1px solid rgba(104,80,68,0.10);
          padding: 5px 14px; border-radius: 100px;
        }
        .jd-salary {
          font-family: 'Cormorant Garamond', serif;
          font-size: 26px; font-weight: 600;
          color: var(--color-primary);
          border-left: 3px solid var(--color-accent-blue);
          padding-left: 14px;
        }

        /* ── Content layout ── */
        .jd-layout {
          padding: 72px 0 96px;
          background: var(--color-bg-soft);
          position: relative;
        }
        .jd-layout::before {
          content: ''; position: absolute; top: 0; left: 0; right: 0; height: 1px;
          background: linear-gradient(90deg, transparent, rgba(104,80,68,0.10), transparent);
        }
        .jd-grid {
          display: grid;
          grid-template-columns: 1fr;
          gap: 32px;
        }
        @media (min-width: 1024px) { .jd-grid { grid-template-columns: 1fr 420px; gap: 48px; } }

        /* ── Left: job detail ── */
        .jd-detail { display: flex; flex-direction: column; gap: 28px; }
        .jd-card {
          border-radius: 20px;
          border: 1px solid rgba(104,80,68,0.09);
          background: rgba(255,255,255,0.65);
          backdrop-filter: blur(10px);
          padding: 32px 36px;
        }
        .jd-section-title {
          font-family: 'DM Sans', sans-serif;
          font-size: 10px; font-weight: 500; letter-spacing: 0.20em; text-transform: uppercase;
          color: var(--color-primary-2);
          margin: 0 0 16px; padding-bottom: 12px;
          border-bottom: 1px solid rgba(104,80,68,0.08);
          display: flex; align-items: center; gap: 10px;
        }
        .jd-section-title::after {
          content: ''; flex: 1; height: 1px;
          background: rgba(104,80,68,0.06);
        }
        .jd-description {
          font-family: 'DM Sans', sans-serif;
          font-size: 14.5px; font-weight: 300;
          line-height: 1.85; color: var(--color-text-soft);
        }
        .jd-description p { margin: 0 0 14px; }
        .jd-description p:last-child { margin: 0; }
        .jd-description ul { padding-left: 18px; margin: 0 0 14px; }
        .jd-description li { margin-bottom: 8px; }
        .jd-description strong { color: var(--color-primary); font-weight: 500; }

        .jd-req-list {
          list-style: none; padding: 0; margin: 0;
          display: flex; flex-direction: column; gap: 10px;
        }
        .jd-req-item {
          display: flex; align-items: flex-start; gap: 12px;
          font-family: 'DM Sans', sans-serif;
          font-size: 14px; font-weight: 300;
          line-height: 1.65; color: var(--color-text-soft);
        }
        .jd-req-bullet {
          width: 18px; height: 18px; border-radius: 50%; flex-shrink: 0;
          background: linear-gradient(135deg, rgba(153,178,221,0.25), rgba(233,175,163,0.15));
          border: 1px solid rgba(104,80,68,0.12);
          display: flex; align-items: center; justify-content: center;
          margin-top: 2px;
          font-size: 9px; color: var(--color-primary);
        }

        @media (max-width: 640px) {
          .jd-card { padding: 22px 20px; }
        }
      `}</style>

      {/* ── Hero ── */}
      <section className="jd-hero">
        <div className="jd-hero-orb" />
        <div className="jd-hero-grid" />
        <Container>
          <div className="jd-hero-body">
            <a href="/careers" className="jd-back">← All open roles</a>
            {job.department && <p className="jd-dept">{job.department}</p>}
            <h1 className="jd-title">{job.title}</h1>
            <div className="jd-tags">
              {tags.map((t) => (
                <span key={t.label} className="jd-tag">{t.label}</span>
              ))}
            </div>
            <div className="jd-salary">{salary}</div>
          </div>
        </Container>
      </section>

      {/* ── Content + Form ── */}
      <section className="jd-layout">
        <Container>
          <div className="jd-grid">

            {/* Left — job detail */}
            <div className="jd-detail">
              {job.description && (
                <div className="jd-card">
                  <p className="jd-section-title">About the Role</p>
                  <div
                    className="jd-description"
                    dangerouslySetInnerHTML={{ __html: job.description }}
                  />
                </div>
              )}

              {requirementLines.length > 0 && (
                <div className="jd-card">
                  <p className="jd-section-title">Requirements</p>
                  <ul className="jd-req-list">
                    {requirementLines.map((req, i) => (
                      <li key={i} className="jd-req-item">
                        <span className="jd-req-bullet">✓</span>
                        {req}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {benefitLines.length > 0 && (
                <div className="jd-card">
                  <p className="jd-section-title">What We Offer</p>
                  <ul className="jd-req-list">
                    {benefitLines.map((b, i) => (
                      <li key={i} className="jd-req-item">
                        <span className="jd-req-bullet">★</span>
                        {b}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>

            {/* Right — sticky application form */}
            <div>
              <JobApplicationForm jobId={job.id} jobTitle={job.title} />
            </div>

          </div>
        </Container>
      </section>
    </main>
  );
}