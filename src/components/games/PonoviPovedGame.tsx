import { useState, useRef, useCallback, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Home, Volume2 } from "lucide-react";
import { 
  PonoviPovedConfig, 
  SentenceWord,
  getImageUrl, 
  getAudioUrl 
} from "@/data/ponoviPovedConfig";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
  Dialog,
  DialogContent,
  DialogTitle,
} from "@/components/ui/dialog";

type GamePhase = "start" | "word" | "sentence" | "complete";

interface PonoviPovedGameProps {
  config: PonoviPovedConfig;
}

// Stone images from Supabase bucket
const STONE_IMAGES = {
  gray: "https://ecmtctwovkheohqwahvt.supabase.co/storage/v1/object/public/slike/kamen_siv.webp",
  yellow: "https://ecmtctwovkheohqwahvt.supabase.co/storage/v1/object/public/slike/kamen_rumen.webp",
  red: "https://ecmtctwovkheohqwahvt.supabase.co/storage/v1/object/public/slike/kamen_rdec.webp",
  green: "https://ecmtctwovkheohqwahvt.supabase.co/storage/v1/object/public/slike/kamen_zelen.webp",
};

// Dragon images
const DRAGON_RIGHT = "https://ecmtctwovkheohqwahvt.supabase.co/storage/v1/object/public/zmajcki/Zmajcek_4.png";
const DRAGON_LEFT = "https://ecmtctwovkheohqwahvt.supabase.co/storage/v1/object/public/zmajcki/Zmajcek_4_1.PNG";

// Stone positions in zigzag grid (x: column 0-4, y: row 0-5 from bottom)
type StoneType = 'gray' | 'yellow' | 'red' | 'green';
interface StonePosition {
  x: number;
  y: number;
  type: StoneType;
  isRest: boolean;
  sentenceIndex?: number;
  wordIndex?: number;
}

// Build the zigzag path: 18 positions total
const STONE_POSITIONS: StonePosition[] = [
  // Row 0: START (gray)
  { x: 0, y: 0, type: 'gray', isRest: false },
  
  // Row 1: Sentence 1 - moving RIGHT (yellow, red, green, gray rest)
  { x: 0, y: 1, type: 'yellow', isRest: false, sentenceIndex: 0, wordIndex: 0 },
  { x: 1, y: 1, type: 'red', isRest: false, sentenceIndex: 0, wordIndex: 1 },
  { x: 2, y: 1, type: 'green', isRest: false, sentenceIndex: 0, wordIndex: 2 },
  { x: 3, y: 1, type: 'gray', isRest: true, sentenceIndex: 0 },
  
  // Row 2: Sentence 2 - moving LEFT (start from right, gray rest on left)
  { x: 3, y: 2, type: 'yellow', isRest: false, sentenceIndex: 1, wordIndex: 0 },
  { x: 2, y: 2, type: 'red', isRest: false, sentenceIndex: 1, wordIndex: 1 },
  { x: 1, y: 2, type: 'green', isRest: false, sentenceIndex: 1, wordIndex: 2 },
  { x: 0, y: 2, type: 'gray', isRest: true, sentenceIndex: 1 },
  
  // Row 3: Sentence 3 - moving RIGHT
  { x: 0, y: 3, type: 'yellow', isRest: false, sentenceIndex: 2, wordIndex: 0 },
  { x: 1, y: 3, type: 'red', isRest: false, sentenceIndex: 2, wordIndex: 1 },
  { x: 2, y: 3, type: 'green', isRest: false, sentenceIndex: 2, wordIndex: 2 },
  { x: 3, y: 3, type: 'gray', isRest: true, sentenceIndex: 2 },
  
  // Row 4: Sentence 4 - moving LEFT
  { x: 3, y: 4, type: 'yellow', isRest: false, sentenceIndex: 3, wordIndex: 0 },
  { x: 2, y: 4, type: 'red', isRest: false, sentenceIndex: 3, wordIndex: 1 },
  { x: 1, y: 4, type: 'green', isRest: false, sentenceIndex: 3, wordIndex: 2 },
  { x: 0, y: 4, type: 'gray', isRest: true, sentenceIndex: 3 },
  
  // Row 5: GOAL (gray)
  { x: 0, y: 5, type: 'gray', isRest: false },
];

export function PonoviPovedGame({ config }: PonoviPovedGameProps) {
  const navigate = useNavigate();
  const { selectedChild } = useAuth();
  const audioRef = useRef<HTMLAudioElement>(null);
  const completionCalledRef = useRef(false);
  
  // Game state
  const [phase, setPhase] = useState<GamePhase>("start");
  const [dragonPosition, setDragonPosition] = useState(0);
  const [isJumping, setIsJumping] = useState(false);
  const [showSuccessDialog, setShowSuccessDialog] = useState(false);
  const [showExitDialog, setShowExitDialog] = useState(false);
  const [showInstructions, setShowInstructions] = useState(false);
  const [showSentenceDialog, setShowSentenceDialog] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [countdown, setCountdown] = useState(3);
  const [collectedWords, setCollectedWords] = useState<SentenceWord[]>([]);
  const [startTime] = useState(Date.now());

  // Get current stone info
  const currentStone = STONE_POSITIONS[dragonPosition];
  const currentSentenceIndex = currentStone?.sentenceIndex ?? 0;
  const currentWordIndex = currentStone?.wordIndex ?? 0;
  const currentSentence = config.sentences[currentSentenceIndex];
  const currentWord = currentSentence?.words[currentWordIndex];

  // Determine dragon image based on position and direction
  const getDragonImage = useCallback(() => {
    const stone = STONE_POSITIONS[dragonPosition];
    if (!stone) return DRAGON_RIGHT;
    
    const row = stone.y;
    
    // Start position - facing right
    if (dragonPosition === 0) return DRAGON_RIGHT;
    
    // Goal position - facing right (finished)
    if (dragonPosition === STONE_POSITIONS.length - 1) return DRAGON_RIGHT;
    
    // Row 1 and 3: moving RIGHT -> dragon faces right
    // Row 2 and 4: moving LEFT -> dragon faces left
    // When on rest positions: look towards next direction
    
    if (stone.isRest) {
      // On rest (gray) stones, look in opposite direction (ready for next row)
      if (row === 1 || row === 3) {
        return DRAGON_LEFT; // Was moving right, now looks left for next row
      } else {
        return DRAGON_RIGHT; // Was moving left, now looks right for next row
      }
    }
    
    // During movement in row
    if (row === 1 || row === 3) {
      return DRAGON_RIGHT; // Moving right
    } else {
      return DRAGON_LEFT; // Moving left
    }
  }, [dragonPosition]);

  // Play audio helper
  const playAudio = useCallback(async (audioFile: string) => {
    if (audioRef.current) {
      try {
        audioRef.current.src = getAudioUrl(audioFile);
        await audioRef.current.play();
      } catch (error) {
        console.error("Error playing audio:", error);
      }
    }
  }, []);

  // Play sentence audio (all 3 words sequentially)
  const playSentenceAudio = useCallback(async () => {
    const sentence = config.sentences[currentSentenceIndex];
    if (!sentence) return;
    
    // Try to play full sentence audio first
    try {
      if (audioRef.current) {
        audioRef.current.src = getAudioUrl(sentence.audio);
        await audioRef.current.play();
        return;
      }
    } catch (error) {
      console.log("Full sentence audio not found, playing individual words");
    }
    
    // Fallback: play individual words with delays
    for (let i = 0; i < sentence.words.length; i++) {
      await playAudio(sentence.words[i].audio);
      if (i < sentence.words.length - 1) {
        await new Promise(resolve => setTimeout(resolve, 500));
      }
    }
  }, [currentSentenceIndex, config.sentences, playAudio]);

  // Handle repeat button in sentence dialog
  const handleRepeat = useCallback(() => {
    setIsRecording(true);
    setCountdown(3);
    
    const interval = setInterval(() => {
      setCountdown(prev => {
        if (prev <= 1) {
          clearInterval(interval);
          setIsRecording(false);
          return 3;
        }
        return prev - 1;
      });
    }, 1000);
  }, []);

  // Handle continue from sentence dialog
  const handleContinueFromDialog = useCallback(() => {
    setShowSentenceDialog(false);
    setCollectedWords([]);
    
    // Check if this was the last sentence
    if (dragonPosition === STONE_POSITIONS.length - 2) {
      // Move to goal
      setIsJumping(true);
      setDragonPosition(STONE_POSITIONS.length - 1);
      
      setTimeout(async () => {
        setIsJumping(false);
        setPhase("complete");
        
        if (!completionCalledRef.current) {
          completionCalledRef.current = true;
          await recordProgress();
          setShowSuccessDialog(true);
        }
      }, 600);
    }
  }, [dragonPosition]);

  // Handle next/jump button click
  const handleNext = useCallback(async () => {
    if (isJumping || showSentenceDialog) return;
    
    setIsJumping(true);
    const nextPosition = dragonPosition + 1;
    
    if (nextPosition >= STONE_POSITIONS.length) {
      setIsJumping(false);
      return;
    }
    
    const nextStone = STONE_POSITIONS[nextPosition];
    setDragonPosition(nextPosition);
    
    setTimeout(async () => {
      setIsJumping(false);
      
      if (nextStone.isRest) {
        // Landed on rest stone - show sentence dialog
        setPhase("sentence");
        setShowSentenceDialog(true);
        await playSentenceAudio();
      } else if (nextStone.wordIndex !== undefined) {
        // Landed on word stone
        setPhase("word");
        const word = config.sentences[nextStone.sentenceIndex!].words[nextStone.wordIndex];
        
        // Add to collected words
        setCollectedWords(prev => [...prev, word]);
        
        // Play word audio
        await playAudio(word.audio);
      } else if (nextPosition === STONE_POSITIONS.length - 1) {
        // Reached goal
        setPhase("complete");
        
        if (!completionCalledRef.current) {
          completionCalledRef.current = true;
          await recordProgress();
          setShowSuccessDialog(true);
        }
      }
    }, 600);
  }, [dragonPosition, isJumping, showSentenceDialog, config.sentences, playAudio, playSentenceAudio]);

  // Record progress to database
  const recordProgress = async () => {
    if (!selectedChild) return;
    
    const duration = Math.floor((Date.now() - startTime) / 1000);
    
    try {
      const { error } = await supabase.from("progress").insert({
        child_id: selectedChild.id,
        exercise_id: "00000000-0000-0000-0000-000000000001",
        score: 100,
        correct_answers: 4,
        total_questions: 4,
        duration: duration,
        activity_type: "exercise",
        activity_subtype: `ponovi-poved-${config.letter}`,
        stars_earned: 1,
        session_metadata: {
          letter: config.letter,
          sentences_completed: 4
        }
      });
      
      if (error) {
        console.error("Error recording progress:", error);
      }
    } catch (error) {
      console.error("Error recording progress:", error);
    }
  };

  // Reset game
  const handleReset = () => {
    setPhase("start");
    setDragonPosition(0);
    setIsJumping(false);
    setShowSuccessDialog(false);
    setShowSentenceDialog(false);
    setCollectedWords([]);
    setIsRecording(false);
    setCountdown(3);
    completionCalledRef.current = false;
  };

  // Calculate pixel positions for stones
  const getStonePixelPosition = (index: number) => {
    const stone = STONE_POSITIONS[index];
    const stoneSize = 64;
    const gapX = 80;
    const gapY = 70;
    const offsetX = 40;
    const offsetY = 40;
    
    return {
      left: offsetX + stone.x * gapX,
      bottom: offsetY + stone.y * gapY,
    };
  };

  // Get dragon pixel position
  const getDragonPixelPosition = () => {
    const pos = getStonePixelPosition(dragonPosition);
    return {
      left: pos.left,
      bottom: pos.bottom + 50, // Dragon sits above the stone
    };
  };

  const dragonPos = getDragonPixelPosition();

  return (
    <div className="min-h-screen bg-gradient-to-b from-sky-200 to-sky-100 flex flex-col">
      {/* Audio element */}
      <audio ref={audioRef} />
      
      {/* Header */}
      <div className="bg-dragon-green text-white py-3 px-4 shadow-md">
        <h1 className="text-xl font-bold text-center">
          Ponovi poved - Črka {config.displayLetter}
        </h1>
      </div>
      
      {/* Main game area - Stone grid */}
      <div className="flex-1 relative overflow-hidden" style={{ minHeight: '500px' }}>
        {/* Stones grid */}
        <div className="absolute inset-0">
          {STONE_POSITIONS.map((stone, index) => {
            const pos = getStonePixelPosition(index);
            const isStart = index === 0;
            const isGoal = index === STONE_POSITIONS.length - 1;
            const isActive = dragonPosition === index;
            
            return (
              <motion.div
                key={index}
                className="absolute flex flex-col items-center"
                style={{
                  left: pos.left,
                  bottom: pos.bottom,
                  width: 64,
                  height: 48,
                }}
                animate={isActive ? { scale: [1, 1.1, 1] } : { scale: 1 }}
                transition={{ duration: 0.5, repeat: isActive ? Infinity : 0 }}
              >
                <img
                  src={STONE_IMAGES[stone.type]}
                  alt={`Kamen ${stone.type}`}
                  className="w-16 h-12 object-contain drop-shadow-lg"
                />
                {isStart && (
                  <span className="text-xs font-bold text-gray-600 mt-1">START</span>
                )}
                {isGoal && (
                  <span className="text-xs font-bold text-yellow-600 mt-1">CILJ 🏆</span>
                )}
              </motion.div>
            );
          })}
          
          {/* Dragon */}
          <motion.div
            className="absolute z-10"
            style={{ width: 70, height: 70 }}
            animate={{
              left: dragonPos.left - 3,
              bottom: dragonPos.bottom,
            }}
            transition={{
              duration: 0.6,
              ease: "easeInOut",
            }}
          >
            <motion.img
              src={getDragonImage()}
              alt="Zmajček"
              className="w-full h-full object-contain drop-shadow-xl"
              animate={isJumping ? { y: [0, -30, 0] } : { y: 0 }}
              transition={{ duration: 0.6, ease: "easeInOut" }}
            />
          </motion.div>
        </div>
      </div>
      
      {/* Bottom cards section */}
      <div className="bg-white border-t-2 border-gray-200 p-4">
        <div className="flex items-center gap-3 overflow-x-auto pb-2">
          {/* Dragon jump button */}
          <button
            onClick={handleNext}
            disabled={isJumping || phase === "complete" || showSentenceDialog}
            className={`flex-shrink-0 w-24 h-28 rounded-xl shadow-lg flex flex-col items-center justify-center transition-all
              ${isJumping || phase === "complete" || showSentenceDialog
                ? 'bg-gray-300 cursor-not-allowed'
                : 'bg-gradient-to-b from-green-400 to-green-600 hover:from-green-500 hover:to-green-700 hover:scale-105 active:scale-95'
              }`}
          >
            <img
              src={DRAGON_RIGHT}
              alt="Skok"
              className="w-16 h-16 object-contain"
            />
            <span className="text-white font-bold text-sm mt-1">SKOK</span>
          </button>
          
          {/* Collected word cards */}
          <AnimatePresence>
            {collectedWords.map((word, idx) => (
              <motion.div
                key={`${word.word}-${idx}`}
                initial={{ opacity: 0, scale: 0.5, x: -20 }}
                animate={{ opacity: 1, scale: 1, x: 0 }}
                exit={{ opacity: 0, scale: 0.5 }}
                className="flex-shrink-0 w-24 h-28 bg-white rounded-xl border-3 border-green-500 shadow-md flex flex-col items-center justify-center p-2"
                style={{ borderWidth: '3px' }}
              >
                <img
                  src={getImageUrl(word.image)}
                  alt={word.word}
                  className="w-14 h-14 object-contain"
                />
                <p className="text-sm font-bold text-gray-700 mt-1 text-center truncate w-full">
                  {word.word}
                </p>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      </div>
      
      {/* Floating menu button */}
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            className="fixed bottom-28 left-4 z-50 h-12 w-12 rounded-full bg-app-orange hover:bg-app-orange/90 shadow-lg"
            size="icon"
          >
            <Home className="h-5 w-5 text-white" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="start" className="w-48">
          <DropdownMenuItem onClick={() => setShowExitDialog(true)}>
            <span className="mr-2">🏠</span> Nazaj
          </DropdownMenuItem>
          <DropdownMenuItem onClick={handleReset}>
            <span className="mr-2">🔄</span> Nova igra
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => setShowInstructions(true)}>
            <span className="mr-2">📖</span> Navodila
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
      
      {/* Sentence dialog */}
      <Dialog open={showSentenceDialog} onOpenChange={() => {}}>
        <DialogContent className="sm:max-w-md" onInteractOutside={(e) => e.preventDefault()}>
          <DialogTitle className="sr-only">Ponovi poved</DialogTitle>
          <div className="flex flex-col items-center p-4">
            {/* Word images */}
            <div className="flex gap-4 justify-center mb-4">
              {currentSentence?.words.map((word, idx) => (
                <div key={idx} className="flex flex-col items-center">
                  <div className="w-20 h-20 bg-white rounded-xl border-2 border-gray-200 shadow-sm flex items-center justify-center p-2">
                    <img
                      src={getImageUrl(word.image)}
                      alt={word.word}
                      className="w-full h-full object-contain"
                    />
                  </div>
                  <p className="text-sm font-semibold text-gray-700 mt-1">{word.word}</p>
                </div>
              ))}
            </div>
            
            {/* Full sentence text */}
            <p className="text-xl font-bold text-dragon-green text-center mb-6">
              "{currentSentence?.fullSentence}"
            </p>
            
            {/* Repeat button with countdown */}
            <Button
              onClick={handleRepeat}
              disabled={isRecording}
              className="w-full mb-3 bg-app-orange hover:bg-app-orange/90 text-white font-bold py-3"
            >
              <Volume2 className="w-5 h-5 mr-2" />
              {isRecording ? `SNEMAM... ${countdown}` : 'PONOVI'}
            </Button>
            
            {/* Continue button */}
            <Button
              onClick={handleContinueFromDialog}
              variant="outline"
              className="w-full border-2 border-dragon-green text-dragon-green hover:bg-dragon-green hover:text-white font-bold py-3"
            >
              NAPREJ
            </Button>
          </div>
        </DialogContent>
      </Dialog>
      
      {/* Exit confirmation dialog */}
      <AlertDialog open={showExitDialog} onOpenChange={setShowExitDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Opozorilo</AlertDialogTitle>
            <AlertDialogDescription>
              Ali res želiš zapustiti igro? Tvoj napredek ne bo shranjen.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="bg-red-500 text-white hover:bg-red-600">Ne</AlertDialogCancel>
            <AlertDialogAction
              className="bg-dragon-green text-white hover:bg-dragon-green/90"
              onClick={() => navigate("/govorne-igre/ponovi-poved")}
            >
              Da
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
      
      {/* Instructions dialog */}
      <AlertDialog open={showInstructions} onOpenChange={setShowInstructions}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Navodila</AlertDialogTitle>
            <AlertDialogDescription className="text-left space-y-2">
              <p>🐉 Zmajček skače po barvnih kamnih.</p>
              <p>🟡 Na rumenem kamnu izgovori prvo besedo.</p>
              <p>🔴 Na rdečem kamnu izgovori drugo besedo.</p>
              <p>🟢 Na zelenem kamnu izgovori tretjo besedo.</p>
              <p>⬜ Na sivem kamnu ponovi celo poved!</p>
              <p>🏆 Cilj je priti do vrha!</p>
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogAction className="bg-dragon-green text-white hover:bg-dragon-green/90">
              Razumem
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
      
      {/* Success dialog */}
      <AlertDialog open={showSuccessDialog} onOpenChange={setShowSuccessDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle className="text-center text-2xl">🎉 ČESTITKE! 🎉</AlertDialogTitle>
            <AlertDialogDescription className="text-center text-lg">
              Odlično si ponovil vse povedi! Zaslužil si zvezdico! ⭐
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className="flex-col gap-2 sm:flex-col">
            <AlertDialogAction
              className="w-full bg-dragon-green text-white hover:bg-dragon-green/90"
              onClick={handleReset}
            >
              🔄 Igraj znova
            </AlertDialogAction>
            <AlertDialogAction
              className="w-full bg-app-orange text-white hover:bg-app-orange/90"
              onClick={() => navigate("/govorne-igre/ponovi-poved")}
            >
              🏠 Nazaj na izbiro
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
