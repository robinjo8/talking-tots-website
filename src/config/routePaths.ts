/**
 * Centralizirane poti za navigacijo - EN VIR RESNICE
 * 
 * Vedno uporabi te konstante namesto hard-coded stringov.
 * To preprečuje neskladja med komponentami in routami.
 */

// Re-export from routeConfig for backward compatibility
export { 
  SUPPORTED_LETTERS, 
  AGE_GROUPS, 
  letterToComponentName,
  type SupportedLetter,
  type AgeGroup 
} from './routes/routeConfig';

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
  spomin: (letter: string) => 
    `${GAME_ROUTES.SPOMIN}/spomin-${letter}` as const,
  
  // Sestavljanke - 3-4 leta (base)
  sestavljankeBase: (letter: string) => 
    `${GAME_ROUTES.SESTAVLJANKE}/${letter}` as const,
  
  // Sestavljanke - s starostno skupino
  sestavljanke: (letter: string, ageGroup?: string) => 
    `${GAME_ROUTES.SESTAVLJANKE}/${letter}${ageGroup || ''}` as const,
  
  // Zaporedja
  zaporedjaBase: (letter: string) => 
    `${GAME_ROUTES.ZAPOREDJA}/${letter}` as const,
    
  zaporedja: (letter: string, ageGroup?: string) => 
    `${GAME_ROUTES.ZAPOREDJA}/${letter}${ageGroup || ''}` as const,
  
  // Drsna sestavljanka
  drsnaSestavljanka: (letter: string, ageGroup: string) => 
    `${GAME_ROUTES.DRSNA_SESTAVLJANKA}/${letter}${ageGroup}` as const,
  
  // Igra ujemanja
  igraUjemanjaBase: (letter: string) => 
    `${GAME_ROUTES.IGRA_UJEMANJA}/${letter}` as const,
    
  igraUjemanja: (letter: string, ageGroup?: string) => 
    `${GAME_ROUTES.IGRA_UJEMANJA}/${letter}${ageGroup || ''}` as const,
  
  // Labirint
  labirint: (letter: string) => 
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
