import { useEffect, useMemo, useState } from "react";
import { adminApi } from "../../lib/api";

const emptyIntern = {
  intern_id: "",
  full_name: "",
  email: "",
  mobile: "",
  college: "",
  course: "",
  specialization: "",
  role: "",
  mentor_id: "",
  batch_id: "",
  start_date: "",
  end_date: "",
  status: "Applied",
  resume: "",
  password: "",
  login_enabled: true,
};

const today = new Date().toISOString().slice(0, 10);

function dateOnly(value) {
  if (!value) return "";
  return String(value).slice(0, 10);
}

function statusClass(status = "") {
  return status.toLowerCase().replace(/\s+/g, "-");
}

function adminInternDocumentUrl(internId, type) {
  return `${import.meta.env.VITE_API_URL || ""}/api/admin/internships/interns/${internId}/documents/${type}`;
}

export default function InternshipsPage() {
  const [data, setData] = useState({
    stats: {},
    interns: [],
    mentors: [],
    batches: [],
    reports: [],
    attendance: [],
    tasks: [],
    certificates: [],
  });
  const [activeTab, setActiveTab] = useState("interns");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [editingId, setEditingId] = useState(null);
  const [filters, setFilters] = useState({ batch: "", college: "", role: "", status: "" });
  const [internForm, setInternForm] = useState(emptyIntern);
  const [attendanceForm, setAttendanceForm] = useState({
    intern_id: "",
    attendance_date: today,
    check_in: "10:00",
    check_out: "",
    work_mode: "Office",
    status: "Present",
    remarks: "",
  });
  const [reportForm, setReportForm] = useState({
    intern_id: "",
    report_date: today,
    tasks_assigned: "",
    tasks_completed: "",
    hours_worked: 8,
    challenges: "",
    tomorrow_plan: "",
    attachment: "",
  });
  const [taskForm, setTaskForm] = useState({
    title: "",
    description: "",
    priority: "Medium",
    deadline: "",
    assigned_to: "",
    mentor_id: "",
    progress: 0,
    status: "Pending",
  });
  const [certificateSettings, setCertificateSettings] = useState({ signature_image: "", signer_name: "", signer_designation: "" });
  const [leaves, setLeaves] = useState([]);
  const [holidays, setHolidays] = useState([]);
  const [holidayForm, setHolidayForm] = useState({ holiday_date: "", name: "" });
  const [officeNetwork, setOfficeNetworkState] = useState({});
  const [settingOfficeNetwork, setSettingOfficeNetwork] = useState(false);
  const [showInternModal, setShowInternModal] = useState(false);
  const [showAttendanceModal, setShowAttendanceModal] = useState(false);

  useEffect(() => {
    loadData();
  }, []);

  async function loadData() {
    try {
      setLoading(true);
      setError("");
      const [res, certificateResult, settingsResult, leavesResult, holidaysResult, officeNetworkResult] = await Promise.all([
        adminApi.getInternships(), adminApi.getInternCertificates(), adminApi.getInternCertificateSettings(),
        adminApi.getLeaves(), adminApi.getHolidays(), adminApi.getOfficeNetwork(),
      ]);
      setData({
        stats: res.stats || {},
        interns: res.interns || [],
        mentors: res.mentors || [],
        batches: res.batches || [],
        reports: res.reports || [],
        attendance: res.attendance || [],
        tasks: res.tasks || [],
        certificates: certificateResult.certificates || [],
      });
      setCertificateSettings(settingsResult || {});
      setLeaves(leavesResult || []);
      setHolidays(holidaysResult || []);
      setOfficeNetworkState(officeNetworkResult || {});
    } catch (err) {
      console.error(err);
      setError(err?.message || "Failed to load internship module.");
    } finally {
      setLoading(false);
    }
  }

  async function saveOfficeNetwork() {
    try {
      setSettingOfficeNetwork(true);
      await adminApi.setOfficeNetwork();
      await loadData();
    } catch (err) {
      console.error(err);
      alert(err?.message || "Unable to set office network.");
    } finally {
      setSettingOfficeNetwork(false);
    }
  }

  async function clearOfficeNetwork() {
    if (!window.confirm("Unset office network? Interns will be able to mark attendance from any network.")) return;
    try {
      setSettingOfficeNetwork(true);
      await adminApi.unsetOfficeNetwork();
      await loadData();
    } catch (err) {
      console.error(err);
      alert(err?.message || "Unable to unset office network.");
    } finally {
      setSettingOfficeNetwork(false);
    }
  }

  async function reviewLeave(id, status) {
    try {
      await adminApi.reviewLeave(id, status);
      await loadData();
    } catch (err) {
      console.error(err);
      alert(err?.message || "Unable to update leave request.");
    }
  }

  async function saveHoliday(event) {
    event.preventDefault();
    try {
      setSaving(true);
      await adminApi.addHoliday(holidayForm);
      setHolidayForm({ holiday_date: "", name: "" });
      await loadData();
    } catch (err) {
      console.error(err);
      alert(err?.message || "Unable to save holiday.");
    } finally {
      setSaving(false);
    }
  }

  async function removeHoliday(id) {
    try {
      await adminApi.deleteHoliday(id);
      await loadData();
    } catch (err) {
      console.error(err);
      alert(err?.message || "Unable to delete holiday.");
    }
  }

  const filteredInterns = useMemo(() => {
    return data.interns.filter((intern) => {
      const matchesBatch = !filters.batch || String(intern.batch_id || "") === filters.batch;
      const matchesCollege = !filters.college || intern.college === filters.college;
      const matchesRole = !filters.role || intern.role === filters.role;
      const matchesStatus = !filters.status || intern.status === filters.status;
      return matchesBatch && matchesCollege && matchesRole && matchesStatus;
    });
  }, [data.interns, filters]);

  const colleges = useMemo(
    () => [...new Set(data.interns.map((item) => item.college).filter(Boolean))],
    [data.interns]
  );
  const roles = useMemo(
    () => [...new Set(data.interns.map((item) => item.role).filter(Boolean))],
    [data.interns]
  );

  function updateInternForm(key, value) {
    setInternForm((prev) => ({ ...prev, [key]: value }));
  }

  function openAddIntern() {
    setEditingId(null);
    setInternForm(emptyIntern);
    setShowInternModal(true);
  }

  function closeInternModal() {
    setShowInternModal(false);
    setEditingId(null);
    setInternForm(emptyIntern);
  }

  function startEdit(intern) {
    setEditingId(intern.id);
    setInternForm({
      intern_id: intern.intern_id || "",
      full_name: intern.full_name || "",
      email: intern.email || "",
      mobile: intern.mobile || "",
      college: intern.college || "",
      course: intern.course || "",
      specialization: intern.specialization || "",
      role: intern.role || "",
      mentor_id: intern.mentor_id || "",
      batch_id: intern.batch_id || "",
      start_date: dateOnly(intern.start_date),
      end_date: dateOnly(intern.end_date),
      status: intern.status || "Applied",
      resume: intern.resume || "",
      password: "",
      login_enabled: Boolean(intern.login_enabled ?? true),
    });
    setShowInternModal(true);
  }

  async function saveIntern(event) {
    event.preventDefault();
    try {
      setSaving(true);
      if (editingId) await adminApi.updateIntern(editingId, internForm);
      else await adminApi.createIntern(internForm);
      closeInternModal();
      await loadData();
    } catch (err) {
      console.error(err);
      alert(err?.message || "Unable to save intern.");
    } finally {
      setSaving(false);
    }
  }

  async function deleteIntern(id) {
    if (!window.confirm("Delete this intern and their related MVP records?")) return;
    try {
      await adminApi.deleteIntern(id);
      await loadData();
    } catch (err) {
      console.error(err);
      alert(err?.message || "Unable to delete intern.");
    }
  }

  async function saveAttendance(event) {
    event.preventDefault();
    try {
      setSaving(true);
      await adminApi.saveInternAttendance(attendanceForm);
      setAttendanceForm((prev) => ({ ...prev, check_out: "", remarks: "" }));
      setShowAttendanceModal(false);
      await loadData();
    } catch (err) {
      console.error(err);
      alert(err?.message || "Unable to save attendance.");
    } finally {
      setSaving(false);
    }
  }

  async function verifyAttendance(id, status) {
    try {
      await adminApi.verifyAttendance(id, status);
      await loadData();
    } catch (err) {
      console.error(err);
      alert(err?.message || "Unable to update verification.");
    }
  }

  async function saveReport(event) {
    event.preventDefault();
    try {
      setSaving(true);
      await adminApi.saveInternReport(reportForm);
      setReportForm((prev) => ({
        ...prev,
        tasks_assigned: "",
        tasks_completed: "",
        challenges: "",
        tomorrow_plan: "",
        attachment: "",
      }));
      await loadData();
    } catch (err) {
      console.error(err);
      alert(err?.message || "Unable to save report.");
    } finally {
      setSaving(false);
    }
  }

  async function reviewReport(id, mentor_status) {
    const mentor_feedback = window.prompt("Mentor feedback", "");
    try {
      await adminApi.reviewInternReport(id, { mentor_status, mentor_feedback: mentor_feedback || "" });
      await loadData();
    } catch (err) {
      console.error(err);
      alert(err?.message || "Unable to review report.");
    }
  }

  async function saveTask(event) {
    event.preventDefault();
    try {
      setSaving(true);
      await adminApi.createInternTask(taskForm);
      setTaskForm({
        title: "",
        description: "",
        priority: "Medium",
        deadline: "",
        assigned_to: "",
        mentor_id: "",
        progress: 0,
        status: "Pending",
      });
      await loadData();
    } catch (err) {
      console.error(err);
      alert(err?.message || "Unable to save task.");
    } finally {
      setSaving(false);
    }
  }

  async function updateTask(task, progress) {
    const nextStatus = Number(progress) === 100 ? "Completed" : Number(progress) > 0 ? "In Progress" : "Pending";
    try {
      await adminApi.updateInternTask(task.id, { progress, status: nextStatus });
      await loadData();
    } catch (err) {
      console.error(err);
      alert(err?.message || "Unable to update task.");
    }
  }

  async function saveCertificateSettings(event) {
    event.preventDefault();
    try { setSaving(true); await adminApi.updateInternCertificateSettings(certificateSettings); await loadData(); }
    catch (err) { alert(err?.message || "Unable to save certificate settings."); }
    finally { setSaving(false); }
  }

  async function uploadCertificateSignature(file) {
    if (!file) return;
    try { const fd = new FormData(); fd.append("file", file); fd.append("mediaKey", "intern_certificate_signature"); const result = await adminApi.uploadMedia(fd); setCertificateSettings((prev) => ({ ...prev, signature_image: result.filePath })); }
    catch (err) { alert(err?.message || "Unable to upload signature."); }
  }

  async function issueCertificate(internId) {
    try { await adminApi.issueInternCertificate(internId); await loadData(); }
    catch (err) { alert(err?.message || "Unable to issue certificate."); }
  }

  async function revokeCertificate(id) {
    const reason = window.prompt("Reason for revocation", "");
    if (reason === null) return;
    try { await adminApi.revokeInternCertificate(id, reason); await loadData(); }
    catch (err) { alert(err?.message || "Unable to revoke certificate."); }
  }

  return (
    <div className="ims-root">
      <style>{`
        .ims-root{display:flex;flex-direction:column;gap:26px;color:#3a405a;}
        .ims-top{display:flex;align-items:flex-end;justify-content:space-between;gap:18px;flex-wrap:wrap;}
        .ims-title{font-family:'Cormorant Garamond',serif;font-size:34px;font-weight:400;margin:0;color:#3a405a;}
        .ims-sub{font-size:13px;color:rgba(104,80,68,0.58);margin:4px 0 0;}
        .ims-actions{display:flex;gap:8px;flex-wrap:wrap;}
        .ims-tab{border:1px solid rgba(104,80,68,0.12);background:#fff;padding:9px 13px;border-radius:8px;color:#685044;font-size:12px;cursor:pointer;}
        .ims-tab.active{background:#3a405a;color:#f9dec9;border-color:#3a405a;}
        .ims-grid{display:grid;grid-template-columns:repeat(6,minmax(120px,1fr));gap:12px;}
        .ims-card{background:#fff;border:1px solid rgba(104,80,68,0.09);border-radius:8px;padding:16px;}
        .ims-k{font-size:10px;letter-spacing:.14em;text-transform:uppercase;color:rgba(104,80,68,.42);}
        .ims-v{font-family:'Cormorant Garamond',serif;font-size:30px;margin-top:5px;color:#3a405a;}
        .ims-panel{background:#fff;border:1px solid rgba(104,80,68,0.09);border-radius:8px;overflow:hidden;}
        .ims-panel-head{display:flex;align-items:center;justify-content:space-between;gap:12px;padding:16px 18px;border-bottom:1px solid rgba(104,80,68,0.07);background:#fdfaf8;}
        .ims-panel-title{font-size:14px;font-weight:500;margin:0;}
        .ims-form{display:grid;grid-template-columns:repeat(4,minmax(150px,1fr));gap:16px;padding:20px;}
        .ims-field{display:flex;flex-direction:column;gap:6px;}
        .ims-field.wide{grid-column:span 2;}
        .ims-field.full{grid-column:1/-1;}
        .ims-field label{font-size:10px;letter-spacing:.13em;text-transform:uppercase;color:rgba(104,80,68,.45);}
        .ims-field input,.ims-field select,.ims-field textarea{width:100%;border:1px solid rgba(104,80,68,.14);border-radius:8px;background:#fff;padding:10px 11px;font-family:'DM Sans',sans-serif;font-size:13px;color:#3a405a;}
        .ims-field textarea{min-height:86px;resize:vertical;}
        .ims-submit{align-self:end;border:0;border-radius:8px;background:#3a405a;color:#f9dec9;padding:11px 15px;font-size:11px;font-weight:500;letter-spacing:.08em;text-transform:uppercase;cursor:pointer;}
        .ims-submit:disabled{opacity:.7;cursor:not-allowed;}
        .ims-secondary{border:1px solid rgba(104,80,68,.14);background:#fff;color:#3a405a;border-radius:8px;padding:10px 13px;font-size:12px;cursor:pointer;}
        .ims-filters{display:grid;grid-template-columns:repeat(4,minmax(130px,1fr));gap:10px;padding:14px 18px;border-bottom:1px solid rgba(104,80,68,.07);}
        .ims-table-wrap{overflow-x:auto;}
        .ims-table{width:100%;border-collapse:collapse;min-width:980px;}
        .ims-table th{padding:13px 16px;background:#fdfaf8;border-bottom:1px solid rgba(104,80,68,.07);text-align:left;font-size:9.5px;letter-spacing:.15em;text-transform:uppercase;color:rgba(104,80,68,.42);font-weight:500;}
        .ims-table td{padding:14px 16px;border-bottom:1px solid rgba(104,80,68,.06);font-size:13px;vertical-align:middle;}
        .ims-table tr:last-child td{border-bottom:0;}
        .ims-name{font-weight:500;color:#3a405a;}
        .ims-muted{color:rgba(104,80,68,.55);}
        .ims-office-net{display:flex;align-items:center;justify-content:space-between;gap:16px;flex-wrap:wrap;padding:18px;}
        .ims-office-ip{font-family:'Cormorant Garamond',serif;font-size:22px;color:#3a405a;margin-top:2px;}
        .ims-office-net + p.ims-muted{padding:0 18px 18px;margin:0;font-size:12.5px;}
        .ims-overlay{position:fixed;inset:0;background:rgba(35,30,25,.5);backdrop-filter:blur(3px);display:flex;align-items:center;justify-content:center;padding:24px;z-index:60;}
        .ims-modal-box{background:#fff;border-radius:14px;max-width:920px;width:100%;max-height:90vh;overflow-y:auto;box-shadow:0 30px 70px -20px rgba(0,0,0,.4);}
        .ims-modal-actions{display:flex;justify-content:flex-end;gap:10px;align-self:end;}
        .ims-modal-actions.full{grid-column:1/-1;}
        .ims-badge{display:inline-flex;align-items:center;border-radius:999px;padding:4px 9px;font-size:10.5px;font-weight:500;background:rgba(104,80,68,.08);color:#685044;white-space:nowrap;}
        .ims-badge.active,.ims-badge.approved,.ims-badge.present,.ims-badge.completed{background:rgba(39,174,96,.11);color:#238b4b;}
        .ims-badge.pending,.ims-badge.applied{background:rgba(218,165,32,.13);color:#9a6c07;}
        .ims-badge.rejected,.ims-badge.terminated,.ims-badge.absent,.ims-badge.overdue{background:rgba(192,57,43,.10);color:#c0392b;}
        .ims-badge.needs-revision,.ims-badge.on-hold{background:rgba(52,152,219,.10);color:#287fb8;}
        .ims-row-actions{display:flex;gap:7px;flex-wrap:wrap;}
        .ims-small{border:1px solid rgba(104,80,68,.14);background:#fff;border-radius:7px;padding:6px 10px;font-size:11px;color:#3a405a;cursor:pointer;}
        .ims-small.danger{border-color:rgba(192,57,43,.2);background:rgba(192,57,43,.05);color:#c0392b;}
        .ims-small.good{border-color:rgba(39,174,96,.2);background:rgba(39,174,96,.07);color:#238b4b;}
        .ims-empty{padding:42px 18px;text-align:center;color:rgba(104,80,68,.45);font-size:14px;}
        .ims-progress{height:8px;background:rgba(104,80,68,.09);border-radius:99px;overflow:hidden;min-width:120px;}
        .ims-progress span{display:block;height:100%;background:#3a405a;}
        .ims-error{padding:14px 16px;border-radius:8px;background:rgba(192,57,43,.08);color:#c0392b;}
        @media(max-width:1100px){.ims-grid{grid-template-columns:repeat(3,1fr)}.ims-form{grid-template-columns:repeat(2,1fr)}.ims-filters{grid-template-columns:repeat(2,1fr)}}
        @media(max-width:680px){.ims-grid,.ims-form,.ims-filters{grid-template-columns:1fr}.ims-field.wide{grid-column:auto}.ims-title{font-size:28px}.ims-actions{width:100%}.ims-tab{flex:1}}
      `}</style>

      <div className="ims-top">
        <div>
          <h1 className="ims-title">Internship Management</h1>
          <p className="ims-sub">MVP module for registration, attendance, daily work reports, tasks, and mentor review.</p>
        </div>
        <div className="ims-actions">
          {["interns", "attendance", "leaves", "reports", "tasks", "certificates"].map((tab) => (
            <button key={tab} className={`ims-tab ${activeTab === tab ? "active" : ""}`} onClick={() => setActiveTab(tab)}>
              {tab[0].toUpperCase() + tab.slice(1)}
            </button>
          ))}
        </div>
      </div>

      {error && <div className="ims-error">{error}</div>}

      <div className="ims-grid">
        <Stat label="Total Interns" value={data.stats.totalInterns || 0} />
        <Stat label="Active Interns" value={data.stats.activeInterns || 0} />
        <Stat label="Present Today" value={data.stats.presentToday || 0} />
        <Stat label="Absent Today" value={data.stats.absentToday || 0} />
        <Stat label="Pending Reports" value={data.stats.pendingReports || 0} />
        <Stat label="Task Completion" value={`${data.stats.taskCompletion || 0}%`} />
      </div>

      {activeTab === "interns" && (
        <section className="ims-panel">
          <div className="ims-panel-head">
            <h2 className="ims-panel-title">Interns</h2>
            <button className="ims-submit" onClick={openAddIntern}>+ Add Intern</button>
          </div>
          <div className="ims-filters">
            <select value={filters.batch} onChange={(e) => setFilters((p) => ({ ...p, batch: e.target.value }))}><option value="">All Batches</option>{data.batches.map((b) => <option key={b.id} value={b.id}>{b.batch_name}</option>)}</select>
            <select value={filters.college} onChange={(e) => setFilters((p) => ({ ...p, college: e.target.value }))}><option value="">All Colleges</option>{colleges.map((c) => <option key={c}>{c}</option>)}</select>
            <select value={filters.role} onChange={(e) => setFilters((p) => ({ ...p, role: e.target.value }))}><option value="">All Roles</option>{roles.map((r) => <option key={r}>{r}</option>)}</select>
            <select value={filters.status} onChange={(e) => setFilters((p) => ({ ...p, status: e.target.value }))}><option value="">All Statuses</option>{["Applied","Selected","Active","On Hold","Completed","Terminated"].map((s) => <option key={s}>{s}</option>)}</select>
          </div>
          <InternsTable loading={loading} interns={filteredInterns} onEdit={startEdit} onDelete={deleteIntern} />
        </section>
      )}

      {showInternModal && (
        <div className="ims-overlay" role="dialog" aria-modal="true" onClick={(e) => e.target === e.currentTarget && closeInternModal()}>
          <div className="ims-modal-box">
            <div className="ims-panel-head">
              <h2 className="ims-panel-title">{editingId ? "Edit Intern" : "Add Intern"}</h2>
              <button className="ims-secondary" onClick={closeInternModal}>Close</button>
            </div>
            <form className="ims-form" onSubmit={saveIntern}>
              <Field label="Intern ID"><input value={internForm.intern_id} onChange={(e) => updateInternForm("intern_id", e.target.value)} placeholder="Auto if blank" /></Field>
              <Field label="Full Name"><input required value={internForm.full_name} onChange={(e) => updateInternForm("full_name", e.target.value)} /></Field>
              <Field label="Email"><input required type="email" value={internForm.email} onChange={(e) => updateInternForm("email", e.target.value)} /></Field>
              <Field label="Mobile"><input value={internForm.mobile} onChange={(e) => updateInternForm("mobile", e.target.value)} /></Field>
              <Field label="College"><input value={internForm.college} onChange={(e) => updateInternForm("college", e.target.value)} /></Field>
              <Field label="Course"><input value={internForm.course} onChange={(e) => updateInternForm("course", e.target.value)} /></Field>
              <Field label="Specialization"><input value={internForm.specialization} onChange={(e) => updateInternForm("specialization", e.target.value)} /></Field>
              <Field label="Role"><input value={internForm.role} onChange={(e) => updateInternForm("role", e.target.value)} placeholder="Web Development" /></Field>
              <Field label="Mentor"><Select value={internForm.mentor_id} onChange={(e) => updateInternForm("mentor_id", e.target.value)} items={data.mentors} labelKey="name" /></Field>
              <Field label="Batch"><Select value={internForm.batch_id} onChange={(e) => updateInternForm("batch_id", e.target.value)} items={data.batches} labelKey="batch_name" /></Field>
              <Field label="Start Date"><input type="date" value={internForm.start_date} onChange={(e) => updateInternForm("start_date", e.target.value)} /></Field>
              <Field label="End Date"><input type="date" value={internForm.end_date} onChange={(e) => updateInternForm("end_date", e.target.value)} /></Field>
              <Field label="Status"><select value={internForm.status} onChange={(e) => updateInternForm("status", e.target.value)}>{["Applied","Selected","Active","On Hold","Completed","Terminated"].map((item) => <option key={item}>{item}</option>)}</select></Field>
              <Field label={editingId ? "New Password" : "Password"}><input type="password" value={internForm.password} onChange={(e) => updateInternForm("password", e.target.value)} placeholder={editingId ? "Leave blank to keep" : "Temporary password"} /></Field>
              <Field label="Login Access"><select value={internForm.login_enabled ? "1" : "0"} onChange={(e) => updateInternForm("login_enabled", e.target.value === "1")}><option value="1">Enabled</option><option value="0">Disabled</option></select></Field>
              <Field label="Resume URL" className="wide"><input value={internForm.resume} onChange={(e) => updateInternForm("resume", e.target.value)} placeholder="/uploads/resumes/file.pdf" /></Field>
              <div className="ims-modal-actions full">
                <button type="button" className="ims-secondary" onClick={closeInternModal}>Cancel</button>
                <button className="ims-submit" disabled={saving}>{saving ? "Saving..." : editingId ? "Update Intern" : "Add Intern"}</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {activeTab === "attendance" && (
        <>
          <section className="ims-panel">
            <div className="ims-panel-head"><h2 className="ims-panel-title">Office Network</h2></div>
            <div className="ims-office-net">
              <div>
                <div className="ims-muted">Approved office IP</div>
                <div className="ims-office-ip">{officeNetwork.office_ip || "Not set — attendance allowed from any network"}</div>
                {officeNetwork.set_by && <div className="ims-muted">Set by {officeNetwork.set_by} on {dateOnly(officeNetwork.set_at)}</div>}
              </div>
              <div className="ims-row-actions">
                {officeNetwork.office_ip && <button className="ims-secondary" disabled={settingOfficeNetwork} onClick={clearOfficeNetwork}>Unset</button>}
                <button className="ims-submit" disabled={settingOfficeNetwork} onClick={saveOfficeNetwork}>
                  {settingOfficeNetwork ? "Detecting..." : "Set Office Network"}
                </button>
              </div>
            </div>
            <p className="ims-muted">Connect to office Wi-Fi first, then click this from an admin session on that network. Interns can only mark attendance from this IP.</p>
          </section>

          <section className="ims-panel">
            <div className="ims-panel-head">
              <h2 className="ims-panel-title">Daily Attendance</h2>
              <button className="ims-submit" onClick={() => setShowAttendanceModal(true)}>+ Mark Attendance</button>
            </div>
            <AttendanceTable rows={data.attendance} loading={loading} onVerify={verifyAttendance} />
          </section>
        </>
      )}

      {showAttendanceModal && (
        <div className="ims-overlay" role="dialog" aria-modal="true" onClick={(e) => e.target === e.currentTarget && setShowAttendanceModal(false)}>
          <div className="ims-modal-box">
            <div className="ims-panel-head">
              <h2 className="ims-panel-title">Mark Attendance</h2>
              <button className="ims-secondary" onClick={() => setShowAttendanceModal(false)}>Close</button>
            </div>
            <form className="ims-form" onSubmit={saveAttendance}>
              <Field label="Intern"><Select required value={attendanceForm.intern_id} onChange={(e) => setAttendanceForm((p) => ({ ...p, intern_id: e.target.value }))} items={data.interns} labelKey="full_name" /></Field>
              <Field label="Date"><input type="date" required value={attendanceForm.attendance_date} onChange={(e) => setAttendanceForm((p) => ({ ...p, attendance_date: e.target.value }))} /></Field>
              <Field label="Check In"><input type="time" value={attendanceForm.check_in} onChange={(e) => setAttendanceForm((p) => ({ ...p, check_in: e.target.value }))} /></Field>
              <Field label="Check Out"><input type="time" value={attendanceForm.check_out} onChange={(e) => setAttendanceForm((p) => ({ ...p, check_out: e.target.value }))} /></Field>
              <Field label="Work Mode"><select value={attendanceForm.work_mode} onChange={(e) => setAttendanceForm((p) => ({ ...p, work_mode: e.target.value }))}>{["Office","Remote","Hybrid"].map((s) => <option key={s}>{s}</option>)}</select></Field>
              <Field label="Status"><select value={attendanceForm.status} onChange={(e) => setAttendanceForm((p) => ({ ...p, status: e.target.value }))}>{["Present","Absent","Late","Half Day"].map((s) => <option key={s}>{s}</option>)}</select></Field>
              <Field label="Remarks" className="wide"><input value={attendanceForm.remarks} onChange={(e) => setAttendanceForm((p) => ({ ...p, remarks: e.target.value }))} /></Field>
              <div className="ims-modal-actions full">
                <button type="button" className="ims-secondary" onClick={() => setShowAttendanceModal(false)}>Cancel</button>
                <button className="ims-submit" disabled={saving}>{saving ? "Saving..." : "Save Attendance"}</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {activeTab === "leaves" && (
        <>
          <section className="ims-panel">
            <div className="ims-panel-head"><h2 className="ims-panel-title">Leave Requests</h2></div>
            <LeavesTable rows={leaves} loading={loading} onReview={reviewLeave} />
          </section>

          <section className="ims-panel">
            <div className="ims-panel-head"><h2 className="ims-panel-title">Company Holidays</h2></div>
            <form className="ims-form" onSubmit={saveHoliday}>
              <Field label="Date"><input type="date" required value={holidayForm.holiday_date} onChange={(e) => setHolidayForm((p) => ({ ...p, holiday_date: e.target.value }))} /></Field>
              <Field label="Name" className="wide"><input required value={holidayForm.name} onChange={(e) => setHolidayForm((p) => ({ ...p, name: e.target.value }))} /></Field>
              <button className="ims-submit" disabled={saving}>Add Holiday</button>
            </form>
            <HolidaysTable rows={holidays} loading={loading} onDelete={removeHoliday} />
          </section>
        </>
      )}

      {activeTab === "reports" && (
        <section className="ims-panel">
          <div className="ims-panel-head"><h2 className="ims-panel-title">Daily Work Reports</h2></div>
          <form className="ims-form" onSubmit={saveReport}>
            <Field label="Intern"><Select required value={reportForm.intern_id} onChange={(e) => setReportForm((p) => ({ ...p, intern_id: e.target.value }))} items={data.interns} labelKey="full_name" /></Field>
            <Field label="Date"><input type="date" required value={reportForm.report_date} onChange={(e) => setReportForm((p) => ({ ...p, report_date: e.target.value }))} /></Field>
            <Field label="Hours Worked"><input type="number" min="0" max="24" step="0.5" value={reportForm.hours_worked} onChange={(e) => setReportForm((p) => ({ ...p, hours_worked: e.target.value }))} /></Field>
            <Field label="Attachment URL"><input value={reportForm.attachment} onChange={(e) => setReportForm((p) => ({ ...p, attachment: e.target.value }))} /></Field>
            <Field label="Tasks Assigned" className="wide"><textarea value={reportForm.tasks_assigned} onChange={(e) => setReportForm((p) => ({ ...p, tasks_assigned: e.target.value }))} /></Field>
            <Field label="Tasks Completed" className="wide"><textarea value={reportForm.tasks_completed} onChange={(e) => setReportForm((p) => ({ ...p, tasks_completed: e.target.value }))} /></Field>
            <Field label="Challenges" className="wide"><textarea value={reportForm.challenges} onChange={(e) => setReportForm((p) => ({ ...p, challenges: e.target.value }))} /></Field>
            <Field label="Tomorrow Plan" className="wide"><textarea value={reportForm.tomorrow_plan} onChange={(e) => setReportForm((p) => ({ ...p, tomorrow_plan: e.target.value }))} /></Field>
            <button className="ims-submit" disabled={saving}>Submit Report</button>
          </form>
          <ReportsTable rows={data.reports} loading={loading} onReview={reviewReport} />
        </section>
      )}

      {activeTab === "tasks" && (
        <section className="ims-panel">
          <div className="ims-panel-head"><h2 className="ims-panel-title">Task Management</h2></div>
          <form className="ims-form" onSubmit={saveTask}>
            <Field label="Title" className="wide"><input required value={taskForm.title} onChange={(e) => setTaskForm((p) => ({ ...p, title: e.target.value }))} /></Field>
            <Field label="Assigned To"><Select value={taskForm.assigned_to} onChange={(e) => setTaskForm((p) => ({ ...p, assigned_to: e.target.value }))} items={data.interns} labelKey="full_name" /></Field>
            <Field label="Mentor"><Select value={taskForm.mentor_id} onChange={(e) => setTaskForm((p) => ({ ...p, mentor_id: e.target.value }))} items={data.mentors} labelKey="name" /></Field>
            <Field label="Priority"><select value={taskForm.priority} onChange={(e) => setTaskForm((p) => ({ ...p, priority: e.target.value }))}>{["Low","Medium","High","Urgent"].map((s) => <option key={s}>{s}</option>)}</select></Field>
            <Field label="Deadline"><input type="date" value={taskForm.deadline} onChange={(e) => setTaskForm((p) => ({ ...p, deadline: e.target.value }))} /></Field>
            <Field label="Progress"><select value={taskForm.progress} onChange={(e) => setTaskForm((p) => ({ ...p, progress: e.target.value, status: Number(e.target.value) === 100 ? "Completed" : "In Progress" }))}>{[0,25,50,75,100].map((v) => <option key={v} value={v}>{v}%</option>)}</select></Field>
            <Field label="Status"><select value={taskForm.status} onChange={(e) => setTaskForm((p) => ({ ...p, status: e.target.value }))}>{["Pending","In Progress","Completed","Overdue"].map((s) => <option key={s}>{s}</option>)}</select></Field>
            <Field label="Description" className="full"><textarea value={taskForm.description} onChange={(e) => setTaskForm((p) => ({ ...p, description: e.target.value }))} /></Field>
            <button className="ims-submit" disabled={saving}>Create Task</button>
          </form>
          <TasksTable rows={data.tasks} loading={loading} onProgress={updateTask} />
        </section>
      )}

      {activeTab === "certificates" && (
        <>
          <section className="ims-panel">
            <div className="ims-panel-head"><h2 className="ims-panel-title">Certificate Signature</h2></div>
            <form className="ims-form" onSubmit={saveCertificateSettings}>
              <Field label="Signer Name"><input required value={certificateSettings.signer_name || ""} onChange={(e) => setCertificateSettings((p) => ({ ...p, signer_name: e.target.value }))} /></Field>
              <Field label="Signer Designation"><input value={certificateSettings.signer_designation || ""} onChange={(e) => setCertificateSettings((p) => ({ ...p, signer_designation: e.target.value }))} /></Field>
              <Field label="Signature Image"><input type="file" accept="image/*" onChange={(e) => uploadCertificateSignature(e.target.files?.[0])} />{certificateSettings.signature_image && <a className="ims-muted" href={`${import.meta.env.VITE_API_URL || ""}${certificateSettings.signature_image}`} target="_blank" rel="noreferrer">View signature</a>}</Field>
              <button className="ims-submit" disabled={saving}>Save Settings</button>
            </form>
          </section>
          <section className="ims-panel">
            <div className="ims-panel-head"><h2 className="ims-panel-title">Issue Certificates</h2></div>
            <div className="ims-table-wrap"><table className="ims-table"><thead><tr><th>Intern</th><th>Role</th><th>Status</th><th>Certificate</th><th>Action</th></tr></thead><tbody>{data.interns.map((intern) => { const certificate = data.certificates.find((item) => item.intern_id === intern.id && item.status === "Issued"); return <tr key={intern.id}><td>{intern.full_name}</td><td>{intern.role || "-"}</td><td><span className={`ims-badge ${statusClass(intern.status)}`}>{intern.status}</span></td><td>{certificate ? <a className="ims-small" href={`${import.meta.env.VITE_API_URL || ""}/api/admin/internships/certificates/${certificate.id}/download`}>Download</a> : "-"}</td><td>{certificate ? <button className="ims-small danger" onClick={() => revokeCertificate(certificate.id)}>Revoke</button> : <button className="ims-small good" disabled={intern.status !== "Completed"} onClick={() => issueCertificate(intern.id)}>Issue</button>}</td></tr>; })}</tbody></table></div>
          </section>
        </>
      )}
    </div>
  );
}

function Stat({ label, value }) {
  return <div className="ims-card"><div className="ims-k">{label}</div><div className="ims-v">{value}</div></div>;
}

function Field({ label, className = "", children }) {
  return <div className={`ims-field ${className}`}><label>{label}</label>{children}</div>;
}

function Select({ items, labelKey, ...props }) {
  return (
    <select {...props}>
      <option value="">Select</option>
      {items.map((item) => <option key={item.id} value={item.id}>{item[labelKey]}</option>)}
    </select>
  );
}

function InternsTable({ loading, interns, onEdit, onDelete }) {
  if (loading) return <div className="ims-empty">Loading interns...</div>;
  if (!interns.length) return <div className="ims-empty">No interns found.</div>;
  return (
    <div className="ims-table-wrap">
      <table className="ims-table">
        <thead><tr><th>Intern</th><th>College</th><th>Role</th><th>Batch</th><th>Mentor</th><th>Duration</th><th>Documents</th><th>Status</th><th>Actions</th></tr></thead>
        <tbody>
          {interns.map((intern) => (
            <tr key={intern.id}>
              <td><div className="ims-name">{intern.full_name}</div><div className="ims-muted">{intern.intern_id} · {intern.email}</div></td>
              <td><div>{intern.college || <span className="ims-muted">-</span>}</div>{intern.college_university && <div className="ims-muted">{intern.college_university}</div>}{(intern.college_start_year || intern.college_passing_year || intern.college_percentage) && <div className="ims-muted">{intern.college_start_year || "-"} to {intern.college_passing_year || "-"}{intern.college_percentage ? ` · ${intern.college_percentage}%` : ""}</div>}</td>
              <td>{intern.role || <span className="ims-muted">-</span>}</td>
              <td>{intern.batch_name || <span className="ims-muted">-</span>}</td>
              <td>{intern.mentor_name || <span className="ims-muted">-</span>}</td>
              <td className="ims-muted">{dateOnly(intern.start_date) || "-"} to {dateOnly(intern.end_date) || "-"}</td>
              <td>{intern.aadhaar_card_document || intern.cancelled_cheque_document || intern.bank_account_last4 || intern.tenth_passing_year || intern.twelfth_passing_year ? <><div className="ims-row-actions">{intern.aadhaar_card_document && <a className="ims-small" href={adminInternDocumentUrl(intern.id, "aadhaar")} target="_blank" rel="noreferrer">Aadhaar</a>}{intern.cancelled_cheque_document && <a className="ims-small" href={adminInternDocumentUrl(intern.id, "cancelled_cheque")} target="_blank" rel="noreferrer">Cheque</a>}</div>{intern.bank_account_last4 && <div className="ims-muted">{intern.bank_name || "Bank"} · XXXX{intern.bank_account_last4}</div>}{(intern.tenth_passing_year || intern.twelfth_passing_year) && <div className="ims-muted">10th: {intern.tenth_passing_year || "-"} · 12th: {intern.twelfth_passing_year || "-"}</div>}</> : <span className="ims-muted">-</span>}</td>
              <td><span className={`ims-badge ${statusClass(intern.status)}`}>{intern.status}</span></td>
              <td><div className="ims-row-actions"><button className="ims-small" onClick={() => onEdit(intern)}>Edit</button><button className="ims-small danger" onClick={() => onDelete(intern.id)}>Delete</button></div></td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function AttendanceTable({ rows, loading, onVerify }) {
  if (loading) return <div className="ims-empty">Loading attendance...</div>;
  if (!rows.length) return <div className="ims-empty">No attendance records yet.</div>;
  return (
    <div className="ims-table-wrap">
      <table className="ims-table">
        <thead><tr><th>Date</th><th>Intern</th><th>Check In</th><th>Check Out</th><th>Work Mode</th><th>Status</th><th>Late Reason</th><th>Verification</th></tr></thead>
        <tbody>
          {rows.map((row) => (
            <tr key={row.id}>
              <td>{dateOnly(row.attendance_date)}</td>
              <td><div className="ims-name">{row.full_name}</div><div className="ims-muted">{row.intern_code}</div></td>
              <td>{row.check_in || "-"}</td>
              <td>{row.check_out || "-"}</td>
              <td>{row.work_mode}</td>
              <td><span className={`ims-badge ${statusClass(row.status)}`}>{row.status}</span></td>
              <td className="ims-muted" style={{ maxWidth: 240 }}>{row.late_reason || "-"}</td>
              <td>
                {row.verification_status === "Pending" ? (
                  <div className="ims-row-actions">
                    <button className="ims-small good" onClick={() => onVerify(row.id, "Approved")}>Approve</button>
                    <button className="ims-small danger" onClick={() => onVerify(row.id, "Rejected")}>Reject</button>
                  </div>
                ) : (
                  <span className={`ims-badge ${statusClass(row.verification_status)}`}>{row.verification_status}</span>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function LeavesTable({ rows, loading, onReview }) {
  if (loading) return <div className="ims-empty">Loading leave requests...</div>;
  if (!rows.length) return <div className="ims-empty">No leave requests yet.</div>;
  return (
    <div className="ims-table-wrap">
      <table className="ims-table">
        <thead><tr><th>Intern</th><th>From</th><th>To</th><th>Reason</th><th>Status</th><th>Action</th></tr></thead>
        <tbody>
          {rows.map((row) => (
            <tr key={row.id}>
              <td><div className="ims-name">{row.full_name}</div><div className="ims-muted">{row.intern_code}</div></td>
              <td>{dateOnly(row.start_date)}</td>
              <td>{dateOnly(row.end_date)}</td>
              <td className="ims-muted" style={{ maxWidth: 260 }}>{row.reason || "-"}</td>
              <td><span className={`ims-badge ${statusClass(row.status)}`}>{row.status}</span></td>
              <td>
                {row.status === "Pending" ? (
                  <div className="ims-row-actions">
                    <button className="ims-small good" onClick={() => onReview(row.id, "Approved")}>Approve</button>
                    <button className="ims-small danger" onClick={() => onReview(row.id, "Rejected")}>Reject</button>
                  </div>
                ) : (
                  <span className="ims-muted">{row.reviewed_by || "-"}</span>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function HolidaysTable({ rows, loading, onDelete }) {
  if (loading) return <div className="ims-empty">Loading holidays...</div>;
  if (!rows.length) return <div className="ims-empty">No holidays added yet.</div>;
  return (
    <div className="ims-table-wrap">
      <table className="ims-table">
        <thead><tr><th>Date</th><th>Name</th><th></th></tr></thead>
        <tbody>
          {rows.map((row) => (
            <tr key={row.id}>
              <td>{dateOnly(row.holiday_date)}</td>
              <td>{row.name}</td>
              <td><button className="ims-small danger" onClick={() => onDelete(row.id)}>Remove</button></td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function ReportsTable({ rows, loading, onReview }) {
  if (loading) return <div className="ims-empty">Loading reports...</div>;
  if (!rows.length) return <div className="ims-empty">No daily work reports yet.</div>;
  return (
    <div className="ims-table-wrap">
      <table className="ims-table">
        <thead><tr><th>Date</th><th>Intern</th><th>Completed</th><th>Hours</th><th>Status</th><th>Mentor Action</th></tr></thead>
        <tbody>
          {rows.map((row) => (
            <tr key={row.id}>
              <td>{dateOnly(row.report_date)}</td>
              <td><div className="ims-name">{row.full_name}</div><div className="ims-muted">{row.mentor_name || "No mentor"}</div></td>
              <td className="ims-muted" style={{ maxWidth: 340 }}>{row.tasks_completed || "-"}</td>
              <td>{row.hours_worked || 0}</td>
              <td><span className={`ims-badge ${statusClass(row.mentor_status)}`}>{row.mentor_status}</span></td>
              <td><div className="ims-row-actions"><button className="ims-small good" onClick={() => onReview(row.id, "Approved")}>Approve</button><button className="ims-small" onClick={() => onReview(row.id, "Needs Revision")}>Needs Revision</button><button className="ims-small danger" onClick={() => onReview(row.id, "Rejected")}>Reject</button></div></td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function TasksTable({ rows, loading, onProgress }) {
  if (loading) return <div className="ims-empty">Loading tasks...</div>;
  if (!rows.length) return <div className="ims-empty">No tasks created yet.</div>;
  return (
    <div className="ims-table-wrap">
      <table className="ims-table">
        <thead><tr><th>Task</th><th>Assigned To</th><th>Priority</th><th>Deadline</th><th>Progress</th><th>Status</th><th>Update</th></tr></thead>
        <tbody>
          {rows.map((task) => (
            <tr key={task.id}>
              <td><div className="ims-name">{task.title}</div><div className="ims-muted">{task.description || "-"}</div></td>
              <td>{task.assigned_name || <span className="ims-muted">Unassigned</span>}</td>
              <td>{task.priority}</td>
              <td>{dateOnly(task.deadline) || "-"}</td>
              <td><div className="ims-progress"><span style={{ width: `${task.progress || 0}%` }} /></div><div className="ims-muted">{task.progress || 0}%</div></td>
              <td><span className={`ims-badge ${statusClass(task.status)}`}>{task.status}</span></td>
              <td><select value={task.progress || 0} onChange={(e) => onProgress(task, e.target.value)}>{[0,25,50,75,100].map((v) => <option key={v} value={v}>{v}%</option>)}</select></td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
