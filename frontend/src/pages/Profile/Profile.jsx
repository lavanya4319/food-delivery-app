import { useEffect, useState } from "react";
import { FaUserCircle, FaEnvelope, FaPhone, FaMapMarkerAlt, FaUserTag } from "react-icons/fa";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import { getProfile } from "../../api/profileApi";

import "./Profile.css";

const Profile = () => {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchProfile = async () => {
    setLoading(true);

    const response = await getProfile();

    if (response.success) {
      setProfile(response.user);
    } else {
      toast.error(response.message);
    }

    setLoading(false);
  };

  useEffect(() => {
    fetchProfile();
  }, []);

  if (loading) {
    return (
      <div className="profile-loading">
        Loading Profile...
      </div>
    );
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
                <p>
                  {profile.role.charAt(0).toUpperCase() +
                    profile.role.slice(1)}
                </p>
              </div>
            </div>

          </div>

        </div>

      </div>
    </>
  );
};

export default Profile;