// Centralized configuration for all Spomin (Memory) games
// This eliminates the need for 9 separate hook files

export interface SpominGameConfig {
  letter: string;           // Display letter: "C", "Č", "Š", "Ž", etc.
  urlKey: string;           // ASCII URL key: "c", "ch", "sh", "zh", etc.
  tableName: string;        // Supabase table name
  queryKey: string;         // React Query cache key
  trackingId: string;       // Progress tracking ID
  dragonImage: string;      // Dragon mascot image URL
}

const SUPABASE_URL = "https://ecmtctwovkheohqwahvt.supabase.co";

// Letter configurations with ASCII URL keys for reliable routing
const letterConfigs: SpominGameConfig[] = [
  {
    letter: 'C',
    urlKey: 'c',
    tableName: 'memory_cards_c',
    queryKey: 'memoryCardsC',
    trackingId: 'C',
    dragonImage: `${SUPABASE_URL}/storage/v1/object/public/zmajcki/zmajcek_crka_C.png`
  },
  {
    letter: 'Č',
    urlKey: 'ch',
    tableName: 'memory_cards_Č',
    queryKey: 'memoryCardsCh',
    trackingId: 'Č',
    dragonImage: `${SUPABASE_URL}/storage/v1/object/public/zmajcki/zmajcek_crka_CH.png`
  },
  {
    letter: 'K',
    urlKey: 'k',
    tableName: 'memory_cards_K',
    queryKey: 'memoryCardsK',
    trackingId: 'K',
    dragonImage: `${SUPABASE_URL}/storage/v1/object/public/zmajcki/zmajcek_crka_K.png`
  },
  {
    letter: 'L',
    urlKey: 'l',
    tableName: 'memory_cards_l',
    queryKey: 'memoryCardsL',
    trackingId: 'L',
    dragonImage: `${SUPABASE_URL}/storage/v1/object/public/zmajcki/zmajcek_crka_L.png`
  },
  {
    letter: 'R',
    urlKey: 'r',
    tableName: 'memory_cards_r',  // Note: lowercase 'r' in actual table
    queryKey: 'memoryCardsR',
    trackingId: 'R',
    dragonImage: `${SUPABASE_URL}/storage/v1/object/public/zmajcki/zmajcek_crka_R.png`
  },
  {
    letter: 'S',
    urlKey: 's',
    tableName: 'memory_cards_S',
    queryKey: 'memoryCardsS',
    trackingId: 'S',
    dragonImage: `${SUPABASE_URL}/storage/v1/object/public/zmajcki/zmajcek_crka_S.png`
  },
  {
    letter: 'Š',
    urlKey: 'sh',
    tableName: 'memory_cards_Š_duplicate',  // Note: actual table name
    queryKey: 'memoryCardsSh',
    trackingId: 'Š',
    dragonImage: `${SUPABASE_URL}/storage/v1/object/public/zmajcki/zmajcek_crka_SH.png`
  },
  {
    letter: 'Z',
    urlKey: 'z',
    tableName: 'memory_cards_z',
    queryKey: 'memoryCardsZ',
    trackingId: 'Z',
    dragonImage: `${SUPABASE_URL}/storage/v1/object/public/zmajcki/zmajcek_crka_Z.png`
  },
  {
    letter: 'Ž',
    urlKey: 'zh',
    tableName: 'memory_cards_Ž',
    queryKey: 'memoryCardsZh',
    trackingId: 'Ž',
    dragonImage: `${SUPABASE_URL}/storage/v1/object/public/zmajcki/zmajcek_crka_ZH.png`
  }
];

// Export all configs
export const spominConfigs = letterConfigs;

// Lookup map for quick access: "ch" -> config, "c" -> config
export const configByUrlKey: Record<string, SpominGameConfig> = {};

letterConfigs.forEach(config => {
  configByUrlKey[config.urlKey] = config;
});

// Helper: Convert digraph to diacritic for display
export const digraphToLetter: Record<string, string> = {
  'ch': 'Č',
  'sh': 'Š',
  'zh': 'Ž',
  'c': 'C',
  'k': 'K',
  'l': 'L',
  'r': 'R',
  's': 'S',
  'z': 'Z'
};

// Helper: Convert diacritic to ASCII for URLs
export const letterToDigraph: Record<string, string> = {
  'č': 'ch',
  'š': 'sh',
  'ž': 'zh',
  'c': 'c',
  'k': 'k',
  'l': 'l',
  'r': 'r',
  's': 's',
  'z': 'z',
  // Uppercase versions
  'Č': 'ch',
  'Š': 'sh',
  'Ž': 'zh',
  'C': 'c',
  'K': 'k',
  'L': 'l',
  'R': 'r',
  'S': 's',
  'Z': 'z'
};

// Helper function to convert letter to ASCII URL key
export const toAsciiUrl = (letter: string): string => {
  return letterToDigraph[letter] || letter.toLowerCase();
};

// Helper function to find config by URL parameter
export const findConfigByUrlKey = (urlKey: string): SpominGameConfig | undefined => {
  const normalized = decodeURIComponent(urlKey).toLowerCase();
  return configByUrlKey[normalized];
};

// Helper function to get table name by URL key (for direct usage)
export const getTableNameByUrlKey = (urlKey: string): string | undefined => {
  const config = findConfigByUrlKey(urlKey);
  return config?.tableName;
};
