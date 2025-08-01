import { useLoaderData } from 'react-router-dom';

import Comments from '@/components/features/comments/Comments';
import AuthorDateBar from '@/components/features/post/AuthorDateBar';
import Likes from '@/components/features/post/Likes';
import PostDeleteComponent from '@/components/features/post/PostDeleteComponent';
import SafeStyledMarkdown from '@/components/features/post/SafeStyledMarkdown';
import ShareBar from '@/components/features/post/ShareBar';
import TagsBar from '@/components/features/tags/TagsBar';
import MotionButton from '@/components/motion_components/MotionButton';
import MotionH1 from '@/components/motion_components/MotionH1';
import MotionScroll from '@/components/motion_components/MotionScroll';
import LazyImage from '@/components/shared/LazyImage';
import NotificationBar from '@/components/shared/NotificationBar';
import siteMeta from '@/constants/siteMeta';
import { PostResponse } from '@/schema/schema_post';
import useUserStore from '@/stores/useUserStore';

const MetaInfo = ({ post }: { post: PostResponse }) => (
  <>
    <title>{`${post.title} – ${siteMeta.siteName}`}</title>
    <meta name='description' content={post.excerpt} />
    <meta name='author' content='Daniel F.' />
    <meta property='og:title' content={post.title} />
    <meta property='og:description' content={post.excerpt} />
    <meta property='og:type' content='article' />
    <meta property='og:url' content={`${siteMeta.siteUrl}/blog/posts/${post.slug}`} />
    <meta property='og:image' content={post.cover || `${siteMeta.siteUrl}/cover.png`} />
    <meta property='og:site_name' content='Fancy Blog' />
    <meta name='twitter:card' content='summary_large_image' />
    <meta name='twitter:title' content={post.title} />
    <meta name='twitter:description' content={post.excerpt} />
    <meta name='twitter:image' content={post.cover || `${siteMeta.siteUrl}/cover.png`} />
  </>
);

const PostPage = () => {
  const { post } = useLoaderData<{ post: PostResponse }>();
  const user = useUserStore.getState().user;
  const isAuthor = user?.id === post.authorId;
  const isAdmin = user?.isAdmin;

  return (
    <>
      <MetaInfo post={post} />
      <NotificationBar />
      {/* The post page */}
      <MotionScroll className='my-10 px-4'>
        <article
          className='inner-container mb-10 flex max-w-3xl flex-col items-center gap-6 lg:mb-10'
          data-role='post-page'
        >
          {/* The post cover image */}
          <LazyImage
            src={post.cover}
            alt={post.title}
            className='aspect-[2/1] w-3/4 rounded-xl shadow-2xl'
          />

          <MotionH1 className='!mb-2 text-center leading-normal !tracking-normal lg:mt-8'>
            {post.title}
          </MotionH1>

          {/* The possible operation panel */}
          <div className='flex w-full items-center justify-end gap-4'>
            {isAuthor && (
              <MotionButton
                supportingText='Edit post'
                size='md'
                variant='secondary'
                text='Edit'
                to={`/blog/posts/edit/${post.slug}`}
                state={{ post }}
                isExternal={false}
                textClass='px-3.5'
                dataRole='button-edit-post'
              />
            )}
            {isAdmin && <PostDeleteComponent postId={post.id} />}
          </div>

          {/* The social media share buttons */}
          <ShareBar url={`${siteMeta.siteUrl}/blog/posts/${post.slug}`} title={post.title} />

          {/* The post author and createdAt */}
          <AuthorDateBar
            authorName={post.authorName}
            authorAvatar={post.authorAvatar}
            createdAt={post.createdAt}
            updatedAt={post.updatedAt}
          />

          {/* The post content */}
          <SafeStyledMarkdown markdown={post.markdown!} className='w-full lg:mt-3' />

          {/* The post footer */}
          <footer
            className='text-muted-foreground mt-6 flex w-full flex-col items-start justify-start gap-3'
            data-role='post-footer'
          >
            <div className='flex w-full flex-col items-start justify-between gap-2 lg:flex-row lg:items-center'>
              {/* The post likes */}
              <Likes postId={post.id} userId={user?.id} />
              {/* The post tags */}
              <TagsBar tags={post.tags} />
            </div>
            <hr className='border-highlight/80 my-6 w-full border-t-2' />
            {/* The post comments */}
            <Comments postId={post.id} />
          </footer>
        </article>
      </MotionScroll>
    </>
  );
};

export default PostPage;
