
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
      { text: "BIK", image: "bik.png", acceptedVariants: ["BIK", "PIK", "DIK", "GIK", "VIK", "FIK", "BIC", "BIG", "BIN", "BIT", "BID"] },
      { text: "OBLAK", image: "oblak.png", acceptedVariants: ["OBLAK", "OBRAK", "OPLAK", "OBLAT", "OBLA", "OBLAK!", "OBLAG", "OBLAV", "OBLAN", "OBLAH", "OBLAKI", "OBJAK"] },
      { text: "ZOB", image: "zob.png", acceptedVariants: ["ZOB", "ZOP", "SOP", "ŽOB", "ŠOB", "ZOT", "ZO", "ZOBE", "ZUB", "ZOV", "SOB", "COB", "OB", "ŽOP", "ŠOP"] },
    ] 
  },
  { 
    letter: "C", 
    words: [
      { text: "CEV", image: "cev.png", acceptedVariants: ["CEV", "SEV", "ZEV", "CEF", "CEVF", "CEV!", "TEV", "DEV", "CEVT", "CEVU", "CEU", "SEU", "ČEV", "ČEU", "ŠEV", "ŠEU"] },
      { text: "PICA", image: "pica.png", acceptedVariants: ["PICA", "PISA", "PIČA", "PITA", "PIKA", "BICA", "PINA", "PIZA", "PICA!", "PICE", "PICCA", "PIŠA"] },
      { text: "ZAJEC", image: "zajec.png", acceptedVariants: ["ZAJEC", "SAJEC", "ŽAJEC", "ZAJET", "ZAJES", "ZAJEC!", "ZAJC", "ZAJECI", "ZAJEK", "ZAJEL", "ŽAJEČ", "SAJES", "SAJET", "TAJET", "AJES", "ŠAJEŠ", "ŽAJEŠ"] },
    ] 
  },
  { 
    letter: "Č", 
    words: [
      { text: "ČAJ", image: "caj.png", acceptedVariants: ["ČAJ", "CAJ", "ŠAJ", "ČA", "ČAJ!", "TAJ", "DAJ", "ČAK", "ČAL", "ČAV"] },
      { text: "OČI", image: "oci.png", acceptedVariants: ["OČI", "OCI", "OŠI", "OTI", "OČI!", "OČIJA", "OI", "OČ", "OČIČ", "OČI?", "UČ"] },
      { text: "LUČ", image: "luc.png", acceptedVariants: ["LUČ", "LUC", "LUT", "LUŠ", "RUČ", "NUČ", "LU", "LUČ!", "LUČA", "LUK", "JUČ"] },
    ] 
  },
  { 
    letter: "D", 
    words: [
      { text: "DUDA", image: "duda.png", acceptedVariants: ["DUDA", "DUTA", "DULA", "DUHA", "BUDA", "GUDA", "DUDa", "DUDA!", "DUDAA", "DUDAH", "TUTA"] },
      { text: "VODA", image: "voda.png", acceptedVariants: ["VODA", "VOTA", "BODA", "VOLA", "VORA", "VODA!", "VODa", "VOD", "VODE", "VODI", "FODA"] },
      { text: "MED", image: "med.png", acceptedVariants: ["MED", "MET", "MEL", "ME", "BED", "PED", "MEB", "MEN", "MED!", "MET!", "NED", "NET"] },
    ] 
  },
  { 
    letter: "F", 
    words: [
      { text: "FEN", image: "fen.png", acceptedVariants: ["FEN", "VEN", "SEN", "HEN", "FET", "FEM", "FE", "FEN!", "FENNN", "FEN?", "EN"] },
      { text: "MAFIN", image: "mafin.png", acceptedVariants: ["MAFIN", "MAFI", "MAFIM", "MAFIN!", "MAFIR", "NAFIN", "BAFIN", "MABIN", "MAPIN", "MAFINA", "MAVIN", "NAVIN"] },
      { text: "KROF", image: "krof.png", acceptedVariants: ["KROF", "KLOF", "KROP", "KRO", "KROF!", "KROV", "GROF", "KROH", "KROV!", "KROFF", "TOF", "TLOF", "KOF", "KJOF", "TJOF"] },
    ] 
  },
  { 
    letter: "G", 
    words: [
      { text: "GOBA", image: "goba.png", acceptedVariants: ["GOBA", "KOBA", "DOBA", "GOLA", "GOMA", "GOBA!", "GOBAA", "GOBAH", "GOBa", "GOBA?", "GOPA", "OBA"] },
      { text: "ŽOGA", image: "zoga.png", acceptedVariants: ["ŽOGA", "ZOGA", "ŠOGA", "JOGA", "LOGA", "ŽOKA", "ŽOGA!", "ŽOKA!", "ŽOGAHA", "ŽOGA?", "SOGA", "ŽODA", "ŠODA"] },
      { text: "SNEG", image: "sneg.png", acceptedVariants: ["SNEG", "SNEK", "SNE", "ZNEG", "ŠNEG", "SNEH", "SNEF", "SNEP", "SNEG!", "SNEGG", "ŠNEK"] },
    ] 
  },
  { 
    letter: "H", 
    words: [
      { text: "HIŠA", image: "hisa.png", acceptedVariants: ["HIŠA", "HISA", "IŠA", "HIŽA", "HIŠ", "HIŠA!", "BIŠA", "DIŠA", "HIŠKA", "HISA!", "HITA"] },
      { text: "JUHA", image: "juha.png", acceptedVariants: ["JUHA", "JULA", "DUHA", "UHA", "JUHA!", "JUH", "JUHE", "JUHAA", "JUGA", "JUFA", "JUTA", "JUA"] },
      { text: "KRUH", image: "kruh.png", acceptedVariants: ["KRUH", "KLUH", "KRUH!", "KRU", "KRUH?", "KRUHHA", "GRUH", "KRUŠ", "KRUHOV", "KJUH", "KUH"] },
    ] 
  },
  { 
    letter: "J", 
    words: [
      { text: "JOPA", image: "jopa.png", acceptedVariants: ["JOPA", "JOLA", "JOTA", "DOPA", "BOPA", "JOPA!", "JOPa", "JOPAA", "JOPA?", "JOPA-"] },
      { text: "VEJA", image: "veja.png", acceptedVariants: ["VEJA", "VEŽA", "VEDA", "BEJA", "FEJA", "VEJA!", "VEJ", "VEJE", "VEJAA", "VEJA?", "EJA"] },
      { text: "NOJ", image: "noj.png", acceptedVariants: ["NOJ", "LOJ", "DOJ", "MOJ", "NO", "NOJ!", "NOJJ", "NOJ?", "NOJ-", "NOJ…", "OJ"] },
    ] 
  },
  { 
    letter: "K", 
    words: [
      { text: "KOLO", image: "kolo.png", acceptedVariants: ["KOLO", "KORO", "GOLO", "TOLO", "KOJO", "KOLO!", "KOLOO", "KOLO?", "KOLO-", "KOLOK", "TOJO"] },
      { text: "ROKA", image: "roka.png", acceptedVariants: ["ROKA", "LOKA", "JOKA", "ROGA", "ROKA!", "ROK", "ROKA?", "ROKA-", "ROKI", "ROKAHA", "OKA", "LOTA", "JOTA"] },
      { text: "RAK", image: "rak.png", acceptedVariants: ["RAK", "LAK", "JAK", "DAK", "GAK", "RAK!", "RAKK", "RAK?", "RAK-", "RAKO", "AK", "LAT", "JAT"] },
    ] 
  },
  { 
    letter: "L", 
    words: [
      { text: "LEV", image: "lev.png", acceptedVariants: ["LEV", "REV", "JEV", "LE", "LEV!", "LEVV", "LEV?", "LEV-", "LEVA", "LEVE", "LEU", "JEU"] },
      { text: "MILO", image: "milo.png", acceptedVariants: ["MILO", "MIRO", "NILO", "BILO", "MIDO", "MILO!", "MILOO", "MILO?", "MILO-", "MIJO", "NIJO", "MIO"] },
      { text: "GOL", image: "gol.png", acceptedVariants: ["GOL", "KOL", "DOL", "GOR", "GOL!", "GOLL", "GOL?", "GOL-", "GOLA", "GOl", "OL"] },
    ] 
  },
  { 
    letter: "M", 
    words: [
      { text: "MIZA", image: "miza.png", acceptedVariants: ["MIZA", "MISA", "MIŽA", "NIZA", "BIZA", "MIZA!", "MIZE", "MIZa", "MIZA?", "MIZO", "MITA", "NISA", "MIŠA"] },
      { text: "GUMA", image: "guma.png", acceptedVariants: ["GUMA", "GULA", "DUMA", "GUNA", "BUMA", "GUMA!", "GUME", "GUMa", "GUMA?", "GUMO", "DUNA", "UMA", "KUMA"] },
      { text: "SEDEM", image: "sedem.png", acceptedVariants: ["SEDEM", "SEDEM!", "SEDEM?", "SEDE", "SEDEm", "SEDET", "SEDEM-", "SEDEM…", "SEVEN", "SEDEN", "SETEM", "SEDM", "SETM", "SEDN", "ŠEDEM", "ŠEDM"] },
    ] 
  },
  { 
    letter: "N", 
    words: [
      { text: "NOS", image: "nos.png", acceptedVariants: ["NOS", "NO", "MOS", "LOS", "NOS!", "NOŠ", "NOZ", "NOS?", "NOSE", "NOSA", "OS", "NOT"] },
      { text: "BANANA", image: "banana.png", acceptedVariants: ["BANANA", "MANANA", "NANANA", "BANADA", "BANANA!", "BANANa", "BANANA?", "BANANE", "BANANA-", "BANANA…", "PANANA", "NANA"] },
      { text: "VOLAN", image: "volan.png", acceptedVariants: ["VOLAN", "BOLAN", "VORAN", "DOLAN", "VOLAM", "VOLAN!", "VOLAN?", "VOLANI", "VOLAN-", "VOLAN…", "TOLAN", "FOLAN", "OLAN"] },
    ] 
  },
  { 
    letter: "P", 
    words: [
      { text: "PAJEK", image: "pajek.png", acceptedVariants: ["PAJEK", "BAJEK", "PAJEC", "PAJEL", "PAJES", "PAJEK!", "PAJK", "PAJEK?", "PAJEKI", "PAJEK-", "PAJET"] },
      { text: "KAPA", image: "kapa.png", acceptedVariants: ["KAPA", "GAPA", "TAPA", "KABA", "KATA", "KAPA!", "KAPE", "KAPa", "KAPA?", "KAPO", "APA"] },
      { text: "REP", image: "rep.png", acceptedVariants: ["REP", "LEP", "TEP", "RE", "REMP", "REP!", "REP?", "REPA", "REPE", "REP-", "JEP", "EP"] },
    ] 
  },
  { 
    letter: "R", 
    words: [
      { text: "ROŽA", image: "roza.png", acceptedVariants: ["ROŽA", "ROZA", "ROŠA", "ROŽE", "LOŽA", "LOZA", "LOŠA", "JOŽA", "JOZA", "ROŽA!", "ROŽA?", "ROŽAA", "OŽA", "OŠA", "JOŠA"] },
      { text: "URA", image: "ura.png", acceptedVariants: ["URA", "ULA", "UDA", "JURA", "HURA", "URA!", "URA?", "URE", "URA-", "URAA", "UJA"] },
      { text: "SIR", image: "sir.png", acceptedVariants: ["SIR", "ŠIR", "ZIR", "SIL", "SI", "SIR!", "SIR?", "SIRI", "SIRA", "SIR-", "SIJ", "ŠIJ"] },
    ] 
  },
  { 
    letter: "S", 
    words: [
      { text: "SOK", image: "sok.png", acceptedVariants: ["SOK", "ŠOK", "ZOK", "TOK", "SOK!", "SOK?", "SO", "SOK-", "SOKA", "SOKI", "SOT", "ŠOT", "OK"] },
      { text: "OSA", image: "osa.png", acceptedVariants: ["OSA", "OZA", "OŠA", "OLA", "OSA!", "OSA?", "OSE", "OSa", "OSA-", "OSAA", "OTA"] },
      { text: "NOS", image: "nos.png", acceptedVariants: ["NOS", "NO", "MOS", "LOS", "NOS!", "NOŠ", "NOZ", "NOS?", "NOSE", "NOSA", "OS", "NOT"] },
    ] 
  },
  { 
    letter: "Š", 
    words: [
      { text: "ŠAL", image: "sal.png", acceptedVariants: ["ŠAL", "SAL", "ŽAL", "ŠAR", "TAL", "ŠAL!", "ŠAL?", "ŠALA", "ŠALI", "ŠAL-", "ŠAJ", "SAJ"] },
      { text: "HIŠA", image: "hisa.png", acceptedVariants: ["HIŠA", "HISA", "IŠA", "HIŽA", "HIŠ", "HIŠA!", "BIŠA", "DIŠA", "HIŠKA", "HISA!", "HITA"] },
      { text: "KOŠ", image: "kos.png", acceptedVariants: ["KOŠ", "KOS", "KOŽ", "KO", "TOŠ", "GOŠ", "KOŠ!", "KOŠ?", "KOŠI", "KOŠ-", "OŠ"] },
    ] 
  },
  { 
    letter: "T", 
    words: [
      { text: "TORBA", image: "torba.png", acceptedVariants: ["TORBA", "TOLBA", "DORBA", "TOBA", "TORVA", "TORBA!", "TORBa", "TORBA?", "TORBE", "TORBA-", "TOJBA"] },
      { text: "STOL", image: "stol.png", acceptedVariants: ["STOL", "ŠTOL", "STOR", "TOL", "SKOL", "STOL!", "STOL?", "STOLI", "STOl", "STOL-", "STOU"] },
      { text: "COPAT", image: "copat.png", acceptedVariants: ["COPAT", "ČOPAT", "SOPAT", "TOPAT", "COPAK", "COPA", "COPAT!", "COPAT?", "COPATI", "COPAT-"] },
    ] 
  },
  { 
    letter: "V", 
    words: [
      { text: "VODA", image: "voda.png", acceptedVariants: ["VODA", "VOTA", "BODA", "VOLA", "VORA", "VODA!", "VODa", "VOD", "VODE", "VODI", "UODA", "ODA", "FODA"] },
      { text: "KAVA", image: "kava.png", acceptedVariants: ["KAVA", "KABA", "GAVA", "KALA", "KAMA", "KAVA!", "KAVa", "KAVA?", "KAVE", "KAVO", "TAVA", "KAFA", "TAFA"] },
      { text: "LEV", image: "lev.png", acceptedVariants: ["LEV", "REV", "JEV", "LE", "LEV!", "LEVV", "LEV?", "LEV-", "LEVA", "LEVE", "LEU", "JEU"] },
    ] 
  },
  { 
    letter: "Z", 
    words: [
      { text: "ZOB", image: "zob.png", acceptedVariants: ["ZOB", "ZOP", "SOP", "ŽOB", "ŠOB", "ZOT", "ZO", "ZOBE", "ZUB", "ZOV", "OB", "OP", "SOB", "ŠOP"] },
      { text: "MIZA", image: "miza.png", acceptedVariants: ["MIZA", "MISA", "MIŽA", "NIZA", "BIZA", "MIZA!", "MIZE", "MIZa", "MIZA?", "MIZO", "NISA", "MIŠA", "MITA"] },
      { text: "VOZ", image: "voz.png", acceptedVariants: ["VOZ", "VOS", "BOS", "FOZ", "VO", "VOZ!", "VOZ?", "VOZI", "VOZA", "VOZ-", "BOZ", "VOT"] },
    ] 
  },
  { 
    letter: "Ž", 
    words: [
      { text: "ŽOGA", image: "zoga.png", acceptedVariants: ["ŽOGA", "ZOGA", "ŠOGA", "JOGA", "LOGA", "ŽOKA", "ŽOGA!", "ŽOKA!", "ŽOGAHA", "ŽOGA?", "SOGA", "ŽODA", "ŠODA", "TOGA"] },
      { text: "ROŽA", image: "roza.png", acceptedVariants: ["ROŽA", "ROZA", "ROŠA", "ROŽE", "LOŽA", "LOZA", "LOŠA", "JOŽA", "JOZA", "ROŽA!", "ROŽA?", "ROŽAA"] },
      { text: "JEŽ", image: "jez.png", acceptedVariants: ["JEŽ", "JEZ", "JEŠ", "LEŽ", "DEŽ", "TEŽ", "JE", "JEŽ!", "JEŽ?", "JEŽI", "JEŽA", "JEŽ-", "EŠ", "EŽ", "JET"] },
    ] 
  },
];
