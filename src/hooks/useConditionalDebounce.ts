import { useEffect, useState } from 'react';
import deepEqual from 'fast-deep-equal';

type DebounceSetter<T> = (params: { initValues: T; values: T; conditions: boolean[] }) => void;

/**
 * @summary A custom hook to handle the conditional debounce logic for form auto-submission.
 */
const useConditionalDebounce = <T>({ delay }: { delay: number }): [T | null, DebounceSetter<T>] => {
  const [debounce, setDebounce] = useState<T | null>(null);
  // A buffer to hold the pending values because `setTimeout` is fired in useEffect for clearing the timer.
  const [pending, setPending] = useState<T | null>(null);

  /**
   * @summary The setter function for the debounce handler.
   */
  const setDebounceHandler: DebounceSetter<T> = ({ initValues, values, conditions }) => {
    // If any condition is false, or values are equal to initValues, reset the debounce.
    if (conditions.some((condition) => condition === false) || deepEqual(values, initValues)) {
      setPending(null);
      return;
    }

    setPending(values);
  };

  // Effect to handle the debounce logic
  useEffect(() => {
    if (!pending) {
      setDebounce(null);
      return;
    }

    const timer = setTimeout(() => {
      setDebounce(pending);
    }, delay);

    return () => clearTimeout(timer);
  }, [pending, delay]);

  return [debounce, setDebounceHandler];
};

export default useConditionalDebounce;
