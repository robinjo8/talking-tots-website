
import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '@/components/Header';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Home } from 'lucide-react';
import { GameStepClickDog } from '@/components/games/zivali-game/GameStepClickDog';
import { GameStepPuzzle } from '@/components/games/zivali-game/GameStepPuzzle';
import { GameStepDragDrop } from '@/components/games/zivali-game/GameStepDragDrop';
import { GameStepLogoped } from '@/components/games/zivali-game/GameStepLogoped';
import { GameStepRepeat } from '@/components/games/zivali-game/GameStepRepeat';
import { GameStepConclusion } from '@/components/games/zivali-game/GameStepConclusion';
import { GameProgressBar } from '@/components/games/zivali-game/GameProgressBar';
import { useAudioPlayback } from '@/hooks/useAudioPlayback';

export default function ZivaliGame() {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const { playAudio } = useAudioPlayback();
  const [score, setScore] = useState(0);
  
  // Progress through the game
  const totalSteps = 10;
  const progress = Math.round((step / totalSteps) * 100);
  
  // Function to go to the next step
  const handleNextStep = () => {
    if (step < totalSteps) {
      setStep(step + 1);
      // Play success sound
      playAudio("https://ecmtctwovkheohqwahvt.supabase.co/storage/v1/object/public/audio-besede/success-chime.mp3");
    }
  };
  
  // Function to award points
  const addPoints = (points: number) => {
    setScore(prev => prev + points);
  };
  
  // Return to games list
  const handleBack = () => {
    navigate('/govorne-igre');
  };
  
  // Reset game
  const resetGame = () => {
    setStep(1);
    setScore(0);
  };
  
  // Handle home button
  const handleHome = () => {
    navigate('/moja-stran');
  };
  
  // Determine which step component to display based on current step
  const renderGameStep = () => {
    if (step <= 5) {
      return (
        <GameStepClickDog 
          step={step} 
          onSuccess={handleNextStep} 
          addPoints={addPoints}
        />
      );
    }
    
    switch (step) {
      case 6:
        return <GameStepPuzzle onComplete={handleNextStep} addPoints={addPoints} />;
      case 7:
        return <GameStepDragDrop onComplete={handleNextStep} addPoints={addPoints} />;
      case 8:
        return <GameStepLogoped onComplete={handleNextStep} />;
      case 9:
        return <GameStepRepeat onComplete={handleNextStep} />;
      case 10:
        return <GameStepConclusion score={score} onRestart={resetGame} />;
      default:
        return null;
    }
  };
  
  return (
    <div className="min-h-screen bg-blue-50 pb-24">
      <Header />
      
      <div className="container max-w-5xl mx-auto pt-32 px-4">
        <div className="flex items-center justify-between mb-4">
          <Button 
            variant="ghost" 
            size="sm" 
            className="gap-2" 
            onClick={handleBack}
          >
            <ArrowLeft className="h-4 w-4" />
            Nazaj
          </Button>
          
          <Button 
            variant="ghost" 
            size="sm" 
            className="gap-2" 
            onClick={handleHome}
          >
            <Home className="h-4 w-4" />
            Domov
          </Button>
        </div>
        
        <div className="mb-8">
          <GameProgressBar progress={progress} />
        </div>
        
        {renderGameStep()}
      </div>
    </div>
  );
}
