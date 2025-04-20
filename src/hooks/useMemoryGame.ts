
import { useState, useEffect } from 'react';
import { MemoryCard, memoryPairs } from '@/data/memoryGameData';

export function useMemoryGame() {
  const [cards, setCards] = useState<MemoryCard[]>([]);
  const [flippedIndices, setFlippedIndices] = useState<number[]>([]);
  const [matchedPairs, setMatchedPairs] = useState<number>(0);

  useEffect(() => {
    initializeGame();
  }, []);

  const initializeGame = () => {
    const gameCards: MemoryCard[] = [];
    
    memoryPairs.forEach((pair, index) => {
      // Add image card
      gameCards.push({
        id: index * 2,
        word: pair.word,
        type: 'image',
        image: pair.image,
        matched: false,
        flipped: false,
      });
      
      // Add text card
      gameCards.push({
        id: index * 2 + 1,
        word: pair.word,
        type: 'text',
        matched: false,
        flipped: false,
      });
    });

    // Shuffle cards
    const shuffledCards = [...gameCards].sort(() => Math.random() - 0.5);
    setCards(shuffledCards);
    setFlippedIndices([]);
    setMatchedPairs(0);
  };

  const handleCardClick = (index: number) => {
    // Ignore if card is already flipped or matched
    if (cards[index].flipped || cards[index].matched) return;
    
    // Ignore if two cards are already flipped
    if (flippedIndices.length === 2) return;

    const newCards = [...cards];
    newCards[index].flipped = true;
    setCards(newCards);

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

  return {
    cards,
    matchedPairs,
    totalPairs: memoryPairs.length,
    handleCardClick,
    initializeGame,
  };
}
