import { articulationData } from '@/data/articulationTestData';

// Fonetični vrstni red črk
export const PHONETIC_ORDER = ['P', 'B', 'M', 'T', 'D', 'K', 'G', 'N', 'H', 'V', 'J', 'F', 'L', 'S', 'Z', 'C', 'Š', 'Ž', 'Č', 'R'] as const;

export type PhoneticLetter = typeof PHONETIC_ORDER[number];

// Dinamično mapiranje wordIndex → črka iz articulationTestData
// articulationTestData je v abecednem vrstnem redu, ne fonetičnem
const wordIndexToLetterMap = new Map<number, string>();
const wordIndexToWordMap = new Map<number, string>();
let currentIndex = 0;
articulationData.forEach(letterData => {
  letterData.words.forEach(word => {
    wordIndexToLetterMap.set(currentIndex, letterData.letter);
    wordIndexToWordMap.set(currentIndex, word.text);
    currentIndex++;
  });
});

export function getLetterFromWordIndex(wordIndex: number): string {
  return wordIndexToLetterMap.get(wordIndex) || 'X';
}

export function getWordFromWordIndex(wordIndex: number): string {
  return wordIndexToWordMap.get(wordIndex) || 'NEZNANO';
}

export interface EvaluationOption {
  id: string;
  label: string;
  disabled?: boolean;
}

export interface LetterEvaluationConfig {
  letter: PhoneticLetter;
  options: EvaluationOption[];
}

// Specifične možnosti za črko Ž
const zOptions: EvaluationOption[] = [
  { id: 'z_as_z', label: 'Ž izgovarja kot Z' },
  { id: 'z_excellent', label: 'Odlično izgovarja' },
  { id: 'z_missing', label: 'Ne izgovarja' },
  { id: 'z_as_s', label: 'Zamenjuje za Š' },
];

// Specifične možnosti za črko S
const sOptions: EvaluationOption[] = [
  { id: 's_as_sh', label: 'S izgovarja kot Š' },
  { id: 's_missing', label: 'Ne izgovarja' },
  { id: 's_excellent', label: 'Odlično izgovarja' },
  { id: 's_as_z', label: 'Zamenjuje za Z' },
];

// Specifične možnosti za črko Š
const shOptions: EvaluationOption[] = [
  { id: 'sh_as_s', label: 'Š izgovarja kot S' },
  { id: 'sh_missing', label: 'Ne izgovarja' },
  { id: 'sh_excellent', label: 'Odlično izgovarja' },
  { id: 'sh_as_z', label: 'Zamenjuje za Ž' },
];

// Specifične možnosti za črko Č
const chOptions: EvaluationOption[] = [
  { id: 'ch_as_c', label: 'Č izgovarja kot C' },
  { id: 'ch_missing', label: 'Ne izgovarja' },
  { id: 'ch_excellent', label: 'Odlično izgovarja' },
  { id: 'ch_as_t', label: 'Zamenjuje za T' },
];

// Specifične možnosti za črko C
const cOptions: EvaluationOption[] = [
  { id: 'c_as_s', label: 'C izgovarja kot S' },
  { id: 'c_missing', label: 'Ne izgovarja' },
  { id: 'c_excellent', label: 'Odlično izgovarja' },
  { id: 'c_as_ch', label: 'Zamenjuje za Č' },
];

// Specifične možnosti za črko R
const rOptions: EvaluationOption[] = [
  { id: 'r_as_l', label: 'R izgovarja kot L' },
  { id: 'r_missing', label: 'Ne izgovarja' },
  { id: 'r_excellent', label: 'Odlično izgovarja' },
  { id: 'r_guttural', label: 'Grlen R' },
];

// Privzete možnosti za ostale črke
const defaultOptions: EvaluationOption[] = [
  { id: 'missing', label: 'Ne izgovarja' },
  { id: 'excellent', label: 'Odlično izgovarja' },
  { id: 'substitution', label: 'Zamenjuje z drugim glasom' },
  { id: 'distortion', label: 'Popačen glas' },
];

// Mapiranje črk na opcije
const letterOptionsMap: Record<string, EvaluationOption[]> = {
  'Ž': zOptions,
  'S': sOptions,
  'Š': shOptions,
  'Č': chOptions,
  'C': cOptions,
  'R': rOptions,
};

// Generiranje konfiguracije za vse črke
export const evaluationConfigs: LetterEvaluationConfig[] = PHONETIC_ORDER.map(letter => ({
  letter,
  options: letterOptionsMap[letter] || defaultOptions,
}));

// Helper funkcija za pridobitev konfiguracije za določeno črko
export function getEvaluationConfig(letter: string): LetterEvaluationConfig | undefined {
  return evaluationConfigs.find(config => config.letter === letter.toUpperCase());
}

// 5-stopenjska ocenjevalna lestvica
export interface RatingLevel {
  value: number;
  title: string;
  description: string;
  details: string[];
}

export const RATING_SCALE: RatingLevel[] = [
  {
    value: 1,
    title: 'Neizvedljivo / odsotno',
    description: 'Glasu ne tvori',
    details: [
      'Otrok glasu sploh ne izvede',
      'Nadomesti z drugim glasom ali ga izpusti',
    ],
  },
  {
    value: 2,
    title: 'Močno odstopanje',
    description: 'Nepravilen glas',
    details: [
      'Artikulacija je napačna',
      'Glas je težko prepoznaven',
      'Pogosta zamenjava (npr. /s/ → /š/)',
    ],
  },
  {
    value: 3,
    title: 'Delno pravilno',
    description: 'Delno pravilen glas',
    details: [
      'Osnovna oblika glasu je prepoznavna',
      'Napaka je prisotna (lega, zven, napetost …)',
      'Razumljivost je srednja',
    ],
  },
  {
    value: 4,
    title: 'Skoraj pravilno',
    description: 'Skoraj pravilen glas',
    details: [
      'Manjša netočnost',
      'Pravilna artikulacija večino časa',
      'Napaka se pojavi občasno ali v težjih položajih',
    ],
  },
  {
    value: 5,
    title: 'Pravilno',
    description: 'Pravilna artikulacija',
    details: [
      'Glas je jasno in stabilno izveden',
      'Ustrezen položaj govornega aparata',
      'Brez opaznih napak',
    ],
  },
];

// Parsanje imena datoteke posnetka
export function parseRecordingFilename(filename: string): {
  letter: string;
  wordIndex: number;
  word: string;
} | null {
  // Format: S-39-SOK-2026-01-15T17-32-57-092Z.webm
  const match = filename.match(/^([A-ZČŠŽ]+)-(\d+)-([A-ZČŠŽ]+)-/i);
  if (!match) return null;
  
  const wordIndex = parseInt(match[2], 10);
  
  // Uporabi wordIndex za določitev prave črke (obide sanitizacijo imen datotek)
  // Npr. Ž se sanitizira v Z, ampak wordIndex 57-59 pravilno mapirata na Ž
  const actualLetter = getLetterFromWordIndex(wordIndex);
  
  // Uporabi wordIndex za pravilno ime besede (s šumniki)
  const actualWord = getWordFromWordIndex(wordIndex);
  
  return {
    letter: actualLetter,
    wordIndex: wordIndex,
    word: actualWord,
  };
}
