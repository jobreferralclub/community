import React, { useState } from 'react';
import { motion } from 'framer-motion';
import SafeIcon from '../common/SafeIcon';
import * as FiIcons from 'react-icons/fi';
import { useCommunityStore } from '../store/communityStore';
import { useAuthStore } from '../store/authStore';
import { useLocation } from 'react-router-dom';

const { FiX, FiImage, FiLink, FiHash } = FiIcons;

const subCommunities = [
  { path: '/community/in/operations', title: 'Operations & Supply Chain - India' },
  { path: '/community/in/program', title: 'Program & Project Management - India' },
  { path: '/community/in/product', title: 'Product Management - India' },
  { path: '/community/in/marketing', title: 'Marketing Management - India' },
  { path: '/community/in/account', title: 'Sales and Account Management - India' },
  { path: '/community/us/operations', title: 'Operations & Supply Chain - US' },
  { path: '/community/us/program', title: 'Program & Project Management - US' },
  { path: '/community/us/product', title: 'Product Management - US' },
  { path: '/community/us/marketing', title: 'Marketing Management - US' },
  { path: '/community/us/account', title: 'Sales and Account Management - US' },
];

const CreatePost = ({ onClose }) => {
  const location = useLocation();
  const currentCommunity = subCommunities.find(sc => location.pathname.startsWith(sc.path));

  const [formData, setFormData] = useState({
    title: '',
    content: '',
    type: 'discussion',
    tags: [],
    community: currentCommunity ? currentCommunity.title : ''
  });
  
  const [tagInput, setTagInput] = useState('');
  const { addPost } = useCommunityStore();
  const { user } = useAuthStore();

  const handleSubmit = async (e) => {
    e.preventDefault();
    await addPost({
      ...formData,
      author: user.name,
      avatar: user.avatar,
    });
    onClose();
  };

  const addTag = () => {
    if (tagInput.trim() && !formData.tags.includes(tagInput.trim())) {
      setFormData({
        ...formData,
        tags: [...formData.tags, tagInput.trim()]
      });
      setTagInput('');
    }
  };

  const removeTag = (tag) => {
    setFormData({
      ...formData,
      tags: formData.tags.filter(t => t !== tag)
    });
  };

  return (
    <motion.div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <motion.div className="bg-white rounded-xl p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-gray-900">Create New Post</h2>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
            <SafeIcon icon={FiX} className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Post Type */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Post Type</label>
            <select
              value={formData.type}
              onChange={(e) => setFormData({ ...formData, type: e.target.value })}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            >
              <option value="discussion">Discussion</option>
              <option value="job-posting">Job Posting</option>
              <option value="success-story">Success Story</option>
            </select>
          </div>

          {/* Community - Auto-selected based on URL */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Community</label>
            <input
              type="text"
              value={formData.community}
              readOnly
              className="w-full p-3 border border-gray-300 rounded-lg bg-gray-100 text-gray-700"
            />
          </div>

          {/* Title */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Title</label>
            <input
              type="text"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              placeholder="Enter a compelling title..."
              required
            />
          </div>

          {/* Content */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Content</label>
            <textarea
              value={formData.content}
              onChange={(e) => setFormData({ ...formData, content: e.target.value })}
              rows={6}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              placeholder="Share your thoughts, job details, or story..."
              required
            />
          </div>

          {/* Tags */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Tags</label>
            <div className="flex items-center space-x-2 mb-3">
              <div className="relative flex-1">
                <SafeIcon icon={FiHash} className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="text"
                  value={tagInput}
                  onChange={(e) => setTagInput(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addTag())}
                  className="w-full pl-9 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  placeholder="Add tags..."
                />
              </div>
              <button
                type="button"
                onClick={addTag}
                className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
              >
                Add
              </button>
            </div>
            <div className="flex flex-wrap gap-2">
              {formData.tags.map((tag) => (
                <span key={tag} className="flex items-center space-x-1 px-3 py-1 bg-primary-100 text-primary-700 rounded-full text-sm">
                  <span>#{tag}</span>
                  <button type="button" onClick={() => removeTag(tag)} className="hover:bg-primary-200 rounded-full p-1">
                    <SafeIcon icon={FiX} className="w-3 h-3" />
                  </button>
                </span>
              ))}
            </div>
          </div>

          {/* Media Options */}
          <div className="flex items-center space-x-4 py-3 border-t border-gray-200">
            <button type="button" className="flex items-center space-x-2 text-gray-500 hover:text-gray-700 transition-colors">
              <SafeIcon icon={FiImage} className="w-5 h-5" />
              <span className="text-sm">Add Image</span>
            </button>
            <button type="button" className="flex items-center space-x-2 text-gray-500 hover:text-gray-700 transition-colors">
              <SafeIcon icon={FiLink} className="w-5 h-5" />
              <span className="text-sm">Add Link</span>
            </button>
          </div>

          {/* Actions */}
          <div className="flex items-center justify-end space-x-3 pt-6 border-t border-gray-200">
            <button type="button" onClick={onClose} className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors">
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
