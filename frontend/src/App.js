// FILE: src/App.js
import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, Outlet } from 'react-router-dom';
import './App.css';
import Login from './components/Login';
import Signup from './components/Signup';
import UserDashboard from './components/UserDashboard';
import Header from './components/Header'; // <-- Import Header
import ProfilePage from './pages/ProfilePage'; // <-- Import ProfilePage

// A layout component for authenticated pages
const AppLayout = () => (
  <div className="app-container">
    <Header />
    <main className="app-main">
      <Outlet /> {/* Child routes will render here */}
    </main>
  </div>
);

// A component to protect routes
const PrivateRoute = () => {
  const token = localStorage.getItem('token');
  return token ? <AppLayout /> : <Navigate to="/login" />;
};

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />

        {/* Protected Routes */}
        <Route element={<PrivateRoute />}>
          <Route path="/" element={<UserDashboard />} />
          <Route path="/profile" element={<ProfilePage />} />
        </Route>

        {/* Redirect any other path to the main page */}
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </Router>
  );
}

export default App;