import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import Logo from "../../assets/logo.png";
import axios from "axios";

const GroupsPage = () => {
  const userData_LocalStorage = JSON.parse(localStorage.getItem("userDetails"));
  const currentUserId = userData_LocalStorage[0].id;
  const [groups, setGroups] = useState([]);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newGroupTitle, setNewGroupTitle] = useState("");
  const [connections, setConnections] = useState([]);
  const [selectedConnections, setSelectedConnections] = useState([]);
  const [selectedGroup, setSelectedGroup] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [groupsLoading, setGroupsLoading] = useState(true);

  // Fetch user's connections and groups on component mount
  useEffect(() => {
    const fetchConnections = async () => {
      try {
        setLoading(true);
        const response = await axios.get(`http://localhost:8080/api/connections/${currentUserId}`);
        setConnections(response.data);
      } catch (error) {
        console.error('Error fetching connections:', error);
        // Fallback to mock connections if API call fails
        const mockConnections = [
          { id: 1, username: "john_doe", userData: JSON.stringify({ firstName: "John", lastName: "Doe", profilePicture: null }) },
          { id: 2, username: "jane_smith", userData: JSON.stringify({ firstName: "Jane", lastName: "Smith", profilePicture: null }) },
        ];
        setConnections(mockConnections);
      } finally {
        setLoading(false);
      }
    };
    
    const fetchGroups = async () => {
      try {
        setGroupsLoading(true);
        const response = await axios.get(`http://localhost:8080/api/groups/user/${currentUserId}`);
        setGroups(response.data);
      } catch (error) {
        console.error('Error fetching groups:', error);
        setGroups([]);
      } finally {
        setGroupsLoading(false);
      }
    };
    
    fetchConnections();
    fetchGroups();
  }, [currentUserId]);

  const handleCreateGroup = async () => {
    if (newGroupTitle.trim() === "") return;
    
    try {
      if (isEditing && selectedGroup) {
        // Update existing group
        const groupData = {
          id: selectedGroup.id,
          title: newGroupTitle,
          members: selectedConnections.map(conn => conn.id),
          createdBy: currentUserId
        };
        
        await axios.put(`http://localhost:8080/api/groups/${selectedGroup.id}`, groupData);
        
        // Refresh groups list
        const response = await axios.get(`http://localhost:8080/api/groups/user/${currentUserId}`);
        setGroups(response.data);
      } else {
        // Create new group
        const groupData = {
          title: newGroupTitle,
          members: selectedConnections.map(conn => conn.id),
          createdBy: currentUserId
        };
        
        await axios.post(`http://localhost:8080/api/groups`, groupData);
        
        // Refresh groups list
        const response = await axios.get(`http://localhost:8080/api/groups/user/${currentUserId}`);
        setGroups(response.data);
      }
      
      // Reset form
      setNewGroupTitle("");
      setSelectedConnections([]);
      setShowCreateModal(false);
      setIsEditing(false);
      setSelectedGroup(null);
    } catch (error) {
      console.error('Error saving group:', error);
      alert('There was an error saving the group. Please try again.');
    }
  };

  const handleEditGroup = async (group) => {
    try {
      setIsEditing(true);
      setSelectedGroup(group);
      setNewGroupTitle(group.title);
      
      // Fetch group members details
      const response = await axios.get(`http://localhost:8080/api/groups/${group.id}/members`);
      setSelectedConnections(response.data);
      
      setShowCreateModal(true);
    } catch (error) {
      console.error('Error fetching group details:', error);
      alert('Error loading group details. Please try again.');
    }
  };

  const handleDeleteGroup = async (groupId) => {
    if (window.confirm("Are you sure you want to delete this group?")) {
      try {
        await axios.delete(`http://localhost:8080/api/groups/${groupId}`);
        
        // Refresh groups list
        const response = await axios.get(`http://localhost:8080/api/groups/user/${currentUserId}`);
        setGroups(response.data);
      } catch (error) {
        console.error('Error deleting group:', error);
        alert('There was an error deleting the group. Please try again.');
      }
    }
  };

  const toggleConnectionSelection = (connection) => {
    const connectionData = {
      id: connection.id,
      name: `${JSON.parse(connection.userData || '{}').firstName || ""} ${JSON.parse(connection.userData || '{}').lastName || ""}`.trim() || connection.username,
      profilePic: JSON.parse(connection.userData || '{}').profilePicture || null,
      username: connection.username
    };
    
    if (selectedConnections.some(conn => conn.id === connection.id)) {
      setSelectedConnections(selectedConnections.filter(conn => conn.id !== connection.id));
    } else {
      setSelectedConnections([...selectedConnections, connectionData]);
    }
  };

  // Function to get user's first name initial for avatar
  const getInitial = (connection) => {
    const userData = JSON.parse(connection.userData || '{}');
    if (userData.firstName) {
      return userData.firstName.charAt(0);
    }
    return connection.username.charAt(0).toUpperCase();
  };

  // Function to get user's full name or username
  const getDisplayName = (connection) => {
    const userData = JSON.parse(connection.userData || '{}');
    if (userData.firstName && userData.lastName) {
      return `${userData.firstName} ${userData.lastName}`;
    }
    return connection.username;
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-100">
      {/* Header - similar to HomePage */}
      <header className="bg-white shadow-sm sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-2">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center">
              <Link to="/home">
                <img src={Logo} alt="Pronexus Logo" className="h-10 w-auto" />
              </Link>
              <h1 className="ml-4 text-xl font-semibold text-blue-700 hidden md:block">Pronexus</h1>
              
              {/* Navigation Links */}
              <div className="ml-10 hidden md:block">
                <div className="flex items-baseline space-x-4">
                  <Link to="/home" className="text-gray-600 hover:text-blue-600 px-3 py-2 text-sm font-medium">Home</Link>
                  <Link to="/network" className="text-gray-600 hover:text-blue-600 px-3 py-2 text-sm font-medium">My Network</Link>
                  <Link to="/groups" className="border-b-2 border-blue-600 text-gray-900 px-3 py-2 text-sm font-medium">Groups</Link>
                  <Link to="/messaging" className="text-gray-600 hover:text-blue-600 px-3 py-2 text-sm font-medium">Messaging</Link>
                  <Link to="/notifications" className="text-gray-600 hover:text-blue-600 px-3 py-2 text-sm font-medium">Notifications</Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-grow py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-gray-900">My Groups</h2>
            <button
              onClick={() => {
                setIsEditing(false);
                setSelectedGroup(null);
                setNewGroupTitle("");
                setSelectedConnections([]);
                setShowCreateModal(true);
              }}
              className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              Create New Group
            </button>
          </div>

          {/* Groups List */}
          <div className="bg-white shadow overflow-hidden sm:rounded-md">
            {groupsLoading ? (
              <div className="p-6 text-center text-gray-500">
                Loading your groups...
              </div>
            ) : groups.length === 0 ? (
              <div className="p-6 text-center text-gray-500">
                You haven't created any groups yet. Click "Create New Group" to get started.
              </div>
            ) : (
              <ul className="divide-y divide-gray-200">
                {groups.map((group) => (
                  <li key={group.id} className="px-6 py-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="text-lg font-medium text-gray-900">{group.title}</h3>
                        <p className="text-sm text-gray-500">
                          {group.memberCount || 0} {(group.memberCount || 0) === 1 ? 'member' : 'members'}
                        </p>
                      </div>
                      <div className="flex space-x-3">
                        <button
                          onClick={() => handleEditGroup(group)}
                          className="inline-flex items-center px-3 py-1.5 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleDeleteGroup(group.id)}
                          className="inline-flex items-center px-3 py-1.5 border border-gray-300 rounded-md text-sm font-medium text-red-700 bg-white hover:bg-red-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                    
                    {/* Member avatars - only show if we have members data */}
                    {group.members && group.members.length > 0 && (
                      <div className="mt-3 flex -space-x-2 overflow-hidden">
                        {group.members.slice(0, 5).map((member) => (
                          <div key={member.id} className="inline-block h-8 w-8 rounded-full ring-2 ring-white bg-blue-600 flex items-center justify-center text-white font-bold">
                            {member.name ? member.name.charAt(0) : member.username?.charAt(0)}
                          </div>
                        ))}
                        {group.members.length > 5 && (
                          <div className="inline-flex items-center justify-center h-8 w-8 rounded-full bg-gray-200 text-gray-600 text-xs font-medium">
                            +{group.members.length - 5}
                          </div>
                        )}
                      </div>
                    )}
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      </main>

      {/* Create/Edit Group Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 overflow-y-auto z-20" aria-labelledby="modal-title" role="dialog" aria-modal="true">
          <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
            <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" aria-hidden="true" onClick={() => setShowCreateModal(false)}></div>

            <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>

            <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
              <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                <h3 className="text-lg leading-6 font-medium text-gray-900" id="modal-title">
                  {isEditing ? "Edit Group" : "Create New Group"}
                </h3>
                <div className="mt-4">
                  <label htmlFor="group-title" className="block text-sm font-medium text-gray-700">Group Title</label>
                  <input
                    type="text"
                    id="group-title"
                    value={newGroupTitle}
                    onChange={(e) => setNewGroupTitle(e.target.value)}
                    className="mt-1 focus:ring-blue-500 focus:border-blue-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                    placeholder="Enter a title for your group"
                  />
                </div>
                
                <div className="mt-6">
                  <h4 className="text-sm font-medium text-gray-700 mb-2">Select Connections</h4>
                  <div className="max-h-60 overflow-y-auto border border-gray-300 rounded-md p-2">
                    {loading ? (
                      <div className="p-4 text-center text-gray-500">
                        Loading your connections...
                      </div>
                    ) : connections.length === 0 ? (
                      <div className="p-4 text-center text-gray-500">
                        You don't have any connections yet. Add connections from the Network page.
                      </div>
                    ) : (
                      connections.map((connection) => (
                        <div key={connection.id} className="flex items-center p-2 hover:bg-gray-50">
                          <input
                            type="checkbox"
                            id={`connection-${connection.id}`}
                            checked={selectedConnections.some(conn => conn.id === connection.id)}
                            onChange={() => toggleConnectionSelection(connection)}
                            className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                          />
                          <label htmlFor={`connection-${connection.id}`} className="ml-3 block text-sm font-medium text-gray-700 w-full">
                            <div className="flex items-center">
                              {(() => {
                                const userData = JSON.parse(connection.userData || '{}');
                                return (
                                  <>
                                    {userData.profilePicture ? (
                                      <img 
                                        src={userData.profilePicture} 
                                        alt={getDisplayName(connection)} 
                                        className="h-8 w-8 rounded-full object-cover mr-2" 
                                      />
                                    ) : (
                                      <div className="h-8 w-8 rounded-full bg-blue-600 flex items-center justify-center text-white font-bold mr-2">
                                        {getInitial(connection)}
                                      </div>
                                    )}
                                    <span>{getDisplayName(connection)}</span>
                                    <span className="ml-2 text-xs text-gray-500">@{connection.username}</span>
                                  </>
                                );
                              })()}
                            </div>
                          </label>
                        </div>
                      ))
                    )}
                  </div>
                  <div className="mt-1 text-sm text-gray-500">
                    {selectedConnections.length} connections selected
                  </div>
                </div>
              </div>
              <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                <button
                  type="button"
                  onClick={handleCreateGroup}
                  className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-blue-600 text-base font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:ml-3 sm:w-auto sm:text-sm"
                >
                  {isEditing ? "Save Changes" : "Create Group"}
                </button>
                <button
                  type="button"
                  onClick={() => setShowCreateModal(false)}
                  className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Footer */}
      <footer className="bg-white">
        <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row justify-between items-center">
          <div className="flex items-center mb-4 sm:mb-0">
            <img src={Logo} alt="Pronexus Logo" className="h-8 w-auto" />
            <span className="ml-2 text-sm text-gray-500">© 2024 Pronexus</span>
          </div>
          <div className="flex flex-wrap justify-center space-x-6">
            <a href="#" className="text-sm text-gray-500 hover:text-gray-900 mb-2 sm:mb-0">About</a>
            <a href="#" className="text-sm text-gray-500 hover:text-gray-900 mb-2 sm:mb-0">Accessibility</a>
            <a href="#" className="text-sm text-gray-500 hover:text-gray-900 mb-2 sm:mb-0">User Agreement</a>
            <a href="#" className="text-sm text-gray-500 hover:text-gray-900 mb-2 sm:mb-0">Privacy Policy</a>
            <a href="#" className="text-sm text-gray-500 hover:text-gray-900 mb-2 sm:mb-0">Cookie Policy</a>
            <a href="#" className="text-sm text-gray-500 hover:text-gray-900 mb-2 sm:mb-0">Copyright Policy</a>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default GroupsPage; 