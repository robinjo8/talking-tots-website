
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { SpeechDevelopmentQuestions } from "@/components/speech";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";

type SpeechDevelopmentEditorProps = {
  open: boolean;
  onClose: () => void;
  childName: string;
  childId: string;
  initialAnswers: Record<string, string>;
};

export function SpeechDevelopmentEditor({
  open,
  onClose,
  childName,
  childId,
  initialAnswers
}: SpeechDevelopmentEditorProps) {
  const { user } = useAuth();
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const handleSaveDevelopment = async (answers: Record<string, string>) => {
    if (!user) {
      toast.error("Morate biti prijavljeni za urejanje podatkov o razvoju.");
      return;
    }
    
    try {
      setIsSubmitting(true);
      
      // Update speech development directly in database
      const { error: updateError } = await supabase
        .from('children')
        .update({ 
          speech_development: answers 
        })
        .eq('id', childId)
        .eq('parent_id', user.id);
        
      if (updateError) throw updateError;
      
      toast.success("Podatki o razvoju uspešno posodobljeni!");
      onClose();
      
      // Refresh the page to show updated data
      window.location.reload();
      
    } catch (error: any) {
      console.error("Napaka pri posodobitvi podatkov o razvoju:", error);
      toast.error("Napaka pri posodobitvi. Poskusite znova.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={(isOpen) => !isOpen && onClose()}>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold">Urejanje govornega razvoja</DialogTitle>
        </DialogHeader>
        
        <div className="py-4">
          <SpeechDevelopmentQuestions
            childName={childName}
            onBack={onClose}
            onSubmit={handleSaveDevelopment}
            initialAnswers={initialAnswers}
          />
        </div>
      </DialogContent>
    </Dialog>
  );
}
