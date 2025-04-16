
export interface SpeechDifficulty {
  id: string;
  icon: string;
  title: string;
  description: string;
  example?: string;
}

export const SPEECH_DIFFICULTIES: SpeechDifficulty[] = [
  {
    id: "articulation",
    icon: "🗣️",
    title: "Motnja izreke / artikulacije – dislalija",
    description: "Otrok ne izgovarja, zamenjuje ali napačno izreka določen glas, ki ga vrstniki njegove starosti že obvladajo.",
    example: "Primeri: \"Loka\" namesto \"roka\", \"Šapa\" namesto \"žaba\""
  },
  {
    id: "stuttering",
    icon: "⏱️",
    title: "Motnja ritma in tempa govora – jecljanje",
    description: "Govorna tekočnost je prekinjena. Znaki: \"m-m-mama\", \"ssssonce\", dolgi premori med besedami."
  },
  {
    id: "vocabulary",
    icon: "📉",
    title: "Šibek besedni zaklad",
    description: "Otrok pozna premalo besed za svojo starost. Pogosto uporablja enake besede ali ne zna poimenovati predmetov, čustev, dejanj."
  },
  {
    id: "structure",
    icon: "🧱",
    title: "Neustrezna dolžina in struktura stavka",
    description: "Otrok tvori zelo kratke stavke ali nepravilno postavlja besede.",
    example: "Primer: \"Jaz park\" namesto \"Jaz grem v park.\""
  },
  {
    id: "grammar",
    icon: "⚙️",
    title: "Slovnično neustrezni ali skopi stavki",
    description: "Otrok ne uporablja veznikov, zaimkov, predlogov.",
    example: "Primer: \"Kuža laja drevo.\""
  },
  {
    id: "endings",
    icon: "🔁",
    title: "Napačna raba besednih končnic",
    description: "Otrok zamenjuje spol, število ali sklon.",
    example: "Primer: \"Mami rekel\" namesto \"Mami je rekla.\""
  },
  {
    id: "word_usage",
    icon: "🔄",
    title: "Napačna raba besed pri sporočanju",
    description: "Otrok uporablja napačne ali splošne izraze.",
    example: "Primer: \"Tisto tam je padlo dol\" namesto \"Kozarec je padel s stola.\""
  },
  {
    id: "phonological",
    icon: "🔊",
    title: "Slaba sposobnost zavedanja in ločevanja glasov",
    description: "Otrok težko sliši razliko med podobnimi glasovi. Pogosto vodi v težave pri branju, pisanju ali disleksijo."
  }
];
