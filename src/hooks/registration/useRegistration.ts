
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { useSecureAccountState } from "./useSecureAccountState";
import { useChildrenState } from "./useChildrenState";
import { useRegistrationValidation } from "./useRegistrationValidation";
import { useRegistrationFlow } from "./useRegistrationFlow";
import { RegistrationStep } from "./types";
import { calculateAge, validateChildData } from "@/utils/childUtils";

export function useRegistration() {
  const navigate = useNavigate();
  
  const { 
    firstName, setFirstName,
    lastName, setLastName,
    email, setEmail,
    password, setPassword,
    confirmPassword, setConfirmPassword,
    selectedPlan, setSelectedPlan,
    validateEmailSafely
  } = useSecureAccountState();
  
  const {
    children, setChildren,
    selectedChildIndex, setSelectedChildIndex,
    currentChild,
    updateChildField,
    handleSpeechDifficultiesSubmit: updateSpeechDifficulties,
    handleSpeechDevelopmentSubmit: updateSpeechDevelopment
  } = useChildrenState();
  
  const {
    error, setError, validateAccountInfo
  } = useRegistrationValidation();
  
  const {
    currentStep, setCurrentStep,
    isLoading, setIsLoading,
    goBack, getTotalSteps, getCurrentStep
  } = useRegistrationFlow();

  const goToNextStep = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (currentStep === RegistrationStep.ACCOUNT_INFO) {
      const isValid = await validateAccountInfo(
        firstName,
        lastName,
        email,
        password,
        confirmPassword,
        currentChild.name,
        currentChild.birthDate,
        validateEmailSafely
      );
      if (!isValid) return;
      setCurrentStep(RegistrationStep.SPEECH_DIFFICULTIES);
      setError(null);
    }
  };

  const handleSpeechDifficultiesSubmit = (difficulties: string[], detailedDescription?: string) => {
    updateSpeechDifficulties(difficulties, detailedDescription);
    setCurrentStep(RegistrationStep.SPEECH_DEVELOPMENT);
  };

  const handleSpeechDevelopmentSubmit = (answers: Record<string, string>) => {
    updateSpeechDevelopment(answers);
    // Skip the REVIEW_CHILD step and go directly to PAYMENT_CONFIRMATION
    setCurrentStep(RegistrationStep.PAYMENT_CONFIRMATION);
  };

  const handleSubmit = async () => {
    console.log('Registration: Starting submission process');
    setError(null);
    
    const isValid = await validateAccountInfo(
      firstName,
      lastName,
      email,
      password,
      confirmPassword,
      currentChild.name,
      currentChild.birthDate,
      validateEmailSafely
    );
    
    if (!isValid) {
      console.log('Registration: Account validation failed');
      return;
    }
    
    // Filter for valid children using the new validation function
    const validChildren = children.filter(child => {
      const validation = validateChildData(child);
      if (!validation.isValid) {
        console.warn('Registration: Invalid child data:', validation.error, child);
        return false;
      }
      return true;
    });
    
    console.log('Registration: Valid children count:', validChildren.length);
    console.log('Registration: Valid children data:', validChildren);
    
    if (validChildren.length === 0) {
      setError("Dodajte vsaj enega otroka s podatki.");
      return;
    }
    
    try {
      setIsLoading(true);
      
      // First, register the user with children in metadata for backup
      const { error: authError } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            first_name: firstName,
            last_name: lastName,
            children: validChildren.map(child => ({
              name: child.name,
              gender: child.gender,
              birthDate: child.birthDate?.toISOString(),
              avatarId: child.avatarId,
              speechDifficulties: child.speechDifficulties || [],
              speechDifficultiesDescription: child.speechDifficultiesDescription || "",
              speechDevelopment: child.speechDevelopment || {},
              age: calculateAge(child.birthDate)
            }))
          },
          emailRedirectTo: `${window.location.origin}/auth/confirm`
        }
      });
      
      if (authError) {
        console.error('Registration: Auth error:', authError);
        throw authError;
      }
      
      console.log('Registration: User registered, awaiting email confirmation');
      
      // Do NOT sign in immediately - user must confirm email first
      // Children data is saved in user metadata and will be synced on first login after confirmation
      toast.success("Prosimo, potrdite svoj račun – prejeli boste potrditveno e-pošto.");
      navigate("/login");
      
    } catch (error: any) {
      console.error("Registration: Unexpected error:", error);
      if (error.message.includes("email")) {
        setError("E-poštni naslov je že v uporabi ali ni veljaven.");
      } else {
        setError("Prišlo je do napake pri registraciji. Poskusite znova.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  return {
    // Account state
    firstName, setFirstName,
    lastName, setLastName,
    email, setEmail,
    password, setPassword,
    confirmPassword, setConfirmPassword,
    selectedPlan, setSelectedPlan,
    
    // Children state
    children,
    selectedChildIndex, setSelectedChildIndex,
    currentChild,
    updateChildField,
    
    // Validation
    error, setError,
    
    // Flow
    currentStep,
    isLoading,
    goToNextStep,
    goBack,
    getTotalSteps,
    getCurrentStep,
    
    // Handlers
    handleSpeechDifficultiesSubmit,
    handleSpeechDevelopmentSubmit,
    handleSubmit
  };
}
