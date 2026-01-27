import { useState, useRef, useCallback, useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Home, Volume2, Mic } from "lucide-react";
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
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useIsMobile } from "@/hooks/use-mobile";

type GamePhase = "start" | "word" | "sentence" | "complete";

interface PonoviPovedGameProps {
  config: PonoviPovedConfig;
}

// Background from ozadja bucket
const BACKGROUND_URL = "https://ecmtctwovkheohqwahvt.supabase.co/storage/v1/object/public/ozadja/svetlomodro_ozadje.webp";

// NEW: Stone images with transparent backgrounds (-Photoroom.png)
const STONE_IMAGES = {
  gray: "https://ecmtctwovkheohqwahvt.supabase.co/storage/v1/object/public/slike/kamen_siv-Photoroom.png",
  yellow: "https://ecmtctwovkheohqwahvt.supabase.co/storage/v1/object/public/slike/kamen_rumen-Photoroom.png",
  red: "https://ecmtctwovkheohqwahvt.supabase.co/storage/v1/object/public/slike/kamen_rdec-Photoroom.png",
  green: "https://ecmtctwovkheohqwahvt.supabase.co/storage/v1/object/public/slike/kamen_zelen-Photoroom.png",
};

// Dragon images
const DRAGON_RIGHT = "https://ecmtctwovkheohqwahvt.supabase.co/storage/v1/object/public/zmajcki/Zmajcek_4.png";
const DRAGON_LEFT = "https://ecmtctwovkheohqwahvt.supabase.co/storage/v1/object/public/zmajcki/Zmajcek_4_1.png";
const DRAGON_JUMP_BUTTON = "https://ecmtctwovkheohqwahvt.supabase.co/storage/v1/object/public/zmajcki/Zmajcek_111.png";

// Stone positions in zigzag grid (x: column 0-3, y: row 0-4 from bottom)
// 17 stones total: START + 4 sentences (4 stones each) - NO extra top goal stone
type StoneType = 'gray' | 'yellow' | 'red' | 'green';
interface StonePosition {
  x: number;
  y: number;
  type: StoneType;
  isRest: boolean;
  sentenceIndex?: number;
  wordIndex?: number;
}

// Build the zigzag path: 17 positions total (removed extra top stone)
const STONE_POSITIONS: StonePosition[] = [
  // Row 0: START (gray)
  { x: 0, y: 0, type: 'gray', isRest: false },
  
  // Row 1: Sentence 1 - moving RIGHT (green, red, yellow, gray rest)
  { x: 0, y: 1, type: 'green', isRest: false, sentenceIndex: 0, wordIndex: 0 },
  { x: 1, y: 1, type: 'red', isRest: false, sentenceIndex: 0, wordIndex: 1 },
  { x: 2, y: 1, type: 'yellow', isRest: false, sentenceIndex: 0, wordIndex: 2 },
  { x: 3, y: 1, type: 'gray', isRest: true, sentenceIndex: 0 },
  
  // Row 2: Sentence 2 - moving LEFT (start from right, gray rest on left)
  { x: 3, y: 2, type: 'yellow', isRest: false, sentenceIndex: 1, wordIndex: 0 },
  { x: 2, y: 2, type: 'red', isRest: false, sentenceIndex: 1, wordIndex: 1 },
  { x: 1, y: 2, type: 'green', isRest: false, sentenceIndex: 1, wordIndex: 2 },
  { x: 0, y: 2, type: 'gray', isRest: true, sentenceIndex: 1 },
  
  // Row 3: Sentence 3 - moving RIGHT
  { x: 0, y: 3, type: 'green', isRest: false, sentenceIndex: 2, wordIndex: 0 },
  { x: 1, y: 3, type: 'red', isRest: false, sentenceIndex: 2, wordIndex: 1 },
  { x: 2, y: 3, type: 'yellow', isRest: false, sentenceIndex: 2, wordIndex: 2 },
  { x: 3, y: 3, type: 'gray', isRest: true, sentenceIndex: 2 },
  
  // Row 4: Sentence 4 - moving LEFT - GOAL is on last gray stone
  { x: 3, y: 4, type: 'yellow', isRest: false, sentenceIndex: 3, wordIndex: 0 },
  { x: 2, y: 4, type: 'red', isRest: false, sentenceIndex: 3, wordIndex: 1 },
  { x: 1, y: 4, type: 'green', isRest: false, sentenceIndex: 3, wordIndex: 2 },
  { x: 0, y: 4, type: 'gray', isRest: true, sentenceIndex: 3 },  // GOAL
];

export function PonoviPovedGame({ config }: PonoviPovedGameProps) {
  const navigate = useNavigate();
  const { selectedChild } = useAuth();
  const audioRef = useRef<HTMLAudioElement>(null);
  const completionCalledRef = useRef(false);
  const isMobile = useIsMobile();
  
  // Dynamic window size measurement (like MemoryGrid)
  const [containerSize, setContainerSize] = useState({ width: 0, height: 0 });
  
  useEffect(() => {
    const updateSize = () => {
      setContainerSize({
        width: window.innerWidth,
        height: window.innerHeight - 160 // Space for bottom controls
      });
    };
    
    const handleOrientationChange = () => setTimeout(updateSize, 100);
    
    updateSize();
    window.addEventListener('resize', updateSize);
    window.addEventListener('orientationchange', handleOrientationChange);
    
    return () => {
      window.removeEventListener('resize', updateSize);
      window.removeEventListener('orientationchange', handleOrientationChange);
    };
  }, []);
  
  // Calculate dynamic sizes based on screen (like MemoryGrid)
  const calculatedSizes = useMemo(() => {
    if (containerSize.width === 0 || containerSize.height === 0) {
      return null;
    }
    
    const columns = 4; // 4 columns for stones
    const rows = 5;    // 5 rows (START + 4 sentences)
    
    const PADDING = isMobile ? 40 : 80;
    
    const availableWidth = containerSize.width - PADDING;
    const availableHeight = containerSize.height - PADDING;
    
    // Calculate stone size based on available space
    const sizeByWidth = Math.floor(availableWidth / columns / 1.3);
    const sizeByHeight = Math.floor(availableHeight / rows / 1.35);
    
    const stoneWidth = Math.min(sizeByWidth, sizeByHeight, isMobile ? 90 : 140);
    const stoneHeight = Math.floor(stoneWidth * 0.75);
    const gapX = Math.floor(stoneWidth * 1.25);
    const gapY = Math.floor(stoneHeight * 1.35);
    const dragonSize = Math.floor(stoneWidth * 0.9);
    const offsetX = Math.floor((containerSize.width - (columns - 1) * gapX - stoneWidth) / 2);
    const offsetY = Math.floor(stoneHeight * 0.5);
    
    return {
      stoneWidth,
      stoneHeight,
      gapX,
      gapY,
      dragonSize,
      offsetX,
      offsetY,
    };
  }, [containerSize, isMobile]);
  
  // Use calculated sizes or fallback
  const stoneWidth = calculatedSizes?.stoneWidth ?? (isMobile ? 80 : 120);
  const stoneHeight = calculatedSizes?.stoneHeight ?? (isMobile ? 60 : 90);
  const gapX = calculatedSizes?.gapX ?? (isMobile ? 90 : 140);
  const gapY = calculatedSizes?.gapY ?? (isMobile ? 75 : 100);
  const dragonSize = calculatedSizes?.dragonSize ?? (isMobile ? 80 : 110);
  const offsetX = calculatedSizes?.offsetX ?? (isMobile ? 30 : 60);
  const offsetY = calculatedSizes?.offsetY ?? (isMobile ? 40 : 60);
  
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
    
    // Check if this was the last sentence (position 16 is the goal)
    if (dragonPosition === STONE_POSITIONS.length - 1) {
      setPhase("complete");
      
      if (!completionCalledRef.current) {
        completionCalledRef.current = true;
        recordProgress().then(() => {
          setShowSuccessDialog(true);
        });
      }
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
    
    return {
      left: offsetX + stone.x * gapX,
      bottom: offsetY + stone.y * gapY,
    };
  };

  // Get dragon pixel position - sits ON the stone (not floating)
  const getDragonPixelPosition = () => {
    const pos = getStonePixelPosition(dragonPosition);
    return {
      left: pos.left + stoneWidth / 2 - dragonSize / 2,
      bottom: pos.bottom + stoneHeight * 0.6, // Dragon sits on top of the stone
    };
  };

  const dragonPos = getDragonPixelPosition();

  // Don't render until we have proper dimensions
  if (!calculatedSizes) {
    return (
      <div 
        className="min-h-screen w-full fixed inset-0 flex items-center justify-center"
        style={{
          backgroundImage: `url(${BACKGROUND_URL})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        <div className="animate-pulse text-white text-xl font-bold">Nalaganje...</div>
      </div>
    );
  }

  return (
    <div 
      className="min-h-screen w-full fixed inset-0 flex flex-col"
      style={{
        backgroundImage: `url(${BACKGROUND_URL})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
      }}
    >
      {/* Audio element */}
      <audio ref={audioRef} />
      
      {/* Main game area - Stone grid */}
      <div className="flex-1 relative overflow-hidden">
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
                  width: stoneWidth,
                  height: stoneHeight,
                }}
                animate={isActive ? { scale: [1, 1.05, 1] } : { scale: 1 }}
                transition={{ duration: 0.8, repeat: isActive ? Infinity : 0 }}
              >
                <img
                  src={STONE_IMAGES[stone.type]}
                  alt={`Kamen ${stone.type}`}
                  className="w-full h-full object-contain drop-shadow-lg"
                />
                {isStart && (
                  <span className="absolute -bottom-5 text-xs md:text-sm font-bold text-gray-700 bg-white/80 px-2 py-0.5 rounded shadow">
                    START
                  </span>
                )}
                {isGoal && (
                  <span className="absolute -bottom-5 text-xs md:text-sm font-bold text-yellow-700 bg-white/80 px-2 py-0.5 rounded shadow">
                    CILJ
                  </span>
                )}
              </motion.div>
            );
          })}
          
          {/* Dragon */}
          <motion.div
            className="absolute z-10"
            style={{ width: dragonSize, height: dragonSize }}
            animate={{
              left: dragonPos.left,
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
              animate={isJumping ? { y: [0, -40, 0] } : { y: 0 }}
              transition={{ duration: 0.6, ease: "easeInOut" }}
            />
          </motion.div>
        </div>
      </div>
      
      {/* Bottom controls - fixed */}
      <div className="fixed bottom-0 left-0 right-0 p-3 md:p-4 flex items-end justify-between z-20">
        {/* Left: Home menu button - ROUNDED FULL */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              className="h-12 w-12 md:h-14 md:w-14 rounded-full bg-app-orange hover:bg-app-orange/90 shadow-lg flex-shrink-0"
              size="icon"
            >
              <Home className="h-6 w-6 md:h-7 md:w-7 text-white" />
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
        
        {/* Center: Collected word cards */}
        <div className="flex-1 flex justify-center gap-2 md:gap-3 mx-3 md:mx-4">
          <AnimatePresence>
            {collectedWords.map((word, idx) => (
              <motion.div
                key={`${word.word}-${idx}`}
                initial={{ opacity: 0, scale: 0.5, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.5 }}
                className="flex-shrink-0 w-20 h-24 md:w-24 md:h-28 bg-white rounded-xl border-2 border-dragon-green shadow-lg flex flex-col items-center justify-center p-2"
              >
                <img
                  src={getImageUrl(word.image)}
                  alt={word.word}
                  className="w-12 h-12 md:w-14 md:h-14 object-contain"
                />
                <p className="text-xs md:text-sm font-bold text-gray-700 mt-1 text-center truncate w-full uppercase">
                  {word.word}
                </p>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
        
        {/* Right: Jump button on blue background with Zmajcek_111.png */}
        <div className="bg-sky-400 rounded-xl p-2 md:p-3 shadow-lg flex-shrink-0">
          <button
            onClick={handleNext}
            disabled={isJumping || phase === "complete" || showSentenceDialog}
            className={`w-20 h-24 md:w-24 md:h-28 rounded-xl flex flex-col items-center justify-center transition-all
              ${isJumping || phase === "complete" || showSentenceDialog
                ? 'bg-gray-400 cursor-not-allowed'
                : 'bg-gradient-to-b from-green-400 to-green-600 hover:from-green-500 hover:to-green-700 active:scale-95'
              }`}
          >
            <img
              src={DRAGON_JUMP_BUTTON}
              alt="Skok"
              className="w-14 h-14 md:w-18 md:h-18 object-contain"
            />
            <span className="text-white font-bold text-xs md:text-sm mt-1">SKOK</span>
          </button>
        </div>
      </div>
      
      {/* Sentence dialog - styled like Smešne Povedi */}
      <Dialog open={showSentenceDialog} onOpenChange={() => {}}>
        <DialogContent className="sm:max-w-lg" onInteractOutside={(e) => e.preventDefault()}>
          <DialogHeader>
            <DialogTitle className="font-bold text-dragon-green text-center text-lg md:text-2xl uppercase">
              ODLIČNO!
            </DialogTitle>
          </DialogHeader>
          
          <div className="space-y-3 md:space-y-4 py-2 md:py-4">
            <p className="text-black text-center uppercase text-xs md:text-sm font-medium">
              POSLUŠAJ IN PONOVI POVED
            </p>
            
            {/* Three word images in a row */}
            <div className="flex justify-center gap-3 md:gap-4">
              {currentSentence?.words.map((word, idx) => (
                <div key={idx} className="flex flex-col items-center space-y-1 md:space-y-2">
                  <div className="w-16 h-16 md:w-20 md:h-20 rounded-xl overflow-hidden border-2 border-dragon-green bg-gray-50">
                    <img
                      src={getImageUrl(word.image)}
                      alt={word.word}
                      className="w-full h-full object-contain"
                    />
                  </div>
                  <span className="font-medium text-center text-xs md:text-sm text-black uppercase">
                    {word.word.toUpperCase()}
                  </span>
                </div>
              ))}
            </div>
            
            {/* Full sentence text */}
            <p className="text-base md:text-lg font-semibold text-gray-800 text-center uppercase">
              "{currentSentence?.fullSentence.toUpperCase()}"
            </p>
            
            {/* Action buttons */}
            <div className="flex justify-center gap-2 md:gap-3 pt-2 flex-wrap">
              <Button
                onClick={playSentenceAudio}
                className="bg-dragon-green hover:bg-dragon-green/90 text-white gap-2 uppercase font-medium h-10 w-28 md:w-32"
              >
                <Volume2 className="w-4 h-4" />
                PREDVAJAJ
              </Button>
              
              <Button
                onClick={handleRepeat}
                disabled={isRecording}
                className="relative bg-app-orange hover:bg-app-orange/90 text-white gap-2 uppercase font-medium h-10 w-28 md:w-32"
              >
                <Mic className="w-4 h-4" />
                {isRecording ? "..." : "PONOVI"}
                {isRecording && (
                  <span className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 text-white text-xs font-bold rounded-full flex items-center justify-center animate-pulse">
                    {countdown}
                  </span>
                )}
              </Button>
              
              <Button 
                onClick={handleContinueFromDialog} 
                variant="outline" 
                className="uppercase h-10 w-28 md:w-32 border-2 border-dragon-green text-dragon-green hover:bg-dragon-green hover:text-white"
              >
                NAPREJ
              </Button>
            </div>
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
              <p>🟢 Na zelenem kamnu izgovori prvo besedo.</p>
              <p>🔴 Na rdečem kamnu izgovori drugo besedo.</p>
              <p>🟡 Na rumenem kamnu izgovori tretjo besedo.</p>
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
