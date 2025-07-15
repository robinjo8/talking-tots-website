
import { useState } from "react";
import { ChildProfile } from "./types";
import { toast } from "sonner";

export function useChildrenState() {
  const [children, setChildren] = useState<ChildProfile[]>([
    { id: crypto.randomUUID(), name: "", gender: "M", birthDate: null, avatarId: 1 }
  ]);
  const [selectedChildIndex, setSelectedChildIndex] = useState(0);

  const currentChild = children[selectedChildIndex];

  const addChild = () => {
    setChildren([
      ...children,
      { id: crypto.randomUUID(), name: "", gender: "M", birthDate: null, avatarId: 1 }
    ]);
    setSelectedChildIndex(children.length);
  };

  const removeChild = (id: string) => {
    if (children.filter(c => c.isComplete).length > 1 || !children.some(c => c.isComplete)) {
      setChildren(children.filter(child => child.id !== id));
      
      // If we're removing the currently selected child, adjust the index
      if (children[selectedChildIndex].id === id) {
        setSelectedChildIndex(Math.max(0, selectedChildIndex - 1));
      }
    } else {
      toast.error("Potreben je vsaj en otrok.");
    }
  };

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
    addChild,
    removeChild,
    updateChildField,
    handleSpeechDifficultiesSubmit,
    handleSpeechDevelopmentSubmit
  };
}
