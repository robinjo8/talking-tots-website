
import { useState } from "react";
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
  SUBSCRIPTION_ACCOUNT_INFO = 0,
  CHILD_INFO = 1,
  SPEECH_DIFFICULTIES = 2,
  SPEECH_DEVELOPMENT = 3,
  REVIEW_CHILD = 4
}

export function useRegistration() {
  // Account information
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  
  // Subscription option
  const [subscriptionType, setSubscriptionType] = useState("monthly");
  
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();
  
  const [children, setChildren] = useState<ChildProfile[]>([
    { id: crypto.randomUUID(), name: "", gender: "M", birthDate: null, avatarId: 1 }
  ]);

  const [currentStep, setCurrentStep] = useState<RegistrationStep>(RegistrationStep.SUBSCRIPTION_ACCOUNT_INFO);
  const [selectedChildIndex, setSelectedChildIndex] = useState(0);

  const currentChild = children[selectedChildIndex];

  const validateAccountInfo = (): boolean => {
    if (!fullName || !email || !password || !confirmPassword) {
      setError("Prosimo, izpolnite vsa obvezna polja.");
      return false;
    }
    
    if (fullName.length < 3) {
      setError("Ime in priimek morata vsebovati vsaj 3 znake.");
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
    
    return true;
  };

  const validateChildInfo = (): boolean => {
    // Check if current child has name
    if (!currentChild.name.trim()) {
      setError("Prosimo, vnesite ime otroka.");
      return false;
    }

    if (!currentChild.birthDate) {
      setError("Prosimo, izberite datum rojstva otroka.");
      return false;
    }

    return true;
  };

  const goToNextStep = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (currentStep === RegistrationStep.SUBSCRIPTION_ACCOUNT_INFO) {
      if (!validateAccountInfo()) return;
      setCurrentStep(RegistrationStep.CHILD_INFO);
      setError(null);
    } else if (currentStep === RegistrationStep.CHILD_INFO) {
      if (!validateChildInfo()) return;
      setCurrentStep(RegistrationStep.SPEECH_DIFFICULTIES);
      setError(null);
    }
  };

  const goBack = () => {
    if (currentStep === RegistrationStep.CHILD_INFO) {
      setCurrentStep(RegistrationStep.SUBSCRIPTION_ACCOUNT_INFO);
    } else if (currentStep === RegistrationStep.SPEECH_DIFFICULTIES) {
      setCurrentStep(RegistrationStep.CHILD_INFO);
    } else if (currentStep === RegistrationStep.SPEECH_DEVELOPMENT) {
      setCurrentStep(RegistrationStep.SPEECH_DIFFICULTIES);
    } else if (currentStep === RegistrationStep.REVIEW_CHILD) {
      setCurrentStep(RegistrationStep.SPEECH_DEVELOPMENT);
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

  const addChild = () => {
    setChildren([
      ...children,
      { id: crypto.randomUUID(), name: "", gender: "M", birthDate: null, avatarId: 1 }
    ]);
    setSelectedChildIndex(children.length);
    setCurrentStep(RegistrationStep.CHILD_INFO);
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
    
    if (!validateAccountInfo()) {
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
            fullName: fullName,
            subscriptionType: subscriptionType,
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
    fullName,
    setFullName,
    email,
    setEmail,
    password,
    setPassword,
    confirmPassword,
    setConfirmPassword,
    subscriptionType,
    setSubscriptionType,
    isLoading,
    error,
    setError,
    children,
    currentStep,
    selectedChildIndex,
    setSelectedChildIndex,
    goToNextStep,
    goBack,
    handleSpeechDifficultiesSubmit,
    handleSpeechDevelopmentSubmit,
    addChild,
    removeChild,
    updateChildField,
    handleSubmit,
    currentChild,
    totalSteps: Object.keys(RegistrationStep).length / 2
  };
}
