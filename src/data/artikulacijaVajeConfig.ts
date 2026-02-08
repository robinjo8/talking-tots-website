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
}

// Wheel game word data (začetek - beginning position)
const wordsDataC: WordData[] = [
  { word: "CEDILO", image: "cedilo1.webp", audio: "cedilo.m4a" },
  { word: "CEKIN", image: "cekin1.webp", audio: "cekin.m4a" },
  { word: "CERKEV", image: "cerkev1.webp", audio: "cerkev.m4a" },
  { word: "CESTA", image: "cesta1.webp", audio: "cesta.m4a" },
  { word: "CEV", image: "cev1.webp", audio: "cev.m4a" },
  { word: "CIRKUS", image: "cirkus1.webp", audio: "cirkus.m4a" },
  { word: "CISTERNA", image: "cisterna1.webp", audio: "cisterna.m4a" },
  { word: "COKLA", image: "cokla1.webp", audio: "cokla.m4a" },
  { word: "COPAT", image: "copat1.webp", audio: "copat.m4a" },
  { word: "CVET", image: "cvet1.webp", audio: "cvet.m4a" }
];

const wordsDataCH: WordData[] = [
  { word: "ČAJ", image: "caj1.webp", audio: "caj.m4a" },
  { word: "ČASOPIS", image: "casopis1.webp", audio: "casopis.m4a" },
  { word: "ČEBELA", image: "cebela1.webp", audio: "cebela.m4a" },
  { word: "ČEBULA", image: "cebula1.webp", audio: "cebula.m4a" },
  { word: "ČESEN", image: "cesen1.webp", audio: "cesen.m4a" },
  { word: "ČEVLJI", image: "cevlji1.webp", audio: "cevlji.m4a" },
  { word: "ČOKOLADA", image: "cokolada1.webp", audio: "cokolada.m4a" },
  { word: "ČOLN", image: "coln1.webp", audio: "coln.m4a" },
  { word: "ČOPIČ", image: "copic1.webp", audio: "copic.m4a" },
  { word: "ČRKE", image: "crke1.webp", audio: "crke.m4a" }
];

const wordsDataK: WordData[] = [
  { word: "KAČA", image: "kaca1.webp", audio: "kaca.m4a" },
  { word: "KAPA", image: "kapa1.webp", audio: "kapa.m4a" },
  { word: "KAVA", image: "kava1.webp", audio: "kava.m4a" },
  { word: "KLAVIR", image: "klavir1.webp", audio: "klavir.m4a" },
  { word: "KLJUČ", image: "kljuc1.webp", audio: "kljuc.m4a" },
  { word: "KLOP", image: "klop1.webp", audio: "klop.m4a" },
  { word: "KNJIGA", image: "knjiga1.webp", audio: "knjiga.m4a" },
  { word: "KOCKA", image: "kocka1.webp", audio: "kocka.m4a" },
  { word: "KOKOS", image: "kokos1.webp", audio: "kokos.m4a" },
  { word: "KOKOŠ", image: "kokos1.webp", audio: "kokos.m4a" },
  { word: "KOLAČ", image: "kolac1.webp", audio: "kolac.m4a" },
  { word: "KOLO", image: "kolo1.webp", audio: "kolo.m4a" },
  { word: "KOŠ", image: "kos1.webp", audio: "kos.m4a" },
  { word: "KOST", image: "kost1.webp", audio: "kost.m4a" },
  { word: "KOŠARA", image: "kosara1.webp", audio: "kosara.m4a" },
  { word: "KOZA", image: "koza1.webp", audio: "koza.m4a" },
  { word: "KOZAREC", image: "kozarec1.webp", audio: "kozarec.m4a" },
  { word: "KRAVA", image: "krava1.webp", audio: "krava.m4a" },
  { word: "KROF", image: "krof1.webp", audio: "krof.m4a" },
  { word: "KROG", image: "krog1.webp", audio: "krog.m4a" },
  { word: "KROŽNIK", image: "kroznik1.webp", audio: "kroznik.m4a" },
  { word: "KRUH", image: "kruh1.webp", audio: "kruh.m4a" },
  { word: "KUMARA", image: "kumara1.webp", audio: "kumara.m4a" },
  { word: "KUŽA", image: "kuza1.webp", audio: "kuza.m4a" }
];

const wordsDataL: WordData[] = [
  { word: "LADJA", image: "ladja1.webp", audio: "ladja.m4a" },
  { word: "LED", image: "led1.webp", audio: "led.m4a" },
  { word: "LETALO", image: "letalo1.webp", audio: "letalo.m4a" },
  { word: "LEV", image: "lev1.webp", audio: "lev.m4a" },
  { word: "LIST", image: "list1.webp", audio: "list.m4a" },
  { word: "LIZIKA", image: "lizika1.webp", audio: "lizika.m4a" },
  { word: "LONEC", image: "lonec1.webp", audio: "lonec.m4a" },
  { word: "LOPAR", image: "lopar1.webp", audio: "lopar.m4a" },
  { word: "LUBENICA", image: "lubenica1.webp", audio: "lubenica.m4a" },
  { word: "LUČ", image: "luc1.webp", audio: "luc.m4a" }
];

const wordsDataR: WordData[] = [
  { word: "RACA", image: "raca1.webp", audio: "raca.m4a" },
  { word: "RAK", image: "rak1.webp", audio: "rak.m4a" },
  { word: "RAKETA", image: "raketa1.webp", audio: "raketa.m4a" },
  { word: "RAVNILO", image: "ravnilo1.webp", audio: "ravnilo.m4a" },
  { word: "REP", image: "rep1.webp", audio: "rep.m4a" },
  { word: "REPA", image: "repa1.webp", audio: "repa.m4a" },
  { word: "RIBA", image: "riba1.webp", audio: "riba.m4a" },
  { word: "ROBOT", image: "robot1.webp", audio: "robot.m4a" },
  { word: "ROKA", image: "roka1.webp", audio: "roka.m4a" },
  { word: "ROLKA", image: "rolka1.webp", audio: "rolka.m4a" },
  { word: "ROPOTULJICA", image: "ropotuljica1.webp", audio: "ropotuljica.m4a" },
  { word: "ROŽA", image: "roza1.webp", audio: "roza.m4a" }
];

const wordsDataS: WordData[] = [
  { word: "SEDEM", image: "sedem1.webp", audio: "sedem.m4a" },
  { word: "SIR", image: "sir1.webp", audio: "sir.m4a" },
  { word: "SLADOLED", image: "sladoled1.webp", audio: "sladoled.m4a" },
  { word: "SLIKA", image: "slika1.webp", audio: "slika.m4a" },
  { word: "SLON", image: "slon1.webp", audio: "slon.m4a" },
  { word: "SLUZ", image: "sluz1.webp", audio: "sluz.m4a" },
  { word: "SMREKA", image: "smreka1.webp", audio: "smreka.m4a" },
  { word: "SNEG", image: "sneg1.webp", audio: "sneg.m4a" },
  { word: "SNEŽAK", image: "snezak1.webp", audio: "snezak.m4a" },
  { word: "SOK", image: "sok1.webp", audio: "sok.m4a" },
  { word: "SONCE", image: "sonce1.webp", audio: "sonce.m4a" },
  { word: "SOVA", image: "sova1.webp", audio: "sova.m4a" },
  { word: "STOL", image: "stol1.webp", audio: "stol.m4a" },
  { word: "SVETILKA", image: "svetilka1.webp", audio: "svetilka.m4a" },
  { word: "SVINČNIK", image: "svincnik1.webp", audio: "svincnik.m4a" }
];

const wordsDataSH: WordData[] = [
  { word: "ŠAH", image: "sah1.webp", audio: "sah.m4a" },
  { word: "ŠAL", image: "sal1.webp", audio: "sal.m4a" },
  { word: "ŠČETKA", image: "scetka1.webp", audio: "scetka.m4a" },
  { word: "ŠKARJE", image: "skarje1.webp", audio: "skarje.m4a" },
  { word: "ŠKATLA", image: "skatla1.webp", audio: "skatla.m4a" },
  { word: "ŠKOLJKA", image: "skoljka1.webp", audio: "skoljka.m4a" },
  { word: "ŠOPEK", image: "sopek1.webp", audio: "sopek.m4a" },
  { word: "ŠOTOR", image: "sotor1.webp", audio: "sotor.m4a" },
  { word: "ŠTAMPILJKA", image: "stampiljka1.webp", audio: "stampiljka.m4a" },
  { word: "ŠTORKLJA", image: "storklja1.webp", audio: "storklja.m4a" }
];

const wordsDataZ: WordData[] = [
  { word: "ZAJEC", image: "zajec1.webp", audio: "zajec.m4a" },
  { word: "ZASLON", image: "zaslon1.webp", audio: "zaslon.m4a" },
  { word: "ZAVESA", image: "zavesa1.webp", audio: "zavesa.m4a" },
  { word: "ZEBRA", image: "zebra1.webp", audio: "zebra.m4a" },
  { word: "ZLATO", image: "zlato1.webp", audio: "zlato.m4a" },
  { word: "ZMAJ", image: "zmaj1.webp", audio: "zmaj.m4a" },
  { word: "ZOB", image: "zob1.webp", audio: "zob.m4a" },
  { word: "ZOBOTREBEC", image: "zobotrebec1.webp", audio: "zobotrebec.m4a" },
  { word: "ZVEZEK", image: "zvezek1.webp", audio: "zvezek.m4a" },
  { word: "ZVEZDA", image: "zvezda1.webp", audio: "zvezda.m4a" },
  { word: "ZVOČNIK", image: "zvocnik1.webp", audio: "zvocnik.m4a" }
];

const wordsDataZH: WordData[] = [
  { word: "ŽABA", image: "zaba1.webp", audio: "zaba.m4a" },
  { word: "ŽAGA", image: "zaga1.webp", audio: "zaga.m4a" },
  { word: "ŽARNICA", image: "zarnica1.webp", audio: "zarnica.m4a" },
  { word: "ŽEBELJ", image: "zebelj1.webp", audio: "zebelj.m4a" },
  { word: "ŽELVA", image: "zelva1.webp", audio: "zelva.m4a" },
  { word: "ŽERJAV", image: "zerjav1.webp", audio: "zerjav.m4a" },
  { word: "ŽIRAFA", image: "zirafa1.webp", audio: "zirafa.m4a" },
  { word: "ŽLICA", image: "zlica1.webp", audio: "zlica.m4a" },
  { word: "ŽOGA", image: "zoga1.webp", audio: "zoga.m4a" },
  { word: "ŽOLNA", image: "zolna1.webp", audio: "zolna.m4a" }
];

// Bingo game word data (sredina/konec - middle/end position)
const bingoDataCSredinaKonec: BingoWordData[] = [
  { word: "BOROVNICE", image: "borovnice1.webp", audio: "borovnice.m4a" },
  { word: "KOCKA", image: "kocka1.webp", audio: "kocka.m4a" },
  { word: "KOZAREC", image: "kozarec1.webp", audio: "kozarec.m4a" },
  { word: "LONEC", image: "lonec1.webp", audio: "lonec.m4a" },
  { word: "LUBENICA", image: "lubenica1.webp", audio: "lubenica.m4a" },
  { word: "NOGAVICE", image: "nogavice1.webp", audio: "nogavice.m4a" },
  { word: "PICA", image: "pica1.webp", audio: "pica.m4a" },
  { word: "RACA", image: "raca1.webp", audio: "raca.m4a" },
  { word: "ROPOTULJICA", image: "ropotuljica1.webp", audio: "ropotuljica.m4a" },
  { word: "SONCE", image: "sonce1.webp", audio: "sonce.m4a" },
  { word: "VETRNICA", image: "veternica1.webp", audio: "veternica.m4a" },
  { word: "VILICA", image: "vilica1.webp", audio: "vilica.m4a" },
  { word: "ZAJEC", image: "zajec1.webp", audio: "zajec.m4a" },
  { word: "ZOBOTREBEC", image: "zobotrebec1.webp", audio: "zobotrebec.m4a" },
  { word: "ŽARNICA", image: "zarnica1.webp", audio: "zarnica.m4a" },
  { word: "ŽLICA", image: "zlica1.webp", audio: "zlica.m4a" }
];

const bingoDataCHSredinaKonec: BingoWordData[] = [
  { word: "HLAČE", image: "hlace1.webp", audio: "hlace.m4a" },
  { word: "KAČA", image: "kaca1.webp", audio: "kaca.m4a" },
  { word: "KLJUČ", image: "kljuc1.webp", audio: "kljuc.m4a" },
  { word: "KOLAČ", image: "kolac1.webp", audio: "kolac.m4a" },
  { word: "LUČ", image: "luc1.webp", audio: "luc.m4a" },
  { word: "OČALA", image: "ocala1.webp", audio: "ocala.m4a" },
  { word: "OČI", image: "oci1.webp", audio: "oci.m4a" },
  { word: "SVINČNIK", image: "svincnik1.webp", audio: "svincnik.m4a" },
  { word: "ŠČETKA", image: "scetka1.webp", audio: "scetka.m4a" },
  { word: "ZVOČNIK", image: "zvocnik1.webp", audio: "zvocnik.m4a" },
  { word: "ČOPIČ", image: "copic1.webp", audio: "copic.m4a" },
  { word: "NOČ", image: "noc1.webp", audio: "noc.m4a" },
  { word: "OBROČ", image: "obroc1.webp", audio: "obroc.m4a" },
  { word: "PEČ", image: "pec1.webp", audio: "pec.m4a" },
  { word: "PTIČ", image: "ptic1.webp", audio: "ptic.m4a" },
  { word: "RIBIČ", image: "ribic1.webp", audio: "ribic.m4a" }
];

const bingoDataKSredinaKonec: BingoWordData[] = [
  { word: "AVOKADO", image: "avokado1.webp", audio: "avokado.m4a" },
  { word: "BIK", image: "bik1.webp", audio: "bik.m4a" },
  { word: "CEKIN", image: "cekin1.webp", audio: "cekin.m4a" },
  { word: "CERKEV", image: "cerkev1.webp", audio: "cerkev.m4a" },
  { word: "CIRKUS", image: "cirkus1.webp", audio: "cirkus.m4a" },
  { word: "COKLA", image: "cokla1.webp", audio: "cokla.m4a" },
  { word: "ČOKOLADA", image: "cokolada1.webp", audio: "cokolada.m4a" },
  { word: "ČRKE", image: "crke1.webp", audio: "crke.m4a" },
  { word: "DEŽEVNIK", image: "dezevnik1.webp", audio: "dezevnik.m4a" },
  { word: "DEŽNIK", image: "deznik1.webp", audio: "deznik.m4a" },
  { word: "HRUŠKA", image: "hruska1.webp", audio: "hruska.m4a" },
  { word: "JABOLKO", image: "jabolko1.webp", audio: "jabolko.m4a" },
  { word: "JEZIK", image: "jezik1.webp", audio: "jezik.m4a" },
  { word: "KOKOS", image: "kokos1.webp", audio: "kokos.m4a" },
  { word: "LIZIKA", image: "lizika1.webp", audio: "lizika.m4a" },
  { word: "OBLAK", image: "oblak1.webp", audio: "oblak.m4a" }
];

const bingoDataLSredinaKonec: BingoWordData[] = [
  { word: "ALBUM", image: "album1.webp", audio: "album.m4a" },
  { word: "ANGEL", image: "angel1.webp", audio: "angel.m4a" },
  { word: "BALON", image: "balon1.webp", audio: "balon.m4a" },
  { word: "CEDILO", image: "cedilo1.webp", audio: "cedilo.m4a" },
  { word: "COKLA", image: "cokla1.webp", audio: "cokla.m4a" },
  { word: "ČEBELA", image: "cebela1.webp", audio: "cebela.m4a" },
  { word: "ČEBULA", image: "cebula1.webp", audio: "cebula.m4a" },
  { word: "ČEVLJI", image: "cevlji1.webp", audio: "cevlji.m4a" },
  { word: "ČOKOLADA", image: "cokolada1.webp", audio: "cokolada.m4a" },
  { word: "GOL", image: "gol1.webp", audio: "gol.m4a" },
  { word: "HLAČE", image: "hlace1.webp", audio: "hlace.m4a" },
  { word: "KLAVIR", image: "klavir1.webp", audio: "klavir.m4a" },
  { word: "KLJUČ", image: "kljuc1.webp", audio: "kljuc.m4a" },
  { word: "KLOP", image: "klop1.webp", audio: "klop.m4a" },
  { word: "KOLAČ", image: "kolac1.webp", audio: "kolac.m4a" },
  { word: "KOLO", image: "kolo1.webp", audio: "kolo.m4a" }
];

const bingoDataRSredinaKonec: BingoWordData[] = [
  { word: "CERKEV", image: "cerkev1.webp", audio: "cerkev.m4a" },
  { word: "CIRKUS", image: "cirkus1.webp", audio: "cirkus.m4a" },
  { word: "CISTERNA", image: "cisterna1.webp", audio: "cisterna.m4a" },
  { word: "ČRKE", image: "crke1.webp", audio: "crke.m4a" },
  { word: "DREVO", image: "drevo1.webp", audio: "drevo.m4a" },
  { word: "HRUŠKA", image: "hruska1.webp", audio: "hruska.m4a" },
  { word: "KLAVIR", image: "klavir1.webp", audio: "klavir.m4a" },
  { word: "KOŠARA", image: "kosara1.webp", audio: "kosara.m4a" },
  { word: "KRAVA", image: "krava1.webp", audio: "krava.m4a" },
  { word: "KROF", image: "krof1.webp", audio: "krof.m4a" },
  { word: "KROG", image: "krog1.webp", audio: "krog.m4a" },
  { word: "KRUH", image: "kruh1.webp", audio: "kruh.m4a" },
  { word: "KUMARA", image: "kumara1.webp", audio: "kumara.m4a" },
  { word: "LOPAR", image: "lopar1.webp", audio: "lopar.m4a" },
  { word: "OBRAZ", image: "obraz1.webp", audio: "obraz.m4a" },
  { word: "OMARA", image: "omara1.webp", audio: "omara.m4a" }
];

const bingoDataSSredinaKonec: BingoWordData[] = [
  { word: "CESTA", image: "cesta1.webp", audio: "cesta.m4a" },
  { word: "CIRKUS", image: "cirkus1.webp", audio: "cirkus.m4a" },
  { word: "CISTERNA", image: "cisterna1.webp", audio: "cisterna.m4a" },
  { word: "ČASOPIS", image: "casopis1.webp", audio: "casopis.m4a" },
  { word: "ČESEN", image: "cesen1.webp", audio: "cesen.m4a" },
  { word: "KOKOS", image: "kokos1.webp", audio: "kokos.m4a" },
  { word: "KOST", image: "kost1.webp", audio: "kost.m4a" },
  { word: "LIST", image: "list1.webp", audio: "list.m4a" },
  { word: "NOS", image: "nos1.webp", audio: "nos.m4a" },
  { word: "OSA", image: "osa1.webp", audio: "osa.m4a" },
  { word: "PAS", image: "pas1.webp", audio: "pas.m4a" },
  { word: "PES", image: "pes1.webp", audio: "pes.m4a" },
  { word: "ZASLON", image: "zaslon1.webp", audio: "zaslon.m4a" },
  { word: "ZAVESA", image: "zavesa1.webp", audio: "zavesa.m4a" },
  { word: "LASJE", image: "lasje1.webp", audio: "lasje.m4a" },
  { word: "RIS", image: "ris1.webp", audio: "ris.m4a" }
];

const bingoDataSHSredinaKonec: BingoWordData[] = [
  { word: "HIŠA", image: "hisa1.webp", audio: "hisa.m4a" },
  { word: "HRUŠKA", image: "hruska1.webp", audio: "hruska.m4a" },
  { word: "KOKOŠ", image: "kokos1.webp", audio: "kokos.m4a" },
  { word: "KOŠ", image: "kos1.webp", audio: "kos.m4a" },
  { word: "KOŠARA", image: "kosara1.webp", audio: "kosara.m4a" },
  { word: "MIŠ", image: "mis1.webp", audio: "mis.m4a" },
  { word: "PIŠKOT", image: "piskot1.webp", audio: "piskot.m4a" },
  { word: "POŠTA", image: "posta1.webp", audio: "posta.m4a" },
  { word: "TUŠ", image: "tus1.webp", audio: "tus.m4a" },
  { word: "LEŠNIK", image: "lesnik1.webp", audio: "lesnik.m4a" },
  { word: "MUŠNICA", image: "musnica1.webp", audio: "musnica.m4a" },
  { word: "NOGOMETAŠ", image: "nogometas1.webp", audio: "nogometas.m4a" },
  { word: "OBEŠALNIK", image: "obesalnik1.webp", audio: "obesalnik.m4a" },
  { word: "PAŠTETA", image: "pasteta1.webp", audio: "pasteta.m4a" },
  { word: "ROKOMETAŠ", image: "rokometas1.webp", audio: "rokometas.m4a" },
  { word: "VIŠNJA", image: "visnja1.webp", audio: "visnja.m4a" }
];

const bingoDataZSredinaKonec: BingoWordData[] = [
  { word: "JEZIK", image: "jezik1.webp", audio: "jezik.m4a" },
  { word: "KOZA", image: "koza1.webp", audio: "koza.m4a" },
  { word: "KOZAREC", image: "kozarec1.webp", audio: "kozarec.m4a" },
  { word: "LIZIKA", image: "lizika1.webp", audio: "lizika.m4a" },
  { word: "MEDUZA", image: "meduza1.webp", audio: "meduza.m4a" },
  { word: "MIZA", image: "miza1.webp", audio: "miza.m4a" },
  { word: "SLUZ", image: "sluz1.webp", audio: "sluz.m4a" },
  { word: "VAZA", image: "vaza1.webp", audio: "vaza.m4a" },
  { word: "ZVEZEK", image: "zvezek1.webp", audio: "zvezek.m4a" },
  { word: "ZVEZDA", image: "zvezda1.webp", audio: "zvezda.m4a" },
  { word: "DINOZAVER", image: "dinozaver1.webp", audio: "dinozaver.m4a" },
  { word: "GNEZDO", image: "gnezdo1.webp", audio: "gnezdo.m4a" },
  { word: "GROZDJE", image: "grozdje1.webp", audio: "grozdje.m4a" },
  { word: "KORUZA", image: "koruza1.webp", audio: "koruza.m4a" },
  { word: "TELEVIZIJA", image: "televizija1.webp", audio: "televizija.m4a" },
  { word: "VEZALKE", image: "vezalke1.webp", audio: "vezalke.m4a" }
];

const bingoDataZHSredinaKonec: BingoWordData[] = [
  { word: "DEŽEVNIK", image: "dezevnik1.webp", audio: "dezevnik.m4a" },
  { word: "DEŽNIK", image: "deznik1.webp", audio: "deznik.m4a" },
  { word: "FIŽOL", image: "fizol1.webp", audio: "fizol.m4a" },
  { word: "KROŽNIK", image: "kroznik1.webp", audio: "kroznik.m4a" },
  { word: "KUŽA", image: "kuza1.webp", audio: "kuza.m4a" },
  { word: "ROŽA", image: "roza1.webp", audio: "roza.m4a" },
  { word: "SNEŽAK", image: "snezak1.webp", audio: "snezak.m4a" },
  { word: "GARAŽA", image: "garaza1.webp", audio: "garaza.m4a" },
  { word: "KOŽA", image: "koza_skin1.webp", audio: "koza_skin.m4a" },
  { word: "LUŽA", image: "luza1.webp", audio: "luza.m4a" },
  { word: "MOŽGANI", image: "mozgani1.webp", audio: "mozgani.m4a" },
  { word: "MREŽA", image: "mreza1.webp", audio: "mreza.m4a" },
  { word: "PARADIŽNIK", image: "paradiznik1.webp", audio: "paradiznik.m4a" },
  { word: "POŽAR", image: "pozar1.webp", audio: "pozar.m4a" },
  { word: "SNEŽINKA", image: "snezinka1.webp", audio: "snezinka.m4a" },
  { word: "VERIŽICA", image: "verizica1.webp", audio: "verizica.m4a" }
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
  's': { letter: 'S', displayLetter: 'S', gameType: 'wheel', title: 'KOLO BESED - S', wordsData: wordsDataS },
  'sh': { letter: 'Š', displayLetter: 'Š', gameType: 'wheel', title: 'KOLO BESED - Š', wordsData: wordsDataSH },
  'z': { letter: 'Z', displayLetter: 'Z', gameType: 'wheel', title: 'KOLO BESED - Z', wordsData: wordsDataZ },
  'zh': { letter: 'Ž', displayLetter: 'Ž', gameType: 'wheel', title: 'KOLO BESED - Ž', wordsData: wordsDataZH },
  
  // Bingo games (sredina/konec)
  'c-sredina-konec': { letter: 'C', displayLetter: 'C', gameType: 'bingo', title: 'BINGO - C', wordsData: bingoDataCSredinaKonec, exerciseId: 'artikulacija_bingo_c' },
  'ch-sredina-konec': { letter: 'Č', displayLetter: 'Č', gameType: 'bingo', title: 'BINGO - Č', wordsData: bingoDataCHSredinaKonec, exerciseId: 'artikulacija_bingo_ch' },
  'k-sredina-konec': { letter: 'K', displayLetter: 'K', gameType: 'bingo', title: 'BINGO - K', wordsData: bingoDataKSredinaKonec, exerciseId: 'artikulacija_bingo_k' },
  'l-sredina-konec': { letter: 'L', displayLetter: 'L', gameType: 'bingo', title: 'BINGO - L', wordsData: bingoDataLSredinaKonec, exerciseId: 'artikulacija_bingo_l' },
  'r-sredina-konec': { letter: 'R', displayLetter: 'R', gameType: 'bingo', title: 'BINGO - R', wordsData: bingoDataRSredinaKonec, exerciseId: 'artikulacija_bingo_r' },
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
