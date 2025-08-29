// FILE: src/pages/ProfilePage.js
import React, { useState, useEffect } from 'react';
import api from '../services/api';

function ProfilePage() {
  const [userDetails, setUserDetails] = useState({ username: '', email: '' });
  const [passwordDetails, setPasswordDetails] = useState({ oldPassword: '', newPassword: '', confirmPassword: '' });
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const response = await api.get('/profile/me');
        setUserDetails({
          username: response.data.username,
          email: response.data.email,
        });
      } catch (err) {
        setError('Failed to fetch profile data.');
      }
    };
    fetchUserProfile();
  }, []);

  const handleUserChange = (e) => {
    setUserDetails({ ...userDetails, [e.target.name]: e.target.value });
  };

  const handlePasswordChange = (e) => {
    setPasswordDetails({ ...passwordDetails, [e.target.name]: e.target.value });
  };

  const showSuccessMessage = (message) => {
    setSuccessMessage(message);
    setTimeout(() => setSuccessMessage(''), 3000); // Hide after 3 seconds
  };

  const handleUserDetailsSubmit = async (e) => {
      e.preventDefault();
      setError('');
      setSuccessMessage(''); // Clear previous messages

      try {
        const response = await api.put('/profile/me', userDetails);

        // Log the entire response to see what the backend is sending
        console.log('API Response:', response.data);

        const updatedUser = response.data.user;
        const newToken = response.data.token;

        // CRITICAL CHECK: Ensure we received a valid new token
        if (newToken && typeof newToken === 'string') {
          // 1. Reliably save the new, correct information
          localStorage.setItem('token', newToken);
          localStorage.setItem('username', updatedUser.username);

          // 2. Show a success message
          showSuccessMessage('Profile details updated successfully!');

          // 3. Wait a moment for the message to be visible, then reload
          setTimeout(() => {
            window.location.reload();
          }, 1500); // 1.5-second delay before reload

        } else {
          // This will happen if the backend response is malformed
          throw new Error("Invalid token received from server.");
        }

      } catch (err) {
        console.error("Update failed:", err);
        setError('Failed to update details. Username might already be taken.');
      }
  };

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    setError('');
    if (passwordDetails.newPassword !== passwordDetails.confirmPassword) {
      setError("New passwords don't match!");
      return;
    }
    try {
      await api.post('/profile/password', {
        oldPassword: passwordDetails.oldPassword,
        newPassword: passwordDetails.newPassword,
      });
      showSuccessMessage('Password changed successfully!');
      setPasswordDetails({ oldPassword: '', newPassword: '', confirmPassword: '' }); // Clear fields
    } catch (err) {
      setError('Failed to change password. Check your current password.');
    }
  };

  // Profile picture upload is still a placeholder for now
  const handleProfilePictureUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      console.log('Uploading file:', file.name);
      alert('Profile picture upload functionality will be added soon!');
    }
  };

  return (
    <div className="profile-page-container">
      <div className="profile-card">
        <h2>My Profile</h2>
        {error && <div className="error-message">{error}</div>}
        {successMessage && <div className="success-message">{successMessage}</div>}

        {/* Profile Picture Section (remains the same) */}
        <div className="profile-picture-section">
          <div className="profile-avatar-large">
             <img src={`https://placehold.co/100x100/4169e1/e2e8f0?text=${userDetails.username.charAt(0).toUpperCase()}`} alt="Profile" />
          </div>
          <input type="file" id="fileUpload" style={{ display: 'none' }} onChange={handleProfilePictureUpload} />
          <button className="btn-secondary" onClick={() => document.getElementById('fileUpload').click()}>
            Change Picture
          </button>
        </div>

        {/* Update Details Form */}
        <form onSubmit={handleUserDetailsSubmit} className="profile-form">
          <h3>Update Your Details</h3>
          <input type="text" name="username" value={userDetails.username} onChange={handleUserChange} required />
          <input type="email" name="email" value={userDetails.email} onChange={handleUserChange} required />
          <button type="submit" className="btn-submit">Save Changes</button>
        </form>

        {/* Change Password Form */}
        <form onSubmit={handlePasswordSubmit} className="profile-form">
          <h3>Change Password</h3>
          <input type="password" name="oldPassword" placeholder="Current Password" value={passwordDetails.oldPassword} onChange={handlePasswordChange} required />
          <input type="password" name="newPassword" placeholder="New Password" value={passwordDetails.newPassword} onChange={handlePasswordChange} required />
          <input type="password" name="confirmPassword" placeholder="Confirm New Password" value={passwordDetails.confirmPassword} onChange={handlePasswordChange} required />
          <button type="submit" className="btn-submit">Update Password</button>
        </form>
      </div>
    </div>
  );
}

export default ProfilePage;