export interface KaceLestveWord {
  text: string;
  image: string;
  audio: string;
  acceptedVariants: string[];
}

export type KaceDifficulty = 'nizka' | 'srednja' | 'visoka';
export type KacePlayers = 1 | 2;

// Board dimensions
export const COLS = 6;
export const ROWS = 7;
export const BOARD_SIZE = 42;
export const GOAL_POSITION = 41; // First orange field (win target) — NOT 42 (Cilj image)
export const SQUARES_NEAR_END = 6;
export const MAX_FAILED_NEAR_END = 5;
// Physical position of START (before first green square)
export const START_POSITION = 2;

// Bonus moves for correct pronunciation by difficulty
export const DIFFICULTY_BONUS: Record<KaceDifficulty, number> = {
  nizka: 2,
  srednja: 1,
  visoka: 0,
};

// Ladders: key = foot (physical pos), value = top (physical pos)
// Physical positions: 1-2=start(yellow,unnum), 3-40=green(display 1-38), 41-42=end(orange,unnum)
// Display number = physical - 2  (so physical 3 shows as "1", physical 40 shows as "38")
export const LADDERS: Record<number, number> = {
  3: 11,   // display 1 → 9
  6: 18,   // display 4 → 16
  15: 27,  // display 13 → 25
  26: 38,  // display 24 → 36
  29: 33,  // display 27 → 31
};

// Snakes: key = head (physical pos), value = tail (physical pos)
export const SNAKES: Record<number, number> = {
  40: 34,  // display 38 → 32
  21: 9,   // display 19 → 7
  24: 14,  // display 22 → 12
  31: 19,  // display 29 → 17
};

// Words for sound C (middle/end position)
export const KACE_WORDS_C: KaceLestveWord[] = [
  { text: "BOROVNICE", image: "borovnice1.webp", audio: "Borovnice.mp3", acceptedVariants: ["BOROVNICE", "BOROVNICA", "BORONICA", "BOROVNICE!", "BOROVNIC", "BOROVNCE"] },
  { text: "KOCKA", image: "kocka1.webp", audio: "Kocka.mp3", acceptedVariants: ["KOCKA", "COCKA", "KOTKA", "KOCKE", "KOCKI", "KOCKO", "KOCKA!"] },
  { text: "KOZAREC", image: "kozarec1.webp", audio: "Kozarec.mp3", acceptedVariants: ["KOZAREC", "KOZAREC!", "KOZARCE", "KOZARCI", "KOZARCA"] },
  { text: "LONEC", image: "lonec1.webp", audio: "Lonec.mp3", acceptedVariants: ["LONEC", "LONAC", "LONC", "LONEC!", "LONCA"] },
  { text: "LUBENICA", image: "lubenica1.webp", audio: "Lubenica.mp3", acceptedVariants: ["LUBENICA", "LUBENICE", "LUBENICI", "LUBENICO", "LUBENICA!"] },
  { text: "NOGAVICE", image: "nogavice1.webp", audio: "Nogavice.mp3", acceptedVariants: ["NOGAVICE", "NOGAVICA", "NOGAVICI", "NOGAVICO", "NOGAVICE!"] },
  { text: "PICA", image: "pica1.webp", audio: "Pica.mp3", acceptedVariants: ["PICA", "PITA", "PIZA", "PIZZA", "PICE", "PICI", "PICO", "PICA!"] },
  { text: "RACA", image: "raca1.webp", audio: "Raca.mp3", acceptedVariants: ["RACA", "RACE", "RACI", "RACO", "RACA!"] },
  { text: "ROPOTULJICA", image: "ropotuljica1.webp", audio: "Ropotuljica.mp3", acceptedVariants: ["ROPOTULJICA", "ROPOTULICA", "ROPOTLJICA", "ROPOTULJICE", "ROPOTULJICA!"] },
  { text: "SONCE", image: "sonce1.webp", audio: "Sonce.mp3", acceptedVariants: ["SONCE", "SONCA", "SONCU", "SONCE!", "SUNCE", "SONC"] },
  { text: "VETRNICA", image: "veternica1.webp", audio: "Vetrnica.mp3", acceptedVariants: ["VETRNICA", "VETRNICE", "VETRNICI", "VETRNICO", "VETRNICA!", "VETERNICA"] },
  { text: "VILICE", image: "vilica1.webp", audio: "Vilice.mp3", acceptedVariants: ["VILICE", "VILICA", "VILICI", "VILICO", "VILCE", "VILICE!"] },
  { text: "ZAJEC", image: "zajec1.webp", audio: "Zajec.mp3", acceptedVariants: ["ZAJEC", "ZAJCA", "ZAJCU", "ZAJCI", "ZAJEC!"] },
  { text: "ZOBOTREBEC", image: "zobotrebec1.webp", audio: "Zobotrebec.mp3", acceptedVariants: ["ZOBOTREBEC", "ZOBOTREBCA", "ZOBOTREBEC!", "ZOBOTREBCI"] },
  { text: "ŽARNICA", image: "zarnica1.webp", audio: "Zarnica.mp3", acceptedVariants: ["ZARNICA", "ŽARNICA", "ZARNICE", "ZARNICI", "ZARNICO", "ŽARNICE"] },
  { text: "ŽLICA", image: "zlica1.webp", audio: "Zlica.mp3", acceptedVariants: ["ZLICA", "ŽLICA", "SLICA", "ZLICE", "ZLICI", "ZLICO", "ŽLICE"] },
  { text: "JAJCE", image: "jajce1.webp", audio: "Jajce.mp3", acceptedVariants: ["JAJCE", "JAJCE!", "JAJCA", "JAJCU"] },
];

// Words for sound S (middle/end position)
export const KACE_WORDS_S: KaceLestveWord[] = [
  { text: "CESTA", image: "cesta1.webp", audio: "Cesta.mp3", acceptedVariants: ["CESTA", "CESTO", "CESTE", "CESTI", "CESTA!"] },
  { text: "CIRKUS", image: "cirkus1.webp", audio: "Cirkus.mp3", acceptedVariants: ["CIRKUS", "CIRKUS!", "CIRKUSA", "CIRCUS"] },
  { text: "CISTERNA", image: "cisterna1.webp", audio: "Cisterna.mp3", acceptedVariants: ["CISTERNA", "CISTERNO", "CISTERNE", "CISTERNA!"] },
  { text: "ČASOPIS", image: "casopis1.webp", audio: "Casopis.mp3", acceptedVariants: ["CASOPIS", "ČASOPIS", "ČASOPIS!", "CASOPISA", "ČASOPISA"] },
  { text: "ČESEN", image: "cesen1.webp", audio: "Cesen.mp3", acceptedVariants: ["CESEN", "ČESEN", "ČESNA", "CESNA", "ČESEN!"] },
  { text: "KOKOS", image: "kokos_sadez1.webp", audio: "Kokos_sadez.mp3", acceptedVariants: ["KOKOS", "KOKOS!", "KOKOSA", "KOKOSU"] },
  { text: "KOST", image: "kost1.webp", audio: "Kost.mp3", acceptedVariants: ["KOST", "KOST!", "KOSTI", "KOSTU"] },
  { text: "LIST", image: "list1.webp", audio: "List.mp3", acceptedVariants: ["LIST", "LIST!", "LISTA", "LISTU", "LISTI"] },
  { text: "NOS", image: "nos1.webp", audio: "Nos.mp3", acceptedVariants: ["NOS", "NOS!", "NOSA", "NOSU"] },
  { text: "OSA", image: "osa1.webp", audio: "Osa.mp3", acceptedVariants: ["OSA", "OSA!", "OSO", "OSE", "OSI"] },
  { text: "PAS", image: "pas1.webp", audio: "Pas.mp3", acceptedVariants: ["PAS", "PAS!", "PSA", "PSU", "PSI"] },
  { text: "LOS", image: "los1.webp", audio: "Los.mp3", acceptedVariants: ["LOS", "LOS!", "LOSA", "LOSU"] },
  { text: "ZASLON", image: "zaslon1.webp", audio: "Zaslon.mp3", acceptedVariants: ["ZASLON", "ZASLON!", "ZASLONA", "ZASLONU"] },
  { text: "ZAVESA", image: "zavesa1.webp", audio: "Zavesa.mp3", acceptedVariants: ["ZAVESA", "ZAVESO", "ZAVESE", "ZAVESA!"] },
  { text: "LASJE", image: "lasje1.webp", audio: "Lasje.mp3", acceptedVariants: ["LASJE", "LASJE!", "LAS", "LASI"] },
  { text: "RIS", image: "ris1.webp", audio: "Ris.mp3", acceptedVariants: ["RIS", "RIS!", "RISA", "RISU"] },
  { text: "PES", image: "pes1.webp", audio: "Pes.mp3", acceptedVariants: ["PES", "PES!", "PSA", "PSU"] },
];

// Words for sound Z (middle/end position)
export const KACE_WORDS_Z: KaceLestveWord[] = [
  { text: "JEZIK", image: "jezik1.webp", audio: "Jezik.mp3", acceptedVariants: ["JEZIK", "JEZIK!", "JEZIKA", "JEZIKU"] },
  { text: "KOZA", image: "koza1.webp", audio: "Koza_zival.mp3", acceptedVariants: ["KOZA", "KOZO", "KOZE", "KOZI", "KOZA!"] },
  { text: "KOZAREC", image: "kozarec1.webp", audio: "Kozarec.mp3", acceptedVariants: ["KOZAREC", "KOZAREC!", "KOZARCE", "KOZARCI", "KOZARCA"] },
  { text: "LIZIKA", image: "lizika1.webp", audio: "Lizika.mp3", acceptedVariants: ["LIZIKA", "LIZIKO", "LIZIKE", "LIZIKA!"] },
  { text: "MEDUZA", image: "meduza1.webp", audio: "Meduza.mp3", acceptedVariants: ["MEDUZA", "MEDUZO", "MEDUZE", "MEDUZA!"] },
  { text: "MIZA", image: "miza1.webp", audio: "Miza.mp3", acceptedVariants: ["MIZA", "MIZO", "MIZE", "MIZI", "MIZA!"] },
  { text: "SLUZ", image: "sluz1.webp", audio: "Sluz.mp3", acceptedVariants: ["SLUZ", "SLUZ!", "SLUZI", "SLUZU"] },
  { text: "VAZA", image: "vaza1.webp", audio: "Vaza.mp3", acceptedVariants: ["VAZA", "VAZO", "VAZE", "VAZI", "VAZA!"] },
  { text: "ZVEZEK", image: "zvezek1.webp", audio: "Zvezek.mp3", acceptedVariants: ["ZVEZEK", "ZVEZEK!", "ZVEZKA", "ZVEZKU"] },
  { text: "ZVEZDA", image: "zvezda1.webp", audio: "Zvezda.mp3", acceptedVariants: ["ZVEZDA", "ZVEZDO", "ZVEZDE", "ZVEZDA!"] },
  { text: "DINOZAVER", image: "dinozaver1.webp", audio: "Dinozaver.mp3", acceptedVariants: ["DINOZAVER", "DINOZAVER!", "DINOZAVRA", "DINOZAVRU"] },
  { text: "GNEZDO", image: "gnezdo1.webp", audio: "Gnezdo.mp3", acceptedVariants: ["GNEZDO", "GNEZDO!", "GNEZDA", "GNEZDU"] },
  { text: "GROZDJE", image: "grozdje1.webp", audio: "Grozdje.mp3", acceptedVariants: ["GROZDJE", "GROZDJE!", "GROZDJA", "GROZDJU"] },
  { text: "KORUZA", image: "koruza1.webp", audio: "Koruza.mp3", acceptedVariants: ["KORUZA", "KORUZO", "KORUZE", "KORUZA!"] },
  { text: "TELEVIZIJA", image: "televizija1.webp", audio: "Televizija.mp3", acceptedVariants: ["TELEVIZIJA", "TELEVIZIJO", "TELEVIZIJE", "TELEVIZIJA!"] },
  { text: "VEZALKE", image: "vezalke1.webp", audio: "Vezalke.mp3", acceptedVariants: ["VEZALKE", "VEZALKE!", "VEZALK", "VEZALKA"] },
  { text: "VOZ", image: "voz1.webp", audio: "Voz.mp3", acceptedVariants: ["VOZ", "VOZ!", "VOZA", "VOZU"] },
];

// Words for sound Š (middle/end position)
export const KACE_WORDS_SH: KaceLestveWord[] = [
  { text: "HIŠA", image: "hisa1.webp", audio: "Hisa.mp3", acceptedVariants: ["HISA", "HIŠA", "HISO", "HIŠO", "HIŠE", "HIŠA!"] },
  { text: "HRUŠKA", image: "hruska1.webp", audio: "Hruska.mp3", acceptedVariants: ["HRUSKA", "HRUŠKA", "HRUŠKO", "HRUŠKE", "HRUŠKA!"] },
  { text: "KOKOŠ", image: "kokos1.webp", audio: "Kokos_zival.mp3", acceptedVariants: ["KOKOS", "KOKOŠ", "KOKOŠI", "KOKOŠO", "KOKOŠ!"] },
  { text: "KOŠ", image: "kos1.webp", audio: "Kos_predmet.mp3", acceptedVariants: ["KOS", "KOŠ", "KOŠA", "KOŠU", "KOŠ!"] },
  { text: "KOŠARA", image: "kosara1.webp", audio: "Kosara.mp3", acceptedVariants: ["KOSARA", "KOŠARA", "KOŠARO", "KOŠARE", "KOŠARA!"] },
  { text: "MIŠ", image: "mis1.webp", audio: "Mis.mp3", acceptedVariants: ["MIS", "MIŠ", "MIŠI", "MIŠO", "MIŠ!"] },
  { text: "PIŠKOT", image: "piskot1.webp", audio: "Piskot.mp3", acceptedVariants: ["PISKOT", "PIŠKOT", "PIŠKOTA", "PIŠKOTU", "PIŠKOT!"] },
  { text: "POŠTA", image: "posta1.webp", audio: "Posta.mp3", acceptedVariants: ["POSTA", "POŠTA", "POŠTO", "POŠTE", "POŠTA!"] },
  { text: "TUŠ", image: "tus1.webp", audio: "Tus.mp3", acceptedVariants: ["TUS", "TUŠ", "TUŠA", "TUŠU", "TUŠ!"] },
  { text: "LEŠNIK", image: "lesnik1.webp", audio: "Lesnik.mp3", acceptedVariants: ["LESNIK", "LEŠNIK", "LEŠNIKA", "LEŠNIKU", "LEŠNIK!"] },
  { text: "MUŠNICA", image: "musnica1.webp", audio: "Musnica.mp3", acceptedVariants: ["MUSNICA", "MUŠNICA", "MUŠNICO", "MUŠNICE", "MUŠNICA!"] },
  { text: "NOGOMETAŠ", image: "nogometas1.webp", audio: "Nogometas.mp3", acceptedVariants: ["NOGOMETAS", "NOGOMETAŠ", "NOGOMETAŠA", "NOGOMETAŠU", "NOGOMETAŠ!"] },
  { text: "OBEŠALNIK", image: "obesalnik1.webp", audio: "Obesalnik.mp3", acceptedVariants: ["OBESALNIK", "OBEŠALNIK", "OBEŠALNIKA", "OBEŠALNIKU", "OBEŠALNIK!"] },
  { text: "PAŠTETA", image: "pasteta1.webp", audio: "Pasteta.mp3", acceptedVariants: ["PASTETA", "PAŠTETA", "PAŠTETO", "PAŠTETE", "PAŠTETA!"] },
  { text: "ROKOMETAŠ", image: "rokometas1.webp", audio: "Rokometas.mp3", acceptedVariants: ["ROKOMETAS", "ROKOMETAŠ", "ROKOMETAŠA", "ROKOMETAŠU", "ROKOMETAŠ!"] },
  { text: "VIŠNJA", image: "visnja1.webp", audio: "Visnja.mp3", acceptedVariants: ["VISNJA", "VIŠNJA", "VIŠNJO", "VIŠNJE", "VIŠNJA!"] },
];

// Words for sound Ž (middle/end position)
export const KACE_WORDS_ZH: KaceLestveWord[] = [
  { text: "DEŽEVNIK", image: "dezevnik1.webp", audio: "Dezevnik.mp3", acceptedVariants: ["DEZEVNIK", "DEŽEVNIK", "DEŽEVNIKA", "DEŽEVNIKU", "DEŽEVNIK!"] },
  { text: "DEŽNIK", image: "deznik1.webp", audio: "Deznik.mp3", acceptedVariants: ["DEZNIK", "DEŽNIK", "DEŽNIKA", "DEŽNIKU", "DEŽNIK!"] },
  { text: "FIŽOL", image: "fizol1.webp", audio: "Fizol.mp3", acceptedVariants: ["FIZOL", "FIŽOL", "FIŽOLA", "FIŽOLU", "FIŽOL!"] },
  { text: "KROŽNIK", image: "kroznik1.webp", audio: "Kroznik.mp3", acceptedVariants: ["KROZNIK", "KROŽNIK", "KROŽNIKA", "KROŽNIKU", "KROŽNIK!"] },
  { text: "KUŽA", image: "kuza1.webp", audio: "Kuza.mp3", acceptedVariants: ["KUZA", "KUŽA", "KUŽO", "KUŽE", "KUŽA!"] },
  { text: "ROŽA", image: "roza1.webp", audio: "Roza.mp3", acceptedVariants: ["ROZA", "ROŽA", "ROŽO", "ROŽE", "ROŽA!"] },
  { text: "SNEŽAK", image: "snezak1.webp", audio: "Snezak.mp3", acceptedVariants: ["SNEZAK", "SNEŽAK", "SNEŽAKA", "SNEŽAKU", "SNEŽAK!"] },
  { text: "GARAŽA", image: "garaza1.webp", audio: "Garaza.mp3", acceptedVariants: ["GARAZA", "GARAŽA", "GARAŽO", "GARAŽE", "GARAŽA!"] },
  { text: "KOŽA", image: "koza_skin1.webp", audio: "Koza_cutilo.mp3", acceptedVariants: ["KOZA", "KOŽA", "KOŽO", "KOŽE", "KOŽA!"] },
  { text: "LUŽA", image: "luza1.webp", audio: "Luza.mp3", acceptedVariants: ["LUZA", "LUŽA", "LUŽO", "LUŽE", "LUŽA!"] },
  { text: "MOŽGANI", image: "mozgani1.webp", audio: "Mozgani.mp3", acceptedVariants: ["MOZGANI", "MOŽGANI", "MOŽGANOV", "MOŽGANOM", "MOŽGANI!"] },
  { text: "MREŽA", image: "mreza1.webp", audio: "Mreza.mp3", acceptedVariants: ["MREZA", "MREŽA", "MREŽO", "MREŽE", "MREŽA!"] },
  { text: "PARADIŽNIK", image: "paradiznik1.webp", audio: "Paradiznik.mp3", acceptedVariants: ["PARADIZNIK", "PARADIŽNIK", "PARADIŽNIKA", "PARADIŽNIKU", "PARADIŽNIK!"] },
  { text: "POŽAR", image: "pozar1.webp", audio: "Pozar.mp3", acceptedVariants: ["POZAR", "POŽAR", "POŽARA", "POŽARU", "POŽAR!"] },
  { text: "SNEŽINKA", image: "snezinka1.webp", audio: "Snezinka.mp3", acceptedVariants: ["SNEZINKA", "SNEŽINKA", "SNEŽINKO", "SNEŽINKE", "SNEŽINKA!"] },
  { text: "VERIŽICA", image: "verizica1.webp", audio: "Verizica.mp3", acceptedVariants: ["VERIZICA", "VERIŽICA", "VERIŽICO", "VERIŽICE", "VERIŽICA!"] },
  { text: "JEŽ", image: "jez1.webp", audio: "Jez.mp3", acceptedVariants: ["JEZ", "JEŽ", "JEŽA", "JEŽU", "JEŽ!"] },
  { text: "MOŽ", image: "moz1.webp", audio: "Moz.mp3", acceptedVariants: ["MOZ", "MOŽ", "MOŽA", "MOŽU", "MOŽ!"] },
  { text: "POLŽ", image: "polz1.webp", audio: "Polz.mp3", acceptedVariants: ["POLZ", "POLŽ", "POLŽA", "POLŽU", "POLŽ!"] },
];

// Words for sound Č (middle/end position)
export const KACE_WORDS_CH: KaceLestveWord[] = [
  { text: "HLAČE", image: "hlace1.webp", audio: "Hlace.mp3", acceptedVariants: ["HLACE", "HLAČE", "HLAČ", "HLAČAM", "HLAČE!"] },
  { text: "KAČA", image: "kaca1.webp", audio: "Kaca.mp3", acceptedVariants: ["KACA", "KAČA", "KAČO", "KAČE", "KAČA!"] },
  { text: "KLJUČ", image: "kljuc1.webp", audio: "Kljuc.mp3", acceptedVariants: ["KLJUC", "KLJUČ", "KLJUČA", "KLJUČU", "KLJUČ!"] },
  { text: "KOLAČ", image: "kolac1.webp", audio: "Kolac.mp3", acceptedVariants: ["KOLAC", "KOLAČ", "KOLAČA", "KOLAČU", "KOLAČ!"] },
  { text: "LUČ", image: "luc1.webp", audio: "Luc.mp3", acceptedVariants: ["LUC", "LUČ", "LUČI", "LUČO", "LUČ!"] },
  { text: "OČALA", image: "ocala1.webp", audio: "Ocala.mp3", acceptedVariants: ["OCALA", "OČALA", "OČAL", "OČALOM", "OČALA!"] },
  { text: "OČI", image: "oci1.webp", audio: "Oci.mp3", acceptedVariants: ["OCI", "OČI", "OČES", "OČI!"] },
  { text: "SVINČNIK", image: "svincnik1.webp", audio: "Svincnik.mp3", acceptedVariants: ["SVINCNIK", "SVINČNIK", "SVINČNIKA", "SVINČNIKU", "SVINČNIK!"] },
  { text: "ŠČETKA", image: "scetka1.webp", audio: "Scetka.mp3", acceptedVariants: ["SCETKA", "ŠČETKA", "ŠČETKO", "ŠČETKE", "ŠČETKA!"] },
  { text: "ZVOČNIK", image: "zvocnik1.webp", audio: "Zvocnik.mp3", acceptedVariants: ["ZVOCNIK", "ZVOČNIK", "ZVOČNIKA", "ZVOČNIKU", "ZVOČNIK!"] },
  { text: "ČOPIČ", image: "copic1.webp", audio: "Copic.mp3", acceptedVariants: ["COPIC", "ČOPIČ", "ČOPIČA", "ČOPIČU", "ČOPIČ!"] },
  { text: "NOČ", image: "noc1.webp", audio: "Noc.mp3", acceptedVariants: ["NOC", "NOČ", "NOČI", "NOČO", "NOČ!"] },
  { text: "OBROČ", image: "obroc1.webp", audio: "Obroc.mp3", acceptedVariants: ["OBROC", "OBROČ", "OBROČA", "OBROČU", "OBROČ!"] },
  { text: "PEČ", image: "pec1.webp", audio: "Pec.mp3", acceptedVariants: ["PEC", "PEČ", "PEČI", "PEČO", "PEČ!"] },
  { text: "PTIČ", image: "ptic1.webp", audio: "Ptic.mp3", acceptedVariants: ["PTIC", "PTIČ", "PTIČA", "PTIČU", "PTIČ!"] },
  { text: "RIBIČ", image: "ribic1.webp", audio: "Ribic.mp3", acceptedVariants: ["RIBIC", "RIBIČ", "RIBIČA", "RIBIČU", "RIBIČ!"] },
];

// Words for sound K (middle/end position) - 37 words
export const KACE_WORDS_K: KaceLestveWord[] = [
  { text: "AVOKADO", image: "avokado1.webp", audio: "Avokado.mp3", acceptedVariants: ["AVOKADO", "AVOKADO!", "AVOKADA", "AVOKADU"] },
  { text: "BIK", image: "bik1.webp", audio: "Bik.mp3", acceptedVariants: ["BIK", "BIK!", "BIKA", "BIKU"] },
  { text: "CEKIN", image: "cekin1.webp", audio: "Cekin.mp3", acceptedVariants: ["CEKIN", "CEKIN!", "CEKINA", "CEKINU"] },
  { text: "CERKEV", image: "cerkev1.webp", audio: "Cerkev.mp3", acceptedVariants: ["CERKEV", "CERKEV!", "CERKVE", "CERKVI"] },
  { text: "CIRKUS", image: "cirkus1.webp", audio: "Cirkus.mp3", acceptedVariants: ["CIRKUS", "CIRKUS!", "CIRKUSA", "CIRCUS"] },
  { text: "COKLA", image: "cokla1.webp", audio: "Cokla.mp3", acceptedVariants: ["COKLA", "COKLA!", "COKLO", "COKLE"] },
  { text: "ČOKOLADA", image: "cokolada1.webp", audio: "Cokolada.mp3", acceptedVariants: ["COKOLADA", "ČOKOLADA", "ČOKOLADO", "ČOKOLADE", "ČOKOLADA!"] },
  { text: "ČRKE", image: "crke1.webp", audio: "Crke.mp3", acceptedVariants: ["CRKE", "ČRKE", "ČRK", "ČRKAM", "ČRKE!"] },
  { text: "DEŽEVNIK", image: "dezevnik1.webp", audio: "Dezevnik.mp3", acceptedVariants: ["DEZEVNIK", "DEŽEVNIK", "DEŽEVNIKA", "DEŽEVNIKU", "DEŽEVNIK!"] },
  { text: "DEŽNIK", image: "deznik1.webp", audio: "Deznik.mp3", acceptedVariants: ["DEZNIK", "DEŽNIK", "DEŽNIKA", "DEŽNIKU", "DEŽNIK!"] },
  { text: "HRUŠKA", image: "hruska1.webp", audio: "Hruska.mp3", acceptedVariants: ["HRUSKA", "HRUŠKA", "HRUŠKO", "HRUŠKE", "HRUŠKA!"] },
  { text: "JABOLKO", image: "jabolko1.webp", audio: "Jabolko.mp3", acceptedVariants: ["JABOLKO", "JABOLKO!", "JABOLKA", "JABOLKU"] },
  { text: "JEZIK", image: "jezik1.webp", audio: "Jezik.mp3", acceptedVariants: ["JEZIK", "JEZIK!", "JEZIKA", "JEZIKU"] },
  { text: "KOKOŠ", image: "kokos1.webp", audio: "Kokos_zival.mp3", acceptedVariants: ["KOKOS", "KOKOŠ", "KOKOŠI", "KOKOŠO", "KOKOŠ!"] },
  { text: "LIZIKA", image: "lizika1.webp", audio: "Lizika.mp3", acceptedVariants: ["LIZIKA", "LIZIKO", "LIZIKE", "LIZIKA!"] },
  { text: "OBLAK", image: "oblak1.webp", audio: "Oblak.mp3", acceptedVariants: ["OBLAK", "OBLAK!", "OBLAKA", "OBLAKU"] },
  { text: "PAJEK", image: "pajek1.webp", audio: "Pajek.mp3", acceptedVariants: ["PAJEK", "PAJEK!", "PAJEKA", "PAJEKU"] },
  { text: "PIŠKOT", image: "piskot1.webp", audio: "Piskot.mp3", acceptedVariants: ["PISKOT", "PIŠKOT", "PIŠKOTA", "PIŠKOTU", "PIŠKOT!"] },
  { text: "RAK", image: "rak1.webp", audio: "Rak.mp3", acceptedVariants: ["RAK", "RAK!", "RAKA", "RAKU"] },
  { text: "RAKETA", image: "raketa1.webp", audio: "Raketa.mp3", acceptedVariants: ["RAKETA", "RAKETO", "RAKETE", "RAKETA!"] },
  { text: "ROKA", image: "roka1.webp", audio: "Roka.mp3", acceptedVariants: ["ROKA", "ROKO", "ROKE", "ROKI", "ROKA!"] },
  { text: "ROLKA", image: "rolka1.webp", audio: "Rolka.mp3", acceptedVariants: ["ROLKA", "ROLKO", "ROLKE", "ROLKA!"] },
  { text: "SLIKA", image: "slika1.webp", audio: "Slika.mp3", acceptedVariants: ["SLIKA", "SLIKO", "SLIKE", "SLIKA!"] },
  { text: "SMREKA", image: "smreka1.webp", audio: "Smreka.mp3", acceptedVariants: ["SMREKA", "SMREKO", "SMREKE", "SMREKA!"] },
  { text: "SNEŽAK", image: "snezak1.webp", audio: "Snezak.mp3", acceptedVariants: ["SNEZAK", "SNEŽAK", "SNEŽAKA", "SNEŽAKU", "SNEŽAK!"] },
  { text: "SOK", image: "sok1.webp", audio: "Sok.mp3", acceptedVariants: ["SOK", "SOK!", "SOKA", "SOKU"] },
  { text: "SVETILKA", image: "svetilka1.webp", audio: "Svetilka.mp3", acceptedVariants: ["SVETILKA", "SVETILKO", "SVETILKE", "SVETILKA!"] },
  { text: "SVINČNIK", image: "svincnik1.webp", audio: "Svincnik.mp3", acceptedVariants: ["SVINCNIK", "SVINČNIK", "SVINČNIKA", "SVINČNIKU", "SVINČNIK!"] },
  { text: "ŠČETKA", image: "scetka1.webp", audio: "Scetka.mp3", acceptedVariants: ["SCETKA", "ŠČETKA", "ŠČETKO", "ŠČETKE", "ŠČETKA!"] },
  { text: "ŠKARJE", image: "skarje1.webp", audio: "Skarje.mp3", acceptedVariants: ["SKARJE", "ŠKARJE", "ŠKARIJ", "ŠKARJE!"] },
  { text: "ŠKATLA", image: "skatla1.webp", audio: "Skatla.mp3", acceptedVariants: ["SKATLA", "ŠKATLA", "ŠKATLO", "ŠKATLE", "ŠKATLA!"] },
  { text: "ŠKOLJKA", image: "skoljka1.webp", audio: "Skoljka.mp3", acceptedVariants: ["SKOLJKA", "ŠKOLJKA", "ŠKOLJKO", "ŠKOLJKE", "ŠKOLJKA!"] },
  { text: "ŠOPEK", image: "sopek1.webp", audio: "Sopek.mp3", acceptedVariants: ["SOPEK", "ŠOPEK", "ŠOPKA", "ŠOPKU", "ŠOPEK!"] },
  { text: "ŠTAMPILJKA", image: "stampiljka1.webp", audio: "Stampiljka.mp3", acceptedVariants: ["STAMPILJKA", "ŠTAMPILJKA", "ŠTAMPILJKO", "ŠTAMPILJKE", "ŠTAMPILJKA!"] },
  { text: "ŠTORKLJA", image: "storklja1.webp", audio: "Storklja.mp3", acceptedVariants: ["STORKLJA", "ŠTORKLJA", "ŠTORKLJO", "ŠTORKLJE", "ŠTORKLJA!"] },
  { text: "ZVOČNIK", image: "zvocnik1.webp", audio: "Zvocnik.mp3", acceptedVariants: ["ZVOCNIK", "ZVOČNIK", "ZVOČNIKA", "ZVOČNIKU", "ZVOČNIK!"] },
];

// Words for sound L (middle/end position) - 42 words
export const KACE_WORDS_L: KaceLestveWord[] = [
  { text: "ALBUM", image: "album1.webp", audio: "Album.mp3", acceptedVariants: ["ALBUM", "ALBUM!", "ALBUMA", "ALBUMU"] },
  { text: "ANGEL", image: "angel1.webp", audio: "Angel.mp3", acceptedVariants: ["ANGEL", "ANGEL!", "ANGELA", "ANGELU"] },
  { text: "BALON", image: "balon1.webp", audio: "Balon.mp3", acceptedVariants: ["BALON", "BALON!", "BALONA", "BALONU"] },
  { text: "CEDILO", image: "cedilo1.webp", audio: "Cedilo.mp3", acceptedVariants: ["CEDILO", "CEDILO!", "CEDILA", "CEDILU"] },
  { text: "COKLA", image: "cokla1.webp", audio: "Cokla.mp3", acceptedVariants: ["COKLA", "COKLA!", "COKLO", "COKLE"] },
  { text: "ČEBELA", image: "cebela1.webp", audio: "Cebela.mp3", acceptedVariants: ["CEBELA", "ČEBELA", "ČEBELO", "ČEBELE", "ČEBELA!"] },
  { text: "ČEBULA", image: "cebula1.webp", audio: "Cebula.mp3", acceptedVariants: ["CEBULA", "ČEBULA", "ČEBULO", "ČEBULE", "ČEBULA!"] },
  { text: "ČEVLJI", image: "cevlji1.webp", audio: "Cevlji.mp3", acceptedVariants: ["CEVLJI", "ČEVLJI", "ČEVLJEV", "ČEVLJE", "ČEVLJI!"] },
  { text: "ČOKOLADA", image: "cokolada1.webp", audio: "Cokolada.mp3", acceptedVariants: ["COKOLADA", "ČOKOLADA", "ČOKOLADO", "ČOKOLADE", "ČOKOLADA!"] },
  { text: "GOL", image: "gol1.webp", audio: "Gol.mp3", acceptedVariants: ["GOL", "GOL!", "GOLA", "GOLU"] },
  { text: "HLAČE", image: "hlace1.webp", audio: "Hlace.mp3", acceptedVariants: ["HLACE", "HLAČE", "HLAČ", "HLAČAM", "HLAČE!"] },
  { text: "KLAVIR", image: "klavir1.webp", audio: "Klavir.mp3", acceptedVariants: ["KLAVIR", "KLAVIR!", "KLAVIRJA", "KLAVIRJU"] },
  { text: "KLJUČ", image: "kljuc1.webp", audio: "Kljuc.mp3", acceptedVariants: ["KLJUC", "KLJUČ", "KLJUČA", "KLJUČU", "KLJUČ!"] },
  { text: "KLOP", image: "klop1.webp", audio: "Klop.mp3", acceptedVariants: ["KLOP", "KLOP!", "KLOPI", "KLOPU"] },
  { text: "KOLAČ", image: "kolac1.webp", audio: "Kolac.mp3", acceptedVariants: ["KOLAC", "KOLAČ", "KOLAČA", "KOLAČU", "KOLAČ!"] },
  { text: "KOLO", image: "kolo1.webp", audio: "Kolo.mp3", acceptedVariants: ["KOLO", "KOLO!", "KOLESA", "KOLESU"] },
  { text: "LETALO", image: "letalo1.webp", audio: "Letalo.mp3", acceptedVariants: ["LETALO", "LETALO!", "LETALA", "LETALU"] },
  { text: "METLA", image: "metla1.webp", audio: "Metla.mp3", acceptedVariants: ["METLA", "METLO", "METLE", "METLA!"] },
  { text: "MILO", image: "milo1.webp", audio: "Milo.mp3", acceptedVariants: ["MILO", "MILO!", "MILA", "MILU"] },
  { text: "OBLAK", image: "oblak1.webp", audio: "Oblak.mp3", acceptedVariants: ["OBLAK", "OBLAK!", "OBLAKA", "OBLAKU"] },
  { text: "OČALA", image: "ocala1.webp", audio: "Ocala.mp3", acceptedVariants: ["OCALA", "OČALA", "OČAL", "OČALOM", "OČALA!"] },
  { text: "RAVNILO", image: "ravnilo1.webp", audio: "Ravnilo.mp3", acceptedVariants: ["RAVNILO", "RAVNILO!", "RAVNILA", "RAVNILU"] },
  { text: "ROLKA", image: "rolka1.webp", audio: "Rolka.mp3", acceptedVariants: ["ROLKA", "ROLKO", "ROLKE", "ROLKA!"] },
  { text: "ROPOTULJICA", image: "ropotuljica1.webp", audio: "Ropotuljica.mp3", acceptedVariants: ["ROPOTULJICA", "ROPOTULICA", "ROPOTULJICE", "ROPOTULJICA!"] },
  { text: "SLADOLED", image: "sladoled1.webp", audio: "Sladoled.mp3", acceptedVariants: ["SLADOLED", "SLADOLED!", "SLADOLEDA", "SLADOLEDU"] },
  { text: "SLIKA", image: "slika1.webp", audio: "Slika.mp3", acceptedVariants: ["SLIKA", "SLIKO", "SLIKE", "SLIKA!"] },
  { text: "SLON", image: "slon1.webp", audio: "Slon.mp3", acceptedVariants: ["SLON", "SLON!", "SLONA", "SLONU"] },
  { text: "SLUZ", image: "sluz1.webp", audio: "Sluz.mp3", acceptedVariants: ["SLUZ", "SLUZ!", "SLUZI", "SLUZU"] },
  { text: "SVETILKA", image: "svetilka1.webp", audio: "Svetilka.mp3", acceptedVariants: ["SVETILKA", "SVETILKO", "SVETILKE", "SVETILKA!"] },
  { text: "ŠAL", image: "sal1.webp", audio: "Sal.mp3", acceptedVariants: ["SAL", "ŠAL", "ŠALA", "ŠALU", "ŠAL!"] },
  { text: "ŠKATLA", image: "skatla1.webp", audio: "Skatla.mp3", acceptedVariants: ["SKATLA", "ŠKATLA", "ŠKATLO", "ŠKATLE", "ŠKATLA!"] },
  { text: "ŠKOLJKA", image: "skoljka1.webp", audio: "Skoljka.mp3", acceptedVariants: ["SKOLJKA", "ŠKOLJKA", "ŠKOLJKO", "ŠKOLJKE", "ŠKOLJKA!"] },
  { text: "ŠTAMPILJKA", image: "stampiljka1.webp", audio: "Stampiljka.mp3", acceptedVariants: ["STAMPILJKA", "ŠTAMPILJKA", "ŠTAMPILJKO", "ŠTAMPILJKE", "ŠTAMPILJKA!"] },
  { text: "ŠTORKLJA", image: "storklja1.webp", audio: "Storklja.mp3", acceptedVariants: ["STORKLJA", "ŠTORKLJA", "ŠTORKLJO", "ŠTORKLJE", "ŠTORKLJA!"] },
  { text: "TELEFON", image: "telefon1.webp", audio: "Telefon.mp3", acceptedVariants: ["TELEFON", "TELEFON!", "TELEFONA", "TELEFONU"] },
  { text: "VILICA", image: "vilica1.webp", audio: "Vilice.mp3", acceptedVariants: ["VILICA", "VILICO", "VILICE", "VILICA!"] },
  { text: "VOLAN", image: "volan1.webp", audio: "Volan.mp3", acceptedVariants: ["VOLAN", "VOLAN!", "VOLANA", "VOLANU"] },
  { text: "ZASLON", image: "zaslon1.webp", audio: "Zaslon.mp3", acceptedVariants: ["ZASLON", "ZASLON!", "ZASLONA", "ZASLONU"] },
  { text: "ZLATO", image: "zlato1.webp", audio: "Zlato.mp3", acceptedVariants: ["ZLATO", "ZLATO!", "ZLATA", "ZLATU"] },
  { text: "ŽEBELJ", image: "zebelj1.webp", audio: "Zebelj.mp3", acceptedVariants: ["ZEBELJ", "ŽEBELJ", "ŽEBLJA", "ŽEBLJU", "ŽEBELJ!"] },
  { text: "ŽELVA", image: "zelva1.webp", audio: "Zelva.mp3", acceptedVariants: ["ZELVA", "ŽELVA", "ŽELVO", "ŽELVE", "ŽELVA!"] },
  { text: "ŽLICA", image: "zlica1.webp", audio: "Zlica.mp3", acceptedVariants: ["ZLICA", "ŽLICA", "ŽLICO", "ŽLICE", "ŽLICA!"] },
  { text: "POLŽ", image: "polz1.webp", audio: "Polz.mp3", acceptedVariants: ["POLZ", "POLŽ", "POLŽA", "POLŽU", "POLŽ!"] },
];

// Words for sound R (middle/end position) - 35 words
export const KACE_WORDS_R: KaceLestveWord[] = [
  { text: "BOBER", image: "bober1.webp", audio: "Bober.mp3", acceptedVariants: ["BOBER", "BOBER!", "BOBRA", "BOBRU"] },
  { text: "BOROVNICE", image: "borovnice1.webp", audio: "Borovnice.mp3", acceptedVariants: ["BOROVNICE", "BOROVNICA", "BOROVNICE!", "BOROVNIC"] },
  { text: "CERKEV", image: "cerkev1.webp", audio: "Cerkev.mp3", acceptedVariants: ["CERKEV", "CERKEV!", "CERKVE", "CERKVI"] },
  { text: "CIRKUS", image: "cirkus1.webp", audio: "Cirkus.mp3", acceptedVariants: ["CIRKUS", "CIRKUS!", "CIRKUSA", "CIRCUS"] },
  { text: "CISTERNA", image: "cisterna1.webp", audio: "Cisterna.mp3", acceptedVariants: ["CISTERNA", "CISTERNO", "CISTERNE", "CISTERNA!"] },
  { text: "ČRKE", image: "crke1.webp", audio: "Crke.mp3", acceptedVariants: ["CRKE", "ČRKE", "ČRK", "ČRKAM", "ČRKE!"] },
  { text: "DREVO", image: "drevo1.webp", audio: "Drevo.mp3", acceptedVariants: ["DREVO", "DREVO!", "DREVESA", "DREVESU"] },
  { text: "HRUŠKA", image: "hruska1.webp", audio: "Hruska.mp3", acceptedVariants: ["HRUSKA", "HRUŠKA", "HRUŠKO", "HRUŠKE", "HRUŠKA!"] },
  { text: "KLAVIR", image: "klavir1.webp", audio: "Klavir.mp3", acceptedVariants: ["KLAVIR", "KLAVIR!", "KLAVIRJA", "KLAVIRJU"] },
  { text: "KOŠARA", image: "kosara1.webp", audio: "Kosara.mp3", acceptedVariants: ["KOSARA", "KOŠARA", "KOŠARO", "KOŠARE", "KOŠARA!"] },
  { text: "KOZAREC", image: "kozarec1.webp", audio: "Kozarec.mp3", acceptedVariants: ["KOZAREC", "KOZAREC!", "KOZARCE", "KOZARCI", "KOZARCA"] },
  { text: "KRAVA", image: "krava1.webp", audio: "Krava.mp3", acceptedVariants: ["KRAVA", "KRAVO", "KRAVE", "KRAVA!"] },
  { text: "KROF", image: "krof1.webp", audio: "Krof.mp3", acceptedVariants: ["KROF", "KROF!", "KROFA", "KROFU"] },
  { text: "KROG", image: "krog1.webp", audio: "Krog.mp3", acceptedVariants: ["KROG", "KROG!", "KROGA", "KROGU"] },
  { text: "KROŽNIK", image: "kroznik1.webp", audio: "Kroznik.mp3", acceptedVariants: ["KROZNIK", "KROŽNIK", "KROŽNIKA", "KROŽNIKU", "KROŽNIK!"] },
  { text: "KRUH", image: "kruh1.webp", audio: "Kruh.mp3", acceptedVariants: ["KRUH", "KRUH!", "KRUHA", "KRUHU"] },
  { text: "KUMARA", image: "kumara1.webp", audio: "Kumara.mp3", acceptedVariants: ["KUMARA", "KUMARO", "KUMARE", "KUMARA!"] },
  { text: "LOPAR", image: "lopar1.webp", audio: "Lopar.mp3", acceptedVariants: ["LOPAR", "LOPAR!", "LOPARJA", "LOPARJU"] },
  { text: "MROŽ", image: "mroz1.webp", audio: "Mroz.mp3", acceptedVariants: ["MROZ", "MROŽ", "MROŽA", "MROŽU", "MROŽ!"] },
  { text: "OBRAZ", image: "obraz1.webp", audio: "Obraz.mp3", acceptedVariants: ["OBRAZ", "OBRAZ!", "OBRAZA", "OBRAZU"] },
  { text: "OMARA", image: "omara1.webp", audio: "Omara.mp3", acceptedVariants: ["OMARA", "OMARO", "OMARE", "OMARA!"] },
  { text: "SIR", image: "sir1.webp", audio: "Sir.mp3", acceptedVariants: ["SIR", "SIR!", "SIRA", "SIRU"] },
  { text: "SMREKA", image: "smreka1.webp", audio: "Smreka.mp3", acceptedVariants: ["SMREKA", "SMREKO", "SMREKE", "SMREKA!"] },
  { text: "ŠKARJE", image: "skarje1.webp", audio: "Skarje.mp3", acceptedVariants: ["SKARJE", "ŠKARJE", "ŠKARIJ", "ŠKARJE!"] },
  { text: "ŠOTOR", image: "sotor1.webp", audio: "Sotor.mp3", acceptedVariants: ["SOTOR", "ŠOTOR", "ŠOTORA", "ŠOTORU", "ŠOTOR!"] },
  { text: "ŠTORKLJA", image: "storklja1.webp", audio: "Storklja.mp3", acceptedVariants: ["STORKLJA", "ŠTORKLJA", "ŠTORKLJO", "ŠTORKLJE", "ŠTORKLJA!"] },
  { text: "TORBA", image: "torba1.webp", audio: "Torba.mp3", acceptedVariants: ["TORBA", "TORBO", "TORBE", "TORBA!"] },
  { text: "TROBENTA", image: "trobenta1.webp", audio: "Trobenta.mp3", acceptedVariants: ["TROBENTA", "TROBENTO", "TROBENTE", "TROBENTA!"] },
  { text: "URA", image: "ura1.webp", audio: "Ura.mp3", acceptedVariants: ["URA", "URO", "URE", "URA!"] },
  { text: "VETRNICA", image: "veternica1.webp", audio: "Vetrnica.mp3", acceptedVariants: ["VETRNICA", "VETERNICA", "VETRNICO", "VETRNICE", "VETRNICA!"] },
  { text: "ZEBRA", image: "zebra1.webp", audio: "Zebra.mp3", acceptedVariants: ["ZEBRA", "ZEBRO", "ZEBRE", "ZEBRA!"] },
  { text: "ZOBOTREBEC", image: "zobotrebec1.webp", audio: "Zobotrebec.mp3", acceptedVariants: ["ZOBOTREBEC", "ZOBOTREBCA", "ZOBOTREBEC!", "ZOBOTREBCI"] },
  { text: "ŽARNICA", image: "zarnica1.webp", audio: "Zarnica.mp3", acceptedVariants: ["ZARNICA", "ŽARNICA", "ŽARNICO", "ŽARNICE", "ŽARNICA!"] },
  { text: "ŽERJAV", image: "zerjav1.webp", audio: "Zerjav.mp3", acceptedVariants: ["ZERJAV", "ŽERJAV", "ŽERJAVA", "ŽERJAVU", "ŽERJAV!"] },
  { text: "ŽIRAFA", image: "zirafa1.webp", audio: "Zirafa.mp3", acceptedVariants: ["ZIRAFA", "ŽIRAFA", "ŽIRAFO", "ŽIRAFE", "ŽIRAFA!"] },
];

// Words for R beginning exercises (consonant clusters TR, BR, DR, PR)
export const KACE_WORDS_R_ZACETEK: KaceLestveWord[] = [
  { text: "DREVO", image: "drevo1.webp", audio: "Drevo.mp3", acceptedVariants: ["DREVO", "DREVO!", "DREVÓ", "DREVO?", "DREVO.", "DERVO"] },
  { text: "TROBENTA", image: "trobenta1.webp", audio: "Trobenta.mp3", acceptedVariants: ["TROBENTA", "TROBENTA!", "TROMPETA", "TROBENTO", "TOBENTA"] },
  { text: "TRI", image: "tri1.webp", audio: "Tri.mp3", acceptedVariants: ["TRI", "TRI!", "TRI?", "3", "TI"] },
  { text: "TRIKOTNIK", image: "trikotnik1.webp", audio: "Trikotnik.mp3", acceptedVariants: ["TRIKOTNIK", "TRIKOTNIK!", "TRIKOTNIKA", "TIKOTNIK"] },
  { text: "TRAVA", image: "trava1.webp", audio: "Trava.mp3", acceptedVariants: ["TRAVA", "TRAVA!", "TRAVO", "TRAVE", "TAVA"] },
  { text: "TRAK", image: "trak1.webp", audio: "Trak.mp3", acceptedVariants: ["TRAK", "TRAK!", "TRAKU", "TRAKA", "TAK"] },
  { text: "BRISAČA", image: "brisaca1.webp", audio: "Brisaca.mp3", acceptedVariants: ["BRISAČA", "BRISACA", "BRISAČO", "BRISAČA!", "BISAČA"] },
  { text: "BRIKETI", image: "briketi1.webp", audio: "Briketi.mp3", acceptedVariants: ["BRIKETI", "BRIKETI!", "BRIKET", "BRIKETE", "BIKETI"] },
  { text: "BRESKEV", image: "breskev1.webp", audio: "Breskev.mp3", acceptedVariants: ["BRESKEV", "BRESKEV!", "BRESKVE", "BRESKVA", "BESKEV"] },
  { text: "BRADA", image: "brada1.webp", audio: "Brada.mp3", acceptedVariants: ["BRADA", "BRADA!", "BRADO", "BRADE", "BADA"] },
  { text: "BROKOLI", image: "brokoli1.webp", audio: "Brokoli.mp3", acceptedVariants: ["BROKOLI", "BROKOLI!", "BROKOLIJA", "BOKOLI"] },
  { text: "BRUSNICE", image: "brusnice1.webp", audio: "Brusnice.mp3", acceptedVariants: ["BRUSNICE", "BRUSNICE!", "BRUSNICA", "BUSNICE"] },
  { text: "BREZA", image: "breza1.webp", audio: "Breza.mp3", acceptedVariants: ["BREZA", "BREZA!", "BREZO", "BREZE", "BEZA"] },
  { text: "DRES", image: "dres1.webp", audio: "Dres.mp3", acceptedVariants: ["DRES", "DRES!", "DRESU", "DRESA", "DES"] },
  { text: "DRAGULJ", image: "dragulj1.webp", audio: "Dragulj.mp3", acceptedVariants: ["DRAGULJ", "DRAGULJ!", "DRAGULJA", "DAGULJA"] },
  { text: "DRON", image: "dron1.webp", audio: "Dron.mp3", acceptedVariants: ["DRON", "DRON!", "DRONA", "DRONU", "DON"] },
  { text: "PRINC", image: "princ1.webp", audio: "Princ.mp3", acceptedVariants: ["PRINC", "PRINC!", "PRINCA", "PRINCU", "PINC"] },
  { text: "PRESTA", image: "presta1.webp", audio: "Presta.mp3", acceptedVariants: ["PRESTA", "PRESTA!", "PRESTO", "PRESTE", "PESTA"] },
];

// Helper function to get the word list for a given letter
export function getKaceWordList(letter: string): KaceLestveWord[] {
  switch (letter) {
    case 'c': return KACE_WORDS_C;
    case 's': return KACE_WORDS_S;
    case 'z': return KACE_WORDS_Z;
    case 'sh': return KACE_WORDS_SH;
    case 'zh': return KACE_WORDS_ZH;
    case 'ch': return KACE_WORDS_CH;
    case 'k': return KACE_WORDS_K;
    case 'l': return KACE_WORDS_L;
    case 'r': return KACE_WORDS_R;
    case 'r-zacetek': return KACE_WORDS_R_ZACETEK;
    default: return KACE_WORDS_C;
  }
}

// Board layout (6 cols x 7 rows = 42 fields, boustrophedon)
// Row 0 (bottom): fields 1-6 (L→R)
// Row 1: fields 12-7 (R→L)
// Row 2: fields 13-18 (L→R)
// Row 3: fields 24-19 (R→L)
// Row 4: fields 25-30 (L→R)
// Row 5: fields 36-31 (R→L)
// Row 6 (top): fields 37-42 (L→R)

export function getBoardPosition(row: number, col: number): number {
  const rowFromBottom = (ROWS - 1) - row; // 0 = bottom row
  const baseNum = rowFromBottom * COLS + 1;
  if (rowFromBottom % 2 === 0) {
    // Left to right
    return baseNum + col;
  } else {
    // Right to left
    return baseNum + (COLS - 1 - col);
  }
}

// Get the grid cell [row, col] for a given board position (1-42)
export function getGridCell(position: number): { row: number; col: number } {
  const pos = position - 1; // 0-indexed
  const rowFromBottom = Math.floor(pos / COLS);
  const indexInRow = pos % COLS;
  const row = (ROWS - 1) - rowFromBottom;
  const col = rowFromBottom % 2 === 0 ? indexInRow : (COLS - 1 - indexInRow);
  return { row, col };
}

// Cell colors - green theme (2 shades, pseudo-random distribution)
export const GREEN_DARK = '#2D6A4F';
export const GREEN_LIGHT = '#52B788';
export const START_COLOR = '#FFD93D';
export const END_COLOR = '#FF6B35';

export function getCellColor(position: number): string {
  // Start fields (1-2) = yellow
  if (position <= 2) return START_COLOR;
  // End fields (41-42) = orange
  if (position >= 41) return END_COLOR;
  // Pseudo-random distribution of 2 green shades (deterministic by position)
  const hash = ((position * 31 + 7) * 13 + position * 5) % 2;
  return hash === 0 ? GREEN_DARK : GREEN_LIGHT;
}

// Text color for cell number based on background
export function getCellTextColor(position: number): string {
  if (position <= 2) return '#7C4A00';
  if (position >= 41) return '#fff';
  return '#fff'; // both green shades use white text
}

// Get a random word from the list (excluding recently used if possible)
export function getRandomWord(usedIndices: number[] = [], wordList: KaceLestveWord[] = KACE_WORDS_C): { word: KaceLestveWord; index: number } {
  const available = wordList
    .map((w, i) => i)
    .filter(i => !usedIndices.includes(i));
  
  const pool = available.length > 0 ? available : wordList.map((_, i) => i);
  const index = pool[Math.floor(Math.random() * pool.length)];
  return { word: wordList[index], index };
}

// Dragon avatars (only 2 choices: blue and red figure)
export const DRAGON_AVATARS = [
  "Zmajcek_modra_figura_1.webp",
  "Zmajcek_rdeca_figura_1.webp",
];
