import { articulationData } from '@/data/articulationTestData';

// Fonetični vrstni red črk
export const PHONETIC_ORDER = ['P', 'B', 'M', 'T', 'D', 'K', 'G', 'N', 'H', 'V', 'J', 'F', 'L', 'S', 'Z', 'C', 'Š', 'Ž', 'Č', 'R'] as const;

export type PhoneticLetter = typeof PHONETIC_ORDER[number];

// Sortiraj articulationData po fonetičnem vrstnem redu (P, B, M, T, D, ...)
// da se wordIndex mapiranje ujema s tistim iz useArticulationTestNew
const sortedArticulationData = [...articulationData].sort((a, b) => {
  const indexA = PHONETIC_ORDER.indexOf(a.letter.toUpperCase() as PhoneticLetter);
  const indexB = PHONETIC_ORDER.indexOf(b.letter.toUpperCase() as PhoneticLetter);
  return (indexA === -1 ? 999 : indexA) - (indexB === -1 ? 999 : indexB);
});

// Dinamično mapiranje wordIndex → črka iz fonetično sortiranih podatkov
// wordsPerLetter=3 (60 besed) in wordsPerLetter=1 (20 besed)
function buildWordIndexMaps(wordsPerLetter: number) {
  const letterMap = new Map<number, string>();
  const wordMap = new Map<number, string>();
  let currentIdx = 0;
  sortedArticulationData.forEach(letterData => {
    const wordsToUse = letterData.words.slice(0, wordsPerLetter);
    wordsToUse.forEach(word => {
      letterMap.set(currentIdx, letterData.letter);
      wordMap.set(currentIdx, word.text);
      currentIdx++;
    });
  });
  return { letterMap, wordMap };
}

// Pre-built maps for both modes
const maps3 = buildWordIndexMaps(3);
const maps1 = buildWordIndexMaps(1);

function getMaps(wordsPerLetter: number) {
  return wordsPerLetter === 1 ? maps1 : maps3;
}

export function getLetterFromWordIndex(wordIndex: number, wordsPerLetter: number = 3): string {
  return getMaps(wordsPerLetter).letterMap.get(wordIndex) || 'X';
}

export function getWordFromWordIndex(wordIndex: number, wordsPerLetter: number = 3): string {
  return getMaps(wordsPerLetter).wordMap.get(wordIndex) || 'NEZNANO';
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

// Univerzalne opcije za vse črke
const universalOptions: EvaluationOption[] = [
  { id: 'acquired', label: 'Glas je usvojen' },
  { id: 'not_automated', label: 'Glas ni avtomatiziran' },
  { id: 'not_acquired', label: 'Glas ni usvojen' },
  { id: 'distorted', label: 'Glas je neustrezno usvojen (popačen)' },
  { id: 'omitted', label: 'Glas je izpuščen' },
  { id: 'substituted', label: 'Glas je zamenjan z drugim glasom' },
];

// Generiranje konfiguracije za vse črke
export const evaluationConfigs: LetterEvaluationConfig[] = PHONETIC_ORDER.map(letter => ({
  letter,
  options: universalOptions,
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
export function parseRecordingFilename(filename: string, wordsPerLetter: number = 3): {
  letter: string;
  wordIndex: number;
  word: string;
} | null {
  // Format: S-39-SOK-2026-01-15T17-32-57-092Z.webm
  const match = filename.match(/^([A-ZČŠŽ]+)-(\d+)-([A-ZČŠŽ]+)-/i);
  if (!match) return null;
  
  const wordIndex = parseInt(match[2], 10);
  
  // Uporabi wordIndex za določitev prave črke (obide sanitizacijo imen datotek)
  const actualLetter = getLetterFromWordIndex(wordIndex, wordsPerLetter);
  
  // Uporabi wordIndex za pravilno ime besede (s šumniki)
  const actualWord = getWordFromWordIndex(wordIndex, wordsPerLetter);
  
  return {
    letter: actualLetter,
    wordIndex: wordIndex,
    word: actualWord,
  };
}
