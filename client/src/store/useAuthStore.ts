import { create } from 'zustand';
import { User } from '../types';
import { api } from '../services/api';

interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  isAuthModalOpen: boolean;
  authModalMode: 'login' | 'register';
  setAuth: (user: User, token: string) => void;
  logout: () => Promise<void>;
  checkAuth: () => Promise<void>;
  openAuthModal: (mode?: 'login' | 'register') => void;
  closeAuthModal: () => void;
}

export const useAuthStore = create<AuthState>((set, get) => ({
  user: null,
  token: localStorage.getItem('cp_access_token'),
  isAuthenticated: !!localStorage.getItem('cp_access_token'),
  isLoading: true,
  isAuthModalOpen: false,
  authModalMode: 'login',

  setAuth: (user, token) => {
    localStorage.setItem('cp_access_token', token);
    set({ user, token, isAuthenticated: true });
  },

  logout: async () => {
    try {
      await api.logout();
    } catch (e) {
      // Ignore network errors on logout
    }
    localStorage.removeItem('cp_access_token');
    set({ user: null, token: null, isAuthenticated: false });
  },

  checkAuth: async () => {
    const token = localStorage.getItem('cp_access_token');
    if (!token) {
      set({ user: null, isAuthenticated: false, isLoading: false });
      return;
    }

    try {
      const res = await api.getMe();
      if (res.data) {
        set({ user: res.data, isAuthenticated: true, isLoading: false });
      } else {
        localStorage.removeItem('cp_access_token');
        set({ user: null, isAuthenticated: false, isLoading: false });
      }
    } catch (err) {
      localStorage.removeItem('cp_access_token');
      set({ user: null, isAuthenticated: false, isLoading: false });
    }
  },

  openAuthModal: (mode = 'login') => set({ isAuthModalOpen: true, authModalMode: mode }),
  closeAuthModal: () => set({ isAuthModalOpen: false }),
}));
