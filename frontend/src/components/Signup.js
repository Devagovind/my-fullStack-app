import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../services/api';

function Signup() {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      await api.post('/auth/signup', { username, email, password });
      alert('Signup successful! Please log in.');
      navigate('/login');
    } catch (err) {
      setError('Failed to sign up. Username or email may already be taken.');
      console.error('Signup failed:', err);
    }
  };

  return (
    <div className="auth-page-wrapper">
      <div className="auth-container">
        <h2>Create Your Account</h2>
        <p className="auth-subtitle">Get started with FinanceTracker</p>
        <form onSubmit={handleSubmit} className="auth-form">
           <input
            type="text"
            placeholder="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          {error && <p className="error-message">{error}</p>}
          <button type="submit" className="btn-submit">Sign Up</button>
        </form>
        <p className="auth-switch">
          Already have an account? <Link to="/login">Log In</Link>
        </p>
      </div>
    </div>
  );
}

export default Signup;
