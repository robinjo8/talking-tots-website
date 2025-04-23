
import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export interface MemoryCard {
  id: string;
  word: string | null;
  image_url: string | null;
  audio_url: string | null;
  flipped: boolean;
  matched: boolean;
  pairId: number;
  uniqueId?: string; // Added to distinguish between two identical cards
}

export const useMemoryGame = () => {
  const [cards, setCards] = useState<MemoryCard[]>([]);
  const [flippedCards, setFlippedCards] = useState<number[]>([]);
  const [matchedPairs, setMatchedPairs] = useState<number[]>([]);
  const [isCheckingMatch, setIsCheckingMatch] = useState(false);
  const [gameCompleted, setGameCompleted] = useState(false);

  // Fetch memory card data from Supabase
  const { data: memoryCardsData, isLoading, error } = useQuery({
    queryKey: ["memoryCards"],
    queryFn: async () => {
      console.log("Fetching memory cards from Supabase...");
      const { data, error } = await supabase
        .from("memory_cards")
        .select("*")
        .limit(10); // Ensure we get only 10 cards to create 10 pairs
      
      if (error) {
        console.error("Error fetching memory cards:", error);
        throw error;
      }
      
      console.log("Fetched memory cards:", data);
      return data || [];
    }
  });

  // Initialize the game when data is loaded
  useEffect(() => {
    if (memoryCardsData && memoryCardsData.length > 0) {
      console.log("Initializing game with memory cards data:", memoryCardsData);
      initializeGame(memoryCardsData);
    } else {
      console.log("No memory cards data available yet or empty array");
    }
  }, [memoryCardsData]);

  // Check if the game is completed
  useEffect(() => {
    if (cards.length > 0 && matchedPairs.length === cards.length / 2) {
      setGameCompleted(true);
    }
  }, [matchedPairs, cards]);

  // Initialize game by creating pairs and shuffling
  const initializeGame = (cardData: any[]) => {
    // Create two cards for each data item
    const cardPairs = cardData.flatMap((card, index) => [
      {
        ...card,
        flipped: false,
        matched: false,
        pairId: index,
        uniqueId: `${card.id}-1`
      },
      {
        ...card,
        flipped: false,
        matched: false,
        pairId: index,
        uniqueId: `${card.id}-2`
      }
    ]);

    // Shuffle cards
    const shuffledCards = shuffleArray([...cardPairs]);
    console.log("Initialized game with shuffled cards:", shuffledCards);
    setCards(shuffledCards);
    setFlippedCards([]);
    setMatchedPairs([]);
    setGameCompleted(false);
  };

  // Shuffle an array using Fisher-Yates algorithm
  const shuffleArray = <T,>(array: T[]): T[] => {
    const newArray = [...array];
    for (let i = newArray.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
    }
    return newArray;
  };

  // Handle card flip
  const flipCard = (index: number) => {
    // Skip if already checking a match or if card is already flipped or matched
    if (
      isCheckingMatch || 
      flippedCards.includes(index) || 
      cards[index]?.matched
    ) {
      return;
    }

    // Update the card to be flipped
    const updatedCards = [...cards];
    if (updatedCards[index]) {
      updatedCards[index].flipped = true;
      setCards(updatedCards);
      
      // Add to flipped cards
      const newFlippedCards = [...flippedCards, index];
      setFlippedCards(newFlippedCards);
      
      // Check for match if we have two flipped cards
      if (newFlippedCards.length === 2) {
        setIsCheckingMatch(true);
        
        const [firstIndex, secondIndex] = newFlippedCards;
        const firstCard = cards[firstIndex];
        const secondCard = cards[secondIndex];
        
        if (firstCard && secondCard && firstCard.pairId === secondCard.pairId) {
          // Cards match
          setTimeout(() => {
            const updatedCards = [...cards];
            updatedCards[firstIndex].matched = true;
            updatedCards[secondIndex].matched = true;
            setCards(updatedCards);
            setMatchedPairs([...matchedPairs, firstCard.pairId]);
            setFlippedCards([]);
            setIsCheckingMatch(false);
          }, 1000);
        } else {
          // Cards don't match
          setTimeout(() => {
            const updatedCards = [...cards];
            if (updatedCards[firstIndex]) updatedCards[firstIndex].flipped = false;
            if (updatedCards[secondIndex]) updatedCards[secondIndex].flipped = false;
            setCards(updatedCards);
            setFlippedCards([]);
            setIsCheckingMatch(false);
          }, 1500);
        }
      }
    }
  };

  // Reset the game
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
