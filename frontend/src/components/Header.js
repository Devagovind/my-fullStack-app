// FILE: src/components/Header.js
import React from 'react';
import { useNavigate } from 'react-router-dom';

function Header() {
  const navigate = useNavigate();
  const username = localStorage.getItem('username'); // <-- GET USERNAME

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('username'); // <-- CLEAR USERNAME ON LOGOUT
    navigate('/login');
  };

  return (
    <header className="app-header">
      <h1 onClick={() => navigate('/')}>
        FinanceTracker
      </h1>
      <div className="header-actions">
        <div className="avatar" onClick={() => navigate('/profile')}>
          {/* Display the first letter of the username */}
          <span>{username ? username.charAt(0).toUpperCase() : 'P'}</span>
        </div>
        <button onClick={handleLogout} className="btn-logout">Logout</button>
      </div>
    </header>
  );
}

export default Header;