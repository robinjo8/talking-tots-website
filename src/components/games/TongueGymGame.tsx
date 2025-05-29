
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { 
  ChevronLeft, 
  ChevronRight, 
  Play, 
  Star, 
  RotateCcw,
  Trophy,
  Target
} from "lucide-react";
import { useAudioPlayback } from "@/hooks/useAudioPlayback";

interface TongueExercise {
  id: number;
  title: string;
  instruction: string;
  description: string;
  illustration: string;
  audioUrl?: string;
}

const tongueExercises: TongueExercise[] = [
  {
    id: 1,
    title: "Jezik gor in dol",
    instruction: "Odpri usta in premikaj jezik gor in dol.",
    description: "Počasi dvigni jezik proti nebu in ga spusti nazaj. Ponovi 5-krat.",
    illustration: "🔺",
    audioUrl: ""
  },
  {
    id: 2,
    title: "Jezik levo in desno",
    instruction: "Premikaj jezik iz leve strani v desno stran ust.",
    description: "Dotakni se levega kota ust z jezikom, nato desnega. Ponovi 5-krat.",
    illustration: "↔️",
    audioUrl: ""
  },
  {
    id: 3,
    title: "Kroženje z jezikom",
    instruction: "Naredi krog z jezikom okoli ust.",
    description: "Počasi vodi jezik v krogu okoli notranjih strani ust. Enkrat v levo, enkrat v desno.",
    illustration: "🔄",
    audioUrl: ""
  },
  {
    id: 4,
    title: "Jezik na nos",
    instruction: "Poskusi doseči nos z jezikom.",
    description: "Izvleci jezik in ga dvigni proti nosu. Drži 3 sekunde.",
    illustration: "👃",
    audioUrl: ""
  },
  {
    id: 5,
    title: "Jezik na brado",
    instruction: "Poskusi doseči brado z jezikom.",
    description: "Izvleci jezik in ga spusti proti bradi. Drži 3 sekunde.",
    illustration: "⬇️",
    audioUrl: ""
  },
  {
    id: 6,
    title: "Cmokanje z jezikom",
    instruction: "Naredi cmokanje z jezikom.",
    description: "Pritisni jezik na nebo in ga hitro spusti, da nastane cmokanje. Ponovi 5-krat.",
    illustration: "💋",
    audioUrl: ""
  }
];

export function TongueGymGame() {
  const [currentExercise, setCurrentExercise] = useState(0);
  const [completedExercises, setCompletedExercises] = useState<Set<number>>(new Set());
  const [showReward, setShowReward] = useState(false);
  const [earnedStars, setEarnedStars] = useState(0);
  const { playAudio } = useAudioPlayback();

  const currentCard = tongueExercises[currentExercise];
  const progress = (completedExercises.size / tongueExercises.length) * 100;
  const isCompleted = completedExercises.has(currentCard.id);
  const allCompleted = completedExercises.size === tongueExercises.length;

  const handleNext = () => {
    if (currentExercise < tongueExercises.length - 1) {
      setCurrentExercise(currentExercise + 1);
    }
  };

  const handlePrevious = () => {
    if (currentExercise > 0) {
      setCurrentExercise(currentExercise - 1);
    }
  };

  const handleComplete = () => {
    if (!isCompleted) {
      const newCompleted = new Set(completedExercises);
      newCompleted.add(currentCard.id);
      setCompletedExercises(newCompleted);
      
      // Award star and show reward animation
      setEarnedStars(prev => prev + 1);
      setShowReward(true);
      setTimeout(() => setShowReward(false), 2000);
    }
  };

  const handleReset = () => {
    setCompletedExercises(new Set());
    setCurrentExercise(0);
    setEarnedStars(0);
    setShowReward(false);
  };

  const handlePlayAudio = () => {
    // Placeholder for audio playback - audio files can be added later
    console.log(`Playing audio for exercise: ${currentCard.title}`);
    // When audio files are available, use: playAudio(currentCard.audioUrl);
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      {/* Progress Section */}
      <div className="text-center space-y-4">
        <div className="flex items-center justify-center gap-4">
          <Target className="h-6 w-6 text-app-teal" />
          <h2 className="text-xl font-semibold">Vadnica za jezik</h2>
        </div>
        
        <div className="space-y-2">
          <div className="flex justify-between text-sm text-muted-foreground">
            <span>Napredek</span>
            <span>{completedExercises.size} od {tongueExercises.length}</span>
          </div>
          <Progress value={progress} className="h-2" />
        </div>

        {/* Stars Display */}
        <div className="flex justify-center gap-1">
          {Array.from({ length: tongueExercises.length }, (_, i) => (
            <Star
              key={i}
              className={`h-6 w-6 ${
                i < earnedStars 
                  ? "fill-yellow-400 text-yellow-400" 
                  : "text-gray-300"
              }`}
            />
          ))}
        </div>
      </div>

      {/* Exercise Card */}
      <Card className="relative overflow-hidden">
        {showReward && (
          <div className="absolute inset-0 bg-gradient-to-r from-yellow-400/20 to-orange-400/20 flex items-center justify-center z-10 animate-fade-in">
            <div className="text-center space-y-2 animate-scale-in">
              <Star className="h-16 w-16 fill-yellow-400 text-yellow-400 mx-auto animate-pulse" />
              <p className="text-lg font-semibold text-yellow-600">Odlično!</p>
            </div>
          </div>
        )}

        <CardHeader className="bg-gradient-to-r from-app-teal/10 to-dragon-green/10">
          <div className="flex items-start justify-between">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <Badge variant="outline" className="text-xs">
                  Vaja {currentCard.id}
                </Badge>
                {isCompleted && (
                  <Badge className="bg-green-100 text-green-800 text-xs">
                    Opravljeno
                  </Badge>
                )}
              </div>
              <CardTitle className="text-xl">{currentCard.title}</CardTitle>
            </div>
            
            <Button
              variant="outline"
              size="sm"
              onClick={handlePlayAudio}
              className="shrink-0"
            >
              <Play className="h-4 w-4" />
            </Button>
          </div>
        </CardHeader>

        <CardContent className="pt-6 space-y-6">
          {/* Illustration Placeholder */}
          <div className="flex justify-center">
            <div className="w-32 h-32 bg-gradient-to-br from-app-teal/20 to-dragon-green/20 rounded-full flex items-center justify-center">
              <span className="text-6xl" role="img" aria-label="Exercise illustration">
                {currentCard.illustration}
              </span>
            </div>
          </div>

          {/* Instructions */}
          <div className="space-y-4 text-center">
            <p className="text-lg font-medium text-app-teal">
              {currentCard.instruction}
            </p>
            <p className="text-muted-foreground">
              {currentCard.description}
            </p>
          </div>

          {/* Action Button */}
          <div className="flex justify-center">
            <Button
              onClick={handleComplete}
              disabled={isCompleted}
              className={`px-8 ${
                isCompleted 
                  ? "bg-green-500 hover:bg-green-600" 
                  : "bg-app-teal hover:bg-app-teal/90"
              }`}
            >
              {isCompleted ? (
                <>
                  <Star className="h-4 w-4 mr-2" />
                  Opravljeno
                </>
              ) : (
                "Opravi vajo"
              )}
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Navigation */}
      <div className="flex justify-between items-center">
        <Button
          variant="outline"
          onClick={handlePrevious}
          disabled={currentExercise === 0}
        >
          <ChevronLeft className="h-4 w-4 mr-2" />
          Prejšnja
        </Button>

        <div className="flex gap-2">
          {tongueExercises.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentExercise(index)}
              className={`w-3 h-3 rounded-full transition-colors ${
                index === currentExercise
                  ? "bg-app-teal"
                  : completedExercises.has(tongueExercises[index].id)
                  ? "bg-green-400"
                  : "bg-gray-300"
              }`}
            />
          ))}
        </div>

        <Button
          variant="outline"
          onClick={handleNext}
          disabled={currentExercise === tongueExercises.length - 1}
        >
          Naslednja
          <ChevronRight className="h-4 w-4 ml-2" />
        </Button>
      </div>

      {/* Completion Reward */}
      {allCompleted && (
        <Card className="bg-gradient-to-r from-yellow-50 to-orange-50 border-yellow-200">
          <CardContent className="pt-6 text-center space-y-4">
            <Trophy className="h-16 w-16 text-yellow-500 mx-auto" />
            <div className="space-y-2">
              <h3 className="text-xl font-bold text-yellow-700">
                Čestitamo! 🎉
              </h3>
              <p className="text-yellow-600">
                Opravil/a si vse vaje za jezik! Tvoj jezik je zdaj močnejši in gibljivejši.
              </p>
            </div>
            <Button
              onClick={handleReset}
              variant="outline"
              className="border-yellow-300 text-yellow-700 hover:bg-yellow-50"
            >
              <RotateCcw className="h-4 w-4 mr-2" />
              Začni znova
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
