import axios, { AxiosInstance } from 'axios';

import getDeviceId from '@/lib/deviceid';
import logError from '@/lib/logError';
import { throwWithUserValidationErr, throwWithValidationErr } from '@/lib/throwWithErr';
import {
  RefreshTokenBodySchema,
  TokenRefreshResponse,
  TokenRefreshResponseSchema,
} from '@/schema/schema_auth';
import useUserStore from '@/stores/useUserStore';

const baseURL = import.meta.env.VITE_API_BASE_URL || '/api';
const headers = {
  'Content-Type': 'application/json',
};
const timeout = 30000; // 30s
const cachedAccessTokenTTL = 10 * 1000; // 10 seconds

let anonymousAxios: AxiosInstance | null = null;

let authAxios: AxiosInstance | null = null;

let optAxios: AxiosInstance | null = null;

const interceptorIds = {
  anonymous: { request: -1, response: -1 },
  auth: { request: -1, response: -1 },
  opt: { request: -1, response: -1 },
};

/**
 * @summary A `conditional variable` like to handle the atomic refresh token process.
 */
let isRefreshing: Promise<string | null> | null = null;

/**
 * @summary A variable to keep the last refresh time.
 */
let lastRefreshTime = 0;

let cachedAccessToken: string | null = null;

/**
 * @summary Help to handle the refresh a token.
 */
const refreshHelper = async (): Promise<string | null> => {
  // Get the snapshot of the user store
  const { user, setTokens, clear } = useUserStore.getState();

  const refreshToken = user?.refreshToken;
  if (!refreshToken) return null;

  // Try to get the device ID and validate the parameters, then send the request.
  const deviceId = await getDeviceId();
  const refreshBody = RefreshTokenBodySchema.safeParse({
    deviceId,
    refreshToken,
  });
  if (!refreshBody.success) {
    clear();
    return throwWithUserValidationErr('Invalid refresh token body:', refreshBody.error);
  }
  const validatedBody = refreshBody.data;

  // Send the request to refresh the token
  try {
    const response = await anonymousAxios!.post('/auth/refresh', validatedBody);
    const responseData = TokenRefreshResponseSchema.safeParse(response.data);
    if (!responseData.success) {
      clear();
      return throwWithValidationErr('Invalid token refresh response:', responseData.error);
    }
    const validatedResponse: TokenRefreshResponse = responseData.data;
    // Then set the token and user to the store.
    setTokens(validatedResponse.accessToken, validatedResponse.refreshToken);

    // Update the cache.
    cachedAccessToken = validatedResponse.accessToken;
    lastRefreshTime = Date.now();

    // Return the access token.
    return validatedResponse.accessToken;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    // Clear the user store if there is an error
    clear();
    logError(error, 'Error on refresh the token.');
    return null;
  }
};

/**
 * @summary A function to fetch the access token.
 */
const fetchAccessToken = async (retry: number): Promise<string | null> => {
  // If retry is 0, return null
  if (retry <= 0) return null;

  // Get the snapshot of the user store
  const { getUserStatus, accessToken, setAccessToken } = useUserStore.getState();
  const userStatus = getUserStatus();

  // State machine to handle by user status
  switch (userStatus) {
    // If the user is authenticated, return it, otherwise retry recursively.
    case 'authenticated': {
      if (accessToken) return accessToken;
      setAccessToken(null);
      return await fetchAccessToken(retry - 1);
    }

    // If the token is expired, refresh it.
    case 'expired': {
      retry--;

      // To use the cached access token if it is still valid
      if (Date.now() - lastRefreshTime < cachedAccessTokenTTL) {
        return cachedAccessToken;
      }

      if (!isRefreshing) {
        isRefreshing = refreshHelper().finally(() => {
          isRefreshing = null; // Reset the conditional variable after the refresh is done
        });
      }
      return await isRefreshing;
    }

    // If the user is not authenticated, return null
    default:
      return null;
  }
};

/**
 * @summary Handle the error from the Axios response.
 * @description Retry the 498 expired token error, and handle the 401, 403 errors.
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const handleError = async (error: any) => {
  // Retry the request on 498 expired token error
  if (error.response?.status === 498) {
    try {
      const newToken = await fetchAccessToken(1);
      if (!newToken) throw { response: { status: 401, data: 'Unauthorized' } };

      const originalRequest = error.config;
      originalRequest.headers.Authorization = `Bearer ${newToken}`;
      return await authAxios!(originalRequest);
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (err) {
      throw { response: { status: 401, data: 'Unauthorized' } };
    }
  }

  // Check if there is a bypass header FourZeroOne(FZO) interceptor
  const isBypassFZO = error.config?.headers?.['X-Bypass-401-Interceptor'];

  // Handle the 401, 403 error, also the error from 498 handler branch
  if ((error.response?.status === 401 && !isBypassFZO) || error.response?.status === 403) {
    const { clear } = useUserStore.getState();
    clear();
    // Redirect to the login page and clear the history
    const currentPath = window.location.pathname + window.location.search;
    window.location.replace(`/user/login?redirectTo=${encodeURIComponent(currentPath)}`);
    return Promise.reject(error);
  }

  // Other errors
  return Promise.reject(error);
};

// For keeping the single instance
const createAxiosInstances = () => {
  if (!anonymousAxios) {
    anonymousAxios = axios.create({
      baseURL,
      headers,
      timeout,
      withCredentials: false,
    });

    // A response interceptor to handle errors
    interceptorIds.anonymous.response = anonymousAxios.interceptors.response.use(
      (response) => response,
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      async (error: any) => {
        return await handleError(error);
      },
    );
  }

  if (!authAxios) {
    authAxios = axios.create({
      baseURL,
      headers,
      timeout,
      withCredentials: true,
    });

    // A request interceptor to add the Authorization header
    // It also handles accessToken refreshing
    interceptorIds.auth.request = authAxios.interceptors.request.use(
      async (config) => {
        // Try to get the access token, retry at most twice in case of expired access token
        const accessToken = await fetchAccessToken(2);

        // Reject if the access token is not available
        if (!accessToken)
          return Promise.reject({
            response: { status: 401, data: 'Unauthorized' },
          });

        // Otherwise, set the header and pass the request
        config.headers.Authorization = `Bearer ${accessToken}`;

        return config;
      },
      // Handle errors
      (error) => Promise.reject(error),
    );

    // A response interceptor to handle errors
    // Mainly it handles the 498 expired token error
    interceptorIds.auth.response = authAxios.interceptors.response.use(
      (response) => response,
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      async (error: any) => {
        return await handleError(error);
      },
    );
  }

  if (!optAxios) {
    optAxios = axios.create({
      baseURL,
      headers,
      timeout,
      withCredentials: true,
    });

    // A request interceptor try to add the Authorization header
    interceptorIds.opt.request = optAxios.interceptors.request.use(
      async (config) => {
        // Try to get the access token, retry at most twice in case of expired access token
        const accessToken = await fetchAccessToken(2);
        // Set the header and pass the request
        if (accessToken) config.headers.Authorization = `Bearer ${accessToken}`;
        return config;
      },
      // Handle errors
      (error) => Promise.reject(error),
    );

    // A response interceptor to handle errors
    // Mainly it handles the 498 expired token error
    interceptorIds.opt.response = optAxios.interceptors.response.use(
      (response) => response,
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      async (error: any) => {
        return await handleError(error);
      },
    );
  }
};
createAxiosInstances();

if (import.meta.hot) {
  import.meta.hot.accept(() => {
    if (anonymousAxios) {
      anonymousAxios.interceptors.response.eject(interceptorIds.anonymous.response);
    }
    if (authAxios) {
      authAxios.interceptors.request.eject(interceptorIds.auth.request);
      authAxios.interceptors.response.eject(interceptorIds.auth.response);
    }
    if (optAxios) {
      optAxios.interceptors.request.eject(interceptorIds.opt.request);
      optAxios.interceptors.response.eject(interceptorIds.opt.response);
    }

    createAxiosInstances();
  });
}

export { anonymousAxios, authAxios, optAxios };
