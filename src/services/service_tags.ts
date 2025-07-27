import { AxiosResponse } from 'axios';

import { anonymousAxios } from '@/lib/axiosInstance';
import { throwWithValidationErr } from '@/lib/throwWithErr';
import { TagsResponse, TagsResponseSchema } from '@/schema/schema_tag';

let lastSendTs: number = 0;
let lastReceivedTs: number = 0;

const getHotTags = async (): Promise<AxiosResponse<TagsResponse>> => {
  return await anonymousAxios!.get('/blog/tags/hot');
};

/**
 * @summary Search tags by prefix, with debouncing both requests and responses.
 * @description
 * This function will debounce the requests to the server, and also debounce the responses.
 */
const debouncedSearchTagsByPrefix = async (
  prefix: string,
): Promise<AxiosResponse<TagsResponse> | null> => {
  // Debounce the requests, if the last request was sent less than 500ms ago, throw an error
  const ts = Date.now();
  if (ts - lastSendTs < 500) return null;
  lastSendTs = ts;

  // Debounce the responses, if the response was a stale one, throw an error
  const response = await anonymousAxios!.get(`/blog/tags/search?tag=${prefix}&ts=${ts}`);
  const validatedResponse = TagsResponseSchema.safeParse(response.data);
  if (!validatedResponse.success) {
    return throwWithValidationErr(`search tags by prefix: ${prefix}`, validatedResponse.error);
  }
  const resTs = validatedResponse.data.ts;
  if (!resTs || resTs < lastReceivedTs) {
    return null;
  }
  lastReceivedTs = resTs;
  return response;
};

export { debouncedSearchTagsByPrefix, getHotTags };
