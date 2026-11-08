import { apiFetch } from "../services/http";
import { useEffect, useState } from "react";
import AdminLayout from "../components/AdminLayout";

const BASE_URL = "/api/admin";

function PendingRecruiters() {
  const [recruiters, setRecruiters] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [selectedRecruiter, setSelectedRecruiter] =
    useState(null);

  useEffect(() => {
    fetchRecruiters();
  }, []);

  const fetchRecruiters = async () => {
    try {
      setLoading(true);

      const response = await apiFetch(
        `${BASE_URL}/pending-recruiters`
      );

      const data = await response.json();

      setRecruiters(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const approveRecruiter = async (id) => {
    try {
      await apiFetch(
        `${BASE_URL}/approve/${id}`,
        {
          method: "PUT",
        }
      );

      alert("Recruiter Approved Successfully");

      setSelectedRecruiter(null);

      fetchRecruiters();
    } catch (error) {
      console.error(error);
    }
  };

  const rejectRecruiter = async (id) => {
    const confirmReject = window.confirm(
      "Reject this recruiter?"
    );

    if (!confirmReject) return;

    try {
      await apiFetch(
        `${BASE_URL}/users/${id}`,
        {
          method: "DELETE",
        }
      );

      setSelectedRecruiter(null);

      fetchRecruiters();
    } catch (error) {
      console.error(error);
    }
  };

  const filteredRecruiters =
    recruiters.filter(
      (user) =>
        user.fullName
          ?.toLowerCase()
          .includes(search.toLowerCase()) ||
        user.email
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
        ✅ Recruiter Approval Center
      </h1>

      {/* KPI Cards */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns:
            "repeat(auto-fit,minmax(250px,1fr))",
          gap: "20px",
          marginBottom: "25px",
        }}
      >
        <div style={card("#f59e0b")}>
          <h3>Pending Requests</h3>
          <h1>{recruiters.length}</h1>
        </div>

        <div style={card("#16a34a")}>
          <h3>Approved Today</h3>
          <h1>0</h1>
        </div>

        <div style={card("#dc2626")}>
          <h3>Rejected Today</h3>
          <h1>0</h1>
        </div>

        <div style={card("#2563eb")}>
          <h3>Total Requests</h3>
          <h1>{recruiters.length}</h1>
        </div>
      </div>

      {/* Search */}
      <input
        type="text"
        placeholder="🔍 Search recruiter..."
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

      {loading ? (
        <h3>Loading...</h3>
      ) : filteredRecruiters.length === 0 ? (
        <div
          style={{
            background: "white",
            padding: "40px",
            borderRadius: "15px",
            textAlign: "center",
          }}
        >
          <h2>No Pending Recruiters</h2>
        </div>
      ) : (
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
                <th style={thStyle}>Name</th>
                <th style={thStyle}>Email</th>
                <th style={thStyle}>Phone</th>
                <th style={thStyle}>Role</th>
                <th style={thStyle}>Status</th>
                <th style={thStyle}>Actions</th>
              </tr>
            </thead>

            <tbody>
              {filteredRecruiters.map(
                (user) => (
                  <tr
                    key={user.userId}
                    style={{
                      borderBottom:
                        "1px solid #eee",
                    }}
                  >
                    <td style={tdStyle}>
                      👤 {user.fullName}
                    </td>

                    <td style={tdStyle}>
                      {user.email}
                    </td>

                    <td style={tdStyle}>
                      {user.phone}
                    </td>

                    <td style={tdStyle}>
                      <span
                        style={{
                          background:
                            "#fef3c7",
                          color: "#d97706",
                          padding:
                            "6px 12px",
                          borderRadius:
                            "20px",
                        }}
                      >
                        🏢 Recruiter
                      </span>
                    </td>

                    <td style={tdStyle}>
                      <span
                        style={{
                          background:
                            "#fef3c7",
                          color: "#d97706",
                          padding:
                            "6px 12px",
                          borderRadius:
                            "20px",
                        }}
                      >
                        ⏳ Pending
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
                            approveRecruiter(
                              user.userId
                            )
                          }
                          style={btn(
                            "#16a34a"
                          )}
                        >
                          ✅
                        </button>

                        <button
                          onClick={() =>
                            rejectRecruiter(
                              user.userId
                            )
                          }
                          style={btn(
                            "#dc2626"
                          )}
                        >
                          ❌
                        </button>

                        <button
                          onClick={() =>
                            setSelectedRecruiter(
                              user
                            )
                          }
                          style={btn(
                            "#2563eb"
                          )}
                        >
                          👁
                        </button>
                      </div>
                    </td>
                  </tr>
                )
              )}
            </tbody>
          </table>
        </div>
      )}

      {/* Modal */}
      {selectedRecruiter && (
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
              boxShadow:
                "0 10px 30px rgba(0,0,0,0.2)",
            }}
          >
            <h2
              style={{
                color: "#0b2c6b",
                marginBottom: "20px",
              }}
            >
              👤 Recruiter Details
            </h2>

            <p>
              <strong>Name:</strong>{" "}
              {
                selectedRecruiter.fullName
              }
            </p>

            <p>
              <strong>Email:</strong>{" "}
              {
                selectedRecruiter.email
              }
            </p>

            <p>
              <strong>Company:</strong>{" "}
              {selectedRecruiter.companyName}
              {selectedRecruiter.companyWebsite && ` (${selectedRecruiter.companyWebsite})`}
            </p>

            {selectedRecruiter.companyDetails && (
              <p>
                <strong>About:</strong>{" "}
                {selectedRecruiter.companyDetails}
              </p>
            )}

            <p>
              <strong>Phone:</strong>{" "}
              {
                selectedRecruiter.phone
              }
            </p>

            <p>
              <strong>Role:</strong>{" "}
              {
                selectedRecruiter.role
              }
            </p>

            <p>
              <strong>Status:</strong>{" "}
              {
                selectedRecruiter.status
              }
            </p>

            <p>
              <strong>Approved:</strong>{" "}
              {selectedRecruiter.approved
                ? "✅ Yes"
                : "⏳ Pending"}
            </p>

            <div
              style={{
                display: "flex",
                gap: "10px",
                marginTop: "20px",
              }}
            >
              <button
                onClick={() =>
                  approveRecruiter(
                    selectedRecruiter.userId
                  )
                }
                style={btn("#16a34a")}
              >
                ✅ Approve
              </button>

              <button
                onClick={() =>
                  rejectRecruiter(
                    selectedRecruiter.userId
                  )
                }
                style={btn("#dc2626")}
              >
                ❌ Reject
              </button>

              <button
                onClick={() =>
                  setSelectedRecruiter(
                    null
                  )
                }
                style={btn("#6b7280")}
              >
                Close
              </button>
            </div>
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

export default PendingRecruiters;