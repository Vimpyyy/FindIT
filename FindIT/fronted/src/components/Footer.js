import React from 'react';
import './Footer.css';

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-container">
        <div className="footer-info">
          <h3>FindIt - Lost & Found System</h3>
          <p>Your trusted platform to reunite lost items with their rightful owners.</p>
        </div>

        <nav className="footer-nav">
          <a href="/about" className="footer-link">About Us</a>
          <a href="/contact" className="footer-link">Contact</a>
          <a href="/faq" className="footer-link">FAQ</a>
          <a href="/support" className="footer-link">Support</a>
        </nav>

        <div className="footer-bottom">
          <p>&copy; {new Date().getFullYear()} FindIt. All rights reserved.</p>
          <nav className="footer-policy">
            <a href="/terms" className="footer-link">Terms of Service</a>
            <a href="/privacy" className="footer-link">Privacy Policy</a>
          </nav>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
