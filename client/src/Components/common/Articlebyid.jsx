import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useUser } from '@clerk/clerk-react';
import axios from 'axios';

function Articlebyid() {
    const { articleId } = useParams();
    const { user, isSignedIn } = useUser();
    const navigate = useNavigate();
    
    const [article, setArticle] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [relatedArticles, setRelatedArticles] = useState([]);

    useEffect(() => {
        fetchArticle();
        fetchRelatedArticles();
    }, [articleId]);

    const fetchArticle = async () => {
        try {
            setLoading(true);
            // Use a more specific API endpoint if available
            const response = await axios.get(`http://localhost:4000/authorApi/article/${articleId}`);
            
            if (response.data && response.data.payload) {
                setArticle(response.data.payload);
                setError('');
            } else {
                // Fallback: search through all articles
                const allArticlesResponse = await axios.get('http://localhost:4000/authorApi/articles');
                const foundArticle = allArticlesResponse.data.payload?.find(art => art._id === articleId);
                
                if (!foundArticle) {
                    setError('Article not found');
                    return;
                }
                
                setArticle(foundArticle);
                setError('');
            }
        } catch (err) {
            console.error('Error fetching article:', err);
            // If specific endpoint fails, try fallback
            try {
                const response = await axios.get('http://localhost:4000/authorApi/articles');
                const foundArticle = response.data.payload?.find(art => art._id === articleId);
                
                if (!foundArticle) {
                    setError('Article not found');
                    return;
                }
                
                setArticle(foundArticle);
                setError('');
            } catch (fallbackErr) {
                console.error('Fallback fetch also failed:', fallbackErr);
                setError(`Failed to load article: ${err.response?.data?.message || err.message || 'Server error'}`);
            }
        } finally {
            setLoading(false);
        }
    };

    const fetchRelatedArticles = async () => {
        try {
            const response = await axios.get('http://localhost:4000/authorApi/articles');
            const allArticles = response.data.payload;
            
            // Get articles from same category or author (excluding current article)
            const related = allArticles
                .filter(art => art._id !== articleId)
                .slice(0, 3); // Limit to 3 related articles
                
            setRelatedArticles(related);
        } catch (err) {
            console.error('Error fetching related articles:', err);
        }
    };

    const formatDate = (dateString) => {
        if (!dateString) return 'Unknown date';
        return new Date(dateString).toLocaleDateString('en-IN', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    const wasModified = (article) => {
        return article.dateOfModification && 
               new Date(article.dateOfModification).getTime() !== new Date(article.dateOfCreation).getTime();
    };

    const isAuthor = () => {
        return isSignedIn && 
               user?.primaryEmailAddress?.emailAddress === article?.authorData?.email;
    };

    if (loading) {
        return (
            <div className="container mt-5">
                <div className="text-center py-5">
                    <div className="spinner-border text-primary mb-3" role="status" style={{ width: '3rem', height: '3rem' }}>
                        <span className="visually-hidden">Loading article...</span>
                    </div>
                    <h4 className="text-primary">Loading Article...</h4>
                    <p className="text-muted">Please wait while we fetch the content</p>
                </div>
            </div>
        );
    }

    if (error || !article) {
        return (
            <div className="container mt-5">
                <div className="row justify-content-center">
                    <div className="col-lg-8">
                        <div className="alert alert-danger text-center p-5 rounded-4 shadow" role="alert">
                            <div className="mb-4">
                                <i className="fas fa-exclamation-triangle display-1 text-danger opacity-50"></i>
                            </div>
                            <h4 className="alert-heading">Article Not Found</h4>
                            <p className="mb-4">{error || 'The article you are looking for does not exist or may have been removed.'}</p>
                            <div className="d-flex gap-3 justify-content-center flex-wrap">
                                <Link to="/articles" className="btn btn-primary">
                                    <i className="fas fa-arrow-left me-2"></i> Back to Articles
                                </Link>
                                <button onClick={() => window.location.reload()} className="btn btn-outline-primary">
                                    <i className="fas fa-redo me-2"></i> Try Again
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="container mt-4 mb-5">
            {/* Enhanced Navigation Breadcrumb */}
            <nav aria-label="breadcrumb" className="mb-4">
                <ol className="breadcrumb bg-light p-3 rounded-4">
                    <li className="breadcrumb-item">
                        <Link to="/" className="text-decoration-none">
                            <i className="fas fa-home me-1"></i>Home
                        </Link>
                    </li>
                    <li className="breadcrumb-item">
                        <Link to="/articles" className="text-decoration-none">
                            <i className="fas fa-newspaper me-1"></i>Articles
                        </Link>
                    </li>
                    <li className="breadcrumb-item active" aria-current="page">
                        {article.title && article.title.length > 40 ? `${article.title.substring(0, 40)}...` : article.title}
                    </li>
                </ol>
            </nav>

            <div className="row">
                {/* Main Article Content */}
                <div className="col-lg-8 mb-4">
                    <article className="article-content">
                        {/* Enhanced Article Header */}
                        <header className="article-header mb-4">
                            <div className="d-flex justify-content-between align-items-start mb-4 flex-wrap gap-3">
                                <span className="badge bg-primary fs-5 px-4 py-2 rounded-pill">
                                    <i className="fas fa-tag me-2"></i>
                                    {article.category || 'Uncategorized'}
                                </span>
                                {isAuthor() && (
                                    <div className="author-actions">
                                        <Link 
                                            to={`/edit-article/${article._id}`}
                                            className="btn btn-outline-info"
                                        >
                                            <i className="fas fa-edit me-2"></i>Edit Article
                                        </Link>
                                    </div>
                                )}
                            </div>
                            
                            <h1 className="article-title display-5 mb-4 fw-bold">{article.title}</h1>
                            
                            {/* Enhanced Author Info */}
                            <div className="author-info p-4 rounded-4 mb-4">
                                <div className="d-flex align-items-center">
                                    <img 
                                        src={article.authorData?.profileImageUrl || '/api/placeholder/80/80'} 
                                        alt={article.authorData?.nameOfAuthor}
                                        className="author-avatar rounded-circle me-4"
                                        style={{ width: '80px', height: '80px', objectFit: 'cover' }}
                                        onError={(e) => {
                                            e.target.src = '/api/placeholder/80/80';
                                        }}
                                    />
                                    <div className="author-details flex-grow-1">
                                        <h5 className="mb-2 text-white fw-bold">
                                            <i className="fas fa-user me-2"></i>
                                            {article.authorData?.nameOfAuthor || 'Unknown Author'}
                                        </h5>
                                        <div className="text-muted">
                                            <div className="mb-2">
                                                <i className="fas fa-calendar-alt me-2"></i> 
                                                <span className="fw-semibold">Published:</span> {formatDate(article.dateOfCreation)}
                                            </div>
                                            {wasModified(article) && (
                                                <div className="text-info">
                                                    <i className="fas fa-edit me-2"></i> 
                                                    <span className="fw-semibold">Last modified:</span> {formatDate(article.dateOfModification)}
                                                </div>
                                            )}
                                            <div className="mt-2">
                                                <i className="fas fa-clock me-2"></i>
                                                <span className="fw-semibold">Reading time:</span> ~{Math.max(1, Math.ceil((article.content?.length || 0) / 200))} min
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </header>

                        {/* Enhanced Article Content */}
                        <div className="article-body">
                            <div className="content-text" style={{ fontSize: '1.2rem', lineHeight: '1.9', color: '#2d3748' }}>
                                {article.content ? article.content.split('\n').map((paragraph, index) => (
                                    paragraph.trim() && (
                                        <p key={index} className="mb-4 text-justify">
                                            {paragraph}
                                        </p>
                                    )
                                )) : (
                                    <p className="text-muted fst-italic">No content available for this article.</p>
                                )}
                            </div>
                        </div>

                        {/* Enhanced Article Footer */}
                        <footer className="article-footer mt-5 pt-4 border-top">
                            <div className="row align-items-center">
                                <div className="col-md-6">
                                    <div className="article-meta">
                                        <small className="text-muted">
                                            <i className="fas fa-fingerprint me-2"></i>
                                            Article ID: {article.articleId || article._id}
                                        </small>
                                    </div>
                                </div>
                                <div className="col-md-6 text-md-end mt-3 mt-md-0">
                                    <div className="share-buttons">
                                        <small className="text-muted me-3 d-block d-sm-inline">Share this article:</small>
                                        <div className="btn-group mt-2 mt-sm-0" role="group">
                                            <button className="btn btn-sm btn-outline-primary">
                                                <i className="fab fa-twitter"></i>
                                            </button>
                                            <button className="btn btn-sm btn-outline-primary">
                                                <i className="fab fa-facebook"></i>
                                            </button>
                                            <button className="btn btn-sm btn-outline-primary">
                                                <i className="fab fa-linkedin"></i>
                                            </button>
                                            <button className="btn btn-sm btn-outline-primary">
                                                <i className="fas fa-link"></i>
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </footer>
                    </article>
                </div>

                {/* Enhanced Sidebar */}
                <div className="col-lg-4">
                    <div className="sidebar-content">
                        {/* Enhanced Author Info Card */}
                        <div className="card author-card mb-4 border-0 shadow">
                            <div className="card-body text-center p-4">
                                <img 
                                    src={article.authorData?.profileImageUrl || 'https://via.placeholder.com/80x80/3B82F6/FFFFFF?text=U'} 
                                    alt={article.authorData?.nameOfAuthor}
                                    className="author-avatar rounded-circle me-4"
                                    style={{ width: '80px', height: '80px', objectFit: 'cover' }}
                                    onError={(e) => {
                                        e.target.src = 'https://via.placeholder.com/80x80/3B82F6/FFFFFF?text=U';
                                    }}
                                />
                                <h5 className="card-title mb-2">
                                    {article.authorData?.nameOfAuthor || 'Unknown Author'}
                                </h5>
                                <p className="text-muted mb-3">
                                    <i className="fas fa-user-edit me-1"></i>Author
                                </p>
                                <div className="author-stats mb-3">
                                    <small className="text-muted d-block">
                                        <i className="fas fa-calendar-alt me-1"></i>
                                        Member since {formatDate(article.dateOfCreation).split(',')[0]}
                                    </small>
                                </div>
                                {isSignedIn && !isAuthor() && (
                                    <button className="btn btn-primary">
                                        <i className="fas fa-user-plus me-2"></i>Follow
                                    </button>
                                )}
                                {isAuthor() && (
                                    <span className="badge bg-success">
                                        <i className="fas fa-crown me-1"></i>Your Article
                                    </span>
                                )}
                            </div>
                        </div>

                        {/* Enhanced Related Articles */}
                        {relatedArticles.length > 0 && (
                            <div className="card related-articles border-0 shadow mb-4">
                                <div className="card-header bg-primary text-white">
                                    <h6 className="mb-0">
                                        <i className="fas fa-newspaper me-2"></i>Related Articles
                                    </h6>
                                </div>
                                <div className="card-body p-0">
                                    {relatedArticles.map((relatedArticle) => (
                                        <div key={relatedArticle._id} className="related-article-item border-bottom p-3">
                                            <Link 
                                                to={`/article/${relatedArticle._id}`}
                                                className="text-decoration-none"
                                            >
                                                <h6 className="mb-2 text-primary">
                                                    {relatedArticle.title}
                                                </h6>
                                                <p className="text-muted small mb-2">
                                                    {relatedArticle.content?.substring(0, 100)}...
                                                </p>
                                                <div className="d-flex justify-content-between align-items-center">
                                                    <small className="text-muted">
                                                        <i className="fas fa-user me-1"></i>
                                                        {relatedArticle.authorData?.nameOfAuthor}
                                                    </small>
                                                    <small className="text-muted">
                                                        <i className="fas fa-calendar me-1"></i>
                                                        {formatDate(relatedArticle.dateOfCreation).split(',')[0]}
                                                    </small>
                                                </div>
                                            </Link>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Enhanced Back to Articles Button */}
                        <div className="card border-0 shadow">
                            <div className="card-body text-center p-4">
                                <i className="fas fa-newspaper text-primary fs-1 mb-3"></i>
                                <h6 className="mb-3">Explore More Articles</h6>
                                <Link to="/articles" className="btn btn-outline-primary mb-2 d-block">
                                    <i className="fas fa-arrow-left me-2"></i>Back to All Articles
                                </Link>
                                {isSignedIn && (
                                    <Link to="/post-article" className="btn btn-primary d-block">
                                        <i className="fas fa-plus me-2"></i>Write New Article
                                    </Link>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Articlebyid;