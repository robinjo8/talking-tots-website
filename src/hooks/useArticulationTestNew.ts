import { useState, useEffect, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { articulationData } from "@/data/articulationTestData";
import { useTranscription } from "./useTranscription";

// Position labels in Slovenian
const positionLabels = ["začetek", "sredina", "konec"];

export const useArticulationTestNew = (childId?: string) => {
  // TEMPORARY: Start at last letter (Ž) for testing - index 57 = first word of Ž
  const [currentWordIndex, setCurrentWordIndex] = useState(57);
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [hasRecorded, setHasRecorded] = useState(false);
  const [isTestComplete, setIsTestComplete] = useState(false);
  const [transcriptionResult, setTranscriptionResult] = useState<{
    accepted: boolean;
    transcribedText: string;
    matchType?: string;
  } | null>(null);

  const { transcribe, isTranscribing, resetTranscription } = useTranscription();

  // Total words across all letters
  const totalWords = articulationData.reduce(
    (count, group) => count + group.words.length,
    0
  );

  // All letters in order
  const allLetters = articulationData.map((group) => group.letter);

  // Calculate which letter and word position we're at based on currentWordIndex
  const getCurrentLetterAndPosition = () => {
    let wordCount = 0;
    for (let letterIdx = 0; letterIdx < articulationData.length; letterIdx++) {
      const group = articulationData[letterIdx];
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

    for (let letterIdx = 0; letterIdx < articulationData.length; letterIdx++) {
      const group = articulationData[letterIdx];
      for (let wordIdx = 0; wordIdx < group.words.length; wordIdx++) {
        if (wordCount < currentWordIndex) {
          completed[letterIdx]++;
        }
        wordCount++;
      }
    }

    return completed;
  }, [currentWordIndex, allLetters.length]);

  // Fetch image when word changes
  useEffect(() => {
    const fetchImage = async () => {
      if (!currentData) return;

      setLoading(true);
      setHasRecorded(false);

      try {
        const { data } = supabase.storage
          .from("artikulacijski-test")
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

  // Handle recording complete - receives audio base64 from microphone
  const handleRecordingComplete = async (audioBase64: string) => {
    console.log("Recording complete, audio length:", audioBase64.length);
    
    const word = currentData?.word;
    if (!word) return;

    const result = await transcribe(
      audioBase64,
      word.text,
      word.acceptedVariants || [],
      childId
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
  };
};
