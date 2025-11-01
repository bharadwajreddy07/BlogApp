import React, { useState, useEffect } from 'react';
import { useUser } from '@clerk/clerk-react';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';

function EditArticle() {
    const { user } = useUser();
    const navigate = useNavigate();
    const { articleId } = useParams();
    
    const [articleData, setArticleData] = useState({
        title: '',
        content: '',
        category: ''
    });
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    // Fetch article data on component mount
    useEffect(() => {
        fetchArticle();
    }, [articleId]);

    const fetchArticle = async () => {
        try {
            setLoading(true);
            const response = await axios.get('https://blogapp-1iqk.onrender.com/authorApi/articles');
            
            // Find the specific article to edit
            const article = response.data.payload.find(art => art._id === articleId);
            
            if (!article) {
                setError('Article not found');
                return;
            }

            // Check if current user is the author
            const currentUserEmail = user?.primaryEmailAddress?.emailAddress || user?.emailAddresses?.[0]?.emailAddress;
            if (article.authorData?.email !== currentUserEmail) {
                setError('You are not authorized to edit this article');
                return;
            }

            // Set article data for editing
            setArticleData({
                title: article.title,
                content: article.content,
                category: article.category || ''
            });
            
        } catch (err) {
            console.error('Error fetching article:', err);
            setError('Failed to load article for editing');
        } finally {
            setLoading(false);
        }
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setArticleData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        if (!articleData.title.trim() || !articleData.content.trim()) {
            setError('Title and content are required!');
            return;
        }

        try {
            setSaving(true);
            setError('');
            
            const updatePayload = {
                title: articleData.title,
                category: articleData.category || 'Other',
                content: articleData.content,
                dateOfModification: new Date().toISOString()
            };

            console.log('📤 Updating article:', updatePayload);
            
            const response = await axios.put(`https://blogapp-1iqk.onrender.com/authorApi/article/${articleId}`, updatePayload);
            
            if (response.status === 200) {
                setSuccess('Article updated successfully! Redirecting...');
                setTimeout(() => {
                    navigate('/author-profile');
                }, 1500);
            }
        } catch (err) {
            console.error('Error updating article:', err);
            setError(err.response?.data?.message || 'Failed to update article. Please try again.');
        } finally {
            setSaving(false);
        }
    };

    if (loading) {
        return (
            <div className="container mt-5">
                <div className="text-center">
                    <div className="spinner-border text-primary" role="status">
                        <span className="visually-hidden">Loading article...</span>
                    </div>
                    <p className="mt-2">Loading article for editing...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="container mt-4">
            <div className="row justify-content-center">
                <div className="col-lg-8">
                    {/* Header */}
                    <div className="bg-warning text-dark p-4 rounded mb-4">
                        <h2 className="mb-0">Edit Article</h2>
                        <p className="mb-0">Update your article content</p>
                    </div>

                    {/* Form */}
                    <div className="card">
                        <div className="card-body">
                            {error && (
                                <div className="alert alert-danger" role="alert">
                                    {error}
                                </div>
                            )}

                            {success && (
                                <div className="alert alert-success" role="alert">
                                    <i className="fas fa-check-circle me-2"></i>
                                    {success}
                                </div>
                            )}

                            <form onSubmit={handleSubmit}>
                                {/* Title */}
                                <div className="mb-3">
                                    <label htmlFor="title" className="form-label">Article Title *</label>
                                    <input
                                        type="text"
                                        className="form-control"
                                        id="title"
                                        name="title"
                                        value={articleData.title}
                                        onChange={handleInputChange}
                                        placeholder="Enter an engaging title for your article"
                                        required
                                    />
                                </div>

                                {/* Category */}
                                <div className="mb-3">
                                    <label htmlFor="category" className="form-label">Category</label>
                                    <select
                                        className="form-select"
                                        id="category"
                                        name="category"
                                        value={articleData.category}
                                        onChange={handleInputChange}
                                    >
                                        <option value="">Select a category</option>
                                        <option value="Technology">Technology</option>
                                        <option value="Health">Health</option>
                                        <option value="Travel">Travel</option>
                                        <option value="Food">Food</option>
                                        <option value="Business">Business</option>
                                        <option value="Education">Education</option>
                                        <option value="Entertainment">Entertainment</option>
                                        <option value="Sports">Sports</option>
                                        <option value="Other">Other</option>
                                    </select>
                                </div>

                                {/* Content */}
                                <div className="mb-4">
                                    <label htmlFor="content" className="form-label">Article Content *</label>
                                    <textarea
                                        className="form-control"
                                        id="content"
                                        name="content"
                                        value={articleData.content}
                                        onChange={handleInputChange}
                                        rows="12"
                                        placeholder="Edit your article content here..."
                                        required
                                    ></textarea>
                                </div>

                                {/* Author Info Display */}
                                <div className="mb-4">
                                    <div className="bg-light p-3 rounded">
                                        <small className="text-muted">
                                            <strong>Author:</strong> {user?.fullName || user?.firstName || 'Anonymous'}
                                        </small>
                                    </div>
                                </div>

                                {/* Submit Buttons */}
                                <div className="d-flex gap-2">
                                    <button 
                                        type="submit" 
                                        className="btn btn-warning"
                                        disabled={saving}
                                    >
                                        {saving ? (
                                            <>
                                                <span className="spinner-border spinner-border-sm me-2" role="status"></span>
                                                Updating...
                                            </>
                                        ) : (
                                            <>
                                                <i className="fas fa-edit me-2"></i>
                                                Update Article
                                            </>
                                        )}
                                    </button>
                                    
                                    <button 
                                        type="button" 
                                        className="btn btn-secondary"
                                        onClick={() => navigate('/author-profile')}
                                        disabled={saving}
                                    >
                                        Cancel
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default EditArticle;