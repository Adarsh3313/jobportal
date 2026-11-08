import { useEffect, useState } from "react";
import AdminLayout from "../components/AdminLayout";
import { apiFetch } from "../services/http";

const field = (label, value) =>
  value ? (
    <p style={{ margin: "4px 0", color: "#334155" }}>
      <strong>{label}:</strong> {value}
    </p>
  ) : null;

function ReviewJobs() {
  const [tab, setTab] = useState("pending");
  const [jobs, setJobs] = useState([]);

  const load = async (which = tab) => {
    const res = await apiFetch(which === "pending" ? "/api/admin/jobs/pending" : "/api/admin/jobs");
    const data = res.ok ? await res.json() : [];
    setJobs(Array.isArray(data) ? data : []);
  };

  useEffect(() => {
    load(tab);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tab]);

  const review = async (job, decision) => {
    let remarks = "";
    if (decision === "REJECTED") {
      remarks = window.prompt("Reason for rejection (the company will see this):") || "";
      if (!remarks.trim()) return;
    }
    const res = await apiFetch(`/api/admin/jobs/${job.jobId}/review`, {
      method: "PUT",
      body: JSON.stringify({ decision, remarks }),
    });
    if (!res.ok) alert(await res.text());
    load();
  };

  const badge = (s) => ({
    padding: "4px 12px",
    borderRadius: "20px",
    fontWeight: 600,
    fontSize: "12px",
    background: s === "APPROVED" ? "#dcfce7" : s === "REJECTED" ? "#fee2e2" : "#fef3c7",
    color: s === "APPROVED" ? "#15803d" : s === "REJECTED" ? "#dc2626" : "#b45309",
  });

  return (
    <AdminLayout>
      <h1 style={{ color: "#0b2c6b", marginBottom: "10px" }}>🧾 Review Job Postings</h1>
      <p style={{ color: "#64748b" }}>
        Companies submit hiring details here. Job seekers only see a job after you approve it.
      </p>

      <div style={{ display: "flex", gap: "10px", margin: "20px 0" }}>
        {[["pending", "⏳ Pending"], ["all", "All jobs"]].map(([k, label]) => (
          <button
            key={k}
            onClick={() => setTab(k)}
            style={{ padding: "10px 18px", borderRadius: "10px", border: "none", cursor: "pointer", fontWeight: 600, background: tab === k ? "#2563eb" : "white", color: tab === k ? "white" : "#334155", boxShadow: "0 2px 8px rgba(0,0,0,0.08)" }}
          >
            {label}
          </button>
        ))}
      </div>

      {jobs.length === 0 && (
        <div style={{ background: "white", padding: "40px", borderRadius: "16px", textAlign: "center" }}>
          {tab === "pending" ? "🎉 Nothing waiting for review." : "No jobs yet."}
        </div>
      )}

      {jobs.map((job) => (
        <div key={job.jobId} style={{ background: "white", padding: "22px", borderRadius: "16px", marginBottom: "16px", boxShadow: "0 4px 15px rgba(0,0,0,0.08)" }}>
          <div style={{ display: "flex", justifyContent: "space-between", flexWrap: "wrap", gap: "10px" }}>
            <div>
              <h2 style={{ margin: 0 }}>{job.title}</h2>
              <small style={{ color: "#64748b" }}>
                {job.companyName || job.recruiterCompany || "—"} • posted by {job.recruiterName || "admin"} {job.recruiterEmail && `(${job.recruiterEmail})`}
              </small>
            </div>
            <span style={badge(job.approvalStatus)}>{job.approvalStatus}</span>
          </div>

          <div style={{ marginTop: "12px" }}>
            {field("Location", job.location)}
            {field("Salary", job.salary && `₹ ${job.salary}`)}
            {field("Department", job.department)}
            {field("Experience", job.experience)}
            {field("Employment type", job.employmentType)}
            {field("Skills", job.skills)}
            {field("Description", job.description)}
            {field("Admin remarks", job.adminRemarks)}
          </div>

          {job.approvalStatus !== "APPROVED" && (
            <div style={{ display: "flex", gap: "10px", marginTop: "14px" }}>
              <button onClick={() => review(job, "APPROVED")} style={{ background: "#16a34a", color: "white", border: "none", borderRadius: "8px", padding: "10px 20px", cursor: "pointer", fontWeight: 600 }}>
                ✔ Approve
              </button>
              {job.approvalStatus === "PENDING" && (
                <button onClick={() => review(job, "REJECTED")} style={{ background: "#dc2626", color: "white", border: "none", borderRadius: "8px", padding: "10px 20px", cursor: "pointer", fontWeight: 600 }}>
                  ✖ Reject
                </button>
              )}
            </div>
          )}
        </div>
      ))}
    </AdminLayout>
  );
}

export default ReviewJobs;
