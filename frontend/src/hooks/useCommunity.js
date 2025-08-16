import { useState, useEffect } from 'react';
import { useAuthStore } from '../store/authStore';
import toast from 'react-hot-toast';

const API_BASE = `${import.meta.env.VITE_API_PORT}/api`;

export const useCommunity = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuthStore();
  const userId = user?._id || user?.id;

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
          author: {
            createBy: userId,
            name: user.name,
            avatar: user.avatar
          }
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

  const updatePost = async (postId, updatedData) => {
    try {
      const res = await fetch(`${API_BASE}/posts/${postId}`, {
        method: 'PATCH', // ✅ match backend route
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...updatedData,
          updatedBy: userId, // optional, for ownership checks
        }),
      });

      if (!res.ok) throw new Error('Failed to update post');
      const data = await res.json();

      // Update post in local state
      setPosts(prev => prev.map(p => (p._id === postId ? data : p)));

      toast.success('Post updated successfully!');
      return data;
    } catch (error) {
      console.error('Error updating post:', error);
      toast.error('Failed to update post');
      throw error;
    }
  };

  const deletePost = async (postId) => {
    try {
      const res = await fetch(`${API_BASE}/posts/${postId}`, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId }) // ✅ send user id if you check permissions
      });

      if (!res.ok) throw new Error('Failed to delete post');
      await res.json();

      // Remove post from local state
      setPosts(prev => prev.filter(p => p._id !== postId));

      toast.success('Post deleted successfully!');
    } catch (error) {
      console.error('Error deleting post:', error);
      toast.error('Failed to delete post');
    }
  };

  const toggleLike = async (postId) => {
    try {
      const res = await fetch(`${API_BASE}/posts/${postId}/like`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId })
      });
      if (!res.ok) throw new Error('Failed to toggle like');
      const updatedPost = await res.json();
      setPosts(prev => prev.map(p => p._id === postId ? updatedPost : p));
    } catch (error) {
      console.error('Error toggling like:', error);
      toast.error('Failed to update like');
    }
  };

  const addComment = async (postId, { content, imageUrl }) => {
    try {
      const res = await fetch(`${API_BASE}/posts/${postId}/comments`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          content,
          imageUrl,              // ✅ include image URL
          author: user.name,     // string
          avatar: user.avatar,   // string
        }),
      });

      if (!res.ok) throw new Error('Failed to add comment');
      const comment = await res.json();

      // Update comment count locally
      setPosts((prev) =>
        prev.map((p) =>
          p._id === postId
            ? { ...p, commentsCount: (p.commentsCount || 0) + 1 }
            : p
        )
      );

      toast.success('Comment added!');
      return comment;
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
          p._id === postId ? { ...p, commentsCount: (p.commentsCount || 1) - 1 } : p
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
      return post?.likedBy?.includes(userId);
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
    refreshPosts: fetchPosts,
    updatePost,
    deletePost
  };
};
