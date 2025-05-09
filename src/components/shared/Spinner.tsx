import { Loader2 } from 'lucide-react';

/**
 * @summary A spinner component for loading states.
 * @returns A spinner component.
 */
const Spinner = () => {
  return (
    <div className='flex items-center justify-center'>
      <Loader2 className='h-6 w-6 animate-spin text-gray-500' />
    </div>
  );
};

export default Spinner;
