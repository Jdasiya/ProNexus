import React, { useState, useEffect } from 'react';
import axios from 'axios';

const PendingConnections = ({ userId }) => {
    const [pendingRequests, setPendingRequests] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchPendingRequests();
    }, [userId]);

    const fetchPendingRequests = async () => {
        try {
            const response = await axios.get(`http://localhost:8080/api/connections/pending/${userId}`);
            setPendingRequests(response.data);
        } catch (error) {
            console.error('Error fetching pending requests:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleAccept = async (connectionId) => {
        try {
            await axios.put(`http://localhost:8080/api/connections/accept/${connectionId}`);
            fetchPendingRequests();
        } catch (error) {
            console.error('Error accepting connection:', error);
        }
    };

    const handleReject = async (connectionId) => {
        try {
            await axios.put(`http://localhost:8080/api/connections/reject/${connectionId}`);
            fetchPendingRequests();
        } catch (error) {
            console.error('Error rejecting connection:', error);
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

    if (pendingRequests.length === 0) {
        return (
            <div className="p-4 text-gray-500 text-center">
                No pending connection requests
            </div>
        );
    }

    return (
        <div className="p-4">
            <h2 className="text-xl font-semibold mb-4">Pending Connection Requests</h2>
            <div className="space-y-4">
                {pendingRequests.map((user) => {
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
                            <div className="flex space-x-2">
                                <button
                                    onClick={() => handleAccept(user.connectionId)}
                                    className="px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600 transition-colors"
                                >
                                    Accept
                                </button>
                                <button
                                    onClick={() => handleReject(user.connectionId)}
                                    className="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 transition-colors"
                                >
                                    Reject
                                </button>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

export default PendingConnections; 