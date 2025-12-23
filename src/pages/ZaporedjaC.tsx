import { Button } from "@/components/ui/button";
import { Home } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { AgeGatedRoute } from "@/components/auth/AgeGatedRoute";
import { SequenceGameC } from "@/components/exercises/SequenceGameC";
import { MatchingInstructionsModal } from "@/components/matching/MatchingInstructionsModal";
import { MatchingCompletionDialog } from "@/components/matching/MatchingCompletionDialog";
import { ConfirmDialog } from "@/components/ui/confirm-dialog";
import { useState, useRef } from "react";
import { useEnhancedProgress } from "@/hooks/useEnhancedProgress";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export default function ZaporedjaC() {
  const navigate = useNavigate();
  const { selectedChild } = useAuth();
  const { recordGameCompletion } = useEnhancedProgress();
  const [gameKey, setGameKey] = useState(0);
  const [showInstructions, setShowInstructions] = useState(false);
  const [showCompletion, setShowCompletion] = useState(false);
  const [playedImages, setPlayedImages] = useState<any[]>([]);
  const [menuOpen, setMenuOpen] = useState(false);
  const [showExitConfirmation, setShowExitConfirmation] = useState(false);
  const [showNewGameConfirmation, setShowNewGameConfirmation] = useState(false);
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
    setMenuOpen(false);
    setShowNewGameConfirmation(true);
  };

  const handleConfirmNewGame = () => {
    gameCompletedRef.current = false;
    setPlayedImages([]);
    setGameKey(prev => prev + 1);
    setShowNewGameConfirmation(false);
  };

  const handleInstructions = () => {
    setMenuOpen(false);
    setShowInstructions(true);
  };

  const handleBack = () => {
    setMenuOpen(false);
    setShowExitConfirmation(true);
  };

  const handleConfirmExit = () => {
    navigate('/govorne-igre/zaporedja');
  };

  const handleStarClaimed = () => {
    recordGameCompletion('memory', 'sequence_c_3-4');
  };

  return (
    <AgeGatedRoute requiredAgeGroup="3-4">
      <div 
        className="fixed inset-0 overflow-auto select-none"
        style={{
          backgroundImage: 'url(https://ecmtctwovkheohqwahvt.supabase.co/storage/v1/object/public/ozadja/zeleno_ozadje.png)',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat'
        }}
      >
        {/* Main content */}
        <div className="min-h-full flex flex-col items-center justify-center p-4 pb-24">
          <h1 className="text-3xl md:text-5xl font-bold text-white mb-6 md:mb-8 text-center drop-shadow-lg">
            ZAPOREDJA - C
          </h1>
          
          <SequenceGameC 
            key={gameKey}
            onGameComplete={handleGameComplete}
          />
        </div>

        {/* Floating Menu Button - Left */}
        <DropdownMenu open={menuOpen} onOpenChange={setMenuOpen}>
          <DropdownMenuTrigger asChild>
            <button 
              className="fixed bottom-4 left-4 z-50 w-16 h-16 rounded-full bg-gradient-to-r from-amber-400 to-orange-500 flex items-center justify-center shadow-lg border-2 border-white/50 backdrop-blur-sm hover:scale-105 transition-transform"
            >
              <Home className="w-8 h-8 text-white" />
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent 
            className="ml-4 w-56 p-2 bg-white/95 border-2 border-orange-200 shadow-xl"
            align="start"
            side="top"
            sideOffset={8}
          >
            <button
              onClick={handleBack}
              className="w-full flex items-center gap-3 px-4 py-3 text-left hover:bg-orange-50 rounded-lg transition-colors"
            >
              <span className="text-xl">🏠</span>
              <span className="font-medium">Nazaj</span>
            </button>
            <button
              onClick={handleNewGame}
              className="w-full flex items-center gap-3 px-4 py-3 text-left hover:bg-orange-50 rounded-lg transition-colors"
            >
              <span className="text-xl">🔄</span>
              <span className="font-medium">Nova igra</span>
            </button>
            <button
              onClick={handleInstructions}
              className="w-full flex items-center gap-3 px-4 py-3 text-left hover:bg-orange-50 rounded-lg transition-colors"
            >
              <span className="text-xl">📖</span>
              <span className="font-medium">Navodila</span>
            </button>
          </DropdownMenuContent>
        </DropdownMenu>
        
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

        {/* Exit Confirmation Dialog */}
        <ConfirmDialog
          open={showExitConfirmation}
          onOpenChange={setShowExitConfirmation}
          title="Zapusti igro"
          description="Ali res želiš zapustiti igro?"
          confirmText="Da"
          cancelText="Ne"
          onConfirm={handleConfirmExit}
          onCancel={() => setShowExitConfirmation(false)}
        />

        {/* New Game Confirmation Dialog */}
        <ConfirmDialog
          open={showNewGameConfirmation}
          onOpenChange={setShowNewGameConfirmation}
          title="Nova igra"
          description="Ali res želiš začeti novo igro?"
          confirmText="Da"
          cancelText="Ne"
          onConfirm={handleConfirmNewGame}
          onCancel={() => setShowNewGameConfirmation(false)}
        />
      </div>
    </AgeGatedRoute>
  );
}
