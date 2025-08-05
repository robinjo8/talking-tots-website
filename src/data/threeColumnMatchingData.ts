export interface ThreeColumnMatchingItem {
  id: string;
  word: string;
  audioFile: string; // .m4a file in zvocni-posnetki bucket
  shadowImage: string; // _senca.png file in slike-sence bucket
  originalImage: string; // .png file in slike bucket
}

// Only words starting with letter C - as per user specifications
export const threeColumnMatchingDataC: ThreeColumnMatchingItem[] = [
  { id: 'cedilo', word: 'CEDILO', audioFile: 'CEDILO.m4a', shadowImage: 'cedilo_senca.png', originalImage: 'cedilo.png' },
  { id: 'cekin', word: 'CEKIN', audioFile: 'CEKIN.m4a', shadowImage: 'cekin_senca.png', originalImage: 'cekin.png' },
  { id: 'cerkev', word: 'CERKEV', audioFile: 'CERKEV.m4a', shadowImage: 'cerkev_senca.png', originalImage: 'cerkev.png' },
  { id: 'cesta', word: 'CESTA', audioFile: 'CESTA.m4a', shadowImage: 'cesta_senca.png', originalImage: 'cesta.png' },
  { id: 'cev', word: 'CEV', audioFile: 'CEV.m4a', shadowImage: 'cev_senca.png', originalImage: 'cev.png' },
  { id: 'cirkus', word: 'CIRKUS', audioFile: 'CIRKUS.m4a', shadowImage: 'cirkus_senca.png', originalImage: 'cirkus.png' },
  { id: 'cisterna', word: 'CISTERNA', audioFile: 'CISTERNA.m4a', shadowImage: 'cisterna_senca.png', originalImage: 'cisterna.png' },
  { id: 'cokla', word: 'COKLA', audioFile: 'COKLA.m4a', shadowImage: 'cokla_senca.png', originalImage: 'cokla.png' },
  { id: 'copat', word: 'COPAT', audioFile: 'COPAT.m4a', shadowImage: 'copat_senca.png', originalImage: 'copat.png' },
  { id: 'cvet', word: 'CVET', audioFile: 'CVET.m4a', shadowImage: 'cvet_senca.png', originalImage: 'cvet.png' }
];

// Function to get letter-specific data
export function getLetterMatchingData(letter: string): ThreeColumnMatchingItem[] {
  switch (letter.toLowerCase()) {
    case 'c':
      return threeColumnMatchingDataC;
    default:
      return threeColumnMatchingDataC; // Fallback to C for now
  }
}

export function getRandomThreeColumnItems(count: number = 4, letter?: string): ThreeColumnMatchingItem[] {
  const dataSet = letter ? getLetterMatchingData(letter) : threeColumnMatchingDataC;
  const shuffled = [...dataSet].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, Math.min(count, dataSet.length));
}