
import { useState } from "react";
import { RegistrationStep } from "./types";

export function useRegistrationFlow() {
  const [currentStep, setCurrentStep] = useState<RegistrationStep>(RegistrationStep.ACCOUNT_INFO);
  const [isLoading, setIsLoading] = useState(false);
  
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
  
  const getTotalSteps = () => {
    return 5; // Account info, speech difficulties, speech development, child review, payment confirmation
  };
  
  const getCurrentStep = () => {
    return currentStep + 1;
  };

  return {
    currentStep,
    setCurrentStep,
    isLoading,
    setIsLoading,
    goBack,
    getTotalSteps,
    getCurrentStep
  };
}
