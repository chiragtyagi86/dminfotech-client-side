import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { internApi } from "../../lib/api";

const today = new Date().toISOString().slice(0, 10);

function dateOnly(value) {
  if (!value) return "";
  return String(value).slice(0, 10);
}

export default function InternDashboardPage() {
  const navigate = useNavigate();
  const [data, setData] = useState({ profile: null, todayAttendance: null, attendance: [], reports: [], tasks: [] });
  const [profile, setProfile] = useState({});
  const [report, setReport] = useState({
    tasks_assigned: "",
    tasks_completed: "",
    hours_worked: 8,
    challenges: "",
    tomorrow_plan: "",
    attachment: "",
  });
  const [passwordForm, setPasswordForm] = useState({ currentPassword: "", newPassword: "" });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    loadDashboard();
  }, []);

  async function loadDashboard() {
    try {
      setLoading(true);
      const res = await internApi.getDashboard();
      setData(res);
      setProfile({
        mobile: res.profile?.mobile || "",
        college: res.profile?.college || "",
        course: res.profile?.course || "",
        specialization: res.profile?.specialization || "",
        profile_photo: res.profile?.profile_photo || "",
        resume: res.profile?.resume || "",
      });
    } finally {
      setLoading(false);
    }
  }

  async function logout() {
    await internApi.logout();
    navigate("/intern/login", { replace: true });
  }

  async function runAction(action, success) {
    try {
      setSaving(true);
      setMessage("");
      await action();
      setMessage(success);
      await loadDashboard();
    } catch (err) {
      setMessage(err?.message || "Something went wrong.");
    } finally {
      setSaving(false);
    }
  }

  async function saveProfile(event) {
    event.preventDefault();
    runAction(() => internApi.updateProfile(profile), "Profile updated.");
  }

  async function submitReport(event) {
    event.preventDefault();
    runAction(() => internApi.submitReport(report), "Daily report submitted.").then(() => {
      setReport({ tasks_assigned: "", tasks_completed: "", hours_worked: 8, challenges: "", tomorrow_plan: "", attachment: "" });
    });
  }

  async function updateTask(task, progress) {
    runAction(() => internApi.updateTask(task.id, { progress }), "Task progress updated.");
  }

  async function changePassword(event) {
    event.preventDefault();
    await runAction(
      () => internApi.changePassword(passwordForm.currentPassword, passwordForm.newPassword),
      "Password changed."
    );
    setPasswordForm({ currentPassword: "", newPassword: "" });
  }

  async function uploadFile(file, target) {
    if (!file) return;
    const formData = new FormData();
    formData.append("file", file);
    await runAction(async () => {
      const res = target === "profile_photo"
        ? await internApi.uploadProfilePhoto(formData)
        : await internApi.uploadFile(formData);
      setProfile((prev) => ({ ...prev, [target]: res.url }));
      if (target === "attachment") setReport((prev) => ({ ...prev, attachment: res.url }));
    }, "File uploaded.");
  }

  const checkedIn = Boolean(data.todayAttendance?.check_in);
  const checkedOut = Boolean(data.todayAttendance?.check_out);
  const mustChangePassword = Boolean(data.profile?.must_change_password);

  return (
    <main className="ip-root">
      <style>{`
        .ip-root{min-height:100vh;background:#f5f0eb;color:#3a405a;font-family:'DM Sans',sans-serif;padding:24px;}
        .ip-wrap{max-width:1180px;margin:0 auto;display:flex;flex-direction:column;gap:18px;}
        .ip-top{display:flex;align-items:flex-end;justify-content:space-between;gap:16px;flex-wrap:wrap;}
        .ip-title{font-family:'Cormorant Garamond',serif;font-size:36px;font-weight:400;margin:0;}
        .ip-sub{margin:4px 0 0;color:rgba(104,80,68,.58);font-size:13px;}
        .ip-btn,.ip-soft{border-radius:8px;padding:10px 13px;font-size:12px;cursor:pointer;}
        .ip-btn{border:0;background:#3a405a;color:#f9dec9;font-weight:600;letter-spacing:.07em;text-transform:uppercase;}
        .ip-soft{border:1px solid rgba(104,80,68,.15);background:#fff;color:#3a405a;}
        .ip-btn:disabled,.ip-soft:disabled{opacity:.65;cursor:not-allowed;}
        .ip-grid{display:grid;grid-template-columns:repeat(3,1fr);gap:14px;}
        .ip-panel{background:#fff;border:1px solid rgba(104,80,68,.09);border-radius:8px;overflow:hidden;}
        .ip-panel.wide{grid-column:span 2;}
        .ip-head{padding:15px 16px;border-bottom:1px solid rgba(104,80,68,.07);background:#fdfaf8;display:flex;align-items:center;justify-content:space-between;gap:10px;}
        .ip-head h2{margin:0;font-size:14px;font-weight:600;}
        .ip-body{padding:16px;}
        .ip-k{font-size:10px;letter-spacing:.14em;text-transform:uppercase;color:rgba(104,80,68,.43);}
        .ip-v{font-size:14px;margin:4px 0 14px;}
        .ip-form{display:grid;grid-template-columns:repeat(2,1fr);gap:12px;}
        .ip-field{display:flex;flex-direction:column;gap:6px;}
        .ip-field.full{grid-column:1/-1;}
        .ip-field label{font-size:10px;letter-spacing:.14em;text-transform:uppercase;color:rgba(104,80,68,.43);}
        .ip-field input,.ip-field textarea,.ip-field select{border:1px solid rgba(104,80,68,.15);border-radius:8px;padding:10px 11px;font:inherit;font-size:13px;color:#3a405a;background:#fff;}
        .ip-field textarea{min-height:90px;resize:vertical;}
        .ip-actions{display:flex;gap:8px;flex-wrap:wrap;}
        .ip-message{padding:11px 13px;background:rgba(58,64,90,.08);border-radius:8px;font-size:13px;}
        .ip-warning{padding:12px 14px;background:rgba(218,165,32,.14);color:#856000;border-radius:8px;font-size:13px;}
        .ip-table{width:100%;border-collapse:collapse;}
        .ip-table th{font-size:9.5px;letter-spacing:.14em;text-transform:uppercase;text-align:left;color:rgba(104,80,68,.43);padding:10px;border-bottom:1px solid rgba(104,80,68,.08);}
        .ip-table td{font-size:13px;padding:11px 10px;border-bottom:1px solid rgba(104,80,68,.06);vertical-align:top;}
        .ip-muted{color:rgba(104,80,68,.58);}
        .ip-progress{height:8px;background:rgba(104,80,68,.1);border-radius:99px;overflow:hidden;min-width:120px;}
        .ip-progress span{display:block;height:100%;background:#3a405a;}
        @media(max-width:980px){.ip-grid{grid-template-columns:1fr}.ip-panel.wide{grid-column:auto}}
        @media(max-width:620px){.ip-root{padding:16px}.ip-form{grid-template-columns:1fr}.ip-title{font-size:30px}}
      `}</style>
      <div className="ip-wrap">
        <header className="ip-top">
          <div>
            <h1 className="ip-title">Intern Dashboard</h1>
            <p className="ip-sub">{loading ? "Loading..." : `${data.profile?.full_name || ""} · ${data.profile?.intern_id || ""}`}</p>
          </div>
          <button className="ip-soft" onClick={logout}>Logout</button>
        </header>

        {message && <div className="ip-message">{message}</div>}
        {mustChangePassword && (
          <div className="ip-warning">Please change your temporary password before continuing regular internship activities.</div>
        )}

        <div className="ip-grid">
          <section className="ip-panel">
            <div className="ip-head"><h2>Today Attendance</h2><span className="ip-muted">{today}</span></div>
            <div className="ip-body">
              <div className="ip-k">Check In</div>
              <div className="ip-v">{data.todayAttendance?.check_in || "Not checked in"}</div>
              <div className="ip-k">Check Out</div>
              <div className="ip-v">{data.todayAttendance?.check_out || "Not checked out"}</div>
              <div className="ip-actions">
                <button className="ip-btn" disabled={saving || checkedIn || mustChangePassword} onClick={() => runAction(internApi.checkIn, "Checked in with current server time.")}>Check In</button>
                <button className="ip-soft" disabled={saving || !checkedIn || checkedOut || mustChangePassword} onClick={() => runAction(internApi.checkOut, "Checked out with current server time.")}>Check Out</button>
              </div>
            </div>
          </section>

          <section className="ip-panel">
            <div className="ip-head"><h2>Internship</h2></div>
            <div className="ip-body">
              <div className="ip-k">Role</div><div className="ip-v">{data.profile?.role || "-"}</div>
              <div className="ip-k">Mentor</div><div className="ip-v">{data.profile?.mentor_name || "-"}</div>
              <div className="ip-k">Batch</div><div className="ip-v">{data.profile?.batch_name || "-"}</div>
              <div className="ip-k">Duration</div><div className="ip-v">{dateOnly(data.profile?.start_date) || "-"} to {dateOnly(data.profile?.end_date) || "-"}</div>
            </div>
          </section>

          <section className="ip-panel">
            <div className="ip-head"><h2>Task Snapshot</h2></div>
            <div className="ip-body">
              <div className="ip-k">Pending</div><div className="ip-v">{data.tasks.filter((t) => t.status !== "Completed").length}</div>
              <div className="ip-k">Completed</div><div className="ip-v">{data.tasks.filter((t) => t.status === "Completed").length}</div>
              <div className="ip-k">Reports Submitted</div><div className="ip-v">{data.reports.length}</div>
            </div>
          </section>

          <section className="ip-panel wide">
            <div className="ip-head"><h2>Update Profile</h2></div>
            <form className="ip-body ip-form" onSubmit={saveProfile}>
              <Field label="Mobile"><input value={profile.mobile || ""} onChange={(e) => setProfile((p) => ({ ...p, mobile: e.target.value }))} /></Field>
              <Field label="College"><input value={profile.college || ""} onChange={(e) => setProfile((p) => ({ ...p, college: e.target.value }))} /></Field>
              <Field label="Course"><input value={profile.course || ""} onChange={(e) => setProfile((p) => ({ ...p, course: e.target.value }))} /></Field>
              <Field label="Specialization"><input value={profile.specialization || ""} onChange={(e) => setProfile((p) => ({ ...p, specialization: e.target.value }))} /></Field>
              <Field label="Profile Photo URL"><input value={profile.profile_photo || ""} onChange={(e) => setProfile((p) => ({ ...p, profile_photo: e.target.value }))} /></Field>
              <Field label="Resume URL"><input value={profile.resume || ""} onChange={(e) => setProfile((p) => ({ ...p, resume: e.target.value }))} /></Field>
              <Field label="Upload Photo"><input type="file" accept="image/*" onChange={(e) => uploadFile(e.target.files?.[0], "profile_photo")} /></Field>
              <Field label="Upload Resume"><input type="file" accept=".pdf,.doc,.docx" onChange={(e) => uploadFile(e.target.files?.[0], "resume")} /></Field>
              <button className="ip-btn" disabled={saving}>Save Profile</button>
            </form>
          </section>

          <section className="ip-panel">
            <div className="ip-head"><h2>Password</h2></div>
            <form className="ip-body ip-form" onSubmit={changePassword}>
              <Field label="Current Password" className="full"><input type="password" value={passwordForm.currentPassword} onChange={(e) => setPasswordForm((p) => ({ ...p, currentPassword: e.target.value }))} required /></Field>
              <Field label="New Password" className="full"><input type="password" minLength={8} value={passwordForm.newPassword} onChange={(e) => setPasswordForm((p) => ({ ...p, newPassword: e.target.value }))} required /></Field>
              <button className="ip-btn" disabled={saving}>Change Password</button>
            </form>
          </section>

          <section className="ip-panel">
            <div className="ip-head"><h2>Daily Report</h2></div>
            <form className="ip-body ip-form" onSubmit={submitReport}>
              <Field label="Hours Worked"><input type="number" min="0" max="24" step="0.5" value={report.hours_worked} onChange={(e) => setReport((p) => ({ ...p, hours_worked: e.target.value }))} /></Field>
              <Field label="Attachment URL"><input value={report.attachment} onChange={(e) => setReport((p) => ({ ...p, attachment: e.target.value }))} /></Field>
              <Field label="Upload Attachment"><input type="file" onChange={(e) => uploadFile(e.target.files?.[0], "attachment")} /></Field>
              <Field label="Tasks Assigned" className="full"><textarea value={report.tasks_assigned} onChange={(e) => setReport((p) => ({ ...p, tasks_assigned: e.target.value }))} /></Field>
              <Field label="Tasks Completed" className="full"><textarea required value={report.tasks_completed} onChange={(e) => setReport((p) => ({ ...p, tasks_completed: e.target.value }))} /></Field>
              <Field label="Challenges" className="full"><textarea value={report.challenges} onChange={(e) => setReport((p) => ({ ...p, challenges: e.target.value }))} /></Field>
              <Field label="Tomorrow Plan" className="full"><textarea value={report.tomorrow_plan} onChange={(e) => setReport((p) => ({ ...p, tomorrow_plan: e.target.value }))} /></Field>
              <button className="ip-btn" disabled={saving || mustChangePassword}>Submit Today</button>
            </form>
          </section>

          <section className="ip-panel wide">
            <div className="ip-head"><h2>Tasks</h2></div>
            <TableTasks rows={data.tasks} onProgress={updateTask} disabled={mustChangePassword} />
          </section>

          <section className="ip-panel wide">
            <div className="ip-head"><h2>Recent Attendance</h2></div>
            <SimpleTable rows={data.attendance} columns={["attendance_date", "check_in", "check_out", "status"]} />
          </section>

          <section className="ip-panel">
            <div className="ip-head"><h2>Recent Reports</h2></div>
            <SimpleTable rows={data.reports} columns={["report_date", "hours_worked", "mentor_status"]} />
          </section>
        </div>
      </div>
    </main>
  );
}

function Field({ label, className = "", children }) {
  return <div className={`ip-field ${className}`}><label>{label}</label>{children}</div>;
}

function SimpleTable({ rows, columns }) {
  if (!rows.length) return <div className="ip-body ip-muted">No records yet.</div>;
  return (
    <div style={{ overflowX: "auto" }}>
      <table className="ip-table">
        <thead><tr>{columns.map((col) => <th key={col}>{col.replace(/_/g, " ")}</th>)}</tr></thead>
        <tbody>{rows.slice(0, 8).map((row) => <tr key={row.id}>{columns.map((col) => <td key={col}>{col.includes("date") ? dateOnly(row[col]) : row[col] || "-"}</td>)}</tr>)}</tbody>
      </table>
    </div>
  );
}

function TableTasks({ rows, onProgress, disabled }) {
  if (!rows.length) return <div className="ip-body ip-muted">No assigned tasks yet.</div>;
  return (
    <div style={{ overflowX: "auto" }}>
      <table className="ip-table">
        <thead><tr><th>Task</th><th>Deadline</th><th>Progress</th><th>Status</th><th>Update</th></tr></thead>
        <tbody>
          {rows.map((task) => (
            <tr key={task.id}>
              <td><strong>{task.title}</strong><div className="ip-muted">{task.description || "-"}</div></td>
              <td>{dateOnly(task.deadline) || "-"}</td>
              <td><div className="ip-progress"><span style={{ width: `${task.progress || 0}%` }} /></div><div className="ip-muted">{task.progress || 0}%</div></td>
              <td>{task.status}</td>
              <td><select disabled={disabled} value={task.progress || 0} onChange={(e) => onProgress(task, e.target.value)}>{[0,25,50,75,100].map((value) => <option key={value} value={value}>{value}%</option>)}</select></td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
