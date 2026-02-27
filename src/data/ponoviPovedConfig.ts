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
        { word: "Kača", image: "kaca1.webp", audio: "Kaca.mp3" },
        { word: "ima", image: "Stickman_imeti.webp", audio: "Ima.mp3" },
        { word: "kapo", image: "kapa1.webp", audio: "Kapo.mp3" }
      ],
      fullSentence: "Kača ima kapo.",
      audio: "kaca_ima_kapo.m4a"
    },
    {
      words: [
        { word: "Kuža", image: "kuza1.webp", audio: "Kuza.mp3" },
        { word: "vidi", image: "Stickman_gledati.webp", audio: "Vidi.mp3" },
        { word: "kost", image: "kost1.webp", audio: "Kost.mp3" }
      ],
      fullSentence: "Kuža vidi kost.",
      audio: "kuza_vidi_kost.m4a"
    },
    {
      words: [
        { word: "Koza", image: "koza1.webp", audio: "Koza_zival.mp3" },
        { word: "riše", image: "Stickman_risati.webp", audio: "Rise.mp3" },
        { word: "krog", image: "krog1.webp", audio: "Krog.mp3" }
      ],
      fullSentence: "Koza riše krog.",
      audio: "koza_rise_krog.m4a"
    },
    {
      words: [
        { word: "Kokoš", image: "kokos1.webp", audio: "Kokos_zival.mp3" },
        { word: "je", image: "Stickman_jesti.webp", audio: "Je.mp3" },
        { word: "koruzo", image: "koruza1.webp", audio: "Koruzo.mp3" }
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
        { word: "Lisica", image: "lisica1.webp", audio: "Lisica.mp3" },
        { word: "je", image: "Stickman_jesti.webp", audio: "Je.mp3" },
        { word: "list", image: "list1.webp", audio: "List.mp3" }
      ],
      fullSentence: "Lisica je list.",
      audio: "lisica_je_list.m4a"
    },
    {
      words: [
        { word: "Lev", image: "lev1.webp", audio: "Lev.mp3" },
        { word: "nese", image: "Stickman_nesti.webp", audio: "Nese.mp3" },
        { word: "led", image: "led1.webp", audio: "Led.mp3" }
      ],
      fullSentence: "Lev nese led.",
      audio: "lev_nese_led.m4a"
    },
    {
      words: [
        { word: "Lovec", image: "lovec1.webp", audio: "Lovec.mp3" },
        { word: "vidi", image: "Stickman_gledati.webp", audio: "Vidi.mp3" },
        { word: "letalo", image: "letalo1.webp", audio: "Letalo.mp3" }
      ],
      fullSentence: "Lovec vidi letalo.",
      audio: "lovec_vidi_letalo.m4a"
    },
    {
      words: [
        { word: "Slon", image: "slon1.webp", audio: "Slon.mp3" },
        { word: "ima", image: "Stickman_imeti.webp", audio: "Ima.mp3" },
        { word: "liziko", image: "lizika1.webp", audio: "Liziko.mp3" }
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
        { word: "Riba", image: "riba1.webp", audio: "Riba.mp3" },
        { word: "vidi", image: "Stickman_gledati.webp", audio: "Vidi.mp3" },
        { word: "raka", image: "rak1.webp", audio: "Raka.mp3" }
      ],
      fullSentence: "Riba vidi raka.",
      audio: "riba_vidi_raka.m4a"
    },
    {
      words: [
        { word: "Raca", image: "raca1.webp", audio: "Raca.mp3" },
        { word: "je", image: "Stickman_jesti.webp", audio: "Je.mp3" },
        { word: "repo", image: "repa1.webp", audio: "Repo.mp3" }
      ],
      fullSentence: "Raca je repo.",
      audio: "raca_je_repo.m4a"
    },
    {
      words: [
        { word: "Ris", image: "ris1.webp", audio: "Ris.mp3" },
        { word: "riše", image: "Stickman_risati.webp", audio: "Rise.mp3" },
        { word: "rožo", image: "roza1.webp", audio: "Rozo.mp3" }
      ],
      fullSentence: "Ris riše rožo.",
      audio: "ris_rise_rozo.m4a"
    },
    {
      words: [
        { word: "Robot", image: "robot1.webp", audio: "Robot.mp3" },
        { word: "ima", image: "Stickman_imeti.webp", audio: "Ima.mp3" },
        { word: "rolko", image: "rolka1.webp", audio: "Rolko.mp3" }
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
        { word: "Sova", image: "sova1.webp", audio: "Sova.mp3" },
        { word: "nese", image: "Stickman_nesti.webp", audio: "Nese.mp3" },
        { word: "sir", image: "sir1.webp", audio: "Sir.mp3" }
      ],
      fullSentence: "Sova nese sir.",
      audio: "sova_nese_sir.m4a"
    },
    {
      words: [
        { word: "Slon", image: "slon1.webp", audio: "Slon.mp3" },
        { word: "je", image: "Stickman_jesti.webp", audio: "Je.mp3" },
        { word: "sladoled", image: "sladoled1.webp", audio: "Sladoled.mp3" }
      ],
      fullSentence: "Slon je sladoled.",
      audio: "slon_je_sladoled.m4a"
    },
    {
      words: [
        { word: "Snežak", image: "snezak1.webp", audio: "Snezak.mp3" },
        { word: "vidi", image: "Stickman_gledati.webp", audio: "Vidi.mp3" },
        { word: "sneg", image: "sneg1.webp", audio: "Sneg.mp3" }
      ],
      fullSentence: "Snežak vidi sneg.",
      audio: "snezak_vidi_sneg.m4a"
    },
    {
      words: [
        { word: "Osa", image: "osa1.webp", audio: "Osa.mp3" },
        { word: "ima", image: "Stickman_imeti.webp", audio: "Ima.mp3" },
        { word: "sok", image: "sok1.webp", audio: "Sok.mp3" }
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
        { word: "Zajec", image: "zajec1.webp", audio: "Zajec.mp3" },
        { word: "ima", image: "Stickman_imeti.webp", audio: "Ima.mp3" },
        { word: "zob", image: "zob1.webp", audio: "Zob.mp3" }
      ],
      fullSentence: "Zajec ima zob.",
      audio: "zajec_ima_zob.m4a"
    },
    {
      words: [
        { word: "Zmaj", image: "zmaj1.webp", audio: "Zmaj.mp3" },
        { word: "nese", image: "Stickman_nesti.webp", audio: "Nese.mp3" },
        { word: "zlato", image: "zlato1.webp", audio: "Zlato.mp3" }
      ],
      fullSentence: "Zmaj nese zlato.",
      audio: "zmaj_nese_zlato.m4a"
    },
    {
      words: [
        { word: "Zebra", image: "zebra1.webp", audio: "Zebra.mp3" },
        { word: "vidi", image: "Stickman_gledati.webp", audio: "Vidi.mp3" },
        { word: "zvezdo", image: "zvezda1.webp", audio: "Zvezdo.mp3" }
      ],
      fullSentence: "Zebra vidi zvezdo.",
      audio: "zebra_vidi_zvezdo.m4a"
    },
    {
      words: [
        { word: "Meduza", image: "meduza1.webp", audio: "Meduza.mp3" },
        { word: "je", image: "Stickman_jesti.webp", audio: "Je.mp3" },
        { word: "grozdje", image: "grozdje1.webp", audio: "Grozdje.mp3" }
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
        { word: "Raca", image: "raca1.webp", audio: "Raca.mp3" },
        { word: "nese", image: "Stickman_nesti.webp", audio: "Nese.mp3" },
        { word: "cekin", image: "cekin1.webp", audio: "Cekin.mp3" }
      ],
      fullSentence: "Raca nese cekin.",
      audio: "raca_nese_cekin.m4a"
    },
    {
      words: [
        { word: "Muca", image: "muca1.webp", audio: "Muca.mp3" },
        { word: "je", image: "Stickman_jesti.webp", audio: "Je.mp3" },
        { word: "cvet", image: "cvet1.webp", audio: "Cvet.mp3" }
      ],
      fullSentence: "Muca je cvet.",
      audio: "muca_je_cvet.m4a"
    },
    {
      words: [
        { word: "Lovec", image: "lovec1.webp", audio: "Lovec.mp3" },
        { word: "ima", image: "Stickman_imeti.webp", audio: "Ima.mp3" },
        { word: "copat", image: "copat1.webp", audio: "Copat.mp3" }
      ],
      fullSentence: "Lovec ima copat.",
      audio: "lovec_ima_copat.m4a"
    },
    {
      words: [
        { word: "Opica", image: "opica1.webp", audio: "Opica.mp3" },
        { word: "vidi", image: "Stickman_gledati.webp", audio: "Vidi.mp3" },
        { word: "cirkus", image: "cirkus1.webp", audio: "Cirkus.mp3" }
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
        { word: "Šofer", image: "sofer1.webp", audio: "Sofer.mp3" },
        { word: "nese", image: "Stickman_nesti.webp", audio: "Nese.mp3" },
        { word: "šopek", image: "sopek1.webp", audio: "Sopek.mp3" }
      ],
      fullSentence: "Šofer nese šopek.",
      audio: "sofer_nese_sopek.m4a"
    },
    {
      words: [
        { word: "Štorklja", image: "storklja1.webp", audio: "Storklja.mp3" },
        { word: "je", image: "Stickman_jesti.webp", audio: "Je.mp3" },
        { word: "školjko", image: "skoljka1.webp", audio: "Skoljko.mp3" }
      ],
      fullSentence: "Štorklja je školjko.",
      audio: "storklja_je_skoljko.m4a"
    },
    {
      words: [
        { word: "Kokoš", image: "kokos1.webp", audio: "Kokos_zival.mp3" },
        { word: "ima", image: "Stickman_imeti.webp", audio: "Ima.mp3" },
        { word: "šal", image: "sal1.webp", audio: "Sal.mp3" }
      ],
      fullSentence: "Kokoš ima šal.",
      audio: "kokos_ima_sal.m4a"
    },
    {
      words: [
        { word: "Miš", image: "mis1.webp", audio: "Mis.mp3" },
        { word: "vidi", image: "Stickman_gledati.webp", audio: "Vidi.mp3" },
        { word: "šotor", image: "sotor1.webp", audio: "Sotor.mp3" }
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
        { word: "Žaba", image: "zaba1.webp", audio: "Zaba.mp3" },
        { word: "želi", image: "Stickman_zeleti.webp", audio: "Zeli.mp3" },
        { word: "žago", image: "zaga1.webp", audio: "Zago.mp3" }
      ],
      fullSentence: "Žaba želi žago.",
      audio: "zaba_zeli_zago.m4a"
    },
    {
      words: [
        { word: "Želva", image: "zelva1.webp", audio: "Zelva.mp3" },
        { word: "nese", image: "Stickman_nesti.webp", audio: "Nese.mp3" },
        { word: "žogo", image: "zoga1.webp", audio: "Zogo.mp3" }
      ],
      fullSentence: "Želva nese žogo.",
      audio: "zelva_nese_zogo.m4a"
    },
    {
      words: [
        { word: "Žirafa", image: "zirafa1.webp", audio: "Zirafa.mp3" },
        { word: "vidi", image: "Stickman_gledati.webp", audio: "Vidi.mp3" },
        { word: "žerjav", image: "zerjav1.webp", audio: "Zerjav.mp3" }
      ],
      fullSentence: "Žirafa vidi žerjav.",
      audio: "zirafa_vidi_zerjav.m4a"
    },
    {
      words: [
        { word: "Žolna", image: "zolna1.webp", audio: "Zolna.mp3" },
        { word: "ima", image: "Stickman_imeti.webp", audio: "Ima.mp3" },
        { word: "žlico", image: "zlica1.webp", audio: "Zlico.mp3" }
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
        { word: "Čuvaj", image: "cuvaj1.webp", audio: "Cuvaj.mp3" },
        { word: "ima", image: "Stickman_imeti.webp", audio: "Ima.mp3" },
        { word: "čoln", image: "coln1.webp", audio: "Coln.mp3" }
      ],
      fullSentence: "Čuvaj ima čoln.",
      audio: "cuvaj_ima_coln.m4a"
    },
    {
      words: [
        { word: "Čarovnik", image: "carovnik1.webp", audio: "Carovnik.mp3" },
        { word: "nese", image: "Stickman_nesti.webp", audio: "Nese.mp3" },
        { word: "čopič", image: "copic1.webp", audio: "Copic.mp3" }
      ],
      fullSentence: "Čarovnik nese čopič.",
      audio: "carovnik_nese_copic.m4a"
    },
    {
      words: [
        { word: "Čebela", image: "cebela1.webp", audio: "Cebela.mp3" },
        { word: "vidi", image: "Stickman_gledati.webp", audio: "Vidi.mp3" },
        { word: "čebulo", image: "cebula1.webp", audio: "Cebulo.mp3" }
      ],
      fullSentence: "Čebela vidi čebulo.",
      audio: "cebela_vidi_cebulo.m4a"
    },
    {
      words: [
        { word: "Kača", image: "kaca1.webp", audio: "Kaca.mp3" },
        { word: "je", image: "Stickman_jesti.webp", audio: "Je.mp3" },
        { word: "čokolado", image: "cokolada1.webp", audio: "Cokolado.mp3" }
      ],
      fullSentence: "Kača je čokolado.",
      audio: "kaca_je_cokolado.m4a"
    }
  ]
};

// Configuration for R začetne vaje
export const ponoviPovedRZacetek: PonoviPovedConfig = {
  letter: "r-zacetek",
  displayLetter: "R",
  sentences: [
    {
      words: [
        { word: "Princ", image: "princ1.webp", audio: "Princ.mp3" },
        { word: "vidi", image: "Stickman_gledati.webp", audio: "Vidi.mp3" },
        { word: "drevo", image: "drevo1.webp", audio: "Drevo.mp3" }
      ],
      fullSentence: "Princ vidi drevo.",
      audio: "princ_vidi_drevo.m4a"
    },
    {
      words: [
        { word: "Dron", image: "dron1.webp", audio: "Dron.mp3" },
        { word: "nese", image: "Stickman_nesti.webp", audio: "Nese.mp3" },
        { word: "breskev", image: "breskev1.webp", audio: "Breskev.mp3" }
      ],
      fullSentence: "Dron nese breskev.",
      audio: "dron_nese_breskev.m4a"
    },
    {
      words: [
        { word: "Breza", image: "breza1.webp", audio: "Breza.mp3" },
        { word: "ima", image: "Stickman_imeti.webp", audio: "Ima.mp3" },
        { word: "trak", image: "trak1.webp", audio: "Trak.mp3" }
      ],
      fullSentence: "Breza ima trak.",
      audio: "breza_ima_trak.m4a"
    },
    {
      words: [
        { word: "Trava", image: "trava1.webp", audio: "Trava.mp3" },
        { word: "je", image: "Stickman_jesti.webp", audio: "Je.mp3" },
        { word: "brokoli", image: "brokoli1.webp", audio: "Brokoli.mp3" }
      ],
      fullSentence: "Trava je brokoli.",
      audio: "trava_je_brokoli.m4a"
    }
  ]
};

// Map of all available configurations by letter
const configMap: Record<string, PonoviPovedConfig> = {
  k: ponoviPovedK,
  l: ponoviPovedL,
  r: ponoviPovedR,
  's': ponoviPovedS,
  z: ponoviPovedZ,
  c: ponoviPovedC,
  sh: ponoviPovedSH,
  zh: ponoviPovedZH,
  ch: ponoviPovedCH,
  'r-zacetek': ponoviPovedRZacetek,
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
