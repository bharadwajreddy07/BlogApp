import React, { useState } from 'react';
import { Link } from 'react-router-dom';

function Footer() {
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  const handleNewsletterSubmit = (e) => {
    e.preventDefault();
    if (email) {
      setSubscribed(true);
      setEmail('');
      setTimeout(() => setSubscribed(false), 3000);
    }
  };

  return (
    <footer className="footer-section">
      <div className="footer-content">
        <div className="footer-grid">
          
          {/* Brand Section */}
          <div className="footer-brand">
            <div className="footer-logo">
              <div className="footer-logo-container">
                <i className="fas fa-feather-alt footer-logo-icon"></i>
                <div className="logo-animation-bg"></div>
              </div>
              <span className="footer-logo-text">BlogApp</span>
            </div>
            <p className="footer-description">
              Your destination for quality articles and insightful content. 
              Share knowledge, inspire others, and grow together in our 
              vibrant community of writers and readers.
            </p>
          </div>

          {/* Quick Links */}
          <div className="footer-section-content">
            <h3 className="footer-section-title">Quick Links</h3>
            <ul className="footer-links">
              <li><Link to="/" className="footer-link">Home</Link></li>
              <li><Link to="/articles" className="footer-link">Articles</Link></li>
            </ul>
          </div>

          {/* Categories */}
          <div className="footer-section-content">
            <h3 className="footer-section-title">Categories</h3>
            <ul className="footer-links">
              <li><a href="#" className="footer-link">Technology</a></li>
              <li><a href="#" className="footer-link">Health</a></li>
              <li><a href="#" className="footer-link">Business</a></li>
              <li><a href="#" className="footer-link">Education</a></li>
              <li><a href="#" className="footer-link">Lifestyle</a></li>
            </ul>
          </div>

          {/* Contact Information */}
          <div className="footer-section-content">
            <h3 className="footer-section-title">Contact Info</h3>
            <div className="contact-info">
              <div className="contact-item-simple">
                <div className="contact-text">
                  <div className="contact-label">Admin Email</div>
                  <div className="contact-value">admin@blogapp.in</div>
                </div>
              </div>
              
              <div className="contact-item-simple">
                <div className="contact-text">
                  <div className="contact-label">Mobile Number</div>
                  <div className="contact-value">+91 98765 43210</div>
                </div>
              </div>
              
              <div className="contact-item-simple">
                <div className="contact-text">
                  <div className="contact-label">Address</div>
                  <div className="contact-value">Tech Hub, Bangalore, Karnataka 560001</div>
                </div>
              </div>
              
              <div className="contact-item-simple">
                <div className="contact-text">
                  <div className="contact-label">Support Hours</div>
                  <div className="contact-value">Mon - Sat: 9AM - 8PM IST</div>
                </div>
              </div>
            </div>
          </div>

          {/* Newsletter */}
          <div className="newsletter-section">
            <div className="newsletter-header">
              <i className="fas fa-envelope newsletter-icon"></i>
              <h3 className="newsletter-title">Stay Updated</h3>
            </div>
            <p className="newsletter-description">
              Get the latest articles and updates delivered straight to your inbox. Join our community!
            </p>
            
            {subscribed ? (
              <div className="success-message" style={{
                background: 'linear-gradient(135deg, #10b981, #059669)',
                color: 'white',
                padding: '1.2rem',
                borderRadius: '12px',
                textAlign: 'center',
                fontWeight: '600',
                border: '2px solid rgba(255, 255, 255, 0.2)'
              }}>
                <i className="fas fa-check-circle" style={{ marginRight: '0.5rem', fontSize: '1.2rem' }}></i>
                Welcome to BlogApp! 🎉
              </div>
            ) : (
              <form className="newsletter-form" onSubmit={handleNewsletterSubmit}>
                <div className="newsletter-input-group">
                  <input
                    type="email"
                    className="newsletter-input"
                    placeholder="Enter your email address"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                  <button type="submit" className="newsletter-btn">
                    <i className="fas fa-paper-plane"></i>
                    <span className="ms-2">Subscribe</span>
                  </button>
                </div>
                <small className="newsletter-note">
                  We respect your privacy. Unsubscribe anytime.
                </small>
              </form>
            )}
          </div>
        </div>

        {/* Footer Bottom */}
        <div className="footer-bottom">
          <p className="footer-copyright">
            © 2025 BlogApp. All rights reserved. Made with ❤️ for the community.
          </p>
          <div className="footer-legal">
            <a href="#" className="legal-link">Privacy Policy</a>
            <a href="#" className="legal-link">Terms of Service</a>
            <a href="#" className="legal-link">Cookie Policy</a>
            <a href="#" className="legal-link">GDPR</a>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default Footer;