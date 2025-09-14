import { useState, useCallback } from "react";

interface RateLimitState {
  attempts: number;
  lastAttempt: number;
  isBlocked: boolean;
}

const MAX_LOGIN_ATTEMPTS = 5;
const BLOCK_DURATION = 15 * 60 * 1000; // 15 minutes
const ATTEMPT_WINDOW = 5 * 60 * 1000; // 5 minutes

export function useAuthRateLimit() {
  const [rateLimitState, setRateLimitState] = useState<RateLimitState>({
    attempts: 0,
    lastAttempt: 0,
    isBlocked: false
  });

  const checkRateLimit = useCallback((): { allowed: boolean; message?: string; remainingTime?: number } => {
    const now = Date.now();
    const { attempts, lastAttempt, isBlocked } = rateLimitState;

    // Check if still blocked
    if (isBlocked && (now - lastAttempt) < BLOCK_DURATION) {
      const remainingTime = Math.ceil((BLOCK_DURATION - (now - lastAttempt)) / 1000 / 60);
      return { 
        allowed: false, 
        message: `Preveč neuspešnih poskusov. Poskusite znova čez ${remainingTime} minut.`,
        remainingTime 
      };
    }

    // Reset if block duration has passed
    if (isBlocked && (now - lastAttempt) >= BLOCK_DURATION) {
      setRateLimitState({
        attempts: 0,
        lastAttempt: 0,
        isBlocked: false
      });
      return { allowed: true };
    }

    // Reset attempts if outside the attempt window
    if ((now - lastAttempt) > ATTEMPT_WINDOW) {
      setRateLimitState({
        attempts: 0,
        lastAttempt: 0,
        isBlocked: false
      });
      return { allowed: true };
    }

    // Check if max attempts reached
    if (attempts >= MAX_LOGIN_ATTEMPTS) {
      setRateLimitState(prev => ({
        ...prev,
        isBlocked: true
      }));
      return { 
        allowed: false, 
        message: "Preveč neuspešnih poskusov prijave. Račun je začasno blokiran za 15 minut." 
      };
    }

    return { allowed: true };
  }, [rateLimitState]);

  const recordFailedAttempt = useCallback(() => {
    const now = Date.now();
    setRateLimitState(prev => ({
      attempts: prev.attempts + 1,
      lastAttempt: now,
      isBlocked: prev.attempts + 1 >= MAX_LOGIN_ATTEMPTS
    }));
  }, []);

  const recordSuccessfulLogin = useCallback(() => {
    setRateLimitState({
      attempts: 0,
      lastAttempt: 0,
      isBlocked: false
    });
  }, []);

  return {
    checkRateLimit,
    recordFailedAttempt,
    recordSuccessfulLogin,
    isBlocked: rateLimitState.isBlocked
  };
}