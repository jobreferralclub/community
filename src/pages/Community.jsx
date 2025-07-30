import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import SafeIcon from '../common/SafeIcon';
import * as FiIcons from 'react-icons/fi';
import { useCommunityStore } from '../store/communityStore';
import PostCard from '../components/PostCard';
import CreatePost from '../components/CreatePost';

const { FiPlus, FiFilter, FiSearch, FiTrendingUp } = FiIcons;

const Community = () => {
  const [showCreatePost, setShowCreatePost] = useState(false);
  const [filter, setFilter] = useState('all');

  const { posts, loadPosts } = useCommunityStore();

  useEffect(() => {
    loadPosts(); // 👈 Fetch from backend on mount
  }, [loadPosts]);

  const filters = [
    { id: 'all', name: 'All Posts', count: posts.length },
    { id: 'job-posting', name: 'Job Postings', count: posts.filter(p => p.type === 'job-posting').length },
    { id: 'success-story', name: 'Success Stories', count: posts.filter(p => p.type === 'success-story').length },
    { id: 'discussion', name: 'Discussions', count: posts.filter(p => p.type === 'discussion').length },
  ];

  const filteredPosts = filter === 'all' ? posts : posts.filter(post => post.type === filter);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Community</h1>
          <p className="text-gray-600 mt-1">Connect, share, and grow together</p>
        </div>
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => setShowCreatePost(true)}
          className="mt-4 sm:mt-0 bg-primary-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-primary-700 transition-colors flex items-center space-x-2"
        >
          <SafeIcon icon={FiPlus} className="w-5 h-5" />
          <span>Create Post</span>
        </motion.button>
      </div>

      {/* Search and Filters */}
      <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
          {/* Search */}
          <div className="relative flex-1 max-w-md">
            <SafeIcon
              icon={FiSearch}
              className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400"
            />
            <input
              type="text"
              placeholder="Search posts, tags, or users..."
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            />
          </div>

          {/* Filters */}
          <div className="flex items-center space-x-2">
            <SafeIcon icon={FiFilter} className="w-5 h-5 text-gray-400" />
            <div className="flex space-x-2">
              {filters.map((filterOption) => (
                <button
                  key={filterOption.id}
                  onClick={() => setFilter(filterOption.id)}
                  className={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${
                    filter === filterOption.id
                      ? 'bg-primary-100 text-primary-700'
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                >
                  {filterOption.name} ({filterOption.count})
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Trending Topics */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-xl p-6 shadow-sm border border-gray-200"
      >
        <div className="flex items-center space-x-2 mb-4">
          <SafeIcon icon={FiTrendingUp} className="w-5 h-5 text-primary-600" />
          <h3 className="text-lg font-semibold text-gray-900">Trending Topics</h3>
        </div>
        <div className="flex flex-wrap gap-2">
          {['React', 'Remote Work', 'Google', 'Meta', 'Interview Tips', 'Salary Negotiation'].map((tag) => (
            <span
              key={tag}
              className="px-3 py-1 bg-primary-50 text-primary-700 rounded-full text-sm font-medium cursor-pointer hover:bg-primary-100 transition-colors"
            >
              #{tag}
            </span>
          ))}
        </div>
      </motion.div>

      {/* Posts */}
      <div className="space-y-6">
        {filteredPosts.map((post, index) => (
          <motion.div
            key={post._id || post.id} // support both local and backend IDs
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <PostCard post={post} />
          </motion.div>
        ))}
      </div>

      {/* Create Post Modal */}
      {showCreatePost && (
        <CreatePost onClose={() => setShowCreatePost(false)} />
      )}
    </div>
  );
};

export default Community;
