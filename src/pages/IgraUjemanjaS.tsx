import Header from "@/components/Header";
import { Button } from "@/components/ui/button";
import { RotateCcw, BookOpen, ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { AgeGatedRoute } from "@/components/auth/AgeGatedRoute";
import { MatchingGame } from "@/components/matching/MatchingGame";
import { MatchingInstructionsModal } from "@/components/matching/MatchingInstructionsModal";
import { MatchingCompletionDialog } from "@/components/matching/MatchingCompletionDialog";
import { getLetterData, getImagesForAgeGroup, MatchingGameImage } from "@/data/matchingGameData";
import { useState, useRef } from "react";
import { useEnhancedProgress } from "@/hooks/useEnhancedProgress";

export default function IgraUjemanjaS() {
  const navigate = useNavigate();
  const { selectedChild } = useAuth();
  const { recordGameCompletion } = useEnhancedProgress();
  const childName = selectedChild?.name;
  const [gameKey, setGameKey] = useState(0);
  const [showInstructions, setShowInstructions] = useState(false);
  const [showCompletion, setShowCompletion] = useState(false);
  const [playedImages, setPlayedImages] = useState<MatchingGameImage[]>([]);
  const gameCompletedRef = useRef(false);
  
  const getGameImages = () => {
    const letterData = getLetterData('S');
    return letterData ? getImagesForAgeGroup(letterData.images, '3-4') : [];
  };
  
  const gameImages = getGameImages();

  const handleGameComplete = (score: number, images: MatchingGameImage[]) => {
    if (!gameCompletedRef.current) {
      gameCompletedRef.current = true;
      setPlayedImages(images);
      console.log(`Game completed with score: ${score}`);
      setShowCompletion(true);
    }
  };

  const handleNewGame = () => {
    gameCompletedRef.current = false;
    setPlayedImages([]);
    setGameKey(prev => prev + 1);
  };

  const handleInstructions = () => {
    setShowInstructions(true);
  };

  const handleBack = () => {
    navigate('/govorne-igre/igra-ujemanja');
  };

  const handleStarClaimed = () => {
    recordGameCompletion('memory', 'matching_s_3-4');
  };

  return (
    <AgeGatedRoute requiredAgeGroup="3-4">
      <div className="min-h-screen bg-background">
        <Header />
        
        <div className="container max-w-5xl mx-auto pt-20 md:pt-24 pb-20 px-4">
          {/* Game Controls */}
          <div className="flex justify-center gap-4 mb-6">
            <Button onClick={handleBack} className="bg-black hover:bg-black/90 text-white gap-2">
              <ArrowLeft className="h-4 w-4" />
              Nazaj
            </Button>
            <Button onClick={handleNewGame} className="bg-dragon-green hover:bg-dragon-green/90 text-white gap-2">
              <RotateCcw className="h-4 w-4" />
              Nova igra
            </Button>
            <Button onClick={handleInstructions} className="bg-black hover:bg-black/90 text-white gap-2">
              <BookOpen className="h-4 w-4" />
              Navodila
            </Button>
          </div>

          <MatchingGame 
            key={gameKey}
            images={gameImages}
            numColumns={2}
            onGameComplete={handleGameComplete}
          />
        </div>
        
        <MatchingInstructionsModal
          isOpen={showInstructions}
          onClose={() => setShowInstructions(false)}
        />
        
        <MatchingCompletionDialog
          isOpen={showCompletion}
          onClose={() => setShowCompletion(false)}
          images={playedImages.length > 0 ? playedImages : gameImages}
          onStarClaimed={handleStarClaimed}
        />
      </div>
    </AgeGatedRoute>
  );
}