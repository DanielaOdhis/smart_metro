import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "./Profile.css";

const Profile = () => {
  const [user, setUser] = useState(null); // Store user profile data
  const [isEditing, setIsEditing] = useState(false); // Toggle edit mode
  const [newPassword, setNewPassword] = useState(""); // Store new password
  const [newEmail, setNewEmail] = useState(""); // Store new email
  const [message, setMessage] = useState(""); // For success or error messages
  const navigate = useNavigate();

  // Fetch user data from the backend
  useEffect(() => {
    axios.get("http://localhost:5000/profile", {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`, // Assuming JWT token is stored in localStorage
      },
    })
    .then((response) => {
      setUser(response.data); // Set user data from response
    })
    .catch((err) => {
      console.error("Error fetching profile:", err);
      setMessage("Failed to load profile data.");
    });
  }, []);

  // Handle the profile update (email or password)
  const handleProfileUpdate = async (e) => {
    e.preventDefault();

    try {
      const updatedData = {
        email: newEmail || user.email, // Update email if changed
        password: newPassword, // Update password if provided
      };

      const response = await axios.put("http://localhost:5000/profile", updatedData, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });

      setMessage(response.data.message); // Success message
      setIsEditing(false); // Close the edit form
    } catch (error) {
      console.error("Error updating profile:", error);
      setMessage("Failed to update profile.");
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token"); // Remove token from localStorage
    navigate("/login"); // Redirect to login page
  };

  if (!user) {
    return <div>Loading...</div>; // Display loading message while data is being fetched
  }

  return (
    <div className="profile-container">
      <div className="profile-header">
        <h2>User Profile</h2>
        <button onClick={handleLogout}>Logout</button>
      </div>

      <div className="profile-content">
        {message && <p className="message">{message}</p>}

        <div className="profile-info">
          <h3>Profile Information</h3>
          <div className="profile-detail">
            <strong>Name:</strong> {user.name}
          </div>
          <div className="profile-detail">
            <strong>Email:</strong> {user.email}
          </div>
          {user.profilePicture && (
            <div className="profile-picture">
              <img src={user.profilePicture} alt="Profile" />
            </div>
          )}
        </div>

        <button onClick={() => setIsEditing(!isEditing)} className="edit-button">
          {isEditing ? "Cancel" : "Edit Profile"}
        </button>

        {isEditing && (
          <form onSubmit={handleProfileUpdate} className="edit-form">
            <div className="form-group">
              <label>Email:</label>
              <input
                type="email"
                value={newEmail || user.email}
                onChange={(e) => setNewEmail(e.target.value)}
              />
            </div>
            <div className="form-group">
              <label>New Password:</label>
              <input
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
              />
            </div>
            <button type="submit">Save Changes</button>
          </form>
        )}
      </div>
    </div>
  );
};

export default Profile;
