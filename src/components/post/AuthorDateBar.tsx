import Author from '@/components/post/Author';
import { format } from 'date-fns';

/**
 * @summary The AuthorDateBar component displays the author's name and avatar along with the post's creation date.
 * @param authorName - The name of the author.
 * @param authorAvatar - The URL of the author's avatar. If not provided, the first letter of the name will be used as a fallback.
 * @param createdAt - The date the post was created.
 * @returns A React component that displays the author's avatar and name.
 */
const AuthorDateBar = ({
  authorName,
  authorAvatar,
  createdAt,
}: {
  authorName: string;
  authorAvatar: string | null;
  createdAt: string | undefined;
}) => (
  <div className='flex w-full items-center justify-between'>
    <Author name={authorName} avatarUrl={authorAvatar ?? undefined} />
    <div className='text-muted-foreground'>{format(new Date(createdAt!), 'PPP')}</div>
  </div>
);

export default AuthorDateBar;
