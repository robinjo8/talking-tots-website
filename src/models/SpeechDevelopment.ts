
export interface SpeechDevelopmentQuestion {
  id: string;
  question: string;
  options: {
    value: string;
    label: string;
  }[];
}

export interface SpeechDevelopmentTextQuestion {
  id: string;
  question: string;
  placeholder?: string;
  required: boolean;
}

export const SPEECH_DEVELOPMENT_QUESTIONS: SpeechDevelopmentQuestion[] = [
  {
    id: "speech_clarity",
    question: "Ali druge osebe (izven vaše družine) razumejo kaj vaš otrok govori?",
    options: [
      { value: "yes", label: "Da" },
      { value: "no", label: "Ne" }
    ]
  },
  {
    id: "vocabulary_size",
    question: "Vaš otrok lahko reče:",
    options: [
      { value: "0-50", label: "0–50 besed" },
      { value: "50-200", label: "50–200 besed" },
      { value: "200+", label: "Več kot 200 besed" }
    ]
  },
  {
    id: "sentence_formation",
    question: "Ali zna vaš otrok tvoriti povedi?",
    options: [
      { value: "yes", label: "Da" },
      { value: "no", label: "Ne" }
    ]
  },
  {
    id: "word_pronunciation",
    question: "Ali vaš otrok jasno in razumljivo izgovarja besede?",
    options: [
      { value: "yes", label: "Da" },
      { value: "no", label: "Ne" }
    ]
  },
  {
    id: "ear_infections",
    question: "Ali je vaš otrok imel pogosta vnetja ušes ali težave s sluhom?",
    options: [
      { value: "yes", label: "Da" },
      { value: "no", label: "Ne" }
    ]
  },
  {
    id: "chewing_blowing",
    question: "Ali pri vašem otroku opažate težave z žvečenjem, izpihovanjem (npr. svečke)?",
    options: [
      { value: "yes", label: "Da" },
      { value: "no", label: "Ne" }
    ]
  },
  {
    id: "sees_speech_therapist",
    question: "Ali vaš otrok obiskuje logopeda?",
    options: [
      { value: "yes", label: "Da" },
      { value: "no", label: "Ne" }
    ]
  }
];

export const SPEECH_DEVELOPMENT_TEXT_QUESTIONS: SpeechDevelopmentTextQuestion[] = [
  {
    id: "pronunciation_difficulties",
    question: "Pri izgovorjavi katerega glasu/črke ima vaš otrok težave? Če opazite težave jih opišite, npr. R izgovarja kot L.",
    placeholder: "Opišite težave z izgovorjavo...",
    required: true
  },
  {
    id: "additional_observations",
    question: "Vaša dodatna opažanja, ki bi jih želeli izpostaviti:",
    placeholder: "Opcijsko - vpišite dodatna opažanja...",
    required: false
  }
];
