import { useLocation } from 'react-router-dom';
import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import SafeIcon from '../../common/SafeIcon';
import * as FiIcons from 'react-icons/fi';
import { useCommunity } from '../../hooks/useCommunity';
import CommentModal from './CommentModal';
import toast from 'react-hot-toast';
import { useAuthStore } from '../../store/authStore';

const { FiHeart, FiMessageCircle, FiShare2, FiMoreHorizontal } = FiIcons;

const PostCard = ({ post }) => {
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const postIdFromUrl = queryParams.get('postid');

  const [liked, setLiked] = useState(post.likedByUser || false);
  const [showComments, setShowComments] = useState(false);
  const [likeCount, setLikeCount] = useState(post.likes || 0);
  const [commentCount, setCommentCount] = useState(post.comments || 0);
  const [showMenu, setShowMenu] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [editData, setEditData] = useState({ title: post.title, content: post.content });

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
      case 'job-posting': return 'bg-blue-800 text-blue-300';
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

  return (
    <>
      {/* Post Card */}
      <motion.div
        whileHover={{ y: -2 }}
        className="bg-gray-900 rounded-xl p-6 shadow-sm border border-gray-700 hover:shadow-md transition-all text-gray-100"
      >
        {/* Header */}
        <div className="flex items-start justify-between mb-4 relative" ref={menuRef}>
          <div className="flex items-center space-x-3">
            <img
              src={(post.createdBy?.avatar == null)? "/default-avatar.jpg": post.createdBy?.avatar}
              alt={post.author}
              className="w-12 h-12 rounded-full object-cover"
            />
            <div>
              <h4 className="font-semibold text-white">{post.author}</h4>
              <p className="text-sm text-gray-400">
                {post.timestamp || new Date(post.createdAt).toLocaleDateString()}
              </p>
            </div>
          </div>
          <div className="flex items-center space-x-2 relative">
            <span className={`px-2 py-1 rounded-full text-xs font-medium ${getPostTypeColor(post.type)}`}>
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
          <h3 className="text-lg font-semibold text-white mb-2">{post.title}</h3>
          <p className="text-gray-300">{post.content}</p>
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
              className={`flex items-center space-x-2 transition-colors ${liked ? 'text-red-600' : 'text-gray-500 hover:text-red-600'
                }`}
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
