import React, { createContext, useContext, ReactNode } from 'react';

export type GameMode = 'user' | 'logopedist';

export interface GameModeContextType {
  mode: GameMode;
  childId: string | null;           // For user mode (parent's child from 'children' table)
  logopedistChildId: string | null; // For logopedist mode (from 'logopedist_children' table)
  childName: string | null;
  basePath: string;                  // Base navigation path ('/govorne-igre' or '/admin/children/:id/games')
}

const defaultContext: GameModeContextType = {
  mode: 'user',
  childId: null,
  logopedistChildId: null,
  childName: null,
  basePath: '/govorne-igre',
};

const GameModeContext = createContext<GameModeContextType>(defaultContext);

interface GameModeProviderProps {
  children: ReactNode;
  mode: GameMode;
  childId?: string | null;
  logopedistChildId?: string | null;
  childName?: string | null;
  basePath?: string;
}

export function GameModeProvider({ 
  children, 
  mode, 
  childId = null,
  logopedistChildId = null,
  childName = null,
  basePath
}: GameModeProviderProps) {
  // Default base path based on mode
  const effectiveBasePath = basePath || (mode === 'logopedist' 
    ? `/admin/children/${logopedistChildId}/games` 
    : '/govorne-igre');

  const value: GameModeContextType = {
    mode,
    childId,
    logopedistChildId,
    childName,
    basePath: effectiveBasePath,
  };

  return (
    <GameModeContext.Provider value={value}>
      {children}
    </GameModeContext.Provider>
  );
}

export function useGameMode(): GameModeContextType {
  const context = useContext(GameModeContext);
  return context;
}

// Helper hook to get the effective child ID for progress tracking
export function useGameChildId(): {
  childId: string | null;
  logopedistChildId: string | null;
  isLogopedistMode: boolean;
} {
  const { mode, childId, logopedistChildId } = useGameMode();
  
  return {
    childId: mode === 'user' ? childId : null,
    logopedistChildId: mode === 'logopedist' ? logopedistChildId : null,
    isLogopedistMode: mode === 'logopedist',
  };
}

// Helper to build navigation paths based on game mode
export function useGameNavigation() {
  const { mode, logopedistChildId, basePath } = useGameMode();

  const getGameListPath = (gameType: string): string => {
    if (mode === 'logopedist' && logopedistChildId) {
      return `/admin/children/${logopedistChildId}/games/${gameType}`;
    }
    return `/govorne-igre/${gameType}`;
  };

  const getGamePath = (gameType: string, gameId: string): string => {
    if (mode === 'logopedist' && logopedistChildId) {
      return `/admin/children/${logopedistChildId}/games/${gameType}/${gameId}`;
    }
    return `/govorne-igre/${gameType}/${gameId}`;
  };

  const getGamesHomePath = (): string => {
    if (mode === 'logopedist' && logopedistChildId) {
      return `/admin/children/${logopedistChildId}/games`;
    }
    return '/govorne-igre';
  };

  return {
    basePath,
    getGameListPath,
    getGamePath,
    getGamesHomePath,
  };
}
