// Configuration for "Ponovi Poved" (Repeat the Sentence) game
// Each letter has 4 sentences with 3 words each

export interface SentenceWord {
  word: string;       // Word to display
  image: string;      // Image filename in 'slike' bucket
  audio: string;      // Audio filename in 'zvocni-posnetki' bucket
}

export interface Sentence {
  words: [SentenceWord, SentenceWord, SentenceWord];  // Exactly 3 words
  fullSentence: string;  // Complete sentence text
  audio: string;         // Full sentence audio (may not exist yet)
}

export interface PonoviPovedConfig {
  letter: string;
  displayLetter: string;
  sentences: Sentence[];  // 4 sentences
}

// Supabase storage URLs
export const IMAGES_BASE_URL = "https://ecmtctwovkheohqwahvt.supabase.co/storage/v1/object/public/slike";
export const AUDIO_BASE_URL = "https://ecmtctwovkheohqwahvt.supabase.co/storage/v1/object/public/zvocni-posnetki";

// Helper to get full image URL
export const getImageUrl = (filename: string): string => `${IMAGES_BASE_URL}/${filename}`;

// Helper to get full audio URL
export const getAudioUrl = (filename: string): string => `${AUDIO_BASE_URL}/${filename}`;

// Configuration for letter K
export const ponoviPovedK: PonoviPovedConfig = {
  letter: "k",
  displayLetter: "K",
  sentences: [
    {
      words: [
        { word: "Kača", image: "kaca1.webp", audio: "kaca.m4a" },
        { word: "ima", image: "Stickman_imeti.webp", audio: "ima.m4a" },
        { word: "kapo", image: "kapa1.webp", audio: "kapo.m4a" }
      ],
      fullSentence: "Kača ima kapo.",
      audio: "kaca_ima_kapo.m4a"
    },
    {
      words: [
        { word: "Kuža", image: "kuza1.webp", audio: "kuza.m4a" },
        { word: "vidi", image: "Stickman_gledati.webp", audio: "vidi.m4a" },
        { word: "kost", image: "kost1.webp", audio: "kost.m4a" }
      ],
      fullSentence: "Kuža vidi kost.",
      audio: "kuza_vidi_kost.m4a"
    },
    {
      words: [
        { word: "Koza", image: "koza1.webp", audio: "koza.m4a" },
        { word: "riše", image: "Stickman_risati.webp", audio: "rise.m4a" },
        { word: "krog", image: "krog1.webp", audio: "krog.m4a" }
      ],
      fullSentence: "Koza riše krog.",
      audio: "koza_rise_krog.m4a"
    },
    {
      words: [
        { word: "Kokoš", image: "kokos1.webp", audio: "kokos.m4a" },
        { word: "je", image: "Stickman_jesti.webp", audio: "je.m4a" },
        { word: "koruzo", image: "koruza1.webp", audio: "koruzo.m4a" }
      ],
      fullSentence: "Kokoš je koruzo.",
      audio: "kokos_je_koruzo.m4a"
    }
  ]
};

// Configuration for letter L
export const ponoviPovedL: PonoviPovedConfig = {
  letter: "l",
  displayLetter: "L",
  sentences: [
    {
      words: [
        { word: "Lisica", image: "lisica1.webp", audio: "lisica.m4a" },
        { word: "je", image: "Stickman_jesti.webp", audio: "je.m4a" },
        { word: "list", image: "list1.webp", audio: "list.m4a" }
      ],
      fullSentence: "Lisica je list.",
      audio: "lisica_je_list.m4a"
    },
    {
      words: [
        { word: "Lev", image: "lev1.webp", audio: "lev.m4a" },
        { word: "nese", image: "Stickman_nesti.webp", audio: "nese.m4a" },
        { word: "led", image: "led1.webp", audio: "led.m4a" }
      ],
      fullSentence: "Lev nese led.",
      audio: "lev_nese_led.m4a"
    },
    {
      words: [
        { word: "Lovec", image: "lovec1.webp", audio: "lovec.m4a" },
        { word: "vidi", image: "Stickman_gledati.webp", audio: "vidi.m4a" },
        { word: "letalo", image: "letalo1.webp", audio: "letalo.m4a" }
      ],
      fullSentence: "Lovec vidi letalo.",
      audio: "lovec_vidi_letalo.m4a"
    },
    {
      words: [
        { word: "Slon", image: "slon1.webp", audio: "slon.m4a" },
        { word: "ima", image: "Stickman_imeti.webp", audio: "ima.m4a" },
        { word: "liziko", image: "lizika1.webp", audio: "liziko.m4a" }
      ],
      fullSentence: "Slon ima liziko.",
      audio: "slon_ima_liziko.m4a"
    }
  ]
};

// Configuration for letter R
export const ponoviPovedR: PonoviPovedConfig = {
  letter: "r",
  displayLetter: "R",
  sentences: [
    {
      words: [
        { word: "Riba", image: "riba1.webp", audio: "riba.m4a" },
        { word: "vidi", image: "Stickman_gledati.webp", audio: "vidi.m4a" },
        { word: "raka", image: "rak1.webp", audio: "raka.m4a" }
      ],
      fullSentence: "Riba vidi raka.",
      audio: "riba_vidi_raka.m4a"
    },
    {
      words: [
        { word: "Raca", image: "raca1.webp", audio: "raca.m4a" },
        { word: "je", image: "Stickman_jesti.webp", audio: "je.m4a" },
        { word: "repo", image: "repa1.webp", audio: "repo.m4a" }
      ],
      fullSentence: "Raca je repo.",
      audio: "raca_je_repo.m4a"
    },
    {
      words: [
        { word: "Ris", image: "ris1.webp", audio: "ris.m4a" },
        { word: "riše", image: "Stickman_risati.webp", audio: "rise.m4a" },
        { word: "rožo", image: "roza1.webp", audio: "rozo.m4a" }
      ],
      fullSentence: "Ris riše rožo.",
      audio: "ris_rise_rozo.m4a"
    },
    {
      words: [
        { word: "Robot", image: "robot1.webp", audio: "robot.m4a" },
        { word: "ima", image: "Stickman_imeti.webp", audio: "ima.m4a" },
        { word: "rolko", image: "rolka1.webp", audio: "rolko.m4a" }
      ],
      fullSentence: "Robot ima rolko.",
      audio: "robot_ima_rolko.m4a"
    }
  ]
};

// Configuration for letter S
export const ponoviPovedS: PonoviPovedConfig = {
  letter: "s",
  displayLetter: "S",
  sentences: [
    {
      words: [
        { word: "Sova", image: "sova1.webp", audio: "sova.m4a" },
        { word: "nese", image: "Stickman_nesti.webp", audio: "nese.m4a" },
        { word: "sir", image: "sir1.webp", audio: "sir.m4a" }
      ],
      fullSentence: "Sova nese sir.",
      audio: "sova_nese_sir.m4a"
    },
    {
      words: [
        { word: "Slon", image: "slon1.webp", audio: "slon.m4a" },
        { word: "je", image: "Stickman_jesti.webp", audio: "je.m4a" },
        { word: "sladoled", image: "sladoled1.webp", audio: "sladoled.m4a" }
      ],
      fullSentence: "Slon je sladoled.",
      audio: "slon_je_sladoled.m4a"
    },
    {
      words: [
        { word: "Snežak", image: "snezak1.webp", audio: "snezak.m4a" },
        { word: "vidi", image: "Stickman_gledati.webp", audio: "vidi.m4a" },
        { word: "sneg", image: "sneg1.webp", audio: "sneg.m4a" }
      ],
      fullSentence: "Snežak vidi sneg.",
      audio: "snezak_vidi_sneg.m4a"
    },
    {
      words: [
        { word: "Osa", image: "osa1.webp", audio: "osa.m4a" },
        { word: "ima", image: "Stickman_imeti.webp", audio: "ima.m4a" },
        { word: "sok", image: "sok1.webp", audio: "sok.m4a" }
      ],
      fullSentence: "Osa ima sok.",
      audio: "osa_ima_sok.m4a"
    }
  ]
};

// Configuration for letter Z
export const ponoviPovedZ: PonoviPovedConfig = {
  letter: "z",
  displayLetter: "Z",
  sentences: [
    {
      words: [
        { word: "Zajec", image: "zajec1.webp", audio: "zajec.m4a" },
        { word: "ima", image: "Stickman_imeti.webp", audio: "ima.m4a" },
        { word: "zob", image: "zob1.webp", audio: "zob.m4a" }
      ],
      fullSentence: "Zajec ima zob.",
      audio: "zajec_ima_zob.m4a"
    },
    {
      words: [
        { word: "Zmaj", image: "zmaj1.webp", audio: "zmaj.m4a" },
        { word: "nese", image: "Stickman_nesti.webp", audio: "nese.m4a" },
        { word: "zlato", image: "zlato1.webp", audio: "zlato.m4a" }
      ],
      fullSentence: "Zmaj nese zlato.",
      audio: "zmaj_nese_zlato.m4a"
    },
    {
      words: [
        { word: "Zebra", image: "zebra1.webp", audio: "zebra.m4a" },
        { word: "vidi", image: "Stickman_gledati.webp", audio: "vidi.m4a" },
        { word: "zvezdo", image: "zvezda1.webp", audio: "zvezdo.m4a" }
      ],
      fullSentence: "Zebra vidi zvezdo.",
      audio: "zebra_vidi_zvezdo.m4a"
    },
    {
      words: [
        { word: "Meduza", image: "meduza1.webp", audio: "meduza.m4a" },
        { word: "je", image: "Stickman_jesti.webp", audio: "je.m4a" },
        { word: "grozdje", image: "grozdje1.webp", audio: "grozdje.m4a" }
      ],
      fullSentence: "Meduza je grozdje.",
      audio: "meduza_je_grozdje.m4a"
    }
  ]
};

// Configuration for letter C
export const ponoviPovedC: PonoviPovedConfig = {
  letter: "c",
  displayLetter: "C",
  sentences: [
    {
      words: [
        { word: "Raca", image: "raca1.webp", audio: "raca.m4a" },
        { word: "nese", image: "Stickman_nesti.webp", audio: "nese.m4a" },
        { word: "cekin", image: "cekin1.webp", audio: "cekin.m4a" }
      ],
      fullSentence: "Raca nese cekin.",
      audio: "raca_nese_cekin.m4a"
    },
    {
      words: [
        { word: "Muca", image: "muca1.webp", audio: "muca.m4a" },
        { word: "je", image: "Stickman_jesti.webp", audio: "je.m4a" },
        { word: "cvet", image: "cvet1.webp", audio: "cvet.m4a" }
      ],
      fullSentence: "Muca je cvet.",
      audio: "muca_je_cvet.m4a"
    },
    {
      words: [
        { word: "Lovec", image: "lovec1.webp", audio: "lovec.m4a" },
        { word: "ima", image: "Stickman_imeti.webp", audio: "ima.m4a" },
        { word: "copat", image: "copat1.webp", audio: "copat.m4a" }
      ],
      fullSentence: "Lovec ima copat.",
      audio: "lovec_ima_copat.m4a"
    },
    {
      words: [
        { word: "Opica", image: "opica1.webp", audio: "opica.m4a" },
        { word: "vidi", image: "Stickman_gledati.webp", audio: "vidi.m4a" },
        { word: "cirkus", image: "cirkus1.webp", audio: "cirkus.m4a" }
      ],
      fullSentence: "Opica vidi cirkus.",
      audio: "opica_vidi_cirkus.m4a"
    }
  ]
};

// Configuration for letter Š (sh)
export const ponoviPovedSH: PonoviPovedConfig = {
  letter: "sh",
  displayLetter: "Š",
  sentences: [
    {
      words: [
        { word: "Šofer", image: "sofer1.webp", audio: "sofer.m4a" },
        { word: "nese", image: "Stickman_nesti.webp", audio: "nese.m4a" },
        { word: "šopek", image: "sopek1.webp", audio: "sopek.m4a" }
      ],
      fullSentence: "Šofer nese šopek.",
      audio: "sofer_nese_sopek.m4a"
    },
    {
      words: [
        { word: "Štorklja", image: "storklja1.webp", audio: "storklja.m4a" },
        { word: "je", image: "Stickman_jesti.webp", audio: "je.m4a" },
        { word: "školjko", image: "skoljka1.webp", audio: "skoljko.m4a" }
      ],
      fullSentence: "Štorklja je školjko.",
      audio: "storklja_je_skoljko.m4a"
    },
    {
      words: [
        { word: "Kokoš", image: "kokos1.webp", audio: "kokos.m4a" },
        { word: "ima", image: "Stickman_imeti.webp", audio: "ima.m4a" },
        { word: "šal", image: "sal1.webp", audio: "sal.m4a" }
      ],
      fullSentence: "Kokoš ima šal.",
      audio: "kokos_ima_sal.m4a"
    },
    {
      words: [
        { word: "Miš", image: "mis1.webp", audio: "mis.m4a" },
        { word: "vidi", image: "Stickman_gledati.webp", audio: "vidi.m4a" },
        { word: "šotor", image: "sotor1.webp", audio: "sotor.m4a" }
      ],
      fullSentence: "Miš vidi šotor.",
      audio: "mis_vidi_sotor.m4a"
    }
  ]
};

// Configuration for letter Ž (zh)
export const ponoviPovedZH: PonoviPovedConfig = {
  letter: "zh",
  displayLetter: "Ž",
  sentences: [
    {
      words: [
        { word: "Žaba", image: "zaba1.webp", audio: "zaba.m4a" },
        { word: "želi", image: "Stickman_zeleti.webp", audio: "zeli.m4a" },
        { word: "žago", image: "zaga1.webp", audio: "zago.m4a" }
      ],
      fullSentence: "Žaba želi žago.",
      audio: "zaba_zeli_zago.m4a"
    },
    {
      words: [
        { word: "Želva", image: "zelva1.webp", audio: "zelva.m4a" },
        { word: "nese", image: "Stickman_nesti.webp", audio: "nese.m4a" },
        { word: "žogo", image: "zoga1.webp", audio: "zogo.m4a" }
      ],
      fullSentence: "Želva nese žogo.",
      audio: "zelva_nese_zogo.m4a"
    },
    {
      words: [
        { word: "Žirafa", image: "zirafa1.webp", audio: "zirafa.m4a" },
        { word: "vidi", image: "Stickman_gledati.webp", audio: "vidi.m4a" },
        { word: "žerjav", image: "zerjav1.webp", audio: "zerjav.m4a" }
      ],
      fullSentence: "Žirafa vidi žerjav.",
      audio: "zirafa_vidi_zerjav.m4a"
    },
    {
      words: [
        { word: "Žolna", image: "zolna1.webp", audio: "zolna.m4a" },
        { word: "ima", image: "Stickman_imeti.webp", audio: "ima.m4a" },
        { word: "žlico", image: "zlica1.webp", audio: "zlico.m4a" }
      ],
      fullSentence: "Žolna ima žlico.",
      audio: "zolna_ima_zlico.m4a"
    }
  ]
};

// Configuration for letter Č (ch)
export const ponoviPovedCH: PonoviPovedConfig = {
  letter: "ch",
  displayLetter: "Č",
  sentences: [
    {
      words: [
        { word: "Čuvaj", image: "cuvaj1.webp", audio: "cuvaj.m4a" },
        { word: "ima", image: "Stickman_imeti.webp", audio: "ima.m4a" },
        { word: "čoln", image: "coln1.webp", audio: "coln.m4a" }
      ],
      fullSentence: "Čuvaj ima čoln.",
      audio: "cuvaj_ima_coln.m4a"
    },
    {
      words: [
        { word: "Čarovnik", image: "carovnik1.webp", audio: "carovnik.m4a" },
        { word: "nese", image: "Stickman_nesti.webp", audio: "nese.m4a" },
        { word: "čopič", image: "copic1.webp", audio: "copic.m4a" }
      ],
      fullSentence: "Čarovnik nese čopič.",
      audio: "carovnik_nese_copic.m4a"
    },
    {
      words: [
        { word: "Čebela", image: "cebela1.webp", audio: "cebela.m4a" },
        { word: "vidi", image: "Stickman_gledati.webp", audio: "vidi.m4a" },
        { word: "čebulo", image: "cebula1.webp", audio: "cebulo.m4a" }
      ],
      fullSentence: "Čebela vidi čebulo.",
      audio: "cebela_vidi_cebulo.m4a"
    },
    {
      words: [
        { word: "Kača", image: "kaca1.webp", audio: "kaca.m4a" },
        { word: "je", image: "Stickman_jesti.webp", audio: "je.m4a" },
        { word: "čokolado", image: "cokolada1.webp", audio: "cokolado.m4a" }
      ],
      fullSentence: "Kača je čokolado.",
      audio: "kaca_je_cokolado.m4a"
    }
  ]
};

// Map of all available configurations by letter
const configMap: Record<string, PonoviPovedConfig> = {
  k: ponoviPovedK,
  l: ponoviPovedL,
  r: ponoviPovedR,
  s: ponoviPovedS,
  z: ponoviPovedZ,
  c: ponoviPovedC,
  sh: ponoviPovedSH,
  zh: ponoviPovedZH,
  ch: ponoviPovedCH,
};

// Get configuration by letter (supports ASCII digraphs)
export const getPonoviPovedConfig = (letter: string): PonoviPovedConfig | null => {
  const normalizedLetter = letter.toLowerCase();
  return configMap[normalizedLetter] || null;
};

// Check if a letter configuration exists
export const hasPonoviPovedConfig = (letter: string): boolean => {
  const normalizedLetter = letter.toLowerCase();
  return normalizedLetter in configMap;
};

// Get all available letters
export const getAvailableLetters = (): string[] => {
  return Object.keys(configMap);
};
