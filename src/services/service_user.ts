import { authAxios } from '@/lib/axiosInstance';
import { AxiosResponse } from 'axios';
import { UpdateUserBody, UserResponse } from '@/schema/schema_users';

/**
 * @summary A function to get the user information.
 * @returns 
 */
const getUser = async (): Promise<AxiosResponse<UserResponse>> => {
  return await authAxios.post('/users');
};

const updateUser = async (body: UpdateUserBody) : Promise<AxiosResponse<UserResponse>> => {
  return await authAxios.put('/users', body);
};

export { getUser, updateUser };
