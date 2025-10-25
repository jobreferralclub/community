import React, { useState, useEffect, useCallback } from "react";
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
  { label: "₹0–₹4L", min: 0, max: 400000 },
  { label: "₹4L–₹10L", min: 400000, max: 1000000 },
  { label: "₹10L+", min: 1000000, max: null },
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
  const [refreshTrigger, setRefreshTrigger] = useState(0); // NEW: Force refetch
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const postId = queryParams.get("postid");

  const currentCommunity =
    subCommunities.find((c) => location.pathname.startsWith(c.path)) || {
      id: null,
      title: "Community",
      subtitle: "Connect, share, and grow together",
    };

  // FIXED: Reset page when community or filters change
  useEffect(() => {
    setPage(1);
    setFilteredPosts(null); // Clear filtered posts when switching communities
  }, [currentCommunity?.id]);

  // FIXED: Separate effect for filter changes
  useEffect(() => {
    if (Object.keys(selectedFilters).length > 0) {
      setPage(1);
    }
  }, [selectedFilters]);

  // FIXED: Fetch community posts with proper dependencies
  useEffect(() => {
    if (!currentCommunity?.id) return;
    
    // Only fetch if no filters applied
    if (Object.keys(selectedFilters).length > 0) {
      return;
    }

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
        setFilteredPosts(null);
      } catch (err) {
        console.error("Error fetching community posts:", err);
        setCommunityPosts([]);
      } finally {
        setLoading(false);
      }
    };

    fetchCommunityPosts();
  }, [currentCommunity?.id, page, selectedFilters, refreshTrigger]); // Added refreshTrigger

  // FIXED: Fetch filtered posts with proper dependencies
  useEffect(() => {
    if (Object.keys(selectedFilters).length === 0) return;

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
        console.error("Error fetching filtered posts:", err);
        setFilteredPosts([]);
      } finally {
        setLoading(false);
      }
    };

    fetchFilteredPosts();
  }, [page, selectedFilters, refreshTrigger]); // Added refreshTrigger

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
        console.error("Error fetching highlighted post:", err);
        setHighlightedPost(null);
      }
    };
    fetchPostById();
  }, [postId]);

  // FIXED: Use useCallback to prevent stale closures
  const handlePostUpdate = useCallback((updatedPost) => {
    if (Object.keys(selectedFilters).length > 0) {
      setFilteredPosts(prev => prev.map(p => (p._id === updatedPost._id ? updatedPost : p)));
    } else {
      setCommunityPosts(prev => prev.map(p => (p._id === updatedPost._id ? updatedPost : p)));
    }
  }, [selectedFilters]);

  const handlePostDelete = useCallback((id) => {
    if (Object.keys(selectedFilters).length > 0) {
      setFilteredPosts(prev => prev.filter(p => p._id !== id));
    } else {
      setCommunityPosts(prev => prev.filter(p => p._id !== id));
    }
    if (highlightedPost && highlightedPost._id === id) {
      setHighlightedPost(null);
    }
  }, [selectedFilters, highlightedPost]);

  function handleFilterSearch() {
    setPage(1);
    setRefreshTrigger(prev => prev + 1); // Force refetch
  }

  // Determine which posts to show
  const postsToShow = Object.keys(selectedFilters).length > 0 ? filteredPosts : communityPosts;

  // FIXED: Handle page changes with scroll to top
  const handlePageChange = useCallback((newPage) => {
    setPage(newPage);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

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
          ) : postsToShow && postsToShow.length > 0 ? (
            postsToShow.map((post, index) => (
              <motion.div key={post._id || post.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: index * 0.05 }}>
                <PostCard
                  post={post}
                  onUpdate={handlePostUpdate}
                  onDelete={handlePostDelete}
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
              <button 
                onClick={() => handlePageChange(page - 1)} 
                className="px-3 py-1 rounded-lg bg-zinc-800 text-gray-300 hover:bg-zinc-700 transition-colors"
              >
                Prev
              </button>
            )}
            <span className="px-3 py-1 rounded-lg bg-[#79e708] !text-black font-medium">
              {page} / {totalPages}
            </span>
            {page < totalPages && (
              <button 
                onClick={() => handlePageChange(page + 1)} 
                className="px-3 py-1 rounded-lg bg-zinc-800 text-gray-300 hover:bg-zinc-700 transition-colors"
              >
                Next
              </button>
            )}
          </div>
        )}

        {showCreatePost && (
          <CreatePost
            onClose={() => {
              setShowCreatePost(false);
              setPage(1);
              setRefreshTrigger(prev => prev + 1); // NEW: Force refetch after creating post
            }}
          />
        )}
      </div>
      <Footer />
    </>
  );
};

export default Community;
