
export interface Word {
  text: string;
  image: string;
  audio?: string;
}

export interface LetterGroup {
  letter: string;
  words: Word[];
}

// Comprehensive test data with all necessary information
export const articulationData: LetterGroup[] = [
  { 
    letter: "P", 
    words: [
      { text: "PIPA", image: "pipa.png" },
      { text: "KAPA", image: "kapa.png" },
      { text: "KLOP", image: "klop.png" },
    ] 
  },
  { 
    letter: "B", 
    words: [
      { text: "BALON", image: "balon.png" },
      { text: "RIBA", image: "riba.png" },
      { text: "ZOB", image: "zob.png" },
    ] 
  },
  { 
    letter: "F", 
    words: [
      { text: "FANT", image: "fant.png" },
      { text: "TELEFON", image: "telefon.png" },
      { text: "KROF", image: "krof.png" },
    ] 
  },
  { 
    letter: "V", 
    words: [
      { text: "VETERNICA", image: "veternica.png" },
      { text: "KRAVA", image: "krava.png" },
      { text: "LEV", image: "lev.png" },
    ] 
  },
  { 
    letter: "T", 
    words: [
      { text: "TROBENTA", image: "trobenta.png" },
      { text: "AVTO", image: "avto.png" },
      { text: "LIST", image: "list.png" },
    ] 
  },
  { 
    letter: "D", 
    words: [
      { text: "DREVO", image: "drevo.png" },
      { text: "DUDA", image: "duda.png" },
      { text: "LED", image: "led.png" },
    ] 
  },
  { letter: "Š", words: [
      { text: "ŠKARJE", image: "skarje.png" }, 
      { text: "HRUŠKA", image: "hruska.png" }, 
      { text: "KOKOŠ", image: "kokos.png" }
    ] 
  },
  { letter: "S", words: [
      { text: "SOVA", image: "sova.png" }, 
      { text: "KOST", image: "kost.png" }, 
      { text: "PAS", image: "pas.png" }
    ] 
  },
  { letter: "Ž", words: [
      { text: "ŽABA", image: "zaba.png" }, 
      { text: "ROŽA", image: "roza.png" }, 
      { text: "POLŽ", image: "polz.png" }
    ] 
  },
  { letter: "Z", words: [
      { text: "ZEBRA", image: "zebra.png" }, 
      { text: "KOZA", image: "koza.png" }, 
      { text: "OBRAZ", image: "obraz.png" }
    ] 
  },
  { letter: "Č", words: [
      { text: "ČEBELA", image: "cebela.png" }, 
      { text: "OČALA", image: "ocala.png" }, 
      { text: "KLJUČ", image: "kljuc.png" }
    ] 
  },
  { letter: "C", words: [
      { text: "COPATI", image: "copati.png" }, 
      { text: "VILICE", image: "vilice.png" }, 
      { text: "LONEC", image: "lonec.png" }
    ] 
  },
  { letter: "K", words: [
      { text: "KAČA", image: "kaca.png" }, 
      { text: "ČRKE", image: "crke.png" }, 
      { text: "OBLAK", image: "oblak.png" }
    ] 
  },
  { letter: "G", words: [
      { text: "GOBA", image: "goba.png" }, 
      { text: "NOGA", image: "noga.png" }, 
      { text: "KROG", image: "krog.png" }
    ] 
  },
  { letter: "H", words: [
      { text: "HIŠA", image: "hisa.png" }, 
      { text: "MUHA", image: "muha.png" }, 
      { text: "KRUH", image: "kruh.png" }
    ] 
  },
  { letter: "M", words: [
      { text: "METLA", image: "metla.png" }, 
      { text: "OMARA", image: "omara.png" }, 
      { text: "DIM", image: "dim.png" }
    ] 
  },
  { letter: "N", words: [
      { text: "NOGAVICE", image: "nogavice.png" }, 
      { text: "BANANA", image: "banana.png" }, 
      { text: "SLON", image: "slon.png" }
    ] 
  },
  { letter: "L", words: [
      { text: "LADJA", image: "ladja.png" }, 
      { text: "KOLO", image: "kolo.png" }, 
      { text: "ŠAL", image: "sal.png" }
    ] 
  },
  { letter: "R", words: [
      { text: "ROKA", image: "roka.png" }, 
      { text: "URA", image: "ura.png" }, 
      { text: "SIR", image: "sir.png" }
    ] 
  },
  { letter: "J", words: [
      { text: "JABOLKO", image: "jabolko.png" }, 
      { text: "JAJCE", image: "jajce.png" }, 
      { text: "ZMAJ", image: "zmaj.png" }
    ] 
  },
];
