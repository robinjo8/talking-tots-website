import { useState, useRef, useCallback, useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Home, Volume2, Mic, ArrowUp } from "lucide-react";
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

// Stone images with transparent backgrounds
const STONE_IMAGES = {
  gray: "https://ecmtctwovkheohqwahvt.supabase.co/storage/v1/object/public/slike/kamen_siv-Photoroom.png",
  yellow: "https://ecmtctwovkheohqwahvt.supabase.co/storage/v1/object/public/slike/kamen_rumen-Photoroom.png",
  red: "https://ecmtctwovkheohqwahvt.supabase.co/storage/v1/object/public/slike/kamen_rdec-Photoroom.png",
  green: "https://ecmtctwovkheohqwahvt.supabase.co/storage/v1/object/public/slike/kamen_zelen-Photoroom.png",
};

// Dragon images - right and left facing
const DRAGON_RIGHT = "https://ecmtctwovkheohqwahvt.supabase.co/storage/v1/object/public/zmajcki/Zmajcek_4.webp";
const DRAGON_LEFT = "https://ecmtctwovkheohqwahvt.supabase.co/storage/v1/object/public/zmajcki/Zmajcek_4_1.png";

// Stone positions in grid
type StoneType = 'gray' | 'yellow' | 'red' | 'green';
interface StonePosition {
  x: number;
  y: number;
  type: StoneType;
  isRest: boolean;
  sentenceIndex?: number;
  wordIndex?: number;
}

// ============================================================================
// DESKTOP: Rectangular path with 7 stones on top/bottom rows, 2 in middle
// 
//      [RUM] [ZEL] [SIV] [RDEC] [RUM] [ZEL] [SIV]  ← top row (7 stones, y=2)
//        ↑                                     ↓
//                 +-- WORD CARDS --+  [BTN]
//      [RDEC]     |               |          [RDEC] ← middle row (2 stones, y=1)
//                 +---------------+
//        ↑                                     ↓
//   🐉 [SIV] [ZEL] [RUM] [RDEC] [SIV] [ZEL] [RUM]  ← bottom row (7 stones, y=0)
//      START/GOAL                            
// ============================================================================
const STONE_POSITIONS_DESKTOP: StonePosition[] = [
  // START - bottom left gray stone (x=0, y=0)
  { x: 0, y: 0, type: 'gray', isRest: false },
  
  // Sentence 1: UP (x=0,y=1), UP (x=0,y=2), RIGHT (x=1,y=2), GRAY (x=2,y=2)
  { x: 0, y: 1, type: 'red', isRest: false, sentenceIndex: 0, wordIndex: 0 },    // 1st word
  { x: 0, y: 2, type: 'yellow', isRest: false, sentenceIndex: 0, wordIndex: 1 }, // 2nd word
  { x: 1, y: 2, type: 'green', isRest: false, sentenceIndex: 0, wordIndex: 2 },  // 3rd word
  { x: 2, y: 2, type: 'gray', isRest: true, sentenceIndex: 0 },                  // Repeat sentence 1
  
  // Sentence 2: 3x RIGHT + GRAY
  { x: 3, y: 2, type: 'red', isRest: false, sentenceIndex: 1, wordIndex: 0 },
  { x: 4, y: 2, type: 'yellow', isRest: false, sentenceIndex: 1, wordIndex: 1 },
  { x: 5, y: 2, type: 'green', isRest: false, sentenceIndex: 1, wordIndex: 2 },
  { x: 6, y: 2, type: 'gray', isRest: true, sentenceIndex: 1 },                  // Repeat sentence 2
  
  // Sentence 3: DOWN (x=6,y=1), DOWN (x=6,y=0), LEFT (x=5,y=0), GRAY (x=4,y=0)
  { x: 6, y: 1, type: 'red', isRest: false, sentenceIndex: 2, wordIndex: 0 },
  { x: 6, y: 0, type: 'yellow', isRest: false, sentenceIndex: 2, wordIndex: 1 },
  { x: 5, y: 0, type: 'green', isRest: false, sentenceIndex: 2, wordIndex: 2 },
  { x: 4, y: 0, type: 'gray', isRest: true, sentenceIndex: 2 },                  // Repeat sentence 3
  
  // Sentence 4: 3x LEFT back to START
  { x: 3, y: 0, type: 'red', isRest: false, sentenceIndex: 3, wordIndex: 0 },
  { x: 2, y: 0, type: 'yellow', isRest: false, sentenceIndex: 3, wordIndex: 1 },
  { x: 1, y: 0, type: 'green', isRest: false, sentenceIndex: 3, wordIndex: 2 },
  // Dragon returns to START (0,0) for final repeat of sentence 4
];

// MOBILE: Keep original zigzag path
const STONE_POSITIONS_MOBILE: StonePosition[] = [
  // Row 1: START (gray)
  { x: 0, y: 0, type: 'gray', isRest: false },
  
  // Row 1: Sentence 1 - moving RIGHT
  { x: 1, y: 0, type: 'green', isRest: false, sentenceIndex: 0, wordIndex: 0 },
  { x: 2, y: 0, type: 'red', isRest: false, sentenceIndex: 0, wordIndex: 1 },
  { x: 3, y: 0, type: 'yellow', isRest: false, sentenceIndex: 0, wordIndex: 2 },
  { x: 3, y: 1, type: 'gray', isRest: true, sentenceIndex: 0 },
  
  // Row 2: Sentence 2 - moving LEFT
  { x: 2, y: 1, type: 'green', isRest: false, sentenceIndex: 1, wordIndex: 0 },
  { x: 1, y: 1, type: 'red', isRest: false, sentenceIndex: 1, wordIndex: 1 },
  { x: 0, y: 1, type: 'yellow', isRest: false, sentenceIndex: 1, wordIndex: 2 },
  { x: 0, y: 2, type: 'gray', isRest: true, sentenceIndex: 1 },
  
  // Row 3: Sentence 3 - moving RIGHT
  { x: 1, y: 2, type: 'green', isRest: false, sentenceIndex: 2, wordIndex: 0 },
  { x: 2, y: 2, type: 'red', isRest: false, sentenceIndex: 2, wordIndex: 1 },
  { x: 3, y: 2, type: 'yellow', isRest: false, sentenceIndex: 2, wordIndex: 2 },
  { x: 3, y: 3, type: 'gray', isRest: true, sentenceIndex: 2 },
  
  // Row 4: Sentence 4 - moving LEFT - GOAL
  { x: 2, y: 3, type: 'green', isRest: false, sentenceIndex: 3, wordIndex: 0 },
  { x: 1, y: 3, type: 'red', isRest: false, sentenceIndex: 3, wordIndex: 1 },
  { x: 0, y: 3, type: 'yellow', isRest: false, sentenceIndex: 3, wordIndex: 2 },
  { x: 0, y: 4, type: 'gray', isRest: true, sentenceIndex: 3 },  // GOAL
];

// DiceDots helper component for 3D dice faces
function DiceDots({ count }: { count: number }) {
  const dotPositions: Record<number, string[]> = {
    1: ['center'],
    2: ['top-right', 'bottom-left'],
    3: ['top-right', 'center', 'bottom-left'],
    4: ['top-left', 'top-right', 'bottom-left', 'bottom-right'],
    5: ['top-left', 'top-right', 'center', 'bottom-left', 'bottom-right'],
    6: ['top-left', 'top-right', 'middle-left', 'middle-right', 'bottom-left', 'bottom-right'],
  };

  const getPositionClass = (pos: string) => {
    switch (pos) {
      case 'center': return 'top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2';
      case 'top-left': return 'top-2 left-2';
      case 'top-right': return 'top-2 right-2';
      case 'bottom-left': return 'bottom-2 left-2';
      case 'bottom-right': return 'bottom-2 right-2';
      case 'middle-left': return 'top-1/2 left-2 -translate-y-1/2';
      case 'middle-right': return 'top-1/2 right-2 -translate-y-1/2';
      default: return '';
    }
  };

  return (
    <>
      {dotPositions[count]?.map((pos, i) => (
        <div
          key={i}
          className={`absolute w-3 h-3 rounded-full bg-gray-800 ${getPositionClass(pos)}`}
        />
      ))}
    </>
  );
}

// JumpDice component - 3D dice with arrow icon
function JumpDice({ onClick, disabled, size = 96 }: { onClick: () => void; disabled: boolean; size?: number }) {
  const [isHovered, setIsHovered] = useState(false);
  
  const halfSize = size / 2;
  const dotSize = Math.max(8, size / 8);

  return (
    <div 
      className={`cursor-pointer ${disabled ? 'pointer-events-none opacity-50' : ''}`}
      style={{ perspective: '800px' }}
      onClick={disabled ? undefined : onClick}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* 3D Dice Container */}
      <div
        className={`relative transition-transform ${!disabled ? 'animate-pulse' : ''}`}
        style={{
          width: size,
          height: size,
          transformStyle: 'preserve-3d',
          transform: isHovered && !disabled ? 'rotateY(10deg) rotateX(-5deg)' : 'rotateY(0deg)',
          transitionDuration: '300ms',
        }}
      >
        {/* Face 1 - Front - with ARROW UP icon */}
        <div 
          className="absolute bg-white rounded-xl border-4 border-gray-300 shadow-lg flex items-center justify-center"
          style={{ 
            width: size, 
            height: size,
            transform: `translateZ(${halfSize}px)` 
          }}
        >
          <ArrowUp 
            className="text-dragon-green drop-shadow-md" 
            style={{ width: size * 0.5, height: size * 0.5 }}
            strokeWidth={3}
          />
        </div>
        
        {/* Face 6 - Back */}
        <div 
          className="absolute bg-white rounded-xl border-4 border-gray-300 shadow-lg"
          style={{ 
            width: size, 
            height: size,
            transform: `rotateY(180deg) translateZ(${halfSize}px)` 
          }}
        >
          <DiceDots count={6} />
        </div>
        
        {/* Face 2 - Right */}
        <div 
          className="absolute bg-white rounded-xl border-4 border-gray-300 shadow-lg"
          style={{ 
            width: size, 
            height: size,
            transform: `rotateY(90deg) translateZ(${halfSize}px)` 
          }}
        >
          <DiceDots count={2} />
        </div>
        
        {/* Face 5 - Left */}
        <div 
          className="absolute bg-white rounded-xl border-4 border-gray-300 shadow-lg"
          style={{ 
            width: size, 
            height: size,
            transform: `rotateY(-90deg) translateZ(${halfSize}px)` 
          }}
        >
          <DiceDots count={5} />
        </div>
        
        {/* Face 3 - Top */}
        <div 
          className="absolute bg-white rounded-xl border-4 border-gray-300 shadow-lg"
          style={{ 
            width: size, 
            height: size,
            transform: `rotateX(90deg) translateZ(${halfSize}px)` 
          }}
        >
          <DiceDots count={3} />
        </div>
        
        {/* Face 4 - Bottom */}
        <div 
          className="absolute bg-white rounded-xl border-4 border-gray-300 shadow-lg"
          style={{ 
            width: size, 
            height: size,
            transform: `rotateX(-90deg) translateZ(${halfSize}px)` 
          }}
        >
          <DiceDots count={4} />
        </div>
      </div>
    </div>
  );
}

export function PonoviPovedGame({ config }: PonoviPovedGameProps) {
  const navigate = useNavigate();
  const { selectedChild } = useAuth();
  const audioRef = useRef<HTMLAudioElement>(null);
  const completionCalledRef = useRef(false);
  const isMobile = useIsMobile();
  
  // Select positions based on device
  const STONE_POSITIONS = isMobile ? STONE_POSITIONS_MOBILE : STONE_POSITIONS_DESKTOP;
  
  // Dynamic window size measurement
  const [containerSize, setContainerSize] = useState({ width: 0, height: 0 });
  
  useEffect(() => {
    const updateSize = () => {
      setContainerSize({
        width: window.innerWidth,
        height: window.innerHeight
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
  
  // Calculate dynamic sizes based on screen
  const calculatedSizes = useMemo(() => {
    if (containerSize.width === 0 || containerSize.height === 0) {
      return null;
    }
    
    // DESKTOP: Rectangular path layout (7 columns x 3 rows) - SCALED 1.5x
    if (!isMobile) {
      // Base sizes scaled by 1.5
      const baseStoneWidth = 120;   // 80 * 1.5
      const baseStoneHeight = 90;   // 60 * 1.5
      const baseGapX = 142;         // 95 * 1.5
      const baseGapY = 180;         // 120 * 1.5
      const baseDragonSize = 128;   // 85 * 1.5
      
      // Calculate grid dimensions
      const gridWidth = 6 * baseGapX + baseStoneWidth;
      const gridHeight = 2 * baseGapY + baseStoneHeight;
      
      // Check if grid fits on screen, scale down if needed
      const availableWidth = containerSize.width - 40;
      const availableHeight = containerSize.height - 100;
      
      const scaleX = Math.min(1, availableWidth / gridWidth);
      const scaleY = Math.min(1, availableHeight / gridHeight);
      const scale = Math.min(scaleX, scaleY);
      
      const stoneWidth = Math.floor(baseStoneWidth * scale);
      const stoneHeight = Math.floor(baseStoneHeight * scale);
      const gapX = Math.floor(baseGapX * scale);
      const gapY = Math.floor(baseGapY * scale);
      const dragonSize = Math.floor(baseDragonSize * scale);
      
      // Recalculate with scaled values
      const scaledGridWidth = 6 * gapX + stoneWidth;
      const scaledGridHeight = 2 * gapY + stoneHeight;
      
      // Center horizontally and vertically
      const offsetX = (containerSize.width - scaledGridWidth) / 2;
      const offsetY = (containerSize.height - scaledGridHeight) / 2 - 40;
      
      return {
        stoneWidth,
        stoneHeight,
        gapX,
        gapY,
        dragonSize,
        offsetX: Math.max(offsetX, 20),
        offsetY: Math.max(offsetY, 40),
      };
    }
    
    // MOBILE: Keep smaller sizes
    const columns = 4;
    const rows = 5;
    const PADDING = 40;
    
    const availableWidth = containerSize.width - PADDING;
    const availableHeight = containerSize.height - PADDING - 200;
    
    const sizeByWidth = Math.floor(availableWidth / columns / 1.3);
    const sizeByHeight = Math.floor(availableHeight / rows / 1.35);
    
    const stoneWidth = Math.min(sizeByWidth, sizeByHeight, 90);
    const stoneHeight = Math.floor(stoneWidth * 0.75);
    const gapX = Math.floor(stoneWidth * 1.25);
    const gapY = Math.floor(stoneHeight * 1.35);
    const dragonSize = Math.floor(stoneWidth * 0.9);
    const offsetX = Math.floor((containerSize.width - (columns - 1) * gapX - stoneWidth) / 2);
    const offsetY = Math.floor(stoneHeight * 0.5) + 80;
    
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
  const stoneWidth = calculatedSizes?.stoneWidth ?? (isMobile ? 80 : 100);
  const stoneHeight = calculatedSizes?.stoneHeight ?? (isMobile ? 60 : 75);
  const gapX = calculatedSizes?.gapX ?? (isMobile ? 90 : 120);
  const gapY = calculatedSizes?.gapY ?? (isMobile ? 75 : 120);
  const dragonSize = calculatedSizes?.dragonSize ?? (isMobile ? 80 : 100);
  const offsetX = calculatedSizes?.offsetX ?? (isMobile ? 30 : 100);
  const offsetY = calculatedSizes?.offsetY ?? (isMobile ? 100 : 80);
  
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
  const [currentSentenceForDialog, setCurrentSentenceForDialog] = useState(0);

  // Get current stone info
  const currentStone = STONE_POSITIONS[dragonPosition];
  const currentSentenceIndex = currentStone?.sentenceIndex ?? 0;
  const currentSentence = config.sentences[currentSentenceIndex];

  // Determine dragon image based on position and direction (DESKTOP RECTANGULAR PATH)
  const getDragonImage = useCallback(() => {
    const stone = STONE_POSITIONS[dragonPosition];
    if (!stone) return DRAGON_RIGHT;
    
    // DESKTOP: Rectangular path logic with 7 columns
    if (!isMobile) {
      // Left side (x=0): moving UP → facing right
      if (stone.x === 0) return DRAGON_RIGHT;
      
      // Top row (y=2): first half moving right (x <= 3), second half (x >= 4) → facing left
      if (stone.y === 2 && stone.x <= 3) return DRAGON_RIGHT;
      if (stone.y === 2 && stone.x >= 4) return DRAGON_LEFT;
      
      // Right side (x=6): moving DOWN → facing left
      if (stone.x === 6) return DRAGON_LEFT;
      
      // Bottom row (y=0): moving LEFT → facing left (except START)
      if (stone.y === 0 && dragonPosition > 0) return DRAGON_LEFT;
      
      // Middle right (y=1, x=6): facing left
      if (stone.y === 1 && stone.x === 6) return DRAGON_LEFT;
      
      return DRAGON_RIGHT;
    }
    
    // MOBILE: Original zigzag logic
    const row = stone.y;
    
    if (dragonPosition === 0) return DRAGON_RIGHT;
    if (dragonPosition === STONE_POSITIONS.length - 1) return DRAGON_RIGHT;
    
    if (stone.isRest) {
      if (row === 0 || row === 2) {
        return DRAGON_LEFT;
      } else {
        return DRAGON_RIGHT;
      }
    }
    
    if (row === 0 || row === 2) {
      return DRAGON_RIGHT;
    } else {
      return DRAGON_LEFT;
    }
  }, [dragonPosition, isMobile, STONE_POSITIONS]);

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

  // Play sentence audio
  const playSentenceAudio = useCallback(async () => {
    const sentence = config.sentences[currentSentenceForDialog];
    if (!sentence) return;
    
    try {
      if (audioRef.current) {
        audioRef.current.src = getAudioUrl(sentence.audio);
        await audioRef.current.play();
        return;
      }
    } catch (error) {
      console.log("Full sentence audio not found, playing individual words");
    }
    
    for (let i = 0; i < sentence.words.length; i++) {
      await playAudio(sentence.words[i].audio);
      if (i < sentence.words.length - 1) {
        await new Promise(resolve => setTimeout(resolve, 500));
      }
    }
  }, [currentSentenceForDialog, config.sentences, playAudio]);

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
    
    // Check if this was the last sentence (sentence index 3 completed)
    if (currentSentenceForDialog === 3) {
      setPhase("complete");
      
      if (!completionCalledRef.current) {
        completionCalledRef.current = true;
        recordProgress().then(() => {
          setShowSuccessDialog(true);
        });
      }
    }
  }, [currentSentenceForDialog]);

  // Handle next/jump button click
  const handleNext = useCallback(async () => {
    if (isJumping || showSentenceDialog) return;
    
    setIsJumping(true);
    const nextPosition = dragonPosition + 1;
    
    // DESKTOP: Check if we completed the loop (position 14 = last word of sentence 4)
    // After position 14, dragon jumps back to position 0 (START) for final repeat
    if (!isMobile && nextPosition > STONE_POSITIONS.length - 1) {
      // Jump back to START for final sentence repeat
      setDragonPosition(0);
      
      setTimeout(async () => {
        setIsJumping(false);
        // Show final sentence dialog
        setCurrentSentenceForDialog(3);
        setPhase("sentence");
        setShowSentenceDialog(true);
        
        const sentence = config.sentences[3];
        if (sentence && audioRef.current) {
          try {
            audioRef.current.src = getAudioUrl(sentence.audio);
            await audioRef.current.play();
          } catch (error) {
            console.log("Playing individual words");
          }
        }
      }, 600);
      return;
    }
    
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
        setCurrentSentenceForDialog(nextStone.sentenceIndex ?? 0);
        setPhase("sentence");
        setShowSentenceDialog(true);
        
        const sentence = config.sentences[nextStone.sentenceIndex ?? 0];
        if (sentence && audioRef.current) {
          try {
            audioRef.current.src = getAudioUrl(sentence.audio);
            await audioRef.current.play();
          } catch (error) {
            console.log("Playing individual words");
          }
        }
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
  }, [dragonPosition, isJumping, showSentenceDialog, config.sentences, playAudio, isMobile, STONE_POSITIONS]);

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
    setCurrentSentenceForDialog(0);
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

  // Get dragon pixel position
  const getDragonPixelPosition = () => {
    const pos = getStonePixelPosition(dragonPosition);
    return {
      left: pos.left + stoneWidth / 2 - dragonSize / 2,
      bottom: pos.bottom + stoneHeight * 0.6,
    };
  };

  const dragonPos = getDragonPixelPosition();

  // Get sentence for dialog display
  const dialogSentence = config.sentences[currentSentenceForDialog];

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
      
      {/* BOTTOM LEFT: Home menu button */}
      <div className="fixed bottom-6 left-4 z-30">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              className="h-14 w-14 rounded-full bg-app-orange hover:bg-app-orange/90 shadow-lg"
              size="icon"
            >
              <Home className="h-7 w-7 text-white" />
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
      </div>
      
      {/* DESKTOP: Word cards + Dice CENTERED on screen between middle row stones */}
      {!isMobile && calculatedSizes && (
        <div 
          className="fixed z-20 flex items-center gap-6"
          style={{
            // Center horizontally and vertically on screen
            left: '50%',
            top: '50%',
            transform: 'translate(-50%, -50%)',
          }}
        >
          {/* Larger word container - scaled 1.5x */}
          <div className="bg-white/95 backdrop-blur-sm rounded-3xl shadow-2xl border-3 border-dragon-green/30 w-[480px] h-[195px] flex items-center justify-center p-4">
            {collectedWords.length === 0 ? (
              <p className="text-gray-400 text-lg font-medium italic">Pritisni kocko za skok...</p>
            ) : (
              <div className="flex gap-6 items-center justify-center">
                <AnimatePresence>
                  {collectedWords.map((word, idx) => (
                    <motion.div
                      key={`${word.word}-${idx}`}
                      initial={{ opacity: 0, scale: 0.5 }}
                      animate={{ opacity: 1, scale: 1 }}
                      className="flex flex-col items-center"
                    >
                      <div className="w-28 h-28 rounded-xl bg-gray-50 border-2 border-gray-200 flex items-center justify-center p-3">
                        <img
                          src={getImageUrl(word.image)}
                          alt={word.word}
                          className="w-24 h-24 object-contain"
                        />
                      </div>
                      <p className="text-base font-bold text-gray-800 mt-2 uppercase">
                        {word.word}
                      </p>
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>
            )}
          </div>
          
          {/* 3D Dice - scaled 1.5x (144px = 96 * 1.5) */}
          <JumpDice 
            onClick={handleNext} 
            disabled={isJumping || phase === "complete" || showSentenceDialog}
            size={144}
          />
        </div>
      )}
      
      {/* MOBILE: Original top word cards + bottom jump button */}
      {isMobile && (
        <>
          <div className="fixed top-4 left-0 right-0 z-20 flex justify-center px-4 pointer-events-none">
            <div className={`bg-sky-100/90 backdrop-blur-sm rounded-2xl p-4 shadow-lg transition-all duration-300 pointer-events-auto ${collectedWords.length > 0 ? 'min-w-[300px]' : 'min-w-[200px]'}`}>
              <div className="flex justify-center gap-4 min-h-[80px] items-center">
                {collectedWords.length === 0 && (
                  <p className="text-gray-500 text-sm font-medium">Zbrane besede...</p>
                )}
                <AnimatePresence>
                  {collectedWords.map((word, idx) => (
                    <motion.div
                      key={`${word.word}-${idx}`}
                      initial={{ opacity: 0, scale: 0.5, y: -20 }}
                      animate={{ opacity: 1, scale: 1, y: 0 }}
                      exit={{ opacity: 0, scale: 0.5 }}
                      className="flex flex-col items-center"
                    >
                      <div className="w-16 h-16 rounded-xl bg-white shadow-md flex items-center justify-center p-2">
                        <img
                          src={getImageUrl(word.image)}
                          alt={word.word}
                          className="w-12 h-12 object-contain"
                        />
                      </div>
                      <p className="text-xs font-bold text-gray-800 mt-2 uppercase">
                        {word.word}
                      </p>
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>
            </div>
          </div>
          
          {/* MOBILE: Bottom center jump dice */}
          <div className="fixed bottom-6 left-1/2 transform -translate-x-1/2 z-20">
            <JumpDice 
              onClick={handleNext} 
              disabled={isJumping || phase === "complete" || showSentenceDialog} 
            />
          </div>
        </>
      )}
      
      {/* Main game area - Stone grid */}
      <div className="flex-1 relative overflow-hidden">
        {/* Stones grid */}
        <div className="absolute inset-0">
          {STONE_POSITIONS.map((stone, index) => {
            const pos = getStonePixelPosition(index);
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
      
      {/* Sentence dialog */}
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
              {dialogSentence?.words.map((word, idx) => (
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
              "{dialogSentence?.fullSentence.toUpperCase()}"
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
              <p>🏆 Cilj je obkrožiti vse kamne in ponoviti vse 4 povedi!</p>
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
