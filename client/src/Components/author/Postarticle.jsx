import React, { useState } from 'react';
import { useUser } from '@clerk/clerk-react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

function PostArticle() {
    const { user } = useUser();
    const navigate = useNavigate();
    
    const [articleData, setArticleData] = useState({
        title: '',
        content: '',
        category: ''
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

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
            setLoading(true);
            setError('');
            
            const articlePayload = {
                authorData: {
                    nameOfAuthor: user?.fullName || user?.firstName || 'Anonymous',
                    email: user?.primaryEmailAddress?.emailAddress || user?.emailAddresses?.[0]?.emailAddress,
                    profileImageUrl: user?.imageUrl || ''
                },
                articleId: `article_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
                title: articleData.title,
                category: articleData.category || 'Other',
                content: articleData.content,
                dateOfCreation: new Date().toISOString(),
                dateOfModification: new Date().toISOString(),
                isArticleActive: true,
                comments: []
            };

            console.log('📤 Sending article payload to server:', articlePayload);
            console.log('📧 Author email:', articlePayload.authorData.email);
            
            const response = await axios.post('http://localhost:4000/authorApi/article', articlePayload);
            
            if (response.status === 201) {
                setSuccess('Article created successfully! Redirecting...');
                setTimeout(() => {
                    navigate('/author-profile');
                }, 1500);
            }
        } catch (err) {
            console.error('Error creating article:', err);
            setError(err.response?.data?.message || 'Failed to create article. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="container mt-4">
            <div className="row justify-content-center">
                <div className="col-lg-8">
                    {/* Header */}
                    <div className="bg-success text-white p-4 rounded mb-4">
                        <h2 className="mb-0">Create New Article</h2>
                        <p className="mb-0">Share your thoughts with the world</p>
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



                        
                                <div className="mb-4">
                                    <label htmlFor="content" className="form-label">Article Content *</label>
                                    <textarea
                                        className="form-control"
                                        id="content"
                                        name="content"
                                        value={articleData.content}
                                        onChange={handleInputChange}
                                        rows="10"
                                        placeholder="Write your article content here..."
                                        required
                                    ></textarea>
                                </div>

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
                                        className="btn btn-success"
                                        disabled={loading}
                                    >
                                        {loading ? (
                                            <>
                                                <span className="spinner-border spinner-border-sm me-2" role="status"></span>
                                                Publishing...
                                            </>
                                        ) : (
                                            <>
                                                <i className="fas fa-paper-plane me-2"></i>
                                                Publish Article
                                            </>
                                        )}
                                    </button>
                                    
                                    <button 
                                        type="button" 
                                        className="btn btn-secondary"
                                        onClick={() => navigate('/author-profile')}
                                        disabled={loading}
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

export default PostArticle;
