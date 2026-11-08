import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { getJobById } from "../services/jobService";

function JobDetails() {
  const { id } = useParams();

  const [job, setJob] = useState(null);

  useEffect(() => {
    fetchJob();
  }, []);

  const fetchJob = async () => {
    try {
      const data = await getJobById(id);
      setJob(data);
    } catch (error) {
      console.error(error);
    }
  };

  if (!job) {
    return (
      <div
        style={{
          minHeight: "100vh",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          background: "#f5f7fb",
        }}
      >
        <h2>Loading Job Details...</h2>
      </div>
    );
  }

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#f5f7fb",
        padding: "40px",
      }}
    >
      <div
        style={{
          maxWidth: "1200px",
          margin: "0 auto",
        }}
      >
        {/* Header */}
        <div
          style={{
            background:
              "linear-gradient(135deg,#2563eb,#7c3aed)",
            color: "#fff",
            padding: "40px",
            borderRadius: "20px",
            marginBottom: "30px",
          }}
        >
          <h1
            style={{
              margin: 0,
              fontSize: "42px",
            }}
          >
            {job.title}
          </h1>

          <p
            style={{
              marginTop: "15px",
              opacity: "0.9",
            }}
          >
            Explore this opportunity and take the
            next step in your career.
          </p>
        </div>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "2fr 1fr",
            gap: "25px",
          }}
        >
          {/* Left Section */}
          <div
            style={{
              background: "#fff",
              padding: "30px",
              borderRadius: "20px",
              boxShadow:
                "0 4px 20px rgba(0,0,0,.08)",
            }}
          >
            <h2>Job Description</h2>

            <p
              style={{
                color: "#475569",
                lineHeight: "1.8",
              }}
            >
              {job.description}
            </p>

            <div
              style={{
                display: "grid",
                gridTemplateColumns:
                  "repeat(auto-fit, minmax(220px, 1fr))",
                gap: "20px",
                marginTop: "30px",
              }}
            >
              <div style={cardStyle}>
                <h4>📍 Location</h4>
                <p>{job.location}</p>
              </div>

              <div style={cardStyle}>
                <h4>💰 Salary</h4>
                <p>₹ {job.salary}</p>
              </div>

              <div style={cardStyle}>
                <h4>📌 Status</h4>
                <p>{job.status}</p>
              </div>

              <div style={cardStyle}>
                <h4>💼 Employment Type</h4>
                <p>Full Time</p>
              </div>
            </div>
          </div>

          {/* Right Sidebar */}
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: "20px",
            }}
          >
            <div
              style={{
                background: "#fff",
                padding: "25px",
                borderRadius: "20px",
                boxShadow:
                  "0 4px 20px rgba(0,0,0,.08)",
              }}
            >
              <h3>Quick Overview</h3>

              <p>
                <strong>Position:</strong>
                <br />
                {job.title}
              </p>

              <p>
                <strong>Location:</strong>
                <br />
                {job.location}
              </p>

              <p>
                <strong>Salary:</strong>
                <br />
                ₹ {job.salary}
              </p>

              <p>
                <strong>Status:</strong>
                <br />
                {job.status}
              </p>

              <Link to={`/apply/${job.jobId}`}>
                <button
                  style={{
                    width: "100%",
                    background: "#2563eb",
                    color: "#fff",
                    border: "none",
                    padding: "14px",
                    borderRadius: "10px",
                    fontWeight: "600",
                    cursor: "pointer",
                    marginTop: "15px",
                  }}
                >
                  Apply Now
                </button>
              </Link>
            </div>

            <div
              style={{
                background: "#fff",
                padding: "25px",
                borderRadius: "20px",
                boxShadow:
                  "0 4px 20px rgba(0,0,0,.08)",
              }}
            >
              <h3>Benefits</h3>

              <ul
                style={{
                  paddingLeft: "20px",
                  lineHeight: "2",
                }}
              >
                <li>Career Growth Opportunities</li>
                <li>Competitive Compensation</li>
                <li>Flexible Work Environment</li>
                <li>Learning & Development</li>
                <li>Collaborative Team Culture</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

const cardStyle = {
  background: "#f8fafc",
  padding: "20px",
  borderRadius: "15px",
  border: "1px solid #e2e8f0",
};

export default JobDetails;