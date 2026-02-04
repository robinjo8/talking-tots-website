import React, { createContext, useContext, useState, useCallback, ReactNode } from 'react';
import { useFreeGameLimit, AgeGroup } from '@/hooks/useFreeGameLimit';

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
    canPlayFreeGame,
    getRemainingGames,
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

  const value: FreeGameContextType = {
    isFreeGameMode,
    setFreeGameMode,
    canPlay: canPlayFreeGame(),
    remainingGames: getRemainingGames(),
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
