
import React, { useState } from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Play, ArrowLeft, ArrowRight, RotateCcw, Star } from "lucide-react";
import { cn } from "@/lib/utils";
import { useAudioPlayback } from "@/hooks/useAudioPlayback";

interface TongueExercise {
  id: number;
  title: string;
  instruction: string;
  duration?: string;
  audioUrl?: string;
}

const tongueExercises: TongueExercise[] = [
  {
    id: 1,
    title: "Iztegnitev jezika",
    instruction: "Iztegni jezik čim dlje iz ust in zadrži 5 sekund.",
    duration: "5 sekund",
  },
  {
    id: 2,
    title: "Jezik levo-desno",
    instruction: "Premikaj jezik levo in desno, dotakni se kotičkov ust.",
    duration: "10x na vsako stran",
  },
  {
    id: 3,
    title: "Jezik gor-dol",
    instruction: "Dvigni jezik k nosu, nato spusti k bradi.",
    duration: "10x gor in dol",
  },
  {
    id: 4,
    title: "Kroženje z jezikom",
    instruction: "Napravi krog z jezikom okoli ust v eno smer, nato v drugo.",
    duration: "5x v vsako smer",
  },
  {
    id: 5,
    title: "Jezik na nebo",
    instruction: "Pritisni jezik na nebo in zadrži, nato sprosti.",
    duration: "10 sekund",
  },
  {
    id: 6,
    title: "Lizni ustnice",
    instruction: "Z jezikom oblizi zgornje in spodnje ustnice.",
    duration: "5x vsako ustnico",
  },
];

export function TongueGymGame() {
  const [currentStep, setCurrentStep] = useState(0);
  const [completedSteps, setCompletedSteps] = useState<Set<number>>(new Set());
  const [showReward, setShowReward] = useState(false);
  const [starsEarned, setStarsEarned] = useState(0);
  const { playAudio } = useAudioPlayback();

  const currentExercise = tongueExercises[currentStep];
  const isCompleted = completedSteps.has(currentStep);
  const allCompleted = completedSteps.size === tongueExercises.length;

  const handlePlayAudio = () => {
    // Placeholder for audio playback - audio files can be added later
    console.log(`Playing audio for exercise: ${currentExercise.title}`);
    
    // For now, we'll use a text-to-speech simulation or placeholder
    if (currentExercise.audioUrl) {
      playAudio(currentExercise.audioUrl);
    } else {
      // Show feedback that audio will be available later
      console.log("Audio guidance will be available soon");
    }
  };

  const handleCompleteStep = () => {
    const newCompleted = new Set(completedSteps);
    newCompleted.add(currentStep);
    setCompletedSteps(newCompleted);

    // Check if all exercises are completed
    if (newCompleted.size === tongueExercises.length) {
      setStarsEarned(1);
      setShowReward(true);
    }
  };

  const handleNextStep = () => {
    if (currentStep < tongueExercises.length - 1) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handlePrevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleRestart = () => {
    setCurrentStep(0);
    setCompletedSteps(new Set());
    setShowReward(false);
    setStarsEarned(0);
  };

  if (showReward) {
    return (
      <div className="flex flex-col items-center justify-center space-y-6 py-12">
        <div className="animate-bounce">
          <div className="flex space-x-2">
            {[...Array(starsEarned)].map((_, i) => (
              <Star 
                key={i} 
                className="h-16 w-16 fill-yellow-400 text-yellow-400 animate-pulse" 
              />
            ))}
          </div>
        </div>
        
        <Card className="bg-gradient-to-r from-yellow-50 to-orange-50 border-yellow-200">
          <CardContent className="p-8 text-center">
            <h2 className="text-2xl font-bold text-yellow-800 mb-4">
              Čestitke! 🎉
            </h2>
            <p className="text-yellow-700 mb-6">
              Uspešno ste zaključili vse vaje za jezik! Vaš jezik je sedaj močnejši in bolj gibčen.
            </p>
            <div className="flex gap-4 justify-center">
              <Button 
                onClick={handleRestart}
                className="bg-yellow-600 hover:bg-yellow-700 text-white"
              >
                <RotateCcw className="h-4 w-4 mr-2" />
                Ponovi vaje
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Progress indicator */}
      <div className="flex items-center justify-between mb-6">
        <div className="text-sm text-muted-foreground">
          Vaja {currentStep + 1} od {tongueExercises.length}
        </div>
        <div className="flex space-x-1">
          {tongueExercises.map((_, index) => (
            <div
              key={index}
              className={cn(
                "h-3 w-3 rounded-full transition-colors",
                index === currentStep 
                  ? "bg-app-purple" 
                  : completedSteps.has(index)
                  ? "bg-green-500"
                  : "bg-gray-200"
              )}
            />
          ))}
        </div>
      </div>

      {/* Exercise Card */}
      <Card className="bg-gradient-to-br from-app-purple/5 to-app-blue/5 border-app-purple/20">
        <CardContent className="p-8">
          <div className="flex flex-col items-center text-center space-y-6">
            {/* Exercise illustration placeholder */}
            <div className="w-48 h-48 bg-gradient-to-br from-app-purple/20 to-app-blue/20 rounded-xl flex items-center justify-center border-2 border-dashed border-app-purple/30">
              <div className="text-app-purple/60 text-sm font-medium">
                Animacija vaje
              </div>
            </div>

            {/* Exercise details */}
            <div className="space-y-4 max-w-md">
              <h3 className="text-2xl font-bold text-foreground">
                {currentExercise.title}
              </h3>
              
              <p className="text-lg text-muted-foreground leading-relaxed">
                {currentExercise.instruction}
              </p>
              
              {currentExercise.duration && (
                <div className="inline-block bg-app-purple/10 text-app-purple px-3 py-1 rounded-full text-sm font-medium">
                  {currentExercise.duration}
                </div>
              )}
            </div>

            {/* Audio playback button */}
            <Button
              onClick={handlePlayAudio}
              variant="outline"
              size="lg"
              className="gap-2 border-app-purple/30 hover:bg-app-purple/10"
            >
              <Play className="h-5 w-5" />
              Predvajaj navodila
            </Button>

            {/* Action button */}
            {!isCompleted ? (
              <Button
                onClick={handleCompleteStep}
                size="lg"
                className="bg-app-purple hover:bg-app-purple/90 text-white px-8"
              >
                Zaključi vajo
              </Button>
            ) : (
              <div className="flex items-center gap-2 text-green-600 font-medium">
                <Star className="h-5 w-5 fill-current" />
                Vaja zaključena
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Navigation */}
      <div className="flex justify-between items-center">
        <Button
          onClick={handlePrevStep}
          variant="outline"
          disabled={currentStep === 0}
          className="gap-2"
        >
          <ArrowLeft className="h-4 w-4" />
          Prejšnja
        </Button>

        <div className="text-sm text-muted-foreground">
          {completedSteps.size} / {tongueExercises.length} zaključenih
        </div>

        <Button
          onClick={handleNextStep}
          variant="outline"
          disabled={currentStep === tongueExercises.length - 1}
          className="gap-2"
        >
          Naslednja
          <ArrowRight className="h-4 w-4" />
        </Button>
      </div>

      {/* Complete all button */}
      {allCompleted && !showReward && (
        <div className="text-center">
          <Button
            onClick={() => setShowReward(true)}
            size="lg"
            className="bg-green-600 hover:bg-green-700 text-white px-8"
          >
            Pokaži nagrado
          </Button>
        </div>
      )}
    </div>
  );
}
