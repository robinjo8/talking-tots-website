
export interface SpeechDevelopmentQuestion {
  id: string;
  question: string;
  options: {
    value: string;
    label: string;
  }[];
}

export const SPEECH_DEVELOPMENT_QUESTIONS: SpeechDevelopmentQuestion[] = [
  {
    id: "vocabulary_size",
    question: "Moj otrok lahko reče:",
    options: [
      { value: "0", label: "0 besed" },
      { value: "1-10", label: "1–10 besed" },
      { value: "10+", label: "10+ besed" }
    ]
  },
  {
    id: "recognizes_shapes_colors",
    question: "Ali vaš otrok prepozna barve in like:",
    options: [
      { value: "yes", label: "Da" },
      { value: "no", label: "Ne" }
    ]
  },
  {
    id: "animal_words",
    question: "Koliko besed pogostih živali pozna vaš otrok:",
    options: [
      { value: "0", label: "0" },
      { value: "1-10", label: "1–10" },
      { value: "10+", label: "10+" }
    ]
  },
  {
    id: "speech_clarity",
    question: "Ali druge osebe izven vaše družine razumejo kaj vaš otrok govori?",
    options: [
      { value: "yes", label: "Da" },
      { value: "no", label: "Ne" }
    ]
  },
  {
    id: "word_pronunciation",
    question: "Ali vaš otrok jasno in razumljivo izgovarja besede:",
    options: [
      { value: "yes", label: "Da" },
      { value: "no", label: "Ne" },
      { value: "some", label: "Samo nekatere besede" }
    ]
  },
  {
    id: "sentence_formation",
    question: "Ali vaš otrok zna tvoriti stavke?",
    options: [
      { value: "yes", label: "Da" },
      { value: "no", label: "Ne" },
      { value: "short", label: "Samo kratke stavke" }
    ]
  },
  {
    id: "sees_speech_therapist",
    question: "Ali vaš otrok obiskuje logopeda:",
    options: [
      { value: "yes", label: "Da" },
      { value: "no", label: "Ne" }
    ]
  }
];
