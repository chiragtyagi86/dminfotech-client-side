// app/admin/team/page.tsx
// ─────────────────────────────────────────────────────────────────────────────
// Admin team management page - combines list and form components
// ─────────────────────────────────────────────────────────────────────────────

"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import TeamMembersList from "./components/Teammemberslist";
import TeamMemberForm, { TeamMemberFormData } from "./components/TeamMemberForm";

interface TeamMember extends TeamMemberFormData {
  id: number;
  photoUrl?: string;
  photo_url?: string;
  createdAt?: string;
  created_at?: string;
  short_desc?: string;
  linkedin_url?: string;
  twitter_url?: string;
  website_url?: string;
  resume_url?: string;
  signature?: string;
}

export default function TeamAdminPage() {
  const [members, setMembers] = useState<TeamMember[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [view, setView] = useState<"list" | "edit" | "new">("list");
  const [editingMember, setEditingMember] = useState<TeamMember | null>(null);
  const [formLoading, setFormLoading] = useState(false);

  useEffect(() => {
    fetchMembers();
  }, []);

  async function fetchMembers() {
    try {
      setLoading(true);
      const res = await fetch(`/api/admin/team?search=${encodeURIComponent(search)}`);
      const json = await res.json();

      // Transform snake_case to camelCase
      const transformed = (json.data || []).map((m: any) => ({
        ...m,
        name: m.name,
        position: m.position,
        bio: m.bio,
        photoUrl: m.photoUrl || m.photo_url,
        shortDesc: m.shortDesc || m.short_desc,
        email: m.email,
        linkedinUrl: m.linkedinUrl || m.linkedin_url,
        twitterUrl: m.twitterUrl || m.twitter_url,
        websiteUrl: m.websiteUrl || m.website_url,
        resumeUrl: m.resumeUrl || m.resume_url,
        signature: m.signature,
      }));

      setMembers(transformed);
    } catch (err) {
      console.error("Failed to fetch team members:", err);
      alert("Failed to load team members");
    } finally {
      setLoading(false);
    }
  }

  async function handleFormSubmit(data: TeamMemberFormData, photoFile?: File) {
    try {
      setFormLoading(true);
      const formDataObj = new FormData();
      Object.entries(data).forEach(([key, value]) => {
        formDataObj.append(key, String(value));
      });
      if (photoFile) {
        formDataObj.append("photo", photoFile);
      }

      const isEdit = view === "edit" && editingMember;
      const url = isEdit ? `/api/admin/team/${editingMember.id}` : "/api/admin/team";
      const method = isEdit ? "PUT" : "POST";

      const res = await fetch(url, { method, body: formDataObj });
      const json = await res.json();

      if (!res.ok) {
        alert(json.message || "Failed to save team member");
        return;
      }

      alert(isEdit ? "Team member updated successfully!" : "Team member created successfully!");
      await fetchMembers();
      handleBackToList();
    } catch (err) {
      console.error("Failed to submit form:", err);
      alert("Error saving team member");
    } finally {
      setFormLoading(false);
    }
  }

  async function handleDelete(id: number) {
    if (!confirm("Are you sure you want to delete this team member?")) return;

    try {
      const res = await fetch(`/api/admin/team/${id}`, { method: "DELETE" });
      const json = await res.json();

      if (!res.ok) {
        alert(json.message || "Failed to delete team member");
        return;
      }

      alert("Team member deleted successfully!");
      await fetchMembers();
    } catch (err) {
      console.error("Failed to delete team member:", err);
      alert("Error deleting team member");
    }
  }

  function handleEditClick(member: TeamMember) {
    setEditingMember(member);
    setView("edit");
    window.scrollTo(0, 0);
  }

  function handleNewClick() {
    setEditingMember(null);
    setView("new");
    window.scrollTo(0, 0);
  }

  function handleBackToList() {
    setView("list");
    setEditingMember(null);
    setSearch("");
  }

  return (
    <div className="admin-team-page">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@300;400;600&family=DM+Sans:wght@300;400;500&display=swap');

        .admin-team-page {
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

      {/* Page Header */}
      <div className="page-header">
        <Link href="/admin" className="back-link">
          ← Back to Admin
        </Link>
        <h1 className="page-title">Team Management</h1>
      </div>

      {/* Content */}
      <div className="page-content">
        {view === "list" ? (
          <TeamMembersList
            members={members}
            loading={loading}
            search={search}
            onSearchChange={setSearch}
            onEdit={handleEditClick}
            onDelete={handleDelete}
            onAddNew={handleNewClick}
          />
        ) : (
          <>
            <div className="form-header">
              <h2 className="form-title">
                {view === "new" ? "Create New Team Member" : "Edit Team Member"}
              </h2>
              <button className="form-back-btn" onClick={handleBackToList}>
                ← Back to List
              </button>
            </div>

            <TeamMemberForm
              initialData={editingMember || undefined}
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