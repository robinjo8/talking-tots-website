// Configuration for "Ponovi Poved" (Repeat the Sentence) game
// Each letter has 4 sentences with 3 words each

export interface SentenceWord {
  word: string;       // Word to display
  image: string;      // Image filename in 'slike' bucket
  audio: string;      // Audio filename in 'zvocni-posnetki' bucket
}

export interface Sentence {
  words: [SentenceWord, SentenceWord, SentenceWord];  // Exactly 3 words
  fullSentence: string;  // Complete sentence text
  audio: string;         // Full sentence audio (may not exist yet)
}

export interface PonoviPovedConfig {
  letter: string;
  displayLetter: string;
  sentences: Sentence[];  // 4 sentences
}

// Supabase storage URLs
export const IMAGES_BASE_URL = "https://ecmtctwovkheohqwahvt.supabase.co/storage/v1/object/public/slike";
export const AUDIO_BASE_URL = "https://ecmtctwovkheohqwahvt.supabase.co/storage/v1/object/public/zvocni-posnetki";

// Helper to get full image URL
export const getImageUrl = (filename: string): string => `${IMAGES_BASE_URL}/${filename}`;

// Helper to get full audio URL
export const getAudioUrl = (filename: string): string => `${AUDIO_BASE_URL}/${filename}`;

// Configuration for letter K
export const ponoviPovedK: PonoviPovedConfig = {
  letter: "k",
  displayLetter: "K",
  sentences: [
    {
      words: [
        { word: "Kača", image: "kaca1.webp", audio: "kaca.m4a" },
        { word: "ima", image: "Stickman_imeti.webp", audio: "ima.m4a" },
        { word: "kapo", image: "kapa1.webp", audio: "kapo.m4a" }
      ],
      fullSentence: "Kača ima kapo.",
      audio: "kaca_ima_kapo.m4a"
    },
    {
      words: [
        { word: "Kuža", image: "kuza1.webp", audio: "kuza.m4a" },
        { word: "vidi", image: "Stickman_gledati.webp", audio: "vidi.m4a" },
        { word: "kost", image: "kost1.webp", audio: "kost.m4a" }
      ],
      fullSentence: "Kuža vidi kost.",
      audio: "kuza_vidi_kost.m4a"
    },
    {
      words: [
        { word: "Koza", image: "koza1.webp", audio: "koza.m4a" },
        { word: "riše", image: "Stickman_risati.webp", audio: "rise.m4a" },
        { word: "krog", image: "krog1.webp", audio: "krog.m4a" }
      ],
      fullSentence: "Koza riše krog.",
      audio: "koza_rise_krog.m4a"
    },
    {
      words: [
        { word: "Kokoš", image: "kokos1.webp", audio: "kokos.m4a" },
        { word: "je", image: "Stickman_jesti.webp", audio: "je.m4a" },
        { word: "koruzo", image: "koruza1.webp", audio: "koruzo.m4a" }
      ],
      fullSentence: "Kokoš je koruzo.",
      audio: "kokos_je_koruzo.m4a"
    }
  ]
};

// Map of all available configurations by letter
const configMap: Record<string, PonoviPovedConfig> = {
  k: ponoviPovedK,
  // Additional letters will be added here:
  // c: ponoviPovedC,
  // ch: ponoviPovedCh, (for Č)
  // l: ponoviPovedL,
  // r: ponoviPovedR,
  // s: ponoviPovedS,
  // sh: ponoviPovedSh, (for Š)
  // z: ponoviPovedZ,
  // zh: ponoviPovedZh, (for Ž)
};

// Get configuration by letter (supports ASCII digraphs)
export const getPonoviPovedConfig = (letter: string): PonoviPovedConfig | null => {
  const normalizedLetter = letter.toLowerCase();
  return configMap[normalizedLetter] || null;
};

// Check if a letter configuration exists
export const hasPonoviPovedConfig = (letter: string): boolean => {
  const normalizedLetter = letter.toLowerCase();
  return normalizedLetter in configMap;
};

// Get all available letters
export const getAvailableLetters = (): string[] => {
  return Object.keys(configMap);
};
