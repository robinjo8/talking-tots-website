
import React, { useState, useEffect } from 'react';
import { useAudioPlayback } from '@/hooks/useAudioPlayback';
import { Card } from '@/components/ui/card';
import { cn } from '@/lib/utils';

interface GameStepClickDogProps {
  step: number;
  onSuccess: () => void;
  addPoints: (points: number) => void;
}

// Define animal options for each step with different combinations
const stepAnimals = [
  // Step 1
  [
    { name: 'mačka', image: '/lovable-uploads/75eadf45-be56-4374-99dd-e6fbb91bd104.png' },
    { name: 'kuža', image: '/lovable-uploads/958712cc-0a34-4066-a7f4-c947de96c29a.png', correct: true },
    { name: 'konj', image: '/lovable-uploads/f775878a-4811-4b45-86d5-d27531771d0d.png' },
    { name: 'račka', image: '/lovable-uploads/8994865a-8d06-464a-a608-35a33edceb33.png' },
  ],
  // Step 2
  [
    { name: 'kuža', image: '/lovable-uploads/958712cc-0a34-4066-a7f4-c947de96c29a.png', correct: true },
    { name: 'mačka', image: '/lovable-uploads/75eadf45-be56-4374-99dd-e6fbb91bd104.png' },
    { name: 'račka', image: '/lovable-uploads/8994865a-8d06-464a-a608-35a33edceb33.png' },
    { name: 'zajec', image: '/lovable-uploads/279957d7-f1bb-45a7-be7c-9e931039eb2c.png' },
  ],
  // Step 3
  [
    { name: 'lisica', image: '/lovable-uploads/83cc44e3-2af0-4419-ba83-162908db59e5.png' },
    { name: 'račka', image: '/lovable-uploads/8994865a-8d06-464a-a608-35a33edceb33.png' },
    { name: 'mačka', image: '/lovable-uploads/75eadf45-be56-4374-99dd-e6fbb91bd104.png' },
    { name: 'kuža', image: '/lovable-uploads/958712cc-0a34-4066-a7f4-c947de96c29a.png', correct: true },
  ],
  // Step 4
  [
    { name: 'konj', image: '/lovable-uploads/f775878a-4811-4b45-86d5-d27531771d0d.png' },
    { name: 'kuža', image: '/lovable-uploads/958712cc-0a34-4066-a7f4-c947de96c29a.png', correct: true },
    { name: 'miška', image: '/lovable-uploads/ef9acb7f-a16f-4737-ac7b-fe4bc68c21cd.png' },
    { name: 'zajec', image: '/lovable-uploads/279957d7-f1bb-45a7-be7c-9e931039eb2c.png' },
  ],
  // Step 5
  [
    { name: 'miška', image: '/lovable-uploads/ef9acb7f-a16f-4737-ac7b-fe4bc68c21cd.png' },
    { name: 'lisica', image: '/lovable-uploads/83cc44e3-2af0-4419-ba83-162908db59e5.png' },
    { name: 'kuža', image: '/lovable-uploads/958712cc-0a34-4066-a7f4-c947de96c29a.png', correct: true },
    { name: 'zajec', image: '/lovable-uploads/279957d7-f1bb-45a7-be7c-9e931039eb2c.png' },
  ],
];

// Array of different background styles for variety
const backgrounds = [
  "bg-gradient-to-b from-blue-100 to-green-100",
  "bg-gradient-to-r from-green-100 to-yellow-100",
  "bg-gradient-to-b from-blue-50 to-purple-100",
  "bg-gradient-to-r from-yellow-100 to-pink-100",
  "bg-gradient-to-b from-blue-200 to-green-200"
];

export function GameStepClickDog({ step, onSuccess, addPoints }: GameStepClickDogProps) {
  const { playAudio } = useAudioPlayback();
  const [isAnimating, setIsAnimating] = useState<string | null>(null);
  
  // Get current step's animal array (1-indexed to 0-indexed)
  const currentAnimals = stepAnimals[step - 1];
  
  // Get background for current step
  const currentBackground = backgrounds[step - 1];
  
  const handleAnimalClick = (animalName: string, isCorrect: boolean) => {
    setIsAnimating(animalName);
    
    if (isCorrect) {
      // Play dog sound
      playAudio("https://ecmtctwovkheohqwahvt.supabase.co/storage/v1/object/public/audio-besede/kuza.mp3");
      
      // Add points
      addPoints(10);
      
      // Move to next step after animation
      setTimeout(() => {
        setIsAnimating(null);
        onSuccess();
      }, 1500);
    } else {
      // Play wrong sound and reset animation state after a delay
      playAudio("https://ecmtctwovkheohqwahvt.supabase.co/storage/v1/object/public/audio-besede/wrong.mp3");
      setTimeout(() => {
        setIsAnimating(null);
      }, 500);
    }
  };

  return (
    <div className={cn("rounded-xl p-8 min-h-[60vh] flex flex-col items-center", currentBackground)}>
      <h2 className="text-2xl font-bold mb-6 text-center">Kje je kuža?</h2>
      <p className="text-lg mb-8 text-center">Klikni na kužka!</p>
      
      <div className="w-full max-w-3xl mx-auto grid grid-cols-2 md:grid-cols-2 gap-6">
        {currentAnimals.map((animal, index) => (
          <Card 
            key={index}
            className={cn(
              "aspect-square p-4 flex items-center justify-center cursor-pointer transition-all transform",
              isAnimating === animal.name ? (animal.correct ? "scale-110 border-4 border-green-400" : "scale-95 border-4 border-red-400") : "hover:scale-105",
              "bg-white/90"
            )}
            onClick={() => handleAnimalClick(animal.name, !!animal.correct)}
          >
            <img 
              src={animal.image} 
              alt={animal.name}
              className="max-h-64 max-w-full object-contain"
            />
          </Card>
        ))}
      </div>
    </div>
  );
}
