import { useState } from 'react';
import { useForm, UseFormRegister, UseFormSetValue } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Search } from 'lucide-react';
import useSearchHistoryStore from '@/stores/useSearchHistoryStore';
import { KeywordSearchQuerySchema } from '@/schema/schema_post';
import MotionIconButton from '../motion_components/MotionIconButton';
import { AnimatePresence, easeInOut, motion } from 'framer-motion';

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
    className='bg-input border-primary w-full rounded-4xl border px-4 py-2 text-sm shadow-sm focus:ring focus:outline-none'
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

// A closure function to generate the submit handler
const createKeywordSubmitHandler = ({
  addHistory,
  setShowDropdown,
}: {
  addHistory: (entry: string) => void;
  setShowDropdown: React.Dispatch<React.SetStateAction<boolean>>;
}) => {
  return async (data: FormValues) => {
    const assembledData = { ...data, offset: '0', limit: '10' };
    const result = KeywordSearchQuerySchema.safeParse(assembledData);
    if (!result.success) {
      console.error(JSON.stringify(result.error));
      return;
    }

    const searchParams = result.data;
    addHistory(searchParams.keyword);
    console.log('Search posts by keyword:', searchParams.keyword);
    setShowDropdown(false);
  };
};

const DropdownHistory = ({
  showDropdown,
  history,
  setValue,
  onSelect,
}: {
  showDropdown: boolean;
  history: string[];
  setValue: UseFormSetValue<FormValues>;
  onSelect: (keyword: string) => void;
}) => (
  <AnimatePresence>
    {showDropdown && history.length > 0 && (
      <motion.ul
        {...easeInOut}
        className='bg-background absolute z-10 mt-1 w-full px-2 pb-2 flex flex-col gap-0 md:rounded-xl md:shadow'
      >
        {/* Iterate all items */}
        {history.map((item) => (
          <li
            key={item}
            className='hover:bg-muted cursor-pointer overflow-hidden px-4 py-1 text-sm text-foreground'
            // When clicked, we also set the keyword and fire the submit.
            onClick={async () => {
              setValue('keyword', item);
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

/**
 * @summary SearchBar component
 * @description
 * This component is a search bar that allows users to search for posts by keyword.
 * It populates a dropdown with search history.
 * The history is stored in a Zustand store, which is persisted in localstorage.
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

  // We create a submit handler for the form
  const onSubmit = createKeywordSubmitHandler({
    addHistory,
    setShowDropdown,
  });
  const history = getHistory();

  return (
    <div className='relative w-full max-w-md'>
      {/* The form */}
      <form onSubmit={handleSubmit(onSubmit)}>
        {/* The input field */}
        <InputComponent register={register} setShowDropdown={setShowDropdown} />

        {/* The search button */}
        <MotionIconButton
          icon={<Search className='h-5 w-5' />}
          type='submit'
          ariaLabel='Search'
          className='text-muted-foreground hover:text-foreground absolute top-1/2 right-2 -translate-y-1/2 p-1'
        />
      </form>

      {/* Dropdown History */}
      <DropdownHistory
        showDropdown={showDropdown}
        history={history}
        setValue={setValue}
        onSelect={async (keyword) => {
          setValue('keyword', keyword);
          await handleSubmit(onSubmit)();
        }}
      />
    </div>
  );
};

export default SearchBar;
