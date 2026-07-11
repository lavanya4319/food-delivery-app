import {
  Link,
  NavLink,
  useNavigate,
} from "react-router-dom";

import {
  FaBars,
  FaTimes,
  FaShoppingCart,
  FaUserCircle,
  FaSignOutAlt,
  FaClipboardList,
  FaStore,
  FaUserShield,
} from "react-icons/fa";

import { useState } from "react";

import { useAuth } from "../../context/AuthContext";

import "./Navbar.css";

const Navbar = () => {
  const [menuOpen, setMenuOpen] =
    useState(false);

  const { user, logout } = useAuth();

  const navigate = useNavigate();

  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
  };

  const closeMenu = () => {
    setMenuOpen(false);
  };

  const handleLogout = () => {
    logout();
    closeMenu();
    navigate("/");
  };

  return (
    <header className="navbar">
      <div className="navbar-container">

        <Link
          to="/"
          className="logo"
          onClick={closeMenu}
        >
          🍔 FoodExpress
        </Link>

        <nav
          className={
            menuOpen
              ? "nav-links active"
              : "nav-links"
          }
        >
          <NavLink
            to="/"
            onClick={closeMenu}
          >
            Home
          </NavLink>

          {user?.role !== "admin" && (
            <>
              <NavLink
                to="/orders"
                onClick={closeMenu}
              >
                <FaClipboardList />
                Orders
              </NavLink>

              <NavLink
                to="/cart"
                onClick={closeMenu}
              >
                <FaShoppingCart />
                Cart
              </NavLink>
            </>
          )}

          {user?.role === "restaurant" && (
            <NavLink
              to="/restaurant-dashboard"
              onClick={closeMenu}
            >
              <FaStore />
              Dashboard
            </NavLink>
          )}

          {user?.role === "admin" && (
            <NavLink
              to="/admin-dashboard"
              onClick={closeMenu}
            >
              <FaUserShield />
              Admin
            </NavLink>
          )}

          {user ? (
            <>
              <NavLink
                to="/profile"
                onClick={closeMenu}
              >
                <FaUserCircle />
                Profile
              </NavLink>

              <span className="user-name">
                Hi, {user.name}
              </span>

              <button
                className="logout-btn"
                onClick={handleLogout}
                type="button"
              >
                <FaSignOutAlt />
                Logout
              </button>
            </>
          ) : (
            <>
              <NavLink
                to="/login"
                onClick={closeMenu}
              >
                <FaUserCircle />
                Login
              </NavLink>

              <NavLink
                to="/register"
                onClick={closeMenu}
              >
                Register
              </NavLink>
            </>
          )}
        </nav>

        <button
          className="menu-btn"
          onClick={toggleMenu}
          type="button"
        >
          {menuOpen ? (
            <FaTimes />
          ) : (
            <FaBars />
          )}
        </button>

      </div>
    </header>
  );
};

export default Navbar;