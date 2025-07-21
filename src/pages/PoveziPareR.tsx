
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { PageHeader } from "@/components/PageHeader";
import { Button } from "@/components/ui/button";
import { Volume2 } from "lucide-react";
import { PuzzleIframe } from "@/components/puzzle/PuzzleIframe";
import { usePoveziPareAudio } from "@/hooks/usePoveziPareAudio";
import { useUserProgress } from "@/hooks/useUserProgress";
import { usePuzzleInteraction } from "@/hooks/usePuzzleInteraction";

// Define the 5 iframe games with their corresponding audio files
const gameOptions = [
  {
    iframeUrl: "https://puzzel.org/sl/matching-pairs/embed?p=-OVfm8Ok0IPIKWbPaPfp",
    audioFile: "r1.mp3"
  },
  {
    iframeUrl: "https://puzzel.org/sl/matching-pairs/embed?p=-OVflmMFjmFQxMk5vtO_",
    audioFile: "r2.mp3"
  },
  {
    iframeUrl: "https://puzzel.org/sl/matching-pairs/embed?p=-OVfl697MO2ggEANmloq",
    audioFile: "r3.mp3"
  },
  {
    iframeUrl: "https://puzzel.org/sl/matching-pairs/embed?p=-OVfk0nQC-oL1NtmTaH2",
    audioFile: "r4.mp3"
  },
  {
    iframeUrl: "https://puzzel.org/sl/matching-pairs/embed?p=-OVfjYDBzRQ76mtp9eKl",
    audioFile: "r5.mp3"
  }
];

export default function PoveziPareR() {
  const navigate = useNavigate();
  const { playSelectedAudio, isAudioLoading } = usePoveziPareAudio();
  const { recordPuzzleCompletion } = useUserProgress();
  const { iframeRef, isButtonActive, markButtonAsUsed } = usePuzzleInteraction();
  
  const [selectedGame, setSelectedGame] = useState<typeof gameOptions[0] | null>(null);

  // Randomly select a game when component mounts
  useEffect(() => {
    const randomIndex = Math.floor(Math.random() * gameOptions.length);
    setSelectedGame(gameOptions[randomIndex]);
  }, []);

  const handleGameComplete = () => {
    if (selectedGame) {
      playSelectedAudio(selectedGame.audioFile);
      recordPuzzleCompletion('povezi_pare_r');
      markButtonAsUsed();
    }
  };

  const handleBackToGames = () => {
    navigate("/govorne-igre");
  };

  if (!selectedGame) {
    return (
      <div className="min-h-screen bg-background">
        <PageHeader title="POVEŽI PARE - R" backPath="/govorne-igre/povezi-pare" />
        <div className="flex items-center justify-center h-64">
          <p className="text-lg">Nalagam igro...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <PageHeader title="POVEŽI PARE - R" backPath="/govorne-igre/povezi-pare" />
      
      <div className="container max-w-5xl mx-auto px-4 pb-20">
        {/* Game container */}
        <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
          {/* Game area */}
          <div className="aspect-video bg-gray-50 relative">
            <PuzzleIframe 
              ref={iframeRef}
              src={selectedGame.iframeUrl}
              className="w-full h-full"
            />
          </div>
          
          {/* Button section */}
          <div className="p-6 bg-white border-t border-gray-100">
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Button
                onClick={handleGameComplete}
                disabled={!isButtonActive || isAudioLoading}
                size="lg"
                className={`${
                  isButtonActive 
                    ? 'bg-dragon-green hover:bg-dragon-green/90 text-white' 
                    : 'bg-gray-400 text-gray-600 cursor-not-allowed'
                } min-w-[200px]`}
              >
                <Volume2 className="w-5 h-5 mr-2" />
                {isAudioLoading ? 'Predvajam...' : 'IGRA JE KONČANA'}
              </Button>
              
              <Button
                onClick={handleBackToGames}
                variant="outline"
                size="lg"
                className="min-w-[200px]"
              >
                NAZAJ NA IGRE
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
