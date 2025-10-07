import React, { useState, useEffect } from 'react';
import axios from 'axios';
import PostContainer from './PostContainer';

const PostFeed = ({ userId }) => {
    const [posts, setPosts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [newPost, setNewPost] = useState('');
    const [mediaFile, setMediaFile] = useState(null);
    const [mediaPreview, setMediaPreview] = useState(null);

    useEffect(() => {
        fetchPosts();
    }, [userId]);

    const fetchPosts = async () => {
        try {
            const response = await axios.get('http://localhost:8080/api/posts');
            setPosts(response.data);
        } catch (error) {
            console.error('Error fetching posts:', error);
        } finally {
            setLoading(false);
        }
    };

    const handlePostSubmit = async (e) => {
        e.preventDefault();
        if (!newPost.trim() && !mediaFile) return;

        const formData = new FormData();
        formData.append('userId', userId);
        formData.append('content', newPost);
        if (mediaFile) {
            formData.append('media', mediaFile);
        }

        try {
            await axios.post('http://localhost:8080/api/posts', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });
            setNewPost('');
            setMediaFile(null);
            setMediaPreview(null);
            fetchPosts();
        } catch (error) {
            console.error('Error creating post:', error);
        }
    };

    const handleMediaChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setMediaFile(file);
            const reader = new FileReader();
            reader.onloadend = () => {
                setMediaPreview(reader.result);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleLike = async (postId) => {
        try {
            await axios.post(`http://localhost:8080/api/posts/likes/${postId}/toggle?userId=${userId}`);
            fetchPosts();
        } catch (error) {
            console.error('Error toggling like:', error);
        }
    };

    const handleComment = async (postId, content) => {
        try {
            await axios.post(`http://localhost:8080/api/posts/${postId}/comments`, {
                userId,
                content,
            });
            fetchPosts();
        } catch (error) {
            console.error('Error adding comment:', error);
        }
    };

    if (loading) {
        return (
            <div className="max-w-2xl mx-auto p-4">
                <div className="animate-pulse space-y-4">
                    <div className="h-32 bg-gray-200 rounded-lg"></div>
                    <div className="h-64 bg-gray-200 rounded-lg"></div>
                    <div className="h-64 bg-gray-200 rounded-lg"></div>
                </div>
            </div>
        );
    }

    return (
        <div className="max-w-2xl mx-auto p-4">
            {/* Create Post Card */}
            <div className="bg-white rounded-lg shadow-md p-4 mb-4">
                <form onSubmit={handlePostSubmit}>
                    <div className="flex items-start space-x-3">
                        <div className="flex-1">
                            <textarea
                                value={newPost}
                                onChange={(e) => setNewPost(e.target.value)}
                                placeholder="What do you want to talk about?"
                                className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                                rows="3"
                            />
                            {mediaPreview && (
                                <div className="mt-2 relative">
                                    <img
                                        src={mediaPreview}
                                        alt="Preview"
                                        className="max-h-48 rounded-lg"
                                    />
                                    <button
                                        type="button"
                                        onClick={() => {
                                            setMediaFile(null);
                                            setMediaPreview(null);
                                        }}
                                        className="absolute top-2 right-2 bg-gray-800 bg-opacity-50 text-white rounded-full p-1 hover:bg-opacity-75"
                                    >
                                        <svg
                                            xmlns="http://www.w3.org/2000/svg"
                                            className="h-5 w-5"
                                            viewBox="0 0 20 20"
                                            fill="currentColor"
                                        >
                                            <path
                                                fillRule="evenodd"
                                                d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                                                clipRule="evenodd"
                                            />
                                        </svg>
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>
                    <div className="mt-3 flex items-center justify-between">
                        <div className="flex items-center space-x-4">
                            <label className="flex items-center space-x-2 text-gray-600 hover:text-gray-800 cursor-pointer">
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    className="h-6 w-6"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    stroke="currentColor"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                                    />
                                </svg>
                                <span>Photo</span>
                                <input
                                    type="file"
                                    accept="image/*"
                                    onChange={handleMediaChange}
                                    className="hidden"
                                />
                            </label>
                        </div>
                        <button
                            type="submit"
                            disabled={!newPost.trim() && !mediaFile}
                            className="px-4 py-2 bg-blue-600 text-white rounded-full hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            Post
                        </button>
                    </div>
                </form>
            </div>

            {/* Posts Feed */}
            <div className="space-y-4">
                {posts.map((post) => (
                    <PostContainer
                        key={post.id}
                        post={post}
                        currentUserId={userId}
                        onLike={handleLike}
                        onComment={handleComment}
                    />
                ))}
            </div>
        </div>
    );
};

export default PostFeed; 