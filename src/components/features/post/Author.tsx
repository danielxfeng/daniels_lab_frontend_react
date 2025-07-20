import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

/**
 * The Author component displays the author's avatar and name.
 */
const Author = ({ name, avatarUrl }: { name: string; avatarUrl?: string }) => {
  return (
    <div className='flex items-center gap-2' data-role='author'>
      <Avatar className='h-6 w-6' data-role='author-avatar'>
        <AvatarImage src={avatarUrl} alt={`${name}'s avatar`} />
        <AvatarFallback>{name?.[0] ?? 'U'}</AvatarFallback>
      </Avatar>
      <span className='text-muted-foreground ml-2 text-sm font-medium' data-role='author-name'>
        {name}
      </span>
    </div>
  );
};

export default Author;
