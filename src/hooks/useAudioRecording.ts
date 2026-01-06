import { useState, useRef, useCallback } from "react";

interface UseAudioRecordingReturn {
  isRecording: boolean;
  countdown: number;
  startRecording: () => Promise<void>;
  audioBase64: string | null;
  error: string | null;
  resetRecording: () => void;
}

export const useAudioRecording = (
  durationSeconds: number = 5,
  onRecordingComplete?: (audioBase64: string) => void
): UseAudioRecordingReturn => {
  const [isRecording, setIsRecording] = useState(false);
  const [countdown, setCountdown] = useState(durationSeconds);
  const [audioBase64, setAudioBase64] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<Blob[]>([]);
  const countdownIntervalRef = useRef<NodeJS.Timeout | null>(null);

  const resetRecording = useCallback(() => {
    setAudioBase64(null);
    setError(null);
    setCountdown(durationSeconds);
  }, [durationSeconds]);

  const startRecording = useCallback(async () => {
    if (isRecording) return;

    try {
      setError(null);
      setAudioBase64(null);
      chunksRef.current = [];

      // Request microphone access
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: {
          echoCancellation: true,
          noiseSuppression: true,
          sampleRate: 16000,
        },
      });

      // Create MediaRecorder with best available format
      const mimeType = MediaRecorder.isTypeSupported("audio/webm;codecs=opus")
        ? "audio/webm;codecs=opus"
        : MediaRecorder.isTypeSupported("audio/webm")
        ? "audio/webm"
        : "audio/mp4";

      const mediaRecorder = new MediaRecorder(stream, { mimeType });
      mediaRecorderRef.current = mediaRecorder;

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          chunksRef.current.push(event.data);
        }
      };

      mediaRecorder.onstop = async () => {
        // Stop all tracks
        stream.getTracks().forEach((track) => track.stop());

        // Clear countdown interval
        if (countdownIntervalRef.current) {
          clearInterval(countdownIntervalRef.current);
          countdownIntervalRef.current = null;
        }

        // Convert to base64
        const blob = new Blob(chunksRef.current, { type: mimeType });
        const reader = new FileReader();

        reader.onloadend = () => {
          const base64 = reader.result as string;
          // Remove data URL prefix (e.g., "data:audio/webm;base64,")
          const base64Data = base64.split(",")[1];
          setAudioBase64(base64Data);
          setIsRecording(false);
          setCountdown(durationSeconds);

          if (onRecordingComplete && base64Data) {
            onRecordingComplete(base64Data);
          }
        };

        reader.readAsDataURL(blob);
      };

      // Start recording
      setIsRecording(true);
      setCountdown(durationSeconds);
      mediaRecorder.start(100); // Collect data every 100ms

      // Start countdown
      countdownIntervalRef.current = setInterval(() => {
        setCountdown((prev) => {
          if (prev <= 1) {
            // Stop recording when countdown reaches 0
            if (mediaRecorderRef.current?.state === "recording") {
              mediaRecorderRef.current.stop();
            }
            return 0;
          }
          return prev - 1;
        });
      }, 1000);

      // Safety timeout to stop recording after duration
      setTimeout(() => {
        if (mediaRecorderRef.current?.state === "recording") {
          mediaRecorderRef.current.stop();
        }
      }, durationSeconds * 1000);

    } catch (err) {
      console.error("Error accessing microphone:", err);
      setError(
        err instanceof Error
          ? err.message
          : "Napaka pri dostopu do mikrofona. Prosimo, omogočite dostop."
      );
      setIsRecording(false);
    }
  }, [isRecording, durationSeconds, onRecordingComplete]);

  return {
    isRecording,
    countdown,
    startRecording,
    audioBase64,
    error,
    resetRecording,
  };
};
