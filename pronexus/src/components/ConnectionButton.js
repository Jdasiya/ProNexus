import React, { useState, useEffect } from 'react';
import axios from 'axios';

const ConnectionButton = ({ currentUserId, targetUserId, onConnectionStatusChange }) => {
    const [connectionStatus, setConnectionStatus] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        checkConnectionStatus();
    }, [currentUserId, targetUserId]);

    const checkConnectionStatus = async () => {
        try {
            const response = await axios.get(`http://localhost:8080/api/connections/check/${currentUserId}/${targetUserId}`);
            setConnectionStatus(response.data);
        } catch (error) {
            console.error('Error checking connection status:', error);
            setConnectionStatus('NONE');
        } finally {
            setLoading(false);
        }
    };

    const sendConnectionRequest = async () => {
        try {
            await axios.post(`http://localhost:8080/api/connections/request/${currentUserId}/${targetUserId}`);
            setConnectionStatus('PENDING');
            if (onConnectionStatusChange) {
                onConnectionStatusChange('PENDING');
            }
        } catch (error) {
            console.error('Error sending connection request:', error);
        }
    };

    if (loading) {
        return (
            <button className="px-4 py-2 bg-gray-200 text-gray-600 rounded-md cursor-not-allowed">
                Loading...
            </button>
        );
    }

    if (connectionStatus === 'ACCEPTED') {
        return (
            <button className="px-4 py-2 bg-green-500 text-white rounded-md cursor-default">
                Connected
            </button>
        );
    }

    if (connectionStatus === 'PENDING') {
        return (
            <button className="px-4 py-2 bg-yellow-500 text-white rounded-md cursor-default">
                Pending
            </button>
        );
    }

    if (connectionStatus === 'REJECTED') {
        return (
            <button
                onClick={sendConnectionRequest}
                className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors"
            >
                Connect
            </button>
        );
    }

    return (
        <button
            onClick={sendConnectionRequest}
            className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors"
        >
            Connect
        </button>
    );
};

export default ConnectionButton; 