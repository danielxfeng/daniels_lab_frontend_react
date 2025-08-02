import { Link } from 'react-router';

import { Badge } from '@/components/ui/badge';

/**
 * @summary The TagsBar component displays a list of tags.
 */
const TagsBar = ({ tags }: { tags: string[] }) => {
  if (!tags || tags.length === 0) {
    return null; // Return null if there are no tags to display
  }
  return (
    <div className='flex items-center gap-1' data-role='tags-bar'>
      <div
        className='text-foreground mr-2 flex h-full items-center justify-center text-sm font-semibold italic'
        data-role='tags-bar-label'
      >
        Tags:
      </div>
      <div className='flex flex-wrap items-center gap-1.5'>
        {tags.map((tag) => (
          <Badge
            variant='outline'
            key={tag}
            className='text-muted-foreground cursor-pointer transition-all hover:scale-102 hover:opacity-85 hover:shadow-sm'
          >
            <Link to={`/blog/posts/?tags=${tag}`} className='text-inherit'>
              {tag}
            </Link>
          </Badge>
        ))}
      </div>
    </div>
  );
};

export default TagsBar;
