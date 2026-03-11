// src/pages/CareerDetailPage.jsx
import { useParams, Link, Navigate } from "react-router-dom";
import { useApi } from "../lib/useApi";
import { api } from "../lib/api";
import Container from "../components/common/Container";
import JobApplicationForm from "../components/careers/JobApplicationForm";
import Seo from "../components/common/Seo";

function jobTypeLabel(t) { return { full_time: "Full-Time", part_time: "Part-Time", contract: "Contract", internship: "Internship" }[t] || t || ""; }
function locationTypeLabel(t) { return { remote: "Remote", onsite: "On-site", hybrid: "Hybrid" }[t] || t || ""; }
function salaryDisplay(min, max, currency = "INR") {
  if (!min && !max) return null;
  const fmt = n => `${currency} ${Number(n).toLocaleString("en-IN")}`;
  if (min && max) return `${fmt(min)} – ${fmt(max)} / year`;
  if (min) return `From ${fmt(min)} / year`;
  return `Up to ${fmt(max)} / year`;
}

export default function CareerDetailPage() {
  const { slug } = useParams();
  const { data: job, loading, error } = useApi(() => api.getJob(slug), [slug]);

  if (loading) return <Spinner />;
  if (error || !job) return <Navigate to="/careers" replace />;

  const requirements = Array.isArray(job.requirements) ? job.requirements
    : typeof job.requirements === "string" ? job.requirements.split("\n").filter(Boolean) : [];
  const benefits = Array.isArray(job.benefits) ? job.benefits
    : typeof job.benefits === "string" ? job.benefits.split("\n").filter(Boolean) : [];
  const salary = salaryDisplay(job.salaryMin, job.salaryMax, job.salaryCurrency);

  return (
    <>
    <Seo
      title={`${job.title} - Dhanamitra Infotech LLP`}
      description={job.description}
      keywords={job.keywords}
    />
      <style>{`
        .cdet-hero { position: relative; overflow: hidden; padding: 100px 0 64px; background: var(--color-bg); }
        .cdet-orb1 { position: absolute; width: 500px; height: 500px; border-radius: 50%; top: -180px; right: -80px; background: radial-gradient(circle, rgba(153,178,221,0.14) 0%, transparent 65%); pointer-events: none; }
        .cdet-orb2 { position: absolute; width: 300px; height: 300px; border-radius: 50%; bottom: -60px; left: 3%; background: radial-gradient(circle, rgba(233,175,163,0.10) 0%, transparent 70%); pointer-events: none; }
        .cdet-hero-inner { position: relative; z-index: 1; max-width: 720px; }
        .cdet-back { display: inline-flex; align-items: center; gap: 6px; font-family: 'DM Sans', sans-serif; font-size: 12px; color: var(--color-text-soft); text-decoration: none; margin-bottom: 24px; transition: color 0.2s; }
        .cdet-back:hover { color: var(--color-primary); }
        .cdet-dept { font-family: 'DM Sans', sans-serif; font-size: 10.5px; font-weight: 500; letter-spacing: 0.22em; text-transform: uppercase; color: var(--color-primary-2); display: flex; align-items: center; gap: 8px; margin-bottom: 14px; }
        .cdet-dept::before { content: ''; width: 28px; height: 1px; background: var(--color-primary-2); }
        .cdet-h1 { font-family: 'Cormorant Garamond', serif; font-size: clamp(32px, 5vw, 60px); font-weight: 300; line-height: 1.10; color: var(--color-primary); margin: 0 0 20px; }
        .cdet-tags { display: flex; flex-wrap: wrap; gap: 8px; }
        .cdet-tag { font-family: 'DM Sans', sans-serif; font-size: 12px; font-weight: 400; color: var(--color-primary); background: rgba(104,80,68,0.06); border: 1px solid rgba(104,80,68,0.10); padding: 5px 14px; border-radius: 100px; }
        .cdet-tag-salary { background: rgba(153,178,221,0.15); border-color: rgba(153,178,221,0.30); }
        .cdet-body { padding: 64px 0 80px; background: var(--color-bg); }
        .cdet-layout { display: grid; grid-template-columns: 1fr; gap: 48px; align-items: start; }
        @media (min-width: 1024px) { .cdet-layout { grid-template-columns: 1fr 360px; gap: 64px; } }
        .cdet-section-label { font-family: 'DM Sans', sans-serif; font-size: 10px; font-weight: 500; letter-spacing: 0.18em; text-transform: uppercase; color: var(--color-text-soft); margin: 0 0 12px; display: block; }
        .cdet-desc { font-family: 'DM Sans', sans-serif; font-size: 15px; font-weight: 300; line-height: 1.88; color: var(--color-text-soft); margin: 0 0 36px; }
        .cdet-desc h2 { font-family: 'Cormorant Garamond', serif; font-size: clamp(20px, 3vw, 28px); font-weight: 600; color: var(--color-primary); margin: 36px 0 12px; }
        .cdet-desc p { margin: 0 0 16px; }
        .cdet-list-block { background: rgba(255,255,255,0.60); border: 1px solid rgba(104,80,68,0.09); border-radius: 18px; padding: 24px 24px; margin-bottom: 28px; }
        .cdet-list-title { font-family: 'DM Sans', sans-serif; font-size: 10px; font-weight: 500; letter-spacing: 0.18em; text-transform: uppercase; color: var(--color-text-soft); margin: 0 0 16px; }
        .cdet-list { display: flex; flex-direction: column; gap: 10px; padding: 0; list-style: none; margin: 0; }
        .cdet-list-item { display: flex; align-items: flex-start; gap: 10px; font-family: 'DM Sans', sans-serif; font-size: 13.5px; font-weight: 300; line-height: 1.70; color: var(--color-text-soft); }
        .cdet-list-bullet { width: 6px; height: 6px; border-radius: 50%; background: linear-gradient(135deg, var(--color-accent-blue), var(--color-accent-blush)); margin-top: 7px; flex-shrink: 0; }
      `}</style>
      <main>
        <section className="cdet-hero">
          <div className="cdet-orb1" /><div className="cdet-orb2" />
          <Container>
            <div className="cdet-hero-inner">
              <Link to="/careers" className="cdet-back">← All Open Positions</Link>
              {job.department && <p className="cdet-dept">{job.department}</p>}
              <h1 className="cdet-h1">{job.title}</h1>
              <div className="cdet-tags">
                {job.locationType && <span className="cdet-tag">{locationTypeLabel(job.locationType)}</span>}
                {job.jobType && <span className="cdet-tag">{jobTypeLabel(job.jobType)}</span>}
                {job.location && <span className="cdet-tag">📍 {job.location}</span>}
                {salary && <span className="cdet-tag cdet-tag-salary">💰 {salary}</span>}
              </div>
            </div>
          </Container>
        </section>

        <section className="cdet-body">
          <Container>
            <div className="cdet-layout">
              <div>
                {job.description && (
                  <div className="cdet-desc" dangerouslySetInnerHTML={{ __html: job.description }} />
                )}
                {requirements.length > 0 && (
                  <div className="cdet-list-block">
                    <p className="cdet-list-title">Requirements</p>
                    <ul className="cdet-list">
                      {requirements.map((r, i) => (
                        <li key={i} className="cdet-list-item">
                          <span className="cdet-list-bullet" />{r}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
                {benefits.length > 0 && (
                  <div className="cdet-list-block">
                    <p className="cdet-list-title">Benefits</p>
                    <ul className="cdet-list">
                      {benefits.map((b, i) => (
                        <li key={i} className="cdet-list-item">
                          <span className="cdet-list-bullet" />{b}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
              <div>
                <JobApplicationForm jobId={job.id} jobTitle={job.title} />
              </div>
            </div>
          </Container>
        </section>
      </main>
    </>
  );
}

function Spinner() {
  return <div style={{ minHeight: "60vh", display: "flex", alignItems: "center", justifyContent: "center" }}><div style={{ width: 40, height: 40, borderRadius: "50%", border: "3px solid rgba(153,178,221,0.25)", borderTopColor: "var(--color-primary)", animation: "spin 0.8s linear infinite" }} /></div>;
}