import MotionButton from '@/components/motion_components/MotionButton';
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group';
import { tapEffect } from '@/lib/animations';
import { cn } from '@/lib/utils';
import { motion } from 'framer-motion';

// To toggle the style of the tag.
const tagClass = (selected: boolean) =>
  cn(
    'rounded-full border px-3 text-sm transition-colors duration-200 shadow-sm',
    'focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none',
    selected
      ? '!bg-highlight !text-background shadow'
      : 'bg-muted text-muted-foreground hover:bg-muted/70',
  );

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
