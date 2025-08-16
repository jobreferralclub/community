// store/authStore.js
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export const useAuthStore = create(
  persist(
    (set, get) => ({
      userId: null,   // persisted
      user: null,     // full user (not persisted)
      role: null,     // user role (not persisted)
      location: null, // 🌍 job location

      setRole: (role) => set({ role }),

      setLocation: (location) => set({ location }), // 🌍 add location setter

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
          location: null,
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
      partialize: (state) => ({
        userId: state.userId,
        location: state.location, // ✅ persist location too
      }),
    }
  )
);
