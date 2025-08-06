
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { useAccountState } from "./useAccountState";
import { useChildrenState } from "./useChildrenState";
import { useRegistrationValidation } from "./useRegistrationValidation";
import { useRegistrationFlow } from "./useRegistrationFlow";
import { RegistrationStep } from "./types";
import { calculateAge, validateChildData } from "@/utils/childUtils";

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
      username, 
      email, 
      password, 
      confirmPassword, 
      currentChild.name,
      currentChild.birthDate,
      checkEmailExists
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
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            username: username,
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
          emailRedirectTo: `${window.location.origin}/`
        }
      });
      
      if (authError) {
        console.error('Registration: Auth error:', authError);
        throw authError;
      }
      
      console.log('Registration: User created successfully:', authData.user?.id);
      
      // Sign in the user immediately after registration to establish auth context
      const { data: signInData, error: signInError } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (signInError) {
        console.error('Registration: Auto sign-in failed:', signInError);
        // Don't fail the registration, just inform the user
        toast.success("Prosimo, potrdite svoj račun – prejeli boste potrditveno e-pošto.");
        navigate("/login");
        return;
      }

      console.log('Registration: User signed in successfully after registration');
      
      // Now try to save children with proper auth context
      if (signInData.user && validChildren.length > 0) {
        // Give a small delay to ensure auth context is fully established
        await new Promise(resolve => setTimeout(resolve, 100));
        
        const childrenForDB = validChildren.map(child => {
          const age = calculateAge(child.birthDate);
          const childData = {
            parent_id: signInData.user.id,
            name: child.name.trim(),
            gender: child.gender,
            birth_date: child.birthDate ? `${child.birthDate.getFullYear()}-${String(child.birthDate.getMonth() + 1).padStart(2, '0')}-${String(child.birthDate.getDate()).padStart(2, '0')}` : null,
            age: age,
            avatar_url: `/lovable-uploads/${child.avatarId || 1}.png`,
            speech_difficulties: child.speechDifficulties || [],
            speech_difficulties_description: child.speechDifficultiesDescription || "",
            speech_development: child.speechDevelopment || {}
          };
          
          console.log('Registration: Prepared child data for DB:', childData);
          return childData;
        });

        console.log('Registration: Inserting children into database with auth context');

        const { data: insertedChildren, error: childrenError } = await supabase
          .from('children')
          .insert(childrenForDB)
          .select();

        if (childrenError) {
          console.error('Registration: Children insert error:', childrenError);
          console.error('Registration: Error details:', {
            message: childrenError.message,
            details: childrenError.details,
            hint: childrenError.hint
          });
          
          // Registration was successful, but children saving failed
          toast.success("Prosimo, potrdite svoj račun – prejeli boste potrditveno e-pošto.");
          navigate("/");
          return;
        } else {
          console.log('Registration: Children inserted successfully:', insertedChildren);
          console.log('Registration: Number of children inserted:', insertedChildren?.length);
          toast.success("Prosimo, potrdite svoj račun – prejeli boste potrditveno e-pošto.");
          navigate("/");
          return;
        }
      }
      
      // Fallback if no children to save
      toast.success("Prosimo, potrdite svoj račun – prejeli boste potrditveno e-pošto.");
      navigate("/");
      
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
