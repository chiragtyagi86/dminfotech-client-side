// pages/testimonials/TestimonialForm.jsx
// Reusable form for creating and editing testimonials

import { useEffect, useState } from "react";

function normalizeInitialData(initialData) {
  if (!initialData) {
    return {
      clientName: "",
      clientCompany: "",
      clientRole: "",
      quote: "",
      rating: 5,
      shortHighlight: "",
      featured: false,
    };
  }

  return {
    clientName: initialData.clientName || initialData.client_name || "",
    clientCompany: initialData.clientCompany || initialData.client_company || "",
    clientRole: initialData.clientRole || initialData.client_role || "",
    quote: initialData.quote || "",
    rating: Number(initialData.rating || 5),
    shortHighlight: initialData.shortHighlight || initialData.short_highlight || "",
    featured: Boolean(initialData.featured),
  };
}

export default function TestimonialForm({
  initialData,
  onSubmit,
  onCancel,
  isLoading = false,
  isEdit = false,
}) {
  const [formData, setFormData] = useState(normalizeInitialData(initialData));
  const [photoFile, setPhotoFile] = useState(null);
  const [photoPreview, setPhotoPreview] = useState(
    initialData?.clientPhoto || initialData?.client_photo || ""
  );
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    setFormData(normalizeInitialData(initialData));
    setPhotoFile(null);
    setPhotoPreview(initialData?.clientPhoto || initialData?.client_photo || "");
  }, [initialData]);

  function handlePhotoSelect(e) {
    const file = e.target.files?.[0];
    if (!file) return;

    setPhotoFile(file);

    const reader = new FileReader();
    reader.onload = (ev) => setPhotoPreview(ev.target?.result || "");
    reader.readAsDataURL(file);
  }

  async function handleSubmit(e) {
    e.preventDefault();

    if (!formData.clientName.trim() || !formData.quote.trim()) {
      alert("Client name and quote are required");
      return;
    }

    try {
      setSubmitting(true);
      await onSubmit(formData, photoFile || undefined);
    } catch (err) {
      console.error("Form submission error:", err);
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="testimonial-form">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@300;400;500&display=swap');

        .testimonial-form { background: white; padding: 32px; border-radius: 16px; border: 1px solid rgba(104,80,68,0.09); }

        .form-section { margin-bottom: 24px; }
        .form-section-title { font-family: 'DM Sans', sans-serif; font-size: 14px; font-weight: 500; text-transform: uppercase; letter-spacing: 0.12em; color: #3a405a; margin-bottom: 16px; display: block; }

        .form-row { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; margin-bottom: 16px; }
        @media (max-width: 640px) { .form-row { grid-template-columns: 1fr; } }

        .form-group { display: flex; flex-direction: column; gap: 6px; }
        .form-label { font-family: 'DM Sans', sans-serif; font-size: 11px; font-weight: 500; text-transform: uppercase; letter-spacing: 0.13em; color: rgba(104,80,68,0.55); }
        .form-label.required::after { content: ' *'; color: #c0392b; }

        .form-input, .form-textarea, .form-select {
          padding: 10px 13px; border-radius: 9px;
          border: 1px solid rgba(104,80,68,0.14); background: #fdfaf8;
          font-family: 'DM Sans', sans-serif; font-size: 13px; color: #3a405a; outline: none;
          transition: border-color 0.2s ease, background 0.2s ease;
        }
        .form-input:focus, .form-textarea:focus, .form-select:focus {
          border-color: rgba(153,178,221,0.55); box-shadow: 0 0 0 3px rgba(153,178,221,0.10); background: #ffffff;
        }
        .form-textarea { resize: vertical; min-height: 100px; font-family: 'DM Sans', sans-serif; }

        .form-checkbox-group { display: flex; align-items: center; gap: 8px; }
        .form-checkbox { width: 18px; height: 18px; cursor: pointer; accent-color: #3a405a; }
        .form-checkbox-label { font-family: 'DM Sans', sans-serif; font-size: 13px; color: #3a405a; cursor: pointer; }

        .photo-upload { border: 2px dashed rgba(104,80,68,0.20); border-radius: 12px; padding: 20px; text-align: center; }
        .photo-input { display: none; }
        .photo-btn { display: inline-block; padding: 10px 20px; border-radius: 9px; background: rgba(153,178,221,0.15); color: #3a405a; font-family: 'DM Sans', sans-serif; font-size: 12px; font-weight: 500; text-transform: uppercase; cursor: pointer; transition: background 0.2s ease; border: none; }
        .photo-btn:hover { background: rgba(153,178,221,0.25); }
        .photo-preview { margin-top: 12px; max-width: 200px; margin-left: auto; margin-right: auto; }
        .photo-preview img { width: 100%; border-radius: 8px; border: 1px solid rgba(104,80,68,0.12); }

        .form-actions { display: flex; gap: 12px; justify-content: flex-end; margin-top: 32px; padding-top: 24px; border-top: 1px solid rgba(104,80,68,0.07); }
        .form-btn { padding: 10px 24px; border-radius: 9px; border: none; font-family: 'DM Sans', sans-serif; font-size: 12px; font-weight: 500; text-transform: uppercase; cursor: pointer; transition: all 0.2s ease; }
        .form-btn-primary { background: #3a405a; color: #f9dec9; }
        .form-btn-primary:hover:not(:disabled) { transform: translateY(-1px); box-shadow: 0 6px 18px rgba(58,64,90,0.18); }
        .form-btn-primary:disabled { opacity: 0.6; cursor: not-allowed; }
        .form-btn-secondary { background: rgba(104,80,68,0.10); color: #3a405a; }
        .form-btn-secondary:hover { background: rgba(104,80,68,0.15); }

        .rating-group { display: flex; gap: 8px; align-items: center; }
        .rating-stars { display: flex; gap: 4px; }
        .rating-star { width: 32px; height: 32px; border: 1px solid rgba(104,80,68,0.14); border-radius: 4px; background: #fdfaf8; color: #ffc107; font-size: 18px; cursor: pointer; display: flex; align-items: center; justify-content: center; transition: all 0.2s ease; }
        .rating-star:hover, .rating-star.active { background: #ffc107; border-color: #ffc107; color: white; }
      `}</style>

      <div className="form-section">
        <label className="form-section-title">Client Information</label>

        <div className="form-row">
          <div className="form-group">
            <label className="form-label required">Client Name</label>
            <input
              type="text"
              className="form-input"
              placeholder="e.g., John Doe"
              value={formData.clientName}
              onChange={(e) => setFormData({ ...formData, clientName: e.target.value })}
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label">Company</label>
            <input
              type="text"
              className="form-input"
              placeholder="e.g., Tech Company Inc."
              value={formData.clientCompany}
              onChange={(e) => setFormData({ ...formData, clientCompany: e.target.value })}
            />
          </div>
        </div>

        <div className="form-row">
          <div className="form-group">
            <label className="form-label">Job Title</label>
            <input
              type="text"
              className="form-input"
              placeholder="e.g., CEO, Founder"
              value={formData.clientRole}
              onChange={(e) => setFormData({ ...formData, clientRole: e.target.value })}
            />
          </div>

          <div className="form-group">
            <label className="form-label">Client Photo</label>
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
        <label className="form-section-title">Testimonial Content</label>

        <div className="form-group" style={{ marginBottom: "16px" }}>
          <label className="form-label required">Quote</label>
          <textarea
            className="form-textarea"
            placeholder="Enter the full testimonial quote..."
            value={formData.quote}
            onChange={(e) => setFormData({ ...formData, quote: e.target.value })}
            required
          />
        </div>

        <div className="form-row">
          <div className="form-group">
            <label className="form-label">Rating</label>
            <div className="rating-group">
              <div className="rating-stars">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    className={`rating-star ${star <= formData.rating ? "active" : ""}`}
                    onClick={() => setFormData({ ...formData, rating: star })}
                  >
                    ★
                  </button>
                ))}
              </div>

              <span
                style={{
                  fontFamily: "DM Sans",
                  fontSize: "13px",
                  color: "rgba(104,80,68,0.55)",
                }}
              >
                {formData.rating} / 5
              </span>
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Key Highlight</label>
            <input
              type="text"
              className="form-input"
              placeholder="e.g., Exceptional execution & support"
              value={formData.shortHighlight}
              onChange={(e) => setFormData({ ...formData, shortHighlight: e.target.value })}
            />
          </div>
        </div>
      </div>

      <div className="form-section">
        <label className="form-section-title">Settings</label>
        <div className="form-checkbox-group">
          <input
            type="checkbox"
            id="featured-checkbox"
            className="form-checkbox"
            checked={formData.featured}
            onChange={(e) => setFormData({ ...formData, featured: e.target.checked })}
          />
          <label htmlFor="featured-checkbox" className="form-checkbox-label">
            Feature this testimonial on homepage
          </label>
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
          {submitting ? "Saving..." : isEdit ? "Update Testimonial" : "Create Testimonial"}
        </button>
      </div>
    </form>
  );
}