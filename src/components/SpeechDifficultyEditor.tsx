
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
  childIndex: number;
  initialDifficulties: string[];
};

export function SpeechDifficultyEditor({ 
  open, 
  onClose, 
  childName, 
  childIndex, 
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
      
      // Get complete user metadata including raw data using RPC
      const { data: userMetadata, error: metadataError } = await supabase.rpc('get_auth_user_data');
      
      if (metadataError) {
        console.error('Error fetching user metadata:', metadataError);
        throw metadataError;
      }
      
      const metadataObject = userMetadata as any;
      const currentChildren = [...(metadataObject?.children || [])];
      
      // Update difficulties for the specific child
      if (childIndex >= 0 && childIndex < currentChildren.length) {
        currentChildren[childIndex] = {
          ...currentChildren[childIndex],
          speechDifficulties: selectedDifficulties
        };
        
        // Update user metadata
        const { error: updateError } = await supabase.auth.updateUser({
          data: { children: currentChildren }
        });
        
        if (updateError) throw updateError;
        
        toast.success("Govorne motnje uspešno posodobljene!");
        
        // Refresh the auth context to get updated data
        window.location.reload();
        
        onClose();
      } else {
        toast.error("Napaka pri posodobitvi motenj. Indeks ni veljaven.");
      }
      
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
