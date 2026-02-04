import React, { createContext, useContext, useState, useCallback, ReactNode } from 'react';
import { useFreeGameLimit, AgeGroup } from '@/hooks/useFreeGameLimit';

const FREE_GAMES_LIMIT = 3;

interface FreeGameContextType {
  isFreeGameMode: boolean;
  setFreeGameMode: (mode: boolean) => void;
  canPlay: boolean;
  remainingGames: number;
  gamesPlayed: number;
  recordGamePlayed: () => void;
  hasRecordedThisSession: boolean;
  markSessionRecorded: () => void;
  resetSessionRecording: () => void;
  childAge: number | null;
  setChildAge: (age: number) => void;
  getAgeGroup: () => AgeGroup;
  resetChildAge: () => void;
}

const FreeGameContext = createContext<FreeGameContextType | undefined>(undefined);

interface FreeGameProviderProps {
  children: ReactNode;
}

export function FreeGameProvider({ children }: FreeGameProviderProps) {
  const [isFreeGameMode, setFreeGameMode] = useState(false);
  const [hasRecordedThisSession, setHasRecordedThisSession] = useState(false);
  
  const {
    gamesPlayed,
    recordFreeGamePlayed,
    childAge,
    setChildAge,
    getAgeGroup,
    resetChildAge,
  } = useFreeGameLimit();

  const recordGamePlayed = useCallback(() => {
    if (!hasRecordedThisSession) {
      recordFreeGamePlayed();
      setHasRecordedThisSession(true);
    }
  }, [hasRecordedThisSession, recordFreeGamePlayed]);

  const markSessionRecorded = useCallback(() => {
    setHasRecordedThisSession(true);
  }, []);

  const resetSessionRecording = useCallback(() => {
    setHasRecordedThisSession(false);
  }, []);

  // Calculate canPlay and remainingGames reactively based on gamesPlayed
  const value: FreeGameContextType = {
    isFreeGameMode,
    setFreeGameMode,
    canPlay: gamesPlayed < FREE_GAMES_LIMIT,
    remainingGames: Math.max(0, FREE_GAMES_LIMIT - gamesPlayed),
    gamesPlayed,
    recordGamePlayed,
    hasRecordedThisSession,
    markSessionRecorded,
    resetSessionRecording,
    childAge,
    setChildAge,
    getAgeGroup,
    resetChildAge,
  };

  return (
    <FreeGameContext.Provider value={value}>
      {children}
    </FreeGameContext.Provider>
  );
}

export function useFreeGameContext() {
  const context = useContext(FreeGameContext);
  if (context === undefined) {
    throw new Error('useFreeGameContext must be used within a FreeGameProvider');
  }
  return context;
}
