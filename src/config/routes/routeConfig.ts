/**
 * Centralizirana konfiguracija routov
 * 
 * Ta datoteka vsebuje konfiguracijo za dinamično generiranje routov.
 * Namesto 250+ ročnih Route zapisov imamo eno konfiguracijo.
 */

// Podprte črke
export const SUPPORTED_LETTERS = ['c', 'č', 'k', 'l', 'r', 's', 'š', 'z', 'ž'] as const;
export type SupportedLetter = typeof SUPPORTED_LETTERS[number];

// Starostne skupine
export const AGE_GROUPS = ['34', '56', '78', '910'] as const;
export type AgeGroup = typeof AGE_GROUPS[number];

// Helper za pretvorbo črke v komponento ime
export const letterToComponentName = (letter: string): string => {
  const map: Record<string, string> = {
    'c': 'C',
    'č': 'Č',
    'k': 'K',
    'l': 'L',
    'r': 'R',
    's': 'S',
    'š': 'Š',
    'z': 'Z',
    'ž': 'Ž',
  };
  return map[letter] || letter.toUpperCase();
};

// Konfiguracija iger
export interface GameConfig {
  basePath: string;
  componentPrefix: string;
  hasAgeGroups: boolean;
  ageGroups?: AgeGroup[];
  hasBaseLetterRoute?: boolean; // Za 3-4 leta brez suffiksa
}

export const GAME_CONFIGS: Record<string, GameConfig> = {
  spomin: {
    basePath: '/govorne-igre/spomin',
    componentPrefix: 'Spomin',
    hasAgeGroups: false,
    hasBaseLetterRoute: true,
  },
  sestavljanke: {
    basePath: '/govorne-igre/sestavljanke',
    componentPrefix: 'Sestavljanke',
    hasAgeGroups: true,
    ageGroups: ['56', '78', '910'],
    hasBaseLetterRoute: true, // 3-4 leta brez suffiksa
  },
  zaporedja: {
    basePath: '/govorne-igre/zaporedja',
    componentPrefix: 'Zaporedja',
    hasAgeGroups: true,
    ageGroups: ['56', '78', '910'],
    hasBaseLetterRoute: true,
  },
  drsnaSestavljanka: {
    basePath: '/govorne-igre/drsna-sestavljanka',
    componentPrefix: 'DrsnaSestavljanka',
    hasAgeGroups: true,
    ageGroups: ['34', '56', '78', '910'],
    hasBaseLetterRoute: false,
  },
  igraUjemanja: {
    basePath: '/govorne-igre/igra-ujemanja',
    componentPrefix: 'IgraUjemanja',
    hasAgeGroups: true,
    ageGroups: ['56', '78', '910'],
    hasBaseLetterRoute: true,
  },
  labirint: {
    basePath: '/govorne-igre/labirint',
    componentPrefix: 'Labirint',
    hasAgeGroups: false,
    hasBaseLetterRoute: true,
  },
};

// Legacy poti za backward compatibility
export const LEGACY_GAME_ROUTES: Record<string, string> = {
  '/spomin-games': '/govorne-igre/spomin',
  '/sestavljanke-games': '/govorne-igre/sestavljanke',
  '/zaporedja': '/govorne-igre/zaporedja',
  '/drsna-sestavljanka': '/govorne-igre/drsna-sestavljanka',
  '/igra-ujemanja': '/govorne-igre/igra-ujemanja',
  '/labirint': '/govorne-igre/labirint',
};
