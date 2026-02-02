import { useState, useEffect, useCallback } from "react";

export type DifficultyLevel = "nizka" | "srednja" | "visoka";
export type RecordingDuration = 3 | 4 | 5;

interface ArticulationSettings {
  difficulty: DifficultyLevel;
  recordingDuration: RecordingDuration;
}

interface ArticulationProgress {
  childId: string;
  sessionNumber: number;
  currentWordIndex: number;
  timestamp: number;
  difficulty: DifficultyLevel;
}

const SETTINGS_KEY = "articulation_settings";
const PROGRESS_KEY = "articulation_progress";
const PROGRESS_MAX_AGE_MS = 7 * 24 * 60 * 60 * 1000; // 7 days

// Similarity thresholds per word length and difficulty
const SIMILARITY_THRESHOLDS: Record<DifficultyLevel, Record<number, number>> = {
  nizka: { 3: 0.33, 4: 0.25, 5: 0.35, 6: 0.30 },
  srednja: { 3: 0.65, 4: 0.50, 5: 0.50, 6: 0.50 },
  visoka: { 3: 0.65, 4: 0.70, 5: 0.75, 6: 0.65 },
};

export const useArticulationSettings = () => {
  const [difficulty, setDifficultyState] = useState<DifficultyLevel>("srednja");
  const [recordingDuration, setRecordingDurationState] = useState<RecordingDuration>(4);

  // Load settings from localStorage on mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem(SETTINGS_KEY);
      if (stored) {
        const settings: ArticulationSettings = JSON.parse(stored);
        if (settings.difficulty && ["nizka", "srednja", "visoka"].includes(settings.difficulty)) {
          setDifficultyState(settings.difficulty);
        }
        if (settings.recordingDuration && [3, 4, 5].includes(settings.recordingDuration)) {
          setRecordingDurationState(settings.recordingDuration);
        }
      }
    } catch (error) {
      console.error("Error loading articulation settings:", error);
    }
  }, []);

  // Helper to save settings
  const saveSettings = useCallback((newDifficulty: DifficultyLevel, newDuration: RecordingDuration) => {
    try {
      const settings: ArticulationSettings = { difficulty: newDifficulty, recordingDuration: newDuration };
      localStorage.setItem(SETTINGS_KEY, JSON.stringify(settings));
    } catch (error) {
      console.error("Error saving articulation settings:", error);
    }
  }, []);

  // Save difficulty to localStorage
  const setDifficulty = useCallback((newDifficulty: DifficultyLevel) => {
    setDifficultyState(newDifficulty);
    setRecordingDurationState(prev => {
      saveSettings(newDifficulty, prev);
      return prev;
    });
  }, [saveSettings]);

  // Save recording duration to localStorage
  const setRecordingDuration = useCallback((newDuration: RecordingDuration) => {
    setRecordingDurationState(newDuration);
    setDifficultyState(prev => {
      saveSettings(prev, newDuration);
      return prev;
    });
  }, [saveSettings]);

  // Get similarity threshold for a specific word length
  const getThresholdForWordLength = useCallback(
    (wordLength: number): number => {
      const thresholds = SIMILARITY_THRESHOLDS[difficulty];
      // Clamp word length to supported range (3-6)
      const clampedLength = Math.min(Math.max(wordLength, 3), 6);
      return thresholds[clampedLength];
    },
    [difficulty]
  );

  // Save progress to localStorage
  const saveProgress = useCallback(
    (childId: string, sessionNumber: number, currentWordIndex: number) => {
      try {
        const progress: ArticulationProgress = {
          childId,
          sessionNumber,
          currentWordIndex,
          timestamp: Date.now(),
          difficulty,
        };
        localStorage.setItem(PROGRESS_KEY, JSON.stringify(progress));
      } catch (error) {
        console.error("Error saving articulation progress:", error);
      }
    },
    [difficulty]
  );

  // Load progress from localStorage
  const loadProgress = useCallback(
    (childId: string): ArticulationProgress | null => {
      try {
        const stored = localStorage.getItem(PROGRESS_KEY);
        if (!stored) return null;

        const progress: ArticulationProgress = JSON.parse(stored);

        // Check if progress is for the same child
        if (progress.childId !== childId) {
          return null;
        }

        // Check if progress is not too old
        const age = Date.now() - progress.timestamp;
        if (age > PROGRESS_MAX_AGE_MS) {
          localStorage.removeItem(PROGRESS_KEY);
          return null;
        }

        return progress;
      } catch (error) {
        console.error("Error loading articulation progress:", error);
        return null;
      }
    },
    []
  );

  // Clear progress from localStorage
  const clearProgress = useCallback(() => {
    try {
      localStorage.removeItem(PROGRESS_KEY);
    } catch (error) {
      console.error("Error clearing articulation progress:", error);
    }
  }, []);

  // Get human-readable time ago string
  const getTimeAgo = useCallback((timestamp: number): string => {
    const diffMs = Date.now() - timestamp;
    const diffMinutes = Math.floor(diffMs / (1000 * 60));
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

    if (diffMinutes < 1) return "pravkar";
    if (diffMinutes < 60) return `pred ${diffMinutes} ${diffMinutes === 1 ? "minuto" : diffMinutes < 5 ? "minutami" : "minutami"}`;
    if (diffHours < 24) return `pred ${diffHours} ${diffHours === 1 ? "uro" : diffHours < 5 ? "urami" : "urami"}`;
    return `pred ${diffDays} ${diffDays === 1 ? "dnevom" : diffDays < 5 ? "dnevi" : "dnevi"}`;
  }, []);

  return {
    difficulty,
    setDifficulty,
    recordingDuration,
    setRecordingDuration,
    getThresholdForWordLength,
    saveProgress,
    loadProgress,
    clearProgress,
    getTimeAgo,
  };
};
