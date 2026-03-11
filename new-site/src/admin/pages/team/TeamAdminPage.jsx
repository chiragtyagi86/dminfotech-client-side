// src/admin/team/index.jsx
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import TeamMembersList from "./TeamMembersList";
import TeamMemberForm from "./TeamMemberForm";
import { adminApi } from "../../../lib/api";

export default function TeamAdminPage() {
  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [view, setView] = useState("list"); // "list" | "edit" | "new"
  const [editingMember, setEditingMember] = useState(null);
  const [formLoading, setFormLoading] = useState(false);

  useEffect(() => {
    fetchMembers();
  }, [search]);

  async function fetchMembers() {
    try {
      setLoading(true);

      const json = await adminApi.getTeam(
        search ? { search } : {}
      );

      const rows = json?.data ?? json ?? [];

      const transformed = rows.map((m) => ({
        id: Number(m.id),
        name: m.name ?? "",
        position: m.position ?? "",
        bio: m.bio ?? "",
        shortDesc: m.shortDesc ?? m.short_desc ?? "",
        email: m.email ?? "",
        phone: m.phone ?? "",
        photoUrl: m.photoUrl ?? m.photo_url ?? "",
        photo_url: m.photo_url ?? "",
        linkedinUrl: m.linkedinUrl ?? m.linkedin_url ?? "",
        linkedin_url: m.linkedin_url ?? "",
        twitterUrl: m.twitterUrl ?? m.twitter_url ?? "",
        twitter_url: m.twitter_url ?? "",
        websiteUrl: m.websiteUrl ?? m.website_url ?? "",
        website_url: m.website_url ?? "",
        resumeUrl: m.resumeUrl ?? m.resume_url ?? "",
        resume_url: m.resume_url ?? "",
        short_desc: m.short_desc ?? "",
        signature: m.signature ?? "",
        createdAt: m.createdAt ?? m.created_at ?? "",
        created_at: m.created_at ?? "",
      }));

      setMembers(transformed);
    } catch (err) {
      console.error("Failed to fetch team members:", err);
      alert(err.message || "Failed to load team members");
    } finally {
      setLoading(false);
    }
  }

  function toFormInitialData(member) {
    return {
      id: member.id,
      name: member.name ?? "",
      position: member.position ?? "",
      bio: member.bio ?? "",
      shortDesc: member.shortDesc ?? member.short_desc ?? "",
      short_desc: member.short_desc ?? member.shortDesc ?? "",
      email: member.email ?? "",
      phone: member.phone ?? "",
      photoUrl: member.photoUrl ?? member.photo_url ?? "",
      photo_url: member.photo_url ?? member.photoUrl ?? "",
      linkedinUrl: member.linkedinUrl ?? member.linkedin_url ?? "",
      linkedin_url: member.linkedin_url ?? member.linkedinUrl ?? "",
      twitterUrl: member.twitterUrl ?? member.twitter_url ?? "",
      twitter_url: member.twitter_url ?? member.twitterUrl ?? "",
      websiteUrl: member.websiteUrl ?? member.website_url ?? "",
      website_url: member.website_url ?? member.websiteUrl ?? "",
      resumeUrl: member.resumeUrl ?? member.resume_url ?? "",
      resume_url: member.resume_url ?? member.resumeUrl ?? "",
      signature: member.signature ?? "",
    };
  }

  async function handleFormSubmit(data, photoFile) {
    try {
      setFormLoading(true);

      const formDataObj = new FormData();

      Object.entries(data).forEach(([key, value]) => {
        if (value !== undefined && value !== null && value !== "") {
          formDataObj.append(key, String(value));
        }
      });

      if (photoFile) formDataObj.append("photo", photoFile);

      const isEdit = view === "edit" && editingMember;

      if (isEdit) {
        await adminApi.updateTeamMember(editingMember.id, formDataObj);
      } else {
        await adminApi.createTeamMember(formDataObj);
      }

      alert(isEdit ? "Team member updated successfully!" : "Team member created successfully!");
      await fetchMembers();
      handleBackToList();
    } catch (err) {
      console.error("Failed to submit form:", err);
      alert(err.message || "Error saving team member");
    } finally {
      setFormLoading(false);
    }
  }

  async function handleDelete(id) {
    if (!confirm("Are you sure you want to delete this team member?")) return;

    try {
      await adminApi.deleteTeamMember(id);
      alert("Team member deleted successfully!");
      await fetchMembers();
    } catch (err) {
      console.error("Failed to delete team member:", err);
      alert(err.message || "Error deleting team member");
    }
  }

  function handleEditClick(member) {
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
          from { opacity: 0; transform: translateY(8px); }
          to   { opacity: 1; transform: translateY(0); }
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
        .back-link:hover { background: rgba(104,80,68,0.04); }

        .page-title {
          font-family: 'Cormorant Garamond', serif;
          font-size: 32px;
          font-weight: 400;
          color: #3a405a;
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
          color: #3a405a;
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
          cursor: pointer;
          transition: background 0.2s ease;
        }
        .form-back-btn:hover { background: #ffffff; }
      `}</style>

      <div className="page-header">
        <Link to="/admin" className="back-link">← Back to Admin</Link>
        <h1 className="page-title">Team Management</h1>
      </div>

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
              <button type="button" className="form-back-btn" onClick={handleBackToList}>
                ← Back to List
              </button>
            </div>

            <TeamMemberForm
              initialData={editingMember ? toFormInitialData(editingMember) : undefined}
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