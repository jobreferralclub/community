import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import SafeIcon from "../../common/SafeIcon";
import * as FiIcons from "react-icons/fi";
import PostCard from "../../components/community/PostCard";
import CreatePost from "../../components/community/CreatePost";
import { useLocation } from "react-router-dom";
import { subCommunities } from "../../data/communityList";
import Footer from "../../components/landing/Footer";
import PostFilter from "../../components/community/PostFilter";

const salaryRanges = [
  { label: "₹0–₹5L", min: 0, max: 500000 },
  { label: "₹5L–₹10L", min: 500000, max: 1000000 },
  { label: "₹10L–₹20L", min: 1000000, max: 2000000 },
  { label: "₹20L+", min: 2000000, max: null },
];
const { FiPlus } = FiIcons;

const Community = () => {
  const [showCreatePost, setShowCreatePost] = useState(false);
  const [communityPosts, setCommunityPosts] = useState([]);
  const [filteredPosts, setFilteredPosts] = useState(null);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [highlightedPost, setHighlightedPost] = useState(null);
  const [selectedFilters, setSelectedFilters] = useState({});
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const postId = queryParams.get("postid");

  const currentCommunity =
    subCommunities.find((c) => location.pathname.startsWith(c.path)) || {
      id: null,
      title: "Community",
      subtitle: "Connect, share, and grow together",
    };

  // Reset page on community change or filter change
  useEffect(() => {
    setPage(1);
  }, [currentCommunity?.id, selectedFilters]);

  // Fetch community posts when community changes
  useEffect(() => {
    if (!currentCommunity?.id) return;
    const fetchCommunityPosts = async () => {
      setLoading(true);
      try {
        const res = await fetch(
          `${import.meta.env.VITE_API_PORT}/api/communities/${currentCommunity.id}/posts?page=${page}`,
          { method: "GET", headers: { "Content-Type": "application/json" } }
        );
        const data = await res.json();
        setCommunityPosts(data.posts || []);
        setTotalPages(data.totalPages || 1);
      } catch (err) {
        setCommunityPosts([]);
      } finally {
        setLoading(false);
      }
    };
    // Only fetch community posts when no filter applied
    if (Object.keys(selectedFilters).length === 0) {
      fetchCommunityPosts();
      setFilteredPosts(null);
    }
  }, [currentCommunity?.id, page, selectedFilters]);

  // Fetch filtered posts independently of community
  useEffect(() => {
    if (Object.keys(selectedFilters).length === 0) return; // No filters, skip
    const fetchFilteredPosts = async () => {
      setLoading(true);
      try {
        let params = { page };
        if (selectedFilters.keyword) params.keyword = selectedFilters.keyword;
        if (selectedFilters.location) params.location = selectedFilters.location;
        if (selectedFilters.experienceLevel) params.experienceLevel = selectedFilters.experienceLevel;
        if (selectedFilters.jobType) params.jobType = selectedFilters.jobType;
        if (selectedFilters.companyName) params.companyName = selectedFilters.companyName;
        if (selectedFilters.salaryRange) {
          const range = salaryRanges.find(r => r.label === selectedFilters.salaryRange);
          if (range) {
            params.salaryMin = range.min;
            if (range.max !== null) params.salaryMax = range.max;
          }
        }
        const query = new URLSearchParams(params).toString();
        const res = await fetch(
          `${import.meta.env.VITE_API_PORT}/api/posts?${query}`,
          { method: "GET", headers: { "Content-Type": "application/json" } }
        );
        const data = await res.json();
        setFilteredPosts(data.posts || []);
        setTotalPages(data.totalPages || 1);
      } catch (err) {
        setFilteredPosts([]);
      } finally {
        setLoading(false);
      }
    };
    fetchFilteredPosts();
  }, [page, selectedFilters]);

  // Highlighted post fetch logic
  useEffect(() => {
    if (!postId) return;
    const fetchPostById = async () => {
      try {
        const res = await fetch(`${import.meta.env.VITE_API_PORT}/api/posts/${postId}`);
        const data = await res.json();
        if (res.ok) setHighlightedPost(data);
        else setHighlightedPost(null);
      } catch (err) {
        setHighlightedPost(null);
      }
    };
    fetchPostById();
  }, [postId]);
  const setPosts = (updater) => {
  if (filteredPosts !== null) {
    setFilteredPosts(updater);
  } else {
    setCommunityPosts(updater);
  }
};


  function handleFilterSearch() {
    setPage(1);
  }

  // Determine which posts to show (filtered has priority)
  const postsToShow = filteredPosts !== null ? filteredPosts : communityPosts;

  return (
    <>
      <div className="bg-black text-gray-300 min-h-screen space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-3xl font-bold text-white">{currentCommunity.title}</h1>
            <p className="text-gray-400 mt-1">{currentCommunity.subtitle}</p>
          </div>
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => setShowCreatePost(true)}
            className="mt-4 sm:mt-0 bg-[#79e708] !text-black px-4 py-2 rounded-s rounded-e font-medium hover:brightness-105 transition-colors flex items-center space-x-2"
          >
            <SafeIcon icon={FiPlus} className="w-5 h-5 !text-black" />
            <span className="!text-black font-medium">Create Post</span>
          </motion.button>
        </div>

        {/* Filter Bar */}
        <PostFilter
          selectedFilters={selectedFilters}
          setSelectedFilters={setSelectedFilters}
          onSearch={handleFilterSearch}
        />

        {/* Posts */}
        <div className="space-y-6">
          {highlightedPost && postId && (
            <motion.div key={highlightedPost._id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
              <div className="shadow-lg p-4">
                <div className="mb-2 text-sm font-semibold text-yellow-500 uppercase tracking-wide">Highlighted Post</div>
                <PostCard post={highlightedPost} />
              </div>
              <div className="border-b border-zinc-800 my-4"></div>
            </motion.div>
          )}

          {loading ? (
            <div className="text-center text-gray-500 py-10">Loading posts...</div>
          ) : postsToShow.length > 0 ? (
            postsToShow.map((post, index) => (
              <motion.div key={post._id || post.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: index * 0.05 }}>
                <PostCard
                  post={post}
                  onUpdate={updatedPost => setPosts(prev => prev.map(p => (p._id === updatedPost._id ? updatedPost : p)))}
                  onDelete={id => {
  if (filteredPosts !== null) {
    setFilteredPosts(prev => prev.filter(p => p._id !== id));
  } else {
    setCommunityPosts(prev => prev.filter(p => p._id !== id));
  }
  if (highlightedPost && highlightedPost._id === id) setHighlightedPost(null);
}}

                />
              </motion.div>
            ))
          ) : (
            <div className="text-center text-gray-500 py-10">No posts to display.</div>
          )}
        </div>

        {/* Pagination */}
        {!loading && totalPages > 1 && (
          <div className="flex justify-center items-center space-x-2 mt-6">
            {page > 1 && (
              <button onClick={() => setPage(prev => prev - 1)} className="px-3 py-1 rounded-lg bg-zinc-800 text-gray-300 hover:bg-zinc-700">Prev</button>
            )}
            <span className="px-3 py-1 rounded-lg bg-[#79e708] !text-black font-medium">{page}</span>
            {page < totalPages && (
              <button onClick={() => setPage(prev => prev + 1)} className="px-3 py-1 rounded-lg bg-zinc-800 text-gray-300 hover:bg-zinc-700">Next</button>
            )}
          </div>
        )}

        {showCreatePost && (
          <CreatePost
            onClose={() => {
              setShowCreatePost(false);
              setPage(1);
            }}
          />
        )}
      </div>
      <Footer />
    </>
  );
};

export default Community;
