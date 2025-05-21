
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";

export function useAccountState() {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [selectedPlan, setSelectedPlan] = useState("Mesečna naročnina - 9,99 € / mesec");
  const [isCheckingEmail, setIsCheckingEmail] = useState(false);

  const checkEmailExists = async (email: string): Promise<boolean> => {
    if (!email) return false;
    
    setIsCheckingEmail(true);
    try {
      // Using a more reliable method to check if an email exists
      const { data, error } = await supabase.auth.admin.listUsers();
      
      // If we can't access admin functions, fall back to a sign-in attempt
      // which will tell us if the user exists
      if (error) {
        console.log("Falling back to signIn method for email check");
        const { error: signInError } = await supabase.auth.signInWithPassword({
          email,
          password: "dummy_password_for_check_only"
        });
        
        // If error message contains "Invalid login credentials" then the email exists
        // but password is wrong, which means the email is registered
        return signInError?.message?.includes("Invalid login credentials") || false;
      }
      
      // If we can access admin functions, check if the email exists in the list
      if (data?.users) {
        return data.users.some(user => {
          // Safely check if user has an email property before comparing
          return user && typeof user === 'object' && 'email' in user && user.email === email;
        });
      }
      
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
