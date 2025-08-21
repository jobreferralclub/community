import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import SafeIcon from "../../common/SafeIcon";
import * as FiIcons from "react-icons/fi";
import { useCommunityStore } from "../../store/communityStore";
import PostCard from "../../components/community/PostCard";
import CreatePost from "../../components/community/CreatePost";
import { useLocation } from "react-router-dom";
import { subCommunities } from "../../data/communityList";

const { FiPlus, FiFilter, FiSearch, FiTrendingUp } = FiIcons;

const Community = () => {
  const [showCreatePost, setShowCreatePost] = useState(false);
  const [filter, setFilter] = useState("all");

  const { posts, loadPosts } = useCommunityStore();
  const location = useLocation();

  useEffect(() => {
    loadPosts();
  }, [loadPosts]);

  const currentCommunity =
    subCommunities.find((c) => location.pathname.startsWith(c.path)) || {
      title: "community",
      subtitle: "Connect, share, and grow together",
    };

  const filters = [
    { id: "all", name: "All Posts", count: posts.length },
    {
      id: "job-posting",
      name: "Job Postings",
      count: posts.filter((p) => p.type === "job-posting").length,
    },
    {
      id: "success-story",
      name: "Success Stories",
      count: posts.filter((p) => p.type === "success-story").length,
    },
    {
      id: "discussion",
      name: "Discussions",
      count: posts.filter((p) => p.type === "discussion").length,
    },
  ];

  const filteredPosts = posts
    .filter((post) => {
      const matchesCommunity = currentCommunity.path
        ? post.community === currentCommunity.title
        : true;
      const matchesType = filter === "all" || post.type === filter;
      return matchesCommunity && matchesType;
    })
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

  return (
    <div className="bg-gray-900 text-gray-100 min-h-screen p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold">{currentCommunity.title}</h1>
          <p className="text-gray-400 mt-1">{currentCommunity.subtitle}</p>
        </div>
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => setShowCreatePost(true)}
          className="mt-4 sm:mt-0 bg-[#79e708] !text-black px-4 py-2 rounded-lg font-medium hover:brightness-105 transition-colors flex items-center space-x-2"
        >
          <SafeIcon icon={FiPlus} className="w-5 h-5 !text-black" />
          <span className="!text-black font-medium">Create Post</span>
        </motion.button>
      </div>

      {/* Search and Filters */}
      <div className="bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-700">
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
              className="w-full pl-10 pr-4 py-2 rounded-lg bg-gray-700 text-gray-200 border border-gray-600 focus:ring-2 focus:ring-[#79e708] focus:border-transparent"
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
                  className={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${filter === filterOption.id
                    ? "bg-[#79e708] !text-black"
                    : "bg-gray-700 text-gray-400 hover:bg-gray-600"
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
        className="bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-700"
      >
        <div className="flex items-center space-x-2 mb-4">
          <SafeIcon
            icon={FiTrendingUp}
            className="w-5 h-5"
            style={{ color: "#79e708" }}
          />
          <h3 className="text-lg font-semibold text-white">Trending Topics</h3>
        </div>
        <div className="flex flex-wrap gap-2">
          {[
            "React",
            "Remote Work",
            "Google",
            "Meta",
            "Interview Tips",
            "Salary Negotiation",
          ].map((tag) => (
            <span
              key={tag}
              className="px-3 py-1 bg-[#79e708] !text-black rounded-full text-sm font-medium cursor-pointer hover:brightness-105"
            >
              #{tag}
            </span>
          ))}
        </div>
      </motion.div>

      {/* Posts */}
      <div className="space-y-6">
        {filteredPosts.length > 0 ? (
          filteredPosts.map((post, index) => (
            <motion.div
              key={post._id || post.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <PostCard post={post} />
            </motion.div>
          ))
        ) : (
          <div className="text-center text-gray-500 py-10">
            No posts to display in this community.
          </div>
        )}
      </div>

      {/* Create Post Modal */}
      {showCreatePost && (
        <CreatePost onClose={() => setShowCreatePost(false)} />
      )}
    </div>
  );
};

export default Community;
