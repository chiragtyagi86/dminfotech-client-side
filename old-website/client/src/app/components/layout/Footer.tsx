import Link from "next/link";
import Image from "next/image";
import Container from "@/app/components/common/Container";
import { siteConfig } from "../../../../lib/site";
import { Facebook, Linkedin, Instagram, Twitter, Youtube } from "lucide-react";

export default function Footer() {
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
              <div className="footer-brand-logo">
                <Image
                  src="/logo.svg"
                  alt={siteConfig.name}
                  width={160}
                  height={46}
                  style={{ filter: "brightness(0) invert(1)", opacity: 0.85 }}
                />
              </div>

              <p className="footer-brand-desc">
                ISO 9001:2015 certified company delivering website development,
                software solutions, digital transformation services, and
                strategic business support with a premium user-first approach.
              </p>

              <div className="footer-iso-badge">
                <span className="footer-iso-dot" />
                <span className="footer-iso-text">ISO 9001:2015 Certified</span>
              </div>

              <div className="footer-socials">

                {siteConfig.facebookUrl && (
                  <Link href={siteConfig.facebookUrl} className="footer-social-link" target="_blank">
                    <Facebook size={16} />
                  </Link>
                )}

                {siteConfig.linkedinUrl && (
                  <Link href={siteConfig.linkedinUrl} className="footer-social-link" target="_blank">
                    <Linkedin size={16} />
                  </Link>
                )}

                {siteConfig.instagramUrl && (
                  <Link href={siteConfig.instagramUrl} className="footer-social-link" target="_blank">
                    <Instagram size={16} />
                  </Link>
                )}

                {siteConfig.twitterUrl && (
                  <Link href={siteConfig.twitterUrl} className="footer-social-link" target="_blank">
                    <Twitter size={16} />
                  </Link>
                )}

                {siteConfig.youtubeUrl && (
                  <Link href={siteConfig.youtubeUrl} className="footer-social-link" target="_blank">
                    <Youtube size={16} />
                  </Link>
                )}

              </div>
            </div>

            <div>
              <div className="footer-col-heading">Quick Links</div>
              <div className="footer-links">
                {siteConfig.navLinks.map((link) => (
                  <Link key={link.href} href={link.href} className="footer-link">
                    {link.label}
                  </Link>
                ))}
              </div>
            </div>

            <div>
              <div className="footer-col-heading">Contact</div>

              <div className="footer-contact-item">
                <p className="footer-contact-text">{siteConfig.contactEmail}</p>
              </div>

              <div className="footer-contact-item">
                <p className="footer-contact-text">{siteConfig.phone}</p>
              </div>

              <div className="footer-contact-item">
                <p className="footer-contact-text">{siteConfig.address}</p>
              </div>

            </div>

          </div>

          <div className="footer-bottom">
            <p className="footer-copyright">
              © {new Date().getFullYear()} {siteConfig.name}. All rights reserved.
            </p>
            <span className="footer-tagline">{siteConfig.siteTagline}</span>
          </div>

        </div>
      </Container>
    </footer>
  );
}