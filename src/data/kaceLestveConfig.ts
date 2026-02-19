export interface KaceLestveWord {
  text: string;
  image: string;
  audio: string;
  acceptedVariants: string[];
}

export type KaceDifficulty = 'lahka' | 'srednja' | 'tezka';
export type KacePlayers = 1 | 2;

// Bonus moves for correct pronunciation by difficulty
export const DIFFICULTY_BONUS: Record<KaceDifficulty, number> = {
  lahka: 2,
  srednja: 1,
  tezka: 0,
};

// Board configuration
export const BOARD_SIZE = 64;
export const SQUARES_NEAR_END = 6; // When to apply end-game rule
export const MAX_FAILED_NEAR_END = 5; // After this many fails, force win

// Ladders: key = foot (start), value = top (end)
export const LADDERS: Record<number, number> = {
  3: 16,
  8: 23,
  30: 41,
  48: 64,
};

// Snakes: key = head (start - higher number), value = tail (end - lower number)
export const SNAKES: Record<number, number> = {
  35: 27,
  51: 24,
  59: 47,
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
    image: "vetrnica1.webp",
    audio: "vetrnica.m4a",
    acceptedVariants: ["VETRNICA", "VETRNICE", "VETRNICI", "VETRNICO", "VETRNICA!", "VETRCA", "VETRNICA?", "VETERNICA"],
  },
  {
    text: "VILICE",
    image: "vilice1.webp",
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
    text: "ZARNICA",
    image: "zarnica1.webp",
    audio: "zarnica.m4a",
    acceptedVariants: ["ZARNICA", "ŽARNICA", "ZARNICE", "ZARNICI", "ZARNICO", "SARNICA", "ZARNICA!", "ŽARNICE"],
  },
  {
    text: "ZLICA",
    image: "zlica1.webp",
    audio: "zlica.m4a",
    acceptedVariants: ["ZLICA", "ŽLICA", "SLICA", "ZLICE", "ZLICI", "ZLICO", "ZLICA!", "ŠLICA", "ŽLICE"],
  },
];

// Helper: get board position number from row/col (0-indexed from top-left)
// Board goes: row 7 (bottom) = squares 1-8, row 6 = 9-16, ..., row 0 (top) = 57-64
// Row 7 (bottom): L->R (1..8)
// Row 6: R->L (16..9)
// Row 5: L->R (17..24)
// Row 4: R->L (32..25)
// Row 3: L->R (33..40)
// Row 2: R->L (48..41)
// Row 1: L->R (49..56)
// Row 0 (top): R->L (64..57)
export function getBoardPosition(row: number, col: number): number {
  const rowFromBottom = 7 - row; // 0 = bottom row
  const baseNum = rowFromBottom * 8 + 1;
  if (rowFromBottom % 2 === 0) {
    // Left to right
    return baseNum + col;
  } else {
    // Right to left
    return baseNum + (7 - col);
  }
}

// Get the grid cell [row, col] for a given board position (1-64)
export function getGridCell(position: number): { row: number; col: number } {
  const pos = position - 1; // 0-indexed
  const rowFromBottom = Math.floor(pos / 8);
  const indexInRow = pos % 8;
  const row = 7 - rowFromBottom;
  const col = rowFromBottom % 2 === 0 ? indexInRow : 7 - indexInRow;
  return { row, col };
}

// Cell colors - pastel palette
export const CELL_COLORS = [
  '#FFD6D6', // rose
  '#D6EAFF', // light blue
  '#D6FFE8', // mint
  '#E8D6FF', // lavender
  '#FFF6D6', // yellow
  '#FFE8D6', // peach
  '#D6FFF6', // teal
  '#E8FFD6', // green
];

export function getCellColor(position: number): string {
  // Special cells
  if (position <= 2) return '#86EFAC'; // Start - green
  if (position >= 63) return '#FDE68A'; // End - gold
  if (LADDERS[position] !== undefined) return '#BBF7D0'; // Ladder bottom - light green
  if (Object.values(LADDERS).includes(position)) return '#4ADE80'; // Ladder top - green
  if (SNAKES[position] !== undefined) return '#FCA5A5'; // Snake head - light red
  if (Object.values(SNAKES).includes(position)) return '#FDBA74'; // Snake tail - orange
  
  return CELL_COLORS[(position - 1) % CELL_COLORS.length];
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
