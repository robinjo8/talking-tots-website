import { useState, useEffect, useMemo, useCallback } from "react";
import { Home, Volume2 } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { DropdownMenu, DropdownMenuContent, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import ArticulationProgressGrid from "@/components/articulation/ArticulationProgressGrid";
import ArticulationRecordButton from "@/components/articulation/ArticulationRecordButton";
import ArticulationCompletionDialog from "@/components/articulation/ArticulationCompletionDialog";
import ArticulationResumeDialog from "@/components/articulation/ArticulationResumeDialog";
import { MemoryExitConfirmationDialog } from "@/components/games/MemoryExitConfirmationDialog";
import { useArticulationTestNew } from "@/hooks/useArticulationTestNew";
import { useAdditionalTestSession } from "@/hooks/useAdditionalTestSession";
import { useAdditionalTestAssignment, useAdditionalTestWords } from "@/hooks/useAdditionalTestAssignment";
import { useAuth } from "@/contexts/AuthContext";
import { cn } from "@/lib/utils";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

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

const DodatnoPreverjanje = () => {
  const navigate = useNavigate();
  const { user, selectedChild } = useAuth();
  const [showInfoDialog, setShowInfoDialog] = useState(true);
  const [showResumeDialog, setShowResumeDialog] = useState(false);
  const [showExitDialog, setShowExitDialog] = useState(false);
  const [testStarted, setTestStarted] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [backgroundUrl, setBackgroundUrl] = useState<string | null>(null);
  const [resumeWordIndex, setResumeWordIndex] = useState<number>(0);
  const [effectiveStartIndex, setEffectiveStartIndex] = useState<number>(0);

  const [windowSize, setWindowSize] = useState({ width: 0, height: 0 });

  useEffect(() => {
    const updateSize = () => setWindowSize({ width: window.innerWidth, height: window.innerHeight });
    const handleOrientation = () => setTimeout(updateSize, 100);
    updateSize();
    window.addEventListener('resize', updateSize);
    window.addEventListener('orientationchange', handleOrientation);
    return () => {
      window.removeEventListener('resize', updateSize);
      window.removeEventListener('orientationchange', handleOrientation);
    };
  }, []);

  const dimensions = useMemo(() => {
    if (windowSize.height === 0) return null;
    const vh = windowSize.height;
    const isMobile = windowSize.width < 768;
    const titleHeight = 60;
    const bottomPadding = 80;
    const letterInfoHeight = isMobile ? 0 : 50;
    const availableHeight = vh - titleHeight - bottomPadding - letterInfoHeight;
    const progressGridHeight = Math.min(Math.floor(availableHeight * 0.15), 120);
    const cardHeight = availableHeight - progressGridHeight - 20;
    const wordHeight = Math.floor(cardHeight * 0.12);
    const imageHeight = Math.floor(cardHeight * 0.50);
    const buttonHeight = Math.floor(cardHeight * 0.28);
    const cardPadding = Math.max(12, Math.floor(cardHeight * 0.04));
    const isCompact = vh < 700;
    return {
      progressGridHeight, cardHeight, wordHeight, imageHeight, buttonHeight, cardPadding,
      wordFontSize: Math.max(18, Math.min(32, Math.floor(wordHeight * 0.9))),
      isCompact,
    };
  }, [windowSize]);

  const childId = selectedChild?.id;
  const childName = selectedChild?.name;

  // Fetch assignment and words
  const { assignment } = useAdditionalTestAssignment(childId);
  const { words: assignedWords, isLoading: wordsLoading } = useAdditionalTestWords(assignment?.id);

  // Build articulationData-compatible format from assigned words
  const customArticulationData = useMemo(() => {
    if (!assignedWords.length) return [];
    
    // Group by letter
    const groups = new Map<string, { text: string; image: string; audio?: string; acceptedVariants?: string[] }[]>();
    for (const w of assignedWords) {
      const letter = w.letter || '?';
      if (!groups.has(letter)) groups.set(letter, []);
      groups.get(letter)!.push({
        text: w.word,
        image: w.image,
        audio: w.audio || undefined,
        acceptedVariants: [w.word, w.word.toUpperCase()],
      });
    }

    return Array.from(groups.entries()).map(([letter, words]) => ({
      letter,
      words,
    }));
  }, [assignedWords]);

  const totalWordCount = assignedWords.length;

  // Session manager
  const {
    sessionInfo,
    isInitializing,
    initializeSession: initSessionManager,
    updateProgress,
    completeSession,
  } = useAdditionalTestSession();

  useEffect(() => {
    if (sessionInfo) {
      setEffectiveStartIndex(sessionInfo.startIndex);
    }
  }, [sessionInfo]);

  // Handle saving progress
  const handleSaveProgress = useCallback(async (
    _childId: string | undefined,
    _sessionNumber: number,
    wordIndex: number
  ) => {
    await updateProgress(wordIndex + 1);
  }, [updateProgress]);

  // We need to create a custom hook usage that works with dynamic word data
  // For now, we use useArticulationTestNew but override the word source
  // The trick: we pass the custom data through articulationData override
  // Since useArticulationTestNew uses the imported articulationData, we need a different approach
  // We'll compute the word info manually and use the hook for recording logic only

  const allLetters = useMemo(() => customArticulationData.map(g => g.letter), [customArticulationData]);
  
  const flatWords = useMemo(() => {
    const words: { letter: string; word: { text: string; image: string; audio?: string; acceptedVariants?: string[] }; letterIndex: number; wordPosition: number }[] = [];
    customArticulationData.forEach((group, letterIdx) => {
      group.words.forEach((word, wordIdx) => {
        words.push({ letter: group.letter, word, letterIndex: letterIdx, wordPosition: wordIdx });
      });
    });
    return words;
  }, [customArticulationData]);

  // Use the articulation test hook with custom parameters
  const {
    imageUrl,
    loading,
    hasRecorded,
    isTestComplete,
    isTranscribing,
    isAudioPlaying,
    transcriptionResult,
    currentLetter,
    currentLetterIndex,
    positionLabel,
    currentWordIndex,
    totalWords,
    completedWords,
    getCurrentWord,
    handleRecordingComplete,
    handleNext,
    resetTest,
    initializeSession,
    playWordAudio,
  } = useArticulationTestNew(
    childId,
    user?.id,
    sessionInfo?.sessionNumber,
    effectiveStartIndex,
    'srednja',
    handleSaveProgress,
    undefined,
    totalWordCount > 0 ? totalWordCount : undefined,
    sessionInfo?.sessionId,
    // For additional test, we use 1 word per letter since words are custom
    // But the hook uses articulationTestData... We need to handle this differently
    // Actually the hook's word list comes from articulationTestData which is fixed.
    // We can't reuse the hook directly for custom words.
    // Let's set wordsPerLetter to the max and use maxWords to limit
    3,
    testStarted
  );

  // Check for existing session on mount
  useEffect(() => {
    const checkSession = async () => {
      if (childId && assignment && !sessionInfo && !isInitializing && !wordsLoading && assignedWords.length > 0) {
        const existingSession = await initSessionManager(childId, assignment.id, assignedWords.length);
        if (existingSession && existingSession.isResume && existingSession.lastSpokenIndex >= 0) {
          setResumeWordIndex(existingSession.lastSpokenIndex);
          setShowResumeDialog(true);
          setShowInfoDialog(false);
        }
      }
    };
    checkSession();
  }, [childId, assignment, sessionInfo, isInitializing, wordsLoading, assignedWords.length, initSessionManager]);

  // Fetch background
  useEffect(() => {
    const { data } = supabase.storage.from("ozadja").getPublicUrl("svetlomodro_ozadje.webp");
    if (data) setBackgroundUrl(data.publicUrl);
  }, []);

  const handleResume = () => {
    setShowResumeDialog(false);
    setTestStarted(true);
  };

  const handleCloseResumeDialog = () => {
    navigate("/moje-aplikacije");
  };

  const handleCloseCompletion = async () => {
    await completeSession();
    resetTest();
    navigate("/moja-stran");
  };

  // Get word name for resume dialog
  const getWordByIndex = useCallback((index: number): string => {
    if (index >= 0 && index < flatWords.length) {
      return flatWords[index].word.text;
    }
    return getCurrentWord();
  }, [flatWords, getCurrentWord]);

  if (!assignment || wordsLoading) {
    return (
      <div className="h-screen flex items-center justify-center bg-background">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
      </div>
    );
  }

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
      <AlertDialog open={showInfoDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Dodatno preverjanje izgovorjave</AlertDialogTitle>
            <AlertDialogDescription className="space-y-3">
              <p>
                {childName ? `${childName}, o` : 'O'}pravljaš dodatno preverjanje izgovorjave, 
                da bodo logopedi lahko natančneje ocenili tvoj govor.
              </p>
              <p className="text-sm">
                Pripravljenih je <span className="font-bold text-foreground">{totalWordCount} besed</span>.
                Za vsako besedo se bo prikazala slika. Besedo izgovori jasno in glasno.
              </p>
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogAction onClick={async () => {
              await initializeSession();
              setShowInfoDialog(false);
              setTestStarted(true);
            }}>
              Začni
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Completion Dialog */}
      <ArticulationCompletionDialog
        open={isTestComplete}
        onClose={handleCloseCompletion}
      />

      {/* Resume Dialog */}
      <ArticulationResumeDialog
        open={showResumeDialog}
        onResume={handleResume}
        onClose={handleCloseResumeDialog}
        wordName={getWordByIndex(resumeWordIndex)}
      />

      {/* Exit Dialog */}
      <MemoryExitConfirmationDialog
        open={showExitDialog}
        onOpenChange={setShowExitDialog}
        onConfirm={() => navigate("/moje-aplikacije")}
        title="OBVESTILO"
        description="Dodatno preverjanje bo samodejno shranjeno in lahko nadaljujete naslednjič. Ali res želite prekiniti?"
      >
        <div />
      </MemoryExitConfirmationDialog>

      {/* Title */}
      <div className="pt-4 pb-2 text-center flex-shrink-0">
        <h1 className={cn(
          "font-bold text-white drop-shadow-md",
          dimensions?.isCompact ? "text-xl" : "text-2xl md:text-3xl"
        )}>
          DODATNO PREVERJANJE
        </h1>
      </div>

      {/* Main content */}
      <div className="flex-1 flex flex-col items-center justify-start px-4 overflow-hidden">
        {/* Progress Grid */}
        <div
          className="w-full max-w-lg bg-white/90 backdrop-blur-sm rounded-xl shadow-lg mb-2 flex-shrink-0"
          style={{ padding: dimensions?.isCompact ? '8px' : '12px' }}
        >
          <ArticulationProgressGrid
            letters={allLetters.length > 0 ? allLetters : ['?']}
            completedWords={completedWords}
            currentLetterIndex={currentLetterIndex}
            compact={dimensions?.isCompact}
            wordsPerLetter={1}
          />
        </div>

        {/* Current letter */}
        <div className="text-center mb-2 flex-shrink-0">
          <h2 className={cn(
            "font-bold text-white drop-shadow-md",
            dimensions?.isCompact ? "text-base" : "text-lg md:text-xl"
          )}>
            {currentLetter} - {positionLabel}
          </h2>
        </div>

        {/* Word Card */}
        <div
          className="w-full max-w-sm bg-white/95 backdrop-blur-sm rounded-2xl shadow-xl flex flex-col flex-shrink-0"
          style={{
            padding: dimensions?.cardPadding,
            height: dimensions?.cardHeight,
            minHeight: 0,
          }}
        >
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

          <div
            className="relative w-full flex items-center justify-center flex-shrink-0"
            style={{ height: dimensions?.imageHeight }}
          >
            {loading ? (
              <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-teal-500" />
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
            {!hasRecorded && !isTranscribing && !isAudioPlaying && (
              <button
                onClick={playWordAudio}
                className="mb-2 w-10 h-10 rounded-full bg-teal-100 hover:bg-teal-200 flex items-center justify-center transition-colors"
                aria-label="Predvajaj posnetek besede"
              >
                <Volume2 className="w-5 h-5 text-teal-600" />
              </button>
            )}
            <ArticulationRecordButton
              onRecordingComplete={handleRecordingComplete}
              onNext={handleNext}
              disabled={loading || isTranscribing || isAudioPlaying}
              showNext={hasRecorded && !isTranscribing && transcriptionResult?.accepted === true}
              wrongWord={hasRecorded && !isTranscribing && transcriptionResult?.accepted === false ? "rejected" : undefined}
              isNoise={false}
              isTranscribing={isTranscribing}
              recordingDuration={3}
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

      {/* Home Menu */}
      <div className="fixed bottom-4 left-4 z-50 flex items-center gap-3">
        <DropdownMenu open={menuOpen} onOpenChange={setMenuOpen}>
          <DropdownMenuTrigger asChild>
            <button className="w-16 h-16 rounded-full bg-gradient-to-r from-amber-400 to-orange-500 flex items-center justify-center shadow-lg border-2 border-white/50 backdrop-blur-sm hover:scale-105 transition-transform">
              <Home className="w-8 h-8 text-white" />
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="start" side="top" sideOffset={8} className="ml-4 w-56 p-2 bg-white/95 border-2 border-orange-200 shadow-xl">
            <button
              onClick={() => { setMenuOpen(false); setShowExitDialog(true); }}
              className="w-full px-4 py-3 text-left hover:bg-orange-50 transition-colors flex items-center gap-3 text-base font-medium"
            >
              <span className="text-2xl">🏠</span><span>Nazaj</span>
            </button>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );
};

export default DodatnoPreverjanje;
