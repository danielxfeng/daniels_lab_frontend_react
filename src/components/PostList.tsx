import { format } from 'date-fns';
import { useNavigate, useSearchParams } from 'react-router-dom';
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationNext,
  PaginationPrevious,
} from './ui/pagination';
import siteMeta from '@/constants/siteMeta';
import useUserStore from '@/stores/useUserStore';
import { PostListResponse, PostResponse } from '@/schema/schema_post';
import SafeStyledMarkdown from '@/components/SafeStyledMarkdown';
import Author from '@/components/Author';
import LazyImage from '@/components/LazyImage';
import MotionTextButtonLink from '@/components/motion_components/MotionTextButtonLink';

// A post component that displays a single post
const Post = ({ post }: { post: PostResponse }) => (
  <article className='flex gap-2 shadow-md'>
    <LazyImage src={post.cover} alt={post.title} className={'h-32 w-56'} />
    <div className='flex flex-1 flex-col p-4'>
      <header>
        <h3 className='line-clamp-1'>{post.title}</h3>
      </header>
      <div className='mt-2 max-h-28 overflow-hidden'>
        <SafeStyledMarkdown markdown={post.excerpt} />
      </div>
      <footer className='text-muted-foreground mt-auto flex justify-between pt-3 text-xs'>
        <div>
          <span className='mr-2'>Tags:</span>
          {post.tags.map((tag) => (
            <span key={tag} className='bg-muted mr-1 rounded-full px-2 py-1 text-xs'>
              {tag}
            </span>
          ))}
        </div>
        <div className='flex justify-between gap-2'>
          <Author name={post.authorName} avatarUrl={post.authorAvatar ?? undefined} />
          <div>{format(new Date(post.createdAt!), 'PPP')}</div>
        </div>
      </footer>
    </div>
  </article>
);

// A pagination component that displays the pagination controls
const PaginationComponent = ({ total, offset }: { total: number; offset: number }) => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const limit = siteMeta.paginationLimit;
  const currentOffset = offset || 0;

  // Set the base URL parameters for pagination
  const getBaseParams = () => {
    const base = new URLSearchParams(searchParams);
    base.delete('offset');
    base.set('limit', limit.toString());
    return base;
  };

  // Assemble the URL parameters for prev
  const goToPrevious = () => {
    const base = getBaseParams();
    const newOffset = Math.max(0, currentOffset - limit);
    base.set('offset', newOffset.toString());
    navigate(`?${base.toString()}`);
  };

  // Assemble the URL parameters for next
  const goToNext = () => {
    const base = getBaseParams();
    const newOffset = currentOffset + limit;
    base.set('offset', newOffset.toString());
    navigate(`?${base.toString()}`);
  };

  const hasPrevious = currentOffset > 0;
  const hasNext = currentOffset + limit < total;

  return (
    <Pagination>
      <PaginationContent>
        {hasPrevious && (
          <PaginationItem>
            <PaginationPrevious onClick={goToPrevious} />
          </PaginationItem>
        )}
        {hasNext && (
          <PaginationItem>
            <PaginationNext onClick={goToNext} />
          </PaginationItem>
        )}
      </PaginationContent>
    </Pagination>
  );
};

/**
 * The PostsList component displays a list of posts.
 * @param postsResponse - The response object containing the list of posts.
 * @returns A posts list component.
 */
const PostsList = ({ postsResponse }: { postsResponse: PostListResponse }) => {
  // A snapshot of the user from the Zustand store
  const user = useUserStore.getState().user;

  return (
    <section className='flex flex-col gap-4'>
      {/* A new post button for admin user */}
      {user?.isAdmin && (
        <div className='flex justify-end'>
          <MotionTextButtonLink
            to='/Post/Create'
            label='New Post'
            ariaLabel='New Post'
            className='mb-2'
            isExternal={false}
          />
        </div>
      )}
      {/* Posts list */}
      {postsResponse.posts.map((post) => (
        <Post key={post.id} post={post} />
      ))}
      {/* Pagination */}
      <PaginationComponent total={postsResponse.total} offset={postsResponse.offset} />
      {/* If there are no posts, show a message */}
      {/* No posts available message */}
      {postsResponse.posts.length === 0 && (
        <div className='text-destructive-foreground p-4 text-center'>No posts available.</div>
      )}
    </section>
  );
};

export default PostsList;
