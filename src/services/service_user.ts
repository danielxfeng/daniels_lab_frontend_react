import { authAxios } from '@/lib/axiosInstance';
import { AxiosResponse } from 'axios';
import { UpdateUserBody, UserListResponse, UserResponse } from '@/schema/schema_users';

/**
 * @summary A function to get the user information.
 * @returns
 */
const getUser = async (): Promise<AxiosResponse<UserResponse>> => {
  return await authAxios!.post('/users');
};

/**
 * @summary A function to update the user information.
 * @param body - The body of the update request
 * @returns
 */
const updateUser = async (body: UpdateUserBody): Promise<AxiosResponse<UserResponse>> => {
  return await authAxios!.put('/users', body);
};

/**
 * @summary A function to get the list of users.
 * @returns
 */
const getUsers = async (): Promise<AxiosResponse<UserListResponse>> => {
  return await authAxios!.get('/users/all');
};

export { getUser, updateUser, getUsers };
