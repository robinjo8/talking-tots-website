
import { useState } from 'react';
import { positiveFeedback, tryAgainFeedback } from '@/data/feedbackMessages';

interface SpeechRecordingState {
  isRecording: boolean;
  feedbackMessage: string | null;
  showPositiveFeedback: boolean;
}

export const useSpeechRecording = (onScoreUpdate: (points: number) => void) => {
  const [state, setState] = useState<SpeechRecordingState>({
    isRecording: false,
    feedbackMessage: null,
    showPositiveFeedback: false,
  });

  const startRecording = () => {
    setState(prev => ({ ...prev, isRecording: true }));
    
    // Simulate recording completion after 2 seconds
    setTimeout(() => {
      const isSuccess = Math.random() > 0.2;
      
      setState(prev => ({
        isRecording: false,
        feedbackMessage: isSuccess 
          ? positiveFeedback[Math.floor(Math.random() * positiveFeedback.length)]
          : tryAgainFeedback[Math.floor(Math.random() * tryAgainFeedback.length)],
        showPositiveFeedback: isSuccess,
      }));

      if (isSuccess) {
        onScoreUpdate(10);
      }
    }, 2000);
  };

  return {
    ...state,
    startRecording,
  };
};
