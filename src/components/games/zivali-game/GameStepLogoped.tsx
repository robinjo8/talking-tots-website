
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Play, Repeat } from 'lucide-react';
import { useAudioPlayback } from '@/hooks/useAudioPlayback';

interface GameStepLogopedProps {
  onComplete: () => void;
}

export function GameStepLogoped({ onComplete }: GameStepLogopedProps) {
  const { playAudio } = useAudioPlayback();
  const [repetition, setRepetition] = useState(1);
  const [isPlaying, setIsPlaying] = useState(false);
  const [hasFinished, setHasFinished] = useState(false);
  
  // Play audio sequence
  const playSequence = () => {
    if (isPlaying) return;
    
    setIsPlaying(true);
    
    const playLogoped = (iteration: number) => {
      if (iteration > 3) {
        setIsPlaying(false);
        setHasFinished(true);
        return;
      }
      
      setRepetition(iteration);
      
      // Play the audio
      playAudio("https://ecmtctwovkheohqwahvt.supabase.co/storage/v1/object/public/audio-besede/kuza.mp3");
      
      // Schedule next repetition
      setTimeout(() => {
        playLogoped(iteration + 1);
      }, 2000);
    };
    
    playLogoped(1);
  };
  
  // Auto-play on component mount
  useEffect(() => {
    const timer = setTimeout(() => {
      playSequence();
    }, 1000);
    
    return () => clearTimeout(timer);
  }, []);
  
  return (
    <div className="bg-gradient-to-b from-purple-100 to-blue-100 rounded-xl p-8 min-h-[60vh] flex flex-col items-center justify-center">
      <h2 className="text-2xl font-bold mb-6 text-center">Poslušaj, kako izgovorimo besedo</h2>
      
      <div className="bg-white rounded-lg shadow-lg p-6 mb-8 w-full max-w-md">
        <div className="aspect-video bg-blue-50 rounded-lg flex items-center justify-center mb-4">
          <div className="relative flex flex-col items-center">
            <img 
              src="/lovable-uploads/a984094b-e7e4-4ea1-8baa-4420ad0bf2b3.png"
              alt="Logoped demonstration" 
              className="max-h-56 object-contain"
            />
            
            {isPlaying && (
              <div className={`absolute bottom-4 left-0 right-0 text-center bg-white/80 py-1 px-3 rounded-full mx-auto w-max
                ${repetition === 1 ? "animate-bounce" : repetition === 2 ? "animate-pulse" : "animate-ping"}`}>
                <span className="font-bold text-xl">KUŽA</span>
              </div>
            )}
          </div>
        </div>
        
        <div className="flex items-center justify-center gap-2 mb-4">
          <span className="text-2xl font-bold">
            {repetition}/3
          </span>
        </div>
        
        <div className="flex justify-center">
          <Button
            onClick={playSequence}
            disabled={isPlaying}
            className="gap-2"
          >
            <Repeat className="h-4 w-4" />
            Poslušaj ponovno
          </Button>
        </div>
      </div>
      
      <Button
        onClick={onComplete}
        disabled={!hasFinished}
        size="lg"
        className="bg-dragon-green hover:bg-dragon-green/90 text-white gap-2"
      >
        Ponovi naprej
      </Button>
    </div>
  );
}
