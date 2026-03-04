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
  { word: "je", image: "Stickman_jesti.webp", audio: "Je.mp3" },
  { word: "vidi", image: "Stickman_gledati.webp", audio: "Vidi.mp3" },
  { word: "ima", image: "Stickman_imeti.webp", audio: "Ima.mp3" },
  { word: "riše", image: "Stickman_risati.webp", audio: "Rise.mp3" },
  { word: "nese", image: "Stickman_nesti.webp", audio: "Nese.mp3" },
  { word: "želi", image: "Stickman_zeleti.webp", audio: "Zeli.mp3" },
];

// Konfiguracija za črko S
export const metKockeS: MetKockeLetterConfig = {
  letter: "s",
  displayLetter: "S",
  title: "GLAS S",
  bitje: [
    { word: "slon", image: "slon1.webp", audio: "Slon.mp3" },
    { word: "sova", image: "sova1.webp", audio: "Sova.mp3" },
    { word: "snežak", image: "snezak1.webp", audio: "Snezak.mp3" },
    { word: "los", image: "los1.webp", audio: "Los.mp3" },
    { word: "osa", image: "osa1.webp", audio: "Osa.mp3" },
    { word: "ris", image: "ris1.webp", audio: "Ris.mp3" },
  ],
  povedek: stickmanPovedek,
  predmet: [
    { word: "sliko", image: "slika1.webp", audio: "Sliko.mp3" },
    { word: "smreko", image: "smreka1.webp", audio: "Smreko.mp3" },
    { word: "sir", image: "sir1.webp", audio: "Sir.mp3" },
    { word: "sladoled", image: "sladoled1.webp", audio: "Sladoled.mp3" },
    { word: "kost", image: "kost1.webp", audio: "Kost.mp3" },
    { word: "list", image: "list1.webp", audio: "List.mp3" },
  ],
};

// Konfiguracija za črko Z
export const metKockeZ: MetKockeLetterConfig = {
  letter: "z",
  displayLetter: "Z",
  title: "GLAS Z",
  bitje: [
    { word: "zajec", image: "zajec1.webp", audio: "Zajec.mp3" },
    { word: "zebra", image: "zebra1.webp", audio: "Zebra.mp3" },
    { word: "zmaj", image: "zmaj1.webp", audio: "Zmaj.mp3" },
    { word: "koza", image: "koza1.webp", audio: "Koza_zival.mp3" },
    { word: "meduza", image: "meduza1.webp", audio: "Meduza.mp3" },
    { word: "dinozaver", image: "dinozaver1.webp", audio: "Dinozaver.mp3" },
  ],
  povedek: stickmanPovedek,
  predmet: [
    { word: "liziko", image: "lizika1.webp", audio: "Liziko.mp3" },
    { word: "vazo", image: "vaza1.webp", audio: "Vazo.mp3" },
    { word: "zvezek", image: "zvezek1.webp", audio: "Zvezek.mp3" },
    { word: "koruzo", image: "koruza1.webp", audio: "Koruzo.mp3" },
    { word: "zvezdo", image: "zvezda1.webp", audio: "Zvezdo.mp3" },
    { word: "zlato", image: "zlato1.webp", audio: "Zlato.mp3" },
  ],
};

// Konfiguracija za črko C
export const metKockeC: MetKockeLetterConfig = {
  letter: "c",
  displayLetter: "C",
  title: "GLAS C",
  bitje: [
    { word: "raca", image: "raca1.webp", audio: "Raca.mp3" },
    { word: "zajec", image: "zajec1.webp", audio: "Zajec.mp3" },
    { word: "opica", image: "opica1.webp", audio: "Opica.mp3" },
    { word: "vrabec", image: "vrabec1.webp", audio: "Vrabec.mp3" },
    { word: "muca", image: "muca1.webp", audio: "Muca.mp3" },
    { word: "lovec", image: "lovec1.webp", audio: "Lovec.mp3" },
  ],
  povedek: stickmanPovedek,
  predmet: [
    { word: "cekin", image: "cekin1.webp", audio: "Cekin.mp3" },
    { word: "copat", image: "copat1.webp", audio: "Copat.mp3" },
    { word: "lubenico", image: "lubenica1.webp", audio: "Lubenico.mp3" },
    { word: "pico", image: "pica1.webp", audio: "Pico.mp3" },
    { word: "cvet", image: "cvet1.webp", audio: "Cvet.mp3" },
    { word: "kocko", image: "kocka1.webp", audio: "Kocko.mp3" },
  ],
};

// Konfiguracija za črko Š
export const metKockeSH: MetKockeLetterConfig = {
  letter: "sh",
  displayLetter: "Š",
  title: "GLAS Š",
  bitje: [
    { word: "štorklja", image: "storklja1.webp", audio: "Storklja.mp3" },
    { word: "kokoš", image: "kokos1.webp", audio: "Kokos_zival.mp3" },
    { word: "miš", image: "mis1.webp", audio: "Mis.mp3" },
    { word: "nogometaš", image: "nogometas1.webp", audio: "Nogometas.mp3" },
    { word: "rokometaš", image: "rokometas1.webp", audio: "Rokometas.mp3" },
    { word: "šofer", image: "sofer1.webp", audio: "Sofer.mp3" },
  ],
  povedek: stickmanPovedek,
  predmet: [
    { word: "škatlo", image: "skatla1.webp", audio: "Skatlo.mp3" },
    { word: "piškot", image: "piskot1.webp", audio: "Piskot.mp3" },
    { word: "škarje", image: "skarje1.webp", audio: "Skarje.mp3" },
    { word: "šopek", image: "sopek1.webp", audio: "Sopek.mp3" },
    { word: "hruško", image: "hruska1.webp", audio: "Hrusko.mp3" },
    { word: "koš", image: "kos1.webp", audio: "Kos_predmet.mp3" },
  ],
};

// Konfiguracija za črko Ž
export const metKockeZH: MetKockeLetterConfig = {
  letter: "zh",
  displayLetter: "Ž",
  title: "GLAS Ž",
  bitje: [
    { word: "žaba", image: "zaba1.webp", audio: "Zaba.mp3" },
    { word: "želva", image: "zelva1.webp", audio: "Zelva.mp3" },
    { word: "žirafa", image: "zirafa1.webp", audio: "Zirafa.mp3" },
    { word: "žolna", image: "zolna1.webp", audio: "Zolna.mp3" },
    { word: "deževnik", image: "dezevnik1.webp", audio: "Dezevnik.mp3" },
    { word: "kuža", image: "kuza1.webp", audio: "Kuza.mp3" },
  ],
  povedek: stickmanPovedek,
  predmet: [
    { word: "fižol", image: "fizol1.webp", audio: "Fizol.mp3" },
    { word: "rožo", image: "roza1.webp", audio: "Rozo.mp3" },
    { word: "dežnik", image: "deznik1.webp", audio: "Deznik.mp3" },
    { word: "žogo", image: "zoga1.webp", audio: "Zogo.mp3" },
    { word: "žlico", image: "zlica1.webp", audio: "Zlico.mp3" },
    { word: "krožnik", image: "kroznik1.webp", audio: "Kroznik.mp3" },
  ],
};

// Konfiguracija za črko Č
export const metKockeCH: MetKockeLetterConfig = {
  letter: "ch",
  displayLetter: "Č",
  title: "GLAS Č",
  bitje: [
    { word: "čebela", image: "cebela1.webp", audio: "Cebela.mp3" },
    { word: "kača", image: "kaca1.webp", audio: "Kaca.mp3" },
    { word: "ptič", image: "ptic1.webp", audio: "Ptic.mp3" },
    { word: "ribič", image: "ribic1.webp", audio: "Ribic.mp3" },
    { word: "čebelar", image: "cebelar1.webp", audio: "Cebelar.mp3" },
    { word: "čarovnik", image: "carovnik1.webp", audio: "Carovnik.mp3" },
  ],
  povedek: stickmanPovedek,
  predmet: [
    { word: "čebulo", image: "cebula1.webp", audio: "Cebulo.mp3" },
    { word: "čevlje", image: "cevlji1.webp", audio: "Cevlje.mp3" },
    { word: "čaj", image: "caj1.webp", audio: "Caj.mp3" },
    { word: "očala", image: "ocala1.webp", audio: "Ocala.mp3" },
    { word: "kolač", image: "kolac1.webp", audio: "Kolac.mp3" },
    { word: "čopič", image: "copic1.webp", audio: "Copic.mp3" },
  ],
};

// Konfiguracija za črko L
export const metKockeL: MetKockeLetterConfig = {
  letter: "l",
  displayLetter: "L",
  title: "GLAS L",
  bitje: [
    { word: "lev", image: "lev1.webp", audio: "Lev.mp3" },
    { word: "čebela", image: "cebela1.webp", audio: "Cebela.mp3" },
    { word: "slon", image: "slon1.webp", audio: "Slon.mp3" },
    { word: "štorklja", image: "storklja1.webp", audio: "Storklja.mp3" },
    { word: "želva", image: "zelva1.webp", audio: "Zelva.mp3" },
    { word: "lisica", image: "lisica1.webp", audio: "Lisica.mp3" },
  ],
  povedek: stickmanPovedek,
  predmet: [
    { word: "led", image: "led1.webp", audio: "Led.mp3" },
    { word: "lopar", image: "lopar1.webp", audio: "Lopar.mp3" },
    { word: "luč", image: "luc1.webp", audio: "Luc.mp3" },
    { word: "balon", image: "balon1.webp", audio: "Balon.mp3" },
    { word: "čokolado", image: "cokolada1.webp", audio: "Cokolado.mp3" },
    { word: "kolo", image: "kolo1.webp", audio: "Kolo.mp3" },
  ],
};

// Konfiguracija za črko R
export const metKockeR: MetKockeLetterConfig = {
  letter: "r",
  displayLetter: "R",
  title: "GLAS R",
  bitje: [
    { word: "raca", image: "raca1.webp", audio: "Raca.mp3" },
    { word: "rak", image: "rak1.webp", audio: "Rak.mp3" },
    { word: "riba", image: "riba1.webp", audio: "Riba.mp3" },
    { word: "robot", image: "robot1.webp", audio: "Robot.mp3" },
    { word: "bober", image: "bober1.webp", audio: "Bober.mp3" },
    { word: "mrož", image: "mroz1.webp", audio: "Mroz.mp3" },
  ],
  povedek: stickmanPovedek,
  predmet: [
    { word: "repo", image: "repa1.webp", audio: "Repo.mp3" },
    { word: "raketo", image: "raketa1.webp", audio: "Raketo.mp3" },
    { word: "roko", image: "roka1.webp", audio: "Roko.mp3" },
    { word: "drevo", image: "drevo1.webp", audio: "Drevo.mp3" },
    { word: "torbo", image: "torba1.webp", audio: "Torbo.mp3" },
    { word: "uro", image: "ura1.webp", audio: "Uro.mp3" },
  ],
};

// Konfiguracija za črko K
export const metKockeK: MetKockeLetterConfig = {
  letter: "k",
  displayLetter: "K",
  title: "GLAS K",
  bitje: [
    { word: "kača", image: "kaca1.webp", audio: "Kaca.mp3" },
    { word: "kokoš", image: "kokos1.webp", audio: "Kokos_zival.mp3" },
    { word: "koza", image: "koza1.webp", audio: "Koza_zival.mp3" },
    { word: "krava", image: "krava1.webp", audio: "Krava.mp3" },
    { word: "bik", image: "bik1.webp", audio: "Bik.mp3" },
    { word: "pajek", image: "pajek1.webp", audio: "Pajek.mp3" },
  ],
  povedek: stickmanPovedek,
  predmet: [
    { word: "kapo", image: "kapa1.webp", audio: "Kapo.mp3" },
    { word: "knjigo", image: "knjiga1.webp", audio: "Knjigo.mp3" },
    { word: "kokos", image: "kokos_sadez1.webp", audio: "Kokos_sadez.mp3" },
    { word: "koš", image: "kos1.webp", audio: "Kos_predmet.mp3" },
    { word: "dežnik", image: "deznik1.webp", audio: "Deznik.mp3" },
    { word: "jabolko", image: "jabolko1.webp", audio: "Jabolko.mp3" },
  ],
};

// Konfiguracija za R začetne vaje
export const metKockeRZacetek: MetKockeLetterConfig = {
  letter: "r-zacetek",
  displayLetter: "R",
  title: "GLAS R - začetne vaje",
  bitje: [
    { word: "drevo", image: "drevo1.webp", audio: "Drevo.mp3" },
    { word: "breza", image: "breza1.webp", audio: "Breza.mp3" },
    { word: "trava", image: "trava1.webp", audio: "Trava.mp3" },
    { word: "princ", image: "princ1.webp", audio: "Princ.mp3" },
    { word: "dron", image: "dron1.webp", audio: "Dron.mp3" },
    { word: "brada", image: "brada1.webp", audio: "Brada.mp3" },
  ],
  povedek: stickmanPovedek,
  predmet: [
    { word: "trobento", image: "trobenta1.webp", audio: "Trobento.mp3" },
    { word: "trikotnik", image: "trikotnik1.webp", audio: "Trikotnik.mp3" },
    { word: "brisačo", image: "brisaca1.webp", audio: "Brisaco.mp3" },
    { word: "breskev", image: "breskev1.webp", audio: "Breskev.mp3" },
    { word: "brokoli", image: "brokoli1.webp", audio: "Brokoli.mp3" },
    { word: "dragulj", image: "dragulj1.webp", audio: "Dragulj.mp3" },
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
  'r-zacetek': metKockeRZacetek,
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
  { id: "r-zacetek", letter: "R", title: "Glas R - začetne vaje", path: "/govorne-igre/met-kocke/r-zacetek", gradient: "from-app-purple/20 to-app-teal/20" },
  { id: "r", letter: "R", title: "Glas R", path: "/govorne-igre/met-kocke/r", gradient: "from-app-purple/20 to-app-teal/20" },
];
