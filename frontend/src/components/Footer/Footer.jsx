import "./Footer.css";
import {
  FaFacebookF,
  FaInstagram,
  FaTwitter,
  FaLinkedinIn,
  FaPhoneAlt,
  FaEnvelope,
  FaMapMarkerAlt,
} from "react-icons/fa";

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-container">

        <div className="footer-about">
          <h2>🍔 FoodExpress</h2>

          <p>
            Fresh food delivered from your favourite restaurants.
            Fast delivery, secure payments and delicious meals at
            your doorstep.
          </p>

          <div className="social-icons">
            <a href="#"><FaFacebookF /></a>
            <a href="#"><FaInstagram /></a>
            <a href="#"><FaTwitter /></a>
            <a href="#"><FaLinkedinIn /></a>
          </div>
        </div>

        <div className="footer-links">
          <h3>Quick Links</h3>

          <a href="/">Home</a>
          <a href="/login">Login</a>
          <a href="/register">Register</a>
          <a href="/orders">Orders</a>
        </div>

        <div className="footer-contact">
          <h3>Contact</h3>

          <p>
            <FaPhoneAlt /> +91 9876543210
          </p>

          <p>
            <FaEnvelope /> support@foodexpress.com
          </p>

          <p>
            <FaMapMarkerAlt /> Amalapuram, Andhra Pradesh
          </p>
        </div>

      </div>

      <div className="footer-bottom">
        © {new Date().getFullYear()} FoodExpress. All Rights Reserved.
      </div>
    </footer>
  );
};

export default Footer;