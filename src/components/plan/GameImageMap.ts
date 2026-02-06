// Maps gameId to actual game images from Supabase storage
const SUPABASE_URL = "https://ecmtctwovkheohqwahvt.supabase.co/storage/v1/object/public";

export const GAME_IMAGE_MAP: Record<string, string> = {
  "kolo-srece": `${SUPABASE_URL}/slike-ostalo/kolo_srece_nova_2.webp`,
  "bingo": `${SUPABASE_URL}/slike-ostalo/bingo_nova_2.webp`,
  "spomin": `${SUPABASE_URL}/slike-ostalo/spomin_nova_2.webp`,
  "sestavljanke": `${SUPABASE_URL}/slike-ostalo/sestavljanka_nova_1.webp`,
  "zaporedja": `${SUPABASE_URL}/slike-ostalo/zaporedja_nova_2.webp`,
  "drsna-sestavljanka": `${SUPABASE_URL}/slike-ostalo/drsna_sestavljanka_nova_2.webp`,
  "igra-ujemanja": `${SUPABASE_URL}/slike-ostalo/igra_ujemanja_2.webp`,
  "labirint": `${SUPABASE_URL}/slike-ostalo/labirint_nova_2.webp`,
  "met-kocke": `${SUPABASE_URL}/slike-ostalo/Smesne_besede_21.webp`,
  "ponovi-poved": `${SUPABASE_URL}/zmajcki/Zmajcek_1.webp`,
  "motorika": `${SUPABASE_URL}/slike-ostalo/vaje_motorike_nova.webp`,
};

export const GAME_TITLE_MAP: Record<string, string> = {
  "kolo-srece": "Kolo besed",
  "bingo": "Bingo",
  "spomin": "Spomin",
  "sestavljanke": "Sestavljanke",
  "zaporedja": "Zaporedja",
  "drsna-sestavljanka": "Drsna igra",
  "igra-ujemanja": "Igra ujemanja",
  "labirint": "Labirint",
  "met-kocke": "Smešne povedi",
  "ponovi-poved": "Ponovi poved",
  "motorika": "Vaje za motoriko govoril",
};

/**
 * Derive gameId from the activity path for legacy plans that lack explicit gameId field.
 * E.g. "/govorne-igre/kolo-srece/sh" -> "kolo-srece"
 */
export function deriveGameIdFromPath(path: string): string | undefined {
  const match = path.match(/^\/govorne-igre\/([^/]+)\//);
  if (match) {
    const segment = match[1];
    // "spomin" path is /govorne-igre/spomin/spomin-sh
    if (segment === "spomin") return "spomin";
    return segment;
  }
  if (path.includes("vaje-motorike-govoril")) return "motorika";
  return undefined;
}

export function getGameImage(gameId: string | undefined, type: string): string {
  if (type === "motorika") return GAME_IMAGE_MAP["motorika"] || "";
  if (gameId && GAME_IMAGE_MAP[gameId]) return GAME_IMAGE_MAP[gameId];
  return "";
}
