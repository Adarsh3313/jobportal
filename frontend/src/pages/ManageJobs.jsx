import { apiFetch } from "../services/http";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

function ManageJobs() {
  const [jobs, setJobs] = useState([]);
  const [search, setSearch] = useState("");
  const [selectedJob, setSelectedJob] = useState(null);

  useEffect(() => {
    loadJobs();
  }, []);

  const loadJobs = async () => {
    try {
      const response = await apiFetch(
        "/api/jobs?mine=1"
      );

      const data = await response.json();

      setJobs(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error(error);
    }
  };

  const deleteJob = async (id) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this job?"
    );

    if (!confirmDelete) return;

    try {
      const response = await apiFetch(
        `/api/jobs/${id}`,
        {
          method: "DELETE",
        }
      );

      if (response.ok) {
        alert("Job deleted successfully");
        loadJobs();
      } else {
        alert((await response.text()) || "Failed to delete job");
      }
    } catch (error) {
      console.error(error);
      alert("Delete failed");
    }
  };

  const filteredJobs = jobs.filter((job) =>
    job.title
      ?.toLowerCase()
      .includes(search.toLowerCase())
  );

  const totalJobs = jobs.length;

  const openJobs = jobs.filter(
    (job) => job.status === "OPEN"
  ).length;

  const closedJobs = jobs.filter(
    (job) => job.status === "CLOSED"
  ).length;

  const locations = new Set(
    jobs.map((job) => job.location)
  ).size;

  return (
    <div
      style={{
        background: "#f8fafc",
        minHeight: "100vh",
        padding: "30px",
      }}
    >
      {/* HERO */}
      <div
        style={{
          background:
            "linear-gradient(135deg,#0f172a,#2563eb)",
          color: "white",
          borderRadius: "24px",
          padding: "40px",
          marginBottom: "25px",
        }}
      >
        <h1 style={{ margin: 0 }}>
          Recruitment Management Center
        </h1>

        <p
          style={{
            marginTop: "10px",
            opacity: 0.9,
          }}
        >
          Manage openings, monitor job
          postings and recruitment
          activities.
        </p>
      </div>

      {/* HEADER */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "25px",
        }}
      >
        <div>
          <h2 style={{ margin: 0 }}>
            Job Portfolio
          </h2>

          <p
            style={{
              color: "#64748b",
            }}
          >
            Enterprise Hiring Operations
          </p>
        </div>

        <Link to="/create-job">
          <button style={primaryBtn}>
            ➕ Create Job
          </button>
        </Link>
      </div>

      {/* KPI CARDS */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns:
            "repeat(auto-fit,minmax(250px,1fr))",
          gap: "20px",
          marginBottom: "25px",
        }}
      >
        <StatCard
          title="Total Jobs"
          value={totalJobs}
          color="#1e293b"
          icon="💼"
        />

        <StatCard
          title="Open Jobs"
          value={openJobs}
          color="#2563eb"
          icon="✅"
        />

        <StatCard
          title="Locations"
          value={locations}
          color="#7c3aed"
          icon="📍"
        />

        <StatCard
          title="Closed Jobs"
          value={closedJobs}
          color="#dc2626"
          icon="🔒"
        />
      </div>

      {/* SEARCH */}
      <div
        style={{
          background: "white",
          padding: "15px",
          borderRadius: "16px",
          marginBottom: "25px",
          boxShadow:
            "0 4px 12px rgba(0,0,0,.08)",
        }}
      >
        <input
          type="text"
          placeholder="🔍 Search jobs..."
          value={search}
          onChange={(e) =>
            setSearch(e.target.value)
          }
          style={{
            width: "100%",
            border: "none",
            outline: "none",
            fontSize: "15px",
          }}
        />
      </div>

      {/* TABLE */}
      <div
        style={{
          background: "white",
          borderRadius: "20px",
          overflow: "hidden",
          boxShadow:
            "0 4px 16px rgba(0,0,0,.08)",
        }}
      >
        <table
          style={{
            width: "100%",
            borderCollapse: "collapse",
          }}
        >
          <thead>
            <tr
              style={{
                background: "#f8fafc",
              }}
            >
              <th style={thStyle}>
                Job Title
              </th>
              <th style={thStyle}>
                Location
              </th>
              <th style={thStyle}>
                Salary
              </th>
              <th style={thStyle}>
                Status
              </th>
              <th style={thStyle}>
                Actions
              </th>
            </tr>
          </thead>

          <tbody>
            {filteredJobs.map((job) => (
              <tr
                key={job.jobId}
                style={{
                  borderTop:
                    "1px solid #e5e7eb",
                }}
              >
                <td style={tdStyle}>
                  <strong>
                    {job.title}
                  </strong>
                </td>

                <td style={tdStyle}>
                  {job.location}
                </td>

                <td style={tdStyle}>
                  ₹
                  {job.salary?.toLocaleString()}
                </td>

                <td style={tdStyle}>
                  <span
                    style={{
                      background:
                        job.status ===
                        "OPEN"
                          ? "#dcfce7"
                          : "#fee2e2",
                      color:
                        job.status ===
                        "OPEN"
                          ? "#15803d"
                          : "#dc2626",
                      padding:
                        "6px 12px",
                      borderRadius:
                        "25px",
                      fontWeight:
                        "600",
                    }}
                  >
                    {job.status}
                  </span>
                  <div style={{ marginTop: "6px", fontSize: "12px", fontWeight: 600, color: job.approvalStatus === "APPROVED" ? "#15803d" : job.approvalStatus === "REJECTED" ? "#dc2626" : "#b45309" }}>
                    {job.approvalStatus === "APPROVED" ? "✔ Approved by admin" : job.approvalStatus === "REJECTED" ? "✖ Rejected" : "⏳ Awaiting admin approval"}
                  </div>
                  {job.approvalStatus === "REJECTED" && job.adminRemarks && (
                    <div style={{ fontSize: "12px", color: "#64748b" }}>Reason: {job.adminRemarks}</div>
                  )}
                </td>

                <td style={tdStyle}>
                  <div
                    style={{
                      display: "flex",
                      gap: "8px",
                      flexWrap: "wrap",
                    }}
                  >
                    <button
                      onClick={() =>
                        setSelectedJob(job)
                      }
                      style={viewBtn}
                    >
                      View
                    </button>

                    <Link
                      to={`/view-applicants/${job.jobId}`}
                      style={{
                        textDecoration:
                          "none",
                      }}
                    >
                      <button
                        style={
                          applicantsBtn
                        }
                      >
                        Applicants
                      </button>
                    </Link>

                    <button
                      onClick={() =>
                        deleteJob(
                          job.jobId
                        )
                      }
                      style={
                        deleteBtn
                      }
                    >
                      Delete
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* MODAL */}
      {selectedJob && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            background:
              "rgba(0,0,0,.5)",
            display: "flex",
            justifyContent:
              "center",
            alignItems: "center",
          }}
        >
          <div
            style={{
              width: "700px",
              maxWidth: "90%",
              background: "white",
              borderRadius: "20px",
              padding: "30px",
            }}
          >
            <h2>
              Job Information
            </h2>

            <hr />

            <p>
              <strong>
                Title:
              </strong>{" "}
              {
                selectedJob.title
              }
            </p>

            <p>
              <strong>
                Location:
              </strong>{" "}
              {
                selectedJob.location
              }
            </p>

            <p>
              <strong>
                Salary:
              </strong>{" "}
              ₹
              {selectedJob.salary?.toLocaleString()}
            </p>

            <p>
              <strong>
                Status:
              </strong>{" "}
              {
                selectedJob.status
              }
            </p>

            <p>
              <strong>
                Description:
              </strong>
            </p>

            <p>
              {
                selectedJob.description
              }
            </p>

            <button
              onClick={() =>
                setSelectedJob(null)
              }
              style={primaryBtn}
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

function StatCard({
  title,
  value,
  color,
  icon,
}) {
  return (
    <div
      style={{
        background: color,
        color: "white",
        padding: "25px",
        borderRadius: "18px",
      }}
    >
      <div
        style={{
          display: "flex",
          justifyContent:
            "space-between",
        }}
      >
        <div>
          <p>{title}</p>
          <h1>{value}</h1>
        </div>

        <div
          style={{
            fontSize: "36px",
          }}
        >
          {icon}
        </div>
      </div>
    </div>
  );
}

const primaryBtn = {
  background: "#2563eb",
  color: "white",
  border: "none",
  padding: "12px 18px",
  borderRadius: "10px",
  cursor: "pointer",
  fontWeight: "600",
};

const viewBtn = {
  background: "#2563eb",
  color: "white",
  border: "none",
  padding: "8px 14px",
  borderRadius: "8px",
  cursor: "pointer",
};

const applicantsBtn = {
  background: "#7c3aed",
  color: "white",
  border: "none",
  padding: "8px 14px",
  borderRadius: "8px",
  cursor: "pointer",
};

const deleteBtn = {
  background: "#dc2626",
  color: "white",
  border: "none",
  padding: "8px 14px",
  borderRadius: "8px",
  cursor: "pointer",
};

const thStyle = {
  textAlign: "left",
  padding: "18px",
};

const tdStyle = {
  padding: "18px",
};

export default ManageJobs;