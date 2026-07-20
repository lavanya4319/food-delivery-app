import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import { loginUser } from "../../api/authApi";
import { useAuth } from "../../context/AuthContext";

import "./Login.css";

const Login = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const response = await loginUser(formData);

    setLoading(false);

    if (response.success) {
      login(response.user, response.token);
      toast.success(response.message);

      const dashboardMap = {
        customer: "/",
        manager: "/manager-dashboard",
        admin: "/admin-dashboard",
      };

      setTimeout(() => {
        navigate(dashboardMap[response.user.role] || "/");
      }, 1500);
    } else {
      toast.error(response.message);
    }
  };

  return (
    <>
      <ToastContainer position="top-right" autoClose={2000} />

      <div className="login-page">
        <div className="login-card">
          <h1>🍔 FoodExpress</h1>
          <h2>Welcome Back</h2>

          <form onSubmit={handleSubmit}>
            <input
              type="email"
              name="email"
              placeholder="Email Address"
              value={formData.email}
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

            <button type="submit">
              {loading ? "Signing In..." : "Login"}
            </button>
          </form>

          <p>
            Don't have an account?
            <Link to="/register"> Register</Link>
          </p>
        </div>
      </div>
    </>
  );
};

export default Login;