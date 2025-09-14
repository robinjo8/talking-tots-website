import { useState } from "react";

// Rate limiting state
const emailCheckAttempts = new Map<string, { count: number; lastAttempt: number }>();
const MAX_EMAIL_CHECKS = 3;
const RATE_LIMIT_WINDOW = 60000; // 1 minute

export function useSecureAccountState() {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [selectedPlan, setSelectedPlan] = useState("yearly");
  const [isCheckingEmail, setIsCheckingEmail] = useState(false);

  const isRateLimited = (email: string): boolean => {
    const attempts = emailCheckAttempts.get(email);
    if (!attempts) return false;
    
    const now = Date.now();
    if (now - attempts.lastAttempt > RATE_LIMIT_WINDOW) {
      emailCheckAttempts.delete(email);
      return false;
    }
    
    return attempts.count >= MAX_EMAIL_CHECKS;
  };

  const recordEmailCheck = (email: string) => {
    const now = Date.now();
    const attempts = emailCheckAttempts.get(email);
    
    if (!attempts || now - attempts.lastAttempt > RATE_LIMIT_WINDOW) {
      emailCheckAttempts.set(email, { count: 1, lastAttempt: now });
    } else {
      emailCheckAttempts.set(email, { 
        count: attempts.count + 1, 
        lastAttempt: now 
      });
    }
  };

  // Secure email validation - no enumeration vulnerability
  const validateEmailSafely = async (email: string): Promise<{ isValid: boolean; message?: string }> => {
    if (!email) {
      return { isValid: false, message: "E-pošta je obvezna." };
    }
    
    // Rate limiting check
    if (isRateLimited(email)) {
      return { 
        isValid: false, 
        message: "Preveč poskusov. Poskusite znova čez minuto." 
      };
    }

    // Basic email format validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return { isValid: false, message: "Neveljaven format e-pošte." };
    }

    recordEmailCheck(email);

    // Instead of checking if email exists, we always return true for valid format
    // The actual duplicate check happens server-side during registration
    return { isValid: true };
  };

  return {
    username,
    setUsername,
    email,
    setEmail,
    password,
    setPassword,
    confirmPassword,
    setConfirmPassword,
    selectedPlan,
    setSelectedPlan,
    isCheckingEmail,
    validateEmailSafely
  };
}