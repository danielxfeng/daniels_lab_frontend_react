import {
  AuthResponse,
  ChangePasswordBody,
  DeviceIdBody,
  LoginBody,
  RegisterBody,
} from '@/schema/schema_auth';
import { anonymousAxios, authAxios } from '@/lib/axiosInstance';
import { AxiosResponse } from 'axios';

/**
 * @summary A function to login a user.
 * @param body - The body of the login request
 * @returns
 */
const loginUser = async (body: LoginBody): Promise<AxiosResponse<AuthResponse>> => {
  return anonymousAxios!.post('/auth/login', body, {
    // Bypass 401 interceptor for login requests
    headers: {
      'X-Bypass-401-Interceptor': 'true',
    },
  });
};

/**
 * @summary A function to get user information using OAuth access token.
 * @description
 * This function does not use authAxios, because the accessToken has not been set to store yet.
 * @param accessToken the OAuth access token
 * @param deviceId the device ID to associate with the request
 * @returns
 */
const oauthGetUserInfo = async (
  accessToken: string,
  deviceId: string,
): Promise<AxiosResponse<AuthResponse>> => {
  return anonymousAxios!.get(`/auth/oauth/userinfo?deviceId=${deviceId}`, {
    headers: {
      // Bypass 401 interceptor for the requests
      'X-Bypass-401-Interceptor': 'true',
      Authorization: `Bearer ${accessToken}`,
    },
  });
};

/**
 * @summary A function to register a user.
 * @param body - The body of the register request
 * @returns
 */
const registerUser = async (body: RegisterBody): Promise<AxiosResponse<AuthResponse>> => {
  return anonymousAxios!.post('/auth/register', body);
};

/**
 * @summary A function to logout a user.
 * @param body - The body of the logout request
 * @returns
 */
const logoutUser = async (body: DeviceIdBody): Promise<AxiosResponse<void>> => {
  return authAxios!.post('/auth/logout', body);
};

/**
 * @summary A function to change the password of a user.
 * @param body - The body of the change password request
 * @returns
 */
const changePassword = async (body: ChangePasswordBody): Promise<AxiosResponse<AuthResponse>> => {
  return authAxios!.post('/auth/change-password', body, {
    // Bypass 401 interceptor for login requests
    headers: {
      'X-Bypass-401-Interceptor': 'true',
    },
  });
};

/**
 * @summary A function to delete a user.
 * @param userId - The ID of the user to delete
 * @returns
 */
const deleteUser = async (userId: string): Promise<AxiosResponse<void>> => {
  return authAxios!.delete(`/auth/${userId}`);
};

export { loginUser, registerUser, oauthGetUserInfo, logoutUser, changePassword, deleteUser };
