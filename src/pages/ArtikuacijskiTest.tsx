import { useState, useEffect } from "react";
import { Home, Check, X } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { DropdownMenu, DropdownMenuContent, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import ArticulationProgressGrid from "@/components/articulation/ArticulationProgressGrid";
import ArticulationRecordButton from "@/components/articulation/ArticulationRecordButton";
import ArticulationCompletionDialog from "@/components/articulation/ArticulationCompletionDialog";
import ArticulationTestInfoDialog from "@/components/articulation/ArticulationTestInfoDialog";
import ArticulationTestInstructionsDialog from "@/components/articulation/ArticulationTestInstructionsDialog";
import { MemoryExitConfirmationDialog } from "@/components/games/MemoryExitConfirmationDialog";
import { useArticulationTestNew } from "@/hooks/useArticulationTestNew";
import { cn } from "@/lib/utils";

const ArtikuacijskiTest = () => {
  const navigate = useNavigate();
  const [showInfoDialog, setShowInfoDialog] = useState(true);
  const [showInstructionsDialog, setShowInstructionsDialog] = useState(false);
  const [showExitDialog, setShowExitDialog] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [backgroundUrl, setBackgroundUrl] = useState<string | null>(null);

  const {
    imageUrl,
    loading,
    hasRecorded,
    isTestComplete,
    isTranscribing,
    transcriptionResult,
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

      {/* Instructions Dialog */}
      <ArticulationTestInstructionsDialog
        open={showInstructionsDialog}
        onClose={() => setShowInstructionsDialog(false)}
      />

      {/* Exit Confirmation Dialog */}
      <MemoryExitConfirmationDialog 
        open={showExitDialog} 
        onOpenChange={setShowExitDialog} 
        onConfirm={() => navigate("/moja-stran")}
      >
        <div />
      </MemoryExitConfirmationDialog>

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

          {/* Transcription Result Feedback */}
          {transcriptionResult && (
            <div className={cn(
              "flex items-center justify-center gap-2 py-2 px-4 rounded-full mb-4",
              transcriptionResult.accepted 
                ? "bg-green-100 text-green-700" 
                : "bg-red-100 text-red-700"
            )}>
              {transcriptionResult.accepted ? (
                <Check className="w-5 h-5" />
              ) : (
                <X className="w-5 h-5" />
              )}
              <span className="font-medium">
                {transcriptionResult.accepted ? "Pravilno!" : `Slišano: "${transcriptionResult.transcribedText}"`}
              </span>
            </div>
          )}

          {/* Transcribing indicator */}
          {isTranscribing && (
            <div className="flex items-center justify-center gap-2 py-2 px-4 mb-4">
              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-teal-500"></div>
              <span className="text-gray-600">Preverjam izgovorjavo...</span>
            </div>
          )}

          {/* Recording button / Timer / Next button */}
          <div className="flex flex-col items-center gap-4">
            <ArticulationRecordButton
              onRecordingComplete={handleRecordingComplete}
              onNext={handleNext}
              disabled={loading || isTranscribing}
              showNext={hasRecorded && !isTranscribing}
            />
          </div>
        </div>
      </div>

      {/* Floating Home Menu Button - Bottom Left */}
      <div className="fixed bottom-4 left-4 z-50 flex items-center gap-3">
        <DropdownMenu open={menuOpen} onOpenChange={setMenuOpen}>
          <DropdownMenuTrigger asChild>
            <button className="w-16 h-16 rounded-full bg-gradient-to-r from-amber-400 to-orange-500 flex items-center justify-center shadow-lg border-2 border-white/50 backdrop-blur-sm hover:scale-105 transition-transform">
              <Home className="w-8 h-8 text-white" />
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="start" side="top" sideOffset={8} className="ml-4 w-56 p-2 bg-white/95 border-2 border-orange-200 shadow-xl">
            <button 
              onClick={() => { 
                setMenuOpen(false); 
                setShowExitDialog(true); 
              }} 
              className="w-full px-4 py-3 text-left hover:bg-orange-50 transition-colors flex items-center gap-3 text-base font-medium border-b border-orange-100"
            >
              <span className="text-2xl">🏠</span><span>Nazaj</span>
            </button>
            <button 
              onClick={() => { 
                setMenuOpen(false); 
                setShowInstructionsDialog(true); 
              }} 
              className="w-full px-4 py-3 text-left hover:bg-orange-50 transition-colors flex items-center gap-3 text-base font-medium"
            >
              <span className="text-2xl">📖</span><span>Navodila</span>
            </button>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );
};

export default ArtikuacijskiTest;
