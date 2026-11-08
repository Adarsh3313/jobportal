import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { loginUser } from "../services/authService";
import "../styles/auth.css";

function Login() {
  const navigate = useNavigate();

  const [loginData, setLoginData] = useState({
    email: "",
    password: "",
  });

  const handleChange = (e) => {
    setLoginData({
      ...loginData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await loginUser(loginData);

      localStorage.setItem(
        "token",
        response.token
      );

      localStorage.setItem(
        "email",
        response.email || loginData.email
      );

      localStorage.setItem(
        "role",
        response.role
      );

      localStorage.setItem("userId", response.userId);
      localStorage.setItem("fullName", response.fullName || "");

      window.dispatchEvent(
        new Event("storage")
      );

      alert("Login Successful");

      if (response.role === "ADMIN") {
        navigate("/admin-dashboard");
      } else if (
        response.role === "HIRING_DEPARTMENT"
      ) {
        navigate("/hirer-dashboard");
      } else {
        navigate("/dashboard");
      }
    } catch (error) {
      console.error(error);
      alert(error.message || "Login Failed");
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-left">
        <h2>Welcome Back!</h2>

        <p>
          Login to your account and continue
          your journey.
        </p>

        <img
          src="https://cdn-icons-png.flaticon.com/512/3135/3135715.png"
          alt="Login"
          className="auth-image"
        />
      </div>

      <div className="auth-right">
        <h1>Login</h1>

        <p>
          Enter your credentials to access
          your account.
        </p>

        <form onSubmit={handleSubmit}>
          <input
            type="email"
            name="email"
            placeholder="Email Address"
            value={loginData.email}
            onChange={handleChange}
            required
          />

          <input
            type="password"
            name="password"
            placeholder="Password"
            value={loginData.password}
            onChange={handleChange}
            required
          />

          <button type="submit">
            Login
          </button>
        </form>

        <p className="auth-link">
          Don't have an account?{" "}
          <Link to="/register">
            Register Here
          </Link>
        </p>
      </div>
    </div>
  );
}

export default Login;