'use client';

import { LoaderFunctionArgs, useLoaderData } from 'react-router';

import PostsMain from '@/components/features/posts/PostsMain';
import siteMeta from '@/constants/siteMeta';
import postsLoader from '@/pages/Posts/postsLoader';

const MetaInfo = () => (
  <>
    <title>{`All Posts – ${siteMeta.siteName}`}</title>
    <meta name='description' content={`Browse all blog posts on ${siteMeta.siteName}`} />
    <meta name='author' content='Daniel F.' />
    <meta property='og:title' content={`All Posts – ${siteMeta.siteName}`} />
    <meta property='og:description' content={`Browse all blog posts on ${siteMeta.siteName}.`} />
    <meta property='og:type' content='website' />
    <meta property='og:url' content={`${siteMeta.siteUrl}/blog/posts`} />
    <meta property='og:image' content={`${siteMeta.siteUrl}/cover.png`} />
    <meta property='og:site_name' content='Fancy Blog' />
    <meta name='twitter:card' content='summary_large_image' />
    <meta name='twitter:title' content={`All Posts – ${siteMeta.siteName}`} />
    <meta name='twitter:description' content={`Browse all blog posts on ${siteMeta.siteName}.`} />
    <meta name='twitter:image' content={`${siteMeta.siteUrl}/cover.png`} />
  </>
);

const loader = async ({ request }: LoaderFunctionArgs) => {
  return await postsLoader({ request });
};

const PostsPage = () => {
  const { postsListRes, hotTags } = useLoaderData();
  return (
    <PostsMain postsListRes={postsListRes} hotTags={hotTags}>
      <MetaInfo />
    </PostsMain>
  );
};

export default PostsPage;

// eslint-disable-next-line react-refresh/only-export-components
export { loader };
