import React, { useState, useEffect } from "react";
import Logo from "../../assets/logo.png"; // Adjust the path if needed
import { useNavigate } from "react-router-dom"; // For navigation
import { Link } from "react-router-dom";
import axios from "axios";
import CustomAlert from "../../components/CommonAlert/CommonAlert";
import { FaEdit, FaTrash, FaTimes } from 'react-icons/fa';

const UserDetailProfile = () => {
  // Parse the user data from localStorage
  const userData_LocalStorage = JSON.parse(localStorage.getItem("userDetails"));

  // If data is not available in localStorage, you can provide a fallback empty object
  const [userData, setUserData] = useState(
    JSON.parse(userData_LocalStorage[0].userData || '{"firstName":"","lastName":"","phoneNumber":"","address":"","email":""}')
  );

  const [showAlert, setShowAlert] = useState(false);
  const [alertDescription, setAlertDescription] = useState("");
  const [alertTopic, setAlertTopic] = useState("");
  const [buttonCount, setButtonCount] = useState(1);
  const [positiveButton, setPositiveButton] = useState(false);
  const [negartiveButton, setNegartiveButton] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const [id, setId] = useState(userData_LocalStorage[0].id);
  const [username, setUsername] = useState(userData_LocalStorage[0].username);
  const [Password, setPassword] = useState(userData_LocalStorage[0].password);
  const [firstName, setFirstName] = useState(userData.firstName || "");
  const [lastName, setLastName] = useState(userData.lastName || "");
  const [phoneNumber, setPhoneNumber] = useState(userData.phoneNumber || "");
  const [address, setAddress] = useState(userData.address || "");
  const [email, setEmail] = useState(userData.email || userData_LocalStorage[0].username || "");
  const [headline, setHeadline] = useState(userData.headline || "Professional at Pronexus");
  const [about, setAbout] = useState(userData.about || "");
  const [profilePicture, setProfilePicture] = useState(userData.profilePicture || null);
  const [coverPhoto, setCoverPhoto] = useState(userData.coverPhoto || null);
  const [profileImageFile, setProfileImageFile] = useState(null);
  const [coverImageFile, setCoverImageFile] = useState(null);
  const [uploadProgress, setUploadProgress] = useState(0);

  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [editingPost, setEditingPost] = useState(null);
  const [editContent, setEditContent] = useState('');

  const navigate = useNavigate();

  // File upload handlers
  const handleProfilePictureChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      setProfileImageFile(file);
      // Create a preview
      const reader = new FileReader();
      reader.onloadend = () => {
        setProfilePicture(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleCoverPhotoChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      setCoverImageFile(file);
      // Create a preview
      const reader = new FileReader();
      reader.onloadend = () => {
        setCoverPhoto(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const uploadFile = async (file, type) => {
    if (!file) return null;
    
    const formData = new FormData();
    formData.append('file', file);
    formData.append('type', type);
    
    try {
      const response = await axios.post(
        'http://localhost:8080/files/upload',
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data'
          },
          onUploadProgress: (progressEvent) => {
            const percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total);
            setUploadProgress(percentCompleted);
          }
        }
      );
      return response.data.fileDownloadUri;
    } catch (error) {
      console.error(`Error uploading ${type}:`, error);
      return null;
    }
  };

  // Update user data in the form fields
  const HandleSave = async () => {
    // Handle sign-up logic here
    console.log("Save button clicked");
    if (
      firstName === "" ||
      lastName === "" ||
      email === ""
    ) {
      console.log("Please fill in all required fields");

      setAlertTopic("Error");
      setAlertDescription("Please fill in all required fields (First Name, Last Name, Email)");
      setShowAlert(true);
      setButtonCount(1);
      setNegartiveButton(true);
      setPositiveButton(false);

      return;
    }

    setIsLoading(true);
    
    try {
      // Upload profile picture if changed
      let profilePictureUrl = userData.profilePicture;
      if (profileImageFile) {
        const uploadResult = await uploadFile(profileImageFile, 'profile');
        if (uploadResult) {
          profilePictureUrl = uploadResult;
        }
      }
      
      // Upload cover photo if changed
      let coverPhotoUrl = userData.coverPhoto;
      if (coverImageFile) {
        const uploadResult = await uploadFile(coverImageFile, 'cover');
        if (uploadResult) {
          coverPhotoUrl = uploadResult;
        }
      }

      const updatedUserData = {
        firstName: firstName.trim(),
        lastName: lastName.trim(),
        address: address,
        phoneNumber: phoneNumber,
        email: email,
        headline: headline,
        about: about,
        profilePicture: profilePictureUrl,
        coverPhoto: coverPhotoUrl,
        provider: userData.provider || "local"
      };

      const payload = {
        id: id,
        username: username,
        password: Password,
        userData: JSON.stringify(updatedUserData),
      };
      console.log("Saving profile:", payload);

      const response = await axios.put(
        `http://localhost:8080/users/${id}`,
        payload
      );
      console.log("Profile updated successfully:", response.status);
      setIsLoading(false);

      if (response.status === 200) {
        // Update localStorage with new data
        const updatedUserDetails = [{...userData_LocalStorage[0], userData: JSON.stringify(updatedUserData)}];
        localStorage.setItem("userDetails", JSON.stringify(updatedUserDetails));
        
        setAlertTopic("Success");
        setAlertDescription("Profile updated successfully");
        setButtonCount(1);
        setShowAlert(true);
        setPositiveButton(true);
        setNegartiveButton(false);
      } else {
        setAlertTopic("Error");
        setAlertDescription("Something went wrong, please try again");
        setButtonCount(1);
        setShowAlert(true);
        setPositiveButton(false);
        setNegartiveButton(true);
      }
    } catch (error) {
      console.error("Error updating profile:", error);
      setIsLoading(false);
      setAlertTopic("Error");
      setAlertDescription("Server error. Please try again later.");
      setButtonCount(1);
      setShowAlert(true);
      setNegartiveButton(true);
      setPositiveButton(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("userDetails");
    localStorage.removeItem("username");
    navigate("/");
  };

  useEffect(() => {
    fetchUserPosts();
  }, [id]);

  const fetchUserPosts = async () => {
    try {
      const response = await axios.get(`http://localhost:8080/posts/user/${id}`);
      setPosts(response.data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching user posts:', error);
      setError('Failed to load posts');
      setLoading(false);
    }
  };

  const handleDeletePost = async (postId) => {
    if (window.confirm('Are you sure you want to delete this post?')) {
      try {
        await axios.delete(`http://localhost:8080/posts/${postId}`);
        setPosts(posts.filter(post => post.id !== postId));
      } catch (error) {
        console.error('Error deleting post:', error);
      }
    }
  };

  const handleEditPost = async (postId) => {
    try {
      await axios.put(`http://localhost:8080/posts/${postId}`, {
        content: editContent
      });
      setPosts(posts.map(post => 
        post.id === postId ? { ...post, content: editContent } : post
      ));
      setEditingPost(null);
      setEditContent('');
    } catch (error) {
      console.error('Error updating post:', error);
    }
  };

  const startEditing = (post) => {
    setEditingPost(post.id);
    setEditContent(post.content);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center text-red-500 p-4">
        {error}
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100">
      {showAlert && (
        <CustomAlert
          alertvisible={showAlert}
          onPositiveAction={() => setShowAlert(false)}
          onNegativeAction={() => setShowAlert(false)}
          alertDescription={alertDescription}
          alertTitle={alertTopic}
          buttonCount={buttonCount}
          positiveButton={positiveButton}
          negartiveButton={negartiveButton}
        />
      )}
      
      {/* LinkedIn-style Header */}
      <header className="bg-white shadow-sm sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-2">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center">
              <img src={Logo} alt="Pronexus Logo" className="h-10 w-auto" />
              <h1 className="ml-4 text-xl font-semibold text-blue-700 hidden md:block">Pronexus</h1>
              <div className="ml-10 hidden md:block">
                <div className="flex items-baseline space-x-4">
                  {/* <a href="#" className="text-gray-600 hover:text-blue-600 px-3 py-2 rounded-md text-sm font-medium">Home</a>
                  <a href="#" className="text-gray-600 hover:text-blue-600 px-3 py-2 rounded-md text-sm font-medium">My Network</a>
                  <a href="#" className="text-gray-600 hover:text-blue-600 px-3 py-2 rounded-md text-sm font-medium">Jobs</a>
                  <a href="#" className="text-gray-600 hover:text-blue-600 px-3 py-2 rounded-md text-sm font-medium">Messaging</a>
                  <a href="#" className="text-gray-600 hover:text-blue-600 px-3 py-2 rounded-md text-sm font-medium">Notifications</a> */}
                </div>
              </div>
            </div>
            <div className="flex items-center">
              <div className="ml-3 relative">
                <div className="flex items-center">
                  <button
                    type="button"
                    className="bg-gray-800 flex text-sm rounded-full focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800 focus:ring-white"
                  >
                    <span className="sr-only">Open user menu</span>
                    <div className="h-8 w-8 rounded-full bg-blue-600 flex items-center justify-center text-white font-bold">
                      {firstName ? firstName.charAt(0) : username.charAt(0)}
                    </div>
                  </button>
                  <button
                    onClick={handleLogout}
                    className="ml-4 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
                  >
                    Log Out
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </header>

      <main className="py-10">
        <div className="max-w-3xl mx-auto sm:px-6 lg:max-w-7xl lg:px-8 lg:grid lg:grid-cols-12 lg:gap-8">
          <div className="lg:col-span-8 space-y-6">
            {/* Profile Card */}
            <div className="bg-white shadow rounded-lg overflow-hidden">
              {/* Cover Image */}
              <div className="relative">
                <div className="h-32 bg-cover bg-center bg-gradient-to-r from-blue-500 to-purple-600" 
                     style={coverPhoto ? { backgroundImage: `url(${coverPhoto})` } : {}}>
                  <label className="absolute bottom-2 right-2 bg-white p-1 rounded-full cursor-pointer hover:bg-gray-100" title="Change cover photo">
                    <input type="file" accept="image/*" onChange={handleCoverPhotoChange} className="hidden" />
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                  </label>
                </div>
              </div>
              
              {/* Profile Info */}
              <div className="px-4 py-5 sm:px-6 -mt-16 flex">
                <div className="relative">
                  {profilePicture ? (
                    <img 
                      src={profilePicture} 
                      alt={`${firstName} ${lastName}`} 
                      className="h-24 w-24 rounded-full border-4 border-white object-cover" 
                    />
                  ) : (
                    <div className="h-24 w-24 rounded-full border-4 border-white bg-blue-600 flex items-center justify-center text-white text-4xl font-bold">
                      {firstName ? firstName.charAt(0) : username.charAt(0)}
                    </div>
                  )}
                  <label className="absolute bottom-0 right-0 bg-white p-1 rounded-full cursor-pointer hover:bg-gray-100" title="Change profile picture">
                    <input type="file" accept="image/*" onChange={handleProfilePictureChange} className="hidden" />
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                    </svg>
                  </label>
                </div>
                <div className="ml-6 mt-16">
                  <h2 className="text-2xl font-bold text-gray-900">{firstName} {lastName}</h2>
                  <p className="text-sm text-gray-500">{headline}</p>
                  <p className="text-sm text-gray-500">{address}</p>
                </div>
              </div>
              
              {/* About Section */}
              <div className="px-4 py-5 sm:px-6 border-t border-gray-200">
                <h3 className="text-lg font-medium text-gray-900">About</h3>
                <p className="mt-2 text-sm text-gray-500">
                  {about || "Add a summary about yourself"}
                </p>
              </div>
            </div>

            {/* Edit Profile Form Card */}
            <div className="bg-white shadow rounded-lg">
              <div className="px-4 py-5 sm:px-6 border-b border-gray-200">
                <h3 className="text-lg font-medium text-gray-900">Edit Profile</h3>
                <p className="mt-1 text-sm text-gray-500">Update your personal information</p>
              </div>
              
              <div className="px-4 py-5 sm:px-6 space-y-4">
                <div className="grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-6">
                  {/* First Name */}
                  <div className="sm:col-span-3">
                    <label htmlFor="first-name" className="block text-sm font-medium text-gray-700">
                      First name *
                    </label>
                    <div className="mt-1">
                      <input
                        type="text"
                        name="first-name"
                        id="first-name"
                        value={firstName}
                        onChange={(e) => setFirstName(e.target.value)}
                        className="shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 rounded-md"
                      />
                    </div>
                  </div>

                  {/* Last Name */}
                  <div className="sm:col-span-3">
                    <label htmlFor="last-name" className="block text-sm font-medium text-gray-700">
                      Last name *
                    </label>
                    <div className="mt-1">
                      <input
                        type="text"
                        name="last-name"
                        id="last-name"
                        value={lastName}
                        onChange={(e) => setLastName(e.target.value)}
                        className="shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 rounded-md"
                      />
                    </div>
                  </div>

                  {/* Headline */}
                  <div className="sm:col-span-6">
                    <label htmlFor="headline" className="block text-sm font-medium text-gray-700">
                      Headline
                    </label>
                    <div className="mt-1">
                      <input
                        type="text"
                        name="headline"
                        id="headline"
                        value={headline}
                        onChange={(e) => setHeadline(e.target.value)}
                        className="shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 rounded-md"
                        placeholder="e.g. Software Engineer at Pronexus"
                      />
                    </div>
                  </div>

                  {/* Email */}
                  <div className="sm:col-span-6">
                    <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                      Email address *
                    </label>
                    <div className="mt-1">
                      <input
                        type="email"
                        name="email"
                        id="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 rounded-md"
                      />
                    </div>
                  </div>

                  {/* Phone Number */}
                  <div className="sm:col-span-3">
                    <label htmlFor="phone-number" className="block text-sm font-medium text-gray-700">
                      Phone number
                    </label>
                    <div className="mt-1">
                      <input
                        type="text"
                        name="phone-number"
                        id="phone-number"
                        value={phoneNumber}
                        onChange={(e) => setPhoneNumber(e.target.value)}
                        className="shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 rounded-md"
                      />
                    </div>
                  </div>

                  {/* Address */}
                  <div className="sm:col-span-3">
                    <label htmlFor="address" className="block text-sm font-medium text-gray-700">
                      Location
                    </label>
                    <div className="mt-1">
                      <input
                        type="text"
                        name="address"
                        id="address"
                        value={address}
                        onChange={(e) => setAddress(e.target.value)}
                        className="shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 rounded-md"
                        placeholder="e.g. New York, NY"
                      />
                    </div>
                  </div>

                  {/* About */}
                  <div className="sm:col-span-6">
                    <label htmlFor="about" className="block text-sm font-medium text-gray-700">
                      About
                    </label>
                    <div className="mt-1">
                      <textarea
                        id="about"
                        name="about"
                        rows={4}
                        value={about}
                        onChange={(e) => setAbout(e.target.value)}
                        className="shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 rounded-md"
                        placeholder="Tell us about yourself"
                      />
                    </div>
                    <p className="mt-2 text-sm text-gray-500">Brief description for your profile.</p>
                  </div>
                </div>
              </div>
              
              <div className="px-4 py-3 bg-gray-50 text-right sm:px-6">
                {uploadProgress > 0 && uploadProgress < 100 && (
                  <div className="mb-4">
                    <div className="text-sm text-gray-600 mb-1">Uploading files: {uploadProgress}%</div>
                    <div className="w-full bg-gray-200 rounded-full h-2.5">
                      <div 
                        className="bg-blue-600 h-2.5 rounded-full" 
                        style={{ width: `${uploadProgress}%` }}
                      ></div>
                    </div>
                  </div>
                )}
                <button
                  onClick={HandleSave}
                  disabled={isLoading}
                  className={`inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white ${
                    isLoading ? 'bg-blue-400' : 'bg-blue-600 hover:bg-blue-700'
                  } focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500`}
                >
                  {isLoading ? (
                    <>
                      <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Saving...
                    </>
                  ) : (
                    'Save Changes'
                  )}
                </button>
              </div>
            </div>

            {/* User's Posts */}
            <div className="space-y-4">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Posts</h2>
              {posts.map(post => (
                <div key={post.id} className="bg-white rounded-lg shadow-md p-4">
                  {editingPost === post.id ? (
                    <div className="space-y-4">
                      <textarea
                        value={editContent}
                        onChange={(e) => setEditContent(e.target.value)}
                        className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        rows="3"
                      />
                      <div className="flex justify-end space-x-2">
                        <button
                          onClick={() => {
                            setEditingPost(null);
                            setEditContent('');
                          }}
                          className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                        >
                          Cancel
                        </button>
                        <button
                          onClick={() => handleEditPost(post.id)}
                          className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
                        >
                          Save
                        </button>
                      </div>
                    </div>
                  ) : (
                    <>
                      <div className="flex justify-between items-start mb-4">
                        <p className="text-gray-800">{post.content}</p>
                        <div className="flex space-x-2">
                          <button
                            onClick={() => startEditing(post)}
                            className="p-2 text-gray-500 hover:text-blue-500 hover:bg-blue-50 rounded-full transition-colors"
                          >
                            <FaEdit />
                          </button>
                          <button
                            onClick={() => handleDeletePost(post.id)}
                            className="p-2 text-gray-500 hover:text-red-500 hover:bg-red-50 rounded-full transition-colors"
                          >
                            <FaTrash />
                          </button>
                        </div>
                      </div>
                      {post.mediaUrl && (
                        <div className="mt-4">
                          {post.mediaType === 'IMAGE' ? (
                            <img
                              src={`http://localhost:8080/files/download/${post.mediaUrl}`}
                              alt="Post media"
                              className="max-w-full rounded-lg"
                            />
                          ) : (
                            <video
                              src={`http://localhost:8080/files/download/${post.mediaUrl}`}
                              controls
                              className="max-w-full rounded-lg"
                            />
                          )}
                        </div>
                      )}
                      <p className="text-sm text-gray-500 mt-2">
                        {new Date(post.createdAt).toLocaleString()}
                      </p>
                    </>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Right Sidebar */}
          <div className="hidden lg:block lg:col-span-4">
            <div className="sticky top-20">
              <div className="bg-white shadow rounded-lg mb-6">
                <div className="px-4 py-5 sm:px-6 border-b border-gray-200">
                  <h3 className="text-lg font-medium text-gray-900">People you may know</h3>
                </div>
                <div className="px-4 py-5 sm:px-6 space-y-4">
                  {/* Person 1 */}
                  <div className="flex items-center space-x-3">
                    <div className="h-10 w-10 rounded-full bg-gray-300 flex items-center justify-center text-white font-bold">
                      S
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900 truncate">
                        Sarah Johnson
                      </p>
                      <p className="text-sm text-gray-500 truncate">
                        Product Manager at TechCorp
                      </p>
                    </div>
                    <button className="inline-flex items-center px-2.5 py-1.5 border border-gray-300 shadow-sm text-xs font-medium rounded text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
                      Connect
                    </button>
                  </div>

                  {/* Person 2 */}
                  <div className="flex items-center space-x-3">
                    <div className="h-10 w-10 rounded-full bg-gray-300 flex items-center justify-center text-white font-bold">
                      M
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900 truncate">
                        Michael Chen
                      </p>
                      <p className="text-sm text-gray-500 truncate">
                        Software Engineer at DevHub
                      </p>
                    </div>
                    <button className="inline-flex items-center px-2.5 py-1.5 border border-gray-300 shadow-sm text-xs font-medium rounded text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
                      Connect
                    </button>
                  </div>

                  {/* Person 3 */}
                  <div className="flex items-center space-x-3">
                    <div className="h-10 w-10 rounded-full bg-gray-300 flex items-center justify-center text-white font-bold">
                      A
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900 truncate">
                        Aisha Patel
                      </p>
                      <p className="text-sm text-gray-500 truncate">
                        Marketing Director at CreativeWorks
                      </p>
                    </div>
                    <button className="inline-flex items-center px-2.5 py-1.5 border border-gray-300 shadow-sm text-xs font-medium rounded text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
                      Connect
                    </button>
                  </div>
                </div>
                <div className="px-4 py-3 sm:px-6 border-t border-gray-200">
                  <a href="#" className="text-sm font-medium text-blue-600 hover:text-blue-500">
                    Show more
                  </a>
                </div>
              </div>

              <div className="bg-white shadow rounded-lg">
                <div className="px-4 py-5 sm:px-6 border-b border-gray-200">
                  <h3 className="text-lg font-medium text-gray-900">Your network</h3>
                </div>
                <div className="px-4 py-5 sm:px-6">
                  <div className="space-y-4">
                    <div>
                      <p className="text-sm font-medium text-gray-900">Connections</p>
                      <p className="text-2xl font-bold text-gray-900">0</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-900">Invitations</p>
                      <p className="text-2xl font-bold text-gray-900">0</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
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
            {/* <a href="#" className="text-sm text-gray-500 hover:text-gray-900 mb-2 sm:mb-0">About</a>
            <a href="#" className="text-sm text-gray-500 hover:text-gray-900 mb-2 sm:mb-0">Accessibility</a>
            <a href="#" className="text-sm text-gray-500 hover:text-gray-900 mb-2 sm:mb-0">User Agreement</a>
            <a href="#" className="text-sm text-gray-500 hover:text-gray-900 mb-2 sm:mb-0">Privacy Policy</a>
            <a href="#" className="text-sm text-gray-500 hover:text-gray-900 mb-2 sm:mb-0">Cookie Policy</a>
            <a href="#" className="text-sm text-gray-500 hover:text-gray-900 mb-2 sm:mb-0">Copyright Policy</a> */}
          </div>
        </div>
      </footer>
    </div>
  );
};

export default UserDetailProfile;
