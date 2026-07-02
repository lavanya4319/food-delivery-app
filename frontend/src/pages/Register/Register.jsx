import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import { registerUser } from "../../api/authApi";

import "./Register.css";

const Register = () => {
  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
    password: "",
    role: "customer",
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

    const response = await registerUser(formData);

    setLoading(false);

    if (response.success) {
      toast.success(response.message);

      setTimeout(() => {
        navigate("/login");
      }, 1800);
    } else {
      toast.error(response.message);
    }
  };

  return (
    <>
      <ToastContainer position="top-right" autoClose={2000} />

      <div className="register-page">
        <div className="register-card">
          <h1>🍔 FoodExpress</h1>

          <h2>Create Account</h2>

          <form onSubmit={handleSubmit}>
            <input
              type="text"
              name="name"
              placeholder="Full Name"
              value={formData.name}
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

            <textarea
              name="address"
              placeholder="Address"
              rows="3"
              value={formData.address}
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
              <option value="customer">Customer</option>
              <option value="restaurant">Restaurant Owner</option>
            </select>

            <button type="submit">
              {loading ? "Creating Account..." : "Register"}
            </button>
          </form>

          <p>
            Already have an account?
            <Link to="/login"> Login</Link>
          </p>
        </div>
      </div>
    </>
  );
};

export default Register;