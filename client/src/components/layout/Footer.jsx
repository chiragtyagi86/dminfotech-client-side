// src/components/layout/Footer.jsx
import { Link } from "react-router-dom";
import Container from "../common/Container";
import { useSiteConfig } from "../../context/SiteConfigContext";



const FacebookIcon = ({ size = 16 }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
  >
    <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
  </svg>
);

const LinkedinIcon = ({ size = 16 }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
  >
    <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
    <rect x="2" y="9" width="4" height="12" />
    <circle cx="4" cy="4" r="2" />
  </svg>
);

const InstagramIcon = ({ size = 16 }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
  >
    <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
    <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
  </svg>
);

const TwitterIcon = ({ size = 16 }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
  >
    <path d="M4 4l16 16M4 20L20 4" />
  </svg>
);

const YoutubeIcon = ({ size = 16 }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
  >
    <path d="M22.54 6.42a2.78 2.78 0 0 0-1.95-1.96C18.88 4 12 4 12 4s-6.88 0-8.59.46A2.78 2.78 0 0 0 1.46 6.42 29 29 0 0 0 1 12a29 29 0 0 0 .46 5.58 2.78 2.78 0 0 0 1.95 1.96C5.12 20 12 20 12 20s6.88 0 8.59-.46a2.78 2.78 0 0 0 1.95-1.96A29 29 0 0 0 23 12a29 29 0 0 0-.46-5.58z" />
    <polygon points="9.75 15.02 15.5 12 9.75 8.98 9.75 15.02" />
  </svg>
);

export default function Footer() {
  const {siteConfig} = useSiteConfig();
  return (
    <footer className="footer-root">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400&family=DM+Sans:wght@300;400;500&display=swap');

        .footer-root {
          background: var(--color-primary);
          position: relative;
          overflow: hidden;
        }

        .footer-root::before {
          content: '';
          position: absolute;
          inset: 0;
          background-image:
            linear-gradient(rgba(255,250,247,0.03) 1px, transparent 1px),
            linear-gradient(90deg, rgba(255,250,247,0.03) 1px, transparent 1px);
          background-size: 56px 56px;
          pointer-events: none;
        }

        .footer-orb {
          position: absolute;
          border-radius: 50%;
          pointer-events: none;
          filter: blur(80px);
        }

        .footer-orb-1 {
          width: 400px;
          height: 400px;
          bottom: -150px;
          left: -100px;
          background: radial-gradient(circle, rgba(153,178,221,0.10) 0%, transparent 70%);
        }

        .footer-orb-2 {
          width: 300px;
          height: 300px;
          top: -100px;
          right: -60px;
          background: radial-gradient(circle, rgba(233,175,163,0.08) 0%, transparent 70%);
        }

        .footer-top-rule {
          height: 1px;
          background: linear-gradient(90deg, transparent, rgba(249,222,201,0.18), transparent);
        }

        .footer-inner {
          position: relative;
          z-index: 1;
          padding: 64px 0 0;
        }

        .footer-grid {
          display: grid;
          grid-template-columns: 1fr;
          gap: 48px;
        }

        @media (min-width: 768px) {
          .footer-grid {
            grid-template-columns: 1.8fr 1fr 1fr;
            gap: 56px;
          }
        }

        .footer-brand-logo {
          margin-bottom: 20px;
          display: inline-block;
          text-decoration: none;
        }

        .footer-brand-logo img {
          display: block;
          width: 260px;
          height: auto;
          filter: brightness(0) invert(1);
          opacity: 0.85;
        }

        .footer-brand-desc {
          font-family: 'DM Sans', sans-serif;
          font-size: 13px;
          font-weight: 300;
          line-height: 1.80;
          color: rgba(249,222,201,0.55);
          max-width: 340px;
          margin: 0 0 28px;
        }

        .footer-iso-badge {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          border: 1px solid rgba(249,222,201,0.14);
          border-radius: 8px;
          padding: 8px 14px;
          width: fit-content;
        }

        .footer-iso-dot {
          width: 6px;
          height: 6px;
          border-radius: 50%;
          background: var(--color-accent-blush);
        }

        .footer-iso-text {
          font-family: 'DM Sans', sans-serif;
          font-size: 10.5px;
          font-weight: 500;
          letter-spacing: 0.12em;
          text-transform: uppercase;
          color: rgba(249,222,201,0.50);
        }

        .footer-socials {
          display: flex;
          align-items: center;
          gap: 14px;
          margin-top: 24px;
        }

        .footer-social-link {
          width: 36px;
          height: 36px;
          border-radius: 8px;
          border: 1px solid rgba(249,222,201,0.12);
          display: flex;
          align-items: center;
          justify-content: center;
          color: rgba(249,222,201,0.65);
          transition: all 0.25s ease;
          text-decoration: none;
        }

        .footer-social-link:hover {
          background: rgba(249,222,201,0.08);
          color: var(--color-surface);
          transform: translateY(-1px);
        }

        .footer-col-heading {
          font-family: 'DM Sans', sans-serif;
          font-size: 10px;
          font-weight: 500;
          letter-spacing: 0.20em;
          text-transform: uppercase;
          color: rgba(249,222,201,0.40);
          margin-bottom: 20px;
          display: flex;
          align-items: center;
          gap: 10px;
        }

        .footer-col-heading::after {
          content: '';
          flex: 1;
          height: 1px;
          background: rgba(249,222,201,0.08);
        }

        .footer-links {
          display: flex;
          flex-direction: column;
          gap: 4px;
        }

        .footer-link {
          font-family: 'DM Sans', sans-serif;
          font-size: 13.5px;
          font-weight: 300;
          color: rgba(249,222,201,0.60);
          text-decoration: none;
          padding: 7px 0;
          border-bottom: 1px solid rgba(249,222,201,0.05);
          display: flex;
          align-items: center;
          justify-content: space-between;
          transition: color 0.25s ease, padding-left 0.25s ease;
        }

        .footer-link:hover {
          color: var(--color-surface);
          padding-left: 5px;
        }

        .footer-contact-item {
          display: flex;
          align-items: flex-start;
          gap: 10px;
          padding: 8px 0;
          border-bottom: 1px solid rgba(249,222,201,0.05);
        }

        .footer-contact-text {
          font-family: 'DM Sans', sans-serif;
          font-size: 13px;
          font-weight: 300;
          line-height: 1.65;
          color: rgba(249,222,201,0.55);
          margin: 0;
        }

        .footer-contact-text a {
          color: inherit;
          text-decoration: none;
        }

        .footer-contact-text a:hover {
          color: var(--color-surface);
        }

        .footer-bottom {
          margin-top: 56px;
          padding: 20px 0;
          border-top: 1px solid rgba(249,222,201,0.07);
          display: flex;
          align-items: center;
          justify-content: space-between;
          flex-wrap: wrap;
          gap: 12px;
        }

        .footer-copyright {
          font-family: 'DM Sans', sans-serif;
          font-size: 12px;
          font-weight: 300;
          color: rgba(249,222,201,0.30);
        }

        .footer-tagline {
          font-family: 'Cormorant Garamond', serif;
          font-size: 13px;
          font-weight: 300;
          font-style: italic;
          color: rgba(249,222,201,0.25);
        }
      `}</style>

      <div className="footer-orb footer-orb-1" />
      <div className="footer-orb footer-orb-2" />
      <div className="footer-top-rule" />

      <Container>
        <div className="footer-inner">
          <div className="footer-grid">
            <div>
              <Link to="/" className="footer-brand-logo">
                <img src="/logo.svg" alt={siteConfig.name} />
              </Link>

              <p className="footer-brand-desc">
                {siteConfig.footerDescription}
              </p>

              <div className="footer-iso-badge">
                <span className="footer-iso-dot" />
                <span className="footer-iso-text">ISO 9001:2015 Certified</span>
              </div>

              <div className="footer-socials">
                {siteConfig.facebookUrl && (
                  <a
                    href={siteConfig.facebookUrl}
                    className="footer-social-link"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <FacebookIcon />
                  </a>
                )}

                {siteConfig.linkedinUrl && (
                  <a
                    href={siteConfig.linkedinUrl}
                    className="footer-social-link"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <LinkedinIcon />
                  </a>
                )}

                {siteConfig.instagramUrl && (
                  <a
                    href={siteConfig.instagramUrl}
                    className="footer-social-link"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <InstagramIcon />
                  </a>
                )}

                {siteConfig.twitterUrl && (
                  <a
                    href={siteConfig.twitterUrl}
                    className="footer-social-link"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <TwitterIcon />
                  </a>
                )}

                {siteConfig.youtubeUrl && (
                  <a
                    href={siteConfig.youtubeUrl}
                    className="footer-social-link"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <YoutubeIcon />
                  </a>
                )}
              </div>
            </div>

            <div>
              <div className="footer-col-heading">Quick Links</div>
              <div className="footer-links">
                {siteConfig.navLinks.map((link) => (
                  <Link key={link.href} to={link.href} className="footer-link">
                    {link.label}
                  </Link>
                ))}
                <Link to="/careers" className="footer-link">
                  Career Opportunities
                </Link>
              </div>
            </div>

            <div>
              <div className="footer-col-heading">Contact</div>

              <div className="footer-contact-item">
                <p className="footer-contact-text">
                  <a href={`mailto:${siteConfig.contactEmail}`}>
                    {siteConfig.contactEmail}
                  </a>
                </p>
              </div>

              <div className="footer-contact-item">
                <p className="footer-contact-text">
                  <a href={`tel:${siteConfig.phone}`}>{siteConfig.phone}</a>
                </p>
              </div>

              <div className="footer-contact-item">
                <p className="footer-contact-text">{siteConfig.address}</p>
              </div>
            </div>
          </div>

          <div className="footer-bottom">
            <p className="footer-copyright">
              © {new Date().getFullYear()} {siteConfig.name} {siteConfig.copyrightText ? `- ${siteConfig.copyrightText}` : ""}
            </p>
            <span className="footer-tagline">{siteConfig.siteTagline}</span>
          </div>
        </div>
      </Container>
    </footer>
  );
}