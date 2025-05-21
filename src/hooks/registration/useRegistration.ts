
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { useAccountState } from "./useAccountState";
import { useChildrenState } from "./useChildrenState";
import { useRegistrationValidation } from "./useRegistrationValidation";
import { useRegistrationFlow } from "./useRegistrationFlow";
import { RegistrationStep } from "./types";

export function useRegistration() {
  const navigate = useNavigate();
  const { 
    username, setUsername,
    email, setEmail,
    password, setPassword,
    confirmPassword, setConfirmPassword,
    selectedPlan, setSelectedPlan,
    isCheckingEmail, checkEmailExists
  } = useAccountState();
  
  const {
    children, setChildren,
    selectedChildIndex, setSelectedChildIndex,
    currentChild,
    addChild, removeChild, updateChildField,
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
        username, 
        email, 
        password, 
        confirmPassword, 
        currentChild.name,
        currentChild.birthDate,
        checkEmailExists
      );
      if (!isValid) return;
      setCurrentStep(RegistrationStep.SPEECH_DIFFICULTIES);
      setError(null);
    }
  };

  const handleSpeechDifficultiesSubmit = (difficulties: string[]) => {
    updateSpeechDifficulties(difficulties);
    setCurrentStep(RegistrationStep.SPEECH_DEVELOPMENT);
  };

  const handleSpeechDevelopmentSubmit = (answers: Record<string, string>) => {
    updateSpeechDevelopment(answers);
    // Skip the REVIEW_CHILD step and go directly to PAYMENT_CONFIRMATION
    setCurrentStep(RegistrationStep.PAYMENT_CONFIRMATION);
  };

  const handleSubmit = async () => {
    setError(null);
    
    const isValid = await validateAccountInfo(
      username, 
      email, 
      password, 
      confirmPassword, 
      currentChild.name,
      currentChild.birthDate,
      checkEmailExists
    );
    
    if (!isValid) {
      return;
    }
    
    // Filter for completed children
    const validChildren = children.filter(child => 
      child.name.trim() !== "" && child.isComplete && child.birthDate !== null
    );
    
    if (validChildren.length === 0) {
      setError("Dodajte vsaj enega otroka s podatki.");
      return;
    }
    
    try {
      setIsLoading(true);
      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            username: username,
            children: validChildren.map(child => ({
              name: child.name,
              gender: child.gender,
              birthDate: child.birthDate ? child.birthDate.toISOString() : null,
              avatarId: child.avatarId,
              speechDifficulties: child.speechDifficulties || [],
              speechDevelopment: child.speechDevelopment || {}
            }))
          }
        }
      });
      
      if (error) throw error;
      
      toast.success("Registracija uspešna! Preverite vašo e-pošto za potrditev računa.");
      navigate("/login");
    } catch (error: any) {
      console.error("Napaka pri registraciji:", error);
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
    username, setUsername,
    email, setEmail,
    password, setPassword,
    confirmPassword, setConfirmPassword,
    selectedPlan, setSelectedPlan,
    isCheckingEmail,
    
    // Children state
    children,
    selectedChildIndex, setSelectedChildIndex,
    currentChild,
    addChild, removeChild, updateChildField,
    
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
