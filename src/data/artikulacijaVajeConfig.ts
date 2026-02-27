// Consolidated configuration for all ArtikulacijaVaje (Wheel and Bingo) games
// This replaces 18 individual page files

export interface WordData {
  word: string;
  image: string;
  audio: string;
}

export interface BingoWordData {
  word: string;
  image: string;
  audio: string | null;
}

export type GameType = 'wheel' | 'bingo';

export interface ArtikulacijaConfig {
  letter: string;
  displayLetter: string;
  gameType: GameType;
  title: string;
  wordsData: WordData[] | BingoWordData[];
  exerciseId?: string;
  lipsImage?: string;
}

// Wheel game word data (začetek - beginning position)
const wordsDataC: WordData[] = [
  { word: "CEDILO", image: "cedilo1.webp", audio: "Cedilo.mp3" },
  { word: "CEKIN", image: "cekin1.webp", audio: "Cekin.mp3" },
  { word: "CERKEV", image: "cerkev1.webp", audio: "Cerkev.mp3" },
  { word: "CESTA", image: "cesta1.webp", audio: "Cesta.mp3" },
  { word: "CEV", image: "cev1.webp", audio: "Cev.mp3" },
  { word: "CIRKUS", image: "cirkus1.webp", audio: "Cirkus.mp3" },
  { word: "CISTERNA", image: "cisterna1.webp", audio: "Cisterna.mp3" },
  { word: "COKLA", image: "cokla1.webp", audio: "Cokla.mp3" },
  { word: "COPAT", image: "copat1.webp", audio: "Copat.mp3" },
  { word: "CVET", image: "cvet1.webp", audio: "Cvet.mp3" }
];

const wordsDataCH: WordData[] = [
  { word: "ČAJ", image: "caj1.webp", audio: "Caj.mp3" },
  { word: "ČASOPIS", image: "casopis1.webp", audio: "Casopis.mp3" },
  { word: "ČEBELA", image: "cebela1.webp", audio: "Cebela.mp3" },
  { word: "ČEBULA", image: "cebula1.webp", audio: "Cebula.mp3" },
  { word: "ČESEN", image: "cesen1.webp", audio: "Cesen.mp3" },
  { word: "ČEVLJI", image: "cevlji1.webp", audio: "Cevlji.mp3" },
  { word: "ČOKOLADA", image: "cokolada1.webp", audio: "Cokolada.mp3" },
  { word: "ČOLN", image: "coln1.webp", audio: "Coln.mp3" },
  { word: "ČOPIČ", image: "copic1.webp", audio: "Copic.mp3" },
  { word: "ČRKE", image: "crke1.webp", audio: "Crke.mp3" }
];

const wordsDataK: WordData[] = [
  { word: "KAČA", image: "kaca1.webp", audio: "Kaca.mp3" },
  { word: "KAPA", image: "kapa1.webp", audio: "Kapa.mp3" },
  { word: "KAVA", image: "kava1.webp", audio: "Kava.mp3" },
  { word: "KLAVIR", image: "klavir1.webp", audio: "Klavir.mp3" },
  { word: "KLJUČ", image: "kljuc1.webp", audio: "Kljuc.mp3" },
  { word: "KLOP", image: "klop1.webp", audio: "Klop.mp3" },
  { word: "KNJIGA", image: "knjiga1.webp", audio: "Knjiga.mp3" },
  { word: "KOCKA", image: "kocka1.webp", audio: "Kocka.mp3" },
  { word: "KOKOŠ", image: "kokos1.webp", audio: "Kokos_zival.mp3" },
  { word: "KOLAČ", image: "kolac1.webp", audio: "Kolac.mp3" },
  { word: "KOLO", image: "kolo1.webp", audio: "Kolo.mp3" },
  { word: "KOŠ", image: "kos1.webp", audio: "Kos_predmet.mp3" },
  { word: "KOST", image: "kost1.webp", audio: "Kost.mp3" },
  { word: "KOŠARA", image: "kosara1.webp", audio: "Kosara.mp3" },
  { word: "KOZA", image: "koza1.webp", audio: "Koza_zival.mp3" },
  { word: "KOZAREC", image: "kozarec1.webp", audio: "Kozarec.mp3" },
  { word: "KRAVA", image: "krava1.webp", audio: "Krava.mp3" },
  { word: "KROF", image: "krof1.webp", audio: "Krof.mp3" },
  { word: "KROG", image: "krog1.webp", audio: "Krog.mp3" },
  { word: "KROŽNIK", image: "kroznik1.webp", audio: "Kroznik.mp3" },
  { word: "KRUH", image: "kruh1.webp", audio: "Kruh.mp3" },
  { word: "KUMARA", image: "kumara1.webp", audio: "Kumara.mp3" },
  { word: "KUŽA", image: "kuza1.webp", audio: "Kuza.mp3" }
];

const wordsDataL: WordData[] = [
  { word: "LADJA", image: "ladja1.webp", audio: "Ladja.mp3" },
  { word: "LED", image: "led1.webp", audio: "Led.mp3" },
  { word: "LETALO", image: "letalo1.webp", audio: "Letalo.mp3" },
  { word: "LEV", image: "lev1.webp", audio: "Lev.mp3" },
  { word: "LIST", image: "list1.webp", audio: "List.mp3" },
  { word: "LIZIKA", image: "lizika1.webp", audio: "Lizika.mp3" },
  { word: "LONEC", image: "lonec1.webp", audio: "Lonec.mp3" },
  { word: "LOPAR", image: "lopar1.webp", audio: "Lopar.mp3" },
  { word: "LUBENICA", image: "lubenica1.webp", audio: "Lubenica.mp3" },
  { word: "LUČ", image: "luc1.webp", audio: "Luc.mp3" }
];

const wordsDataR: WordData[] = [
  { word: "RACA", image: "raca1.webp", audio: "Raca.mp3" },
  { word: "RAK", image: "rak1.webp", audio: "Rak.mp3" },
  { word: "RAKETA", image: "raketa1.webp", audio: "Raketa.mp3" },
  { word: "RAVNILO", image: "ravnilo1.webp", audio: "Ravnilo.mp3" },
  { word: "REP", image: "rep1.webp", audio: "Rep.mp3" },
  { word: "REPA", image: "repa1.webp", audio: "Repa.mp3" },
  { word: "RIBA", image: "riba1.webp", audio: "Riba.mp3" },
  { word: "ROBOT", image: "robot1.webp", audio: "Robot.mp3" },
  { word: "ROKA", image: "roka1.webp", audio: "Roka.mp3" },
  { word: "ROLKA", image: "rolka1.webp", audio: "Rolka.mp3" },
  { word: "ROPOTULJICA", image: "ropotuljica1.webp", audio: "Ropotuljica.mp3" },
  { word: "ROŽA", image: "roza1.webp", audio: "Roza.mp3" }
];

const wordsDataS: WordData[] = [
  { word: "SEDEM", image: "sedem1.webp", audio: "Sedem.mp3" },
  { word: "SIR", image: "sir1.webp", audio: "Sir.mp3" },
  { word: "SLADOLED", image: "sladoled1.webp", audio: "Sladoled.mp3" },
  { word: "SLIKA", image: "slika1.webp", audio: "Slika.mp3" },
  { word: "SLON", image: "slon1.webp", audio: "Slon.mp3" },
  { word: "SLUZ", image: "sluz1.webp", audio: "Sluz.mp3" },
  { word: "SMREKA", image: "smreka1.webp", audio: "Smreka.mp3" },
  { word: "SNEG", image: "sneg1.webp", audio: "Sneg.mp3" },
  { word: "SNEŽAK", image: "snezak1.webp", audio: "Snezak.mp3" },
  { word: "SOK", image: "sok1.webp", audio: "Sok.mp3" },
  { word: "SONCE", image: "sonce1.webp", audio: "Sonce.mp3" },
  { word: "SOVA", image: "sova1.webp", audio: "Sova.mp3" },
  { word: "STOL", image: "stol1.webp", audio: "Stol.mp3" },
  { word: "SVETILKA", image: "svetilka1.webp", audio: "Svetilka.mp3" },
  { word: "SVINČNIK", image: "svincnik1.webp", audio: "Svincnik.mp3" }
];

const wordsDataSH: WordData[] = [
  { word: "ŠAH", image: "sah1.webp", audio: "Sah.mp3" },
  { word: "ŠAL", image: "sal1.webp", audio: "Sal.mp3" },
  { word: "ŠČETKA", image: "scetka1.webp", audio: "Scetka.mp3" },
  { word: "ŠKARJE", image: "skarje1.webp", audio: "Skarje.mp3" },
  { word: "ŠKATLA", image: "skatla1.webp", audio: "Skatla.mp3" },
  { word: "ŠKOLJKA", image: "skoljka1.webp", audio: "Skoljka.mp3" },
  { word: "ŠOPEK", image: "sopek1.webp", audio: "Sopek.mp3" },
  { word: "ŠOTOR", image: "sotor1.webp", audio: "Sotor.mp3" },
  { word: "ŠTAMPILJKA", image: "stampiljka1.webp", audio: "Stampiljka.mp3" },
  { word: "ŠTORKLJA", image: "storklja1.webp", audio: "Storklja.mp3" }
];

const wordsDataZ: WordData[] = [
  { word: "ZAJEC", image: "zajec1.webp", audio: "Zajec.mp3" },
  { word: "ZASLON", image: "zaslon1.webp", audio: "Zaslon.mp3" },
  { word: "ZAVESA", image: "zavesa1.webp", audio: "Zavesa.mp3" },
  { word: "ZEBRA", image: "zebra1.webp", audio: "Zebra.mp3" },
  { word: "ZLATO", image: "zlato1.webp", audio: "Zlato.mp3" },
  { word: "ZMAJ", image: "zmaj1.webp", audio: "Zmaj.mp3" },
  { word: "ZOB", image: "zob1.webp", audio: "Zob.mp3" },
  { word: "ZOBOTREBEC", image: "zobotrebec1.webp", audio: "Zobotrebec.mp3" },
  { word: "ZVEZEK", image: "zvezek1.webp", audio: "Zvezek.mp3" },
  { word: "ZVEZDA", image: "zvezda1.webp", audio: "Zvezda.mp3" },
  { word: "ZVOČNIK", image: "zvocnik1.webp", audio: "Zvocnik.mp3" }
];

const wordsDataZH: WordData[] = [
  { word: "ŽABA", image: "zaba1.webp", audio: "Zaba.mp3" },
  { word: "ŽAGA", image: "zaga1.webp", audio: "Zaga.mp3" },
  { word: "ŽARNICA", image: "zarnica1.webp", audio: "Zarnica.mp3" },
  { word: "ŽEBELJ", image: "zebelj1.webp", audio: "Zebelj.mp3" },
  { word: "ŽELVA", image: "zelva1.webp", audio: "Zelva.mp3" },
  { word: "ŽERJAV", image: "zerjav1.webp", audio: "Zerjav.mp3" },
  { word: "ŽIRAFA", image: "zirafa1.webp", audio: "Zirafa.mp3" },
  { word: "ŽLICA", image: "zlica1.webp", audio: "Zlica.mp3" },
  { word: "ŽOGA", image: "zoga1.webp", audio: "Zoga.mp3" },
  { word: "ŽOLNA", image: "zolna1.webp", audio: "Zolna.mp3" }
];

// Bingo game word data (sredina/konec - middle/end position)
const bingoDataCSredinaKonec: BingoWordData[] = [
  { word: "BOROVNICE", image: "borovnice1.webp", audio: "Borovnice.mp3" },
  { word: "KOCKA", image: "kocka1.webp", audio: "Kocka.mp3" },
  { word: "KOZAREC", image: "kozarec1.webp", audio: "Kozarec.mp3" },
  { word: "LONEC", image: "lonec1.webp", audio: "Lonec.mp3" },
  { word: "LUBENICA", image: "lubenica1.webp", audio: "Lubenica.mp3" },
  { word: "NOGAVICE", image: "nogavice1.webp", audio: "Nogavice.mp3" },
  { word: "PICA", image: "pica1.webp", audio: "Pica.mp3" },
  { word: "RACA", image: "raca1.webp", audio: "Raca.mp3" },
  { word: "ROPOTULJICA", image: "ropotuljica1.webp", audio: "Ropotuljica.mp3" },
  { word: "SONCE", image: "sonce1.webp", audio: "Sonce.mp3" },
  { word: "VETRNICA", image: "veternica1.webp", audio: "Vetrnica.mp3" },
  { word: "VILICA", image: "vilica1.webp", audio: "Vilice.mp3" },
  { word: "ZAJEC", image: "zajec1.webp", audio: "Zajec.mp3" },
  { word: "ZOBOTREBEC", image: "zobotrebec1.webp", audio: "Zobotrebec.mp3" },
  { word: "ŽARNICA", image: "zarnica1.webp", audio: "Zarnica.mp3" },
  { word: "ŽLICA", image: "zlica1.webp", audio: "Zlica.mp3" },
  { word: "JAJCE", image: "jajce1.webp", audio: "Jajce.mp3" }
];

const bingoDataCHSredinaKonec: BingoWordData[] = [
  { word: "HLAČE", image: "hlace1.webp", audio: "Hlace.mp3" },
  { word: "KAČA", image: "kaca1.webp", audio: "Kaca.mp3" },
  { word: "KLJUČ", image: "kljuc1.webp", audio: "Kljuc.mp3" },
  { word: "KOLAČ", image: "kolac1.webp", audio: "Kolac.mp3" },
  { word: "LUČ", image: "luc1.webp", audio: "Luc.mp3" },
  { word: "OČALA", image: "ocala1.webp", audio: "Ocala.mp3" },
  { word: "OČI", image: "oci1.webp", audio: "Oci.mp3" },
  { word: "SVINČNIK", image: "svincnik1.webp", audio: "Svincnik.mp3" },
  { word: "ŠČETKA", image: "scetka1.webp", audio: "Scetka.mp3" },
  { word: "ZVOČNIK", image: "zvocnik1.webp", audio: "Zvocnik.mp3" },
  { word: "ČOPIČ", image: "copic1.webp", audio: "Copic.mp3" },
  { word: "NOČ", image: "noc1.webp", audio: "Noc.mp3" },
  { word: "OBROČ", image: "obroc1.webp", audio: "Obroc.mp3" },
  { word: "PEČ", image: "pec1.webp", audio: "Pec.mp3" },
  { word: "PTIČ", image: "ptic1.webp", audio: "Ptic.mp3" },
  { word: "RIBIČ", image: "ribic1.webp", audio: "Ribic.mp3" }
];

const bingoDataKSredinaKonec: BingoWordData[] = [
  { word: "AVOKADO", image: "avokado1.webp", audio: "Avokado.mp3" },
  { word: "BIK", image: "bik1.webp", audio: "Bik.mp3" },
  { word: "CEKIN", image: "cekin1.webp", audio: "Cekin.mp3" },
  { word: "CERKEV", image: "cerkev1.webp", audio: "Cerkev.mp3" },
  { word: "CIRKUS", image: "cirkus1.webp", audio: "Cirkus.mp3" },
  { word: "COKLA", image: "cokla1.webp", audio: "Cokla.mp3" },
  { word: "ČOKOLADA", image: "cokolada1.webp", audio: "Cokolada.mp3" },
  { word: "ČRKE", image: "crke1.webp", audio: "Crke.mp3" },
  { word: "DEŽEVNIK", image: "dezevnik1.webp", audio: "Dezevnik.mp3" },
  { word: "DEŽNIK", image: "deznik1.webp", audio: "Deznik.mp3" },
  { word: "HRUŠKA", image: "hruska1.webp", audio: "Hruska.mp3" },
  { word: "JABOLKO", image: "jabolko1.webp", audio: "Jabolko.mp3" },
  { word: "JEZIK", image: "jezik1.webp", audio: "Jezik.mp3" },
  { word: "KOKOŠ", image: "kokos1.webp", audio: "Kokos_zival.mp3" },
  { word: "LIZIKA", image: "lizika1.webp", audio: "Lizika.mp3" },
  { word: "OBLAK", image: "oblak1.webp", audio: "Oblak.mp3" },
  { word: "PAJEK", image: "pajek1.webp", audio: "Pajek.mp3" },
  { word: "PIŠKOT", image: "piskot1.webp", audio: "Piskot.mp3" },
  { word: "RAK", image: "rak1.webp", audio: "Rak.mp3" },
  { word: "RAKETA", image: "raketa1.webp", audio: "Raketa.mp3" },
  { word: "ROKA", image: "roka1.webp", audio: "Roka.mp3" },
  { word: "ROLKA", image: "rolka1.webp", audio: "Rolka.mp3" },
  { word: "SLIKA", image: "slika1.webp", audio: "Slika.mp3" },
  { word: "SMREKA", image: "smreka1.webp", audio: "Smreka.mp3" },
  { word: "SNEŽAK", image: "snezak1.webp", audio: "Snezak.mp3" },
  { word: "SOK", image: "sok1.webp", audio: "Sok.mp3" },
  { word: "SVETILKA", image: "svetilka1.webp", audio: "Svetilka.mp3" },
  { word: "SVINČNIK", image: "svincnik1.webp", audio: "Svincnik.mp3" },
  { word: "ŠČETKA", image: "scetka1.webp", audio: "Scetka.mp3" },
  { word: "ŠKARJE", image: "skarje1.webp", audio: "Skarje.mp3" },
  { word: "ŠKATLA", image: "skatla1.webp", audio: "Skatla.mp3" },
  { word: "ŠKOLJKA", image: "skoljka1.webp", audio: "Skoljka.mp3" },
  { word: "ŠOPEK", image: "sopek1.webp", audio: "Sopek.mp3" },
  { word: "ŠTAMPILJKA", image: "stampiljka1.webp", audio: "Stampiljka.mp3" },
  { word: "ŠTORKLJA", image: "storklja1.webp", audio: "Storklja.mp3" },
  { word: "ZVOČNIK", image: "zvocnik1.webp", audio: "Zvocnik.mp3" },
];

const bingoDataLSredinaKonec: BingoWordData[] = [
  { word: "ALBUM", image: "album1.webp", audio: "Album.mp3" },
  { word: "ANGEL", image: "angel1.webp", audio: "Angel.mp3" },
  { word: "BALON", image: "balon1.webp", audio: "Balon.mp3" },
  { word: "CEDILO", image: "cedilo1.webp", audio: "Cedilo.mp3" },
  { word: "COKLA", image: "cokla1.webp", audio: "Cokla.mp3" },
  { word: "ČEBELA", image: "cebela1.webp", audio: "Cebela.mp3" },
  { word: "ČEBULA", image: "cebula1.webp", audio: "Cebula.mp3" },
  { word: "ČEVLJI", image: "cevlji1.webp", audio: "Cevlji.mp3" },
  { word: "ČOKOLADA", image: "cokolada1.webp", audio: "Cokolada.mp3" },
  { word: "GOL", image: "gol1.webp", audio: "Gol.mp3" },
  { word: "HLAČE", image: "hlace1.webp", audio: "Hlace.mp3" },
  { word: "KLAVIR", image: "klavir1.webp", audio: "Klavir.mp3" },
  { word: "KLJUČ", image: "kljuc1.webp", audio: "Kljuc.mp3" },
  { word: "KLOP", image: "klop1.webp", audio: "Klop.mp3" },
  { word: "KOLAČ", image: "kolac1.webp", audio: "Kolac.mp3" },
  { word: "KOLO", image: "kolo1.webp", audio: "Kolo.mp3" },
  { word: "LETALO", image: "letalo1.webp", audio: "Letalo.mp3" },
  { word: "METLA", image: "metla1.webp", audio: "Metla.mp3" },
  { word: "MILO", image: "milo1.webp", audio: "Milo.mp3" },
  { word: "OBLAK", image: "oblak1.webp", audio: "Oblak.mp3" },
  { word: "OČALA", image: "ocala1.webp", audio: "Ocala.mp3" },
  { word: "RAVNILO", image: "ravnilo1.webp", audio: "Ravnilo.mp3" },
  { word: "ROLKA", image: "rolka1.webp", audio: "Rolka.mp3" },
  { word: "ROPOTULJICA", image: "ropotuljica1.webp", audio: "Ropotuljica.mp3" },
  { word: "SLADOLED", image: "sladoled1.webp", audio: "Sladoled.mp3" },
  { word: "SLIKA", image: "slika1.webp", audio: "Slika.mp3" },
  { word: "SLON", image: "slon1.webp", audio: "Slon.mp3" },
  { word: "SLUZ", image: "sluz1.webp", audio: "Sluz.mp3" },
  { word: "SVETILKA", image: "svetilka1.webp", audio: "Svetilka.mp3" },
  { word: "ŠAL", image: "sal1.webp", audio: "Sal.mp3" },
  { word: "ŠKATLA", image: "skatla1.webp", audio: "Skatla.mp3" },
  { word: "ŠKOLJKA", image: "skoljka1.webp", audio: "Skoljka.mp3" },
  { word: "ŠTAMPILJKA", image: "stampiljka1.webp", audio: "Stampiljka.mp3" },
  { word: "ŠTORKLJA", image: "storklja1.webp", audio: "Storklja.mp3" },
  { word: "TELEFON", image: "telefon1.webp", audio: "Telefon.mp3" },
  { word: "VILICA", image: "vilica1.webp", audio: "Vilice.mp3" },
  { word: "VOLAN", image: "volan1.webp", audio: "Volan.mp3" },
  { word: "ZASLON", image: "zaslon1.webp", audio: "Zaslon.mp3" },
  { word: "ZLATO", image: "zlato1.webp", audio: "Zlato.mp3" },
  { word: "ŽEBELJ", image: "zebelj1.webp", audio: "Zebelj.mp3" },
  { word: "ŽELVA", image: "zelva1.webp", audio: "Zelva.mp3" },
  { word: "ŽLICA", image: "zlica1.webp", audio: "Zlica.mp3" },
  { word: "POLŽ", image: "polz1.webp", audio: "Polz.mp3" },
];

const bingoDataRSredinaKonec: BingoWordData[] = [
  { word: "BOBER", image: "bober1.webp", audio: "Bober.mp3" },
  { word: "BOROVNICE", image: "borovnice1.webp", audio: "Borovnice.mp3" },
  { word: "CERKEV", image: "cerkev1.webp", audio: "Cerkev.mp3" },
  { word: "CIRKUS", image: "cirkus1.webp", audio: "Cirkus.mp3" },
  { word: "CISTERNA", image: "cisterna1.webp", audio: "Cisterna.mp3" },
  { word: "ČRKE", image: "crke1.webp", audio: "Crke.mp3" },
  { word: "DREVO", image: "drevo1.webp", audio: "Drevo.mp3" },
  { word: "HRUŠKA", image: "hruska1.webp", audio: "Hruska.mp3" },
  { word: "KLAVIR", image: "klavir1.webp", audio: "Klavir.mp3" },
  { word: "KOŠARA", image: "kosara1.webp", audio: "Kosara.mp3" },
  { word: "KOZAREC", image: "kozarec1.webp", audio: "Kozarec.mp3" },
  { word: "KRAVA", image: "krava1.webp", audio: "Krava.mp3" },
  { word: "KROF", image: "krof1.webp", audio: "Krof.mp3" },
  { word: "KROG", image: "krog1.webp", audio: "Krog.mp3" },
  { word: "KROŽNIK", image: "kroznik1.webp", audio: "Kroznik.mp3" },
  { word: "KRUH", image: "kruh1.webp", audio: "Kruh.mp3" },
  { word: "KUMARA", image: "kumara1.webp", audio: "Kumara.mp3" },
  { word: "LOPAR", image: "lopar1.webp", audio: "Lopar.mp3" },
  { word: "MROŽ", image: "mroz1.webp", audio: "Mroz.mp3" },
  { word: "OBRAZ", image: "obraz1.webp", audio: "Obraz.mp3" },
  { word: "OMARA", image: "omara1.webp", audio: "Omara.mp3" },
  { word: "SIR", image: "sir1.webp", audio: "Sir.mp3" },
  { word: "SMREKA", image: "smreka1.webp", audio: "Smreka.mp3" },
  { word: "ŠKARJE", image: "skarje1.webp", audio: "Skarje.mp3" },
  { word: "ŠOTOR", image: "sotor1.webp", audio: "Sotor.mp3" },
  { word: "ŠTORKLJA", image: "storklja1.webp", audio: "Storklja.mp3" },
  { word: "TORBA", image: "torba1.webp", audio: "Torba.mp3" },
  { word: "TROBENTA", image: "trobenta1.webp", audio: "Trobenta.mp3" },
  { word: "URA", image: "ura1.webp", audio: "Ura.mp3" },
  { word: "VETRNICA", image: "veternica1.webp", audio: "Vetrnica.mp3" },
  { word: "ZEBRA", image: "zebra1.webp", audio: "Zebra.mp3" },
  { word: "ZOBOTREBEC", image: "zobotrebec1.webp", audio: "Zobotrebec.mp3" },
  { word: "ŽARNICA", image: "zarnica1.webp", audio: "Zarnica.mp3" },
  { word: "ŽERJAV", image: "zerjav1.webp", audio: "Zerjav.mp3" },
  { word: "ŽIRAFA", image: "zirafa1.webp", audio: "Zirafa.mp3" },
];

// R začetne vaje - wheel data (18 words with consonant clusters)
const wordsDataRZacetek: WordData[] = [
  { word: "DREVO", image: "drevo1.webp", audio: "Drevo.mp3" },
  { word: "TROBENTA", image: "trobenta1.webp", audio: "Trobenta.mp3" },
  { word: "TRI", image: "tri1.webp", audio: "Tri.mp3" },
  { word: "TRIKOTNIK", image: "trikotnik1.webp", audio: "Trikotnik.mp3" },
  { word: "TRAVA", image: "trava1.webp", audio: "Trava.mp3" },
  { word: "TRAK", image: "trak1.webp", audio: "Trak.mp3" },
  { word: "BRISAČA", image: "brisaca1.webp", audio: "Brisaca.mp3" },
  { word: "BRIKETI", image: "briketi1.webp", audio: "Briketi.mp3" },
  { word: "BRESKEV", image: "breskev1.webp", audio: "Breskev.mp3" },
  { word: "BRADA", image: "brada1.webp", audio: "Brada.mp3" },
  { word: "BROKOLI", image: "brokoli1.webp", audio: "Brokoli.mp3" },
  { word: "BRUSNICE", image: "brusnice1.webp", audio: "Brusnice.mp3" },
  { word: "BREZA", image: "breza1.webp", audio: "Breza.mp3" },
  { word: "DRES", image: "dres1.webp", audio: "Dres.mp3" },
  { word: "DRAGULJ", image: "dragulj1.webp", audio: "Dragulj.mp3" },
  { word: "DRON", image: "dron1.webp", audio: "Dron.mp3" },
  { word: "PRINC", image: "princ1.webp", audio: "Princ.mp3" },
  { word: "PRESTA", image: "presta1.webp", audio: "Presta.mp3" },
];

// R začetne vaje - bingo data (same 18 words)
const bingoDataRZacetek: BingoWordData[] = [
  { word: "DREVO", image: "drevo1.webp", audio: "Drevo.mp3" },
  { word: "TROBENTA", image: "trobenta1.webp", audio: "Trobenta.mp3" },
  { word: "TRI", image: "tri1.webp", audio: "Tri.mp3" },
  { word: "TRIKOTNIK", image: "trikotnik1.webp", audio: "Trikotnik.mp3" },
  { word: "TRAVA", image: "trava1.webp", audio: "Trava.mp3" },
  { word: "TRAK", image: "trak1.webp", audio: "Trak.mp3" },
  { word: "BRISAČA", image: "brisaca1.webp", audio: "Brisaca.mp3" },
  { word: "BRIKETI", image: "briketi1.webp", audio: "Briketi.mp3" },
  { word: "BRESKEV", image: "breskev1.webp", audio: "Breskev.mp3" },
  { word: "BRADA", image: "brada1.webp", audio: "Brada.mp3" },
  { word: "BROKOLI", image: "brokoli1.webp", audio: "Brokoli.mp3" },
  { word: "BRUSNICE", image: "brusnice1.webp", audio: "Brusnice.mp3" },
  { word: "BREZA", image: "breza1.webp", audio: "Breza.mp3" },
  { word: "DRES", image: "dres1.webp", audio: "Dres.mp3" },
  { word: "DRAGULJ", image: "dragulj1.webp", audio: "Dragulj.mp3" },
  { word: "DRON", image: "dron1.webp", audio: "Dron.mp3" },
  { word: "PRINC", image: "princ1.webp", audio: "Princ.mp3" },
  { word: "PRESTA", image: "presta1.webp", audio: "Presta.mp3" },
];

// Configuration map - URL key -> config
// Uses ASCII digraphs for diacritics: č->ch, š->sh, ž->zh
export const artikulacijaConfigs: Record<string, ArtikulacijaConfig> = {
  // Wheel games (začetek)
  'c': { letter: 'C', displayLetter: 'C', gameType: 'wheel', title: 'KOLO BESED - C', wordsData: wordsDataC },
  'ch': { letter: 'Č', displayLetter: 'Č', gameType: 'wheel', title: 'KOLO BESED - Č', wordsData: wordsDataCH },
  'k': { letter: 'K', displayLetter: 'K', gameType: 'wheel', title: 'KOLO BESED - K', wordsData: wordsDataK },
  'l': { letter: 'L', displayLetter: 'L', gameType: 'wheel', title: 'KOLO BESED - L', wordsData: wordsDataL },
  'r': { letter: 'R', displayLetter: 'R', gameType: 'wheel', title: 'KOLO BESED - R', wordsData: wordsDataR },
  'r-zacetek': { letter: 'R', displayLetter: 'R', gameType: 'wheel', title: 'KOLO BESED - R začetne vaje', wordsData: wordsDataRZacetek },
  's': { letter: 'S', displayLetter: 'S', gameType: 'wheel', title: 'KOLO BESED - S', wordsData: wordsDataS, lipsImage: 'Glas_SZC.png' },
  'sh': { letter: 'Š', displayLetter: 'Š', gameType: 'wheel', title: 'KOLO BESED - Š', wordsData: wordsDataSH },
  'z': { letter: 'Z', displayLetter: 'Z', gameType: 'wheel', title: 'KOLO BESED - Z', wordsData: wordsDataZ },
  'zh': { letter: 'Ž', displayLetter: 'Ž', gameType: 'wheel', title: 'KOLO BESED - Ž', wordsData: wordsDataZH },
  
  // Bingo games (sredina/konec)
  'c-sredina-konec': { letter: 'C', displayLetter: 'C', gameType: 'bingo', title: 'BINGO - C', wordsData: bingoDataCSredinaKonec, exerciseId: 'artikulacija_bingo_c' },
  'ch-sredina-konec': { letter: 'Č', displayLetter: 'Č', gameType: 'bingo', title: 'BINGO - Č', wordsData: bingoDataCHSredinaKonec, exerciseId: 'artikulacija_bingo_ch' },
  'k-sredina-konec': { letter: 'K', displayLetter: 'K', gameType: 'bingo', title: 'BINGO - K', wordsData: bingoDataKSredinaKonec, exerciseId: 'artikulacija_bingo_k' },
  'l-sredina-konec': { letter: 'L', displayLetter: 'L', gameType: 'bingo', title: 'BINGO - L', wordsData: bingoDataLSredinaKonec, exerciseId: 'artikulacija_bingo_l' },
  'r-sredina-konec': { letter: 'R', displayLetter: 'R', gameType: 'bingo', title: 'BINGO - R', wordsData: bingoDataRSredinaKonec, exerciseId: 'artikulacija_bingo_r' },
  'r-zacetek-bingo': { letter: 'R', displayLetter: 'R', gameType: 'bingo', title: 'BINGO - R začetne vaje', wordsData: bingoDataRZacetek, exerciseId: 'artikulacija_bingo_r_zacetek' },
  's-sredina-konec': { letter: 'S', displayLetter: 'S', gameType: 'bingo', title: 'BINGO - S', wordsData: bingoDataSSredinaKonec, exerciseId: 'artikulacija_bingo_s' },
  'sh-sredina-konec': { letter: 'Š', displayLetter: 'Š', gameType: 'bingo', title: 'BINGO - Š', wordsData: bingoDataSHSredinaKonec, exerciseId: 'artikulacija_bingo_sh' },
  'z-sredina-konec': { letter: 'Z', displayLetter: 'Z', gameType: 'bingo', title: 'BINGO - Z', wordsData: bingoDataZSredinaKonec, exerciseId: 'artikulacija_bingo_z' },
  'zh-sredina-konec': { letter: 'Ž', displayLetter: 'Ž', gameType: 'bingo', title: 'BINGO - Ž', wordsData: bingoDataZHSredinaKonec, exerciseId: 'artikulacija_bingo_zh' },
};

// Helper to convert URL param to config key
export function getConfigKey(urlParam: string): string {
  // Handle legacy URLs with diacritics
  const normalized = urlParam.toLowerCase()
    .replace('č', 'ch')
    .replace('š', 'sh')
    .replace('ž', 'zh');
  return normalized;
}

// Get config by URL param
export function getArtikulacijaConfig(urlParam: string): ArtikulacijaConfig | null {
  const key = getConfigKey(urlParam);
  return artikulacijaConfigs[key] || null;
}

// Get wheel config by letter (for Kolo sreče games under /govorne-igre)
export function getWheelConfig(letter: string): ArtikulacijaConfig | null {
  const key = getConfigKey(letter);
  const config = artikulacijaConfigs[key];
  return config?.gameType === 'wheel' ? config : null;
}

// Get bingo config by letter (for Bingo games under /govorne-igre)
export function getBingoConfig(letter: string): ArtikulacijaConfig | null {
  const key = getConfigKey(letter);
  // Special case: r-zacetek uses dedicated bingo key
  if (key === 'r-zacetek') {
    const config = artikulacijaConfigs['r-zacetek-bingo'];
    return config?.gameType === 'bingo' ? config : null;
  }
  // For bingo, the key needs '-sredina-konec' suffix
  const bingoKey = `${key}-sredina-konec`;
  const config = artikulacijaConfigs[bingoKey];
  return config?.gameType === 'bingo' ? config : null;
}

// Get all wheel configurations for letter selection page
export function getAllWheelConfigs(): { key: string; config: ArtikulacijaConfig }[] {
  return Object.entries(artikulacijaConfigs)
    .filter(([_, config]) => config.gameType === 'wheel')
    .map(([key, config]) => ({ key, config }));
}

// Get all bingo configurations for letter selection page
export function getAllBingoConfigs(): { key: string; config: ArtikulacijaConfig }[] {
  return Object.entries(artikulacijaConfigs)
    .filter(([_, config]) => config.gameType === 'bingo')
    .map(([key, config]) => ({ key, config }));
}
