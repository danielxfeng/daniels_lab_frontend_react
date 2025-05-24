import { useEffect, useState } from 'react';
import { useDebounce } from 'use-debounce';
import { Input } from '@/components/ui/input';
import { motion, AnimatePresence } from 'framer-motion';
import { useFormContext } from 'react-hook-form';

/**
 * @summary A tag input component.
 * @description
 * There are 2 parts:
 * 1. The input field.
 *   1.1 Show the suggestions dropdown on focus.
 *   1.3 Add the tag to the list on ENTER.
 *   1.2 Close the suggestions dropdown on blur/ENTER.
 *
 * 2. The suggestions dropdown.
 *   2.1 Fetch the suggestions from the server by debouncing the input value.
 *   2.2 Filter the suggestions based on the current tags.
 *   2.3 Add the tag to the list on click, then hide itself.
 */
const TagInputComponent = ({ name, tags }: { name: string; tags: string[] }) => {
  const { setValue } = useFormContext();

  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [debouncedInput] = useDebounce(inputValue, 300);

  // Add a tag to the list
  const addTag = (tag: string) => {
    if (tag && !tags.includes(tag)) {
      const newTags = [...tags, tag];
      setValue(name, newTags, { shouldValidate: true, shouldDirty: true });
      setInputValue('');
    }
  };

  // Update suggestions when input changes
  useEffect(() => {
    if (!debouncedInput) return;
    setSuggestions(
      ['tag1', 'tag2', 'tag3']
        .filter((s) => s.toLowerCase().includes(debouncedInput.toLowerCase()))
        .filter((s) => !tags.includes(s)),
    );
  }, [debouncedInput, tags]);

  return (
    <div className='space-y-2'>
      {/* Input + Suggestions */}
      <div className='relative'>
        {/* Input field */}
        <Input
          value={inputValue}
          id='tag-input'
          onChange={(e) => setInputValue(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              e.preventDefault();
              addTag(inputValue);
            }
          }}
          className='bg-muted border-muted-foreground'
          placeholder='Add tag...'
        />

        {/* Dropdown for suggestions */}
        <AnimatePresence>
          {inputValue && suggestions.length > 0 && (
            <motion.ul
              initial={{ opacity: 0, y: -4 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -4 }}
              className='bg-background absolute z-10 mt-1 w-full rounded-md shadow'
            >
              {suggestions.map((s) => (
                <li
                  key={s}
                  onClick={() => addTag(s)}
                  className='hover:bg-muted cursor-pointer px-3 py-1'
                >
                  {s}
                </li>
              ))}
            </motion.ul>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default TagInputComponent;
