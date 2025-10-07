import React from 'react';
import PendingConnections from './PendingConnections';
import ConnectionsList from './ConnectionsList';

const Network = ({ userId }) => {
    return (
        <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
            <div className="space-y-6">
                <PendingConnections userId={userId} />
                <ConnectionsList userId={userId} />
            </div>
        </div>
    );
};

export default Network; 