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
    { word: "slon", image: "slon.webp", audio: "slon.m4a" },
    { word: "sova", image: "sova.webp", audio: "sova.m4a" },
    { word: "snežak", image: "snezak.webp", audio: "snezak.m4a" },
    { word: "pes", image: "pes.webp", audio: "pes.m4a" },
    { word: "osa", image: "osa.webp", audio: "osa.m4a" },
    { word: "ris", image: "ris.webp", audio: "ris.m4a" },
  ],
  povedek: stickmanPovedek,
  predmet: [
    { word: "sliko", image: "slika.webp", audio: "sliko.m4a" },
    { word: "smreko", image: "smreka.webp", audio: "smreko.m4a" },
    { word: "sir", image: "sir.webp", audio: "sir.m4a" },
    { word: "sladoled", image: "sladoled.webp", audio: "sladoled.m4a" },
    { word: "kost", image: "kost.webp", audio: "kost.m4a" },
    { word: "list", image: "list.webp", audio: "list.m4a" },
  ],
};

// Konfiguracija za črko C
export const metKockeC: MetKockeLetterConfig = {
  letter: "c",
  displayLetter: "C",
  title: "GLAS C",
  bitje: [
    { word: "cica", image: "cica.webp", audio: "cica.m4a" },
    { word: "cvet", image: "cvet.webp", audio: "cvet.m4a" },
    { word: "zajec", image: "zajec.webp", audio: "zajec.m4a" },
    { word: "palec", image: "palec.webp", audio: "palec.m4a" },
    { word: "muca", image: "muca.webp", audio: "muca.m4a" },
    { word: "ovca", image: "ovca.webp", audio: "ovca.m4a" },
  ],
  povedek: stickmanPovedek,
  predmet: [
    { word: "liziko", image: "lizika.webp", audio: "liziko.m4a" },
    { word: "vazo", image: "vaza.webp", audio: "vazo.m4a" },
    { word: "zvezek", image: "zvezek.webp", audio: "zvezek.m4a" },
    { word: "koruzo", image: "koruza.webp", audio: "koruzo.m4a" },
    { word: "zvezdo", image: "zvezda.webp", audio: "zvezdo.m4a" },
    { word: "zlato", image: "zlato.webp", audio: "zlato.m4a" },
  ],
};

// Konfiguracija za črko Č
export const metKockeCH: MetKockeLetterConfig = {
  letter: "ch",
  displayLetter: "Č",
  title: "GLAS Č",
  bitje: [
    { word: "čebela", image: "cebela.webp", audio: "cebela.m4a" },
    { word: "črv", image: "crv.webp", audio: "crv.m4a" },
    { word: "račka", image: "racka.webp", audio: "racka.m4a" },
    { word: "sestrič", image: "sestric.webp", audio: "sestric.m4a" },
    { word: "bratič", image: "bratic.webp", audio: "bratic.m4a" },
    { word: "princeska", image: "princeska.webp", audio: "princeska.m4a" },
  ],
  povedek: stickmanPovedek,
  predmet: [
    { word: "čebulo", image: "cebula.webp", audio: "cebulo.m4a" },
    { word: "čevlje", image: "cevlji.webp", audio: "cevlje.m4a" },
    { word: "čaj", image: "caj.webp", audio: "caj.m4a" },
    { word: "očala", image: "ocala.webp", audio: "ocala.m4a" },
    { word: "kolač", image: "kolac.webp", audio: "kolac.m4a" },
    { word: "čopič", image: "copic.webp", audio: "copic.m4a" },
  ],
};

// Konfiguracija za črko Š
export const metKockeSH: MetKockeLetterConfig = {
  letter: "sh",
  displayLetter: "Š",
  title: "GLAS Š",
  bitje: [
    { word: "škrat", image: "skrat.webp", audio: "skrat.m4a" },
    { word: "miška", image: "miska.webp", audio: "miska.m4a" },
    { word: "muška", image: "muska.webp", audio: "muska.m4a" },
    { word: "gasilec", image: "gasilec.webp", audio: "gasilec.m4a" },
    { word: "koš", image: "kos.webp", audio: "kos.m4a" },
    { word: "pikapolonica", image: "pikapolonica.webp", audio: "pikapolonica.m4a" },
  ],
  povedek: stickmanPovedek,
  predmet: [
    { word: "škatlo", image: "skatla.webp", audio: "skatlo.m4a" },
    { word: "piškot", image: "piskot.webp", audio: "piskot.m4a" },
    { word: "škarje", image: "skarje.webp", audio: "skarje.m4a" },
    { word: "šopek", image: "sopek.webp", audio: "sopek.m4a" },
    { word: "hruško", image: "hruska.webp", audio: "hrusko.m4a" },
    { word: "fižol", image: "fizol.webp", audio: "fizol.m4a" },
  ],
};

// Konfiguracija za črko Ž
export const metKockeZH: MetKockeLetterConfig = {
  letter: "zh",
  displayLetter: "Ž",
  title: "GLAS Ž",
  bitje: [
    { word: "žaba", image: "zaba.webp", audio: "zaba.m4a" },
    { word: "jež", image: "jez.webp", audio: "jez.m4a" },
    { word: "morž", image: "morz.webp", audio: "morz.m4a" },
    { word: "mož", image: "moz.webp", audio: "moz.m4a" },
    { word: "strežaj", image: "strezaj.webp", audio: "strezaj.m4a" },
    { word: "klovn", image: "klovn.webp", audio: "klovn.m4a" },
  ],
  povedek: stickmanPovedek,
  predmet: [
    { word: "rožo", image: "roza.webp", audio: "rozo.m4a" },
    { word: "dežnik", image: "deznik.webp", audio: "deznik.m4a" },
    { word: "žogo", image: "zoga.webp", audio: "zogo.m4a" },
    { word: "žlico", image: "zlica.webp", audio: "zlico.m4a" },
    { word: "krožnik", image: "kroznik.webp", audio: "kroznik.m4a" },
    { word: "cekin", image: "cekin.webp", audio: "cekin.m4a" },
  ],
};

// Konfiguracija za črko L
export const metKockeL: MetKockeLetterConfig = {
  letter: "l",
  displayLetter: "L",
  title: "GLAS L",
  bitje: [
    { word: "lev", image: "lev.webp", audio: "lev.m4a" },
    { word: "lokomotiva", image: "lokomotiva.webp", audio: "lokomotiva.m4a" },
    { word: "ladjica", image: "ladjica.webp", audio: "ladjica.m4a" },
    { word: "pilot", image: "pilot.webp", audio: "pilot.m4a" },
    { word: "osel", image: "osel.webp", audio: "osel.m4a" },
    { word: "gel", image: "gel.webp", audio: "gel.m4a" },
  ],
  povedek: stickmanPovedek,
  predmet: [
    { word: "led", image: "led.webp", audio: "led.m4a" },
    { word: "lopar", image: "lopar.webp", audio: "lopar.m4a" },
    { word: "luč", image: "luc.webp", audio: "luc.m4a" },
    { word: "balon", image: "balon.webp", audio: "balon.m4a" },
    { word: "čokolado", image: "cokolada.webp", audio: "cokolado.m4a" },
    { word: "kolo", image: "kolo.webp", audio: "kolo.m4a" },
  ],
};

// Konfiguracija za črko R
export const metKockeR: MetKockeLetterConfig = {
  letter: "r",
  displayLetter: "R",
  title: "GLAS R",
  bitje: [
    { word: "rak", image: "rak.webp", audio: "rak.m4a" },
    { word: "riba", image: "riba.webp", audio: "riba.m4a" },
    { word: "srna", image: "srna.webp", audio: "srna.m4a" },
    { word: "tiger", image: "tiger.webp", audio: "tiger.m4a" },
    { word: "prav", image: "prav.webp", audio: "prav.m4a" },
    { word: "labrador", image: "labrador.webp", audio: "labrador.m4a" },
  ],
  povedek: stickmanPovedek,
  predmet: [
    { word: "repo", image: "repa.webp", audio: "repo.m4a" },
    { word: "raketo", image: "raketa.webp", audio: "raketo.m4a" },
    { word: "roko", image: "roka.webp", audio: "roko.m4a" },
    { word: "drevo", image: "drevo.webp", audio: "drevo.m4a" },
    { word: "torbo", image: "torba.webp", audio: "torbo.m4a" },
    { word: "uro", image: "ura.webp", audio: "uro.m4a" },
  ],
};

// Konfiguracija za črko K
export const metKockeK: MetKockeLetterConfig = {
  letter: "k",
  displayLetter: "K",
  title: "GLAS K",
  bitje: [
    { word: "krava", image: "krava.webp", audio: "krava.m4a" },
    { word: "kos", image: "kos_ptica.webp", audio: "kos.m4a" },
    { word: "krtek", image: "krtek.webp", audio: "krtek.m4a" },
    { word: "rak", image: "rak.webp", audio: "rak.m4a" },
    { word: "pajek", image: "pajek.webp", audio: "pajek.m4a" },
    { word: "polk", image: "polk.webp", audio: "polk.m4a" },
  ],
  povedek: stickmanPovedek,
  predmet: [
    { word: "kapo", image: "kapa.webp", audio: "kapo.m4a" },
    { word: "knjigo", image: "knjiga.webp", audio: "knjigo.m4a" },
    { word: "kokos", image: "kokos_sadez.webp", audio: "kokos.m4a" },
    { word: "koš", image: "kos.webp", audio: "kos.m4a" },
    { word: "dežnik", image: "deznik.webp", audio: "deznik.m4a" },
    { word: "jabolko", image: "jabolko.webp", audio: "jabolko.m4a" },
  ],
};

// Konfiguracija za črko Z
export const metKockeZ: MetKockeLetterConfig = {
  letter: "z",
  displayLetter: "Z",
  title: "GLAS Z",
  bitje: [
    { word: "zajec", image: "zajec.webp", audio: "zajec.m4a" },
    { word: "zebra", image: "zebra.webp", audio: "zebra.m4a" },
    { word: "zmaj", image: "zmaj.webp", audio: "zmaj.m4a" },
    { word: "koza", image: "koza.webp", audio: "koza.m4a" },
    { word: "puž", image: "puz.webp", audio: "puz.m4a" },
    { word: "medved", image: "medved.webp", audio: "medved.m4a" },
  ],
  povedek: stickmanPovedek,
  predmet: [
    { word: "copat", image: "copat.webp", audio: "copat.m4a" },
    { word: "lubenico", image: "lubenica.webp", audio: "lubenico.m4a" },
    { word: "pico", image: "pica.webp", audio: "pico.m4a" },
    { word: "cvet", image: "cvet.webp", audio: "cvet.m4a" },
    { word: "kocko", image: "kocka.webp", audio: "kocko.m4a" },
    { word: "vazo", image: "vaza.webp", audio: "vazo.m4a" },
  ],
};

// Mapa vseh konfiguracij
export const metKockeConfigs: Record<string, MetKockeLetterConfig> = {
  s: metKockeS,
  c: metKockeC,
  ch: metKockeCH,
  sh: metKockeSH,
  zh: metKockeZH,
  l: metKockeL,
  r: metKockeR,
  k: metKockeK,
  z: metKockeZ,
};

// Funkcija za pridobitev konfiguracije
export function getMetKockeConfig(letter: string): MetKockeLetterConfig | null {
  const normalizedLetter = letter.toLowerCase();
  return metKockeConfigs[normalizedLetter] || null;
}

// Seznam črk za selekcijsko stran
export const metKockeLetters = [
  { id: "c", letter: "C", title: "Črka C", path: "/govorne-igre/met-kocke/c", gradient: "from-app-blue/30 to-app-purple/30" },
  { id: "ch", letter: "Č", title: "Črka Č", path: "/govorne-igre/met-kocke/ch", gradient: "from-app-orange/30 to-app-yellow/30" },
  { id: "k", letter: "K", title: "Črka K", path: "/govorne-igre/met-kocke/k", gradient: "from-dragon-green/30 to-app-teal/30" },
  { id: "l", letter: "L", title: "Črka L", path: "/govorne-igre/met-kocke/l", gradient: "from-app-purple/30 to-app-blue/30" },
  { id: "r", letter: "R", title: "Črka R", path: "/govorne-igre/met-kocke/r", gradient: "from-app-orange/30 to-app-yellow/30" },
  { id: "s", letter: "S", title: "Črka S", path: "/govorne-igre/met-kocke/s", gradient: "from-app-blue/30 to-app-purple/30" },
  { id: "sh", letter: "Š", title: "Črka Š", path: "/govorne-igre/met-kocke/sh", gradient: "from-dragon-green/30 to-app-teal/30" },
  { id: "z", letter: "Z", title: "Črka Z", path: "/govorne-igre/met-kocke/z", gradient: "from-app-purple/30 to-app-blue/30" },
  { id: "zh", letter: "Ž", title: "Črka Ž", path: "/govorne-igre/met-kocke/zh", gradient: "from-app-orange/30 to-app-yellow/30" },
];
