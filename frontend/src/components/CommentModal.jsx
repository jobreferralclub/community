import React, { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import SafeIcon from "../common/SafeIcon";
import * as FiIcons from "react-icons/fi";
import { useCommunity } from "../hooks/useCommunity";
import { useAuthStore } from "../store/authStore";
import { formatDistanceToNow } from "date-fns";
import Picker from "@emoji-mart/react";
import data from "@emoji-mart/data";

const { FiX, FiSend, FiMessageCircle, FiImage, FiTrash, FiSmile } = FiIcons;

const CommentModal = ({ post, onClose }) => {
  // ===== State =====
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState("");
  const [commentImage, setCommentImage] = useState("");
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);

  const emojiPickerRef = useRef(null);
  const emojiButtonRef = useRef(null);

  const { getComments, addComment, deleteComment } = useCommunity();
  const { user } = useAuthStore();

  // ===== Fetch Comments =====
  useEffect(() => {
    fetchComments();
  }, [post._id]);

  const fetchComments = async () => {
    setLoading(true);
    const data = await getComments(post._id);
    setComments(data);
    setLoading(false);
  };

  // ===== Emoji Handling =====
  const handleEmojiSelect = (emoji) => {
    setNewComment((prev) => prev + emoji.native);
  };

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (
        emojiPickerRef.current &&
        !emojiPickerRef.current.contains(e.target) &&
        !emojiButtonRef.current.contains(e.target)
      ) {
        setShowEmojiPicker(false);
      }
    };
    if (showEmojiPicker) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [showEmojiPicker]);

  // ===== Image Upload =====
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

  const removeImage = () => setCommentImage("");

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
      className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center p-4 z-50"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <motion.div
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.95, opacity: 0 }}
        className="bg-gray-900 rounded-xl shadow-lg max-w-3xl w-full max-h-[90vh] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b border-gray-700 p-6 flex-shrink-0">
          <div className="flex items-center space-x-3">
            <img
              src={post.avatar || "https://via.placeholder.com/40"}
              alt={post.author}
              className="w-10 h-10 rounded-full object-cover"
            />
            <div>
              <span className="block font-semibold text-white">
                {post.author}
              </span>
              <span className="text-xs text-gray-400">
                {formatDistanceToNow(new Date(post.createdAt), {
                  addSuffix: true,
                })}
              </span>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-800 rounded-lg transition-colors"
          >
            <SafeIcon icon={FiX} className="w-5 h-5 text-gray-400" />
          </button>
        </div>

        {/* Post Preview */}
        <div className="border-b border-gray-700 p-6 flex-shrink-0 bg-gray-800">
          <h3 className="text-lg font-bold text-white">{post.title}</h3>
          <p className="mt-2 text-gray-300">{post.content}</p>
        </div>

        {/* Comments List */}
        <div className="flex-1 p-6 overflow-y-auto bg-gray-900 text-gray-300">
          {loading ? (
            <div className="flex items-center justify-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-500"></div>
            </div>
          ) : comments.length === 0 ? (
            <div className="text-center py-8">
              <SafeIcon
                icon={FiMessageCircle}
                className="w-12 h-12 text-gray-600 mx-auto mb-3"
              />
              <p className="text-gray-400">No comments yet. Be the first!</p>
            </div>
          ) : (
            <div className="space-y-4">
              {comments.map((comment) => (
                <div key={comment._id} className="flex items-start space-x-3">
                  <img
                    src={
                      comment.avatar || "https://via.placeholder.com/32"
                    }
                    alt={comment.author || "User"}
                    className="w-8 h-8 rounded-full object-cover flex-shrink-0"
                  />
                  <div className="flex-1 min-w-0">
                    <div className="bg-gray-800 border border-gray-700 rounded-lg p-3 shadow-sm relative">
                      <div className="flex items-center justify-between">
                        <p className="text-sm font-semibold text-white">
                          {comment.author || "Anonymous"}
                        </p>
                        <span className="text-xs text-gray-500">
                          {formatDistanceToNow(new Date(comment.createdAt), {
                            addSuffix: true,
                          })}
                        </span>
                      </div>
                      <p className="text-sm text-gray-300 mt-1">
                        {comment.content}
                      </p>
                      {comment.imageUrl && (
                        <img
                          src={comment.imageUrl}
                          alt="Comment"
                          className="mt-2 rounded-lg border border-gray-700"
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
                          <FiTrash />
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
        <div className="p-4 border-t border-gray-700 bg-gray-900 flex-shrink-0 relative">
          <form
            onSubmit={handleSubmit}
            className="flex items-center space-x-3 w-full"
          >
            <img
              src={user?.avatar || "https://via.placeholder.com/32"}
              alt={user?.name || "User"}
              className="w-8 h-8 rounded-full object-cover flex-shrink-0"
            />

            <div className="flex-1 relative">
              <textarea
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                placeholder="Write a comment..."
                rows={1}
                className="w-full p-3 border border-gray-700 bg-gray-800 text-gray-100 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent resize-none"
                disabled={submitting}
              />

              {/* Image Preview */}
              {commentImage && (
                <div className="mt-2 relative w-20">
                  <img
                    src={commentImage}
                    alt="Preview"
                    className="w-full rounded-lg border border-gray-700"
                  />
                  <button
                    type="button"
                    onClick={removeImage}
                    className="absolute top-2 right-2 bg-gray-900 p-1 rounded-full shadow"
                  >
                    <SafeIcon icon={FiX} className="w-4 h-4 text-gray-400" />
                  </button>
                </div>
              )}
            </div>

            {/* Emoji Button */}
            <div className="relative">
              <button
                ref={emojiButtonRef}
                type="button"
                onClick={() => setShowEmojiPicker((prev) => !prev)}
                className="p-2 text-gray-400 hover:text-gray-300 transition-colors"
              >
                <SafeIcon icon={FiSmile} className="w-5 h-5" />
              </button>

              {showEmojiPicker && (
                <div
                  ref={emojiPickerRef}
                  className="absolute bottom-12 right-0 z-50"
                >
                  <Picker data={data} onEmojiSelect={handleEmojiSelect} />
                </div>
              )}
            </div>

            {/* Image Button */}
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
              className="p-2 text-gray-400 hover:text-gray-300 transition-colors"
            >
              <SafeIcon icon={FiImage} className="w-5 h-5" />
            </button>

            {/* Submit Button */}
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
