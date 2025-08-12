import { useState, useEffect } from 'react';
import { useAuthStore } from '../store/authStore';
import toast from 'react-hot-toast';

const API_BASE = 'http://localhost:5001/api'; // or your live server URL

export const useCommunity = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuthStore();

  useEffect(() => {
    fetchPosts();
  }, []);

  const fetchPosts = async () => {
    try {
      setLoading(true);
      const res = await fetch(`${API_BASE}/posts`);
      if (!res.ok) throw new Error('Failed to load posts');
      const data = await res.json();
      setPosts(data);
    } catch (err) {
      console.error('Error fetching posts:', err);
      toast.error('Failed to load posts');
    } finally {
      setLoading(false);
    }
  };

  const createPost = async (postData) => {
    try {
      const res = await fetch(`${API_BASE}/posts`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...postData,
          author: user.name,
          avatar: user.avatar
        })
      });
      if (!res.ok) throw new Error('Failed to create post');
      const data = await res.json();
      setPosts(prev => [data, ...prev]);
      toast.success('Post created successfully!');
      return data;
    } catch (error) {
      console.error('Error creating post:', error);
      toast.error('Failed to create post');
      throw error;
    }
  };

  const toggleLike = async (postId) => {
    try {
      const res = await fetch(`${API_BASE}/posts/${postId}/like`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId: userId })
      });
      if (!res.ok) throw new Error('Failed to toggle like');
      const data = await res.json();
      setPosts(prev => prev.map(p => p._id === postId ? data : p));
    } catch (error) {
      console.error('Error toggling like:', error);
      toast.error('Failed to update like');
    }
  };

  const addComment = async (postId, content) => {
    try {
      const res = await fetch(`${API_BASE}/posts/${postId}/comments`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          postId,
          content,
          author: user.name,
          avatar: user.avatar
        })
      });
      if (!res.ok) throw new Error('Failed to add comment');
      const data = await res.json();

      setPosts(prev =>
        prev.map(p =>
          p._id === postId ? { ...p, comments: (p.comments || 0) + 1 } : p
        )
      );

      toast.success('Comment added!');
      return data;
    } catch (error) {
      console.error('Error adding comment:', error);
      toast.error('Failed to add comment');
      throw error;
    }
  };

  const getComments = async (postId) => {
    try {
      const res = await fetch(`${API_BASE}/posts/${postId}/comments`);
      if (!res.ok) throw new Error('Failed to load comments');
      return await res.json();
    } catch (error) {
      console.error('Error loading comments:', error);
      toast.error('Failed to load comments');
      return [];
    }
  };

  const deleteComment = async (commentId, postId) => {
    try {
      const res = await fetch(`${API_BASE}/posts/comments/${commentId}`, {
        method: 'DELETE'
      });
      if (!res.ok) throw new Error('Failed to delete comment');

      await res.json();

      setPosts(prev =>
        prev.map(p =>
          p._id === postId ? { ...p, comments: (p.comments || 0) - 1 } : p
        )
      );

      toast.success('Comment deleted!');
    } catch (error) {
      console.error('Error deleting comment:', error);
      toast.error('Failed to delete comment');
    }
  };

  const checkUserLike = (postId) => {
    try {
      const post = posts.find(p => p._id === postId);
      return post?.likedBy?.includes(userId); // or user._id
    } catch {
      return false;
    }
  };

  return {
    posts,
    loading,
    createPost,
    toggleLike,
    addComment,
    getComments,
    deleteComment,
    checkUserLike,
    refreshPosts: fetchPosts
  };
};
