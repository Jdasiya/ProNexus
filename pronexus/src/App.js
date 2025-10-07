import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { GoogleOAuthProvider } from '@react-oauth/google';
import Navbar from './components/navbar/Navbar';
import AppRoutes from './routes/AppRoutes';
import Feed from './components/Feed';

const App = () => {
  // Already configured with correct Client ID
  const googleClientId = "5981875837-anelge901ndsmc0s12ns88gtthu30lc4.apps.googleusercontent.com"; 
  
  console.log("Initializing Google OAuth with client ID:", googleClientId);
  
  const [currentUser, setCurrentUser] = useState(null);
  
  useEffect(() => {
    const userDetails = localStorage.getItem('userDetails');
    if (userDetails) {
      setCurrentUser(JSON.parse(userDetails));
    }
  }, []);
  
  return (
    <GoogleOAuthProvider clientId={googleClientId}>
      <Router>
        <div className="min-h-screen flex flex-col">
          <AppRoutes />
          <Routes>
            <Route 
              path="/feed" 
              element={<Feed currentUserId={currentUser?.id} />} 
            />
          </Routes>
        </div>
      </Router>
    </GoogleOAuthProvider>
  );
};

export default App;