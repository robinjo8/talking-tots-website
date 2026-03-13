// Maps letters to their corresponding lips/articulation image filenames
// Images are stored in Supabase bucket 'slike'

const LIPS_IMAGE_MAP: Record<string, string> = {
  'C': 'Glas_SZC.png',
  'S': 'Glas_SZC.png',
  'Z': 'Glas_SZC.png',
  'Č': 'Glas_ShZhCh.png',
  'Š': 'Glas_ShZhCh.png',
  'Ž': 'Glas_ShZhCh.png',
  'K': 'Glas_K.png',
  'L': 'Glas_L.png',
  'R': 'Glas_R.png',
};

/**
 * Get the lips/articulation image filename for a given letter.
 * Handles both uppercase and lowercase, and digraph URL keys (ch, sh, zh).
 */
export function getLipsImageForLetter(letter: string): string | undefined {
  // Normalize: handle digraph URL keys
  const normalized = letter.toLowerCase();
  const digraphMap: Record<string, string> = {
    'ch': 'Č',
    'sh': 'Š',
    'zh': 'Ž',
    'r-zacetek': 'R',
  };

  const upperLetter = digraphMap[normalized] || letter.toUpperCase();
  return LIPS_IMAGE_MAP[upperLetter];
}
