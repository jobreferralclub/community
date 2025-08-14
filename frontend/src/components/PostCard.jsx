import { useLocation } from 'react-router-dom';
import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import SafeIcon from '../common/SafeIcon';
import * as FiIcons from 'react-icons/fi';
import { useCommunity } from '../hooks/useCommunity';
import CommentModal from './CommentModal';
import toast from 'react-hot-toast';
import { useAuthStore } from '../store/authStore';

// Icons
const { FiHeart, FiMessageCircle, FiShare2, FiMoreHorizontal } = FiIcons;

const PostCard = ({ post }) => {
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const postIdFromUrl = queryParams.get('postid');

  const { toggleLike, deletePost, updatePost } = useCommunity(); // ✅ added here
  const { user } = useAuthStore();

  const [liked, setLiked] = useState(post.likedByUser || false);
  const [showComments, setShowComments] = useState(false);
  const [likeCount, setLikeCount] = useState(post.likes || 0);
  const [commentCount, setCommentCount] = useState(post.comments || 0);
  const [menuOpen, setMenuOpen] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  console.log(post);

  const menuRef = useRef(null);

  // Close menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    if (postIdFromUrl && postIdFromUrl === post._id) {
      setShowComments(true);
    }
    setLiked(post.likedBy?.includes(user?._id) || false);
    setLikeCount(post.likes || 0);
    setCommentCount(post.comments || 0);
  }, [post, user?._id, postIdFromUrl, post._id]);

  const handleLike = async () => {
    try {
      const wasLiked = liked;
      setLiked(!liked);
      setLikeCount((prev) => (wasLiked ? prev - 1 : prev + 1));
      await toggleLike(post._id);
    } catch (error) {
      setLiked(liked);
      setLikeCount((prev) => (liked ? prev + 1 : prev - 1));
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
        try {
          await navigator.share(shareContent);
          toast.success('Post shared successfully!');
          return;
        } catch (shareError) {
          if (shareError.name === 'AbortError') return;
          console.warn('Web Share API failed:', shareError);
        }
      }

      const textToShare = `${post.title}\n\n${post.content}\n\nShared from JobReferral.Club\n${postUrl}`;
      if (navigator.clipboard?.writeText) {
        await navigator.clipboard.writeText(textToShare);
        toast.success('Post content copied to clipboard!');
      } else {
        fallbackCopyToClipboard(textToShare);
      }
    } catch (error) {
      console.error('Error sharing post:', error);
      toast.error('Failed to share post. Please try again.');
    }
  };

  const fallbackCopyToClipboard = (text) => {
    try {
      const textArea = document.createElement('textarea');
      textArea.value = text;
      textArea.style.position = 'fixed';
      textArea.style.left = '-999999px';
      textArea.style.top = '-999999px';
      document.body.appendChild(textArea);
      textArea.select();
      document.execCommand('copy');
      document.body.removeChild(textArea);
      toast.success('Post content copied to clipboard!');
    } catch (err) {
      console.error('Fallback copy failed:', err);
    }
  };

  const getPostTypeColor = (type) => {
    switch (type) {
      case 'job-posting':
        return 'bg-blue-100 text-blue-800';
      case 'success-story':
        return 'bg-green-100 text-green-800';
      case 'discussion':
        return 'bg-purple-100 text-purple-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  // ✅ New edit function
  const handleEdit = async () => {
    const newTitle = prompt('Edit post title:', post.title);
    const newContent = prompt('Edit post content:', post.content);

    if (newTitle !== null && newContent !== null) {
      try {
        await updatePost(post._id, { ...post, title: newTitle, content: newContent });
        toast.success('Post updated successfully!');
      } catch (error) {
        toast.error('Failed to update post');
      }
    }
    setMenuOpen(false);
  };

  // ✅ New delete function
  const handleDelete = async () => {
    if (window.confirm('Are you sure you want to delete this post?')) {
      await deletePost(post._id);
    }
    setMenuOpen(false);
  };

  return (
    <>
      <motion.div
        whileHover={{ y: -2 }}
        className="bg-white rounded-xl p-6 shadow-sm border border-gray-200 hover:shadow-md transition-all"
      >
        {/* Header */}
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center space-x-3">
            <img
              src={post.avatar || 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=48&h=48&fit=crop&crop=face'}
              alt={post.author}
              className="w-12 h-12 rounded-full object-cover"
            />
            <div>
              <h4 className="font-semibold text-gray-900">{post.author}</h4>
              <p className="text-sm text-gray-500">
                {post.timestamp ||
                  new Date(post.createdAt).toLocaleString('en-US', {
                    year: 'numeric',
                    month: 'short',
                    day: 'numeric',
                    hour: 'numeric',
                    minute: '2-digit',
                    hour12: true,
                  })}
              </p>
            </div>
          </div>

          {/* Dropdown Menu */}
          <div className="flex items-center space-x-2 relative" ref={menuRef}>
            <span className={`px-2 py-1 rounded-full text-xs font-medium ${getPostTypeColor(post.type)}`}>
              {post.type?.replace('-', ' ') || 'discussion'}
            </span>
            {post.author == user._id && (<button
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              onClick={() => setMenuOpen((prev) => !prev)}
            >
              <SafeIcon icon={FiMoreHorizontal} className="w-4 h-4 text-gray-400" />
            </button>)}

            {menuOpen && (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.15 }}
                className="absolute right-0 mt-10 w-36 bg-white rounded-lg shadow-lg border border-gray-200 z-50"
              >
                <button
                  onClick={() => setEditModalOpen(true)}
                  className="block w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-100"
                >
                  ✏️ Edit
                </button>
                <button
                  onClick={() => setDeleteModalOpen(true)}
                  className="block w-full text-left px-4 py-2 text-red-600 hover:bg-red-50"
                >
                  🗑 Delete
                </button>
              </motion.div>
            )}
          </div>
        </div>

        {/* Content */}
        <div className="mb-4">
          <h3 className="text-lg font-semibold text-gray-900 mb-2">{post.title}</h3>
          <p className="text-gray-700">{post.content}</p>
        </div>

        {/* Image Preview */}
        {post.imageUrl && (
          <div className="mb-4 relative overflow-visible">
            <img
              src={post.imageUrl}
              alt="Post attachment"
              className="block w-full max-h-96 object-contain rounded-lg border border-gray-300"
            />
          </div>
        )}

        {/* Tags */}
        {post.tags?.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-4">
            {post.tags.map((tag) => (
              <span key={tag} className="px-2 py-1 bg-gray-100 text-gray-600 rounded-md text-sm">
                #{tag}
              </span>
            ))}
          </div>
        )}

        {/* Links */}
        {post.links?.length > 0 && (
          <div className="flex flex-col gap-1 mb-4">
            {post.links.map((link) => (
              <a
                key={link}
                href={link}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 hover:underline break-all text-sm"
              >
                {link}
              </a>
            ))}
          </div>
        )}

        {/* Actions */}
        <div className="flex items-center justify-between pt-4 border-t border-gray-100">
          <div className="flex items-center space-x-6">
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleLike}
              className={`flex items-center space-x-2 ${liked ? 'text-red-600' : 'text-gray-500 hover:text-red-600'}`}
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
          </div>
        </div>
      </motion.div>

      {/* Edit Modal */}
      {editModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white p-6 rounded-lg w-96 shadow-lg">
            <h2 className="text-lg font-semibold mb-4">Edit Post</h2>
            <input
              type="text"
              defaultValue={post.title}
              onChange={(e) => post.title = e.target.value}
              className="w-full border border-gray-300 rounded p-2 mb-3"
            />
            <textarea
              defaultValue={post.content}
              onChange={(e) => post.content = e.target.value}
              className="w-full border border-gray-300 rounded p-2 mb-4"
              rows="4"
            />
            <div className="flex justify-end space-x-2">
              <button
                onClick={() => setEditModalOpen(false)}
                className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300"
              >
                Cancel
              </button>
              <button
                onClick={async () => {
                  await updatePost(post._id, { ...post });
                  toast.success("Post updated!");
                  setEditModalOpen(false);
                }}
                className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deleteModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white p-6 rounded-lg w-80 shadow-lg">
            <h2 className="text-lg font-semibold mb-4">Delete Post</h2>
            <p className="mb-4">Are you sure you want to delete this post? This action cannot be undone.</p>
            <div className="flex justify-end space-x-2">
              <button
                onClick={() => setDeleteModalOpen(false)}
                className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300"
              >
                Cancel
              </button>
              <button
                onClick={async () => {
                  await deletePost(post._id);
                  toast.success("Post deleted!");
                  setDeleteModalOpen(false);
                }}
                className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}


      {showComments && <CommentModal post={post} onClose={() => setShowComments(false)} />}
    </>
  );
};

export default PostCard;
