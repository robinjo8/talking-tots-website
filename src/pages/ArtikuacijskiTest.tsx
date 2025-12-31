import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { ArrowRight, Home } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import ArticulationProgressGrid from "@/components/articulation/ArticulationProgressGrid";
import ArticulationRecordButton from "@/components/articulation/ArticulationRecordButton";
import ArticulationCompletionDialog from "@/components/articulation/ArticulationCompletionDialog";
import ArticulationTestInfoDialog from "@/components/articulation/ArticulationTestInfoDialog";
import { useArticulationTestNew } from "@/hooks/useArticulationTestNew";
import { cn } from "@/lib/utils";

const ArtikuacijskiTest = () => {
  const navigate = useNavigate();
  const [showInfoDialog, setShowInfoDialog] = useState(true);
  const [backgroundUrl, setBackgroundUrl] = useState<string | null>(null);

  const {
    imageUrl,
    loading,
    hasRecorded,
    isTestComplete,
    currentLetter,
    currentLetterIndex,
    positionLabel,
    currentWordIndex,
    totalWords,
    allLetters,
    completedWords,
    getCurrentWord,
    handleRecordingComplete,
    handleNext,
    resetTest,
  } = useArticulationTestNew();

  // Fetch background image
  useEffect(() => {
    const { data } = supabase.storage
      .from("ozadja")
      .getPublicUrl("svetlomodro_ozadje.png");
    if (data) {
      setBackgroundUrl(data.publicUrl);
    }
  }, []);

  const handleCloseCompletion = () => {
    resetTest();
    navigate("/moja-stran");
  };

  return (
    <div
      className="min-h-screen w-full fixed inset-0 flex flex-col"
      style={{
        backgroundImage: backgroundUrl ? `url(${backgroundUrl})` : undefined,
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
      }}
    >
      {/* Info Dialog */}
      <ArticulationTestInfoDialog
        open={showInfoDialog}
        onClose={() => setShowInfoDialog(false)}
      />

      {/* Completion Dialog */}
      <ArticulationCompletionDialog
        open={isTestComplete}
        onClose={handleCloseCompletion}
      />

      {/* Header with Home button */}
      <div className="absolute top-4 left-4 z-20">
        <Button
          onClick={() => navigate("/moja-stran")}
          variant="ghost"
          size="icon"
          className="w-12 h-12 rounded-full bg-white/90 hover:bg-white shadow-md"
        >
          <Home className="w-6 h-6 text-gray-700" />
        </Button>
      </div>

      {/* Title */}
      <div className="pt-6 pb-2 text-center">
        <h1 className="text-2xl md:text-3xl font-bold text-white drop-shadow-md">
          TEST IZGOVORJAVE
        </h1>
      </div>

      {/* Main content */}
      <div className="flex-1 flex flex-col items-center justify-start px-4 pb-8 overflow-y-auto">
        {/* Progress Grid */}
        <div className="w-full max-w-lg bg-white/90 backdrop-blur-sm rounded-xl p-4 shadow-lg mb-4">
          <ArticulationProgressGrid
            letters={allLetters}
            completedWords={completedWords}
            currentLetterIndex={currentLetterIndex}
          />
        </div>

        {/* Current letter and position */}
        <div className="text-center mb-4">
          <h2 className="text-xl md:text-2xl font-bold text-white drop-shadow-md">
            {currentLetter} - {positionLabel}
          </h2>
          <p className="text-sm text-white/80 mt-1">
            {currentWordIndex + 1} / {totalWords}
          </p>
        </div>

        {/* Word and Image Card */}
        <div className="w-full max-w-sm bg-white/95 backdrop-blur-sm rounded-2xl p-6 shadow-xl">
          {/* Word display */}
          <h3 className="text-3xl md:text-4xl font-bold text-center text-gray-800 mb-4">
            {getCurrentWord().toUpperCase()}
          </h3>

          {/* Image display */}
          <div className="relative w-full aspect-square max-h-48 md:max-h-64 flex items-center justify-center mb-6">
            {loading ? (
              <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-teal-500"></div>
            ) : imageUrl ? (
              <img
                src={imageUrl}
                alt={getCurrentWord()}
                className={cn(
                  "max-w-full max-h-full object-contain rounded-xl transition-all duration-500",
                  hasRecorded && "grayscale opacity-60"
                )}
              />
            ) : (
              <div className="text-gray-400">Slika ni na voljo</div>
            )}
          </div>

          {/* Recording button or Next button */}
          <div className="flex flex-col items-center gap-4">
            {!hasRecorded ? (
              <ArticulationRecordButton
                onRecordingComplete={handleRecordingComplete}
                disabled={loading}
              />
            ) : (
              <Button
                onClick={handleNext}
                className="bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white px-8 py-6 rounded-full text-lg font-medium shadow-lg transition-all duration-300 hover:scale-105"
                size="lg"
              >
                Naprej
                <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ArtikuacijskiTest;
