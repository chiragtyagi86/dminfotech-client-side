// app/admin/testimonials/page.tsx
// ─────────────────────────────────────────────────────────────────────────────
// Admin testimonials management page - combines list and form components
// ─────────────────────────────────────────────────────────────────────────────

"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import TestimonialsList from "./components/TestimonialsList";
import TestimonialForm, { TestimonialFormData } from "./components/TestimonialForm";
import { Testimonial } from "./types";

type TestimonialFormInitialData = TestimonialFormData & {
  id?: number;
  clientPhoto?: string;
  client_photo?: string;
  client_name?: string;
  client_company?: string;
  client_role?: string;
  short_highlight?: string;
};

export default function TestimonialsAdminPage() {
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [view, setView] = useState<"list" | "edit" | "new">("list");
  const [editingTestimonial, setEditingTestimonial] = useState<Testimonial | null>(null);
  const [formLoading, setFormLoading] = useState(false);

  useEffect(() => {
    fetchTestimonials();
  }, []);

  async function fetchTestimonials() {
    try {
      setLoading(true);
      const res = await fetch(`/api/admin/testimonials?search=${encodeURIComponent(search)}`);
      const json = await res.json();

      const transformed: Testimonial[] = (json.data || []).map((t: any) => ({
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
      }));

      setTestimonials(transformed);
    } catch (err) {
      console.error("Failed to fetch testimonials:", err);
      alert("Failed to load testimonials");
    } finally {
      setLoading(false);
    }
  }

  function toFormInitialData(testimonial: Testimonial): TestimonialFormInitialData {
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

  async function handleFormSubmit(data: TestimonialFormData, photoFile?: File) {
    try {
      setFormLoading(true);
      const formDataObj = new FormData();

      Object.entries(data).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          formDataObj.append(key, String(value));
        }
      });

      if (photoFile) {
        formDataObj.append("photo", photoFile);
      }

      const isEdit = view === "edit" && editingTestimonial;
      const url = isEdit
        ? `/api/admin/testimonials/${editingTestimonial.id}`
        : "/api/admin/testimonials";
      const method = isEdit ? "PUT" : "POST";

      const res = await fetch(url, { method, body: formDataObj });
      const json = await res.json();

      if (!res.ok) {
        alert(json.message || "Failed to save testimonial");
        return;
      }

      alert(isEdit ? "Testimonial updated successfully!" : "Testimonial created successfully!");
      await fetchTestimonials();
      handleBackToList();
    } catch (err) {
      console.error("Failed to submit form:", err);
      alert("Error saving testimonial");
    } finally {
      setFormLoading(false);
    }
  }

  async function handleDelete(id: number) {
    if (!confirm("Are you sure you want to delete this testimonial?")) return;

    try {
      const res = await fetch(`/api/admin/testimonials/${id}`, { method: "DELETE" });
      const json = await res.json();

      if (!res.ok) {
        alert(json.message || "Failed to delete testimonial");
        return;
      }

      alert("Testimonial deleted successfully!");
      await fetchTestimonials();
    } catch (err) {
      console.error("Failed to delete testimonial:", err);
      alert("Error deleting testimonial");
    }
  }

  async function handleToggleFeatured(id: number, featured: boolean) {
    try {
      const res = await fetch(`/api/admin/testimonials/${id}/toggle-featured`, {
        method: "PUT",
      });

      if (!res.ok) {
        alert("Failed to toggle featured status");
        return;
      }

      await fetchTestimonials();
    } catch (err) {
      console.error("Failed to toggle featured:", err);
      alert("Error toggling featured status");
    }
  }

  function handleEditClick(testimonial: Testimonial) {
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
    setSearch("");
  }

  return (
    <div className="admin-testimonials-page">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@300;400;600&family=DM+Sans:wght@300;400;500&display=swap');

        .admin-testimonials-page {
          padding: 32px 24px;
          max-width: 1400px;
          margin: 0 auto;
          animation: pageLoad 0.4s ease both;
        }

        @keyframes pageLoad {
          from {
            opacity: 0;
            transform: translateY(8px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .page-header {
          display: flex;
          align-items: center;
          gap: 16px;
          margin-bottom: 32px;
          flex-wrap: wrap;
        }

        .back-link {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          font-family: 'DM Sans', sans-serif;
          font-size: 12px;
          font-weight: 400;
          color: rgba(104,80,68,0.55);
          text-decoration: none;
          padding: 7px 13px;
          border-radius: 8px;
          border: 1px solid rgba(104,80,68,0.12);
          background: #ffffff;
          transition: background 0.2s ease;
        }

        .back-link:hover {
          background: rgba(104,80,68,0.04);
        }

        .page-title {
          font-family: 'Cormorant Garamond', serif;
          font-size: 32px;
          font-weight: 400;
          color: var(--color-primary, #3a405a);
          margin: 0;
          flex: 1;
        }

        .page-content {
          background: white;
          border-radius: 16px;
          padding: 32px;
          border: 1px solid rgba(104,80,68,0.09);
        }

        .form-header {
          display: flex;
          align-items: center;
          gap: 16px;
          margin-bottom: 28px;
          padding-bottom: 20px;
          border-bottom: 1px solid rgba(104,80,68,0.07);
        }

        .form-title {
          font-family: 'Cormorant Garamond', serif;
          font-size: 24px;
          font-weight: 400;
          color: var(--color-primary, #3a405a);
          margin: 0;
          flex: 1;
        }

        .form-back-btn {
          padding: 8px 16px;
          border-radius: 8px;
          border: 1px solid rgba(104,80,68,0.14);
          background: #fdfaf8;
          font-family: 'DM Sans', sans-serif;
          font-size: 12px;
          font-weight: 400;
          color: rgba(104,80,68,0.55);
          text-decoration: none;
          cursor: pointer;
          transition: background 0.2s ease;
        }

        .form-back-btn:hover {
          background: #ffffff;
        }
      `}</style>

      <div className="page-header">
        <Link href="/admin" className="back-link">
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