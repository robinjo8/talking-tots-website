// Centralized configuration for Labirint (Maze) games
// Uses ASCII-safe URL keys for Slovenian diacritics (č→ch, š→sh, ž→zh)

export interface LabirintConfig {
  letter: string;         // Original Slovenian letter
  displayLetter: string;  // Display version (uppercase)
  urlKey: string;         // ASCII-safe URL key
  gradient: string;       // Tailwind gradient classes
  image: string;          // Dragon character image URL
  description: string;    // Slovenian description
}

export const labirintConfigs: LabirintConfig[] = [
  {
    letter: 'c',
    displayLetter: 'C',
    urlKey: 'c',
    gradient: 'from-dragon-green/20 to-dragon-green/20',
    image: 'https://ecmtctwovkheohqwahvt.supabase.co/storage/v1/object/public/zmajcki/zmajcek_crka_C.png',
    description: 'Poišči pot skozi labirint s črko C'
  },
  {
    letter: 'č',
    displayLetter: 'Č',
    urlKey: 'ch',
    gradient: 'from-app-blue/20 to-app-teal/20',
    image: 'https://ecmtctwovkheohqwahvt.supabase.co/storage/v1/object/public/zmajcki/zmajcek_crka_CH.png',
    description: 'Poišči pot skozi labirint s črko Č'
  },
  {
    letter: 'k',
    displayLetter: 'K',
    urlKey: 'k',
    gradient: 'from-app-orange/20 to-app-yellow/20',
    image: 'https://ecmtctwovkheohqwahvt.supabase.co/storage/v1/object/public/zmajcki/zmajcek_crka_K.png',
    description: 'Poišči pot skozi labirint s črko K'
  },
  {
    letter: 'l',
    displayLetter: 'L',
    urlKey: 'l',
    gradient: 'from-app-purple/20 to-app-blue/20',
    image: 'https://ecmtctwovkheohqwahvt.supabase.co/storage/v1/object/public/zmajcki/zmajcek_crka_L.png',
    description: 'Poišči pot skozi labirint s črko L'
  },
  {
    letter: 'r',
    displayLetter: 'R',
    urlKey: 'r',
    gradient: 'from-app-purple/20 to-app-teal/20',
    image: 'https://ecmtctwovkheohqwahvt.supabase.co/storage/v1/object/public/zmajcki/zmajcek_crka_R.png',
    description: 'Poišči pot skozi labirint s črko R'
  },
  {
    letter: 's',
    displayLetter: 'S',
    urlKey: 's',
    gradient: 'from-dragon-green/20 to-app-teal/20',
    image: 'https://ecmtctwovkheohqwahvt.supabase.co/storage/v1/object/public/zmajcki/zmajcek_crka_S.png',
    description: 'Poišči pot skozi labirint s črko S'
  },
  {
    letter: 'š',
    displayLetter: 'Š',
    urlKey: 'sh',
    gradient: 'from-app-blue/20 to-app-purple/20',
    image: 'https://ecmtctwovkheohqwahvt.supabase.co/storage/v1/object/public/zmajcki/zmajcek_crka_SH.png',
    description: 'Poišči pot skozi labirint s črko Š'
  },
  {
    letter: 'z',
    displayLetter: 'Z',
    urlKey: 'z',
    gradient: 'from-app-teal/20 to-dragon-green/20',
    image: 'https://ecmtctwovkheohqwahvt.supabase.co/storage/v1/object/public/zmajcki/zmajcek_crka_Z.png',
    description: 'Poišči pot skozi labirint s črko Z'
  },
  {
    letter: 'ž',
    displayLetter: 'Ž',
    urlKey: 'zh',
    gradient: 'from-app-purple/20 to-app-blue/20',
    image: 'https://ecmtctwovkheohqwahvt.supabase.co/storage/v1/object/public/zmajcki/zmajcek_crka_ZH.png',
    description: 'Poišči pot skozi labirint s črko Ž'
  }
];

/**
 * Get labirint configuration by URL key
 * @param urlKey - ASCII-safe URL key (c, ch, k, l, r, s, sh, z, zh)
 */
export function getLabirintConfig(urlKey: string): LabirintConfig | undefined {
  return labirintConfigs.find(c => c.urlKey.toLowerCase() === urlKey.toLowerCase());
}

/**
 * Convert Slovenian letter to ASCII-safe URL key
 * @param letter - Original letter (C, Č, K, L, R, S, Š, Z, Ž)
 */
export function letterToUrlKey(letter: string): string {
  const letterMap: Record<string, string> = {
    'č': 'ch', 'Č': 'ch',
    'š': 'sh', 'Š': 'sh',
    'ž': 'zh', 'Ž': 'zh'
  };
  return letterMap[letter] || letter.toLowerCase();
}
