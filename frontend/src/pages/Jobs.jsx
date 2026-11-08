import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getAllJobs } from "../services/jobService";

function Jobs() {
  const [jobs, setJobs] = useState([]);
  const [search, setSearch] = useState("");

  useEffect(() => {
    loadJobs();
  }, []);

  const loadJobs = async () => {
    try {
      const data = await getAllJobs();
      setJobs(data || []);
    } catch (error) {
      console.error(error);
    }
  };

  const filteredJobs = jobs.filter((job) =>
    job.title
      ?.toLowerCase()
      .includes(search.toLowerCase())
  );

  return (
    <div
      style={{
        background: "#f8fafc",
        minHeight: "100vh",
      }}
    >
      {/* HERO SECTION */}
      <div
        style={{
          background:
            "linear-gradient(135deg,#0f172a,#1e40af)",
          color: "white",
          padding: "60px 40px",
          textAlign: "center",
        }}
      >
        <h1
          style={{
            fontSize: "42px",
            marginBottom: "10px",
          }}
        >
          Find Your Dream Career
        </h1>

        <p
          style={{
            fontSize: "18px",
            opacity: 0.9,
          }}
        >
          Discover opportunities from top
          companies and recruiters.
        </p>

        <div
          style={{
            maxWidth: "700px",
            margin: "30px auto 0",
          }}
        >
          <input
            type="text"
            placeholder="Search jobs, skills, companies..."
            value={search}
            onChange={(e) =>
              setSearch(e.target.value)
            }
            style={{
              width: "100%",
              padding: "16px",
              borderRadius: "12px",
              border: "none",
              fontSize: "16px",
            }}
          />
        </div>
      </div>

      {/* STATS */}
      <div
        style={{
          maxWidth: "1300px",
          margin: "-35px auto 30px",
          display: "grid",
          gridTemplateColumns:
            "repeat(auto-fit,minmax(220px,1fr))",
          gap: "20px",
          padding: "0 20px",
        }}
      >
        <StatCard
          title="Available Jobs"
          value={jobs.length}
          icon="💼"
        />

        <StatCard
          title="Companies"
          value={
            new Set(
              jobs.map(
                (j) => j.companyName
              )
            ).size
          }
          icon="🏢"
        />

        <StatCard
          title="Locations"
          value={
            new Set(
              jobs.map(
                (j) => j.location
              )
            ).size
          }
          icon="📍"
        />

        <StatCard
          title="Active Openings"
          value={
            jobs.filter(
              (j) =>
                j.status === "ACTIVE"
            ).length
          }
          icon="🚀"
        />
      </div>

      {/* JOBS SECTION */}
      <div
        style={{
          maxWidth: "1300px",
          margin: "0 auto",
          padding: "20px",
        }}
      >
        <div
          style={{
            display: "flex",
            justifyContent:
              "space-between",
            alignItems: "center",
            marginBottom: "25px",
          }}
        >
          <h2
            style={{
              margin: 0,
            }}
          >
            Featured Opportunities
          </h2>

          <select
            style={{
              padding: "10px",
              borderRadius: "10px",
            }}
          >
            <option>Newest</option>
            <option>Salary High</option>
            <option>Salary Low</option>
          </select>
        </div>

        {filteredJobs.length === 0 ? (
          <div
            style={{
              background: "white",
              borderRadius: "20px",
              padding: "60px",
              textAlign: "center",
              boxShadow:
                "0 4px 15px rgba(0,0,0,0.08)",
            }}
          >
            <div
              style={{
                fontSize: "60px",
              }}
            >
              💼
            </div>

            <h2>
              No Opportunities Available
            </h2>

            <p
              style={{
                color: "#64748b",
              }}
            >
              We couldn't find any jobs
              matching your search.
            </p>
          </div>
        ) : (
          <div
            style={{
              display: "grid",
              gridTemplateColumns:
                "repeat(auto-fit,minmax(350px,1fr))",
              gap: "20px",
            }}
          >
            {filteredJobs.map((job) => (
              <div
                key={job.jobId}
                style={{
                  background: "white",
                  borderRadius: "18px",
                  padding: "24px",
                  boxShadow:
                    "0 4px 15px rgba(0,0,0,0.08)",
                }}
              >
                <div
                  style={{
                    display: "flex",
                    justifyContent:
                      "space-between",
                    alignItems:
                      "flex-start",
                  }}
                >
                  <div>
                    <h3
                      style={{
                        margin: 0,
                      }}
                    >
                      {job.title}
                    </h3>

                    <p
                      style={{
                        color: "#64748b",
                      }}
                    >
                      {job.companyName}
                    </p>
                  </div>

                  <span
                    style={{
                      background:
                        "#e0f2fe",
                      color: "#0369a1",
                      padding:
                        "6px 10px",
                      borderRadius:
                        "10px",
                    }}
                  >
                    {job.status}
                  </span>
                </div>

                <p>
                  📍 {job.location}
                </p>

                <p>
                  💰 ₹ {job.salary}
                </p>

                <p>
                  🏢
                  {" "}
                  {job.department}
                </p>

                <Link
                  to={`/jobs/${job.jobId}`}
                >
                  <button
                    style={{
                      width: "100%",
                      marginTop: "15px",
                      background:
                        "#2563eb",
                      color: "white",
                      border: "none",
                      padding: "12px",
                      borderRadius:
                        "10px",
                      cursor: "pointer",
                      fontWeight: "600",
                    }}
                  >
                    View Opportunity
                  </button>
                </Link>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function StatCard({
  title,
  value,
  icon,
}) {
  return (
    <div
      style={{
        background: "white",
        borderRadius: "18px",
        padding: "22px",
        boxShadow:
          "0 4px 15px rgba(0,0,0,0.08)",
      }}
    >
      <div
        style={{
          display: "flex",
          justifyContent:
            "space-between",
          alignItems: "center",
        }}
      >
        <div>
          <p
            style={{
              color: "#64748b",
              margin: 0,
            }}
          >
            {title}
          </p>

          <h2>{value}</h2>
        </div>

        <div
          style={{
            fontSize: "38px",
          }}
        >
          {icon}
        </div>
      </div>
    </div>
  );
}

export default Jobs;