// Centralized configuration for all DrsnaSestavljanka (Sliding Puzzle) games
// This eliminates the need for 36 separate page components

import { cImages, čImages, kImages, lImages, rImages, sImages, šImages, zImages, žImages, type PuzzleImage } from './puzzleImages';

export interface DrsnaSestavljankaGameConfig {
  letter: string;           // Display letter: "C", "Č", "Š", "Ž", etc.
  urlKey: string;           // ASCII URL key: "c", "ch", "sh", "zh", etc.
  ageGroup: string;         // "34", "56", "78", "910"
  requiredAgeGroup: string; // "3-4", "5-6", "7-8", "9-10"
  puzzleType: '34' | '78' | '910'; // Which SlidingPuzzle component to use
  completionImageCount: number;    // 4 for young, 5 for older
  trackingId: string;       // e.g., "sliding_puzzle_c_3-4"
  images: PuzzleImage[];
}

// Puzzle type and completion image count by age group
// 3-4 and 5-6: SlidingPuzzle34 with 4 completion images
// 7-8: SlidingPuzzle78 with 5 completion images
// 9-10: SlidingPuzzle910 with 5 completion images
const ageGroupSettings: Record<string, { 
  puzzleType: '34' | '78' | '910'; 
  completionImageCount: number;
  requiredAgeGroup: string;
}> = {
  '34': { puzzleType: '34', completionImageCount: 4, requiredAgeGroup: '3-4' },
  '56': { puzzleType: '34', completionImageCount: 4, requiredAgeGroup: '5-6' },
  '78': { puzzleType: '78', completionImageCount: 5, requiredAgeGroup: '7-8' },
  '910': { puzzleType: '910', completionImageCount: 5, requiredAgeGroup: '9-10' }
};

// Letter configurations with ASCII URL keys for reliable routing
const letterConfigs: { letter: string; urlKey: string; images: PuzzleImage[] }[] = [
  { letter: 'C', urlKey: 'c', images: cImages },
  { letter: 'Č', urlKey: 'ch', images: čImages },
  { letter: 'K', urlKey: 'k', images: kImages },
  { letter: 'L', urlKey: 'l', images: lImages },
  { letter: 'R', urlKey: 'r', images: rImages },
  { letter: 'S', urlKey: 's', images: sImages },
  { letter: 'Š', urlKey: 'sh', images: šImages },
  { letter: 'Z', urlKey: 'z', images: zImages },
  { letter: 'Ž', urlKey: 'zh', images: žImages }
];

// Generate all 36 game configurations
export const drsnaSestavljankaConfigs: DrsnaSestavljankaGameConfig[] = [];

letterConfigs.forEach(({ letter, urlKey, images }) => {
  Object.entries(ageGroupSettings).forEach(([ageKey, settings]) => {
    drsnaSestavljankaConfigs.push({
      letter,
      urlKey,
      ageGroup: ageKey,
      requiredAgeGroup: settings.requiredAgeGroup,
      puzzleType: settings.puzzleType,
      completionImageCount: settings.completionImageCount,
      trackingId: `sliding_puzzle_${letter.toLowerCase()}_${settings.requiredAgeGroup}`,
      images
    });
  });
});

// Lookup map for quick access: "ch910" -> config
export const drsnaSestavljankaConfigByUrlKey: Record<string, DrsnaSestavljankaGameConfig> = {};

drsnaSestavljankaConfigs.forEach(config => {
  // Key format: urlKey + ageGroup (e.g., "ch910", "c34", "sh56")
  // For age 3-4, we also support just the letter (e.g., "c", "ch")
  const key = config.ageGroup === '34' 
    ? config.urlKey 
    : `${config.urlKey}${config.ageGroup}`;
  drsnaSestavljankaConfigByUrlKey[key] = config;
  
  // Also add explicit "34" version
  if (config.ageGroup === '34') {
    drsnaSestavljankaConfigByUrlKey[`${config.urlKey}34`] = config;
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
export const findDrsnaSestavljankaConfig = (param: string): DrsnaSestavljankaGameConfig | undefined => {
  // Normalize: lowercase and decode
  const normalized = decodeURIComponent(param).toLowerCase();
  return drsnaSestavljankaConfigByUrlKey[normalized];
};

// Helper function to parse URL parameter into letter and age
export const parseDrsnaSestavljankaUrlParam = (param: string): { urlKey: string; ageGroup: string } | null => {
  const normalized = decodeURIComponent(param).toLowerCase();
  
  // Match patterns like "ch910", "c56", "sh78", "z"
  const match = normalized.match(/^([a-z]{1,2})(34|56|78|910)?$/);
  if (!match) return null;
  
  const urlKey = match[1];
  const ageGroup = match[2] || '34'; // Default to 3-4 if no age suffix
  
  return { urlKey, ageGroup };
};
