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
      { word: "CEDILO", filename: "cedilo.webp", url: `${SUPABASE_STORAGE_URL}/cedilo.webp`, audio_url: `${SUPABASE_AUDIO_URL}/cedilo.m4a` },
      { word: "CEKIN", filename: "cekin.webp", url: `${SUPABASE_STORAGE_URL}/cekin.webp`, audio_url: `${SUPABASE_AUDIO_URL}/cekin.m4a` },
      { word: "CERKEV", filename: "cerkev.webp", url: `${SUPABASE_STORAGE_URL}/cerkev.webp`, audio_url: `${SUPABASE_AUDIO_URL}/cerkev.m4a` },
      { word: "CESTA", filename: "cesta.webp", url: `${SUPABASE_STORAGE_URL}/cesta.webp`, audio_url: `${SUPABASE_AUDIO_URL}/cesta.m4a` },
      { word: "CEV", filename: "cev.webp", url: `${SUPABASE_STORAGE_URL}/cev.webp`, audio_url: `${SUPABASE_AUDIO_URL}/cev.m4a` },
      { word: "CIRKUS", filename: "cirkus.webp", url: `${SUPABASE_STORAGE_URL}/cirkus.webp`, audio_url: `${SUPABASE_AUDIO_URL}/cirkus.m4a` },
      { word: "CISTERNA", filename: "cisterna.webp", url: `${SUPABASE_STORAGE_URL}/cisterna.webp`, audio_url: `${SUPABASE_AUDIO_URL}/cisterna.m4a` },
      { word: "COKLA", filename: "cokla.webp", url: `${SUPABASE_STORAGE_URL}/cokla.webp`, audio_url: `${SUPABASE_AUDIO_URL}/cokla.m4a` },
      { word: "COPAT", filename: "copat.webp", url: `${SUPABASE_STORAGE_URL}/copat.webp`, audio_url: `${SUPABASE_AUDIO_URL}/copat.m4a` },
      { word: "CVET", filename: "cvet.webp", url: `${SUPABASE_STORAGE_URL}/cvet.webp`, audio_url: `${SUPABASE_AUDIO_URL}/cvet.m4a` }
    ]
  },
  {
    letter: "Č",
    images: [
      { word: "ČAJ", filename: "caj.webp", url: `${SUPABASE_STORAGE_URL}/caj.webp`, audio_url: `${SUPABASE_AUDIO_URL}/caj.m4a` },
      { word: "ČASOPIS", filename: "casopis.webp", url: `${SUPABASE_STORAGE_URL}/casopis.webp`, audio_url: `${SUPABASE_AUDIO_URL}/casopis.m4a` },
      { word: "ČEBELA", filename: "cebela.webp", url: `${SUPABASE_STORAGE_URL}/cebela.webp`, audio_url: `${SUPABASE_AUDIO_URL}/cebela.m4a` },
      { word: "ČEBULA", filename: "cebula.webp", url: `${SUPABASE_STORAGE_URL}/cebula.webp`, audio_url: `${SUPABASE_AUDIO_URL}/cebula.m4a` },
      { word: "ČESEN", filename: "cesen.webp", url: `${SUPABASE_STORAGE_URL}/cesen.webp`, audio_url: `${SUPABASE_AUDIO_URL}/cesen.m4a` },
      { word: "ČEVLJI", filename: "cevlji.webp", url: `${SUPABASE_STORAGE_URL}/cevlji.webp`, audio_url: `${SUPABASE_AUDIO_URL}/cevlji.m4a` },
      { word: "ČOKOLADA", filename: "cokolada.webp", url: `${SUPABASE_STORAGE_URL}/cokolada.webp`, audio_url: `${SUPABASE_AUDIO_URL}/cokolada.m4a` },
      { word: "ČOLN", filename: "coln.webp", url: `${SUPABASE_STORAGE_URL}/coln.webp`, audio_url: `${SUPABASE_AUDIO_URL}/coln.m4a` },
      { word: "ČOPIČ", filename: "copic.webp", url: `${SUPABASE_STORAGE_URL}/copic.webp`, audio_url: `${SUPABASE_AUDIO_URL}/copic.m4a` },
      { word: "ČRKE", filename: "crke.webp", url: `${SUPABASE_STORAGE_URL}/crke.webp`, audio_url: `${SUPABASE_AUDIO_URL}/crke.m4a` }
    ]
  },
  {
    letter: "K",
    images: [
      { word: "KAČA", filename: "kaca.webp", url: `${SUPABASE_STORAGE_URL}/kaca.webp`, audio_url: `${SUPABASE_AUDIO_URL}/kaca.m4a` },
      { word: "KAPA", filename: "kapa.webp", url: `${SUPABASE_STORAGE_URL}/kapa.webp`, audio_url: `${SUPABASE_AUDIO_URL}/kapa.m4a` },
      { word: "KAVA", filename: "kava.webp", url: `${SUPABASE_STORAGE_URL}/kava.webp`, audio_url: `${SUPABASE_AUDIO_URL}/kava.m4a` },
      { word: "KLAVIR", filename: "klavir.webp", url: `${SUPABASE_STORAGE_URL}/klavir.webp`, audio_url: `${SUPABASE_AUDIO_URL}/klavir.m4a` },
      { word: "KLJUČ", filename: "kljuc.webp", url: `${SUPABASE_STORAGE_URL}/kljuc.webp`, audio_url: `${SUPABASE_AUDIO_URL}/kljuc.m4a` },
      { word: "KLOP", filename: "klop.webp", url: `${SUPABASE_STORAGE_URL}/klop.webp`, audio_url: `${SUPABASE_AUDIO_URL}/klop.m4a` },
      { word: "KNJIGA", filename: "knjiga.webp", url: `${SUPABASE_STORAGE_URL}/knjiga.webp`, audio_url: `${SUPABASE_AUDIO_URL}/knjiga.m4a` },
      { word: "KOCKA", filename: "kocka.webp", url: `${SUPABASE_STORAGE_URL}/kocka.webp`, audio_url: `${SUPABASE_AUDIO_URL}/kocka.m4a` },
      { word: "KOKOS", filename: "kokos_sadez.webp", url: `${SUPABASE_STORAGE_URL}/kokos_sadez.webp`, audio_url: `${SUPABASE_AUDIO_URL}/kokos_sadez.m4a` },
      { word: "KOKOŠ", filename: "kokos.webp", url: `${SUPABASE_STORAGE_URL}/kokos.webp`, audio_url: `${SUPABASE_AUDIO_URL}/kokos_1.m4a` },
      { word: "KOLAČ", filename: "kolac.webp", url: `${SUPABASE_STORAGE_URL}/kolac.webp`, audio_url: `${SUPABASE_AUDIO_URL}/kolac.m4a` },
      { word: "KOLO", filename: "kolo.webp", url: `${SUPABASE_STORAGE_URL}/kolo.webp`, audio_url: `${SUPABASE_AUDIO_URL}/kolo.m4a` },
      { word: "KORUZA", filename: "koruza.webp", url: `${SUPABASE_STORAGE_URL}/koruza.webp`, audio_url: `${SUPABASE_AUDIO_URL}/koruza.m4a` },
      { word: "KOST", filename: "kost.webp", url: `${SUPABASE_STORAGE_URL}/kost.webp`, audio_url: `${SUPABASE_AUDIO_URL}/kost.m4a` },
      { word: "KOŠ", filename: "kos.webp", url: `${SUPABASE_STORAGE_URL}/kos.webp`, audio_url: `${SUPABASE_AUDIO_URL}/kos.m4a` },
      { word: "KOŠARA", filename: "kosara.webp", url: `${SUPABASE_STORAGE_URL}/kosara.webp`, audio_url: `${SUPABASE_AUDIO_URL}/kosara.m4a` },
      { word: "KOZA", filename: "koza.webp", url: `${SUPABASE_STORAGE_URL}/koza.webp`, audio_url: `${SUPABASE_AUDIO_URL}/koza.m4a` },
      { word: "KOZAREC", filename: "kozarec.webp", url: `${SUPABASE_STORAGE_URL}/kozarec.webp`, audio_url: `${SUPABASE_AUDIO_URL}/kozarec.m4a` },
      { word: "KOŽA", filename: "koza_skin.webp", url: `${SUPABASE_STORAGE_URL}/koza_skin.webp`, audio_url: `${SUPABASE_AUDIO_URL}/koza_skin.m4a` },
      { word: "KRAVA", filename: "krava.webp", url: `${SUPABASE_STORAGE_URL}/krava.webp`, audio_url: `${SUPABASE_AUDIO_URL}/krava.m4a` },
      { word: "KROF", filename: "krof.webp", url: `${SUPABASE_STORAGE_URL}/krof.webp`, audio_url: `${SUPABASE_AUDIO_URL}/krof.m4a` },
      { word: "KROG", filename: "krog.webp", url: `${SUPABASE_STORAGE_URL}/krog.webp`, audio_url: `${SUPABASE_AUDIO_URL}/krog.m4a` },
      { word: "KROŽNIK", filename: "kroznik.webp", url: `${SUPABASE_STORAGE_URL}/kroznik.webp`, audio_url: `${SUPABASE_AUDIO_URL}/kroznik.m4a` },
      { word: "KRUH", filename: "kruh.webp", url: `${SUPABASE_STORAGE_URL}/kruh.webp`, audio_url: `${SUPABASE_AUDIO_URL}/kruh.m4a` },
      { word: "KUMARA", filename: "kumara.webp", url: `${SUPABASE_STORAGE_URL}/kumara.webp`, audio_url: `${SUPABASE_AUDIO_URL}/kumara.m4a` },
      { word: "KUŽA", filename: "kuza.webp", url: `${SUPABASE_STORAGE_URL}/kuza.webp`, audio_url: `${SUPABASE_AUDIO_URL}/kuza.m4a` }
    ]
  },
  {
    letter: "L",
    images: [
      { word: "LADJA", filename: "ladja.webp", url: `${SUPABASE_STORAGE_URL}/ladja.webp`, audio_url: `${SUPABASE_AUDIO_URL}/ladja.m4a` },
      { word: "LASJE", filename: "lasje.webp", url: `${SUPABASE_STORAGE_URL}/lasje.webp`, audio_url: `${SUPABASE_AUDIO_URL}/lasje.m4a` },
      { word: "LED", filename: "led.webp", url: `${SUPABASE_STORAGE_URL}/led.webp`, audio_url: `${SUPABASE_AUDIO_URL}/led.m4a` },
      { word: "LEŠNIK", filename: "lesnik.webp", url: `${SUPABASE_STORAGE_URL}/lesnik.webp`, audio_url: `${SUPABASE_AUDIO_URL}/lesnik.m4a` },
      { word: "LETALO", filename: "letalo.webp", url: `${SUPABASE_STORAGE_URL}/letalo.webp`, audio_url: `${SUPABASE_AUDIO_URL}/letalo.m4a` },
      { word: "LEV", filename: "lev.webp", url: `${SUPABASE_STORAGE_URL}/lev.webp`, audio_url: `${SUPABASE_AUDIO_URL}/lev.m4a` },
      { word: "LES", filename: "les.webp", url: `${SUPABASE_STORAGE_URL}/les.webp`, audio_url: `${SUPABASE_AUDIO_URL}/les.m4a` },
      { word: "LIST", filename: "list.webp", url: `${SUPABASE_STORAGE_URL}/list.webp`, audio_url: `${SUPABASE_AUDIO_URL}/list.m4a` },
      { word: "LIZIKA", filename: "lizika.webp", url: `${SUPABASE_STORAGE_URL}/lizika.webp`, audio_url: `${SUPABASE_AUDIO_URL}/lizika.m4a` },
      { word: "LONEC", filename: "lonec.webp", url: `${SUPABASE_STORAGE_URL}/lonec.webp`, audio_url: `${SUPABASE_AUDIO_URL}/lonec.m4a` },
      { word: "LOPAR", filename: "lopar.webp", url: `${SUPABASE_STORAGE_URL}/lopar.webp`, audio_url: `${SUPABASE_AUDIO_URL}/lopar.m4a` },
      { word: "LUBENICA", filename: "lubenica.webp", url: `${SUPABASE_STORAGE_URL}/lubenica.webp`, audio_url: `${SUPABASE_AUDIO_URL}/lubenica.m4a` },
      { word: "LUČ", filename: "luc.webp", url: `${SUPABASE_STORAGE_URL}/luc.webp`, audio_url: `${SUPABASE_AUDIO_URL}/luc.m4a` },
      { word: "LUŽA", filename: "luza.webp", url: `${SUPABASE_STORAGE_URL}/luza.webp`, audio_url: `${SUPABASE_AUDIO_URL}/luza.m4a` }
    ]
  },
  {
    letter: "S",
    images: [
      { word: "SEDEM", filename: "sedem.webp", url: `${SUPABASE_STORAGE_URL}/sedem.webp`, audio_url: `${SUPABASE_AUDIO_URL}/sedem.m4a` },
      { word: "SIR", filename: "sir.webp", url: `${SUPABASE_STORAGE_URL}/sir.webp`, audio_url: `${SUPABASE_AUDIO_URL}/sir.m4a` },
      { word: "SLADOLED", filename: "sladoled.webp", url: `${SUPABASE_STORAGE_URL}/sladoled.webp`, audio_url: `${SUPABASE_AUDIO_URL}/sladoled.m4a` },
      { word: "SLIKA", filename: "slika.webp", url: `${SUPABASE_STORAGE_URL}/slika.webp`, audio_url: `${SUPABASE_AUDIO_URL}/slika.m4a` },
      { word: "SLON", filename: "slon.webp", url: `${SUPABASE_STORAGE_URL}/slon.webp`, audio_url: `${SUPABASE_AUDIO_URL}/slon.m4a` },
      { word: "SLUZ", filename: "sluz.webp", url: `${SUPABASE_STORAGE_URL}/sluz.webp`, audio_url: `${SUPABASE_AUDIO_URL}/sluz.m4a` },
      { word: "SMREKA", filename: "smreka.webp", url: `${SUPABASE_STORAGE_URL}/smreka.webp`, audio_url: `${SUPABASE_AUDIO_URL}/smreka.m4a` },
      { word: "SNEG", filename: "sneg.webp", url: `${SUPABASE_STORAGE_URL}/sneg.webp`, audio_url: `${SUPABASE_AUDIO_URL}/sneg.m4a` },
      { word: "SNEŽAK", filename: "snezak.webp", url: `${SUPABASE_STORAGE_URL}/snezak.webp`, audio_url: `${SUPABASE_AUDIO_URL}/snezak.m4a` },
      { word: "SNEŽINKA", filename: "snezinka.webp", url: `${SUPABASE_STORAGE_URL}/snezinka.webp`, audio_url: `${SUPABASE_AUDIO_URL}/snezinka.m4a` },
      { word: "SOK", filename: "sok.webp", url: `${SUPABASE_STORAGE_URL}/sok.webp`, audio_url: `${SUPABASE_AUDIO_URL}/sok.m4a` },
      { word: "SONCE", filename: "sonce.webp", url: `${SUPABASE_STORAGE_URL}/sonce.webp`, audio_url: `${SUPABASE_AUDIO_URL}/sonce.m4a` },
      { word: "SOVA", filename: "sova.webp", url: `${SUPABASE_STORAGE_URL}/sova.webp`, audio_url: `${SUPABASE_AUDIO_URL}/sova.m4a` },
      { word: "STOL", filename: "stol.webp", url: `${SUPABASE_STORAGE_URL}/stol.webp`, audio_url: `${SUPABASE_AUDIO_URL}/stol.m4a` },
      { word: "SVETILKA", filename: "svetilka.webp", url: `${SUPABASE_STORAGE_URL}/svetilka.webp`, audio_url: `${SUPABASE_AUDIO_URL}/svetilka.m4a` },
      { word: "SVINČNIK", filename: "svincnik.webp", url: `${SUPABASE_STORAGE_URL}/svincnik.webp`, audio_url: `${SUPABASE_AUDIO_URL}/svincnik.m4a` }
    ]
  },
  {
    letter: "Š",
    images: [
      { word: "ŠAH", filename: "sah.webp", url: `${SUPABASE_STORAGE_URL}/sah.webp`, audio_url: `${SUPABASE_AUDIO_URL}/sah.m4a` },
      { word: "ŠAL", filename: "sal.webp", url: `${SUPABASE_STORAGE_URL}/sal.webp`, audio_url: `${SUPABASE_AUDIO_URL}/sal.m4a` },
      { word: "ŠČETKA", filename: "scetka.webp", url: `${SUPABASE_STORAGE_URL}/scetka.webp`, audio_url: `${SUPABASE_AUDIO_URL}/scetka.m4a` },
      { word: "ŠKARJE", filename: "skarje.webp", url: `${SUPABASE_STORAGE_URL}/skarje.webp`, audio_url: `${SUPABASE_AUDIO_URL}/skarje.m4a` },
      { word: "ŠKATLA", filename: "skatla.webp", url: `${SUPABASE_STORAGE_URL}/skatla.webp`, audio_url: `${SUPABASE_AUDIO_URL}/skatla.m4a` },
      { word: "ŠKOLJKA", filename: "skoljka.webp", url: `${SUPABASE_STORAGE_URL}/skoljka.webp`, audio_url: `${SUPABASE_AUDIO_URL}/skoljka.m4a` },
      { word: "ŠOPEK", filename: "sopek.webp", url: `${SUPABASE_STORAGE_URL}/sopek.webp`, audio_url: `${SUPABASE_AUDIO_URL}/sopek.m4a` },
      { word: "ŠOTOR", filename: "sotor.webp", url: `${SUPABASE_STORAGE_URL}/sotor.webp`, audio_url: `${SUPABASE_AUDIO_URL}/sotor.m4a` },
      { word: "ŠTAMPILJKA", filename: "stampiljka.webp", url: `${SUPABASE_STORAGE_URL}/stampiljka.webp`, audio_url: `${SUPABASE_AUDIO_URL}/stampiljka.m4a` },
      { word: "ŠTORKLJA", filename: "storklja.webp", url: `${SUPABASE_STORAGE_URL}/storklja.webp`, audio_url: `${SUPABASE_AUDIO_URL}/storklja.m4a` }
    ]
  },
  {
    letter: "Z",
    images: [
      { word: "ZAJEC", filename: "zajec.webp", url: `${SUPABASE_STORAGE_URL}/zajec.webp`, audio_url: `${SUPABASE_AUDIO_URL}/zajec.m4a` },
      { word: "ZASLON", filename: "zaslon.webp", url: `${SUPABASE_STORAGE_URL}/zaslon.webp`, audio_url: `${SUPABASE_AUDIO_URL}/zaslon.m4a` },
      { word: "ZAVESA", filename: "zavesa.webp", url: `${SUPABASE_STORAGE_URL}/zavesa.webp`, audio_url: `${SUPABASE_AUDIO_URL}/zavesa.m4a` },
      { word: "ZEBRA", filename: "zebra.webp", url: `${SUPABASE_STORAGE_URL}/zebra.webp`, audio_url: `${SUPABASE_AUDIO_URL}/zebra.m4a` },
      { word: "ZLATO", filename: "zlato.webp", url: `${SUPABASE_STORAGE_URL}/zlato.webp`, audio_url: `${SUPABASE_AUDIO_URL}/zlato.m4a` },
      { word: "ZMAJ", filename: "zmaj.webp", url: `${SUPABASE_STORAGE_URL}/zmaj.webp`, audio_url: `${SUPABASE_AUDIO_URL}/zmaj.m4a` },
      { word: "ZOB", filename: "zob.webp", url: `${SUPABASE_STORAGE_URL}/zob.webp`, audio_url: `${SUPABASE_AUDIO_URL}/zob.m4a` },
      { word: "ZOBOTREBEC", filename: "zobotrebec.webp", url: `${SUPABASE_STORAGE_URL}/zobotrebec.webp`, audio_url: `${SUPABASE_AUDIO_URL}/zobotrebec.m4a` },
      { word: "ZVEZDA", filename: "zvezda.webp", url: `${SUPABASE_STORAGE_URL}/zvezda.webp`, audio_url: `${SUPABASE_AUDIO_URL}/zvezda.m4a` },
      { word: "ZVEZEK", filename: "zvezek.webp", url: `${SUPABASE_STORAGE_URL}/zvezek.webp`, audio_url: `${SUPABASE_AUDIO_URL}/zvezek.m4a` },
      { word: "ZVOČNIK", filename: "zvocnik.webp", url: `${SUPABASE_STORAGE_URL}/zvocnik.webp`, audio_url: `${SUPABASE_AUDIO_URL}/zvocnik.m4a` }
    ]
  },
  {
    letter: "Ž",
    images: [
      { word: "ŽABA", filename: "zaba.webp", url: `${SUPABASE_STORAGE_URL}/zaba.webp`, audio_url: `${SUPABASE_AUDIO_URL}/zaba.m4a` },
      { word: "ŽAGA", filename: "zaga.webp", url: `${SUPABASE_STORAGE_URL}/zaga.webp`, audio_url: `${SUPABASE_AUDIO_URL}/zaga.m4a` },
      { word: "ŽARNICA", filename: "zarnica.webp", url: `${SUPABASE_STORAGE_URL}/zarnica.webp`, audio_url: `${SUPABASE_AUDIO_URL}/zarnica.m4a` },
      { word: "ŽEBELJ", filename: "zebelj.webp", url: `${SUPABASE_STORAGE_URL}/zebelj.webp`, audio_url: `${SUPABASE_AUDIO_URL}/zebelj.m4a` },
      { word: "ŽELVA", filename: "zelva.webp", url: `${SUPABASE_STORAGE_URL}/zelva.webp`, audio_url: `${SUPABASE_AUDIO_URL}/zelva.m4a` },
      { word: "ŽERJAV", filename: "zerjav.webp", url: `${SUPABASE_STORAGE_URL}/zerjav.webp`, audio_url: `${SUPABASE_AUDIO_URL}/zerjav.m4a` },
      { word: "ŽIRAFA", filename: "zirafa.webp", url: `${SUPABASE_STORAGE_URL}/zirafa.webp`, audio_url: `${SUPABASE_AUDIO_URL}/zirafa.m4a` },
      { word: "ŽLICA", filename: "zlica.webp", url: `${SUPABASE_STORAGE_URL}/zlica.webp`, audio_url: `${SUPABASE_AUDIO_URL}/zlica.m4a` },
      { word: "ŽOGA", filename: "zoga.webp", url: `${SUPABASE_STORAGE_URL}/zoga.webp`, audio_url: `${SUPABASE_AUDIO_URL}/zoga.m4a` },
      { word: "ŽOLNA", filename: "zolna.webp", url: `${SUPABASE_STORAGE_URL}/zolna.webp`, audio_url: `${SUPABASE_AUDIO_URL}/zolna.m4a` }
    ]
  },
  {
    letter: "R",
    images: [
      { word: "RACA", filename: "raca.webp", url: `${SUPABASE_STORAGE_URL}/raca.webp`, audio_url: `${SUPABASE_AUDIO_URL}/raca.m4a` },
      { word: "RAK", filename: "rak.webp", url: `${SUPABASE_STORAGE_URL}/rak.webp`, audio_url: `${SUPABASE_AUDIO_URL}/rak.m4a` },
      { word: "RAKETA", filename: "raketa.webp", url: `${SUPABASE_STORAGE_URL}/raketa.webp`, audio_url: `${SUPABASE_AUDIO_URL}/raketa.m4a` },
      { word: "RAVNILO", filename: "ravnilo.webp", url: `${SUPABASE_STORAGE_URL}/ravnilo.webp`, audio_url: `${SUPABASE_AUDIO_URL}/ravnilo.m4a` },
      { word: "REP", filename: "rep.webp", url: `${SUPABASE_STORAGE_URL}/rep.webp`, audio_url: `${SUPABASE_AUDIO_URL}/rep.m4a` },
      { word: "REPA", filename: "repa.webp", url: `${SUPABASE_STORAGE_URL}/repa.webp`, audio_url: `${SUPABASE_AUDIO_URL}/repa.m4a` },
      { word: "RIBA", filename: "riba.webp", url: `${SUPABASE_STORAGE_URL}/riba.webp`, audio_url: `${SUPABASE_AUDIO_URL}/riba.m4a` },
      { word: "RIBEZ", filename: "ribez.webp", url: `${SUPABASE_STORAGE_URL}/ribez.webp`, audio_url: `${SUPABASE_AUDIO_URL}/ribez.m4a` },
      { word: "RIBIČ", filename: "ribic.webp", url: `${SUPABASE_STORAGE_URL}/ribic.webp`, audio_url: `${SUPABASE_AUDIO_URL}/ribic.m4a` },
      { word: "RIS", filename: "ris.webp", url: `${SUPABASE_STORAGE_URL}/ris.webp`, audio_url: `${SUPABASE_AUDIO_URL}/ris.m4a` },
      { word: "RIŽ", filename: "riz.webp", url: `${SUPABASE_STORAGE_URL}/riz.webp`, audio_url: `${SUPABASE_AUDIO_URL}/riz.m4a` },
      { word: "ROBOT", filename: "robot.webp", url: `${SUPABASE_STORAGE_URL}/robot.webp`, audio_url: `${SUPABASE_AUDIO_URL}/robot.m4a` },
      { word: "ROKA", filename: "roka.webp", url: `${SUPABASE_STORAGE_URL}/roka.webp`, audio_url: `${SUPABASE_AUDIO_URL}/roka.m4a` },
      { word: "ROKOMETAŠ", filename: "rokometas.webp", url: `${SUPABASE_STORAGE_URL}/rokometas.webp`, audio_url: `${SUPABASE_AUDIO_URL}/rokometas.m4a` },
      { word: "ROLKA", filename: "rolka.webp", url: `${SUPABASE_STORAGE_URL}/rolka.webp`, audio_url: `${SUPABASE_AUDIO_URL}/rolka.m4a` },
      { word: "ROPOTULJICA", filename: "ropotuljica.webp", url: `${SUPABASE_STORAGE_URL}/ropotuljica.webp`, audio_url: `${SUPABASE_AUDIO_URL}/ropotuljica.m4a` },
      { word: "ROŽA", filename: "roza.webp", url: `${SUPABASE_STORAGE_URL}/roza.webp`, audio_url: `${SUPABASE_AUDIO_URL}/roza.m4a` }
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
      return shuffledImages.slice(0, 6); // Default to 6 images
  }
}
