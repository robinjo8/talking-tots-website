
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";

// Define a type for the user object returned from Supabase
interface SupabaseUser {
  id: string;
  email?: string;
  [key: string]: any; // Allow for other properties
}

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
      // Try a sign-in attempt with a dummy password
      // If we get "Invalid login credentials", the email exists
      // If we get another error or no error, the email doesn't exist
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password: "dummy_password_for_check_only"
      });
      
      // Check for the specific error that indicates the email exists
      const emailExists = error?.message?.includes("Invalid login credentials") || false;
      
      console.log("Email check result:", emailExists, "for email:", email);
      return emailExists;
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
