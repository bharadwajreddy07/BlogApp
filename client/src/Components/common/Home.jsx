import { useContext, useEffect, useState } from "react";
import { UserAuthorContextObj } from "../Context/UserAuthorContext.jsx";
import { useUser } from "@clerk/clerk-react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom"; 

function Home() {
  const { currentUser, setCurrentUser } = useContext(UserAuthorContextObj);
  const { isSignedIn, user, isLoaded } = useUser();
  const [error, setError] = useState('');
  const [featuredArticles, setFeaturedArticles] = useState([]);
  const [articlesLoading, setArticlesLoading] = useState(false);
  const navigate = useNavigate();
  
  // Fetch featured articles for preview
  const fetchFeaturedArticles = async () => {
    try {
      setArticlesLoading(true);
      const response = await axios.get('http://localhost:4000/authorApi/articles');
      if (response.data && response.data.payload) {
        // Get the 3 most recent articles as featured
        const featured = response.data.payload.slice(0, 3);
        setFeaturedArticles(featured);
      }
    } catch (err) {
      console.log('Featured articles not available:', err.message);
      // Set some sample articles for demo
      setFeaturedArticles([
        {
          _id: '1',
          title: 'Getting Started with React Development',
          content: 'Learn the fundamentals of React and start building amazing web applications...',
          category: 'Technology',
          authorData: { nameOfAuthor: 'John Doe' },
          dateOfCreation: new Date().toISOString()
        },
        {
          _id: '2', 
          title: 'The Future of Web Development',
          content: 'Explore the latest trends and technologies shaping the future of web development...',
          category: 'Technology',
          authorData: { nameOfAuthor: 'Jane Smith' },
          dateOfCreation: new Date().toISOString()
        },
        {
          _id: '3',
          title: 'Building Better User Experiences',
          content: 'Discover key principles and best practices for creating exceptional user experiences...',
          category: 'Design',
          authorData: { nameOfAuthor: 'Mike Johnson' },
          dateOfCreation: new Date().toISOString()
        }
      ]);
    } finally {
      setArticlesLoading(false);
    }
  };
  
  async function onselectRole(event) {
    setError('');
    const selectedRole = event.target.value;
    
    const updatedUser = {
      ...currentUser,
      role: selectedRole,
      firstname: currentUser?.firstname || user?.firstName || '',
      lastname: currentUser?.lastname || user?.lastName || '',
      email: currentUser?.email || user?.primaryEmailAddress?.emailAddress || user?.emailAddresses?.[0]?.emailAddress || '',
      profileimageURL: currentUser?.profileimageURL || user?.imageUrl || ''
    };
    
    if (!updatedUser.firstname || !updatedUser.lastname || !updatedUser.email) {
      setError("Missing required user information. Please make sure your profile is complete.");
      return;
    }

    try {
      let res = null;
      
      if (selectedRole === "author") {
        res = await axios.post("http://localhost:4000/authorApi/author", updatedUser);
        const { message } = res.data;
        
        if (message === "author") {
          setCurrentUser({ ...updatedUser, role: selectedRole });
          navigate("/author-profile");
        } else {
          setError(message);
        }
      }
      
      if (selectedRole === "user") {
        res = await axios.post("http://localhost:4000/userApi/user", updatedUser);
        const { message } = res.data;
        
        if (message === "user") {
          setCurrentUser({ ...updatedUser, role: selectedRole });
          navigate("/articles");
        } else {
          setError(message);  
        }
      }
    } catch (err) {
      console.error("Error updating role:", err);
      setError(err.response?.data?.message || err.message || "Failed to update role. Please try again.");
    }
  }
  
  useEffect(() => {
    if (isSignedIn && user) {
      setCurrentUser({
        firstname: user?.firstName,
        lastname: user?.lastName,
        email: user?.primaryEmailAddress?.emailAddress || user?.emailAddresses[0]?.emailAddress,
        profileimageURL: user?.imageUrl,
      });
    }
    
    // Fetch featured articles for non-signed-in users
    if (!isSignedIn) {
      fetchFeaturedArticles();
    }
  }, [isLoaded, isSignedIn, user]);

  return (
    <div style={{ margin: 0, padding: 0 }}>
      {!isSignedIn && (
        <div className="hero-section">

          {/* Main Hero Content */}
          <div className="hero-content">
            <div className="container">
              <div className="row align-items-center min-vh-75">
                <div className="col-lg-6 hero-text-section">
                  <div className="hero-badge">
                    <i className="fas fa-star me-2"></i>
                    Join  Writers Worldwide
                  </div>
                  
                  <h1 className="hero-title">
                    Welcome to <span className="hero-brand">BlogApp</span>
                  </h1>
                  
                  <p className="hero-description">
                    Discover amazing articles, share your knowledge, and connect with a 
                    vibrant community of writers and readers. Start your journey today 
                    and become part of something extraordinary.
                  </p>
                  
                  <div className="hero-features">
                    <div className="feature-item">
                      <i className="fas fa-check-circle"></i>
                      <span>Write & Publish Articles</span>
                    </div>
                    <div className="feature-item">
                      <i className="fas fa-check-circle"></i>
                      <span>Connect with Readers</span>
                    </div>

                  </div>
                  
                  <div className="hero-actions">
                    <a href="/signup" className="btn-primary-hero">
                      <i className="fas fa-rocket me-2"></i>
                      Get Started Free
                    </a>
                    <a href="/articles" className="btn-secondary-hero">
                      <i className="fas fa-book-open me-2"></i>
                      Explore Articles
                    </a>
                  </div>
                  
                  <div className="hero-stats">
                    <div className="stat-item">
                      <span className="stat-number">1K+</span>
                      <span className="stat-label">Articles</span>
                    </div>
                    <div className="stat-item">
                      <span className="stat-number">500+</span>
                      <span className="stat-label">Writers</span>
                    </div>
                    <div className="stat-item">
                      <span className="stat-number">50K+</span>
                      <span className="stat-label">Readers</span>
                    </div>
                  </div>
                </div>
                
                <div className="col-lg-6 hero-visual-section">
                  <div className="hero-illustration">
                    <div className="illustration-container">
                      <div className="floating-card card-1">
                        <i className="fas fa-pen-fancy"></i>
                        <span>Write</span>
                      </div>
                      <div className="floating-card card-2">
                        <i className="fas fa-share-alt"></i>
                        <span>Share</span>
                      </div>
                      <div className="floating-card card-3">
                        <i className="fas fa-users"></i>
                        <span>Connect</span>
                      </div>
                      <div className="main-illustration">
                        <i className="fas fa-newspaper illustration-icon"></i>
                        <div className="illustration-glow"></div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          {/* Bottom Wave */}
          <div className="hero-wave">
            <svg viewBox="0 0 1200 120" preserveAspectRatio="none">
              <path d="M0,60 C300,120 900,0 1200,60 L1200,120 L0,120 Z" fill="rgba(255,255,255,0.1)"></path>
            </svg>
          </div>
        </div>
      )}

      {/* Featured Articles Preview Section */}
      {!isSignedIn && (
        <div className="featured-section">
          <div className="container">
            <div className="featured-header">
              <h2 className="featured-title">
                <i className="fas fa-star featured-icon" aria-hidden="true"></i>
                Featured Articles
              </h2>
              <p className="featured-subtitle">
                Discover amazing content from our community of writers
              </p>
            </div>
            
            {articlesLoading ? (
              <div className="featured-loading">
                <div className="loading-spinner" aria-label="Loading featured articles"></div>
                <p>Loading featured articles...</p>
              </div>
            ) : (
              <div className="featured-grid">
                {featuredArticles.map((article, index) => (
                  <article key={article._id} className="featured-card" tabIndex="0">
                    <div className="featured-card-header">
                      <span className="featured-category">{article.category}</span>
                      <time className="featured-date" dateTime={article.dateOfCreation}>
                        {new Date(article.dateOfCreation).toLocaleDateString()}
                      </time>
                    </div>
                    <h3 className="featured-card-title">{article.title}</h3>
                    <p className="featured-card-excerpt">
                      {article.content.substring(0, 120)}...
                    </p>
                    <div className="featured-card-footer">
                      <div className="featured-author">
                        <i className="fas fa-user-circle" aria-hidden="true"></i>
                        <span>{article.authorData?.nameOfAuthor || 'Anonymous'}</span>
                      </div>
                      <Link 
                        to="/signup" 
                        className="featured-read-more"
                        aria-label={`Sign up to read ${article.title}`}
                      >
                        Read More <i className="fas fa-arrow-right" aria-hidden="true"></i>
                      </Link>
                    </div>
                  </article>
                ))}
              </div>
            )}
            
            <div className="featured-cta">
              <p className="featured-cta-text">Ready to join our community?</p>
              <div className="featured-cta-buttons">
                <Link to="/signup" className="btn-featured-primary">
                  <i className="fas fa-user-plus" aria-hidden="true"></i>
                  Sign Up Free
                </Link>
                <Link to="/articles" className="btn-featured-secondary">
                  <i className="fas fa-newspaper" aria-hidden="true"></i>
                  Browse All Articles
                </Link>
              </div>
            </div>
          </div>
        </div>
      )}
      
      {isSignedIn && (
        <div style={{ margin: 0, padding: 0 }}>
          <div className="role-selection-enhanced">
            
            {/* Enhanced Profile Section */}
            <div className="profile-section-enhanced">
              <img 
                src={currentUser?.profileimageURL || user?.imageUrl} 
                alt="Profile" 
                className="profile-image-enhanced"
              />
              <h2 className="welcome-text-enhanced">Welcome, {user?.firstName}!</h2>
              <p className="user-email-enhanced">{user?.primaryEmailAddress?.emailAddress}</p>
            </div>
            
            {/* Error Display */}
            {error && (
              <div className="error-message-enhanced">
                <i className="fas fa-exclamation-circle me-2"></i>
                {error}
              </div>
            )}
            
            {/* Role Selection Instruction */}
            <h3 className="role-instruction-enhanced">
              Please select your role to continue
            </h3>
            
            {/* Enhanced Role Options */}
            <div className="role-options-enhanced">
              
              {/* Author Option */}
              <div className="role-option-container">
                <input
                  type="radio"
                  name="role"
                  value="author"
                  id="author-role"
                  onChange={onselectRole}
                  className="radio-input-enhanced"
                />
                <label htmlFor="author-role" className="role-option-enhanced author">
                  <div className="role-icon-enhanced">
                    <i className="fas fa-pen-fancy"></i>
                  </div>
                  <h4 className="role-title-enhanced">Author</h4>
                  <p className="role-description-enhanced">
                    Create and manage articles, share your expertise with the world, 
                    and build your writing portfolio
                  </p>
                </label>
              </div>
              
              {/* User Option */}
              <div className="role-option-container">
                <input
                  type="radio"
                  name="role"
                  value="user"
                  id="user-role"
                  onChange={onselectRole}
                  className="radio-input-enhanced"
                />
                <label htmlFor="user-role" className="role-option-enhanced user">
                  <div className="role-icon-enhanced">
                    <i className="fas fa-book-reader"></i>
                  </div>
                  <h4 className="role-title-enhanced">Reader</h4>
                  <p className="role-description-enhanced">
                    Read amazing articles, engage with content through comments, 
                    and discover new knowledge
                  </p>
                </label>
              </div>
              
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Home;