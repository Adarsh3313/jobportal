import { apiFetch } from "../services/http";
import { useEffect, useState } from "react";
import AdminLayout from "../components/AdminLayout";

function Reports() {
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

  return (
    <AdminLayout>
      <div
        style={{
          marginBottom: "25px",
        }}
      >
        <h1
          style={{
            color: "#0b2c6b",
            margin: 0,
          }}
        >
          📈 Reports & Analytics
        </h1>

        <p
          style={{
            color: "#64748b",
            marginTop: "8px",
          }}
        >
          Enterprise Workforce Insights Dashboard
        </p>
      </div>

      {/* KPI Cards */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns:
            "repeat(auto-fit,minmax(220px,1fr))",
          gap: "20px",
          marginBottom: "30px",
        }}
      >
        <StatsCard
          title="Total Users"
          value={stats.users}
          color="#2563eb"
          icon="👥"
        />

        <StatsCard
          title="Recruiters"
          value={stats.recruiters}
          color="#16a34a"
          icon="🏢"
        />

        <StatsCard
          title="Admins"
          value={stats.admins}
          color="#dc2626"
          icon="🛡️"
        />

        <StatsCard
          title="Pending Approvals"
          value={stats.pendingRecruiters}
          color="#f59e0b"
          icon="⏳"
        />

        <StatsCard
          title="Active Users"
          value={stats.activeUsers || 0}
          color="#0891b2"
          icon="✅"
        />

        <StatsCard
          title="Blocked Users"
          value={stats.blockedUsers || 0}
          color="#7c3aed"
          icon="🚫"
        />
      </div>

      {/* Main Dashboard */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "2fr 1fr",
          gap: "20px",
        }}
      >
        {/* Analytics */}
        <div
          style={{
            background: "white",
            borderRadius: "16px",
            padding: "25px",
            boxShadow:
              "0 8px 20px rgba(0,0,0,0.08)",
          }}
        >
          <h2
            style={{
              marginTop: 0,
              color: "#0b2c6b",
            }}
          >
            📊 System Analytics
          </h2>

          <div
            style={{
              display: "grid",
              gridTemplateColumns:
                "repeat(2,1fr)",
              gap: "15px",
              marginTop: "20px",
            }}
          >
            <AnalyticsBox
              title="User Base"
              value={stats.users}
              text="Total registered users."
            />

            <AnalyticsBox
              title="Recruitment Team"
              value={stats.recruiters}
              text="Approved recruiters."
            />

            <AnalyticsBox
              title="Approvals Queue"
              value={
                stats.pendingRecruiters
              }
              text="Requests awaiting approval."
            />

            <AnalyticsBox
              title="Platform Health"
              value={`${stats.activeUsers || 0}`}
              text="Currently active users."
            />
          </div>
        </div>

        {/* Activity Feed */}
        <div
          style={{
            background: "white",
            borderRadius: "16px",
            padding: "25px",
            boxShadow:
              "0 8px 20px rgba(0,0,0,0.08)",
          }}
        >
          <h2
            style={{
              marginTop: 0,
              color: "#0b2c6b",
            }}
          >
            🕒 Recent Activity
          </h2>

          <ul
            style={{
              paddingLeft: "20px",
              lineHeight: "2.2",
            }}
          >
            <li>
              Recruiters awaiting approval
            </li>

            <li>
              Users actively applying
              for jobs
            </li>

            <li>
              Jobs being managed across
              departments
            </li>

            <li>
              Admin actions monitored by
              audit logs
            </li>

            <li>
              Platform statistics updated
              in real time
            </li>
          </ul>
        </div>
      </div>

      {/* Executive Summary */}
      <div
        style={{
          marginTop: "25px",
          background: "white",
          borderRadius: "16px",
          padding: "25px",
          boxShadow:
            "0 8px 20px rgba(0,0,0,0.08)",
        }}
      >
        <h2
          style={{
            color: "#0b2c6b",
            marginTop: 0,
          }}
        >
          📋 Executive Summary
        </h2>

        <div
          style={{
            display: "grid",
            gridTemplateColumns:
              "repeat(auto-fit,minmax(250px,1fr))",
            gap: "20px",
          }}
        >
          <SummaryItem
            label="Registered Users"
            value={stats.users}
          />

          <SummaryItem
            label="Recruiters"
            value={stats.recruiters}
          />

          <SummaryItem
            label="Pending Approvals"
            value={stats.pendingRecruiters}
          />

          <SummaryItem
            label="Active Users"
            value={stats.activeUsers || 0}
          />

          <SummaryItem
            label="Blocked Users"
            value={stats.blockedUsers || 0}
          />
        </div>
      </div>
    </AdminLayout>
  );
}

function StatsCard({
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
        padding: "22px",
        borderRadius: "16px",
        boxShadow:
          "0 6px 18px rgba(0,0,0,0.15)",
      }}
    >
      <div
        style={{
          fontSize: "28px",
        }}
      >
        {icon}
      </div>

      <h3>{title}</h3>

      <h1
        style={{
          marginBottom: 0,
        }}
      >
        {value}
      </h1>
    </div>
  );
}

function AnalyticsBox({
  title,
  value,
  text,
}) {
  return (
    <div
      style={{
        background: "#f8fafc",
        padding: "20px",
        borderRadius: "12px",
      }}
    >
      <h4>{title}</h4>

      <h2
        style={{
          color: "#2563eb",
        }}
      >
        {value}
      </h2>

      <p
        style={{
          color: "#64748b",
          marginBottom: 0,
        }}
      >
        {text}
      </p>
    </div>
  );
}

function SummaryItem({
  label,
  value,
}) {
  return (
    <div
      style={{
        background: "#f8fafc",
        padding: "18px",
        borderRadius: "12px",
      }}
    >
      <p
        style={{
          color: "#64748b",
          margin: 0,
        }}
      >
        {label}
      </p>

      <h2
        style={{
          color: "#0b2c6b",
          marginBottom: 0,
        }}
      >
        {value}
      </h2>
    </div>
  );
}

export default Reports;