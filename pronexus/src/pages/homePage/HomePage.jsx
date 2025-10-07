import React, { useState, useEffect, useRef } from "react";
import { useNavigate, Link } from "react-router-dom";
import Logo from "../../assets/logo.png";
import Feed from "../../components/Feed";

const HomePage = () => {
  const userData_LocalStorage = JSON.parse(localStorage.getItem("userDetails"));
  const [userData, setUserData] = useState(
    JSON.parse(userData_LocalStorage[0].userData || '{"firstName":"","lastName":"","phoneNumber":"","address":"","email":""}')
  );

  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const drawerRef = useRef(null);
  const navigate = useNavigate();

  const [firstName, setFirstName] = useState(userData.firstName || "");
  const [lastName, setLastName] = useState(userData.lastName || "");
  const [profilePicture, setProfilePicture] = useState(userData.profilePicture || null);
  
  // Close drawer when clicking outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (drawerRef.current && !drawerRef.current.contains(event.target)) {
        setIsDrawerOpen(false);
      }
    }
    
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("userDetails");
    localStorage.removeItem("username");
    navigate("/");
  };

  const navigateToProfile = () => {
    navigate("/profile");
    setIsDrawerOpen(false);
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-100">
      {/* LinkedIn-style Header */}
      <header className="bg-white shadow-sm sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-2">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center">
              <img src={Logo} alt="Pronexus Logo" className="h-10 w-auto" />
              <h1 className="ml-4 text-xl font-semibold text-blue-700 hidden md:block">Pronexus</h1>
              
              {/* Navigation Links */}
              <div className="ml-10 hidden md:block">
                <div className="flex items-baseline space-x-4">
                  <Link to="/home" className="border-b-2 border-blue-600 text-gray-900 px-3 py-2 text-sm font-medium">Home</Link>
                  <Link to="/network" className="text-gray-600 hover:text-blue-600 px-3 py-2 text-sm font-medium">My Network</Link>
                  <Link to="/groups" className="text-gray-600 hover:text-blue-600 px-3 py-2 text-sm font-medium">Groups</Link>
                  <Link to="/messaging" className="text-gray-600 hover:text-blue-600 px-3 py-2 text-sm font-medium">Messaging</Link>
                  <Link to="/grow-together" className="text-gray-600 hover:text-blue-600 px-3 py-2 text-sm font-medium">Grow Together</Link>
                </div>
              </div>
            </div>
            
            {/* Profile Section */}
            <div className="flex items-center">
              <div className="ml-3 relative">
                <div>
                  <button
                    onClick={() => setIsDrawerOpen(!isDrawerOpen)}
                    type="button"
                    className="flex items-center text-sm rounded-full focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                    id="user-menu-button"
                    aria-expanded="false"
                    aria-haspopup="true"
                  >
                    <span className="sr-only">Open user menu</span>
                    <div className="flex flex-col items-center">
                      {profilePicture ? (
                        <img 
                          src={profilePicture} 
                          alt={`${firstName} ${lastName}`} 
                          className="h-8 w-8 rounded-full object-cover" 
                        />
                      ) : (
                        <div className="h-8 w-8 rounded-full bg-blue-600 flex items-center justify-center text-white font-bold">
                          {firstName ? firstName.charAt(0) : userData_LocalStorage[0].username.charAt(0)}
                        </div>
                      )}
                      <span className="text-xs text-gray-600 mt-1">Me ▼</span>
                    </div>
                  </button>
                </div>
                
                {/* Drawer/Menu */}
                {isDrawerOpen && (
                  <div 
                    ref={drawerRef}
                    className="origin-top-right absolute right-0 mt-2 w-64 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 focus:outline-none"
                    role="menu"
                    aria-orientation="vertical"
                    aria-labelledby="user-menu-button"
                    tabIndex="-1"
                  >
                    <div className="py-1 border-b">
                      <div className="px-4 py-3">
                        <div className="flex items-center">
                          {profilePicture ? (
                            <img 
                              src={profilePicture} 
                              alt={`${firstName} ${lastName}`} 
                              className="h-12 w-12 rounded-full object-cover" 
                            />
                          ) : (
                            <div className="h-12 w-12 rounded-full bg-blue-600 flex items-center justify-center text-white font-bold text-lg">
                              {firstName ? firstName.charAt(0) : userData_LocalStorage[0].username.charAt(0)}
                            </div>
                          )}
                          <div className="ml-3">
                            <p className="text-base font-medium text-gray-800">{firstName} {lastName}</p>
                            <p className="text-sm font-medium text-gray-500">{userData.headline || "Professional at Pronexus"}</p>
                          </div>
                        </div>
                        <button 
                          onClick={navigateToProfile}
                          className="mt-3 w-full flex justify-center py-1.5 px-4 border border-blue-600 rounded-full text-sm font-medium text-blue-600 hover:bg-blue-50"
                        >
                          View Profile
                        </button>
                      </div>
                    </div>
                    <div className="py-1 border-b">
                      <p className="px-4 py-2 text-sm font-semibold text-gray-700">Account</p>
                      <Link to="/settings" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">Settings & Privacy</Link>
                      <Link to="/help" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">Help</Link>
                      <Link to="/language" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">Language</Link>
                    </div>
                    <div className="py-1">
                      <p className="px-4 py-2 text-sm font-semibold text-gray-700">Manage</p>
                      <Link to="/posts" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">Posts & Activity</Link>
                      <Link to="/job-posting" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">Job Posting Account</Link>
                      <button 
                        onClick={handleLogout}
                        className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100" 
                      >
                        Sign Out
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content Area with Feed */}
      <main className="flex-grow py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <Feed currentUserId={userData_LocalStorage[0].id} />
        </div>
      </main>

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

export default HomePage; 