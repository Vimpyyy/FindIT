import React from 'react';
import { useNavigate } from 'react-router-dom';
import './LandingPage.css';
import Header from '../components/Header'; // Adjust the path based on your project structure
import Footer from '../components/Footer'; // Adjust the path based on your project structure

function LandingPage() {
  const navigate = useNavigate();

  return (
    <div className="landing-page">
      {/* Header Section */}
      <Header />

      {/* Main Landing Content */}
      <div className="landing-content">
        <h1>Welcome to FindIt</h1>
        <p>Helping you find what you’ve lost and return what you’ve found.</p>
        <div className="landing-buttons">
          <button 
            onClick={() => navigate('/home')} 
            className="btn-primary"
          >
            Enter
          </button>
        </div>
      </div>

      {/* Footer Section */}
      <Footer />
    </div>
  );
}

export default LandingPage;