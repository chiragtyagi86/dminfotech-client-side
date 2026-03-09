// app/admin/team/components/TeamMembersList.tsx
// ─────────────────────────────────────────────────────────────────────────────
// Team members list component with search, edit, delete actions
// ─────────────────────────────────────────────────────────────────────────────

"use client";

interface TeamMember {
  id: number;
  name?: string;
  position?: string;
  bio?: string;
  photoUrl?: string;
  photo_url?: string;
  email?: string;
  phone?: string;
  shortDesc?: string;
  short_desc?: string;
  linkedinUrl?: string;
  linkedin_url?: string;
  twitterUrl?: string;
  twitter_url?: string;
  websiteUrl?: string;
  website_url?: string;
  resumeUrl?: string;
  resume_url?: string;
}

interface TeamMembersListProps {
  members: TeamMember[];
  loading: boolean;
  search: string;
  onSearchChange: (search: string) => void;
  onEdit: (member: TeamMember) => void;
  onDelete: (id: number) => void;
  onAddNew: () => void;
}

export default function TeamMembersList({
  members,
  loading,
  search,
  onSearchChange,
  onEdit,
  onDelete,
  onAddNew,
}: TeamMembersListProps) {
  const filteredMembers = members.filter((m) => {
    const name = (m.name || "").toString().toLowerCase();
    const position = (m.position || "").toString().toLowerCase();
    const searchLower = search.toLowerCase();

    return name.includes(searchLower) || position.includes(searchLower);
  });

  return (
    <div className="team-members-list">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@300;400;600&family=DM+Sans:wght@300;400;500&display=swap');

        .team-members-list {
          display: flex;
          flex-direction: column;
          gap: 24px;
        }

        .list-header {
          display: flex;
          align-items: center;
          gap: 16px;
          flex-wrap: wrap;
        }

        .list-heading {
          font-family: 'Cormorant Garamond', serif;
          font-size: 28px;
          font-weight: 400;
          color: var(--color-primary, #3a405a);
          margin: 0;
          flex: 1;
        }

        .list-controls {
          display: flex;
          gap: 12px;
          align-items: center;
          flex-wrap: wrap;
        }

        .list-search {
          padding: 10px 13px;
          border-radius: 9px;
          border: 1px solid rgba(104,80,68,0.14);
          background: #fdfaf8;
          font-family: 'DM Sans', sans-serif;
          font-size: 13px;
          color: var(--color-primary, #3a405a);
          outline: none;
          min-width: 250px;
          transition: all 0.2s ease;
        }

        .list-search:focus {
          border-color: rgba(153,178,221,0.55);
          box-shadow: 0 0 0 3px rgba(153,178,221,0.10);
          background: #ffffff;
        }

        .list-btn {
          padding: 10px 20px;
          border-radius: 9px;
          border: none;
          background: var(--color-primary, #3a405a);
          color: #f9dec9;
          font-family: 'DM Sans', sans-serif;
          font-size: 12px;
          font-weight: 500;
          letter-spacing: 0.08em;
          text-transform: uppercase;
          cursor: pointer;
          transition: all 0.2s ease;
        }

        .list-btn:hover {
          transform: translateY(-1px);
          box-shadow: 0 6px 18px rgba(58,64,90,0.18);
        }

        .list-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
          gap: 20px;
        }

        .member-card {
          background: #ffffff;
          border: 1px solid rgba(104,80,68,0.09);
          border-radius: 16px;
          overflow: hidden;
          display: flex;
          flex-direction: column;
          transition: transform 0.25s ease, box-shadow 0.25s ease;
        }

        .member-card:hover {
          transform: translateY(-4px);
          box-shadow: 0 16px 40px rgba(58,64,90,0.09);
        }

        .card-image {
          width: 100%;
          height: 200px;
          background: linear-gradient(145deg, rgba(153,178,221,0.15), rgba(233,175,163,0.10));
          display: flex;
          align-items: center;
          justify-content: center;
          overflow: hidden;
          position: relative;
          font-size: 48px;
        }

        .card-image img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }

        .card-body {
          padding: 20px;
          flex: 1;
          display: flex;
          flex-direction: column;
          gap: 8px;
        }

        .card-name {
          font-family: 'Cormorant Garamond', serif;
          font-size: 20px;
          font-weight: 600;
          color: var(--color-primary, #3a405a);
          margin: 0;
        }

        .card-position {
          font-family: 'DM Sans', sans-serif;
          font-size: 12px;
          font-weight: 500;
          color: rgba(153,178,221,0.80);
          text-transform: uppercase;
          letter-spacing: 0.08em;
          margin: 0;
        }

        .card-desc {
          font-family: 'DM Sans', sans-serif;
          font-size: 12px;
          font-weight: 300;
          color: rgba(104,80,68,0.55);
          line-height: 1.5;
          margin: 0;
          font-style: italic;
        }

        .card-bio {
          font-family: 'DM Sans', sans-serif;
          font-size: 12px;
          font-weight: 300;
          color: rgba(104,80,68,0.55);
          line-height: 1.5;
          margin: 4px 0 0;
          flex: 1;
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }

        .card-contact {
          font-family: 'DM Sans', sans-serif;
          font-size: 11px;
          font-weight: 300;
          color: rgba(104,80,68,0.45);
          margin-top: 4px;
        }

        .card-footer {
          display: flex;
          gap: 8px;
          padding: 12px 20px;
          border-top: 1px solid rgba(104,80,68,0.07);
          background: rgba(104,80,68,0.02);
        }

        .card-btn {
          flex: 1;
          padding: 8px 12px;
          border-radius: 6px;
          border: none;
          font-family: 'DM Sans', sans-serif;
          font-size: 10px;
          font-weight: 500;
          text-transform: uppercase;
          cursor: pointer;
          transition: all 0.2s;
        }

        .card-btn-edit {
          background: rgba(153,178,221,0.15);
          color: var(--color-primary, #3a405a);
        }

        .card-btn-edit:hover {
          background: rgba(153,178,221,0.25);
        }

        .card-btn-delete {
          background: rgba(192,57,43,0.15);
          color: #c0392b;
        }

        .card-btn-delete:hover {
          background: rgba(192,57,43,0.25);
        }

        .list-loading {
          text-align: center;
          padding: 60px 20px;
          font-family: 'DM Sans', sans-serif;
          color: rgba(104,80,68,0.55);
        }

        .list-empty {
          text-align: center;
          padding: 60px 20px;
          font-family: 'DM Sans', sans-serif;
          color: rgba(104,80,68,0.55);
        }
      `}</style>

      {/* Header with Search and Add Button */}
      <div className="list-header">
        <h1 className="list-heading">Team Members</h1>
        <div className="list-controls">
          <input
            type="text"
            className="list-search"
            placeholder="Search team members..."
            value={search}
            onChange={(e) => onSearchChange(e.target.value)}
          />
          <button className="list-btn" onClick={onAddNew}>
            + Add Member
          </button>
        </div>
      </div>

      {/* Team Members Grid */}
      {loading ? (
        <div className="list-loading">Loading team members...</div>
      ) : filteredMembers.length === 0 ? (
        <div className="list-empty">
          {members.length === 0
            ? "No team members yet. Click 'Add Member' to get started."
            : "No team members match your search."}
        </div>
      ) : (
        <div className="list-grid">
          {filteredMembers.map((member) => (
            <div key={member.id} className="member-card">
              {/* Image */}
              <div className="card-image">
                {member.photoUrl || member.photo_url ? (
                  <img
                    src={(member.photoUrl || member.photo_url) as string}
                    alt={member.name}
                  />
                ) : (
                  "👤"
                )}
              </div>

              {/* Body */}
              <div className="card-body">
                <h3 className="card-name">{member.name}</h3>
                <p className="card-position">{member.position}</p>

                {(member.shortDesc || member.short_desc) && (
                  <p className="card-desc">
                    {member.shortDesc || member.short_desc}
                  </p>
                )}

                {member.bio && <p className="card-bio">{member.bio}</p>}

                {member.email && (
                  <p className="card-contact">📧 {member.email}</p>
                )}
                {member.phone && (
                  <p className="card-contact">📞 {member.phone}</p>
                )}
              </div>

              {/* Footer Actions */}
              <div className="card-footer">
                <button
                  className="card-btn card-btn-edit"
                  onClick={() => onEdit(member)}
                >
                  Edit
                </button>
                <button
                  className="card-btn card-btn-delete"
                  onClick={() => onDelete(member.id)}
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