import { AxiosResponse } from 'axios';

import { anonymousAxios, authAxios } from '@/lib/axiosInstance';
import {
  AuthResponse,
  ChangePasswordBody,
  DeviceIdBody,
  JoinAdminBody,
  LoginBody,
  OAuthConsentQuery,
  OAuthRedirectResponse,
  RegisterBody,
  SetPasswordBody,
} from '@/schema/schema_auth';
import { OauthProvider } from '@/schema/schema_components';

const loginUser = async (body: LoginBody): Promise<AxiosResponse<AuthResponse>> => {
  return anonymousAxios!.post('/auth/login', body, {
    // Bypass 401 interceptor for login requests
    headers: {
      'X-Bypass-401-Interceptor': 'true',
    },
  });
};

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

const oauthUnlinkUser = async (provider: string): Promise<AxiosResponse<void>> => {
  return authAxios!.delete(`/auth/oauth/unlink/${provider}`);
};

const oauthLinkUser = async (
  provider: OauthProvider,
  body: OAuthConsentQuery,
): Promise<AxiosResponse<OAuthRedirectResponse>> => {
  return authAxios!.post(`/auth/oauth/${provider}`, body);
};

const registerUser = async (body: RegisterBody): Promise<AxiosResponse<AuthResponse>> => {
  return anonymousAxios!.post('/auth/register', body);
};

const logoutUser = async (body: DeviceIdBody): Promise<AxiosResponse<void>> => {
  return authAxios!.post('/auth/logout', body);
};

const changePassword = async (body: ChangePasswordBody): Promise<AxiosResponse<AuthResponse>> => {
  return authAxios!.post('/auth/change-password', body, {
    // Bypass 401 interceptor for login requests
    headers: {
      'X-Bypass-401-Interceptor': 'true',
    },
  });
};

const setPassword = async (body: SetPasswordBody): Promise<AxiosResponse<AuthResponse>> => {
  return authAxios!.post('/auth/set-password', body);
};

const deleteUser = async (userId: string): Promise<AxiosResponse<void>> => {
  return authAxios!.delete(`/auth/${userId}`);
};

const joinAdmin = async (body: JoinAdminBody): Promise<AxiosResponse<AuthResponse>> => {
  return authAxios!.put('/auth/join-admin', body);
};

export {
  changePassword,
  deleteUser,
  joinAdmin,
  loginUser,
  logoutUser,
  oauthGetUserInfo,
  oauthLinkUser,
  oauthUnlinkUser,
  registerUser,
  setPassword,
};
