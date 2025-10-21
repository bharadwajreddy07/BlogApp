import React from "react";
import { SignUp, useUser } from '@clerk/clerk-react';
import { Navigate } from 'react-router-dom';

function Signup() {
  const { isSignedIn } = useUser();
  
  // If user is already signed in, redirect to home
  if (isSignedIn) {
    return <Navigate to="/" replace />;
  }

  return (
    <div className="auth-container">
      <div className="auth-layout">
        {/* Left Side - Description */}
        <div className="auth-description">
          <div className="auth-description-content">
            <div className="auth-logo">
              <i className="fas fa-feather-alt auth-logo-icon"></i>
              <span className="auth-logo-text">BlogApp</span>
            </div>
            
            <h1 className="auth-welcome-title">Join Our Community!</h1>
            <p className="auth-welcome-subtitle">
              Start your writing journey and connect with thousands of passionate readers and writers.
            </p>
            
            <div className="auth-features">
              <div className="auth-feature-item">
                <i className="fas fa-pen-fancy"></i>
                <span>Write and publish articles</span>
              </div>
              <div className="auth-feature-item">
                <i className="fas fa-chart-line"></i>
                <span>Track your performance</span>
              </div>
              <div className="auth-feature-item">
                <i className="fas fa-trophy"></i>
                <span>Build your reputation</span>
              </div>
            </div>
            
            <div className="auth-illustration">
              <div className="auth-floating-elements">
                <div className="auth-element auth-element-1">
                  <i className="fas fa-rocket"></i>
                </div>
                <div className="auth-element auth-element-2">
                  <i className="fas fa-magic"></i>
                </div>
                <div className="auth-element auth-element-3">
                  <i className="fas fa-crown"></i>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        {/* Right Side - Authentication */}
        <div className="auth-form-container">
          <div className="auth-form-wrapper">
            <SignUp />
          </div>
        </div>
      </div>
    </div>
  );
}
export default Signup;