import { create } from 'zustand';

export const useAuthStore = create((set) => ({
  user: {
    id: '1',
    name: 'Alex Johnson',
    email: 'alex@jobreferral.club',
    role: 'admin',
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face',
    points: 2450,
    badges: ['Top Referrer', 'Community Helper', 'Mentor'],
    tier: 'premium'
  },
  login: (userData) => set({ user: userData }),
  logout: () => set({ user: null }),
  updateUser: (updates) => set((state) => ({ 
    user: { ...state.user, ...updates } 
  })),
}));