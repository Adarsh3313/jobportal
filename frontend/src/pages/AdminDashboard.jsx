import { apiFetch } from "../services/http";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import AdminLayout from "../components/AdminLayout";

function AdminDashboard() {
  const navigate = useNavigate();

  const [stats, setStats] = useState({
    users: 0,
    recruiters: 0,
    admins: 0,
    pendingRecruiters: 0,
    activeUsers: 0,
    blockedUsers: 0,
  });

  useEffect(() => {
    loadStats();
  }, []);

  const loadStats = async () => {
    try {
      const response = await apiFetch(
        "/api/admin/stats"
      );

      const data = await response.json();

      setStats(data);
    } catch (error) {
      console.error(error);
    }
  };

  const cardStyle = (bg) => ({
    background: bg,
    color: "white",
    padding: "24px",
    borderRadius: "18px",
    boxShadow:
      "0 8px 20px rgba(0,0,0,0.12)",
  });

  return (
    <AdminLayout>
      {/* HEADER */}
      <div
        style={{
          marginBottom: "30px",
        }}
      >
        <h1
          style={{
            margin: 0,
            color: "#0f172a",
          }}
        >
          Enterprise Workforce Portal
        </h1>

        <p
          style={{
            color: "#64748b",
            marginTop: "8px",
          }}
        >
          Centralized recruitment, hiring and
          administration dashboard.
        </p>
      </div>

      {/* KPI CARDS */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns:
            "repeat(auto-fit,minmax(250px,1fr))",
          gap: "20px",
        }}
      >
        <div style={cardStyle("#1e293b")}>
          <CardContent
            title="Total Users"
            value={stats.users}
            icon="👥"
          />
        </div>

        <div style={cardStyle("#334155")}>
          <CardContent
            title="Recruiters"
            value={stats.recruiters}
            icon="🏢"
          />
        </div>

        <div style={cardStyle("#475569")}>
          <CardContent
            title="Admins"
            value={stats.admins}
            icon="🛡️"
          />
        </div>

        <div style={cardStyle("#64748b")}>
          <CardContent
            title="Pending Recruiters"
            value={stats.pendingRecruiters}
            icon="⏳"
          />
        </div>

        <div style={cardStyle("#0f766e")}>
          <CardContent
            title="Active Users"
            value={stats.activeUsers || 0}
            icon="✅"
          />
        </div>

        <div style={cardStyle("#991b1b")}>
          <CardContent
            title="Blocked Users"
            value={stats.blockedUsers || 0}
            icon="🚫"
          />
        </div>
      </div>

      {/* QUICK ACTIONS + STATUS */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns:
            "2fr 1fr",
          gap: "20px",
          marginTop: "30px",
        }}
      >
        {/* QUICK ACTIONS */}
        <div
          style={{
            background: "white",
            borderRadius: "18px",
            padding: "25px",
            boxShadow:
              "0 4px 15px rgba(0,0,0,0.08)",
          }}
        >
          <h2
            style={{
              marginTop: 0,
              color: "#0f172a",
            }}
          >
            ⚡ Quick Actions
          </h2>

          <div
            style={{
              display: "grid",
              gridTemplateColumns:
                "repeat(auto-fit,minmax(220px,1fr))",
              gap: "15px",
              marginTop: "20px",
            }}
          >
            <button
              style={actionBtn}
              onClick={() =>
                navigate("/create-job")
              }
            >
              ➕ Create Job
            </button>

            <button
              style={actionBtn}
              onClick={() =>
                navigate(
                  "/pending-recruiters"
                )
              }
            >
              ✅ Approve Recruiters
            </button>

            <button
              style={actionBtn}
              onClick={() =>
                navigate("/manage-users")
              }
            >
              👥 Manage Users
            </button>

            <button
              style={actionBtn}
              onClick={() =>
                navigate("/reports")
              }
            >
              📈 View Reports
            </button>

            <button
              style={actionBtn}
              onClick={() =>
                navigate("/manage-jobs")
              }
            >
              💼 Manage Jobs
            </button>

            <button
              style={actionBtn}
              onClick={() =>
                navigate("/audit-logs")
              }
            >
              📝 Audit Logs
            </button>
          </div>
        </div>

        {/* PLATFORM STATUS */}
        <div
          style={{
            background: "white",
            borderRadius: "18px",
            padding: "25px",
            boxShadow:
              "0 4px 15px rgba(0,0,0,0.08)",
          }}
        >
          <h2
            style={{
              marginTop: 0,
            }}
          >
            🟢 Platform Status
          </h2>

          <p>✅ User Service</p>
          <p>✅ Job Service</p>
          <p>✅ Admin Service</p>
          <p>✅ Recruitment Service</p>
        </div>
      </div>

      {/* RECENT ACTIVITY */}
      <div
        style={{
          marginTop: "25px",
          background: "white",
          padding: "25px",
          borderRadius: "18px",
          boxShadow:
            "0 4px 15px rgba(0,0,0,0.08)",
        }}
      >
        <h2
          style={{
            marginTop: 0,
          }}
        >
          📝 Recent Activity
        </h2>

        <div
          style={{
            display: "grid",
            gap: "12px",
          }}
        >
          <ActivityItem text="Recruiter approved successfully" />
          <ActivityItem text="New user registration completed" />
          <ActivityItem text="Job opening published" />
          <ActivityItem text="Candidate application received" />
          <ActivityItem text="User account blocked" />
        </div>
      </div>

      {/* OVERVIEW */}
      <div
        style={{
          marginTop: "25px",
          background: "white",
          padding: "25px",
          borderRadius: "18px",
          boxShadow:
            "0 4px 15px rgba(0,0,0,0.08)",
        }}
      >
        <h2
          style={{
            marginTop: 0,
          }}
        >
          📊 System Overview
        </h2>

        <p
          style={{
            color: "#64748b",
            lineHeight: "1.8",
          }}
        >
          Monitor recruiters, users,
          jobs, applications and platform
          activity through a centralized
          enterprise administration
          dashboard designed for workforce
          management and recruitment
          operations.
        </p>
      </div>
    </AdminLayout>
  );
}

function CardContent({
  title,
  value,
  icon,
}) {
  return (
    <div
      style={{
        display: "flex",
        justifyContent:
          "space-between",
        alignItems: "center",
      }}
    >
      <div>
        <h3
          style={{
            margin: 0,
          }}
        >
          {title}
        </h3>

        <h1
          style={{
            marginTop: "10px",
            marginBottom: 0,
          }}
        >
          {value}
        </h1>
      </div>

      <div
        style={{
          fontSize: "42px",
        }}
      >
        {icon}
      </div>
    </div>
  );
}

function ActivityItem({ text }) {
  return (
    <div
      style={{
        background: "#f8fafc",
        padding: "14px",
        borderRadius: "12px",
      }}
    >
      ✅ {text}
    </div>
  );
}

const actionBtn = {
  background: "#2563eb",
  color: "white",
  border: "none",
  padding: "16px",
  borderRadius: "14px",
  cursor: "pointer",
  fontWeight: "600",
  fontSize: "15px",
  boxShadow:
    "0 6px 14px rgba(37,99,235,0.25)",
};

export default AdminDashboard;