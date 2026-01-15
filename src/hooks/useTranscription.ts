import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";

interface TranscriptionResult {
  success: boolean;
  transcribedText: string;
  accepted: boolean;
  matchType: string;
  confidence: number;
}

export const useTranscription = () => {
  const [isTranscribing, setIsTranscribing] = useState(false);
  const [result, setResult] = useState<TranscriptionResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  const transcribe = async (
    audioBase64: string,
    targetWord: string,
    acceptedVariants: string[] = [],
    childId?: string,
    sessionNumber?: number,
    wordIndex?: number,
    letter?: string
  ): Promise<TranscriptionResult | null> => {
    setIsTranscribing(true);
    setError(null);
    setResult(null);

    try {
      // Get user ID for storage path (new unified structure)
      const { data: { user } } = await supabase.auth.getUser();
      const userId = user?.id;

      const { data, error: fnError } = await supabase.functions.invoke(
        "transcribe-articulation",
        {
          body: {
            audio: audioBase64,
            targetWord,
            acceptedVariants,
            childId,
            userId,
            sessionNumber,
            wordIndex,
            letter,
          },
        }
      );

      if (fnError) {
        throw new Error(fnError.message);
      }

      if (!data.success) {
        throw new Error(data.error || "Transcription failed");
      }

      const transcriptionResult: TranscriptionResult = {
        success: true,
        transcribedText: data.transcribedText,
        accepted: data.accepted,
        matchType: data.matchType,
        confidence: data.confidence,
      };

      setResult(transcriptionResult);
      return transcriptionResult;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Unknown error";
      setError(errorMessage);
      console.error("Transcription error:", errorMessage);
      return null;
    } finally {
      setIsTranscribing(false);
    }
  };

  const resetTranscription = () => {
    setResult(null);
    setError(null);
  };

  return {
    transcribe,
    isTranscribing,
    result,
    error,
    resetTranscription,
  };
};
