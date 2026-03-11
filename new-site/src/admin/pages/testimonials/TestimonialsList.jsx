// pages/testimonials/TestimonialsList.jsx
// Testimonials list with search, featured toggle, edit, delete

export default function TestimonialsList({
  testimonials,
  loading,
  search,
  onSearchChange,
  onEdit,
  onDelete,
  onToggleFeatured,
  onAddNew,
}) {
  const filteredTestimonials = testimonials.filter((t) => {
    const name = (t.clientName || t.client_name || "").toString().toLowerCase();
    const company = (t.clientCompany || t.client_company || "").toString().toLowerCase();
    const quote = (t.quote || "").toString().toLowerCase();
    const searchLower = (search || "").toLowerCase();

    return (
      name.includes(searchLower) ||
      company.includes(searchLower) ||
      quote.includes(searchLower)
    );
  });

  return (
    <div className="testimonials-list">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@300;400;600&family=DM+Sans:wght@300;400;500&display=swap');

        .testimonials-list { display: flex; flex-direction: column; gap: 24px; }

        .list-header { display: flex; align-items: center; gap: 16px; flex-wrap: wrap; }
        .list-heading { font-family: 'Cormorant Garamond', serif; font-size: 28px; font-weight: 400; color: #3a405a; margin: 0; flex: 1; }
        .list-controls { display: flex; gap: 12px; align-items: center; flex-wrap: wrap; }

        .list-search {
          padding: 10px 13px; border-radius: 9px;
          border: 1px solid rgba(104,80,68,0.14); background: #fdfaf8;
          font-family: 'DM Sans', sans-serif; font-size: 13px; color: #3a405a;
          outline: none; min-width: 250px; transition: all 0.2s ease;
        }
        .list-search:focus { border-color: rgba(153,178,221,0.55); box-shadow: 0 0 0 3px rgba(153,178,221,0.10); background: #ffffff; }

        .list-btn { padding: 10px 20px; border-radius: 9px; border: none; background: #3a405a; color: #f9dec9; font-family: 'DM Sans', sans-serif; font-size: 12px; font-weight: 500; letter-spacing: 0.08em; text-transform: uppercase; cursor: pointer; transition: all 0.2s ease; }
        .list-btn:hover { transform: translateY(-1px); box-shadow: 0 6px 18px rgba(58,64,90,0.18); }

        .list-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(320px, 1fr)); gap: 20px; }

        .testimonial-card { background: #ffffff; border: 1px solid rgba(104,80,68,0.09); border-radius: 16px; overflow: hidden; display: flex; flex-direction: column; transition: transform 0.25s ease, box-shadow 0.25s ease; }
        .testimonial-card:hover { transform: translateY(-4px); box-shadow: 0 16px 40px rgba(58,64,90,0.09); }

        .card-header { display: flex; gap: 12px; padding: 16px; border-bottom: 1px solid rgba(104,80,68,0.07); background: rgba(104,80,68,0.02); }

        .card-photo { width: 50px; height: 50px; border-radius: 50%; overflow: hidden; flex-shrink: 0; background: linear-gradient(145deg, rgba(153,178,221,0.15), rgba(233,175,163,0.10)); display: flex; align-items: center; justify-content: center; font-size: 24px; }
        .card-photo img { width: 100%; height: 100%; object-fit: cover; }

        .card-info { flex: 1; }
        .card-name { font-family: 'Cormorant Garamond', serif; font-size: 16px; font-weight: 600; color: #3a405a; margin: 0 0 2px; }
        .card-role { font-family: 'DM Sans', sans-serif; font-size: 10px; font-weight: 500; color: rgba(153,178,221,0.80); text-transform: uppercase; letter-spacing: 0.08em; margin: 0; }
        .card-company { font-family: 'DM Sans', sans-serif; font-size: 11px; font-weight: 400; color: rgba(104,80,68,0.55); margin: 2px 0 0; }

        .card-body { padding: 16px; flex: 1; display: flex; flex-direction: column; gap: 10px; }

        .card-rating { display: flex; gap: 3px; }
        .card-star { font-size: 14px; color: #ffc107; }

        .card-quote { font-family: 'DM Sans', sans-serif; font-size: 12px; font-weight: 300; line-height: 1.6; color: #3a405a; margin: 0; display: -webkit-box; -webkit-line-clamp: 3; -webkit-box-orient: vertical; overflow: hidden; }

        .card-highlight { font-family: 'DM Sans', sans-serif; font-size: 10px; font-weight: 500; color: rgba(153,178,221,0.80); text-transform: uppercase; letter-spacing: 0.06em; background: rgba(153,178,221,0.08); padding: 4px 8px; border-radius: 4px; margin: 0; }

        .card-badge { display: inline-block; font-family: 'DM Sans', sans-serif; font-size: 9px; font-weight: 500; text-transform: uppercase; letter-spacing: 0.08em; background: rgba(34, 134, 58, 0.1); color: #22863a; padding: 3px 8px; border-radius: 4px; margin: 0; }

        .card-footer { display: flex; gap: 8px; padding: 12px 16px; border-top: 1px solid rgba(104,80,68,0.07); background: rgba(104,80,68,0.02); }

        .card-btn { flex: 1; padding: 8px 12px; border-radius: 6px; border: none; font-family: 'DM Sans', sans-serif; font-size: 10px; font-weight: 500; text-transform: uppercase; cursor: pointer; transition: all 0.2s; }
        .card-btn-edit { background: rgba(153,178,221,0.15); color: #3a405a; }
        .card-btn-edit:hover { background: rgba(153,178,221,0.25); }
        .card-btn-featured { background: rgba(34, 134, 58, 0.15); color: #22863a; }
        .card-btn-featured:hover { background: rgba(34, 134, 58, 0.25); }
        .card-btn-featured.active { background: #22863a; color: white; }
        .card-btn-delete { background: rgba(192,57,43,0.15); color: #c0392b; }
        .card-btn-delete:hover { background: rgba(192,57,43,0.25); }

        .list-loading { text-align: center; padding: 60px 20px; font-family: 'DM Sans', sans-serif; color: rgba(104,80,68,0.55); }
        .list-empty  { text-align: center; padding: 60px 20px; font-family: 'DM Sans', sans-serif; color: rgba(104,80,68,0.55); }
      `}</style>

      <div className="list-header">
        <h1 className="list-heading">Testimonials</h1>

        <div className="list-controls">
          <input
            type="text"
            className="list-search"
            placeholder="Search testimonials..."
            value={search}
            onChange={(e) => onSearchChange(e.target.value)}
          />
          <button type="button" className="list-btn" onClick={onAddNew}>
            + Add Testimonial
          </button>
        </div>
      </div>

      {loading ? (
        <div className="list-loading">Loading testimonials...</div>
      ) : filteredTestimonials.length === 0 ? (
        <div className="list-empty">
          {testimonials.length === 0
            ? "No testimonials yet. Click 'Add Testimonial' to get started."
            : "No testimonials match your search."}
        </div>
      ) : (
        <div className="list-grid">
          {filteredTestimonials.map((testimonial) => (
            <div key={testimonial.id} className="testimonial-card">
              <div className="card-header">
                <div className="card-photo">
                  {testimonial.clientPhoto || testimonial.client_photo ? (
                    <img
                      src={testimonial.clientPhoto || testimonial.client_photo}
                      alt={testimonial.clientName || testimonial.client_name || "Client"}
                    />
                  ) : (
                    "👤"
                  )}
                </div>

                <div className="card-info">
                  <h3 className="card-name">
                    {testimonial.clientName || testimonial.client_name}
                  </h3>
                  <p className="card-role">
                    {testimonial.clientRole || testimonial.client_role}
                  </p>
                  <p className="card-company">
                    {testimonial.clientCompany || testimonial.client_company}
                  </p>
                </div>
              </div>

              <div className="card-body">
                <div className="card-rating">
                  {[...Array(5)].map((_, i) => (
                    <span
                      key={i}
                      className="card-star"
                      style={{ opacity: i < (testimonial.rating || 0) ? 1 : 0.2 }}
                    >
                      ★
                    </span>
                  ))}
                </div>

                <p className="card-quote">"{testimonial.quote || ""}"</p>

                {(testimonial.shortHighlight || testimonial.short_highlight) && (
                  <p className="card-highlight">
                    ✓ {testimonial.shortHighlight || testimonial.short_highlight}
                  </p>
                )}

                {testimonial.featured && <p className="card-badge">📌 Featured</p>}
              </div>

              <div className="card-footer">
                <button
                  type="button"
                  className={`card-btn card-btn-featured ${testimonial.featured ? "active" : ""}`}
                  onClick={() => onToggleFeatured(testimonial.id)}
                  title={testimonial.featured ? "Remove from featured" : "Add to featured"}
                >
                  {testimonial.featured ? "★ Featured" : "☆ Feature"}
                </button>

                <button
                  type="button"
                  className="card-btn card-btn-edit"
                  onClick={() => onEdit(testimonial)}
                >
                  Edit
                </button>

                <button
                  type="button"
                  className="card-btn card-btn-delete"
                  onClick={() => onDelete(testimonial.id)}
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}