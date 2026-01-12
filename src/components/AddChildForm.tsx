
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";
import { SpeechDifficultiesStep, SpeechDevelopmentQuestions } from "@/components/speech";
import { ChildBasicInfoForm } from "./children/ChildBasicInfoForm";
import { avatarOptions } from "./AvatarSelector";
import { ChildCompletedView } from "./children/ChildCompletedView";
import { ChildProfile } from "@/hooks/registration/types";
import { calculateAge } from "@/utils/childUtils";
import { useChildDocuments } from "@/hooks/useChildDocuments";

enum AddChildStep {
  BASIC_INFO,
  SPEECH_DIFFICULTIES,
  SPEECH_DEVELOPMENT,
  COMPLETED
}

interface SavedChild {
  id: string;
  name: string;
  gender: "M" | "F" | "N";
  avatarId: number;
  birthDate: Date | null;
  age: number;
  speechDifficulties: string[];
  speechDevelopment: Record<string, string>;
}

export function AddChildForm({ onSuccess, onBack: onBackProp, initialName, initialBirthDate, initialGender }: { onSuccess?: () => void; onBack?: () => void; initialName?: string; initialBirthDate?: Date | null; initialGender?: string }) {
  const { user } = useAuth();
  const [name, setName] = useState(initialName || "");
  const [gender, setGender] = useState(initialGender || "M");
  const [avatarId, setAvatarId] = useState(1);
  const [birthDate, setBirthDate] = useState<Date | null>(initialBirthDate || null);
  const [speechDifficulties, setSpeechDifficulties] = useState<string[]>([]);
  const [speechDescription, setSpeechDescription] = useState<string>("");
  const [attachedFile, setAttachedFile] = useState<File | null>(null);
  const [speechDevelopment, setSpeechDevelopment] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [currentStep, setCurrentStep] = useState<AddChildStep>(AddChildStep.BASIC_INFO);
  const [savedChildren, setSavedChildren] = useState<SavedChild[]>([]);
  
  const { uploadDocument } = useChildDocuments();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!name.trim()) {
      toast.error("Prosimo, vnesite ime otroka.");
      return;
    }
    
    setCurrentStep(AddChildStep.SPEECH_DIFFICULTIES);
  };

  const handleSpeechDifficultiesSubmit = async (difficulties: string[], description?: string, file?: File | null) => {
    setSpeechDifficulties(difficulties);
    setSpeechDescription(description || "");
    setAttachedFile(file || null);
    setCurrentStep(AddChildStep.SPEECH_DEVELOPMENT);
  };

  const handleSpeechDevelopmentSubmit = async (developmentAnswers: Record<string, string>) => {
    if (!user) {
      toast.error("Morate biti prijavljeni za dodajanje otroka.");
      return;
    }
    
    try {
      setIsSubmitting(true);
      
      const calculatedAge = calculateAge(birthDate);
      
      // First, insert child into database to get a proper ID
      const { data: childData, error: childError } = await supabase
        .from('children')
        .insert({
          parent_id: user.id,
          name: name.trim(),
          gender,
          avatar_url: avatarOptions.find(a => a.id === avatarId)?.src || null,
          birth_date: birthDate ? birthDate.toISOString().split('T')[0] : null,
          age: calculatedAge,
          speech_difficulties: speechDifficulties,
          speech_difficulties_description: speechDescription || null,
          speech_development: developmentAnswers
        })
        .select()
        .single();

      if (childError) {
        console.error("Error inserting child:", childError);
        throw childError;
      }

      const newChildId = childData.id;
      
      // Upload PDF attachment if provided
      if (attachedFile) {
        await uploadDocument(attachedFile, newChildId, 'pdf_attachment');
      }
      
      // Upload speech description as text file if provided
      if (speechDescription && speechDescription.trim()) {
        const textBlob = new Blob([speechDescription], { type: 'text/plain' });
        const textFile = new File([textBlob], `opis-govornih-tezav-${Date.now()}.txt`, { type: 'text/plain' });
        await uploadDocument(textFile, newChildId, 'speech_description');
      }
      
      const newChild: SavedChild = {
        id: newChildId,
        name: name.trim(),
        gender: gender as "M" | "F" | "N",
        avatarId,
        birthDate,
        age: calculatedAge,
        speechDifficulties,
        speechDevelopment: developmentAnswers
      };
      
      setSavedChildren(prev => [...prev, newChild]);
      
      // Also update user metadata for backwards compatibility
      const { data: userData, error: userError } = await supabase.auth.getUser();
      
      if (!userError && userData.user) {
        const currentMetadata = userData.user.user_metadata || {};
        const currentChildren = currentMetadata.children || [];
        
        const updatedChildren = [...currentChildren, {
          id: newChildId,
          name: name.trim(),
          gender,
          avatarId,
          birthDate: birthDate ? birthDate.toISOString() : null,
          age: calculatedAge,
          speechDifficulties,
          speechDifficultiesDescription: speechDescription,
          speechDevelopment: developmentAnswers
        }];
        
        await supabase.auth.updateUser({
          data: { children: updatedChildren }
        });
      }
      
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

  const handleBackToSimpleForm = () => {
    // Go back to SimpleChildForm
    if (onBackProp) {
      onBackProp();
    }
  };

  return (
    <ChildBasicInfoForm
      avatarId={avatarId}
      onAvatarChange={setAvatarId}
      onSubmit={handleSubmit}
      onBack={handleBackToSimpleForm}
    />
  );
}
