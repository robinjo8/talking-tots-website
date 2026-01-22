import { useState, useCallback, useRef, useEffect } from 'react';
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
  completedRounds: number;
  
  // Akcije
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
  const [completedRounds, setCompletedRounds] = useState(0);
  
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Ob zagonu igre prikaži kocko
  useEffect(() => {
    const timer = setTimeout(() => {
      setShowDice(true);
    }, 500);
    return () => clearTimeout(timer);
  }, []);

  const handleRollComplete = useCallback((result: number) => {
    // result je 1-6, pretvorimo v indeks 0-5
    const index = result - 1;
    
    // Najprej zapri kocko
    setShowDice(false);
    
    if (currentStep === 0) {
      // Prvi met - BITJE
      setSelectedBitje(index);
      const word = bitje[index];
      if (word) {
        onPlayAudio(`${SUPABASE_URL}/zvocni-posnetki/${word.audio}`);
      }
      setCurrentStep(1);
      // Po kratkem zamiku znova prikaži kocko za naslednji met
      timeoutRef.current = setTimeout(() => setShowDice(true), 1200);
      
    } else if (currentStep === 1) {
      // Drugi met - POVEDEK
      setSelectedPovedek(index);
      const word = povedek[index];
      if (word) {
        onPlayAudio(`${SUPABASE_URL}/zvocni-posnetki/${word.audio}`);
      }
      setCurrentStep(2);
      timeoutRef.current = setTimeout(() => setShowDice(true), 1200);
      
    } else if (currentStep === 2) {
      // Tretji met - PREDMET
      setSelectedPredmet(index);
      const word = predmet[index];
      if (word) {
        onPlayAudio(`${SUPABASE_URL}/zvocni-posnetki/${word.audio}`);
      }
      // Po kratkem zamiku odpri rezultat dialog
      timeoutRef.current = setTimeout(() => {
        setShowResult(true);
      }, 1500);
    }
  }, [currentStep, bitje, povedek, predmet, onPlayAudio]);

  const closeResult = useCallback(() => {
    setShowResult(false);
    // Reset za nov krog
    setSelectedBitje(null);
    setSelectedPovedek(null);
    setSelectedPredmet(null);
    setCurrentStep(0);
    // Prikaži kocko za nov krog
    timeoutRef.current = setTimeout(() => setShowDice(true), 500);
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
    setCompletedRounds(0);
    
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    
    // Po resetu prikaži kocko
    timeoutRef.current = setTimeout(() => setShowDice(true), 500);
  }, []);

  // Cleanup
  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  return {
    currentStep,
    selectedBitje,
    selectedPovedek,
    selectedPredmet,
    showDice,
    showResult,
    completedRounds,
    handleRollComplete,
    closeResult,
    resetGame,
    handleRecordComplete,
  };
}
