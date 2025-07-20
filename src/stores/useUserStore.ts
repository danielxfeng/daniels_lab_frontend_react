import { create } from 'zustand';
import { persist } from 'zustand/middleware';

import { AuthResponse as User } from '@/schema/schema_auth';

type UserState = {
  accessToken: string | null; // will not persist
  user: Partial<User> | null;

  getUserStatus: () => 'expired' | 'authenticated' | 'unauthenticated';
  setAccessToken: (token: string | null) => void;
  setTokens: (accessToken: string, refreshToken: string) => void;
  setUser: (user: Partial<User>) => void;
  clear: () => void;
};

// This is the session class variable to cache the access token
// Need to be optimized in SSR mode.
let cachedAccessToken: string | null = null;

export const useUserStore = create<UserState>()(
  persist(
    (set, get) => ({
      accessToken: cachedAccessToken,
      user: null,

      getUserStatus: () => {
        const { accessToken, user } = get();
        if (accessToken) return 'authenticated';
        if (user) return 'expired';
        return 'unauthenticated';
      },
      setAccessToken: (token) => {
        cachedAccessToken = token; // Cache the access token for the current session
        set({ accessToken: token });
      },
      setTokens: (accessToken, refreshToken) => {
        set((state) => ({ accessToken, user: { ...state.user, refreshToken } }));
      },

      // We remove the accessToken for safety
      setUser: (user) => {
        const { accessToken, ...rest } = user;
        void accessToken; // Ignore accessToken in the user object
        set({ user: rest });
      },

      clear: () => set({ accessToken: null, user: null }),
    }),
    {
      name: 'user-store',
      // Only persist the user object, not the access token
      partialize: (state) => ({ user: state.user }),
    },
  ),
);

export default useUserStore;
export type { UserState };
