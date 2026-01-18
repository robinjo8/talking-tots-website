// Centralized configuration for all Sestavljanke (Puzzle) games
// This eliminates the need for 36 separate page components

import { cImages, čImages, kImages, lImages, rImages, sImages, šImages, zImages, žImages, type PuzzleImage } from './puzzleImages';

export interface SestavljankeGameConfig {
  letter: string;           // Display letter: "C", "Č", "Š", "Ž", etc.
  urlKey: string;           // ASCII URL key: "c", "ch", "sh", "zh", etc.
  ageGroup: string;         // "34", "56", "78", "910"
  requiredAgeGroup: string; // "3-4", "5-6", "7-8", "9-10"
  gridCols: number;
  gridRows: number;
  trackingId: string;       // e.g., "puzzle_c_6", "puzzle_č_20"
  images: PuzzleImage[];
}

// Grid configurations by age group
// 3-4: 3x3 = 9 pieces (actually 3x2 = 6 pieces based on existing code)
// 5-6: 4x3 = 12 pieces
// 7-8: 5x4 = 20 pieces (actually 4x4 = 16 based on existing code)
// 9-10: 6x5 = 30 pieces (actually 5x4 = 20 based on existing code)

const gridByAge: Record<string, { cols: number; rows: number; pieces: number }> = {
  '34': { cols: 3, rows: 3, pieces: 9 },
  '56': { cols: 4, rows: 3, pieces: 12 },
  '78': { cols: 5, rows: 4, pieces: 20 },
  '910': { cols: 6, rows: 5, pieces: 30 }
};

const ageGroupMap: Record<string, string> = {
  '34': '3-4',
  '56': '5-6',
  '78': '7-8',
  '910': '9-10'
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
export const sestavljankeConfigs: SestavljankeGameConfig[] = [];

letterConfigs.forEach(({ letter, urlKey, images }) => {
  Object.entries(gridByAge).forEach(([ageKey, grid]) => {
    sestavljankeConfigs.push({
      letter,
      urlKey,
      ageGroup: ageKey,
      requiredAgeGroup: ageGroupMap[ageKey],
      gridCols: grid.cols,
      gridRows: grid.rows,
      trackingId: `puzzle_${letter.toLowerCase()}_${grid.pieces}`,
      images
    });
  });
});

// Lookup map for quick access: "ch910" -> config
export const configByUrlKey: Record<string, SestavljankeGameConfig> = {};

sestavljankeConfigs.forEach(config => {
  // Key format: urlKey + ageGroup (e.g., "ch910", "c34", "sh56")
  // For age 3-4, we also support just the letter (e.g., "c", "ch")
  const key = config.ageGroup === '34' 
    ? config.urlKey 
    : `${config.urlKey}${config.ageGroup}`;
  configByUrlKey[key] = config;
  
  // Also add explicit "34" version
  if (config.ageGroup === '34') {
    configByUrlKey[`${config.urlKey}34`] = config;
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
export const findConfigByParam = (param: string): SestavljankeGameConfig | undefined => {
  // Normalize: lowercase and decode
  const normalized = decodeURIComponent(param).toLowerCase();
  return configByUrlKey[normalized];
};

// Helper function to parse URL parameter into letter and age
export const parseUrlParam = (param: string): { urlKey: string; ageGroup: string } | null => {
  const normalized = decodeURIComponent(param).toLowerCase();
  
  // Match patterns like "ch910", "c56", "sh78", "z"
  const match = normalized.match(/^([a-z]{1,2})(34|56|78|910)?$/);
  if (!match) return null;
  
  const urlKey = match[1];
  const ageGroup = match[2] || '34'; // Default to 3-4 if no age suffix
  
  return { urlKey, ageGroup };
};
