
import { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import { MemoryCard } from "./MemoryCard";
import { supabase } from "@/integrations/supabase/client";
import { Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { shuffle } from "@/utils/arrayUtils"; 

export type GameCard = {
  id: string;
  pairId: number;
  imageUrl: string | null;
  audioUrl: string | null;
  word: string | null;
  flipped: boolean;
  matched: boolean;
};

export function MemoryGrid() {
  const [cards, setCards] = useState<GameCard[]>([]);
  const [loading, setLoading] = useState(true);
  const [firstCard, setFirstCard] = useState<number | null>(null);
  const [secondCard, setSecondCard] = useState<number | null>(null);
  const [locked, setLocked] = useState(false);
  const [matchedPairs, setMatchedPairs] = useState(0);
  const { toast } = useToast();

  // Fetch cards from Supabase
  useEffect(() => {
    async function fetchCards() {
      try {
        // Get 10 random cards from Supabase
        const { data, error } = await supabase
          .from('memory_cards')
          .select('id, word, image_url, audio_url')
          .limit(10);

        if (error) {
          console.error("Error fetching cards:", error);
          toast({
            title: "Napaka pri nalaganju kartic",
            description: "Poskusite ponovno kasneje.",
            variant: "destructive",
          });
          setLoading(false);
          return;
        }

        if (!data || data.length === 0) {
          toast({
            title: "Ni kartic",
            description: "V bazi ni kartic za igro.",
          });
          setLoading(false);
          return;
        }

        // Create pairs for each card
        const cardPairs = data.flatMap((card, index) => [
          {
            id: card.id + "-1",
            pairId: index,
            imageUrl: card.image_url,
            audioUrl: card.audio_url,
            word: card.word,
            flipped: false,
            matched: false,
          },
          {
            id: card.id + "-2", 
            pairId: index,
            imageUrl: card.image_url,
            audioUrl: card.audio_url,
            word: card.word,
            flipped: false,
            matched: false,
          },
        ]);

        // Shuffle cards
        setCards(shuffle(cardPairs));
        setLoading(false);
      } catch (error) {
        console.error("Error in fetchCards:", error);
        toast({
          title: "Napaka pri nalaganju igre",
          description: "Prosimo, poskusite kasneje.",
          variant: "destructive",
        });
        setLoading(false);
      }
    }

    fetchCards();
  }, [toast]);

  // Handle card flips
  const handleCardClick = (index: number) => {
    // Prevent flipping if the board is locked or card is already flipped/matched
    if (locked || cards[index].flipped || cards[index].matched) return;
    
    // Flip the card
    const updatedCards = [...cards];
    updatedCards[index].flipped = true;
    setCards(updatedCards);
    
    // Check if this is the first or second card flipped
    if (firstCard === null) {
      setFirstCard(index);
    } else if (secondCard === null) {
      setSecondCard(index);
      setLocked(true);
      
      // Check for a match after a brief delay
      setTimeout(() => checkForMatch(index), 800);
    }
  };

  // Check if two flipped cards match
  const checkForMatch = (secondCardIndex: number) => {
    if (firstCard === null) return;
    
    const updatedCards = [...cards];
    
    // If the pairId matches, mark both cards as matched
    if (cards[firstCard].pairId === cards[secondCardIndex].pairId) {
      updatedCards[firstCard].matched = true;
      updatedCards[secondCardIndex].matched = true;
      
      // Increment matched pairs
      const newMatchedPairs = matchedPairs + 1;
      setMatchedPairs(newMatchedPairs);
      
      // Check if game is complete
      if (newMatchedPairs === 10) {
        toast({
          title: "Čestitke!",
          description: "Našli ste vse pare!",
        });
      }
    } else {
      // If no match, flip the cards back after a delay
      setTimeout(() => {
        updatedCards[firstCard].flipped = false;
        updatedCards[secondCardIndex].flipped = false;
        setCards([...updatedCards]);
      }, 800);
    }
    
    // Reset and unlock the board
    setFirstCard(null);
    setSecondCard(null);
    setLocked(false);
    setCards(updatedCards);
  };

  // Reset the game
  const resetGame = () => {
    setFirstCard(null);
    setSecondCard(null);
    setMatchedPairs(0);
    setCards(cards.map(card => ({
      ...card,
      flipped: false,
      matched: false
    })));
    setCards(shuffle([...cards]));
  };

  if (loading) {
    return (
      <Card className="w-full p-8 flex justify-center items-center bg-white/50 backdrop-blur-sm border-dragon-green/20">
        <Loader2 className="h-8 w-8 animate-spin text-dragon-green" />
        <span className="ml-2 text-lg">Nalaganje igre...</span>
      </Card>
    );
  }

  return (
    <Card className="w-full p-4 bg-white/50 backdrop-blur-sm border-dragon-green/20">
      <div className="grid grid-cols-4 sm:grid-cols-5 gap-2 md:gap-3 aspect-[5/4]">
        {cards.map((card, index) => (
          <MemoryCard 
            key={card.id}
            index={index}
            imageUrl={card.imageUrl}
            audioUrl={card.audioUrl}
            word={card.word}
            flipped={card.flipped}
            matched={card.matched}
            onClick={() => handleCardClick(index)}
          />
        ))}
      </div>
    </Card>
  );
}
