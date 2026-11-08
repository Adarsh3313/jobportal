import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { API_BASE } from "../services/http";

import {
  getAllApplications,
  getApplicationsByJobId,
  updateApplicationStatus,
} from "../services/applicationService";

import {
  scheduleInterview,
} from "../services/interviewService";
import { apiFetch } from "../services/http";

function ViewApplicants() {
  const { jobId } = useParams();

  const [applications, setApplications] =
    useState([]);

  const [search, setSearch] =
    useState("");

  const [offerApp, setOfferApp] = useState(null);
  const [offerForm, setOfferForm] = useState({
    designation: "",
    salary: "",
    joiningDate: "",
    validUntil: "",
    message: "",
  });

  const sendOffer = async () => {
    const res = await apiFetch("/api/offers", {
      method: "POST",
      body: JSON.stringify({ ...offerForm, applicationId: offerApp.applicationId }),
    });
    if (!res.ok) {
      alert(await res.text());
      return;
    }
    alert("Offer letter sent to the candidate");
    setOfferApp(null);
    loadApplicants();
  };

  const [showModal, setShowModal] =
    useState(false);

  const [selectedApplicant,
    setSelectedApplicant] =
    useState(null);

  const [interviewForm,
    setInterviewForm] =
    useState({
      interviewDate: "",
      interviewTime: "",
      mode: "Microsoft Teams",
      interviewer: "",
      meetingLink: "",
    });
useEffect(() => {
  loadApplicants();
}, [jobId]);

const loadApplicants = async () => {
  try {
    const data = jobId
      ? await getApplicationsByJobId(jobId)
      : await getAllApplications();

    setApplications(data || []);
  } catch (error) {
    console.error(error);
    setApplications([]);
  }
};
  const changeStatus = async (
    applicationId,
    status
  ) => {
    try {
      await updateApplicationStatus(
        applicationId,
        status
      );

      loadApplicants();
    } catch (error) {
      console.error(error);
    }
  };

  const saveInterview = async () => {
    try {
      await scheduleInterview({
        applicationId:
          selectedApplicant.applicationId,

        candidateName:
          selectedApplicant.applicantName,

        candidateEmail:
          selectedApplicant.applicantEmail,

        interviewDate:
          interviewForm.interviewDate,

        interviewTime:
          interviewForm.interviewTime,

        mode:
          interviewForm.mode,

        interviewer:
          interviewForm.interviewer,

        meetingLink:
          interviewForm.meetingLink,
      });

      alert(
        "Interview Scheduled Successfully"
      );

      setShowModal(false);

      loadApplicants();
    } catch (error) {
      console.error(error);
    }
  };

  const filteredApplicants =
    applications.filter((a) =>
      a.applicantName
        ?.toLowerCase()
        .includes(search.toLowerCase())
    );

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#f8fafc",
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
          padding: "35px",
          marginBottom: "25px",
        }}
      >
        <h1>
          Applicant Tracking Center
        </h1>

        <p>
          Review applications, shortlist
          candidates and schedule
          interviews.
        </p>

        <p>
          Job ID : {jobId}
        </p>
      </div>

      {/* KPI */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns:
            "repeat(auto-fit,minmax(220px,1fr))",
          gap: "20px",
          marginBottom: "25px",
        }}
      >
        <StatCard
          title="Applicants"
          value={applications.length}
          color="#2563eb"
          icon="👥"
        />

        <StatCard
          title="Shortlisted"
          value={
            applications.filter(
              a =>
                a.status ===
                "SHORTLISTED"
            ).length
          }
          color="#f59e0b"
          icon="⭐"
        />

        <StatCard
          title="Interviews"
          value={
            applications.filter(
              a =>
                a.status ===
                "INTERVIEW"
            ).length
          }
          color="#8b5cf6"
          icon="🎤"
        />

        <StatCard
          title="Selected"
          value={
            applications.filter(
              a =>
                a.status ===
                "SELECTED"
            ).length
          }
          color="#16a34a"
          icon="✅"
        />
      </div>

      {/* SEARCH */}
      <div
        style={{
          background: "white",
          padding: "15px",
          borderRadius: "15px",
          marginBottom: "25px",
          boxShadow:
            "0 5px 15px rgba(0,0,0,.08)",
        }}
      >
        <input
          type="text"
          placeholder="🔍 Search Applicant"
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
            "0 5px 20px rgba(0,0,0,.08)",
        }}
      >
        <table
          style={{
            width: "100%",
            borderCollapse:
              "collapse",
          }}
        >
          <thead>
            <tr
              style={{
                background:
                  "#f8fafc",
              }}
            >
              <th style={th}>Name</th>
              <th style={th}>Email</th>
              <th style={th}>
                Application ID
              </th>
              <th style={th}>Status</th>
              <th style={th}>
                Actions
              </th>
            </tr>
          </thead>

          <tbody>
            {filteredApplicants.map(
              (app) => (
                <tr
                  key={
                    app.applicationId
                  }
                >
                  <td style={td}>
                    {
                      app.applicantName
                    }
                  </td>

                  <td style={td}>
                    {
                      app.applicantEmail
                    }
                    {app.resumeUrl && (
                      <div>
                        <a
                          href={`${API_BASE}${app.resumeUrl}?token=${localStorage.getItem("token")}`}
                          target="_blank"
                          rel="noreferrer"
                        >
                          📄 Resume
                        </a>
                      </div>
                    )}
                  </td>

                  <td style={td}>
                    APP-
                    {
                      app.applicationId
                    }
                  </td>

                  <td style={td}>
                    <span
                      style={{
                        padding:
                          "6px 12px",
                        borderRadius:
                          "20px",
                        background:
                          getStatusColor(
                            app.status
                          ),
                        color:
                          "white",
                        fontWeight:
                          "600",
                      }}
                    >
                      {app.status}
                    </span>
                  </td>

                  <td style={td}>
                    <div
                      style={{
                        display:
                          "flex",
                        gap: "8px",
                        flexWrap:
                          "wrap",
                      }}
                    >
                      <button
                        style={
                          shortlistBtn
                        }
                        onClick={() =>
                          changeStatus(
                            app.applicationId,
                            "SHORTLISTED"
                          )
                        }
                      >
                        Shortlist
                      </button>

                      <button
                        style={
                          interviewBtn
                        }
                        onClick={() => {
                          setSelectedApplicant(
                            app
                          );

                          setShowModal(
                            true
                          );
                        }}
                      >
                        Interview
                      </button>

                      <button
                        style={
                          selectBtn
                        }
                        onClick={() =>
                          changeStatus(
                            app.applicationId,
                            "SELECTED"
                          )
                        }
                      >
                        Select
                      </button>

                      {app.status === "SELECTED" && (
                        <button
                          style={selectBtn}
                          onClick={() => {
                            setOfferApp(app);
                            setOfferForm({ designation: app.jobTitle || "", salary: "", joiningDate: "", validUntil: "", message: "" });
                          }}
                        >
                          Send Offer Letter
                        </button>
                      )}

                      {!String(app.status).startsWith("OFFER_") && (
                      <button
                        style={
                          rejectBtn
                        }
                        onClick={() =>
                          changeStatus(
                            app.applicationId,
                            "REJECTED"
                          )
                        }
                      >
                        Reject
                      </button>
                      )}
                    </div>
                  </td>
                </tr>
              )
            )}
          </tbody>
        </table>
      </div>

      {/* OFFER LETTER MODAL */}
      {offerApp && (
        <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,.5)", display: "flex", justifyContent: "center", alignItems: "center", zIndex: 999 }}>
          <div style={{ background: "white", width: "550px", maxWidth: "95vw", padding: "30px", borderRadius: "20px" }}>
            <h2>Offer Letter — {offerApp.applicantName}</h2>
            <input style={inputStyle} placeholder="Designation" value={offerForm.designation} onChange={(e) => setOfferForm({ ...offerForm, designation: e.target.value })} />
            <input style={inputStyle} placeholder="Salary / CTC (e.g. 12 LPA)" value={offerForm.salary} onChange={(e) => setOfferForm({ ...offerForm, salary: e.target.value })} />
            <label>Joining date</label>
            <input type="date" style={inputStyle} value={offerForm.joiningDate} onChange={(e) => setOfferForm({ ...offerForm, joiningDate: e.target.value })} />
            <label>Offer valid until</label>
            <input type="date" style={inputStyle} value={offerForm.validUntil} onChange={(e) => setOfferForm({ ...offerForm, validUntil: e.target.value })} />
            <textarea style={inputStyle} rows={4} placeholder="Message to candidate" value={offerForm.message} onChange={(e) => setOfferForm({ ...offerForm, message: e.target.value })} />
            <div style={{ display: "flex", gap: "10px" }}>
              <button onClick={sendOffer} style={selectBtn}>Send Offer</button>
              <button onClick={() => setOfferApp(null)} style={rejectBtn}>Cancel</button>
            </div>
          </div>
        </div>
      )}

      {/* INTERVIEW MODAL */}
      {showModal && (
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
            zIndex: 999,
          }}
        >
          <div
            style={{
              background:
                "white",
              width: "550px",
              padding: "30px",
              borderRadius:
                "20px",
            }}
          >
            <h2>
              Schedule Interview
            </h2>

            <input
              type="date"
              style={
                inputStyle
              }
              onChange={(e) =>
                setInterviewForm({
                  ...interviewForm,
                  interviewDate:
                    e.target.value,
                })
              }
            />

            <input
              type="time"
              style={
                inputStyle
              }
              onChange={(e) =>
                setInterviewForm({
                  ...interviewForm,
                  interviewTime:
                    e.target.value,
                })
              }
            />

            <input
              placeholder="Interviewer"
              style={
                inputStyle
              }
              onChange={(e) =>
                setInterviewForm({
                  ...interviewForm,
                  interviewer:
                    e.target.value,
                })
              }
            />

            <input
              placeholder="Meeting Link"
              style={
                inputStyle
              }
              onChange={(e) =>
                setInterviewForm({
                  ...interviewForm,
                  meetingLink:
                    e.target.value,
                })
              }
            />

            <div
              style={{
                display:
                  "flex",
                gap: "10px",
              }}
            >
              <button
                onClick={
                  saveInterview
                }
                style={
                  selectBtn
                }
              >
                Schedule
              </button>

              <button
                onClick={() =>
                  setShowModal(
                    false
                  )
                }
                style={
                  rejectBtn
                }
              >
                Cancel
              </button>
            </div>
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
            fontSize: "35px",
          }}
        >
          {icon}
        </div>
      </div>
    </div>
  );
}

function getStatusColor(
  status
) {
  switch (status) {
    case "SHORTLISTED":
      return "#f59e0b";
    case "INTERVIEW":
      return "#8b5cf6";
    case "SELECTED":
    case "OFFER_ACCEPTED":
      return "#16a34a";
    case "OFFER_SENT":
      return "#0891b2";
    case "OFFER_DECLINED":
      return "#b45309";
    case "REJECTED":
      return "#dc2626";
    default:
      return "#2563eb";
  }
}

const th = {
  padding: "16px",
  textAlign: "left",
};

const td = {
  padding: "16px",
  borderTop:
    "1px solid #e5e7eb",
};

const inputStyle = {
  width: "100%",
  padding: "12px",
  marginBottom: "15px",
  borderRadius: "10px",
  border:
    "1px solid #d1d5db",
  boxSizing:
    "border-box",
};

const shortlistBtn = {
  background: "#f59e0b",
  color: "white",
  border: "none",
  padding: "8px 12px",
  borderRadius: "8px",
  cursor: "pointer",
};

const interviewBtn = {
  background: "#8b5cf6",
  color: "white",
  border: "none",
  padding: "8px 12px",
  borderRadius: "8px",
  cursor: "pointer",
};

const selectBtn = {
  background: "#16a34a",
  color: "white",
  border: "none",
  padding: "8px 12px",
  borderRadius: "8px",
  cursor: "pointer",
};

const rejectBtn = {
  background: "#dc2626",
  color: "white",
  border: "none",
  padding: "8px 12px",
  borderRadius: "8px",
  cursor: "pointer",
};

export default ViewApplicants;