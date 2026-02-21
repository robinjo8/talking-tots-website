// Konfiguracija za igro "Interaktivni met kocke"

export interface MetKockeWord {
  word: string;        // Beseda za prikaz
  image: string;       // Ime slike v bucketu 'slike'
  audio: string;       // Ime zvoka v bucketu 'zvocni-posnetki'
}

export interface MetKockeLetterConfig {
  letter: string;         // npr. "s"
  displayLetter: string;  // npr. "S"
  title: string;          // npr. "GLAS S"
  bitje: MetKockeWord[];  // 6 besed za 1. stolpec (BITJE/KDO)
  povedek: MetKockeWord[]; // 6 besed za 2. stolpec (POVEDEK/KAJ DELA)
  predmet: MetKockeWord[]; // 6 besed za 3. stolpec (PREDMET)
}

// Stickman slike za POVEDEK stolpec (enake za vse črke)
const stickmanPovedek: MetKockeWord[] = [
  { word: "je", image: "Stickman_jesti.webp", audio: "je.m4a" },
  { word: "vidi", image: "Stickman_gledati.webp", audio: "vidi.m4a" },
  { word: "ima", image: "Stickman_imeti.webp", audio: "ima.m4a" },
  { word: "riše", image: "Stickman_risati.webp", audio: "rise.m4a" },
  { word: "nese", image: "Stickman_nesti.webp", audio: "nese.m4a" },
  { word: "želi", image: "Stickman_zeleti.png.webp", audio: "zeli.m4a" },
];

// Konfiguracija za črko S
export const metKockeS: MetKockeLetterConfig = {
  letter: "s",
  displayLetter: "S",
  title: "GLAS S",
  bitje: [
    { word: "slon", image: "slon1.webp", audio: "slon.m4a" },
    { word: "sova", image: "sova1.webp", audio: "sova.m4a" },
    { word: "snežak", image: "snezak1.webp", audio: "snezak.m4a" },
    { word: "los", image: "los1.webp", audio: "los.m4a" },
    { word: "osa", image: "osa1.webp", audio: "osa.m4a" },
    { word: "ris", image: "ris1.webp", audio: "ris.m4a" },
  ],
  povedek: stickmanPovedek,
  predmet: [
    { word: "sliko", image: "slika1.webp", audio: "sliko.m4a" },
    { word: "smreko", image: "smreka1.webp", audio: "smreko.m4a" },
    { word: "sir", image: "sir1.webp", audio: "sir.m4a" },
    { word: "sladoled", image: "sladoled1.webp", audio: "sladoled.m4a" },
    { word: "kost", image: "kost1.webp", audio: "kost.m4a" },
    { word: "list", image: "list1.webp", audio: "list.m4a" },
  ],
};

// Konfiguracija za črko Z
export const metKockeZ: MetKockeLetterConfig = {
  letter: "z",
  displayLetter: "Z",
  title: "GLAS Z",
  bitje: [
    { word: "zajec", image: "zajec1.webp", audio: "zajec.m4a" },
    { word: "zebra", image: "zebra1.webp", audio: "zebra.m4a" },
    { word: "zmaj", image: "zmaj1.webp", audio: "zmaj.m4a" },
    { word: "koza", image: "koza1.webp", audio: "koza.m4a" },
    { word: "meduza", image: "meduza1.webp", audio: "meduza.m4a" },
    { word: "dinozaver", image: "dinozaver1.webp", audio: "dinozaver.m4a" },
  ],
  povedek: stickmanPovedek,
  predmet: [
    { word: "liziko", image: "lizika1.webp", audio: "liziko.m4a" },
    { word: "vazo", image: "vaza1.webp", audio: "vazo.m4a" },
    { word: "zvezek", image: "zvezek1.webp", audio: "zvezek.m4a" },
    { word: "koruzo", image: "koruza1.webp", audio: "koruzo.m4a" },
    { word: "zvezdo", image: "zvezda1.webp", audio: "zvezdo.m4a" },
    { word: "zlato", image: "zlato1.webp", audio: "zlato.m4a" },
  ],
};

// Konfiguracija za črko C
export const metKockeC: MetKockeLetterConfig = {
  letter: "c",
  displayLetter: "C",
  title: "GLAS C",
  bitje: [
    { word: "raca", image: "raca1.webp", audio: "raca.m4a" },
    { word: "zajec", image: "zajec1.webp", audio: "zajec.m4a" },
    { word: "opica", image: "opica1.webp", audio: "opica.m4a" },
    { word: "vrabec", image: "vrabec1.webp", audio: "vrabec.m4a" },
    { word: "muca", image: "muca1.webp", audio: "muca.m4a" },
    { word: "lovec", image: "lovec1.webp", audio: "lovec.m4a" },
  ],
  povedek: stickmanPovedek,
  predmet: [
    { word: "cekin", image: "cekin1.webp", audio: "cekin.m4a" },
    { word: "copat", image: "copat1.webp", audio: "copat.m4a" },
    { word: "lubenico", image: "lubenica1.webp", audio: "lubenico.m4a" },
    { word: "pico", image: "pica1.webp", audio: "pico.m4a" },
    { word: "cvet", image: "cvet1.webp", audio: "cvet.m4a" },
    { word: "kocko", image: "kocka1.webp", audio: "kocko.m4a" },
  ],
};

// Konfiguracija za črko Š
export const metKockeSH: MetKockeLetterConfig = {
  letter: "sh",
  displayLetter: "Š",
  title: "GLAS Š",
  bitje: [
    { word: "štorklja", image: "storklja1.webp", audio: "storklja.m4a" },
    { word: "kokoš", image: "kokos1.webp", audio: "kokos.m4a" },
    { word: "miš", image: "mis1.webp", audio: "mis.m4a" },
    { word: "nogometaš", image: "nogometas1.webp", audio: "nogometas.m4a" },
    { word: "rokometaš", image: "rokometas1.webp", audio: "rokometas.m4a" },
    { word: "šofer", image: "sofer1.webp", audio: "sofer.m4a" },
  ],
  povedek: stickmanPovedek,
  predmet: [
    { word: "škatlo", image: "skatla1.webp", audio: "skatlo.m4a" },
    { word: "piškot", image: "piskot1.webp", audio: "piskot.m4a" },
    { word: "škarje", image: "skarje1.webp", audio: "skarje.m4a" },
    { word: "šopek", image: "sopek1.webp", audio: "sopek.m4a" },
    { word: "hruško", image: "hruska1.webp", audio: "hrusko.m4a" },
    { word: "koš", image: "kos1.webp", audio: "kos.m4a" },
  ],
};

// Konfiguracija za črko Ž
export const metKockeZH: MetKockeLetterConfig = {
  letter: "zh",
  displayLetter: "Ž",
  title: "GLAS Ž",
  bitje: [
    { word: "žaba", image: "zaba1.webp", audio: "zaba.m4a" },
    { word: "želva", image: "zelva1.webp", audio: "zelva.m4a" },
    { word: "žirafa", image: "zirafa1.webp", audio: "zirafa.m4a" },
    { word: "žolna", image: "zolna1.webp", audio: "zolna.m4a" },
    { word: "deževnik", image: "dezevnik1.webp", audio: "dezevnik.m4a" },
    { word: "kuža", image: "kuza1.webp", audio: "kuza.m4a" },
  ],
  povedek: stickmanPovedek,
  predmet: [
    { word: "fižol", image: "fizol1.webp", audio: "fizol.m4a" },
    { word: "rožo", image: "roza1.webp", audio: "rozo.m4a" },
    { word: "dežnik", image: "deznik1.webp", audio: "deznik.m4a" },
    { word: "žogo", image: "zoga1.webp", audio: "zogo.m4a" },
    { word: "žlico", image: "zlica1.webp", audio: "zlico.m4a" },
    { word: "krožnik", image: "kroznik1.webp", audio: "kroznik.m4a" },
  ],
};

// Konfiguracija za črko Č
export const metKockeCH: MetKockeLetterConfig = {
  letter: "ch",
  displayLetter: "Č",
  title: "GLAS Č",
  bitje: [
    { word: "čebela", image: "cebela1.webp", audio: "cebela.m4a" },
    { word: "kača", image: "kaca1.webp", audio: "kaca.m4a" },
    { word: "ptič", image: "ptic1.webp", audio: "ptic.m4a" },
    { word: "ribič", image: "ribic1.webp", audio: "ribic.m4a" },
    { word: "čebelar", image: "cebelar1.webp", audio: "cebelar.m4a" },
    { word: "čarovnik", image: "carovnik1.webp", audio: "carovnik.m4a" },
  ],
  povedek: stickmanPovedek,
  predmet: [
    { word: "čebulo", image: "cebula1.webp", audio: "cebulo.m4a" },
    { word: "čevlje", image: "cevlji1.webp", audio: "cevlje.m4a" },
    { word: "čaj", image: "caj1.webp", audio: "caj.m4a" },
    { word: "očala", image: "ocala1.webp", audio: "ocala.m4a" },
    { word: "kolač", image: "kolac1.webp", audio: "kolac.m4a" },
    { word: "čopič", image: "copic1.webp", audio: "copic.m4a" },
  ],
};

// Konfiguracija za črko L
export const metKockeL: MetKockeLetterConfig = {
  letter: "l",
  displayLetter: "L",
  title: "GLAS L",
  bitje: [
    { word: "lev", image: "lev1.webp", audio: "lev.m4a" },
    { word: "čebela", image: "cebela1.webp", audio: "cebela.m4a" },
    { word: "slon", image: "slon1.webp", audio: "slon.m4a" },
    { word: "štorklja", image: "storklja1.webp", audio: "storklja.m4a" },
    { word: "želva", image: "zelva1.webp", audio: "zelva.m4a" },
    { word: "lisica", image: "lisica1.webp", audio: "lisica.m4a" },
  ],
  povedek: stickmanPovedek,
  predmet: [
    { word: "led", image: "led1.webp", audio: "led.m4a" },
    { word: "lopar", image: "lopar1.webp", audio: "lopar.m4a" },
    { word: "luč", image: "luc1.webp", audio: "luc.m4a" },
    { word: "balon", image: "balon1.webp", audio: "balon.m4a" },
    { word: "čokolado", image: "cokolada1.webp", audio: "cokolado.m4a" },
    { word: "kolo", image: "kolo1.webp", audio: "kolo.m4a" },
  ],
};

// Konfiguracija za črko R
export const metKockeR: MetKockeLetterConfig = {
  letter: "r",
  displayLetter: "R",
  title: "GLAS R",
  bitje: [
    { word: "raca", image: "raca1.webp", audio: "raca.m4a" },
    { word: "rak", image: "rak1.webp", audio: "rak.m4a" },
    { word: "riba", image: "riba1.webp", audio: "riba.m4a" },
    { word: "robot", image: "robot1.webp", audio: "robot.m4a" },
    { word: "bober", image: "bober1.webp", audio: "bober.m4a" },
    { word: "mrož", image: "mroz1.webp", audio: "mroz.m4a" },
  ],
  povedek: stickmanPovedek,
  predmet: [
    { word: "repo", image: "repa1.webp", audio: "repo.m4a" },
    { word: "raketo", image: "raketa1.webp", audio: "raketo.m4a" },
    { word: "roko", image: "roka1.webp", audio: "roko.m4a" },
    { word: "drevo", image: "drevo1.webp", audio: "drevo.m4a" },
    { word: "torbo", image: "torba1.webp", audio: "torbo.m4a" },
    { word: "uro", image: "ura1.webp", audio: "uro.m4a" },
  ],
};

// Konfiguracija za črko K
export const metKockeK: MetKockeLetterConfig = {
  letter: "k",
  displayLetter: "K",
  title: "GLAS K",
  bitje: [
    { word: "kača", image: "kaca1.webp", audio: "kaca.m4a" },
    { word: "kokoš", image: "kokos1.webp", audio: "kokos.m4a" },
    { word: "koza", image: "koza1.webp", audio: "koza.m4a" },
    { word: "krava", image: "krava1.webp", audio: "krava.m4a" },
    { word: "bik", image: "bik1.webp", audio: "bik.m4a" },
    { word: "pajek", image: "pajek1.webp", audio: "pajek.m4a" },
  ],
  povedek: stickmanPovedek,
  predmet: [
    { word: "kapo", image: "kapa1.webp", audio: "kapo.m4a" },
    { word: "knjigo", image: "knjiga1.webp", audio: "knjigo.m4a" },
    { word: "kokos", image: "kokos_sadez1.webp", audio: "kokos_sadez.m4a" },
    { word: "koš", image: "kos1.webp", audio: "kos.m4a" },
    { word: "dežnik", image: "deznik1.webp", audio: "deznik.m4a" },
    { word: "jabolko", image: "jabolko1.webp", audio: "jabolko.m4a" },
  ],
};

// Mapa vseh konfiguracij
export const metKockeConfigs: Record<string, MetKockeLetterConfig> = {
  s: metKockeS,
  z: metKockeZ,
  c: metKockeC,
  sh: metKockeSH,
  zh: metKockeZH,
  ch: metKockeCH,
  l: metKockeL,
  r: metKockeR,
  k: metKockeK,
};

// Funkcija za pridobitev konfiguracije
export function getMetKockeConfig(letter: string): MetKockeLetterConfig | null {
  const normalizedLetter = letter.toLowerCase();
  return metKockeConfigs[normalizedLetter] || null;
}

// Seznam črk za selekcijsko stran
export const metKockeLetters = [
  { id: "s", letter: "S", title: "Glas S", path: "/govorne-igre/met-kocke/s", gradient: "from-dragon-green/20 to-app-teal/20" },
  { id: "z", letter: "Z", title: "Glas Z", path: "/govorne-igre/met-kocke/z", gradient: "from-app-teal/20 to-dragon-green/20" },
  { id: "c", letter: "C", title: "Glas C", path: "/govorne-igre/met-kocke/c", gradient: "from-dragon-green/20 to-dragon-green/20" },
  { id: "sh", letter: "Š", title: "Glas Š", path: "/govorne-igre/met-kocke/sh", gradient: "from-app-blue/20 to-app-purple/20" },
  { id: "zh", letter: "Ž", title: "Glas Ž", path: "/govorne-igre/met-kocke/zh", gradient: "from-app-purple/20 to-app-blue/20" },
  { id: "ch", letter: "Č", title: "Glas Č", path: "/govorne-igre/met-kocke/ch", gradient: "from-app-blue/20 to-app-teal/20" },
  { id: "k", letter: "K", title: "Glas K", path: "/govorne-igre/met-kocke/k", gradient: "from-app-orange/20 to-app-yellow/20" },
  { id: "l", letter: "L", title: "Glas L", path: "/govorne-igre/met-kocke/l", gradient: "from-app-purple/20 to-app-blue/20" },
  { id: "r", letter: "R", title: "Glas R", path: "/govorne-igre/met-kocke/r", gradient: "from-app-purple/20 to-app-teal/20" },
];
