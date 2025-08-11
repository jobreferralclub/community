import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import SafeIcon from "../common/SafeIcon";
import * as FiIcons from "react-icons/fi";
import { useCommunity } from "../hooks/useCommunity";
import { useAuthStore } from "../store/authStore";

const { FiX, FiSend, FiMessageCircle } = FiIcons;

const CommentModal = ({ post, onClose }) => {
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState("");
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const { getComments, addComment, deleteComment } = useCommunity();
  const { user } = useAuthStore();

  useEffect(() => {
    fetchComments();
  }, [post._id]);

  const fetchComments = async () => {
    setLoading(true);
    const data = await getComments(post._id);
    setComments(data);
    setLoading(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!newComment.trim() || submitting) return;

    setSubmitting(true);
    try {
      const comment = await addComment(post._id, newComment);
      setComments((prev) => [...prev, comment]);
      setNewComment("");
    } catch (error) {
      console.error("Error adding comment:", error);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <motion.div
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.95, opacity: 0 }}
        className="bg-white rounded-xl w-full max-w-2xl max-h-[90vh] flex flex-col overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200 flex-shrink-0">
          <div className="flex items-center space-x-2">
            <SafeIcon
              icon={FiMessageCircle}
              className="w-5 h-5 text-primary-600"
            />
            <h2 className="text-lg font-semibold text-gray-900">Comments</h2>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <SafeIcon icon={FiX} className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        {/* Post Preview */}
        <div className="p-6 border-b border-gray-200 bg-gray-50 flex-shrink-0">
          <div className="flex items-start space-x-3">
            <img
              src={
                post.avatar ||
                "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=40&h=40&fit=crop&crop=face"
              }
              alt={post.author}
              className="w-10 h-10 rounded-full object-cover"
            />
            <div className="flex-1 min-w-0">
              <h3 className="font-medium text-gray-900 truncate">
                {post.title}
              </h3>
              <p className="text-sm text-gray-600 mt-1 line-clamp-2">
                {post.content}
              </p>
            </div>
          </div>
        </div>

        {/* Comments List - Scrollable */}
        <div className="flex-1 overflow-y-auto p-6">
          {loading ? (
            <div className="flex items-center justify-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
            </div>
          ) : comments.length === 0 ? (
            <div className="text-center py-8">
              <SafeIcon
                icon={FiMessageCircle}
                className="w-12 h-12 text-gray-300 mx-auto mb-3"
              />
              <p className="text-gray-500">
                No comments yet. Be the first to comment!
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {comments.map((comment) => (
                <div key={comment._id} className="flex items-start space-x-3">
                  <img
                    src={
                      comment.avatar ||
                      "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=32&h=32&fit=crop&crop=face"
                    }
                    alt={comment.author || "User"}
                    className="w-8 h-8 rounded-full object-cover flex-shrink-0"
                  />
                  <div className="flex-1 min-w-0">
                    <div className="bg-gray-100 rounded-lg p-3 relative">
                      <p className="text-sm font-medium text-gray-900">
                        {comment.author || "Anonymous User"}
                      </p>
                      <p className="text-sm text-gray-700 mt-1">
                        {comment.content}
                      </p>

                      {/* Delete button for the comment's author */}
                      {comment.author === user.name && (
                        <button
                          onClick={async () => {
                            if (confirm("Delete this comment?")) {
                              await deleteComment(comment._id, post._id);
                              setComments((prev) =>
                                prev.filter((c) => c._id !== comment._id)
                              );
                            }
                          }}
                          className="absolute top-2 right-2 text-gray-400 hover:text-red-500 text-xs"
                        >
                          Delete
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Comment Input - Fixed at bottom */}
        <div className="p-6 border-t border-gray-200 bg-white flex-shrink-0">
          <form onSubmit={handleSubmit} className="space-y-3">
            <div className="flex items-start space-x-3">
              <img
                src={user.avatar}
                alt={user.name}
                className="w-8 h-8 rounded-full object-cover flex-shrink-0"
              />
              <div className="flex-1 min-w-0">
                <textarea
                  value={newComment}
                  onChange={(e) => setNewComment(e.target.value)}
                  placeholder="Write a comment..."
                  rows={3}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent resize-none"
                  disabled={submitting}
                />
              </div>
            </div>

            {/* Button Row */}
            <div className="flex justify-end">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                type="submit"
                disabled={!newComment.trim() || submitting}
                className="flex items-center space-x-2 bg-primary-600 text-white px-6 py-2 rounded-lg hover:bg-primary-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-primary-600"
              >
                <SafeIcon icon={FiSend} className="w-4 h-4" />
                <span>{submitting ? "Posting..." : "Post"}</span>
              </motion.button>
            </div>
          </form>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default CommentModal;
