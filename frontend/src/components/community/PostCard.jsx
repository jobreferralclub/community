import { useLocation } from 'react-router-dom';
import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import SafeIcon from '../../common/SafeIcon';
import * as FiIcons from 'react-icons/fi';
import { useCommunity } from '../../hooks/useCommunity';
import CommentModal from './CommentModal';
import toast from 'react-hot-toast';
import { useAuthStore } from '../../store/authStore';
import { useNavigate } from "react-router-dom";

const { FiHeart, FiMessageCircle, FiShare2, FiMoreHorizontal } = FiIcons;

const PostCard = ({ post }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const queryParams = new URLSearchParams(location.search);
  const postIdFromUrl = queryParams.get('postid');

  const apiUrl = import.meta.env.VITE_API_PORT;

  const [liked, setLiked] = useState(post.likedByUser || false);
  const [showComments, setShowComments] = useState(false);
  const [likeCount, setLikeCount] = useState(post.likes || 0);
  const [commentCount, setCommentCount] = useState(post.comments || 0);
  const [showMenu, setShowMenu] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [editData, setEditData] = useState({ title: post.title, content: post.content });
  const [showResumeModal, setShowResumeModal] = useState(false);

  const [loadingAnalysis, setLoadingAnalysis] = useState(false);
  const [analysisResult, setAnalysisResult] = useState(null);

  const [loadingJD, setLoadingJD] = useState(false);
  const [jobDescription, setJobDescription] = useState("");
  const [generatingKit, setGeneratingKit] = useState(false);

  const { toggleLike, updatePost, deletePost } = useCommunity();
  const { user } = useAuthStore();
  const menuRef = useRef(null);

  useEffect(() => {
    if (postIdFromUrl && postIdFromUrl === post._id) {
      setShowComments(true);
    }
  }, [postIdFromUrl, post._id]);

  useEffect(() => {
    setLiked(post.likedBy?.includes(user?._id) || false);
    setLikeCount(post.likes || 0);
    setCommentCount(post.comments || 0);
  }, [post, user?._id]);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setShowMenu(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // 🔥 Resume Analysis Handler
  const handleAnalyzeResume = async () => {
    setLoadingAnalysis(true);
    setAnalysisResult(null);

    try {
      // pick only necessary fields
      const resumeData = {
        education: user.education || [],
        skills: user.skills || [],
        certificates: user.certificates || [],
        work: user.work || []
      };

      const response = await fetch(`${apiUrl}/api/resume/jd-analyze`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          resume: resumeData,
          jobDescription: jobDescription,
        }),
      });

      if (!response.ok) throw new Error("Failed to analyze resume");

      const data = await response.json();
      setAnalysisResult(data);
    } catch (err) {
      console.error(err);
      toast.error("Resume analysis failed. Try again later.");
    } finally {
      setLoadingAnalysis(false);
    }
  };

  const handleLike = async () => {
    try {
      const wasLiked = liked;
      setLiked(!liked);
      setLikeCount(prev => (wasLiked ? prev - 1 : prev + 1));
      await toggleLike(post._id);
    } catch (error) {
      setLiked(liked);
      setLikeCount(prev => (liked ? prev + 1 : prev - 1));
      console.error('Error toggling like:', error);
    }
  };

  const handleShare = async () => {
    try {
      const postUrl = `${window.location.origin}${window.location.pathname}?postid=${post._id}`;
      const shareContent = {
        title: post.title,
        text: `${post.title}\n\n${post.content}`,
        url: postUrl,
      };

      if (navigator.share && navigator.canShare && navigator.canShare(shareContent)) {
        await navigator.share(shareContent);
        toast.success('Post shared successfully!');
        return;
      }

      const textToShare = `${post.title}\n\n${post.content}\n\nShared from JobReferral.Club\n${postUrl}`;
      await navigator.clipboard.writeText(textToShare);
      toast.success('Post content copied to clipboard!');
    } catch (error) {
      console.error('Error sharing post:', error);
      toast.error('Failed to share post. Please try again.');
    }
  };

  const getPostTypeColor = (type) => {
    switch (type) {
      case 'job-posting': return 'bg-blue-800 text-white';
      case 'success-story': return 'bg-green-800 text-green-300';
      case 'discussion': return 'bg-purple-800 text-purple-300';
      default: return 'bg-gray-800 text-gray-300';
    }
  };

  const handleEdit = () => {
    setShowMenu(false);
    setShowEditModal(true);
  };

  const handleDelete = () => {
    setShowMenu(false);
    setShowDeleteModal(true);
  };

  const confirmEdit = async () => {
    try {
      await updatePost(post._id, editData);
      toast.success('Post updated!');
      setShowEditModal(false);
    } catch {
      toast.error('Failed to update post');
    }
  };

  const confirmDelete = async () => {
    try {
      await deletePost(post._id);
      toast.success('Post deleted!');
      setShowDeleteModal(false);
    } catch {
      toast.error('Failed to delete post');
    }
  };

  useEffect(() => {
    const fetchJD = async () => {
      if (showResumeModal && post._id) {
        setLoadingJD(true);
        try {
          const res = await fetch(`${apiUrl}/api/posts/${post._id}/job-description`);
          if (!res.ok) throw new Error("Failed to fetch job description");
          const data = await res.json();
          setJobDescription(data.job_description || "");
        } catch (err) {
          console.error(err);
          toast.error("Failed to fetch job description");
        } finally {
          setLoadingJD(false);
        }
      }
    };

    fetchJD();
  }, [showResumeModal, post._id, apiUrl]);

  // Extract fields from post.content (HTML)
  const extractJobDetails = (htmlString, jobDescription) => {
    const parser = new DOMParser();
    const doc = parser.parseFromString(htmlString, "text/html");

    let companyName = "";
    let jobTitle = "";

    // Loop over all <p> tags
    doc.querySelectorAll("p").forEach(p => {
      const strong = p.querySelector("strong");
      if (!strong) return;

      const label = strong.textContent?.trim();

      if (label.startsWith("Company Name")) {
        // Company name is the text of the <p> without the <strong> part
        companyName = p.textContent.replace(label, "").trim();
      }

      if (label.startsWith("Job Role")) {
        jobTitle = p.textContent.replace(label, "").trim();
      }
    });

    // Fallback: use first non-empty line from jobDescription
    if (!jobTitle && jobDescription) {
      const firstLine = jobDescription.split("\n").map(l => l.trim()).find(l => l.length > 0);
      jobTitle = firstLine || "Unknown Job Title";
    }

    if (!companyName) {
      companyName = "Unknown Company";
    }

    return { companyName, jobTitle };
  };

  // Generate Application Kit Handler
  const handleGenerateApplicationKit = async () => {
    try {
      setGeneratingKit(true);

      const { companyName, jobTitle } = extractJobDetails(post.content);

      const resumeData = {
        name: user.name || "",
        email: user.email || "",
        education: user.education || [],
        skills: user.skills || [],
        certificates: user.certificates || [],
        work: user.work || []
      };

      const response = await fetch(`${apiUrl}/api/resume/generate-application-kit`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          resume: resumeData,
          jobDescription,
          jobTitle,
          companyName
        }),
      });

      if (!response.ok) throw new Error("Failed to generate application kit");

      const data = await response.json();

      navigate("/profile/cover-letter", {
        state: {
          coverLetter: data.coverLetter,
          jobTitle: data.jobTitle,
          companyName: data.companyName,
        },
      });

    } catch (err) {
      console.error(err);
      toast.error("Failed to generate application kit");
    } finally {
      setGeneratingKit(false);
    }
  };

  return (
    <>
      {/* Post Card */}
      <motion.div
        whileHover={{ y: -2 }}
        className="bg-zinc-900 rounded-xl p-6 shadow-sm border border-gray-700 hover:shadow-md transition-all text-gray-100"
      >
        {/* Header */}
        <div className="flex items-start justify-between mb-4 relative" ref={menuRef}>
          <div className="flex items-center space-x-3">
            <img
              src={(post.createdBy?.avatar == null) ? "/default-avatar.jpg" : post.createdBy?.avatar}
              alt="image"
              className="w-12 h-12 rounded-full object-cover"
            />
            <div>
              <h4 className="font-semibold text-xl text-white">{(post.createdBy?.name == null) ? post.author : post.createdBy?.name}</h4>
              <p className="text-sm text-gray-400">
                {post.timestamp || new Date(post.createdAt).toLocaleDateString()}
              </p>
            </div>
          </div>
          <div className="flex items-center space-x-2 relative">
            <span className={`px-2 py-1 rounded-full text-xs font-medium ${getPostTypeColor(post.type)} !text-zinc-100`}>
              {post.type?.replace('-', ' ') || 'discussion'}
            </span>

            {post.createdBy === user?._id && (
              <div className="relative">
                <button
                  onClick={() => setShowMenu(prev => !prev)}
                  className="p-2 hover:bg-gray-800 rounded-lg transition-colors"
                >
                  <SafeIcon icon={FiMoreHorizontal} className="w-4 h-4 text-gray-400" />
                </button>

                {showMenu && (
                  <div className="absolute right-0 mt-2 w-36 bg-gray-800 border border-gray-700 rounded-lg shadow-md z-10">
                    <button
                      onClick={handleEdit}
                      className="w-full text-left px-4 py-2 text-sm text-gray-300 hover:bg-gray-700"
                    >
                      Edit Post
                    </button>
                    <button
                      onClick={handleDelete}
                      className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-700"
                    >
                      Delete Post
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Content */}
        <div className="mb-4">
          <h3 className="text-2xl font-semibold text-white mb-2">{post.title}</h3>
          <p className="text-gray-300" dangerouslySetInnerHTML={{ __html: post.content }} />
        </div>

        {/* Image Preview */}
        {post.imageUrl && (
          <div className="mb-4 relative overflow-visible">
            <img
              src={post.imageUrl}
              alt="Post attachment"
              className="block w-full max-h-96 object-contain rounded-lg border border-gray-700"
            />
          </div>
        )}

        {/* Tags */}
        {post.tags?.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-4">
            {post.tags.map(tag => (
              <span
                key={tag}
                className="px-2 py-1 bg-gray-800 text-gray-400 rounded-md text-sm"
              >
                #{tag}
              </span>
            ))}
          </div>
        )}

        {/* Links */}
        {post.links?.length > 0 && (
          <div className="flex flex-col gap-1 mb-4">
            {post.links.map(link => (
              <a
                key={link}
                href={link}
                target="_blank"
                rel="noopener noreferrer"
                className="text-green-400 hover:underline break-all text-sm"
              >
                {link}
              </a>
            ))}
          </div>
        )}

        {/* Actions */}
        <div className="flex items-center justify-between pt-4 border-t border-gray-700">
          <div className="flex items-center space-x-6">
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleLike}
              className={`flex items-center space-x-2 transition-colors ${liked ? 'text-red-600' : 'text-gray-500 hover:text-red-600'}`}
            >
              <SafeIcon icon={FiHeart} className={`w-5 h-5 ${liked ? 'fill-current' : ''}`} />
              <span className="text-sm font-medium">{likeCount}</span>
            </motion.button>

            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setShowComments(true)}
              className="flex items-center space-x-2 text-gray-500 hover:text-blue-600"
            >
              <SafeIcon icon={FiMessageCircle} className="w-5 h-5" />
              <span className="text-sm font-medium">{commentCount}</span>
            </motion.button>

            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleShare}
              className="flex items-center space-x-2 text-gray-500 hover:text-green-600"
            >
              <SafeIcon icon={FiShare2} className="w-5 h-5" />
              <span className="text-sm font-medium">Share</span>
            </motion.button>

            {/* NEW: Check Resume Compatibility Button */}
            {post.type === "job-posting" && (
              <motion.button
                whileTap={{ scale: 0.95 }}
                onClick={() => setShowResumeModal(true)}
                className="flex items-center space-x-2 hover:text-[#79e708] px-3 py-1 rounded transition-colors text-sm"
              >
                Generate Application Kit
              </motion.button>
            )}

          </div>
        </div>

      </motion.div>

      {showResumeModal && (
        <div
          className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 overflow-y-auto"
          onClick={() => setShowResumeModal(false)} // close when clicking backdrop
        >
          <div
            className="bg-gray-900 p-6 rounded-lg w-full max-w-lg text-gray-100 my-10 relative"
            onClick={(e) => e.stopPropagation()} // prevent backdrop close on inside click
          >
            {/* Cross button */}
            <button
              onClick={() => setShowResumeModal(false)}
              className="absolute top-3 right-3 text-gray-400 hover:text-gray-200 text-xl"
            >
              ✕
            </button>

            {/* Header */}
            <h3 className="text-lg font-semibold mb-4">Generate a new application kit</h3>
            <p className="text-gray-300 mb-4">
              Checking your resume against this job description:
            </p>

            {/* Job Description */}
            <div className="bg-gray-800 p-4 rounded mb-4 max-h-40 overflow-y-auto text-sm">
              {loadingJD ? (
                <span className="text-gray-400">⏳ Loading job description...</span>
              ) : (
                jobDescription || "No job description available."
              )}
            </div>

            {/* Missing fields warning */}
            {(!user.skills?.length ||
              !user.education?.length ||
              !user.certificates?.length ||
              !user.work?.length) &&
              (() => {
                const missingFields = [];
                if (!user.skills?.length) missingFields.push("Skills");
                if (!user.education?.length) missingFields.push("Education");
                if (!user.certificates?.length) missingFields.push("Certificates");
                if (!user.work?.length) missingFields.push("Work Experience");

                return (
                  <div className="bg-[#facc15]/10 p-4 rounded mb-4 text-yellow-500">
                    ⚠️ Your profile is missing some details:{" "}
                    {missingFields.join(", ")}.
                    <br />
                    Do you want to proceed analyzing resume?
                  </div>
                );
              })()}

            {/* Footer Actions */}
            <div className="flex justify-end gap-2">
              <button
                onClick={() => window.open("/profile", "_blank")}
                className="px-4 py-2 bg-gray-900 text-yellow-400 rounded hover:bg-gray-800 transition-colors"
              >
                Edit Resume
              </button>
              <button
                onClick={() => setShowResumeModal(false)}
                className="px-4 py-2 bg-gray-700 rounded text-gray-200"
              >
                Close
              </button>
              <button
                onClick={handleGenerateApplicationKit}
                disabled={generatingKit}
                className={`px-4 py-2 rounded ${generatingKit
                    ? "bg-gray-600 text-gray-300 cursor-not-allowed"
                    : "bg-[#79e708] text-black hover:bg-[#66c206]"
                  }`}
              >
                {generatingKit ? "⏳ Generating..." : "Generate Application Kit"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Comments Modal */}
      {showComments && <CommentModal post={post} onClose={() => setShowComments(false)} />}

      {/* Edit Modal */}
      {showEditModal && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-gray-900 p-6 rounded-lg w-full max-w-md text-gray-100">
            <h3 className="text-lg font-semibold mb-4">Edit Post</h3>
            <input
              type="text"
              value={editData.title}
              onChange={(e) => setEditData({ ...editData, title: e.target.value })}
              className="w-full border border-gray-700 rounded p-2 mb-3 bg-gray-800 text-gray-100"
              placeholder="Post title"
            />
            <textarea
              value={editData.content}
              onChange={(e) => setEditData({ ...editData, content: e.target.value })}
              className="w-full border border-gray-700 rounded p-2 mb-4 bg-gray-800 text-gray-100"
              rows="4"
              placeholder="Post content"
            />
            <div className="flex justify-end gap-2">
              <button onClick={() => setShowEditModal(false)} className="px-4 py-2 bg-gray-700 rounded text-gray-200">
                Cancel
              </button>
              <button onClick={confirmEdit} className="px-4 py-2 bg-green-600 text-white rounded">
                Save
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirm Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-gray-900 p-6 rounded-lg w-full max-w-sm text-center text-gray-100">
            <h3 className="text-lg font-semibold mb-4">Delete Post?</h3>
            <p className="text-gray-400 mb-6">This action cannot be undone.</p>
            <div className="flex justify-center gap-3">
              <button onClick={() => setShowDeleteModal(false)} className="px-4 py-2 bg-gray-700 rounded text-gray-200">
                Cancel
              </button>
              <button onClick={confirmDelete} className="px-4 py-2 bg-red-600 text-white rounded">
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default PostCard;
