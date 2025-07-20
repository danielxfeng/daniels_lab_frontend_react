import type { LoaderFunctionArgs } from 'react-router-dom';

import { fetchPost } from '@/lib/fetchPost';
import { PostResponse } from '@/schema/schema_post';

const postPage = async ({ params }: LoaderFunctionArgs): Promise<{ post: PostResponse }> => {
  return await fetchPost(params.slug as string);
};

export default postPage;
