// Centralized configuration for all Zaporedja (Sequence) games
// This eliminates the need for 36 separate page components

export interface ZaporedjaGameConfig {
  letter: string;           // Display letter: "C", "Č", "Š", "Ž", etc.
  urlKey: string;           // ASCII URL key: "c", "ch", "sh", "zh", etc.
  ageGroup: string;         // "34", "56", "78", "910"
  requiredAgeGroup: string; // "3-4", "5-6", "7-8", "9-10"
  tableName: string;        // Supabase table name for images
  queryKey: string;         // React Query cache key
  trackingId: string;       // e.g., "sequence_c_3-4"
  gameType: '34' | '56' | '78' | '910'; // Which game variant to use
}

// Table name mapping for each letter
// Some have special table names (e.g., memory_cards for R, memory_cards_Š_duplicate for Š)
const letterTableMap: Record<string, string> = {
  'c': 'memory_cards_c',
  'č': 'memory_cards_Č',
  'k': 'memory_cards_K',
  'l': 'memory_cards_l',
  'r': 'memory_cards',  // R uses base table
  's': 'memory_cards_S',
  'š': 'memory_cards_Š_duplicate',  // Š uses duplicate table
  'z': 'memory_cards_z',
  'ž': 'memory_cards_Ž'
};

// Age group settings
const ageGroupSettings: Record<string, { 
  gameType: '34' | '56' | '78' | '910';
  requiredAgeGroup: string;
}> = {
  '34': { gameType: '34', requiredAgeGroup: '3-4' },
  '56': { gameType: '56', requiredAgeGroup: '5-6' },
  '78': { gameType: '78', requiredAgeGroup: '7-8' },
  '910': { gameType: '910', requiredAgeGroup: '9-10' }
};

// Letter configurations with ASCII URL keys for reliable routing
const letterConfigs: { letter: string; urlKey: string }[] = [
  { letter: 'C', urlKey: 'c' },
  { letter: 'Č', urlKey: 'ch' },
  { letter: 'K', urlKey: 'k' },
  { letter: 'L', urlKey: 'l' },
  { letter: 'R', urlKey: 'r' },
  { letter: 'S', urlKey: 's' },
  { letter: 'Š', urlKey: 'sh' },
  { letter: 'Z', urlKey: 'z' },
  { letter: 'Ž', urlKey: 'zh' }
];

// Generate all 36 game configurations
export const zaporedjaConfigs: ZaporedjaGameConfig[] = [];

letterConfigs.forEach(({ letter, urlKey }) => {
  const tableKey = urlKey === 'ch' ? 'č' : urlKey === 'sh' ? 'š' : urlKey === 'zh' ? 'ž' : urlKey;
  const tableName = letterTableMap[tableKey];
  
  Object.entries(ageGroupSettings).forEach(([ageKey, settings]) => {
    zaporedjaConfigs.push({
      letter,
      urlKey,
      ageGroup: ageKey,
      requiredAgeGroup: settings.requiredAgeGroup,
      tableName,
      queryKey: `${tableName}_${ageKey}`,
      trackingId: `sequence_${letter.toLowerCase()}_${settings.requiredAgeGroup}`,
      gameType: settings.gameType
    });
  });
});

// Lookup map for quick access: "ch910" -> config
export const zaporedjaConfigByUrlKey: Record<string, ZaporedjaGameConfig> = {};

zaporedjaConfigs.forEach(config => {
  // Key format: urlKey + ageGroup (e.g., "ch910", "c34", "sh56")
  // For age 3-4, we also support just the letter (e.g., "c", "ch")
  const key = config.ageGroup === '34' 
    ? config.urlKey 
    : `${config.urlKey}${config.ageGroup}`;
  zaporedjaConfigByUrlKey[key] = config;
  
  // Also add explicit "34" version
  if (config.ageGroup === '34') {
    zaporedjaConfigByUrlKey[`${config.urlKey}34`] = config;
  }
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
export const letterToAscii: Record<string, string> = {
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
  return letterToAscii[letter] || letter.toLowerCase();
};

// Helper function to find config by URL parameter
export const findZaporedjaConfig = (param: string): ZaporedjaGameConfig | undefined => {
  // Normalize: lowercase and decode
  const normalized = decodeURIComponent(param).toLowerCase();
  return zaporedjaConfigByUrlKey[normalized];
};

// Helper function to parse URL parameter into letter and age
export const parseZaporedjaUrlParam = (param: string): { urlKey: string; ageGroup: string } | null => {
  const normalized = decodeURIComponent(param).toLowerCase();
  
  // Match patterns like "ch910", "c56", "sh78", "z"
  const match = normalized.match(/^([a-z]{1,2})(34|56|78|910)?$/);
  if (!match) return null;
  
  const urlKey = match[1];
  const ageGroup = match[2] || '34'; // Default to 3-4 if no age suffix
  
  return { urlKey, ageGroup };
};
