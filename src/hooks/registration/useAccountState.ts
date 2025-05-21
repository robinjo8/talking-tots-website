
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
      // Try to sign up with the email and a temporary password
      // If we get "User already registered", the email exists
      const { error } = await supabase.auth.signUp({
        email,
        password: "TempPassword123!", // Temporary password for checking only
        options: {
          emailRedirectTo: window.location.origin + "/register",
        }
      });
      
      // Log the full error for debugging
      console.log("Email check full error:", error);
      
      // If error contains "User already registered" or "Email already in use",
      // then the email exists in the system
      const emailExists = error?.message?.includes("already registered") || 
                         error?.message?.includes("already in use") || 
                         false;
      
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
