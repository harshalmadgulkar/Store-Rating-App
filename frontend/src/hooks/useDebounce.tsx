import { useState, useEffect } from 'react';

/**
 * A custom hook that debounces a value.
 *
 * @template T The type of the value being debounced.
 * @param {T} value The value to debounce.
 * @param {number} delay The debounce delay in milliseconds.
 * @returns {T} The debounced value.
 */
function useDebounce<T>(value: T, delay: number): T {
  // State to hold the debounced value
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    // Set a timeout to update the debounced value after the specified delay
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    // Cleanup function: clear the timeout if the value changes before the delay
    // This is crucial for debouncing: it ensures that the `setDebouncedValue`
    // only runs if the `value` hasn't changed for the `delay` duration.
    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]); // Re-run effect when `value` or `delay` changes

  return debouncedValue;
}

export default useDebounce;