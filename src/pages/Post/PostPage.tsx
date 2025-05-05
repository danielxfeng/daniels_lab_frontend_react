import { useLoaderData } from 'react-router-dom';
import { PostResponse } from '../../schema/schema_post';
import SafeStyledMarkdown from '@/components/SafeStyledMarkdown';

const PostPage = () => {
  const post = useLoaderData() as PostResponse;

  return (
    <div>
      <h1>{post.title}</h1>
      <SafeStyledMarkdown markdown={post.markdown!} />
      <p>This is the post page.</p>
    </div>
  );
};

export default PostPage;
