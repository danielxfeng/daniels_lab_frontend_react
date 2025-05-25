import Author from '@/components/features/post/Author';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';

/**
 * @summary The AuthorDateBar component displays the author's name and avatar along with the post's creation date.
 * @param authorName - The name of the author.
 * @param authorAvatar - The URL of the author's avatar. If not provided, the first letter of the name will be used as a fallback.
 * @param createdAt - The date the post was created.
 * @param updatedAt - The date the post was last updated.
 * @returns A React component that displays the author's avatar and name.
 */
const AuthorDateBar = ({
  authorName,
  authorAvatar,
  createdAt,
  updatedAt,
  position,
}: {
  authorName: string;
  authorAvatar: string | null;
  createdAt: string | undefined;
  updatedAt?: string | undefined;
  position: 'list' | 'post';
}) => (
  <div className='flex w-full items-center justify-between'>
    <Author name={authorName} avatarUrl={authorAvatar ?? undefined} />
    {!updatedAt || createdAt === updatedAt ? (
      <div className='text-muted-foreground text-sm'>
        Published: <span className='italic'>{format(new Date(createdAt!), 'PP')}</span>
      </div>
    ) : (
      <div
        className={cn(
          'text-muted-foreground flex flex-col items-end text-sm',
          position === 'post' ? '' : 'md:flex-row md:gap-2',
        )}
      >
        <p>
          Updated: <span className='italic'>{format(new Date(updatedAt!), 'PP')}</span>
        </p>
        <p>
          Published: <span className='italic'>{format(new Date(createdAt!), 'PP')}</span>
        </p>
      </div>
    )}
  </div>
);

export default AuthorDateBar;
