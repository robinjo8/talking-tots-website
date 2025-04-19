
import { useState, useEffect } from "react";
import { PracticeWord } from "@/data/letterPracticeWords";
import { positiveFeedback, tryAgainFeedback } from "@/data/feedbackMessages";
import { useNavigate } from "react-router-dom";

interface WordPracticeState {
  currentWordIndex: number;
  score: number;
  feedbackMessage: string | null;
  showPositiveFeedback: boolean;
  isRecording: boolean;
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
    feedbackMessage: null,
    showPositiveFeedback: false,
    isRecording: false,
    progress: 0,
  });

  useEffect(() => {
    if (selectedLetter) {
      setState(prev => ({
        ...prev,
        currentWordIndex: 0,
        score: 0,
        feedbackMessage: null,
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

  const handleMicRecord = () => {
    setState(prev => ({ ...prev, isRecording: true }));
    
    setTimeout(() => {
      const isSuccess = Math.random() > 0.2;
      
      setState(prev => ({
        ...prev,
        isRecording: false,
        feedbackMessage: isSuccess 
          ? positiveFeedback[Math.floor(Math.random() * positiveFeedback.length)]
          : tryAgainFeedback[Math.floor(Math.random() * tryAgainFeedback.length)],
        showPositiveFeedback: isSuccess,
        score: isSuccess ? prev.score + 10 : prev.score,
      }));
    }, 2000);
  };

  const handleNextWord = () => {
    if (state.currentWordIndex < currentWords.length - 1) {
      setState(prev => ({
        ...prev,
        currentWordIndex: prev.currentWordIndex + 1,
        feedbackMessage: null,
      }));
    } else {
      alert("Čestitamo! Zaključil si vse vaje za to črko!");
    }
  };

  return {
    ...state,
    handleLetterSelect,
    handleMicRecord,
    handleNextWord,
  };
};
