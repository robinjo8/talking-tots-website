
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Mic, Play } from 'lucide-react';
import { useAudioPlayback } from '@/hooks/useAudioPlayback';
import { useSpeechRecording } from '@/hooks/useSpeechRecording';

interface GameStepRepeatProps {
  onComplete: () => void;
}

export function GameStepRepeat({ onComplete }: GameStepRepeatProps) {
  const { playAudio } = useAudioPlayback();
  const { isRecording, feedbackMessage, showPositiveFeedback, startRecording } = useSpeechRecording(
    () => {} // Points are not tracked in this step
  );
  
  // Play the example word
  const handlePlayExample = () => {
    playAudio("https://ecmtctwovkheohqwahvt.supabase.co/storage/v1/object/public/audio-besede/kuza.mp3");
  };
  
  return (
    <div className="bg-gradient-to-b from-pink-100 to-blue-100 rounded-xl p-8 min-h-[60vh] flex flex-col items-center">
      <h2 className="text-2xl font-bold mb-6 text-center">Ponovi besedo</h2>
      
      <div className="w-full max-w-md bg-white rounded-lg shadow-lg p-6 mb-8 text-center">
        <div className="relative mb-6 py-4">
          <img 
            src="/lovable-uploads/958712cc-0a34-4066-a7f4-c947de96c29a.png" 
            alt="kuža" 
            className="h-40 object-contain mx-auto"
          />
          
          <div className="absolute bottom-0 left-0 right-0">
            <div className="bg-white/90 py-2 px-4 rounded-full mx-auto w-max">
              <span className="font-bold text-2xl">KUŽA</span>
            </div>
          </div>
        </div>
        
        <div className="flex flex-col gap-4 items-center mb-6">
          <Button
            onClick={handlePlayExample}
            variant="outline"
            className="gap-2"
          >
            <Play className="h-4 w-4" />
            Poslušaj besedo
          </Button>
          
          <Button
            onClick={startRecording}
            disabled={isRecording}
            className={`gap-2 relative ${isRecording ? 'bg-red-500 hover:bg-red-600' : 'bg-dragon-green hover:bg-dragon-green/90'} text-white`}
          >
            <Mic className={`h-4 w-4 ${isRecording ? 'animate-pulse' : ''}`} />
            {isRecording ? 'Snemam...' : 'Povej besedo'}
            {isRecording && (
              <span className="absolute -top-1 -right-1 h-3 w-3 rounded-full bg-red-500 animate-ping"></span>
            )}
          </Button>
        </div>
        
        {feedbackMessage && (
          <div className={`p-3 rounded-md text-center animate-fade-in ${
            showPositiveFeedback ? 'bg-green-100 text-green-800' : 'bg-amber-100 text-amber-800'
          }`}>
            <p className="font-medium text-lg">{feedbackMessage}</p>
          </div>
        )}
      </div>
      
      <Button
        onClick={onComplete}
        size="lg"
        className="bg-dragon-green hover:bg-dragon-green/90 text-white mt-4"
      >
        Naprej
      </Button>
    </div>
  );
}
