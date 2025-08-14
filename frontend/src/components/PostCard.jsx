import { useLocation } from 'react-router-dom';
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import SafeIcon from '../common/SafeIcon';
import * as FiIcons from 'react-icons/fi';
import { useCommunity } from '../hooks/useCommunity';
import CommentModal from './CommentModal';
import toast from 'react-hot-toast';
import { useAuthStore } from '../store/authStore';

const { FiHeart, FiMessageCircle, FiShare2, FiMoreHorizontal } = FiIcons;

const PostCard = ({ post }) => {
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const postIdFromUrl = queryParams.get('postid');

  const [liked, setLiked] = useState(post.likedByUser || false);
  const [showComments, setShowComments] = useState(false);
  const [likeCount, setLikeCount] = useState(post.likes || 0);
  const [commentCount, setCommentCount] = useState(post.comments || 0);
  const { toggleLike } = useCommunity();
  const { user } = useAuthStore();

  useEffect(() => {
    if (postIdFromUrl && postIdFromUrl === post._id) {
      setShowComments(true);
    }
  }, [postIdFromUrl, post._id]);

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
      const shareContent = { title: post.title, text: `${post.title}\n\n${post.content}`, url: postUrl };

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
      const successful = document.execCommand('copy');
      document.body.removeChild(textArea);
      if (successful) toast.success('Post content copied to clipboard!');
      else throw new Error('Copy command failed');
    } catch (err) {
      console.error('Fallback copy failed:', err);
    }
  };

  const getPostTypeColor = (type) => {
    switch (type) {
      case 'job-posting': return 'bg-blue-100 text-blue-800';
      case 'success-story': return 'bg-green-100 text-green-800';
      case 'discussion': return 'bg-purple-100 text-purple-800';
      default: return 'bg-gray-100 text-gray-800';
    }
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
                {post.timestamp || new Date(post.createdAt).toLocaleDateString()}
              </p>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <span className={`px-2 py-1 rounded-full text-xs font-medium ${getPostTypeColor(post.type)}`}>
              {post.type?.replace('-', ' ') || 'discussion'}
            </span>
            <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
              <SafeIcon icon={FiMoreHorizontal} className="w-4 h-4 text-gray-400" />
            </button>
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
          </div>
        </div>
      </motion.div>

      {/* Comments Modal */}
      {showComments && (
        <CommentModal post={post} onClose={() => setShowComments(false)} />
      )}
    </>
  );
};

export default PostCard;
