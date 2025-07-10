import Header from "@/components/Header";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { useAuth } from "@/contexts/AuthContext";
import { updatePoints } from "@/integrations/supabase/points";

const images = [
  "/images/spomin/s/sonce.png",
  "/images/spomin/s/sova.png",
  "/images/spomin/s/srce.png",
  "/images/spomin/s/stol.png",
  "/images/spomin/s/svinčnik.png",
  "/images/spomin/s/škarje.png",
];

export default function SpominS() {
  const [cards, setCards] = useState<any[]>([]);
  const [flipped, setFlipped] = useState<number[]>([]);
  const [matched, setMatched] = useState<number[]>([]);
  const [moves, setMoves] = useState(0);
  const [gameOver, setGameOver] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();
  const { user } = useAuth();

  useEffect(() => {
    const initializeGame = () => {
      const duplicatedImages = [...images, ...images];
      const shuffledImages = duplicatedImages.sort(() => Math.random() - 0.5);
      const initialCards = shuffledImages.map((image, index) => ({
        id: index,
        image,
        isFlipped: false,
        isMatched: false,
      }));
      setCards(initialCards);
      setFlipped([]);
      setMatched([]);
      setMoves(0);
      setGameOver(false);
    };

    initializeGame();
  }, []);

  useEffect(() => {
    if (flipped.length === 2) {
      const firstCard = cards[flipped[0]];
      const secondCard = cards[flipped[1]];

      if (firstCard.image === secondCard.image) {
        setMatched([...matched, ...flipped]);
        setFlipped([]);
        setMoves(moves + 1);
        toast({
          title: "Bravo!",
          description: "Našli ste par!",
        });
      } else {
        setTimeout(() => {
          setFlipped([]);
          setMoves(moves + 1);
          toast({
            title: "Žal ne!",
            description: "Poskusite ponovno!",
          });
        }, 1000);
      }
    }

    if (matched.length === cards.length && cards.length > 0) {
      setGameOver(true);
      updatePoints(user?.id, 10, "spomin-s");
      toast({
        title: "Čestitke!",
        description: "Igra končana!",
      });
    }
  }, [flipped, cards, matched, moves, toast, user?.id]);

  const handleCardClick = (index: number) => {
    if (flipped.length < 2 && !flipped.includes(index) && !matched.includes(index)) {
      setFlipped([...flipped, index]);
    }
  };

  const resetGame = () => {
    const duplicatedImages = [...images, ...images];
    const shuffledImages = duplicatedImages.sort(() => Math.random() - 0.5);
    const initialCards = shuffledImages.map((image, index) => ({
      id: index,
      image,
      isFlipped: false,
      isMatched: false,
    }));
    setCards(initialCards);
    setFlipped([]);
    setMatched([]);
    setMoves(0);
    setGameOver(false);
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <div className="container max-w-5xl mx-auto pt-8 pb-20 px-4">
        <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 gap-4">
          {cards.map((card, index) => (
            <Card
              key={card.id}
              className={`relative cursor-pointer rounded-md shadow-sm transition-transform duration-300 ${
                flipped.includes(index) || matched.includes(index)
                  ? "transform rotate-y-180"
                  : ""
              }`}
              onClick={() => handleCardClick(index)}
            >
              <div className="absolute inset-0 flex items-center justify-center backface-hidden">
                {!flipped.includes(index) && !matched.includes(index) ? (
                  <div className="w-full h-full bg-gray-200 rounded-md" />
                ) : (
                  <img
                    src={card.image}
                    alt="Card"
                    className="max-w-full max-h-full rounded-md"
                  />
                )}
              </div>
            </Card>
          ))}
        </div>

        <div className="mt-8 flex justify-between items-center">
          <p className="text-sm text-muted-foreground">
            Število potez: {moves}
          </p>
          {gameOver && (
            <Button onClick={resetGame} className="bg-dragon-green text-white">
              Igraj ponovno
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
