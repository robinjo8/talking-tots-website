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

const SUPABASE_STORAGE_URL = "https://ecmtctwovkheohqwahvt.supabase.co/storage/v1/object/public/slike";
const SUPABASE_AUDIO_URL = "https://ecmtctwovkheohqwahvt.supabase.co/storage/v1/object/public/zvocni-posnetki";

export const matchingGameData: LetterData[] = [
  {
    letter: "C",
    images: [
      { word: "CEDILO", filename: "cedilo.png", url: `${SUPABASE_STORAGE_URL}/cedilo.png`, audio_url: `${SUPABASE_AUDIO_URL}/cedilo.m4a` },
      { word: "CEKIN", filename: "cekin.png", url: `${SUPABASE_STORAGE_URL}/cekin.png`, audio_url: `${SUPABASE_AUDIO_URL}/cekin.m4a` },
      { word: "CERKEV", filename: "cerkev.png", url: `${SUPABASE_STORAGE_URL}/cerkev.png`, audio_url: `${SUPABASE_AUDIO_URL}/cerkev.m4a` },
      { word: "CESTA", filename: "cesta.png", url: `${SUPABASE_STORAGE_URL}/cesta.png`, audio_url: `${SUPABASE_AUDIO_URL}/cesta.m4a` },
      { word: "CEV", filename: "cev.png", url: `${SUPABASE_STORAGE_URL}/cev.png`, audio_url: `${SUPABASE_AUDIO_URL}/cev.m4a` },
      { word: "CIRKUS", filename: "cirkus.png", url: `${SUPABASE_STORAGE_URL}/cirkus.png`, audio_url: `${SUPABASE_AUDIO_URL}/cirkus.m4a` },
      { word: "CISTERNA", filename: "cisterna.png", url: `${SUPABASE_STORAGE_URL}/cisterna.png`, audio_url: `${SUPABASE_AUDIO_URL}/cisterna.m4a` },
      { word: "COKLA", filename: "cokla.png", url: `${SUPABASE_STORAGE_URL}/cokla.png`, audio_url: `${SUPABASE_AUDIO_URL}/cokla.m4a` },
      { word: "COPAT", filename: "copat.png", url: `${SUPABASE_STORAGE_URL}/copat.png`, audio_url: `${SUPABASE_AUDIO_URL}/copat.m4a` },
      { word: "CVET", filename: "cvet.png", url: `${SUPABASE_STORAGE_URL}/cvet.png`, audio_url: `${SUPABASE_AUDIO_URL}/cvet.m4a` }
    ]
  },
  {
    letter: "Č",
    images: [
      { word: "ČAJ", filename: "caj.png", url: `${SUPABASE_STORAGE_URL}/caj.png`, audio_url: `${SUPABASE_AUDIO_URL}/caj.m4a` },
      { word: "ČASOPIS", filename: "casopis.png", url: `${SUPABASE_STORAGE_URL}/casopis.png`, audio_url: `${SUPABASE_AUDIO_URL}/casopis.m4a` },
      { word: "ČEBELA", filename: "cebela.png", url: `${SUPABASE_STORAGE_URL}/cebela.png`, audio_url: `${SUPABASE_AUDIO_URL}/cebela.m4a` },
      { word: "ČEBULA", filename: "cebula.png", url: `${SUPABASE_STORAGE_URL}/cebula.png`, audio_url: `${SUPABASE_AUDIO_URL}/cebula.m4a` },
      { word: "ČESEN", filename: "cesen.png", url: `${SUPABASE_STORAGE_URL}/cesen.png`, audio_url: `${SUPABASE_AUDIO_URL}/cesen.m4a` },
      { word: "ČEVLJI", filename: "cevlji.png", url: `${SUPABASE_STORAGE_URL}/cevlji.png`, audio_url: `${SUPABASE_AUDIO_URL}/cevlji.m4a` },
      { word: "ČOKOLADA", filename: "cokolada.png", url: `${SUPABASE_STORAGE_URL}/cokolada.png`, audio_url: `${SUPABASE_AUDIO_URL}/cokolada.m4a` },
      { word: "ČOLN", filename: "coln.png", url: `${SUPABASE_STORAGE_URL}/coln.png`, audio_url: `${SUPABASE_AUDIO_URL}/coln.m4a` },
      { word: "ČOPIČ", filename: "copic.png", url: `${SUPABASE_STORAGE_URL}/copic.png`, audio_url: `${SUPABASE_AUDIO_URL}/copic.m4a` },
      { word: "ČRKE", filename: "crke.png", url: `${SUPABASE_STORAGE_URL}/crke.png`, audio_url: `${SUPABASE_AUDIO_URL}/crke.m4a` }
    ]
  },
  {
    letter: "K",
    images: [
      { word: "KAČA", filename: "kaca.png", url: `${SUPABASE_STORAGE_URL}/kaca.png`, audio_url: `${SUPABASE_AUDIO_URL}/kaca.m4a` },
      { word: "KAPA", filename: "kapa.png", url: `${SUPABASE_STORAGE_URL}/kapa.png`, audio_url: `${SUPABASE_AUDIO_URL}/kapa.m4a` },
      { word: "KAVA", filename: "kava.png", url: `${SUPABASE_STORAGE_URL}/kava.png`, audio_url: `${SUPABASE_AUDIO_URL}/kava.m4a` },
      { word: "KLAVIR", filename: "klavir.png", url: `${SUPABASE_STORAGE_URL}/klavir.png`, audio_url: `${SUPABASE_AUDIO_URL}/klavir.m4a` },
      { word: "KLJUČ", filename: "kljuc.png", url: `${SUPABASE_STORAGE_URL}/kljuc.png`, audio_url: `${SUPABASE_AUDIO_URL}/kljuc.m4a` },
      { word: "KLOP", filename: "klop.png", url: `${SUPABASE_STORAGE_URL}/klop.png`, audio_url: `${SUPABASE_AUDIO_URL}/klop.m4a` },
      { word: "KNJIGA", filename: "knjiga.png", url: `${SUPABASE_STORAGE_URL}/knjiga.png`, audio_url: `${SUPABASE_AUDIO_URL}/knjiga.m4a` },
      { word: "KOCKA", filename: "kocka.png", url: `${SUPABASE_STORAGE_URL}/kocka.png`, audio_url: `${SUPABASE_AUDIO_URL}/kocka.m4a` },
      { word: "KOKOS", filename: "kokos_sadez.png", url: `${SUPABASE_STORAGE_URL}/kokos_sadez.png`, audio_url: `${SUPABASE_AUDIO_URL}/kokos_sadez.m4a` },
      { word: "KOKOŠ", filename: "kokos.png", url: `${SUPABASE_STORAGE_URL}/kokos.png`, audio_url: `${SUPABASE_AUDIO_URL}/kokos_1.m4a` },
      { word: "KOLAČ", filename: "kolac.png", url: `${SUPABASE_STORAGE_URL}/kolac.png`, audio_url: `${SUPABASE_AUDIO_URL}/kolac.m4a` },
      { word: "KOLO", filename: "kolo.png", url: `${SUPABASE_STORAGE_URL}/kolo.png`, audio_url: `${SUPABASE_AUDIO_URL}/kolo.m4a` },
      { word: "KORUZA", filename: "koruza.png", url: `${SUPABASE_STORAGE_URL}/koruza.png`, audio_url: `${SUPABASE_AUDIO_URL}/koruza.m4a` },
      { word: "KOST", filename: "kost.png", url: `${SUPABASE_STORAGE_URL}/kost.png`, audio_url: `${SUPABASE_AUDIO_URL}/kost.m4a` },
      { word: "KOŠ", filename: "kos.png", url: `${SUPABASE_STORAGE_URL}/kos.png`, audio_url: `${SUPABASE_AUDIO_URL}/kos.m4a` },
      { word: "KOŠARA", filename: "kosara.png", url: `${SUPABASE_STORAGE_URL}/kosara.png`, audio_url: `${SUPABASE_AUDIO_URL}/kosara.m4a` },
      { word: "KOZA", filename: "koza.png", url: `${SUPABASE_STORAGE_URL}/koza.png`, audio_url: `${SUPABASE_AUDIO_URL}/koza.m4a` },
      { word: "KOZAREC", filename: "kozarec.png", url: `${SUPABASE_STORAGE_URL}/kozarec.png`, audio_url: `${SUPABASE_AUDIO_URL}/kozarec.m4a` },
      { word: "KOŽA", filename: "koza_skin.png", url: `${SUPABASE_STORAGE_URL}/koza_skin.png`, audio_url: `${SUPABASE_AUDIO_URL}/koza_skin.m4a` },
      { word: "KRAVA", filename: "krava.png", url: `${SUPABASE_STORAGE_URL}/krava.png`, audio_url: `${SUPABASE_AUDIO_URL}/krava.m4a` },
      { word: "KROF", filename: "krof.png", url: `${SUPABASE_STORAGE_URL}/krof.png`, audio_url: `${SUPABASE_AUDIO_URL}/krof.m4a` },
      { word: "KROG", filename: "krog.png", url: `${SUPABASE_STORAGE_URL}/krog.png`, audio_url: `${SUPABASE_AUDIO_URL}/krog.m4a` },
      { word: "KROŽNIK", filename: "kroznik.png", url: `${SUPABASE_STORAGE_URL}/kroznik.png`, audio_url: `${SUPABASE_AUDIO_URL}/kroznik.m4a` },
      { word: "KRUH", filename: "kruh.png", url: `${SUPABASE_STORAGE_URL}/kruh.png`, audio_url: `${SUPABASE_AUDIO_URL}/kruh.m4a` },
      { word: "KUMARA", filename: "kumara.png", url: `${SUPABASE_STORAGE_URL}/kumara.png`, audio_url: `${SUPABASE_AUDIO_URL}/kumara.m4a` },
      { word: "KUŽA", filename: "kuza.png", url: `${SUPABASE_STORAGE_URL}/kuza.png`, audio_url: `${SUPABASE_AUDIO_URL}/kuza.m4a` }
    ]
  },
  {
    letter: "L",
    images: [
      { word: "LADJA", filename: "ladja.png", url: `${SUPABASE_STORAGE_URL}/ladja.png`, audio_url: `${SUPABASE_AUDIO_URL}/ladja.m4a` },
      { word: "LASJE", filename: "lasje.png", url: `${SUPABASE_STORAGE_URL}/lasje.png`, audio_url: `${SUPABASE_AUDIO_URL}/lasje.m4a` },
      { word: "LED", filename: "led.png", url: `${SUPABASE_STORAGE_URL}/led.png`, audio_url: `${SUPABASE_AUDIO_URL}/led.m4a` },
      { word: "LEŠNIK", filename: "lesnik.png", url: `${SUPABASE_STORAGE_URL}/lesnik.png`, audio_url: `${SUPABASE_AUDIO_URL}/lesnik.m4a` },
      { word: "LETALO", filename: "letalo.png", url: `${SUPABASE_STORAGE_URL}/letalo.png`, audio_url: `${SUPABASE_AUDIO_URL}/letalo.m4a` },
      { word: "LEV", filename: "lev.png", url: `${SUPABASE_STORAGE_URL}/lev.png`, audio_url: `${SUPABASE_AUDIO_URL}/lev.m4a` },
      { word: "LES", filename: "les.png", url: `${SUPABASE_STORAGE_URL}/les.png`, audio_url: `${SUPABASE_AUDIO_URL}/les.m4a` },
      { word: "LIST", filename: "list.png", url: `${SUPABASE_STORAGE_URL}/list.png`, audio_url: `${SUPABASE_AUDIO_URL}/list.m4a` },
      { word: "LIZIKA", filename: "lizika.png", url: `${SUPABASE_STORAGE_URL}/lizika.png`, audio_url: `${SUPABASE_AUDIO_URL}/lizika.m4a` },
      { word: "LONEC", filename: "lonec.png", url: `${SUPABASE_STORAGE_URL}/lonec.png`, audio_url: `${SUPABASE_AUDIO_URL}/lonec.m4a` },
      { word: "LOPAR", filename: "lopar.png", url: `${SUPABASE_STORAGE_URL}/lopar.png`, audio_url: `${SUPABASE_AUDIO_URL}/lopar.m4a` },
      { word: "LUBENICA", filename: "lubenica.png", url: `${SUPABASE_STORAGE_URL}/lubenica.png`, audio_url: `${SUPABASE_AUDIO_URL}/lubenica.m4a` },
      { word: "LUČ", filename: "luc.png", url: `${SUPABASE_STORAGE_URL}/luc.png`, audio_url: `${SUPABASE_AUDIO_URL}/luc.m4a` },
      { word: "LUŽA", filename: "luza.png", url: `${SUPABASE_STORAGE_URL}/luza.png`, audio_url: `${SUPABASE_AUDIO_URL}/luza.m4a` }
    ]
  },
  {
    letter: "S",
    images: [
      { word: "SEDEM", filename: "sedem.png", url: `${SUPABASE_STORAGE_URL}/sedem.png`, audio_url: `${SUPABASE_AUDIO_URL}/sedem.m4a` },
      { word: "SIR", filename: "sir.png", url: `${SUPABASE_STORAGE_URL}/sir.png`, audio_url: `${SUPABASE_AUDIO_URL}/sir.m4a` },
      { word: "SLADOLED", filename: "sladoled.png", url: `${SUPABASE_STORAGE_URL}/sladoled.png`, audio_url: `${SUPABASE_AUDIO_URL}/sladoled.m4a` },
      { word: "SLIKA", filename: "slika.png", url: `${SUPABASE_STORAGE_URL}/slika.png`, audio_url: `${SUPABASE_AUDIO_URL}/slika.m4a` },
      { word: "SLON", filename: "slon.png", url: `${SUPABASE_STORAGE_URL}/slon.png`, audio_url: `${SUPABASE_AUDIO_URL}/slon.m4a` },
      { word: "SLUZ", filename: "sluz.png", url: `${SUPABASE_STORAGE_URL}/sluz.png`, audio_url: `${SUPABASE_AUDIO_URL}/sluz.m4a` },
      { word: "SMREKA", filename: "smreka.png", url: `${SUPABASE_STORAGE_URL}/smreka.png`, audio_url: `${SUPABASE_AUDIO_URL}/smreka.m4a` },
      { word: "SNEG", filename: "sneg.png", url: `${SUPABASE_STORAGE_URL}/sneg.png`, audio_url: `${SUPABASE_AUDIO_URL}/sneg.m4a` },
      { word: "SNEŽAK", filename: "snezak.png", url: `${SUPABASE_STORAGE_URL}/snezak.png`, audio_url: `${SUPABASE_AUDIO_URL}/snezak.m4a` },
      { word: "SNEŽINKA", filename: "snezinka.png", url: `${SUPABASE_STORAGE_URL}/snezinka.png`, audio_url: `${SUPABASE_AUDIO_URL}/snezinka.m4a` },
      { word: "SOK", filename: "sok.png", url: `${SUPABASE_STORAGE_URL}/sok.png`, audio_url: `${SUPABASE_AUDIO_URL}/sok.m4a` },
      { word: "SONCE", filename: "sonce.png", url: `${SUPABASE_STORAGE_URL}/sonce.png`, audio_url: `${SUPABASE_AUDIO_URL}/sonce.m4a` },
      { word: "SOVA", filename: "sova.png", url: `${SUPABASE_STORAGE_URL}/sova.png`, audio_url: `${SUPABASE_AUDIO_URL}/sova.m4a` },
      { word: "STOL", filename: "stol.png", url: `${SUPABASE_STORAGE_URL}/stol.png`, audio_url: `${SUPABASE_AUDIO_URL}/stol.m4a` },
      { word: "SVETILKA", filename: "svetilka.png", url: `${SUPABASE_STORAGE_URL}/svetilka.png`, audio_url: `${SUPABASE_AUDIO_URL}/svetilka.m4a` },
      { word: "SVINČNIK", filename: "svincnik.png", url: `${SUPABASE_STORAGE_URL}/svincnik.png`, audio_url: `${SUPABASE_AUDIO_URL}/svincnik.m4a` }
    ]
  },
  {
    letter: "Š",
    images: [
      { word: "ŠAH", filename: "sah.png", url: `${SUPABASE_STORAGE_URL}/sah.png`, audio_url: `${SUPABASE_AUDIO_URL}/sah.m4a` },
      { word: "ŠAL", filename: "sal.png", url: `${SUPABASE_STORAGE_URL}/sal.png`, audio_url: `${SUPABASE_AUDIO_URL}/sal.m4a` },
      { word: "ŠČETKA", filename: "scetka.png", url: `${SUPABASE_STORAGE_URL}/scetka.png`, audio_url: `${SUPABASE_AUDIO_URL}/scetka.m4a` },
      { word: "ŠKARJE", filename: "skarje.png", url: `${SUPABASE_STORAGE_URL}/skarje.png`, audio_url: `${SUPABASE_AUDIO_URL}/skarje.m4a` },
      { word: "ŠKATLA", filename: "skatla.png", url: `${SUPABASE_STORAGE_URL}/skatla.png`, audio_url: `${SUPABASE_AUDIO_URL}/skatla.m4a` },
      { word: "ŠKOLJKA", filename: "skoljka.png", url: `${SUPABASE_STORAGE_URL}/skoljka.png`, audio_url: `${SUPABASE_AUDIO_URL}/skoljka.m4a` },
      { word: "ŠOPEK", filename: "sopek.png", url: `${SUPABASE_STORAGE_URL}/sopek.png`, audio_url: `${SUPABASE_AUDIO_URL}/sopek.m4a` },
      { word: "ŠOTOR", filename: "sotor.png", url: `${SUPABASE_STORAGE_URL}/sotor.png`, audio_url: `${SUPABASE_AUDIO_URL}/sotor.m4a` },
      { word: "ŠTAMPILJKA", filename: "stampiljka.png", url: `${SUPABASE_STORAGE_URL}/stampiljka.png`, audio_url: `${SUPABASE_AUDIO_URL}/stampiljka.m4a` },
      { word: "ŠTORKLJA", filename: "storklja.png", url: `${SUPABASE_STORAGE_URL}/storklja.png`, audio_url: `${SUPABASE_AUDIO_URL}/storklja.m4a` }
    ]
  },
  {
    letter: "Z",
    images: [
      { word: "ZAJEC", filename: "zajec.png", url: `${SUPABASE_STORAGE_URL}/zajec.png`, audio_url: `${SUPABASE_AUDIO_URL}/zajec.m4a` },
      { word: "ZASLON", filename: "zaslon.png", url: `${SUPABASE_STORAGE_URL}/zaslon.png`, audio_url: `${SUPABASE_AUDIO_URL}/zaslon.m4a` },
      { word: "ZAVESA", filename: "zavesa.png", url: `${SUPABASE_STORAGE_URL}/zavesa.png`, audio_url: `${SUPABASE_AUDIO_URL}/zavesa.m4a` },
      { word: "ZEBRA", filename: "zebra.png", url: `${SUPABASE_STORAGE_URL}/zebra.png`, audio_url: `${SUPABASE_AUDIO_URL}/zebra.m4a` },
      { word: "ZLATO", filename: "zlato.png", url: `${SUPABASE_STORAGE_URL}/zlato.png`, audio_url: `${SUPABASE_AUDIO_URL}/zlato.m4a` },
      { word: "ZMAJ", filename: "zmaj.png", url: `${SUPABASE_STORAGE_URL}/zmaj.png`, audio_url: `${SUPABASE_AUDIO_URL}/zmaj.m4a` },
      { word: "ZOB", filename: "zob.png", url: `${SUPABASE_STORAGE_URL}/zob.png`, audio_url: `${SUPABASE_AUDIO_URL}/zob.m4a` },
      { word: "ZOBOTREBEC", filename: "zobotrebec.png", url: `${SUPABASE_STORAGE_URL}/zobotrebec.png`, audio_url: `${SUPABASE_AUDIO_URL}/zobotrebec.m4a` },
      { word: "ZVEZDA", filename: "zvezda.png", url: `${SUPABASE_STORAGE_URL}/zvezda.png`, audio_url: `${SUPABASE_AUDIO_URL}/zvezda.m4a` },
      { word: "ZVEZEK", filename: "zvezek.png", url: `${SUPABASE_STORAGE_URL}/zvezek.png`, audio_url: `${SUPABASE_AUDIO_URL}/zvezek.m4a` },
      { word: "ZVOČNIK", filename: "zvocnik.png", url: `${SUPABASE_STORAGE_URL}/zvocnik.png`, audio_url: `${SUPABASE_AUDIO_URL}/zvocnik.m4a` }
    ]
  },
  {
    letter: "Ž",
    images: [
      { word: "ŽABA", filename: "zaba.png", url: `${SUPABASE_STORAGE_URL}/zaba.png`, audio_url: `${SUPABASE_AUDIO_URL}/zaba.m4a` },
      { word: "ŽAGA", filename: "zaga.png", url: `${SUPABASE_STORAGE_URL}/zaga.png`, audio_url: `${SUPABASE_AUDIO_URL}/zaga.m4a` },
      { word: "ŽARNICA", filename: "zarnica.png", url: `${SUPABASE_STORAGE_URL}/zarnica.png`, audio_url: `${SUPABASE_AUDIO_URL}/zarnica.m4a` },
      { word: "ŽEBELJ", filename: "zebelj.png", url: `${SUPABASE_STORAGE_URL}/zebelj.png`, audio_url: `${SUPABASE_AUDIO_URL}/zebelj.m4a` },
      { word: "ŽELVA", filename: "zelva.png", url: `${SUPABASE_STORAGE_URL}/zelva.png`, audio_url: `${SUPABASE_AUDIO_URL}/zelva.m4a` },
      { word: "ŽERJAV", filename: "zerjav.png", url: `${SUPABASE_STORAGE_URL}/zerjav.png`, audio_url: `${SUPABASE_AUDIO_URL}/zerjav.m4a` },
      { word: "ŽIRAFA", filename: "zirafa.png", url: `${SUPABASE_STORAGE_URL}/zirafa.png`, audio_url: `${SUPABASE_AUDIO_URL}/zirafa.m4a` },
      { word: "ŽLICA", filename: "zlica.png", url: `${SUPABASE_STORAGE_URL}/zlica.png`, audio_url: `${SUPABASE_AUDIO_URL}/zlica.m4a` },
      { word: "ŽOGA", filename: "zoga.png", url: `${SUPABASE_STORAGE_URL}/zoga.png`, audio_url: `${SUPABASE_AUDIO_URL}/zoga.m4a` },
      { word: "ŽOLNA", filename: "zolna.png", url: `${SUPABASE_STORAGE_URL}/zolna.png`, audio_url: `${SUPABASE_AUDIO_URL}/zolna.m4a` }
    ]
  },
  {
    letter: "R",
    images: [
      { word: "RACA", filename: "raca.png", url: `${SUPABASE_STORAGE_URL}/raca.png`, audio_url: `${SUPABASE_AUDIO_URL}/raca.m4a` },
      { word: "RAK", filename: "rak.png", url: `${SUPABASE_STORAGE_URL}/rak.png`, audio_url: `${SUPABASE_AUDIO_URL}/rak.m4a` },
      { word: "RAKETA", filename: "raketa.png", url: `${SUPABASE_STORAGE_URL}/raketa.png`, audio_url: `${SUPABASE_AUDIO_URL}/raketa.m4a` },
      { word: "RAVNILO", filename: "ravnilo.png", url: `${SUPABASE_STORAGE_URL}/ravnilo.png`, audio_url: `${SUPABASE_AUDIO_URL}/ravnilo.m4a` },
      { word: "REP", filename: "rep.png", url: `${SUPABASE_STORAGE_URL}/rep.png`, audio_url: `${SUPABASE_AUDIO_URL}/rep.m4a` },
      { word: "REPA", filename: "repa.png", url: `${SUPABASE_STORAGE_URL}/repa.png`, audio_url: `${SUPABASE_AUDIO_URL}/repa.m4a` },
      { word: "RIBA", filename: "riba.png", url: `${SUPABASE_STORAGE_URL}/riba.png`, audio_url: `${SUPABASE_AUDIO_URL}/riba.m4a` },
      { word: "RIBEZ", filename: "ribez.png", url: `${SUPABASE_STORAGE_URL}/ribez.png`, audio_url: `${SUPABASE_AUDIO_URL}/ribez.m4a` },
      { word: "RIBIČ", filename: "ribic.png", url: `${SUPABASE_STORAGE_URL}/ribic.png`, audio_url: `${SUPABASE_AUDIO_URL}/ribic.m4a` },
      { word: "RIS", filename: "ris.png", url: `${SUPABASE_STORAGE_URL}/ris.png`, audio_url: `${SUPABASE_AUDIO_URL}/ris.m4a` },
      { word: "RIŽ", filename: "riz.png", url: `${SUPABASE_STORAGE_URL}/riz.png`, audio_url: `${SUPABASE_AUDIO_URL}/riz.m4a` },
      { word: "ROBOT", filename: "robot.png", url: `${SUPABASE_STORAGE_URL}/robot.png`, audio_url: `${SUPABASE_AUDIO_URL}/robot.m4a` },
      { word: "ROKA", filename: "roka.png", url: `${SUPABASE_STORAGE_URL}/roka.png`, audio_url: `${SUPABASE_AUDIO_URL}/roka.m4a` },
      { word: "ROKOMETAŠ", filename: "rokometas.png", url: `${SUPABASE_STORAGE_URL}/rokometas.png`, audio_url: `${SUPABASE_AUDIO_URL}/rokometas.m4a` },
      { word: "ROLKA", filename: "rolka.png", url: `${SUPABASE_STORAGE_URL}/rolka.png`, audio_url: `${SUPABASE_AUDIO_URL}/rolka.m4a` },
      { word: "ROPOTULJICA", filename: "ropotuljica.png", url: `${SUPABASE_STORAGE_URL}/ropotuljica.png`, audio_url: `${SUPABASE_AUDIO_URL}/ropotuljica.m4a` },
      { word: "ROŽA", filename: "roza.png", url: `${SUPABASE_STORAGE_URL}/roza.png`, audio_url: `${SUPABASE_AUDIO_URL}/roza.m4a` }
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