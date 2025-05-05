import { useLoaderData } from 'react-router-dom';
import { PostResponse } from '../../schema/schema_post';
import SafeStyledMarkdown from '@/components/post/SafeStyledMarkdown';
import LazyImage from '@/components/LazyImage';
import AuthorDateBar from '@/components/post/AuthorDateBar';
import useUserStore from '@/stores/useUserStore';
import MotionTextButtonLink from '@/components/motion_components/MotionTextButtonLink';

const PostPage = () => {
  const { post } = useLoaderData() as { post: PostResponse };
  console.log('PostPage', JSON.stringify(post));
  const user = useUserStore.getState().user;
  const isAuthor = user?.id === post.authorId;
  const isAdmin = user?.isAdmin;

  return (
    <article className='inner-container flex flex-col items-center max-w-3xl gap-4'>
      <div className='flex w-full items-center justify-end gap-2'>
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
      </div>
      <LazyImage src={post.cover} alt={post.title} className='w-3/4 rounded-xl shadow-2xl' />
      <h1>{post.title}</h1>
      <AuthorDateBar
        authorName={post.authorName}
        authorAvatar={post.authorAvatar}
        createdAt={post.createdAt}
      />
      <SafeStyledMarkdown markdown={post.markdown!} />
      <footer className='flex flex-wrap items-center gap-1.5'>
        <span className='mr-2'>Tags:</span>
        {post.tags.map((tag: string) => (
          <span key={tag} className='bg-highlight rounded-md px-2 py-0.5 text-sm'>
            {tag}
          </span>
        ))}
      </footer>
    </article>
  );
};

export default PostPage;
