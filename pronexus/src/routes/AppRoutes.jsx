import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import LoginScreen from '../pages/userLogin/loginPage/loginPage';
import SignUpPage from '../pages/userLogin/signUpPage/signUpPage';
import UserDetailProfile from '../pages/profilePages/userDetailProfile';
import UserProfile from '../pages/profilePages/userProfile';
import HomePage from '../pages/homePage/HomePage';
import NetworkPage from '../pages/NetworkPage';
import GroupsPage from '../pages/groups/GroupsPage';
import GrowTogetherPage from '../pages/growTogether/GrowTogetherPage';
import PostDetailPage from '../pages/growTogether/PostDetailPage';

// Protected route component
const ProtectedRoute = ({ children }) => {
  const isAuthenticated = localStorage.getItem('userDetails') !== null;
  
  if (!isAuthenticated) {
    return <Navigate to="/" replace />;
  }
  
  return children;
};

const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<LoginScreen />} />
      <Route path="/signup" element={<SignUpPage />} />
      
      {/* Protected routes that require authentication */}
      <Route path="/home" element={
        <ProtectedRoute>
          <HomePage />
        </ProtectedRoute>
      } />
      
      <Route path="/profile" element={
        <ProtectedRoute>
          <UserDetailProfile />
        </ProtectedRoute>
      } />
      
      <Route path="/userProfile" element={
        <ProtectedRoute>
          <UserProfile />
        </ProtectedRoute>
      } />

      <Route path="/network" element={
        <ProtectedRoute>
          <NetworkPage />
        </ProtectedRoute>
      } />
      
      <Route path="/groups" element={
        <ProtectedRoute>
          <GroupsPage />
        </ProtectedRoute>
      } />
      
      <Route path="/grow-together" element={
        <ProtectedRoute>
          <GrowTogetherPage />
        </ProtectedRoute>
      } />
      
      <Route path="/grow-together/post/:postId" element={
        <ProtectedRoute>
          <PostDetailPage />
        </ProtectedRoute>
      } />
      
      {/* Redirect for old route */}
      <Route path="/UserDetailProfile" element={<Navigate to="/profile" replace />} />
    </Routes>
  );
};

export default AppRoutes;
