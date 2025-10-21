import React, { useState, useEffect } from 'react';
import { useUser } from '@clerk/clerk-react';
import { Link } from 'react-router-dom';
import axios from 'axios';

function Articles() {
    const { user, isSignedIn } = useUser();
    const [articles, setArticles] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [filter, setFilter] = useState('all');
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        fetchArticles();
    }, []);

    const fetchArticles = async () => {
        try {
            setLoading(true);
            const response = await axios.get('http://localhost:4000/authorApi/articles');
            if (response.data && response.data.payload) {
                setArticles(response.data.payload);
                setError('');
            } else {
                setArticles([]);
                setError('No articles found');
            }
        } catch (err) {
            console.error('Error fetching articles:', err);
            setError(`Failed to load articles: ${err.response?.data?.message || err.message || 'Server error'}`);
            setArticles([]);
        } finally {
            setLoading(false);
        }
    };

    const filteredArticles = articles.filter(article => {
        if (!article) return false;
        
        const matchesSearch = 
            article.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            article.content?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            article.authorData?.nameOfAuthor?.toLowerCase().includes(searchTerm.toLowerCase());
        
        const matchesFilter = filter === 'all' || 
            article.category?.toLowerCase() === filter.toLowerCase();
        
        return matchesSearch && matchesFilter;
    });

    const formatDate = (dateString) => {
        if (!dateString) return 'Unknown date';
        return new Date(dateString).toLocaleDateString('en-IN', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        });
    };

    const wasModified = (article) => {
        return article.dateOfModification && 
               new Date(article.dateOfModification).getTime() !== new Date(article.dateOfCreation).getTime();
    };

    if (loading) {
        return (
            <div className="container mt-5">
                <div className="text-center py-5">
                    <div className="spinner-border text-primary mb-3" role="status" style={{ width: '3rem', height: '3rem' }}>
                        <span className="visually-hidden">Loading articles...</span>
                    </div>
                    <h4 className="text-primary">Loading Amazing Articles...</h4>
                    <p className="text-muted">Please wait while we fetch the latest content</p>
                </div>
            </div>
        );
    }

    return (
        <div className="container-fluid mt-4 px-4">
            {/* Enhanced Header Section */}
            <div className="row mb-5">
                <div className="col-12">
                    <div className="bg-gradient-primary text-white p-5 rounded-4 shadow-lg text-center">
                        <h1 className="display-4 fw-bold mb-3">
                            <i className="fas fa-newspaper me-3"></i>
                            Discover Amazing Articles
                        </h1>
                        <p className="lead fs-4 mb-0 opacity-90">
                            Explore knowledge shared by our vibrant BlogApp community of writers and thinkers
                        </p>
                    </div>
                </div>
            </div>

            {/* Enhanced Search and Filter Section */}
            <div className="row mb-4 align-items-end">
                <div className="col-lg-8 mb-3 mb-lg-0">
                    <div className="search-section p-3 rounded-4 h-100">
                        <h5 className="text-white mb-3">
                            <i className="fas fa-search me-2"></i>Search Articles
                        </h5>
                        <div className="input-group">
                            <span className="input-group-text bg-primary border-0">
                                <i className="fas fa-search text-white fs-5"></i>
                            </span>
                            <input
                                type="text"
                                className="form-control form-control-lg bg-dark text-light border-0"
                                placeholder="Search by title, content, or author name..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                        </div>
                    </div>
                </div>
                <div className="col-lg-4">
                    <div className="filter-section p-3 rounded-4 h-100">
                        <h5 className="text-white mb-3">
                            <i className="fas fa-filter me-2"></i>Filter by Category
                        </h5>
                        <select
                            className="form-select form-select-lg bg-dark text-light border-0"
                            value={filter}
                            onChange={(e) => setFilter(e.target.value)}
                        >
                            <option value="all">🌟 All Categories</option>
                            <option value="technology">💻 Technology</option>
                            <option value="health">🏥 Health</option>
                            <option value="travel">✈️ Travel</option>
                            <option value="food">🍳 Food</option>
                            <option value="business">💼 Business</option>
                            <option value="education">📖 Education</option>
                            <option value="entertainment">🎬 Entertainment</option>
                            <option value="sports">⚽ Sports</option>
                            <option value="other">📝 Other</option>
                        </select>
                    </div>
                </div>
            </div>

            {/* Results Count */}
            <div className="row mb-4">
                <div className="col-12">
                    <div className="results-info p-3 rounded-4 text-center">
                        <span className="badge bg-primary fs-5 px-4 py-3">
                            <i className="fas fa-chart-bar me-2"></i>
                            {filteredArticles.length} article{filteredArticles.length !== 1 ? 's' : ''} found
                            {searchTerm && ` for "${searchTerm}"`}
                            {filter !== 'all' && ` in ${filter}`}
                        </span>
                    </div>
                </div>
            </div>

            {/* Error Display */}
            {error && (
                <div className="row mb-4">
                    <div className="col-12">
                        <div className="alert alert-danger shadow-lg rounded-4 p-4" role="alert">
                            <h5 className="alert-heading">
                                <i className="fas fa-exclamation-triangle me-2"></i>
                                Oops! Something went wrong
                            </h5>
                            <p className="mb-2">{error}</p>
                            <hr />
                            <button 
                                className="btn btn-outline-danger"
                                onClick={fetchArticles}
                            >
                                <i className="fas fa-redo me-2"></i>Try Again
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Articles Grid */}
            {filteredArticles.length === 0 && !error ? (
                <div className="row">
                    <div className="col-12">
                        <div className="no-articles-section p-5 rounded-4 text-center">
                            <div className="mb-4">
                                <i className="fas fa-newspaper display-1 text-muted opacity-50"></i>
                            </div>
                            <h3 className="text-light mb-3">
                                {searchTerm || filter !== 'all' ? 'No Matching Articles Found' : 'No Articles Available'}
                            </h3>
                            <p className="text-muted mb-4 fs-5">
                                {searchTerm || filter !== 'all' 
                                    ? 'Try adjusting your search terms or filter criteria to find what you\'re looking for.' 
                                    : 'Be the first to contribute! Share your knowledge and insights with our community.'}
                            </p>
                            {isSignedIn && (
                                <div className="d-flex gap-3 justify-content-center flex-wrap">
                                    <Link to="/post-article" className="btn btn-primary btn-lg px-4">
                                        <i className="fas fa-plus me-2"></i>
                                        Write First Article
                                    </Link>
                                    {(searchTerm || filter !== 'all') && (
                                        <button 
                                            className="btn btn-outline-light btn-lg px-4"
                                            onClick={() => {
                                                setSearchTerm('');
                                                setFilter('all');
                                            }}
                                        >
                                            <i className="fas fa-times me-2"></i>
                                            Clear Filters
                                        </button>
                                    )}
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            ) : (
                <div className="row g-4">
                    {filteredArticles.map((article, index) => (
                        <div key={article._id || index} className="col-xl-4 col-lg-6 col-md-6">
                            <div className="article-card-enhanced h-100 shadow-hover">
                                {/* Enhanced Card Header */}
                                <div className="card-header-custom">
                                    <div className="d-flex justify-content-between align-items-center flex-wrap gap-2">
                                        <span className="category-badge">
                                            {article.category || 'Uncategorized'}
                                        </span>
                                        {wasModified(article) && (
                                            <span className="modified-badge">
                                                <i className="fas fa-edit me-1"></i> Updated
                                            </span>
                                        )}
                                    </div>
                                </div>

                                {/* Enhanced Card Body */}
                                <div className="card-body-custom d-flex flex-column">
                                    <h5 className="article-title-enhanced mb-3">
                                        {article.title || 'Untitled Article'}
                                    </h5>
                                    
                                    <p className="article-excerpt text-muted mb-4 flex-grow-1">
                                        {article.content ? 
                                            `${article.content.substring(0, 150)}...` : 
                                            'No content preview available'
                                        }
                                    </p>

                                    {/* Enhanced Author Section */}
                                    <div className="author-section-enhanced mt-auto">
                                        <div className="d-flex align-items-center mb-2">
                                            <div className="author-avatar-wrapper me-3">
                                                <img 
                                                    src={article.authorData?.profileImageUrl || 'https://via.placeholder.com/45x45/3B82F6/FFFFFF?text=U'} 
                                                    alt="Author" 
                                                    className="author-avatar-enhanced"
                                                    onError={(e) => {
                                                        e.target.src = 'https://via.placeholder.com/45x45/3B82F6/FFFFFF?text=U';
                                                    }}
                                                />
                                            </div>
                                            <div className="author-info-enhanced flex-grow-1">
                                                <div className="author-name text-dark fw-semibold">
                                                    {article.authorData?.nameOfAuthor || 'Unknown Author'}
                                                </div>
                                                <small className="text-muted d-flex align-items-center">
                                                    <i className="fas fa-calendar-alt me-1"></i>
                                                    {formatDate(article.dateOfCreation)}
                                                </small>
                                            </div>
                                        </div>
                                        {wasModified(article) && (
                                            <small className="text-info d-block">
                                                <i className="fas fa-edit me-1"></i>
                                                Last updated: {formatDate(article.dateOfModification)}
                                            </small>
                                        )}
                                    </div>
                                </div>

                                {/* Enhanced Card Footer */}
                                <div className="card-footer-custom">
                                    <div className="d-flex justify-content-between align-items-center gap-2 flex-wrap">
                                        <Link 
                                            to={`/article/${article._id}`}
                                            className="btn btn-primary-enhanced flex-grow-1"
                                        >
                                            <i className="fas fa-book-open me-2"></i>
                                            Read Article
                                        </Link>
                                        
                                        {isSignedIn && 
                                         user?.primaryEmailAddress?.emailAddress === article.authorData?.email && (
                                            <Link 
                                                to={`/edit-article/${article._id}`}
                                                className="btn btn-outline-info-enhanced"
                                            >
                                                <i className="fas fa-edit me-1"></i>
                                                Edit
                                            </Link>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* Enhanced Load More Section */}
            {filteredArticles.length > 0 && (
                <div className="row mt-5">
                    <div className="col-12">
                        <div className="load-more-section p-5 rounded-4 text-center">
                            <div className="mb-3">
                                <i className="fas fa-check-circle text-success fs-2"></i>
                            </div>
                            <h4 className="text-light mb-3">
                                You've explored all {filteredArticles.length} article{filteredArticles.length !== 1 ? 's' : ''}!
                            </h4>
                            <p className="text-muted mb-4 fs-5">
                                Thank you for being part of our BlogApp knowledge-sharing community
                            </p>
                            {isSignedIn && (
                                <Link to="/post-article" className="btn btn-success btn-lg px-4">
                                    <i className="fas fa-plus me-2"></i>
                                    Share Your Knowledge
                                </Link>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

export default Articles;