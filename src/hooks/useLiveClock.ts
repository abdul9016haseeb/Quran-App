import { useEffect, useState } from 'react';

/**
 * Returns the current time, refreshed on an interval.
 * Used for the prayer screen's local clock preview. This is device time,
 * not an API response.
 */
export function useLiveClock(intervalMs = 1000): Date {
  const [now, setNow] = useState(() => new Date());

  useEffect(() => {
    const timer = setInterval(() => setNow(new Date()), intervalMs);
    return () => clearInterval(timer);
  }, [intervalMs]);

  return now;
}
