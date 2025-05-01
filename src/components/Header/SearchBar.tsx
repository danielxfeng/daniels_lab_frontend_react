import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Search } from 'lucide-react';
import useSearchHistoryStore from '@/stores/useSearchHistoryStore';
import { KeywordSearchQuerySchema } from '@/schema/schema_post';

// Define a type for form input.
type FormValues = { keyword: string };

/**
 * @summary SearchBar component
 * @description
 * This component is a search bar that allows users to search for posts by keyword.
 * It populates a dropdown with search history.
 * The history is stored in a Zustand store.
 */
const SearchBar = () => {
  // useState to manage the visibility of the dropdown history
  const [showDropdown, setShowDropdown] = useState(false);
  // Zustand store to manage search history, we use Zustand for localstorage management
  const { addHistory, getHistory } = useSearchHistoryStore();

  // Apply react-hook-form to manage form state and validation
  const { register, handleSubmit, setValue } = useForm<FormValues>({
    // Use zod for schema validation
    resolver: zodResolver(KeywordSearchQuerySchema),
    defaultValues: { keyword: '' },
    // We validate only on submit, bc we don't show errors on input
    // If the input is empty, we don't fire the http request.
    mode: 'onSubmit',
    reValidateMode: 'onSubmit',
  });

  // Function to handle form submission
  const onSubmit = (data: FormValues) => {
    // Bc the type, we need to reassemble the data.
    const assembledData = { ...data, offset: '0', limit: '10' };
    // Validate the input again
    const result = KeywordSearchQuerySchema.safeParse(assembledData);
    if (!result.success) {
      console.error(JSON.stringify(result.error));
      return;
    }
    const searchParams = result.data;
    // Add the keyword to history.
    addHistory(searchParams.keyword);
    // TODO: fire the http request to search posts by keyword
    // close the dropdown history
    console.log('Search posts by keyword:', searchParams.keyword);
    setShowDropdown(false);
  };

  const history = getHistory();

  return (
    <div className='relative w-full max-w-md'>
      <form onSubmit={handleSubmit(onSubmit)}>
        <input
          //We register the keyword to component
          {...register('keyword')}
          // Define the style
          className='bg-input w-full rounded-4xl border px-4 py-2 shadow-sm focus:ring focus:outline-none'
          placeholder='Search posts...'
          // We expand the dropdown history when the input is focused
          onFocus={() => setShowDropdown(true)}
          // It's a wired behavior. When user is clicking the dropdown item,
          // the input will be blurred before the click event is fired.
          // Therefore, we delay the closing after the onClick event is fired.
          onBlur={() => setTimeout(() => setShowDropdown(false), 200)}
          // We set the `enter` key to submit the form
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              setShowDropdown(false);
            }
          }}
        />
        <button
          type='submit'
          className='text-muted-foreground hover:text-foreground absolute top-1/2 right-2 -translate-y-1/2 p-1'
          aria-label='Search'
        >
          <Search className='h-4 w-4' />
        </button>
      </form>

      {/* If the input is focused and there is history, we show the dropdown */}
      {showDropdown && history.length > 0 && (
        <ul className='bg-background absolute z-10 mt-1 w-full rounded-xl py-2 shadow'>
          {history.map((item) => (
            <li
              key={item}
              className='hover:bg-muted cursor-pointer px-4 py-2'
              // When clicked, we also set the keyword and fire the submit.
              onClick={() => {
                setValue('keyword', item);
                handleSubmit(onSubmit)();
              }}
            >
              {item}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default SearchBar;
