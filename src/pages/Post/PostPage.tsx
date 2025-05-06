import { useLoaderData } from 'react-router-dom';
import { PostResponse } from '../../schema/schema_post';
import SafeStyledMarkdown from '@/components/post/SafeStyledMarkdown';
import LazyImage from '@/components/LazyImage';
import AuthorDateBar from '@/components/post/AuthorDateBar';
import useUserStore from '@/stores/useUserStore';
import MotionTextButtonLink from '@/components/motion_components/MotionTextButtonLink';
import Likes from '@/components/Likes';
import Comments from '@/components/comments/Comments';
import MotionH1 from '@/components/motion_components/MotionH1';

const PostPage = () => {
  const { post } = useLoaderData() as { post: PostResponse };
  //console.log('PostPage', JSON.stringify(post));
  const user = useUserStore.getState().user;
  const isAuthor = user?.id === post.authorId;
  const isAdmin = user?.isAdmin;

  return (
    <article className='inner-container mb-10 flex max-w-3xl flex-col items-center gap-6 md:mb-10'>
      {/* The possible operation panel */}
      <header className='flex w-full items-center justify-end gap-2'>
        {isAuthor && (
          <MotionTextButtonLink
            to={`/blog/posts/edit/${post.id}`}
            label='Edit'
            ariaLabel='Edit post'
            className='bg-muted text-muted-foreground w-fit'
          />
        )}
        {isAdmin && (
          <MotionTextButtonLink
            to={`/blog/posts/${post.slug}/edit`}
            label='Delete'
            ariaLabel='Delete post'
            className='bg-muted text-muted-foreground w-fit'
          />
        )}
      </header>

      {/* The post cover image */}
      <LazyImage src={post.cover} alt={post.title} className='w-3/4 rounded-xl shadow-2xl' />

      <MotionH1>{post.title}</MotionH1>

      {/* The post author and createdAt */}
      <AuthorDateBar
        authorName={post.authorName}
        authorAvatar={post.authorAvatar}
        createdAt={post.createdAt}
      />

      {/* The post content */}
      <SafeStyledMarkdown markdown={post.markdown!} className='w-full md:mt-3' />

      {/* The post footer */}
      <footer className='text-muted-foreground mt-6 flex w-full flex-col items-start justify-start gap-3'>
        {/* The post tags */}
        <div className='flex flex-wrap gap-2'>
          <span className='mr-2'>Tags:</span>
          {post.tags.map((tag: string) => (
            <span key={`${tag}`} className='bg-muted rounded-md px-2 py-0.5 text-sm'>
              {`#${tag}`}
            </span>
          ))}
        </div>
        {/* The post likes */}
        <Likes postId={post.id} userId={user?.id} />
        {/* The post comments */}
        <Comments postId={post.id} userId={user?.id} />
      </footer>
    </article>
  );
};

export default PostPage;
