import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

import SafeStyledMarkdown from '@/components/features/post/SafeStyledMarkdown';
import Pagination from '@/components/features/posts/Pagination';
import LazyImage from '@/components/shared/LazyImage';
import { postCardAnimation } from '@/lib/animations';
import { PostListResponse, PostResponse } from '@/schema/schema_post';

import AuthorDateBar from '../post/AuthorDateBar';
import TagsBar from '../tags/TagsBar';

// A post component that displays a single post
const Post = ({ post }: { post: PostResponse }) => (
  <motion.article
    {...postCardAnimation}
    className='bg-background flex flex-col gap-2 rounded-2xl px-5 py-5 shadow-md transition-all hover:bg-white hover:shadow-lg dark:hover:bg-neutral-950'
  >
    <Link to={`/blog/posts/${post.slug}`}>
      <header>
        <h4 className='line-clamp-2'>{post.title}</h4>
      </header>
    </Link>
    <div className='flex flex-col gap-8 py-4 lg:flex-row lg:items-center'>
      <Link to={`/blog/posts/${post.slug}`} className='shrink-0'>
        <LazyImage
          src={post.cover}
          alt={post.title}
          className='mx-auto aspect-[2/1] h-36 rounded-lg text-center shadow-2xl'
        />
      </Link>
      <div className='bg-border hidden h-24 w-px rounded lg:flex' />
      {/* The post excerpt */}
      <Link to={`/blog/posts/${post.slug}`} className='overflow-hidden text-sm italic'>
        <SafeStyledMarkdown markdown={post.excerpt} />
      </Link>
    </div>
    <footer className='text-muted-foreground mt-auto flex flex-col items-start gap-2 text-xs'>
      <TagsBar tags={post.tags} />
      <AuthorDateBar
        authorName={post.authorName}
        authorAvatar={post.authorAvatar}
        createdAt={post.createdAt}
        updatedAt={post.updatedAt}
      />
    </footer>
  </motion.article>
);

/**
 * The PostsList component displays a list of posts.
 * @param postsResponse - The response object containing the list of posts.
 * @returns A posts list component.
 */
const PostsList = ({ postsResponse }: { postsResponse: PostListResponse }) => {
  return (
    <section className='flex flex-col gap-8'>
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
