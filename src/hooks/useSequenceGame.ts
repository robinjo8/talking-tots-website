import { useState, useCallback, useEffect, useRef } from "react";
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
  const [correctIndices, setCorrectIndices] = useState<number[]>([]);
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);
  const [activePlayingIndex, setActivePlayingIndex] = useState<number | null>(null);
  const sequentialPlaybackRef = useRef(false);

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

  const shuffleUntilDifferent = (target: SequenceImage[], maxAttempts: number = 100): SequenceImage[] => {
    let shuffled = shuffleArray([...target]);
    let attempts = 0;
    
    while (attempts < maxAttempts) {
      const hasMatch = shuffled.some((item, index) => item.id === target[index]?.id);
      if (!hasMatch) {
        return shuffled;
      }
      shuffled = shuffleArray([...target]);
      attempts++;
    }
    
    if (shuffled[0]?.id === target[0]?.id) {
      [shuffled[0], shuffled[1]] = [shuffled[1], shuffled[0]];
    }
    
    return shuffled;
  };

  const initializeGame = useCallback(() => {
    if (!imagesData || imagesData.length < count) return;

    const shuffled = shuffleArray(imagesData);
    const selected = shuffled.slice(0, count) as SequenceImage[];

    setTargetSequence(selected);
    setCurrentSequence(shuffleUntilDifferent(selected));
    setIsComplete(false);
    setCorrectIndices([]);
    setActivePlayingIndex(null);
    setIsPlayingAudio(false);
    sequentialPlaybackRef.current = false;
  }, [imagesData, count]);

  useEffect(() => {
    if (imagesData && imagesData.length >= count) {
      initializeGame();
    }
  }, [imagesData, initializeGame, count]);

  // Check correct indices (visual only, no audio)
  useEffect(() => {
    if (targetSequence.length === 0 || currentSequence.length === 0) return;
    const newCorrect: number[] = [];
    currentSequence.forEach((item, index) => {
      if (item.id === targetSequence[index]?.id) {
        newCorrect.push(index);
      }
    });
    setCorrectIndices(newCorrect);
  }, [currentSequence, targetSequence]);

  // Check completion
  useEffect(() => {
    if (targetSequence.length === 0 || currentSequence.length === 0) return;
    
    const isMatch = targetSequence.every((item, index) => 
      item.id === currentSequence[index]?.id
    );
    
    if (isMatch && !isComplete) {
      setIsComplete(true);
      setIsPlayingAudio(true);
    }
  }, [targetSequence, currentSequence, isComplete]);

  // Sequential playback on completion
  useEffect(() => {
    if (!isComplete || sequentialPlaybackRef.current) return;
    sequentialPlaybackRef.current = true;

    const playSequential = async () => {
      setIsPlayingAudio(true);
      for (let i = 0; i < currentSequence.length; i++) {
        setActivePlayingIndex(i);
        const img = currentSequence[i];
        if (img?.audio_url) {
          await new Promise<void>((resolve) => {
            const audio = new Audio(img.audio_url!);
            audio.onended = () => resolve();
            audio.onerror = () => resolve();
            audio.play().catch(() => resolve());
          });
        }
        await new Promise(r => setTimeout(r, 300));
      }
      setActivePlayingIndex(null);
      setIsPlayingAudio(false);
    };

    playSequential();
  }, [isComplete, currentSequence]);

  const moveItem = useCallback((fromIndex: number, toIndex: number) => {
    if (isPlayingAudio) return;
    setCurrentSequence(prev => {
      const newSequence = [...prev];
      const [movedItem] = newSequence.splice(fromIndex, 1);
      newSequence.splice(toIndex, 0, movedItem);
      return newSequence;
    });
  }, [isPlayingAudio]);

  const resetGame = useCallback(() => {
    initializeGame();
  }, [initializeGame]);

  return {
    targetSequence,
    currentSequence,
    isComplete,
    isLoading,
    moveItem,
    resetGame,
    correctIndices,
    isPlayingAudio,
    activePlayingIndex
  };
};
