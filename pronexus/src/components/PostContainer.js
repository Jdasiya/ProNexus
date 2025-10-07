import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';

const PostContainer = ({ post, currentUserId, onLike, onComment }) => {
    const [showComments, setShowComments] = useState(false);
    const [commentText, setCommentText] = useState('');
    const userData = JSON.parse(post.user?.userData || '{}');

    const handleCommentSubmit = async (e) => {
        e.preventDefault();
        if (commentText.trim()) {
            await onComment(post.id, commentText);
            setCommentText('');
        }
    };

    return (
        <div className="bg-white rounded-lg shadow-md mb-4 overflow-hidden">
            {/* Post Header */}
            <div className="p-4 border-b">
                <div className="flex items-center space-x-3">
                    <Link to={`/profile/${post.user?.id}`} className="flex-shrink-0">
                        <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center overflow-hidden">
                            {userData.profilePicture ? (
                                <img
                                    src={userData.profilePicture}
                                    alt={`${userData.firstName} ${userData.lastName}`}
                                    className="w-full h-full object-cover"
                                />
                            ) : (
                                <span className="text-xl text-blue-600">
                                    {userData.firstName?.charAt(0) || 'U'}
                                </span>
                            )}
                        </div>
                    </Link>
                    <div className="flex-1 min-w-0">
                        <Link to={`/profile/${post.user?.id}`} className="block">
                            <h3 className="text-sm font-semibold text-gray-900 truncate">
                                {userData.firstName} {userData.lastName}
                            </h3>
                            <p className="text-xs text-gray-500 truncate">
                                {userData.headline || 'No headline'}
                            </p>
                        </Link>
                        <p className="text-xs text-gray-500 mt-1">
                            {new Date(post.createdAt).toLocaleDateString('en-US', {
                                year: 'numeric',
                                month: 'short',
                                day: 'numeric'
                            })}
                        </p>
                    </div>
                </div>
            </div>

            {/* Post Content */}
            <div className="p-4">
                <p className="text-gray-800 whitespace-pre-wrap">{post.content}</p>
                {post.media && (
                    <div className="mt-4 rounded-lg overflow-hidden">
                        <img
                            src={post.media}
                            alt="Post media"
                            className="w-full h-auto object-cover"
                        />
                    </div>
                )}
            </div>

            {/* Post Stats */}
            <div className="px-4 py-2 border-t border-b bg-gray-50">
                <div className="flex items-center justify-between text-sm text-gray-500">
                    <div className="flex items-center space-x-2">
                        <span>{post.likeCount || 0} likes</span>
                        <span>•</span>
                        <span>{post.commentCount || 0} comments</span>
                    </div>
                </div>
            </div>

            {/* Post Actions */}
            <div className="flex items-center justify-around p-2 border-b">
                <button
                    onClick={() => onLike(post.id)}
                    className={`flex items-center space-x-2 px-4 py-2 rounded-md hover:bg-gray-100 transition-colors ${
                        post.isLiked ? 'text-blue-600' : 'text-gray-600'
                    }`}
                >
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-5 w-5"
                        fill={post.isLiked ? 'currentColor' : 'none'}
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                        />
                    </svg>
                    <span>Like</span>
                </button>
                <button
                    onClick={() => setShowComments(!showComments)}
                    className="flex items-center space-x-2 px-4 py-2 rounded-md hover:bg-gray-100 transition-colors text-gray-600"
                >
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-5 w-5"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
                        />
                    </svg>
                    <span>Comment</span>
                </button>
                <button className="flex items-center space-x-2 px-4 py-2 rounded-md hover:bg-gray-100 transition-colors text-gray-600">
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-5 w-5"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z"
                        />
                    </svg>
                    <span>Share</span>
                </button>
            </div>

            {/* Comments Section */}
            {showComments && (
                <div className="p-4">
                    <form onSubmit={handleCommentSubmit} className="mb-4">
                        <div className="flex items-center space-x-2">
                            <div className="flex-1">
                                <input
                                    type="text"
                                    value={commentText}
                                    onChange={(e) => setCommentText(e.target.value)}
                                    placeholder="Write a comment..."
                                    className="w-full px-4 py-2 border rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500"
                                />
                            </div>
                            <button
                                type="submit"
                                className="px-4 py-2 bg-blue-600 text-white rounded-full hover:bg-blue-700 transition-colors"
                            >
                                Post
                            </button>
                        </div>
                    </form>
                    <div className="space-y-4">
                        {post.comments?.map((comment) => (
                            <div key={comment.id} className="flex space-x-3">
                                <div className="flex-shrink-0">
                                    <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center">
                                        <span className="text-sm text-blue-600">
                                            {comment.user?.firstName?.charAt(0) || 'U'}
                                        </span>
                                    </div>
                                </div>
                                <div className="flex-1 bg-gray-50 rounded-lg px-4 py-2">
                                    <div className="flex items-center space-x-2">
                                        <span className="font-semibold text-sm">
                                            {comment.user?.firstName} {comment.user?.lastName}
                                        </span>
                                        <span className="text-xs text-gray-500">
                                            {new Date(comment.createdAt).toLocaleDateString()}
                                        </span>
                                    </div>
                                    <p className="text-sm text-gray-800 mt-1">{comment.content}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
};

export default PostContainer; 