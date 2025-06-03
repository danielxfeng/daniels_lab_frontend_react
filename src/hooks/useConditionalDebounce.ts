import deepEqual from 'fast-deep-equal';
import { useEffect, useState } from 'react';

type DebounceSetter<T> = (params: { values: T; conditions: boolean[] }) => void;

/**
 * @summary A custom hook to handle the conditional debounce logic for form auto-submission.
 * @detailed
 *
 * ### The Problem ###
 *
 * In this project, I have a form with a multi-selection input and date pickers.
 * Normally, I can use `setTimeout` to debounce auto-submission:
 * when values stay unchanged for a period (`delay`), the form is submitted.
 *
 * ### The Challenge ###
 *
 * But date pickers bring extra complexity:
 * - Obviously, when a date picker is open, the interaction is ongoing.
 * - But the open state change of the date picker may include a value change, or not.
 * So the interaction conditions and the value change are in-consistent.
 *
 * ### The Solution ###
 *
 * We submit the form only when:
 * - The change of either the form value or the open states fires the hook.
 * - But the debounce timer is only started when all date pickers are closed.
 * - Split the logic into layers to decouple the coupling between value and interaction.
 *
 * @template T - The type of the form values.
 *
 * @param initValue - The initial value of the form
 * @param delay - The debounce delay in milliseconds.
 * @param formValue - The current value of the form.
 * @param openStates - An array of boolean values indicating whether each date picker is open.
 *
 * @returns
 * - `debounce`: The debounced value of the form, or `null` if the conditions are not met.
 * - `setDebounceHandler`: A setter function to update the debounce value based on the current form values and conditions.
 */
const useConditionalDebounce = <T>({
  initValues,
  delay,
}: {
  initValues: T;
  delay: number;
}): [T | null, DebounceSetter<T>] => {
  const [debounce, setDebounce] = useState<T | null>(null);
  // A buffer to hold the pending values because `setTimeout` is fired in useEffect for clearing the timer.
  const [pending, setPending] = useState<T | null>(null);

  /**
   * @summary The setter function for the debounce handler.
   * @description
   * We check the conditions, then set the buffer `pending` value.
   *
   * @param values - The current values of the form.
   * @param conditions - An array of boolean values indicating whether each condition is met.
   */
  const setDebounceHandler: DebounceSetter<T> = ({ values, conditions }) => {
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
