import Header from "@/components/Header";
import { Button } from "@/components/ui/button";
import { RotateCcw, BookOpen, ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { AgeGatedRoute } from "@/components/auth/AgeGatedRoute";
import { SequenceGameC } from "@/components/exercises/SequenceGameC";
import { MatchingInstructionsModal } from "@/components/matching/MatchingInstructionsModal";
import { MatchingCompletionDialog } from "@/components/matching/MatchingCompletionDialog";
import { MemoryExitConfirmationDialog } from "@/components/games/MemoryExitConfirmationDialog";
import { useState, useRef } from "react";
import { useEnhancedProgress } from "@/hooks/useEnhancedProgress";

export default function ZaporedjaC() {
  const navigate = useNavigate();
  const { selectedChild } = useAuth();
  const { recordGameCompletion } = useEnhancedProgress();
  const [gameKey, setGameKey] = useState(0);
  const [showInstructions, setShowInstructions] = useState(false);
  const [showCompletion, setShowCompletion] = useState(false);
  const [playedImages, setPlayedImages] = useState<any[]>([]);
  const gameCompletedRef = useRef(false);

  const handleGameComplete = (images: any[]) => {
    if (!gameCompletedRef.current) {
      gameCompletedRef.current = true;
      // Transform SequenceImage to MatchingGameImage format
      const transformedImages = images.map(img => ({
        url: img.image_url || '',
        word: img.word || '',
        audio_url: img.audio_url || '',
        filename: img.word?.toLowerCase() || ''
      }));
      setPlayedImages(transformedImages);
      console.log(`Sequence game completed`, transformedImages);
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
    navigate('/govorne-igre/zaporedja');
  };

  const handleStarClaimed = () => {
    recordGameCompletion('memory', 'sequence_c_3-4');
  };

  return (
    <AgeGatedRoute requiredAgeGroup="3-4">
      <div className="min-h-screen bg-background">
        <Header />
        
        <div className="container max-w-5xl mx-auto pt-20 md:pt-24 pb-20 px-4">
          {/* Game Controls */}
          <div className="flex justify-center gap-4 mb-6">
            <MemoryExitConfirmationDialog onConfirm={handleBack}>
              <Button variant="outline" className="gap-2">
                <ArrowLeft className="h-4 w-4" />
                Nazaj
              </Button>
            </MemoryExitConfirmationDialog>
            <Button onClick={handleNewGame} className="bg-dragon-green hover:bg-dragon-green/90 text-white gap-2">
              <RotateCcw className="h-4 w-4" />
              Nova igra
            </Button>
            <Button variant="outline" onClick={handleInstructions} className="gap-2">
              <BookOpen className="h-4 w-4" />
              Navodila
            </Button>
          </div>

          <SequenceGameC 
            key={gameKey}
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
          images={playedImages}
          onStarClaimed={handleStarClaimed}
          instructionText="Klikni na slike in posnemaj besede"
        />
      </div>
    </AgeGatedRoute>
  );
}
