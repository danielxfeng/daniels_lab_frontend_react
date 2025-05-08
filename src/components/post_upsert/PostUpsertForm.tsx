import { PostResponse } from '@/schema/schema_post';

const PostUpsertForm = ({ post }: { post: PostResponse | null }) => {
  return (
    <div className='post-upsert-form'>
      <h1>Post Upsert Form</h1>
      {/* Add your form fields and logic here */}
      {post ? post.title : 'Create New Post'}
    </div>
  );
};

export default PostUpsertForm;
