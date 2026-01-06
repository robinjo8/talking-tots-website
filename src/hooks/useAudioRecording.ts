import { useState, useRef, useCallback } from "react";

interface UseAudioRecordingReturn {
  isRecording: boolean;
  countdown: number;
  startRecording: () => Promise<void>;
  audioBase64: string | null;
  error: string | null;
  resetRecording: () => void;
  isSilent: boolean;
}

export const useAudioRecording = (
  durationSeconds: number = 5,
  onRecordingComplete?: (audioBase64: string) => void
): UseAudioRecordingReturn => {
  const [isRecording, setIsRecording] = useState(false);
  const [countdown, setCountdown] = useState(durationSeconds);
  const [audioBase64, setAudioBase64] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isSilent, setIsSilent] = useState(false);

  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<Blob[]>([]);
  const countdownIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const rmsValuesRef = useRef<number[]>([]);

  const resetRecording = useCallback(() => {
    setAudioBase64(null);
    setError(null);
    setCountdown(durationSeconds);
    setIsSilent(false);
    rmsValuesRef.current = [];
  }, [durationSeconds]);

  const startRecording = useCallback(async () => {
    if (isRecording) return;

    try {
      setError(null);
      setAudioBase64(null);
      setIsSilent(false);
      chunksRef.current = [];
      rmsValuesRef.current = [];

      // Request microphone access
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: {
          echoCancellation: true,
          noiseSuppression: true,
          sampleRate: 16000,
        },
      });

      // Set up audio analysis for silence detection
      const audioContext = new AudioContext();
      audioContextRef.current = audioContext;
      const source = audioContext.createMediaStreamSource(stream);
      const analyser = audioContext.createAnalyser();
      analyser.fftSize = 2048;
      source.connect(analyser);
      analyserRef.current = analyser;

      // Start RMS sampling
      const dataArray = new Float32Array(analyser.fftSize);
      const sampleRMS = () => {
        if (analyserRef.current && isRecording) {
          analyserRef.current.getFloatTimeDomainData(dataArray);
          const rms = Math.sqrt(
            dataArray.reduce((sum, val) => sum + val * val, 0) / dataArray.length
          );
          rmsValuesRef.current.push(rms);
        }
      };
      const rmsInterval = setInterval(sampleRMS, 100);

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

        // Clear countdown interval and RMS sampling
        if (countdownIntervalRef.current) {
          clearInterval(countdownIntervalRef.current);
          countdownIntervalRef.current = null;
        }
        clearInterval(rmsInterval);

        // Close audio context
        if (audioContextRef.current) {
          audioContextRef.current.close();
          audioContextRef.current = null;
        }

        // Check for silence (average RMS below threshold)
        const avgRMS =
          rmsValuesRef.current.length > 0
            ? rmsValuesRef.current.reduce((a, b) => a + b, 0) /
              rmsValuesRef.current.length
            : 0;
        const silenceThreshold = 0.01; // Adjust as needed
        const detectedSilence = avgRMS < silenceThreshold;
        console.log(`Average RMS: ${avgRMS}, Silence detected: ${detectedSilence}`);
        setIsSilent(detectedSilence);

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

          // Only call onRecordingComplete if not silent
          if (onRecordingComplete && base64Data && !detectedSilence) {
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
    isSilent,
  };
};
