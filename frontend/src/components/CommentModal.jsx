import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import SafeIcon from "../common/SafeIcon";
import * as FiIcons from "react-icons/fi";
import { useCommunity } from "../hooks/useCommunity";
import { useAuthStore } from "../store/authStore";
import { formatDistanceToNow } from "date-fns";

const { FiX, FiSend, FiMessageCircle, FiImage } = FiIcons;

const CommentModal = ({ post, onClose }) => {
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState("");
  const [commentImage, setCommentImage] = useState("");
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

  // ===== Image Handling =====
  const handleImageChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const formDataObj = new FormData();
    formDataObj.append("image", file);

    try {
      const response = await fetch("http://localhost:5000/api/upload", {
        method: "POST",
        body: formDataObj,
      });
      const data = await response.json();

      if (data.success && data.imageUrl) {
        setCommentImage(data.imageUrl);
      } else {
        alert("Image upload failed.");
      }
    } catch (error) {
      console.error("Image upload error:", error);
      alert("Could not upload image. Try again.");
    }
  };

  const removeImage = () => {
    setCommentImage("");
  };

  // ===== Submit Comment =====
  const handleSubmit = async (e) => {
    e.preventDefault();
    if ((!newComment.trim() && !commentImage) || submitting) return;

    setSubmitting(true);
    try {
      const comment = await addComment(post._id, {
        content: newComment,
        imageUrl: commentImage,
      });
      setComments((prev) => [...prev, comment]);
      setNewComment("");
      setCommentImage("");
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
        className="bg-white rounded-xl w-full max-w-2xl max-h-[90vh] flex flex-col overflow-hidden shadow-lg"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200 flex-shrink-0 bg-gray-50">
          <div className="flex items-center space-x-3">
            <img
              src={
                post.avatar ||
                "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=40&h=40&fit=crop&crop=face"
              }
              alt={post.author}
              className="w-10 h-10 rounded-full object-cover"
            />
            <div>
              <span className="font-semibold text-gray-900 block">
                {post.author}
              </span>
              <span className="text-xs text-gray-500">
                {formatDistanceToNow(new Date(post.createdAt), {
                  addSuffix: true,
                })}
              </span>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <SafeIcon icon={FiX} className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        {/* Post Preview */}
        <div className="p-6 border-b border-gray-200 bg-white flex-shrink-0">
          <h3 className="font-bold text-lg text-gray-900">{post.title}</h3>
          <p className="text-sm text-gray-700 mt-2">{post.content}</p>
        </div>

        {/* Comments List */}
        <div className="flex-1 overflow-y-auto p-6 bg-gray-50">
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
                    <div className="bg-white border border-gray-200 rounded-lg p-3 shadow-sm relative">
                      <div className="flex items-center justify-between">
                        <p className="text-sm font-semibold text-gray-900">
                          {comment.author || "Anonymous User"}
                        </p>
                        <span className="text-xs text-gray-400">
                          {formatDistanceToNow(new Date(comment.createdAt), {
                            addSuffix: true,
                          })}
                        </span>
                      </div>
                      <p className="text-sm text-gray-700 mt-1">
                        {comment.content}
                      </p>
                      {comment.imageUrl && (
                        <img
                          src={comment.imageUrl}
                          alt="Comment"
                          className="mt-2 rounded-lg border"
                        />
                      )}

                      {/* Delete button */}
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
                          className="absolute bottom-2 right-2 text-gray-400 hover:text-red-500 text-xs"
                        >
                          <FiIcons.FiTrash />
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Comment Input */}
        <div className="p-4 border-t border-gray-200 bg-white flex-shrink-0">
          <form
            onSubmit={handleSubmit}
            className="flex items-center space-x-3 w-full"
          >
            <img
              src={user.avatar}
              alt={user.name}
              className="w-8 h-8 rounded-full object-cover flex-shrink-0"
            />
            <div className="flex-1">
              <textarea
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                placeholder="Write a comment..."
                rows={1}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent resize-none"
                disabled={submitting}
              />
              {/* Image Preview */}
              {commentImage && (
                <div className="mt-2 relative w-20">
                  <img
                    src={commentImage}
                    alt="Preview"
                    className="w-full rounded-lg border"
                  />
                  <button
                    type="button"
                    onClick={removeImage}
                    className="absolute top-2 right-2 bg-white p-1 rounded-full shadow"
                  >
                    <SafeIcon icon={FiX} className="w-4 h-4 text-gray-600" />
                  </button>
                </div>
              )}
            </div>

            <input
              type="file"
              accept="image/*"
              id="comment-image-upload"
              style={{ display: "none" }}
              onChange={handleImageChange}
            />
            <button
              type="button"
              onClick={() =>
                document.getElementById("comment-image-upload").click()
              }
              className="p-2 text-gray-500 hover:text-gray-700 transition-colors"
            >
              <SafeIcon icon={FiImage} className="w-5 h-5" />
            </button>

            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              type="submit"
              disabled={(!newComment.trim() && !commentImage) || submitting}
              className="flex items-center bg-primary-600 text-white px-4 py-2 rounded-lg hover:bg-primary-700 transition-colors disabled:opacity-50"
            >
              <SafeIcon icon={FiSend} className="w-4 h-4" />
            </motion.button>
          </form>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default CommentModal;
