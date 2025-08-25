import React, { useState } from 'react';
import { motion } from 'framer-motion';
import SafeIcon from '../../common/SafeIcon';
import * as FiIcons from 'react-icons/fi';
import { useCommunityStore } from '../../store/communityStore';
import { useAuthStore } from '../../store/authStore';
import { useLocation } from 'react-router-dom';
import { subCommunities } from '../../data/communityList';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';

const { FiX, FiImage, FiLink, FiHash } = FiIcons;

const CreatePost = ({ onClose }) => {
  const location = useLocation();
  const currentCommunity = subCommunities.find(sc => location.pathname.startsWith(sc.path));

  const [formData, setFormData] = useState({
    title: '',
    content: '',
    type: 'discussion',
    tags: [],
    links: [],
    imageUrl: '',
    community: currentCommunity ? currentCommunity.title : ''
  });

  const [tagInput, setTagInput] = useState('');
  const [linkInput, setLinkInput] = useState('');
  const { addPost } = useCommunityStore();
  const { user } = useAuthStore();

  const apiUrl = import.meta.env.VITE_API_PORT;

  // ===== Tag Handling =====
  const addTag = () => {
    const newTag = tagInput.trim();
    if (newTag && !formData.tags.includes(newTag)) {
      setFormData(prev => ({
        ...prev,
        tags: [...prev.tags, newTag]
      }));
      setTagInput('');
    }
  };
  const removeTag = (tag) => {
    setFormData(prev => ({
      ...prev,
      tags: prev.tags.filter(t => t !== tag)
    }));
  };

  // ===== Link Handling =====
  const addLink = () => {
    const url = linkInput.trim();
    try {
      new URL(url); // validate URL format
      if (url && !formData.links.includes(url)) {
        setFormData(prev => ({
          ...prev,
          links: [...prev.links, url]
        }));
        setLinkInput('');
      }
    } catch {
      alert('Invalid URL. Please include full format like https://example.com');
    }
  };
  const removeLink = (link) => {
    setFormData(prev => ({
      ...prev,
      links: prev.links.filter(l => l !== link)
    }));
  };

  // ===== Image Handling =====
  const handleImageChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const formDataObj = new FormData();
    formDataObj.append('image', file);

    try {
      const response = await fetch(`${apiUrl}/api/upload`, {
        method: 'POST',
        body: formDataObj,
      });
      const data = await response.json();

      if (data.success && data.imageUrl) {
        setFormData(prev => ({
          ...prev,
          imageUrl: data.imageUrl,
        }));
      } else {
        alert('Image upload failed.');
      }
    } catch (error) {
      console.error('Image upload error:', error);
      alert('Could not upload image. Try again.');
    }
  };
  const removeImage = () => {
    setFormData(prev => ({ ...prev, imageUrl: '' }));
  };

  // ===== Submission =====
  const handleSubmit = async (e) => {
    e.preventDefault();
    await addPost({
      ...formData,
      communityId: currentCommunity?.id,   // ✅ add community ID
      author: user?.name,
      avatar: user?.avatar,
      userId: user?._id
    });
    onClose();
  };

  return (
    <motion.div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center p-4 z-50">
      <motion.div className="bg-gray-900 rounded-xl p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">

        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-white">Create New Post</h2>
          <button onClick={onClose} className="p-2 hover:bg-gray-800 rounded-lg transition-colors">
            <SafeIcon icon={FiX} className="w-5 h-5 text-gray-400" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Post Type */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Post Type</label>
            <select
              value={formData.type}
              onChange={(e) => setFormData({ ...formData, type: e.target.value })}
              className="w-full p-3 border border-gray-700 rounded-lg bg-gray-800 text-gray-100 focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            >
              <option value="discussion">Discussion</option>
              <option value="job-posting">Job Posting</option>
              <option value="success-story">Success Story</option>
            </select>
          </div>

          {/* Community */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Community</label>
            <input
              type="text"
              value={formData.community}
              readOnly
              className="w-full p-3 border border-gray-700 rounded-lg bg-gray-800 text-gray-100"
            />
          </div>

          {/* Title */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Title</label>
            <input
              type="text"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              className="w-full p-3 border border-gray-700 rounded-lg bg-gray-800 text-gray-100 focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              placeholder="Enter a compelling title..."
              required
            />
          </div>

          {/* Content - Rich Text Editor */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Content</label>
            <ReactQuill
              theme="snow"
              value={formData.content}
              onChange={(content) => setFormData({ ...formData, content })}
              className="mb-4 bg-gray-800 text-gray-100"
              style={{ borderRadius: '0.5rem' }}
            />
          </div>

          {/* Tags */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Tags</label>
            <div className="flex items-center space-x-2 mb-3">
              <div className="relative flex-1">
                <SafeIcon icon={FiHash} className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-500" />
                <input
                  type="text"
                  value={tagInput}
                  onChange={(e) => setTagInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      addTag();
                    }
                  }}
                  className="w-full pl-9 pr-4 py-2 border border-gray-700 rounded-lg bg-gray-800 text-gray-100 focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  placeholder="Add tags..."
                />
              </div>
              <button
                type="button"
                onClick={addTag}
                className="px-4 py-2 bg-gray-800 text-gray-200 rounded-lg hover:bg-gray-700 transition-colors"
              >
                Add
              </button>
            </div>
            <div className="flex flex-wrap gap-2">
              {formData.tags.map((tag) => (
                <span key={tag} className="flex items-center space-x-1 px-3 py-1 bg-primary-800 text-primary-300 rounded-full text-sm">
                  <span>#{tag}</span>
                  <button type="button" onClick={() => removeTag(tag)} className="hover:bg-primary-700 rounded-full p-1">
                    <SafeIcon icon={FiX} className="w-3 h-3" />
                  </button>
                </span>
              ))}
            </div>
          </div>

          {/* Links */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Links</label>
            <div className="flex items-center space-x-2 mb-3">
              <input
                type="text"
                value={linkInput}
                onChange={(e) => setLinkInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    addLink();
                  }
                }}
                placeholder="Add link (https://...)"
                className="w-full p-3 border border-gray-700 rounded-lg bg-gray-800 text-gray-100 focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              />
              <button
                type="button"
                onClick={addLink}
                className="px-4 py-2 bg-gray-800 text-gray-200 rounded-lg hover:bg-gray-700 transition-colors"
              >
                Add
              </button>
            </div>
            <div className="flex flex-wrap gap-2">
              {formData.links.map((link) => (
                <span key={link} className="flex items-center space-x-1 px-3 py-1 bg-primary-800 text-primary-300 rounded-full text-sm">
                  <a href={link} target="_blank" rel="noopener noreferrer" className="underline">{link}</a>
                  <button type="button" onClick={() => removeLink(link)} className="hover:bg-primary-700 rounded-full p-1">
                    <SafeIcon icon={FiX} className="w-3 h-3" />
                  </button>
                </span>
              ))}
            </div>
          </div>

          {/* Image Upload */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Image</label>
            <input
              type="file"
              accept="image/*"
              id="image-upload"
              style={{ display: 'none' }}
              onChange={handleImageChange}
            />
            <button
              type="button"
              onClick={() => document.getElementById('image-upload').click()}
              className="flex items-center space-x-2 text-gray-400 hover:text-gray-200 transition-colors"
            >
              <SafeIcon icon={FiImage} className="w-5 h-5" />
              <span className="text-sm">Add Image</span>
            </button>
            {formData.imageUrl && (
              <div className="mt-3 relative">
                <img src={formData.imageUrl} alt="Preview" className="w-full rounded-lg border border-gray-700" />
                <button
                  type="button"
                  onClick={removeImage}
                  className="absolute top-2 right-2 bg-gray-800 p-1 rounded-full shadow"
                >
                  <SafeIcon icon={FiX} className="w-4 h-4 text-gray-400" />
                </button>
              </div>
            )}
          </div>

          {/* Actions */}
          <div className="flex items-center justify-end space-x-3 pt-6 border-t border-gray-700">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-gray-200 bg-gray-800 rounded-lg hover:bg-gray-700 transition-colors"
            >
              Cancel
            </button>
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              type="submit"
              className="px-6 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
            >
              Post
            </motion.button>
          </div>
        </form>
      </motion.div>
    </motion.div>
  );
};

export default CreatePost;
