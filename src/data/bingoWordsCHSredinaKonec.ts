// Words with Č in the middle/end for Bingo game
export interface BingoWord {
  word: string;
  image: string;
  audio: string | null;
}

export const wordsDataČSredinaKonec: BingoWord[] = [
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
