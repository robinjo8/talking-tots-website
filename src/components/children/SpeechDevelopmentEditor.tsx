
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
  childIndex: number;
  initialAnswers: Record<string, string>;
};

export function SpeechDevelopmentEditor({
  open,
  onClose,
  childName,
  childIndex,
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
      
      // Get current user metadata
      const { data: userData, error: userError } = await supabase.auth.getUser();
      
      if (userError) throw userError;
      
      const currentUser = userData.user;
      const currentMetadata = currentUser.user_metadata || {};
      const currentChildren = [...(currentMetadata.children || [])];
      
      // Update development data for the specific child
      if (childIndex >= 0 && childIndex < currentChildren.length) {
        currentChildren[childIndex] = {
          ...currentChildren[childIndex],
          speechDevelopment: answers
        };
        
        // Update user metadata
        const { error: updateError } = await supabase.auth.updateUser({
          data: { children: currentChildren }
        });
        
        if (updateError) throw updateError;
        
        toast.success("Podatki o razvoju uspešno posodobljeni!");
        onClose();
      } else {
        toast.error("Napaka pri posodobitvi. Indeks ni veljaven.");
      }
      
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
