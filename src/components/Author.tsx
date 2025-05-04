import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';

/**
 * The Author component displays the author's avatar and name.
 * @param name - The name of the author.
 * @param avatarUrl - The URL of the author's avatar. If not provided, the first letter of the name will be used as a fallback.
 * @returns A React component that displays the author's avatar and name.
 */
const Author = ({ name, avatarUrl }: { name: string; avatarUrl?: string }) => {
  return (
    <div className='flex items-center gap-2'>
      <Avatar className='h-10 w-10 md:h-12 md:w-12'>
        <AvatarImage src={avatarUrl} alt={`${name}'s avatar`} />
        <AvatarFallback>{name?.[0] ?? 'U'}</AvatarFallback>
      </Avatar>
      <span className='text-muted-foreground ml-2 text-sm font-medium'>{name}</span>
    </div>
  );
};

export default Author;
