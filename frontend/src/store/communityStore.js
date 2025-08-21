import { create } from 'zustand';
import { fetchPosts, createPost } from '../api/posts';

export const useCommunityStore = create((set) => ({
  posts: [],

  // Fetch all posts from backend
  loadPosts: async () => {
    try {
      const data = await fetchPosts();
      console.log("Loaded posts data:", data);
      set({ posts: data.reverse() }); // Latest posts first
    } catch (err) {
      console.error('Failed to load posts:', err);
    }
  },

  // Add a new post to backend
  addPost: async (newPost) => {
    try {
      const createdPost = await createPost(newPost);
      set((state) => ({ posts: [createdPost, ...state.posts] }));
    } catch (err) {
      console.error('Failed to create post:', err);
    }
  },

  // Optimistic Like (only frontend update for now)
  likePost: (postId) =>
    set((state) => ({
      posts: state.posts.map((post) =>
        post._id === postId
          ? { ...post, likes: (post.likes || 0) + 1 }
          : post
      ),
    })),

  // Optimistic Comment (for frontend only)
  addComment: (postId) =>
    set((state) => ({
      posts: state.posts.map((post) =>
        post._id === postId
          ? { ...post, comments: (post.comments || 0) + 1 }
          : post
      ),
    })),
}));
