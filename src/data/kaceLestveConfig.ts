export interface KaceLestveWord {
  text: string;
  image: string;
  audio: string;
  acceptedVariants: string[];
}

export type KaceDifficulty = 'nizka' | 'srednja' | 'visoka';
export type KacePlayers = 1 | 2;

// Board dimensions
export const COLS = 6;
export const ROWS = 7;
export const BOARD_SIZE = 42;
export const SQUARES_NEAR_END = 6;
export const MAX_FAILED_NEAR_END = 5;
// Physical position of START (before first green square)
export const START_POSITION = 2;

// Bonus moves for correct pronunciation by difficulty
export const DIFFICULTY_BONUS: Record<KaceDifficulty, number> = {
  nizka: 2,
  srednja: 1,
  visoka: 0,
};

// Ladders: key = foot (physical pos), value = top (physical pos)
// Physical positions: 1-2=start(yellow,unnum), 3-40=green(display 1-38), 41-42=end(orange,unnum)
// Display number = physical - 2  (so physical 3 shows as "1", physical 40 shows as "38")
export const LADDERS: Record<number, number> = {
  3: 11,   // display 1 → 9
  6: 18,   // display 4 → 16
  15: 27,  // display 13 → 25
  26: 38,  // display 24 → 36
  29: 33,  // display 27 → 31
};

// Snakes: key = head (physical pos), value = tail (physical pos)
export const SNAKES: Record<number, number> = {
  40: 34,  // display 38 → 32
  21: 9,   // display 19 → 7
  24: 14,  // display 22 → 12
  31: 19,  // display 29 → 17
};

// Words for sound C (middle/end position)
export const KACE_WORDS_C: KaceLestveWord[] = [
  {
    text: "BOROVNICE",
    image: "borovnice1.webp",
    audio: "borovnice.m4a",
    acceptedVariants: ["BOROVNICE", "BOROVNICA", "BORONICA", "BOROVNICE!", "BOROVNIC", "BOROVNCE", "BOROVNCE", "BOROVNIC"],
  },
  {
    text: "KOCKA",
    image: "kocka1.webp",
    audio: "kocka.m4a",
    acceptedVariants: ["KOCKA", "COCKA", "KOTKA", "KOCKE", "KOCKI", "KOCKO", "KOSCA", "KOCKA!"],
  },
  {
    text: "KOZAREC",
    image: "kozarec1.webp",
    audio: "kozarec.m4a",
    acceptedVariants: ["KOZAREC", "KOZAREC!", "KOZARCE", "KOZARCI", "KOSAREC", "KODAREC", "KOZARC", "KOZARCA"],
  },
  {
    text: "LONEC",
    image: "lonec1.webp",
    audio: "lonec.m4a",
    acceptedVariants: ["LONEC", "LONAC", "LONC", "LONEC!", "LOVEC", "TONEC", "LONECI", "LONCA"],
  },
  {
    text: "LUBENICA",
    image: "lubenica1.webp",
    audio: "lubenica.m4a",
    acceptedVariants: ["LUBENICA", "LUBENICE", "LUBENICI", "LUBENICO", "LUBENICA!", "LUBNICA", "LUBENICA?", "LUBENICA."],
  },
  {
    text: "NOGAVICE",
    image: "nogavice1.webp",
    audio: "nogavice.m4a",
    acceptedVariants: ["NOGAVICE", "NOGAVICA", "NOGAVICI", "NOGAVICO", "NOGAVICE!", "NOGAVCE", "GAVICE", "NOGAVIC"],
  },
  {
    text: "PICA",
    image: "pica1.webp",
    audio: "pica.m4a",
    acceptedVariants: ["PICA", "PITA", "PIZA", "PIZZA", "PICE", "PICI", "PICO", "PICA!"],
  },
  {
    text: "RACA",
    image: "raca1.webp",
    audio: "raca.m4a",
    acceptedVariants: ["RACA", "RACE", "RACI", "RACO", "RAZA", "RAŠA", "LACA", "RACA!"],
  },
  {
    text: "ROPOTULJICA",
    image: "ropotuljica1.webp",
    audio: "ropotuljica.m4a",
    acceptedVariants: ["ROPOTULJICA", "ROPOTULICA", "ROPOTLJICA", "ROPOTULJICE", "ROPOTULJICA!", "ROPOTULJICO"],
  },
  {
    text: "SONCE",
    image: "sonce1.webp",
    audio: "sonce.m4a",
    acceptedVariants: ["SONCE", "SONCA", "SONCU", "SONCE!", "SONCE?", "SUNCE", "ŠONCE", "SONC", "SONCEM"],
  },
  {
    text: "VETRNICA",
    image: "veternica1.webp",
    audio: "veternica.m4a",
    acceptedVariants: ["VETRNICA", "VETRNICE", "VETRNICI", "VETRNICO", "VETRNICA!", "VETRCA", "VETRNICA?", "VETERNICA"],
  },
  {
    text: "VILICA",
    image: "vilica1.webp",
    audio: "vilice.m4a",
    acceptedVariants: ["VILICE", "VILICA", "VILICI", "VILICO", "VILCE", "VILICE!", "BILICE", "VILIC"],
  },
  {
    text: "ZAJEC",
    image: "zajec1.webp",
    audio: "zajec.m4a",
    acceptedVariants: ["ZAJEC", "ZAJCA", "ZAJCU", "ZAJCI", "SAJEC", "ZAICC", "ZAJEC!", "JAZEC", "ZAJK"],
  },
  {
    text: "ZOBOTREBEC",
    image: "zobotrebec1.webp",
    audio: "zobotrebec.m4a",
    acceptedVariants: ["ZOBOTREBEC", "ZOBOTREBCA", "ZOBOTREBEC!", "ZOBOTREBC", "ZOTREBEC", "GOBOTREBEC", "ZOBOTREBCI"],
  },
  {
    text: "ŽARNICA",
    image: "zarnica1.webp",
    audio: "zarnica.m4a",
    acceptedVariants: ["ZARNICA", "ŽARNICA", "ZARNICE", "ZARNICI", "ZARNICO", "SARNICA", "ZARNICA!", "ŽARNICE"],
  },
  {
    text: "ŽLICA",
    image: "zlica1.webp",
    audio: "zlica.m4a",
    acceptedVariants: ["ZLICA", "ŽLICA", "SLICA", "ZLICE", "ZLICI", "ZLICO", "ZLICA!", "ŠLICA", "ŽLICE"],
  },
];

// Board layout (6 cols x 7 rows = 42 fields, boustrophedon)
// Row 0 (bottom): fields 1-6 (L→R)
// Row 1: fields 12-7 (R→L)
// Row 2: fields 13-18 (L→R)
// Row 3: fields 24-19 (R→L)
// Row 4: fields 25-30 (L→R)
// Row 5: fields 36-31 (R→L)
// Row 6 (top): fields 37-42 (L→R)

export function getBoardPosition(row: number, col: number): number {
  const rowFromBottom = (ROWS - 1) - row; // 0 = bottom row
  const baseNum = rowFromBottom * COLS + 1;
  if (rowFromBottom % 2 === 0) {
    // Left to right
    return baseNum + col;
  } else {
    // Right to left
    return baseNum + (COLS - 1 - col);
  }
}

// Get the grid cell [row, col] for a given board position (1-42)
export function getGridCell(position: number): { row: number; col: number } {
  const pos = position - 1; // 0-indexed
  const rowFromBottom = Math.floor(pos / COLS);
  const indexInRow = pos % COLS;
  const row = (ROWS - 1) - rowFromBottom;
  const col = rowFromBottom % 2 === 0 ? indexInRow : (COLS - 1 - indexInRow);
  return { row, col };
}

// Cell colors - green theme (2 shades, pseudo-random distribution)
export const GREEN_DARK = '#2D6A4F';
export const GREEN_LIGHT = '#52B788';
export const START_COLOR = '#FFD93D';
export const END_COLOR = '#FF6B35';

export function getCellColor(position: number): string {
  // Start fields (1-2) = yellow
  if (position <= 2) return START_COLOR;
  // End fields (41-42) = orange
  if (position >= 41) return END_COLOR;
  // Pseudo-random distribution of 2 green shades (deterministic by position)
  const hash = ((position * 31 + 7) * 13 + position * 5) % 2;
  return hash === 0 ? GREEN_DARK : GREEN_LIGHT;
}

// Text color for cell number based on background
export function getCellTextColor(position: number): string {
  if (position <= 2) return '#7C4A00';
  if (position >= 41) return '#fff';
  return '#fff'; // both green shades use white text
}

// Get a random word from the list (excluding recently used if possible)
export function getRandomWord(usedIndices: number[] = []): { word: KaceLestveWord; index: number } {
  const available = KACE_WORDS_C
    .map((w, i) => i)
    .filter(i => !usedIndices.includes(i));
  
  const pool = available.length > 0 ? available : KACE_WORDS_C.map((_, i) => i);
  const index = pool[Math.floor(Math.random() * pool.length)];
  return { word: KACE_WORDS_C[index], index };
}

// Dragon avatars (only 2 choices: blue and red figure)
export const DRAGON_AVATARS = [
  "Zmajcek_modra_figura_1.webp",
  "Zmajcek_rdeca_figura_1.webp",
];
