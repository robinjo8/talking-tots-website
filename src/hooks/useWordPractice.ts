
import { useState, useEffect } from "react";
import { PracticeWord } from "@/data/letterPracticeWords";
import { useNavigate } from "react-router-dom";
import { useSpeechRecording } from "./useSpeechRecording";

interface WordPracticeState {
  currentWordIndex: number;
  score: number;
  progress: number;
}

export const useWordPractice = (
  selectedLetter: string | null,
  currentWords: PracticeWord[]
) => {
  const navigate = useNavigate();
  const [state, setState] = useState<WordPracticeState>({
    currentWordIndex: 0,
    score: 0,
    progress: 0,
  });

  const { isRecording, feedbackMessage, showPositiveFeedback, startRecording } = 
    useSpeechRecording((points) => {
      setState(prev => ({
        ...prev,
        score: prev.score + points,
      }));
    });

  useEffect(() => {
    if (selectedLetter) {
      setState(prev => ({
        ...prev,
        currentWordIndex: 0,
        score: 0,
        progress: 0,
      }));
    }
  }, [selectedLetter]);

  useEffect(() => {
    if (selectedLetter && currentWords.length > 0) {
      setState(prev => ({
        ...prev,
        progress: ((state.currentWordIndex + 1) / currentWords.length) * 100,
      }));
    }
  }, [state.currentWordIndex, currentWords.length, selectedLetter]);

  const handleLetterSelect = (letter: string) => {
    navigate(`/artikulacija/${letter}`, { replace: true });
  };

  const handleNextWord = () => {
    if (state.currentWordIndex < currentWords.length - 1) {
      setState(prev => ({
        ...prev,
        currentWordIndex: prev.currentWordIndex + 1,
      }));
    } else {
      alert("Čestitamo! Zaključil si vse vaje za to črko!");
    }
  };

  return {
    ...state,
    isRecording,
    feedbackMessage,
    showPositiveFeedback,
    handleLetterSelect,
    handleMicRecord: startRecording,
    handleNextWord,
  };
};
