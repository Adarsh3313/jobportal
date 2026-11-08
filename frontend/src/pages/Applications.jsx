import { apiFetch } from "../services/http";
import { useEffect, useState } from "react";
import AdminLayout from "../components/AdminLayout";

function Applications() {
  const [applications, setApplications] = useState([]);
  const [search, setSearch] = useState("");
  const [selectedApplication, setSelectedApplication] =
    useState(null);

  useEffect(() => {
    loadApplications();
  }, []);

  const loadApplications = async () => {
    try {
      const response = await apiFetch(
        "/api/applications"
      );

      const data = await response.json();

      setApplications(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error(error);
    }
  };

  const filteredApplications =
    applications.filter(
      (application) =>
        application.applicantEmail
          ?.toLowerCase()
          .includes(search.toLowerCase())
    );

  return (
    <AdminLayout>
      <h1
        style={{
          color: "#0b2c6b",
          marginBottom: "20px",
        }}
      >
        📄 Applications Management
      </h1>

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
        <div style={card("#2563eb")}>
          <h3>Total Applications</h3>
          <h1>{applications.length}</h1>
        </div>

        <div style={card("#f59e0b")}>
          <h3>Pending</h3>
          <h1>
            {
              applications.filter(
                (a) =>
                  a.status ===
                  "PENDING"
              ).length
            }
          </h1>
        </div>

        <div style={card("#16a34a")}>
          <h3>Shortlisted</h3>
          <h1>
            {
              applications.filter(
                (a) =>
                  a.status ===
                  "SHORTLISTED"
              ).length
            }
          </h1>
        </div>

        <div style={card("#dc2626")}>
          <h3>Rejected</h3>
          <h1>
            {
              applications.filter(
                (a) =>
                  a.status ===
                  "REJECTED"
              ).length
            }
          </h1>
        </div>
      </div>

      {/* SEARCH */}
      <input
        type="text"
        placeholder="🔍 Search Applicant..."
        value={search}
        onChange={(e) =>
          setSearch(e.target.value)
        }
        style={{
          width: "100%",
          padding: "12px",
          borderRadius: "10px",
          border: "1px solid #ddd",
          marginBottom: "20px",
        }}
      />

      {/* TABLE */}
      <div
        style={{
          background: "white",
          borderRadius: "15px",
          overflow: "hidden",
          boxShadow:
            "0 4px 15px rgba(0,0,0,0.08)",
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
                Applicant
              </th>
              <th style={thStyle}>
                Job ID
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
            {filteredApplications.map(
              (app) => (
                <tr
                  key={app.applicationId}
                  style={{
                    borderBottom:
                      "1px solid #eee",
                  }}
                >
                  <td style={tdStyle}>
                    👤 {app.applicantEmail}
                  </td>

                  <td style={tdStyle}>
                    #{app.jobId}
                  </td>

                  <td style={tdStyle}>
                    <span
                      style={{
                        background:
                          app.status ===
                          "SHORTLISTED"
                            ? "#dcfce7"
                            : app.status ===
                              "REJECTED"
                            ? "#fee2e2"
                            : "#fef3c7",
                        color:
                          app.status ===
                          "SHORTLISTED"
                            ? "#15803d"
                            : app.status ===
                              "REJECTED"
                            ? "#dc2626"
                            : "#d97706",
                        padding:
                          "6px 12px",
                        borderRadius:
                          "20px",
                        fontWeight:
                          "bold",
                      }}
                    >
                      {app.status}
                    </span>
                  </td>

                  <td style={tdStyle}>
                    <div
                      style={{
                        display:
                          "flex",
                        gap: "8px",
                      }}
                    >
                      <button
                        onClick={() =>
                          setSelectedApplication(
                            app
                          )
                        }
                        style={btn(
                          "#2563eb"
                        )}
                      >
                        👁
                      </button>

                      <button
                        style={btn(
                          "#16a34a"
                        )}
                      >
                        ✅
                      </button>

                      <button
                        style={btn(
                          "#dc2626"
                        )}
                      >
                        ❌
                      </button>
                    </div>
                  </td>
                </tr>
              )
            )}
          </tbody>
        </table>
      </div>

      {/* VIEW MODAL */}
      {selectedApplication && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            background:
              "rgba(0,0,0,0.5)",
            display: "flex",
            justifyContent:
              "center",
            alignItems: "center",
            zIndex: 1000,
          }}
        >
          <div
            style={{
              background: "white",
              width: "500px",
              padding: "25px",
              borderRadius: "15px",
            }}
          >
            <h2>
              Applicant Details
            </h2>

            <p>
              <strong>Email:</strong>{" "}
              {
                selectedApplication.email
              }
            </p>

            <p>
              <strong>Job ID:</strong>{" "}
              {
                selectedApplication.jobId
              }
            </p>

            <p>
              <strong>Status:</strong>{" "}
              {
                selectedApplication.status
              }
            </p>

            <button
              onClick={() =>
                setSelectedApplication(
                  null
                )
              }
              style={btn("#6b7280")}
            >
              Close
            </button>
          </div>
        </div>
      )}
    </AdminLayout>
  );
}

const card = (bg) => ({
  background: bg,
  color: "white",
  padding: "20px",
  borderRadius: "15px",
  textAlign: "center",
  boxShadow:
    "0 4px 15px rgba(0,0,0,0.1)",
});

const btn = (bg) => ({
  background: bg,
  color: "white",
  border: "none",
  padding: "8px 14px",
  borderRadius: "8px",
  cursor: "pointer",
});

const thStyle = {
  padding: "15px",
  textAlign: "left",
};

const tdStyle = {
  padding: "15px",
};

export default Applications;