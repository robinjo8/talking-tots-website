
import { useState, useEffect } from 'react';
import { supabase } from "@/integrations/supabase/client";
import { Tables } from "@/integrations/supabase/types";

type MemoryCard = Tables<"memory_cards"> & {
  isFlipped: boolean;
  isMatched: boolean;
  pairId: number;
};

export const useMemoryGame = () => {
  const [cards, setCards] = useState<MemoryCard[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [flippedCards, setFlippedCards] = useState<MemoryCard[]>([]);

  const loadCards = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const { data, error } = await supabase
        .from('memory_cards')
        .select('*')
        .limit(10);

      if (error) throw error;
      
      if (!data || data.length === 0) {
        throw new Error('Ni najdenih kartic za igro.');
      }

      // Create pairs and add game state properties
      const cardPairs = data.flatMap((card, index) => [
        { ...card, isFlipped: false, isMatched: false, pairId: index },
        { ...card, isFlipped: false, isMatched: false, pairId: index }
      ]);

      // Shuffle the cards
      const shuffledCards = cardPairs.sort(() => Math.random() - 0.5);
      setCards(shuffledCards);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Napaka pri nalaganju kartic.');
    } finally {
      setLoading(false);
    }
  };

  const flipCard = (selectedCard: MemoryCard) => {
    if (
      flippedCards.length === 2 || 
      selectedCard.isFlipped || 
      selectedCard.isMatched
    ) return;

    // Flip the selected card
    const updatedCards = cards.map(card => 
      card === selectedCard ? { ...card, isFlipped: true } : card
    );
    setCards(updatedCards);
    
    const updatedFlippedCards = [...flippedCards, selectedCard];
    setFlippedCards(updatedFlippedCards);

    // Check for matches when two cards are flipped
    if (updatedFlippedCards.length === 2) {
      const [firstCard, secondCard] = updatedFlippedCards;
      
      if (firstCard.id === secondCard.id) {
        // Match found
        setCards(cards => cards.map(card => 
          card.id === firstCard.id ? { ...card, isMatched: true } : card
        ));
        setFlippedCards([]);
      } else {
        // No match - flip cards back after delay
        setTimeout(() => {
          setCards(cards => cards.map(card => 
            card === firstCard || card === secondCard 
              ? { ...card, isFlipped: false }
              : card
          ));
          setFlippedCards([]);
        }, 1000);
      }
    }
  };

  const resetGame = () => {
    loadCards();
    setFlippedCards([]);
  };

  // Load cards on mount
  useEffect(() => {
    loadCards();
  }, []);

  return {
    cards,
    loading,
    error,
    flipCard,
    resetGame
  };
};
