import { useState } from 'react';
import { useForm, UseFormRegister } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Search } from 'lucide-react';
import useSearchHistoryStore from '@/stores/useSearchHistoryStore';
import { KeywordSearchQuerySchema } from '@/schema/schema_post';
import MotionIconButton from '../motion_components/MotionIconButton';
import { AnimatePresence, easeInOut, motion } from 'framer-motion';
import { useNavigate } from 'react-router';

// Define a type for form input.
type FormValues = { keyword: string };

// Define a component for the input field.
const InputComponent = ({
  register,
  setShowDropdown,
}: {
  register: UseFormRegister<FormValues>;
  setShowDropdown: React.Dispatch<React.SetStateAction<boolean>>;
}) => (
  <input
    //We register the keyword to component
    {...register('keyword')}
    // Define the style
    className='bg-muted border-muted-foreground ring-ring w-full rounded-xl border px-4 py-2 text-sm shadow-sm focus:ring focus:outline-none'
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
);

// A component to display the dropdown history
const DropdownHistory = ({
  showDropdown,
  onSelect,
}: {
  showDropdown: boolean;
  onSelect: (keyword: string) => void;
}) => {
  // Get the snapshot from the Zustand store
  const history = useSearchHistoryStore.getState().history;
  return (
    <AnimatePresence>
      {showDropdown && history.length > 0 && (
        <motion.ul
          {...easeInOut}
          className='bg-background absolute z-10 mt-1 flex w-full flex-col gap-0 px-2 pb-2 md:rounded-xl md:shadow'
        >
          {/* Iterate all items */}
          {history.map((item) => (
            <li
              key={item}
              className='hover:bg-muted text-muted-foreground cursor-pointer overflow-hidden px-4 py-1 text-sm'
              // When clicked, we also set the keyword and fire the submit.
              onClick={async () => {
                onSelect(item);
              }}
            >
              {item}
            </li>
          ))}
        </motion.ul>
      )}
    </AnimatePresence>
  );
};

/**
 * @summary SearchBar component
 * @description
 * This component is a search bar that allows users to search for posts by keyword.
 * It populates a dropdown with search history.
 * The history is stored in a Zustand store, which is persisted in localstorage.
 * It runs normally in desktop view, but runs in a popup sheet in mobile view.
 * @param setOpen = The hook to close the popup sheet. Only needed in mobile view.
 */
const SearchBar = ({ setOpen }: { setOpen?: React.Dispatch<React.SetStateAction<boolean>> }) => {
  // useState to manage the visibility of the dropdown history
  const [showDropdown, setShowDropdown] = useState(false);
  // Get the snapshot of the search history from the Zustand store
  const addHistory = useSearchHistoryStore.getState().addHistory;
  // for navigation to the search page
  const navigate = useNavigate();

  // Apply react-hook-form to manage form state and validation
  const {
    register,
    handleSubmit,
    setValue,
    reset,
    formState: { isSubmitting },
  } = useForm<FormValues>({
    // Use zod for schema validation
    resolver: zodResolver(KeywordSearchQuerySchema),
    defaultValues: { keyword: '' },
    // We validate only on submit, bc we don't show errors on input
    // If the input is empty, we don't fire the http request.
    mode: 'onSubmit',
    reValidateMode: 'onSubmit',
  });

  // We create a closure to handle the form submission
  const onSubmit = (data: FormValues) => {
    setShowDropdown(false); // Close the dropdown
    addHistory(data.keyword); // Add the keyword to the history
    if (setOpen) setOpen(false); // Close the popup sheet if it exists
    const searchParams = new URLSearchParams({ keyword: data.keyword, offset: '0', limit: '10' });
    reset(); // Reset the form
    navigate(`/blog/posts/search?${searchParams.toString()}`); // Navigate to the search page with the keyword
  };

  return (
    <div className='relative w-full max-w-md'>
      {/* The form */}
      <form onSubmit={handleSubmit(onSubmit)}>
        <fieldset disabled={isSubmitting}>
          {/* The input field */}
          <InputComponent register={register} setShowDropdown={setShowDropdown} />

          {/* The search button */}
          <MotionIconButton
            icon={<Search className='h-5 w-5' />}
            type='submit'
            ariaLabel='Search'
            className='text-muted-foreground hover:text-primary absolute top-1/2 right-2 -translate-y-1/2 p-1'
            disabled={isSubmitting}
          />
        </fieldset>
      </form>

      {/* Dropdown History */}
      <DropdownHistory
        showDropdown={showDropdown}
        onSelect={async (keyword) => {
          setValue('keyword', keyword);
          await handleSubmit(onSubmit)();
        }}
      />
    </div>
  );
};

export default SearchBar;
