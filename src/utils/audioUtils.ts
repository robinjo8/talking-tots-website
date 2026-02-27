
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
