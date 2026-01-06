
export interface Word {
  text: string;
  image: string;
  audio?: string;
  acceptedVariants?: string[];
}

export interface LetterGroup {
  letter: string;
  words: Word[];
}

// Slovenian alphabet order for consonants: B, C, Č, D, F, G, H, J, K, L, M, N, P, R, S, Š, T, V, Z, Ž
export const articulationData: LetterGroup[] = [
  { 
    letter: "B", 
    words: [
      { text: "BIK", image: "bik.png", acceptedVariants: ["BIK", "PIK", "DIK", "GIK", "VIK", "FIK", "BIC", "BIG", "BIN", "BIT", "BIKK"] },
      { text: "OBLAK", image: "oblak.png", acceptedVariants: ["OBLAK", "OBRAK", "OPLAK", "OBLAT", "OBLA", "OBLAG", "OBLAV", "OBLAN", "OBLAH", "OBLAKOV"] },
      { text: "ZOB", image: "zob.png", acceptedVariants: ["ZOB", "ZOP", "SOP", "ŽOB", "ŠOB", "ZOT", "ZO", "ZOBE", "ZUB", "ZOV"] },
    ] 
  },
  { 
    letter: "C", 
    words: [
      { text: "CEV", image: "cev.png", acceptedVariants: ["CEV", "SEV", "ZEV", "CEF", "CEVF", "TEV", "DEV", "CEVT", "CEVU"] },
      { text: "PICA", image: "pica.png", acceptedVariants: ["PICA", "PISA", "PIČA", "PITA", "PIKA", "BICA", "PINA", "PIZA", "PICE", "PICCA"] },
      { text: "ZAJEC", image: "zajec.png", acceptedVariants: ["ZAJEC", "SAJEC", "ŽAJEC", "ZAJET", "ZAJES", "ZAJC", "ZAJECI", "ZAJEK", "ZAJEL"] },
    ] 
  },
  { 
    letter: "Č", 
    words: [
      { text: "ČAJ", image: "caj.png", acceptedVariants: ["ČAJ", "CAJ", "ŠAJ", "ČA", "TAJ", "DAJ", "ČAK", "ČAL", "ČAV"] },
      { text: "OČI", image: "oci.png", acceptedVariants: ["OČI", "OCI", "OŠI", "OTI", "OČIJA", "OI", "OČ", "OČIČ"] },
      { text: "LUČ", image: "luc.png", acceptedVariants: ["LUČ", "LUC", "LUT", "LUŠ", "RUČ", "NUČ", "LU", "LUČA", "LUK"] },
    ] 
  },
  { 
    letter: "D", 
    words: [
      { text: "DUDA", image: "duda.png", acceptedVariants: ["DUDA", "DUTA", "DULA", "DUHA", "BUDA", "GUDA", "DUDAA", "DUDAH"] },
      { text: "VODA", image: "voda.png", acceptedVariants: ["VODA", "VOTA", "BODA", "VOLA", "VORA", "VOD", "VODE", "VODI"] },
      { text: "MED", image: "med.png", acceptedVariants: ["MED", "MET", "MEL", "ME", "BED", "PED", "MEB", "MEN"] },
    ] 
  },
  { 
    letter: "F", 
    words: [
      { text: "FEN", image: "fen.png", acceptedVariants: ["FEN", "VEN", "SEN", "HEN", "FET", "FEM", "FE", "FENNN"] },
      { text: "MAFIN", image: "mafin.png", acceptedVariants: ["MAFIN", "MAFI", "MAFIM", "MAFIR", "NAFIN", "BAFIN", "MABIN", "MAPIN", "MAFINA"] },
      { text: "KROF", image: "krof.png", acceptedVariants: ["KROF", "KLOF", "KROP", "KRO", "KROV", "GROF", "KROH", "KROFF"] },
    ] 
  },
  { 
    letter: "G", 
    words: [
      { text: "GOBA", image: "goba.png", acceptedVariants: ["GOBA", "KOBA", "DOBA", "GOLA", "GOMA", "GOBAA", "GOBAH"] },
      { text: "ŽOGA", image: "zoga.png", acceptedVariants: ["ŽOGA", "ZOGA", "ŠOGA", "JOGA", "LOGA", "ŽOKA", "ŽOGAHA"] },
      { text: "SNEG", image: "sneg.png", acceptedVariants: ["SNEG", "SNEK", "SNE", "ZNEG", "ŠNEG", "SNEH", "SNEF", "SNEP", "SNEGG"] },
    ] 
  },
  { 
    letter: "H", 
    words: [
      { text: "HIŠA", image: "hisa.png", acceptedVariants: ["HIŠA", "HISA", "IŠA", "HIŽA", "HIŠ", "BIŠA", "DIŠA", "HIŠKA"] },
      { text: "JUHA", image: "juha.png", acceptedVariants: ["JUHA", "JULA", "DUHA", "UHA", "JUH", "JUHE", "JUHAA", "JUGA", "JUFA"] },
      { text: "KRUH", image: "kruh.png", acceptedVariants: ["KRUH", "KLUH", "KRU", "KRUHHA", "GRUH", "KRUŠ", "KRUHOV"] },
    ] 
  },
  { 
    letter: "J", 
    words: [
      { text: "JOPA", image: "jopa.png", acceptedVariants: ["JOPA", "JOLA", "JOTA", "DOPA", "BOPA", "JOPAA"] },
      { text: "VEJA", image: "veja.png", acceptedVariants: ["VEJA", "VEŽA", "VEDA", "BEJA", "FEJA", "VEJ", "VEJE", "VEJAA"] },
      { text: "NOJ", image: "noj.png", acceptedVariants: ["NOJ", "LOJ", "DOJ", "MOJ", "NO", "NOJJ"] },
    ] 
  },
  { 
    letter: "K", 
    words: [
      { text: "KOLO", image: "kolo.png", acceptedVariants: ["KOLO", "KORO", "GOLO", "TOLO", "KOJO", "KOLOO", "KOLOK"] },
      { text: "ROKA", image: "roka.png", acceptedVariants: ["ROKA", "LOKA", "JOKA", "ROGA", "ROK", "ROKI", "ROKAHA"] },
      { text: "RAK", image: "rak.png", acceptedVariants: ["RAK", "LAK", "JAK", "DAK", "GAK", "RAKK", "RAKO"] },
    ] 
  },
  { 
    letter: "L", 
    words: [
      { text: "LEV", image: "lev.png", acceptedVariants: ["LEV", "REV", "JEV", "LE", "LEVV", "LEVA", "LEVE"] },
      { text: "MILO", image: "milo.png", acceptedVariants: ["MILO", "MIRO", "NILO", "BILO", "MIDO", "MILOO", "MIJO"] },
      { text: "GOL", image: "gol.png", acceptedVariants: ["GOL", "KOL", "DOL", "GOR", "GOLL", "GOLA"] },
    ] 
  },
  { 
    letter: "M", 
    words: [
      { text: "MIZA", image: "miza.png", acceptedVariants: ["MIZA", "MISA", "MIŽA", "NIZA", "BIZA", "MIZE", "MIZO"] },
      { text: "GUMA", image: "guma.png", acceptedVariants: ["GUMA", "GULA", "DUMA", "GUNA", "BUMA", "GUME", "GUMO"] },
      { text: "SEDEM", image: "sedem.png", acceptedVariants: ["SEDEM", "SEDE", "SEDET", "SEVEN", "SEDEMČ"] },
    ] 
  },
  { 
    letter: "N", 
    words: [
      { text: "NOS", image: "nos.png", acceptedVariants: ["NOS", "NO", "MOS", "LOS", "NOŠ", "NOZ", "NOSE", "NOSA"] },
      { text: "BANANA", image: "banana.png", acceptedVariants: ["BANANA", "MANANA", "NANANA", "BANADA", "BANANE"] },
      { text: "VOLAN", image: "volan.png", acceptedVariants: ["VOLAN", "BOLAN", "VORAN", "DOLAN", "VOLAM", "VOLANI"] },
    ] 
  },
  { 
    letter: "P", 
    words: [
      { text: "PAJEK", image: "pajek.png", acceptedVariants: ["PAJEK", "BAJEK", "PAJEC", "PAJEL", "PAJES", "PAJK", "PAJEKI"] },
      { text: "KAPA", image: "kapa.png", acceptedVariants: ["KAPA", "GAPA", "TAPA", "KABA", "KATA", "KAPE", "KAPO"] },
      { text: "REP", image: "rep.png", acceptedVariants: ["REP", "LEP", "TEP", "RE", "REMP", "REPA", "REPE"] },
    ] 
  },
  { 
    letter: "R", 
    words: [
      { text: "ROŽA", image: "roza.png", acceptedVariants: ["ROŽA", "ROZA", "ROŠA", "ROŽE", "LOŽA", "LOZA", "LOŠA", "JOŽA", "JOZA", "ROŽAA"] },
      { text: "URA", image: "ura.png", acceptedVariants: ["URA", "ULA", "UDA", "JURA", "HURA", "URE", "URAA"] },
      { text: "SIR", image: "sir.png", acceptedVariants: ["SIR", "ŠIR", "ZIR", "SIL", "SI", "SIRI", "SIRA"] },
    ] 
  },
  { 
    letter: "S", 
    words: [
      { text: "SOK", image: "sok.png", acceptedVariants: ["SOK", "ŠOK", "ZOK", "TOK", "SO", "SOKA", "SOKI"] },
      { text: "OSA", image: "osa.png", acceptedVariants: ["OSA", "OZA", "OŠA", "OLA", "OSE", "OSAA"] },
      { text: "NOS", image: "nos.png", acceptedVariants: ["NOS", "NO", "MOS", "LOS", "NOŠ", "NOZ", "NOSE", "NOSA"] },
    ] 
  },
  { 
    letter: "Š", 
    words: [
      { text: "ŠAL", image: "sal.png", acceptedVariants: ["ŠAL", "SAL", "ŽAL", "ŠAR", "TAL", "ŠALA", "ŠALI"] },
      { text: "HIŠA", image: "hisa.png", acceptedVariants: ["HIŠA", "HISA", "IŠA", "HIŽA", "HIŠ", "BIŠA", "DIŠA", "HIŠKA"] },
      { text: "KOŠ", image: "kos.png", acceptedVariants: ["KOŠ", "KOS", "KOŽ", "KO", "TOŠ", "GOŠ", "KOŠI"] },
    ] 
  },
  { 
    letter: "T", 
    words: [
      { text: "TORBA", image: "torba.png", acceptedVariants: ["TORBA", "TOLBA", "DORBA", "TOBA", "TORVA", "TORBE"] },
      { text: "STOL", image: "stol.png", acceptedVariants: ["STOL", "ŠTOL", "STOR", "TOL", "SKOL", "STOLI"] },
      { text: "COPAT", image: "copat.png", acceptedVariants: ["COPAT", "ČOPAT", "SOPAT", "TOPAT", "COPAK", "COPA", "COPATI"] },
    ] 
  },
  { 
    letter: "V", 
    words: [
      { text: "VODA", image: "voda.png", acceptedVariants: ["VODA", "VOTA", "BODA", "VOLA", "VORA", "VOD", "VODE", "VODI"] },
      { text: "KAVA", image: "kava.png", acceptedVariants: ["KAVA", "KABA", "GAVA", "KALA", "KAMA", "KAVE", "KAVO"] },
      { text: "LEV", image: "lev.png", acceptedVariants: ["LEV", "REV", "JEV", "LE", "LEVV", "LEVA", "LEVE"] },
    ] 
  },
  { 
    letter: "Z", 
    words: [
      { text: "ZOB", image: "zob.png", acceptedVariants: ["ZOB", "ZOP", "SOP", "ŽOB", "ŠOB", "ZOT", "ZO", "ZOBE", "ZUB", "ZOV"] },
      { text: "MIZA", image: "miza.png", acceptedVariants: ["MIZA", "MISA", "MIŽA", "NIZA", "BIZA", "MIZE", "MIZO"] },
      { text: "VOZ", image: "voz.png", acceptedVariants: ["VOZ", "VOS", "BOS", "FOZ", "VO", "VOZI", "VOZA"] },
    ] 
  },
  { 
    letter: "Ž", 
    words: [
      { text: "ŽOGA", image: "zoga.png", acceptedVariants: ["ŽOGA", "ZOGA", "ŠOGA", "JOGA", "LOGA", "ŽOKA", "ŽOGAHA"] },
      { text: "ROŽA", image: "roza.png", acceptedVariants: ["ROŽA", "ROZA", "ROŠA", "ROŽE", "LOŽA", "LOZA", "LOŠA", "JOŽA", "JOZA", "ROŽAA"] },
      { text: "JEŽ", image: "jez.png", acceptedVariants: ["JEŽ", "JEZ", "JEŠ", "LEŽ", "DEŽ", "TEŽ", "JE", "JEŽI", "JEŽA"] },
    ] 
  },
];
