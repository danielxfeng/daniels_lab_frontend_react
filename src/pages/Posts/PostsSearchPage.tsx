import { useLoaderData } from 'react-router-dom';

import PostsMain from '@/components/features/posts/PostsMain';
import siteMeta from '@/constants/siteMeta';

const MetaInfo = ({ keyword }: { keyword: string }) => (
  <>
    <title>{`Search result of "${keyword}" – ${siteMeta.siteName}`}</title>
    <meta
      name='description'
      content={`Browse all blog posts related to "${keyword}" on ${siteMeta.siteName}`}
    />
    <meta name='author' content='Daniel F.' />
    <meta property='og:title' content={`Search result of "${keyword}" – ${siteMeta.siteName}`} />
    <meta
      property='og:description'
      content={`Browse all blog posts related to "${keyword}" on ${siteMeta.siteName}.`}
    />
    <meta property='og:type' content='website' />
    <meta property='og:url' content={`${siteMeta.siteUrl}/blog/posts/search/?keyword=${keyword}`} />
    <meta property='og:image' content={`${siteMeta.siteUrl}/cover.png`} />
    <meta property='og:site_name' content='Fancy Blog' />
    <meta name='twitter:card' content='summary_large_image' />
    <meta name='twitter:title' content={`Search result of "${keyword}" – ${siteMeta.siteName}`} />
    <meta
      name='twitter:description'
      content={`Browse all blog posts related to "${keyword}" on ${siteMeta.siteName}.`}
    />
    <meta name='twitter:image' content={`${siteMeta.siteUrl}/cover.png`} />
  </>
);

const PostsPage = () => {
  const { postsListRes, hotTags, keyword } = useLoaderData();
  return (
    <PostsMain postsListRes={postsListRes} hotTags={hotTags}>
      <MetaInfo keyword={keyword} />
    </PostsMain>
  );
};

export default PostsPage;
