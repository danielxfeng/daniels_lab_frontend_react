import axios from 'axios';
import useUserStore from '@/stores/useUserStore';
import getDeviceId from './deviceid';
import { AuthResponse, AuthResponseSchema, RefreshTokenBodySchema } from '@/schema/schema_auth';

const baseURL = import.meta.env.VITE_API_BASE_URL || 'https://localhost:3000';
const headers = {
  'Content-Type': 'application/json',
};
const timeout = 30000; // 30s

/**
 * @summary A single skeleton for a Axios instance without authentication.
 */
const anonymousAxios = axios.create({
  baseURL,
  headers,
  timeout,
  withCredentials: false,
});

/**
 * @summary A single skeleton for a Axios instance with authentication.
 */
const authAxios = axios.create({
  baseURL,
  headers,
  timeout,
  withCredentials: true,
});

/**
 * @summary A function to fetch the access token.
 * @description
 * This function is used to fetch the access token from the server.
 * It uses a state machine to handle the different user statuses:
 * - authenticated: The user is authenticated and the access token is available.
 * - expired: The access token is expired and then refresh to get the access token.
 * - unauthenticated: The user is not authenticated and the access token is not available.
 * @param retry - The number of retries to get the access token.
 * @returns the access token or null if it fails.
 */
const fetchAccessToken = async (retry: number): Promise<string | null> => {
  // If retry is 0, return null
  if (retry <= 0) return null;

  // Get the snapshot of the user store
  const { getUserStatus, accessToken, user, setUser, setAccessToken, clear } =
    useUserStore.getState();
  const userStatus = getUserStatus();

  // State machine to handle by user status
  switch (userStatus) {
    // If the user is authenticated, return it, otherwise retry recursively.
    case 'authenticated': {
      if (accessToken) return accessToken;
      setAccessToken(null);
      return await fetchAccessToken(retry - 1);
    }

    // If the token is expired, try to refresh it.
    case 'expired': {
      // return null if there is not a refresh token.
      const refreshToken = user?.refreshToken;
      if (!refreshToken) return null;

      retry--;

      // Try to get the device ID and validate the parameters, then send the request.
      const deviceId = await getDeviceId();
      const refreshBody = RefreshTokenBodySchema.safeParse({
        deviceId,
        refreshToken,
      });
      if (!refreshBody.success) {
        clear();
        return null;
      }
      const validatedBody = refreshBody.data;

      // Send the request to refresh the token
      const response = await anonymousAxios.post('/auth/refresh', validatedBody);

      // Parse the response and validate it.
      if (response.status !== 200) {
        clear();
        return null;
      }
      const responseData = AuthResponseSchema.safeParse(response.data);
      if (!responseData.success) {
        clear();
        return null;
      }
      const validatedResponse: AuthResponse = responseData.data;

      // Then set the token and user to the store.
      setAccessToken(validatedResponse.accessToken);
      setUser(validatedResponse);

      // Return the access token.
      return validatedResponse.accessToken;
    }

    // If the user is not authenticated, return null
    default:
      return null;
  }
};

// A request interceptor to add the Authorization header
// It also handles accessToken refreshing
authAxios.interceptors.request.use(
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

/**
 * Handle the error from the Axios response.
 * @description Retry the 498 expired token error, and handle the 401, 403 errors.
 * @param error - The error object from the Axios response
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
      return await authAxios(originalRequest);
    } catch (err) {
      console.error('Error refreshing token:', err);
      throw { response: { status: 401, data: 'Unauthorized' } };
    }
  }

  // Handle the 401, 403 error, also the error from 498 handler branch
  if (error.response?.status === 401 || error.response?.status === 403) {
    const { clear } = useUserStore.getState();
    clear();
    // Redirect to the login page and clear the history
    window.location.replace('/login');
    return Promise.reject(error.response);
  }

  // Other errors
  if (error.response) {
    console.error('Error response:', error.response);
    return Promise.reject(error.response);
  } else if (error.request) {
    console.error('Error request:', error.request);
    return Promise.reject(error.request);
  } else {
    console.error('Error message:', error.message);
    throw { response: { status: 500, data: error.message } };
  }
};

// A response interceptor to handle errors
anonymousAxios.interceptors.response.use(
  (response) => response,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  async (error: any) => {
    return await handleError(error);
  },
);

// A response interceptor to handle errors
// Mainly it handles the 498 expired token error
authAxios.interceptors.response.use(
  (response) => response,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  async (error: any) => {
    return await handleError(error);
  },
);

export { anonymousAxios, authAxios };
