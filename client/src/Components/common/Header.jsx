import {useContext} from "react";
import {Link} from "react-router-dom";
import {useClerk, useUser} from "@clerk/clerk-react";
import UserAuthorContext, { UserAuthorContextObj } from "../Context/UserAuthorContext";
import { useNavigate } from "react-router-dom";

function Header() {
  const {signOut} = useClerk();
  const{ isSignedIn, user, isLoaded } = useUser();
  const {currentUser,setCurrentUser} = useContext(UserAuthorContextObj);
  const navigate = useNavigate();

  function handleSignOut() {
    signOut();
    setCurrentUser(null);
    navigate("");
  }

  return (
    <nav className='header-enhanced d-flex justify-content-between align-items-center'>
      <div className="logo-section d-flex align-items-center">
        <Link to="/" className="logo-link">
          <div className="logo-container">
            <i className="fas fa-feather-alt logo-icon"></i>
            <span className="logo-text">BlogApp</span>
          </div>
        </Link>
      </div>
      
      <div className="nav-section d-flex align-items-center">
        {!isSignedIn ? (
          <div className="auth-section d-flex align-items-center w-100 justify-content-end">
            <div className="auth-buttons d-flex align-items-center gap-2">
              <Link to="/" className="auth-btn home-btn">
                <i className="fas fa-home me-1"></i>Home
              </Link>
              <Link to="/signin" className="auth-btn signin-btn">
                <i className="fas fa-sign-in-alt me-1"></i>Sign In
              </Link>
              <Link to="/signup" className="auth-btn signup-btn">
                <i className="fas fa-user-plus me-1"></i>Sign Up
              </Link>
            </div>
          </div>
        ) : (
          <ul className="nav-list d-flex list-unstyled m-0">
            <li className="user-profile-section-enhanced">
              <div className="user-info-container-enhanced">
                <div className="user-avatar-wrapper-enhanced">
                  <img 
                    src={user?.imageUrl} 
                    className="header-profile-image-enhanced" 
                    alt="Profile"
                  />
                  <div className="online-indicator-enhanced"></div>
                </div>
                <div className="user-details-enhanced">
                  <span className="user-name-enhanced">{currentUser?.firstname || user?.firstName || 'User'}</span>
                  {currentUser?.role && <span className="user-role-enhanced">{currentUser?.role}</span>}
                </div>
              </div>
            </li>
            <li>
              <button className="signout-button-enhanced" onClick={handleSignOut}>
                <i className="fas fa-sign-out-alt me-2"></i>
                <span>Sign Out</span>
              </button>
            </li>
          </ul>
        )}
      </div>
    </nav>
  );
}

export default Header;