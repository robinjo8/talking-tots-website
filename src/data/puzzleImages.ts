// Centralized image data for all Sestavljanke puzzle games
// Images are stored in Supabase bucket "slike"

export interface PuzzleImage {
  filename: string;
  word: string;
}

// C images (10 images)
export const cImages: PuzzleImage[] = [
  { filename: 'cedilo.png', word: 'CEDILO' },
  { filename: 'cekin.png', word: 'CEKIN' },
  { filename: 'cerkev.png', word: 'CERKEV' },
  { filename: 'cesta.png', word: 'CESTA' },
  { filename: 'cev.png', word: 'CEV' },
  { filename: 'cirkus.png', word: 'CIRKUS' },
  { filename: 'cisterna.png', word: 'CISTERNA' },
  { filename: 'cokla.png', word: 'COKLA' },
  { filename: 'copat.png', word: 'COPAT' },
  { filename: 'cvet.png', word: 'CVET' }
];

// Č images (10 images)
export const čImages: PuzzleImage[] = [
  { filename: 'caj.png', word: 'ČAJ' },
  { filename: 'casopis.png', word: 'ČASOPIS' },
  { filename: 'cebela.png', word: 'ČEBELA' },
  { filename: 'cebula.png', word: 'ČEBULA' },
  { filename: 'cesen.png', word: 'ČESEN' },
  { filename: 'cevlji.png', word: 'ČEVLJI' },
  { filename: 'cokolada.png', word: 'ČOKOLADA' },
  { filename: 'coln.png', word: 'ČOLN' },
  { filename: 'copic.png', word: 'ČOPIČ' },
  { filename: 'crke.png', word: 'ČRKE' }
];

// K images (26 images)
export const kImages: PuzzleImage[] = [
  { filename: 'kaca.png', word: 'KAČA' },
  { filename: 'kapa.png', word: 'KAPA' },
  { filename: 'kava.png', word: 'KAVA' },
  { filename: 'klavir.png', word: 'KLAVIR' },
  { filename: 'kljuc.png', word: 'KLJUČ' },
  { filename: 'klop.png', word: 'KLOP' },
  { filename: 'knjiga.png', word: 'KNJIGA' },
  { filename: 'kocka.png', word: 'KOCKA' },
  { filename: 'kokos_sadez.png', word: 'KOKOS' },
  { filename: 'kokos.png', word: 'KOKOŠ' },
  { filename: 'kolac.png', word: 'KOLAČ' },
  { filename: 'kolo.png', word: 'KOLO' },
  { filename: 'koruza.png', word: 'KORUZA' },
  { filename: 'kost.png', word: 'KOST' },
  { filename: 'kos.png', word: 'KOŠ' },
  { filename: 'kosara.png', word: 'KOŠARA' },
  { filename: 'koza.png', word: 'KOZA' },
  { filename: 'kozarec.png', word: 'KOZAREC' },
  { filename: 'koza_skin.png', word: 'KOŽA' },
  { filename: 'krava.png', word: 'KRAVA' },
  { filename: 'krof.png', word: 'KROF' },
  { filename: 'krog.png', word: 'KROG' },
  { filename: 'kroznik.png', word: 'KROŽNIK' },
  { filename: 'kruh.png', word: 'KRUH' },
  { filename: 'kumara.png', word: 'KUMARA' },
  { filename: 'kuza.png', word: 'KUŽA' }
];

// L images (14 images)
export const lImages: PuzzleImage[] = [
  { filename: 'ladja.png', word: 'LADJA' },
  { filename: 'lasje.png', word: 'LASJE' },
  { filename: 'led.png', word: 'LED' },
  { filename: 'lesnik.png', word: 'LEŠNIK' },
  { filename: 'letalo.png', word: 'LETALO' },
  { filename: 'lev.png', word: 'LEV' },
  { filename: 'les.png', word: 'LES' },
  { filename: 'list.png', word: 'LIST' },
  { filename: 'lizika.png', word: 'LIZIKA' },
  { filename: 'lonec.png', word: 'LONEC' },
  { filename: 'lopar.png', word: 'LOPAR' },
  { filename: 'lubenica.png', word: 'LUBENICA' },
  { filename: 'luc.png', word: 'LUČ' },
  { filename: 'luza.png', word: 'LUŽA' }
];

// R images (17 images)
export const rImages: PuzzleImage[] = [
  { filename: 'raca.png', word: 'RACA' },
  { filename: 'rak.png', word: 'RAK' },
  { filename: 'raketa.png', word: 'RAKETA' },
  { filename: 'ravnilo.png', word: 'RAVNILO' },
  { filename: 'rep.png', word: 'REP' },
  { filename: 'repa.png', word: 'REPA' },
  { filename: 'riba.png', word: 'RIBA' },
  { filename: 'ribez.png', word: 'RIBEZ' },
  { filename: 'ribic.png', word: 'RIBIČ' },
  { filename: 'ris.png', word: 'RIS' },
  { filename: 'riz.png', word: 'RIŽ' },
  { filename: 'robot.png', word: 'ROBOT' },
  { filename: 'roka.png', word: 'ROKA' },
  { filename: 'rokometas.png', word: 'ROKOMETAŠ' },
  { filename: 'rolka.png', word: 'ROLKA' },
  { filename: 'ropotuljica.png', word: 'ROPOTULJICA' },
  { filename: 'roza.png', word: 'ROŽA' }
];

// S images (16 images)
export const sImages: PuzzleImage[] = [
  { filename: 'sedem.png', word: 'SEDEM' },
  { filename: 'sir.png', word: 'SIR' },
  { filename: 'sladoled.png', word: 'SLADOLED' },
  { filename: 'slika.png', word: 'SLIKA' },
  { filename: 'slon.png', word: 'SLON' },
  { filename: 'sluz.png', word: 'SLUZ' },
  { filename: 'smreka.png', word: 'SMREKA' },
  { filename: 'sneg.png', word: 'SNEG' },
  { filename: 'snezak.png', word: 'SNEŽAK' },
  { filename: 'snezinka.png', word: 'SNEŽINKA' },
  { filename: 'sok.png', word: 'SOK' },
  { filename: 'sonce.png', word: 'SONCE' },
  { filename: 'sova.png', word: 'SOVA' },
  { filename: 'stol.png', word: 'STOL' },
  { filename: 'svetilka.png', word: 'SVETILKA' },
  { filename: 'svincnik.png', word: 'SVINČNIK' }
];

// Š images (10 images)
export const šImages: PuzzleImage[] = [
  { filename: 'sah.png', word: 'ŠAH' },
  { filename: 'sal.png', word: 'ŠAL' },
  { filename: 'scetka.png', word: 'ŠČETKA' },
  { filename: 'skarje.png', word: 'ŠKARJE' },
  { filename: 'skatla.png', word: 'ŠKATLA' },
  { filename: 'skoljka.png', word: 'ŠKOLJKA' },
  { filename: 'sopek.png', word: 'ŠOPEK' },
  { filename: 'sotor.png', word: 'ŠOTOR' },
  { filename: 'stampiljka.png', word: 'ŠTAMPILJKA' },
  { filename: 'storklja.png', word: 'ŠTORKLJA' }
];

// Z images (11 images)
export const zImages: PuzzleImage[] = [
  { filename: 'zajec.png', word: 'ZAJEC' },
  { filename: 'zaslon.png', word: 'ZASLON' },
  { filename: 'zavesa.png', word: 'ZAVESA' },
  { filename: 'zebra.png', word: 'ZEBRA' },
  { filename: 'zlato.png', word: 'ZLATO' },
  { filename: 'zmaj.png', word: 'ZMAJ' },
  { filename: 'zob.png', word: 'ZOB' },
  { filename: 'zobotrebec.png', word: 'ZOBOTREBEC' },
  { filename: 'zvezda.png', word: 'ZVEZDA' },
  { filename: 'zvezek.png', word: 'ZVEZEK' },
  { filename: 'zvocnik.png', word: 'ZVOČNIK' }
];

// Ž images (10 images)
export const žImages: PuzzleImage[] = [
  { filename: 'zaba.png', word: 'ŽABA' },
  { filename: 'zaga.png', word: 'ŽAGA' },
  { filename: 'zarnica.png', word: 'ŽARNICA' },
  { filename: 'zebelj.png', word: 'ŽEBELJ' },
  { filename: 'zelva.png', word: 'ŽELVA' },
  { filename: 'zerjav.png', word: 'ŽERJAV' },
  { filename: 'zirafa.png', word: 'ŽIRAFA' },
  { filename: 'zlica.png', word: 'ŽLICA' },
  { filename: 'zoga.png', word: 'ŽOGA' },
  { filename: 'zolna.png', word: 'ŽOLNA' }
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
