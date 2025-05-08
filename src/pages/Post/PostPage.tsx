import { useState } from 'react';
import { toast } from 'sonner';
import { useLoaderData, useNavigate } from 'react-router-dom';
import { Pencil, Trash2 } from 'lucide-react';
import { Helmet } from 'react-helmet-async';
import useUserStore from '@/stores/useUserStore';
import { PostResponse } from '@/schema/schema_post';
import SafeStyledMarkdown from '@/components/post/SafeStyledMarkdown';
import LazyImage from '@/components/LazyImage';
import AuthorDateBar from '@/components/post/AuthorDateBar';
import Likes from '@/components/Likes';
import Comments from '@/components/comments/Comments';
import MotionH1 from '@/components/motion_components/MotionH1';
import siteMeta from '@/constants/siteMeta';
import ShareBar from '@/components/post/ShareBar';
import { deletePost } from '@/services/services_posts';
import MotionIconLink from '@/components/motion_components/MotionIconLink';
import MotionIconButton from '@/components/motion_components/MotionIconButton';

// A component to set the meta information for SEO
const MetaInfo = ({ post }: { post: PostResponse }) => (
  <Helmet>
    <title>
      {post.title} – {siteMeta.siteName}
    </title>
    <meta name='description' content={post.excerpt} />
    <meta property='og:title' content={post.title} />
    <meta property='og:description' content={post.excerpt} />
    <meta property='og:type' content='article' />
    <meta property='og:url' content={`${siteMeta.siteUrl}/blog/posts/${post.slug}`} />
    <meta property='og:image' content={post.cover || `${siteMeta.siteUrl}/cover.png`} />
    <meta name='twitter:card' content='summary_large_image' />
  </Helmet>
);

const PostPage = () => {
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { post } = useLoaderData<{ post: PostResponse }>();
  const user = useUserStore.getState().user;
  const isAuthor = user?.id === post.authorId;
  const isAdmin = user?.isAdmin;

  const deleteHandler = async () => {
    try {
      setIsLoading(true);
      await deletePost(post.id);

      toast('Post deleted successfully!');
      setTimeout(() => {
        navigate(`/blog/posts`);
      }, 1000);
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      toast.error('Failed to delete post');
      return console.error('Failed to delete post:', JSON.stringify(error));
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <MetaInfo post={post} />
      {/* The post page */}
      <article className='inner-container mb-10 flex max-w-3xl flex-col items-center gap-6 md:mb-10'>
        {/* The post cover image */}
        <LazyImage src={post.cover} alt={post.title} className='w-3/4 rounded-xl shadow-2xl' />

        <MotionH1 className='text-center'>{post.title}</MotionH1>

        {/* The possible operation panel */}
        <div className='flex w-full items-center justify-end gap-2'>
          {isAuthor && (
            <MotionIconLink
              to={`/blog/posts/edit/${post.slug}`}
              state={{ post }}
              icon={<Pencil className='h-6 w-6' />}
              ariaLabel='Edit post'
              tooltip='Edit post'
              isExternal={false}
            />
          )}
          {isAdmin && (
            <MotionIconButton
              icon={<Trash2 className='h-6 w-6' />}
              ariaLabel='Delete post'
              type='button'
              onClick={deleteHandler}
              disabled={isLoading}
              isLoading={isLoading}
              className='text-destructive'
              tooltip='Delete post'
            />
          )}
        </div>

        {/* The social media share buttons */}
        <ShareBar url={`${siteMeta.siteUrl}/blog/posts/${post.slug}`} title={post.title} />

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
          <div className='flex w-full flex-col items-start justify-between gap-2 md:flex-row md:items-center'>
            {/* The post likes */}
            <Likes postId={post.id} userId={user?.id} />
            {/* The post tags */}
            <div className='flex gap-2'>
              <div className='mr-2'>Tags:</div>
              <div className='flex flex-wrap gap-2'>
                {post.tags.map((tag: string) => (
                  <span key={`${tag}`} className='bg-muted rounded-md px-2 py-0.5 text-sm'>
                    {`#${tag}`}
                  </span>
                ))}
              </div>
            </div>
          </div>
          {/* The post comments */}
          <Comments postId={post.id} />
        </footer>
      </article>
    </>
  );
};

export default PostPage;
