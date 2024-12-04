import React, { useState } from 'react';
import '../App.css';
import Navbar from './Navbar'; // Adjust the import path based on your project structure
import Footer from './Footer'; // Adjust the import path based on your project structure

const Settings = () => {
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [message, setMessage] = useState('');

  const handlePasswordChange = async (e) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      setMessage('New password and confirm password do not match.');
      return;
    }

    try {
      const response = await fetch('/change-password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId: 'current-user-id', // Replace this with the actual user ID
          oldPassword: currentPassword,
          newPassword,
        }),
      });

      const result = await response.json();
      if (response.ok) {
        setMessage(result.message || 'Password updated successfully!');
      } else {
        setMessage(result.message || 'An error occurred.');
      }
    } catch (error) {
      setMessage('Failed to connect to the server.');
    }
  };

  return (
    <>
      <Navbar />
      <div className="settings-page">
        <h1 className="title-medium">Settings</h1>
        <form onSubmit={handlePasswordChange} className="settings-form">
          <div className="form-group">
            <label htmlFor="currentPassword">Current Password:</label>
            <div className="input-group">
              <input
                type="password"
                id="currentPassword"
                className="settings-input"
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                required
              />
            </div>
          </div>
          <div className="form-group">
            <label htmlFor="newPassword">New Password:</label>
            <div className="input-group">
              <input
                type="password"
                id="newPassword"
                className="settings-input"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                required
              />
            </div>
          </div>
          <div className="form-group">
            <label htmlFor="confirmPassword">Confirm Password:</label>
            <div className="input-group">
              <input
                type="password"
                id="confirmPassword"
                className="settings-input"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
              />
            </div>
          </div>
          {message && <p className="message">{message}</p>}
          <button type="submit" className="save-button">Update Password</button>
        </form>
      </div>
      <Footer />
    </>
  );
};

export default Settings;
