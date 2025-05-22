
import React, { useState } from 'react';
import { cn } from '@/lib/utils';
import { useAudioPlayback } from '@/hooks/useAudioPlayback';

interface GameStepDragDropProps {
  onComplete: () => void;
  addPoints: (points: number) => void;
}

export function GameStepDragDrop({ onComplete, addPoints }: GameStepDragDropProps) {
  const { playAudio } = useAudioPlayback();
  const [dragging, setDragging] = useState<string | null>(null);
  const [completed, setCompleted] = useState(false);
  
  const animals = [
    { id: 'cat', image: '/lovable-uploads/75eadf45-be56-4374-99dd-e6fbb91bd104.png', name: 'mačka' },
    { id: 'dog', image: '/lovable-uploads/958712cc-0a34-4066-a7f4-c947de96c29a.png', name: 'kuža', correct: true },
    { id: 'rabbit', image: '/lovable-uploads/279957d7-f1bb-45a7-be7c-9e931039eb2c.png', name: 'zajec' }
  ];

  const handleDragStart = (e: React.DragEvent<HTMLDivElement>, id: string) => {
    setDragging(id);
    e.dataTransfer.setData('text/plain', id);
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    const id = e.dataTransfer.getData('text/plain');
    
    // Check if correct animal (dog) was dropped
    if (id === 'dog') {
      setCompleted(true);
      addPoints(15);
      playAudio("https://ecmtctwovkheohqwahvt.supabase.co/storage/v1/object/public/audio-besede/kuza.mp3");
      
      setTimeout(() => {
        onComplete();
      }, 2000);
    } else {
      // Wrong animal dropped
      playAudio("https://ecmtctwovkheohqwahvt.supabase.co/storage/v1/object/public/audio-besede/wrong.mp3");
    }
    
    setDragging(null);
  };

  return (
    <div className="bg-gradient-to-b from-yellow-100 to-green-100 rounded-xl p-8 min-h-[60vh] flex flex-col">
      <h2 className="text-2xl font-bold mb-6 text-center">Kje je kuža?</h2>
      <p className="text-lg mb-8 text-center">Povleci kužka na sivo silhueto!</p>
      
      <div className="flex flex-col md:flex-row gap-8 justify-center items-center">
        {/* Source - Animals to drag */}
        <div className="grid grid-cols-3 gap-4">
          {animals.map(animal => (
            <div
              key={animal.id}
              draggable={!completed}
              onDragStart={(e) => handleDragStart(e, animal.id)}
              className={cn(
                "bg-white rounded-lg p-2 flex items-center justify-center cursor-grab active:cursor-grabbing transition-all",
                dragging === animal.id && "opacity-50",
                completed && animal.correct && "opacity-50 cursor-not-allowed"
              )}
            >
              <img 
                src={animal.image} 
                alt={animal.name} 
                className="h-24 md:h-32 object-contain" 
              />
            </div>
          ))}
        </div>
        
        {/* Target - Dog silhouette */}
        <div
          className={cn(
            "w-48 h-48 md:w-64 md:h-64 border-4 border-dashed rounded-lg flex items-center justify-center transition-all",
            completed ? "bg-green-100 border-green-500" : "bg-gray-100 border-gray-500"
          )}
          onDragOver={handleDragOver}
          onDrop={handleDrop}
        >
          {completed ? (
            <img 
              src="/lovable-uploads/958712cc-0a34-4066-a7f4-c947de96c29a.png" 
              alt="Dog" 
              className="h-40 md:h-52 object-contain animate-bounce"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <img 
                src="/lovable-uploads/34860a51-b4ef-4b58-971f-478381ebaf10.png" 
                alt="Dog outline" 
                className="h-36 md:h-48 object-contain opacity-30"
              />
            </div>
          )}
        </div>
      </div>
      
      {completed && (
        <div className="mt-8 text-center animate-fade-in">
          <p className="text-xl font-bold text-green-700">Odlično! Našel si kužka!</p>
        </div>
      )}
    </div>
  );
}
