import { useEffect, useMemo, useState } from "react";
import { Link, Navigate, useLocation, useNavigate } from "react-router-dom";
import { internApi } from "../../lib/api";

const API = import.meta.env.VITE_API_URL || "";
const MONTH_NAMES = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
const WEEKDAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
const navItems = [
  ["/intern/dashboard", "Dashboard"], ["/intern/profile", "Profile"], ["/intern/reports", "Reports"],
  ["/intern/tasks", "Tasks"], ["/intern/attendance", "Attendance"], ["/intern/certificates", "Certificates"],
];

function dateOnly(value) { return value ? String(value).slice(0, 10) : "-"; }

function Portal({ children, allowIncomplete = false }) {
  const [data, setData] = useState(null);
  const [error, setError] = useState("");
  const location = useLocation();
  const navigate = useNavigate();
  useEffect(() => {
    internApi.getDashboard().then(setData).catch((err) => setError(err.message));
  }, []);
  if (error) return <div className="intern-loading">{error}</div>;
  if (!data) return <div className="intern-loading">Loading portal...</div>;
  if (!allowIncomplete && !data.profileCompletion?.complete) return <Navigate to="/intern/profile" replace />;
  async function logout() { await internApi.logout(); navigate("/intern/login", { replace: true }); }
  return (
    <main className="intern-root">
      <style>{styles}</style>
      <div className="intern-shell">
        <header className="intern-header">
          <div className="intern-brand">
            <img className="intern-logo" src="/logo.svg" alt="DM Infotech" />
            <span>Intern Portal</span>
          </div>
          <button onClick={logout}>Logout</button>
        </header>
        <nav className="intern-nav">
          {navItems.map(([to, label]) => (
            <Link key={to} to={to} className={location.pathname === to ? "active" : ""}>{label}</Link>
          ))}
        </nav>
        {!data.profileCompletion?.complete && (
          <div className="intern-alert">Complete every onboarding field to unlock attendance, reports, tasks, and certificates.</div>
        )}
        {children(data, setData)}
      </div>
    </main>
  );
}

export function InternDashboardPage() {
  return <Portal>{(data, setData) => <Dashboard data={data} refresh={() => internApi.getDashboard().then(setData)} />}</Portal>;
}

function Dashboard({ data, refresh }) {
  const [message, setMessage] = useState("");
  const [saving, setSaving] = useState(false);
  const [lateModal, setLateModal] = useState(null);
  const [halfDayModal, setHalfDayModal] = useState(false);
  const [lateReasonInput, setLateReasonInput] = useState("");
  const checkedIn = Boolean(data.todayAttendance?.check_in);
  const checkedOut = Boolean(data.todayAttendance?.check_out);
  const verificationStatus = data.todayAttendance?.verification_status;

  async function handleCheckIn(reason) {
    try {
      setSaving(true);
      setMessage("");
      await internApi.checkIn(reason);
      setLateModal(null);
      setLateReasonInput("");
      setMessage(reason ? "Checked in. Sent for verification because you're marked late." : "Checked in using server time.");
      await refresh();
    } catch (err) {
      if (err.code === "LATE_REASON_REQUIRED") setLateModal({ text: err.message });
      else setMessage(err?.message || "Something went wrong.");
    } finally {
      setSaving(false);
    }
  }

  async function handleCheckOut(confirmHalfDay) {
    try {
      setSaving(true);
      setMessage("");
      await internApi.checkOut(confirmHalfDay);
      setHalfDayModal(false);
      setMessage(confirmHalfDay ? "Checked out. Today is marked as Half Day." : "Checked out using server time.");
      await refresh();
    } catch (err) {
      if (err.code === "EARLY_CHECKOUT_CONFIRM") setHalfDayModal(true);
      else setMessage(err?.message || "Something went wrong.");
    } finally {
      setSaving(false);
    }
  }

  return (
    <>
      <section className="intern-hero">
        <div>
          <p>Welcome back</p>
          <h1>{data.profile?.full_name}</h1>
          <span>{data.profile?.role || "Intern"} · {data.profile?.intern_id}</span>
        </div>
        <div className="intern-actions">
          <button disabled={saving || checkedIn} onClick={() => handleCheckIn()}>Check In</button>
          <button className="secondary" disabled={saving || !checkedIn || checkedOut} onClick={() => handleCheckOut()}>Check Out</button>
        </div>
      </section>

      {message && <div className="intern-message">{message}</div>}
      {verificationStatus === "Pending" && <div className="intern-badge pending">Today's late check-in is pending verification from higher authority.</div>}
      {verificationStatus === "Rejected" && <div className="intern-badge rejected">Today's late check-in was rejected by admin.</div>}
      {data.todayAttendance?.status === "Half Day" && <div className="intern-badge halfday">Today is marked as Half Day.</div>}

      <section className="intern-stats">
        <Stat label="Check In" value={data.todayAttendance?.check_in || "Not checked in"} />
        <Stat label="Check Out" value={data.todayAttendance?.check_out || "Not checked out"} />
        <Stat label="Pending Tasks" value={data.tasks.filter((task) => task.status !== "Completed").length} />
        <Stat label="Reports" value={data.reports.length} />
      </section>

      <section className="intern-grid">
        <Recent title="Latest Tasks" link="/intern/tasks" rows={data.tasks} render={(row) => <><strong>{row.title}</strong><span>{row.progress || 0}% · {row.status}</span></>} />
        <Recent title="Latest Reports" link="/intern/reports" rows={data.reports} render={(row) => <><strong>{dateOnly(row.report_date)}</strong><span>{row.hours_worked || 0} hrs · {row.mentor_status}</span></>} />
        <Recent title="Latest Attendance" link="/intern/attendance" rows={data.attendance} render={(row) => <><strong>{dateOnly(row.attendance_date)}</strong><span>{row.check_in || "-"} to {row.check_out || "-"} · {row.status}</span></>} />
      </section>

      {lateModal && (
        <div className="intern-overlay" role="dialog" aria-modal="true">
          <div className="intern-modal">
            <h3>You're checking in late</h3>
            <p>{lateModal.text}</p>
            <textarea placeholder="Why are you arriving late?" value={lateReasonInput} onChange={(e) => setLateReasonInput(e.target.value)} autoFocus />
            <div className="intern-modal-actions">
              <button className="secondary" onClick={() => { setLateModal(null); setLateReasonInput(""); }}>Cancel</button>
              <button disabled={saving || !lateReasonInput.trim()} onClick={() => handleCheckIn(lateReasonInput.trim())}>Submit for Verification</button>
            </div>
          </div>
        </div>
      )}

      {halfDayModal && (
        <div className="intern-overlay" role="dialog" aria-modal="true">
          <div className="intern-modal">
            <h3>Check out before 5:30 PM?</h3>
            <p>Checking out now will mark today's attendance as a <strong>Half Day</strong>. Continue?</p>
            <div className="intern-modal-actions">
              <button className="secondary" onClick={() => setHalfDayModal(false)}>Cancel</button>
              <button disabled={saving} onClick={() => handleCheckOut(true)}>Yes, Mark Half Day</button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

function Recent({ title, link, rows, render }) {
  return (
    <section className="intern-card">
      <div className="intern-card-head"><h2>{title}</h2><Link to={link}>View all</Link></div>
      {rows.length ? <div className="intern-list">{rows.slice(0, 5).map((row) => <div key={row.id}>{render(row)}</div>)}</div> : <p className="muted">No records yet.</p>}
    </section>
  );
}

function Stat({ label, value }) {
  return <div className="intern-stat"><span>{label}</span><strong>{value}</strong></div>;
}

export function InternProfilePage() {
  return <Portal allowIncomplete>{(data, setData) => <ProfileForm data={data} setData={setData} />}</Portal>;
}

function ProfileForm({ data, setData }) {
  const [profile, setProfile] = useState(() => ({ ...data.profile, bank_account_number: "", bank_account_number_confirm: "" }));
  const [message, setMessage] = useState("");
  const set = (key, value) => setProfile((prev) => ({ ...prev, [key]: value }));
  async function upload(file, field, privateFile = false) {
    if (!file) return;
    const form = new FormData(); form.append("file", file);
    try {
      const result = privateFile ? await internApi.uploadPrivateDocument(form) : await internApi.uploadFile(form);
      set(field, privateFile ? result.document_key : result.url);
      setMessage("File uploaded. Save profile to attach it.");
    } catch (err) { setMessage(err.message); }
  }
  async function save(event) {
    event.preventDefault();
    if (profile.bank_account_number && profile.bank_account_number !== profile.bank_account_number_confirm) { setMessage("Account numbers do not match."); return; }
    const payload = { ...profile }; delete payload.bank_account_number_confirm;
    try {
      await internApi.updateProfile(payload);
      const next = await internApi.getDashboard();
      setData(next);
      setProfile({ ...next.profile, bank_account_number: "", bank_account_number_confirm: "" });
      setMessage(next.profileCompletion.complete ? "Profile complete. Portal unlocked." : "Profile saved. Complete the remaining required fields.");
    } catch (err) { setMessage(err.message); }
  }
  const viewPrivate = (kind, key) => key ? <a href={`${API}/api/intern/profile/private-document/${kind}`} target="_blank" rel="noreferrer">View current PDF</a> : null;
  const missingLabels = {
    mobile: "mobile number", college: "college", course: "course", specialization: "specialization", resume: "latest resume",
    aadhaar_card_document: "Aadhaar PDF", cancelled_cheque_document: "cancelled cheque PDF", tenth_school: "10th school", tenth_board: "10th board", tenth_passing_year: "10th passing year", tenth_percentage: "10th percentage",
    twelfth_school: "12th school", twelfth_board: "12th board", twelfth_passing_year: "12th passing year", twelfth_percentage: "12th percentage", college_university: "university", college_start_year: "college start year", college_passing_year: "college passing year", college_percentage: "college percentage", bank_account_holder_name: "account holder name", bank_account_number_encrypted: "account number", bank_name: "bank name", bank_ifsc_code: "IFSC code",
  };
  const missing = (data.profileCompletion?.missing || []).map((field) => missingLabels[field] || field);
  return (
    <section className="intern-card">
      <div className="intern-card-head"><div><h1>Complete Your Profile</h1><p className="muted">All marked fields are required before internship work can begin.</p></div></div>
      {!data.profileCompletion?.complete && <div className="intern-alert"><strong>Reports are locked until profile completion.</strong><br />Missing: {missing.join(", ")}.</div>}
      {message && <div className="intern-message">{message}</div>}
      <form className="intern-form" onSubmit={save}>
        <Field label="Mobile"><input required value={profile.mobile || ""} onChange={(e) => set("mobile", e.target.value)} /></Field>
        <Field label="College"><input required value={profile.college || ""} onChange={(e) => set("college", e.target.value)} /></Field>
        <Field label="Course"><input required value={profile.course || ""} onChange={(e) => set("course", e.target.value)} /></Field>
        <Field label="Specialization"><input required value={profile.specialization || ""} onChange={(e) => set("specialization", e.target.value)} /></Field>
        <Field label="10th School"><input required value={profile.tenth_school || ""} onChange={(e) => set("tenth_school", e.target.value)} /></Field>
        <Field label="10th Board"><input required value={profile.tenth_board || ""} onChange={(e) => set("tenth_board", e.target.value)} /></Field>
        <Field label="10th Passing Year"><input required type="number" value={profile.tenth_passing_year || ""} onChange={(e) => set("tenth_passing_year", e.target.value)} /></Field>
        <Field label="10th Percentage"><input required type="number" min="0" max="100" value={profile.tenth_percentage || ""} onChange={(e) => set("tenth_percentage", e.target.value)} /></Field>
        <Field label="12th School"><input required value={profile.twelfth_school || ""} onChange={(e) => set("twelfth_school", e.target.value)} /></Field>
        <Field label="12th Board"><input required value={profile.twelfth_board || ""} onChange={(e) => set("twelfth_board", e.target.value)} /></Field>
        <Field label="12th Passing Year"><input required type="number" value={profile.twelfth_passing_year || ""} onChange={(e) => set("twelfth_passing_year", e.target.value)} /></Field>
        <Field label="12th Percentage"><input required type="number" min="0" max="100" value={profile.twelfth_percentage || ""} onChange={(e) => set("twelfth_percentage", e.target.value)} /></Field>
        <Field label="University"><input required value={profile.college_university || ""} onChange={(e) => set("college_university", e.target.value)} /></Field>
        <Field label="College Start Year"><input required type="number" value={profile.college_start_year || ""} onChange={(e) => set("college_start_year", e.target.value)} /></Field>
        <Field label="College Passing Year"><input required type="number" value={profile.college_passing_year || ""} onChange={(e) => set("college_passing_year", e.target.value)} /></Field>
        <Field label="College Percentage"><input required type="number" min="0" max="100" value={profile.college_percentage || ""} onChange={(e) => set("college_percentage", e.target.value)} /></Field>
        <Field label="Latest Resume"><input required={!profile.resume} type="file" accept=".pdf,.doc,.docx" onChange={(e) => upload(e.target.files?.[0], "resume")} />{profile.resume && <span>Resume uploaded</span>}</Field>
        <Field label="Aadhaar Card PDF"><input required={!profile.aadhaar_card_document} type="file" accept=".pdf,application/pdf" onChange={(e) => upload(e.target.files?.[0], "aadhaar_card_document", true)} />{viewPrivate("aadhaar", profile.aadhaar_card_document)}</Field>
        <Field label="Cancelled Cheque PDF"><input required={!profile.cancelled_cheque_document} type="file" accept=".pdf,application/pdf" onChange={(e) => upload(e.target.files?.[0], "cancelled_cheque_document", true)} />{viewPrivate("cancelled_cheque", profile.cancelled_cheque_document)}</Field>
        <Field label="Account Holder Name"><input required value={profile.bank_account_holder_name || ""} onChange={(e) => set("bank_account_holder_name", e.target.value)} /></Field>
        <Field label="Bank Name"><input required value={profile.bank_name || ""} onChange={(e) => set("bank_name", e.target.value)} /></Field>
        <Field label="IFSC Code"><input required maxLength="11" value={profile.bank_ifsc_code || ""} onChange={(e) => set("bank_ifsc_code", e.target.value.toUpperCase())} /></Field>
        <Field label="Account Number"><input required={!data.profile?.bank_account_masked} type="password" placeholder={data.profile?.bank_account_masked || "Enter account number"} value={profile.bank_account_number} onChange={(e) => set("bank_account_number", e.target.value)} /></Field>
        <Field label="Confirm Account Number"><input required={!data.profile?.bank_account_masked} type="password" value={profile.bank_account_number_confirm} onChange={(e) => set("bank_account_number_confirm", e.target.value)} /></Field>
        <button className="primary" type="submit">Save Profile</button>
      </form>
    </section>
  );
}

export function InternReportsPage() { return <Portal>{() => <Reports />}</Portal>; }
function Reports() {
  const [rows, setRows] = useState([]);
  const [form, setForm] = useState({ tasks_assigned: "", tasks_completed: "", hours_worked: 8, challenges: "", tomorrow_plan: "", attachment: "" });
  const [message, setMessage] = useState("");
  const load = () => internApi.getHistory("reports").then((r) => setRows(r.rows));
  useEffect(() => { load(); }, []);
  async function submit(e) {
    e.preventDefault();
    try { await internApi.submitReport(form); setMessage("Daily report submitted."); setForm({ tasks_assigned: "", tasks_completed: "", hours_worked: 8, challenges: "", tomorrow_plan: "", attachment: "" }); load(); }
    catch (err) { setMessage(err.message); }
  }
  async function upload(file) {
    if (!file) return;
    const f = new FormData(); f.append("file", file);
    try { const r = await internApi.uploadFile(f); setForm((p) => ({ ...p, attachment: r.url })); }
    catch (err) { setMessage(err.message); }
  }
  return (
    <section className="intern-card">
      <div className="intern-card-head"><h1>Daily Reports</h1></div>
      {message && <div className="intern-message">{message}</div>}
      <form className="intern-form report-form" onSubmit={submit}>
        <Field label="Hours Worked"><input type="number" min="0" max="24" step="0.5" value={form.hours_worked} onChange={(e) => setForm({ ...form, hours_worked: e.target.value })} /></Field>
        <Field label="Attachment"><input type="file" onChange={(e) => upload(e.target.files?.[0])} /></Field>
        <Field label="Tasks Assigned" full><textarea value={form.tasks_assigned} onChange={(e) => setForm({ ...form, tasks_assigned: e.target.value })} /></Field>
        <Field label="Tasks Completed" full><textarea required value={form.tasks_completed} onChange={(e) => setForm({ ...form, tasks_completed: e.target.value })} /></Field>
        <Field label="Challenges" full><textarea value={form.challenges} onChange={(e) => setForm({ ...form, challenges: e.target.value })} /></Field>
        <Field label="Tomorrow Plan" full><textarea value={form.tomorrow_plan} onChange={(e) => setForm({ ...form, tomorrow_plan: e.target.value })} /></Field>
        <button className="primary">Submit Report</button>
      </form>
      <HistoryTable rows={rows} columns={["report_date", "hours_worked", "mentor_status", "mentor_feedback"]} download={(row) => <a className="small-button" href={`${API}/api/intern/reports/${row.id}/download`}>PDF</a>} />
    </section>
  );
}

export function InternTasksPage() { return <Portal>{() => <Tasks />}</Portal>; }
function Tasks() {
  const [rows, setRows] = useState([]);
  const [filter, setFilter] = useState("All");
  const load = () => internApi.getHistory("tasks").then((r) => setRows(r.rows));
  useEffect(() => { load(); }, []);
  const shown = useMemo(() => filter === "All" ? rows : rows.filter((r) => r.status === filter), [rows, filter]);
  return (
    <section className="intern-card">
      <div className="intern-card-head"><h1>Tasks</h1><select value={filter} onChange={(e) => setFilter(e.target.value)}>{["All", "Pending", "In Progress", "Completed", "Overdue"].map((x) => <option key={x}>{x}</option>)}</select></div>
      <HistoryTable rows={shown} columns={["title", "deadline", "priority", "status", "progress"]} action={(row) => <select value={row.progress || 0} onChange={async (e) => { await internApi.updateTask(row.id, { progress: e.target.value }); load(); }}>{[0, 25, 50, 75, 100].map((n) => <option key={n} value={n}>{n}%</option>)}</select>} />
    </section>
  );
}

export function InternAttendancePage() { return <Portal>{() => <Attendance />}</Portal>; }
function Attendance() {
  const [data, setData] = useState({ rows: [], summary: {} });
  const now = new Date();
  const [cursor, setCursor] = useState({ year: now.getFullYear(), month: now.getMonth() + 1 });
  const [calendar, setCalendar] = useState({ days: {} });
  const [leaves, setLeaves] = useState([]);
  const [leaveForm, setLeaveForm] = useState({ start_date: "", end_date: "", reason: "" });
  const [message, setMessage] = useState("");
  const [saving, setSaving] = useState(false);

  useEffect(() => { internApi.getHistory("attendance").then(setData); }, []);
  useEffect(() => { loadLeaves(); }, []);
  useEffect(() => { loadCalendar(); }, [cursor.year, cursor.month]);

  async function loadCalendar() {
    try { setCalendar(await internApi.getCalendar(cursor.year, cursor.month)); }
    catch { setCalendar({ days: {} }); }
  }
  async function loadLeaves() {
    try { setLeaves(await internApi.getMyLeaves()); }
    catch { setLeaves([]); }
  }
  async function submitLeave(event) {
    event.preventDefault();
    if (!leaveForm.start_date) return;
    try {
      setSaving(true);
      await internApi.requestLeave(leaveForm);
      setMessage("Leave request submitted.");
      setLeaveForm({ start_date: "", end_date: "", reason: "" });
      await loadLeaves();
    } catch (err) { setMessage(err?.message || "Something went wrong."); }
    finally { setSaving(false); }
  }
  function changeMonth(delta) {
    setCursor((prev) => {
      let month = prev.month + delta, year = prev.year;
      if (month < 1) { month = 12; year -= 1; }
      if (month > 12) { month = 1; year += 1; }
      return { year, month };
    });
  }

  return (
    <>
      <section className="intern-card">
        <div className="intern-card-head"><h1>Attendance</h1></div>
        <section className="intern-stats">
          <Stat label="Total Days" value={data.summary.totalDays || 0} />
          <Stat label="Present" value={data.summary.presentDays || 0} />
          <Stat label="Absent" value={data.summary.absentDays || 0} />
          <Stat label="Working Hours" value={data.summary.totalHours || 0} />
        </section>
        <HistoryTable rows={data.rows} columns={["attendance_date", "check_in", "check_out", "working_hours", "status"]} />
      </section>

      <section className="intern-card">
        <div className="intern-card-head">
          <h1>Attendance Calendar</h1>
          <div className="intern-cal-nav">
            <button className="small-button" onClick={() => changeMonth(-1)}>‹</button>
            <span>{MONTH_NAMES[cursor.month - 1]} {cursor.year}</span>
            <button className="small-button" onClick={() => changeMonth(1)}>›</button>
          </div>
        </div>
        <Calendar year={cursor.year} month={cursor.month} days={calendar.days} />
        <div className="intern-legend">
          <span><i className="dot p" />P Present</span>
          <span><i className="dot l" />L Late</span>
          <span><i className="dot a" />A Absent</span>
          <span><i className="dot h" />H Half Day</span>
          <span><i className="dot ol" />OL On Leave</span>
          <span><i className="dot holiday" />Holiday (blank)</span>
        </div>
      </section>

      <section className="intern-card">
        <div className="intern-card-head"><h1>Request Leave</h1></div>
        {message && <div className="intern-message">{message}</div>}
        <form className="intern-form report-form" onSubmit={submitLeave}>
          <Field label="From"><input type="date" required value={leaveForm.start_date} onChange={(e) => setLeaveForm((p) => ({ ...p, start_date: e.target.value }))} /></Field>
          <Field label="To"><input type="date" required value={leaveForm.end_date} onChange={(e) => setLeaveForm((p) => ({ ...p, end_date: e.target.value }))} /></Field>
          <Field label="Reason" full><textarea value={leaveForm.reason} onChange={(e) => setLeaveForm((p) => ({ ...p, reason: e.target.value }))} /></Field>
          <button className="primary" disabled={saving}>Submit Leave Request</button>
        </form>
        <HistoryTable rows={leaves} columns={["start_date", "end_date", "status"]} />
      </section>
    </>
  );
}

function Calendar({ year, month, days }) {
  const first = new Date(year, month - 1, 1);
  const daysInMonth = new Date(year, month, 0).getDate();
  const leadingBlanks = first.getDay();
  const cells = [...Array(leadingBlanks).fill(null), ...Array(daysInMonth).fill(0).map((_, i) => i + 1)];
  const codeClass = { P: "p", L: "l", A: "a", H: "h", OL: "ol" };
  return (
    <div className="intern-cal">
      <div className="intern-cal-grid intern-cal-head">{WEEKDAYS.map((day) => <div key={day}>{day}</div>)}</div>
      <div className="intern-cal-grid">
        {cells.map((day, index) => {
          if (!day) return <div key={`blank-${index}`} className="intern-cal-cell empty" />;
          const dateKey = `${year}-${String(month).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
          const info = days[dateKey];
          const isHoliday = info && !info.code;
          return (
            <div key={dateKey} className={`intern-cal-cell ${isHoliday ? "holiday" : ""}`} title={info?.label || ""}>
              <span className="intern-cal-date">{day}</span>
              {info?.code && <span className={`intern-cal-code ${codeClass[info.code] || ""}`}>{info.code}</span>}
            </div>
          );
        })}
      </div>
    </div>
  );
}

export function InternCertificatesPage() { return <Portal>{() => <Certificates />}</Portal>; }
function Certificates() {
  const [rows, setRows] = useState([]);
  useEffect(() => { internApi.getCertificates().then((r) => setRows(r.certificates)); }, []);
  return (
    <section className="intern-card">
      <div className="intern-card-head"><h1>Certificates</h1></div>
      {rows.length
        ? <HistoryTable rows={rows} columns={["certificate_id", "issued_at", "status"]} download={(row) => row.status === "Issued" && <a className="small-button" href={`${API}/api/intern/certificates/${row.certificate_id}/download`}>Download PDF</a>} />
        : <p className="muted">Your certificate will appear here after an administrator issues it.</p>}
    </section>
  );
}

function HistoryTable({ rows, columns, download, action }) {
  if (!rows.length) return <p className="muted">No records found.</p>;
  return (
    <div className="table-wrap">
      <table>
        <thead><tr>{columns.map((c) => <th key={c}>{c.replaceAll("_", " ")}</th>)}{(download || action) && <th>Action</th>}</tr></thead>
        <tbody>
          {rows.map((row) => (
            <tr key={row.id}>
              <>{columns.map((c) => <td key={c}>{c.includes("date") ? dateOnly(row[c]) : row[c] || "-"}</td>)}</>
              {(download || action) && <td>{download?.(row)}{action?.(row)}</td>}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function Field({ label, children, full = false }) {
  return <label className={full ? "field full" : "field"}><span>{label}</span>{children}</label>;
}

const styles = `
@import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@400;500;600&family=DM+Sans:wght@300;400;500;700&display=swap');
.intern-root{min-height:100vh;background:#f5f0eb;color:#3a405a;font-family:'DM Sans',sans-serif;padding:24px}
.intern-shell{max-width:1200px;margin:auto}
.intern-header{display:flex;justify-content:space-between;align-items:center;padding-bottom:18px}
.intern-brand{display:flex;flex-direction:column;align-items:center;gap:4px}
.intern-logo{height:56px;width:202px;object-fit:contain}
.intern-brand span{font-family:'Cormorant Garamond',serif;font-size:15px;font-weight:600;letter-spacing:.06em;text-transform:uppercase;color:#3a405a}
.muted{color:rgba(104,80,68,.58);font-size:13px}
.intern-header button,.secondary,.small-button{border:1px solid rgba(104,80,68,.15);background:#fff;color:#3a405a;border-radius:8px;padding:9px 13px;cursor:pointer;text-decoration:none;font-size:12px;font-family:inherit;font-weight:500}
.intern-nav{display:flex;gap:4px;overflow:auto;border-bottom:1px solid rgba(104,80,68,.12);margin-bottom:22px}
.intern-nav a{padding:11px 13px;text-decoration:none;color:rgba(58,64,90,.6);white-space:nowrap;font-size:13px}
.intern-nav a.active{color:#3a405a;border-bottom:2px solid #3a405a;font-weight:600}
.intern-hero{display:flex;justify-content:space-between;align-items:end;gap:20px;background:#3a405a;color:#f9dec9;padding:28px;border-radius:12px;box-shadow:0 18px 40px -18px rgba(58,64,90,.5)}
.intern-hero p{margin:0 0 5px;color:rgba(249,222,201,.75);font-size:13px}
.intern-hero h1{font-family:'Cormorant Garamond',serif;font-weight:600;font-size:32px;margin:0 0 5px}
.intern-hero span{font-size:13px;color:rgba(249,222,201,.75)}
.intern-actions{display:flex;gap:8px}
.primary,.intern-actions button{background:#f9dec9;border:0;border-radius:8px;color:#3a405a;padding:10px 16px;font-weight:700;cursor:pointer;font-family:inherit;font-size:12px;letter-spacing:.03em}
.intern-actions .secondary{background:transparent;color:#f9dec9;border:1px solid rgba(249,222,201,.4)}
.intern-actions button:disabled,.primary:disabled{opacity:.5;cursor:not-allowed}
.intern-message{margin:16px 0;padding:12px 14px;border-radius:10px;background:rgba(153,178,221,.16);color:#3a405a;font-size:13px}
.intern-alert{margin:16px 0;padding:12px 14px;border-radius:10px;background:rgba(233,175,163,.22);color:#8a4a1f;font-size:13px}
.intern-badge{margin:14px 0;padding:10px 14px;border-radius:10px;font-size:12.5px;font-weight:600}
.intern-badge.pending{background:rgba(255,180,0,.15);color:#8a6400}
.intern-badge.rejected{background:rgba(230,60,60,.14);color:#a02222}
.intern-badge.halfday{background:rgba(153,178,221,.22);color:#3a405a}
.intern-stats{display:grid;grid-template-columns:repeat(4,1fr);gap:12px;margin:18px 0}
.intern-stat,.intern-card{background:#fff;border:1px solid rgba(104,80,68,.09);border-radius:12px}
.intern-stat{padding:15px}
.intern-stat span{display:block;color:rgba(104,80,68,.5);font-size:11px;text-transform:uppercase;letter-spacing:.06em}
.intern-stat strong{display:block;margin-top:7px;font-size:20px;font-family:'Cormorant Garamond',serif}
.intern-grid{display:grid;grid-template-columns:repeat(3,1fr);gap:14px}
.intern-card{padding:20px;margin-bottom:18px;box-shadow:0 10px 26px -20px rgba(58,64,90,.3)}
.intern-card-head{display:flex;justify-content:space-between;gap:12px;align-items:center;margin-bottom:14px;flex-wrap:wrap}
.intern-card h1,.intern-card h2{margin:0;font-size:18px;font-family:'Cormorant Garamond',serif;font-weight:600}
.intern-card-head a{font-size:12px;color:#3a405a;text-decoration:underline}
.intern-list>div{padding:12px 0;border-top:1px solid rgba(104,80,68,.08);display:flex;flex-direction:column;gap:4px}
.intern-list span{font-size:12px;color:rgba(104,80,68,.58)}
.intern-form{display:grid;grid-template-columns:repeat(3,1fr);gap:14px}
.field{display:flex;flex-direction:column;gap:6px;font-size:12px;color:rgba(104,80,68,.7)}
.field span{text-transform:uppercase;letter-spacing:.09em;font-size:10px;color:rgba(104,80,68,.5)}
.field.full{grid-column:1/-1}
.field input,.field textarea,.field select,.intern-card select{box-sizing:border-box;border:1px solid rgba(104,80,68,.15);border-radius:8px;padding:10px;font:inherit;color:#3a405a;background:#fbfaf8}
.field input:focus,.field textarea:focus,.field select:focus{outline:2px solid rgba(58,64,90,.25);border-color:#3a405a}
.field textarea{min-height:100px;resize:vertical}
.field a,.field>span:last-child{font-size:11px;color:#3a405a}
.report-form{grid-template-columns:repeat(2,1fr)}
.table-wrap{overflow:auto}
table{width:100%;border-collapse:collapse;min-width:650px}
th,td{text-align:left;padding:11px;border-bottom:1px solid rgba(104,80,68,.08);font-size:12px}
th{text-transform:uppercase;font-size:10px;color:rgba(104,80,68,.5);letter-spacing:.06em}
.intern-loading{min-height:100vh;display:grid;place-items:center;background:#f5f0eb;color:#3a405a;font-family:'DM Sans',sans-serif}
.intern-cal-nav{display:flex;align-items:center;gap:10px;font-size:12.5px;font-weight:700}
.intern-cal-nav .small-button{padding:5px 10px}
.intern-cal-grid{display:grid;grid-template-columns:repeat(7,1fr);gap:6px}
.intern-cal-head{margin-bottom:6px;text-align:center;font-size:10px;letter-spacing:.1em;text-transform:uppercase;color:rgba(104,80,68,.5)}
.intern-cal-cell{position:relative;aspect-ratio:1/1;border-radius:10px;background:#fbfaf8;border:1px solid rgba(104,80,68,.07);display:flex;flex-direction:column;align-items:center;justify-content:center;gap:2px}
.intern-cal-cell.empty{background:transparent;border:none}
.intern-cal-cell.holiday{background:repeating-linear-gradient(135deg,#f5f0eb,#f5f0eb 6px,#ece4d8 6px,#ece4d8 12px)}
.intern-cal-date{font-size:10.5px;color:rgba(104,80,68,.5)}
.intern-cal-code{font-size:14px;font-weight:800;line-height:1}
.intern-cal-code.p{color:#1f9d55}
.intern-cal-code.l{color:#c98a00}
.intern-cal-code.a{color:#d13c3c}
.intern-cal-code.h{color:#3a405a}
.intern-cal-code.ol{color:#5a7ab5}
.intern-legend{display:flex;flex-wrap:wrap;gap:14px;margin-top:14px;font-size:11.5px;color:rgba(104,80,68,.6)}
.intern-legend span{display:flex;align-items:center;gap:5px}
.intern-legend .dot{width:9px;height:9px;border-radius:3px;display:inline-block}
.intern-legend .dot.p{background:#1f9d55}
.intern-legend .dot.l{background:#c98a00}
.intern-legend .dot.a{background:#d13c3c}
.intern-legend .dot.h{background:#3a405a}
.intern-legend .dot.ol{background:#5a7ab5}
.intern-legend .dot.holiday{background:repeating-linear-gradient(135deg,#f5f0eb,#f5f0eb 3px,#ece4d8 3px,#ece4d8 6px);border:1px solid rgba(104,80,68,.15)}
.intern-overlay{position:fixed;inset:0;background:rgba(35,30,25,.5);backdrop-filter:blur(3px);display:flex;align-items:center;justify-content:center;padding:20px;z-index:50}
.intern-modal{background:#fff;border-radius:16px;max-width:420px;width:100%;padding:24px;box-shadow:0 30px 70px -20px rgba(0,0,0,.35)}
.intern-modal h3{margin:0 0 8px;font-family:'Cormorant Garamond',serif;font-size:20px;font-weight:600}
.intern-modal p{margin:0 0 14px;font-size:13px;color:rgba(104,80,68,.65);line-height:1.5}
.intern-modal textarea{width:100%;border:1px solid rgba(104,80,68,.16);border-radius:8px;padding:10px 12px;font:inherit;font-size:13px;min-height:90px;resize:vertical;margin-bottom:14px}
.intern-modal-actions{display:flex;gap:8px;justify-content:flex-end}
.intern-modal-actions button{background:#3a405a;color:#f9dec9;border:0;border-radius:8px;padding:9px 15px;font-size:12px;font-weight:600;cursor:pointer}
.intern-modal-actions .secondary{background:#fff;color:#3a405a;border:1px solid rgba(104,80,68,.15)}
@media(max-width:800px){.intern-root{padding:14px}.intern-hero{align-items:start;flex-direction:column}.intern-stats,.intern-grid,.intern-form,.report-form{grid-template-columns:1fr}.intern-actions{width:100%}.intern-actions button{flex:1}}
`;
