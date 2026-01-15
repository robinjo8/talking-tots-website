
import { useState } from "react";

export function useRegistrationValidation() {
  const [error, setError] = useState<string | null>(null);

  const validateAccountInfo = async (
    firstName: string,
    lastName: string, 
    email: string, 
    password: string, 
    confirmPassword: string, 
    childName: string,
    childBirthDate: Date | null,
    validateEmailSafely?: (email: string) => Promise<{ isValid: boolean; message?: string }>
  ): Promise<boolean> => {
    if (!firstName || !lastName || !email || !password || !confirmPassword) {
      setError("Prosimo, izpolnite vsa obvezna polja.");
      return false;
    }
    
    if (firstName.length < 2) {
      setError("Ime mora vsebovati vsaj 2 znaka.");
      return false;
    }
    
    if (lastName.length < 2) {
      setError("Priimek mora vsebovati vsaj 2 znaka.");
      return false;
    }
    
    if (password !== confirmPassword) {
      setError("Gesli se ne ujemata.");
      return false;
    }
    
    if (password.length < 6) {
      setError("Geslo mora vsebovati vsaj 6 znakov.");
      return false;
    }
    
    // Check if current child has name
    if (!childName.trim()) {
      setError("Prosimo, vnesite ime otroka.");
      return false;
    }
    
    // Check if child birth date is provided
    if (!childBirthDate) {
      setError("Prosimo, vnesite datum rojstva otroka.");
      return false;
    }

    // Secure email validation without enumeration
    if (validateEmailSafely) {
      const emailValidation = await validateEmailSafely(email);
      if (!emailValidation.isValid) {
        setError(emailValidation.message || "Napaka pri preverjanju e-pošte.");
        return false;
      }
    }

    return true;
  };

  return {
    error,
    setError,
    validateAccountInfo
  };
}
