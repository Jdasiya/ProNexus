import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import Post from '../../components/Post';
import FollowButton from '../../components/FollowButton';
import ConnectionsList from '../../components/ConnectionsList';
import PendingConnections from '../../components/PendingConnections';

const UserProfileView = () => {
    const { userId } = useParams();
    const navigate = useNavigate();
    const [userData, setUserData] = useState(null);
    const [userPosts, setUserPosts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [currentUser, setCurrentUser] = useState(null);
    const [activeTab, setActiveTab] = useState('posts');

    useEffect(() => {
        const userDetails = localStorage.getItem('userDetails');
        if (!userDetails) {
            navigate('/');
            return;
        }
        const currentUserData = JSON.parse(userDetails)[0];
        setCurrentUser(currentUserData);
        
        if (userId) {
            fetchUserData();
        }
    }, [userId, navigate]);

    const fetchUserData = async () => {
        try {
            setLoading(true);
            const [userResponse, postsResponse] = await Promise.all([
                axios.get(`http://localhost:8080/users/${userId}`),
                axios.get(`http://localhost:8080/posts/user/${userId}`)
            ]);

            setUserData(userResponse.data);
            setUserPosts(postsResponse.data);
        } catch (error) {
            console.error('Error fetching user data:', error);
            setError('Failed to load user profile. Please try again later.');
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center min-h-screen">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="flex justify-center items-center min-h-screen">
                <div className="text-red-500 text-center">
                    <p className="text-xl font-semibold mb-2">Error</p>
                    <p>{error}</p>
                </div>
            </div>
        );
    }

    if (!userData) return null;

    const userDataObj = JSON.parse(userData.userData || '{}');

    return (
        <div className="max-w-4xl mx-auto py-8 px-4">
            {/* Profile Header */}
            <div className="bg-white rounded-lg shadow-md p-6 mb-6">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <div className="w-24 h-24 rounded-full overflow-hidden bg-blue-100 flex items-center justify-center text-blue-600 font-semibold">
                            {userDataObj.profilePicture ? (
                                <img
                                    src={userDataObj.profilePicture}
                                    alt={`${userDataObj.firstName} ${userDataObj.lastName}`}
                                    className="w-full h-full object-cover"
                                />
                            ) : (
                                <span className="text-4xl">
                                    {userDataObj.firstName?.charAt(0) || 'U'}
                                </span>
                            )}
                        </div>
                        <div>
                            <h1 className="text-2xl font-bold text-gray-900">
                                {userDataObj.firstName} {userDataObj.lastName}
                            </h1>
                            <p className="text-gray-600">@{userData.username}</p>
                            {userDataObj.headline && (
                                <p className="text-gray-700 mt-1">{userDataObj.headline}</p>
                            )}
                        </div>
                    </div>
                    {currentUser && currentUser.id !== parseInt(userId) && (
                        <FollowButton
                            currentUserId={currentUser.id}
                            targetUserId={parseInt(userId)}
                        />
                    )}
                </div>
                {userDataObj.about && (
                    <div className="mt-6">
                        <h2 className="text-lg font-semibold text-gray-900 mb-2">About</h2>
                        <p className="text-gray-700">{userDataObj.about}</p>
                    </div>
                )}
            </div>

            {/* Tabs */}
            <div className="bg-white rounded-lg shadow-md mb-6">
                <div className="flex border-b">
                    <button
                        className={`px-6 py-3 font-medium ${
                            activeTab === 'posts'
                                ? 'text-blue-600 border-b-2 border-blue-600'
                                : 'text-gray-500 hover:text-gray-700'
                        }`}
                        onClick={() => setActiveTab('posts')}
                    >
                        Posts
                    </button>
                    <button
                        className={`px-6 py-3 font-medium ${
                            activeTab === 'connections'
                                ? 'text-blue-600 border-b-2 border-blue-600'
                                : 'text-gray-500 hover:text-gray-700'
                        }`}
                        onClick={() => setActiveTab('connections')}
                    >
                        Connections
                    </button>
                    {currentUser && currentUser.id === parseInt(userId) && (
                        <button
                            className={`px-6 py-3 font-medium ${
                                activeTab === 'pending'
                                    ? 'text-blue-600 border-b-2 border-blue-600'
                                    : 'text-gray-500 hover:text-gray-700'
                            }`}
                            onClick={() => setActiveTab('pending')}
                        >
                            Pending Requests
                        </button>
                    )}
                </div>
            </div>

            {/* Content */}
            <div className="space-y-6">
                {activeTab === 'posts' && (
                    <>
                        <h2 className="text-xl font-semibold text-gray-900 mb-4">Posts</h2>
                        {userPosts.length === 0 ? (
                            <div className="text-center text-gray-500 py-8 bg-white rounded-lg shadow">
                                <p className="text-lg">No posts yet</p>
                            </div>
                        ) : (
                            userPosts.map(post => (
                                <Post
                                    key={post.id}
                                    post={post}
                                    currentUserId={currentUser?.id}
                                    onDelete={() => {}}
                                />
                            ))
                        )}
                    </>
                )}

                {activeTab === 'connections' && (
                    <ConnectionsList userId={parseInt(userId)} />
                )}

                {activeTab === 'pending' && currentUser && currentUser.id === parseInt(userId) && (
                    <PendingConnections userId={parseInt(userId)} />
                )}
            </div>
        </div>
    );
};

export default UserProfileView; 