import React, { useState } from "react";
import { motion } from "framer-motion";

const ProfileSettings = ({ user }) => {
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

  const [phoneError, setPhoneError] = useState(""); // New: error for phone validation

  const apiUrl = import.meta.env.VITE_API_PORT;

  // Mandatory asterisk styling class
  const star = <span className="text-red-500">*</span>;

  const handleChange = (e) => {
    const { name, value } = e.target;
    // Phone: Only allow digits, max 10 characters
    if (name === "phone") {
      if (!/^\d{0,10}$/.test(value)) return;
      // Validation live error
      if (value && value.length !== 10) {
        setPhoneError("Phone number must be 10 digits");
      } else {
        setPhoneError("");
      }
    }
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

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
      setFormData((prev) => ({
        ...prev,
        avatar: data.imageUrl,
      }));
    } catch (err) {
      alert("Image upload failed: " + err.message);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.name || !formData.email) {
      alert("Full Name and Email are mandatory.");
      return;
    }
    if (formData.phone && formData.phone.length !== 10) {
      setPhoneError("Phone number must be exactly 10 digits.");
      return;
    }

    try {
      const response = await fetch(`${apiUrl}/api/users/${user._id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) throw new Error("Failed to update profile");

      const updatedUser = await response.json();
      alert("Profile updated successfully!");
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
      <h3 className="text-lg font-semibold text-white mb-6">My Profile</h3>

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
            Full Name {star}
          </label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
            className="w-full p-3 bg-black border border-gray-700 rounded-s rounded-e text-white placeholder-gray-500 focus:ring-2 focus:ring-primary-500 focus:border-transparent"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            Email Address {star}
          </label>
          <input
            type="email"
            name="email"
            value={formData.email}
            readOnly // email is now not editable
            required
            className="w-full p-3 bg-black border border-gray-700 rounded-s rounded-e text-gray-400 bg-gray-800 placeholder-gray-500 cursor-not-allowed"
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
            placeholder="1234567890"
            value={formData.phone}
            onChange={handleChange}
            maxLength={10}
            pattern="\d{10}"
            className="w-full p-3 bg-black border border-gray-700 rounded-s rounded-e text-white placeholder-gray-500 focus:ring-2 focus:ring-primary-500 focus:border-transparent"
          />
          {phoneError && (
            <span className="text-red-500 text-xs mt-1 block">{phoneError}</span>
          )}
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
          className="border border-[#79e708] text-[#79e708] px-6 py-2 rounded-s rounded-e hover:bg-[#79e708] hover:text-black transition-colors duration-300"
        >
          Save Changes
        </button>
      </div>
    </motion.form>
  );
};

export default ProfileSettings;
