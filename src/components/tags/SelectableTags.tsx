import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group';
import { tapEffect } from '@/lib/animations';
import { cn } from '@/lib/utils';
import { motion } from 'framer-motion';

// To toggle the style of the tag.
const tagClass = (selected: boolean) =>
  cn(
    'rounded-full border px-3 py-1 text-sm transition-colors duration-200',
    'focus-visible:ring-ring focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none',
    selected
      ? 'bg-primary text-background shadow-sm'
      : 'bg-muted text-muted-foreground hover:bg-muted/80',
  );

// A tag that can be toggled.
const SelectableTag = ({ tag, selected }: { tag: string; selected: boolean }) => (
  <motion.div layout whileTap={tapEffect}>
    <ToggleGroupItem value={tag} aria-label={`toggle-tag-${tag}`} className={tagClass(selected)}>
      {tag}
    </ToggleGroupItem>
  </motion.div>
);

/**
 * @summary A component that displays a list of tags that can be selected.
 * @param tags - The list of tags to display.
 * @param selectedTags - The `state` of useState that contains the selected tags.
 * @param setSelectedTags - The `setState` of useState that updates the selected tags.
 * @returns A component that displays a list of tags that can be selected.
 */
const SelectableTags = ({
  tags,
  selectedTags,
  setSelectedTags,
}: {
  tags: string[];
  selectedTags: string[];
  setSelectedTags: React.Dispatch<React.SetStateAction<string[]>>;
}) => (
  <ToggleGroup
    type='multiple'
    variant='outline'
    value={selectedTags} // state of useState
    onValueChange={setSelectedTags} // setState of useState
    className='grid grid-flow-row auto-rows-min grid-cols-[repeat(auto-fit,minmax(100px,auto))] gap-2'
  >
    {tags.map((tag: string) => (
      <SelectableTag key={tag} tag={tag} selected={selectedTags.includes(tag)} />
    ))}
  </ToggleGroup>
);

export default SelectableTags;
