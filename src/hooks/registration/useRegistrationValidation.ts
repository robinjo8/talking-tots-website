
import { useState } from "react";

export function useRegistrationValidation() {
  const [error, setError] = useState<string | null>(null);

  const validateAccountInfo = async (
    username: string, 
    email: string, 
    password: string, 
    confirmPassword: string, 
    childName: string,
    checkEmailExists: (email: string) => Promise<boolean>
  ): Promise<boolean> => {
    if (!username || !email || !password || !confirmPassword) {
      setError("Prosimo, izpolnite vsa obvezna polja.");
      return false;
    }
    
    if (username.length < 3) {
      setError("Uporabniško ime mora vsebovati vsaj 3 znake.");
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

    // Check if email already exists
    const emailExists = await checkEmailExists(email);
    if (emailExists) {
      setError("Uporabnik s tem e-poštnim naslovom že obstaja.");
      return false;
    }

    return true;
  };

  return {
    error,
    setError,
    validateAccountInfo
  };
}
