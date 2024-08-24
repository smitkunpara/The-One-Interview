import React, { useState, useCallback, useEffect } from 'react';
import './Profile.css';
import { useTheme } from "../../ThemeContext";
import NavBar from '../Navbar/Navbar';
import axios from 'axios';

const Profile = () => {
  const { isDarkMode } = useTheme();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editedUser, setEditedUser] = useState(null);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await axios.get(`${import.meta.env.VITE_API_URL}/auth/status`, { withCredentials: true });
        if (response.data.isAuthenticated) {
          setUser(response.data.user);
          setEditedUser(response.data.user);
        } else {
          setError('User not authenticated');
        }
      } catch (err) {
        console.error('Error fetching user data:', err);
        setError('Error fetching user data');
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEditedUser(prevUser => ({ ...prevUser, [name]: value }));
  };

  const handleSaveChanges = async () => {
    try {
      const response = await axios.put(`${import.meta.env.VITE_API_URL}/auth/update-profile`, editedUser, { withCredentials: true });
      setUser(response.data.user);
      setIsEditing(false);
    } catch (error) {
      console.error('Error updating profile:', error);
      setError('Error updating profile');
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
              <img src={user.profile_pic || "/img/default-profile.png"} alt="Profile" className="profile-picture" />
              <button className="profile-button">Change picture</button>
              <button className="profile-button">Delete picture</button>
            </div>
            <div className="profile-info">
              <div className="login-type-badge">
                <span className={`user-login-type ${user.type === "google" ? "google" : "oneid"}`}>
                  {user.type === "google" ? "Logged in with Google" : "Logged in with One ID"}
                </span>
              </div>
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
                value={user.username} 
                disabled
                className="profile-input"
              />
              <label>Email</label>
              <input 
                type="email" 
                value={user.email} 
                disabled
                className="profile-input"
              />
              <label>Gender</label>
              <input 
                type="text" 
                name="gender"
                value={isEditing ? editedUser.gender : user.gender} 
                onChange={handleInputChange}
                disabled={!isEditing}
                className="profile-input"
              />
              <label>Date of Birth</label>
              <input 
                type="date" 
                name="date_of_birth"
                value={isEditing ? editedUser.date_of_birth : (user.date_of_birth ? new Date(user.date_of_birth).toISOString().split('T')[0] : '')} 
                onChange={handleInputChange}
                disabled={!isEditing}
                className="profile-input"
              />
            </div>
            <div className="profile-footer">
              {isEditing ? (
                <>
                  <button className="profile-save-button" onClick={handleSaveChanges}>Save changes</button>
                  <button className="profile-cancel-button" onClick={() => setIsEditing(false)}>Cancel</button>
                </>
              ) : (
                <button className="profile-edit-button" onClick={() => setIsEditing(true)}>Edit Profile</button>
              )}
            </div>
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
