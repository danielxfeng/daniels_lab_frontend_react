import { format } from 'date-fns';

import Author from '@/components/features/post/Author';

type AuthorDateBarProps = {
  authorName: string;
  authorAvatar: string | null;
  createdAt: string | undefined;
  updatedAt?: string | undefined;
};

/**
 * @summary The AuthorDateBar component displays the author's name and avatar along with the post's creation date.
 */
const AuthorDateBar = ({ authorName, authorAvatar, createdAt, updatedAt }: AuthorDateBarProps) => (
  <div className='flex w-full items-center justify-between' data-role='author-date-bar'>
    <Author name={authorName} avatarUrl={authorAvatar ?? undefined} />
    <div className='text-muted-foreground text-sm' data-role='author-date-bar-date'>
      <span className='text-xs'>Updated At:</span>{' '}
      <span className='text-foreground italic'>
        {format(new Date(updatedAt || createdAt!), 'PP')}
      </span>
    </div>
  </div>
);

export default AuthorDateBar;
