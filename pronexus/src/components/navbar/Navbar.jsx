import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Logo from '../../assets/logo.png';

const Navbar = ({ isLoggedIn = false }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);
  const navigate = useNavigate();
  
  // Check if user data exists in localStorage
  const userDetails = localStorage.getItem('userDetails');
  const userData = userDetails ? JSON.parse(userDetails)[0] : null;
  const userDataObj = userData?.userData ? JSON.parse(userData.userData) : {};
  
  const firstName = userDataObj?.firstName || '';
  const lastName = userDataObj?.lastName || '';
  const username = userData?.username || '';
  
  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const toggleProfileMenu = () => {
    setIsProfileMenuOpen(!isProfileMenuOpen);
  };

  const handleLogout = () => {
    localStorage.removeItem('userDetails');
    localStorage.removeItem('username');
    navigate('/');
  };

  return (
    <nav className="bg-white shadow-sm sticky top-0 z-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo and desktop navigation */}
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <Link to={isLoggedIn ? '/profile' : '/'}>
                <img src={Logo} alt="Pronexus Logo" className="h-10 w-auto" />
              </Link>
            </div>
            <div className="ml-4 font-semibold text-blue-700 hidden md:block">Pronexus</div>
            
            {isLoggedIn && (
              <div className="hidden md:ml-10 md:flex items-center space-x-4">
                <Link to="/home" className="text-gray-600 hover:text-blue-600 px-3 py-2 rounded-md text-sm font-medium">
                  Home
                </Link>
                <Link to="/network" className="text-gray-600 hover:text-blue-600 px-3 py-2 rounded-md text-sm font-medium">
                  My Network
                </Link>
                <Link to="/jobss" className="text-gray-600 hover:text-blue-600 px-3 py-2 rounded-md text-sm font-medium">
                  Jobs
                </Link>
                <Link to="/messaging" className="text-gray-600 hover:text-blue-600 px-3 py-2 rounded-md text-sm font-medium">
                  Messaging
                </Link>
                <Link to="/notifications" className="text-gray-600 hover:text-blue-600 px-3 py-2 rounded-md text-sm font-medium">
                  Notifications
                </Link>
              </div>
            )}
          </div>

          {/* Right side buttons */}
          <div className="flex items-center">
            {isLoggedIn ? (
              <div className="ml-3 relative">
                <div>
                  <button
                    onClick={toggleProfileMenu}
                    className="flex text-sm rounded-full focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                  >
                    <span className="sr-only">Open user menu</span>
                    <div className="h-8 w-8 rounded-full bg-blue-600 flex items-center justify-center text-white font-bold">
                      {firstName ? firstName.charAt(0) : username.charAt(0)}
                    </div>
                  </button>
                </div>
                
                {/* Profile dropdown */}
                {isProfileMenuOpen && (
                  <div className="origin-top-right absolute right-0 mt-2 w-48 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5">
                    <div className="py-1">
                      <Link
                        to="/profile"
                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      >
                        Your Profile
                      </Link>
                      <Link
                        to="/settings"
                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      >
                        Settings
                      </Link>
                      <button
                        onClick={handleLogout}
                        className="w-full text-left block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      >
                        Sign out
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex items-center space-x-4">
                <Link
                  to="/signup"
                  className="text-blue-600 hover:text-blue-700 px-3 py-2 rounded-md text-sm font-medium"
                >
                  Join now
                </Link>
                <Link
                  to="/"
                  className="bg-white border border-blue-600 text-blue-600 hover:bg-blue-50 px-4 py-2 rounded-md text-sm font-medium"
                >
                  Sign in
                </Link>
              </div>
            )}
            
            {/* Mobile menu button */}
            <div className="-mr-2 flex md:hidden ml-4">
              <button
                onClick={toggleMenu}
                className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-white hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white"
              >
                <span className="sr-only">Open main menu</span>
                {/* Icon when menu is closed */}
                {!isMenuOpen ? (
                  <svg className="block h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
                  </svg>
                ) : (
                  /* Icon when menu is open */
                  <svg className="block h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {isMenuOpen && (
        <div className="md:hidden">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            {isLoggedIn ? (
              <>
                <Link to="/home" className="text-gray-600 hover:bg-gray-100 block px-3 py-2 rounded-md text-base font-medium">
                  Home
                </Link>
                <Link to="/network" className="text-gray-600 hover:bg-gray-100 block px-3 py-2 rounded-md text-base font-medium">
                  My Network
                </Link>
                <Link to="/jobs" className="text-gray-600 hover:bg-gray-100 block px-3 py-2 rounded-md text-base font-medium">
                  Jobs
                </Link>
                <Link to="/messaging" className="text-gray-600 hover:bg-gray-100 block px-3 py-2 rounded-md text-base font-medium">
                  Messaging
                </Link>
                <Link to="/notifications" className="text-gray-600 hover:bg-gray-100 block px-3 py-2 rounded-md text-base font-medium">
                  Notifications
                </Link>
                <button
                  onClick={handleLogout}
                  className="w-full text-left text-gray-600 hover:bg-gray-100 block px-3 py-2 rounded-md text-base font-medium"
                >
                  Sign out
                </button>
              </>
            ) : (
              <>
                <Link to="/signup" className="text-gray-600 hover:bg-gray-100 block px-3 py-2 rounded-md text-base font-medium">
                  Join now
                </Link>
                <Link to="/" className="text-gray-600 hover:bg-gray-100 block px-3 py-2 rounded-md text-base font-medium">
                  Sign in
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
