import { useState, useEffect, useRef } from "react";

export function usePuzzleInteraction() {
  const [buttonUsed, setButtonUsed] = useState(false);
  const [puzzleInteracted, setPuzzleInteracted] = useState(false);
  const iframeRef = useRef<HTMLIFrameElement>(null);

  // Add iframe interaction detection
  useEffect(() => {
    const handleIframeInteraction = () => {
      if (buttonUsed) {
        setPuzzleInteracted(true);
        setButtonUsed(false);
      }
    };

    const iframe = iframeRef.current;
    if (iframe) {
      iframe.addEventListener('mouseenter', handleIframeInteraction);
      iframe.addEventListener('focus', handleIframeInteraction);
      
      return () => {
        iframe.removeEventListener('mouseenter', handleIframeInteraction);
        iframe.removeEventListener('focus', handleIframeInteraction);
      };
    }
  }, [buttonUsed]);

  const markButtonAsUsed = () => {
    setButtonUsed(true);
    setPuzzleInteracted(false);
  };

  const isButtonActive = !buttonUsed || puzzleInteracted;

  return {
    iframeRef,
    isButtonActive,
    markButtonAsUsed
  };
}