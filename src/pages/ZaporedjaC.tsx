import { Button } from "@/components/ui/button";
import { Home } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { AgeGatedRoute } from "@/components/auth/AgeGatedRoute";
import { SequenceGameC } from "@/components/exercises/SequenceGameC";
import { MatchingInstructionsModal } from "@/components/matching/MatchingInstructionsModal";
import { MatchingCompletionDialog } from "@/components/matching/MatchingCompletionDialog";
import { ConfirmDialog } from "@/components/ui/confirm-dialog";
import { useState, useRef, useEffect } from "react";
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

  // Mobile detection and orientation state
  const [isTouchDevice, setIsTouchDevice] = useState(false);
  const [isPortrait, setIsPortrait] = useState(false);
  
  const effectiveFullscreen = isTouchDevice;

  // Reliable touch device detection using physical screen size
  useEffect(() => {
    const hasTouch = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
    const isSmallScreen = Math.min(window.screen.width, window.screen.height) <= 900;
    setIsTouchDevice(hasTouch && isSmallScreen);
  }, []);

  // Reliable orientation detection using screen.orientation
  useEffect(() => {
    const checkOrientation = () => {
      if (window.screen.orientation) {
        setIsPortrait(window.screen.orientation.type.includes('portrait'));
      } else {
        // Fallback: use screen dimensions (not window - those change with CSS rotation)
        setIsPortrait(window.screen.height > window.screen.width);
      }
    };
    
    checkOrientation();
    
    const handleOrientationChange = () => {
      setTimeout(checkOrientation, 100);
    };
    
    window.addEventListener('orientationchange', handleOrientationChange);
    if (window.screen.orientation) {
      window.screen.orientation.addEventListener('change', checkOrientation);
    }
    
    return () => {
      window.removeEventListener('orientationchange', handleOrientationChange);
      if (window.screen.orientation) {
        window.screen.orientation.removeEventListener('change', checkOrientation);
      }
    };
  }, []);

  // Automatic fullscreen and landscape lock
  useEffect(() => {
    if (effectiveFullscreen) {
      const requestFullscreen = async () => {
        try {
          if (document.documentElement.requestFullscreen) {
            await document.documentElement.requestFullscreen();
          }
        } catch (error) {
          console.log('Fullscreen not supported:', error);
        }
      };

      const lockLandscape = async () => {
        try {
          if (screen.orientation && 'lock' in screen.orientation) {
            try {
              await (screen.orientation as any).lock('landscape-primary');
            } catch {
              await (screen.orientation as any).lock('landscape');
            }
          }
        } catch (error) {
          console.log('Landscape lock not supported:', error);
        }
      };

      requestFullscreen();
      lockLandscape();
        
      return () => {
        if (document.fullscreenElement) {
          document.exitFullscreen?.();
        }
        try {
          if (screen.orientation && 'unlock' in screen.orientation) {
            (screen.orientation as any).unlock();
          }
        } catch (error) {
          console.log('Portrait unlock not supported:', error);
        }
      };
    }
  }, [effectiveFullscreen]);

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

  const backgroundImageUrl = 'https://ecmtctwovkheohqwahvt.supabase.co/storage/v1/object/public/ozadja/zeleno_ozadje.png';

  // Mobile fullscreen version
  if (effectiveFullscreen) {
    return (
      <AgeGatedRoute requiredAgeGroup="3-4">
        <div className="fixed inset-0 overflow-hidden select-none">
          {/* Full screen background */}
          <div 
            className="fixed inset-0 w-full h-full bg-cover bg-center bg-no-repeat"
            style={{ backgroundImage: `url('${backgroundImageUrl}')` }}
          />
          
          {/* Game content */}
          <div className="relative z-10 flex-1 flex items-center justify-center overflow-hidden h-full w-full p-2">
            {!isPortrait ? (
              <div className="w-full h-full flex flex-col items-center justify-center">
                <SequenceGameC 
                  key={gameKey}
                  onGameComplete={handleGameComplete}
                  isLandscape={true}
                />
              </div>
            ) : (
              <div className="w-full h-full flex items-center justify-center px-6 text-center">
                <p className="text-base font-semibold text-foreground">
                  Za igranje igre Zaporedja prosim obrni telefon v ležeči položaj.
                </p>
              </div>
            )}
          </div>

          {/* Floating menu button */}
          <DropdownMenu open={menuOpen} onOpenChange={setMenuOpen}>
            <DropdownMenuTrigger asChild>
              <Button 
                className="fixed bottom-4 left-4 z-50 rounded-full w-16 h-16 bg-gradient-to-br from-amber-400 to-orange-500 hover:from-amber-500 hover:to-orange-600 shadow-lg border-2 border-white/50 backdrop-blur-sm"
                size="icon"
              >
                <Home className="h-7 w-7 text-white" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent 
              align="start" 
              side="top"
              sideOffset={8}
              className="ml-4 w-56 p-2 bg-white/95 border-2 border-orange-200 shadow-xl"
            >
              <button
                onClick={handleBack}
                className="w-full px-4 py-3 text-left hover:bg-orange-50 transition-colors flex items-center gap-3 text-base font-medium border-b border-orange-100"
              >
                <span className="text-2xl">🏠</span>
                <span>Nazaj</span>
              </button>
              <button
                onClick={handleNewGame}
                className="w-full px-4 py-3 text-left hover:bg-orange-50 transition-colors flex items-center gap-3 text-base font-medium border-b border-orange-100"
              >
                <span className="text-2xl">🔄</span>
                <span>Nova igra</span>
              </button>
              <button
                onClick={handleInstructions}
                className="w-full px-4 py-3 text-left hover:bg-orange-50 transition-colors flex items-center gap-3 text-base font-medium"
              >
                <span className="text-2xl">📖</span>
                <span>Navodila</span>
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

  // Desktop version
  return (
    <AgeGatedRoute requiredAgeGroup="3-4">
      <div 
        className="fixed inset-0 overflow-auto select-none"
        style={{
          backgroundImage: `url('${backgroundImageUrl}')`,
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
