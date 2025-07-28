
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";
import { SpeechDifficultiesStep } from "@/components/speech";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";

type SpeechDifficultyEditorProps = {
  open: boolean;
  onClose: () => void;
  childName: string;
  childId: string;
  initialDifficulties: string[];
};

export function SpeechDifficultyEditor({ 
  open, 
  onClose, 
  childName, 
  childId, 
  initialDifficulties 
}: SpeechDifficultyEditorProps) {
  const { user } = useAuth();
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const handleSaveDifficulties = async (selectedDifficulties: string[]) => {
    if (!user) {
      toast.error("Morate biti prijavljeni za urejanje motenj.");
      return;
    }
    
    try {
      setIsSubmitting(true);
      
      // Update speech difficulties directly in database
      const { error: updateError } = await supabase
        .from('children')
        .update({ 
          speech_difficulties: selectedDifficulties 
        })
        .eq('id', childId)
        .eq('parent_id', user.id);
        
      if (updateError) throw updateError;
      
      toast.success("Govorne motnje uspešno posodobljene!");
      onClose();
      
      // Refresh the page to show updated data
      window.location.reload();
      
    } catch (error: any) {
      console.error("Napaka pri posodobitvi motenj:", error);
      toast.error("Napaka pri posodobitvi motenj. Poskusite znova.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleGoBack = () => {
    onClose();
  };

  return (
    <Dialog open={open} onOpenChange={(isOpen) => !isOpen && onClose()}>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold">Urejanje govornih motenj</DialogTitle>
        </DialogHeader>
        
        <div className="py-4">
          <SpeechDifficultiesStep
            childName={childName}
            onBack={handleGoBack}
            onSubmit={handleSaveDifficulties}
            initialDifficulties={initialDifficulties}
            submitButtonText={isSubmitting ? "Shranjevanje..." : "Shrani spremembe"}
          />
        </div>
      </DialogContent>
    </Dialog>
  );
}
