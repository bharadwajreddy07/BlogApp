// Create new file: client/src/Components/common/Comments.jsx
import React, { useState } from 'react';
import { useUser } from '@clerk/clerk-react';
import axios from 'axios';

function Comments({ articleId, comments, onCommentAdded }) {
    const { user, isSignedIn } = useUser();
    const [newComment, setNewComment] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const handleSubmitComment = async (e) => {
        e.preventDefault();
        
        if (!newComment.trim()) {
            setError('Comment cannot be empty');
            return;
        }

        try {
            setLoading(true);
            setError('');

            const commentData = {
                nameofUser: user?.fullName || user?.firstName || 'Anonymous',
                comment: newComment
            };

            const response = await axios.post(
                `http://localhost:4000/userApi/comment/${articleId}`,
                commentData
            );

            if (response.status === 200) {
                setNewComment('');
                onCommentAdded(response.data.payload);
            }
        } catch (err) {
            console.error('Error posting comment:', err);
            setError('Failed to post comment. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    return (
        <div className="comments-section">
            <h4 className="comments-title">
                <i className="fas fa-comments me-2"></i>
                Comments ({comments?.length || 0})
            </h4>

            {isSignedIn ? (
                <form onSubmit={handleSubmitComment} className="comment-form">
                    <div className="user-comment-input">
                        <img 
                            src={user?.imageUrl} 
                            alt="Your profile"
                            className="comment-user-avatar"
                        />
                        <textarea
                            className="form-control comment-textarea"
                            placeholder="Share your thoughts..."
                            value={newComment}
                            onChange={(e) => setNewComment(e.target.value)}
                            rows="3"
                        />
                    </div>
                    {error && (
                        <div className="alert alert-danger mt-2">{error}</div>
                    )}
                    <button 
                        type="submit" 
                        className="btn btn-primary mt-2"
                        disabled={loading}
                    >
                        {loading ? (
                            <>
                                <span className="spinner-border spinner-border-sm me-2"></span>
                                Posting...
                            </>
                        ) : (
                            <>
                                <i className="fas fa-paper-plane me-2"></i>
                                Post Comment
                            </>
                        )}
                    </button>
                </form>
            ) : (
                <div className="alert alert-info">
                    <i className="fas fa-info-circle me-2"></i>
                    Please sign in to comment
                </div>
            )}

            <div className="comments-list mt-4">
                {comments && comments.length > 0 ? (
                    comments.map((comment, index) => (
                        <div key={index} className="comment-item">
                            <div className="comment-header">
                                <div className="comment-author">
                                    <i className="fas fa-user-circle comment-icon"></i>
                                    <span className="author-name">{comment.nameofUser}</span>
                                </div>
                            </div>
                            <div className="comment-body">
                                <p>{comment.comment}</p>
                            </div>
                        </div>
                    ))
                ) : (
                    <div className="no-comments">
                        <i className="fas fa-comment-slash display-4 text-muted mb-3"></i>
                        <p className="text-muted">No comments yet. Be the first to comment!</p>
                    </div>
                )}
            </div>
        </div>
    );
}

export default Comments;