import React, { useState } from "react";
import { motion } from "framer-motion";

const ProfileSettings = ({ user }) => {
  // Controlled form state initialized with user prop values
  const [formData, setFormData] = useState({
    name: user.name || "",
    email: user.email || "",
    job_title: user.job_title || "",
    company: user.company || "",
    location: user.location || "",
    phone: user.phone || "",
    bio: user.bio || "",
    avatar: user.avatar || "",
  });

  const apiUrl = import.meta.env.VITE_API_PORT;

  // Handle input change for all fields except file uploads
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Handle avatar image upload
  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const formDataObj = new FormData();
    formDataObj.append("image", file);

    try {
      const res = await fetch(`${apiUrl}/api/upload`, {
        method: "POST",
        body: formDataObj,
      });

      if (!res.ok) throw new Error("Image upload failed");

      const data = await res.json();
      // Update avatar URL to the one returned by the upload endpoint
      setFormData((prev) => ({
        ...prev,
        avatar: data.imageUrl,
      }));
    } catch (err) {
      alert("Image upload failed: " + err.message);
    }
  };

  // Submit updated profile to backend
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch(`${apiUrl}/api/users/${user._id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        throw new Error("Failed to update profile");
      }

      const updatedUser = await response.json();
      alert("Profile updated successfully!");
      // Optionally, update local user state or refetch user data here
    } catch (error) {
      alert(`Error updating profile: ${error.message}`);
    }
  };

  return (
    <motion.form
      onSubmit={handleSubmit}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-zinc-900 rounded-s rounded-e p-6 shadow-md border border-gray-700"
    >
      <h3 className="text-lg font-semibold text-white mb-6">Profile</h3>

      {/* Profile photo */}
      <div className="flex items-center space-x-6 mb-8">
        <img
          src={formData.avatar}
          alt={formData.name}
          className="w-20 h-20 rounded-full object-cover"
        />
        <div>
          <h4 className="font-medium text-white mb-2">Profile Photo</h4>
          <div className="flex space-x-3">
            <label
              htmlFor="avatar-upload"
              className="bg-primary-600 text-white px-4 py-2 rounded-s rounded-e hover:bg-primary-700 cursor-pointer transition-colors"
            >
              Upload New
            </label>
            <input
              id="avatar-upload"
              type="file"
              accept="image/*"
              onChange={handleImageUpload}
              className="hidden"
            />
            <button
              type="button"
              onClick={() => setFormData((prev) => ({ ...prev, avatar: "" }))}
              className="text-gray-400 hover:text-gray-200 transition-colors"
            >
              Remove
            </button>
          </div>
        </div>
      </div>

      {/* Basic Inputs */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            Full Name
          </label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            className="w-full p-3 bg-black border border-gray-700 rounded-s rounded-e text-white placeholder-gray-500 focus:ring-2 focus:ring-primary-500 focus:border-transparent"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            Email Address
          </label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            className="w-full p-3 bg-black border border-gray-700 rounded-s rounded-e text-white placeholder-gray-500 focus:ring-2 focus:ring-primary-500 focus:border-transparent"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            Job Title
          </label>
          <input
            type="text"
            name="job_title"
            placeholder="Senior Software Engineer"
            value={formData.job_title}
            onChange={handleChange}
            className="w-full p-3 bg-black border border-gray-700 rounded-s rounded-e text-white placeholder-gray-500 focus:ring-2 focus:ring-primary-500 focus:border-transparent"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            Company
          </label>
          <input
            type="text"
            name="company"
            placeholder="Tech Corp"
            value={formData.company}
            onChange={handleChange}
            className="w-full p-3 bg-black border border-gray-700 rounded-s rounded-e text-white placeholder-gray-500 focus:ring-2 focus:ring-primary-500 focus:border-transparent"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            Location
          </label>
          <input
            type="text"
            name="location"
            placeholder="San Francisco, CA"
            value={formData.location}
            onChange={handleChange}
            className="w-full p-3 bg-black border border-gray-700 rounded-s rounded-e text-white placeholder-gray-500 focus:ring-2 focus:ring-primary-500 focus:border-transparent"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            Phone Number
          </label>
          <input
            type="tel"
            name="phone"
            placeholder="+1 (555) 123-4567"
            value={formData.phone}
            onChange={handleChange}
            className="w-full p-3 bg-black border border-gray-700 rounded-s rounded-e text-white placeholder-gray-500 focus:ring-2 focus:ring-primary-500 focus:border-transparent"
          />
        </div>
      </div>

      {/* Bio */}
      <div className="mt-6">
        <label className="block text-sm font-medium text-gray-300 mb-2">Bio</label>
        <textarea
          name="bio"
          rows={4}
          placeholder="Tell us about yourself..."
          value={formData.bio}
          onChange={handleChange}
          className="w-full p-3 bg-black border border-gray-700 rounded-s rounded-e text-white placeholder-gray-500 focus:ring-2 focus:ring-primary-500 focus:border-transparent"
        />
      </div>

      {/* Save button */}
      <div className="flex justify-end mt-6">
        <button
          type="submit"
          className="bg-primary-600 text-white px-6 py-2 rounded-s rounded-e hover:bg-primary-700 transition-colors"
        >
          Save Changes
        </button>
      </div>
    </motion.form>
  );
};

export default ProfileSettings;
