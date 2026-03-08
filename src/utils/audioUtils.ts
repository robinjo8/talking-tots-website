
export const playAudio = (audioUrl: string, audioRef: React.RefObject<HTMLAudioElement>) => {
  if (audioRef.current) {
    audioRef.current.src = audioUrl;
    audioRef.current.play().catch(error => {
      console.error("Error playing audio:", error);
    });
  }
};

export const handlePlayRozaAudio = (audioRef: React.RefObject<HTMLAudioElement>) => {
  const audioUrl = "https://ecmtctwovkheohqwahvt.supabase.co/storage/v1/object/public/zvocni-posnetki/Roza.mp3";
  playAudio(audioUrl, audioRef);
};

/**
 * Convert a word to the standardized audio filename format.
 * Rules:
 * - Remove diacritics (š→s, č→c, ž→z)
 * - Lowercase everything
 * - Capitalize first letter
 * - Add .mp3 extension
 * 
 * Example: "kača" → "Kaca.mp3", "žaba" → "Zaba.mp3"
 * 
 * NOTE: Special cases (kokoš/kokos, koš/kos, koza/koža) must use
 * explicit audio fields in configs, not this auto-generation.
 */
export const toAudioFilename = (word: string): string => {
  const normalized = word
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '');
  return normalized.charAt(0).toUpperCase() + normalized.slice(1) + '.mp3';
};

/**
 * Special filename mappings for ambiguous words in the database.
 * Maps the .m4a filename (without extension) to the correct .mp3 filename (without extension).
 */
const AUDIO_FILENAME_MAP: Record<string, string> = {
  'kokos_1': 'Kokos_zival',
  'kokos_sadez': 'Kokos_sadez',
  'koza_skin': 'Koza_cutilo',
  'koza': 'Koza_zival',
  'kos': 'Kos_predmet',
};

const SUPABASE_AUDIO_BASE = 'https://ecmtctwovkheohqwahvt.supabase.co/storage/v1/object/public/zvocni-posnetki/';

/**
 * Normalize an audio URL from the database.
 * Converts .m4a URLs to .mp3 with proper capitalization.
 * Handles special cases via AUDIO_FILENAME_MAP.
 * If URL is already .mp3 or null/empty, returns as-is.
 */
export const normalizeAudioUrl = (url: string | null): string | null => {
  if (!url) return url;
  if (!url.includes('.m4a')) return url;

  // Extract filename without extension from the URL
  const lastSlash = url.lastIndexOf('/');
  const filenameWithExt = url.substring(lastSlash + 1);
  const filename = filenameWithExt.replace('.m4a', '');

  // Check special mapping first
  if (AUDIO_FILENAME_MAP[filename]) {
    return SUPABASE_AUDIO_BASE + AUDIO_FILENAME_MAP[filename] + '.mp3';
  }

  // Default: capitalize first letter, remove diacritics
  const normalized = filename
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '');
  const capitalized = normalized.charAt(0).toUpperCase() + normalized.slice(1);
  return SUPABASE_AUDIO_BASE + capitalized + '.mp3';
};
