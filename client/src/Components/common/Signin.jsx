import React from "react";
import { SignIn, useUser } from '@clerk/clerk-react';
import { Navigate } from 'react-router-dom';

function Signin() {
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
            
            <h1 className="auth-welcome-title">Welcome Back!</h1>
            <p className="auth-welcome-subtitle">
              Sign in to continue your writing journey and connect with our amazing community of writers and readers.
            </p>
            
            <div className="auth-features">
              <div className="auth-feature-item">
                <i className="fas fa-book-open"></i>
                <span>Access your articles</span>
              </div>
              <div className="auth-feature-item">
                <i className="fas fa-users"></i>
                <span>Connect with community</span>
              </div>
              <div className="auth-feature-item">
                <i className="fas fa-chart-line"></i>
                <span>Track your progress</span>
              </div>
            </div>
            
            <div className="auth-illustration">
              <div className="auth-floating-elements">
                <div className="auth-element auth-element-1">
                  <i className="fas fa-pen"></i>
                </div>
                <div className="auth-element auth-element-2">
                  <i className="fas fa-heart"></i>
                </div>
                <div className="auth-element auth-element-3">
                  <i className="fas fa-star"></i>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        {/* Right Side - Authentication */}
        <div className="auth-form-container">
          <div className="auth-form-wrapper">
            <SignIn />
          </div>
        </div>
      </div>
    </div>
  );
}
export default Signin;