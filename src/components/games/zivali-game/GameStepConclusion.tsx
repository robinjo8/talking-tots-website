
import React, { useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Repeat } from 'lucide-react';
import { useAudioPlayback } from '@/hooks/useAudioPlayback';
import confetti from 'canvas-confetti';

interface GameStepConclusionProps {
  score: number;
  onRestart: () => void;
}

export function GameStepConclusion({ score, onRestart }: GameStepConclusionProps) {
  const { playAudio } = useAudioPlayback();
  
  useEffect(() => {
    // Play success sounds
    playAudio("https://ecmtctwovkheohqwahvt.supabase.co/storage/v1/object/public/audio-besede/success-completion.mp3");
    
    // Launch confetti
    const launchConfetti = () => {
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 }
      });
    };
    
    launchConfetti();
    const interval = setInterval(launchConfetti, 2000);
    
    return () => clearInterval(interval);
  }, [playAudio]);
  
  return (
    <div className="bg-gradient-to-b from-yellow-100 to-blue-100 rounded-xl p-8 min-h-[60vh] flex flex-col items-center justify-center">
      <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl p-8 max-w-md w-full text-center">
        <h2 className="text-3xl font-bold mb-4 text-center text-dragon-green">
          Odlično!
        </h2>
        
        <p className="text-xl mb-6">
          Zdaj znaš lepo reči besedo 
          <span className="font-bold text-2xl text-dragon-green ml-2">KUŽA</span>
          <span className="text-2xl">!</span>
        </p>
        
        <div className="my-6 flex justify-center">
          <div className="relative">
            <img 
              src="/lovable-uploads/958712cc-0a34-4066-a7f4-c947de96c29a.png" 
              alt="Dog"
              className="h-40 object-contain animate-bounce" 
            />
            <div className="absolute -top-4 -right-4 flex">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="text-yellow-400 text-4xl transform -translate-y-2">★</div>
              ))}
            </div>
          </div>
        </div>
        
        {score > 0 && (
          <p className="text-lg mb-6">
            Zbral si <span className="font-bold text-dragon-green">{score}</span> točk!
          </p>
        )}
        
        <Button
          onClick={onRestart}
          size="lg"
          className="bg-dragon-green hover:bg-dragon-green/90 text-white gap-2"
        >
          <Repeat className="h-4 w-4" />
          Igraj ponovno
        </Button>
      </div>
    </div>
  );
}
