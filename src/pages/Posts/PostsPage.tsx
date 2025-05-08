import { useLoaderData } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import siteMeta from '@/constants/siteMeta';
import MotionH1 from '@/components/motion_components/MotionH1';
import PostsList from '@/components/posts/PostList';
import PostsFilterForm from '@/components/posts/PostsFilterForm';

// A component to set the meta information for SEO
const MetaInfo = () => (
  <Helmet>
    <title>All Posts – YourSiteName</title>
    <meta name='description' content={`Browse all blog posts on ${siteMeta.siteName}`} />
    <meta property='og:title' content={`All Posts – ${siteMeta.siteName}`} />
    <meta property='og:description' content={`Browse all blog posts on ${siteMeta.siteName}.`} />
    <meta property='og:type' content='website' />
    <meta property='og:url' content={`${siteMeta.siteUrl}/blog/posts`} />
    <meta property='og:image' content={`${siteMeta.siteUrl}/cover.png`} />
    <meta name='twitter:card' content='summary_large_image' />
  </Helmet>
);

/**
 * The main page for the posts.
 * It contains a filter form and a list of posts.
 */
const PostsPage = () => {
  const { postsListRes, hotTags } = useLoaderData();
  return (
    <>
      <MetaInfo />
      <div className='inner-container flex flex-col items-start'>
        <MotionH1>Posts</MotionH1>
        <div className='posts flex flex-col-reverse gap-10 md:flex-row md:justify-between'>
          <div className='w-full md:w-1/4'>
            <PostsFilterForm hotTags={hotTags} />
          </div>
          <div className='w-full md:w-3/4'>
            <PostsList postsResponse={postsListRes} />
          </div>
        </div>
      </div>
    </>
  );
};

export default PostsPage;
