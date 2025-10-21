import React, { useState, useEffect } from 'react';
import { useUser } from '@clerk/clerk-react';
import axios from 'axios';
import { Link } from 'react-router-dom';

function AuthorProfile() {
    const { user } = useUser();
    const [articles, setArticles] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [notification, setNotification] = useState({ show: false, message: '', type: '' });
    const [deleteConfirm, setDeleteConfirm] = useState({ show: false, articleId: null, articleTitle: '' });

    // Fetch author's articles on component mount
    useEffect(() => {
        fetchAuthorArticles();
    }, []);

    // Helper function to show notifications
    const showNotification = (message, type = 'success') => {
        setNotification({ show: true, message, type });
        setTimeout(() => {
            setNotification({ show: false, message: '', type: '' });
        }, 4000);
    };

    const fetchAuthorArticles = async () => {
        try {
            setLoading(true);
            const response = await axios.get('http://localhost:4000/authorApi/articles');
            
            // Filter articles to show only current user's articles
            const currentUserEmail = user?.primaryEmailAddress?.emailAddress || user?.emailAddresses?.[0]?.emailAddress;
            console.log('Current user email:', currentUserEmail);
            console.log('All articles:', response.data.payload);
            
            const userArticles = response.data.payload.filter(article => 
                article.authorData && article.authorData.email === currentUserEmail
            );
            
            console.log('Filtered user articles:', userArticles);
            setArticles(userArticles);
            setError('');
        } catch (err) {
            console.error('Error fetching articles:', err);
            setError('Failed to load articles. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    const deleteArticle = async (articleId) => {
        try {
            await axios.delete(`http://localhost:4000/authorApi/articles/${articleId}`);
            showNotification('Article deleted successfully!', 'success');
            // Refresh the articles list
            fetchAuthorArticles();
            setDeleteConfirm({ show: false, articleId: null, articleTitle: '' });
        } catch (err) {
            console.error('Error deleting article:', err);
            showNotification('Failed to delete article. Please try again.', 'error');
        }
    };

    if (loading) {
        return (
            <div className="container mt-5">
                <div className="text-center">
                    <div className="spinner-border text-primary" role="status">
                        <span className="visually-hidden">Loading...</span>
                    </div>
                    <p className="mt-2">Loading your author profile...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="container mt-4">
            {/* Notification Toast */}
            {notification.show && (
                <div className={`alert alert-${notification.type === 'error' ? 'danger' : 'success'} alert-dismissible fade show`} role="alert">
                    {notification.message}
                    <button 
                        type="button" 
                        className="btn-close" 
                        onClick={() => setNotification({ show: false, message: '', type: '' })}
                        aria-label="Close"
                    ></button>
                </div>
            )}

            {/* Delete Confirmation Modal */}
            {deleteConfirm.show && (
                <div className="modal show d-block" tabIndex="-1" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
                    <div className="modal-dialog">
                        <div className="modal-content">
                            <div className="modal-header">
                                <h5 className="modal-title">Confirm Delete</h5>
                                <button 
                                    type="button" 
                                    className="btn-close" 
                                    onClick={() => setDeleteConfirm({ show: false, articleId: null, articleTitle: '' })}
                                ></button>
                            </div>
                            <div className="modal-body">
                                <p>Are you sure you want to delete the article <strong>"{deleteConfirm.articleTitle}"</strong>?</p>
                                <p className="text-muted">This action cannot be undone.</p>
                            </div>
                            <div className="modal-footer">
                                <button 
                                    type="button" 
                                    className="btn btn-secondary" 
                                    onClick={() => setDeleteConfirm({ show: false, articleId: null, articleTitle: '' })}
                                >
                                    Cancel
                                </button>
                                <button 
                                    type="button" 
                                    className="btn btn-danger" 
                                    onClick={() => deleteArticle(deleteConfirm.articleId)}
                                >
                                    Delete Article
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Author Profile Header */}
            <div className="row">
                <div className="col-12">
                    <div className="bg-primary text-white p-4 rounded mb-4">
                        <div className="d-flex align-items-center">
                            <img 
                                src={user?.imageUrl} 
                                alt="Profile" 
                                className="rounded-circle me-3"
                                style={{ width: '80px', height: '80px', objectFit: 'cover' }}
                            />
                            <div>
                                <h2 className="mb-1">Welcome, {user?.fullName || user?.firstName}</h2>
                                <p className="mb-0">Author Dashboard</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Action Buttons */}
            <div className="row mb-4">
                <div className="col-12">
                    <div className="d-flex gap-3 flex-wrap">
                        <Link to="/post-article" className="btn btn-success btn-lg">
                            <i className="fas fa-plus me-2"></i>
                            Add New Article
                        </Link>
                        <button 
                            className="btn btn-info btn-lg"
                            onClick={fetchAuthorArticles}
                        >
                            <i className="fas fa-refresh me-2"></i>
                            Refresh Articles
                        </button>
                    </div>
                </div>
            </div>

            {/* Error Display */}
            {error && (
                <div className="alert alert-danger" role="alert">
                    {error}
                </div>
            )}

            {/* Articles Section */}
            <div className="row">
                <div className="col-12">
                    <h3 className="mb-3">Your Articles ({articles.length})</h3>
                    
                    {articles.length === 0 ? (
                        <div className="bg-light p-4 rounded text-center">
                            <h4>No Articles Yet</h4>
                            <p className="text-muted">Start your writing journey by creating your first article!</p>
                            <Link to="/post-article" className="btn btn-primary">
                                Create Your First Article
                            </Link>
                        </div>
                    ) : (
                        <div className="row">
                            {articles.map((article) => (
                                <div key={article._id} className="col-md-6 col-lg-4 mb-4">
                                    <div className="card h-100">
                                        <div className="card-body">
                                            <h5 className="card-title">{article.title}</h5>
                                            <p className="card-text text-muted">
                                                {article.content ? 
                                                    `${article.content.substring(0, 100)}...` : 
                                                    'No content available'
                                                }
                                            </p>
                                            <div className="d-flex align-items-center mb-2">
                                                <img 
                                                    src={article.authorData?.profileImageUrl || user?.imageUrl} 
                                                    alt="Author" 
                                                    className="rounded-circle me-2"
                                                    style={{ width: '24px', height: '24px', objectFit: 'cover' }}
                                                />
                                                <small className="text-muted">
                                                    By {article.authorData?.nameOfAuthor || 'Unknown Author'}
                                                </small>
                                            </div>
                                            <small className="text-muted">
                                                Created: {new Date(article.dateOfCreation).toLocaleDateString()}
                                                {article.dateOfModification && 
                                                 new Date(article.dateOfModification).getTime() !== new Date(article.dateOfCreation).getTime() && (
                                                    <span className="ms-2 text-info">
                                                        • Modified: {new Date(article.dateOfModification).toLocaleDateString()}
                                                    </span>
                                                )}
                                                {article.category && <span className="ms-2">• Category: {article.category}</span>}
                                            </small>
                                        </div>
                                        <div className="card-footer bg-transparent">
                                            <div className="d-flex gap-2">
                                                <Link 
                                                    to={`/article/${article._id}`}
                                                    className="btn btn-sm btn-outline-primary"
                                                >
                                                    View
                                                </Link>
                                                <Link 
                                                    to={`/edit-article/${article._id}`}
                                                    className="btn btn-sm btn-outline-warning"
                                                >
                                                    Edit
                                                </Link>
                                                <button 
                                                    className="btn btn-sm btn-outline-danger"
                                                    onClick={() => setDeleteConfirm({
                                                        show: true,
                                                        articleId: article._id,
                                                        articleTitle: article.title
                                                    })}
                                                >
                                                    Delete
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

export default AuthorProfile;
