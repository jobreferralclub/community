import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import SafeIcon from "../../common/SafeIcon";
import * as FiIcons from "react-icons/fi";
import PostCard from "../../components/community/PostCard";
import CreatePost from "../../components/community/CreatePost";
import { useLocation } from "react-router-dom";
import { subCommunities } from "../../data/communityList";
import Footer from "../../components/landing/Footer";
import CommunityHeader from "../../components/community/CommunityHeader";

// import FilterBar from "./FilterBar"; // Adjust path as needed

const { FiPlus } = FiIcons;

const Community = () => {
  const [showCreatePost, setShowCreatePost] = useState(false);
  const [posts, setPosts] = useState([]);
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

  useEffect(() => {
    setPage(1);
  }, [currentCommunity?.id]);

  useEffect(() => {
    if (!currentCommunity?.id) return;

    const fetchPosts = async () => {
      try {
        setLoading(true);
        const res = await fetch(
          `${import.meta.env.VITE_API_PORT}/api/communities/${currentCommunity.id}/posts?page=${page}`,
          { method: "GET", headers: { "Content-Type": "application/json" } }
        );
        const data = await res.json();
        setPosts(data.posts || []);
        setTotalPages(data.totalPages || 1);
      } catch (err) {
        console.error("Error fetching posts:", err);
        setPosts([]);
      } finally {
        setLoading(false);
      }
    };

    fetchPosts();
  }, [currentCommunity?.id, page]);

  useEffect(() => {
    if (!postId) return;

    const fetchPostById = async () => {
      try {
        const res = await fetch(`${import.meta.env.VITE_API_PORT}/api/posts/${postId}`);
        const data = await res.json();
        if (res.ok) {
          setHighlightedPost(data);
        } else {
          setHighlightedPost(null);
        }
      } catch (err) {
        console.error("Error fetching post by ID:", err);
        setHighlightedPost(null);
      }
    };

    fetchPostById();
  }, [postId]);

  // Filter posts based on selected filters
  const applyFilters = (post) => {
    if (selectedFilters.jobs && selectedFilters.jobs !== "All Jobs") {
      if (!post.category || !post.category.includes(selectedFilters.jobs)) return false;
    }
    if (selectedFilters.company && selectedFilters.company !== "Any") {
      if (post.company !== selectedFilters.company) return false;
    }
    if (selectedFilters.easyApply) {
      if (!post.easyApply) return false;
    }
    if (selectedFilters.under10) {
      if (!post.applicants || post.applicants >= 10) return false;
    }
    // Implement datePosted filtering as needed based on your post data
    return true;
  };

  const filteredPosts = posts.filter(applyFilters);

  return (
    <>
      <div className="bg-black text-gray-300 min-h-screen p-6 space-y-6">
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
      {/* <FilterBar selectedFilters={selectedFilters} setSelectedFilters={setSelectedFilters} /> */}

      <CommunityHeader/>

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
          ) : filteredPosts.length > 0 ? (
            filteredPosts.map((post, index) => (
              <motion.div
                key={post._id || post.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
              >
                <PostCard
                  post={post}
                  onUpdate={(updatedPost) =>
                    setPosts((prev) => prev.map((p) => (p._id === updatedPost._id ? updatedPost : p)))
                  }
                  onDelete={(id) => setPosts((prev) => prev.filter((p) => p._id !== id))}
                />
              </motion.div>
            ))
          ) : (
            <div className="text-center text-gray-500 py-10">No posts to display in this community.</div>
          )}
        </div>

        {/* Pagination */}
        {!loading && totalPages > 1 && (
          <div className="flex justify-center items-center space-x-2 mt-6">
            {page > 1 && (
              <button
                onClick={() => setPage((prev) => prev - 1)}
                className="px-3 py-1 rounded-lg bg-zinc-800 text-gray-300 hover:bg-zinc-700"
              >
                Prev
              </button>
            )}

            <span className="px-3 py-1 rounded-lg bg-[#79e708] !text-black font-medium">{page}</span>

            {page < totalPages && (
              <button
                onClick={() => setPage((prev) => prev + 1)}
                className="px-3 py-1 rounded-lg bg-zinc-800 text-gray-300 hover:bg-zinc-700"
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
            }}
          />
        )}
      </div>
      <Footer />
    </>
  );
};

export default Community;
