import { AxiosResponse } from 'axios';
import { anonymousAxios } from '@/lib/axiosInstance';
import { TagsResponse } from '@/schema/schema_tag';

const getHotTags = async (): Promise<AxiosResponse<TagsResponse>> => {
  return await anonymousAxios.get('/blog/tags/hot');
}

export { getHotTags };
