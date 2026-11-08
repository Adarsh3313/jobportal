import { Link } from "react-router-dom";

function HirerDashboard() {
  const email =
    localStorage.getItem("email") ||
    "hirer@example.com";

  const actionButton = {
    background: "#2563eb",
    color: "#fff",
    border: "none",
    padding: "14px",
    borderRadius: "12px",
    width: "100%",
    cursor: "pointer",
    fontWeight: "600",
    fontSize: "15px",
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
            "linear-gradient(135deg,#0f172a,#1e40af)",
          color: "white",
          borderRadius: "24px",
          padding: "40px",
          marginBottom: "30px",
          boxShadow:
            "0 10px 30px rgba(0,0,0,0.12)",
        }}
      >
        <h1
          style={{
            margin: 0,
          }}
        >
          Recruitment Operations Center
        </h1>

        <p
          style={{
            marginTop: "12px",
            opacity: 0.9,
          }}
        >
          Manage job requisitions, applicants,
          interviews and hiring operations.
        </p>

        <p
          style={{
            opacity: 0.8,
            marginTop: "20px",
          }}
        >
          Logged in as: {email}
        </p>
      </div>

      {/* KPI CARDS */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns:
            "repeat(auto-fit,minmax(240px,1fr))",
          gap: "20px",
          marginBottom: "30px",
        }}
      >
        <StatCard
          title="Active Jobs"
          value="10"
          icon="💼"
          color="#1e293b"
        />

        <StatCard
          title="Applicants"
          value="25"
          icon="👥"
          color="#334155"
        />

        <StatCard
          title="Interviews"
          value="5"
          icon="🎤"
          color="#2563eb"
        />

        <StatCard
          title="Offers"
          value="3"
          icon="✅"
          color="#16a34a"
        />
      </div>

      {/* MAIN GRID */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "2fr 1fr",
          gap: "20px",
        }}
      >
        {/* PIPELINE */}
        <div
          style={cardStyle}
        >
          <h2>📊 Hiring Pipeline</h2>

          <div
            style={{
              display: "flex",
              justifyContent:
                "space-between",
              marginTop: "25px",
            }}
          >
            <PipelineStep
              label="Applied"
              count="48"
              color="#2563eb"
            />

            <PipelineStep
              label="Shortlisted"
              count="22"
              color="#f59e0b"
            />

            <PipelineStep
              label="Interview"
              count="8"
              color="#7c3aed"
            />

            <PipelineStep
              label="Selected"
              count="3"
              color="#16a34a"
            />
          </div>
        </div>

        {/* ACTIVITY */}
        <div
          style={cardStyle}
        >
          <h2>📝 Recent Activity</h2>

          <ActivityItem text="New applicant applied for Java Developer" />
          <ActivityItem text="Interview scheduled for React Developer" />
          <ActivityItem text="Job posting approved" />
          <ActivityItem text="Candidate selected" />
        </div>
      </div>

      {/* QUICK ACTIONS */}
      <div
        style={{
          ...cardStyle,
          marginTop: "25px",
        }}
      >
        <h2>⚡ Quick Actions</h2>

        <div
          style={{
            display: "grid",
            gridTemplateColumns:
              "repeat(auto-fit,minmax(250px,1fr))",
            gap: "20px",
            marginTop: "20px",
          }}
        >
          <div style={actionCard}>
            <h3>➕ Create Job</h3>

            <p>
              Publish a new opening and start
              receiving applications.
            </p>

            <Link to="/create-job">
              <button style={actionButton}>
                Create Job
              </button>
            </Link>
          </div>

          <div style={actionCard}>
            <h3>💼 Manage Jobs</h3>

            <p>
              Edit, close and monitor job
              openings.
            </p>

            <Link to="/manage-jobs">
              <button style={actionButton}>
                Manage Jobs
              </button>
            </Link>
          </div>

          <div style={actionCard}>
            <h3>👥 Applicants</h3>

            <p>
              Review applications and candidate
              profiles.
            </p>

            <Link to="/manage-jobs">
              <button style={actionButton}>
                View Candidates
              </button>
            </Link>
          </div>
        </div>
      </div>

      {/* INSIGHTS */}
      <div
        style={{
          ...cardStyle,
          marginTop: "25px",
        }}
      >
        <h2>📈 Recruitment Insights</h2>

        <div
          style={{
            display: "grid",
            gridTemplateColumns:
              "repeat(auto-fit,minmax(250px,1fr))",
            gap: "20px",
            marginTop: "20px",
          }}
        >
          <InsightCard
            title="Average Hiring Time"
            value="18 Days"
          />

          <InsightCard
            title="Interview Success Rate"
            value="62%"
          />

          <InsightCard
            title="Top Hiring Skill"
            value="Java Full Stack"
          />

          <InsightCard
            title="Applications This Month"
            value="148"
          />
        </div>
      </div>
    </div>
  );
}

function StatCard({
  title,
  value,
  icon,
  color,
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
          alignItems: "center",
        }}
      >
        <div>
          <p>{title}</p>
          <h1>{value}</h1>
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

function PipelineStep({
  label,
  count,
  color,
}) {
  return (
    <div
      style={{
        textAlign: "center",
      }}
    >
      <div
        style={{
          width: "60px",
          height: "60px",
          borderRadius: "50%",
          background: color,
          color: "white",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          margin: "auto",
          fontWeight: "bold",
        }}
      >
        {count}
      </div>

      <p
        style={{
          marginTop: "10px",
        }}
      >
        {label}
      </p>
    </div>
  );
}

function ActivityItem({ text }) {
  return (
    <div
      style={{
        padding: "12px",
        background: "#f8fafc",
        borderRadius: "10px",
        marginBottom: "10px",
      }}
    >
      ✅ {text}
    </div>
  );
}

function InsightCard({
  title,
  value,
}) {
  return (
    <div
      style={{
        background: "#f8fafc",
        padding: "20px",
        borderRadius: "14px",
      }}
    >
      <p
        style={{
          color: "#64748b",
        }}
      >
        {title}
      </p>

      <h3>{value}</h3>
    </div>
  );
}

const cardStyle = {
  background: "white",
  padding: "25px",
  borderRadius: "20px",
  boxShadow:
    "0 4px 14px rgba(0,0,0,.08)",
};

const actionCard = {
  background: "#f8fafc",
  padding: "20px",
  borderRadius: "16px",
};

export default HirerDashboard;