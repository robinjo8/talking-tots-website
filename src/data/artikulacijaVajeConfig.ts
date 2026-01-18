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
  { word: "CEDILO", image: "cedilo.png", audio: "cedilo.m4a" },
  { word: "CEKIN", image: "cekin.png", audio: "cekin.m4a" },
  { word: "CERKEV", image: "cerkev.png", audio: "cerkev.m4a" },
  { word: "CESTA", image: "cesta.png", audio: "cesta.m4a" },
  { word: "CEV", image: "cev.png", audio: "cev.m4a" },
  { word: "CIRKUS", image: "cirkus.png", audio: "cirkus.m4a" },
  { word: "CISTERNA", image: "cisterna.png", audio: "cisterna.m4a" },
  { word: "COKLA", image: "cokla.png", audio: "cokla.m4a" },
  { word: "COPAT", image: "copat.png", audio: "copat.m4a" },
  { word: "CVET", image: "cvet.png", audio: "cvet.m4a" }
];

const wordsDataCH: WordData[] = [
  { word: "ČAJ", image: "caj.png", audio: "caj.m4a" },
  { word: "ČASOPIS", image: "casopis.png", audio: "casopis.m4a" },
  { word: "ČEBELA", image: "cebela.png", audio: "cebela.m4a" },
  { word: "ČEBULA", image: "cebula.png", audio: "cebula.m4a" },
  { word: "ČESEN", image: "cesen.png", audio: "cesen.m4a" },
  { word: "ČEVLJI", image: "cevlji.png", audio: "cevlji.m4a" },
  { word: "ČOKOLADA", image: "cokolada.png", audio: "cokolada.m4a" },
  { word: "ČOLN", image: "coln.png", audio: "coln.m4a" },
  { word: "ČOPIČ", image: "copic.png", audio: "copic.m4a" },
  { word: "ČRKE", image: "crke.png", audio: "crke.m4a" }
];

const wordsDataK: WordData[] = [
  { word: "KAČA", image: "kaca.png", audio: "kaca.m4a" },
  { word: "KAPA", image: "kapa.png", audio: "kapa.m4a" },
  { word: "KAVA", image: "kava.png", audio: "kava.m4a" },
  { word: "KLAVIR", image: "klavir.png", audio: "klavir.m4a" },
  { word: "KLJUČ", image: "kljuc.png", audio: "kljuc.m4a" },
  { word: "KLOP", image: "klop.png", audio: "klop.m4a" },
  { word: "KNJIGA", image: "knjiga.png", audio: "knjiga.m4a" },
  { word: "KOCKA", image: "kocka.png", audio: "kocka.m4a" },
  { word: "KOKOS", image: "kokos.png", audio: "kokos.m4a" },
  { word: "KOKOŠ", image: "kokos.png", audio: "kokos.m4a" },
  { word: "KOLAČ", image: "kolac.png", audio: "kolac.m4a" },
  { word: "KOLO", image: "kolo.png", audio: "kolo.m4a" },
  { word: "KOŠ", image: "kos.png", audio: "kos.m4a" },
  { word: "KOST", image: "kost.png", audio: "kost.m4a" },
  { word: "KOŠARA", image: "kosara.png", audio: "kosara.m4a" },
  { word: "KOZA", image: "koza.png", audio: "koza.m4a" },
  { word: "KOZAREC", image: "kozarec.png", audio: "kozarec.m4a" },
  { word: "KRAVA", image: "krava.png", audio: "krava.m4a" },
  { word: "KROF", image: "krof.png", audio: "krof.m4a" },
  { word: "KROG", image: "krog.png", audio: "krog.m4a" },
  { word: "KROŽNIK", image: "kroznik.png", audio: "kroznik.m4a" },
  { word: "KRUH", image: "kruh.png", audio: "kruh.m4a" },
  { word: "KUMARA", image: "kumara.png", audio: "kumara.m4a" },
  { word: "KUŽA", image: "kuza.png", audio: "kuza.m4a" }
];

const wordsDataL: WordData[] = [
  { word: "LADJA", image: "ladja.png", audio: "ladja.m4a" },
  { word: "LED", image: "led.png", audio: "led.m4a" },
  { word: "LETALO", image: "letalo.png", audio: "letalo.m4a" },
  { word: "LEV", image: "lev.png", audio: "lev.m4a" },
  { word: "LIST", image: "list.png", audio: "list.m4a" },
  { word: "LIZIKA", image: "lizika.png", audio: "lizika.m4a" },
  { word: "LONEC", image: "lonec.png", audio: "lonec.m4a" },
  { word: "LOPAR", image: "lopar.png", audio: "lopar.m4a" },
  { word: "LUBENICA", image: "lubenica.png", audio: "lubenica.m4a" },
  { word: "LUČ", image: "luc.png", audio: "luc.m4a" }
];

const wordsDataR: WordData[] = [
  { word: "RACA", image: "raca.png", audio: "raca.m4a" },
  { word: "RAK", image: "rak.png", audio: "rak.m4a" },
  { word: "RAKETA", image: "raketa.png", audio: "raketa.m4a" },
  { word: "RAVNILO", image: "ravnilo.png", audio: "ravnilo.m4a" },
  { word: "REP", image: "rep.png", audio: "rep.m4a" },
  { word: "REPA", image: "repa.png", audio: "repa.m4a" },
  { word: "RIBA", image: "riba.png", audio: "riba.m4a" },
  { word: "ROBOT", image: "robot.png", audio: "robot.m4a" },
  { word: "ROKA", image: "roka.png", audio: "roka.m4a" },
  { word: "ROLKA", image: "rolka.png", audio: "rolka.m4a" },
  { word: "ROPOTULJICA", image: "ropotuljica.png", audio: "ropotuljica.m4a" },
  { word: "ROŽA", image: "roza.png", audio: "roza.m4a" }
];

const wordsDataS: WordData[] = [
  { word: "SEDEM", image: "sedem.png", audio: "sedem.m4a" },
  { word: "SIR", image: "sir.png", audio: "sir.m4a" },
  { word: "SLADOLED", image: "sladoled.png", audio: "sladoled.m4a" },
  { word: "SLIKA", image: "slika.png", audio: "slika.m4a" },
  { word: "SLON", image: "slon.png", audio: "slon.m4a" },
  { word: "SLUZ", image: "sluz.png", audio: "sluz.m4a" },
  { word: "SMREKA", image: "smreka.png", audio: "smreka.m4a" },
  { word: "SNEG", image: "sneg.png", audio: "sneg.m4a" },
  { word: "SNEŽAK", image: "snezak.png", audio: "snezak.m4a" },
  { word: "SOK", image: "sok.png", audio: "sok.m4a" },
  { word: "SONCE", image: "sonce.png", audio: "sonce.m4a" },
  { word: "SOVA", image: "sova.png", audio: "sova.m4a" },
  { word: "STOL", image: "stol.png", audio: "stol.m4a" },
  { word: "SVETILKA", image: "svetilka.png", audio: "svetilka.m4a" },
  { word: "SVINČNIK", image: "svincnik.png", audio: "svincnik.m4a" }
];

const wordsDataSH: WordData[] = [
  { word: "ŠAH", image: "sah.png", audio: "sah.m4a" },
  { word: "ŠAL", image: "sal.png", audio: "sal.m4a" },
  { word: "ŠČETKA", image: "scetka.png", audio: "scetka.m4a" },
  { word: "ŠKARJE", image: "skarje.png", audio: "skarje.m4a" },
  { word: "ŠKATLA", image: "skatla.png", audio: "skatla.m4a" },
  { word: "ŠKOLJKA", image: "skoljka.png", audio: "skoljka.m4a" },
  { word: "ŠOPEK", image: "sopek.png", audio: "sopek.m4a" },
  { word: "ŠOTOR", image: "sotor.png", audio: "sotor.m4a" },
  { word: "ŠTAMPILJKA", image: "stampiljka.png", audio: "stampiljka.m4a" },
  { word: "ŠTORKLJA", image: "storklja.png", audio: "storklja.m4a" }
];

const wordsDataZ: WordData[] = [
  { word: "ZAJEC", image: "zajec.png", audio: "zajec.m4a" },
  { word: "ZASLON", image: "zaslon.png", audio: "zaslon.m4a" },
  { word: "ZAVESA", image: "zavesa.png", audio: "zavesa.m4a" },
  { word: "ZEBRA", image: "zebra.png", audio: "zebra.m4a" },
  { word: "ZLATO", image: "zlato.png", audio: "zlato.m4a" },
  { word: "ZMAJ", image: "zmaj.png", audio: "zmaj.m4a" },
  { word: "ZOB", image: "zob.png", audio: "zob.m4a" },
  { word: "ZOBOTREBEC", image: "zobotrebec.png", audio: "zobotrebec.m4a" },
  { word: "ZVEZEK", image: "zvezek.png", audio: "zvezek.m4a" },
  { word: "ZVEZDA", image: "zvezda.png", audio: "zvezda.m4a" },
  { word: "ZVOČNIK", image: "zvocnik.png", audio: "zvocnik.m4a" }
];

const wordsDataZH: WordData[] = [
  { word: "ŽABA", image: "zaba.png", audio: "zaba.m4a" },
  { word: "ŽAGA", image: "zaga.png", audio: "zaga.m4a" },
  { word: "ŽARNICA", image: "zarnica.png", audio: "zarnica.m4a" },
  { word: "ŽEBELJ", image: "zebelj.png", audio: "zebelj.m4a" },
  { word: "ŽELVA", image: "zelva.png", audio: "zelva.m4a" },
  { word: "ŽERJAV", image: "zerjav.png", audio: "zerjav.m4a" },
  { word: "ŽIRAFA", image: "zirafa.png", audio: "zirafa.m4a" },
  { word: "ŽLICA", image: "zlica.png", audio: "zlica.m4a" },
  { word: "ŽOGA", image: "zoga.png", audio: "zoga.m4a" },
  { word: "ŽOLNA", image: "zolna.png", audio: "zolna.m4a" }
];

// Bingo game word data (sredina/konec - middle/end position)
const bingoDataCSredinaKonec: BingoWordData[] = [
  { word: "BOROVNICE", image: "borovnice.png", audio: "borovnice.m4a" },
  { word: "KOCKA", image: "kocka.png", audio: "kocka.m4a" },
  { word: "KOZAREC", image: "kozarec.png", audio: "kozarec.m4a" },
  { word: "LONEC", image: "lonec.png", audio: "lonec.m4a" },
  { word: "LUBENICA", image: "lubenica.png", audio: "lubenica.m4a" },
  { word: "NOGAVICE", image: "nogavice.png", audio: "nogavice.m4a" },
  { word: "PICA", image: "pica.png", audio: "pica.m4a" },
  { word: "RACA", image: "raca.png", audio: "raca.m4a" },
  { word: "ROPOTULJICA", image: "ropotuljica.png", audio: "ropotuljica.m4a" },
  { word: "SONCE", image: "sonce.png", audio: "sonce.m4a" },
  { word: "VETRNICA", image: "veternica.png", audio: "veternica.m4a" },
  { word: "VILICA", image: "vilica.png", audio: "vilica.m4a" },
  { word: "ZAJEC", image: "zajec.png", audio: "zajec.m4a" },
  { word: "ZOBOTREBEC", image: "zobotrebec.png", audio: "zobotrebec.m4a" },
  { word: "ŽARNICA", image: "zarnica.png", audio: "zarnica.m4a" },
  { word: "ŽLICA", image: "zlica.png", audio: "zlica.m4a" }
];

const bingoDataCHSredinaKonec: BingoWordData[] = [
  { word: "HLAČE", image: "hlace.png", audio: "hlace.m4a" },
  { word: "KAČA", image: "kaca.png", audio: "kaca.m4a" },
  { word: "KLJUČ", image: "kljuc.png", audio: "kljuc.m4a" },
  { word: "KOLAČ", image: "kolac.png", audio: "kolac.m4a" },
  { word: "LUČ", image: "luc.png", audio: "luc.m4a" },
  { word: "OČALA", image: "ocala.png", audio: "ocala.m4a" },
  { word: "OČI", image: "oci.png", audio: "oci.m4a" },
  { word: "SVINČNIK", image: "svincnik.png", audio: "svincnik.m4a" },
  { word: "ŠČETKA", image: "scetka.png", audio: "scetka.m4a" },
  { word: "ZVOČNIK", image: "zvocnik.png", audio: "zvocnik.m4a" },
  { word: "ČOPIČ", image: "copic.png", audio: "copic.m4a" },
  { word: "NOČ", image: "noc.png", audio: "noc.m4a" },
  { word: "OBROČ", image: "obroc.png", audio: "obroc.m4a" },
  { word: "PEČ", image: "pec.png", audio: "pec.m4a" },
  { word: "PTIČ", image: "ptic.png", audio: "ptic.m4a" },
  { word: "RIBIČ", image: "ribic.png", audio: "ribic.m4a" }
];

const bingoDataKSredinaKonec: BingoWordData[] = [
  { word: "AVOKADO", image: "avokado.png", audio: "avokado.m4a" },
  { word: "BIK", image: "bik.png", audio: "bik.m4a" },
  { word: "CEKIN", image: "cekin.png", audio: "cekin.m4a" },
  { word: "CERKEV", image: "cerkev.png", audio: "cerkev.m4a" },
  { word: "CIRKUS", image: "cirkus.png", audio: "cirkus.m4a" },
  { word: "ČOKLA", image: "cokla.png", audio: "cokla.m4a" },
  { word: "ČOKOLADA", image: "cokolada.png", audio: "cokolada.m4a" },
  { word: "ČRKE", image: "crke.png", audio: "crke.m4a" },
  { word: "DEŽEVNIK", image: "dezevnik.png", audio: "dezevnik.m4a" },
  { word: "DEŽNIK", image: "deznik.png", audio: "deznik.m4a" },
  { word: "HRUŠKA", image: "hruska.png", audio: "hruska.m4a" },
  { word: "JABOLKO", image: "jabolko.png", audio: "jabolko.m4a" },
  { word: "JEZIK", image: "jezik.png", audio: "jezik.m4a" },
  { word: "KOKOS", image: "kokos.png", audio: "kokos.m4a" },
  { word: "LIZIKA", image: "lizika.png", audio: "lizika.m4a" },
  { word: "OBLAK", image: "oblak.png", audio: "oblak.m4a" }
];

const bingoDataLSredinaKonec: BingoWordData[] = [
  { word: "ALBUM", image: "album.png", audio: "album.m4a" },
  { word: "ANGEL", image: "angel.png", audio: "angel.m4a" },
  { word: "BALON", image: "balon.png", audio: "balon.m4a" },
  { word: "CEDILO", image: "cedilo.png", audio: "cedilo.m4a" },
  { word: "ČOKLA", image: "cokla.png", audio: "cokla.m4a" },
  { word: "ČEBELA", image: "cebela.png", audio: "cebela.m4a" },
  { word: "ČEBULA", image: "cebula.png", audio: "cebula.m4a" },
  { word: "ČEVLJI", image: "cevlji.png", audio: "cevlji.m4a" },
  { word: "ČOKOLADA", image: "cokolada.png", audio: "cokolada.m4a" },
  { word: "GOL", image: "gol.png", audio: "gol.m4a" },
  { word: "HLAČE", image: "hlace.png", audio: "hlace.m4a" },
  { word: "KLAVIR", image: "klavir.png", audio: "klavir.m4a" },
  { word: "KLJUČ", image: "kljuc.png", audio: "kljuc.m4a" },
  { word: "KLOP", image: "klop.png", audio: "klop.m4a" },
  { word: "KOLAČ", image: "kolac.png", audio: "kolac.m4a" },
  { word: "KOLO", image: "kolo.png", audio: "kolo.m4a" }
];

const bingoDataRSredinaKonec: BingoWordData[] = [
  { word: "CERKEV", image: "cerkev.png", audio: "cerkev.m4a" },
  { word: "CIRKUS", image: "cirkus.png", audio: "cirkus.m4a" },
  { word: "CISTERNA", image: "cisterna.png", audio: "cisterna.m4a" },
  { word: "ČRKE", image: "crke.png", audio: "crke.m4a" },
  { word: "DREVO", image: "drevo.png", audio: null },
  { word: "HRUŠKA", image: "hruska.png", audio: null },
  { word: "KLAVIR", image: "klavir.png", audio: "klavir.m4a" },
  { word: "KOŠARA", image: "kosara.png", audio: "kosara.m4a" },
  { word: "KRAVA", image: "krava.png", audio: "krava.m4a" },
  { word: "KROF", image: "krof.png", audio: "krof.m4a" },
  { word: "KROG", image: "krog.png", audio: "krog.m4a" },
  { word: "KRUH", image: "kruh.png", audio: "kruh.m4a" },
  { word: "KUMARA", image: "kumara.png", audio: "kumara.m4a" },
  { word: "LOPAR", image: "lopar.png", audio: "lopar.m4a" },
  { word: "OBRAZ", image: "obraz.png", audio: null },
  { word: "OMARA", image: "omara.png", audio: null }
];

const bingoDataSSredinaKonec: BingoWordData[] = [
  { word: "CESTA", image: "cesta.png", audio: "cesta.m4a" },
  { word: "CIRKUS", image: "cirkus.png", audio: "cirkus.m4a" },
  { word: "CISTERNA", image: "cisterna.png", audio: "cisterna.m4a" },
  { word: "ČASOPIS", image: "casopis.png", audio: "casopis.m4a" },
  { word: "ČESEN", image: "cesen.png", audio: "cesen.m4a" },
  { word: "KOKOS", image: "kokos.png", audio: "kokos.m4a" },
  { word: "KOST", image: "kost.png", audio: "kost.m4a" },
  { word: "LIST", image: "list.png", audio: "list.m4a" },
  { word: "NOS", image: "nos.png", audio: "nos.m4a" },
  { word: "OSA", image: "osa.png", audio: "osa.m4a" },
  { word: "PAS", image: "pas.png", audio: "pas.m4a" },
  { word: "PES", image: "pes.png", audio: "pes.m4a" },
  { word: "ZASLON", image: "zaslon.png", audio: "zaslon.m4a" },
  { word: "ZAVESA", image: "zavesa.png", audio: "zavesa.m4a" },
  { word: "LASJE", image: "lasje.png", audio: "lasje.m4a" },
  { word: "RIS", image: "ris.png", audio: "ris.m4a" }
];

const bingoDataSHSredinaKonec: BingoWordData[] = [
  { word: "HIŠA", image: "hisa.png", audio: "hisa.m4a" },
  { word: "HRUŠKA", image: "hruska.png", audio: "hruska.m4a" },
  { word: "KOKOŠ", image: "kokos.png", audio: "kokos.m4a" },
  { word: "KOŠ", image: "kos.png", audio: "kos.m4a" },
  { word: "KOŠARA", image: "kosara.png", audio: "kosara.m4a" },
  { word: "MIŠ", image: "mis.png", audio: "mis.m4a" },
  { word: "PIŠKOT", image: "piskot.png", audio: "piskot.m4a" },
  { word: "POŠTA", image: "posta.png", audio: "posta.m4a" },
  { word: "TUŠ", image: "tus.png", audio: "tus.m4a" },
  { word: "LEŠNIK", image: "lesnik.png", audio: "lesnik.m4a" },
  { word: "MUŠNICA", image: "musnica.png", audio: "musnica.m4a" },
  { word: "NOGOMETAŠ", image: "nogometas.png", audio: "nogometas.m4a" },
  { word: "OBEŠALNIK", image: "obesalnik.png", audio: "obesalnik.m4a" },
  { word: "PAŠTETA", image: "pasteta.png", audio: "pasteta.m4a" },
  { word: "ROKOMETAŠ", image: "rokometas.png", audio: "rokometas.m4a" },
  { word: "VIŠNJA", image: "visnja.png", audio: "visnja.m4a" }
];

const bingoDataZSredinaKonec: BingoWordData[] = [
  { word: "JEZIK", image: "jezik.png", audio: "jezik.m4a" },
  { word: "KOZA", image: "koza.png", audio: "koza.m4a" },
  { word: "KOZAREC", image: "kozarec.png", audio: "kozarec.m4a" },
  { word: "LIZIKA", image: "lizika.png", audio: "lizika.m4a" },
  { word: "MEDUZA", image: "meduza.png", audio: "meduza.m4a" },
  { word: "MIZA", image: "miza.png", audio: "miza.m4a" },
  { word: "SLUZ", image: "sluz.png", audio: "sluz.m4a" },
  { word: "VAZA", image: "vaza.png", audio: "vaza.m4a" },
  { word: "ZVEZEK", image: "zvezek.png", audio: "zvezek.m4a" },
  { word: "ZVEZDA", image: "zvezda.png", audio: "zvezda.m4a" },
  { word: "DINOZAVER", image: "dinozaver.png", audio: "dinozaver.m4a" },
  { word: "GNEZDO", image: "gnezdo.png", audio: "gnezdo.m4a" },
  { word: "GROZDJE", image: "grozdje.png", audio: "grozdje.m4a" },
  { word: "KORUZA", image: "koruza.png", audio: "koruza.m4a" },
  { word: "TELEVIZIJA", image: "televizija.png", audio: "televizija.m4a" },
  { word: "VEZALKE", image: "vezalke.png", audio: "vezalke.m4a" }
];

const bingoDataZHSredinaKonec: BingoWordData[] = [
  { word: "DEŽEVNIK", image: "dezevnik.png", audio: "dezevnik.m4a" },
  { word: "DEŽNIK", image: "deznik.png", audio: "deznik.m4a" },
  { word: "FIŽOL", image: "fizol.png", audio: "fizol.m4a" },
  { word: "KROŽNIK", image: "kroznik.png", audio: "kroznik.m4a" },
  { word: "KUŽA", image: "kuza.png", audio: "kuza.m4a" },
  { word: "ROŽA", image: "roza.png", audio: "roza.m4a" },
  { word: "SNEŽAK", image: "snezak.png", audio: "snezak.m4a" },
  { word: "GARAŽA", image: "garaza.png", audio: "garaza.m4a" },
  { word: "KOŽA", image: "koza.png", audio: "koza.m4a" },
  { word: "LUŽA", image: "luza.png", audio: "luza.m4a" },
  { word: "MOŽGANI", image: "mozgani.png", audio: "mozgani.m4a" },
  { word: "MREŽA", image: "mreza.png", audio: "mreza.m4a" },
  { word: "PARADIŽNIK", image: "paradiznik.png", audio: "paradiznik.m4a" },
  { word: "POŽAR", image: "pozar.png", audio: "pozar.m4a" },
  { word: "SNEŽINKA", image: "snezinka.png", audio: "snezinka.m4a" },
  { word: "VERIŽICA", image: "verizica.png", audio: "verizica.m4a" }
];

// Configuration map - URL key -> config
// Uses ASCII digraphs for diacritics: č->ch, š->sh, ž->zh
export const artikulacijaConfigs: Record<string, ArtikulacijaConfig> = {
  // Wheel games (začetek)
  'c': { letter: 'C', displayLetter: 'C', gameType: 'wheel', title: 'KOLO SREČE - C', wordsData: wordsDataC },
  'ch': { letter: 'Č', displayLetter: 'Č', gameType: 'wheel', title: 'KOLO SREČE - Č', wordsData: wordsDataCH },
  'k': { letter: 'K', displayLetter: 'K', gameType: 'wheel', title: 'KOLO SREČE - K', wordsData: wordsDataK },
  'l': { letter: 'L', displayLetter: 'L', gameType: 'wheel', title: 'KOLO SREČE - L', wordsData: wordsDataL },
  'r': { letter: 'R', displayLetter: 'R', gameType: 'wheel', title: 'KOLO SREČE - R', wordsData: wordsDataR },
  's': { letter: 'S', displayLetter: 'S', gameType: 'wheel', title: 'KOLO SREČE - S', wordsData: wordsDataS },
  'sh': { letter: 'Š', displayLetter: 'Š', gameType: 'wheel', title: 'KOLO SREČE - Š', wordsData: wordsDataSH },
  'z': { letter: 'Z', displayLetter: 'Z', gameType: 'wheel', title: 'KOLO SREČE - Z', wordsData: wordsDataZ },
  'zh': { letter: 'Ž', displayLetter: 'Ž', gameType: 'wheel', title: 'KOLO SREČE - Ž', wordsData: wordsDataZH },
  
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
