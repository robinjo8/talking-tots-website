// Centralized image data for all Sestavljanke puzzle games
// Images are stored in Supabase bucket "slike"

export interface PuzzleImage {
  filename: string;
  word: string;
}

// C images (10 images)
export const cImages: PuzzleImage[] = [
  { filename: 'cedilo.webp', word: 'CEDILO' },
  { filename: 'cekin.webp', word: 'CEKIN' },
  { filename: 'cerkev.webp', word: 'CERKEV' },
  { filename: 'cesta.webp', word: 'CESTA' },
  { filename: 'cev.webp', word: 'CEV' },
  { filename: 'cirkus.webp', word: 'CIRKUS' },
  { filename: 'cisterna.webp', word: 'CISTERNA' },
  { filename: 'cokla.webp', word: 'COKLA' },
  { filename: 'copat.webp', word: 'COPAT' },
  { filename: 'cvet.webp', word: 'CVET' }
];

// Č images (10 images)
export const čImages: PuzzleImage[] = [
  { filename: 'caj.webp', word: 'ČAJ' },
  { filename: 'casopis.webp', word: 'ČASOPIS' },
  { filename: 'cebela.webp', word: 'ČEBELA' },
  { filename: 'cebula.webp', word: 'ČEBULA' },
  { filename: 'cesen.webp', word: 'ČESEN' },
  { filename: 'cevlji.webp', word: 'ČEVLJI' },
  { filename: 'cokolada.webp', word: 'ČOKOLADA' },
  { filename: 'coln.webp', word: 'ČOLN' },
  { filename: 'copic.webp', word: 'ČOPIČ' },
  { filename: 'crke.webp', word: 'ČRKE' }
];

// K images (26 images)
export const kImages: PuzzleImage[] = [
  { filename: 'kaca.webp', word: 'KAČA' },
  { filename: 'kapa.webp', word: 'KAPA' },
  { filename: 'kava.webp', word: 'KAVA' },
  { filename: 'klavir.webp', word: 'KLAVIR' },
  { filename: 'kljuc.webp', word: 'KLJUČ' },
  { filename: 'klop.webp', word: 'KLOP' },
  { filename: 'knjiga.webp', word: 'KNJIGA' },
  { filename: 'kocka.webp', word: 'KOCKA' },
  { filename: 'kokos_sadez.webp', word: 'KOKOS' },
  { filename: 'kokos.webp', word: 'KOKOŠ' },
  { filename: 'kolac.webp', word: 'KOLAČ' },
  { filename: 'kolo.webp', word: 'KOLO' },
  { filename: 'koruza.webp', word: 'KORUZA' },
  { filename: 'kost.webp', word: 'KOST' },
  { filename: 'kos.webp', word: 'KOŠ' },
  { filename: 'kosara.webp', word: 'KOŠARA' },
  { filename: 'koza.webp', word: 'KOZA' },
  { filename: 'kozarec.webp', word: 'KOZAREC' },
  { filename: 'koza_skin.webp', word: 'KOŽA' },
  { filename: 'krava.webp', word: 'KRAVA' },
  { filename: 'krof.webp', word: 'KROF' },
  { filename: 'krog.webp', word: 'KROG' },
  { filename: 'kroznik.webp', word: 'KROŽNIK' },
  { filename: 'kruh.webp', word: 'KRUH' },
  { filename: 'kumara.webp', word: 'KUMARA' },
  { filename: 'kuza.webp', word: 'KUŽA' }
];

// L images (14 images)
export const lImages: PuzzleImage[] = [
  { filename: 'ladja.webp', word: 'LADJA' },
  { filename: 'lasje.webp', word: 'LASJE' },
  { filename: 'led.webp', word: 'LED' },
  { filename: 'lesnik.webp', word: 'LEŠNIK' },
  { filename: 'letalo.webp', word: 'LETALO' },
  { filename: 'lev.webp', word: 'LEV' },
  { filename: 'les.webp', word: 'LES' },
  { filename: 'list.webp', word: 'LIST' },
  { filename: 'lizika.webp', word: 'LIZIKA' },
  { filename: 'lonec.webp', word: 'LONEC' },
  { filename: 'lopar.webp', word: 'LOPAR' },
  { filename: 'lubenica.webp', word: 'LUBENICA' },
  { filename: 'luc.webp', word: 'LUČ' },
  { filename: 'luza.webp', word: 'LUŽA' }
];

// R images (17 images)
export const rImages: PuzzleImage[] = [
  { filename: 'raca.webp', word: 'RACA' },
  { filename: 'rak.webp', word: 'RAK' },
  { filename: 'raketa.webp', word: 'RAKETA' },
  { filename: 'ravnilo.webp', word: 'RAVNILO' },
  { filename: 'rep.webp', word: 'REP' },
  { filename: 'repa.webp', word: 'REPA' },
  { filename: 'riba.webp', word: 'RIBA' },
  { filename: 'ribez.webp', word: 'RIBEZ' },
  { filename: 'ribic.webp', word: 'RIBIČ' },
  { filename: 'ris.webp', word: 'RIS' },
  { filename: 'riz.webp', word: 'RIŽ' },
  { filename: 'robot.webp', word: 'ROBOT' },
  { filename: 'roka.webp', word: 'ROKA' },
  { filename: 'rokometas.webp', word: 'ROKOMETAŠ' },
  { filename: 'rolka.webp', word: 'ROLKA' },
  { filename: 'ropotuljica.webp', word: 'ROPOTULJICA' },
  { filename: 'roza.webp', word: 'ROŽA' }
];

// S images (16 images)
export const sImages: PuzzleImage[] = [
  { filename: 'sedem.webp', word: 'SEDEM' },
  { filename: 'sir.webp', word: 'SIR' },
  { filename: 'sladoled.webp', word: 'SLADOLED' },
  { filename: 'slika.webp', word: 'SLIKA' },
  { filename: 'slon.webp', word: 'SLON' },
  { filename: 'sluz.webp', word: 'SLUZ' },
  { filename: 'smreka.webp', word: 'SMREKA' },
  { filename: 'sneg.webp', word: 'SNEG' },
  { filename: 'snezak.webp', word: 'SNEŽAK' },
  { filename: 'snezinka.webp', word: 'SNEŽINKA' },
  { filename: 'sok.webp', word: 'SOK' },
  { filename: 'sonce.webp', word: 'SONCE' },
  { filename: 'sova.webp', word: 'SOVA' },
  { filename: 'stol.webp', word: 'STOL' },
  { filename: 'svetilka.webp', word: 'SVETILKA' },
  { filename: 'svincnik.webp', word: 'SVINČNIK' }
];

// Š images (10 images)
export const šImages: PuzzleImage[] = [
  { filename: 'sah.webp', word: 'ŠAH' },
  { filename: 'sal.webp', word: 'ŠAL' },
  { filename: 'scetka.webp', word: 'ŠČETKA' },
  { filename: 'skarje.webp', word: 'ŠKARJE' },
  { filename: 'skatla.webp', word: 'ŠKATLA' },
  { filename: 'skoljka.webp', word: 'ŠKOLJKA' },
  { filename: 'sopek.webp', word: 'ŠOPEK' },
  { filename: 'sotor.webp', word: 'ŠOTOR' },
  { filename: 'stampiljka.webp', word: 'ŠTAMPILJKA' },
  { filename: 'storklja.webp', word: 'ŠTORKLJA' }
];

// Z images (11 images)
export const zImages: PuzzleImage[] = [
  { filename: 'zajec.webp', word: 'ZAJEC' },
  { filename: 'zaslon.webp', word: 'ZASLON' },
  { filename: 'zavesa.webp', word: 'ZAVESA' },
  { filename: 'zebra.webp', word: 'ZEBRA' },
  { filename: 'zlato.webp', word: 'ZLATO' },
  { filename: 'zmaj.webp', word: 'ZMAJ' },
  { filename: 'zob.webp', word: 'ZOB' },
  { filename: 'zobotrebec.webp', word: 'ZOBOTREBEC' },
  { filename: 'zvezda.webp', word: 'ZVEZDA' },
  { filename: 'zvezek.webp', word: 'ZVEZEK' },
  { filename: 'zvocnik.webp', word: 'ZVOČNIK' }
];

// Ž images (10 images)
export const žImages: PuzzleImage[] = [
  { filename: 'zaba.webp', word: 'ŽABA' },
  { filename: 'zaga.webp', word: 'ŽAGA' },
  { filename: 'zarnica.webp', word: 'ŽARNICA' },
  { filename: 'zebelj.webp', word: 'ŽEBELJ' },
  { filename: 'zelva.webp', word: 'ŽELVA' },
  { filename: 'zerjav.webp', word: 'ŽERJAV' },
  { filename: 'zirafa.webp', word: 'ŽIRAFA' },
  { filename: 'zlica.webp', word: 'ŽLICA' },
  { filename: 'zoga.webp', word: 'ŽOGA' },
  { filename: 'zolna.webp', word: 'ŽOLNA' }
];

// Helper function to get random image from array
export const getRandomImage = (images: PuzzleImage[]): PuzzleImage => {
  const randomIndex = Math.floor(Math.random() * images.length);
  return images[randomIndex];
};

// Map of letter to images
export const imagesByLetter: Record<string, PuzzleImage[]> = {
  c: cImages,
  č: čImages,
  k: kImages,
  l: lImages,
  r: rImages,
  s: sImages,
  š: šImages,
  z: zImages,
  ž: žImages
};

// Supabase storage URL
export const SUPABASE_STORAGE_URL = "https://ecmtctwovkheohqwahvt.supabase.co/storage/v1/object/public/slike";

// Get full image URL
export const getImageUrl = (filename: string): string => {
  return `${SUPABASE_STORAGE_URL}/${filename}`;
};
