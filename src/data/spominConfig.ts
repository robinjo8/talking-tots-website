// Centralized configuration for all Spomin (Memory) games
// This eliminates the need for 9 separate hook files

export interface SpominGameConfig {
  letter: string;           // Display letter: "C", "Č", "Š", "Ž", etc.
  urlKey: string;           // ASCII URL key: "c", "ch", "sh", "zh", etc.
  tableName: string;        // Supabase table name
  queryKey: string;         // React Query cache key
  trackingId: string;       // For progress tracking (e.g., "C", "Č")
}

// All 9 memory game configurations
export const spominConfigs: SpominGameConfig[] = [
  {
    letter: 'C',
    urlKey: 'c',
    tableName: 'memory_cards_c',
    queryKey: 'memoryCardsC',
    trackingId: 'C'
  },
  {
    letter: 'Č',
    urlKey: 'ch',
    tableName: 'memory_cards_Č',
    queryKey: 'memoryCardsCH',
    trackingId: 'Č'
  },
  {
    letter: 'K',
    urlKey: 'k',
    tableName: 'memory_cards_K',
    queryKey: 'memoryCardsK',
    trackingId: 'K'
  },
  {
    letter: 'L',
    urlKey: 'l',
    tableName: 'memory_cards_l',
    queryKey: 'memoryCardsL',
    trackingId: 'L'
  },
  {
    letter: 'R',
    urlKey: 'r',
    tableName: 'memory_cards',  // R uses the base table
    queryKey: 'memoryCardsR',
    trackingId: 'R'
  },
  {
    letter: 'S',
    urlKey: 's',
    tableName: 'memory_cards_S',
    queryKey: 'memoryCardsS',
    trackingId: 'S'
  },
  {
    letter: 'Š',
    urlKey: 'sh',
    tableName: 'memory_cards_Š_duplicate',  // Š uses duplicate table
    queryKey: 'memoryCardsSH',
    trackingId: 'Š'
  },
  {
    letter: 'Z',
    urlKey: 'z',
    tableName: 'memory_cards_z',
    queryKey: 'memoryCardsZ',
    trackingId: 'Z'
  },
  {
    letter: 'Ž',
    urlKey: 'zh',
    tableName: 'memory_cards_Ž',
    queryKey: 'memoryCardsZH',
    trackingId: 'Ž'
  }
];

// Lookup map for quick access by URL key
export const spominConfigByUrlKey: Record<string, SpominGameConfig> = {};

spominConfigs.forEach(config => {
  spominConfigByUrlKey[config.urlKey] = config;
});

// Helper: Convert ASCII URL key to display letter
export const urlKeyToLetter: Record<string, string> = {
  'c': 'C',
  'ch': 'Č',
  'k': 'K',
  'l': 'L',
  'r': 'R',
  's': 'S',
  'sh': 'Š',
  'z': 'Z',
  'zh': 'Ž'
};

// Helper: Convert display letter to ASCII URL key
export const letterToUrlKey: Record<string, string> = {
  'C': 'c',
  'Č': 'ch',
  'K': 'k',
  'L': 'l',
  'R': 'r',
  'S': 's',
  'Š': 'sh',
  'Z': 'z',
  'Ž': 'zh'
};

// Helper function to find config by URL parameter
// URL format: "spomin-c", "spomin-ch", etc.
export const findSpominConfig = (letterId: string): SpominGameConfig | undefined => {
  if (!letterId) return undefined;
  
  // Remove "spomin-" prefix if present
  const urlKey = letterId.replace('spomin-', '').toLowerCase();
  
  return spominConfigByUrlKey[urlKey];
};

// Helper to convert letter to ASCII-safe URL path
export const toAsciiSpominPath = (letter: string): string => {
  const urlKey = letterToUrlKey[letter] || letter.toLowerCase();
  return `/govorne-igre/spomin/spomin-${urlKey}`;
};
