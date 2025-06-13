import MotionButton from '@/components/motion_components/MotionButton';
import { cn } from '@/lib/utils';

/**x
 * @summary A component that displays a list of tags that can be selected.
 * @param tags - The list of tags to display.
 * @param selectedTags - The `state` of useState that contains the selected tags.
 * @param setSelectedTags - The `setState` of useState that updates the selected tags.
 * @returns A component that displays a list of tags that can be selected.
 */
const SelectableTags = ({
  tags,
  value,
  onChange,
}: {
  tags: string[];
  value: string[];
  onChange: (tags: string[]) => void;
}) => {
  const toggleTag = (tag: string) => {
    if (value.includes(tag)) {
      onChange(value.filter((t) => t !== tag));
    } else {
      onChange([...value, tag]);
    }
  };

  return (
    <div className='flex flex-wrap gap-3 my-2'>
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
          >
            {tag}
          </MotionButton>
        );
      })}
    </div>
  );
};

export default SelectableTags;
