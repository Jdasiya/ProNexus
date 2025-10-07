import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import PendingConnections from '../components/PendingConnections';
import ConnectionsList from '../components/ConnectionsList';

const NetworkPage = () => {
    const [currentUser, setCurrentUser] = useState(null);
    const [activeTab, setActiveTab] = useState('pending');
    const navigate = useNavigate();

    useEffect(() => {
        const userDetails = localStorage.getItem('userDetails');
        if (!userDetails) {
            navigate('/');
            return;
        }
        const currentUserData = JSON.parse(userDetails)[0];
        setCurrentUser(currentUserData);
    }, [navigate]);

    if (!currentUser) {
        return null;
    }

    return (
        <div className="container mx-auto px-4 py-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-8">My Network</h1>

            {/* Tabs */}
            <div className="bg-white rounded-lg shadow-md mb-6">
                <div className="flex border-b">
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
                    <button
                        className={`px-6 py-3 font-medium ${
                            activeTab === 'connections'
                                ? 'text-blue-600 border-b-2 border-blue-600'
                                : 'text-gray-500 hover:text-gray-700'
                        }`}
                        onClick={() => setActiveTab('connections')}
                    >
                        My Connections
                    </button>
                </div>
            </div>

            {/* Content */}
            <div className="space-y-6">
                {activeTab === 'pending' && (
                    <PendingConnections userId={currentUser.id} />
                )}

                {activeTab === 'connections' && (
                    <ConnectionsList userId={currentUser.id} />
                )}
            </div>
        </div>
    );
};

export default NetworkPage; 