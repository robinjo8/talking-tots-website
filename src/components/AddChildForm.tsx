
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { useSubscription } from "@/hooks/useSubscription";
import { toast } from "sonner";
import { SpeechDifficultiesStep, SpeechDevelopmentQuestions } from "@/components/speech";
import { ChildBasicInfoForm } from "./children/ChildBasicInfoForm";
import { avatarOptions } from "./AvatarSelector";
import { ChildCompletedView } from "./children/ChildCompletedView";
import { ChildProfile } from "@/hooks/registration/types";
import { calculateAge } from "@/utils/childUtils";
import { useChildDocuments } from "@/hooks/useChildDocuments";
import { SPEECH_DEVELOPMENT_QUESTIONS, SPEECH_DEVELOPMENT_TEXT_QUESTIONS } from "@/models/SpeechDevelopment";

// Format questionnaire answers as readable text for storage
const formatQuestionnaireAsText = (answers: Record<string, string>, childName: string): string => {
  const lines: string[] = [];
  lines.push(`OSNOVNI VPRAŠALNIK - ${childName}`);
  lines.push(`Datum: ${new Date().toLocaleDateString('sl-SI')}`);
  lines.push('');
  lines.push('='.repeat(50));
  lines.push('');
  
  // Radio questions
  SPEECH_DEVELOPMENT_QUESTIONS.forEach(q => {
    const answer = answers[q.id];
    const option = q.options.find(o => o.value === answer);
    lines.push(`${q.question}`);
    lines.push(`Odgovor: ${option?.label || 'Ni odgovora'}`);
    lines.push('');
  });
  
  // Text questions
  SPEECH_DEVELOPMENT_TEXT_QUESTIONS.forEach(q => {
    const answer = answers[q.id];
    lines.push(`${q.question}`);
    lines.push(`Odgovor: ${answer || 'Ni odgovora'}`);
    lines.push('');
  });
  
  return lines.join('\n');
};

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
  const { planId } = useSubscription();
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
  
  // Check if user has Pro plan - only Pro users need speech questionnaires
  const isPro = planId === 'pro';

  // Scroll to top when step changes
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [currentStep]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!name.trim()) {
      toast.error("Prosimo, vnesite ime otroka.");
      return;
    }
    
    // For Start/Plus plans, skip speech questionnaires and save directly
    if (!isPro) {
      await handleQuickSave();
      return;
    }
    
    // For Pro plan, continue to speech difficulties
    setCurrentStep(AddChildStep.SPEECH_DIFFICULTIES);
  };
  
  // Quick save for Start/Plus plans - only basic info
  const handleQuickSave = async () => {
    if (!user) {
      toast.error("Morate biti prijavljeni za dodajanje otroka.");
      return;
    }
    
    try {
      setIsSubmitting(true);
      
      const calculatedAge = calculateAge(birthDate);
      
      const { data: childData, error: childError } = await supabase
        .from('children')
        .insert({
          parent_id: user.id,
          name: name.trim(),
          gender,
          avatar_url: avatarOptions.find(a => a.id === avatarId)?.src || null,
          birth_date: birthDate ? birthDate.toISOString().split('T')[0] : null,
          age: calculatedAge,
          speech_difficulties: [],
          speech_difficulties_description: null,
          speech_development: {}
        })
        .select()
        .single();

      if (childError) throw childError;

      const newChild: SavedChild = {
        id: childData.id,
        name: name.trim(),
        gender: gender as "M" | "F" | "N",
        avatarId,
        birthDate,
        age: calculatedAge,
        speechDifficulties: [],
        speechDevelopment: {}
      };
      
      setSavedChildren(prev => [...prev, newChild]);
      toast.success("Otrok uspešno dodan!");
      setCurrentStep(AddChildStep.COMPLETED);
      
    } catch (error: any) {
      console.error("Napaka pri dodajanju otroka:", error);
      toast.error("Napaka pri dodajanju otroka. Poskusite znova.");
    } finally {
      setIsSubmitting(false);
    }
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
      
      // Upload documents in background - fire and forget, don't block UI
      const uploadDocumentsInBackground = async () => {
        try {
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
          
          // Upload questionnaire as text file
          if (Object.keys(developmentAnswers).length > 0) {
            const questionnaireText = formatQuestionnaireAsText(developmentAnswers, name.trim());
            const questionnaireBlob = new Blob([questionnaireText], { type: 'text/plain' });
            const questionnaireFile = new File(
              [questionnaireBlob], 
              `${newChildId}-osnovni-vprasalnik.txt`, 
              { type: 'text/plain' }
            );
            await uploadDocument(questionnaireFile, newChildId, 'questionnaire');
          }
          console.log("Background document upload completed successfully");
        } catch (uploadError) {
          console.error("Background document upload error (non-critical):", uploadError);
          // Silent fail - documents can be uploaded later from child profile
        }
      };
      
      // Fire and forget - don't await, let it run in background
      uploadDocumentsInBackground();
      
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
        onClose={onSuccess}
        isPro={isPro}
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
