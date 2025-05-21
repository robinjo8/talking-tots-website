
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";

export function useAccountState() {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [selectedPlan, setSelectedPlan] = useState("Mesečna naročnina - 19,90 € / mesec");
  const [isCheckingEmail, setIsCheckingEmail] = useState(false);

  const checkEmailExists = async (email: string): Promise<boolean> => {
    if (!email) return false;
    
    setIsCheckingEmail(true);
    try {
      // Use a more reliable approach to check if email exists
      const { data, error } = await supabase.auth.signInWithOtp({
        email,
        options: {
          shouldCreateUser: false, // Don't create a new user, just check if it exists
        }
      });
      
      // If there's an error with "otp_disabled", the login was not rejected due to a missing user
      // This implies that the user exists but OTP is disabled (normal case for password accounts)
      if (error && error.message.includes("otp_disabled")) {
        console.log("Email check result: true for email:", email);
        return true;
      }
      
      // If we got a "Signups not allowed for otp" error, this means the account doesn't exist
      if (error && error.message.includes("not allowed for otp")) {
        console.log("Email check result: false for email:", email);
        return false;
      }
      
      // Default to assuming user exists if we get an unexpected response
      console.log("Email check result: false for email:", email);
      return false;
    } catch (error) {
      console.error("Error checking email:", error);
      return false;
    } finally {
      setIsCheckingEmail(false);
    }
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
    checkEmailExists
  };
}
