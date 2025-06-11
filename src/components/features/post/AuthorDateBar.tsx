import Author from '@/components/features/post/Author';
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
}: {
  authorName: string;
  authorAvatar: string | null;
  createdAt: string | undefined;
  updatedAt?: string | undefined;
}) => (
  <div className='flex w-full items-center justify-between'>
    <Author name={authorName} avatarUrl={authorAvatar ?? undefined} />
    <div className='text-muted-foreground text-sm'>
      Updated At:{' '}<span className='italic'>{format(new Date(updatedAt || createdAt!), 'PP')}</span>
    </div>
  </div>
);

export default AuthorDateBar;
