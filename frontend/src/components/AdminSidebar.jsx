import { Link, useLocation } from "react-router-dom";

function AdminSidebar() {
  const location = useLocation();

  const itemStyle = (path) => ({
    display: "block",
    padding: "14px",
    marginBottom: "10px",
    textDecoration: "none",
    color: "white",
    borderRadius: "10px",
    background:
      location.pathname === path
        ? "#2563eb"
        : "transparent",
  });

  const logout = () => {
    localStorage.clear();
    window.location.href = "/";
  };

  return (
    <div
      style={{
        width: "250px",
        height: "100vh",
        position: "fixed",
        left: 0,
        top: 0,
        background: "#0b2c6b",
        color: "white",
        padding: "20px",
      }}
    >
      <h2>Admin Portal</h2>

      <Link
        to="/admin-dashboard"
        style={itemStyle("/admin-dashboard")}
      >
        📊 Dashboard
      </Link>

      <Link
        to="/manage-users"
        style={itemStyle("/manage-users")}
      >
        👥 Users
      </Link>

      <Link
        to="/pending-recruiters"
        style={itemStyle("/pending-recruiters")}
      >
        ✅ Recruiters
      </Link>

      <Link
        to="/review-jobs"
        style={itemStyle("/review-jobs")}
      >
        🧾 Review Jobs
      </Link>

      <Link
        to="/manage-jobs"
        style={itemStyle("/manage-jobs")}
      >
        💼 Jobs
      </Link>

      <Link
        to="/applications"
        style={itemStyle("/applications")}
      >
        📄 Applications
      </Link>

      <Link
        to="/reports"
        style={itemStyle("/reports")}
      >
        📈 Reports
      </Link>

      <Link
        to="/audit-logs"
        style={itemStyle("/audit-logs")}
      >
        📝 Audit Logs
      </Link>

      <button
        onClick={logout}
        style={{
          width: "100%",
          marginTop: "20px",
          padding: "12px",
          background: "#dc2626",
          border: "none",
          borderRadius: "10px",
          color: "white",
          cursor: "pointer",
        }}
      >
        🚪 Logout
      </button>
    </div>
  );
}

export default AdminSidebar;