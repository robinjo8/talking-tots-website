import { useState, useEffect, useCallback, useMemo } from "react";
import { supabase } from "@/integrations/supabase/client";
import { articulationData } from "@/data/articulationTestData";
import { useTranscription } from "./useTranscription";

// Fonetični vrstni red glasov za artikulacijski test
const PHONETIC_ORDER = ['P', 'B', 'M', 'T', 'D', 'K', 'G', 'N', 'H', 'V', 'J', 'F', 'L', 'S', 'Z', 'C', 'Š', 'Ž', 'Č', 'R'];

// Position labels in Slovenian
const positionLabels = ["začetek", "sredina", "konec"];

export const useArticulationTestNew = (childId?: string, userId?: string, fixedSessionNumber?: number, startIndex: number = 0) => {
  // Start from startIndex (default 0, or 57 for testing with Ž only)
  const [currentWordIndex, setCurrentWordIndex] = useState(startIndex);
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [hasRecorded, setHasRecorded] = useState(false);
  const [isTestComplete, setIsTestComplete] = useState(false);
  const [sessionNumber, setSessionNumber] = useState<number | null>(fixedSessionNumber ?? null);
  const [sessionInitialized, setSessionInitialized] = useState(fixedSessionNumber ? true : false);
  const [transcriptionResult, setTranscriptionResult] = useState<{
    accepted: boolean;
    transcribedText: string;
    matchType?: string;
  } | null>(null);

  const { transcribe, isTranscribing, resetTranscription } = useTranscription();

  // Sort articulation data by phonetic order
  const sortedArticulationData = useMemo(() => {
    return [...articulationData].sort((a, b) => {
      const indexA = PHONETIC_ORDER.indexOf(a.letter.toUpperCase());
      const indexB = PHONETIC_ORDER.indexOf(b.letter.toUpperCase());
      const orderA = indexA === -1 ? 999 : indexA;
      const orderB = indexB === -1 ? 999 : indexB;
      return orderA - orderB;
    });
  }, []);

  // Total words across all letters
  const totalWords = sortedArticulationData.reduce(
    (count, group) => count + group.words.length,
    0
  );

  // All letters in phonetic order
  const allLetters = sortedArticulationData.map((group) => group.letter);

  // Calculate which letter and word position we're at based on currentWordIndex
  const getCurrentLetterAndPosition = () => {
    let wordCount = 0;
    for (let letterIdx = 0; letterIdx < sortedArticulationData.length; letterIdx++) {
      const group = sortedArticulationData[letterIdx];
      for (let wordIdx = 0; wordIdx < group.words.length; wordIdx++) {
        if (wordCount === currentWordIndex) {
          return {
            letterIndex: letterIdx,
            wordPosition: wordIdx,
            letter: group.letter,
            word: group.words[wordIdx],
          };
        }
        wordCount++;
      }
    }
    return null;
  };

  const currentData = getCurrentLetterAndPosition();
  const currentLetterIndex = currentData?.letterIndex ?? 0;
  const currentLetter = currentData?.letter ?? "";
  const currentPosition = currentData?.wordPosition ?? 0;
  const positionLabel = positionLabels[currentPosition] ?? "";

  // Calculate completed words per letter (0-3 for each)
  const getCompletedWords = useCallback((): number[] => {
    const completed: number[] = new Array(allLetters.length).fill(0);
    let wordCount = 0;

    for (let letterIdx = 0; letterIdx < sortedArticulationData.length; letterIdx++) {
      const group = sortedArticulationData[letterIdx];
      for (let wordIdx = 0; wordIdx < group.words.length; wordIdx++) {
        if (wordCount < currentWordIndex) {
          completed[letterIdx]++;
        }
        wordCount++;
      }
    }

    return completed;
  }, [currentWordIndex, allLetters.length, sortedArticulationData]);

  // Fetch image when word changes
  useEffect(() => {
    const fetchImage = async () => {
      if (!currentData) return;

      setLoading(true);
      setHasRecorded(false);

      try {
        const { data } = supabase.storage
          .from("slike")
          .getPublicUrl(currentData.word.image);

        if (data) {
          setImageUrl(data.publicUrl);
        } else {
          setImageUrl(null);
        }
      } catch (error) {
        console.error("Error loading image:", error);
        setImageUrl(null);
      }

      setLoading(false);
    };

    fetchImage();
  }, [currentWordIndex]);

  // Get current word text
  const getCurrentWord = () => {
    return currentData?.word.text ?? "";
  };

  // Initialize session - determine which Seja-X folder to use
  const initializeSession = useCallback(async () => {
    // If fixed session is provided, use it directly
    if (fixedSessionNumber) {
      setSessionNumber(fixedSessionNumber);
      setSessionInitialized(true);
      return;
    }
    
    if (!childId || !userId || sessionInitialized) return;
    
    console.log("Initializing session for child:", childId, "user:", userId);
    
    try {
      // Correct path without /Dokumenti/
      const basePath = `${userId}/${childId}/Preverjanje-izgovorjave`;
      
      // List existing session folders
      const { data: folders, error } = await supabase.storage
        .from('uporabniski-profili')
        .list(basePath);
      
      if (error) {
        console.log("No existing sessions folder, starting with Seja-1:", error.message);
        setSessionNumber(1);
        setSessionInitialized(true);
        return;
      }
      
      // Count existing Seja-X folders
      const existingSessions = folders?.filter(f => f.name.startsWith('Seja-')) || [];
      console.log("Existing sessions:", existingSessions.map(s => s.name));
      
      // Determine next session number (1-5, cyclical)
      const nextSession = (existingSessions.length % 5) + 1;
      console.log("Next session number:", nextSession);
      
      setSessionNumber(nextSession);
      setSessionInitialized(true);
    } catch (err) {
      console.error("Error initializing session:", err);
      setSessionNumber(1);
      setSessionInitialized(true);
    }
  }, [childId, userId, sessionInitialized, fixedSessionNumber]);

  // Handle recording complete - receives audio base64 from microphone
  const handleRecordingComplete = async (audioBase64: string) => {
    console.log("Recording complete, audio length:", audioBase64.length);
    
    const word = currentData?.word;
    if (!word) return;

    const result = await transcribe(
      audioBase64,
      word.text,
      word.acceptedVariants || [],
      childId,
      sessionNumber ?? 1,
      currentWordIndex,
      currentLetter
    );

    if (result) {
      setTranscriptionResult({
        accepted: result.accepted,
        transcribedText: result.transcribedText,
        matchType: result.matchType,
      });
    }

    setHasRecorded(true);
  };

  // Handle next word
  const handleNext = () => {
    if (currentWordIndex < totalWords - 1) {
      setCurrentWordIndex((prev) => prev + 1);
      setHasRecorded(false);
      setTranscriptionResult(null);
      resetTranscription();
    } else {
      // Test is complete
      setIsTestComplete(true);
    }
  };

  // Reset test
  const resetTest = () => {
    setCurrentWordIndex(0);
    setHasRecorded(false);
    setIsTestComplete(false);
    setTranscriptionResult(null);
    setSessionNumber(null);
    setSessionInitialized(false);
    resetTranscription();
  };

  return {
    // State
    imageUrl,
    loading,
    hasRecorded,
    isTestComplete,
    isTranscribing,
    transcriptionResult,
    sessionNumber,

    // Current position info
    currentLetter,
    currentLetterIndex,
    positionLabel,
    currentWordIndex,
    totalWords,
    allLetters,

    // Computed
    completedWords: getCompletedWords(),
    getCurrentWord,

    // Actions
    handleRecordingComplete,
    handleNext,
    resetTest,
    initializeSession,
  };
};
