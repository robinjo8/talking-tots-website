
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";

export function useAccountState() {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [selectedPlan, setSelectedPlan] = useState("yearly");
  const [isCheckingEmail, setIsCheckingEmail] = useState(false);

  const checkEmailExists = async (email: string): Promise<boolean> => {
    if (!email) return false;
    
    setIsCheckingEmail(true);
    try {
      // Try sign-in without creating a user - this is the most reliable approach
      const { error } = await supabase.auth.signInWithOtp({
        email,
        options: {
          shouldCreateUser: false,
        }
      });
      
      // If error includes "Email not confirmed" or "Invalid login credentials",
      // this means the email exists but has other issues
      if (error && (
        error.message.includes("Email not confirmed") || 
        error.message.includes("Invalid login credentials")
      )) {
        console.log("Email exists (OTP method):", email);
        return true;
      }
      
      // If we get an error about otp being disabled, the email exists
      if (error && error.message.includes("otp_disabled")) {
        console.log("Email exists (OTP disabled):", email);
        return true;
      }
      
      // If we get a "User not found" error, the email doesn't exist
      if (error && error.message.includes("user not found")) {
        console.log("Email not found:", email);
        return false;
      }
      
      // If we get a "Signups not allowed" error, it means the email doesn't exist
      // (as Supabase is trying to create a user and failing)
      if (error && error.message.includes("not allowed for otp")) {
        console.log("Email doesn't exist (signups not allowed):", email);
        return false;
      }
      
      // We can also try to use the signIn method with a dummy password
      // This can also help determine if an email exists
      const { error: signInError } = await supabase.auth.signInWithPassword({
        email,
        password: "dummy_password_for_checking"
      });
      
      // If we get an "Invalid login credentials" error, it means the email exists
      // but the password is wrong (which is expected)
      if (signInError && signInError.message.includes("Invalid login credentials")) {
        console.log("Email exists (password method):", email);
        return true;
      }
      
      // Default to false if we're unsure
      console.log("Email check inconclusive, assuming doesn't exist:", email);
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
