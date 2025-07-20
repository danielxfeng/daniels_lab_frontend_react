import { AxiosResponse } from 'axios';

import { authAxios } from '@/lib/axiosInstance';
import { UpdateUserBody, UserListResponse, UserResponse } from '@/schema/schema_users';

const getUser = async (): Promise<AxiosResponse<UserResponse>> => {
  return await authAxios!.post('/users');
};

const updateUser = async (body: UpdateUserBody): Promise<AxiosResponse<UserResponse>> => {
  return await authAxios!.put('/users', body);
};

const getUsers = async (): Promise<AxiosResponse<UserListResponse>> => {
  return await authAxios!.get('/users/all');
};

export { getUser, getUsers, updateUser };
