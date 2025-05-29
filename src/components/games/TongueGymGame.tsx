
import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
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
  duration: number; // in seconds
}

const tongueExercises: TongueExercise[] = [
  {
    id: 1,
    title: "Iztegnitev jezika",
    instruction: "Iztegni jezik čim dlje iz ust in zadrži 5 sekund.",
    description: "Počasi iztegni jezik iz ust kolikor se le da. Drži ga ravno in zadrži pozicijo.",
    illustration: "👅",
    audioUrl: "",
    duration: 5
  },
  {
    id: 2,
    title: "Jezik gor in dol",
    instruction: "Premikaj jezik gor in dol 5-krat.",
    description: "Odpri usta in počasi dvigni jezik proti nebu, nato ga spusti nazaj.",
    illustration: "🔺",
    audioUrl: "",
    duration: 10
  },
  {
    id: 3,
    title: "Jezik levo in desno",
    instruction: "Premikaj jezik iz leve strani v desno stran ust.",
    description: "Dotakni se levega kota ust z jezikom, nato desnega. Ponovi 5-krat.",
    illustration: "↔️",
    audioUrl: "",
    duration: 10
  },
  {
    id: 4,
    title: "Kroženje z jezikom",
    instruction: "Naredi krog z jezikom okoli ust.",
    description: "Počasi vodi jezik v krogu okoli notranjih strani ust. Enkrat v levo, enkrat v desno.",
    illustration: "🔄",
    audioUrl: "",
    duration: 15
  },
  {
    id: 5,
    title: "Jezik na nos",
    instruction: "Poskusi doseči nos z jezikom.",
    description: "Izvleci jezik in ga dvigni proti nosu. Drži 3 sekunde.",
    illustration: "👃",
    audioUrl: "",
    duration: 8
  },
  {
    id: 6,
    title: "Cmokanje z jezikom",
    instruction: "Naredi cmokanje z jezikom 5-krat.",
    description: "Pritisni jezik na nebo in ga hitro spusti, da nastane cmokanje.",
    illustration: "💋",
    audioUrl: "",
    duration: 10
  }
];

export function TongueGymGame() {
  const [currentExercise, setCurrentExercise] = useState(0);
  const [completedExercises, setCompletedExercises] = useState<Set<number>>(new Set());
  const [showReward, setShowReward] = useState(false);
  const [earnedStars, setEarnedStars] = useState(0);
  const [isExerciseActive, setIsExerciseActive] = useState(false);
  const [timeRemaining, setTimeRemaining] = useState(0);
  const { playAudio } = useAudioPlayback();

  const currentCard = tongueExercises[currentExercise];
  const progress = (completedExercises.size / tongueExercises.length) * 100;
  const isCompleted = completedExercises.has(currentCard.id);
  const allCompleted = completedExercises.size === tongueExercises.length;

  // Timer effect
  useEffect(() => {
    let interval: NodeJS.Timeout;
    
    if (isExerciseActive && timeRemaining > 0) {
      interval = setInterval(() => {
        setTimeRemaining(prev => {
          if (prev <= 1) {
            setIsExerciseActive(false);
            handleComplete();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }

    return () => clearInterval(interval);
  }, [isExerciseActive, timeRemaining]);

  const handleNext = () => {
    if (currentExercise < tongueExercises.length - 1) {
      setCurrentExercise(currentExercise + 1);
      setIsExerciseActive(false);
      setTimeRemaining(0);
    }
  };

  const handlePrevious = () => {
    if (currentExercise > 0) {
      setCurrentExercise(currentExercise - 1);
      setIsExerciseActive(false);
      setTimeRemaining(0);
    }
  };

  const handleStartExercise = () => {
    setTimeRemaining(currentCard.duration);
    setIsExerciseActive(true);
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
    setIsExerciseActive(false);
    setTimeRemaining(0);
  };

  const handlePlayAudio = () => {
    console.log(`Playing audio for exercise: ${currentCard.title}`);
  };

  const formatTime = (seconds: number) => {
    return `${seconds} sekund${seconds !== 1 ? '' : 'a'}`;
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Progress Section */}
      <div className="text-center space-y-4">
        <div className="flex items-center justify-center gap-4">
          <Target className="h-6 w-6 text-app-teal" />
          <h2 className="text-xl font-semibold">Vadnica za jezik</h2>
        </div>
        
        <div className="space-y-2">
          <div className="flex justify-between text-sm text-muted-foreground">
            <span>Vaja {currentCard.id} od {tongueExercises.length}</span>
            <span>{completedExercises.size} zaključenih</span>
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

      {/* Main Exercise Card */}
      <Card className="relative overflow-hidden bg-gradient-to-br from-purple-50 to-pink-50 border-2 border-purple-200">
        {showReward && (
          <div className="absolute inset-0 bg-gradient-to-r from-yellow-400/20 to-orange-400/20 flex items-center justify-center z-10 animate-fade-in">
            <div className="text-center space-y-2 animate-scale-in">
              <Star className="h-16 w-16 fill-yellow-400 text-yellow-400 mx-auto animate-pulse" />
              <p className="text-lg font-semibold text-yellow-600">Odlično!</p>
            </div>
          </div>
        )}

        <CardContent className="p-8 space-y-6">
          {/* Animation/Illustration Area */}
          <div className="flex justify-center">
            <div className="w-64 h-48 bg-gradient-to-br from-purple-100 to-purple-200 rounded-xl border-2 border-dashed border-purple-300 flex flex-col items-center justify-center">
              <span className="text-6xl mb-2" role="img" aria-label="Exercise illustration">
                {currentCard.illustration}
              </span>
              <span className="text-sm text-purple-600 font-medium">Animacija vaje</span>
            </div>
          </div>

          {/* Exercise Title */}
          <div className="text-center space-y-2">
            <h1 className="text-3xl font-bold text-gray-900">{currentCard.title}</h1>
            <p className="text-lg text-gray-600">{currentCard.instruction}</p>
          </div>

          {/* Timer Display */}
          {(isExerciseActive || timeRemaining > 0) && (
            <div className="text-center">
              <div className="text-4xl font-bold text-purple-600 mb-2">
                {formatTime(timeRemaining)}
              </div>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex justify-center gap-4">
            <Button
              variant="outline"
              onClick={handlePlayAudio}
              className="gap-2"
            >
              <Play className="h-4 w-4" />
              Predvajaj navodila
            </Button>

            {!isExerciseActive && timeRemaining === 0 && !isCompleted && (
              <Button
                onClick={handleStartExercise}
                className="bg-purple-600 hover:bg-purple-700 text-white px-8"
              >
                Začni vajo
              </Button>
            )}

            {isExerciseActive && (
              <Button
                className="bg-purple-600 hover:bg-purple-700 text-white px-8"
                disabled
              >
                Izvajam vajo...
              </Button>
            )}

            {isCompleted && (
              <Button
                className="bg-green-500 hover:bg-green-600 text-white px-8"
                disabled
              >
                <Star className="h-4 w-4 mr-2" />
                Zaključeno
              </Button>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Navigation */}
      <div className="flex justify-between items-center">
        <Button
          variant="outline"
          onClick={handlePrevious}
          disabled={currentExercise === 0}
          className="gap-2"
        >
          <ChevronLeft className="h-4 w-4" />
          Prejšnja
        </Button>

        <div className="text-center">
          <p className="text-sm text-muted-foreground">
            {completedExercises.size} / {tongueExercises.length} zaključenih
          </p>
        </div>

        <Button
          variant="outline"
          onClick={handleNext}
          disabled={currentExercise === tongueExercises.length - 1}
          className="gap-2"
        >
          Naslednja
          <ChevronRight className="h-4 w-4" />
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
              className="border-yellow-300 text-yellow-700 hover:bg-yellow-50 gap-2"
            >
              <RotateCcw className="h-4 w-4" />
              Začni znova
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
