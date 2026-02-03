import { useState, useEffect, useMemo, useCallback } from "react";
import { Home } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { DropdownMenu, DropdownMenuContent, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import ArticulationProgressGrid from "@/components/articulation/ArticulationProgressGrid";
import ArticulationRecordButton from "@/components/articulation/ArticulationRecordButton";
import ArticulationCompletionDialog from "@/components/articulation/ArticulationCompletionDialog";
import ArticulationTestInfoDialog from "@/components/articulation/ArticulationTestInfoDialog";
import ArticulationTestInstructionsDialog from "@/components/articulation/ArticulationTestInstructionsDialog";
import ArticulationSettingsDialog from "@/components/articulation/ArticulationSettingsDialog";
import ArticulationResumeDialog from "@/components/articulation/ArticulationResumeDialog";
import { MemoryExitConfirmationDialog } from "@/components/games/MemoryExitConfirmationDialog";
import { useArticulationTestNew } from "@/hooks/useArticulationTestNew";
import { useArticulationSettings } from "@/hooks/useArticulationSettings";
import { useUserSessionManager } from "@/hooks/useUserSessionManager";
import { useAuth } from "@/contexts/AuthContext";
import { cn } from "@/lib/utils";
import { articulationData } from "@/data/articulationTestData";

const positiveFeedbackMessages = [
  "BRAVO! LAHKO NADALJUJEŠ.",
  "SUPER! GREVA NAPREJ!",
  "ODLIČNO! KAR NADALJUJ.",
  "SUPER TI GRE! NADALJUJ NAPREJ.",
  "BRAVO, KAR TAKO DALJE!",
  "ZELO DOBRO! LAHKO GREŠ NAPREJ.",
  "SUPER! GREMO DALJE.",
  "ZELO LEPO! NADALJUJ NAPREJ.",
  "ODLIČNO TI GRE.",
  "SUPER! LAHKO NADALJUJEŠ.",
];

// Phonetic order for word lookup
const PHONETIC_ORDER = ['P', 'B', 'M', 'T', 'D', 'K', 'G', 'N', 'H', 'V', 'J', 'F', 'L', 'S', 'Z', 'C', 'Š', 'Ž', 'Č', 'R'];

const ArtikuacijskiTest = () => {
  const navigate = useNavigate();
  const { user, selectedChild } = useAuth();
  const [showInfoDialog, setShowInfoDialog] = useState(true);
  const [showInstructionsDialog, setShowInstructionsDialog] = useState(false);
  const [showSettingsDialog, setShowSettingsDialog] = useState(false);
  const [showResumeDialog, setShowResumeDialog] = useState(false);
  const [showExitDialog, setShowExitDialog] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [backgroundUrl, setBackgroundUrl] = useState<string | null>(null);
  const [resumeWordIndex, setResumeWordIndex] = useState<number>(0);
  const [effectiveStartIndex, setEffectiveStartIndex] = useState<number>(0);

  // Window size tracking for dynamic scaling (like MemoryGrid)
  const [windowSize, setWindowSize] = useState({ width: 0, height: 0 });

  useEffect(() => {
    const updateSize = () => {
      setWindowSize({
        width: window.innerWidth,
        height: window.innerHeight
      });
    };
    
    const handleOrientationChange = () => setTimeout(updateSize, 100);
    
    updateSize();
    window.addEventListener('resize', updateSize);
    window.addEventListener('orientationchange', handleOrientationChange);
    
    return () => {
      window.removeEventListener('resize', updateSize);
      window.removeEventListener('orientationchange', handleOrientationChange);
    };
  }, []);

  // Calculate dynamic dimensions based on viewport
  const dimensions = useMemo(() => {
    if (windowSize.height === 0) return null;
    
    const vh = windowSize.height;
    const isMobile = windowSize.width < 768;
    
    // Fixed elements
    const titleHeight = 60;
    const bottomPadding = 80;
    const letterInfoHeight = isMobile ? 0 : 50;
    
    // Available height for content
    const availableHeight = vh - titleHeight - bottomPadding - letterInfoHeight;
    
    // Progress grid: 15% of available height, max 120px
    const progressGridHeight = Math.min(Math.floor(availableHeight * 0.15), 120);
    
    // Remaining for word card
    const cardHeight = availableHeight - progressGridHeight - 20; // 20px gap
    
    // Inside card proportions
    const wordHeight = Math.floor(cardHeight * 0.12);
    const imageHeight = Math.floor(cardHeight * 0.50);
    const buttonHeight = Math.floor(cardHeight * 0.28);
    const cardPadding = Math.max(12, Math.floor(cardHeight * 0.04));
    
    // Compact mode for very small screens
    const isCompact = vh < 700;
    
    return {
      progressGridHeight,
      cardHeight,
      wordHeight,
      imageHeight,
      buttonHeight,
      cardPadding,
      wordFontSize: Math.max(18, Math.min(32, Math.floor(wordHeight * 0.9))),
      isCompact,
    };
  }, [windowSize]);

  const childId = selectedChild?.id;
  const userId = user?.id;
  
  // Settings hook
  const {
    difficulty,
    setDifficulty,
    recordingDuration,
    setRecordingDuration,
  } = useArticulationSettings();

  // Session manager hook - uses database for persistence (like admin portal)
  const {
    sessionInfo,
    isInitializing,
    initializeSession: initSessionManager,
    updateProgress,
    completeSession,
  } = useUserSessionManager();

  // Update effectiveStartIndex when session loads
  useEffect(() => {
    if (sessionInfo) {
      setEffectiveStartIndex(sessionInfo.startIndex);
    }
  }, [sessionInfo]);
  
  // Sort articulation data by phonetic order (same as hook)
  const sortedArticulationData = useMemo(() => {
    return [...articulationData].sort((a, b) => {
      const indexA = PHONETIC_ORDER.indexOf(a.letter.toUpperCase());
      const indexB = PHONETIC_ORDER.indexOf(b.letter.toUpperCase());
      const orderA = indexA === -1 ? 999 : indexA;
      const orderB = indexB === -1 ? 999 : indexB;
      return orderA - orderB;
    });
  }, []);

  // Get word by index (for resume dialog display)
  const getWordByIndex = useCallback((index: number): string => {
    let wordCount = 0;
    for (const group of sortedArticulationData) {
      for (const word of group.words) {
        if (wordCount === index) {
          return word.text;
        }
        wordCount++;
      }
    }
    return "";
  }, [sortedArticulationData]);

  // Total words for resume dialog
  const totalWordsCount = useMemo(() => {
    return sortedArticulationData.reduce((count, group) => count + group.words.length, 0);
  }, [sortedArticulationData]);

  // Handle saving progress to database
  const handleSaveProgress = useCallback(async (
    _childId: string | undefined, 
    _sessionNumber: number, 
    wordIndex: number
  ) => {
    // Save to database via session manager
    await updateProgress(wordIndex);
  }, [updateProgress]);

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
    initializeSession,
  } = useArticulationTestNew(
    childId, 
    userId, 
    sessionInfo?.sessionNumber, 
    effectiveStartIndex, 
    difficulty, 
    handleSaveProgress
  );

  // Check for existing session on mount (using database, not localStorage)
  useEffect(() => {
    const checkExistingSession = async () => {
      if (childId && !sessionInfo && !isInitializing) {
        const existingSession = await initSessionManager(childId, totalWordsCount);
        if (existingSession && existingSession.isResume && existingSession.lastSpokenIndex >= 0) {
          // Show resume dialog with the last spoken word
          setResumeWordIndex(existingSession.lastSpokenIndex);
          setShowResumeDialog(true);
          setShowInfoDialog(false);
        }
      }
    };
    checkExistingSession();
  }, [childId, sessionInfo, isInitializing, initSessionManager, totalWordsCount]);

  // Fetch background image
  useEffect(() => {
    const { data } = supabase.storage
      .from("ozadja")
      .getPublicUrl("svetlomodro_ozadje.webp");
    if (data) {
      setBackgroundUrl(data.publicUrl);
    }
  }, []);

  // Handle resume dialog actions
  const handleResume = () => {
    // Just close the dialog - sessionInfo already has the startIndex from database
    setShowResumeDialog(false);
  };

  const handleCloseResumeDialog = () => {
    // X button - go back to apps
    navigate("/moje-aplikacije");
  };

  const handleCloseCompletion = async () => {
    await completeSession();
    resetTest();
    navigate("/moja-stran");
  };

  return (
    <div
      className="h-screen w-full flex flex-col overflow-hidden"
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
        onClose={async () => {
          // Initialize session when user confirms and closes dialog
          await initializeSession();
          setShowInfoDialog(false);
        }}
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

      {/* Settings Dialog */}
      <ArticulationSettingsDialog
        open={showSettingsDialog}
        onClose={() => setShowSettingsDialog(false)}
        difficulty={difficulty}
        onDifficultyChange={setDifficulty}
        recordingDuration={recordingDuration}
        onRecordingDurationChange={setRecordingDuration}
      />

      {/* Resume Dialog */}
      <ArticulationResumeDialog
        open={showResumeDialog}
        onResume={handleResume}
        onClose={handleCloseResumeDialog}
        wordName={getWordByIndex(resumeWordIndex)}
      />

      {/* Exit Confirmation Dialog */}
      <MemoryExitConfirmationDialog 
        open={showExitDialog} 
        onOpenChange={setShowExitDialog} 
        onConfirm={() => navigate("/moje-aplikacije")}
        title="OBVESTILO"
        description="Preverjanje izgovorjave bo samodejno shranjeno in lahko nadaljujete naslednjič. Ali res želite prekiniti preverjanje izgovorjave?"
      >
        <div />
      </MemoryExitConfirmationDialog>

      {/* Title */}
      <div className="pt-4 pb-2 text-center flex-shrink-0">
        <h1 className={cn(
          "font-bold text-white drop-shadow-md",
          dimensions?.isCompact ? "text-xl" : "text-2xl md:text-3xl"
        )}>
          PREVERJANJE IZGOVORJAVE
        </h1>
      </div>

      {/* Main content */}
      <div className="flex-1 flex flex-col items-center justify-start px-4 overflow-hidden">
        {/* Progress Grid */}
        <div 
          className="w-full max-w-lg bg-white/90 backdrop-blur-sm rounded-xl shadow-lg mb-2 flex-shrink-0"
          style={{ 
            padding: dimensions?.isCompact ? '8px' : '12px',
          }}
        >
          <ArticulationProgressGrid
            letters={allLetters}
            completedWords={completedWords}
            currentLetterIndex={currentLetterIndex}
            compact={dimensions?.isCompact}
          />
        </div>

        {/* Current letter and position */}
        <div className="text-center mb-2 flex-shrink-0">
          <h2 className={cn(
            "font-bold text-white drop-shadow-md",
            dimensions?.isCompact ? "text-base" : "text-lg md:text-xl"
          )}>
            {currentLetter} - {positionLabel}
          </h2>
        </div>

        {/* Word and Image Card */}
        <div 
          className="w-full max-w-sm bg-white/95 backdrop-blur-sm rounded-2xl shadow-xl flex flex-col flex-shrink-0"
          style={{ 
            padding: dimensions?.cardPadding,
            height: dimensions?.cardHeight,
            minHeight: 0,
          }}
        >
          {/* Word display */}
          <h3 
            className="font-bold text-center text-gray-800 leading-relaxed flex-shrink-0"
            style={{ 
              fontSize: dimensions?.wordFontSize,
              paddingBottom: '0.25rem',
              lineHeight: 1.3,
            }}
          >
            {getCurrentWord().toUpperCase()}
          </h3>

          {/* Image display */}
          <div 
            className="relative w-full flex items-center justify-center flex-shrink-0"
            style={{ height: dimensions?.imageHeight }}
          >
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

          <div 
            className="flex flex-col items-center justify-center flex-1"
            style={{ minHeight: dimensions?.buttonHeight }}
          >
            <ArticulationRecordButton
              onRecordingComplete={handleRecordingComplete}
              onNext={handleNext}
              disabled={loading || isTranscribing}
              showNext={hasRecorded && !isTranscribing && transcriptionResult?.accepted === true}
              wrongWord={hasRecorded && !isTranscribing && transcriptionResult?.accepted === false && transcriptionResult.transcribedText ? transcriptionResult.transcribedText : undefined}
              isNoise={hasRecorded && !isTranscribing && transcriptionResult?.accepted === false && !transcriptionResult?.transcribedText}
              isTranscribing={isTranscribing}
              recordingDuration={recordingDuration}
              compact={dimensions?.isCompact}
              feedbackMessage={transcriptionResult?.accepted 
                ? (transcriptionResult.matchType === 'exact' 
                    ? positiveFeedbackMessages[Math.floor(Math.random() * positiveFeedbackMessages.length)] 
                    : "V REDU, LAHKO NADALJUJEŠ") 
                : undefined}
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
              className="w-full px-4 py-3 text-left hover:bg-orange-50 transition-colors flex items-center gap-3 text-base font-medium border-b border-orange-100"
            >
              <span className="text-2xl">📖</span><span>Navodila</span>
            </button>
            <button 
              onClick={() => { 
                setMenuOpen(false); 
                setShowSettingsDialog(true); 
              }} 
              className="w-full px-4 py-3 text-left hover:bg-orange-50 transition-colors flex items-center gap-3 text-base font-medium"
            >
              <span className="text-2xl">⚙️</span><span>Nastavitve</span>
            </button>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );
};

export default ArtikuacijskiTest;
