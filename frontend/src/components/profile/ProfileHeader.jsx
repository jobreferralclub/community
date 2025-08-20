import React, { useState } from "react";
import { Mail, Phone, MapPin, Edit2, X } from "lucide-react";
import { useAuthStore } from "../../store/authStore";

const ProfileHeader = ({ profile }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editData, setEditData] = useState(profile);
  const [uploading, setUploading] = useState(false);

  const { user } = useAuthStore(); // ✅ assuming you have a setUser action in your store

  // Handle avatar upload
  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const formDataObj = new FormData();
    formDataObj.append("image", file);

    try {
      setUploading(true);
      const res = await fetch("http://localhost:5000/api/upload", {
        method: "POST",
        body: formDataObj,
      });

      if (!res.ok) throw new Error("Image upload failed");
      const data = await res.json();

      setEditData((prev) => ({ ...prev, avatar: data.imageUrl }));
    } catch (err) {
      alert("Upload failed: " + err.message);
    } finally {
      setUploading(false);
    }
  };

  // Save changes to DB
  const handleSave = async () => {
    try {
      const res = await fetch(`http://localhost:5000/api/users/${user._id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(editData),
      });

      if (!res.ok) throw new Error("Failed to update profile");
      const updatedUser = await res.json();

      // ✅ Sync the displayed profile too
      setEditData(updatedUser);

      setIsEditing(false);
    } catch (err) {
      alert("Error saving profile: " + err.message);
    }
  };

  return (
    <div className="bg-gradient-to-r from-gray-900 to-black border-b border-gray-800 relative">
      <div className="max-w-6xl mx-auto px-6 py-8">
        <div className="flex items-center gap-6">
          {/* Avatar */}
          <div className="w-24 h-24 rounded-full overflow-hidden border-2 border-lime-500">
            <img
              src={editData.avatar || "/default-avatar.jpg"}
              alt={editData.name}
              className="w-full h-full object-cover"
            />
          </div>

          {/* Info */}
          <div className="flex-1">
            <h1 className="text-4xl font-bold mb-2">{editData.name}</h1>
            <div className="flex flex-wrap gap-4 text-gray-300">
              <div className="flex items-center gap-2">
                <Mail size={16} />
                <span>{editData.email}</span>
              </div>
              <div className="flex items-center gap-2">
                <Phone size={16} />
                <span>{editData.phone}</span>
              </div>
              <div className="flex items-center gap-2">
                <MapPin size={16} />
                <span>{editData.location}</span>
              </div>
            </div>
          </div>

          {/* Edit Button */}
          <button
            onClick={() => {
              setEditData(profile);
              setIsEditing(true);
            }}
            className="p-2 rounded-full bg-gray-800 hover:bg-gray-700 text-lime-400"
          >
            <Edit2 size={18} />
          </button>
        </div>
      </div>

      {/* Edit Modal */}
      {isEditing && (
        <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50">
          <div className="bg-gray-900 p-6 rounded-xl w-96 relative">
            <button
              onClick={() => setIsEditing(false)}
              className="absolute top-3 right-3 text-gray-400 hover:text-white"
            >
              <X size={20} />
            </button>

            <h2 className="text-xl font-bold mb-4">Edit Profile</h2>

            {/* Avatar Upload */}
            <div className="mb-4">
              <div className="flex items-center gap-3">
                <img
                  src={editData.avatar || "/default-avatar.jpg"}
                  alt="preview"
                  className="w-16 h-16 rounded-full object-cover border border-gray-700"
                />
                <div>
                  <label
                    htmlFor="avatar-upload"
                    className="bg-lime-600 text-black px-3 py-1 rounded cursor-pointer hover:bg-lime-500"
                  >
                    {uploading ? "Uploading..." : "Upload New"}
                  </label>
                  <input
                    id="avatar-upload"
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={handleImageUpload}
                  />
                </div>
              </div>
            </div>

            {/* Name */}
            <div className="mb-3">
              <label className="block text-sm mb-1">Name</label>
              <input
                type="text"
                value={editData.name || ""}
                onChange={(e) =>
                  setEditData({ ...editData, name: e.target.value })
                }
                className="w-full p-2 rounded bg-gray-800 text-white"
              />
            </div>

            {/* Phone */}
            <div className="mb-3">
              <label className="block text-sm mb-1">Phone</label>
              <input
                type="text"
                value={editData.phone || ""}
                onChange={(e) =>
                  setEditData({ ...editData, phone: e.target.value })
                }
                className="w-full p-2 rounded bg-gray-800 text-white"
              />
            </div>

            {/* Location */}
            <div className="mb-3">
              <label className="block text-sm mb-1">Location</label>
              <input
                type="text"
                value={editData.location || ""}
                onChange={(e) =>
                  setEditData({ ...editData, location: e.target.value })
                }
                className="w-full p-2 rounded bg-gray-800 text-white"
              />
            </div>

            {/* Save */}
            <button
              onClick={handleSave}
              disabled={uploading}
              className="w-full py-2 mt-2 bg-lime-500 hover:bg-lime-600 text-black font-semibold rounded disabled:opacity-50"
            >
              Save Changes
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProfileHeader;
