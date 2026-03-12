// pages/testimonials/TestimonialsAdminPage.jsx
// Testimonials management page — list + form view

import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { adminApi } from "../../../lib/api";
import TestimonialsList from "./TestimonialsList";
import TestimonialForm from "./TestimonialForm";

function getTestimonialsList(payload) {
  if (Array.isArray(payload)) return payload;
  if (Array.isArray(payload?.testimonials)) return payload.testimonials;
  if (Array.isArray(payload?.items)) return payload.items;
  return [];
}

function transformTestimonial(t) {
  return {
    id: Number(t.id),
    clientName: t.clientName ?? t.client_name ?? "",
    clientCompany: t.clientCompany ?? t.client_company ?? "",
    clientRole: t.clientRole ?? t.client_role ?? "",
    quote: t.quote ?? "",
    rating: Number(t.rating ?? 5),
    shortHighlight: t.shortHighlight ?? t.short_highlight ?? "",
    featured: Boolean(t.featured),
    clientPhoto: t.clientPhoto ?? t.client_photo ?? "",
    client_photo: t.client_photo ?? "",
    client_name: t.client_name ?? "",
    client_company: t.client_company ?? "",
    client_role: t.client_role ?? "",
    short_highlight: t.short_highlight ?? "",
    createdAt: t.createdAt ?? t.created_at ?? "",
    created_at: t.created_at ?? "",
  };
}

export default function TestimonialsAdminPage() {
  const [testimonials, setTestimonials] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [view, setView] = useState("list");
  const [editingTestimonial, setEditingTestimonial] = useState(null);
  const [formLoading, setFormLoading] = useState(false);

  useEffect(() => {
    fetchTestimonials();
  }, []);

  useEffect(() => {
    if (view !== "list") return;

    const timer = setTimeout(() => {
      fetchTestimonials(search);
    }, 250);

    return () => clearTimeout(timer);
  }, [search, view]);

  async function fetchTestimonials(searchValue = "") {
    try {
      setLoading(true);

      const res = await adminApi.getTestimonials(
        searchValue ? { search: searchValue } : {}
      );

      const payload = res?.data ?? res ?? {};
      const list = getTestimonialsList(payload).map(transformTestimonial);

      setTestimonials(list);
    } catch (err) {
      console.error("Failed to fetch testimonials:", err);
      alert("Failed to load testimonials");
      setTestimonials([]);
    } finally {
      setLoading(false);
    }
  }

  function toFormInitialData(testimonial) {
    return {
      id: testimonial.id,
      clientName: testimonial.clientName ?? testimonial.client_name ?? "",
      clientCompany: testimonial.clientCompany ?? testimonial.client_company ?? "",
      clientRole: testimonial.clientRole ?? testimonial.client_role ?? "",
      quote: testimonial.quote ?? "",
      rating: testimonial.rating ?? 5,
      shortHighlight: testimonial.shortHighlight ?? testimonial.short_highlight ?? "",
      featured: testimonial.featured ?? false,
      clientPhoto: testimonial.clientPhoto ?? testimonial.client_photo ?? "",
      client_photo: testimonial.client_photo ?? testimonial.clientPhoto ?? "",
      client_name: testimonial.client_name ?? testimonial.clientName ?? "",
      client_company: testimonial.client_company ?? testimonial.clientCompany ?? "",
      client_role: testimonial.client_role ?? testimonial.clientRole ?? "",
      short_highlight: testimonial.short_highlight ?? testimonial.shortHighlight ?? "",
    };
  }

  async function handleFormSubmit(data, photoFile) {
    try {
      setFormLoading(true);

      const formDataObj = new FormData();
      formDataObj.append("clientName", data.clientName ?? "");
      formDataObj.append("clientCompany", data.clientCompany ?? "");
      formDataObj.append("clientRole", data.clientRole ?? "");
      formDataObj.append("quote", data.quote ?? "");
      formDataObj.append("rating", String(data.rating ?? 5));
      formDataObj.append("shortHighlight", data.shortHighlight ?? "");
      formDataObj.append("featured", data.featured ? "true" : "false");

      if (photoFile) {
        formDataObj.append("photo", photoFile);
      }

      const isEdit = view === "edit" && editingTestimonial;

      if (isEdit) {
        const res = await adminApi.updateTestimonial(editingTestimonial.id, formDataObj);
        if (res?.message && String(res.message).toLowerCase().includes("error")) {
          alert(res.message || "Failed to update testimonial");
          return;
        }
      } else {
        await adminApi.createTestimonial({
          clientName: data.clientName ?? "",
          clientCompany: data.clientCompany ?? "",
          clientRole: data.clientRole ?? "",
          quote: data.quote ?? "",
          rating: Number(data.rating ?? 5),
          shortHighlight: data.shortHighlight ?? "",
          featured: Boolean(data.featured),
        });
      }

      alert(isEdit ? "Testimonial updated successfully!" : "Testimonial created successfully!");
      await fetchTestimonials(search);
      handleBackToList();
    } catch (err) {
      console.error("Failed to submit form:", err);
      alert(err?.message || "Error saving testimonial");
    } finally {
      setFormLoading(false);
    }
  }

  async function handleDelete(id) {
    if (!window.confirm("Are you sure you want to delete this testimonial?")) return;

    try {
      await adminApi.deleteTestimonial(id);
      alert("Testimonial deleted successfully!");
      await fetchTestimonials(search);
    } catch (err) {
      console.error("Failed to delete testimonial:", err);
      alert(err?.message || "Error deleting testimonial");
    }
  }

  async function handleToggleFeatured(id) {
    try {
      await adminApi.toggleFeatured(id);
      await fetchTestimonials(search);
    } catch (err) {
      console.error("Failed to toggle featured:", err);
      alert(err?.message || "Error toggling featured status");
    }
  }

  function handleEditClick(testimonial) {
    setEditingTestimonial(testimonial);
    setView("edit");
    window.scrollTo(0, 0);
  }

  function handleNewClick() {
    setEditingTestimonial(null);
    setView("new");
    window.scrollTo(0, 0);
  }

  function handleBackToList() {
    setView("list");
    setEditingTestimonial(null);
  }

  return (
    <div className="admin-testimonials-page">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@300;400;600&family=DM+Sans:wght@300;400;500&display=swap');

        .admin-testimonials-page {
          padding: 32px 24px; max-width: 1400px; margin: 0 auto;
          animation: pageLoad 0.4s ease both;
        }
        @keyframes pageLoad { from { opacity: 0; transform: translateY(8px); } to { opacity: 1; transform: translateY(0); } }

        .page-header { display: flex; align-items: center; gap: 16px; margin-bottom: 32px; flex-wrap: wrap; }

        .back-link {
          display: inline-flex; align-items: center; gap: 6px;
          font-family: 'DM Sans', sans-serif; font-size: 12px; font-weight: 400;
          color: rgba(104,80,68,0.55); text-decoration: none;
          padding: 7px 13px; border-radius: 8px;
          border: 1px solid rgba(104,80,68,0.12); background: #ffffff;
          transition: background 0.2s ease;
        }
        .back-link:hover { background: rgba(104,80,68,0.04); }

        .page-title { font-family: 'Cormorant Garamond', serif; font-size: 32px; font-weight: 400; color: #3a405a; margin: 0; flex: 1; }

        .page-content { background: white; border-radius: 16px; padding: 32px; border: 1px solid rgba(104,80,68,0.09); }

        .form-header { display: flex; align-items: center; gap: 16px; margin-bottom: 28px; padding-bottom: 20px; border-bottom: 1px solid rgba(104,80,68,0.07); }
        .form-title { font-family: 'Cormorant Garamond', serif; font-size: 24px; font-weight: 400; color: #3a405a; margin: 0; flex: 1; }

        .form-back-btn {
          padding: 8px 16px; border-radius: 8px; border: 1px solid rgba(104,80,68,0.14);
          background: #fdfaf8; font-family: 'DM Sans', sans-serif; font-size: 12px;
          color: rgba(104,80,68,0.55); cursor: pointer; transition: background 0.2s ease;
        }
        .form-back-btn:hover { background: #ffffff; }
      `}</style>

      <div className="page-header">
        <Link to="/admin" className="back-link">
          ← Back to Admin
        </Link>
        <h1 className="page-title">Testimonials Management</h1>
      </div>

      <div className="page-content">
        {view === "list" ? (
          <TestimonialsList
            testimonials={testimonials}
            loading={loading}
            search={search}
            onSearchChange={setSearch}
            onEdit={handleEditClick}
            onDelete={handleDelete}
            onToggleFeatured={handleToggleFeatured}
            onAddNew={handleNewClick}
          />
        ) : (
          <>
            <div className="form-header">
              <h2 className="form-title">
                {view === "new" ? "Create New Testimonial" : "Edit Testimonial"}
              </h2>

              <button type="button" className="form-back-btn" onClick={handleBackToList}>
                ← Back to List
              </button>
            </div>

            <TestimonialForm
              initialData={editingTestimonial ? toFormInitialData(editingTestimonial) : undefined}
              onSubmit={handleFormSubmit}
              onCancel={handleBackToList}
              isLoading={formLoading}
              isEdit={view === "edit"}
            />
          </>
        )}
      </div>
    </div>
  );
}