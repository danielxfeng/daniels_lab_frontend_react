import { useEffect, useState } from 'react';
import { ControllerRenderProps } from 'react-hook-form';
import { AnimatePresence, motion } from 'framer-motion';

import MotionInput from '@/components/motion_components/MotionInput';
import logError from '@/lib/logError';
import { CreateOrUpdatePostBody } from '@/schema/schema_post';
import { tagSchema, TagsResponseSchema } from '@/schema/schema_tag';
import { debouncedSearchTagsByPrefix } from '@/services/service_tags';

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
const TagInputComponent = ({
  field,
  inputId,
}: {
  field: ControllerRenderProps<CreateOrUpdatePostBody>;
  inputId: string;
}) => {
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [tagError, setTagError] = useState<string | null>(null);

  // Add a tag to the list
  const addTag = (tag: string) => {
    const tags = field.value || [];
    if (tag && !tags.includes(tag)) {
      const newTags = [...tags, tag];
      field.onChange(newTags);
      field.onBlur();
      setInputValue('');
    }
  };

  // Update suggestions when input changes
  useEffect(() => {
    // The async function to fetch suggestions
    const run = async () => {
      const validatedKeyword = tagSchema.safeParse(inputValue);
      if (!validatedKeyword.success) {
        setTagError(validatedKeyword.error.issues[0].message);
        return;
      }
      setTagError(null); // Clear error
      // Try to fetch from the server
      try {
        const suggestionsRes = await debouncedSearchTagsByPrefix(validatedKeyword.data);
        const validatedSuggestions = TagsResponseSchema.safeParse(suggestionsRes.data);
        if (!validatedSuggestions.success) {
          logError(validatedSuggestions.error, 'Invalid suggestions response');
          return;
        }
        // It still may be a stale update, but it may still make sense to user.
        setSuggestions(validatedSuggestions.data.tags.filter((s) => s !== inputValue));
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
      } catch (error: any) {
        // If the error is 429 (May be rate-limited or debounced, it's normal)
        if (error?.response?.status !== 429) logError(error, 'Error fetching suggestions');
        setSuggestions((prev) => prev.filter((s) => s !== inputValue));
      }
    };

    // If the input is empty, just clear suggestions
    if (!inputValue.trim()) return setSuggestions([]);
    run();
  }, [inputValue]);

  return (
    <div className='space-y-2'>
      {/* Input + Suggestions */}
      <div className='relative'>
        {/* Input field */}
        <MotionInput
          value={inputValue}
          id={inputId}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              e.preventDefault();
              const validatedKeyword = tagSchema.safeParse(inputValue);
              if (!validatedKeyword.success) {
                setTagError(validatedKeyword.error.issues[0].message);
                return;
              }
              setTagError(null);
              addTag(validatedKeyword.data);
            }
          }}
          placeholder='Add tag...'
          data-role='input-tag'
          autoComplete='off'
        />
        {/* Error message */}
        {tagError && (
          <p className='text-destructive text-sm' data-role='tag-input-error'>
            {tagError}
          </p>
        )}

        {/* Dropdown for suggestions */}
        <AnimatePresence>
          {inputValue && suggestions.length > 0 && (
            <motion.ul
              initial={{ opacity: 0, y: -4 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -4 }}
              className='bg-background absolute z-10 mt-1 w-full rounded-md shadow'
              data-role='tag-suggestions'
            >
              {suggestions.map((s) => (
                <li
                  key={s}
                  onClick={() => addTag(s)}
                  className='hover:bg-muted cursor-pointer px-3 py-1 text-xs'
                  data-role='tag-suggestion-item'
                  role='option'
                  aria-label={`Add tag: ${s}`}
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
