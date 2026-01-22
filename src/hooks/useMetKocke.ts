import { useState, useCallback, useRef } from 'react';
import { MetKockeWord } from '@/data/metKockeConfig';

interface UseMetKockeProps {
  bitje: MetKockeWord[];
  povedek: MetKockeWord[];
  predmet: MetKockeWord[];
  onPlayAudio: (audioUrl: string) => void;
}

interface UseMetKockeReturn {
  // Stanje
  currentStep: number;
  selectedBitje: number | null;
  selectedPovedek: number | null;
  selectedPredmet: number | null;
  showDice: boolean;
  showResult: boolean;
  isRolling: boolean;
  completedRounds: number;
  
  // Akcije
  startRoll: () => void;
  handleRollComplete: (result: number) => void;
  closeResult: () => void;
  resetGame: () => void;
  handleRecordComplete: () => void;
}

const SUPABASE_URL = "https://ecmtctwovkheohqwahvt.supabase.co/storage/v1/object/public";

export function useMetKocke({ bitje, povedek, predmet, onPlayAudio }: UseMetKockeProps): UseMetKockeReturn {
  const [currentStep, setCurrentStep] = useState(0); // 0 = čaka na prvi met, 1 = čaka na drugi, 2 = čaka na tretji
  const [selectedBitje, setSelectedBitje] = useState<number | null>(null);
  const [selectedPovedek, setSelectedPovedek] = useState<number | null>(null);
  const [selectedPredmet, setSelectedPredmet] = useState<number | null>(null);
  const [showDice, setShowDice] = useState(false);
  const [showResult, setShowResult] = useState(false);
  const [isRolling, setIsRolling] = useState(false);
  const [completedRounds, setCompletedRounds] = useState(0);
  
  const rollCompleteTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const startRoll = useCallback(() => {
    setShowDice(true);
    setIsRolling(true);
  }, []);

  const handleRollComplete = useCallback((result: number) => {
    // result je 1-6, pretvorimo v indeks 0-5
    const index = result - 1;
    
    setIsRolling(false);
    
    // Počakaj malo preden zapreš kocko in predvajaš zvok
    rollCompleteTimeoutRef.current = setTimeout(() => {
      setShowDice(false);
      
      if (currentStep === 0) {
        // Prvi met - BITJE
        setSelectedBitje(index);
        const word = bitje[index];
        if (word) {
          onPlayAudio(`${SUPABASE_URL}/zvocni-posnetki/${word.audio}`);
        }
        setCurrentStep(1);
      } else if (currentStep === 1) {
        // Drugi met - POVEDEK
        setSelectedPovedek(index);
        const word = povedek[index];
        if (word) {
          onPlayAudio(`${SUPABASE_URL}/zvocni-posnetki/${word.audio}`);
        }
        setCurrentStep(2);
      } else if (currentStep === 2) {
        // Tretji met - PREDMET
        setSelectedPredmet(index);
        const word = predmet[index];
        if (word) {
          onPlayAudio(`${SUPABASE_URL}/zvocni-posnetki/${word.audio}`);
        }
        // Po kratkem zamiku odpri rezultat dialog
        setTimeout(() => {
          setShowResult(true);
        }, 1500);
      }
    }, 500);
  }, [currentStep, bitje, povedek, predmet, onPlayAudio]);

  const closeResult = useCallback(() => {
    setShowResult(false);
    // Reset za nov krog
    setSelectedBitje(null);
    setSelectedPovedek(null);
    setSelectedPredmet(null);
    setCurrentStep(0);
  }, []);

  const handleRecordComplete = useCallback(() => {
    setCompletedRounds(prev => prev + 1);
  }, []);

  const resetGame = useCallback(() => {
    setCurrentStep(0);
    setSelectedBitje(null);
    setSelectedPovedek(null);
    setSelectedPredmet(null);
    setShowDice(false);
    setShowResult(false);
    setIsRolling(false);
    setCompletedRounds(0);
    
    if (rollCompleteTimeoutRef.current) {
      clearTimeout(rollCompleteTimeoutRef.current);
    }
  }, []);

  return {
    currentStep,
    selectedBitje,
    selectedPovedek,
    selectedPredmet,
    showDice,
    showResult,
    isRolling,
    completedRounds,
    startRoll,
    handleRollComplete,
    closeResult,
    resetGame,
    handleRecordComplete,
  };
}
