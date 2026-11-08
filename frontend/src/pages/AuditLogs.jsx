import { useEffect, useState } from "react";
import { apiFetch } from "../services/http";
import AdminLayout from "../components/AdminLayout";

function AuditLogs() {
  const [search, setSearch] =
    useState("");

  const [logs, setLogs] = useState([]);

  useEffect(() => {
    apiFetch("/api/admin/audit-logs")
      .then((r) => (r.ok ? r.json() : []))
      .then((data) =>
        setLogs(
          data.map((l) => ({
            ...l,
            time: new Date(l.time.replace(" ", "T") + "Z").toLocaleString(),
          }))
        )
      )
      .catch(console.error);
  }, []);

  const filteredLogs =
    logs.filter(
      (log) =>
        log.action
          .toLowerCase()
          .includes(
            search.toLowerCase()
          ) ||
        log.user
          .toLowerCase()
          .includes(
            search.toLowerCase()
          )
    );

  return (
    <AdminLayout>
      <h1
        style={{
          color: "#0b2c6b",
        }}
      >
        📝 Audit & Security Center
      </h1>

      <p
        style={{
          color: "#64748b",
        }}
      >
        Monitor all critical platform
        activities.
      </p>

      {/* KPI Cards */}

      <div
        style={{
          display: "grid",
          gridTemplateColumns:
            "repeat(auto-fit,minmax(220px,1fr))",
          gap: "20px",
          marginTop: "20px",
          marginBottom: "25px",
        }}
      >
        <Card
          title="Total Logs"
          value="245"
          color="#2563eb"
        />

        <Card
          title="Today's Events"
          value="28"
          color="#16a34a"
        />

        <Card
          title="Security Alerts"
          value="3"
          color="#dc2626"
        />

        <Card
          title="Admin Actions"
          value="15"
          color="#f59e0b"
        />
      </div>

      <input
        type="text"
        placeholder="🔍 Search logs..."
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

      {/* Table */}

      <div
        style={{
          background: "white",
          borderRadius: "16px",
          overflow: "hidden",
          boxShadow:
            "0 8px 20px rgba(0,0,0,0.08)",
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
              <th style={th}>
                Action
              </th>
              <th style={th}>
                User
              </th>
              <th style={th}>
                Severity
              </th>
              <th style={th}>
                Time
              </th>
            </tr>
          </thead>

          <tbody>
            {filteredLogs.map(
              (log) => (
                <tr
                  key={log.id}
                >
                  <td style={td}>
                    {log.action}
                  </td>

                  <td style={td}>
                    {log.user}
                  </td>

                  <td style={td}>
                    <SeverityBadge
                      level={
                        log.severity
                      }
                    />
                  </td>

                  <td style={td}>
                    {log.time}
                  </td>
                </tr>
              )
            )}
          </tbody>
        </table>
      </div>

      {/* Timeline */}

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
        <h2>
          ⏱ Recent Activity
        </h2>

        <div
          style={{
            lineHeight: "2.2",
          }}
        >
          <div>
            🟢 Recruiter Approved
          </div>

          <div>
            🟠 Recruiter Rejected
          </div>

          <div>
            🔴 User Blocked
          </div>

          <div>
            🟢 User Activated
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}

function Card({
  title,
  value,
  color,
}) {
  return (
    <div
      style={{
        background: color,
        color: "white",
        padding: "20px",
        borderRadius: "15px",
      }}
    >
      <h3>{title}</h3>
      <h1>{value}</h1>
    </div>
  );
}

function SeverityBadge({
  level,
}) {
  const colors = {
    LOW: "#16a34a",
    MEDIUM: "#f59e0b",
    HIGH: "#dc2626",
  };

  return (
    <span
      style={{
        background:
          colors[level],
        color: "white",
        padding: "6px 12px",
        borderRadius: "20px",
      }}
    >
      {level}
    </span>
  );
}

const th = {
  padding: "15px",
  textAlign: "left",
};

const td = {
  padding: "15px",
  borderTop:
    "1px solid #eee",
};

export default AuditLogs;