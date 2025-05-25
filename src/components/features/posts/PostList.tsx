import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import useUserStore from '@/stores/useUserStore';
import { PostListResponse, PostResponse } from '@/schema/schema_post';
import SafeStyledMarkdown from '@/components/features/post/SafeStyledMarkdown';
import LazyImage from '@/components/shared/LazyImage';
import { hoverEffect, tapEffect } from '@/lib/animations';
import Pagination from '@/components/features/posts/Pagination';
import AuthorDateBar from '../post/AuthorDateBar';
import TagsBar from '../tags/TagsBar';
import MotionIconLink from '@/components/motion_components/MotionIconLink';
import { Plus } from 'lucide-react';

// A post component that displays a single post
const Post = ({ post }: { post: PostResponse }) => (
  <motion.article
    whileHover={hoverEffect}
    whileTap={tapEffect}
    className='bg-background flex items-center gap-2 px-2 py-2 transition-shadow hover:shadow-lg'
  >
    <Link to={`/blog/posts/${post.slug}`}>
      <LazyImage
        src={post.cover}
        alt={post.title}
        className='hidden h-16 w-28 shrink-0 rounded-xl shadow-2xl md:flex md:h-32 md:w-56'
      />
    </Link>
    <div className='flex flex-1 flex-col gap-2 p-4'>
      <Link to={`/blog/posts/${post.slug}`}>
        <header>
          <h3 className='line-clamp-1'>{post.title}</h3>
        </header>
      </Link>
      <Link to={`/blog/posts/${post.slug}`}>
        <LazyImage
          src={post.cover}
          alt={post.title}
          className='mx-auto h-32 w-56 shrink-0 rounded-2xl text-center shadow-2xl md:hidden'
        />
      </Link>

      {/* The post excerpt */}
      <div className='mt-2 max-h-28 overflow-hidden'>
        <SafeStyledMarkdown markdown={post.excerpt} />
      </div>
      <footer className='text-muted-foreground mt-auto flex flex-col justify-between gap-2.5 pt-3 text-xs'>
        <TagsBar tags={post.tags} />
        <AuthorDateBar
          authorName={post.authorName}
          authorAvatar={post.authorAvatar}
          createdAt={post.createdAt}
          updatedAt={post.updatedAt}
          position='list'
        />
      </footer>
    </div>
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
    <section className='flex flex-col gap-2'>
      {/* A new post button for admin user */}
      {user?.isAdmin && (
        <div className='flex justify-start'>
          <MotionIconLink
            icon={
              <>
                <Plus className='h-6 w-6' />
                <span className='mx-2'>New Post</span>
              </>
            }
            to='/blog/posts/new'
            ariaLabel='New Post'
            className='bg-highlight text-background mb-2 rounded-lg px-4 py-2'
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
