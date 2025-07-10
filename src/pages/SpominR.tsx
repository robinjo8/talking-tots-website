import Header from "@/components/Header";
import { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CheckCircle2, RotateCcw } from "lucide-react";
import { shuffle } from "@/lib/utils";

interface CardItem {
  id: number;
  letter: string;
  isFlipped: boolean;
  isMatched: boolean;
}

export default function SpominR() {
  const [cards, setCards] = useState<CardItem[]>([]);
  const [flippedCards, setFlippedCards] = useState<number[]>([]);
  const [moves, setMoves] = useState(0);
  const [gameWon, setGameWon] = useState(false);

  useEffect(() => {
    const letters = ['R', 'R', 'R', 'R', 'R', 'R'];
    const initialCards = shuffle([...letters, ...letters]).map((letter, index) => ({
      id: index,
      letter,
      isFlipped: false,
      isMatched: false,
    }));
    setCards(initialCards);
    setMoves(0);
    setGameWon(false);
    setFlippedCards([]);
  }, []);

  useEffect(() => {
    if (flippedCards.length === 2) {
      setMoves(prevMoves => prevMoves + 1);
      const [firstIndex, secondIndex] = flippedCards;
      if (cards[firstIndex].letter === cards[secondIndex].letter) {
        const newCards = cards.map((card, index) => index === firstIndex || index === secondIndex ? { ...card, isMatched: true } : card);
        setCards(newCards);
        setFlippedCards([]);
      } else {
        setTimeout(() => {
          setFlippedCards([]);
        }, 1000);
      }
    }
  }, [flippedCards, cards]);

  useEffect(() => {
    if (cards.length > 0 && cards.every(card => card.isMatched)) {
      setGameWon(true);
    }
  }, [cards]);

  const handleCardClick = (index: number) => {
    if (flippedCards.length < 2 && !cards[index].isFlipped && !cards[index].isMatched) {
      setCards(cards.map((card, i) => i === index ? { ...card, isFlipped: true } : card));
      setFlippedCards([...flippedCards, index]);
    }
  };

  const resetGame = () => {
    const letters = ['R', 'R', 'R', 'R', 'R', 'R'];
    const initialCards = shuffle([...letters, ...letters]).map((letter, index) => ({
      id: index,
      letter,
      isFlipped: false,
      isMatched: false,
    }));
    setCards(initialCards);
    setFlippedCards([]);
    setMoves(0);
    setGameWon(false);
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <div className="container max-w-5xl mx-auto pt-16 pb-20 px-4">
        <div className="mb-4 flex items-center justify-between">
          <div>
            <p className="text-muted-foreground">Število potez: {moves}</p>
          </div>
          <div>
            <Button onClick={resetGame} variant="outline">
              <RotateCcw className="mr-2 h-4 w-4" />
              Ponastavi igro
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-4 gap-4">
          {cards.map((card, index) => (
            <Card
              key={card.id}
              className={`relative cursor-pointer rounded-md ${card.isFlipped || card.isMatched ? 'bg-muted' : 'bg-secondary'} ${card.isFlipped ? 'text-foreground' : 'text-transparent'} overflow-hidden`}
              onClick={() => handleCardClick(index)}
            >
              <div className="absolute inset-0 flex items-center justify-center text-4xl font-bold">
                {card.letter}
              </div>
              {card.isMatched && (
                <div className="absolute inset-0 bg-green-500 opacity-50 flex items-center justify-center">
                  <CheckCircle2 className="h-12 w-12 text-green-700" />
                </div>
              )}
            </Card>
          ))}
        </div>

        {gameWon && (
          <div className="mt-8 text-center">
            <h2 className="text-2xl font-bold text-green-500">Čestitke! Zmagali ste!</h2>
            <p className="text-muted-foreground">Igra je končana v {moves} potezah.</p>
          </div>
        )}
      </div>
    </div>
  );
}
