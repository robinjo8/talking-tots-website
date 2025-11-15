import { useState, useCallback, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export interface SequenceImage {
  id: string;
  word: string | null;
  image_url: string | null;
  audio_url: string | null;
}

export const useSequenceGame = (tableName: string, count: number = 4) => {
  const [targetSequence, setTargetSequence] = useState<SequenceImage[]>([]);
  const [currentSequence, setCurrentSequence] = useState<SequenceImage[]>([]);
  const [isComplete, setIsComplete] = useState(false);

  const { data: imagesData, isLoading } = useQuery({
    queryKey: ["sequenceImages", tableName],
    queryFn: async () => {
      const { data, error } = await supabase
        .from(tableName as any)
        .select("*")
        .limit(20);
      
      if (error) {
        console.error("Error fetching sequence images:", error);
        throw error;
      }
      
      return data as unknown as SequenceImage[];
    }
  });

  const shuffleArray = <T,>(array: T[]): T[] => {
    const newArray = [...array];
    for (let i = newArray.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
    }
    return newArray;
  };

  const initializeGame = useCallback(() => {
    if (!imagesData || imagesData.length < count) return;

    // Select random images
    const shuffled = shuffleArray(imagesData);
    const selected = shuffled.slice(0, count) as SequenceImage[];

    setTargetSequence(selected);
    setCurrentSequence(shuffleArray([...selected]) as SequenceImage[]);
    setIsComplete(false);
  }, [imagesData, count]);

  useEffect(() => {
    if (imagesData && imagesData.length >= count) {
      initializeGame();
    }
  }, [imagesData, initializeGame, count]);

  const moveItem = useCallback((fromIndex: number, toIndex: number) => {
    setCurrentSequence(prev => {
      const newSequence = [...prev];
      const [movedItem] = newSequence.splice(fromIndex, 1);
      newSequence.splice(toIndex, 0, movedItem);
      return newSequence;
    });
  }, []);

  const checkCompletion = useCallback(() => {
    if (targetSequence.length === 0 || currentSequence.length === 0) return false;
    
    const isMatch = targetSequence.every((item, index) => 
      item.id === currentSequence[index]?.id
    );
    
    if (isMatch && !isComplete) {
      setIsComplete(true);
    }
    
    return isMatch;
  }, [targetSequence, currentSequence, isComplete]);

  useEffect(() => {
    checkCompletion();
  }, [currentSequence, checkCompletion]);

  const resetGame = useCallback(() => {
    initializeGame();
  }, [initializeGame]);

  return {
    targetSequence,
    currentSequence,
    isComplete,
    isLoading,
    moveItem,
    resetGame
  };
};
