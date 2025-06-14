import PostsList from '@/components/features/posts/PostList';
import PostsFilterForm from '@/components/features/posts/PostsFilterForm';
import MotionH1 from '@/components/motion_components/MotionH1';
import NotificationBar from '@/components/shared/NotificationBar';
import { PostListResponse } from '@/schema/schema_post';
import { TagsResponse } from '@/schema/schema_tag';

type PostsMainProps = {
  postsListRes: PostListResponse;
  hotTags: TagsResponse;
  children: React.ReactNode;
};

/**
 * The main component for the posts shared with the listing and search pages.
 * It contains a filter form and a list of posts.
 */
const PostsMain = ({ postsListRes, hotTags, children }: PostsMainProps) => {
  return (
    <>
      <NotificationBar />
      {children}
      <div className='inner-container flex flex-col items-start' data-role='posts-main-container'>
        <MotionH1>Posts</MotionH1>
        <div
          className='flex w-full flex-col gap-3 lg:flex-row lg:justify-between lg:gap-10'
          data-role='posts-main'
        >
          <div className='w-full lg:w-3/4' data-role='posts-list'>
            <PostsList postsResponse={postsListRes} />
          </div>
          <div className='w-full lg:w-1/4'>
            <PostsFilterForm hotTags={hotTags} />
          </div>
        </div>
      </div>
    </>
  );
};

export default PostsMain;
