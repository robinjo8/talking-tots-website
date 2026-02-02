import React, { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Progress } from '@/components/ui/progress';
import { useLogopedistChildren, CreateChildInput } from '@/hooks/useLogopedistChildren';
import { useAdminAuth } from '@/contexts/AdminAuthContext';
import { avatarOptions } from '@/components/AvatarSelector';
import { SpeechDifficultiesStep, SpeechDevelopmentQuestions } from '@/components/speech';
import { AdminChildBasicInfoStep } from './steps/AdminChildBasicInfoStep';
import { AdminChildAvatarStep } from './steps/AdminChildAvatarStep';
import { AdminChildCompletedView } from './AdminChildCompletedView';
import { uploadLogopedistChildDocuments } from '@/utils/logopedistChildDocuments';
import { toast } from 'sonner';

enum WizardStep {
  BASIC_INFO = 0,
  AVATAR = 1,
  SPEECH_DIFFICULTIES = 2,
  SPEECH_DEVELOPMENT = 3,
  COMPLETED = 4,
}

interface ChildData {
  name: string;
  birthDate: Date | null;
  gender: 'male' | 'female' | null;
  notes: string;
  externalId: string;
  avatarId: number;
  speechDifficulties: string[];
  speechDifficultiesDescription: string;
  speechDevelopment: Record<string, string>;
}

const initialChildData: ChildData = {
  name: '',
  birthDate: null,
  gender: 'male',
  notes: '',
  externalId: '',
  avatarId: 1,
  speechDifficulties: [],
  speechDifficultiesDescription: '',
  speechDevelopment: {},
};

interface AdminAddChildWizardProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function AdminAddChildWizard({ open, onOpenChange }: AdminAddChildWizardProps) {
  const { createChild } = useLogopedistChildren();
  const { profile } = useAdminAuth();
  const [currentStep, setCurrentStep] = useState<WizardStep>(WizardStep.BASIC_INFO);
  const [childData, setChildData] = useState<ChildData>(initialChildData);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const logopedistId = profile?.id;

  const calculateAge = (date: Date): number => {
    const today = new Date();
    let age = today.getFullYear() - date.getFullYear();
    const monthDiff = today.getMonth() - date.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < date.getDate())) {
      age--;
    }
    return Math.max(1, age); // At least 1 year old
  };

  const resetWizard = () => {
    setCurrentStep(WizardStep.BASIC_INFO);
    setChildData(initialChildData);
  };

  const handleClose = () => {
    resetWizard();
    onOpenChange(false);
  };

  const handleSaveChild = async () => {
    if (!childData.birthDate || !logopedistId) return;

    setIsSubmitting(true);

    try {
      const avatar = avatarOptions.find(a => a.id === childData.avatarId);
      
      const input: CreateChildInput = {
        name: childData.name.trim(),
        age: calculateAge(childData.birthDate),
        gender: childData.gender || undefined,
        birth_date: childData.birthDate.toISOString().split('T')[0],
        avatar_url: avatar?.src || undefined,
        speech_difficulties: childData.speechDifficulties.length > 0 ? childData.speechDifficulties : undefined,
        speech_difficulties_description: childData.speechDifficultiesDescription || undefined,
        speech_development: Object.keys(childData.speechDevelopment).length > 0 ? childData.speechDevelopment : undefined,
        notes: childData.notes.trim() || undefined,
        external_id: childData.externalId.trim() || undefined,
      };

      const newChild = await createChild.mutateAsync(input);
      
      // Upload documents to storage after child is created
      if (newChild?.id) {
        const { errors } = await uploadLogopedistChildDocuments(
          logopedistId,
          newChild.id,
          childData.name.trim(),
          childData.speechDifficultiesDescription,
          Object.keys(childData.speechDevelopment).length > 0 ? childData.speechDevelopment : undefined
        );
        
        if (errors.length > 0) {
          toast.warning('Otrok ustvarjen, vendar dokumenti niso bili naloženi');
        }
      }
      
      setCurrentStep(WizardStep.COMPLETED);
    } catch (error) {
      // Error is already handled in the hook
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleAddAnother = () => {
    resetWizard();
  };

  const getStepTitle = () => {
    switch (currentStep) {
      case WizardStep.BASIC_INFO:
        return 'Korak 1/4: Osnovni podatki';
      case WizardStep.AVATAR:
        return 'Korak 2/4: Izbira avatarja';
      case WizardStep.SPEECH_DIFFICULTIES:
        return 'Korak 3/4: Govorne težave';
      case WizardStep.SPEECH_DEVELOPMENT:
        return 'Korak 4/4: Osnovni vprašalnik';
      case WizardStep.COMPLETED:
        return 'Zaključeno';
      default:
        return '';
    }
  };

  const progressPercentage = currentStep === WizardStep.COMPLETED 
    ? 100 
    : ((currentStep + 1) / 4) * 100;

  const renderStep = () => {
    switch (currentStep) {
      case WizardStep.BASIC_INFO:
        return (
          <AdminChildBasicInfoStep
            name={childData.name}
            birthDate={childData.birthDate}
            gender={childData.gender}
            notes={childData.notes}
            externalId={childData.externalId}
            onNameChange={(name) => setChildData(prev => ({ ...prev, name }))}
            onBirthDateChange={(birthDate) => setChildData(prev => ({ ...prev, birthDate }))}
            onGenderChange={(gender) => setChildData(prev => ({ ...prev, gender }))}
            onNotesChange={(notes) => setChildData(prev => ({ ...prev, notes }))}
            onExternalIdChange={(externalId) => setChildData(prev => ({ ...prev, externalId }))}
            onNext={() => setCurrentStep(WizardStep.AVATAR)}
            onCancel={handleClose}
          />
        );

      case WizardStep.AVATAR:
        return (
          <AdminChildAvatarStep
            avatarId={childData.avatarId}
            onAvatarChange={(avatarId) => setChildData(prev => ({ ...prev, avatarId }))}
            onBack={() => setCurrentStep(WizardStep.BASIC_INFO)}
            onNext={() => setCurrentStep(WizardStep.SPEECH_DIFFICULTIES)}
          />
        );

      case WizardStep.SPEECH_DIFFICULTIES:
        return (
          <SpeechDifficultiesStep
            childName={childData.name}
            initialDifficulties={childData.speechDifficulties}
            initialDescription={childData.speechDifficultiesDescription}
            onBack={() => setCurrentStep(WizardStep.AVATAR)}
            onSubmit={(difficulties, description) => {
              setChildData(prev => ({
                ...prev,
                speechDifficulties: difficulties,
                speechDifficultiesDescription: description || '',
              }));
              setCurrentStep(WizardStep.SPEECH_DEVELOPMENT);
            }}
            submitButtonText="Naprej"
          />
        );

      case WizardStep.SPEECH_DEVELOPMENT:
        return (
          <div className="space-y-4">
            <SpeechDevelopmentQuestions
              childName={childData.name}
              initialAnswers={childData.speechDevelopment}
              onBack={() => setCurrentStep(WizardStep.SPEECH_DIFFICULTIES)}
              onSubmit={(answers) => {
                setChildData(prev => ({
                  ...prev,
                  speechDevelopment: answers,
                }));
                handleSaveChild();
              }}
            />
            {isSubmitting && (
              <div className="flex items-center justify-center py-4">
                <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-dragon-green" />
                <span className="ml-2 text-muted-foreground">Shranjevanje...</span>
              </div>
            )}
          </div>
        );

      case WizardStep.COMPLETED:
        return (
          <AdminChildCompletedView
            child={childData}
            onAddAnother={handleAddAnother}
            onClose={handleClose}
          />
        );

      default:
        return null;
    }
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-center">{getStepTitle()}</DialogTitle>
        </DialogHeader>

        {currentStep !== WizardStep.COMPLETED && (
          <Progress value={progressPercentage} className="mb-4" />
        )}

        {renderStep()}
      </DialogContent>
    </Dialog>
  );
}
