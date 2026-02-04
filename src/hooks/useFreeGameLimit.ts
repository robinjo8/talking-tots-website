import { useState, useCallback, useEffect } from 'react';

const FREE_GAMES_LIMIT = 3;
const FREE_GAMES_PLAYED_KEY = 'free_games_played';
const FREE_GAMES_CHILD_AGE_KEY = 'free_games_child_age';

interface FreeGameState {
  date: string;
  count: number;
}

function getTodayDate(): string {
  return new Date().toISOString().split('T')[0];
}

function getState(): FreeGameState {
  try {
    const stored = localStorage.getItem(FREE_GAMES_PLAYED_KEY);
    if (!stored) return { date: getTodayDate(), count: 0 };
    const parsed = JSON.parse(stored) as FreeGameState;
    // Reset if it's a new day
    if (parsed.date !== getTodayDate()) {
      return { date: getTodayDate(), count: 0 };
    }
    return parsed;
  } catch {
    return { date: getTodayDate(), count: 0 };
  }
}

function saveState(state: FreeGameState): void {
  localStorage.setItem(FREE_GAMES_PLAYED_KEY, JSON.stringify(state));
}

export type AgeGroup = '34' | '56' | '78' | '910';

export function useFreeGameLimit() {
  const [gamesPlayed, setGamesPlayed] = useState(() => getState().count);
  const [childAge, setChildAgeState] = useState<number | null>(() => {
    const stored = localStorage.getItem(FREE_GAMES_CHILD_AGE_KEY);
    return stored ? parseInt(stored, 10) : null;
  });

  // Sync with localStorage on mount
  useEffect(() => {
    const state = getState();
    setGamesPlayed(state.count);
  }, []);

  const canPlayFreeGame = useCallback((): boolean => {
    const state = getState();
    return state.count < FREE_GAMES_LIMIT;
  }, []);

  const getRemainingGames = useCallback((): number => {
    const state = getState();
    return Math.max(0, FREE_GAMES_LIMIT - state.count);
  }, []);

  const recordFreeGamePlayed = useCallback((): void => {
    const state = getState();
    state.count++;
    saveState(state);
    setGamesPlayed(state.count);
  }, []);

  const getChildAge = useCallback((): number | null => {
    return childAge;
  }, [childAge]);

  const setChildAge = useCallback((age: number): void => {
    localStorage.setItem(FREE_GAMES_CHILD_AGE_KEY, age.toString());
    setChildAgeState(age);
  }, []);

  const getAgeGroup = useCallback((): AgeGroup => {
    if (!childAge) return '34';
    if (childAge <= 4) return '34';
    if (childAge <= 6) return '56';
    if (childAge <= 8) return '78';
    return '910';
  }, [childAge]);

  const resetChildAge = useCallback((): void => {
    localStorage.removeItem(FREE_GAMES_CHILD_AGE_KEY);
    setChildAgeState(null);
  }, []);

  return {
    gamesPlayed,
    canPlayFreeGame,
    getRemainingGames,
    recordFreeGamePlayed,
    getChildAge,
    setChildAge,
    getAgeGroup,
    childAge,
    resetChildAge,
  };
}
