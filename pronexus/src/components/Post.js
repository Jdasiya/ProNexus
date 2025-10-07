import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { FaHeart, FaRegHeart, FaComment, FaUser, FaTrash, FaEllipsisH } from 'react-icons/fa';
import ConnectionButton from './ConnectionButton';

const Post = ({ post, currentUserId, onDelete }) => {
    const [likes, setLikes] = useState(0);
    const [isLiked, setIsLiked] = useState(false);
    const [comments, setComments] = useState([]);
    const [newComment, setNewComment] = useState('');
    const [showComments, setShowComments] = useState(false);
    const [userData, setUserData] = useState(null);
    const [showOptions, setShowOptions] = useState(false);

    useEffect(() => {
        fetchLikes();
        fetchComments();
        if (post.user) {
            try {
                const userData = JSON.parse(post.user.userData);
                setUserData(userData);
            } catch (error) {
                console.error('Error parsing user data:', error);
            }
        }
    }, [post.id]);

    const fetchLikes = async () => {
        try {
            const response = await axios.get(`http://localhost:8080/posts/likes/${post.id}/count`);
            setLikes(response.data);
            const userLikeResponse = await axios.get(`http://localhost:8080/posts/likes/${post.id}/user/${currentUserId}`);
            setIsLiked(userLikeResponse.data);
        } catch (error) {
            console.error('Error fetching likes:', error);
        }
    };

    const fetchComments = async () => {
        try {
            const response = await axios.get(`http://localhost:8080/posts/comments/${post.id}`);
            setComments(response.data);
        } catch (error) {
            console.error('Error fetching comments:', error);
        }
    };

    const handleLike = async () => {
        try {
            const response = await axios.post(`http://localhost:8080/posts/likes/${post.id}/toggle?userId=${currentUserId}`);
            setLikes(response.data.likeCount);
            setIsLiked(response.data.liked);
        } catch (error) {
            console.error('Error toggling like:', error);
        }
    };

    const handleComment = async (e) => {
        e.preventDefault();
        if (!newComment.trim()) return;

        try {
            await axios.post(`http://localhost:8080/posts/comments/${post.id}`, null, {
                params: {
                    userId: currentUserId,
                    content: newComment
                }
            });
            setNewComment('');
            fetchComments();
        } catch (error) {
            console.error('Error adding comment:', error);
        }
    };

    const handleDeleteComment = async (commentId) => {
        try {
            await axios.delete(`http://localhost:8080/posts/comments/${commentId}`);
            fetchComments();
        } catch (error) {
            console.error('Error deleting comment:', error);
        }
    };

    const getUserInitial = (firstName, lastName) => {
        if (firstName) return firstName.charAt(0).toUpperCase();
        if (lastName) return lastName.charAt(0).toUpperCase();
        return 'U';
    };

    const handleDeletePost = async () => {
        if (window.confirm('Are you sure you want to delete this post?')) {
            try {
                await axios.delete(`http://localhost:8080/posts/${post.id}`);
                if (onDelete) {
                    onDelete(post.id);
                }
            } catch (error) {
                console.error('Error deleting post:', error);
            }
        }
    };

    return (
        <div className="bg-white rounded-lg shadow-md p-4 mb-4">
            <div className="flex items-center justify-between mb-4">
                <div className="flex items-center">
                    <div className="w-12 h-12 rounded-full overflow-hidden bg-blue-100 flex items-center justify-center text-blue-600 font-semibold mr-3">
                        {userData?.profilePicture ? (
                            <img
                                src={userData.profilePicture}
                                alt={`${userData.firstName} ${userData.lastName}`}
                                className="w-full h-full object-cover"
                            />
                        ) : (
                            <span className="text-xl">
                                {getUserInitial(userData?.firstName, userData?.lastName)}
                            </span>
                        )}
                    </div>
                    <div>
                        <h3 className="font-semibold text-gray-900">
                            {userData ? `${userData.firstName} ${userData.lastName}` : 'Unknown User'}
                        </h3>
                        <p className="text-gray-500 text-sm">{new Date(post.createdAt).toLocaleString()}</p>
                    </div>
                </div>
                <div className="flex items-center space-x-2">
                    {post.user.id !== currentUserId && (
                        <ConnectionButton
                            currentUserId={currentUserId}
                            targetUserId={post.user.id}
                        />
                    )}
                    {post.user.id === currentUserId && (
                        <div className="relative">
                            <button
                                onClick={() => setShowOptions(!showOptions)}
                                className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                            >
                                <FaEllipsisH className="text-gray-500" />
                            </button>
                            {showOptions && (
                                <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg py-2 z-10">
                                    <button
                                        onClick={handleDeletePost}
                                        className="w-full px-4 py-2 text-left text-red-500 hover:bg-gray-100 flex items-center space-x-2"
                                    >
                                        <FaTrash />
                                        <span>Delete Post</span>
                                    </button>
                                </div>
                            )}
                        </div>
                    )}
                </div>
            </div>

            {post.content && <p className="mb-4 text-gray-800">{post.content}</p>}

            {post.mediaUrl && (
                <div className="mb-4">
                    {post.mediaType === 'IMAGE' ? (
                        <img
                            src={`http://localhost:8080/files/download/${post.mediaUrl}`}
                            alt="Post media"
                            className="max-w-full rounded-lg"
                        />
                    ) : (
                        <video
                            src={`http://localhost:8080/files/download/${post.mediaUrl}`}
                            controls
                            className="max-w-full rounded-lg"
                        />
                    )}
                </div>
            )}

            <div className="flex items-center space-x-4 mb-4">
                <button
                    onClick={handleLike}
                    className="flex items-center space-x-1 text-gray-500 hover:text-red-500 transition-colors"
                >
                    {isLiked ? <FaHeart className="text-red-500" /> : <FaRegHeart />}
                    <span>{likes}</span>
                </button>
                <button
                    onClick={() => setShowComments(!showComments)}
                    className="flex items-center space-x-1 text-gray-500 hover:text-blue-500 transition-colors"
                >
                    <FaComment />
                    <span>{comments.length}</span>
                </button>
            </div>

            {showComments && (
                <div className="mt-4">
                    <form onSubmit={handleComment} className="mb-4">
                        <input
                            type="text"
                            value={newComment}
                            onChange={(e) => setNewComment(e.target.value)}
                            placeholder="Write a comment..."
                            className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        />
                    </form>
                    <div className="space-y-2">
                        {comments.map((comment) => {
                            let commentUserData;
                            try {
                                commentUserData = JSON.parse(comment.user.userData);
                            } catch (error) {
                                console.error('Error parsing comment user data:', error);
                            }

                            return (
                                <div key={comment.id} className="flex items-start space-x-2">
                                    <div className="w-8 h-8 rounded-full overflow-hidden bg-blue-100 flex items-center justify-center text-blue-600 font-semibold">
                                        {commentUserData?.profilePicture ? (
                                            <img
                                                src={commentUserData.profilePicture}
                                                alt={`${commentUserData.firstName} ${commentUserData.lastName}`}
                                                className="w-full h-full object-cover"
                                            />
                                        ) : (
                                            <span className="text-sm">
                                                {getUserInitial(commentUserData?.firstName, commentUserData?.lastName)}
                                            </span>
                                        )}
                                    </div>
                                    <div className="flex-1 bg-gray-100 rounded-lg p-2">
                                        <div className="flex justify-between">
                                            <span className="font-semibold text-gray-900">
                                                {commentUserData ? `${commentUserData.firstName} ${commentUserData.lastName}` : 'Unknown User'}
                                            </span>
                                            {comment.user.id === currentUserId && (
                                                <button
                                                    onClick={() => handleDeleteComment(comment.id)}
                                                    className="text-red-500 hover:text-red-700 transition-colors"
                                                >
                                                    Delete
                                                </button>
                                            )}
                                        </div>
                                        <p className="text-gray-800">{comment.content}</p>
                                        <p className="text-xs text-gray-500">
                                            {new Date(comment.createdAt).toLocaleString()}
                                        </p>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>
            )}
        </div>
    );
};

export default Post; 