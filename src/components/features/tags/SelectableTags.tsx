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
}) => (
  <div className='flex flex-col gap-2'>
    <h4>🔥 tags:</h4>
    <ToggleGroup
      type='multiple'
      variant='outline'
      value={value}
      onValueChange={onChange}
      className='flex flex-wrap gap-2 !shadow-none'
    >
      {tags.map((tag) => (
        <motion.div key={tag} layout whileTap={tapEffect}>
          <ToggleGroupItem
            value={tag}
            aria-label={`toggle-tag-${tag}`}
            className={tagClass(value.includes(tag))}
          >
            {tag}
          </ToggleGroupItem>
        </motion.div>
      ))}
    </ToggleGroup>
  </div>
);

export default SelectableTags;
