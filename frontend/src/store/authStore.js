// store/authStore.js
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export const useAuthStore = create(
  persist(
    (set, get) => ({
      userId: null, // persisted
      user: null,   // full user (not persisted)
      role: null,   // user role (not persisted)

      setRole: (role) => set({ role }),

      login: (userData) => {
        set({
          userId: userData._id,
          user: userData,
        });
      },

      logout: () => {
        set({
          userId: null,
          user: null,
          role: null,
        });
      },

      updateUser: (updates) =>
        set((state) => ({
          user: { ...state.user, ...updates },
        })),
    }),
    {
      name: 'token', // localStorage key
      getStorage: () => localStorage,
      partialize: (state) => ({ userId: state.userId }), // persist only token
    }
  )
);
