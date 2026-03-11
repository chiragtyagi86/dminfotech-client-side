// src/pages/TeamDetailPage.jsx
import { useParams, Link, Navigate } from "react-router-dom";
import { useApi } from "../lib/useApi";
import { api } from "../lib/api";
import Container from "../components/common/Container";
import CTASection from "../components/home/Ctasection";
import Seo from "../components/common/Seo";

function normalizeMember(item) {
  if (!item || typeof item !== "object") return null;

  return {
    id: item?.id ?? null,
    name: String(item?.name || "Team Member").trim(),
    role: String(item?.role || item?.position || item?.short_desc || "Team Member").trim(),
    bio: String(item?.bio || item?.short_desc || "Profile details coming soon.").trim(),
    avatar: item?.avatar || item?.photo_url || null,
    signature: item?.signature || null,
    email: item?.email || null,
    linkedinUrl: item?.linkedinUrl || item?.linkedin_url || null,
    twitterUrl: item?.twitterUrl || item?.twitter_url || null,
    websiteUrl: item?.websiteUrl || item?.website_url || null,
    resumeUrl: item?.resumeUrl || item?.resume_url || null,
    status: item?.status || null,
    isActive: item?.isActive ?? item?.is_active ?? null,
    skills: Array.isArray(item?.skills) ? item.skills : [],
  };
}

function normalizeTeam(raw) {
  const source = Array.isArray(raw)
    ? raw
    : Array.isArray(raw?.data)
    ? raw.data
    : Array.isArray(raw?.members)
    ? raw.members
    : [];

  return source
    .map(normalizeMember)
    .filter(Boolean);
}

function getInitial(name) {
  return String(name || "?").trim().charAt(0).toUpperCase() || "?";
}

export default function TeamDetailPage() {
  const { id } = useParams();

  const { data: rawMember, loading, error } = useApi(() => api.getTeamMember(id), [id]);
  const { data: rawAllMembers } = useApi(api.getTeamMembers);

  const member = normalizeMember(rawMember);
  const allMembers = normalizeTeam(rawAllMembers);
  const related = allMembers.filter((m) => String(m.id) !== String(id)).slice(0, 3);

  if (loading) return <Spinner />;
  if (error || !member) return <Navigate to="/team" replace />;

  return (
    <>
    <Seo
      title={`${member.name} - Dhanamitra Infotech LLP Team`}
      description={member.bio}
      keywords={[member.role, ...(member.skills || [])].filter(Boolean)}
      image={member.avatar || "/logo.png"}
      url={`/team/${member.id}`}
    />  
      <style>{`
        .tmdet-hero { position: relative; overflow: hidden; padding: 100px 0 64px; background: var(--color-bg); }
        .tmdet-orb1 { position: absolute; width: 520px; height: 520px; border-radius: 50%; top: -180px; right: -100px; background: radial-gradient(circle, rgba(153,178,221,0.14) 0%, transparent 65%); pointer-events: none; }
        .tmdet-orb2 { position: absolute; width: 300px; height: 300px; border-radius: 50%; bottom: -60px; left: 3%; background: radial-gradient(circle, rgba(233,175,163,0.10) 0%, transparent 70%); pointer-events: none; }
        .tmdet-hero-layout { display: grid; grid-template-columns: 1fr; gap: 48px; align-items: center; position: relative; z-index: 1; }
        @media (min-width: 1024px) { .tmdet-hero-layout { grid-template-columns: 1fr 320px; } }
        .tmdet-back { display: inline-flex; align-items: center; gap: 6px; font-family: 'DM Sans', sans-serif; font-size: 12px; color: var(--color-text-soft); text-decoration: none; margin-bottom: 24px; transition: color 0.2s; }
        .tmdet-back:hover { color: var(--color-primary); }
        .tmdet-role { font-family: 'DM Sans', sans-serif; font-size: 10.5px; font-weight: 500; letter-spacing: 0.22em; text-transform: uppercase; color: var(--color-primary-2); display: flex; align-items: center; gap: 8px; margin-bottom: 14px; }
        .tmdet-role::before { content: ''; width: 28px; height: 1px; background: var(--color-primary-2); }
        .tmdet-name { font-family: 'Cormorant Garamond', serif; font-size: clamp(36px, 6vw, 68px); font-weight: 300; line-height: 1.08; color: var(--color-primary); margin: 0 0 18px; }
        .tmdet-bio { font-family: 'DM Sans', sans-serif; font-size: 15px; font-weight: 300; line-height: 1.80; color: var(--color-text-soft); margin: 0 0 24px; }
        .tmdet-socials { display: flex; gap: 10px; flex-wrap: wrap; }
        .tmdet-social { display: inline-flex; align-items: center; gap: 8px; padding: 8px 18px; border-radius: 100px; border: 1px solid rgba(104,80,68,0.14); background: transparent; font-family: 'DM Sans', sans-serif; font-size: 12px; color: var(--color-primary); text-decoration: none; transition: background 0.2s; }
        .tmdet-social:hover { background: rgba(104,80,68,0.06); }
        .tmdet-photo-card { border-radius: 24px; overflow: hidden; aspect-ratio: 3/4; position: relative; }
        @media (max-width: 1023px) { .tmdet-photo-card { max-width: 280px; } }
        .tmdet-photo-bg { position: absolute; inset: 0; background: linear-gradient(145deg, rgba(153,178,221,0.25), rgba(233,175,163,0.15)); }
        .tmdet-photo-grid { position: absolute; inset: 0; background-image: linear-gradient(rgba(58,64,90,0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(58,64,90,0.05) 1px, transparent 1px); background-size: 24px 24px; }
        .tmdet-photo-initials { position: absolute; inset: 0; display: flex; align-items: center; justify-content: center; font-family: 'Cormorant Garamond', serif; font-size: 72px; font-weight: 300; color: rgba(58,64,90,0.20); }
        .tmdet-expertise { padding: 64px 0 80px; background: var(--color-bg-soft); }
        .tmdet-exp-label { font-family: 'DM Sans', sans-serif; font-size: 10.5px; font-weight: 500; letter-spacing: 0.22em; text-transform: uppercase; color: var(--color-primary-2); display: flex; align-items: center; gap: 12px; margin-bottom: 28px; }
        .tmdet-exp-label::after { content: ''; flex: 1; height: 1px; background: rgba(104,80,68,0.09); }
        .tmdet-exp-grid { display: grid; grid-template-columns: repeat(2, 1fr); gap: 12px; }
        @media (min-width: 640px) { .tmdet-exp-grid { grid-template-columns: repeat(3, 1fr); } }
        .tmdet-exp-tag { font-family: 'DM Sans', sans-serif; font-size: 13px; font-weight: 400; color: var(--color-primary); background: rgba(255,255,255,0.75); border: 1px solid rgba(104,80,68,0.10); padding: 12px 16px; border-radius: 14px; text-align: center; }
        .tmdet-related { padding: 0 0 96px; background: var(--color-bg-soft); }
        .tmdet-rel-grid { display: grid; grid-template-columns: 1fr; gap: 16px; }
        @media (min-width: 640px) { .tmdet-rel-grid { grid-template-columns: repeat(3, 1fr); } }
        .tmdet-rel-card { border-radius: 18px; border: 1px solid rgba(104,80,68,0.09); background: rgba(255,255,255,0.65); backdrop-filter: blur(10px); overflow: hidden; text-decoration: none; transition: transform 0.3s, box-shadow 0.3s; }
        .tmdet-rel-card:hover { transform: translateY(-4px); box-shadow: 0 16px 40px rgba(58,64,90,0.08); }
        .tmdet-rel-photo { height: 160px; position: relative; overflow: hidden; }
        .tmdet-rel-photo-bg { position: absolute; inset: 0; background: linear-gradient(145deg, rgba(153,178,221,0.25), rgba(233,175,163,0.15)); }
        .tmdet-rel-photo-initials { position: absolute; inset: 0; display: flex; align-items: center; justify-content: center; font-family: 'Cormorant Garamond', serif; font-size: 40px; font-weight: 300; color: rgba(58,64,90,0.20); }
        .tmdet-rel-body { padding: 16px 18px 18px; }
        .tmdet-rel-role { font-family: 'DM Sans', sans-serif; font-size: 9.5px; font-weight: 500; letter-spacing: 0.14em; text-transform: uppercase; color: var(--color-primary-2); margin-bottom: 6px; }
        .tmdet-rel-name { font-family: 'Cormorant Garamond', serif; font-size: 18px; font-weight: 600; color: var(--color-primary); margin: 0 0 6px; }
        .tmdet-rel-link { font-family: 'DM Sans', sans-serif; font-size: 11px; font-weight: 500; text-transform: uppercase; letter-spacing: 0.10em; color: var(--color-primary); }
      `}</style>

      <main>
        <section className="tmdet-hero">
          <div className="tmdet-orb1" />
          <div className="tmdet-orb2" />
          <Container>
            <div className="tmdet-hero-layout">
              <div>
                <Link to="/team" className="tmdet-back">← Back to Team</Link>
                <p className="tmdet-role">{member.role}</p>
                <h1 className="tmdet-name">{member.name}</h1>
                <p className="tmdet-bio">{member.bio}</p>

                <div className="tmdet-socials">
                  {member.linkedinUrl && (
                    <a href={member.linkedinUrl} target="_blank" rel="noopener noreferrer" className="tmdet-social">
                      in LinkedIn
                    </a>
                  )}
                  {member.twitterUrl && (
                    <a href={member.twitterUrl} target="_blank" rel="noopener noreferrer" className="tmdet-social">
                      𝕏 Twitter
                    </a>
                  )}
                  {member.websiteUrl && (
                    <a href={member.websiteUrl} target="_blank" rel="noopener noreferrer" className="tmdet-social">
                      ↗ Website
                    </a>
                  )}
                </div>
              </div>

              <div className="tmdet-photo-card">
                {member.avatar ? (
                  <img
                    src={member.avatar}
                    alt={member.name}
                    style={{
                      position: "absolute",
                      inset: 0,
                      width: "100%",
                      height: "100%",
                      objectFit: "cover",
                    }}
                  />
                ) : (
                  <>
                    <div className="tmdet-photo-bg" />
                    <div className="tmdet-photo-grid" />
                    <div className="tmdet-photo-initials">{getInitial(member.name)}</div>
                  </>
                )}
              </div>
            </div>
          </Container>
        </section>

        {member.skills && member.skills.length > 0 && (
          <section className="tmdet-expertise">
            <Container>
              <p className="tmdet-exp-label">Areas of Expertise</p>
              <div className="tmdet-exp-grid">
                {member.skills.map((s) => (
                  <div key={s} className="tmdet-exp-tag">{s}</div>
                ))}
              </div>
            </Container>
          </section>
        )}

        {related.length > 0 && (
          <section className="tmdet-related">
            <Container>
              <p className="tmdet-exp-label">Meet the Team</p>
              <div className="tmdet-rel-grid">
                {related.map((m) => (
                  <Link key={m.id} to={`/team/${m.id}`} className="tmdet-rel-card">
                    <div className="tmdet-rel-photo">
                      {m.avatar ? (
                        <img
                          src={m.avatar}
                          alt={m.name}
                          style={{
                            position: "absolute",
                            inset: 0,
                            width: "100%",
                            height: "100%",
                            objectFit: "cover",
                          }}
                        />
                      ) : (
                        <>
                          <div className="tmdet-rel-photo-bg" />
                          <div className="tmdet-rel-photo-initials">{getInitial(m.name)}</div>
                        </>
                      )}
                    </div>
                    <div className="tmdet-rel-body">
                      <p className="tmdet-rel-role">{m.role}</p>
                      <h3 className="tmdet-rel-name">{m.name}</h3>
                      <span className="tmdet-rel-link">View Profile →</span>
                    </div>
                  </Link>
                ))}
              </div>
            </Container>
          </section>
        )}

        <CTASection />
      </main>
    </>
  );
}

function Spinner() {
  return (
    <div
      style={{
        minHeight: "60vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <div
        style={{
          width: 40,
          height: 40,
          borderRadius: "50%",
          border: "3px solid rgba(153,178,221,0.25)",
          borderTopColor: "var(--color-primary)",
          animation: "spin 0.8s linear infinite",
        }}
      />
    </div>
  );
}