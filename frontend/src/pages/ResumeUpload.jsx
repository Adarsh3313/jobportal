import { useState } from "react";
import { uploadResume } from "../services/resumeService";

function ResumeUpload() {
  const [userId, setUserId] = useState(localStorage.getItem("userId") || "");
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);

  const email =
    localStorage.getItem("email") ||
    "user@example.com";

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!file) {
      alert("Please select a resume");
      return;
    }

    const formData = new FormData();

    formData.append("userId", userId);
    formData.append("file", file);

    try {
      setLoading(true);

      const response =
        await uploadResume(formData);

      alert(response);

      setFile(null);
    } catch (error) {
      console.error(error);
      alert(error.message || "Resume Upload Failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      style={{
        background: "#f8fafc",
        minHeight: "100vh",
        padding: "30px",
      }}
    >
      {/* HEADER */}
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
        <h1 style={{ margin: 0 }}>
          Resume Management Center
        </h1>

        <p
          style={{
            marginTop: "10px",
            opacity: 0.9,
          }}
        >
          Upload and manage your latest
          professional resume.
        </p>
      </div>

      <div
        style={{
          display: "grid",
          gridTemplateColumns:
            "1fr 2fr",
          gap: "25px",
        }}
      >
        {/* PROFILE CARD */}

        <div
          style={{
            background: "white",
            borderRadius: "20px",
            padding: "25px",
            boxShadow:
              "0 4px 15px rgba(0,0,0,0.08)",
          }}
        >
          <h2>👤 Profile Status</h2>

          <p>
            <strong>Email:</strong>
          </p>

          <p
            style={{
              color: "#64748b",
            }}
          >
            {email}
          </p>

          <p>
            <strong>Status:</strong>{" "}
            Active
          </p>

          <p>
            <strong>
              Profile Completion:
            </strong>{" "}
            80%
          </p>

          <div
            style={{
              height: "12px",
              background: "#e5e7eb",
              borderRadius: "10px",
              overflow: "hidden",
              marginTop: "10px",
            }}
          >
            <div
              style={{
                width: "80%",
                height: "100%",
                background: "#10b981",
              }}
            />
          </div>

          <div
            style={{
              marginTop: "20px",
              padding: "12px",
              background: "#f8fafc",
              borderRadius: "10px",
            }}
          >
            ✅ Resume Last Updated
            <br />
            <span
              style={{
                color: "#64748b",
              }}
            >
              Today
            </span>
          </div>
        </div>

        {/* UPLOAD CARD */}

        <div
          style={{
            background: "white",
            borderRadius: "20px",
            padding: "30px",
            boxShadow:
              "0 4px 15px rgba(0,0,0,0.08)",
          }}
        >
          <h2>
            📄 Upload Resume
          </h2>

          <form onSubmit={handleSubmit}>
            <div
              style={{
                marginBottom: "20px",
              }}
            >
              <label>
                User ID
              </label>

              <input
                type="number"
                readOnly
                value={userId}
                onChange={(e) =>
                  setUserId(
                    e.target.value
                  )
                }
                placeholder="Enter User ID"
                style={{
                  width: "100%",
                  padding: "14px",
                  marginTop: "8px",
                  borderRadius: "10px",
                  border:
                    "1px solid #d1d5db",
                }}
              />
            </div>

            {/* DRAG DROP STYLE AREA */}

            <div
              style={{
                border:
                  "2px dashed #2563eb",
                borderRadius: "16px",
                padding: "40px",
                textAlign: "center",
                background:
                  "#f8fafc",
                marginBottom: "20px",
              }}
            >
              <div
                style={{
                  fontSize: "50px",
                }}
              >
                📤
              </div>

              <h3>
                Upload Resume
              </h3>

              <p
                style={{
                  color: "#64748b",
                }}
              >
                Supported formats:
                PDF, DOC, DOCX
              </p>

              <input
                type="file"
                accept=".pdf,.doc,.docx"
                onChange={(e) =>
                  setFile(
                    e.target.files[0]
                  )
                }
              />

              {file && (
                <div
                  style={{
                    marginTop: "15px",
                    padding: "10px",
                    background:
                      "#e0f2fe",
                    borderRadius:
                      "10px",
                  }}
                >
                  ✅ {file.name}
                </div>
              )}
            </div>

            <button
              type="submit"
              disabled={loading}
              style={{
                width: "100%",
                background:
                  "#2563eb",
                color: "white",
                border: "none",
                padding: "14px",
                borderRadius:
                  "12px",
                fontWeight: "600",
                cursor: "pointer",
              }}
            >
              {loading
                ? "Uploading..."
                : "Upload Resume"}
            </button>
          </form>

          <div
            style={{
              marginTop: "25px",
              background: "#f8fafc",
              padding: "15px",
              borderRadius: "12px",
            }}
          >
            <h4>
              📌 Resume Guidelines
            </h4>

            <ul>
              <li>
                Upload your latest
                resume.
              </li>

              <li>
                Include relevant
                skills and projects.
              </li>

              <li>
                Keep file size under
                5 MB.
              </li>

              <li>
                PDF format is
                recommended.
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ResumeUpload;