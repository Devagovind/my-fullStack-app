// FILE: src/components/Header.js
import React from 'react';
import { Link, useNavigate } from 'react-router-dom';

function Header() {
  const navigate = useNavigate();
  const username = localStorage.getItem('username');

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('username');
    navigate('/login');
  };

  return (
    <header className="app-header">
      <div className="header-nav">
        <h1 onClick={() => navigate('/')}>FinanceTracker</h1>
        <nav>
          <Link to="/">Dashboard</Link>
          <Link to="/investments">Investments</Link> {/* <-- NEW LINK */}
        </nav>
      </div>
      <div className="header-actions">
        <div className="avatar" onClick={() => navigate('/profile')}>
          <span>{username ? username.charAt(0).toUpperCase() : 'P'}</span>
        </div>
        <button onClick={handleLogout} className="btn-logout">Logout</button>
      </div>
    </header>
  );
}

export default Header;