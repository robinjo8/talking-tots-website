// Centralized image data for all Sestavljanke puzzle games
// Images are stored in Supabase bucket "slike"

export interface PuzzleImage {
  filename: string;
  word: string;
  audio?: string;
}

// C images (10 images)
export const cImages: PuzzleImage[] = [
  { filename: 'cedilo1.webp', word: 'CEDILO' },
  { filename: 'cekin1.webp', word: 'CEKIN' },
  { filename: 'cerkev1.webp', word: 'CERKEV' },
  { filename: 'cesta1.webp', word: 'CESTA' },
  { filename: 'cev1.webp', word: 'CEV' },
  { filename: 'cirkus1.webp', word: 'CIRKUS' },
  { filename: 'cisterna1.webp', word: 'CISTERNA' },
  { filename: 'cokla1.webp', word: 'COKLA' },
  { filename: 'copat1.webp', word: 'COPAT' },
  { filename: 'cvet1.webp', word: 'CVET' }
];

// Č images (12 images)
export const čImages: PuzzleImage[] = [
  { filename: 'caj1.webp', word: 'ČAJ' },
  { filename: 'carovnik1.webp', word: 'ČAROVNIK' },
  { filename: 'casopis1.webp', word: 'ČASOPIS' },
  { filename: 'cebela1.webp', word: 'ČEBELA' },
  { filename: 'cebelar1.webp', word: 'ČEBELAR' },
  { filename: 'cebula1.webp', word: 'ČEBULA' },
  { filename: 'cesen1.webp', word: 'ČESEN' },
  { filename: 'cevlji1.webp', word: 'ČEVLJI' },
  { filename: 'cokolada1.webp', word: 'ČOKOLADA' },
  { filename: 'coln1.webp', word: 'ČOLN' },
  { filename: 'copic1.webp', word: 'ČOPIČ' },
  { filename: 'crke1.webp', word: 'ČRKE' }
];

// K images (26 images)
export const kImages: PuzzleImage[] = [
  { filename: 'kaca1.webp', word: 'KAČA' },
  { filename: 'kapa1.webp', word: 'KAPA' },
  { filename: 'kava1.webp', word: 'KAVA' },
  { filename: 'klavir1.webp', word: 'KLAVIR' },
  { filename: 'kljuc1.webp', word: 'KLJUČ' },
  { filename: 'klop1.webp', word: 'KLOP' },
  { filename: 'knjiga1.webp', word: 'KNJIGA' },
  { filename: 'kocka1.webp', word: 'KOCKA' },
  { filename: 'kokos_sadez1.webp', word: 'KOKOS', audio: 'Kokos_sadez.mp3' },
  { filename: 'kokos1.webp', word: 'KOKOŠ' },
  { filename: 'kolac1.webp', word: 'KOLAČ' },
  { filename: 'kolo1.webp', word: 'KOLO' },
  { filename: 'koruza1.webp', word: 'KORUZA' },
  { filename: 'kost1.webp', word: 'KOST' },
  { filename: 'kos1.webp', word: 'KOŠ' },
  { filename: 'kosara1.webp', word: 'KOŠARA' },
  { filename: 'koza1.webp', word: 'KOZA' },
  { filename: 'kozarec1.webp', word: 'KOZAREC' },
  { filename: 'kos_ptica1.webp', word: 'KOS', audio: 'Kos_ptica.mp3' },
  { filename: 'koza_skin1.webp', word: 'KOŽA' },
  { filename: 'krava1.webp', word: 'KRAVA' },
  { filename: 'krof1.webp', word: 'KROF' },
  { filename: 'krog1.webp', word: 'KROG' },
  { filename: 'kroznik1.webp', word: 'KROŽNIK' },
  { filename: 'kruh1.webp', word: 'KRUH' },
  { filename: 'kumara1.webp', word: 'KUMARA' },
  { filename: 'kuza1.webp', word: 'KUŽA' }
];

// L images (16 images)
export const lImages: PuzzleImage[] = [
  { filename: 'ladja1.webp', word: 'LADJA' },
  { filename: 'lasje1.webp', word: 'LASJE' },
  { filename: 'led1.webp', word: 'LED' },
  { filename: 'les1.webp', word: 'LES' },
  { filename: 'lesnik1.webp', word: 'LEŠNIK' },
  { filename: 'letalo1.webp', word: 'LETALO' },
  { filename: 'lev1.webp', word: 'LEV' },
  { filename: 'lisica1.webp', word: 'LISICA' },
  { filename: 'list1.webp', word: 'LIST' },
  { filename: 'lizika1.webp', word: 'LIZIKA' },
  { filename: 'lonec1.webp', word: 'LONEC' },
  { filename: 'lopar1.webp', word: 'LOPAR' },
  { filename: 'los1.webp', word: 'LOS' },
  { filename: 'lovec1.webp', word: 'LOVEC' },
  { filename: 'lubenica1.webp', word: 'LUBENICA' },
  { filename: 'luc1.webp', word: 'LUČ' },
  { filename: 'luza1.webp', word: 'LUŽA' }
];

// R images (17 images)
export const rImages: PuzzleImage[] = [
  { filename: 'raca1.webp', word: 'RACA' },
  { filename: 'rak1.webp', word: 'RAK' },
  { filename: 'raketa1.webp', word: 'RAKETA' },
  { filename: 'ravnilo1.webp', word: 'RAVNILO' },
  { filename: 'rep1.webp', word: 'REP' },
  { filename: 'repa1.webp', word: 'REPA' },
  { filename: 'riba1.webp', word: 'RIBA' },
  { filename: 'ribez1.webp', word: 'RIBEZ' },
  { filename: 'ribic1.webp', word: 'RIBIČ' },
  { filename: 'ris1.webp', word: 'RIS' },
  { filename: 'riz1.webp', word: 'RIŽ' },
  { filename: 'robot1.webp', word: 'ROBOT' },
  { filename: 'roka1.webp', word: 'ROKA' },
  { filename: 'rokometas1.webp', word: 'ROKOMETAŠ' },
  { filename: 'rolka1.webp', word: 'ROLKA' },
  { filename: 'ropotuljica1.webp', word: 'ROPOTULJICA' },
  { filename: 'roza1.webp', word: 'ROŽA' }
];

// R začetne vaje images (18 images - consonant clusters TR, BR, DR, PR)
export const rZacetekImages: PuzzleImage[] = [
  { filename: 'drevo1.webp', word: 'DREVO' },
  { filename: 'trobenta1.webp', word: 'TROBENTA' },
  { filename: 'tri1.webp', word: 'TRI' },
  { filename: 'trikotnik1.webp', word: 'TRIKOTNIK' },
  { filename: 'trava1.webp', word: 'TRAVA' },
  { filename: 'trak1.webp', word: 'TRAK' },
  { filename: 'brisaca1.webp', word: 'BRISAČA' },
  { filename: 'briketi1.webp', word: 'BRIKETI' },
  { filename: 'breskev1.webp', word: 'BRESKEV' },
  { filename: 'brada1.webp', word: 'BRADA' },
  { filename: 'brokoli1.webp', word: 'BROKOLI' },
  { filename: 'brusnice1.webp', word: 'BRUSNICE' },
  { filename: 'breza1.webp', word: 'BREZA' },
  { filename: 'dres1.webp', word: 'DRES' },
  { filename: 'dragulj1.webp', word: 'DRAGULJ' },
  { filename: 'dron1.webp', word: 'DRON' },
  { filename: 'princ1.webp', word: 'PRINC' },
  { filename: 'presta1.webp', word: 'PRESTA' },
];

// S images (16 images)
export const sImages: PuzzleImage[] = [
  { filename: 'sedem1.webp', word: 'SEDEM' },
  { filename: 'sir1.webp', word: 'SIR' },
  { filename: 'sladoled1.webp', word: 'SLADOLED' },
  { filename: 'slika1.webp', word: 'SLIKA' },
  { filename: 'slon1.webp', word: 'SLON' },
  { filename: 'sluz1.webp', word: 'SLUZ' },
  { filename: 'smreka1.webp', word: 'SMREKA' },
  { filename: 'sneg1.webp', word: 'SNEG' },
  { filename: 'snezak1.webp', word: 'SNEŽAK' },
  { filename: 'snezinka1.webp', word: 'SNEŽINKA' },
  { filename: 'sok1.webp', word: 'SOK' },
  { filename: 'sonce1.webp', word: 'SONCE' },
  { filename: 'sova1.webp', word: 'SOVA' },
  { filename: 'stol1.webp', word: 'STOL' },
  { filename: 'svetilka1.webp', word: 'SVETILKA' },
  { filename: 'svincnik1.webp', word: 'SVINČNIK' }
];

// Š images (11 images)
export const šImages: PuzzleImage[] = [
  { filename: 'sah1.webp', word: 'ŠAH' },
  { filename: 'sal1.webp', word: 'ŠAL' },
  { filename: 'scetka1.webp', word: 'ŠČETKA' },
  { filename: 'skarje1.webp', word: 'ŠKARJE' },
  { filename: 'skatla1.webp', word: 'ŠKATLA' },
  { filename: 'skoljka1.webp', word: 'ŠKOLJKA' },
  { filename: 'sofer1.webp', word: 'ŠOFER' },
  { filename: 'sopek1.webp', word: 'ŠOPEK' },
  { filename: 'sotor1.webp', word: 'ŠOTOR' },
  { filename: 'stampiljka1.webp', word: 'ŠTAMPILJKA' },
  { filename: 'storklja1.webp', word: 'ŠTORKLJA' }
];

// Z images (11 images)
export const zImages: PuzzleImage[] = [
  { filename: 'zajec1.webp', word: 'ZAJEC' },
  { filename: 'zaslon1.webp', word: 'ZASLON' },
  { filename: 'zavesa1.webp', word: 'ZAVESA' },
  { filename: 'zebra1.webp', word: 'ZEBRA' },
  { filename: 'zlato1.webp', word: 'ZLATO' },
  { filename: 'zmaj1.webp', word: 'ZMAJ' },
  { filename: 'zob1.webp', word: 'ZOB' },
  { filename: 'zobotrebec1.webp', word: 'ZOBOTREBEC' },
  { filename: 'zvezda1.webp', word: 'ZVEZDA' },
  { filename: 'zvezek1.webp', word: 'ZVEZEK' },
  { filename: 'zvocnik1.webp', word: 'ZVOČNIK' }
];

// Ž images (10 images)
export const žImages: PuzzleImage[] = [
  { filename: 'zaba1.webp', word: 'ŽABA' },
  { filename: 'zaga1.webp', word: 'ŽAGA' },
  { filename: 'zarnica1.webp', word: 'ŽARNICA' },
  { filename: 'zebelj1.webp', word: 'ŽEBELJ' },
  { filename: 'zelva1.webp', word: 'ŽELVA' },
  { filename: 'zerjav1.webp', word: 'ŽERJAV' },
  { filename: 'zirafa1.webp', word: 'ŽIRAFA' },
  { filename: 'zlica1.webp', word: 'ŽLICA' },
  { filename: 'zoga1.webp', word: 'ŽOGA' },
  { filename: 'zolna1.webp', word: 'ŽOLNA' }
];

// Helper function to get random image from array
export const getRandomImage = (images: PuzzleImage[]): PuzzleImage => {
  const randomIndex = Math.floor(Math.random() * images.length);
  return images[randomIndex];
};

// F images (13 images)
export const fImages: PuzzleImage[] = [
  { filename: 'faraon.webp', word: 'FARAON' },
  { filename: 'fazan.webp', word: 'FAZAN' },
  { filename: 'feferon.webp', word: 'FEFERON' },
  { filename: 'figa.webp', word: 'FIGA' },
  { filename: 'flavta.webp', word: 'FLAVTA' },
  { filename: 'formula.webp', word: 'FORMULA' },
  { filename: 'fotelj.webp', word: 'FOTELJ' },
  { filename: 'fraca.webp', word: 'FRAČA' },
  { filename: 'frizer.webp', word: 'FRIZER' },
  { filename: 'frnikola.webp', word: 'FRNIKOLA' },
  { filename: 'fant1.webp', word: 'FANT' },
  { filename: 'fen1.webp', word: 'FEN' },
  { filename: 'fizol1.webp', word: 'FIŽOL' },
];

// G images (16 images)
export const gImages: PuzzleImage[] = [
  { filename: 'gasilec.webp', word: 'GASILEC' },
  { filename: 'glavnik.webp', word: 'GLAVNIK' },
  { filename: 'golob.webp', word: 'GOLOB' },
  { filename: 'gos.webp', word: 'GOS' },
  { filename: 'gozdar.webp', word: 'GOZDAR' },
  { filename: 'grad.webp', word: 'GRAD' },
  { filename: 'grah.webp', word: 'GRAH' },
  { filename: 'gugalnica.webp', word: 'GUGALNICA' },
  { filename: 'gusar.webp', word: 'GUSAR' },
  { filename: 'goba1.webp', word: 'GOBA' },
  { filename: 'gol1.webp', word: 'GOL' },
  { filename: 'guma1.webp', word: 'GUMA' },
  { filename: 'garaza1.webp', word: 'GARAŽA' },
  { filename: 'gnezdo1.webp', word: 'GNEZDO' },
  { filename: 'grozdje1.webp', word: 'GROZDJE' },
  { filename: 'glava1.webp', word: 'GLAVA' },
];

// H images (14 images)
export const hImages: PuzzleImage[] = [
  { filename: 'harfa.webp', word: 'HARFA' },
  { filename: 'harmonika.webp', word: 'HARMONIKA' },
  { filename: 'helikopter.webp', word: 'HELIKOPTER' },
  { filename: 'hijena.webp', word: 'HIJENA' },
  { filename: 'hlev.webp', word: 'HLEV' },
  { filename: 'hobotnica.webp', word: 'HOBOTNICA' },
  { filename: 'hokej.webp', word: 'HOKEJ' },
  { filename: 'hotel.webp', word: 'HOTEL' },
  { filename: 'hrcek.webp', word: 'HRČEK' },
  { filename: 'hrib.webp', word: 'HRIB' },
  { filename: 'hupa.webp', word: 'HUPA' },
  { filename: 'hisa1.webp', word: 'HIŠA' },
  { filename: 'hlace1.webp', word: 'HLAČE' },
  { filename: 'hruska1.webp', word: 'HRUŠKA' },
];

// V images (22 images)
export const vImages: PuzzleImage[] = [
  { filename: 'vafelj.webp', word: 'VAFELJ' },
  { filename: 'vedro.webp', word: 'VEDRO' },
  { filename: 'veslo.webp', word: 'VESLO' },
  { filename: 'veverica.webp', word: 'VEVERICA' },
  { filename: 'vile.webp', word: 'VILE' },
  { filename: 'vitez.webp', word: 'VITEZ' },
  { filename: 'volk.webp', word: 'VOLK' },
  { filename: 'volna.webp', word: 'VOLNA' },
  { filename: 'vozicek.webp', word: 'VOZIČEK' },
  { filename: 'vrata.webp', word: 'VRATA' },
  { filename: 'vulkan.webp', word: 'VULKAN' },
  { filename: 'vaza1.webp', word: 'VAZA' },
  { filename: 'veja1.webp', word: 'VEJA' },
  { filename: 'veternica1.webp', word: 'VETRNICA' },
  { filename: 'vilica1.webp', word: 'VILICE' },
  { filename: 'voda1.webp', word: 'VODA' },
  { filename: 'volan1.webp', word: 'VOLAN' },
  { filename: 'voz1.webp', word: 'VOZ' },
  { filename: 'verizica1.webp', word: 'VERIŽICA' },
  { filename: 'vezalke1.webp', word: 'VEZALKE' },
  { filename: 'visnja1.webp', word: 'VIŠNJA' },
  { filename: 'vrabec1.webp', word: 'VRABEC' },
];

// Map of letter to images
export const imagesByLetter: Record<string, PuzzleImage[]> = {
  c: cImages,
  č: čImages,
  f: fImages,
  g: gImages,
  h: hImages,
  k: kImages,
  l: lImages,
  r: rImages,
  'r-zacetek': rZacetekImages,
  s: sImages,
  š: šImages,
  v: vImages,
  z: zImages,
  ž: žImages
};

// Supabase storage URL
export const SUPABASE_STORAGE_URL = "https://ecmtctwovkheohqwahvt.supabase.co/storage/v1/object/public/slike";

// Get full image URL
export const getImageUrl = (filename: string): string => {
  return `${SUPABASE_STORAGE_URL}/${filename}`;
};
