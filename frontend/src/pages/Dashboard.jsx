import { Link } from "react-router-dom";

function Dashboard() {
  const email =
    localStorage.getItem("email") ||
    "user@example.com";

  const name = email.split("@")[0];

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
            "linear-gradient(135deg,#0f172a,#1e40af)",
          color: "white",
          borderRadius: "24px",
          padding: "40px",
          marginBottom: "25px",
          boxShadow:
            "0 10px 30px rgba(0,0,0,0.15)",
        }}
      >
        <h1
          style={{
            margin: 0,
          }}
        >
          Welcome Back, {name} 👋
        </h1>

        <p
          style={{
            marginTop: "10px",
            fontSize: "16px",
            opacity: "0.9",
          }}
        >
          Career Intelligence Center
        </p>

        <p
          style={{
            opacity: "0.8",
          }}
        >
          Track applications, interviews,
          profile strength and career growth.
        </p>
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
        <Card
          icon="📄"
          title="Applications"
          value="12"
          color="#1e293b"
        />

        <Card
          icon="💼"
          title="Saved Jobs"
          value="5"
          color="#334155"
        />

        <Card
          icon="🎤"
          title="Interviews"
          value="2"
          color="#2563eb"
        />

        <Card
          icon="⭐"
          title="Profile Score"
          value="80%"
          color="#7c3aed"
        />
      </div>

      {/* MAIN GRID */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns:
            "1fr 1fr",
          gap: "20px",
        }}
      >
        {/* PROFILE */}
        <div
          style={cardStyle}
        >
          <h2>👤 Profile Summary</h2>

          <p>
            <strong>Email:</strong>{" "}
            {email}
          </p>

          <p>
            <strong>Status:</strong>{" "}
            Active
          </p>

          <p>
            <strong>Profile Completion:</strong>{" "}
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

          <Link
            to="/upload-resume"
          >
            <button
              style={{
                ...buttonStyle,
                marginTop: "15px",
              }}
            >
              Update Resume
            </button>
          </Link>
        </div>

        {/* CAREER INSIGHTS */}
        <div
          style={cardStyle}
        >
          <h2>📊 Hiring Insights</h2>

          <p>
            Applications Submitted: 12
          </p>

          <p>
            Interviews Scheduled: 2
          </p>

          <p>
            Success Rate: 67%
          </p>

          <p>
            Average Recruiter Response:
            3 Days
          </p>

          <p>
            Top Skill Demand: Java Full
            Stack
          </p>
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
            display: "flex",
            flexWrap: "wrap",
            gap: "15px",
            marginTop: "15px",
          }}
        >
          <Link to="/jobs">
            <button
              style={buttonStyle}
            >
              Browse Jobs
            </button>
          </Link>

          <Link to="/upload-resume">
            <button
              style={buttonStyle}
            >
              Upload Resume
            </button>
          </Link>

          <Link to="/my-applications">
            <button
              style={buttonStyle}
            >
              My Applications
            </button>
          </Link>
        </div>
      </div>

      {/* RECENT ACTIVITY */}
      <div
        style={{
          ...cardStyle,
          marginTop: "25px",
        }}
      >
        <h2>📝 Recent Activity</h2>

        <Activity
          title="Applied for Java Developer"
          time="Today • 10:30 AM"
        />

        <Activity
          title="Resume Updated"
          time="Yesterday"
        />

        <Activity
          title="Interview Scheduled"
          time="2 Days Ago"
        />

        <Activity
          title="Saved React Developer Job"
          time="3 Days Ago"
        />
      </div>

      {/* RECOMMENDED JOBS */}
      <div
        style={{
          ...cardStyle,
          marginTop: "25px",
        }}
      >
        <h2>
          🚀 Recommended Opportunities
        </h2>

        <div
          style={{
            display: "grid",
            gridTemplateColumns:
              "repeat(auto-fit,minmax(300px,1fr))",
            gap: "20px",
            marginTop: "20px",
          }}
        >
          <JobCard
            title="Senior Java Developer"
            location="Bangalore"
            salary="12 LPA"
          />

          <JobCard
            title="React Developer"
            location="Hyderabad"
            salary="10 LPA"
          />

          <JobCard
            title="Data Engineer"
            location="Chennai"
            salary="14 LPA"
          />
        </div>
      </div>
    </div>
  );
}

function Card({
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
          <h4>{title}</h4>
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

function Activity({
  title,
  time,
}) {
  return (
    <div
      style={{
        background: "#f8fafc",
        padding: "15px",
        borderRadius: "12px",
        marginBottom: "12px",
        borderLeft:
          "4px solid #2563eb",
      }}
    >
      <strong>{title}</strong>

      <div
        style={{
          color: "#64748b",
          marginTop: "5px",
        }}
      >
        {time}
      </div>
    </div>
  );
}

function JobCard({
  title,
  location,
  salary,
}) {
  return (
    <div
      style={{
        border: "1px solid #e5e7eb",
        borderRadius: "16px",
        padding: "20px",
      }}
    >
      <h3>{title}</h3>

      <p>📍 {location}</p>

      <p>💰 ₹{salary}</p>

      <button
        style={buttonStyle}
      >
        Apply Now
      </button>
    </div>
  );
}

const cardStyle = {
  background: "white",
  padding: "25px",
  borderRadius: "20px",
  boxShadow:
    "0 4px 16px rgba(0,0,0,0.08)",
};

const buttonStyle = {
  background: "#2563eb",
  color: "white",
  border: "none",
  padding: "12px 18px",
  borderRadius: "10px",
  cursor: "pointer",
  fontWeight: "600",
};

export default Dashboard;