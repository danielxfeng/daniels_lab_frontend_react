import { AuthResponse, LoginBody, RegisterBody } from '@/schema/schema_auth';
import { anonymousAxios } from '@/lib/axiosInstance';
import { AxiosResponse } from 'axios';

const loginUser = async (body: LoginBody): Promise<AxiosResponse<AuthResponse>> => {
  return anonymousAxios.post('/auth/login', body, {
    // Bypass 401 interceptor for login requests
    headers: {
      'X-Bypass-401-Interceptor': 'true',
    },
  });
};

const registerUser = async (body: RegisterBody): Promise<AxiosResponse<AuthResponse>> => {
  return anonymousAxios.post('/auth/register', body);
};

export { loginUser, registerUser };
