import { useCallback, useRef } from 'react';

export function useDebouncedCallback<A extends unknown[]>(
  callback: (...args: A) => void,
  delay: number
): (...args: A) => void {
  const callbackRef = useRef(callback);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const lastArgsRef = useRef<A | null>(null);

  callbackRef.current = callback;

  return useCallback(
    (...args: A) => {
      lastArgsRef.current = args;

      if (timeoutRef.current !== null) {
        clearTimeout(timeoutRef.current);
      }

      timeoutRef.current = setTimeout(() => {
        timeoutRef.current = null;
        const captured = lastArgsRef.current;
        if (captured !== null) {
          callbackRef.current(...captured);
        }
      }, delay);
    },
    [delay]
  );
}
