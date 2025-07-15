
import { useState } from "react";
import { ChildProfile } from "./types";
import { toast } from "sonner";

export function useChildrenState() {
  const [children, setChildren] = useState<ChildProfile[]>([
    { id: crypto.randomUUID(), name: "", gender: "M", birthDate: null, avatarId: 1 }
  ]);
  const [selectedChildIndex, setSelectedChildIndex] = useState(0);

  const currentChild = children[selectedChildIndex];


  const updateChildField = (id: string, field: keyof ChildProfile, value: any) => {
    setChildren(children.map(child => 
      child.id === id ? { ...child, [field]: value } : child
    ));
  };

  const handleSpeechDifficultiesSubmit = (difficulties: string[], detailedDescription?: string) => {
    setChildren(prev => 
      prev.map((child, index) => 
        index === selectedChildIndex 
          ? { 
              ...child, 
              speechDifficulties: difficulties,
              speechDifficultiesDescription: detailedDescription || ""
            } 
          : child
      )
    );
  };

  const handleSpeechDevelopmentSubmit = (answers: Record<string, string>) => {
    setChildren(prev => 
      prev.map((child, index) => 
        index === selectedChildIndex 
          ? { ...child, speechDevelopment: answers, isComplete: true } 
          : child
      )
    );
  };

  return {
    children,
    setChildren,
    selectedChildIndex,
    setSelectedChildIndex,
    currentChild,
    updateChildField,
    handleSpeechDifficultiesSubmit,
    handleSpeechDevelopmentSubmit
  };
}
