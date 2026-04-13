import { useState, useEffect, useRef } from 'react';

/**
 * Returns elapsed milliseconds since the timer was last started.
 * Uses Date.now() delta so backgrounded tabs don't skew the result.
 */
export function useTimer(active: boolean): number {
  const [elapsedMs, setElapsedMs] = useState(0);
  const startRef = useRef<number | null>(null);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    if (active) {
      startRef.current = Date.now() - elapsedMs;
      intervalRef.current = setInterval(() => {
        setElapsedMs(Date.now() - startRef.current!);
      }, 100);
    } else {
      if (intervalRef.current !== null) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    }

    return () => {
      if (intervalRef.current !== null) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [active]);

  // Reset when transitioning from inactive to active (new game)
  const prevActive = useRef(active);
  useEffect(() => {
    if (active && !prevActive.current) {
      setElapsedMs(0);
      startRef.current = Date.now();
    }
    prevActive.current = active;
  }, [active]);

  return elapsedMs;
}
