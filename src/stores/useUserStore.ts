import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { AuthResponse as User } from '@/schema/schema_auth';

type UserState = {
  /* properties */
  accessToken: string | null; // will not persist
  user: Partial<User> | null;

  /* methods */
  /**
   * @summary Get the current user status.
   * @returns the current user status
   */
  getUserStatus: () => 'expired' | 'authenticated' | 'unauthenticated';
  /**
   * @summary Set the access token.
   * @description It sets the access token.
   * @param token The access token to set.
   */
  setAccessToken: (token: string | null) => void;
  /**
   * @summary Set the access token and refreshToken.
   * @description It sets the access token and refreshToken.
   * @param accessToken The access token to set.
   * @param refreshToken The refresh token to set.
   */
  setTokens: (accessToken: string, refreshToken: string) => void;
  /**
   * @summary Set the user.
   * @description It sets the user.
   * @param user The user to set.
   */
  setUser: (user: Partial<User>) => void;
  /**
   * @summary Clear the user store.
   * @description It clears the user store, removing the access token and user.
   */
  clear: () => void;
};

// This is the session class variable to cache the access token
// Need to be optimized in SSR mode.
let cachedAccessToken: string | null = null;

/**
 * @summary A Zustand store for managing user authentication.
 * @description Here we maintain the access token and user information.
 * It allows setting and getting the access token and user,
 * as well as clearing the store.
 * Note the access token is not persisted,
 */
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
