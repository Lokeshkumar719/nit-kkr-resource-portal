import { useState, useEffect, useRef } from 'react';
import { formatCountdown } from '../utils/rateLimitUtils';

export const useRateLimitCountdown = (actionKey) => {
  const [countdown, setCountdown] = useState(0);
  const intervalRef = useRef(null);

  const storageKey = `rateLimit_${actionKey}`;

  // Initialize from sessionStorage on mount
  useEffect(() => {
    const storedUntil = sessionStorage.getItem(storageKey);
    if (storedUntil) {
      const untilMs = parseInt(storedUntil, 10);
      const remaining = Math.ceil((untilMs - Date.now()) / 1000);
      
      if (remaining > 0) {
        setCountdown(remaining);
        startTimer();
      } else {
        sessionStorage.removeItem(storageKey);
      }
    }

    return () => clearInterval(intervalRef.current);
  }, [actionKey]);

  const startTimer = () => {
    clearInterval(intervalRef.current);
    intervalRef.current = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(intervalRef.current);
          sessionStorage.removeItem(storageKey);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  const triggerRateLimit = (seconds) => {
    if (seconds <= 0) return;
    
    const untilMs = Date.now() + seconds * 1000;
    sessionStorage.setItem(storageKey, untilMs.toString());
    setCountdown(seconds);
    startTimer();
  };

  return {
    isRateLimited: countdown > 0,
    countdown,
    formattedCountdown: formatCountdown(countdown),
    triggerRateLimit
  };
};
