// Spomin (Memory) Game Configuration
// Maps URL keys to Supabase table names and display letters

export interface SpominConfig {
  urlKey: string;         // ASCII-safe URL key (e.g., 'c', 'ch', 'k')
  displayLetter: string;  // Display letter (e.g., 'C', 'Č', 'K')
  tableName: string;      // Supabase table name
  queryKey: string;       // React Query cache key
}

export const spominConfig: Record<string, SpominConfig> = {
  'c': {
    urlKey: 'c',
    displayLetter: 'C',
    tableName: 'memory_cards_c',
    queryKey: 'memoryCardsC',
  },
  'ch': {
    urlKey: 'ch',
    displayLetter: 'Č',
    tableName: 'memory_cards_Č',
    queryKey: 'memoryCardsCH',
  },
  'k': {
    urlKey: 'k',
    displayLetter: 'K',
    tableName: 'memory_cards_K',
    queryKey: 'memoryCardsK',
  },
  'l': {
    urlKey: 'l',
    displayLetter: 'L',
    tableName: 'memory_cards_l',
    queryKey: 'memoryCardsL',
  },
  'r': {
    urlKey: 'r',
    displayLetter: 'R',
    tableName: 'memory_cards_r',
    queryKey: 'memoryCardsR',
  },
  's': {
    urlKey: 's',
    displayLetter: 'S',
    tableName: 'memory_cards_S',
    queryKey: 'memoryCardsS',
  },
  'sh': {
    urlKey: 'sh',
    displayLetter: 'Š',
    tableName: 'memory_cards_Š_duplicate',
    queryKey: 'memoryCardsSH',
  },
  'z': {
    urlKey: 'z',
    displayLetter: 'Z',
    tableName: 'memory_cards_z',
    queryKey: 'memoryCardsZ',
  },
  'zh': {
    urlKey: 'zh',
    displayLetter: 'Ž',
    tableName: 'memory_cards_Ž',
    queryKey: 'memoryCardsZH',
  },
};

// Helper to get config from URL gameId (e.g., 'spomin-c' -> config for 'c')
export const getSpominConfigFromGameId = (gameId: string): SpominConfig | null => {
  // Extract letter key from gameId (e.g., 'spomin-c' -> 'c', 'spomin-ch' -> 'ch')
  const letterKey = gameId.replace('spomin-', '').toLowerCase();
  return spominConfig[letterKey] || null;
};

// Get all available letter keys
export const getSpominLetterKeys = (): string[] => Object.keys(spominConfig);
