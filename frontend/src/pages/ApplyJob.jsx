import { useState } from "react";
import { useParams } from "react-router-dom";
import { applyJob } from "../services/applicationService";

function ApplyJob() {
  const { id } = useParams();

  const [applicationData, setApplicationData] =
    useState({
      jobId: Number(id),
      applicantName: localStorage.getItem("fullName") || "",
      applicantEmail: localStorage.getItem("email") || "",
      resumeUrl: "UPLOADED_RESUME",
    });

  const [loading, setLoading] =
    useState(false);

  const handleChange = (e) => {
    setApplicationData({
      ...applicationData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);

      const response = await applyJob(
        applicationData
      );

      alert(response);

    } catch (error) {
      console.error(error);
      alert(error.message || "Application Failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#f8fafc",
        padding: "40px 20px",
      }}
    >
      <div
        style={{
          maxWidth: "1400px",
          margin: "0 auto",
        }}
      >
        {/* HERO */}
        <div
          style={{
            background:
              "linear-gradient(135deg,#0f172a,#2563eb)",
            color: "white",
            padding: "40px",
            borderRadius: "24px",
            marginBottom: "30px",
          }}
        >
          <div
            style={{
              display: "flex",
              justifyContent:
                "space-between",
              alignItems: "center",
              flexWrap: "wrap",
            }}
          >
            <div>
              <h1
                style={{
                  margin: 0,
                  fontSize: "42px",
                }}
              >
                Apply For Position
              </h1>

              <p
                style={{
                  marginTop: "12px",
                  opacity: 0.9,
                }}
              >
                Complete your application and
                join our enterprise hiring
                process.
              </p>
            </div>

            <div>
              <div
                style={{
                  opacity: 0.8,
                }}
              >
                Job Reference
              </div>
              <h2
                style={{
                  margin: 0,
                }}
              >
                #{id}
              </h2>
            </div>
          </div>
        </div>

        {/* PROGRESS */}
        <div
          style={{
            background: "white",
            borderRadius: "20px",
            padding: "25px",
            marginBottom: "25px",
            boxShadow:
              "0 4px 12px rgba(0,0,0,.08)",
          }}
        >
          <h3
            style={{
              marginTop: 0,
            }}
          >
            Recruitment Journey
          </h3>

          <div
            style={{
              display: "flex",
              justifyContent:
                "space-between",
              flexWrap: "wrap",
              gap: "15px",
            }}
          >
            <Step
              active
              label="Application"
            />
            <Step
              label="Screening"
            />
            <Step
              label="Interview"
            />
            <Step label="Offer" />
          </div>
        </div>

        {/* MAIN GRID */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns:
              "2fr 1fr",
            gap: "25px",
          }}
        >
          {/* FORM SECTION */}
          <div
            style={{
              background: "white",
              padding: "35px",
              borderRadius: "24px",
              boxShadow:
                "0 4px 16px rgba(0,0,0,.08)",
            }}
          >
            <h2
              style={{
                marginTop: 0,
              }}
            >
              Candidate Information
            </h2>

            <form
              onSubmit={handleSubmit}
            >
              <label>
                Full Name
              </label>

              <input
                type="text"
                name="applicantName"
                placeholder="Enter your full name"
                value={
                  applicationData.applicantName
                }
                onChange={
                  handleChange
                }
                style={inputStyle}
                required
              />

              <label>
                Email Address
              </label>

              <input
                type="email"
                name="applicantEmail"
                readOnly
                placeholder="Enter your email address"
                value={
                  applicationData.applicantEmail
                }
                onChange={
                  handleChange
                }
                style={inputStyle}
                required
              />

              <div
                style={{
                  background:
                    "#ecfdf5",
                  border:
                    "1px solid #10b981",
                  borderRadius:
                    "14px",
                  padding: "20px",
                  marginBottom:
                    "25px",
                }}
              >
                <h3
                  style={{
                    marginTop: 0,
                    color:
                      "#065f46",
                  }}
                >
                  Resume Verification
                </h3>

                <p
                  style={{
                    margin: 0,
                    color:
                      "#065f46",
                    lineHeight:
                      "1.8",
                  }}
                >
                  ✅ Resume uploaded
                  successfully
                  <br />
                  ✅ Available for
                  recruiter review
                  <br />
                  ✅ Ready for
                  application
                </p>
              </div>

              <button
                type="submit"
                disabled={
                  loading
                }
                style={
                  submitButton
                }
              >
                {loading
                  ? "Submitting Application..."
                  : "Submit Application"}
              </button>
            </form>
          </div>

          {/* SIDEBAR */}
          <div
            style={{
              display: "flex",
              flexDirection:
                "column",
              gap: "20px",
            }}
          >
            <div
              style={
                sidebarCard
              }
            >
              <h3>
                Application Summary
              </h3>

              <InfoRow
                label="Job ID"
                value={`#${id}`}
              />

              <InfoRow
                label="Status"
                value="Ready To Submit"
              />

              <InfoRow
                label="Resume"
                value="Verified"
              />

              <InfoRow
                label="Type"
                value="Direct Hiring"
              />
            </div>

            <div
              style={
                sidebarCard
              }
            >
              <h3>
                Before Applying
              </h3>

              <ul
                style={{
                  paddingLeft:
                    "20px",
                  lineHeight:
                    "2",
                }}
              >
                <li>
                  Verify your
                  email address
                </li>
                <li>
                  Keep your
                  resume updated
                </li>
                <li>
                  Review the job
                  requirements
                </li>
                <li>
                  Submit only one
                  application
                </li>
                <li>
                  Track status
                  from dashboard
                </li>
              </ul>
            </div>

            <div
              style={{
                background:
                  "#eff6ff",
                border:
                  "1px solid #2563eb",
                borderRadius:
                  "16px",
                padding: "20px",
              }}
            >
              <h3
                style={{
                  marginTop: 0,
                }}
              >
                Hiring Process
              </h3>

              <div>
                Application
              </div>
              <div>
                ↓
              </div>
              <div>
                Screening
              </div>
              <div>
                ↓
              </div>
              <div>
                Interview
              </div>
              <div>
                ↓
              </div>
              <div>Offer</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function Step({
  label,
  active,
}) {
  return (
    <div
      style={{
        flex: 1,
        minWidth: "150px",
        background: active
          ? "#2563eb"
          : "#e2e8f0",
        color: active
          ? "white"
          : "#475569",
        padding: "14px",
        textAlign: "center",
        borderRadius: "12px",
        fontWeight: "600",
      }}
    >
      {label}
    </div>
  );
}

function InfoRow({
  label,
  value,
}) {
  return (
    <div
      style={{
        marginBottom: "15px",
      }}
    >
      <strong>
        {label}
      </strong>
      <br />
      {value}
    </div>
  );
}

const sidebarCard = {
  background: "white",
  padding: "25px",
  borderRadius: "20px",
  boxShadow:
    "0 4px 16px rgba(0,0,0,.08)",
};

const inputStyle = {
  width: "100%",
  padding: "14px",
  marginTop: "10px",
  marginBottom: "20px",
  borderRadius: "12px",
  border: "1px solid #d1d5db",
  fontSize: "15px",
  boxSizing: "border-box",
};

const submitButton = {
  width: "100%",
  background:
    "linear-gradient(135deg,#2563eb,#4f46e5)",
  color: "white",
  border: "none",
  padding: "16px",
  borderRadius: "12px",
  cursor: "pointer",
  fontWeight: "700",
  fontSize: "16px",
};

export default ApplyJob;