// src/components/contact/ContactPage.jsx
import { useState } from "react";
import { Link } from "react-router-dom";
import Container from "../common/Container";
import { api } from "../../lib/api";
import { useSiteConfig } from "../../context/SiteConfigContext";

const services = [
  "Website Development",
  "Custom Software",
  "IT Placements",
  "Research Journal Publishing",
  "Stock Market Training",
  "Digital Strategy & SEO",
  "Brand Support",
  "Other / Not Sure",
];

export default function ContactPage() {
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
    const {siteConfig} = useSiteConfig();
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    service: "",
    message: "",
  });

  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    if (error) setError(null);
  };

  const handleSubmit = async () => {
    if (!form.name.trim() || !form.email.trim() || !form.message.trim()) {
      setError("Please fill in your name, email, and message.");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      await api.submitLead({
        name: form.name.trim(),
        email: form.email.trim(),
        phone: form.phone.trim(),
        inquiryType: form.service,
        service: form.service,
        message: form.message.trim(),
        sourcePage: "/contact",
      });

      setSubmitted(true);
    } catch (err) {
      setError(err?.message || "Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main>
      <style>{`
        .contact-page { background: var(--color-bg); min-height: 100vh; }

        .contact-hero {
          position: relative;
          overflow: hidden;
          padding: 120px 0 80px;
          background: var(--color-bg);
        }

        .contact-orb1 {
          position: absolute;
          width: 600px;
          height: 600px;
          border-radius: 50%;
          top: -220px;
          right: -160px;
          background: radial-gradient(circle, rgba(153,178,221,0.16) 0%, transparent 65%);
          pointer-events: none;
        }

        .contact-orb2 {
          position: absolute;
          width: 350px;
          height: 350px;
          border-radius: 50%;
          bottom: -80px;
          left: -60px;
          background: radial-gradient(circle, rgba(233,175,163,0.13) 0%, transparent 70%);
          pointer-events: none;
        }

        .contact-hero-grid {
          position: absolute;
          inset: 0;
          background-image:
            linear-gradient(rgba(58,64,90,0.035) 1px, transparent 1px),
            linear-gradient(90deg, rgba(58,64,90,0.035) 1px, transparent 1px);
          background-size: 64px 64px;
          mask-image: radial-gradient(ellipse 50% 80% at 20% 50%, black 10%, transparent 100%);
          -webkit-mask-image: radial-gradient(ellipse 50% 80% at 20% 50%, black 10%, transparent 100%);
          pointer-events: none;
        }

        .contact-hero-inner {
          position: relative;
          z-index: 1;
          max-width: 680px;
          animation: ctFadeUp 0.8s ease both;
        }

        .contact-eyebrow {
          display: inline-flex;
          align-items: center;
          gap: 10px;
          padding: 5px 16px 5px 8px;
          border-radius: 100px;
          border: 1px solid rgba(104,80,68,0.14);
          background: rgba(255,255,255,0.55);
          backdrop-filter: blur(8px);
          margin-bottom: 24px;
        }

        .contact-eyebrow-dot {
          width: 22px;
          height: 22px;
          border-radius: 50%;
          background: var(--color-primary);
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .contact-eyebrow-dot::after {
          content: '';
          width: 7px;
          height: 7px;
          border-radius: 50%;
          background: var(--color-surface, #fff);
        }

        .contact-eyebrow-text {
          font-family: 'DM Sans', sans-serif;
          font-size: 11px;
          font-weight: 500;
          letter-spacing: 0.16em;
          text-transform: uppercase;
          color: var(--color-primary-2);
        }

        .contact-h1 {
          font-family: 'Cormorant Garamond', serif;
          font-size: clamp(40px, 6.5vw, 80px);
          font-weight: 300;
          line-height: 1.07;
          color: var(--color-primary);
          margin: 0 0 20px;
          animation: ctFadeUp 0.85s ease 0.1s both;
        }

        .contact-h1 em {
          font-style: italic;
          color: var(--color-primary-2);
        }

        .contact-hero-desc {
          font-family: 'DM Sans', sans-serif;
          font-size: 16px;
          font-weight: 300;
          line-height: 1.80;
          color: var(--color-text-soft);
          max-width: 500px;
          margin: 0;
          animation: ctFadeUp 0.85s ease 0.2s both;
        }

        @keyframes ctFadeUp {
          from { opacity: 0; transform: translateY(20px); }
          to   { opacity: 1; transform: translateY(0); }
        }

        .contact-layout {
          padding: 0 0 96px;
          background: var(--color-bg-soft);
          position: relative;
        }

        .contact-layout::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          height: 1px;
          background: linear-gradient(90deg, transparent, rgba(104,80,68,0.10), transparent);
        }

        .contact-grid {
          display: grid;
          grid-template-columns: 1fr;
          gap: 40px;
          padding-top: 64px;
        }

        @media (min-width: 1024px) {
          .contact-grid {
            grid-template-columns: 1fr 1.4fr;
            gap: 64px;
            align-items: start;
          }
        }

        .contact-info {
          display: flex;
          flex-direction: column;
          gap: 16px;
        }

        .contact-info-heading {
          font-family: 'Cormorant Garamond', serif;
          font-size: 26px;
          font-weight: 300;
          color: var(--color-primary);
          margin: 0 0 8px;
        }

        .contact-info-sub {
          font-family: 'DM Sans', sans-serif;
          font-size: 13.5px;
          font-weight: 300;
          line-height: 1.75;
          color: var(--color-text-soft);
          margin: 0 0 28px;
        }

        .contact-detail {
          display: flex;
          gap: 14px;
          align-items: flex-start;
          padding: 16px 18px;
          border-radius: 14px;
          border: 1px solid rgba(104,80,68,0.08);
          background: rgba(255,255,255,0.60);
          backdrop-filter: blur(8px);
          text-decoration: none;
          transition: transform 0.25s ease, box-shadow 0.25s ease;
        }

        .contact-detail:hover {
          transform: translateX(4px);
          box-shadow: 0 8px 24px rgba(58,64,90,0.08);
        }

        .contact-detail-icon {
          width: 38px;
          height: 38px;
          border-radius: 10px;
          background: linear-gradient(135deg, rgba(153,178,221,0.20), rgba(233,175,163,0.14));
          border: 1px solid rgba(104,80,68,0.10);
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
          transition: background 0.3s ease;
        }

        .contact-detail:hover .contact-detail-icon {
          background: var(--color-primary);
        }

        .contact-detail-icon svg {
          width: 17px;
          height: 17px;
          stroke: var(--color-primary);
          stroke-width: 1.5;
          fill: none;
          transition: stroke 0.3s ease;
        }

        .contact-detail:hover .contact-detail-icon svg {
          stroke: var(--color-surface, #fff);
        }

        .contact-detail-label {
          font-family: 'DM Sans', sans-serif;
          font-size: 10px;
          font-weight: 500;
          letter-spacing: 0.14em;
          text-transform: uppercase;
          color: var(--color-text-soft);
          margin: 0 0 3px;
        }

        .contact-detail-value {
          font-family: 'DM Sans', sans-serif;
          font-size: 13.5px;
          font-weight: 400;
          color: var(--color-primary);
          margin: 0;
          line-height: 1.4;
        }

        .contact-wa {
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 14px 20px;
          border-radius: 14px;
          background: #25D366;
          border: none;
          text-decoration: none;
          cursor: pointer;
          transition: opacity 0.25s ease, transform 0.25s ease;
          margin-top: 4px;
        }

        .contact-wa:hover {
          opacity: 0.90;
          transform: translateX(4px);
        }

        .contact-wa-icon {
          width: 32px;
          height: 32px;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .contact-wa-icon svg {
          width: 22px;
          height: 22px;
          fill: white;
        }

        .contact-wa-label {
          font-family: 'DM Sans', sans-serif;
          font-size: 13.5px;
          font-weight: 500;
          color: white;
          margin: 0;
        }

        .contact-wa-sub {
          font-family: 'DM Sans', sans-serif;
          font-size: 11px;
          font-weight: 300;
          color: rgba(255,255,255,0.75);
          margin-top: 1px;
        }

        .contact-form-card {
          border-radius: 24px;
          border: 1px solid rgba(104,80,68,0.09);
          background: rgba(255,255,255,0.70);
          backdrop-filter: blur(14px);
          padding: 40px 36px;
          box-shadow: 0 8px 40px rgba(58,64,90,0.06);
        }

        .form-heading {
          font-family: 'Cormorant Garamond', serif;
          font-size: 24px;
          font-weight: 600;
          color: var(--color-primary);
          margin: 0 0 6px;
        }

        .form-subheading {
          font-family: 'DM Sans', sans-serif;
          font-size: 13px;
          font-weight: 300;
          color: var(--color-text-soft);
          margin: 0 0 32px;
        }

        .form-row {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 16px;
          margin-bottom: 16px;
        }

        @media (max-width: 600px) {
          .form-row {
            grid-template-columns: 1fr;
          }
        }

        .form-group {
          display: flex;
          flex-direction: column;
          gap: 6px;
          margin-bottom: 16px;
        }

        .form-row .form-group {
          margin-bottom: 0;
        }

        .form-label {
          font-family: 'DM Sans', sans-serif;
          font-size: 10.5px;
          font-weight: 500;
          letter-spacing: 0.12em;
          text-transform: uppercase;
          color: var(--color-primary-2);
        }

        .form-input,
        .form-select,
        .form-textarea {
          padding: 12px 16px;
          border-radius: 10px;
          border: 1px solid rgba(104,80,68,0.14);
          background: rgba(255,255,255,0.80);
          font-family: 'DM Sans', sans-serif;
          font-size: 14px;
          font-weight: 300;
          color: var(--color-primary);
          outline: none;
          transition: border-color 0.25s ease, box-shadow 0.25s ease;
          width: 100%;
          box-sizing: border-box;
          appearance: none;
        }

        .form-input::placeholder,
        .form-textarea::placeholder {
          color: rgba(104,80,68,0.35);
        }

        .form-input:focus,
        .form-select:focus,
        .form-textarea:focus {
          border-color: var(--color-accent-blue);
          box-shadow: 0 0 0 3px rgba(153,178,221,0.15);
        }

        .form-textarea {
          resize: vertical;
          min-height: 120px;
        }

        .form-error {
          display: flex;
          align-items: center;
          gap: 10px;
          background: #fef2f2;
          border: 1px solid rgba(220,38,38,0.20);
          border-radius: 10px;
          padding: 12px 16px;
          margin-bottom: 16px;
          font-family: 'DM Sans', sans-serif;
          font-size: 13px;
          color: #dc2626;
        }

        .form-submit {
          width: 100%;
          padding: 14px 24px;
          border: none;
          border-radius: 10px;
          background: var(--color-btn-primary, var(--color-primary));
          color: var(--color-btn-primary-text, #fff);
          font-family: 'DM Sans', sans-serif;
          font-size: 13px;
          font-weight: 500;
          letter-spacing: 0.10em;
          text-transform: uppercase;
          cursor: pointer;
          margin-top: 8px;
          position: relative;
          overflow: hidden;
          transition: transform 0.3s ease, box-shadow 0.3s ease, opacity 0.2s ease;
        }

        .form-submit:disabled {
          opacity: 0.65;
          cursor: not-allowed;
        }

        .form-submit::before {
          content: '';
          position: absolute;
          inset: 0;
          background: linear-gradient(135deg, rgba(153,178,221,0.15), transparent 60%);
          opacity: 0;
          transition: opacity 0.3s ease;
        }

        .form-submit:hover:not(:disabled)::before {
          opacity: 1;
        }

        .form-submit:hover:not(:disabled) {
          transform: translateY(-1px);
          box-shadow: 0 8px 28px rgba(58,64,90,0.20);
        }

        .form-note {
          font-family: 'DM Sans', sans-serif;
          font-size: 11.5px;
          font-weight: 300;
          color: var(--color-text-soft);
          text-align: center;
          margin-top: 14px;
          line-height: 1.6;
        }

        .form-success {
          text-align: center;
          padding: 48px 24px;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 16px;
        }

        .form-success-icon {
          width: 56px;
          height: 56px;
          border-radius: 50%;
          background: linear-gradient(135deg, var(--color-accent-blue), var(--color-accent-blush));
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .form-success-icon svg {
          width: 26px;
          height: 26px;
          stroke: white;
          stroke-width: 2;
          fill: none;
        }

        .form-success-title {
          font-family: 'Cormorant Garamond', serif;
          font-size: 28px;
          font-weight: 600;
          color: var(--color-primary);
          margin: 0;
        }

        .form-success-desc {
          font-family: 'DM Sans', sans-serif;
          font-size: 14px;
          font-weight: 300;
          color: var(--color-text-soft);
          margin: 0;
          max-width: 360px;
          line-height: 1.75;
        }

        .form-success-link {
          font-family: 'DM Sans', sans-serif;
          font-size: 12.5px;
          font-weight: 500;
          letter-spacing: 0.10em;
          text-transform: uppercase;
          color: var(--color-primary);
          text-decoration: none;
          margin-top: 8px;
        }

        @media (max-width: 767px) {
          .contact-hero {
            padding: 92px 0 64px;
          }

          .contact-h1 {
            font-size: clamp(34px, 10vw, 56px);
          }

          .contact-hero-desc {
            font-size: 14px;
          }

          .contact-layout {
            padding-bottom: 80px;
          }

          .contact-grid {
            padding-top: 48px;
          }

          .contact-form-card {
            padding: 28px 20px;
          }
        }
      `}</style>

      <div className="contact-page">
        <section className="contact-hero">
          <div className="contact-orb1" />
          <div className="contact-orb2" />
          <div className="contact-hero-grid" />

          <Container>
            <div className="contact-hero-inner">
              <div>
                <div className="contact-eyebrow">
                  <span className="contact-eyebrow-dot" />
                  <span className="contact-eyebrow-text">Get In Touch</span>
                </div>
              </div>

              <h1 className="contact-h1">
                Let's build something
                <br />
                <em>worth noticing</em>
              </h1>

              <p className="contact-hero-desc">
                Tell us about your project. We'll respond within one business day
                with clarity, honesty and a clear path forward.
              </p>
            </div>
          </Container>
        </section>

        <section className="contact-layout">
          <Container>
            <div className="contact-grid">
              <div className="contact-info">
                <h2 className="contact-info-heading">We'd love to hear from you</h2>
                <p className="contact-info-sub">
                  Whether you have a clear brief or just an early idea — reach out.
                  Every engagement starts with a conversation.
                </p>

                <a href={`mailto:${siteConfig.contactEmail}`} className="contact-detail">
                  <div className="contact-detail-icon">
                    <svg viewBox="0 0 24 24">
                      <rect x="2" y="4" width="20" height="16" rx="2" />
                      <polyline points="2,4 12,13 22,4" />
                    </svg>
                  </div>
                  <div>
                    <p className="contact-detail-label">Email</p>
                    <p className="contact-detail-value">{siteConfig.contactEmail}</p>
                  </div>
                </a>

                <a href={`tel:${siteConfig.phone}`} className="contact-detail">
                  <div className="contact-detail-icon">
                    <svg viewBox="0 0 24 24">
                      <path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07A19.5 19.5 0 013.07 8.81 19.79 19.79 0 01.27 2.18 2 2 0 012.24.18h3a2 2 0 012 1.72c.127.96.361 1.903.7 2.81a2 2 0 01-.45 2.11L6.91 7.91a16 16 0 006.72 6.72l1.39-1.39a2 2 0 012.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0122 16.92z" />
                    </svg>
                  </div>
                  <div>
                    <p className="contact-detail-label">Phone</p>
                    <p className="contact-detail-value">{siteConfig.phone}</p>
                  </div>
                </a>

                <div className="contact-detail" style={{ cursor: "default" }}>
                  <div className="contact-detail-icon">
                    <svg viewBox="0 0 24 24">
                      <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z" />
                      <circle cx="12" cy="9" r="2.5" />
                    </svg>
                  </div>
                  <div>
                    <p className="contact-detail-label">Address</p>
                    <p className="contact-detail-value">{siteConfig.address}</p>
                  </div>
                </div>

                <a
                  href={`https://wa.me/${String(siteConfig.phone || "").replace(/\D/g, "")}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="contact-wa"
                >
                  <div className="contact-wa-icon">
                    <svg viewBox="0 0 24 24">
                      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                    </svg>
                  </div>
                  <div>
                    <p className="contact-wa-label">Chat on WhatsApp</p>
                    <p className="contact-wa-sub">Usually responds within an hour</p>
                  </div>
                </a>
              </div>

              <div className="contact-form-card">
                {!submitted ? (
                  <>
                    <h2 className="form-heading">Send us a message</h2>
                    <p className="form-subheading">
                      Fill in the details below and we'll be in touch shortly.
                    </p>

                    {error && (
                      <div className="form-error">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <circle cx="12" cy="12" r="10" />
                          <line x1="12" y1="8" x2="12" y2="12" />
                          <line x1="12" y1="16" x2="12.01" y2="16" />
                        </svg>
                        {error}
                      </div>
                    )}

                    <div className="form-row">
                      <div className="form-group">
                        <label className="form-label">Full Name *</label>
                        <input
                          name="name"
                          value={form.name}
                          onChange={handleChange}
                          className="form-input"
                          placeholder="Your full name"
                        />
                      </div>

                      <div className="form-group">
                        <label className="form-label">Email Address *</label>
                        <input
                          name="email"
                          type="email"
                          value={form.email}
                          onChange={handleChange}
                          className="form-input"
                          placeholder="your@email.com"
                        />
                      </div>
                    </div>

                    <div className="form-row">
                      <div className="form-group">
                        <label className="form-label">Phone Number</label>
                        <input
                          name="phone"
                          value={form.phone}
                          onChange={handleChange}
                          className="form-input"
                          placeholder="+91 XXXXX XXXXX"
                        />
                      </div>

                      <div className="form-group">
                        <label className="form-label">Service Needed</label>
                        <select
                          name="service"
                          value={form.service}
                          onChange={handleChange}
                          className="form-select"
                        >
                          <option value="">Select a service…</option>
                          {services.map((s) => (
                            <option key={s} value={s}>
                              {s}
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>

                    <div className="form-group">
                      <label className="form-label">Tell Us About Your Project *</label>
                      <textarea
                        name="message"
                        value={form.message}
                        onChange={handleChange}
                        className="form-textarea"
                        placeholder="Briefly describe what you're looking to build, achieve or solve. No need for a polished brief — just tell us what's on your mind."
                      />
                    </div>

                    <button className="form-submit" onClick={handleSubmit} disabled={loading}>
                      {loading ? "Sending…" : "Send Message →"}
                    </button>

                    <p className="form-note">
                      We respond within 1 business day. Your information is kept strictly confidential.
                    </p>
                  </>
                ) : (
                  <div className="form-success">
                    <div className="form-success-icon">
                      <svg viewBox="0 0 24 24">
                        <polyline points="20,6 9,17 4,12" />
                      </svg>
                    </div>

                    <h3 className="form-success-title">Message received</h3>

                    <p className="form-success-desc">
                      Thank you for reaching out. We'll review your message and get back
                      to you within one business day.
                    </p>

                    <Link to="/services" className="form-success-link">
                      Explore our services →
                    </Link>
                  </div>
                )}
              </div>
            </div>
          </Container>
        </section>
      </div>
    </main>
  );
}