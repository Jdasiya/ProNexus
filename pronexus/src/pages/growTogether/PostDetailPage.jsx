import React, { useState, useEffect, useRef } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import Logo from "../../assets/logo.png";

const PostDetailPage = () => {
  const { postId } = useParams();
  const navigate = useNavigate();
  const userData_LocalStorage = JSON.parse(localStorage.getItem("userDetails"));
  const currentUserId = userData_LocalStorage[0].id;
  
  const [post, setPost] = useState(null);
  const [answers, setAnswers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [answersLoading, setAnswersLoading] = useState(true);
  const [answerContent, setAnswerContent] = useState("");
  const [selectedFile, setSelectedFile] = useState(null);
  const [fileType, setFileType] = useState("");
  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const fileInputRef = useRef(null);

  useEffect(() => {
    fetchPost();
    fetchAnswers();
  }, [postId, currentPage]);

  const fetchPost = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`http://localhost:8080/api/qa/posts/${postId}`);
      setPost(response.data);
    } catch (error) {
      console.error('Error fetching post:', error);
      if (error.response && error.response.status === 404) {
        navigate('/grow-together');
      }
    } finally {
      setLoading(false);
    }
  };

  const fetchAnswers = async () => {
    try {
      setAnswersLoading(true);
      const response = await axios.get(`http://localhost:8080/api/qa/posts/${postId}/answers?page=${currentPage}&size=5`);
      setAnswers(response.data.answers);
      setTotalPages(response.data.totalPages);
    } catch (error) {
      console.error('Error fetching answers:', error);
    } finally {
      setAnswersLoading(false);
    }
  };

  const handleSubmitAnswer = async (e) => {
    e.preventDefault();
    
    if (!answerContent.trim()) {
      alert("Answer content cannot be empty");
      return;
    }
    
    try {
      const formData = new FormData();
      formData.append('content', answerContent);
      formData.append('createdBy', currentUserId);
      
      if (selectedFile) {
        formData.append('file', selectedFile);
        formData.append('fileType', fileType);
      }
      
      await axios.post(`http://localhost:8080/api/qa/posts/${postId}/answers`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      
      // Reset form
      setAnswerContent("");
      setSelectedFile(null);
      setFileType("");
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
      
      // Refresh answers
      fetchAnswers();
      fetchPost(); // To update answer count
    } catch (error) {
      console.error('Error posting answer:', error);
      alert("Failed to post answer. Please try again.");
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

  const handleDeletePost = async () => {
    try {
      await axios.delete(`http://localhost:8080/api/qa/posts/${postId}`);
      navigate('/grow-together');
    } catch (error) {
      console.error('Error deleting post:', error);
      alert("Failed to delete post. Please try again.");
    }
  };

  const handleDeleteAnswer = async (answerId) => {
    try {
      await axios.delete(`http://localhost:8080/api/qa/answers/${answerId}`);
      // Refresh answers
      fetchAnswers();
      fetchPost(); // To update answer count
    } catch (error) {
      console.error('Error deleting answer:', error);
      alert("Failed to delete answer. Please try again.");
    }
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

  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100">
        <div className="spinner"></div>
        <p className="mt-4 text-gray-500">Loading question...</p>
      </div>
    );
  }

  if (!post) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100">
        <p className="text-gray-500">Question not found</p>
        <Link to="/grow-together" className="mt-4 text-blue-600 hover:underline">
          Back to Grow Together
        </Link>
      </div>
    );
  }

  const userInfo = post.userData ? JSON.parse(post.userData) : null;
  const postOwner = post.createdBy === currentUserId;

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
          <div className="bg-white shadow overflow-hidden sm:rounded-lg mb-6">
            <div className="px-4 py-5 sm:px-6">
              {/* Post Header */}
              <div className="flex justify-between items-start mb-4">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    {userInfo ? (
                      <div className="h-12 w-12 rounded-full bg-blue-600 flex items-center justify-center text-white font-bold">
                        {userInfo.firstName?.charAt(0) || post.username?.charAt(0)}
                      </div>
                    ) : (
                      <div className="h-12 w-12 rounded-full bg-gray-300"></div>
                    )}
                  </div>
                  <div className="ml-4">
                    <h2 className="text-lg font-bold text-gray-900">
                      {userInfo ? `${userInfo.firstName || ""} ${userInfo.lastName || ""}` : post.username}
                    </h2>
                    <p className="text-sm text-gray-500">{formatDate(post.createdAt)}</p>
                  </div>
                </div>
                
                {/* Actions dropdown for post owner */}
                {postOwner && (
                  <div className="relative">
                    <button
                      onClick={() => setShowDeleteConfirm(!showDeleteConfirm)}
                      className="inline-flex items-center px-3 py-1.5 border border-gray-300 rounded-md text-sm font-medium text-red-700 bg-white hover:bg-red-50"
                    >
                      Delete
                    </button>
                    
                    {showDeleteConfirm && (
                      <div className="absolute right-0 mt-2 w-56 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 z-10">
                        <div className="p-3 text-sm">
                          <p>Are you sure you want to delete this post?</p>
                          <div className="mt-2 flex justify-end space-x-2">
                            <button
                              onClick={() => setShowDeleteConfirm(false)}
                              className="px-2 py-1 text-gray-700 hover:bg-gray-100 rounded"
                            >
                              Cancel
                            </button>
                            <button
                              onClick={handleDeletePost}
                              className="px-2 py-1 text-white bg-red-600 hover:bg-red-700 rounded"
                            >
                              Delete
                            </button>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>
              
              {/* Post Content */}
              <div className="mt-4">
                <h1 className="text-xl font-bold text-gray-900 mb-2">{post.title}</h1>
                <p className="text-gray-700 whitespace-pre-line">{post.description}</p>
                
                {post.fileUrl && (
                  <div className="mt-4">
                    {post.fileType === 'image' ? (
                      <img src={post.fileUrl} alt="Post media" className="max-h-96 rounded" />
                    ) : post.fileType === 'video' ? (
                      <video src={post.fileUrl} controls className="max-h-96 rounded" />
                    ) : (
                      <a href={post.fileUrl} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">View attachment</a>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>
          
          {/* Answers Section */}
          <div className="mt-8">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              {post.answerCount > 0 ? `${post.answerCount} ${post.answerCount === 1 ? 'Answer' : 'Answers'}` : 'No Answers Yet'}
            </h3>
            
            {answersLoading ? (
              <div className="text-center py-10">
                <div className="spinner"></div>
                <p className="mt-2 text-gray-500">Loading answers...</p>
              </div>
            ) : answers.length === 0 ? (
              <div className="text-center py-10 bg-white rounded-lg shadow">
                <p className="text-gray-500">No answers yet. Be the first to answer!</p>
              </div>
            ) : (
              <div className="space-y-6">
                {answers.map((answer) => {
                  const answerUserInfo = answer.userData ? JSON.parse(answer.userData) : null;
                  const answerOwner = answer.createdBy === currentUserId;
                  
                  return (
                    <div key={answer.id} className="bg-white shadow overflow-hidden sm:rounded-lg p-4">
                      <div className="flex justify-between items-start">
                        <div className="flex items-center">
                          <div className="flex-shrink-0">
                            {answerUserInfo ? (
                              <div className="h-10 w-10 rounded-full bg-blue-600 flex items-center justify-center text-white font-bold">
                                {answerUserInfo.firstName?.charAt(0) || answer.username?.charAt(0)}
                              </div>
                            ) : (
                              <div className="h-10 w-10 rounded-full bg-gray-300"></div>
                            )}
                          </div>
                          <div className="ml-3">
                            <p className="text-sm font-medium text-gray-900">
                              {answerUserInfo ? 
                                `${answerUserInfo.firstName || ""} ${answerUserInfo.lastName || ""}` : 
                                answer.username}
                            </p>
                            <p className="text-xs text-gray-500">{formatDate(answer.createdAt)}</p>
                          </div>
                        </div>
                        
                        {/* Delete button for answer owner */}
                        {answerOwner && (
                          <button
                            onClick={() => handleDeleteAnswer(answer.id)}
                            className="text-sm text-red-600 hover:text-red-800"
                          >
                            Delete
                          </button>
                        )}
                      </div>
                      
                      <div className="mt-3">
                        <p className="text-gray-700 whitespace-pre-line">{answer.content}</p>
                        
                        {answer.fileUrl && (
                          <div className="mt-3">
                            {answer.fileType === 'image' ? (
                              <img src={answer.fileUrl} alt="Answer media" className="max-h-60 rounded" />
                            ) : answer.fileType === 'video' ? (
                              <video src={answer.fileUrl} controls className="max-h-60 rounded" />
                            ) : (
                              <a href={answer.fileUrl} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">View attachment</a>
                            )}
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
            
            {/* Pagination for answers */}
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
          
          {/* Answer Form */}
          <div className="mt-8">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Your Answer</h3>
            <form onSubmit={handleSubmitAnswer} className="bg-white shadow overflow-hidden sm:rounded-lg p-4">
              <div>
                <textarea
                  value={answerContent}
                  onChange={(e) => setAnswerContent(e.target.value)}
                  rows={4}
                  className="focus:ring-blue-500 focus:border-blue-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                  placeholder="Write your answer here..."
                  required
                />
              </div>
              
              <div className="mt-4">
                <label htmlFor="answerFile" className="block text-sm font-medium text-gray-700">
                  Attachment (optional)
                </label>
                <div className="mt-1 flex items-center">
                  <input
                    type="file"
                    id="answerFile"
                    ref={fileInputRef}
                    onChange={handleFileChange}
                    className="mt-1 focus:ring-blue-500 focus:border-blue-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                    accept="image/*,video/*"
                  />
                </div>
                <p className="mt-1 text-sm text-gray-500">
                  Upload an image or video related to your answer (max 10MB)
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
              
              <div className="mt-4 flex justify-end">
                <button
                  type="submit"
                  className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  Post Answer
                </button>
              </div>
            </form>
          </div>
        </div>
      </main>
    </div>
  );
};

export default PostDetailPage; 