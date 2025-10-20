export interface MatchingGameImage {
  word: string;
  filename: string;
  url: string;
  audio_url?: string;
}

export interface LetterData {
  letter: string;
  images: MatchingGameImage[];
}

const SUPABASE_STORAGE_URL = "https://ecmtctwovkheohqwahvt.supabase.co/storage/v1/object/public/sestavljanke";
const SUPABASE_AUDIO_URL = "https://ecmtctwovkheohqwahvt.supabase.co/storage/v1/object/public/audio-besede";

export const matchingGameData: LetterData[] = [
  {
    letter: "C",
    images: [
      { word: "CEDILO", filename: "cedilo.png", url: `${SUPABASE_STORAGE_URL}/cedilo.png`, audio_url: `${SUPABASE_AUDIO_URL}/Cedilo.m4a` },
      { word: "CEKIN", filename: "cekin.png", url: `${SUPABASE_STORAGE_URL}/cekin.png`, audio_url: `${SUPABASE_AUDIO_URL}/Cekin.m4a` },
      { word: "CERKEV", filename: "cerkev.png", url: `${SUPABASE_STORAGE_URL}/cerkev.png`, audio_url: `${SUPABASE_AUDIO_URL}/Cerkev.m4a` },
      { word: "CESTA", filename: "cesta.png", url: `${SUPABASE_STORAGE_URL}/cesta.png`, audio_url: `${SUPABASE_AUDIO_URL}/Cesta.m4a` },
      { word: "CEV", filename: "cev.png", url: `${SUPABASE_STORAGE_URL}/cev.png`, audio_url: `${SUPABASE_AUDIO_URL}/Cev.m4a` },
      { word: "CIRKUS", filename: "cirkus.png", url: `${SUPABASE_STORAGE_URL}/cirkus.png`, audio_url: `${SUPABASE_AUDIO_URL}/Cirkus.m4a` },
      { word: "CISTERNA", filename: "cisterna.png", url: `${SUPABASE_STORAGE_URL}/cisterna.png`, audio_url: `${SUPABASE_AUDIO_URL}/Cisterna.m4a` },
      { word: "COKLA", filename: "cokla.png", url: `${SUPABASE_STORAGE_URL}/cokla.png`, audio_url: `${SUPABASE_AUDIO_URL}/Cokla.m4a` },
      { word: "COPAT", filename: "copat.png", url: `${SUPABASE_STORAGE_URL}/copat.png`, audio_url: `${SUPABASE_AUDIO_URL}/Copat.m4a` },
      { word: "CVET", filename: "cvet.png", url: `${SUPABASE_STORAGE_URL}/cvet.png`, audio_url: `${SUPABASE_AUDIO_URL}/Cvet.m4a` }
    ]
  },
  {
    letter: "Č",
    images: [
      { word: "ČAJ", filename: "caj.png", url: `${SUPABASE_STORAGE_URL}/caj.png`, audio_url: `${SUPABASE_AUDIO_URL}/Čaj.m4a` },
      { word: "ČASOPIS", filename: "casopis.png", url: `${SUPABASE_STORAGE_URL}/casopis.png`, audio_url: `${SUPABASE_AUDIO_URL}/Časopis.m4a` },
      { word: "ČEBELA", filename: "cebela.png", url: `${SUPABASE_STORAGE_URL}/cebela.png`, audio_url: `${SUPABASE_AUDIO_URL}/Čebela.m4a` },
      { word: "ČEBULA", filename: "cebula.png", url: `${SUPABASE_STORAGE_URL}/cebula.png`, audio_url: `${SUPABASE_AUDIO_URL}/Čebula.m4a` },
      { word: "ČESEN", filename: "cesen.png", url: `${SUPABASE_STORAGE_URL}/cesen.png`, audio_url: `${SUPABASE_AUDIO_URL}/Česen.m4a` },
      { word: "ČEVLJI", filename: "cevlji.png", url: `${SUPABASE_STORAGE_URL}/cevlji.png`, audio_url: `${SUPABASE_AUDIO_URL}/Čevlji.m4a` },
      { word: "ČOKOLADA", filename: "cokolada.png", url: `${SUPABASE_STORAGE_URL}/cokolada.png`, audio_url: `${SUPABASE_AUDIO_URL}/Čokolada.m4a` },
      { word: "ČOLN", filename: "coln.png", url: `${SUPABASE_STORAGE_URL}/coln.png`, audio_url: `${SUPABASE_AUDIO_URL}/Čoln.m4a` },
      { word: "ČOPIČ", filename: "copic.png", url: `${SUPABASE_STORAGE_URL}/copic.png`, audio_url: `${SUPABASE_AUDIO_URL}/Čopič.m4a` },
      { word: "ČRKE", filename: "crke.png", url: `${SUPABASE_STORAGE_URL}/crke.png`, audio_url: `${SUPABASE_AUDIO_URL}/Črke.m4a` }
    ]
  },
  {
    letter: "K",
    images: [
      { word: "KAČA", filename: "kaca.png", url: `${SUPABASE_STORAGE_URL}/kaca.png`, audio_url: `${SUPABASE_AUDIO_URL}/Kača.m4a` },
      { word: "KAPA", filename: "kapa.png", url: `${SUPABASE_STORAGE_URL}/kapa.png`, audio_url: `${SUPABASE_AUDIO_URL}/Kapa.m4a` },
      { word: "KAVA", filename: "kava.png", url: `${SUPABASE_STORAGE_URL}/kava.png`, audio_url: `${SUPABASE_AUDIO_URL}/Kava.m4a` },
      { word: "KLAVIR", filename: "klavir.png", url: `${SUPABASE_STORAGE_URL}/klavir.png`, audio_url: `${SUPABASE_AUDIO_URL}/Klavir.m4a` },
      { word: "KLJUČ", filename: "kljuc.png", url: `${SUPABASE_STORAGE_URL}/kljuc.png`, audio_url: `${SUPABASE_AUDIO_URL}/Ključ.m4a` },
      { word: "KLOP", filename: "klop.png", url: `${SUPABASE_STORAGE_URL}/klop.png`, audio_url: `${SUPABASE_AUDIO_URL}/Klop.m4a` },
      { word: "KNJIGA", filename: "knjiga.png", url: `${SUPABASE_STORAGE_URL}/knjiga.png`, audio_url: `${SUPABASE_AUDIO_URL}/Knjiga.m4a` },
      { word: "KOCKA", filename: "kocka.png", url: `${SUPABASE_STORAGE_URL}/kocka.png`, audio_url: `${SUPABASE_AUDIO_URL}/Kocka.m4a` },
      { word: "KOKOS", filename: "kokos.png", url: `${SUPABASE_STORAGE_URL}/kokos.png`, audio_url: `${SUPABASE_AUDIO_URL}/Kokos.m4a` },
      { word: "KOLO", filename: "kolo.png", url: `${SUPABASE_STORAGE_URL}/kolo.png`, audio_url: `${SUPABASE_AUDIO_URL}/Kolo.m4a` }
    ]
  },
  {
    letter: "L",
    images: [
      { word: "LADJA", filename: "ladja.png", url: `${SUPABASE_STORAGE_URL}/ladja.png`, audio_url: `${SUPABASE_AUDIO_URL}/Ladja.m4a` },
      { word: "LED", filename: "led.png", url: `${SUPABASE_STORAGE_URL}/led.png`, audio_url: `${SUPABASE_AUDIO_URL}/Led.m4a` },
      { word: "LETALO", filename: "letalo.png", url: `${SUPABASE_STORAGE_URL}/letalo.png`, audio_url: `${SUPABASE_AUDIO_URL}/Letalo.m4a` },
      { word: "LEV", filename: "lev.png", url: `${SUPABASE_STORAGE_URL}/lev.png`, audio_url: `${SUPABASE_AUDIO_URL}/Lev.m4a` },
      { word: "LIST", filename: "list.png", url: `${SUPABASE_STORAGE_URL}/list.png`, audio_url: `${SUPABASE_AUDIO_URL}/List.m4a` },
      { word: "LIZIKA", filename: "lizika.png", url: `${SUPABASE_STORAGE_URL}/lizika.png`, audio_url: `${SUPABASE_AUDIO_URL}/Lizika.m4a` },
      { word: "LONEC", filename: "lonec.png", url: `${SUPABASE_STORAGE_URL}/lonec.png`, audio_url: `${SUPABASE_AUDIO_URL}/Lonec.m4a` },
      { word: "LOPAR", filename: "lopar.png", url: `${SUPABASE_STORAGE_URL}/lopar.png`, audio_url: `${SUPABASE_AUDIO_URL}/Lopar.m4a` },
      { word: "LUBENICA", filename: "lubenica.png", url: `${SUPABASE_STORAGE_URL}/lubenica.png`, audio_url: `${SUPABASE_AUDIO_URL}/Lubenica.m4a` },
      { word: "LUČ", filename: "luc.png", url: `${SUPABASE_STORAGE_URL}/luc.png`, audio_url: `${SUPABASE_AUDIO_URL}/Luč.m4a` }
    ]
  },
  {
    letter: "S",
    images: [
      { word: "SEDEM", filename: "sedem.png", url: `${SUPABASE_STORAGE_URL}/sedem.png`, audio_url: `${SUPABASE_AUDIO_URL}/Sedem.m4a` },
      { word: "SIR", filename: "sir.png", url: `${SUPABASE_STORAGE_URL}/sir.png`, audio_url: `${SUPABASE_AUDIO_URL}/Sir.m4a` },
      { word: "SLADOLED", filename: "sladoled.png", url: `${SUPABASE_STORAGE_URL}/sladoled.png`, audio_url: `${SUPABASE_AUDIO_URL}/Sladoled.m4a` },
      { word: "SLIKA", filename: "slika.png", url: `${SUPABASE_STORAGE_URL}/slika.png`, audio_url: `${SUPABASE_AUDIO_URL}/Slika.m4a` },
      { word: "SLON", filename: "slon.png", url: `${SUPABASE_STORAGE_URL}/slon.png`, audio_url: `${SUPABASE_AUDIO_URL}/Slon.m4a` },
      { word: "SMREKA", filename: "smreka.png", url: `${SUPABASE_STORAGE_URL}/smreka.png`, audio_url: `${SUPABASE_AUDIO_URL}/Smreka.m4a` },
      { word: "SNEG", filename: "sneg.png", url: `${SUPABASE_STORAGE_URL}/sneg.png`, audio_url: `${SUPABASE_AUDIO_URL}/Sneg.m4a` },
      { word: "SNEŽAK", filename: "snezak.png", url: `${SUPABASE_STORAGE_URL}/snezak.png`, audio_url: `${SUPABASE_AUDIO_URL}/Snežak.m4a` },
      { word: "SOK", filename: "sok.png", url: `${SUPABASE_STORAGE_URL}/sok.png`, audio_url: `${SUPABASE_AUDIO_URL}/Sok.m4a` },
      { word: "SONCE", filename: "sonce.png", url: `${SUPABASE_STORAGE_URL}/sonce.png`, audio_url: `${SUPABASE_AUDIO_URL}/Sonce.m4a` }
    ]
  },
  {
    letter: "Š",
    images: [
      { word: "ŠAH", filename: "sah.png", url: `${SUPABASE_STORAGE_URL}/sah.png`, audio_url: `${SUPABASE_AUDIO_URL}/Šah.m4a` },
      { word: "ŠAL", filename: "sal.png", url: `${SUPABASE_STORAGE_URL}/sal.png`, audio_url: `${SUPABASE_AUDIO_URL}/Šal.m4a` },
      { word: "ŠČETKA", filename: "scetka.png", url: `${SUPABASE_STORAGE_URL}/scetka.png`, audio_url: `${SUPABASE_AUDIO_URL}/Ščetka.m4a` },
      { word: "ŠKARJE", filename: "skarje.png", url: `${SUPABASE_STORAGE_URL}/skarje.png`, audio_url: `${SUPABASE_AUDIO_URL}/Škarje.m4a` },
      { word: "ŠKATLA", filename: "skatla.png", url: `${SUPABASE_STORAGE_URL}/skatla.png`, audio_url: `${SUPABASE_AUDIO_URL}/Škatla.m4a` },
      { word: "ŠKOLJKA", filename: "skoljka.png", url: `${SUPABASE_STORAGE_URL}/skoljka.png`, audio_url: `${SUPABASE_AUDIO_URL}/Školjka.m4a` },
      { word: "ŠOPEK", filename: "sopek.png", url: `${SUPABASE_STORAGE_URL}/sopek.png`, audio_url: `${SUPABASE_AUDIO_URL}/Šopek.m4a` },
      { word: "ŠOTOR", filename: "sotor.png", url: `${SUPABASE_STORAGE_URL}/sotor.png`, audio_url: `${SUPABASE_AUDIO_URL}/Šotor.m4a` },
      { word: "ŠTAMPILJKA", filename: "stampiljka.png", url: `${SUPABASE_STORAGE_URL}/stampiljka.png`, audio_url: `${SUPABASE_AUDIO_URL}/Štampiljka.m4a` },
      { word: "ŠTORKLJA", filename: "storklja.png", url: `${SUPABASE_STORAGE_URL}/storklja.png`, audio_url: `${SUPABASE_AUDIO_URL}/Štorklja.m4a` }
    ]
  },
  {
    letter: "Z",
    images: [
      { word: "ZAJEC", filename: "zajec.png", url: `${SUPABASE_STORAGE_URL}/zajec.png`, audio_url: `${SUPABASE_AUDIO_URL}/Zajec.m4a` },
      { word: "ZASLON", filename: "zaslon.png", url: `${SUPABASE_STORAGE_URL}/zaslon.png`, audio_url: `${SUPABASE_AUDIO_URL}/Zaslon.m4a` },
      { word: "ZAVESA", filename: "zavesa.png", url: `${SUPABASE_STORAGE_URL}/zavesa.png`, audio_url: `${SUPABASE_AUDIO_URL}/Zavesa.m4a` },
      { word: "ZEBRA", filename: "zebra.png", url: `${SUPABASE_STORAGE_URL}/zebra.png`, audio_url: `${SUPABASE_AUDIO_URL}/Zebra.m4a` },
      { word: "ZLATO", filename: "zlato.png", url: `${SUPABASE_STORAGE_URL}/zlato.png`, audio_url: `${SUPABASE_AUDIO_URL}/Zlato.m4a` },
      { word: "ZMAJ", filename: "zmaj.png", url: `${SUPABASE_STORAGE_URL}/zmaj.png`, audio_url: `${SUPABASE_AUDIO_URL}/Zmaj.m4a` },
      { word: "ZOB", filename: "zob.png", url: `${SUPABASE_STORAGE_URL}/zob.png`, audio_url: `${SUPABASE_AUDIO_URL}/Zob.m4a` },
      { word: "ZOBOTREBEC", filename: "zobotrebec.png", url: `${SUPABASE_STORAGE_URL}/zobotrebec.png`, audio_url: `${SUPABASE_AUDIO_URL}/Zobotrebec.m4a` },
      { word: "ZVEZDA", filename: "zvezda.png", url: `${SUPABASE_STORAGE_URL}/zvezda.png`, audio_url: `${SUPABASE_AUDIO_URL}/Zvezda.m4a` },
      { word: "ZVOČNIK", filename: "zvocnik.png", url: `${SUPABASE_STORAGE_URL}/zvocnik.png`, audio_url: `${SUPABASE_AUDIO_URL}/Zvočnik.m4a` }
    ]
  },
  {
    letter: "Ž",
    images: [
      { word: "ŽABA", filename: "zaba.png", url: `${SUPABASE_STORAGE_URL}/zaba.png`, audio_url: `${SUPABASE_AUDIO_URL}/Žaba.m4a` },
      { word: "ŽAGA", filename: "zaga.png", url: `${SUPABASE_STORAGE_URL}/zaga.png`, audio_url: `${SUPABASE_AUDIO_URL}/Žaga.m4a` },
      { word: "ŽARNICA", filename: "zarnica.png", url: `${SUPABASE_STORAGE_URL}/zarnica.png`, audio_url: `${SUPABASE_AUDIO_URL}/Žarnica.m4a` },
      { word: "ŽEBELJ", filename: "zebelj.png", url: `${SUPABASE_STORAGE_URL}/zebelj.png`, audio_url: `${SUPABASE_AUDIO_URL}/Žebelj.m4a` },
      { word: "ŽELVA", filename: "zelva.png", url: `${SUPABASE_STORAGE_URL}/zelva.png`, audio_url: `${SUPABASE_AUDIO_URL}/Želva.m4a` },
      { word: "ŽERJAV", filename: "zerjav.png", url: `${SUPABASE_STORAGE_URL}/zerjav.png`, audio_url: `${SUPABASE_AUDIO_URL}/Žerjav.m4a` },
      { word: "ŽIRAFA", filename: "zirafa.png", url: `${SUPABASE_STORAGE_URL}/zirafa.png`, audio_url: `${SUPABASE_AUDIO_URL}/Žirafa.m4a` },
      { word: "ŽLICA", filename: "zlica.png", url: `${SUPABASE_STORAGE_URL}/zlica.png`, audio_url: `${SUPABASE_AUDIO_URL}/Žlica.m4a` },
      { word: "ŽOGA", filename: "zoga.png", url: `${SUPABASE_STORAGE_URL}/zoga.png`, audio_url: `${SUPABASE_AUDIO_URL}/Žoga.m4a` },
      { word: "ŽOLNA", filename: "zolna.png", url: `${SUPABASE_STORAGE_URL}/zolna.png`, audio_url: `${SUPABASE_AUDIO_URL}/Žolna.m4a` }
    ]
  },
  {
    letter: "R",
    images: [
      { word: "RACA", filename: "raca.png", url: `${SUPABASE_STORAGE_URL}/raca.png`, audio_url: `${SUPABASE_AUDIO_URL}/Raca.m4a` },
      { word: "RAK", filename: "rak.png", url: `${SUPABASE_STORAGE_URL}/rak.png`, audio_url: `${SUPABASE_AUDIO_URL}/Rak.m4a` },
      { word: "RAKETA", filename: "raketa.png", url: `${SUPABASE_STORAGE_URL}/raketa.png`, audio_url: `${SUPABASE_AUDIO_URL}/Raketa.m4a` },
      { word: "RAVNILO", filename: "ravnilo.png", url: `${SUPABASE_STORAGE_URL}/ravnilo.png`, audio_url: `${SUPABASE_AUDIO_URL}/Ravnilo.m4a` },
      { word: "REP", filename: "rep.png", url: `${SUPABASE_STORAGE_URL}/rep.png`, audio_url: `${SUPABASE_AUDIO_URL}/Rep.m4a` },
      { word: "REPA", filename: "repa.png", url: `${SUPABASE_STORAGE_URL}/repa.png`, audio_url: `${SUPABASE_AUDIO_URL}/Repa.m4a` },
      { word: "RIBA", filename: "riba.png", url: `${SUPABASE_STORAGE_URL}/riba.png`, audio_url: `${SUPABASE_AUDIO_URL}/Riba.m4a` },
      { word: "ROBOT", filename: "robot.png", url: `${SUPABASE_STORAGE_URL}/robot.png`, audio_url: `${SUPABASE_AUDIO_URL}/Robot.m4a` },
      { word: "ROKA", filename: "roka.png", url: `${SUPABASE_STORAGE_URL}/roka.png`, audio_url: `${SUPABASE_AUDIO_URL}/Roka.m4a` },
      { word: "ROLKA", filename: "rolka.png", url: `${SUPABASE_STORAGE_URL}/rolka.png`, audio_url: `${SUPABASE_AUDIO_URL}/Rolka.m4a` }
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