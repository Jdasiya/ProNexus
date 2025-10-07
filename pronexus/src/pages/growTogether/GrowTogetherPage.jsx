import React, { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import Logo from "../../assets/logo.png";

const GrowTogetherPage = () => {
  const userData_LocalStorage = JSON.parse(localStorage.getItem("userDetails"));
  const currentUserId = userData_LocalStorage[0].id;
  const currentUserData = JSON.parse(userData_LocalStorage[0].userData || "{}");
  
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [postToDelete, setPostToDelete] = useState(null);

  // Form states
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [selectedFile, setSelectedFile] = useState(null);
  const [fileType, setFileType] = useState("");
  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [search, setSearch] = useState("");
  const fileInputRef = useRef(null);

  useEffect(() => {
    fetchPosts();
  }, [currentPage, search]);

  const fetchPosts = async () => {
    try {
      setLoading(true);
      const apiUrl = search 
        ? `http://localhost:8080/api/qa/posts?page=${currentPage}&size=5&search=${search}`
        : `http://localhost:8080/api/qa/posts?page=${currentPage}&size=5`;
        
      const response = await axios.get(apiUrl);
      setPosts(response.data.posts);
      setTotalPages(response.data.totalPages);
    } catch (error) {
      console.error('Error fetching posts:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreatePost = async (e) => {
    e.preventDefault();
    
    if (!title.trim() || !description.trim()) {
      alert("Please fill in all required fields");
      return;
    }
    
    try {
      const formData = new FormData();
      formData.append('title', title);
      formData.append('description', description);
      formData.append('createdBy', currentUserId);
      
      if (selectedFile) {
        formData.append('file', selectedFile);
        formData.append('fileType', fileType);
      }
      
      await axios.post("http://localhost:8080/api/qa/posts", formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      
      // Reset form
      setTitle("");
      setDescription("");
      setSelectedFile(null);
      setFileType("");
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
      setShowCreateModal(false);
      
      // Refresh posts
      fetchPosts();
    } catch (error) {
      console.error('Error creating post:', error);
      alert("Failed to create post. Please try again.");
    }
  };

  const handleDeletePost = async (postId) => {
    try {
      await axios.delete(`http://localhost:8080/api/qa/posts/${postId}`);
      setPostToDelete(null);
      // Refresh posts
      fetchPosts();
    } catch (error) {
      console.error('Error deleting post:', error);
      alert("Failed to delete post. Please try again.");
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedFile(file);
      // Auto-detect file type based on mime type
      if (file.type.startsWith('image/')) {
        setFileType('image');
      } else if (file.type.startsWith('video/')) {
        setFileType('video');
      } else {
        setFileType('');
      }
    }
  };

  const handleSearchChange = (e) => {
    setSearch(e.target.value);
    setCurrentPage(0); // Reset to first page on search
  };

  const nextPage = () => {
    if (currentPage < totalPages - 1) {
      setCurrentPage(currentPage + 1);
    }
  };

  const prevPage = () => {
    if (currentPage > 0) {
      setCurrentPage(currentPage - 1);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-100">
      {/* Header */}
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
                  <Link to="/groups" className="text-gray-600 hover:text-blue-600 px-3 py-2 text-sm font-medium">Groups</Link>
                  <Link to="/messaging" className="text-gray-600 hover:text-blue-600 px-3 py-2 text-sm font-medium">Messaging</Link>
                  <Link to="/grow-together" className="border-b-2 border-blue-600 text-gray-900 px-3 py-2 text-sm font-medium">Grow Together</Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-grow py-8">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-2xl font-bold text-gray-900">Grow Together - Q&A</h2>
              <button
                onClick={() => setShowCreateModal(true)}
                className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                Ask a Question
              </button>
            </div>
            
            {/* Search */}
            <div className="mb-6">
              <div className="mt-1 flex rounded-md shadow-sm">
                <input
                  type="text"
                  value={search}
                  onChange={handleSearchChange}
                  className="focus:ring-blue-500 focus:border-blue-500 block w-full rounded-md sm:text-sm border-gray-300"
                  placeholder="Search questions..."
                />
                <button
                  onClick={() => setSearch("")}
                  className={`ml-2 inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 ${!search && 'opacity-50 cursor-not-allowed'}`}
                  disabled={!search}
                >
                  Clear
                </button>
              </div>
            </div>

            {/* Posts List */}
            {loading ? (
              <div className="text-center py-10">
                <div className="spinner"></div>
                <p className="mt-2 text-gray-500">Loading questions...</p>
              </div>
            ) : posts.length === 0 ? (
              <div className="text-center py-10 bg-white rounded-lg shadow">
                <p className="text-gray-500">No questions found. Be the first to ask!</p>
              </div>
            ) : (
              <div className="space-y-6">
                {posts.map((post) => {
                  const isOwner = post.createdBy === currentUserId;
                  
                  return (
                    <div key={post.id} className="bg-white shadow overflow-hidden sm:rounded-md">
                      <div className="px-4 py-5 sm:px-6">
                        <div className="flex justify-between items-start mb-2">
                          <div className="flex items-center">
                            <div className="flex-shrink-0">
                              {post.userData ? (
                                <div className="h-10 w-10 rounded-full bg-blue-600 flex items-center justify-center text-white font-bold">
                                  {JSON.parse(post.userData).firstName?.charAt(0) || post.username?.charAt(0)}
                                </div>
                              ) : (
                                <div className="h-10 w-10 rounded-full bg-gray-300"></div>
                              )}
                            </div>
                            <div className="ml-3">
                              <p className="text-sm font-medium text-gray-900">
                                {post.userData ? 
                                  `${JSON.parse(post.userData).firstName || ""} ${JSON.parse(post.userData).lastName || ""}` : 
                                  post.username}
                              </p>
                              <p className="text-xs text-gray-500">
                                {new Date(post.createdAt).toLocaleDateString()}
                              </p>
                            </div>
                          </div>
                          
                          {isOwner && (
                            <div>
                              <button
                                onClick={() => setPostToDelete(post.id)}
                                className="text-sm text-red-600 hover:text-red-800"
                              >
                                Delete
                              </button>
                            </div>
                          )}
                        </div>
                        
                        <h3 className="text-lg leading-6 font-medium text-gray-900">
                          <Link to={`/grow-together/post/${post.id}`} className="hover:underline">
                            {post.title}
                          </Link>
                        </h3>
                        
                        <div className="mt-2 text-sm text-gray-500">
                          <p className="line-clamp-3">{post.description}</p>
                        </div>
                        
                        {post.fileUrl && (
                          <div className="mt-3">
                            {post.fileType === 'image' ? (
                              <img src={post.fileUrl} alt="Post media" className="max-h-40 rounded" />
                            ) : post.fileType === 'video' ? (
                              <video src={post.fileUrl} controls className="max-h-40 rounded" />
                            ) : (
                              <a href={post.fileUrl} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">View attachment</a>
                            )}
                          </div>
                        )}
                        
                        <div className="mt-3 text-sm">
                          <Link to={`/grow-together/post/${post.id}`} className="text-blue-600 hover:underline">
                            {post.answerCount > 0 ? `See ${post.answerCount} ${post.answerCount === 1 ? 'answer' : 'answers'}` : 'Be the first to answer'}
                          </Link>
                        </div>
                      </div>
                    </div>
                  );
                })}
                
                {/* Pagination */}
                {totalPages > 1 && (
                  <div className="flex justify-between items-center mt-6">
                    <button
                      onClick={prevPage}
                      disabled={currentPage === 0}
                      className={`inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white ${currentPage === 0 ? 'opacity-50 cursor-not-allowed' : 'hover:bg-gray-50'}`}
                    >
                      Previous
                    </button>
                    <span className="text-sm text-gray-700">
                      Page {currentPage + 1} of {totalPages}
                    </span>
                    <button
                      onClick={nextPage}
                      disabled={currentPage === totalPages - 1}
                      className={`inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white ${currentPage === totalPages - 1 ? 'opacity-50 cursor-not-allowed' : 'hover:bg-gray-50'}`}
                    >
                      Next
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </main>

      {/* Delete Confirmation Modal */}
      {postToDelete && (
        <div className="fixed inset-0 z-20 overflow-y-auto" aria-labelledby="modal-title" role="dialog" aria-modal="true">
          <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
            <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" aria-hidden="true" onClick={() => setPostToDelete(null)}></div>

            <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>

            <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
              <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                <div className="sm:flex sm:items-start">
                  <div className="mx-auto flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full bg-red-100 sm:mx-0 sm:h-10 sm:w-10">
                    <svg className="h-6 w-6 text-red-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                    </svg>
                  </div>
                  <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
                    <h3 className="text-lg leading-6 font-medium text-gray-900" id="modal-title">
                      Delete Question
                    </h3>
                    <div className="mt-2">
                      <p className="text-sm text-gray-500">
                        Are you sure you want to delete this question? This action cannot be undone and all answers will also be deleted.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
              <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                <button
                  type="button"
                  onClick={() => handleDeletePost(postToDelete)}
                  className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-red-600 text-base font-medium text-white hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 sm:ml-3 sm:w-auto sm:text-sm"
                >
                  Delete
                </button>
                <button
                  type="button"
                  onClick={() => setPostToDelete(null)}
                  className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Create Post Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 z-20 overflow-y-auto" aria-labelledby="modal-title" role="dialog" aria-modal="true">
          <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
            <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" aria-hidden="true" onClick={() => setShowCreateModal(false)}></div>

            <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>

            <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
              <form onSubmit={handleCreatePost}>
                <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                  <h3 className="text-lg leading-6 font-medium text-gray-900" id="modal-title">
                    Ask a Question
                  </h3>
                  
                  <div className="mt-4">
                    <label htmlFor="title" className="block text-sm font-medium text-gray-700">Title <span className="text-red-500">*</span></label>
                    <input
                      type="text"
                      id="title"
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                      className="mt-1 focus:ring-blue-500 focus:border-blue-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                      placeholder="What's your question?"
                      required
                    />
                  </div>
                  
                  <div className="mt-4">
                    <label htmlFor="description" className="block text-sm font-medium text-gray-700">Description <span className="text-red-500">*</span></label>
                    <textarea
                      id="description"
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                      rows={4}
                      className="mt-1 focus:ring-blue-500 focus:border-blue-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                      placeholder="Provide details about your question..."
                      required
                    />
                  </div>
                  
                  <div className="mt-4">
                    <label htmlFor="file" className="block text-sm font-medium text-gray-700">
                      Attachment (optional)
                    </label>
                    <div className="mt-1 flex items-center">
                      <input
                        type="file"
                        id="file"
                        ref={fileInputRef}
                        onChange={handleFileChange}
                        className="mt-1 focus:ring-blue-500 focus:border-blue-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                        accept="image/*,video/*"
                      />
                    </div>
                    <p className="mt-1 text-sm text-gray-500">
                      Upload an image or video related to your question (max 10MB)
                    </p>
                    {selectedFile && (
                      <div className="mt-2">
                        <p className="text-sm text-gray-600">
                          Selected file: {selectedFile.name} ({(selectedFile.size / 1024 / 1024).toFixed(2)}MB)
                        </p>
                        {fileType && <p className="text-sm text-gray-600">Type: {fileType}</p>}
                      </div>
                    )}
                  </div>
                </div>
                
                <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                  <button
                    type="submit"
                    className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-blue-600 text-base font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:ml-3 sm:w-auto sm:text-sm"
                  >
                    Post Question
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowCreateModal(false)}
                    className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default GrowTogetherPage; 