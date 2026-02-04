// Centralized configuration for Povezi Pare (Matching) games
// Consolidates 8 separate routes into a dynamic routing system

export interface PoveziPareConfig {
  letter: string;           // Display letter: "C", "Č", "Š", "Ž", etc.
  urlKey: string;           // ASCII URL key: "c", "ch", "sh", "zh", etc.
  ageGroup: string;         // "34", "56", "78", "910"
  requiredAgeGroup: string; // "3-4", "5-6", "7-8", "9-10"
  gameType: 'matching' | 'threeColumn' | 'fourColumn';
  numColumns: number;       // 2, 3, or 4 columns
  gradient: string;         // Card gradient class
  image: string;            // Dragon image URL
  description: string;      // Card description
}

// Letters available for each age group
const lettersByAge: Record<string, string[]> = {
  '34': ['C', 'Č', 'K', 'L'],
  '56': ['C', 'Č', 'K', 'L', 'R', 'S', 'Š', 'Z', 'Ž'],
  '78': ['C', 'Č', 'K', 'L', 'R', 'S', 'Š', 'Z', 'Ž'],
  '910': ['C', 'Č', 'K', 'L', 'R', 'S', 'Š', 'Z', 'Ž']
};

// Game type settings by age group
const ageGroupSettings: Record<string, { 
  gameType: 'matching' | 'threeColumn' | 'fourColumn';
  numColumns: number;
  requiredAgeGroup: string;
}> = {
  '34': { gameType: 'matching', numColumns: 2, requiredAgeGroup: '3-4' },
  '56': { gameType: 'threeColumn', numColumns: 3, requiredAgeGroup: '5-6' },
  '78': { gameType: 'matching', numColumns: 3, requiredAgeGroup: '7-8' },
  '910': { gameType: 'fourColumn', numColumns: 4, requiredAgeGroup: '9-10' }
};

// Letter visual configurations
const letterVisuals: Record<string, { gradient: string; image: string; description: string }> = {
  'C': {
    gradient: 'from-dragon-green/20 to-dragon-green/20',
    image: 'https://ecmtctwovkheohqwahvt.supabase.co/storage/v1/object/public/zmajcki/zmajcek_crka_C.png',
    description: 'Pomagaj Tomiju povezati pare s črko C'
  },
  'Č': {
    gradient: 'from-app-blue/20 to-app-teal/20',
    image: 'https://ecmtctwovkheohqwahvt.supabase.co/storage/v1/object/public/zmajcki/zmajcek_crka_CH.png',
    description: 'Pomagaj Tomiju povezati pare s črko Č'
  },
  'K': {
    gradient: 'from-app-orange/20 to-app-yellow/20',
    image: 'https://ecmtctwovkheohqwahvt.supabase.co/storage/v1/object/public/zmajcki/zmajcek_crka_K.png',
    description: 'Pomagaj Tomiju povezati pare s črko K'
  },
  'L': {
    gradient: 'from-app-purple/20 to-app-blue/20',
    image: 'https://ecmtctwovkheohqwahvt.supabase.co/storage/v1/object/public/zmajcki/zmajcek_crka_L.png',
    description: 'Pomagaj Tomiju povezati pare s črko L'
  },
  'R': {
    gradient: 'from-app-purple/20 to-app-teal/20',
    image: 'https://ecmtctwovkheohqwahvt.supabase.co/storage/v1/object/public/zmajcki/zmajcek_crka_R.png',
    description: 'Pomagaj Tomiju povezati pare s črko R'
  },
  'S': {
    gradient: 'from-dragon-green/20 to-app-teal/20',
    image: 'https://ecmtctwovkheohqwahvt.supabase.co/storage/v1/object/public/zmajcki/zmajcek_crka_S.png',
    description: 'Pomagaj Tomiju povezati pare s črko S'
  },
  'Š': {
    gradient: 'from-app-blue/20 to-app-purple/20',
    image: 'https://ecmtctwovkheohqwahvt.supabase.co/storage/v1/object/public/zmajcki/zmajcek_crka_SH.png',
    description: 'Pomagaj Tomiju povezati pare s črko Š'
  },
  'Z': {
    gradient: 'from-app-teal/20 to-dragon-green/20',
    image: 'https://ecmtctwovkheohqwahvt.supabase.co/storage/v1/object/public/zmajcki/zmajcek_crka_Z.png',
    description: 'Pomagaj Tomiju povezati pare s črko Z'
  },
  'Ž': {
    gradient: 'from-app-purple/20 to-app-blue/20',
    image: 'https://ecmtctwovkheohqwahvt.supabase.co/storage/v1/object/public/zmajcki/zmajcek_crka_ZH.png',
    description: 'Pomagaj Tomiju povezati pare s črko Ž'
  }
};

// ASCII URL mapping for Slovenian diacritics
export const letterToUrlKey: Record<string, string> = {
  'C': 'c', 'c': 'c',
  'Č': 'ch', 'č': 'ch',
  'K': 'k', 'k': 'k',
  'L': 'l', 'l': 'l',
  'R': 'r', 'r': 'r',
  'S': 's', 's': 's',
  'Š': 'sh', 'š': 'sh',
  'Z': 'z', 'z': 'z',
  'Ž': 'zh', 'ž': 'zh'
};

// Reverse mapping: URL key to display letter
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

// Convert letter to ASCII URL key
export const toAsciiUrl = (letter: string): string => {
  return letterToUrlKey[letter] || letter.toLowerCase();
};

// Get letters for a specific age group with visual data
export const getLettersForAgeGroup = (ageGroup: string): PoveziPareConfig[] => {
  const letters = lettersByAge[ageGroup] || lettersByAge['34'];
  const settings = ageGroupSettings[ageGroup] || ageGroupSettings['34'];
  
  return letters.map(letter => {
    const visual = letterVisuals[letter];
    return {
      letter,
      urlKey: toAsciiUrl(letter),
      ageGroup,
      requiredAgeGroup: settings.requiredAgeGroup,
      gameType: settings.gameType,
      numColumns: settings.numColumns,
      gradient: visual?.gradient || 'from-gray-200 to-gray-300',
      image: visual?.image || '',
      description: visual?.description || `Glas ${letter}`
    };
  });
};

// Find config for a specific letter and age group
export const findPoveziPareConfig = (ageGroup: string, urlKey: string): PoveziPareConfig | null => {
  const letter = urlKeyToLetter[urlKey.toLowerCase()];
  if (!letter) return null;
  
  const letters = lettersByAge[ageGroup];
  if (!letters || !letters.includes(letter)) return null;
  
  const settings = ageGroupSettings[ageGroup];
  if (!settings) return null;
  
  const visual = letterVisuals[letter];
  
  return {
    letter,
    urlKey: urlKey.toLowerCase(),
    ageGroup,
    requiredAgeGroup: settings.requiredAgeGroup,
    gameType: settings.gameType,
    numColumns: settings.numColumns,
    gradient: visual?.gradient || 'from-gray-200 to-gray-300',
    image: visual?.image || '',
    description: visual?.description || `Glas ${letter}`
  };
};

// Get age group display name
export const getAgeGroupDisplayName = (ageGroup: string): string => {
  const names: Record<string, string> = {
    '34': '3-4 leta',
    '56': '5-6 let',
    '78': '7-8 let',
    '910': '9-10 let'
  };
  return names[ageGroup] || ageGroup;
};

// Validate age group
export const isValidAgeGroup = (ageGroup: string): boolean => {
  return ['34', '56', '78', '910'].includes(ageGroup);
};
