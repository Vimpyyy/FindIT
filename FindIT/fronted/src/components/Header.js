import React from 'react';
import { useNavigate } from 'react-router-dom';
import './Header.css';

const Header = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    // Clear user session (e.g., localStorage)
    localStorage.removeItem('userId');
    localStorage.removeItem('userName');
    localStorage.removeItem('token');
    navigate('/');
  };

  const handleLogin = () => {
    // Redirect to login page
    navigate('/login');
  };

  const handleRegister = () => {
    // Redirect to register page
    navigate('/register');
  };

  const handleReportLostItem = () => {
    // Redirect to the Report Lost Item page
    navigate('/lost-item');
  };

  const handleReportFoundItem = () => {
    // Redirect to the Report Found Item page
    navigate('/found-item');
  };

  return (
    <header className="header">
      <div className="header-container">
        <h1 className="header-title">FindIt - Lost and Found System</h1>
        <nav className="header-nav">
          <a href="/" className="header-link">Home</a>
          <a href="/profile" className="header-link">Profile</a>
          <a href="/about" className="header-link">About</a>
          <a href="/contact" className="header-link">Contact</a>
          <div className="header-buttons">
            <button className="header-button report-button" onClick={handleReportLostItem}>
              Report Lost Item
            </button>
            <button className="header-button report-button" onClick={handleReportFoundItem}>
              Report Found Item
            </button>
            {!localStorage.getItem('token') ? (
              <>
                <button className="header-button login-button" onClick={handleLogin}>
                  Login
                </button>
                <button className="header-button register-button" onClick={handleRegister}>
                  Register
                </button>
              </>
            ) : (
              <button className="header-button logout-button" onClick={handleLogout}>
                Logout
              </button>
            )}
          </div>
        </nav>
      </div>
    </header>
  );
};

export default Header;