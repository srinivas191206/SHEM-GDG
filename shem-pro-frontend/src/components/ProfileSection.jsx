import React, { useState, useCallback } from 'react';
import { motion } from 'framer-motion';
import OptimizedImage from './OptimizedImage';
import { uploadProfileImage, updateProfile } from '../services/userService';

const ProfileSection = ({ currentUser, onSave }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: currentUser?.name || '',
    email: currentUser?.email || '',
    // Add other user fields here
  });
  const [profileImage, setProfileImage] = useState(null);
  const [profileImagePreview, setProfileImagePreview] = useState(null);
  const [errors, setErrors] = useState({});

  const handleChange = useCallback((e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  }, []);

  const handleImageChange = useCallback((e) => {
    const file = e.target.files[0];
    if (file) {
      setProfileImage(file);
      setProfileImagePreview(URL.createObjectURL(file));
    }
  }, []);

  const handleSave = useCallback(async () => {
    const newErrors = {};
    if (!formData.name.trim()) {
      newErrors.name = 'Name is required';
    }
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/.test(formData.email)) {
      newErrors.email = 'Invalid email format';
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    try {
      let imageUrl = currentUser?.profileImage;
      if (profileImage) {
        const uploadResult = await uploadProfileImage(profileImage);
        if (uploadResult.success) {
          imageUrl = uploadResult.imageUrl;
        } else {
          // Handle upload error
          console.error("Image upload failed:", uploadResult.error);
          setErrors(prev => ({ ...prev, profileImage: "Failed to upload image" }));
          return;
        }
      }

      const updatedUser = {
        ...currentUser,
        name: formData.name,
        email: formData.email,
        profileImage: imageUrl,
      };
      const updateResult = await updateProfile(updatedUser);
      if (updateResult.success) {
        onSave(updateResult.user);
        setIsEditing(false);
        setErrors({});
      } else {
        console.error("Profile update failed:", updateResult.error);
        setErrors(prev => ({ ...prev, general: "Failed to update profile" }));
      }
    } catch (error) {
      console.error("Error saving profile:", error);
      setErrors(prev => ({ ...prev, general: "An unexpected error occurred" }));
    }
  }, [formData, onSave]);

  const handleCancel = useCallback(() => {
    setFormData({
      name: currentUser?.name || '',
      email: currentUser?.email || '',
    });
    setProfileImage(null);
    setProfileImagePreview(null);
    setErrors({});
    setIsEditing(false);
  }, [currentUser]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6"
    >
      <h2 className="text-2xl font-bold mb-4 text-gray-800 dark:text-white">User Profile</h2>
      <div className="flex flex-col items-center">
        <OptimizedImage
          src={profileImagePreview || "/placeholder.svg"}
          alt="User Avatar"
          className="h-24 w-24 rounded-full mb-4 object-cover"
        />
        {isEditing && (
          <input
            type="file"
            accept="image/*"
            onChange={handleImageChange}
            className="mb-4 text-sm text-gray-700 dark:text-gray-300"
          />
        )}
        {isEditing ? (
          <div className="w-full space-y-4">
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Name</label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
              />
              {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name}</p>}
            </div>
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Email</label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
              />
              {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email}</p>}
            </div>
            <div className="flex justify-end space-x-2">
              <button
                onClick={handleCancel}
                className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 dark:text-gray-200 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                Cancel
              </button>
              <button
                onClick={handleSave}
                className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                Save
              </button>
            </div>
          </div>
        ) : (
          <div className="text-center">
            <h3 className="text-xl font-semibold">{currentUser?.name || 'Guest User'}</h3>
            <p className="text-gray-600 dark:text-gray-400">{currentUser?.email || 'guest@example.com'}</p>
            <button
              onClick={() => setIsEditing(true)}
              className="mt-4 px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              Edit Profile
            </button>
          </div>
        )}
      </div>
    </motion.div>
  );
};

export default ProfileSection;