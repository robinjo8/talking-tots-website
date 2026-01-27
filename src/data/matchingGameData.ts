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
      { word: "CEDILO", filename: "cedilo1.webp", url: `${SUPABASE_STORAGE_URL}/cedilo1.webp`, audio_url: `${SUPABASE_AUDIO_URL}/cedilo.m4a` },
      { word: "CEKIN", filename: "cekin1.webp", url: `${SUPABASE_STORAGE_URL}/cekin1.webp`, audio_url: `${SUPABASE_AUDIO_URL}/cekin.m4a` },
      { word: "CERKEV", filename: "cerkev1.webp", url: `${SUPABASE_STORAGE_URL}/cerkev1.webp`, audio_url: `${SUPABASE_AUDIO_URL}/cerkev.m4a` },
      { word: "CESTA", filename: "cesta1.webp", url: `${SUPABASE_STORAGE_URL}/cesta1.webp`, audio_url: `${SUPABASE_AUDIO_URL}/cesta.m4a` },
      { word: "CEV", filename: "cev1.webp", url: `${SUPABASE_STORAGE_URL}/cev1.webp`, audio_url: `${SUPABASE_AUDIO_URL}/cev.m4a` },
      { word: "CIRKUS", filename: "cirkus1.webp", url: `${SUPABASE_STORAGE_URL}/cirkus1.webp`, audio_url: `${SUPABASE_AUDIO_URL}/cirkus.m4a` },
      { word: "CISTERNA", filename: "cisterna1.webp", url: `${SUPABASE_STORAGE_URL}/cisterna1.webp`, audio_url: `${SUPABASE_AUDIO_URL}/cisterna.m4a` },
      { word: "COKLA", filename: "cokla1.webp", url: `${SUPABASE_STORAGE_URL}/cokla1.webp`, audio_url: `${SUPABASE_AUDIO_URL}/cokla.m4a` },
      { word: "COPAT", filename: "copat1.webp", url: `${SUPABASE_STORAGE_URL}/copat1.webp`, audio_url: `${SUPABASE_AUDIO_URL}/copat.m4a` },
      { word: "CVET", filename: "cvet1.webp", url: `${SUPABASE_STORAGE_URL}/cvet1.webp`, audio_url: `${SUPABASE_AUDIO_URL}/cvet.m4a` }
    ]
  },
  {
    letter: "Č",
    images: [
      { word: "ČAJ", filename: "caj1.webp", url: `${SUPABASE_STORAGE_URL}/caj1.webp`, audio_url: `${SUPABASE_AUDIO_URL}/caj.m4a` },
      { word: "ČASOPIS", filename: "casopis1.webp", url: `${SUPABASE_STORAGE_URL}/casopis1.webp`, audio_url: `${SUPABASE_AUDIO_URL}/casopis.m4a` },
      { word: "ČEBELA", filename: "cebela1.webp", url: `${SUPABASE_STORAGE_URL}/cebela1.webp`, audio_url: `${SUPABASE_AUDIO_URL}/cebela.m4a` },
      { word: "ČEBULA", filename: "cebula1.webp", url: `${SUPABASE_STORAGE_URL}/cebula1.webp`, audio_url: `${SUPABASE_AUDIO_URL}/cebula.m4a` },
      { word: "ČESEN", filename: "cesen1.webp", url: `${SUPABASE_STORAGE_URL}/cesen1.webp`, audio_url: `${SUPABASE_AUDIO_URL}/cesen.m4a` },
      { word: "ČEVLJI", filename: "cevlji1.webp", url: `${SUPABASE_STORAGE_URL}/cevlji1.webp`, audio_url: `${SUPABASE_AUDIO_URL}/cevlji.m4a` },
      { word: "ČOKOLADA", filename: "cokolada1.webp", url: `${SUPABASE_STORAGE_URL}/cokolada1.webp`, audio_url: `${SUPABASE_AUDIO_URL}/cokolada.m4a` },
      { word: "ČOLN", filename: "coln1.webp", url: `${SUPABASE_STORAGE_URL}/coln1.webp`, audio_url: `${SUPABASE_AUDIO_URL}/coln.m4a` },
      { word: "ČOPIČ", filename: "copic1.webp", url: `${SUPABASE_STORAGE_URL}/copic1.webp`, audio_url: `${SUPABASE_AUDIO_URL}/copic.m4a` },
      { word: "ČRKE", filename: "crke1.webp", url: `${SUPABASE_STORAGE_URL}/crke1.webp`, audio_url: `${SUPABASE_AUDIO_URL}/crke.m4a` }
    ]
  },
  {
    letter: "K",
    images: [
      { word: "KAČA", filename: "kaca1.webp", url: `${SUPABASE_STORAGE_URL}/kaca1.webp`, audio_url: `${SUPABASE_AUDIO_URL}/kaca.m4a` },
      { word: "KAPA", filename: "kapa1.webp", url: `${SUPABASE_STORAGE_URL}/kapa1.webp`, audio_url: `${SUPABASE_AUDIO_URL}/kapa.m4a` },
      { word: "KAVA", filename: "kava1.webp", url: `${SUPABASE_STORAGE_URL}/kava1.webp`, audio_url: `${SUPABASE_AUDIO_URL}/kava.m4a` },
      { word: "KLAVIR", filename: "klavir1.webp", url: `${SUPABASE_STORAGE_URL}/klavir1.webp`, audio_url: `${SUPABASE_AUDIO_URL}/klavir.m4a` },
      { word: "KLJUČ", filename: "kljuc1.webp", url: `${SUPABASE_STORAGE_URL}/kljuc1.webp`, audio_url: `${SUPABASE_AUDIO_URL}/kljuc.m4a` },
      { word: "KLOP", filename: "klop1.webp", url: `${SUPABASE_STORAGE_URL}/klop1.webp`, audio_url: `${SUPABASE_AUDIO_URL}/klop.m4a` },
      { word: "KNJIGA", filename: "knjiga1.webp", url: `${SUPABASE_STORAGE_URL}/knjiga1.webp`, audio_url: `${SUPABASE_AUDIO_URL}/knjiga.m4a` },
      { word: "KOCKA", filename: "kocka1.webp", url: `${SUPABASE_STORAGE_URL}/kocka1.webp`, audio_url: `${SUPABASE_AUDIO_URL}/kocka.m4a` },
      { word: "KOKOS", filename: "kokos_sadez1.webp", url: `${SUPABASE_STORAGE_URL}/kokos_sadez1.webp`, audio_url: `${SUPABASE_AUDIO_URL}/kokos_sadez.m4a` },
      { word: "KOKOŠ", filename: "kokos1.webp", url: `${SUPABASE_STORAGE_URL}/kokos1.webp`, audio_url: `${SUPABASE_AUDIO_URL}/kokos_1.m4a` },
      { word: "KOLAČ", filename: "kolac1.webp", url: `${SUPABASE_STORAGE_URL}/kolac1.webp`, audio_url: `${SUPABASE_AUDIO_URL}/kolac.m4a` },
      { word: "KOLO", filename: "kolo1.webp", url: `${SUPABASE_STORAGE_URL}/kolo1.webp`, audio_url: `${SUPABASE_AUDIO_URL}/kolo.m4a` },
      { word: "KORUZA", filename: "koruza1.webp", url: `${SUPABASE_STORAGE_URL}/koruza1.webp`, audio_url: `${SUPABASE_AUDIO_URL}/koruza.m4a` },
      { word: "KOST", filename: "kost1.webp", url: `${SUPABASE_STORAGE_URL}/kost1.webp`, audio_url: `${SUPABASE_AUDIO_URL}/kost.m4a` },
      { word: "KOŠ", filename: "kos1.webp", url: `${SUPABASE_STORAGE_URL}/kos1.webp`, audio_url: `${SUPABASE_AUDIO_URL}/kos.m4a` },
      { word: "KOŠARA", filename: "kosara1.webp", url: `${SUPABASE_STORAGE_URL}/kosara1.webp`, audio_url: `${SUPABASE_AUDIO_URL}/kosara.m4a` },
      { word: "KOZA", filename: "koza1.webp", url: `${SUPABASE_STORAGE_URL}/koza1.webp`, audio_url: `${SUPABASE_AUDIO_URL}/koza.m4a` },
      { word: "KOZAREC", filename: "kozarec1.webp", url: `${SUPABASE_STORAGE_URL}/kozarec1.webp`, audio_url: `${SUPABASE_AUDIO_URL}/kozarec.m4a` },
      { word: "KOŽA", filename: "koza_skin1.webp", url: `${SUPABASE_STORAGE_URL}/koza_skin1.webp`, audio_url: `${SUPABASE_AUDIO_URL}/koza_skin.m4a` },
      { word: "KRAVA", filename: "krava1.webp", url: `${SUPABASE_STORAGE_URL}/krava1.webp`, audio_url: `${SUPABASE_AUDIO_URL}/krava.m4a` },
      { word: "KROF", filename: "krof1.webp", url: `${SUPABASE_STORAGE_URL}/krof1.webp`, audio_url: `${SUPABASE_AUDIO_URL}/krof.m4a` },
      { word: "KROG", filename: "krog1.webp", url: `${SUPABASE_STORAGE_URL}/krog1.webp`, audio_url: `${SUPABASE_AUDIO_URL}/krog.m4a` },
      { word: "KROŽNIK", filename: "kroznik1.webp", url: `${SUPABASE_STORAGE_URL}/kroznik1.webp`, audio_url: `${SUPABASE_AUDIO_URL}/kroznik.m4a` },
      { word: "KRUH", filename: "kruh1.webp", url: `${SUPABASE_STORAGE_URL}/kruh1.webp`, audio_url: `${SUPABASE_AUDIO_URL}/kruh.m4a` },
      { word: "KUMARA", filename: "kumara1.webp", url: `${SUPABASE_STORAGE_URL}/kumara1.webp`, audio_url: `${SUPABASE_AUDIO_URL}/kumara.m4a` },
      { word: "KUŽA", filename: "kuza1.webp", url: `${SUPABASE_STORAGE_URL}/kuza1.webp`, audio_url: `${SUPABASE_AUDIO_URL}/kuza.m4a` }
    ]
  },
  {
    letter: "L",
    images: [
      { word: "LADJA", filename: "ladja1.webp", url: `${SUPABASE_STORAGE_URL}/ladja1.webp`, audio_url: `${SUPABASE_AUDIO_URL}/ladja.m4a` },
      { word: "LASJE", filename: "lasje1.webp", url: `${SUPABASE_STORAGE_URL}/lasje1.webp`, audio_url: `${SUPABASE_AUDIO_URL}/lasje.m4a` },
      { word: "LED", filename: "led1.webp", url: `${SUPABASE_STORAGE_URL}/led1.webp`, audio_url: `${SUPABASE_AUDIO_URL}/led.m4a` },
      { word: "LEŠNIK", filename: "lesnik1.webp", url: `${SUPABASE_STORAGE_URL}/lesnik1.webp`, audio_url: `${SUPABASE_AUDIO_URL}/lesnik.m4a` },
      { word: "LETALO", filename: "letalo1.webp", url: `${SUPABASE_STORAGE_URL}/letalo1.webp`, audio_url: `${SUPABASE_AUDIO_URL}/letalo.m4a` },
      { word: "LEV", filename: "lev1.webp", url: `${SUPABASE_STORAGE_URL}/lev1.webp`, audio_url: `${SUPABASE_AUDIO_URL}/lev.m4a` },
      { word: "LES", filename: "les1.webp", url: `${SUPABASE_STORAGE_URL}/les1.webp`, audio_url: `${SUPABASE_AUDIO_URL}/les.m4a` },
      { word: "LIST", filename: "list1.webp", url: `${SUPABASE_STORAGE_URL}/list1.webp`, audio_url: `${SUPABASE_AUDIO_URL}/list.m4a` },
      { word: "LIZIKA", filename: "lizika1.webp", url: `${SUPABASE_STORAGE_URL}/lizika1.webp`, audio_url: `${SUPABASE_AUDIO_URL}/lizika.m4a` },
      { word: "LONEC", filename: "lonec1.webp", url: `${SUPABASE_STORAGE_URL}/lonec1.webp`, audio_url: `${SUPABASE_AUDIO_URL}/lonec.m4a` },
      { word: "LOPAR", filename: "lopar1.webp", url: `${SUPABASE_STORAGE_URL}/lopar1.webp`, audio_url: `${SUPABASE_AUDIO_URL}/lopar.m4a` },
      { word: "LUBENICA", filename: "lubenica1.webp", url: `${SUPABASE_STORAGE_URL}/lubenica1.webp`, audio_url: `${SUPABASE_AUDIO_URL}/lubenica.m4a` },
      { word: "LUČ", filename: "luc1.webp", url: `${SUPABASE_STORAGE_URL}/luc1.webp`, audio_url: `${SUPABASE_AUDIO_URL}/luc.m4a` },
      { word: "LUŽA", filename: "luza1.webp", url: `${SUPABASE_STORAGE_URL}/luza1.webp`, audio_url: `${SUPABASE_AUDIO_URL}/luza.m4a` }
    ]
  },
  {
    letter: "S",
    images: [
      { word: "SEDEM", filename: "sedem1.webp", url: `${SUPABASE_STORAGE_URL}/sedem1.webp`, audio_url: `${SUPABASE_AUDIO_URL}/sedem.m4a` },
      { word: "SIR", filename: "sir1.webp", url: `${SUPABASE_STORAGE_URL}/sir1.webp`, audio_url: `${SUPABASE_AUDIO_URL}/sir.m4a` },
      { word: "SLADOLED", filename: "sladoled1.webp", url: `${SUPABASE_STORAGE_URL}/sladoled1.webp`, audio_url: `${SUPABASE_AUDIO_URL}/sladoled.m4a` },
      { word: "SLIKA", filename: "slika1.webp", url: `${SUPABASE_STORAGE_URL}/slika1.webp`, audio_url: `${SUPABASE_AUDIO_URL}/slika.m4a` },
      { word: "SLON", filename: "slon1.webp", url: `${SUPABASE_STORAGE_URL}/slon1.webp`, audio_url: `${SUPABASE_AUDIO_URL}/slon.m4a` },
      { word: "SLUZ", filename: "sluz1.webp", url: `${SUPABASE_STORAGE_URL}/sluz1.webp`, audio_url: `${SUPABASE_AUDIO_URL}/sluz.m4a` },
      { word: "SMREKA", filename: "smreka1.webp", url: `${SUPABASE_STORAGE_URL}/smreka1.webp`, audio_url: `${SUPABASE_AUDIO_URL}/smreka.m4a` },
      { word: "SNEG", filename: "sneg1.webp", url: `${SUPABASE_STORAGE_URL}/sneg1.webp`, audio_url: `${SUPABASE_AUDIO_URL}/sneg.m4a` },
      { word: "SNEŽAK", filename: "snezak1.webp", url: `${SUPABASE_STORAGE_URL}/snezak1.webp`, audio_url: `${SUPABASE_AUDIO_URL}/snezak.m4a` },
      { word: "SNEŽINKA", filename: "snezinka1.webp", url: `${SUPABASE_STORAGE_URL}/snezinka1.webp`, audio_url: `${SUPABASE_AUDIO_URL}/snezinka.m4a` },
      { word: "SOK", filename: "sok1.webp", url: `${SUPABASE_STORAGE_URL}/sok1.webp`, audio_url: `${SUPABASE_AUDIO_URL}/sok.m4a` },
      { word: "SONCE", filename: "sonce1.webp", url: `${SUPABASE_STORAGE_URL}/sonce1.webp`, audio_url: `${SUPABASE_AUDIO_URL}/sonce.m4a` },
      { word: "SOVA", filename: "sova1.webp", url: `${SUPABASE_STORAGE_URL}/sova1.webp`, audio_url: `${SUPABASE_AUDIO_URL}/sova.m4a` },
      { word: "STOL", filename: "stol1.webp", url: `${SUPABASE_STORAGE_URL}/stol1.webp`, audio_url: `${SUPABASE_AUDIO_URL}/stol.m4a` },
      { word: "SVETILKA", filename: "svetilka1.webp", url: `${SUPABASE_STORAGE_URL}/svetilka1.webp`, audio_url: `${SUPABASE_AUDIO_URL}/svetilka.m4a` },
      { word: "SVINČNIK", filename: "svincnik1.webp", url: `${SUPABASE_STORAGE_URL}/svincnik1.webp`, audio_url: `${SUPABASE_AUDIO_URL}/svincnik.m4a` }
    ]
  },
  {
    letter: "Š",
    images: [
      { word: "ŠAH", filename: "sah1.webp", url: `${SUPABASE_STORAGE_URL}/sah1.webp`, audio_url: `${SUPABASE_AUDIO_URL}/sah.m4a` },
      { word: "ŠAL", filename: "sal1.webp", url: `${SUPABASE_STORAGE_URL}/sal1.webp`, audio_url: `${SUPABASE_AUDIO_URL}/sal.m4a` },
      { word: "ŠČETKA", filename: "scetka1.webp", url: `${SUPABASE_STORAGE_URL}/scetka1.webp`, audio_url: `${SUPABASE_AUDIO_URL}/scetka.m4a` },
      { word: "ŠKARJE", filename: "skarje1.webp", url: `${SUPABASE_STORAGE_URL}/skarje1.webp`, audio_url: `${SUPABASE_AUDIO_URL}/skarje.m4a` },
      { word: "ŠKATLA", filename: "skatla1.webp", url: `${SUPABASE_STORAGE_URL}/skatla1.webp`, audio_url: `${SUPABASE_AUDIO_URL}/skatla.m4a` },
      { word: "ŠKOLJKA", filename: "skoljka1.webp", url: `${SUPABASE_STORAGE_URL}/skoljka1.webp`, audio_url: `${SUPABASE_AUDIO_URL}/skoljka.m4a` },
      { word: "ŠOPEK", filename: "sopek1.webp", url: `${SUPABASE_STORAGE_URL}/sopek1.webp`, audio_url: `${SUPABASE_AUDIO_URL}/sopek.m4a` },
      { word: "ŠOTOR", filename: "sotor1.webp", url: `${SUPABASE_STORAGE_URL}/sotor1.webp`, audio_url: `${SUPABASE_AUDIO_URL}/sotor.m4a` },
      { word: "ŠTAMPILJKA", filename: "stampiljka1.webp", url: `${SUPABASE_STORAGE_URL}/stampiljka1.webp`, audio_url: `${SUPABASE_AUDIO_URL}/stampiljka.m4a` },
      { word: "ŠTORKLJA", filename: "storklja1.webp", url: `${SUPABASE_STORAGE_URL}/storklja1.webp`, audio_url: `${SUPABASE_AUDIO_URL}/storklja.m4a` }
    ]
  },
  {
    letter: "Z",
    images: [
      { word: "ZAJEC", filename: "zajec1.webp", url: `${SUPABASE_STORAGE_URL}/zajec1.webp`, audio_url: `${SUPABASE_AUDIO_URL}/zajec.m4a` },
      { word: "ZASLON", filename: "zaslon1.webp", url: `${SUPABASE_STORAGE_URL}/zaslon1.webp`, audio_url: `${SUPABASE_AUDIO_URL}/zaslon.m4a` },
      { word: "ZAVESA", filename: "zavesa1.webp", url: `${SUPABASE_STORAGE_URL}/zavesa1.webp`, audio_url: `${SUPABASE_AUDIO_URL}/zavesa.m4a` },
      { word: "ZEBRA", filename: "zebra1.webp", url: `${SUPABASE_STORAGE_URL}/zebra1.webp`, audio_url: `${SUPABASE_AUDIO_URL}/zebra.m4a` },
      { word: "ZLATO", filename: "zlato1.webp", url: `${SUPABASE_STORAGE_URL}/zlato1.webp`, audio_url: `${SUPABASE_AUDIO_URL}/zlato.m4a` },
      { word: "ZMAJ", filename: "zmaj1.webp", url: `${SUPABASE_STORAGE_URL}/zmaj1.webp`, audio_url: `${SUPABASE_AUDIO_URL}/zmaj.m4a` },
      { word: "ZOB", filename: "zob1.webp", url: `${SUPABASE_STORAGE_URL}/zob1.webp`, audio_url: `${SUPABASE_AUDIO_URL}/zob.m4a` },
      { word: "ZOBOTREBEC", filename: "zobotrebec1.webp", url: `${SUPABASE_STORAGE_URL}/zobotrebec1.webp`, audio_url: `${SUPABASE_AUDIO_URL}/zobotrebec.m4a` },
      { word: "ZVEZDA", filename: "zvezda1.webp", url: `${SUPABASE_STORAGE_URL}/zvezda1.webp`, audio_url: `${SUPABASE_AUDIO_URL}/zvezda.m4a` },
      { word: "ZVEZEK", filename: "zvezek1.webp", url: `${SUPABASE_STORAGE_URL}/zvezek1.webp`, audio_url: `${SUPABASE_AUDIO_URL}/zvezek.m4a` },
      { word: "ZVOČNIK", filename: "zvocnik1.webp", url: `${SUPABASE_STORAGE_URL}/zvocnik1.webp`, audio_url: `${SUPABASE_AUDIO_URL}/zvocnik.m4a` }
    ]
  },
  {
    letter: "Ž",
    images: [
      { word: "ŽABA", filename: "zaba1.webp", url: `${SUPABASE_STORAGE_URL}/zaba1.webp`, audio_url: `${SUPABASE_AUDIO_URL}/zaba.m4a` },
      { word: "ŽAGA", filename: "zaga1.webp", url: `${SUPABASE_STORAGE_URL}/zaga1.webp`, audio_url: `${SUPABASE_AUDIO_URL}/zaga.m4a` },
      { word: "ŽARNICA", filename: "zarnica1.webp", url: `${SUPABASE_STORAGE_URL}/zarnica1.webp`, audio_url: `${SUPABASE_AUDIO_URL}/zarnica.m4a` },
      { word: "ŽEBELJ", filename: "zebelj1.webp", url: `${SUPABASE_STORAGE_URL}/zebelj1.webp`, audio_url: `${SUPABASE_AUDIO_URL}/zebelj.m4a` },
      { word: "ŽELVA", filename: "zelva1.webp", url: `${SUPABASE_STORAGE_URL}/zelva1.webp`, audio_url: `${SUPABASE_AUDIO_URL}/zelva.m4a` },
      { word: "ŽERJAV", filename: "zerjav1.webp", url: `${SUPABASE_STORAGE_URL}/zerjav1.webp`, audio_url: `${SUPABASE_AUDIO_URL}/zerjav.m4a` },
      { word: "ŽIRAFA", filename: "zirafa1.webp", url: `${SUPABASE_STORAGE_URL}/zirafa1.webp`, audio_url: `${SUPABASE_AUDIO_URL}/zirafa.m4a` },
      { word: "ŽLICA", filename: "zlica1.webp", url: `${SUPABASE_STORAGE_URL}/zlica1.webp`, audio_url: `${SUPABASE_AUDIO_URL}/zlica.m4a` },
      { word: "ŽOGA", filename: "zoga1.webp", url: `${SUPABASE_STORAGE_URL}/zoga1.webp`, audio_url: `${SUPABASE_AUDIO_URL}/zoga.m4a` },
      { word: "ŽOLNA", filename: "zolna1.webp", url: `${SUPABASE_STORAGE_URL}/zolna1.webp`, audio_url: `${SUPABASE_AUDIO_URL}/zolna.m4a` }
    ]
  },
  {
    letter: "R",
    images: [
      { word: "RACA", filename: "raca1.webp", url: `${SUPABASE_STORAGE_URL}/raca1.webp`, audio_url: `${SUPABASE_AUDIO_URL}/raca.m4a` },
      { word: "RAK", filename: "rak1.webp", url: `${SUPABASE_STORAGE_URL}/rak1.webp`, audio_url: `${SUPABASE_AUDIO_URL}/rak.m4a` },
      { word: "RAKETA", filename: "raketa1.webp", url: `${SUPABASE_STORAGE_URL}/raketa1.webp`, audio_url: `${SUPABASE_AUDIO_URL}/raketa.m4a` },
      { word: "RAVNILO", filename: "ravnilo1.webp", url: `${SUPABASE_STORAGE_URL}/ravnilo1.webp`, audio_url: `${SUPABASE_AUDIO_URL}/ravnilo.m4a` },
      { word: "REP", filename: "rep1.webp", url: `${SUPABASE_STORAGE_URL}/rep1.webp`, audio_url: `${SUPABASE_AUDIO_URL}/rep.m4a` },
      { word: "REPA", filename: "repa1.webp", url: `${SUPABASE_STORAGE_URL}/repa1.webp`, audio_url: `${SUPABASE_AUDIO_URL}/repa.m4a` },
      { word: "RIBA", filename: "riba1.webp", url: `${SUPABASE_STORAGE_URL}/riba1.webp`, audio_url: `${SUPABASE_AUDIO_URL}/riba.m4a` },
      { word: "RIBEZ", filename: "ribez1.webp", url: `${SUPABASE_STORAGE_URL}/ribez1.webp`, audio_url: `${SUPABASE_AUDIO_URL}/ribez.m4a` },
      { word: "RIBIČ", filename: "ribic1.webp", url: `${SUPABASE_STORAGE_URL}/ribic1.webp`, audio_url: `${SUPABASE_AUDIO_URL}/ribic.m4a` },
      { word: "RIS", filename: "ris1.webp", url: `${SUPABASE_STORAGE_URL}/ris1.webp`, audio_url: `${SUPABASE_AUDIO_URL}/ris.m4a` },
      { word: "RIŽ", filename: "riz1.webp", url: `${SUPABASE_STORAGE_URL}/riz1.webp`, audio_url: `${SUPABASE_AUDIO_URL}/riz.m4a` },
      { word: "ROBOT", filename: "robot1.webp", url: `${SUPABASE_STORAGE_URL}/robot1.webp`, audio_url: `${SUPABASE_AUDIO_URL}/robot.m4a` },
      { word: "ROKA", filename: "roka1.webp", url: `${SUPABASE_STORAGE_URL}/roka1.webp`, audio_url: `${SUPABASE_AUDIO_URL}/roka.m4a` },
      { word: "ROKOMETAŠ", filename: "rokometas1.webp", url: `${SUPABASE_STORAGE_URL}/rokometas1.webp`, audio_url: `${SUPABASE_AUDIO_URL}/rokometas.m4a` },
      { word: "ROLKA", filename: "rolka1.webp", url: `${SUPABASE_STORAGE_URL}/rolka1.webp`, audio_url: `${SUPABASE_AUDIO_URL}/rolka.m4a` },
      { word: "ROPOTULJICA", filename: "ropotuljica1.webp", url: `${SUPABASE_STORAGE_URL}/ropotuljica1.webp`, audio_url: `${SUPABASE_AUDIO_URL}/ropotuljica.m4a` },
      { word: "ROŽA", filename: "roza1.webp", url: `${SUPABASE_STORAGE_URL}/roza1.webp`, audio_url: `${SUPABASE_AUDIO_URL}/roza.m4a` }
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
    default:
      return shuffledImages.slice(0, 8); // 8 randomly selected images for oldest
  }
}
