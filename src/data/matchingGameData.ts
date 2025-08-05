export interface MatchingGameImage {
  word: string;
  filename: string;
  url: string;
}

export interface LetterData {
  letter: string;
  images: MatchingGameImage[];
}

const SUPABASE_STORAGE_URL = "https://ecmtctwovkheohqwahvt.supabase.co/storage/v1/object/public/sestavljanke";

export const matchingGameData: LetterData[] = [
  {
    letter: "C",
    images: [
      { word: "CEDILO", filename: "cedilo.png", url: `${SUPABASE_STORAGE_URL}/cedilo.png` },
      { word: "CEKIN", filename: "cekin.png", url: `${SUPABASE_STORAGE_URL}/cekin.png` },
      { word: "CERKEV", filename: "cerkev.png", url: `${SUPABASE_STORAGE_URL}/cerkev.png` },
      { word: "CESTA", filename: "cesta.png", url: `${SUPABASE_STORAGE_URL}/cesta.png` },
      { word: "CEV", filename: "cev.png", url: `${SUPABASE_STORAGE_URL}/cev.png` },
      { word: "CIRKUS", filename: "cirkus.png", url: `${SUPABASE_STORAGE_URL}/cirkus.png` },
      { word: "CISTERNA", filename: "cisterna.png", url: `${SUPABASE_STORAGE_URL}/cisterna.png` },
      { word: "COKLA", filename: "cokla.png", url: `${SUPABASE_STORAGE_URL}/cokla.png` },
      { word: "COPAT", filename: "copat.png", url: `${SUPABASE_STORAGE_URL}/copat.png` },
      { word: "CVET", filename: "cvet.png", url: `${SUPABASE_STORAGE_URL}/cvet.png` }
    ]
  },
  {
    letter: "Č",
    images: [
      { word: "ČAJ", filename: "caj.png", url: `${SUPABASE_STORAGE_URL}/caj.png` },
      { word: "ČASOPIS", filename: "casopis.png", url: `${SUPABASE_STORAGE_URL}/casopis.png` },
      { word: "ČEBELA", filename: "cebela.png", url: `${SUPABASE_STORAGE_URL}/cebela.png` },
      { word: "ČEBULA", filename: "cebula.png", url: `${SUPABASE_STORAGE_URL}/cebula.png` },
      { word: "ČESEN", filename: "cesen.png", url: `${SUPABASE_STORAGE_URL}/cesen.png` },
      { word: "ČEVLJI", filename: "cevlji.png", url: `${SUPABASE_STORAGE_URL}/cevlji.png` },
      { word: "ČOKOLADA", filename: "cokolada.png", url: `${SUPABASE_STORAGE_URL}/cokolada.png` },
      { word: "ČOLN", filename: "coln.png", url: `${SUPABASE_STORAGE_URL}/coln.png` },
      { word: "ČOPIČ", filename: "copic.png", url: `${SUPABASE_STORAGE_URL}/copic.png` },
      { word: "ČRKE", filename: "crke.png", url: `${SUPABASE_STORAGE_URL}/crke.png` }
    ]
  },
  {
    letter: "K",
    images: [
      { word: "KAČA", filename: "kaca.png", url: `${SUPABASE_STORAGE_URL}/kaca.png` },
      { word: "KAPA", filename: "kapa.png", url: `${SUPABASE_STORAGE_URL}/kapa.png` },
      { word: "KAVA", filename: "kava.png", url: `${SUPABASE_STORAGE_URL}/kava.png` },
      { word: "KLAVIR", filename: "klavir.png", url: `${SUPABASE_STORAGE_URL}/klavir.png` },
      { word: "KLJUČ", filename: "kljuc.png", url: `${SUPABASE_STORAGE_URL}/kljuc.png` },
      { word: "KLOP", filename: "klop.png", url: `${SUPABASE_STORAGE_URL}/klop.png` },
      { word: "KNJIGA", filename: "knjiga.png", url: `${SUPABASE_STORAGE_URL}/knjiga.png` },
      { word: "KOCKA", filename: "kocka.png", url: `${SUPABASE_STORAGE_URL}/kocka.png` },
      { word: "KOKOS", filename: "kokos.png", url: `${SUPABASE_STORAGE_URL}/kokos.png` },
      { word: "KOLO", filename: "kolo.png", url: `${SUPABASE_STORAGE_URL}/kolo.png` }
    ]
  },
  {
    letter: "L",
    images: [
      { word: "LADJA", filename: "ladja.png", url: `${SUPABASE_STORAGE_URL}/ladja.png` },
      { word: "LED", filename: "led.png", url: `${SUPABASE_STORAGE_URL}/led.png` },
      { word: "LETALO", filename: "letalo.png", url: `${SUPABASE_STORAGE_URL}/letalo.png` },
      { word: "LEV", filename: "lev.png", url: `${SUPABASE_STORAGE_URL}/lev.png` },
      { word: "LIST", filename: "list.png", url: `${SUPABASE_STORAGE_URL}/list.png` },
      { word: "LIZIKA", filename: "lizika.png", url: `${SUPABASE_STORAGE_URL}/lizika.png` },
      { word: "LONEC", filename: "lonec.png", url: `${SUPABASE_STORAGE_URL}/lonec.png` },
      { word: "LOPAR", filename: "lopar.png", url: `${SUPABASE_STORAGE_URL}/lopar.png` },
      { word: "LUBENICA", filename: "lubenica.png", url: `${SUPABASE_STORAGE_URL}/lubenica.png` },
      { word: "LUČ", filename: "luc.png", url: `${SUPABASE_STORAGE_URL}/luc.png` }
    ]
  },
  {
    letter: "S",
    images: [
      { word: "SEDEM", filename: "sedem.png", url: `${SUPABASE_STORAGE_URL}/sedem.png` },
      { word: "SIR", filename: "sir.png", url: `${SUPABASE_STORAGE_URL}/sir.png` },
      { word: "SLADOLED", filename: "sladoled.png", url: `${SUPABASE_STORAGE_URL}/sladoled.png` },
      { word: "SLIKA", filename: "slika.png", url: `${SUPABASE_STORAGE_URL}/slika.png` },
      { word: "SLON", filename: "slon.png", url: `${SUPABASE_STORAGE_URL}/slon.png` },
      { word: "SMREKA", filename: "smreka.png", url: `${SUPABASE_STORAGE_URL}/smreka.png` },
      { word: "SNEG", filename: "sneg.png", url: `${SUPABASE_STORAGE_URL}/sneg.png` },
      { word: "SNEŽAK", filename: "snezak.png", url: `${SUPABASE_STORAGE_URL}/snezak.png` },
      { word: "SOK", filename: "sok.png", url: `${SUPABASE_STORAGE_URL}/sok.png` },
      { word: "SONCE", filename: "sonce.png", url: `${SUPABASE_STORAGE_URL}/sonce.png` }
    ]
  },
  {
    letter: "Š",
    images: [
      { word: "ŠAH", filename: "sah.png", url: `${SUPABASE_STORAGE_URL}/sah.png` },
      { word: "ŠAL", filename: "sal.png", url: `${SUPABASE_STORAGE_URL}/sal.png` },
      { word: "ŠČETKA", filename: "scetka.png", url: `${SUPABASE_STORAGE_URL}/scetka.png` },
      { word: "ŠKARJE", filename: "skarje.png", url: `${SUPABASE_STORAGE_URL}/skarje.png` },
      { word: "ŠKATLA", filename: "skatla.png", url: `${SUPABASE_STORAGE_URL}/skatla.png` },
      { word: "ŠKOLJKA", filename: "skoljka.png", url: `${SUPABASE_STORAGE_URL}/skoljka.png` },
      { word: "ŠOPEK", filename: "sopek.png", url: `${SUPABASE_STORAGE_URL}/sopek.png` },
      { word: "ŠOTOR", filename: "sotor.png", url: `${SUPABASE_STORAGE_URL}/sotor.png` },
      { word: "ŠTAMPILJKA", filename: "stampiljka.png", url: `${SUPABASE_STORAGE_URL}/stampiljka.png` },
      { word: "ŠTORKLJA", filename: "storklja.png", url: `${SUPABASE_STORAGE_URL}/storklja.png` }
    ]
  },
  {
    letter: "Z",
    images: [
      { word: "ZAJEC", filename: "zajec.png", url: `${SUPABASE_STORAGE_URL}/zajec.png` },
      { word: "ZASLON", filename: "zaslon.png", url: `${SUPABASE_STORAGE_URL}/zaslon.png` },
      { word: "ZAVESA", filename: "zavesa.png", url: `${SUPABASE_STORAGE_URL}/zavesa.png` },
      { word: "ZEBRA", filename: "zebra.png", url: `${SUPABASE_STORAGE_URL}/zebra.png` },
      { word: "ZLATO", filename: "zlato.png", url: `${SUPABASE_STORAGE_URL}/zlato.png` },
      { word: "ZMAJ", filename: "zmaj.png", url: `${SUPABASE_STORAGE_URL}/zmaj.png` },
      { word: "ZOB", filename: "zob.png", url: `${SUPABASE_STORAGE_URL}/zob.png` },
      { word: "ZOBOTREBEC", filename: "zobotrebec.png", url: `${SUPABASE_STORAGE_URL}/zobotrebec.png` },
      { word: "ZVEZDA", filename: "zvezda.png", url: `${SUPABASE_STORAGE_URL}/zvezda.png` },
      { word: "ZVOČNIK", filename: "zvocnik.png", url: `${SUPABASE_STORAGE_URL}/zvocnik.png` }
    ]
  },
  {
    letter: "Ž",
    images: [
      { word: "ŽABA", filename: "zaba.png", url: `${SUPABASE_STORAGE_URL}/zaba.png` },
      { word: "ŽAGA", filename: "zaga.png", url: `${SUPABASE_STORAGE_URL}/zaga.png` },
      { word: "ŽARNICA", filename: "zarnica.png", url: `${SUPABASE_STORAGE_URL}/zarnica.png` },
      { word: "ŽEBELJ", filename: "zebelj.png", url: `${SUPABASE_STORAGE_URL}/zebelj.png` },
      { word: "ŽELVA", filename: "zelva.png", url: `${SUPABASE_STORAGE_URL}/zelva.png` },
      { word: "ŽERJAV", filename: "zerjav.png", url: `${SUPABASE_STORAGE_URL}/zerjav.png` },
      { word: "ŽIRAFA", filename: "zirafa.png", url: `${SUPABASE_STORAGE_URL}/zirafa.png` },
      { word: "ŽLICA", filename: "zlica.png", url: `${SUPABASE_STORAGE_URL}/zlica.png` },
      { word: "ŽOGA", filename: "zoga.png", url: `${SUPABASE_STORAGE_URL}/zoga.png` },
      { word: "ŽOLNA", filename: "zolna.png", url: `${SUPABASE_STORAGE_URL}/zolna.png` }
    ]
  },
  {
    letter: "R",
    images: [
      { word: "RACA", filename: "raca.png", url: `${SUPABASE_STORAGE_URL}/raca.png` },
      { word: "RAK", filename: "rak.png", url: `${SUPABASE_STORAGE_URL}/rak.png` },
      { word: "RAKETA", filename: "raketa.png", url: `${SUPABASE_STORAGE_URL}/raketa.png` },
      { word: "RAVNILO", filename: "ravnilo.png", url: `${SUPABASE_STORAGE_URL}/ravnilo.png` },
      { word: "REP", filename: "rep.png", url: `${SUPABASE_STORAGE_URL}/rep.png` },
      { word: "REPA", filename: "repa.png", url: `${SUPABASE_STORAGE_URL}/repa.png` },
      { word: "RIBA", filename: "riba.png", url: `${SUPABASE_STORAGE_URL}/riba.png` },
      { word: "ROBOT", filename: "robot.png", url: `${SUPABASE_STORAGE_URL}/robot.png` },
      { word: "ROKA", filename: "roka.png", url: `${SUPABASE_STORAGE_URL}/roka.png` },
      { word: "ROLKA", filename: "rolka.png", url: `${SUPABASE_STORAGE_URL}/rolka.png` }
    ]
  }
];

export function getLetterData(letter: string): LetterData | undefined {
  return matchingGameData.find(data => data.letter === letter);
}

// Utility function to shuffle array
function shuffleArray<T>(array: T[]): T[] {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

export function getImagesForAgeGroup(images: MatchingGameImage[], ageGroup: string): MatchingGameImage[] {
  const shuffledImages = shuffleArray(images);
  
  switch (ageGroup) {
    case '3-4':
      return shuffledImages.slice(0, 4); // 4 randomly selected images for youngest
    case '5-6':
      return shuffledImages.slice(0, 6); // 6 randomly selected images
    case '7-8':
      return shuffledImages.slice(0, 8); // 8 randomly selected images
    case '9-10':
      return shuffledImages; // All 10 images (shuffled) for oldest
    default:
      return shuffledImages.slice(0, 4);
  }
}