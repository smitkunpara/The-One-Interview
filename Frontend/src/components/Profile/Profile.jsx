import React, { useState, useCallback, useEffect } from "react";
import "./Profile.css";
import { useTheme } from "../../ThemeContext";
import NavBar from "../Navbar/Navbar";
import axios from "axios";
import { debounce } from "lodash";

const Profile = () => {
  const { isDarkMode } = useTheme();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editedUser, setEditedUser] = useState(null);
  const [selectedFile, setSelectedFile] = useState(null);
  const [usernameAvailable, setUsernameAvailable] = useState(true);
  const [checkingUsername, setCheckingUsername] = useState(false);
  const [validUsername, setValidUsername] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  const fetchUserData = async () => {
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_API_URL}/auth/status`,
        { withCredentials: true }
      );
      if (response.data.isAuthenticated) {
        setUser(response.data.user);
        setEditedUser(response.data.user);
      } else {
        setError("User not authenticated");
      }
    } catch (err) {
      console.error("Error fetching user data:", err);
      setError("Error fetching user data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUserData();
  }, []);

  const checkUsernameAvailability = useCallback(
    debounce(async (username) => {
      if (!username || username.length < 5) {
        setUsernameAvailable(false);
        setCheckingUsername(false);
        setValidUsername(false);
        return;
      }

      if (username === user.username) {
        setUsernameAvailable(true);
        setCheckingUsername(false);
        setValidUsername(true);
        return;
      }
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_API_URL}/auth/check-username/${username}`
        );
        setUsernameAvailable(response.data.available);
      } catch (error) {
        console.error("Error checking username:", error);
        setUsernameAvailable(false);
      }
      setCheckingUsername(false);
    }, 1000),
    [user]
  );

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEditedUser((prevUser) => ({ ...prevUser, [name]: value }));
    if (name === "username") {
      setCheckingUsername(true);
      checkUsernameAvailability(value);
    }
  };

  const handleFileChange = (e) => {
    setSelectedFile(e.target.files[0]);
  };

  const handleSaveChanges = async () => {
    setIsSaving(true);
    try {
      const formData = new FormData();
      Object.keys(editedUser).forEach((key) => {
        if (editedUser[key] !== user[key]) {
          formData.append(key, editedUser[key]);
        }
      });
      if (selectedFile) {
        formData.append("profile_pic", selectedFile);
      }

      const response = await axios.patch(
        `${import.meta.env.VITE_API_URL}/auth/update-profile`,
        formData,
        {
          withCredentials: true,
          headers: { "Content-Type": "multipart/form-data" },
        }
      );
      setUser(response.data.user);
      setIsEditing(false);
      setSelectedFile(null);
      fetchUserData();
    } catch (error) {
      console.error("Error updating profile:", error);
      setError("Error updating profile");
    } finally {
      setIsSaving(false);
    }
  };

  const handleDeletePicture = async () => {
    try {
      const response = await axios.patch(
        `${import.meta.env.VITE_API_URL}/auth/delete-profile-picture`,
        {},
        { withCredentials: true }
      );
      setUser(response.data.user);
      setEditedUser(response.data.user);
      fetchUserData();
    } catch (error) {
      console.error("Error deleting profile picture:", error);
      setError("Error deleting profile picture");
    }
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>{error}</div>;
  if (!user) return <div>No user data available</div>;

  return (
    <div className={`profile-page ${isDarkMode ? "dark-mode" : "light-mode"}`}>
      <NavBar />
      <div className="profile-main-content">
        <aside className="profile-sidebar">
          <nav className="profile-navigation">
            <div className="profile-sidebar-card">
              <i className="fa fa-user" />
              <div className="profile-card-details">
                <h4>Profile</h4>
              </div>
            </div>
            <div className="profile-sidebar-card">
              <i className="fa fa-cog" />
              <div className="profile-card-details">
                <h4>Account</h4>
              </div>
            </div>
            <div className="profile-sidebar-card">
              <i className="fa fa-bookmark" />
              <div className="profile-card-details">
                <h4>Bookmarks</h4>
              </div>
            </div>
            <div className="profile-sidebar-card">
              <i className="fa fa-paint-brush" />
              <div className="profile-card-details">
                <h4>Appearance</h4>
              </div>
            </div>
            <div className="profile-sidebar-card">
              <i className="fa fa-bell" />
              <div className="profile-card-details">
                <h4>Notifications</h4>
              </div>
            </div>
          </nav>
        </aside>

        <section className="profile-content">
          <div className="profile-card">
            <h2 className="profile-card-title">Profile Settings</h2>
            <div className="profile-picture-section">
              <div className="profile-picture-container">
                <img
                  src={user.profile_pic || "/img/default-profile.png"}
                  alt="Profile"
                  className="profile-picture"
                />
                {isEditing && (
                  <div className="profile-picture-buttons">
                    <input
                      type="file"
                      onChange={handleFileChange}
                      style={{ display: "none" }}
                      id="fileInput"
                    />
                    <label htmlFor="fileInput" className="profile-button">
                      Change picture
                    </label>
                    <button
                      className="profile-button"
                      onClick={handleDeletePicture}
                    >
                      Delete picture
                    </button>
                  </div>
                )}
              </div>
              <div className="login-type-badge">
                <span
                  className={`user-login-type ${
                    user.type === "google" ? "google" : "oneid"
                  }`}
                >
                  {user.type === "google"
                    ? "Google ID Account"
                    : "One ID Account"}
                </span>
              </div>
            </div>
            <div className="profile-info">
              <label>First Name</label>
              <input
                type="text"
                name="first_name"
                value={isEditing ? editedUser.first_name : user.first_name}
                onChange={handleInputChange}
                disabled={!isEditing}
                className="profile-input"
              />
              <label>Last Name</label>
              <input
                type="text"
                name="last_name"
                value={isEditing ? editedUser.last_name : user.last_name}
                onChange={handleInputChange}
                disabled={!isEditing}
                className="profile-input"
              />
              <label>Username</label>
              <input
                type="text"
                name="username"
                value={isEditing ? editedUser.username : user.username}
                onChange={handleInputChange}
                disabled={!isEditing}
                className="profile-input"
              />
              {isEditing && (
                <div className="username-availability">
                  {checkingUsername ? (
                    <span>Checking username...</span>
                  ) : usernameAvailable ? (
                    <span className="available">Username is available</span>
                  ) : validUsername ? (
                    <span className="unavailable">
                      Username is not available
                    </span>
                  ) : (
                    <span className="unavailable">
                      Username should be at least 5 characters
                    </span>
                  )}
                </div>
              )}
              <label>Email</label>
              <input
                type="email"
                value={user.email}
                disabled
                className="profile-input"
              />
              <label>Gender</label>
              <select
                name="gender"
                value={isEditing ? editedUser.gender : user.gender}
                onChange={handleInputChange}
                disabled={!isEditing}
                className="profile-input profile-select"
              >
                <option value="">Select Gender</option>
                <option value="male">Male</option>
                <option value="female">Female</option>
                <option value="other">Other</option>
              </select>
              <label>Date of Birth</label>
              <input
                type="date"
                name="date_of_birth"
                value={
                  isEditing
                    ? editedUser.date_of_birth
                    : user.date_of_birth
                    ? new Date(user.date_of_birth).toISOString().split("T")[0]
                    : ""
                }
                onChange={handleInputChange}
                disabled={!isEditing}
                className="profile-input"
              />
            </div>
            <div className="profile-footer">
              {isEditing ? (
                <>
                  <button
                    className="profile-save-button"
                    onClick={handleSaveChanges}
                    disabled={!usernameAvailable || isSaving}
                  >
                    Save changes
                  </button>
                  <button
                    className="profile-cancel-button"
                    onClick={() => setIsEditing(false)}
                    disabled={isSaving}
                  >
                    Cancel
                  </button>
                </>
              ) : (
                <button
                  className="profile-edit-button"
                  onClick={() => setIsEditing(true)}
                >
                  Edit Profile
                </button>
              )}
            </div>
            {isSaving && <div className="profile-saving-bar"></div>}
          </div>
        </section>

        <aside className="profile-right-sidebar">
          <div className="profile-right-sidebar-card">
            <img src="activity.png" alt="Recent Activity" />
            <div className="profile-card-details">
              <h4>Recent Activity</h4>
              <p>View your recent actions</p>
            </div>
          </div>
          <div className="profile-right-sidebar-card">
            <img src="stats.png" alt="Profile Stats" />
            <div className="profile-card-details">
              <h4>Profile Stats</h4>
              <p>See your profile statistics</p>
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
};

export default Profile;
