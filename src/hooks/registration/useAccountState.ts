
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
      // Use a more reliable method to check if the email exists
      const { data, error } = await supabase.auth.signInWithOtp({
        email,
        options: {
          shouldCreateUser: false, // Only check if user exists, don't create or send OTP
        }
      });
      
      // If there's no error about user not existing, it means the user exists
      const userExists = !error || !error.message.includes("not found");
      
      console.log("Email check result:", userExists, "for email:", email);
      return userExists;
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
