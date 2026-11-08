import "./Navbar.css";
import { Link } from "react-router-dom";
import { useEffect, useState } from "react";

function Navbar() {
  const [token, setToken] = useState("");
  const [role, setRole] = useState("");

  useEffect(() => {
    const updateAuth = () => {
      setToken(localStorage.getItem("token"));
      setRole(localStorage.getItem("role"));
    };

    updateAuth();

    window.addEventListener("storage", updateAuth);

    return () => {
      window.removeEventListener(
        "storage",
        updateAuth
      );
    };
  }, []);

  const handleLogout = () => {
    localStorage.clear();
    window.location.href = "/";
  };

  const getRoleLabel = () => {
    switch (role) {
      case "ADMIN":
        return "⚙️ Admin";

      case "HIRING_DEPARTMENT":
        return "🏢 Recruiter";

      default:
        return "👤 User";
    }
  };

  const getDashboardLink = () => {
    switch (role) {
      case "ADMIN":
        return "/admin-dashboard";

      case "HIRING_DEPARTMENT":
        return "/hirer-dashboard";

      default:
        return "/dashboard";
    }
  };

  return (
    <nav className="navbar">
      <div className="logo">
        <Link
          to="/"
          style={{
            color: "white",
            textDecoration: "none",
          }}
        >
          JobPortal
        </Link>
      </div>

      <ul className="nav-links">
        <li>
          <Link to="/">Home</Link>
        </li>

        <li>
          <Link to="/jobs">Jobs</Link>
        </li>

        <li>
          <Link to="/about">About</Link>
        </li>

        <li>
          <Link to="/contact">Contact</Link>
        </li>
      </ul>

      <div className="nav-buttons">
        {!token ? (
          <>
            <Link to="/login">
              <button className="login-btn">
                Login
              </button>
            </Link>

            <Link to="/register">
              <button className="register-btn">
                Register
              </button>
            </Link>
          </>
        ) : (
          <>
            <span className="role-badge">
              {getRoleLabel()}
            </span>

            <Link to={getDashboardLink()}>
              <button className="dashboard-btn">
                Dashboard
              </button>
            </Link>

            <button
              className="logout-btn"
              onClick={handleLogout}
            >
              Logout
            </button>
          </>
        )}
      </div>
    </nav>
  );
}

export default Navbar;