
import { useState } from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useMemoryGame } from "@/hooks/useMemoryGame";
import { MemoryCard as MemoryCardComponent } from "./MemoryCard";
import { MemoryGameEditor } from "./MemoryGameEditor";
import { Loader2, Pencil, Save } from "lucide-react";

export function MemoryGame() {
  const { 
    cards, 
    matchedPairs, 
    totalPairs, 
    handleCardClick, 
    initializeGame, 
    audioRef, 
    isLoading,
    updateCard 
  } = useMemoryGame();
  
  const [isEditMode, setIsEditMode] = useState(false);
  
  return (
    <div className="w-full max-w-7xl mx-auto">
      <audio ref={audioRef} className="hidden" />
      
      <div className="flex justify-between items-center mb-6">
        <div className="text-lg font-medium">
          {isEditMode ? (
            "Način urejanja"
          ) : (
            `Najdenih parov: ${matchedPairs} / ${totalPairs}`
          )}
        </div>
        <div className="flex gap-2">
          <Button 
            variant="outline" 
            onClick={() => setIsEditMode(!isEditMode)}
            className="bg-dragon-green/10 border-dragon-green/30 text-dragon-green hover:bg-dragon-green/20"
          >
            {isEditMode ? (
              <>
                <Save className="w-4 h-4 mr-2" />
                Shrani
              </>
            ) : (
              <>
                <Pencil className="w-4 h-4 mr-2" />
                Uredi
              </>
            )}
          </Button>
          {!isEditMode && (
            <Button 
              variant="outline" 
              onClick={() => initializeGame()}
              className="bg-dragon-green/10 border-dragon-green/30 text-dragon-green hover:bg-dragon-green/20"
            >
              Nova igra
            </Button>
          )}
        </div>
      </div>
      
      {isLoading ? (
        <div className="flex justify-center items-center h-96">
          <Loader2 className="h-12 w-12 text-dragon-green animate-spin" />
          <span className="ml-4 text-lg">Nalaganje igre...</span>
        </div>
      ) : isEditMode ? (
        <MemoryGameEditor 
          cards={cards} 
          onUpdateCard={updateCard}
        />
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-5 gap-3 md:gap-4">
          {cards.map((card, index) => (
            <MemoryCardComponent
              key={card.id}
              word={card.word}
              type={card.type}
              image={card.image}
              isFlipped={card.flipped}
              isMatched={card.matched}
              onClick={() => handleCardClick(index)}
            />
          ))}
        </div>
      )}
    </div>
  );
}
