import { format } from 'date-fns';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import useUserStore from '@/stores/useUserStore';
import { PostListResponse, PostResponse } from '@/schema/schema_post';
import SafeStyledMarkdown from '@/components/SafeStyledMarkdown';
import Author from '@/components/Author';
import LazyImage from '@/components/LazyImage';
import MotionTextButtonLink from '@/components/motion_components/MotionTextButtonLink';
import { hoverEffect, tapEffect } from '@/lib/animations';
import Pagination from '@/components/Pagination';

// A post component that displays a single post
const Post = ({ post }: { post: PostResponse }) => (
  <motion.article
    whileHover={hoverEffect}
    whileTap={tapEffect}
    className='bg-background flex items-center gap-2 px-2 py-2 transition-shadow hover:shadow-lg'
  >
    <Link to={`/blog/posts/${post.slug}`} className='flex w-full items-center'>
      <LazyImage
        src={post.cover}
        alt={post.title}
        className='hidden h-16 w-28 shrink-0 rounded-xl shadow-2xl md:flex md:h-32 md:w-56'
      />
      <div className='flex flex-1 flex-col gap-2 p-4'>
        <header>
          <h3 className='line-clamp-1'>{post.title}</h3>
        </header>
        <LazyImage
          src={post.cover}
          alt={post.title}
          className='mx-auto h-32 w-56 shrink-0 rounded-2xl text-center shadow-2xl md:hidden'
        />
        <div className='mt-2 max-h-28 overflow-hidden'>
          <SafeStyledMarkdown markdown={post.excerpt} />
        </div>
        <footer className='text-muted-foreground mt-auto flex flex-col justify-between gap-2.5 pt-3 text-xs'>
          <div className='flex flex-wrap items-center gap-1.5'>
            <span className='mr-2'>Tags:</span>
            {post.tags.map((tag) => (
              <MotionTextButtonLink
                to={`/blog/posts/?tags=${tag}`}
                label={`${tag}`}
                ariaLabel={`to posts with tag ${tag}`}
                className='bg-highlight rounded-md px-2 py-0.5 text-sm'
                isExternal={false}
              />
            ))}
          </div>
          <div className='flex items-center justify-between'>
            <Author name={post.authorName} avatarUrl={post.authorAvatar ?? undefined} />
            <div>{format(new Date(post.createdAt!), 'PPP')}</div>
          </div>
        </footer>
      </div>
    </Link>
  </motion.article>
);

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
      <Pagination total={postsResponse.total} offset={postsResponse.offset} isPrevEnabled={true} />
      {/* If there are no posts, show a message */}
      {/* No posts available message */}
      {postsResponse.posts.length === 0 && (
        <div className='text-destructive-foreground p-4 text-center'>No posts available.</div>
      )}
    </section>
  );
};

export default PostsList;
