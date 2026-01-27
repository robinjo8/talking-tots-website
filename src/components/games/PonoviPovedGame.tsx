import { useState, useRef, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { ArrowRight, Home, Volume2, Star } from "lucide-react";
import { 
  PonoviPovedConfig, 
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

type GamePhase = "start" | "word" | "sentence" | "complete";

interface PonoviPovedGameProps {
  config: PonoviPovedConfig;
}

// Stone colors that cycle
const STONE_COLORS = [
  "bg-dragon-green",
  "bg-app-blue", 
  "bg-app-orange",
  "bg-app-purple"
];

export function PonoviPovedGame({ config }: PonoviPovedGameProps) {
  const navigate = useNavigate();
  const { selectedChild } = useAuth();
  const audioRef = useRef<HTMLAudioElement>(null);
  const completionCalledRef = useRef(false);
  
  // Game state
  const [phase, setPhase] = useState<GamePhase>("start");
  const [currentSentenceIndex, setCurrentSentenceIndex] = useState(0);
  const [currentWordIndex, setCurrentWordIndex] = useState(0);
  const [dragonPosition, setDragonPosition] = useState(0); // 0 = start, 1-3 = words, 4 = sentence rest, etc.
  const [isJumping, setIsJumping] = useState(false);
  const [showSuccessDialog, setShowSuccessDialog] = useState(false);
  const [showExitDialog, setShowExitDialog] = useState(false);
  const [showInstructions, setShowInstructions] = useState(false);
  const [startTime] = useState(Date.now());

  // Calculate total positions: START + (3 words + 1 rest) * 4 sentences
  const TOTAL_POSITIONS = 1 + (3 + 1) * 4; // 17 positions total

  // Get current word data
  const currentSentence = config.sentences[currentSentenceIndex];
  const currentWord = currentSentence?.words[currentWordIndex];

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

  // Play sentence audio (or individual words if sentence audio doesn't exist)
  const playSentenceAudio = useCallback(async () => {
    const sentence = config.sentences[currentSentenceIndex];
    
    // Try to play full sentence audio first
    try {
      if (audioRef.current) {
        audioRef.current.src = getAudioUrl(sentence.audio);
        await audioRef.current.play();
      }
    } catch (error) {
      // Fallback: play individual words with delays
      console.log("Full sentence audio not found, playing individual words");
      for (let i = 0; i < sentence.words.length; i++) {
        await playAudio(sentence.words[i].audio);
        if (i < sentence.words.length - 1) {
          await new Promise(resolve => setTimeout(resolve, 500));
        }
      }
    }
  }, [currentSentenceIndex, config.sentences, playAudio]);

  // Handle next button click
  const handleNext = useCallback(async () => {
    if (isJumping) return;
    
    setIsJumping(true);
    
    // Determine next state
    if (phase === "start") {
      // Move from start to first word
      setDragonPosition(1);
      setPhase("word");
      setCurrentWordIndex(0);
      
      setTimeout(() => {
        setIsJumping(false);
        playAudio(config.sentences[0].words[0].audio);
      }, 600);
      
    } else if (phase === "word") {
      if (currentWordIndex < 2) {
        // Move to next word
        const newWordIndex = currentWordIndex + 1;
        const newPosition = dragonPosition + 1;
        
        setCurrentWordIndex(newWordIndex);
        setDragonPosition(newPosition);
        
        setTimeout(() => {
          setIsJumping(false);
          playAudio(currentSentence.words[newWordIndex].audio);
        }, 600);
        
      } else {
        // Move to sentence rest position
        const newPosition = dragonPosition + 1;
        setDragonPosition(newPosition);
        setPhase("sentence");
        
        setTimeout(() => {
          setIsJumping(false);
          playSentenceAudio();
        }, 600);
      }
      
    } else if (phase === "sentence") {
      if (currentSentenceIndex < 3) {
        // Move to next sentence's first word
        const newSentenceIndex = currentSentenceIndex + 1;
        const newPosition = dragonPosition + 1;
        
        setCurrentSentenceIndex(newSentenceIndex);
        setCurrentWordIndex(0);
        setDragonPosition(newPosition);
        setPhase("word");
        
        setTimeout(() => {
          setIsJumping(false);
          playAudio(config.sentences[newSentenceIndex].words[0].audio);
        }, 600);
        
      } else {
        // Game complete!
        setPhase("complete");
        setIsJumping(false);
        
        if (!completionCalledRef.current) {
          completionCalledRef.current = true;
          await recordProgress();
          setShowSuccessDialog(true);
        }
      }
    }
  }, [phase, currentWordIndex, currentSentenceIndex, dragonPosition, isJumping, config.sentences, currentSentence, playAudio, playSentenceAudio]);

  // Record progress to database
  const recordProgress = async () => {
    if (!selectedChild) return;
    
    const duration = Math.floor((Date.now() - startTime) / 1000);
    
    try {
      const { error } = await supabase.from("progress").insert({
        child_id: selectedChild.id,
        exercise_id: "00000000-0000-0000-0000-000000000001", // Placeholder
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
    setCurrentSentenceIndex(0);
    setCurrentWordIndex(0);
    setDragonPosition(0);
    setIsJumping(false);
    setShowSuccessDialog(false);
    completionCalledRef.current = false;
  };

  // Replay current audio
  const handleReplayAudio = () => {
    if (phase === "word" && currentWord) {
      playAudio(currentWord.audio);
    } else if (phase === "sentence") {
      playSentenceAudio();
    }
  };

  // Get stone position on the path
  const getStoneStyle = (index: number) => {
    const baseX = 60; // Starting X position
    const spacing = 70; // Space between stones
    const x = baseX + (index * spacing);
    
    return {
      left: `${x}px`,
    };
  };

  // Render the path with stones
  const renderPath = () => {
    const elements = [];
    let stoneIndex = 0;
    
    // START position
    elements.push(
      <div
        key="start"
        className="absolute bottom-20 flex flex-col items-center"
        style={{ left: '20px' }}
      >
        <div className="w-16 h-8 bg-gray-400 rounded-full flex items-center justify-center text-white font-bold text-xs shadow-md">
          START
        </div>
      </div>
    );
    
    // 4 sentences × (3 stones + 1 meadow)
    for (let s = 0; s < 4; s++) {
      // 3 word stones
      for (let w = 0; w < 3; w++) {
        const posIndex = 1 + s * 4 + w;
        const colorIndex = (s * 3 + w) % STONE_COLORS.length;
        const isActive = dragonPosition === posIndex;
        
        elements.push(
          <div
            key={`stone-${s}-${w}`}
            className="absolute bottom-20 flex flex-col items-center"
            style={getStoneStyle(stoneIndex)}
          >
            <motion.div
              className={`w-12 h-12 rounded-full ${STONE_COLORS[colorIndex]} shadow-lg flex items-center justify-center ${isActive ? 'ring-4 ring-white' : ''}`}
              animate={isActive ? { scale: [1, 1.1, 1] } : {}}
              transition={{ duration: 0.5, repeat: isActive ? Infinity : 0 }}
            >
              <span className="text-white font-bold text-lg">{w + 1}</span>
            </motion.div>
          </div>
        );
        stoneIndex++;
      }
      
      // Meadow/rest position
      const restPosIndex = 1 + s * 4 + 3;
      const isRestActive = dragonPosition === restPosIndex;
      
      elements.push(
        <div
          key={`meadow-${s}`}
          className="absolute bottom-20 flex flex-col items-center"
          style={getStoneStyle(stoneIndex)}
        >
          <motion.div
            className={`w-16 h-12 bg-green-400 rounded-lg shadow-lg flex items-center justify-center ${isRestActive ? 'ring-4 ring-white' : ''}`}
            animate={isRestActive ? { scale: [1, 1.05, 1] } : {}}
            transition={{ duration: 0.5, repeat: isRestActive ? Infinity : 0 }}
          >
            <span className="text-2xl">🌿</span>
          </motion.div>
        </div>
      );
      stoneIndex++;
    }
    
    // GOAL position
    elements.push(
      <div
        key="goal"
        className="absolute bottom-20 flex flex-col items-center"
        style={getStoneStyle(stoneIndex)}
      >
        <div className="w-16 h-12 bg-yellow-400 rounded-lg flex items-center justify-center shadow-lg">
          <span className="text-2xl">🏆</span>
        </div>
      </div>
    );
    
    return elements;
  };

  // Calculate dragon X position
  const getDragonX = () => {
    if (dragonPosition === 0) return 20; // START
    return 60 + ((dragonPosition - 1) * 70);
  };

  return (
    <div className="min-h-screen bg-white flex flex-col">
      {/* Audio element */}
      <audio ref={audioRef} />
      
      {/* Header with title */}
      <div className="bg-dragon-green text-white py-4 px-6">
        <h1 className="text-2xl font-bold text-center">
          Ponovi poved - Črka {config.displayLetter}
        </h1>
        <p className="text-center text-white/80 text-sm mt-1">
          {phase === "start" && "Pritisni NAPREJ za začetek!"}
          {phase === "word" && `Ponovi besedo: ${currentWord?.word}`}
          {phase === "sentence" && `Ponovi poved: ${currentSentence?.fullSentence}`}
          {phase === "complete" && "Čestitke! Končal si vse povedi!"}
        </p>
      </div>
      
      {/* Main game area */}
      <div className="flex-1 flex flex-col items-center justify-center p-4 relative overflow-hidden">
        {/* Word/Sentence image display */}
        <AnimatePresence mode="wait">
          {(phase === "word" || phase === "sentence") && (
            <motion.div
              key={`${phase}-${currentSentenceIndex}-${currentWordIndex}`}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              className="mb-8"
            >
              {phase === "word" && currentWord && (
                <div className="bg-white rounded-2xl shadow-xl p-6 border-4 border-dragon-green">
                  <img
                    src={getImageUrl(currentWord.image)}
                    alt={currentWord.word}
                    className="w-48 h-48 object-contain mx-auto"
                  />
                  <p className="text-2xl font-bold text-center mt-4 text-dragon-green">
                    {currentWord.word}
                  </p>
                </div>
              )}
              
              {phase === "sentence" && (
                <div className="bg-white rounded-2xl shadow-xl p-6 border-4 border-app-orange">
                  <div className="flex gap-4 justify-center mb-4">
                    {currentSentence.words.map((word, idx) => (
                      <img
                        key={idx}
                        src={getImageUrl(word.image)}
                        alt={word.word}
                        className="w-24 h-24 object-contain"
                      />
                    ))}
                  </div>
                  <p className="text-xl font-bold text-center text-app-orange">
                    {currentSentence.fullSentence}
                  </p>
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
        
        {/* Progress indicator */}
        <div className="flex gap-2 mb-4">
          {config.sentences.map((_, idx) => (
            <div
              key={idx}
              className={`w-8 h-8 rounded-full flex items-center justify-center font-bold ${
                idx < currentSentenceIndex
                  ? 'bg-dragon-green text-white'
                  : idx === currentSentenceIndex
                  ? 'bg-app-orange text-white'
                  : 'bg-gray-200 text-gray-400'
              }`}
            >
              {idx + 1}
            </div>
          ))}
        </div>
        
        {/* Path with dragon */}
        <div className="relative w-full h-40 overflow-x-auto mb-8" style={{ minWidth: '100%' }}>
          <div className="absolute inset-0" style={{ width: '1200px' }}>
            {/* Path line */}
            <div className="absolute bottom-24 left-0 right-0 h-1 bg-gray-300" style={{ width: '1150px', marginLeft: '20px' }} />
            
            {/* Stones and positions */}
            {renderPath()}
            
            {/* Dragon */}
            <motion.div
              className="absolute bottom-32 w-16 h-16"
              animate={{
                x: getDragonX(),
                y: isJumping ? [0, -40, 0] : 0
              }}
              transition={{
                x: { duration: 0.6, ease: "easeInOut" },
                y: { duration: 0.6, ease: "easeInOut" }
              }}
            >
              <img
                src="https://ecmtctwovkheohqwahvt.supabase.co/storage/v1/object/public/zmajcki/Zmajcek_1.webp"
                alt="Zmajček"
                className="w-full h-full object-contain"
              />
            </motion.div>
          </div>
        </div>
        
        {/* Action buttons */}
        <div className="flex gap-4">
          {(phase === "word" || phase === "sentence") && (
            <Button
              onClick={handleReplayAudio}
              variant="outline"
              size="lg"
              className="gap-2"
            >
              <Volume2 className="w-5 h-5" />
              Ponovi zvok
            </Button>
          )}
          
          {phase !== "complete" && (
            <Button
              onClick={handleNext}
              disabled={isJumping}
              size="lg"
              className="gap-2 bg-dragon-green hover:bg-dragon-green/90 text-white px-8"
            >
              <ArrowRight className="w-5 h-5" />
              NAPREJ
            </Button>
          )}
        </div>
      </div>
      
      {/* Floating menu button */}
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            className="fixed bottom-6 left-6 z-50 h-14 w-14 rounded-full bg-app-orange hover:bg-app-orange/90 shadow-lg"
            size="icon"
          >
            <Home className="h-6 w-6 text-white" />
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
              <p>1. Pritisni gumb <strong>NAPREJ</strong> za začetek.</p>
              <p>2. Zmajček bo skočil na naslednji kamen.</p>
              <p>3. Ponovi besedo, ki jo slišiš.</p>
              <p>4. Po treh besedah ponovi celo poved.</p>
              <p>5. Končaj vse 4 povedi in osvoji zvezdico!</p>
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
        <AlertDialogContent className="max-w-md">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-center text-2xl">
              🎉 Čestitke! 🎉
            </AlertDialogTitle>
            <AlertDialogDescription className="text-center space-y-4">
              <p className="text-lg">Uspešno si ponovil vse povedi!</p>
              <div className="flex justify-center">
                <Star className="w-16 h-16 text-yellow-400 fill-yellow-400" />
              </div>
              <p className="text-base font-medium">Osvojil si zvezdico!</p>
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className="justify-center">
            <AlertDialogAction 
              className="bg-dragon-green text-white hover:bg-dragon-green/90 px-8"
              onClick={() => {
                setShowSuccessDialog(false);
                navigate("/govorne-igre/ponovi-poved");
              }}
            >
              Naprej
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
