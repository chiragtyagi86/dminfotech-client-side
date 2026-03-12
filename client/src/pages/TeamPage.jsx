// src/pages/TeamPage.jsx
import { Link } from "react-router-dom";
import { useApi } from "../lib/useApi";
import { api } from "../lib/api";
import Container from "../components/common/Container";
import CTASection from "../components/home/Ctasection";
import Seo from "../components/common/Seo";

const STATIC_TEAM = [
  {
    id: 1,
    name: "Aditya Sharma",
    role: "Founder & CEO",
    bio: "Visionary leader with 10+ years in digital product development.",
    avatar: null,
    linkedinUrl: null,
    twitterUrl: null,
    websiteUrl: null,
  },
  {
    id: 2,
    name: "Priya Kapoor",
    role: "Head of Design",
    bio: "Award-winning designer passionate about user-centred experiences.",
    avatar: null,
    linkedinUrl: null,
    twitterUrl: null,
    websiteUrl: null,
  },
  {
    id: 3,
    name: "Rahul Nair",
    role: "Lead Developer",
    bio: "Full-stack engineer specialising in high-performance web applications.",
    avatar: null,
    linkedinUrl: null,
    twitterUrl: null,
    websiteUrl: null,
  },
  {
    id: 4,
    name: "Sneha Pillai",
    role: "Operations Manager",
    bio: "Keeps projects on track with clarity, precision and great communication.",
    avatar: null,
    linkedinUrl: null,
    twitterUrl: null,
    websiteUrl: null,
  },
];

function normalizeTeam(raw) {
  const source = Array.isArray(raw)
    ? raw
    : Array.isArray(raw?.data)
      ? raw.data
      : Array.isArray(raw?.members)
        ? raw.members
        : [];

  return source.map((item, index) => ({
    id: item?.id ?? index + 1,
    name: String(item?.name || "Team Member").trim(),
    role: String(
      item?.role || item?.position || item?.short_desc || "Team Member",
    ).trim(),
    bio: String(
      item?.bio || item?.short_desc || "Profile details coming soon.",
    ).trim(),
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
  }));
}

function getInitial(name) {
  return (
    String(name || "?")
      .trim()
      .charAt(0)
      .toUpperCase() || "?"
  );
}

export default function TeamPage() {
  const { data, error } = useApi(api.getTeamMembers);

  const normalized = normalizeTeam(data);
  const members = normalized.length ? normalized : STATIC_TEAM;

  return (
    <>
      <Seo
        title="Our Team | Dhanamitra Infotech LLP — Digital Solutions, Software & Business Growth"
        description="Meet the passionate team behind Dhanamitra Infotech LLP, delivering innovative digital solutions, software development and business growth services with expertise and dedication."
        keywords={[
          "Dhanamitra Infotech LLP",
          "team",
          "digital solutions company team",
          "website development experts",
          "software solutions specialists",
          "business growth strategists",
          "ISO certified digital services team",
          "modern digital solutions India team",
        ]}
      />
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,600;1,300&family=DM+Sans:wght@300;400;500&display=swap');
      `}</style>
      <style>{`
        .team-page { background: var(--color-bg); min-height: 100vh; }
        .team-hero { position: relative; overflow: hidden; padding: 100px 0 72px; }
        .team-orb1 { position: absolute; width: 520px; height: 520px; border-radius: 50%; top: -180px; right: -100px; background: radial-gradient(circle, rgba(153,178,221,0.14) 0%, transparent 65%); pointer-events: none; }
        .team-orb2 { position: absolute; width: 300px; height: 300px; border-radius: 50%; bottom: -60px; left: 3%; background: radial-gradient(circle, rgba(233,175,163,0.10) 0%, transparent 70%); pointer-events: none; }
        .team-hero-inner { position: relative; z-index: 1; max-width: 680px; animation: teamFade 0.8s ease both; }
        @keyframes teamFade { from{opacity:0;transform:translateY(18px);}to{opacity:1;transform:translateY(0);} }
        .team-eyebrow { font-family: 'DM Sans', sans-serif; font-size: 10.5px; font-weight: 500; letter-spacing: 0.22em; text-transform: uppercase; color: var(--color-primary-2); display: flex; align-items: center; gap: 8px; margin-bottom: 14px; }
        .team-eyebrow::before { content: ''; width: 28px; height: 1px; background: var(--color-primary-2); }
        .team-h1 { font-family: 'Cormorant Garamond', serif; font-size: clamp(36px, 6vw, 68px); font-weight: 300; line-height: 1.08; color: var(--color-primary); margin: 0 0 18px; }
        .team-h1 em { font-style: italic; color: var(--color-primary-2); }
        .team-sub { font-family: 'DM Sans', sans-serif; font-size: 15px; font-weight: 300; line-height: 1.80; color: var(--color-text-soft); }
        .team-note { margin-top: 16px; font-family: 'DM Sans', sans-serif; font-size: 12px; color: var(--color-text-soft); }
        .team-grid-section { padding: 80px 0 96px; background: var(--color-bg); }
        .team-label { font-family: 'DM Sans', sans-serif; font-size: 10.5px; font-weight: 500; letter-spacing: 0.22em; text-transform: uppercase; color: var(--color-primary-2); display: flex; align-items: center; gap: 12px; margin-bottom: 28px; }
        .team-label::after { content: ''; flex: 1; height: 1px; background: rgba(104,80,68,0.09); }
        .team-grid { display: grid; grid-template-columns: 1fr; gap: 20px; }
        @media (min-width: 640px) { .team-grid { grid-template-columns: repeat(2, 1fr); } }
        @media (min-width: 1024px) { .team-grid { grid-template-columns: repeat(2, 1fr); } }
        .team-card { border-radius: 20px; border: 1px solid rgba(104,80,68,0.09); background: rgba(255,255,255,0.65); backdrop-filter: blur(10px); overflow: hidden; display: grid; grid-template-columns: 1fr; text-decoration: none; transition: transform 0.35s ease, box-shadow 0.35s ease; }
        @media (min-width: 640px) { .team-card { grid-template-columns: 200px 1fr; } }
        .team-card:hover { transform: translateY(-4px); box-shadow: 0 20px 52px rgba(58,64,90,0.10); }
        .team-card-photo { position: relative; overflow: hidden; min-height: 200px; }
        .team-card-photo-bg { position: absolute; inset: 0; background: linear-gradient(145deg, rgba(153,178,221,0.25), rgba(233,175,163,0.15)); }
        .team-card-photo-grid { position: absolute; inset: 0; background-image: linear-gradient(rgba(58,64,90,0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(58,64,90,0.05) 1px, transparent 1px); background-size: 20px 20px; }
        .team-card-photo-initials { position: absolute; inset: 0; display: flex; align-items: center; justify-content: center; font-family: 'Cormorant Garamond', serif; font-size: 48px; font-weight: 300; color: rgba(58,64,90,0.25); }
        .team-card-body { padding: 28px 24px; display: flex; flex-direction: column; gap: 10px; }
        .team-card-role { font-family: 'DM Sans', sans-serif; font-size: 10px; font-weight: 500; letter-spacing: 0.16em; text-transform: uppercase; color: var(--color-primary-2); }
        .team-card-name { font-family: 'Cormorant Garamond', serif; font-size: 24px; font-weight: 600; color: var(--color-primary); line-height: 1.2; margin: 0; }
        .team-card-bio { font-family: 'DM Sans', sans-serif; font-size: 13px; font-weight: 300; line-height: 1.70; color: var(--color-text-soft); flex: 1; }
        .team-card-socials { display: flex; gap: 8px; }
        .team-card-social { width: 30px; height: 30px; border-radius: 50%; border: 1px solid rgba(104,80,68,0.12); display: flex; align-items: center; justify-content: center; font-size: 11px; color: var(--color-text-soft); text-decoration: none; transition: background 0.2s, color 0.2s; }
        .team-card-social:hover { background: var(--color-primary); color: white; border-color: transparent; }
        .team-card-link { font-family: 'DM Sans', sans-serif; font-size: 11px; font-weight: 500; letter-spacing: 0.10em; text-transform: uppercase; color: var(--color-primary); display: flex; align-items: center; gap: 4px; margin-top: auto; }
        .team-card:hover .team-card-link { color: var(--color-accent-blue); }
      `}</style>

      <main className="team-page">
        <section className="team-hero">
          <div className="team-orb1" />
          <div className="team-orb2" />
          <Container>
            <div className="team-hero-inner">
              <p className="team-eyebrow">Our Team</p>
              <h1 className="team-h1">
                The people behind
                <br />
                <em>the work</em>
              </h1>
              <p className="team-sub">
                A passionate group of designers, engineers and strategists
                united by a love of craft and a commitment to delivering real
                results.
              </p>
              {error && (
                <p className="team-note">
                  Live team data could not be loaded, so fallback team members
                  are being shown.
                </p>
              )}
            </div>
          </Container>
        </section>

        <section className="team-grid-section">
          <Container>
            <p className="team-label">
              {members.length} Team Member{members.length !== 1 ? "s" : ""}
            </p>

            <div className="team-grid">
              {members.map((m) => (
                <Link key={m.id} to={`/team/${m.id}`} className="team-card">
                  <div className="team-card-photo">
                    {m.avatar ? (
                      <img
                        src={`${import.meta.env.VITE_API_URL}${m.avatar}`}
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
                        <div className="team-card-photo-bg" />
                        <div className="team-card-photo-grid" />
                        <div className="team-card-photo-initials">
                          {getInitial(m.name)}
                        </div>
                      </>
                    )}
                  </div>

                  <div className="team-card-body">
                    <p className="team-card-role">{m.role}</p>
                    <h3 className="team-card-name">{m.name}</h3>
                    <p className="team-card-bio">{m.bio}</p>

                    <div className="team-card-socials">
                      {m.linkedinUrl && (
                        <a
                          href={m.linkedinUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          onClick={(e) => e.stopPropagation()}
                          className="team-card-social"
                        >
                          in
                        </a>
                      )}
                      {m.twitterUrl && (
                        <a
                          href={m.twitterUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          onClick={(e) => e.stopPropagation()}
                          className="team-card-social"
                        >
                          𝕏
                        </a>
                      )}
                      {m.websiteUrl && (
                        <a
                          href={m.websiteUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          onClick={(e) => e.stopPropagation()}
                          className="team-card-social"
                        >
                          ↗
                        </a>
                      )}
                    </div>

                    <span className="team-card-link">View Profile →</span>
                  </div>
                </Link>
              ))}
            </div>
          </Container>
        </section>

        <CTASection />
      </main>
    </>
  );
}
