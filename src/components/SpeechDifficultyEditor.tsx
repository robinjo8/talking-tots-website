
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { SpeechDifficultiesStep } from "@/components/SpeechDifficultiesStep";
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
      toast.error("Morate biti prijavljeni za urejanje težav.");
      return;
    }
    
    try {
      setIsSubmitting(true);
      
      // Get current user metadata
      const { data: userData, error: userError } = await supabase.auth.getUser();
      
      if (userError) throw userError;
      
      const currentUser = userData.user;
      const currentMetadata = currentUser.user_metadata || {};
      const currentChildren = [...(currentMetadata.children || [])];
      
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
        
        toast.success("Govorne težave uspešno posodobljene!");
        onClose();
      } else {
        toast.error("Napaka pri posodobitvi težav. Indeks ni veljaven.");
      }
      
    } catch (error: any) {
      console.error("Napaka pri posodobitvi težav:", error);
      toast.error("Napaka pri posodobitvi težav. Poskusite znova.");
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
          <DialogTitle className="text-xl font-semibold">Urejanje govornih težav</DialogTitle>
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
