import { useEffect, useState } from "react";
import { FaUserCircle, FaEnvelope, FaPhone, FaMapMarkerAlt, FaUserTag } from "react-icons/fa";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import { getProfile, updateProfile, changePassword } from "../../api/profileApi";

import "./Profile.css";

const Profile = () => {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [passwordState, setPasswordState] = useState({
    currentPassword: "",
    newPassword: "",
  });
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    address: "",
  });

  const fetchProfile = async () => {
    setLoading(true);

    const response = await getProfile();

    if (response.success) {
      setProfile(response.user);
      setFormData({
        name: response.user.name || "",
        phone: response.user.phone || "",
        address: response.user.address || "",
      });
    } else {
      toast.error(response.message);
    }

    setLoading(false);
  };

  useEffect(() => {
    fetchProfile();
  }, []);

  const handleProfileSubmit = async (event) => {
    event.preventDefault();
    setSaving(true);

    const response = await updateProfile(formData);

    if (response.success) {
      toast.success(response.message);
      setProfile(response.user);
      await fetchProfile();
    } else {
      toast.error(response.message);
    }

    setSaving(false);
  };

  const handlePasswordSubmit = async (event) => {
    event.preventDefault();

    if (!passwordState.currentPassword || !passwordState.newPassword) {
      toast.error("Please fill both password fields");
      return;
    }

    const response = await changePassword(passwordState);

    if (response.success) {
      toast.success(response.message);
      setPasswordState({ currentPassword: "", newPassword: "" });
    } else {
      toast.error(response.message);
    }
  };

  if (loading) {
    return <div className="profile-loading">Loading Profile...</div>;
  }

  return (
    <>
      <ToastContainer position="top-right" autoClose={2000} />

      <div className="profile-page">
        <h1>👤 My Profile</h1>

        <div className="profile-card">
          <div className="profile-avatar">
            <FaUserCircle />
          </div>

          <div className="profile-info">
            <div className="profile-item">
              <FaUserCircle className="profile-icon" />
              <div>
                <h3>Name</h3>
                <p>{profile.name}</p>
              </div>
            </div>

            <div className="profile-item">
              <FaEnvelope className="profile-icon" />
              <div>
                <h3>Email</h3>
                <p>{profile.email}</p>
              </div>
            </div>

            <div className="profile-item">
              <FaPhone className="profile-icon" />
              <div>
                <h3>Phone</h3>
                <p>{profile.phone}</p>
              </div>
            </div>

            <div className="profile-item">
              <FaMapMarkerAlt className="profile-icon" />
              <div>
                <h3>Address</h3>
                <p>{profile.address}</p>
              </div>
            </div>

            <div className="profile-item">
              <FaUserTag className="profile-icon" />
              <div>
                <h3>Role</h3>
                <p>{profile.role.charAt(0).toUpperCase() + profile.role.slice(1)}</p>
              </div>
            </div>
          </div>
        </div>

        <div className="profile-card profile-card--secondary">
          <h2>Update Profile</h2>
          <form className="profile-form" onSubmit={handleProfileSubmit}>
            <label>
              Name
              <input value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} required />
            </label>

            <label>
              Phone
              <input value={formData.phone} onChange={(e) => setFormData({ ...formData, phone: e.target.value })} required />
            </label>

            <label>
              Address
              <textarea rows="4" value={formData.address} onChange={(e) => setFormData({ ...formData, address: e.target.value })} required />
            </label>

            <button type="submit" className="profile-submit-btn" disabled={saving}>
              {saving ? "Saving..." : "Save Profile"}
            </button>
          </form>
        </div>

        <div className="profile-card profile-card--secondary">
          <h2>Change Password</h2>
          <form className="profile-form" onSubmit={handlePasswordSubmit}>
            <label>
              Current Password
              <input type="password" value={passwordState.currentPassword} onChange={(e) => setPasswordState({ ...passwordState, currentPassword: e.target.value })} required />
            </label>

            <label>
              New Password
              <input type="password" value={passwordState.newPassword} onChange={(e) => setPasswordState({ ...passwordState, newPassword: e.target.value })} required />
            </label>

            <button type="submit" className="profile-submit-btn">Change Password</button>
          </form>
        </div>
      </div>
    </>
  );
};

export default Profile;