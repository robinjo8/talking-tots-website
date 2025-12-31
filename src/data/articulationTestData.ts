
export interface Word {
  text: string;
  image: string;
  audio?: string;
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
      { text: "BIK", image: "bik.png" },
      { text: "OBLAK", image: "oblak.png" },
      { text: "ZOB", image: "zob.png" },
    ] 
  },
  { 
    letter: "C", 
    words: [
      { text: "CEV", image: "cev.png" },
      { text: "PICA", image: "pica.png" },
      { text: "ZAJEC", image: "zajec.png" },
    ] 
  },
  { 
    letter: "Č", 
    words: [
      { text: "ČAJ", image: "caj.png" },
      { text: "OČI", image: "oci.png" },
      { text: "LUČ", image: "luc.png" },
    ] 
  },
  { 
    letter: "D", 
    words: [
      { text: "DUDA", image: "duda.png" },
      { text: "VODA", image: "voda.png" },
      { text: "MED", image: "med.png" },
    ] 
  },
  { 
    letter: "F", 
    words: [
      { text: "FEN", image: "fen.png" },
      { text: "MAFIN", image: "mafin.png" },
      { text: "KROF", image: "krof.png" },
    ] 
  },
  { 
    letter: "G", 
    words: [
      { text: "GOBA", image: "goba.png" },
      { text: "ŽOGA", image: "zoga.png" },
      { text: "SNEG", image: "sneg.png" },
    ] 
  },
  { 
    letter: "H", 
    words: [
      { text: "HIŠA", image: "hisa.png" },
      { text: "JUHA", image: "juha.png" },
      { text: "KRUH", image: "kruh.png" },
    ] 
  },
  { 
    letter: "J", 
    words: [
      { text: "JOPA", image: "jopa.png" },
      { text: "VEJA", image: "veja.png" },
      { text: "NOJ", image: "noj.png" },
    ] 
  },
  { 
    letter: "K", 
    words: [
      { text: "KOLO", image: "kolo.png" },
      { text: "ROKA", image: "roka.png" },
      { text: "RAK", image: "rak.png" },
    ] 
  },
  { 
    letter: "L", 
    words: [
      { text: "LEV", image: "lev.png" },
      { text: "MILO", image: "milo.png" },
      { text: "GOL", image: "gol.png" },
    ] 
  },
  { 
    letter: "M", 
    words: [
      { text: "MIZA", image: "miza.png" },
      { text: "GUMA", image: "guma.png" },
      { text: "SEDEM", image: "sedem.png" },
    ] 
  },
  { 
    letter: "N", 
    words: [
      { text: "NOS", image: "nos.png" },
      { text: "BANANA", image: "banana.png" },
      { text: "VOLAN", image: "volan.png" },
    ] 
  },
  { 
    letter: "P", 
    words: [
      { text: "PAJEK", image: "pajek.png" },
      { text: "KAPA", image: "kapa.png" },
      { text: "REP", image: "rep.png" },
    ] 
  },
  { 
    letter: "R", 
    words: [
      { text: "ROŽA", image: "roza.png" },
      { text: "URA", image: "ura.png" },
      { text: "SIR", image: "sir.png" },
    ] 
  },
  { 
    letter: "S", 
    words: [
      { text: "SOK", image: "sok.png" },
      { text: "OSA", image: "osa.png" },
      { text: "NOS", image: "nos.png" },
    ] 
  },
  { 
    letter: "Š", 
    words: [
      { text: "ŠAL", image: "sal.png" },
      { text: "HIŠA", image: "hisa.png" },
      { text: "KOŠ", image: "kos.png" },
    ] 
  },
  { 
    letter: "T", 
    words: [
      { text: "TORBA", image: "torba.png" },
      { text: "STOL", image: "stol.png" },
      { text: "COPAT", image: "copat.png" },
    ] 
  },
  { 
    letter: "V", 
    words: [
      { text: "VODA", image: "voda.png" },
      { text: "KAVA", image: "kava.png" },
      { text: "LEV", image: "lev.png" },
    ] 
  },
  { 
    letter: "Z", 
    words: [
      { text: "ZOB", image: "zob.png" },
      { text: "MIZA", image: "miza.png" },
      { text: "VOZ", image: "voz.png" },
    ] 
  },
  { 
    letter: "Ž", 
    words: [
      { text: "ŽOGA", image: "zoga.png" },
      { text: "ROŽA", image: "roza.png" },
      { text: "JEŽ", image: "jez.png" },
    ] 
  },
];
