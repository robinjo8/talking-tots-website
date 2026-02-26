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
  { text: "BOROVNICE", image: "borovnice1.webp", audio: "borovnice.m4a", acceptedVariants: ["BOROVNICE", "BOROVNICA", "BORONICA", "BOROVNICE!", "BOROVNIC", "BOROVNCE"] },
  { text: "KOCKA", image: "kocka1.webp", audio: "kocka.m4a", acceptedVariants: ["KOCKA", "COCKA", "KOTKA", "KOCKE", "KOCKI", "KOCKO", "KOCKA!"] },
  { text: "KOZAREC", image: "kozarec1.webp", audio: "kozarec.m4a", acceptedVariants: ["KOZAREC", "KOZAREC!", "KOZARCE", "KOZARCI", "KOZARCA"] },
  { text: "LONEC", image: "lonec1.webp", audio: "lonec.m4a", acceptedVariants: ["LONEC", "LONAC", "LONC", "LONEC!", "LONCA"] },
  { text: "LUBENICA", image: "lubenica1.webp", audio: "lubenica.m4a", acceptedVariants: ["LUBENICA", "LUBENICE", "LUBENICI", "LUBENICO", "LUBENICA!"] },
  { text: "NOGAVICE", image: "nogavice1.webp", audio: "nogavice.m4a", acceptedVariants: ["NOGAVICE", "NOGAVICA", "NOGAVICI", "NOGAVICO", "NOGAVICE!"] },
  { text: "PICA", image: "pica1.webp", audio: "pica.m4a", acceptedVariants: ["PICA", "PITA", "PIZA", "PIZZA", "PICE", "PICI", "PICO", "PICA!"] },
  { text: "RACA", image: "raca1.webp", audio: "raca.m4a", acceptedVariants: ["RACA", "RACE", "RACI", "RACO", "RACA!"] },
  { text: "ROPOTULJICA", image: "ropotuljica1.webp", audio: "ropotuljica.m4a", acceptedVariants: ["ROPOTULJICA", "ROPOTULICA", "ROPOTLJICA", "ROPOTULJICE", "ROPOTULJICA!"] },
  { text: "SONCE", image: "sonce1.webp", audio: "sonce.m4a", acceptedVariants: ["SONCE", "SONCA", "SONCU", "SONCE!", "SUNCE", "SONC"] },
  { text: "VETRNICA", image: "veternica1.webp", audio: "veternica.m4a", acceptedVariants: ["VETRNICA", "VETRNICE", "VETRNICI", "VETRNICO", "VETRNICA!", "VETERNICA"] },
  { text: "VILICE", image: "vilica1.webp", audio: "vilice.m4a", acceptedVariants: ["VILICE", "VILICA", "VILICI", "VILICO", "VILCE", "VILICE!"] },
  { text: "ZAJEC", image: "zajec1.webp", audio: "zajec.m4a", acceptedVariants: ["ZAJEC", "ZAJCA", "ZAJCU", "ZAJCI", "ZAJEC!"] },
  { text: "ZOBOTREBEC", image: "zobotrebec1.webp", audio: "zobotrebec.m4a", acceptedVariants: ["ZOBOTREBEC", "ZOBOTREBCA", "ZOBOTREBEC!", "ZOBOTREBCI"] },
  { text: "ŽARNICA", image: "zarnica1.webp", audio: "zarnica.m4a", acceptedVariants: ["ZARNICA", "ŽARNICA", "ZARNICE", "ZARNICI", "ZARNICO", "ŽARNICE"] },
  { text: "ŽLICA", image: "zlica1.webp", audio: "zlica.m4a", acceptedVariants: ["ZLICA", "ŽLICA", "SLICA", "ZLICE", "ZLICI", "ZLICO", "ŽLICE"] },
];

// Words for sound S (middle/end position)
export const KACE_WORDS_S: KaceLestveWord[] = [
  { text: "CESTA", image: "cesta1.webp", audio: "cesta.m4a", acceptedVariants: ["CESTA", "CESTO", "CESTE", "CESTI", "CESTA!"] },
  { text: "CIRKUS", image: "cirkus1.webp", audio: "cirkus.m4a", acceptedVariants: ["CIRKUS", "CIRKUS!", "CIRKUSA", "CIRCUS"] },
  { text: "CISTERNA", image: "cisterna1.webp", audio: "cisterna.m4a", acceptedVariants: ["CISTERNA", "CISTERNO", "CISTERNE", "CISTERNA!"] },
  { text: "ČASOPIS", image: "casopis1.webp", audio: "casopis.m4a", acceptedVariants: ["CASOPIS", "ČASOPIS", "ČASOPIS!", "CASOPISA", "ČASOPISA"] },
  { text: "ČESEN", image: "cesen1.webp", audio: "cesen.m4a", acceptedVariants: ["CESEN", "ČESEN", "ČESNA", "CESNA", "ČESEN!"] },
  { text: "KOKOS", image: "kokos_sadez1.webp", audio: "kokos_sadez.m4a", acceptedVariants: ["KOKOS", "KOKOS!", "KOKOSA", "KOKOSU"] },
  { text: "KOST", image: "kost1.webp", audio: "kost.m4a", acceptedVariants: ["KOST", "KOST!", "KOSTI", "KOSTU"] },
  { text: "LIST", image: "list1.webp", audio: "list.m4a", acceptedVariants: ["LIST", "LIST!", "LISTA", "LISTU", "LISTI"] },
  { text: "NOS", image: "nos1.webp", audio: "nos.m4a", acceptedVariants: ["NOS", "NOS!", "NOSA", "NOSU"] },
  { text: "OSA", image: "osa1.webp", audio: "osa.m4a", acceptedVariants: ["OSA", "OSA!", "OSO", "OSE", "OSI"] },
  { text: "PAS", image: "pas1.webp", audio: "pas.m4a", acceptedVariants: ["PAS", "PAS!", "PSA", "PSU", "PSI"] },
  { text: "LOS", image: "los1.webp", audio: "los.m4a", acceptedVariants: ["LOS", "LOS!", "LOSA", "LOSU"] },
  { text: "ZASLON", image: "zaslon1.webp", audio: "zaslon.m4a", acceptedVariants: ["ZASLON", "ZASLON!", "ZASLONA", "ZASLONU"] },
  { text: "ZAVESA", image: "zavesa1.webp", audio: "zavesa.m4a", acceptedVariants: ["ZAVESA", "ZAVESO", "ZAVESE", "ZAVESA!"] },
  { text: "LASJE", image: "lasje1.webp", audio: "lasje.m4a", acceptedVariants: ["LASJE", "LASJE!", "LAS", "LASI"] },
  { text: "RIS", image: "ris1.webp", audio: "ris.m4a", acceptedVariants: ["RIS", "RIS!", "RISA", "RISU"] },
];

// Words for sound Z (middle/end position)
export const KACE_WORDS_Z: KaceLestveWord[] = [
  { text: "JEZIK", image: "jezik1.webp", audio: "jezik.m4a", acceptedVariants: ["JEZIK", "JEZIK!", "JEZIKA", "JEZIKU"] },
  { text: "KOZA", image: "koza1.webp", audio: "koza.m4a", acceptedVariants: ["KOZA", "KOZO", "KOZE", "KOZI", "KOZA!"] },
  { text: "KOZAREC", image: "kozarec1.webp", audio: "kozarec.m4a", acceptedVariants: ["KOZAREC", "KOZAREC!", "KOZARCE", "KOZARCI", "KOZARCA"] },
  { text: "LIZIKA", image: "lizika1.webp", audio: "lizika.m4a", acceptedVariants: ["LIZIKA", "LIZIKO", "LIZIKE", "LIZIKA!"] },
  { text: "MEDUZA", image: "meduza1.webp", audio: "meduza.m4a", acceptedVariants: ["MEDUZA", "MEDUZO", "MEDUZE", "MEDUZA!"] },
  { text: "MIZA", image: "miza1.webp", audio: "miza.m4a", acceptedVariants: ["MIZA", "MIZO", "MIZE", "MIZI", "MIZA!"] },
  { text: "SLUZ", image: "sluz1.webp", audio: "sluz.m4a", acceptedVariants: ["SLUZ", "SLUZ!", "SLUZI", "SLUZU"] },
  { text: "VAZA", image: "vaza1.webp", audio: "vaza.m4a", acceptedVariants: ["VAZA", "VAZO", "VAZE", "VAZI", "VAZA!"] },
  { text: "ZVEZEK", image: "zvezek1.webp", audio: "zvezek.m4a", acceptedVariants: ["ZVEZEK", "ZVEZEK!", "ZVEZKA", "ZVEZKU"] },
  { text: "ZVEZDA", image: "zvezda1.webp", audio: "zvezda.m4a", acceptedVariants: ["ZVEZDA", "ZVEZDO", "ZVEZDE", "ZVEZDA!"] },
  { text: "DINOZAVER", image: "dinozaver1.webp", audio: "dinozaver.m4a", acceptedVariants: ["DINOZAVER", "DINOZAVER!", "DINOZAVRA", "DINOZAVRU"] },
  { text: "GNEZDO", image: "gnezdo1.webp", audio: "gnezdo.m4a", acceptedVariants: ["GNEZDO", "GNEZDO!", "GNEZDA", "GNEZDU"] },
  { text: "GROZDJE", image: "grozdje1.webp", audio: "grozdje.m4a", acceptedVariants: ["GROZDJE", "GROZDJE!", "GROZDJA", "GROZDJU"] },
  { text: "KORUZA", image: "koruza1.webp", audio: "koruza.m4a", acceptedVariants: ["KORUZA", "KORUZO", "KORUZE", "KORUZA!"] },
  { text: "TELEVIZIJA", image: "televizija1.webp", audio: "televizija.m4a", acceptedVariants: ["TELEVIZIJA", "TELEVIZIJO", "TELEVIZIJE", "TELEVIZIJA!"] },
  { text: "VEZALKE", image: "vezalke1.webp", audio: "vezalke.m4a", acceptedVariants: ["VEZALKE", "VEZALKE!", "VEZALK", "VEZALKA"] },
];

// Words for sound Š (middle/end position)
export const KACE_WORDS_SH: KaceLestveWord[] = [
  { text: "HIŠA", image: "hisa1.webp", audio: "hisa.m4a", acceptedVariants: ["HISA", "HIŠA", "HISO", "HIŠO", "HIŠE", "HIŠA!"] },
  { text: "HRUŠKA", image: "hruska1.webp", audio: "hruska.m4a", acceptedVariants: ["HRUSKA", "HRUŠKA", "HRUŠKO", "HRUŠKE", "HRUŠKA!"] },
  { text: "KOKOŠ", image: "kokos1.webp", audio: "kokos.m4a", acceptedVariants: ["KOKOS", "KOKOŠ", "KOKOŠI", "KOKOŠO", "KOKOŠ!"] },
  { text: "KOŠ", image: "kos1.webp", audio: "kos.m4a", acceptedVariants: ["KOS", "KOŠ", "KOŠA", "KOŠU", "KOŠ!"] },
  { text: "KOŠARA", image: "kosara1.webp", audio: "kosara.m4a", acceptedVariants: ["KOSARA", "KOŠARA", "KOŠARO", "KOŠARE", "KOŠARA!"] },
  { text: "MIŠ", image: "mis1.webp", audio: "mis.m4a", acceptedVariants: ["MIS", "MIŠ", "MIŠI", "MIŠO", "MIŠ!"] },
  { text: "PIŠKOT", image: "piskot1.webp", audio: "piskot.m4a", acceptedVariants: ["PISKOT", "PIŠKOT", "PIŠKOTA", "PIŠKOTU", "PIŠKOT!"] },
  { text: "POŠTA", image: "posta1.webp", audio: "posta.m4a", acceptedVariants: ["POSTA", "POŠTA", "POŠTO", "POŠTE", "POŠTA!"] },
  { text: "TUŠ", image: "tus1.webp", audio: "tus.m4a", acceptedVariants: ["TUS", "TUŠ", "TUŠA", "TUŠU", "TUŠ!"] },
  { text: "LEŠNIK", image: "lesnik1.webp", audio: "lesnik.m4a", acceptedVariants: ["LESNIK", "LEŠNIK", "LEŠNIKA", "LEŠNIKU", "LEŠNIK!"] },
  { text: "MUŠNICA", image: "musnica1.webp", audio: "musnica.m4a", acceptedVariants: ["MUSNICA", "MUŠNICA", "MUŠNICO", "MUŠNICE", "MUŠNICA!"] },
  { text: "NOGOMETAŠ", image: "nogometas1.webp", audio: "nogometas.m4a", acceptedVariants: ["NOGOMETAS", "NOGOMETAŠ", "NOGOMETAŠA", "NOGOMETAŠU", "NOGOMETAŠ!"] },
  { text: "OBEŠALNIK", image: "obesalnik1.webp", audio: "obesalnik.m4a", acceptedVariants: ["OBESALNIK", "OBEŠALNIK", "OBEŠALNIKA", "OBEŠALNIKU", "OBEŠALNIK!"] },
  { text: "PAŠTETA", image: "pasteta1.webp", audio: "pasteta.m4a", acceptedVariants: ["PASTETA", "PAŠTETA", "PAŠTETO", "PAŠTETE", "PAŠTETA!"] },
  { text: "ROKOMETAŠ", image: "rokometas1.webp", audio: "rokometas.m4a", acceptedVariants: ["ROKOMETAS", "ROKOMETAŠ", "ROKOMETAŠA", "ROKOMETAŠU", "ROKOMETAŠ!"] },
  { text: "VIŠNJA", image: "visnja1.webp", audio: "visnja.m4a", acceptedVariants: ["VISNJA", "VIŠNJA", "VIŠNJO", "VIŠNJE", "VIŠNJA!"] },
];

// Words for sound Ž (middle/end position)
export const KACE_WORDS_ZH: KaceLestveWord[] = [
  { text: "DEŽEVNIK", image: "dezevnik1.webp", audio: "dezevnik.m4a", acceptedVariants: ["DEZEVNIK", "DEŽEVNIK", "DEŽEVNIKA", "DEŽEVNIKU", "DEŽEVNIK!"] },
  { text: "DEŽNIK", image: "deznik1.webp", audio: "deznik.m4a", acceptedVariants: ["DEZNIK", "DEŽNIK", "DEŽNIKA", "DEŽNIKU", "DEŽNIK!"] },
  { text: "FIŽOL", image: "fizol1.webp", audio: "fizol.m4a", acceptedVariants: ["FIZOL", "FIŽOL", "FIŽOLA", "FIŽOLU", "FIŽOL!"] },
  { text: "KROŽNIK", image: "kroznik1.webp", audio: "kroznik.m4a", acceptedVariants: ["KROZNIK", "KROŽNIK", "KROŽNIKA", "KROŽNIKU", "KROŽNIK!"] },
  { text: "KUŽA", image: "kuza1.webp", audio: "kuza.m4a", acceptedVariants: ["KUZA", "KUŽA", "KUŽO", "KUŽE", "KUŽA!"] },
  { text: "ROŽA", image: "roza1.webp", audio: "roza.m4a", acceptedVariants: ["ROZA", "ROŽA", "ROŽO", "ROŽE", "ROŽA!"] },
  { text: "SNEŽAK", image: "snezak1.webp", audio: "snezak.m4a", acceptedVariants: ["SNEZAK", "SNEŽAK", "SNEŽAKA", "SNEŽAKU", "SNEŽAK!"] },
  { text: "GARAŽA", image: "garaza1.webp", audio: "garaza.m4a", acceptedVariants: ["GARAZA", "GARAŽA", "GARAŽO", "GARAŽE", "GARAŽA!"] },
  { text: "KOŽA", image: "koza_skin1.webp", audio: "koza_skin.m4a", acceptedVariants: ["KOZA", "KOŽA", "KOŽO", "KOŽE", "KOŽA!"] },
  { text: "LUŽA", image: "luza1.webp", audio: "luza.m4a", acceptedVariants: ["LUZA", "LUŽA", "LUŽO", "LUŽE", "LUŽA!"] },
  { text: "MOŽGANI", image: "mozgani1.webp", audio: "mozgani.m4a", acceptedVariants: ["MOZGANI", "MOŽGANI", "MOŽGANOV", "MOŽGANOM", "MOŽGANI!"] },
  { text: "MREŽA", image: "mreza1.webp", audio: "mreza.m4a", acceptedVariants: ["MREZA", "MREŽA", "MREŽO", "MREŽE", "MREŽA!"] },
  { text: "PARADIŽNIK", image: "paradiznik1.webp", audio: "paradiznik.m4a", acceptedVariants: ["PARADIZNIK", "PARADIŽNIK", "PARADIŽNIKA", "PARADIŽNIKU", "PARADIŽNIK!"] },
  { text: "POŽAR", image: "pozar1.webp", audio: "pozar.m4a", acceptedVariants: ["POZAR", "POŽAR", "POŽARA", "POŽARU", "POŽAR!"] },
  { text: "SNEŽINKA", image: "snezinka1.webp", audio: "snezinka.m4a", acceptedVariants: ["SNEZINKA", "SNEŽINKA", "SNEŽINKO", "SNEŽINKE", "SNEŽINKA!"] },
  { text: "VERIŽICA", image: "verizica1.webp", audio: "verizica.m4a", acceptedVariants: ["VERIZICA", "VERIŽICA", "VERIŽICO", "VERIŽICE", "VERIŽICA!"] },
];

// Words for sound Č (middle/end position)
export const KACE_WORDS_CH: KaceLestveWord[] = [
  { text: "HLAČE", image: "hlace1.webp", audio: "hlace.m4a", acceptedVariants: ["HLACE", "HLAČE", "HLAČ", "HLAČAM", "HLAČE!"] },
  { text: "KAČA", image: "kaca1.webp", audio: "kaca.m4a", acceptedVariants: ["KACA", "KAČA", "KAČO", "KAČE", "KAČA!"] },
  { text: "KLJUČ", image: "kljuc1.webp", audio: "kljuc.m4a", acceptedVariants: ["KLJUC", "KLJUČ", "KLJUČA", "KLJUČU", "KLJUČ!"] },
  { text: "KOLAČ", image: "kolac1.webp", audio: "kolac.m4a", acceptedVariants: ["KOLAC", "KOLAČ", "KOLAČA", "KOLAČU", "KOLAČ!"] },
  { text: "LUČ", image: "luc1.webp", audio: "luc.m4a", acceptedVariants: ["LUC", "LUČ", "LUČI", "LUČO", "LUČ!"] },
  { text: "OČALA", image: "ocala1.webp", audio: "ocala.m4a", acceptedVariants: ["OCALA", "OČALA", "OČAL", "OČALOM", "OČALA!"] },
  { text: "OČI", image: "oci1.webp", audio: "oci.m4a", acceptedVariants: ["OCI", "OČI", "OČES", "OČI!"] },
  { text: "SVINČNIK", image: "svincnik1.webp", audio: "svincnik.m4a", acceptedVariants: ["SVINCNIK", "SVINČNIK", "SVINČNIKA", "SVINČNIKU", "SVINČNIK!"] },
  { text: "ŠČETKA", image: "scetka1.webp", audio: "scetka.m4a", acceptedVariants: ["SCETKA", "ŠČETKA", "ŠČETKO", "ŠČETKE", "ŠČETKA!"] },
  { text: "ZVOČNIK", image: "zvocnik1.webp", audio: "zvocnik.m4a", acceptedVariants: ["ZVOCNIK", "ZVOČNIK", "ZVOČNIKA", "ZVOČNIKU", "ZVOČNIK!"] },
  { text: "ČOPIČ", image: "copic1.webp", audio: "copic.m4a", acceptedVariants: ["COPIC", "ČOPIČ", "ČOPIČA", "ČOPIČU", "ČOPIČ!"] },
  { text: "NOČ", image: "noc1.webp", audio: "noc.m4a", acceptedVariants: ["NOC", "NOČ", "NOČI", "NOČO", "NOČ!"] },
  { text: "OBROČ", image: "obroc1.webp", audio: "obroc.m4a", acceptedVariants: ["OBROC", "OBROČ", "OBROČA", "OBROČU", "OBROČ!"] },
  { text: "PEČ", image: "pec1.webp", audio: "pec.m4a", acceptedVariants: ["PEC", "PEČ", "PEČI", "PEČO", "PEČ!"] },
  { text: "PTIČ", image: "ptic1.webp", audio: "ptic.m4a", acceptedVariants: ["PTIC", "PTIČ", "PTIČA", "PTIČU", "PTIČ!"] },
  { text: "RIBIČ", image: "ribic1.webp", audio: "ribic.m4a", acceptedVariants: ["RIBIC", "RIBIČ", "RIBIČA", "RIBIČU", "RIBIČ!"] },
];

// Words for sound K (middle/end position) - 37 words
export const KACE_WORDS_K: KaceLestveWord[] = [
  { text: "AVOKADO", image: "avokado1.webp", audio: "avokado.m4a", acceptedVariants: ["AVOKADO", "AVOKADO!", "AVOKADA", "AVOKADU"] },
  { text: "BIK", image: "bik1.webp", audio: "bik.m4a", acceptedVariants: ["BIK", "BIK!", "BIKA", "BIKU"] },
  { text: "CEKIN", image: "cekin1.webp", audio: "cekin.m4a", acceptedVariants: ["CEKIN", "CEKIN!", "CEKINA", "CEKINU"] },
  { text: "CERKEV", image: "cerkev1.webp", audio: "cerkev.m4a", acceptedVariants: ["CERKEV", "CERKEV!", "CERKVE", "CERKVI"] },
  { text: "CIRKUS", image: "cirkus1.webp", audio: "cirkus.m4a", acceptedVariants: ["CIRKUS", "CIRKUS!", "CIRKUSA", "CIRCUS"] },
  { text: "COKLA", image: "cokla1.webp", audio: "cokla.m4a", acceptedVariants: ["COKLA", "COKLA!", "COKLO", "COKLE"] },
  { text: "ČOKOLADA", image: "cokolada1.webp", audio: "cokolada.m4a", acceptedVariants: ["COKOLADA", "ČOKOLADA", "ČOKOLADO", "ČOKOLADE", "ČOKOLADA!"] },
  { text: "ČRKE", image: "crke1.webp", audio: "crke.m4a", acceptedVariants: ["CRKE", "ČRKE", "ČRK", "ČRKAM", "ČRKE!"] },
  { text: "DEŽEVNIK", image: "dezevnik1.webp", audio: "dezevnik.m4a", acceptedVariants: ["DEZEVNIK", "DEŽEVNIK", "DEŽEVNIKA", "DEŽEVNIKU", "DEŽEVNIK!"] },
  { text: "DEŽNIK", image: "deznik1.webp", audio: "deznik.m4a", acceptedVariants: ["DEZNIK", "DEŽNIK", "DEŽNIKA", "DEŽNIKU", "DEŽNIK!"] },
  { text: "HRUŠKA", image: "hruska1.webp", audio: "hruska.m4a", acceptedVariants: ["HRUSKA", "HRUŠKA", "HRUŠKO", "HRUŠKE", "HRUŠKA!"] },
  { text: "JABOLKO", image: "jabolko1.webp", audio: "jabolko.m4a", acceptedVariants: ["JABOLKO", "JABOLKO!", "JABOLKA", "JABOLKU"] },
  { text: "JEZIK", image: "jezik1.webp", audio: "jezik.m4a", acceptedVariants: ["JEZIK", "JEZIK!", "JEZIKA", "JEZIKU"] },
  { text: "KOKOŠ", image: "kokos1.webp", audio: "kokos.m4a", acceptedVariants: ["KOKOS", "KOKOŠ", "KOKOŠI", "KOKOŠO", "KOKOŠ!"] },
  { text: "LIZIKA", image: "lizika1.webp", audio: "lizika.m4a", acceptedVariants: ["LIZIKA", "LIZIKO", "LIZIKE", "LIZIKA!"] },
  { text: "OBLAK", image: "oblak1.webp", audio: "oblak.m4a", acceptedVariants: ["OBLAK", "OBLAK!", "OBLAKA", "OBLAKU"] },
  { text: "PAJEK", image: "pajek1.webp", audio: "pajek.m4a", acceptedVariants: ["PAJEK", "PAJEK!", "PAJEKA", "PAJEKU"] },
  { text: "PIŠKOT", image: "piskot1.webp", audio: "piskot.m4a", acceptedVariants: ["PISKOT", "PIŠKOT", "PIŠKOTA", "PIŠKOTU", "PIŠKOT!"] },
  { text: "RAK", image: "rak1.webp", audio: "rak.m4a", acceptedVariants: ["RAK", "RAK!", "RAKA", "RAKU"] },
  { text: "RAKETA", image: "raketa1.webp", audio: "raketa.m4a", acceptedVariants: ["RAKETA", "RAKETO", "RAKETE", "RAKETA!"] },
  { text: "ROKA", image: "roka1.webp", audio: "roka.m4a", acceptedVariants: ["ROKA", "ROKO", "ROKE", "ROKI", "ROKA!"] },
  { text: "ROLKA", image: "rolka1.webp", audio: "rolka.m4a", acceptedVariants: ["ROLKA", "ROLKO", "ROLKE", "ROLKA!"] },
  { text: "SLIKA", image: "slika1.webp", audio: "slika.m4a", acceptedVariants: ["SLIKA", "SLIKO", "SLIKE", "SLIKA!"] },
  { text: "SMREKA", image: "smreka1.webp", audio: "smreka.m4a", acceptedVariants: ["SMREKA", "SMREKO", "SMREKE", "SMREKA!"] },
  { text: "SNEŽAK", image: "snezak1.webp", audio: "snezak.m4a", acceptedVariants: ["SNEZAK", "SNEŽAK", "SNEŽAKA", "SNEŽAKU", "SNEŽAK!"] },
  { text: "SOK", image: "sok1.webp", audio: "sok.m4a", acceptedVariants: ["SOK", "SOK!", "SOKA", "SOKU"] },
  { text: "SVETILKA", image: "svetilka1.webp", audio: "svetilka.m4a", acceptedVariants: ["SVETILKA", "SVETILKO", "SVETILKE", "SVETILKA!"] },
  { text: "SVINČNIK", image: "svincnik1.webp", audio: "svincnik.m4a", acceptedVariants: ["SVINCNIK", "SVINČNIK", "SVINČNIKA", "SVINČNIKU", "SVINČNIK!"] },
  { text: "ŠČETKA", image: "scetka1.webp", audio: "scetka.m4a", acceptedVariants: ["SCETKA", "ŠČETKA", "ŠČETKO", "ŠČETKE", "ŠČETKA!"] },
  { text: "ŠKARJE", image: "skarje1.webp", audio: "skarje.m4a", acceptedVariants: ["SKARJE", "ŠKARJE", "ŠKARIJ", "ŠKARJE!"] },
  { text: "ŠKATLA", image: "skatla1.webp", audio: "skatla.m4a", acceptedVariants: ["SKATLA", "ŠKATLA", "ŠKATLO", "ŠKATLE", "ŠKATLA!"] },
  { text: "ŠKOLJKA", image: "skoljka1.webp", audio: "skoljka.m4a", acceptedVariants: ["SKOLJKA", "ŠKOLJKA", "ŠKOLJKO", "ŠKOLJKE", "ŠKOLJKA!"] },
  { text: "ŠOPEK", image: "sopek1.webp", audio: "sopek.m4a", acceptedVariants: ["SOPEK", "ŠOPEK", "ŠOPKA", "ŠOPKU", "ŠOPEK!"] },
  { text: "ŠTAMPILJKA", image: "stampiljka1.webp", audio: "stampiljka.m4a", acceptedVariants: ["STAMPILJKA", "ŠTAMPILJKA", "ŠTAMPILJKO", "ŠTAMPILJKE", "ŠTAMPILJKA!"] },
  { text: "ŠTORKLJA", image: "storklja1.webp", audio: "storklja.m4a", acceptedVariants: ["STORKLJA", "ŠTORKLJA", "ŠTORKLJO", "ŠTORKLJE", "ŠTORKLJA!"] },
  { text: "ZVOČNIK", image: "zvocnik1.webp", audio: "zvocnik.m4a", acceptedVariants: ["ZVOCNIK", "ZVOČNIK", "ZVOČNIKA", "ZVOČNIKU", "ZVOČNIK!"] },
];

// Words for sound L (middle/end position) - 42 words
export const KACE_WORDS_L: KaceLestveWord[] = [
  { text: "ALBUM", image: "album1.webp", audio: "album.m4a", acceptedVariants: ["ALBUM", "ALBUM!", "ALBUMA", "ALBUMU"] },
  { text: "ANGEL", image: "angel1.webp", audio: "angel.m4a", acceptedVariants: ["ANGEL", "ANGEL!", "ANGELA", "ANGELU"] },
  { text: "BALON", image: "balon1.webp", audio: "balon.m4a", acceptedVariants: ["BALON", "BALON!", "BALONA", "BALONU"] },
  { text: "CEDILO", image: "cedilo1.webp", audio: "cedilo.m4a", acceptedVariants: ["CEDILO", "CEDILO!", "CEDILA", "CEDILU"] },
  { text: "COKLA", image: "cokla1.webp", audio: "cokla.m4a", acceptedVariants: ["COKLA", "COKLA!", "COKLO", "COKLE"] },
  { text: "ČEBELA", image: "cebela1.webp", audio: "cebela.m4a", acceptedVariants: ["CEBELA", "ČEBELA", "ČEBELO", "ČEBELE", "ČEBELA!"] },
  { text: "ČEBULA", image: "cebula1.webp", audio: "cebula.m4a", acceptedVariants: ["CEBULA", "ČEBULA", "ČEBULO", "ČEBULE", "ČEBULA!"] },
  { text: "ČEVLJI", image: "cevlji1.webp", audio: "cevlji.m4a", acceptedVariants: ["CEVLJI", "ČEVLJI", "ČEVLJEV", "ČEVLJE", "ČEVLJI!"] },
  { text: "ČOKOLADA", image: "cokolada1.webp", audio: "cokolada.m4a", acceptedVariants: ["COKOLADA", "ČOKOLADA", "ČOKOLADO", "ČOKOLADE", "ČOKOLADA!"] },
  { text: "GOL", image: "gol1.webp", audio: "gol.m4a", acceptedVariants: ["GOL", "GOL!", "GOLA", "GOLU"] },
  { text: "HLAČE", image: "hlace1.webp", audio: "hlace.m4a", acceptedVariants: ["HLACE", "HLAČE", "HLAČ", "HLAČAM", "HLAČE!"] },
  { text: "KLAVIR", image: "klavir1.webp", audio: "klavir.m4a", acceptedVariants: ["KLAVIR", "KLAVIR!", "KLAVIRJA", "KLAVIRJU"] },
  { text: "KLJUČ", image: "kljuc1.webp", audio: "kljuc.m4a", acceptedVariants: ["KLJUC", "KLJUČ", "KLJUČA", "KLJUČU", "KLJUČ!"] },
  { text: "KLOP", image: "klop1.webp", audio: "klop.m4a", acceptedVariants: ["KLOP", "KLOP!", "KLOPI", "KLOPU"] },
  { text: "KOLAČ", image: "kolac1.webp", audio: "kolac.m4a", acceptedVariants: ["KOLAC", "KOLAČ", "KOLAČA", "KOLAČU", "KOLAČ!"] },
  { text: "KOLO", image: "kolo1.webp", audio: "kolo.m4a", acceptedVariants: ["KOLO", "KOLO!", "KOLESA", "KOLESU"] },
  { text: "LETALO", image: "letalo1.webp", audio: "letalo.m4a", acceptedVariants: ["LETALO", "LETALO!", "LETALA", "LETALU"] },
  { text: "METLA", image: "metla1.webp", audio: "metla.m4a", acceptedVariants: ["METLA", "METLO", "METLE", "METLA!"] },
  { text: "MILO", image: "milo1.webp", audio: "milo.m4a", acceptedVariants: ["MILO", "MILO!", "MILA", "MILU"] },
  { text: "OBLAK", image: "oblak1.webp", audio: "oblak.m4a", acceptedVariants: ["OBLAK", "OBLAK!", "OBLAKA", "OBLAKU"] },
  { text: "OČALA", image: "ocala1.webp", audio: "ocala.m4a", acceptedVariants: ["OCALA", "OČALA", "OČAL", "OČALOM", "OČALA!"] },
  { text: "RAVNILO", image: "ravnilo1.webp", audio: "ravnilo.m4a", acceptedVariants: ["RAVNILO", "RAVNILO!", "RAVNILA", "RAVNILU"] },
  { text: "ROLKA", image: "rolka1.webp", audio: "rolka.m4a", acceptedVariants: ["ROLKA", "ROLKO", "ROLKE", "ROLKA!"] },
  { text: "ROPOTULJICA", image: "ropotuljica1.webp", audio: "ropotuljica.m4a", acceptedVariants: ["ROPOTULJICA", "ROPOTULICA", "ROPOTULJICE", "ROPOTULJICA!"] },
  { text: "SLADOLED", image: "sladoled1.webp", audio: "sladoled.m4a", acceptedVariants: ["SLADOLED", "SLADOLED!", "SLADOLEDA", "SLADOLEDU"] },
  { text: "SLIKA", image: "slika1.webp", audio: "slika.m4a", acceptedVariants: ["SLIKA", "SLIKO", "SLIKE", "SLIKA!"] },
  { text: "SLON", image: "slon1.webp", audio: "slon.m4a", acceptedVariants: ["SLON", "SLON!", "SLONA", "SLONU"] },
  { text: "SLUZ", image: "sluz1.webp", audio: "sluz.m4a", acceptedVariants: ["SLUZ", "SLUZ!", "SLUZI", "SLUZU"] },
  { text: "SVETILKA", image: "svetilka1.webp", audio: "svetilka.m4a", acceptedVariants: ["SVETILKA", "SVETILKO", "SVETILKE", "SVETILKA!"] },
  { text: "ŠAL", image: "sal1.webp", audio: "sal.m4a", acceptedVariants: ["SAL", "ŠAL", "ŠALA", "ŠALU", "ŠAL!"] },
  { text: "ŠKATLA", image: "skatla1.webp", audio: "skatla.m4a", acceptedVariants: ["SKATLA", "ŠKATLA", "ŠKATLO", "ŠKATLE", "ŠKATLA!"] },
  { text: "ŠKOLJKA", image: "skoljka1.webp", audio: "skoljka.m4a", acceptedVariants: ["SKOLJKA", "ŠKOLJKA", "ŠKOLJKO", "ŠKOLJKE", "ŠKOLJKA!"] },
  { text: "ŠTAMPILJKA", image: "stampiljka1.webp", audio: "stampiljka.m4a", acceptedVariants: ["STAMPILJKA", "ŠTAMPILJKA", "ŠTAMPILJKO", "ŠTAMPILJKE", "ŠTAMPILJKA!"] },
  { text: "ŠTORKLJA", image: "storklja1.webp", audio: "storklja.m4a", acceptedVariants: ["STORKLJA", "ŠTORKLJA", "ŠTORKLJO", "ŠTORKLJE", "ŠTORKLJA!"] },
  { text: "TELEFON", image: "telefon1.webp", audio: "telefon.m4a", acceptedVariants: ["TELEFON", "TELEFON!", "TELEFONA", "TELEFONU"] },
  { text: "VILICA", image: "vilica1.webp", audio: "vilica.m4a", acceptedVariants: ["VILICA", "VILICO", "VILICE", "VILICA!"] },
  { text: "VOLAN", image: "volan1.webp", audio: "volan.m4a", acceptedVariants: ["VOLAN", "VOLAN!", "VOLANA", "VOLANU"] },
  { text: "ZASLON", image: "zaslon1.webp", audio: "zaslon.m4a", acceptedVariants: ["ZASLON", "ZASLON!", "ZASLONA", "ZASLONU"] },
  { text: "ZLATO", image: "zlato1.webp", audio: "zlato.m4a", acceptedVariants: ["ZLATO", "ZLATO!", "ZLATA", "ZLATU"] },
  { text: "ŽEBELJ", image: "zebelj1.webp", audio: "zebelj.m4a", acceptedVariants: ["ZEBELJ", "ŽEBELJ", "ŽEBLJA", "ŽEBLJU", "ŽEBELJ!"] },
  { text: "ŽELVA", image: "zelva1.webp", audio: "zelva.m4a", acceptedVariants: ["ZELVA", "ŽELVA", "ŽELVO", "ŽELVE", "ŽELVA!"] },
  { text: "ŽLICA", image: "zlica1.webp", audio: "zlica.m4a", acceptedVariants: ["ZLICA", "ŽLICA", "ŽLICO", "ŽLICE", "ŽLICA!"] },
];

// Words for sound R (middle/end position) - 35 words
export const KACE_WORDS_R: KaceLestveWord[] = [
  { text: "BOBER", image: "bober1.webp", audio: "bober.m4a", acceptedVariants: ["BOBER", "BOBER!", "BOBRA", "BOBRU"] },
  { text: "BOROVNICE", image: "borovnice1.webp", audio: "borovnice.m4a", acceptedVariants: ["BOROVNICE", "BOROVNICA", "BOROVNICE!", "BOROVNIC"] },
  { text: "CERKEV", image: "cerkev1.webp", audio: "cerkev.m4a", acceptedVariants: ["CERKEV", "CERKEV!", "CERKVE", "CERKVI"] },
  { text: "CIRKUS", image: "cirkus1.webp", audio: "cirkus.m4a", acceptedVariants: ["CIRKUS", "CIRKUS!", "CIRKUSA", "CIRCUS"] },
  { text: "CISTERNA", image: "cisterna1.webp", audio: "cisterna.m4a", acceptedVariants: ["CISTERNA", "CISTERNO", "CISTERNE", "CISTERNA!"] },
  { text: "ČRKE", image: "crke1.webp", audio: "crke.m4a", acceptedVariants: ["CRKE", "ČRKE", "ČRK", "ČRKAM", "ČRKE!"] },
  { text: "DREVO", image: "drevo1.webp", audio: "drevo.m4a", acceptedVariants: ["DREVO", "DREVO!", "DREVESA", "DREVESU"] },
  { text: "HRUŠKA", image: "hruska1.webp", audio: "hruska.m4a", acceptedVariants: ["HRUSKA", "HRUŠKA", "HRUŠKO", "HRUŠKE", "HRUŠKA!"] },
  { text: "KLAVIR", image: "klavir1.webp", audio: "klavir.m4a", acceptedVariants: ["KLAVIR", "KLAVIR!", "KLAVIRJA", "KLAVIRJU"] },
  { text: "KOŠARA", image: "kosara1.webp", audio: "kosara.m4a", acceptedVariants: ["KOSARA", "KOŠARA", "KOŠARO", "KOŠARE", "KOŠARA!"] },
  { text: "KOZAREC", image: "kozarec1.webp", audio: "kozarec.m4a", acceptedVariants: ["KOZAREC", "KOZAREC!", "KOZARCE", "KOZARCI", "KOZARCA"] },
  { text: "KRAVA", image: "krava1.webp", audio: "krava.m4a", acceptedVariants: ["KRAVA", "KRAVO", "KRAVE", "KRAVA!"] },
  { text: "KROF", image: "krof1.webp", audio: "krof.m4a", acceptedVariants: ["KROF", "KROF!", "KROFA", "KROFU"] },
  { text: "KROG", image: "krog1.webp", audio: "krog.m4a", acceptedVariants: ["KROG", "KROG!", "KROGA", "KROGU"] },
  { text: "KROŽNIK", image: "kroznik1.webp", audio: "kroznik.m4a", acceptedVariants: ["KROZNIK", "KROŽNIK", "KROŽNIKA", "KROŽNIKU", "KROŽNIK!"] },
  { text: "KRUH", image: "kruh1.webp", audio: "kruh.m4a", acceptedVariants: ["KRUH", "KRUH!", "KRUHA", "KRUHU"] },
  { text: "KUMARA", image: "kumara1.webp", audio: "kumara.m4a", acceptedVariants: ["KUMARA", "KUMARO", "KUMARE", "KUMARA!"] },
  { text: "LOPAR", image: "lopar1.webp", audio: "lopar.m4a", acceptedVariants: ["LOPAR", "LOPAR!", "LOPARJA", "LOPARJU"] },
  { text: "MROŽ", image: "mroz1.webp", audio: "mroz.m4a", acceptedVariants: ["MROZ", "MROŽ", "MROŽA", "MROŽU", "MROŽ!"] },
  { text: "OBRAZ", image: "obraz1.webp", audio: "obraz.m4a", acceptedVariants: ["OBRAZ", "OBRAZ!", "OBRAZA", "OBRAZU"] },
  { text: "OMARA", image: "omara1.webp", audio: "omara.m4a", acceptedVariants: ["OMARA", "OMARO", "OMARE", "OMARA!"] },
  { text: "SIR", image: "sir1.webp", audio: "sir.m4a", acceptedVariants: ["SIR", "SIR!", "SIRA", "SIRU"] },
  { text: "SMREKA", image: "smreka1.webp", audio: "smreka.m4a", acceptedVariants: ["SMREKA", "SMREKO", "SMREKE", "SMREKA!"] },
  { text: "ŠKARJE", image: "skarje1.webp", audio: "skarje.m4a", acceptedVariants: ["SKARJE", "ŠKARJE", "ŠKARIJ", "ŠKARJE!"] },
  { text: "ŠOTOR", image: "sotor1.webp", audio: "sotor.m4a", acceptedVariants: ["SOTOR", "ŠOTOR", "ŠOTORA", "ŠOTORU", "ŠOTOR!"] },
  { text: "ŠTORKLJA", image: "storklja1.webp", audio: "storklja.m4a", acceptedVariants: ["STORKLJA", "ŠTORKLJA", "ŠTORKLJO", "ŠTORKLJE", "ŠTORKLJA!"] },
  { text: "TORBA", image: "torba1.webp", audio: "torba.m4a", acceptedVariants: ["TORBA", "TORBO", "TORBE", "TORBA!"] },
  { text: "TROBENTA", image: "trobenta1.webp", audio: "trobenta.m4a", acceptedVariants: ["TROBENTA", "TROBENTO", "TROBENTE", "TROBENTA!"] },
  { text: "URA", image: "ura1.webp", audio: "ura.m4a", acceptedVariants: ["URA", "URO", "URE", "URA!"] },
  { text: "VETRNICA", image: "veternica1.webp", audio: "veternica.m4a", acceptedVariants: ["VETRNICA", "VETERNICA", "VETRNICO", "VETRNICE", "VETRNICA!"] },
  { text: "ZEBRA", image: "zebra1.webp", audio: "zebra.m4a", acceptedVariants: ["ZEBRA", "ZEBRO", "ZEBRE", "ZEBRA!"] },
  { text: "ZOBOTREBEC", image: "zobotrebec1.webp", audio: "zobotrebec.m4a", acceptedVariants: ["ZOBOTREBEC", "ZOBOTREBCA", "ZOBOTREBEC!", "ZOBOTREBCI"] },
  { text: "ŽARNICA", image: "zarnica1.webp", audio: "zarnica.m4a", acceptedVariants: ["ZARNICA", "ŽARNICA", "ŽARNICO", "ŽARNICE", "ŽARNICA!"] },
  { text: "ŽERJAV", image: "zerjav1.webp", audio: "zerjav.m4a", acceptedVariants: ["ZERJAV", "ŽERJAV", "ŽERJAVA", "ŽERJAVU", "ŽERJAV!"] },
  { text: "ŽIRAFA", image: "zirafa1.webp", audio: "zirafa.m4a", acceptedVariants: ["ZIRAFA", "ŽIRAFA", "ŽIRAFO", "ŽIRAFE", "ŽIRAFA!"] },
];

// Words for R beginning exercises (consonant clusters TR, BR, DR, PR)
export const KACE_WORDS_R_ZACETEK: KaceLestveWord[] = [
  { text: "DREVO", image: "drevo1.webp", audio: "drevo.m4a", acceptedVariants: ["DREVO", "DREVO!", "DREVÓ", "DREVO?", "DREVO.", "DERVO"] },
  { text: "TROBENTA", image: "trobenta1.webp", audio: "trobenta.m4a", acceptedVariants: ["TROBENTA", "TROBENTA!", "TROMPETA", "TROBENTO", "TOBENTA"] },
  { text: "TRI", image: "tri1.webp", audio: "tri.m4a", acceptedVariants: ["TRI", "TRI!", "TRI?", "3", "TI"] },
  { text: "TRIKOTNIK", image: "trikotnik1.webp", audio: "trikotnik.m4a", acceptedVariants: ["TRIKOTNIK", "TRIKOTNIK!", "TRIKOTNIKA", "TIKOTNIK"] },
  { text: "TRAVA", image: "trava1.webp", audio: "trava.m4a", acceptedVariants: ["TRAVA", "TRAVA!", "TRAVO", "TRAVE", "TAVA"] },
  { text: "TRAK", image: "trak1.webp", audio: "trak.m4a", acceptedVariants: ["TRAK", "TRAK!", "TRAKU", "TRAKA", "TAK"] },
  { text: "BRISAČA", image: "brisaca1.webp", audio: "brisaca.m4a", acceptedVariants: ["BRISAČA", "BRISACA", "BRISAČO", "BRISAČA!", "BISAČA"] },
  { text: "BRIKETI", image: "briketi1.webp", audio: "briketi.m4a", acceptedVariants: ["BRIKETI", "BRIKETI!", "BRIKET", "BRIKETE", "BIKETI"] },
  { text: "BRESKEV", image: "breskev1.webp", audio: "breskev.m4a", acceptedVariants: ["BRESKEV", "BRESKEV!", "BRESKVE", "BRESKVA", "BESKEV"] },
  { text: "BRADA", image: "brada1.webp", audio: "brada.m4a", acceptedVariants: ["BRADA", "BRADA!", "BRADO", "BRADE", "BADA"] },
  { text: "BROKOLI", image: "brokoli1.webp", audio: "brokoli.m4a", acceptedVariants: ["BROKOLI", "BROKOLI!", "BROKOLIJA", "BOKOLI"] },
  { text: "BRUSNICE", image: "brusnice1.webp", audio: "brusnice.m4a", acceptedVariants: ["BRUSNICE", "BRUSNICE!", "BRUSNICA", "BUSNICE"] },
  { text: "BREZA", image: "breza1.webp", audio: "breza.m4a", acceptedVariants: ["BREZA", "BREZA!", "BREZO", "BREZE", "BEZA"] },
  { text: "DRES", image: "dres1.webp", audio: "dres.m4a", acceptedVariants: ["DRES", "DRES!", "DRESU", "DRESA", "DES"] },
  { text: "DRAGULJ", image: "dragulj1.webp", audio: "dragulj.m4a", acceptedVariants: ["DRAGULJ", "DRAGULJ!", "DRAGULJA", "DAGULJA"] },
  { text: "DRON", image: "dron1.webp", audio: "dron.m4a", acceptedVariants: ["DRON", "DRON!", "DRONA", "DRONU", "DON"] },
  { text: "PRINC", image: "princ1.webp", audio: "princ.m4a", acceptedVariants: ["PRINC", "PRINC!", "PRINCA", "PRINCU", "PINC"] },
  { text: "PRESTA", image: "presta1.webp", audio: "presta.m4a", acceptedVariants: ["PRESTA", "PRESTA!", "PRESTO", "PRESTE", "PESTA"] },
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
