import { useState, useEffect, useRef } from 'react';
import { formatCountdown } from '../utils/rateLimitUtils';
import { useAuth } from '../context/AuthContext';

export const useRateLimitCountdown = (actionKey) => {
  let user = null;
  try {
    const auth = useAuth();
    user = auth?.user;
  } catch (e) {
    user = null;
  }

  const [countdown, setCountdown] = useState(0);
  const intervalRef = useRef(null);

  const userId = user?._id || user?.id || 'anon';
  const storageKey = `rateLimit_${userId}_${actionKey}`;

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

  // Initialize and react to storageKey / actionKey / user changes
  useEffect(() => {
    clearInterval(intervalRef.current);
    const storedUntil = sessionStorage.getItem(storageKey);
    if (storedUntil) {
      const untilMs = parseInt(storedUntil, 10);
      const remaining = Math.ceil((untilMs - Date.now()) / 1000);

      if (remaining > 0) {
        setCountdown(remaining);
        startTimer();
      } else {
        sessionStorage.removeItem(storageKey);
        setCountdown(0);
      }
    } else {
      setCountdown(0);
    }

    return () => clearInterval(intervalRef.current);
  }, [storageKey]);

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
    triggerRateLimit,
  };
};
