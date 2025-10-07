import React, { useState, useEffect } from 'react';
import axios from 'axios';

const ConnectionsList = ({ userId }) => {
    const [connections, setConnections] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchConnections();
    }, [userId]);

    const fetchConnections = async () => {
        try {
            const response = await axios.get(`http://localhost:8080/api/connections/${userId}`);
            setConnections(response.data);
        } catch (error) {
            console.error('Error fetching connections:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleRemoveConnection = async (connectionId, connectedUserId) => {
        try {
            await axios.delete(`http://localhost:8080/api/connections/remove/${userId}/${connectedUserId}`);
            fetchConnections(); // Refresh the list after removing
        } catch (error) {
            console.error('Error removing connection:', error);
        }
    };

    if (loading) {
        return (
            <div className="p-4">
                <div className="animate-pulse">
                    <div className="h-4 bg-gray-200 rounded w-3/4 mb-4"></div>
                    <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                </div>
            </div>
        );
    }

    if (connections.length === 0) {
        return (
            <div className="p-4 text-gray-500 text-center">
                No connections found
            </div>
        );
    }

    return (
        <div className="p-4">
            <h2 className="text-xl font-semibold mb-4">My Connections</h2>
            <div className="space-y-4">
                {connections.map((user) => {
                    const userData = JSON.parse(user.userData || '{}');
                    return (
                        <div key={user.id} className="flex items-center justify-between bg-white p-4 rounded-lg shadow">
                            <div className="flex items-center space-x-4">
                                <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center">
                                    {userData.profilePicture ? (
                                        <img
                                            src={userData.profilePicture}
                                            alt={`${userData.firstName} ${userData.lastName}`}
                                            className="w-full h-full rounded-full object-cover"
                                        />
                                    ) : (
                                        <span className="text-xl text-blue-600">
                                            {userData.firstName?.charAt(0) || 'U'}
                                        </span>
                                    )}
                                </div>
                                <div>
                                    <h3 className="font-medium">
                                        {userData.firstName} {userData.lastName}
                                    </h3>
                                    <p className="text-sm text-gray-500">@{user.username}</p>
                                </div>
                            </div>
                            <button
                                onClick={() => handleRemoveConnection(user.connectionId, user.id)}
                                className="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 transition-colors"
                            >
                                Remove Connection
                            </button>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

export default ConnectionsList; 