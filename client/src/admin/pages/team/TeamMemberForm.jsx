// pages/team/TeamMemberForm.jsx
import { useEffect, useState } from "react";

export default function TeamMemberForm({
  initialData,
  onSubmit,
  onCancel,
  isLoading = false,
  isEdit = false,
}) {
  const [formData, setFormData] = useState({
    name: "",
    position: "",
    bio: "",
    shortDesc: "",
    email: "",
    phone: "",
    linkedinUrl: "",
    twitterUrl: "",
    websiteUrl: "",
    resumeUrl: "",
  });

  const [photoFile, setPhotoFile] = useState(null);
  const [photoPreview, setPhotoPreview] = useState("");
  const [signatureFile, setSignatureFile] = useState(null);
  const [signaturePreview, setSignaturePreview] = useState("");
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (!initialData) return;

    setFormData({
      name: initialData.name || "",
      position: initialData.position || "",
      bio: initialData.bio || "",
      shortDesc: initialData.shortDesc || initialData.short_desc || "",
      email: initialData.email || "",
      phone: initialData.phone || "",
      linkedinUrl: initialData.linkedinUrl || initialData.linkedin_url || "",
      twitterUrl: initialData.twitterUrl || initialData.twitter_url || "",
      websiteUrl: initialData.websiteUrl || initialData.website_url || "",
      resumeUrl: initialData.resumeUrl || initialData.resume_url || "",
    });

    setPhotoPreview(initialData.photoUrl || initialData.photo_url || "");
    setSignaturePreview(initialData.signature || "");
    setPhotoFile(null);
    setSignatureFile(null);
  }, [initialData]);

  function updateField(key, value) {
    setFormData((prev) => ({ ...prev, [key]: value }));
  }

  function handlePhotoSelect(e) {
    const file = e.target.files?.[0];
    if (!file) return;

    setPhotoFile(file);

    const reader = new FileReader();
    reader.onload = (ev) => {
      setPhotoPreview(ev.target?.result || "");
    };
    reader.readAsDataURL(file);
  }

  function handleSignatureSelect(e) {
    const file = e.target.files?.[0];
    if (!file) return;

    setSignatureFile(file);

    const reader = new FileReader();
    reader.onload = (ev) => {
      setSignaturePreview(ev.target?.result || "");
    };
    reader.readAsDataURL(file);
  }

  async function handleSubmit(e) {
    e.preventDefault();

    if (!formData.name.trim() || !formData.position.trim()) {
      alert("Name and position are required");
      return;
    }

    try {
      setSubmitting(true);
      await onSubmit(formData, photoFile || undefined, signatureFile || undefined);
    } catch (err) {
      console.error("Form submission error:", err);
      alert(err?.message || "Failed to save team member");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="team-member-form">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@300;400;500&display=swap');

        .team-member-form {
          background: white;
          padding: 32px;
          border-radius: 16px;
          border: 1px solid rgba(104,80,68,0.09);
        }

        .form-section {
          margin-bottom: 24px;
        }

        .form-section-title {
          font-family: 'DM Sans', sans-serif;
          font-size: 14px;
          font-weight: 500;
          text-transform: uppercase;
          letter-spacing: 0.12em;
          color: #3a405a;
          margin-bottom: 16px;
          display: block;
        }

        .form-row {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 16px;
          margin-bottom: 16px;
        }

        @media (max-width: 640px) {
          .form-row {
            grid-template-columns: 1fr;
          }
        }

        .form-group {
          display: flex;
          flex-direction: column;
          gap: 6px;
        }

        .form-label {
          font-family: 'DM Sans', sans-serif;
          font-size: 11px;
          font-weight: 500;
          text-transform: uppercase;
          letter-spacing: 0.13em;
          color: rgba(104,80,68,0.55);
        }

        .form-label.required::after {
          content: ' *';
          color: #c0392b;
        }

        .form-input,
        .form-textarea {
          padding: 10px 13px;
          border-radius: 9px;
          border: 1px solid rgba(104,80,68,0.14);
          background: #fdfaf8;
          font-family: 'DM Sans', sans-serif;
          font-size: 13px;
          color: #3a405a;
          outline: none;
          transition: border-color 0.2s ease, background 0.2s ease, box-shadow 0.2s ease;
        }

        .form-input:focus,
        .form-textarea:focus {
          border-color: rgba(153,178,221,0.55);
          box-shadow: 0 0 0 3px rgba(153,178,221,0.10);
          background: #ffffff;
        }

        .form-textarea {
          resize: vertical;
          min-height: 100px;
          font-family: 'DM Sans', sans-serif;
        }

        .photo-upload {
          border: 2px dashed rgba(104,80,68,0.20);
          border-radius: 12px;
          padding: 20px;
          text-align: center;
        }

        .photo-input {
          display: none;
        }

        .photo-btn {
          display: inline-block;
          padding: 10px 20px;
          border-radius: 9px;
          background: rgba(153,178,221,0.15);
          color: #3a405a;
          font-family: 'DM Sans', sans-serif;
          font-size: 12px;
          font-weight: 500;
          text-transform: uppercase;
          cursor: pointer;
          transition: background 0.2s ease;
          border: none;
        }

        .photo-btn:hover {
          background: rgba(153,178,221,0.25);
        }

        .photo-preview {
          margin-top: 12px;
          max-width: 200px;
          margin-left: auto;
          margin-right: auto;
        }

        .photo-preview img {
          width: 100%;
          border-radius: 8px;
          border: 1px solid rgba(104,80,68,0.12);
          display: block;
        }

        .form-actions {
          display: flex;
          gap: 12px;
          justify-content: flex-end;
          margin-top: 32px;
          padding-top: 24px;
          border-top: 1px solid rgba(104,80,68,0.07);
        }

        .form-btn {
          padding: 10px 24px;
          border-radius: 9px;
          border: none;
          font-family: 'DM Sans', sans-serif;
          font-size: 12px;
          font-weight: 500;
          text-transform: uppercase;
          cursor: pointer;
          transition: all 0.2s ease;
        }

        .form-btn-primary {
          background: #3a405a;
          color: #f9dec9;
        }

        .form-btn-primary:hover:not(:disabled) {
          transform: translateY(-1px);
          box-shadow: 0 6px 18px rgba(58,64,90,0.18);
        }

        .form-btn-primary:disabled {
          opacity: 0.6;
          cursor: not-allowed;
        }

        .form-btn-secondary {
          background: rgba(104,80,68,0.10);
          color: #3a405a;
        }

        .form-btn-secondary:hover:not(:disabled) {
          background: rgba(104,80,68,0.15);
        }
      `}</style>

      <div className="form-section">
        <label className="form-section-title">Basic Information</label>

        <div className="form-row">
          <div className="form-group">
            <label className="form-label required">Name</label>
            <input
              type="text"
              className="form-input"
              placeholder="e.g., John Doe"
              value={formData.name}
              onChange={(e) => updateField("name", e.target.value)}
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label required">Position</label>
            <input
              type="text"
              className="form-input"
              placeholder="e.g., CEO, Director"
              value={formData.position}
              onChange={(e) => updateField("position", e.target.value)}
              required
            />
          </div>
        </div>

        <div className="form-row">
          <div className="form-group">
            <label className="form-label">Short Description</label>
            <input
              type="text"
              className="form-input"
              placeholder="e.g., Digital visionary & business strategist"
              value={formData.shortDesc}
              onChange={(e) => updateField("shortDesc", e.target.value)}
            />
          </div>

          <div className="form-group">
            <label className="form-label">Photo</label>
            <div className="photo-upload">
              <input
                type="file"
                id="photo-input"
                className="photo-input"
                accept="image/*"
                onChange={handlePhotoSelect}
              />
              <label htmlFor="photo-input" className="photo-btn">
                Choose Photo
              </label>

              {photoPreview && (
                <div className="photo-preview">
                  <img src={photoPreview} alt="Preview" />
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="form-section">
        <label className="form-section-title">Professional Details</label>

        <div className="form-group" style={{ marginBottom: "16px" }}>
          <label className="form-label">Biography</label>
          <textarea
            className="form-textarea"
            placeholder="Enter full biography..."
            value={formData.bio}
            onChange={(e) => updateField("bio", e.target.value)}
          />
        </div>

        <div className="form-row">
          <div className="form-group">
            <label className="form-label">Email</label>
            <input
              type="email"
              className="form-input"
              placeholder="email@example.com"
              value={formData.email}
              onChange={(e) => updateField("email", e.target.value)}
            />
          </div>

          <div className="form-group">
            <label className="form-label">Phone</label>
            <input
              type="text"
              className="form-input"
              placeholder="+91 9876543210"
              value={formData.phone}
              onChange={(e) => updateField("phone", e.target.value)}
            />
          </div>
        </div>

        <div className="form-group">
          <label className="form-label">Website/Portfolio</label>
          <input
            type="url"
            className="form-input"
            placeholder="https://example.com"
            value={formData.websiteUrl}
            onChange={(e) => updateField("websiteUrl", e.target.value)}
          />
        </div>
      </div>

      <div className="form-section">
        <label className="form-section-title">Social & Documents</label>

        <div className="form-row">
          <div className="form-group">
            <label className="form-label">LinkedIn URL</label>
            <input
              type="url"
              className="form-input"
              placeholder="https://linkedin.com/in/username"
              value={formData.linkedinUrl}
              onChange={(e) => updateField("linkedinUrl", e.target.value)}
            />
          </div>

          <div className="form-group">
            <label className="form-label">Twitter/X URL</label>
            <input
              type="url"
              className="form-input"
              placeholder="https://twitter.com/username"
              value={formData.twitterUrl}
              onChange={(e) => updateField("twitterUrl", e.target.value)}
            />
          </div>
        </div>

        <div className="form-group" style={{ marginBottom: "16px" }}>
          <label className="form-label">Resume URL</label>
          <input
            type="url"
            className="form-input"
            placeholder="https://example.com/resume.pdf"
            value={formData.resumeUrl}
            onChange={(e) => updateField("resumeUrl", e.target.value)}
          />
        </div>

        <div className="form-group">
          <label className="form-label">Signature Image</label>
          <div className="photo-upload">
            <input
              type="file"
              id="signature-input"
              className="photo-input"
              accept="image/*"
              onChange={handleSignatureSelect}
            />
            <label htmlFor="signature-input" className="photo-btn">
              Choose Signature
            </label>

            {signaturePreview && (
              <div className="photo-preview">
                <img src={signaturePreview} alt="Signature Preview" />
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="form-actions">
        <button
          type="button"
          className="form-btn form-btn-secondary"
          onClick={onCancel}
          disabled={submitting}
        >
          Cancel
        </button>

        <button
          type="submit"
          className="form-btn form-btn-primary"
          disabled={submitting || isLoading}
        >
          {submitting ? "Saving..." : isEdit ? "Update Member" : "Create Member"}
        </button>
      </div>
    </form>
  );
}