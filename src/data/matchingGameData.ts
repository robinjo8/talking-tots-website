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
      { word: "CEDILO", filename: "cedilo1.webp", url: `${SUPABASE_STORAGE_URL}/cedilo1.webp`, audio_url: `${SUPABASE_AUDIO_URL}/Cedilo.mp3` },
      { word: "CEKIN", filename: "cekin1.webp", url: `${SUPABASE_STORAGE_URL}/cekin1.webp`, audio_url: `${SUPABASE_AUDIO_URL}/Cekin.mp3` },
      { word: "CERKEV", filename: "cerkev1.webp", url: `${SUPABASE_STORAGE_URL}/cerkev1.webp`, audio_url: `${SUPABASE_AUDIO_URL}/Cerkev.mp3` },
      { word: "CESTA", filename: "cesta1.webp", url: `${SUPABASE_STORAGE_URL}/cesta1.webp`, audio_url: `${SUPABASE_AUDIO_URL}/Cesta.mp3` },
      { word: "CEV", filename: "cev1.webp", url: `${SUPABASE_STORAGE_URL}/cev1.webp`, audio_url: `${SUPABASE_AUDIO_URL}/Cev.mp3` },
      { word: "CIRKUS", filename: "cirkus1.webp", url: `${SUPABASE_STORAGE_URL}/cirkus1.webp`, audio_url: `${SUPABASE_AUDIO_URL}/Cirkus.mp3` },
      { word: "CISTERNA", filename: "cisterna1.webp", url: `${SUPABASE_STORAGE_URL}/cisterna1.webp`, audio_url: `${SUPABASE_AUDIO_URL}/Cisterna.mp3` },
      { word: "COKLA", filename: "cokla1.webp", url: `${SUPABASE_STORAGE_URL}/cokla1.webp`, audio_url: `${SUPABASE_AUDIO_URL}/Cokla.mp3` },
      { word: "COPAT", filename: "copat1.webp", url: `${SUPABASE_STORAGE_URL}/copat1.webp`, audio_url: `${SUPABASE_AUDIO_URL}/Copat.mp3` },
      { word: "CVET", filename: "cvet1.webp", url: `${SUPABASE_STORAGE_URL}/cvet1.webp`, audio_url: `${SUPABASE_AUDIO_URL}/Cvet.mp3` }
    ]
  },
  {
    letter: "Č",
    images: [
      { word: "ČAJ", filename: "caj1.webp", url: `${SUPABASE_STORAGE_URL}/caj1.webp`, audio_url: `${SUPABASE_AUDIO_URL}/Caj.mp3` },
      { word: "ČAROVNIK", filename: "carovnik1.webp", url: `${SUPABASE_STORAGE_URL}/carovnik1.webp`, audio_url: `${SUPABASE_AUDIO_URL}/Carovnik.mp3` },
      { word: "ČASOPIS", filename: "casopis1.webp", url: `${SUPABASE_STORAGE_URL}/casopis1.webp`, audio_url: `${SUPABASE_AUDIO_URL}/Casopis.mp3` },
      { word: "ČEBELA", filename: "cebela1.webp", url: `${SUPABASE_STORAGE_URL}/cebela1.webp`, audio_url: `${SUPABASE_AUDIO_URL}/Cebela.mp3` },
      { word: "ČEBELAR", filename: "cebelar1.webp", url: `${SUPABASE_STORAGE_URL}/cebelar1.webp`, audio_url: `${SUPABASE_AUDIO_URL}/Cebelar.mp3` },
      { word: "ČEBULA", filename: "cebula1.webp", url: `${SUPABASE_STORAGE_URL}/cebula1.webp`, audio_url: `${SUPABASE_AUDIO_URL}/Cebula.mp3` },
      { word: "ČESEN", filename: "cesen1.webp", url: `${SUPABASE_STORAGE_URL}/cesen1.webp`, audio_url: `${SUPABASE_AUDIO_URL}/Cesen.mp3` },
      { word: "ČEVLJI", filename: "cevlji1.webp", url: `${SUPABASE_STORAGE_URL}/cevlji1.webp`, audio_url: `${SUPABASE_AUDIO_URL}/Cevlji.mp3` },
      { word: "ČOKOLADA", filename: "cokolada1.webp", url: `${SUPABASE_STORAGE_URL}/cokolada1.webp`, audio_url: `${SUPABASE_AUDIO_URL}/Cokolada.mp3` },
      { word: "ČOLN", filename: "coln1.webp", url: `${SUPABASE_STORAGE_URL}/coln1.webp`, audio_url: `${SUPABASE_AUDIO_URL}/Coln.mp3` },
      { word: "ČOPIČ", filename: "copic1.webp", url: `${SUPABASE_STORAGE_URL}/copic1.webp`, audio_url: `${SUPABASE_AUDIO_URL}/Copic.mp3` },
      { word: "ČRKE", filename: "crke1.webp", url: `${SUPABASE_STORAGE_URL}/crke1.webp`, audio_url: `${SUPABASE_AUDIO_URL}/Crke.mp3` }
    ]
  },
  {
    letter: "K",
    images: [
      { word: "KAČA", filename: "kaca1.webp", url: `${SUPABASE_STORAGE_URL}/kaca1.webp`, audio_url: `${SUPABASE_AUDIO_URL}/Kaca.mp3` },
      { word: "KAPA", filename: "kapa1.webp", url: `${SUPABASE_STORAGE_URL}/kapa1.webp`, audio_url: `${SUPABASE_AUDIO_URL}/Kapa.mp3` },
      { word: "KAVA", filename: "kava1.webp", url: `${SUPABASE_STORAGE_URL}/kava1.webp`, audio_url: `${SUPABASE_AUDIO_URL}/Kava.mp3` },
      { word: "KLAVIR", filename: "klavir1.webp", url: `${SUPABASE_STORAGE_URL}/klavir1.webp`, audio_url: `${SUPABASE_AUDIO_URL}/Klavir.mp3` },
      { word: "KLJUČ", filename: "kljuc1.webp", url: `${SUPABASE_STORAGE_URL}/kljuc1.webp`, audio_url: `${SUPABASE_AUDIO_URL}/Kljuc.mp3` },
      { word: "KLOP", filename: "klop1.webp", url: `${SUPABASE_STORAGE_URL}/klop1.webp`, audio_url: `${SUPABASE_AUDIO_URL}/Klop.mp3` },
      { word: "KNJIGA", filename: "knjiga1.webp", url: `${SUPABASE_STORAGE_URL}/knjiga1.webp`, audio_url: `${SUPABASE_AUDIO_URL}/Knjiga.mp3` },
      { word: "KOCKA", filename: "kocka1.webp", url: `${SUPABASE_STORAGE_URL}/kocka1.webp`, audio_url: `${SUPABASE_AUDIO_URL}/Kocka.mp3` },
      { word: "KOKOS", filename: "kokos_sadez1.webp", url: `${SUPABASE_STORAGE_URL}/kokos_sadez1.webp`, audio_url: `${SUPABASE_AUDIO_URL}/Kokos_sadez.mp3` },
      { word: "KOKOŠ", filename: "kokos1.webp", url: `${SUPABASE_STORAGE_URL}/kokos1.webp`, audio_url: `${SUPABASE_AUDIO_URL}/Kokos_zival.mp3` },
      { word: "KOLAČ", filename: "kolac1.webp", url: `${SUPABASE_STORAGE_URL}/kolac1.webp`, audio_url: `${SUPABASE_AUDIO_URL}/Kolac.mp3` },
      { word: "KOLO", filename: "kolo1.webp", url: `${SUPABASE_STORAGE_URL}/kolo1.webp`, audio_url: `${SUPABASE_AUDIO_URL}/Kolo.mp3` },
      { word: "KORUZA", filename: "koruza1.webp", url: `${SUPABASE_STORAGE_URL}/koruza1.webp`, audio_url: `${SUPABASE_AUDIO_URL}/Koruza.mp3` },
      { word: "KOST", filename: "kost1.webp", url: `${SUPABASE_STORAGE_URL}/kost1.webp`, audio_url: `${SUPABASE_AUDIO_URL}/Kost.mp3` },
      { word: "KOŠ", filename: "kos1.webp", url: `${SUPABASE_STORAGE_URL}/kos1.webp`, audio_url: `${SUPABASE_AUDIO_URL}/Kos_predmet.mp3` },
      { word: "KOŠARA", filename: "kosara1.webp", url: `${SUPABASE_STORAGE_URL}/kosara1.webp`, audio_url: `${SUPABASE_AUDIO_URL}/Kosara.mp3` },
      { word: "KOZA", filename: "koza1.webp", url: `${SUPABASE_STORAGE_URL}/koza1.webp`, audio_url: `${SUPABASE_AUDIO_URL}/Koza_zival.mp3` },
      { word: "KOZAREC", filename: "kozarec1.webp", url: `${SUPABASE_STORAGE_URL}/kozarec1.webp`, audio_url: `${SUPABASE_AUDIO_URL}/Kozarec.mp3` },
      { word: "KOŽA", filename: "koza_skin1.webp", url: `${SUPABASE_STORAGE_URL}/koza_skin1.webp`, audio_url: `${SUPABASE_AUDIO_URL}/Koza_cutilo.mp3` },
      { word: "KOS", filename: "kos_ptica1.webp", url: `${SUPABASE_STORAGE_URL}/kos_ptica1.webp`, audio_url: `${SUPABASE_AUDIO_URL}/Kos_ptica.mp3` },
      { word: "KRAVA", filename: "krava1.webp", url: `${SUPABASE_STORAGE_URL}/krava1.webp`, audio_url: `${SUPABASE_AUDIO_URL}/Krava.mp3` },
      { word: "KROF", filename: "krof1.webp", url: `${SUPABASE_STORAGE_URL}/krof1.webp`, audio_url: `${SUPABASE_AUDIO_URL}/Krof.mp3` },
      { word: "KROG", filename: "krog1.webp", url: `${SUPABASE_STORAGE_URL}/krog1.webp`, audio_url: `${SUPABASE_AUDIO_URL}/Krog.mp3` },
      { word: "KROŽNIK", filename: "kroznik1.webp", url: `${SUPABASE_STORAGE_URL}/kroznik1.webp`, audio_url: `${SUPABASE_AUDIO_URL}/Kroznik.mp3` },
      { word: "KRUH", filename: "kruh1.webp", url: `${SUPABASE_STORAGE_URL}/kruh1.webp`, audio_url: `${SUPABASE_AUDIO_URL}/Kruh.mp3` },
      { word: "KUMARA", filename: "kumara1.webp", url: `${SUPABASE_STORAGE_URL}/kumara1.webp`, audio_url: `${SUPABASE_AUDIO_URL}/Kumara.mp3` },
      { word: "KUŽA", filename: "kuza1.webp", url: `${SUPABASE_STORAGE_URL}/kuza1.webp`, audio_url: `${SUPABASE_AUDIO_URL}/Kuza.mp3` }
    ]
  },
  {
    letter: "L",
    images: [
      { word: "LADJA", filename: "ladja1.webp", url: `${SUPABASE_STORAGE_URL}/ladja1.webp`, audio_url: `${SUPABASE_AUDIO_URL}/Ladja.mp3` },
      { word: "LASJE", filename: "lasje1.webp", url: `${SUPABASE_STORAGE_URL}/lasje1.webp`, audio_url: `${SUPABASE_AUDIO_URL}/Lasje.mp3` },
      { word: "LED", filename: "led1.webp", url: `${SUPABASE_STORAGE_URL}/led1.webp`, audio_url: `${SUPABASE_AUDIO_URL}/Led.mp3` },
      { word: "LES", filename: "les1.webp", url: `${SUPABASE_STORAGE_URL}/les1.webp`, audio_url: `${SUPABASE_AUDIO_URL}/Les.mp3` },
      { word: "LEŠNIK", filename: "lesnik1.webp", url: `${SUPABASE_STORAGE_URL}/lesnik1.webp`, audio_url: `${SUPABASE_AUDIO_URL}/Lesnik.mp3` },
      { word: "LETALO", filename: "letalo1.webp", url: `${SUPABASE_STORAGE_URL}/letalo1.webp`, audio_url: `${SUPABASE_AUDIO_URL}/Letalo.mp3` },
      { word: "LEV", filename: "lev1.webp", url: `${SUPABASE_STORAGE_URL}/lev1.webp`, audio_url: `${SUPABASE_AUDIO_URL}/Lev.mp3` },
      { word: "LISICA", filename: "lisica1.webp", url: `${SUPABASE_STORAGE_URL}/lisica1.webp`, audio_url: `${SUPABASE_AUDIO_URL}/Lisica.mp3` },
      { word: "LIST", filename: "list1.webp", url: `${SUPABASE_STORAGE_URL}/list1.webp`, audio_url: `${SUPABASE_AUDIO_URL}/List.mp3` },
      { word: "LIZIKA", filename: "lizika1.webp", url: `${SUPABASE_STORAGE_URL}/lizika1.webp`, audio_url: `${SUPABASE_AUDIO_URL}/Lizika.mp3` },
      { word: "LONEC", filename: "lonec1.webp", url: `${SUPABASE_STORAGE_URL}/lonec1.webp`, audio_url: `${SUPABASE_AUDIO_URL}/Lonec.mp3` },
      { word: "LOPAR", filename: "lopar1.webp", url: `${SUPABASE_STORAGE_URL}/lopar1.webp`, audio_url: `${SUPABASE_AUDIO_URL}/Lopar.mp3` },
      { word: "LOS", filename: "los1.webp", url: `${SUPABASE_STORAGE_URL}/los1.webp`, audio_url: `${SUPABASE_AUDIO_URL}/Los.mp3` },
      { word: "LOVEC", filename: "lovec1.webp", url: `${SUPABASE_STORAGE_URL}/lovec1.webp`, audio_url: `${SUPABASE_AUDIO_URL}/Lovec.mp3` },
      { word: "LUBENICA", filename: "lubenica1.webp", url: `${SUPABASE_STORAGE_URL}/lubenica1.webp`, audio_url: `${SUPABASE_AUDIO_URL}/Lubenica.mp3` },
      { word: "LUČ", filename: "luc1.webp", url: `${SUPABASE_STORAGE_URL}/luc1.webp`, audio_url: `${SUPABASE_AUDIO_URL}/Luc.mp3` },
      { word: "LUŽA", filename: "luza1.webp", url: `${SUPABASE_STORAGE_URL}/luza1.webp`, audio_url: `${SUPABASE_AUDIO_URL}/Luza.mp3` }
    ]
  },
  {
    letter: "S",
    images: [
      { word: "SEDEM", filename: "sedem1.webp", url: `${SUPABASE_STORAGE_URL}/sedem1.webp`, audio_url: `${SUPABASE_AUDIO_URL}/Sedem.mp3` },
      { word: "SIR", filename: "sir1.webp", url: `${SUPABASE_STORAGE_URL}/sir1.webp`, audio_url: `${SUPABASE_AUDIO_URL}/Sir.mp3` },
      { word: "SLADOLED", filename: "sladoled1.webp", url: `${SUPABASE_STORAGE_URL}/sladoled1.webp`, audio_url: `${SUPABASE_AUDIO_URL}/Sladoled.mp3` },
      { word: "SLIKA", filename: "slika1.webp", url: `${SUPABASE_STORAGE_URL}/slika1.webp`, audio_url: `${SUPABASE_AUDIO_URL}/Slika.mp3` },
      { word: "SLON", filename: "slon1.webp", url: `${SUPABASE_STORAGE_URL}/slon1.webp`, audio_url: `${SUPABASE_AUDIO_URL}/Slon.mp3` },
      { word: "SLUZ", filename: "sluz1.webp", url: `${SUPABASE_STORAGE_URL}/sluz1.webp`, audio_url: `${SUPABASE_AUDIO_URL}/Sluz.mp3` },
      { word: "SMREKA", filename: "smreka1.webp", url: `${SUPABASE_STORAGE_URL}/smreka1.webp`, audio_url: `${SUPABASE_AUDIO_URL}/Smreka.mp3` },
      { word: "SNEG", filename: "sneg1.webp", url: `${SUPABASE_STORAGE_URL}/sneg1.webp`, audio_url: `${SUPABASE_AUDIO_URL}/Sneg.mp3` },
      { word: "SNEŽAK", filename: "snezak1.webp", url: `${SUPABASE_STORAGE_URL}/snezak1.webp`, audio_url: `${SUPABASE_AUDIO_URL}/Snezak.mp3` },
      { word: "SNEŽINKA", filename: "snezinka1.webp", url: `${SUPABASE_STORAGE_URL}/snezinka1.webp`, audio_url: `${SUPABASE_AUDIO_URL}/Snezinka.mp3` },
      { word: "SOK", filename: "sok1.webp", url: `${SUPABASE_STORAGE_URL}/sok1.webp`, audio_url: `${SUPABASE_AUDIO_URL}/Sok.mp3` },
      { word: "SONCE", filename: "sonce1.webp", url: `${SUPABASE_STORAGE_URL}/sonce1.webp`, audio_url: `${SUPABASE_AUDIO_URL}/Sonce.mp3` },
      { word: "SOVA", filename: "sova1.webp", url: `${SUPABASE_STORAGE_URL}/sova1.webp`, audio_url: `${SUPABASE_AUDIO_URL}/Sova.mp3` },
      { word: "STOL", filename: "stol1.webp", url: `${SUPABASE_STORAGE_URL}/stol1.webp`, audio_url: `${SUPABASE_AUDIO_URL}/Stol.mp3` },
      { word: "SVETILKA", filename: "svetilka1.webp", url: `${SUPABASE_STORAGE_URL}/svetilka1.webp`, audio_url: `${SUPABASE_AUDIO_URL}/Svetilka.mp3` },
      { word: "SVINČNIK", filename: "svincnik1.webp", url: `${SUPABASE_STORAGE_URL}/svincnik1.webp`, audio_url: `${SUPABASE_AUDIO_URL}/Svincnik.mp3` }
    ]
  },
  {
    letter: "Š",
    images: [
      { word: "ŠAH", filename: "sah1.webp", url: `${SUPABASE_STORAGE_URL}/sah1.webp`, audio_url: `${SUPABASE_AUDIO_URL}/Sah.mp3` },
      { word: "ŠAL", filename: "sal1.webp", url: `${SUPABASE_STORAGE_URL}/sal1.webp`, audio_url: `${SUPABASE_AUDIO_URL}/Sal.mp3` },
      { word: "ŠČETKA", filename: "scetka1.webp", url: `${SUPABASE_STORAGE_URL}/scetka1.webp`, audio_url: `${SUPABASE_AUDIO_URL}/Scetka.mp3` },
      { word: "ŠKARJE", filename: "skarje1.webp", url: `${SUPABASE_STORAGE_URL}/skarje1.webp`, audio_url: `${SUPABASE_AUDIO_URL}/Skarje.mp3` },
      { word: "ŠKATLA", filename: "skatla1.webp", url: `${SUPABASE_STORAGE_URL}/skatla1.webp`, audio_url: `${SUPABASE_AUDIO_URL}/Skatla.mp3` },
      { word: "ŠKOLJKA", filename: "skoljka1.webp", url: `${SUPABASE_STORAGE_URL}/skoljka1.webp`, audio_url: `${SUPABASE_AUDIO_URL}/Skoljka.mp3` },
      { word: "ŠOFER", filename: "sofer1.webp", url: `${SUPABASE_STORAGE_URL}/sofer1.webp`, audio_url: `${SUPABASE_AUDIO_URL}/Sofer.mp3` },
      { word: "ŠOPEK", filename: "sopek1.webp", url: `${SUPABASE_STORAGE_URL}/sopek1.webp`, audio_url: `${SUPABASE_AUDIO_URL}/Sopek.mp3` },
      { word: "ŠOTOR", filename: "sotor1.webp", url: `${SUPABASE_STORAGE_URL}/sotor1.webp`, audio_url: `${SUPABASE_AUDIO_URL}/Sotor.mp3` },
      { word: "ŠTAMPILJKA", filename: "stampiljka1.webp", url: `${SUPABASE_STORAGE_URL}/stampiljka1.webp`, audio_url: `${SUPABASE_AUDIO_URL}/Stampiljka.mp3` },
      { word: "ŠTORKLJA", filename: "storklja1.webp", url: `${SUPABASE_STORAGE_URL}/storklja1.webp`, audio_url: `${SUPABASE_AUDIO_URL}/Storklja.mp3` }
    ]
  },
  {
    letter: "Z",
    images: [
      { word: "ZAJEC", filename: "zajec1.webp", url: `${SUPABASE_STORAGE_URL}/zajec1.webp`, audio_url: `${SUPABASE_AUDIO_URL}/Zajec.mp3` },
      { word: "ZASLON", filename: "zaslon1.webp", url: `${SUPABASE_STORAGE_URL}/zaslon1.webp`, audio_url: `${SUPABASE_AUDIO_URL}/Zaslon.mp3` },
      { word: "ZAVESA", filename: "zavesa1.webp", url: `${SUPABASE_STORAGE_URL}/zavesa1.webp`, audio_url: `${SUPABASE_AUDIO_URL}/Zavesa.mp3` },
      { word: "ZEBRA", filename: "zebra1.webp", url: `${SUPABASE_STORAGE_URL}/zebra1.webp`, audio_url: `${SUPABASE_AUDIO_URL}/Zebra.mp3` },
      { word: "ZLATO", filename: "zlato1.webp", url: `${SUPABASE_STORAGE_URL}/zlato1.webp`, audio_url: `${SUPABASE_AUDIO_URL}/Zlato.mp3` },
      { word: "ZMAJ", filename: "zmaj1.webp", url: `${SUPABASE_STORAGE_URL}/zmaj1.webp`, audio_url: `${SUPABASE_AUDIO_URL}/Zmaj.mp3` },
      { word: "ZOB", filename: "zob1.webp", url: `${SUPABASE_STORAGE_URL}/zob1.webp`, audio_url: `${SUPABASE_AUDIO_URL}/Zob.mp3` },
      { word: "ZOBOTREBEC", filename: "zobotrebec1.webp", url: `${SUPABASE_STORAGE_URL}/zobotrebec1.webp`, audio_url: `${SUPABASE_AUDIO_URL}/Zobotrebec.mp3` },
      { word: "ZVEZDA", filename: "zvezda1.webp", url: `${SUPABASE_STORAGE_URL}/zvezda1.webp`, audio_url: `${SUPABASE_AUDIO_URL}/Zvezda.mp3` },
      { word: "ZVEZEK", filename: "zvezek1.webp", url: `${SUPABASE_STORAGE_URL}/zvezek1.webp`, audio_url: `${SUPABASE_AUDIO_URL}/Zvezek.mp3` },
      { word: "ZVOČNIK", filename: "zvocnik1.webp", url: `${SUPABASE_STORAGE_URL}/zvocnik1.webp`, audio_url: `${SUPABASE_AUDIO_URL}/Zvocnik.mp3` }
    ]
  },
  {
    letter: "Ž",
    images: [
      { word: "ŽABA", filename: "zaba1.webp", url: `${SUPABASE_STORAGE_URL}/zaba1.webp`, audio_url: `${SUPABASE_AUDIO_URL}/Zaba.mp3` },
      { word: "ŽAGA", filename: "zaga1.webp", url: `${SUPABASE_STORAGE_URL}/zaga1.webp`, audio_url: `${SUPABASE_AUDIO_URL}/Zaga.mp3` },
      { word: "ŽARNICA", filename: "zarnica1.webp", url: `${SUPABASE_STORAGE_URL}/zarnica1.webp`, audio_url: `${SUPABASE_AUDIO_URL}/Zarnica.mp3` },
      { word: "ŽEBELJ", filename: "zebelj1.webp", url: `${SUPABASE_STORAGE_URL}/zebelj1.webp`, audio_url: `${SUPABASE_AUDIO_URL}/Zebelj.mp3` },
      { word: "ŽELVA", filename: "zelva1.webp", url: `${SUPABASE_STORAGE_URL}/zelva1.webp`, audio_url: `${SUPABASE_AUDIO_URL}/Zelva.mp3` },
      { word: "ŽERJAV", filename: "zerjav1.webp", url: `${SUPABASE_STORAGE_URL}/zerjav1.webp`, audio_url: `${SUPABASE_AUDIO_URL}/Zerjav.mp3` },
      { word: "ŽIRAFA", filename: "zirafa1.webp", url: `${SUPABASE_STORAGE_URL}/zirafa1.webp`, audio_url: `${SUPABASE_AUDIO_URL}/Zirafa.mp3` },
      { word: "ŽLICA", filename: "zlica1.webp", url: `${SUPABASE_STORAGE_URL}/zlica1.webp`, audio_url: `${SUPABASE_AUDIO_URL}/Zlica.mp3` },
      { word: "ŽOGA", filename: "zoga1.webp", url: `${SUPABASE_STORAGE_URL}/zoga1.webp`, audio_url: `${SUPABASE_AUDIO_URL}/Zoga.mp3` },
      { word: "ŽOLNA", filename: "zolna1.webp", url: `${SUPABASE_STORAGE_URL}/zolna1.webp`, audio_url: `${SUPABASE_AUDIO_URL}/Zolna.mp3` }
    ]
  },
  {
    letter: "R",
    images: [
      { word: "RACA", filename: "raca1.webp", url: `${SUPABASE_STORAGE_URL}/raca1.webp`, audio_url: `${SUPABASE_AUDIO_URL}/Raca.mp3` },
      { word: "RAK", filename: "rak1.webp", url: `${SUPABASE_STORAGE_URL}/rak1.webp`, audio_url: `${SUPABASE_AUDIO_URL}/Rak.mp3` },
      { word: "RAKETA", filename: "raketa1.webp", url: `${SUPABASE_STORAGE_URL}/raketa1.webp`, audio_url: `${SUPABASE_AUDIO_URL}/Raketa.mp3` },
      { word: "RAVNILO", filename: "ravnilo1.webp", url: `${SUPABASE_STORAGE_URL}/ravnilo1.webp`, audio_url: `${SUPABASE_AUDIO_URL}/Ravnilo.mp3` },
      { word: "REP", filename: "rep1.webp", url: `${SUPABASE_STORAGE_URL}/rep1.webp`, audio_url: `${SUPABASE_AUDIO_URL}/Rep.mp3` },
      { word: "REPA", filename: "repa1.webp", url: `${SUPABASE_STORAGE_URL}/repa1.webp`, audio_url: `${SUPABASE_AUDIO_URL}/Repa.mp3` },
      { word: "RIBA", filename: "riba1.webp", url: `${SUPABASE_STORAGE_URL}/riba1.webp`, audio_url: `${SUPABASE_AUDIO_URL}/Riba.mp3` },
      { word: "RIBEZ", filename: "ribez1.webp", url: `${SUPABASE_STORAGE_URL}/ribez1.webp`, audio_url: `${SUPABASE_AUDIO_URL}/Ribez.mp3` },
      { word: "RIBIČ", filename: "ribic1.webp", url: `${SUPABASE_STORAGE_URL}/ribic1.webp`, audio_url: `${SUPABASE_AUDIO_URL}/Ribic.mp3` },
      { word: "RIS", filename: "ris1.webp", url: `${SUPABASE_STORAGE_URL}/ris1.webp`, audio_url: `${SUPABASE_AUDIO_URL}/Ris.mp3` },
      { word: "RIŽ", filename: "riz1.webp", url: `${SUPABASE_STORAGE_URL}/riz1.webp`, audio_url: `${SUPABASE_AUDIO_URL}/Riz.mp3` },
      { word: "ROBOT", filename: "robot1.webp", url: `${SUPABASE_STORAGE_URL}/robot1.webp`, audio_url: `${SUPABASE_AUDIO_URL}/Robot.mp3` },
      { word: "ROKA", filename: "roka1.webp", url: `${SUPABASE_STORAGE_URL}/roka1.webp`, audio_url: `${SUPABASE_AUDIO_URL}/Roka.mp3` },
      { word: "ROKOMETAŠ", filename: "rokometas1.webp", url: `${SUPABASE_STORAGE_URL}/rokometas1.webp`, audio_url: `${SUPABASE_AUDIO_URL}/Rokometas.mp3` },
      { word: "ROLKA", filename: "rolka1.webp", url: `${SUPABASE_STORAGE_URL}/rolka1.webp`, audio_url: `${SUPABASE_AUDIO_URL}/Rolka.mp3` },
      { word: "ROPOTULJICA", filename: "ropotuljica1.webp", url: `${SUPABASE_STORAGE_URL}/ropotuljica1.webp`, audio_url: `${SUPABASE_AUDIO_URL}/Ropotuljica.mp3` },
      { word: "ROŽA", filename: "roza1.webp", url: `${SUPABASE_STORAGE_URL}/roza1.webp`, audio_url: `${SUPABASE_AUDIO_URL}/Roza.mp3` }
    ]
  },
  {
    letter: "F",
    images: [
      { word: "FARAON", filename: "faraon.webp", url: `${SUPABASE_STORAGE_URL}/faraon.webp`, audio_url: `${SUPABASE_AUDIO_URL}/Faraon.mp3` },
      { word: "FAZAN", filename: "fazan.webp", url: `${SUPABASE_STORAGE_URL}/fazan.webp`, audio_url: `${SUPABASE_AUDIO_URL}/Fazan.mp3` },
      { word: "FEFERON", filename: "feferon.webp", url: `${SUPABASE_STORAGE_URL}/feferon.webp`, audio_url: `${SUPABASE_AUDIO_URL}/Feferon.mp3` },
      { word: "FIGA", filename: "figa.webp", url: `${SUPABASE_STORAGE_URL}/figa.webp`, audio_url: `${SUPABASE_AUDIO_URL}/Figa.mp3` },
      { word: "FLAVTA", filename: "flavta.webp", url: `${SUPABASE_STORAGE_URL}/flavta.webp`, audio_url: `${SUPABASE_AUDIO_URL}/Flavta.mp3` },
      { word: "FORMULA", filename: "formula.webp", url: `${SUPABASE_STORAGE_URL}/formula.webp`, audio_url: `${SUPABASE_AUDIO_URL}/Formula.mp3` },
      { word: "FOTELJ", filename: "fotelj.webp", url: `${SUPABASE_STORAGE_URL}/fotelj.webp`, audio_url: `${SUPABASE_AUDIO_URL}/Fotelj.mp3` },
      { word: "FRAČA", filename: "fraca.webp", url: `${SUPABASE_STORAGE_URL}/fraca.webp`, audio_url: `${SUPABASE_AUDIO_URL}/Fraca.mp3` },
      { word: "FRIZER", filename: "frizer.webp", url: `${SUPABASE_STORAGE_URL}/frizer.webp`, audio_url: `${SUPABASE_AUDIO_URL}/Frizer.mp3` },
      { word: "FRNIKOLA", filename: "frnikola.webp", url: `${SUPABASE_STORAGE_URL}/frnikola.webp`, audio_url: `${SUPABASE_AUDIO_URL}/Frnikola.mp3` },
      { word: "FANT", filename: "fant1.webp", url: `${SUPABASE_STORAGE_URL}/fant1.webp`, audio_url: `${SUPABASE_AUDIO_URL}/Fant.mp3` },
      { word: "FEN", filename: "fen1.webp", url: `${SUPABASE_STORAGE_URL}/fen1.webp`, audio_url: `${SUPABASE_AUDIO_URL}/Fen.mp3` },
      { word: "FIŽOL", filename: "fizol1.webp", url: `${SUPABASE_STORAGE_URL}/fizol1.webp`, audio_url: `${SUPABASE_AUDIO_URL}/Fizol.mp3` }
    ]
  },
  {
    letter: "G",
    images: [
      { word: "GASILEC", filename: "gasilec.webp", url: `${SUPABASE_STORAGE_URL}/gasilec.webp`, audio_url: `${SUPABASE_AUDIO_URL}/Gasilec.mp3` },
      { word: "GLAVNIK", filename: "glavnik.webp", url: `${SUPABASE_STORAGE_URL}/glavnik.webp`, audio_url: `${SUPABASE_AUDIO_URL}/Glavnik.mp3` },
      { word: "GOLOB", filename: "golob.webp", url: `${SUPABASE_STORAGE_URL}/golob.webp`, audio_url: `${SUPABASE_AUDIO_URL}/Golob.mp3` },
      { word: "GOS", filename: "gos.webp", url: `${SUPABASE_STORAGE_URL}/gos.webp`, audio_url: `${SUPABASE_AUDIO_URL}/Gos.mp3` },
      { word: "GOZDAR", filename: "gozdar.webp", url: `${SUPABASE_STORAGE_URL}/gozdar.webp`, audio_url: `${SUPABASE_AUDIO_URL}/Gozdar.mp3` },
      { word: "GRAD", filename: "grad.webp", url: `${SUPABASE_STORAGE_URL}/grad.webp`, audio_url: `${SUPABASE_AUDIO_URL}/Grad.mp3` },
      { word: "GRAH", filename: "grah.webp", url: `${SUPABASE_STORAGE_URL}/grah.webp`, audio_url: `${SUPABASE_AUDIO_URL}/Grah.mp3` },
      { word: "GUGALNICA", filename: "gugalnica.webp", url: `${SUPABASE_STORAGE_URL}/gugalnica.webp`, audio_url: `${SUPABASE_AUDIO_URL}/Gugalnica.mp3` },
      { word: "GUSAR", filename: "gusar.webp", url: `${SUPABASE_STORAGE_URL}/gusar.webp`, audio_url: `${SUPABASE_AUDIO_URL}/Gusar.mp3` },
      { word: "GOBA", filename: "goba1.webp", url: `${SUPABASE_STORAGE_URL}/goba1.webp`, audio_url: `${SUPABASE_AUDIO_URL}/Goba.mp3` },
      { word: "GOL", filename: "gol1.webp", url: `${SUPABASE_STORAGE_URL}/gol1.webp`, audio_url: `${SUPABASE_AUDIO_URL}/Gol.mp3` },
      { word: "GUMA", filename: "guma1.webp", url: `${SUPABASE_STORAGE_URL}/guma1.webp`, audio_url: `${SUPABASE_AUDIO_URL}/Guma.mp3` },
      { word: "GARAŽA", filename: "garaza1.webp", url: `${SUPABASE_STORAGE_URL}/garaza1.webp`, audio_url: `${SUPABASE_AUDIO_URL}/Garaza.mp3` },
      { word: "GNEZDO", filename: "gnezdo1.webp", url: `${SUPABASE_STORAGE_URL}/gnezdo1.webp`, audio_url: `${SUPABASE_AUDIO_URL}/Gnezdo.mp3` },
      { word: "GROZDJE", filename: "grozdje1.webp", url: `${SUPABASE_STORAGE_URL}/grozdje1.webp`, audio_url: `${SUPABASE_AUDIO_URL}/Grozdje.mp3` },
      { word: "GLAVA", filename: "glava1.webp", url: `${SUPABASE_STORAGE_URL}/glava1.webp`, audio_url: `${SUPABASE_AUDIO_URL}/Glava.mp3` }
    ]
  },
  {
    letter: "H",
    images: [
      { word: "HARFA", filename: "harfa.webp", url: `${SUPABASE_STORAGE_URL}/harfa.webp`, audio_url: `${SUPABASE_AUDIO_URL}/Harfa.mp3` },
      { word: "HARMONIKA", filename: "harmonika.webp", url: `${SUPABASE_STORAGE_URL}/harmonika.webp`, audio_url: `${SUPABASE_AUDIO_URL}/Harmonika.mp3` },
      { word: "HELIKOPTER", filename: "helikopter.webp", url: `${SUPABASE_STORAGE_URL}/helikopter.webp`, audio_url: `${SUPABASE_AUDIO_URL}/Helikopter.mp3` },
      { word: "HIJENA", filename: "hijena.webp", url: `${SUPABASE_STORAGE_URL}/hijena.webp`, audio_url: `${SUPABASE_AUDIO_URL}/Hijena.mp3` },
      { word: "HLEV", filename: "hlev.webp", url: `${SUPABASE_STORAGE_URL}/hlev.webp`, audio_url: `${SUPABASE_AUDIO_URL}/Hlev.mp3` },
      { word: "HOBOTNICA", filename: "hobotnica.webp", url: `${SUPABASE_STORAGE_URL}/hobotnica.webp`, audio_url: `${SUPABASE_AUDIO_URL}/Hobotnica.mp3` },
      { word: "HOKEJ", filename: "hokej.webp", url: `${SUPABASE_STORAGE_URL}/hokej.webp`, audio_url: `${SUPABASE_AUDIO_URL}/Hokej.mp3` },
      { word: "HOTEL", filename: "hotel.webp", url: `${SUPABASE_STORAGE_URL}/hotel.webp`, audio_url: `${SUPABASE_AUDIO_URL}/Hotel.mp3` },
      { word: "HRČEK", filename: "hrcek.webp", url: `${SUPABASE_STORAGE_URL}/hrcek.webp`, audio_url: `${SUPABASE_AUDIO_URL}/Hrcek.mp3` },
      { word: "HRIB", filename: "hrib.webp", url: `${SUPABASE_STORAGE_URL}/hrib.webp`, audio_url: `${SUPABASE_AUDIO_URL}/Hrib.mp3` },
      { word: "HUPA", filename: "hupa.webp", url: `${SUPABASE_STORAGE_URL}/hupa.webp`, audio_url: `${SUPABASE_AUDIO_URL}/Hupa.mp3` },
      { word: "HIŠA", filename: "hisa1.webp", url: `${SUPABASE_STORAGE_URL}/hisa1.webp`, audio_url: `${SUPABASE_AUDIO_URL}/Hisa.mp3` },
      { word: "HLAČE", filename: "hlace1.webp", url: `${SUPABASE_STORAGE_URL}/hlace1.webp`, audio_url: `${SUPABASE_AUDIO_URL}/Hlace.mp3` },
      { word: "HRUŠKA", filename: "hruska1.webp", url: `${SUPABASE_STORAGE_URL}/hruska1.webp`, audio_url: `${SUPABASE_AUDIO_URL}/Hruska.mp3` }
    ]
  },
  {
    letter: "V",
    images: [
      { word: "VAFELJ", filename: "vafelj.webp", url: `${SUPABASE_STORAGE_URL}/vafelj.webp`, audio_url: `${SUPABASE_AUDIO_URL}/Vafelj.mp3` },
      { word: "VEDRO", filename: "vedro.webp", url: `${SUPABASE_STORAGE_URL}/vedro.webp`, audio_url: `${SUPABASE_AUDIO_URL}/Vedro.mp3` },
      { word: "VESLO", filename: "veslo.webp", url: `${SUPABASE_STORAGE_URL}/veslo.webp`, audio_url: `${SUPABASE_AUDIO_URL}/Veslo.mp3` },
      { word: "VEVERICA", filename: "veverica.webp", url: `${SUPABASE_STORAGE_URL}/veverica.webp`, audio_url: `${SUPABASE_AUDIO_URL}/Veverica.mp3` },
      { word: "VILE", filename: "vile.webp", url: `${SUPABASE_STORAGE_URL}/vile.webp`, audio_url: `${SUPABASE_AUDIO_URL}/Vile.mp3` },
      { word: "VITEZ", filename: "vitez.webp", url: `${SUPABASE_STORAGE_URL}/vitez.webp`, audio_url: `${SUPABASE_AUDIO_URL}/Vitez.mp3` },
      { word: "VOLK", filename: "volk.webp", url: `${SUPABASE_STORAGE_URL}/volk.webp`, audio_url: `${SUPABASE_AUDIO_URL}/Volk.mp3` },
      { word: "VOLNA", filename: "volna.webp", url: `${SUPABASE_STORAGE_URL}/volna.webp`, audio_url: `${SUPABASE_AUDIO_URL}/Volna.mp3` },
      { word: "VOZIČEK", filename: "vozicek.webp", url: `${SUPABASE_STORAGE_URL}/vozicek.webp`, audio_url: `${SUPABASE_AUDIO_URL}/Vozicek.mp3` },
      { word: "VRATA", filename: "vrata.webp", url: `${SUPABASE_STORAGE_URL}/vrata.webp`, audio_url: `${SUPABASE_AUDIO_URL}/Vrata.mp3` },
      { word: "VULKAN", filename: "vulkan.webp", url: `${SUPABASE_STORAGE_URL}/vulkan.webp`, audio_url: `${SUPABASE_AUDIO_URL}/Vulkan.mp3` },
      { word: "VAZA", filename: "vaza1.webp", url: `${SUPABASE_STORAGE_URL}/vaza1.webp`, audio_url: `${SUPABASE_AUDIO_URL}/Vaza.mp3` },
      { word: "VEJA", filename: "veja1.webp", url: `${SUPABASE_STORAGE_URL}/veja1.webp`, audio_url: `${SUPABASE_AUDIO_URL}/Veja.mp3` },
      { word: "VETRNICA", filename: "veternica1.webp", url: `${SUPABASE_STORAGE_URL}/veternica1.webp`, audio_url: `${SUPABASE_AUDIO_URL}/Vetrnica.mp3` },
      { word: "VILICE", filename: "vilica1.webp", url: `${SUPABASE_STORAGE_URL}/vilica1.webp`, audio_url: `${SUPABASE_AUDIO_URL}/Vilice.mp3` },
      { word: "VODA", filename: "voda1.webp", url: `${SUPABASE_STORAGE_URL}/voda1.webp`, audio_url: `${SUPABASE_AUDIO_URL}/Voda.mp3` },
      { word: "VOLAN", filename: "volan1.webp", url: `${SUPABASE_STORAGE_URL}/volan1.webp`, audio_url: `${SUPABASE_AUDIO_URL}/Volan.mp3` },
      { word: "VOZ", filename: "voz1.webp", url: `${SUPABASE_STORAGE_URL}/voz1.webp`, audio_url: `${SUPABASE_AUDIO_URL}/Voz.mp3` },
      { word: "VERIŽICA", filename: "verizica1.webp", url: `${SUPABASE_STORAGE_URL}/verizica1.webp`, audio_url: `${SUPABASE_AUDIO_URL}/Verizica.mp3` },
      { word: "VEZALKE", filename: "vezalke1.webp", url: `${SUPABASE_STORAGE_URL}/vezalke1.webp`, audio_url: `${SUPABASE_AUDIO_URL}/Vezalke.mp3` },
      { word: "VIŠNJA", filename: "visnja1.webp", url: `${SUPABASE_STORAGE_URL}/visnja1.webp`, audio_url: `${SUPABASE_AUDIO_URL}/Visnja.mp3` },
      { word: "VRABEC", filename: "vrabec1.webp", url: `${SUPABASE_STORAGE_URL}/vrabec1.webp`, audio_url: `${SUPABASE_AUDIO_URL}/Vrabec.mp3` }
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
