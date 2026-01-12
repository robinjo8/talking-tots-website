
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";
import { SpeechDifficultiesStep, SpeechDevelopmentQuestions } from "@/components/speech";
import { ChildBasicInfoForm } from "./children/ChildBasicInfoForm";
import { ChildCompletedView } from "./children/ChildCompletedView";
import { ChildProfile } from "@/hooks/registration/types";

enum AddChildStep {
  BASIC_INFO,
  SPEECH_DIFFICULTIES,
  SPEECH_DEVELOPMENT,
  COMPLETED
}

interface SavedChild {
  id: string;
  name: string;
  gender: "M" | "F" | "N"; // Update to match supported gender values
  avatarId: number;
  birthDate: Date | null;
  speechDifficulties: string[];
  speechDevelopment: Record<string, string>;
}

export function AddChildForm({ onSuccess, initialName, initialBirthDate }: { onSuccess?: () => void; initialName?: string; initialBirthDate?: Date | null }) {
  const { user } = useAuth();
  const [name, setName] = useState(initialName || "");
  const [gender, setGender] = useState("M");
  const [avatarId, setAvatarId] = useState(1);
  const [birthDate, setBirthDate] = useState<Date | null>(initialBirthDate || null);
  const [speechDifficulties, setSpeechDifficulties] = useState<string[]>([]);
  const [speechDevelopment, setSpeechDevelopment] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [currentStep, setCurrentStep] = useState<AddChildStep>(AddChildStep.BASIC_INFO);
  const [savedChildren, setSavedChildren] = useState<SavedChild[]>([]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!name.trim()) {
      toast.error("Prosimo, vnesite ime otroka.");
      return;
    }
    
    setCurrentStep(AddChildStep.SPEECH_DIFFICULTIES);
  };

  const handleSpeechDifficultiesSubmit = async (difficulties: string[]) => {
    setSpeechDifficulties(difficulties);
    setCurrentStep(AddChildStep.SPEECH_DEVELOPMENT);
  };

  const handleSpeechDevelopmentSubmit = async (developmentAnswers: Record<string, string>) => {
    if (!user) {
      toast.error("Morate biti prijavljeni za dodajanje otroka.");
      return;
    }
    
    try {
      setIsSubmitting(true);
      
      // Save the child's information temporarily with an id
      const newChildId = crypto.randomUUID();
      const newChild: SavedChild = {
        id: newChildId,
        name: name.trim(),
        gender: gender as "M" | "F" | "N", // Cast to appropriate type
        avatarId,
        birthDate,
        speechDifficulties,
        speechDevelopment: developmentAnswers
      };
      
      setSavedChildren(prev => [...prev, newChild]);
      
      // Get current user metadata
      const { data: userData, error: userError } = await supabase.auth.getUser();
      
      if (userError) throw userError;
      
      const currentUser = userData.user;
      const currentMetadata = currentUser.user_metadata || {};
      const currentChildren = currentMetadata.children || [];
      
      // Add new child
      const updatedChildren = [...currentChildren, {
        id: newChildId,
        name: name.trim(),
        gender,
        avatarId,
        birthDate: birthDate ? birthDate.toISOString() : null,
        speechDifficulties,
        speechDevelopment: developmentAnswers
      }];
      
      // Update user metadata
      const { error: updateError } = await supabase.auth.updateUser({
        data: { children: updatedChildren }
      });
      
      if (updateError) throw updateError;
      
      toast.success("Otrok uspešno dodan!");
      
      // Reset form and move to completed step
      setCurrentStep(AddChildStep.COMPLETED);
      
    } catch (error: any) {
      console.error("Napaka pri dodajanju otroka:", error);
      toast.error("Napaka pri dodajanju otroka. Poskusite znova.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const goBackToBasicInfo = () => {
    setCurrentStep(AddChildStep.BASIC_INFO);
  };

  const goBackToSpeechDifficulties = () => {
    setCurrentStep(AddChildStep.SPEECH_DIFFICULTIES);
  };

  const startNewChild = () => {
    setName("");
    setGender("M");
    setAvatarId(1);
    setBirthDate(null);
    setSpeechDifficulties([]);
    setSpeechDevelopment({});
    setCurrentStep(AddChildStep.BASIC_INFO);
  };

  if (currentStep === AddChildStep.COMPLETED) {
    const lastChild = savedChildren[savedChildren.length - 1];
    
    return (
      <ChildCompletedView 
        child={lastChild}
        onAddNewChild={startNewChild}
        onClose={onSuccess}
      />
    );
  }

  if (currentStep === AddChildStep.SPEECH_DEVELOPMENT) {
    return (
      <SpeechDevelopmentQuestions
        onBack={goBackToSpeechDifficulties}
        onSubmit={handleSpeechDevelopmentSubmit}
        childName={name}
        initialAnswers={speechDevelopment}
      />
    );
  }

  if (currentStep === AddChildStep.SPEECH_DIFFICULTIES) {
    return (
      <SpeechDifficultiesStep
        onBack={goBackToBasicInfo}
        onSubmit={handleSpeechDifficultiesSubmit}
        childName={name}
        initialDifficulties={speechDifficulties}
        submitButtonText="Naprej"
      />
    );
  }

  return (
    <ChildBasicInfoForm
      name={name}
      gender={gender}
      avatarId={avatarId}
      onNameChange={setName}
      onGenderChange={setGender}
      onAvatarChange={setAvatarId}
      onSubmit={handleSubmit}
    />
  );
}
