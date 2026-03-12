import Link from "next/link";
import Container from "@/app/components/common/Container";
import SectionHeading from "@/app/components/common/SectionHeading";

export type TeamMember = {
  id: number;
  name: string;
  position: string;
  bio: string;
  shortDesc: string;
  photoUrl: string;
  signature?: string;
  email?: string;
  linkedinUrl?: string;
  twitterUrl?: string;
  websiteUrl?: string;
  resumeUrl?: string;
};

// ── Fetch team members from database ──────────────────────────────────────────
async function getTeamMembers(): Promise<TeamMember[]> {
  try {
    const { getAllTeamMembers } = await import("../../../../lib/team-data");
    const members = await getAllTeamMembers();

    // If we got data from database, return it
    if (members && members.length > 0) {
      return members;
    }

    // Otherwise fall back to static data
    console.warn("No team members found in database, using static fallback");
    return STATIC_TEAM;
  } catch (error) {
    console.warn(
      "Could not fetch team members from database, using static fallback:",
      error,
    );
    return STATIC_TEAM;
  }
}

// ── Static fallback team members ──────────────────────────────────────────────
const STATIC_TEAM: TeamMember[] = [
  {
    id: 1,
    name: "Aarav Sharma",
    position: "Founder & CEO",
    shortDesc: "Digital visionary & business strategist",
    bio: "With 15+ years of experience in digital transformation, Aarav founded Dhanamitra to bridge the gap between business needs and technology solutions. Passionate about building scalable systems and mentoring talented teams.",
    photoUrl: "/team/aarav-sharma.jpg",
    signature: "/team/signatures/aarav-signature.png",
    email: "aarav@dhanamitra.com",
    linkedinUrl: "https://linkedin.com/in/aarav-sharma",
    twitterUrl: "https://twitter.com/aarav_sharma",
    websiteUrl: "https://aharma.dev",
  },
  {
    id: 2,
    name: "Priya Verma",
    position: "CTO & Lead Architect",
    shortDesc: "Full-stack systems architect",
    bio: "Priya leads all technical strategy and architecture decisions. Specialized in building enterprise-grade systems, API design, and cloud infrastructure. Mentor to junior developers and advocate for clean code practices.",
    photoUrl: "/team/priya-verma.jpg",
    signature: "/team/signatures/priya-signature.png",
    email: "priya@dhanamitra.com",
    linkedinUrl: "https://linkedin.com/in/priya-verma",
    websiteUrl: "https://priya.dev",
  },
  {
    id: 3,
    name: "Rajesh Kumar",
    position: "Head of Design",
    shortDesc: "Product & UX design leader",
    bio: "Rajesh combines design thinking with business strategy. Over 12 years designing digital products for enterprises and startups. Focused on creating intuitive, accessible, and beautiful user experiences that drive business value.",
    photoUrl: "/team/rajesh-kumar.jpg",
    signature: "/team/signatures/rajesh-signature.png",
    email: "rajesh@dhanamitra.com",
    linkedinUrl: "https://linkedin.com/in/rajesh-kumar",
  },
  {
    id: 4,
    name: "Neha Singh",
    position: "Project Director",
    shortDesc: "Strategic project & client success",
    bio: "Neha ensures every project exceeds expectations. With expertise in agile methodologies and stakeholder management, she bridges client vision and team execution. Known for building long-term client partnerships.",
    photoUrl: "/team/neha-singh.jpg",
    signature: "/team/signatures/neha-signature.png",
    email: "neha@dhanamitra.com",
    linkedinUrl: "https://linkedin.com/in/neha-singh",
  },
];

export default async function TeamPage() {
  const members = await getTeamMembers();

  return (
    <main className="team-page">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,600;1,300&family=DM+Sans:wght@300;400;500&display=swap');

        .team-page {
          background: var(--color-bg);
          min-height: 100vh;
        }

        /* ── Hero ── */
        .team-hero {
          position: relative;
          overflow: hidden;
          padding: 100px 0 72px;
          background: var(--color-bg);
        }

        .team-hero-orb1 {
          position: absolute;
          width: 500px;
          height: 500px;
          border-radius: 50%;
          top: -180px;
          right: -80px;
          background: radial-gradient(circle, rgba(153,178,221,0.12) 0%, transparent 65%);
          pointer-events: none;
        }

        .team-hero-orb2 {
          position: absolute;
          width: 320px;
          height: 320px;
          border-radius: 50%;
          bottom: -60px;
          left: 3%;
          background: radial-gradient(circle, rgba(233,175,163,0.08) 0%, transparent 70%);
          pointer-events: none;
        }

        .team-hero-inner {
          position: relative;
          z-index: 1;
          max-width: 680px;
          animation: teamHeroFade 0.8s ease both;
        }

        @keyframes teamHeroFade {
          from { opacity: 0; transform: translateY(18px); }
          to { opacity: 1; transform: translateY(0); }
        }

        .team-eyebrow {
          font-family: 'DM Sans', sans-serif;
          font-size: 10.5px;
          font-weight: 500;
          letter-spacing: 0.22em;
          text-transform: uppercase;
          color: var(--color-primary-2);
          margin-bottom: 16px;
          display: flex;
          align-items: center;
          gap: 10px;
        }

        .team-eyebrow::before {
          content: '';
          width: 28px;
          height: 1px;
          background: var(--color-primary-2);
        }

        .team-h1 {
          font-family: 'Cormorant Garamond', serif;
          font-size: clamp(36px, 6vw, 68px);
          font-weight: 300;
          line-height: 1.08;
          color: var(--color-primary);
          margin: 0 0 20px;
        }

        .team-h1 em {
          font-style: italic;
          color: var(--color-primary-2);
        }

        .team-sub {
          font-family: 'DM Sans', sans-serif;
          font-size: 15px;
          font-weight: 300;
          line-height: 1.75;
          color: var(--color-text-soft);
          margin: 0;
        }

        /* ── Grid Section ── */
        .team-grid-section {
          padding: 80px 0 96px;
          background: var(--color-bg);
        }

        .team-grid {
          display: grid;
          grid-template-columns: 1fr;
          gap: 40px;
          margin-top: 56px;
        }

        @media (min-width: 768px) {
          .team-grid {
            grid-template-columns: repeat(2, 1fr);
          }
        }

        @media (min-width: 1024px) {
          .team-grid {
            grid-template-columns: repeat(2, 1fr);
          }
        }

        /* ── Team Card ── */
        .team-card {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 0;
          border-radius: 24px;
          border: 1px solid rgba(104,80,68,0.09);
          overflow: hidden;
          background: rgba(255,255,255,0.65);
          backdrop-filter: blur(12px);
          transition: transform 0.35s ease, box-shadow 0.35s ease;
        }

        @media (max-width: 767px) {
          .team-card {
            grid-template-columns: 1fr;
          }
        }

        .team-card:hover {
          transform: translateY(-6px);
          box-shadow: 0 24px 56px rgba(58,64,90,0.10);
        }

        .team-card-image {
          position: relative;
          overflow: hidden;
          background: linear-gradient(145deg, rgba(153,178,221,0.15), rgba(233,175,163,0.10));
          min-height: 320px;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .team-card-image img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }

        .team-card-body {
          padding: 40px 36px;
          display: flex;
          flex-direction: column;
          justify-content: space-between;
        }

        .team-card-header {
          margin-bottom: 24px;
        }

        .team-card-name {
          font-family: 'Cormorant Garamond', serif;
          font-size: 32px;
          font-weight: 600;
          line-height: 1.15;
          color: var(--color-primary);
          margin: 0 0 8px;
        }

        .team-card-position {
          font-family: 'DM Sans', sans-serif;
          font-size: 10px;
          font-weight: 500;
          letter-spacing: 0.16em;
          text-transform: uppercase;
          color: var(--color-primary-2);
          margin: 0 0 16px;
        }

        .team-card-short-desc {
          font-family: 'Cormorant Garamond', serif;
          font-size: 18px;
          font-weight: 300;
          font-style: italic;
          color: var(--color-primary-2);
          margin: 0 0 12px;
        }

        .team-card-divider {
          width: 40px;
          height: 1px;
          background: linear-gradient(90deg, var(--color-primary-2), transparent);
          margin-bottom: 20px;
        }

        .team-card-bio {
          font-family: 'DM Sans', sans-serif;
          font-size: 13.5px;
          font-weight: 300;
          line-height: 1.75;
          color: var(--color-text-soft);
          margin: 0 0 24px;
        }

        .team-card-signature {
          height: 50px;
          margin-bottom: 20px;
          opacity: 0.7;
        }

        .team-card-signature img {
          height: 100%;
          object-fit: contain;
        }

        .team-card-footer {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding-top: 24px;
          border-top: 1px solid rgba(104,80,68,0.07);
        }

        .team-card-links {
          display: flex;
          align-items: center;
          gap: 12px;
        }

        .team-social-link {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          width: 36px;
          height: 36px;
          border-radius: 50%;
          border: 1px solid rgba(104,80,68,0.14);
          color: var(--color-primary);
          text-decoration: none;
          transition: background 0.25s ease, border-color 0.25s ease;
          font-size: 16px;
        }

        .team-social-link:hover {
          background: var(--color-primary);
          color: var(--color-surface);
          border-color: var(--color-primary);
        }

        .team-email-link {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          font-family: 'DM Sans', sans-serif;
          font-size: 11.5px;
          font-weight: 500;
          letter-spacing: 0.10em;
          text-transform: uppercase;
          color: var(--color-primary);
          text-decoration: none;
          padding: 8px 12px;
          border: 1px solid rgba(104,80,68,0.14);
          border-radius: 6px;
          transition: background 0.25s ease, border-color 0.25s ease;
        }

        .team-email-link:hover {
          background: rgba(153,178,221,0.10);
          border-color: rgba(153,178,221,0.35);
          color: var(--color-accent-blue);
        }

        .team-resume-link {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          font-family: 'DM Sans', sans-serif;
          font-size: 11.5px;
          font-weight: 500;
          letter-spacing: 0.10em;
          text-transform: uppercase;
          color: var(--color-primary);
          text-decoration: none;
          padding: 8px 12px;
          border: 1px solid rgba(104,80,68,0.14);
          border-radius: 6px;
          transition: background 0.25s ease, border-color 0.25s ease;
        }

        .team-resume-link:hover {
          background: rgba(233,175,163,0.10);
          border-color: rgba(233,175,163,0.35);
          color: var(--color-accent-blush);
        }

        .team-empty {
          text-align: center;
          padding: 80px 20px;
          color: var(--color-text-soft);
          font-family: 'DM Sans', sans-serif;
        }
      `}</style>

      {/* Hero */}
      <section className="team-hero">
        <div className="team-hero-orb1" />
        <div className="team-hero-orb2" />
        <Container>
          <div className="team-hero-inner">
            <p className="team-eyebrow">Meet Our Team</p>
            <h1 className="team-h1">
              Talented professionals dedicated to <em>digital excellence</em>
            </h1>
            <p className="team-sub">
              Our diverse team brings together expertise in web development,
              design, strategy, and business technology. Each member is
              committed to delivering outstanding results for our clients.
            </p>
          </div>
        </Container>
      </section>

      {/* Grid */}
      <section className="team-grid-section">
        <Container>
          {members.length === 0 ? (
            <div className="team-empty">
              <p>No team members to display.</p>
            </div>
          ) : (
            <div className="team-grid">
              {members.map((member) => (
                <Link
                  key={member.id}
                  href={`/team/${member.id}`}
                  style={{ textDecoration: "none" }}
                >
                  <div className="team-card">
                    {/* Image */}
                    <div className="team-card-image">
                      {member.photoUrl ? (
                        <img src={member.photoUrl} alt={member.name} />
                      ) : (
                        <div style={{ fontSize: "64px", opacity: 0.2 }}>👤</div>
                      )}
                    </div>

                    {/* Body */}
                    <div className="team-card-body">
                      <div>
                        <div className="team-card-header">
                          <h2 className="team-card-name">{member.name}</h2>
                          <p className="team-card-position">
                            {member.position}
                          </p>
                          <p className="team-card-short-desc">
                            {member.shortDesc}
                          </p>
                          <div className="team-card-divider" />
                        </div>

                        <p className="team-card-bio">{member.bio}</p>

                        {member.signature && (
                          <div className="team-card-signature">
                            <img
                              src={member.signature}
                              alt={`${member.name} signature`}
                            />
                          </div>
                        )}
                      </div>

                      <div className="team-card-footer">
                        <div className="team-card-links">
                          {member.linkedinUrl && (
                            <a
                              href={member.linkedinUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="team-social-link"
                              title="LinkedIn"
                            >
                              in
                            </a>
                          )}
                          {member.twitterUrl && (
                            <a
                              href={member.twitterUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="team-social-link"
                              title="Twitter"
                            >
                              𝕏
                            </a>
                          )}
                          {member.websiteUrl && (
                            <a
                              href={member.websiteUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="team-social-link"
                              title="Website"
                            >
                              🌐
                            </a>
                          )}
                        </div>

                        <div>
                          {member.resumeUrl && (
                            <a
                              href={member.resumeUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="team-resume-link"
                              style={{ marginLeft: member.email ? "8px" : "0" }}
                            >
                              Resume →
                            </a>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </Container>
      </section>
    </main>
  );
}
