import { Link } from 'react-router-dom';

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
        className='text-foreground mr-2 flex items-center justify-center text-sm font-semibold italic'
        data-role='tags-bar-label'
      >
        Tags:
      </div>
      <div className='flex flex-wrap items-center gap-1.5'>
        {tags.map((tag) => (
          <Link to={`/blog/posts/?tags=${tag}`} key={tag}>
            <Badge
              variant='outline'
              className='text-muted-foreground cursor-pointer transition-all hover:scale-102 hover:opacity-85 hover:shadow-sm'
            >
              {tag}
            </Badge>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default TagsBar;
