import { useState } from "react";
import { Link } from "react-router-dom";
import { registerUser } from "../services/authService";
import registerHero from "../assets/images/register-hero.png";
import "../styles/auth.css";

function Register() {
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    password: "",
    role: "USER",
    companyName: "",
    companyWebsite: "",
    companyDetails: "",
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await registerUser(formData);

      alert(response);

      setFormData({
        fullName: "",
        email: "",
        phone: "",
        password: "",
        role: "USER",
        companyName: "",
        companyWebsite: "",
        companyDetails: "",
      });
    } catch (error) {
      console.error(error);
      alert(error.message || "Registration Failed");
    }
  };

  return (
    <div className="auth-container">
      {/* LEFT PANEL */}
      <div className="auth-left">
        <div className="left-content">
          <h1 className="welcome-title">
            Build Your Future Career
          </h1>

          <p className="welcome-text">
            Discover opportunities, connect with
            recruiters and manage your career journey
            through our intelligent recruitment platform.
          </p>

          <img
  src={registerHero}
  alt="Career Registration"
  className="register"></img>
        </div>
      </div>

      {/* RIGHT PANEL */}
      <div className="auth-right">
        <div className="register-card">
          <h1>Register</h1>

          <p className="subtitle">
            Create your account and start your
            professional journey.
          </p>

          <form onSubmit={handleSubmit}>
            <input
              type="text"
              name="fullName"
              placeholder="Full Name"
              value={formData.fullName}
              onChange={handleChange}
              required
            />

            <input
              type="email"
              name="email"
              placeholder="Email Address"
              value={formData.email}
              onChange={handleChange}
              required
            />

            <input
              type="text"
              name="phone"
              placeholder="Phone Number"
              value={formData.phone}
              onChange={handleChange}
              required
            />

            <input
              type="password"
              name="password"
              placeholder="Password"
              value={formData.password}
              onChange={handleChange}
              required
            />

            <select
              name="role"
              value={formData.role}
              onChange={handleChange}
            >
              <option value="USER">
                Job Seeker
              </option>

              <option value="HIRING_DEPARTMENT">
                Company / Hiring Department
              </option>
            </select>

            {formData.role === "HIRING_DEPARTMENT" && (
              <>
                <input
                  type="text"
                  name="companyName"
                  placeholder="Company Name"
                  value={formData.companyName}
                  onChange={handleChange}
                  required
                />
                <input
                  type="text"
                  name="companyWebsite"
                  placeholder="Company Website (optional)"
                  value={formData.companyWebsite}
                  onChange={handleChange}
                />
                <input
                  type="text"
                  name="companyDetails"
                  placeholder="About the company (optional)"
                  value={formData.companyDetails}
                  onChange={handleChange}
                />
              </>
            )}

            <button
              type="submit"
              className="register-btn"
            >
              Create Account
            </button>
          </form>

          <p className="auth-link">
            Already have an account?
            <Link to="/login"> Login</Link>
          </p>
        </div>
      </div>
    </div>
  );
}

export default Register;