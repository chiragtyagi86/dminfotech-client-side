import Link from "next/link";
import { notFound } from "next/navigation";
import Container from "@/app/components/common/Container";
import { getTeamMemberById, getAllTeamMembers } from "../../../../../lib/team-data";

interface TeamMemberDetailPageProps {
  params: Promise<{ id: string }>;
}

export default async function TeamMemberDetailPage({ params }: TeamMemberDetailPageProps) {
  const { id } = await params;
  const memberId = parseInt(id);

  // Fetch team member from database
  const member = await getTeamMemberById(memberId);

  if (!member) {
    notFound();
  }

  // Fetch all team members to get related ones
  const allMembers = await getAllTeamMembers();
  const relatedMembers = allMembers.filter((m) => m.id !== memberId).slice(0, 3);

  return (
    <main className="team-member-detail-page">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,600;1,300&family=DM+Sans:wght@300;400;500&display=swap');

        .team-member-detail-page {
          background: var(--color-bg);
          min-height: 100vh;
        }

        /* ── Header ── */
        .detail-header {
          padding: 40px 0;
          border-bottom: 1px solid rgba(104,80,68,0.09);
          background: var(--color-bg);
        }

        .detail-header-inner {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 24px;
          flex-wrap: wrap;
        }

        .back-link {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          padding: 10px 16px;
          border-radius: 8px;
          border: 1px solid rgba(104,80,68,0.12);
          background: rgba(255,255,255,0.50);
          font-family: 'DM Sans', sans-serif;
          font-size: 12px;
          font-weight: 500;
          color: var(--color-primary);
          text-decoration: none;
          transition: all 0.3s ease;
        }

        .back-link:hover {
          background: rgba(255,255,255,0.70);
          border-color: rgba(104,80,68,0.20);
        }

        .breadcrumb {
          display: flex;
          align-items: center;
          gap: 8px;
          font-family: 'DM Sans', sans-serif;
          font-size: 12px;
          color: var(--color-text-soft);
        }

        .breadcrumb a {
          color: var(--color-primary);
          text-decoration: none;
          transition: color 0.3s ease;
        }

        .breadcrumb a:hover {
          color: var(--color-primary-2);
        }

        /* ── Hero Section ── */
        .detail-hero {
          padding: 80px 0 60px;
          background: var(--color-bg);
          position: relative;
          overflow: hidden;
        }

        .detail-hero::before {
          content: '';
          position: absolute;
          top: -500px;
          right: -200px;
          width: 800px;
          height: 800px;
          border-radius: 50%;
          background: radial-gradient(circle, rgba(153,178,221,0.08) 0%, transparent 70%);
          pointer-events: none;
          z-index: 0;
        }

        .detail-hero::after {
          content: '';
          position: absolute;
          bottom: -300px;
          left: -100px;
          width: 600px;
          height: 600px;
          border-radius: 50%;
          background: radial-gradient(circle, rgba(233,175,163,0.06) 0%, transparent 70%);
          pointer-events: none;
          z-index: 0;
        }

        .detail-hero-content {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 60px;
          align-items: center;
          position: relative;
          z-index: 1;
        }

        @media (max-width: 1023px) {
          .detail-hero-content {
            grid-template-columns: 1fr;
            gap: 40px;
          }
        }

        .detail-info {
          display: flex;
          flex-direction: column;
          justify-content: space-between;
        }

        .detail-name {
          font-family: 'Cormorant Garamond', serif;
          font-size: clamp(36px, 5vw, 56px);
          font-weight: 600;
          line-height: 1.1;
          color: var(--color-primary);
          margin: 0 0 12px;
        }

        .detail-position {
          font-family: 'DM Sans', sans-serif;
          font-size: 11px;
          font-weight: 500;
          letter-spacing: 0.12em;
          text-transform: uppercase;
          color: var(--color-primary-2);
          margin: 0 0 20px;
        }

        .detail-tagline {
          font-family: 'Cormorant Garamond', serif;
          font-size: 20px;
          font-weight: 300;
          font-style: italic;
          color: var(--color-primary-2);
          margin: 0 0 24px;
          line-height: 1.6;
        }

        .detail-divider {
          width: 60px;
          height: 2px;
          background: linear-gradient(90deg, var(--color-accent-blue), var(--color-accent-blush));
          margin-bottom: 28px;
        }

        .detail-bio {
          font-family: 'DM Sans', sans-serif;
          font-size: 15px;
          font-weight: 300;
          line-height: 1.8;
          color: var(--color-text-soft);
          margin: 0 0 32px;
        }

        .detail-signature {
          height: 60px;
          margin-bottom: 32px;
        }

        .detail-signature img {
          height: 100%;
          object-fit: contain;
          opacity: 0.7;
        }

        .detail-footer {
          display: flex;
          align-items: center;
          gap: 20px;
          padding-top: 28px;
          border-top: 1px solid rgba(104,80,68,0.09);
        }

        .detail-links {
          display: flex;
          align-items: center;
          gap: 12px;
          flex-wrap: wrap;
        }

        .social-link {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          width: 40px;
          height: 40px;
          border-radius: 50%;
          border: 1px solid rgba(104,80,68,0.14);
          color: var(--color-primary);
          text-decoration: none;
          transition: all 0.3s ease;
          font-size: 16px;
        }

        .social-link:hover {
          background: var(--color-primary);
          color: white;
          border-color: var(--color-primary);
          transform: translateY(-3px);
        }

        .contact-link {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          padding: 10px 16px;
          border-radius: 8px;
          border: 1px solid rgba(104,80,68,0.14);
          font-family: 'DM Sans', sans-serif;
          font-size: 11px;
          font-weight: 500;
          letter-spacing: 0.08em;
          text-transform: uppercase;
          color: var(--color-primary);
          text-decoration: none;
          transition: all 0.3s ease;
        }

        .contact-link:hover {
          background: rgba(153,178,221,0.10);
          border-color: rgba(153,178,221,0.35);
          color: var(--color-accent-blue);
        }

        .detail-photo-container {
          position: relative;
          border-radius: 24px;
          overflow: hidden;
          border: 1px solid rgba(104,80,68,0.09);
          background: linear-gradient(145deg, rgba(153,178,221,0.10), rgba(233,175,163,0.08));
          aspect-ratio: 3/4;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .detail-photo-container img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }

        .detail-photo-container::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: linear-gradient(135deg, rgba(153,178,221,0.08) 0%, rgba(233,175,163,0.04) 100%);
          pointer-events: none;
          z-index: 1;
        }

        /* ── Related Team Section ── */
        .related-section {
          padding: 80px 0 96px;
          background: var(--color-bg);
          border-top: 1px solid rgba(104,80,68,0.09);
        }

        .section-title {
          font-family: 'Cormorant Garamond', serif;
          font-size: 36px;
          font-weight: 400;
          color: var(--color-primary);
          margin: 0 0 56px;
        }

        .related-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
          gap: 32px;
        }

        .related-card {
          text-align: center;
          padding: 32px 24px;
          border-radius: 20px;
          border: 1px solid rgba(104,80,68,0.09);
          background: rgba(255,255,255,0.50);
          backdrop-filter: blur(10px);
          transition: all 0.35s ease;
          text-decoration: none;
          cursor: pointer;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 16px;
        }

        .related-card:hover {
          transform: translateY(-8px);
          box-shadow: 0 24px 56px rgba(58,64,90,0.10);
          border-color: rgba(104,80,68,0.20);
        }

        .related-photo {
          width: 120px;
          height: 120px;
          border-radius: 50%;
          overflow: hidden;
          background: linear-gradient(135deg, rgba(153,178,221,0.15), rgba(233,175,163,0.10));
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .related-photo img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }

        .related-name {
          font-family: 'Cormorant Garamond', serif;
          font-size: 18px;
          font-weight: 600;
          color: var(--color-primary);
          margin: 0;
        }

        .related-position {
          font-family: 'DM Sans', sans-serif;
          font-size: 11px;
          font-weight: 500;
          letter-spacing: 0.08em;
          text-transform: uppercase;
          color: var(--color-primary-2);
          margin: 0;
        }
      `}</style>

      {/* Header */}
      <section className="detail-header">
        <Container>
          <div className="detail-header-inner">
            <Link href="/team" className="back-link">
              ← Back to Team
            </Link>
            <div className="breadcrumb">
              <Link href="/">Home</Link>
              <span>/</span>
              <Link href="/team">Team</Link>
              <span>/</span>
              <span>{member.name}</span>
            </div>
          </div>
        </Container>
      </section>

      {/* Hero Section */}
      <section className="detail-hero">
        <Container>
          <div className="detail-hero-content">
            {/* Left Side - Details */}
            <div className="detail-info">
              <div>
                <h1 className="detail-name">{member.name}</h1>
                <p className="detail-position">{member.position}</p>
                <p className="detail-tagline">{member.shortDesc}</p>
                <div className="detail-divider" />
                <p className="detail-bio">{member.bio}</p>
                {member.signature && (
                  <div className="detail-signature">
                    <img src={member.signature} alt={`${member.name} signature`} />
                  </div>
                )}
              </div>

              <div className="detail-footer">
                <div className="detail-links">
                  {member.linkedinUrl && (
                    <a 
                      href={member.linkedinUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="social-link"
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
                      className="social-link"
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
                      className="social-link"
                      title="Website"
                    >
                      🌐
                    </a>
                  )}
                  {member.email && (
                    <a 
                      href={`mailto:${member.email}`}
                      className="contact-link"
                    >
                      Email →
                    </a>
                  )}
                </div>
              </div>
            </div>

            {/* Right Side - Photo */}
            <div className="detail-photo-container">
              {member.photoUrl ? (
                <img src={member.photoUrl} alt={member.name} />
              ) : (
                <div style={{ fontSize: "80px", opacity: 0.2 }}>👤</div>
              )}
            </div>
          </div>
        </Container>
      </section>

      {/* Related Team Section */}
      {relatedMembers.length > 0 && (
        <section className="related-section">
          <Container>
            <h2 className="section-title">Meet Other Team Members</h2>
            <div className="related-grid">
              {relatedMembers.map((teammate) => (
                <Link 
                  key={teammate.id}
                  href={`/team/${teammate.id}`}
                  className="related-card"
                >
                  <div className="related-photo">
                    {teammate.photoUrl ? (
                      <img src={teammate.photoUrl} alt={teammate.name} />
                    ) : (
                      <div style={{ fontSize: "48px", opacity: 0.2 }}>👤</div>
                    )}
                  </div>
                  <p className="related-name">{teammate.name}</p>
                  <p className="related-position">{teammate.position}</p>
                </Link>
              ))}
            </div>
          </Container>
        </section>
      )}
    </main>
  );
}