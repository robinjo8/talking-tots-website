import { articulationData } from '@/data/articulationTestData';

// Fonetični vrstni red črk
export const PHONETIC_ORDER = ['P', 'B', 'M', 'T', 'D', 'K', 'G', 'N', 'H', 'V', 'J', 'F', 'L', 'S', 'Z', 'C', 'Š', 'Ž', 'Č', 'R'] as const;

export type PhoneticLetter = typeof PHONETIC_ORDER[number];

// Dinamično mapiranje wordIndex → črka iz articulationTestData
// articulationTestData je v abecednem vrstnem redu, ne fonetičnem
const wordIndexToLetterMap = new Map<number, string>();
let currentIndex = 0;
articulationData.forEach(letterData => {
  letterData.words.forEach(() => {
    wordIndexToLetterMap.set(currentIndex, letterData.letter);
    currentIndex++;
  });
});

export function getLetterFromWordIndex(wordIndex: number): string {
  return wordIndexToLetterMap.get(wordIndex) || 'X';
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

// Specifične možnosti za črko S
const sOptions: EvaluationOption[] = [
  { id: 's_as_sh', label: 'Črko S izgovarja kot Š' },
  { id: 's_missing', label: 'Črke S ne izgovarja' },
  { id: 's_too_fast', label: 'Prehitro izgovarja' },
  { id: 's_too_slow', label: 'Prepočasi izgovarja' },
];

// Privzete možnosti "V pripravi" za ostale črke
const placeholderOptions: EvaluationOption[] = [
  { id: 'option_1', label: 'V pripravi', disabled: true },
  { id: 'option_2', label: 'V pripravi', disabled: true },
  { id: 'option_3', label: 'V pripravi', disabled: true },
  { id: 'option_4', label: 'V pripravi', disabled: true },
];

// Generiranje konfiguracije za vse črke
export const evaluationConfigs: LetterEvaluationConfig[] = PHONETIC_ORDER.map(letter => ({
  letter,
  options: letter === 'S' ? sOptions : placeholderOptions,
}));

// Helper funkcija za pridobitev konfiguracije za določeno črko
export function getEvaluationConfig(letter: string): LetterEvaluationConfig | undefined {
  return evaluationConfigs.find(config => config.letter === letter.toUpperCase());
}

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
  
  return {
    letter: actualLetter,
    wordIndex: wordIndex,
    word: match[3].toUpperCase(),
  };
}
