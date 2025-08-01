import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

type SelectableTagsProps = {
  tags: string[];
  value: string[];
  onChange: (tags: string[]) => void;
};

/**x
 * @summary A component that displays a list of tags that can be selected.
 */
const SelectableTags = ({ tags, value, onChange }: SelectableTagsProps) => {
  const toggleTag = (tag: string) => {
    if (value.includes(tag)) {
      onChange(value.filter((t) => t !== tag));
    } else {
      onChange([...value, tag]);
    }
  };

  return (
    <div className='my-2 flex flex-wrap gap-3' data-role='selectable-tags'>
      {tags.map((tag) => {
        const selected = value.includes(tag);
        return (
          <Badge
            key={tag}
            variant='outline'
            className={cn(
              'hover:text-foreground hover:border-muted-foreground cursor-pointer transition-all hover:scale-102 hover:opacity-85 hover:shadow-sm',
              selected ? 'text-foreground' : 'text-muted-foreground',
            )}
            onClick={toggleTag.bind(null, tag)}
          >
            {tag}
          </Badge>
        );
      })}
    </div>
  );
};

export default SelectableTags;
