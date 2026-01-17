/**
 * Centralizirane poti za navigacijo - EN VIR RESNICE
 * 
 * Vedno uporabi te konstante namesto hard-coded stringov.
 * To preprečuje neskladja med komponentami in routami.
 */

// Črke, ki jih podpiramo
export const SUPPORTED_LETTERS = ['c', 'č', 'k', 'l', 'r', 's', 'š', 'z', 'ž'] as const;
export type SupportedLetter = typeof SUPPORTED_LETTERS[number];

// Starostne skupine
export const AGE_GROUPS = ['34', '56', '78', '910'] as const;
export type AgeGroup = typeof AGE_GROUPS[number];

// Bazne poti za igre
export const GAME_ROUTES = {
  // Glavna stran iger
  GOVORNE_IGRE: '/govorne-igre',
  
  // Kategorije iger
  SPOMIN: '/govorne-igre/spomin',
  SESTAVLJANKE: '/govorne-igre/sestavljanke',
  ZAPOREDJA: '/govorne-igre/zaporedja',
  DRSNA_SESTAVLJANKA: '/govorne-igre/drsna-sestavljanka',
  IGRA_UJEMANJA: '/govorne-igre/igra-ujemanja',
  LABIRINT: '/govorne-igre/labirint',
} as const;

// Funkcije za generiranje poti do posameznih iger
export const gamePathGenerators = {
  // Spomin igre
  spomin: (letter: SupportedLetter) => 
    `${GAME_ROUTES.SPOMIN}/spomin-${letter}` as const,
  
  // Sestavljanke - 3-4 leta (drsne)
  sestavljanke34: (letter: SupportedLetter) => 
    `${GAME_ROUTES.DRSNA_SESTAVLJANKA}/${letter}34` as const,
  
  // Sestavljanke - 5-6, 7-8, 9-10 leta
  sestavljanke: (letter: SupportedLetter, ageGroup?: AgeGroup) => 
    `${GAME_ROUTES.SESTAVLJANKE}/${letter}${ageGroup || ''}` as const,
  
  // Zaporedja
  zaporedja: (letter: SupportedLetter, ageGroup?: AgeGroup) => 
    `${GAME_ROUTES.ZAPOREDJA}/${letter}${ageGroup || ''}` as const,
  
  // Drsna sestavljanka
  drsnaSestavljanka: (letter: SupportedLetter, ageGroup: AgeGroup) => 
    `${GAME_ROUTES.DRSNA_SESTAVLJANKA}/${letter}${ageGroup}` as const,
  
  // Igra ujemanja
  igraUjemanja: (letter: SupportedLetter, ageGroup?: AgeGroup) => 
    `${GAME_ROUTES.IGRA_UJEMANJA}/${letter}${ageGroup || ''}` as const,
  
  // Labirint
  labirint: (letter: SupportedLetter) => 
    `${GAME_ROUTES.LABIRINT}/${letter}` as const,
} as const;

// Legacy poti za backward compatibility
export const LEGACY_ROUTES = {
  SPOMIN_GAMES: '/spomin-games',
  SESTAVLJANKE_GAMES: '/sestavljanke-games',
  ZAPOREDJA: '/zaporedja',
  DRSNA_SESTAVLJANKA: '/drsna-sestavljanka',
  IGRA_UJEMANJA: '/igra-ujemanja',
  LABIRINT: '/labirint',
} as const;

// Mapiranje legacy poti na nove poti
export const LEGACY_TO_NEW_ROUTES: Record<string, string> = {
  [LEGACY_ROUTES.SPOMIN_GAMES]: GAME_ROUTES.SPOMIN,
  [LEGACY_ROUTES.SESTAVLJANKE_GAMES]: GAME_ROUTES.SESTAVLJANKE,
  [LEGACY_ROUTES.ZAPOREDJA]: GAME_ROUTES.ZAPOREDJA,
  [LEGACY_ROUTES.DRSNA_SESTAVLJANKA]: GAME_ROUTES.DRSNA_SESTAVLJANKA,
  [LEGACY_ROUTES.IGRA_UJEMANJA]: GAME_ROUTES.IGRA_UJEMANJA,
  [LEGACY_ROUTES.LABIRINT]: GAME_ROUTES.LABIRINT,
};

// Helper za generiranje vseh legacy poti -> nove poti za posamezne igre
export function generateLegacyGameRedirects() {
  const redirects: Array<{ from: string; to: string }> = [];
  
  // Spomin
  SUPPORTED_LETTERS.forEach(letter => {
    redirects.push({
      from: `/spomin-${letter}`,
      to: gamePathGenerators.spomin(letter),
    });
  });
  
  // Sestavljanke
  SUPPORTED_LETTERS.forEach(letter => {
    redirects.push({
      from: `/sestavljanke-${letter}`,
      to: gamePathGenerators.sestavljanke(letter),
    });
    AGE_GROUPS.filter(ag => ag !== '34').forEach(ageGroup => {
      redirects.push({
        from: `/sestavljanke-${letter}-${ageGroup}`,
        to: gamePathGenerators.sestavljanke(letter, ageGroup),
      });
    });
  });
  
  // Zaporedja
  SUPPORTED_LETTERS.forEach(letter => {
    redirects.push({
      from: `/zaporedja-${letter}`,
      to: gamePathGenerators.zaporedja(letter),
    });
    AGE_GROUPS.filter(ag => ag !== '34').forEach(ageGroup => {
      redirects.push({
        from: `/zaporedja-${letter}-${ageGroup}`,
        to: gamePathGenerators.zaporedja(letter, ageGroup),
      });
    });
  });
  
  // Drsna sestavljanka
  SUPPORTED_LETTERS.forEach(letter => {
    AGE_GROUPS.forEach(ageGroup => {
      redirects.push({
        from: `/drsna-sestavljanka-${letter}-${ageGroup}`,
        to: gamePathGenerators.drsnaSestavljanka(letter, ageGroup),
      });
    });
  });
  
  // Igra ujemanja
  SUPPORTED_LETTERS.forEach(letter => {
    redirects.push({
      from: `/igra-ujemanja-${letter}`,
      to: gamePathGenerators.igraUjemanja(letter),
    });
    AGE_GROUPS.filter(ag => ag !== '34').forEach(ageGroup => {
      redirects.push({
        from: `/igra-ujemanja-${letter}-${ageGroup}`,
        to: gamePathGenerators.igraUjemanja(letter, ageGroup),
      });
    });
  });
  
  return redirects;
}
