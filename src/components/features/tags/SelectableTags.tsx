import MotionButton from '@/components/motion_components/MotionButton';
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
          <MotionButton
            key={tag}
            buttonType='button'
            variant='tag'
            size='sm'
            text={tag}
            onClick={() => toggleTag(tag)}
            btnClass={cn(selected && 'border-highlight')}
            textClass={cn(selected && 'text-highlight')}
            supportingText={`toggle-tag-${tag}`}
            dataRole={`tag-${tag}`}
          >
            {tag}
          </MotionButton>
        );
      })}
    </div>
  );
};

export default SelectableTags;
