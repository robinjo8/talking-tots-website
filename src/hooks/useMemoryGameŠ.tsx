
import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useUserProgress } from "./useUserProgress";

export interface MemoryCard {
  id: string;
  word: string | null;
  image_url: string | null;
  audio_url: string | null;
  flipped: boolean;
  matched: boolean;
  pairId: string;
  uniqueId?: string;
}

export const useMemoryGameŠ = () => {
  const { recordMemoryGameCompletion } = useUserProgress();
  const [cards, setCards] = useState<MemoryCard[]>([]);
  const [flippedCards, setFlippedCards] = useState<number[]>([]);
  const [matchedPairs, setMatchedPairs] = useState<string[]>([]);
  const [isCheckingMatch, setIsCheckingMatch] = useState(false);
  const [gameCompleted, setGameCompleted] = useState(false);

  const { data: memoryCardsData, isLoading, error } = useQuery({
    queryKey: ["memoryCardsŠ"],
    queryFn: async () => {
      console.log("Fetching memory cards Š from Supabase...");
      const { data, error } = await supabase
        .from("memory_cards_Š_duplicate")
        .select("*")
        .limit(10);
      
      if (error) {
        console.error("Error fetching memory cards:", error);
        throw error;
      }
      
      console.log("Fetched memory cards:", data);
      return data || [];
    }
  });

  const initializeGame = (cardData: any[]) => {
    // Create pairs using the Supabase row ID as the pair identifier
    const cardPairs = cardData.flatMap((card) => [
      {
        ...card,
        flipped: false,
        matched: false,
        pairId: card.id,
        uniqueId: `${card.id}-1`
      },
      {
        ...card,
        flipped: false,
        matched: false,
        pairId: card.id,
        uniqueId: `${card.id}-2`
      }
    ]);

    const shuffledCards = shuffleArray([...cardPairs]);
    setCards(shuffledCards);
    setFlippedCards([]);
    setMatchedPairs([]);
    setGameCompleted(false);
    
    console.log("Game initialized with shuffled cards:", shuffledCards);
  };

  const shuffleArray = <T,>(array: T[]): T[] => {
    const newArray = [...array];
    for (let i = newArray.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
    }
    return newArray;
  };

  const flipCard = (index: number) => {
    if (isCheckingMatch || flippedCards.includes(index) || cards[index]?.matched) {
      return;
    }

    const updatedCards = [...cards];
    updatedCards[index].flipped = true;
    setCards(updatedCards);
    
    const newFlippedCards = [...flippedCards, index];
    setFlippedCards(newFlippedCards);
    
    if (newFlippedCards.length === 2) {
      setIsCheckingMatch(true);
      
      const [firstIndex, secondIndex] = newFlippedCards;
      const firstCard = cards[firstIndex];
      const secondCard = cards[secondIndex];
      
      if (firstCard && secondCard && firstCard.pairId === secondCard.pairId) {
        console.log("Match found! Card pair ID:", firstCard.pairId);
        setTimeout(() => {
          const updatedCards = [...cards];
          updatedCards[firstIndex].matched = true;
          updatedCards[secondIndex].matched = true;
          setCards(updatedCards);
          setMatchedPairs([...matchedPairs, firstCard.pairId]);
          setFlippedCards([]);
          setIsCheckingMatch(false);
        }, 500);
      } else {
        console.log("No match. Flipping cards back.");
        setTimeout(() => {
          const updatedCards = [...cards];
          updatedCards[firstIndex].flipped = false;
          updatedCards[secondIndex].flipped = false;
          setCards(updatedCards);
          setFlippedCards([]);
          setIsCheckingMatch(false);
        }, 1500);
      }
    }
  };

  useEffect(() => {
    if (memoryCardsData && memoryCardsData.length > 0) {
      console.log("Initializing game Š with memory cards data:", memoryCardsData);
      initializeGame(memoryCardsData);
    }
  }, [memoryCardsData]);

  useEffect(() => {
    if (cards.length > 0 && matchedPairs.length === cards.length / 2) {
      console.log("Game completed!");
      setGameCompleted(true);
      // Record completion in progress system
      recordMemoryGameCompletion('Š');
    }
  }, [matchedPairs, cards, recordMemoryGameCompletion]);

  const resetGame = () => {
    if (memoryCardsData && memoryCardsData.length > 0) {
      initializeGame(memoryCardsData);
    }
  };

  return {
    cards,
    isLoading,
    error,
    flipCard,
    resetGame,
    gameCompleted,
    matchedPairs,
    totalPairs: cards.length / 2,
    isCheckingMatch
  };
};
