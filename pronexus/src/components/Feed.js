import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Post from './Post';
import CreatePost from './CreatePost';

const Feed = ({ currentUserId }) => {
    const [posts, setPosts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const fetchPosts = async () => {
        try {
            const response = await axios.get('http://localhost:8080/posts');
            setPosts(response.data);
            setError(null);
        } catch (error) {
            console.error('Error fetching posts:', error);
            setError('Failed to load posts. Please try again later.');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchPosts();
    }, []);

    const handlePostCreated = () => {
        fetchPosts();
    };

    const handleDeletePost = async (postId) => {
        try {
            await axios.delete(`http://localhost:8080/posts/${postId}`);
            setPosts(posts.filter(post => post.id !== postId));
        } catch (error) {
            console.error('Error deleting post:', error);
        }
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center h-64">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="text-center text-red-500 p-4">
                {error}
            </div>
        );
    }

    return (
        <div className="max-w-2xl mx-auto p-4">
            <CreatePost currentUserId={currentUserId} onPostCreated={handlePostCreated} />
            {posts.map(post => (
                <Post
                    key={post.id}
                    post={post}
                    currentUserId={currentUserId}
                    onDelete={() => handleDeletePost(post.id)}
                />
            ))}
        </div>
    );
};

export default Feed; 