import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { FaImage, FaVideo, FaTimes, FaSmile, FaCalendarAlt, FaMapMarkerAlt } from 'react-icons/fa';

const CreatePost = ({ currentUserId, onPostCreated }) => {
    const [content, setContent] = useState('');
    const [media, setMedia] = useState(null);
    const [mediaPreview, setMediaPreview] = useState(null);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [showPreviewModal, setShowPreviewModal] = useState(false);
    const [userData, setUserData] = useState(null);

    useEffect(() => {
        // Get user data from localStorage
        const userDetails = localStorage.getItem('userDetails');
        if (userDetails) {
            const parsedData = JSON.parse(userDetails)[0];
            setUserData({
                firstName: parsedData.userData ? JSON.parse(parsedData.userData).firstName : '',
                lastName: parsedData.userData ? JSON.parse(parsedData.userData).lastName : '',
                profilePicture: parsedData.userData ? JSON.parse(parsedData.userData).profilePicture : null,
                username: parsedData.username || ''
            });
        }
    }, []);

    const handleMediaChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setMedia(file);
            const reader = new FileReader();
            reader.onloadend = () => {
                setMediaPreview(reader.result);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!content.trim() && !media) return;

        setIsSubmitting(true);
        const formData = new FormData();
        formData.append('content', content);
        if (media) {
            formData.append('media', media);
        }

        try {
            await axios.post(`http://localhost:8080/posts?userId=${currentUserId}`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });
            setContent('');
            setMedia(null);
            setMediaPreview(null);
            onPostCreated();
        } catch (error) {
            console.error('Error creating post:', error);
        } finally {
            setIsSubmitting(false);
        }
    };

    const handlePreviewClick = () => {
        if (mediaPreview) {
            setShowPreviewModal(true);
        }
    };

    // Get user initial safely
    const getUserInitial = () => {
        if (!userData) return 'U';
        return (userData.firstName || userData.username || 'U').charAt(0).toUpperCase();
    };

    return (
        <>
            <div className="bg-white rounded-lg shadow-md mb-4">
                {/* Post Creation Header */}
                <div className="p-4 border-b">
                    <div className="flex items-center space-x-4">
                        <div className="w-12 h-12 rounded-full overflow-hidden bg-blue-100 flex items-center justify-center text-blue-600 font-semibold">
                            {userData?.profilePicture ? (
                                <img 
                                    src={userData.profilePicture} 
                                    alt={`${userData.firstName} ${userData.lastName}`}
                                    className="w-full h-full object-cover"
                                />
                            ) : (
                                getUserInitial()
                            )}
                        </div>
                        <div className="flex-1">
                            <div className="mb-1">
                                <span className="font-semibold text-gray-900">
                                    {userData ? `${userData.firstName} ${userData.lastName}` : 'User'}
                                </span>
                            </div>
                            <textarea
                                value={content}
                                onChange={(e) => setContent(e.target.value)}
                                placeholder="Start a post"
                                className="w-full p-2 border-0 focus:ring-0 resize-none text-gray-700 placeholder-gray-500"
                                rows="1"
                                style={{ minHeight: '40px', maxHeight: '200px' }}
                            />
                        </div>
                    </div>
                </div>

                {/* Media Preview */}
                {mediaPreview && (
                    <div className="px-4 py-2 border-b">
                        <div className="relative inline-block">
                            {media.type.startsWith('image/') ? (
                                <img
                                    src={mediaPreview}
                                    alt="Preview"
                                    className="max-h-96 rounded-lg cursor-pointer hover:opacity-90 transition-opacity"
                                    onClick={handlePreviewClick}
                                />
                            ) : (
                                <video
                                    src={mediaPreview}
                                    controls
                                    className="max-h-96 rounded-lg"
                                />
                            )}
                            <button
                                type="button"
                                onClick={() => {
                                    setMedia(null);
                                    setMediaPreview(null);
                                }}
                                className="absolute top-2 right-2 bg-gray-800 bg-opacity-50 text-white rounded-full p-2 hover:bg-opacity-70 transition-opacity"
                            >
                                <FaTimes />
                            </button>
                        </div>
                    </div>
                )}

                {/* Post Creation Footer */}
                <div className="p-4">
                    <div className="flex items-center justify-between">
                        <div className="flex space-x-4">
                            <label className="flex items-center space-x-2 text-gray-600 hover:bg-gray-100 px-3 py-2 rounded-lg cursor-pointer transition-colors">
                                <FaImage className="text-blue-500" />
                                <span className="text-sm font-medium">Photo</span>
                                <input
                                    type="file"
                                    accept="image/*"
                                    onChange={handleMediaChange}
                                    className="hidden"
                                />
                            </label>
                            <label className="flex items-center space-x-2 text-gray-600 hover:bg-gray-100 px-3 py-2 rounded-lg cursor-pointer transition-colors">
                                <FaVideo className="text-green-500" />
                                <span className="text-sm font-medium">Video</span>
                                <input
                                    type="file"
                                    accept="video/*"
                                    onChange={handleMediaChange}
                                    className="hidden"
                                />
                            </label>
                            <button className="flex items-center space-x-2 text-gray-600 hover:bg-gray-100 px-3 py-2 rounded-lg transition-colors">
                                <FaSmile className="text-yellow-500" />
                                <span className="text-sm font-medium">Feeling/Activity</span>
                            </button>
                            <button className="flex items-center space-x-2 text-gray-600 hover:bg-gray-100 px-3 py-2 rounded-lg transition-colors">
                                <FaCalendarAlt className="text-red-500" />
                                <span className="text-sm font-medium">Event</span>
                            </button>
                            <button className="flex items-center space-x-2 text-gray-600 hover:bg-gray-100 px-3 py-2 rounded-lg transition-colors">
                                <FaMapMarkerAlt className="text-purple-500" />
                                <span className="text-sm font-medium">Location</span>
                            </button>
                        </div>
                        <button
                            type="submit"
                            onClick={handleSubmit}
                            disabled={isSubmitting || (!content.trim() && !media)}
                            className={`px-6 py-1.5 rounded-full text-sm font-medium ${
                                isSubmitting || (!content.trim() && !media)
                                    ? 'bg-gray-200 text-gray-500 cursor-not-allowed'
                                    : 'bg-blue-500 hover:bg-blue-600 text-white'
                            } transition-colors`}
                        >
                            {isSubmitting ? 'Posting...' : 'Post'}
                        </button>
                    </div>
                </div>
            </div>

            {/* Preview Modal */}
            {showPreviewModal && mediaPreview && media.type.startsWith('image/') && (
                <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50">
                    <div className="relative max-w-4xl max-h-[90vh] mx-4">
                        <img
                            src={mediaPreview}
                            alt="Preview"
                            className="max-w-full max-h-[90vh] object-contain"
                        />
                        <button
                            onClick={() => setShowPreviewModal(false)}
                            className="absolute top-4 right-4 bg-white rounded-full p-2 hover:bg-gray-200 transition-colors"
                        >
                            <FaTimes className="text-gray-600" />
                        </button>
                    </div>
                </div>
            )}
        </>
    );
};

export default CreatePost; 