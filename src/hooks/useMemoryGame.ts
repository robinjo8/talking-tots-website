
import { useState, useEffect, useRef } from 'react';
import { supabase } from '@/integrations/supabase/client';
import type { MemoryCard } from '@/data/memoryGameData';

export function useMemoryGame() {
  const [cards, setCards] = useState<MemoryCard[]>([]);
  const [flippedIndices, setFlippedIndices] = useState<number[]>([]);
  const [matchedPairs, setMatchedPairs] = useState<number>(0);
  const [isLoading, setIsLoading] = useState(true);
  const audioRef = useRef<HTMLAudioElement>(null);
  
  const initializeGame = async () => {
    setIsLoading(true);
    try {
      // Fetch 10 random cards from Supabase
      const { data: memoryCards, error } = await supabase
        .from('memory-cards')
        .select('*')
        .limit(10);

      if (error) {
        console.error('Error fetching memory cards:', error);
        return;
      }

      if (!memoryCards || memoryCards.length === 0) {
        console.error('No memory cards found');
        return;
      }

      console.log('Fetched memory cards:', memoryCards);
      
      const gameCards: MemoryCard[] = [];
      
      // Create card pairs (image and text) for each item
      memoryCards.forEach((card) => {
        // Add image card
        gameCards.push({
          id: gameCards.length,
          word: card.word,
          type: 'image',
          image: card.image_url,
          audioUrl: card.audio_url,
          matched: false,
          flipped: false,
        });
        
        // Add text card
        gameCards.push({
          id: gameCards.length,
          word: card.word,
          type: 'text',
          audioUrl: card.audio_url,
          matched: false,
          flipped: false,
        });
      });

      // Shuffle cards
      const shuffledCards = [...gameCards].sort(() => Math.random() - 0.5);
      console.log('Shuffled cards:', shuffledCards);
      
      setCards(shuffledCards);
      setFlippedIndices([]);
      setMatchedPairs(0);
    } catch (error) {
      console.error('Error initializing game:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const playAudio = (audioUrl: string | null) => {
    if (audioUrl && audioRef.current) {
      audioRef.current.src = audioUrl;
      audioRef.current.play().catch(error => {
        console.error("Error playing audio:", error);
      });
    }
  };

  const handleCardClick = (index: number) => {
    // Ignore if card is already flipped or matched
    if (cards[index].flipped || cards[index].matched) return;
    
    // Ignore if two cards are already flipped
    if (flippedIndices.length === 2) return;

    const newCards = [...cards];
    newCards[index].flipped = true;
    setCards(newCards);

    // Play audio if available (only for text cards to avoid double playback)
    if (cards[index].type === 'text' && cards[index].audioUrl) {
      playAudio(cards[index].audioUrl);
    }

    const newFlippedIndices = [...flippedIndices, index];
    setFlippedIndices(newFlippedIndices);

    // Check for match if two cards are flipped
    if (newFlippedIndices.length === 2) {
      const [firstIndex, secondIndex] = newFlippedIndices;
      const firstCard = cards[firstIndex];
      const secondCard = cards[secondIndex];

      if (firstCard.word === secondCard.word && firstCard.type !== secondCard.type) {
        // Match found
        setTimeout(() => {
          const matchedCards = [...cards];
          matchedCards[firstIndex].matched = true;
          matchedCards[secondIndex].matched = true;
          setCards(matchedCards);
          setMatchedPairs(prev => prev + 1);
          setFlippedIndices([]);
        }, 500);
      } else {
        // No match
        setTimeout(() => {
          const unflippedCards = [...cards];
          unflippedCards[firstIndex].flipped = false;
          unflippedCards[secondIndex].flipped = false;
          setCards(unflippedCards);
          setFlippedIndices([]);
        }, 1000);
      }
    }
  };

  useEffect(() => {
    initializeGame();
  }, []);

  return {
    cards,
    matchedPairs,
    totalPairs: cards.length / 2,
    handleCardClick,
    initializeGame,
    audioRef,
    isLoading,
  };
}
