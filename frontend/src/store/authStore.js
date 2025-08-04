import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export const useAuthStore = create(
  persist(
    (set, get) => ({
      userId: null, // persist this as token
      user: null,   // full user info in memory (not persisted)

      login: (userData) => {
        set({
          userId: userData._id, // save only ID as token
          user: userData,       // full user (not persisted)
        });
      },

      logout: () => {
        set({
          userId: null,
          user: null,
        });
      },

      updateUser: (updates) =>
        set((state) => ({
          user: { ...state.user, ...updates },
        })),
    }),
    {
      name: 'token', // localStorage key will be "token"
      getStorage: () => localStorage,
      partialize: (state) => ({ userId: state.userId }), // Only persist userId
    }
  )
);
