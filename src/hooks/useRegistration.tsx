
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";

export interface ChildProfile {
  id: string;
  name: string;
  gender: string;
  birthDate: Date | null;
  avatarId: number;
  speechDifficulties?: string[];
  speechDevelopment?: Record<string, string>;
  isComplete?: boolean;
}

export enum RegistrationStep {
  ACCOUNT_INFO,
  SPEECH_DIFFICULTIES,
  SPEECH_DEVELOPMENT,
  REVIEW_CHILD,
  PAYMENT_CONFIRMATION
}

export function useRegistration() {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isCheckingEmail, setIsCheckingEmail] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedPlan, setSelectedPlan] = useState("Mesečna naročnina - 9,99 € / mesec");
  const navigate = useNavigate();
  
  const [children, setChildren] = useState<ChildProfile[]>([
    { id: crypto.randomUUID(), name: "", gender: "M", birthDate: null, avatarId: 1 }
  ]);

  const [currentStep, setCurrentStep] = useState<RegistrationStep>(RegistrationStep.ACCOUNT_INFO);
  const [selectedChildIndex, setSelectedChildIndex] = useState(0);

  const currentChild = children[selectedChildIndex];

  const checkEmailExists = async (email: string): Promise<boolean> => {
    if (!email) return false;
    
    setIsCheckingEmail(true);
    try {
      const { data, error } = await supabase.auth.signInWithOtp({
        email,
        options: {
          shouldCreateUser: false
        }
      });
      
      // If no error is returned when attempting to sign in, the email exists
      // The API doesn't give us a clean way to check just for existence
      // If error.message includes "User already registered", then the email exists
      return !error?.message.includes("not found");
    } catch (error) {
      console.error("Error checking email:", error);
      return false;
    } finally {
      setIsCheckingEmail(false);
    }
  };

  const validateAccountInfo = async (): Promise<boolean> => {
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
    if (!currentChild.name.trim()) {
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

  const goToNextStep = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (currentStep === RegistrationStep.ACCOUNT_INFO) {
      const isValid = await validateAccountInfo();
      if (!isValid) return;
      setCurrentStep(RegistrationStep.SPEECH_DIFFICULTIES);
      setError(null);
    }
  };

  const goBack = () => {
    if (currentStep === RegistrationStep.SPEECH_DIFFICULTIES) {
      setCurrentStep(RegistrationStep.ACCOUNT_INFO);
    } else if (currentStep === RegistrationStep.SPEECH_DEVELOPMENT) {
      setCurrentStep(RegistrationStep.SPEECH_DIFFICULTIES);
    } else if (currentStep === RegistrationStep.REVIEW_CHILD) {
      setCurrentStep(RegistrationStep.SPEECH_DEVELOPMENT);
    } else if (currentStep === RegistrationStep.PAYMENT_CONFIRMATION) {
      setCurrentStep(RegistrationStep.REVIEW_CHILD);
    }
  };

  const handleSpeechDifficultiesSubmit = (difficulties: string[]) => {
    setChildren(prev => 
      prev.map((child, index) => 
        index === selectedChildIndex 
          ? { ...child, speechDifficulties: difficulties } 
          : child
      )
    );
    setCurrentStep(RegistrationStep.SPEECH_DEVELOPMENT);
  };

  const handleSpeechDevelopmentSubmit = (answers: Record<string, string>) => {
    setChildren(prev => 
      prev.map((child, index) => 
        index === selectedChildIndex 
          ? { ...child, speechDevelopment: answers, isComplete: true } 
          : child
      )
    );
    setCurrentStep(RegistrationStep.REVIEW_CHILD);
  };

  const handleChildReviewComplete = () => {
    setCurrentStep(RegistrationStep.PAYMENT_CONFIRMATION);
  };

  const addChild = () => {
    setChildren([
      ...children,
      { id: crypto.randomUUID(), name: "", gender: "M", birthDate: null, avatarId: 1 }
    ]);
    setSelectedChildIndex(children.length);
    setCurrentStep(RegistrationStep.ACCOUNT_INFO);
  };

  const removeChild = (id: string) => {
    if (children.filter(c => c.isComplete).length > 1 || !children.some(c => c.isComplete)) {
      setChildren(children.filter(child => child.id !== id));
      
      // If we're removing the currently selected child, adjust the index
      if (children[selectedChildIndex].id === id) {
        setSelectedChildIndex(Math.max(0, selectedChildIndex - 1));
      }
    } else {
      toast.error("Potreben je vsaj en otrok.");
    }
  };

  const updateChildField = (id: string, field: keyof ChildProfile, value: any) => {
    setChildren(children.map(child => 
      child.id === id ? { ...child, [field]: value } : child
    ));
  };

  const handleSubmit = async () => {
    setError(null);
    
    if (!validateAccountInfo) {
      return;
    }
    
    // Filter for completed children
    const validChildren = children.filter(child => 
      child.name.trim() !== "" && child.isComplete
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
  
  const getTotalSteps = () => {
    return 5; // Account info, speech difficulties, speech development, child review, payment confirmation
  };
  
  const getCurrentStep = () => {
    return currentStep + 1;
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
    isLoading,
    isCheckingEmail,
    error,
    setError,
    selectedPlan,
    setSelectedPlan,
    children,
    currentStep,
    selectedChildIndex,
    setSelectedChildIndex,
    goToNextStep,
    goBack,
    handleSpeechDifficultiesSubmit,
    handleSpeechDevelopmentSubmit,
    handleChildReviewComplete,
    addChild,
    removeChild,
    updateChildField,
    handleSubmit,
    currentChild,
    getTotalSteps,
    getCurrentStep
  };
}
