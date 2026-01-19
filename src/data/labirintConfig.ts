// Centralized configuration for Labirint (Maze) games
// Uses ASCII-safe URL keys for Slovenian diacritics (č→ch, š→sh, ž→zh)

import { PuzzleImage, cImages, čImages, kImages, lImages, rImages, sImages, šImages, zImages, žImages } from './puzzleImages';

export interface LabirintConfig {
  letter: string;         // Original Slovenian letter
  displayLetter: string;  // Display version (uppercase)
  urlKey: string;         // ASCII-safe URL key
  gradient: string;       // Tailwind gradient classes
  image: string;          // Dragon character image URL
  description: string;    // Slovenian description
  images: PuzzleImage[];  // Images for completion dialog
  trackingId: string;     // For progress tracking
}

export const labirintConfigs: LabirintConfig[] = [
  {
    letter: 'c',
    displayLetter: 'C',
    urlKey: 'c',
    gradient: 'from-dragon-green/20 to-dragon-green/20',
    image: 'https://ecmtctwovkheohqwahvt.supabase.co/storage/v1/object/public/zmajcki/zmajcek_crka_C.png',
    description: 'Poišči pot skozi labirint s črko C',
    images: cImages,
    trackingId: 'labirint-c'
  },
  {
    letter: 'č',
    displayLetter: 'Č',
    urlKey: 'ch',
    gradient: 'from-app-blue/20 to-app-teal/20',
    image: 'https://ecmtctwovkheohqwahvt.supabase.co/storage/v1/object/public/zmajcki/zmajcek_crka_CH.png',
    description: 'Poišči pot skozi labirint s črko Č',
    images: čImages,
    trackingId: 'labirint-ch'
  },
  {
    letter: 'k',
    displayLetter: 'K',
    urlKey: 'k',
    gradient: 'from-app-orange/20 to-app-yellow/20',
    image: 'https://ecmtctwovkheohqwahvt.supabase.co/storage/v1/object/public/zmajcki/zmajcek_crka_K.png',
    description: 'Poišči pot skozi labirint s črko K',
    images: kImages,
    trackingId: 'labirint-k'
  },
  {
    letter: 'l',
    displayLetter: 'L',
    urlKey: 'l',
    gradient: 'from-app-purple/20 to-app-blue/20',
    image: 'https://ecmtctwovkheohqwahvt.supabase.co/storage/v1/object/public/zmajcki/zmajcek_crka_L.png',
    description: 'Poišči pot skozi labirint s črko L',
    images: lImages,
    trackingId: 'labirint-l'
  },
  {
    letter: 'r',
    displayLetter: 'R',
    urlKey: 'r',
    gradient: 'from-app-purple/20 to-app-teal/20',
    image: 'https://ecmtctwovkheohqwahvt.supabase.co/storage/v1/object/public/zmajcki/zmajcek_crka_R.png',
    description: 'Poišči pot skozi labirint s črko R',
    images: rImages,
    trackingId: 'labirint-r'
  },
  {
    letter: 's',
    displayLetter: 'S',
    urlKey: 's',
    gradient: 'from-dragon-green/20 to-app-teal/20',
    image: 'https://ecmtctwovkheohqwahvt.supabase.co/storage/v1/object/public/zmajcki/zmajcek_crka_S.png',
    description: 'Poišči pot skozi labirint s črko S',
    images: sImages,
    trackingId: 'labirint-s'
  },
  {
    letter: 'š',
    displayLetter: 'Š',
    urlKey: 'sh',
    gradient: 'from-app-blue/20 to-app-purple/20',
    image: 'https://ecmtctwovkheohqwahvt.supabase.co/storage/v1/object/public/zmajcki/zmajcek_crka_SH.png',
    description: 'Poišči pot skozi labirint s črko Š',
    images: šImages,
    trackingId: 'labirint-sh'
  },
  {
    letter: 'z',
    displayLetter: 'Z',
    urlKey: 'z',
    gradient: 'from-app-teal/20 to-dragon-green/20',
    image: 'https://ecmtctwovkheohqwahvt.supabase.co/storage/v1/object/public/zmajcki/zmajcek_crka_Z.png',
    description: 'Poišči pot skozi labirint s črko Z',
    images: zImages,
    trackingId: 'labirint-z'
  },
  {
    letter: 'ž',
    displayLetter: 'Ž',
    urlKey: 'zh',
    gradient: 'from-app-purple/20 to-app-blue/20',
    image: 'https://ecmtctwovkheohqwahvt.supabase.co/storage/v1/object/public/zmajcki/zmajcek_crka_ZH.png',
    description: 'Poišči pot skozi labirint s črko Ž',
    images: žImages,
    trackingId: 'labirint-zh'
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
