
import { useState } from "react";
import { ChildProfile } from "./types";
import { toast } from "sonner";

export function useChildrenState() {
  // Only one child per parent now
  const [child, setChild] = useState<ChildProfile>({ 
    id: crypto.randomUUID(), 
    name: "", 
    gender: "M", 
    birthDate: null, 
    avatarId: 1 
  });

  // For backward compatibility, we'll maintain the children array structure but with only one child
  const children = [child];
  const selectedChildIndex = 0;
  const currentChild = child;


  const updateChildField = (id: string, field: keyof ChildProfile, value: any) => {
    if (child.id === id) {
      setChild(prev => ({ ...prev, [field]: value }));
    }
  };

  const handleSpeechDifficultiesSubmit = (difficulties: string[], detailedDescription?: string) => {
    setChild(prev => ({ 
      ...prev, 
      speechDifficulties: difficulties,
      speechDifficultiesDescription: detailedDescription || ""
    }));
  };

  const handleSpeechDevelopmentSubmit = (answers: Record<string, string>) => {
    setChild(prev => ({ 
      ...prev, 
      speechDevelopment: answers, 
      isComplete: true 
    }));
  };

  return {
    children, // Still an array for backward compatibility
    setChildren: (children: ChildProfile[]) => setChild(children[0] || child), // Update only first child
    selectedChildIndex,
    setSelectedChildIndex: () => {}, // No-op since there's only one child
    currentChild,
    updateChildField,
    handleSpeechDifficultiesSubmit,
    handleSpeechDevelopmentSubmit
  };
}
