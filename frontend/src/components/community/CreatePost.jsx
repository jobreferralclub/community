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

const { FiX, FiImage, FiHash } = FiIcons;

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
  const { addPost } = useCommunityStore();
  const { user } = useAuthStore();

  const apiUrl = import.meta.env.VITE_API_PORT;

  // Tag Handling
  const addTag = () => {
    const newTag = tagInput.trim();
    if (newTag && !formData.tags.includes(newTag)) {
      setFormData(prev => ({ ...prev, tags: [...prev.tags, newTag] }));
      setTagInput('');
    }
  };
  const removeTag = (tag) => {
    setFormData(prev => ({ ...prev, tags: prev.tags.filter(t => t !== tag) }));
  };

  // Image Handling
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
        setFormData(prev => ({ ...prev, imageUrl: data.imageUrl }));
      }
    } catch (err) {
      console.error(err);
    }
  };

  const removeImage = () => setFormData(prev => ({ ...prev, imageUrl: '' }));

  // Submit
  const handleSubmit = async (e) => {
    e.preventDefault();
    await addPost({
      ...formData,
      communityId: currentCommunity?.id,
      author: user?.name,
      avatar: user?.avatar,
      userId: user?._id
    });
    onClose(true);
  };

  return (
    <motion.div
      className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4 z-50"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.95, opacity: 0 }}
        transition={{ duration: 0.2 }}
        className="bg-gradient-to-br from-zinc-900 to-zinc-800 shadow-2xl rounded-2xl p-8 w-full max-w-3xl max-h-[90vh] overflow-y-auto border border-zinc-700/50"
      >
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-semibold text-white">✨ Create New Post</h2>
          <button onClick={onClose} className="p-2 hover:bg-zinc-800 rounded-full">
            <SafeIcon icon={FiX} className="w-5 h-5 text-gray-400" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Post Type */}
          <div>
            <label className="block text-sm text-gray-400 mb-1">Post Type</label>
            <select
              value={formData.type}
              onChange={(e) => setFormData({ ...formData, type: e.target.value })}
              className="w-full p-3 bg-zinc-900 border border-zinc-700 rounded-xl text-gray-100 focus:ring-2 focus:ring-primary-500"
            >
              <option value="discussion">Discussion</option>
              <option value="job-posting">Job Posting</option>
              <option value="success-story">Success Story</option>
            </select>
          </div>

          {/* Title */}
          <div>
            <label className="block text-sm text-gray-400 mb-1">Title</label>
            <input
              type="text"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              className="w-full p-3 bg-zinc-900 border border-zinc-700 rounded-xl text-gray-100 focus:ring-2 focus:ring-primary-500"
              placeholder="Enter a catchy title..."
              required
            />
          </div>

          {/* Content */}
          <div>
            <label className="block text-sm text-gray-400 mb-1">Content</label>
            <ReactQuill
              theme="snow"
              value={formData.content}
              onChange={(content) => setFormData({ ...formData, content })}
              className="bg-zinc-900 text-gray-100 rounded-xl overflow-hidden"
            />
          </div>

          {/* Tags */}
          <div>
            <label className="block text-sm text-gray-400 mb-1">Tags</label>
            <div className="flex items-center gap-2">
              <div className="relative flex-1">
                <SafeIcon icon={FiHash} className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                <input
                  type="text"
                  value={tagInput}
                  onChange={(e) => setTagInput(e.target.value)}
                  onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); addTag(); } }}
                  className="w-full pl-9 pr-4 py-2 bg-zinc-900 border border-zinc-700 rounded-xl text-gray-100 focus:ring-2 focus:ring-primary-500"
                  placeholder="Add a tag..."
                />
              </div>
              <button
                type="button"
                onClick={addTag}
                className="px-4 py-2 bg-primary-600 hover:bg-primary-500 text-white rounded-xl"
              >
                Add
              </button>
            </div>
            <div className="flex flex-wrap gap-2 mt-3">
              {formData.tags.map(tag => (
                <motion.span
                  key={tag}
                  whileHover={{ scale: 1.05 }}
                  className="flex items-center gap-2 px-3 py-1.5 bg-primary-700/30 text-primary-300 rounded-full text-sm border border-primary-600/50"
                >
                  #{tag}
                  <button type="button" onClick={() => removeTag(tag)} className="hover:text-red-400">
                    <SafeIcon icon={FiX} className="w-3 h-3" />
                  </button>
                </motion.span>
              ))}
            </div>
          </div>

          {/* Image */}
          <div>
            <label className="block text-sm text-gray-400 mb-1">Image</label>
            <input type="file" accept="image/*" id="image-upload" hidden onChange={handleImageChange} />
            <button
              type="button"
              onClick={() => document.getElementById('image-upload').click()}
              className="flex items-center gap-2 px-4 py-2 bg-zinc-900 border border-zinc-700 rounded-xl text-gray-300 hover:bg-zinc-800"
            >
              <SafeIcon icon={FiImage} className="w-5 h-5" />
              Add Image
            </button>
            {formData.imageUrl && (
              <div className="mt-4 relative">
                <img src={formData.imageUrl} alt="Preview" className="rounded-xl border border-zinc-700 shadow-lg" />
                <button
                  type="button"
                  onClick={removeImage}
                  className="absolute top-2 right-2 bg-black/70 rounded-full p-1"
                >
                  <SafeIcon icon={FiX} className="w-4 h-4 text-gray-300" />
                </button>
              </div>
            )}
          </div>

          {/* Actions */}
          <div className="flex justify-end gap-3 pt-6 border-t border-zinc-700/50">
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2 rounded-xl bg-zinc-900 border border-zinc-700 text-gray-300 hover:bg-zinc-800"
            >
              Cancel
            </button>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.97 }}
              type="submit"
              className="px-6 py-2 rounded-xl bg-primary-600 hover:bg-primary-500 text-white shadow-md"
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
