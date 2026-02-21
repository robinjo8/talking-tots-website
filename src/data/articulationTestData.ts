
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

// Fonetični vrstni red: P, B, M, T, D, K, G, N, H, V, J, F, L, S, Z, C, Š, Ž, Č, R
// (hook useArticulationTestNew ureja po PHONETIC_ORDER, vrstni red v datoteki ni bistven)
export const articulationData: LetterGroup[] = [
  {
    letter: "P",
    words: [
      { text: "PAJEK", image: "pajek1.webp", audio: "pajek.m4a", acceptedVariants: ["PAJEK", "BAJEK", "PAJEC", "PAJEL", "PAJES", "PAJEK!", "PAJK", "PAJEK?", "PAJEKI", "PAJEK-", "PAJET"] },
      { text: "OPICA", image: "opica1.webp", audio: "opica.m4a", acceptedVariants: ["OPICA", "APICA", "UPICA", "OPIKA", "OPISA", "OPIČA", "OPICE", "OPICI", "OPICO", "OPICA!", "EPIC", "APIKA"] },
      { text: "REP", image: "rep1.webp", audio: "rep.m4a", acceptedVariants: ["REP", "LEP", "TEP", "RE", "REMP", "REP!", "REP?", "REPA", "REPE", "REP-", "JEP", "EP"] },
    ]
  },
  {
    letter: "B",
    words: [
      { text: "BIK", image: "bik1.webp", audio: "bik.m4a", acceptedVariants: ["BIK", "PIK", "DIK", "GIK", "VIK", "FIK", "BIC", "BIG", "BIN", "BIT", "BID"] },
      { text: "OBLAK", image: "oblak1.webp", audio: "oblak.m4a", acceptedVariants: ["OBLAK", "OBRAK", "OPLAK", "OBLAT", "OBLA", "OBLAK!", "OBLAG", "OBLAV", "OBLAN", "OBLAH", "OBLAKI", "OBJAK"] },
      { text: "BOBER", image: "bober1.webp", audio: "bober.m4a", acceptedVariants: ["BOBER", "BOBAR", "BOBR", "BOVER", "BOPER", "BOBER!", "BOBRA", "BOBRI", "BOBRU", "DOBER", "GOBER", "OBER"] },
    ]
  },
  {
    letter: "M",
    words: [
      { text: "MIZA", image: "miza1.webp", audio: "miza.m4a", acceptedVariants: ["MIZA", "MISA", "MIŽA", "NIZA", "BIZA", "MIZA!", "MIZE", "MIZa", "MIZA?", "MIZO", "MITA", "NISA", "MIŠA"] },
      { text: "GUMA", image: "guma1.webp", audio: "guma.m4a", acceptedVariants: ["GUMA", "GULA", "DUMA", "GUNA", "BUMA", "GUMA!", "GUME", "GUMa", "GUMA?", "GUMO", "DUNA", "UMA", "KUMA"] },
      { text: "SEDEM", image: "sedem1.webp", audio: "sedem.m4a", acceptedVariants: ["SEDEM", "SEDEM!", "SEDEM?", "SEDE", "SEDEm", "SEDET", "SEDEM-", "SEDEM…", "SEVEN", "SEDEN", "SETEM", "SEDM", "SETM", "SEDN", "ŠEDEM", "ŠEDM"] },
    ]
  },
  {
    letter: "T",
    words: [
      { text: "TORBA", image: "torba1.webp", audio: "torba.m4a", acceptedVariants: ["TORBA", "TOLBA", "DORBA", "TOBA", "TORVA", "TORBA!", "TORBa", "TORBA?", "TORBE", "TORBA-", "TOJBA"] },
      { text: "STOL", image: "stol1.webp", audio: "stol.m4a", acceptedVariants: ["STOL", "ŠTOL", "STOR", "TOL", "SKOL", "STOL!", "STOL?", "STOLI", "STOl", "STOL-", "STOU"] },
      { text: "COPAT", image: "copat1.webp", audio: "copat.m4a", acceptedVariants: ["COPAT", "ČOPAT", "SOPAT", "TOPAT", "COPAK", "COPA", "COPAT!", "COPAT?", "COPATI", "COPAT-"] },
    ]
  },
  {
    letter: "D",
    words: [
      { text: "DEŽNIK", image: "deznik1.webp", audio: "deznik.m4a", acceptedVariants: ["DEŽNIK", "DEZNIK", "DEŠNIK", "TEŽNIK", "BEŽNIK", "DEŽNIKI", "DEŽNIKU", "DEŽNIKA", "DEŽNK", "DEŠNIKI"] },
      { text: "LADJA", image: "ladja1.webp", audio: "ladja.m4a", acceptedVariants: ["LADJA", "LADIA", "RADJA", "NADJA", "LADJO", "LADJE", "LADJI", "LADJA!", "LAJA", "LADIJAA", "BADIA"] },
      { text: "CEDILO", image: "cedilo1.webp", audio: "cedilo.m4a", acceptedVariants: ["CEDILO", "SEDILO", "ČEDILO", "ŠEDILO", "TEDILO", "CEDILA", "CEDILI", "CEDILU", "CEDILO!", "EDILO"] },
    ]
  },
  {
    letter: "K",
    words: [
      { text: "KOLO", image: "kolo1.webp", audio: "kolo.m4a", acceptedVariants: ["KOLO", "KORO", "GOLO", "TOLO", "KOJO", "KOLO!", "KOLOO", "KOLO?", "KOLO-", "KOLOK", "TOJO"] },
      { text: "ROKA", image: "roka1.webp", audio: "roka.m4a", acceptedVariants: ["ROKA", "LOKA", "JOKA", "ROGA", "ROKA!", "ROK", "ROKA?", "ROKA-", "ROKI", "ROKAHA", "OKA", "LOTA", "JOTA"] },
      { text: "RAK", image: "rak1.webp", audio: "rak.m4a", acceptedVariants: ["RAK", "LAK", "JAK", "DAK", "GAK", "RAK!", "RAKK", "RAK?", "RAK-", "RAKO", "AK", "LAT", "JAT"] },
    ]
  },
  {
    letter: "G",
    words: [
      { text: "GOL", image: "gol1.webp", audio: "gol.m4a", acceptedVariants: ["GOL", "KOL", "DOL", "GOR", "GOL!", "GOLL", "GOL?", "GOL-", "GOLA", "GOl", "OL"] },
      { text: "ŽOGA", image: "zoga1.webp", audio: "zoga.m4a", acceptedVariants: ["ŽOGA", "ZOGA", "ŠOGA", "JOGA", "LOGA", "ŽOKA", "ŽOGA!", "ŽOKA!", "ŽOGAHA", "ŽOGA?", "SOGA", "ŽODA", "ŠODA"] },
      { text: "ŽAGA", image: "zaga1.webp", audio: "zaga.m4a", acceptedVariants: ["ŽAGA", "ZAGA", "ŠAGA", "JAGA", "TAGA", "ŽAGE", "ŽAGI", "ŽAGO", "ŽAGA!", "AGA", "SAGA"] },
    ]
  },
  {
    letter: "N",
    words: [
      { text: "NOČ", image: "noc1.webp", audio: "noc.m4a", acceptedVariants: ["NOČ", "NOC", "NOŠ", "MOČ", "KOČ", "NOČ!", "NOČI", "NOČA", "NOČAA", "TOČ", "BOČ", "NOJ"] },
      { text: "BANANA", image: "banana1.webp", audio: "banana.m4a", acceptedVariants: ["BANANA", "MANANA", "NANANA", "BANADA", "BANANA!", "BANANa", "BANANA?", "BANANE", "BANANA-", "BANANA…", "PANANA", "NANA"] },
      { text: "VOLAN", image: "volan1.webp", audio: "volan.m4a", acceptedVariants: ["VOLAN", "BOLAN", "VORAN", "DOLAN", "VOLAM", "VOLAN!", "VOLAN?", "VOLANI", "VOLAN-", "VOLAN…", "TOLAN", "FOLAN", "OLAN"] },
    ]
  },
  {
    letter: "H",
    words: [
      { text: "HIŠA", image: "hisa1.webp", audio: "hisa.m4a", acceptedVariants: ["HIŠA", "HISA", "IŠA", "HIŽA", "HIŠ", "HIŠA!", "BIŠA", "DIŠA", "HIŠKA", "HISA!", "HITA"] },
      { text: "JUHA", image: "juha1.webp", audio: "juha.m4a", acceptedVariants: ["JUHA", "JULA", "DUHA", "UHA", "JUHA!", "JUH", "JUHE", "JUHAA", "JUGA", "JUFA", "JUTA", "JUA"] },
      { text: "KRUH", image: "kruh1.webp", audio: "kruh.m4a", acceptedVariants: ["KRUH", "KLUH", "KRUH!", "KRU", "KRUH?", "KRUHHA", "GRUH", "KRUŠ", "KRUHOV", "KJUH", "KUH"] },
    ]
  },
  {
    letter: "V",
    words: [
      { text: "VODA", image: "voda1.webp", audio: "voda.m4a", acceptedVariants: ["VODA", "VOTA", "BODA", "VOLA", "VORA", "VODA!", "VODa", "VOD", "VODE", "VODI", "UODA", "ODA", "FODA"] },
      { text: "DREVO", image: "drevo1.webp", audio: "drevo.m4a", acceptedVariants: ["DREVO", "TREVO", "KREVO", "BREVO", "DEVO", "DREVU", "DREVA", "DREVOO", "DREVO!", "LEVO", "REVO"] },
      { text: "SOVA", image: "sova1.webp", audio: "sova.m4a", acceptedVariants: ["SOVA", "ZOVA", "ŠOVA", "TOVA", "BOVA", "SOVE", "SOVI", "SOVO", "SOVA!", "SOVAA", "SOFA"] },
    ]
  },
  {
    letter: "J",
    words: [
      { text: "JOPA", image: "jopa1.webp", audio: "jopa.m4a", acceptedVariants: ["JOPA", "JOLA", "JOTA", "DOPA", "BOPA", "JOPA!", "JOPa", "JOPAA", "JOPA?", "JOPA-"] },
      { text: "VEJA", image: "veja1.webp", audio: "veja.m4a", acceptedVariants: ["VEJA", "VEŽA", "VEDA", "BEJA", "FEJA", "VEJA!", "VEJ", "VEJE", "VEJAA", "VEJA?", "EJA"] },
      { text: "NOJ", image: "noj1.webp", audio: "noj.m4a", acceptedVariants: ["NOJ", "LOJ", "DOJ", "MOJ", "NO", "NOJ!", "NOJJ", "NOJ?", "NOJ-", "NOJ…", "OJ"] },
    ]
  },
  {
    letter: "F",
    words: [
      { text: "FANT", image: "fant1.webp", audio: "fant.m4a", acceptedVariants: ["FANT", "VANT", "SANT", "HANT", "TANT", "DANT", "FANTA", "FANTI", "FANTU", "FANT!", "ANT", "FONT"] },
      { text: "MAFIN", image: "mafin1.webp", audio: "mafin.m4a", acceptedVariants: ["MAFIN", "MAFI", "MAFIM", "MAFIN!", "MAFIR", "NAFIN", "BAFIN", "MABIN", "MAPIN", "MAFINA", "MAVIN", "NAVIN"] },
      { text: "KROF", image: "krof1.webp", audio: "krof.m4a", acceptedVariants: ["KROF", "KLOF", "KROP", "KRO", "KROF!", "KROV", "GROF", "KROH", "KROV!", "KROFF", "TOF", "TLOF", "KOF", "KJOF", "TJOF"] },
    ]
  },
  {
    letter: "L",
    words: [
      { text: "LEV", image: "lev1.webp", audio: "lev.m4a", acceptedVariants: ["LEV", "REV", "JEV", "LE", "LEV!", "LEVV", "LEV?", "LEV-", "LEVA", "LEVE", "LEU", "JEU"] },
      { text: "MILO", image: "milo1.webp", audio: "milo.m4a", acceptedVariants: ["MILO", "MIRO", "NILO", "BILO", "MIDO", "MILO!", "MILOO", "MILO?", "MILO-", "MIJO", "NIJO", "MIO"] },
      { text: "ŠAL", image: "sal1.webp", audio: "sal.m4a", acceptedVariants: ["ŠAL", "SAL", "ŽAL", "ŠAR", "TAL", "ŠAL!", "ŠAL?", "ŠALA", "ŠALI", "ŠAL-", "ŠAJ", "SAJ"] },
    ]
  },
  {
    letter: "S",
    words: [
      { text: "SOK", image: "sok1.webp", audio: "sok.m4a", acceptedVariants: ["SOK", "ŠOK", "ZOK", "TOK", "SOK!", "SOK?", "SO", "SOK-", "SOKA", "SOKI", "SOT", "ŠOT", "OK"] },
      { text: "OSA", image: "osa1.webp", audio: "osa.m4a", acceptedVariants: ["OSA", "OZA", "OŠA", "OLA", "OSA!", "OSA?", "OSE", "OSa", "OSA-", "OSAA", "OTA"] },
      { text: "LOS", image: "los.webp", audio: "los.m4a", acceptedVariants: ["LOS", "LOŠ", "LOZ", "LOT", "KOS", "MOS", "LOSA", "LOSI", "LOSU", "LOS!", "OS", "LOB"] },
    ]
  },
  {
    letter: "Z",
    words: [
      { text: "ZMAJ", image: "zmaj1.webp", audio: "zmaj.m4a", acceptedVariants: ["ZMAJ", "SMAJ", "ŠMAJ", "ŽMAJ", "MAJ", "ZMAJA", "ZMAJI", "ZMAJU", "ZMAJ!", "ZMAI", "ŠMAJI"] },
      { text: "MIZA", image: "miza1.webp", audio: "miza.m4a", acceptedVariants: ["MIZA", "MISA", "MIŽA", "NIZA", "BIZA", "MIZA!", "MIZE", "MIZa", "MIZA?", "MIZO", "NISA", "MIŠA", "MITA"] },
      { text: "KOZA", image: "koza1.webp", audio: "koza.m4a", acceptedVariants: ["KOZA", "KOSA", "KOŽA", "KOŠA", "BOZA", "DOZA", "KOZE", "KOZI", "KOZO", "KOZA!", "GOZA", "TOZA"] },
    ]
  },
  {
    letter: "C",
    words: [
      { text: "CEV", image: "cev1.webp", audio: "cev.m4a", acceptedVariants: ["CEV", "SEV", "ZEV", "CEF", "CEVF", "CEV!", "TEV", "DEV", "CEVT", "CEVU", "CEU", "SEU", "ČEV", "ČEU", "ŠEV", "ŠEU"] },
      { text: "RACA", image: "raca1.webp", audio: "raca.m4a", acceptedVariants: ["RACA", "RACE", "RACI", "RACO", "RAZA", "RAŠA", "RASA", "LACA", "NACA", "DACA", "RACA!", "ACA"] },
      { text: "ZAJEC", image: "zajec1.webp", audio: "zajec.m4a", acceptedVariants: ["ZAJEC", "SAJEC", "ŽAJEC", "ZAJET", "ZAJES", "ZAJEC!", "ZAJC", "ZAJECI", "ZAJEK", "ZAJEL", "ŽAJEČ", "SAJES", "SAJET", "TAJET", "AJES", "ŠAJEŠ", "ŽAJEŠ"] },
    ]
  },
  {
    letter: "Š",
    words: [
      { text: "ŠOTOR", image: "sotor1.webp", audio: "sotor.m4a", acceptedVariants: ["ŠOTOR", "SOTOR", "ŽOTOR", "ŠOTAR", "ŠOTOT", "ŠOTORA", "ŠOTORI", "ŠOTORU", "ŠOTOR!", "OTOR", "STOTOR"] },
      { text: "PIŠKOT", image: "piskot1.webp", audio: "piskot.m4a", acceptedVariants: ["PIŠKOT", "PISKOT", "PIŠČOT", "PIŠKOC", "PIŠKOTI", "PIŠKOTU", "PIŠKOTA", "PIŠKT", "ŠKOT", "BISKOT", "PIŠKOT!"] },
      { text: "KOŠ", image: "kos1.webp", audio: "kos.m4a", acceptedVariants: ["KOŠ", "KOS", "KOŽ", "KO", "TOŠ", "GOŠ", "KOŠ!", "KOŠ?", "KOŠI", "KOŠ-", "OŠ"] },
    ]
  },
  {
    letter: "Ž",
    words: [
      { text: "ŽABA", image: "zaba1.webp", audio: "zaba.m4a", acceptedVariants: ["ŽABA", "ZABA", "ŠABA", "JABA", "TABA", "ŽABE", "ŽABI", "ŽABO", "ŽABA!", "ABA", "ŠABA"] },
      { text: "ROŽA", image: "roza1.webp", audio: "roza.m4a", acceptedVariants: ["ROŽA", "ROZA", "ROŠA", "ROŽE", "LOŽA", "LOZA", "LOŠA", "JOŽA", "JOZA", "ROŽA!", "ROŽA?", "ROŽAA"] },
      { text: "LUŽA", image: "luza1.webp", audio: "luza.m4a", acceptedVariants: ["LUŽA", "LUZA", "LUJA", "LUŠA", "BUŽA", "DUŽA", "LUŽE", "LUŽI", "LUŽO", "LUŽA!", "UŽA"] },
    ]
  },
  {
    letter: "Č",
    words: [
      { text: "ČAJ", image: "caj1.webp", audio: "caj.m4a", acceptedVariants: ["ČAJ", "CAJ", "ŠAJ", "ČA", "ČAJ!", "TAJ", "DAJ", "ČAK", "ČAL", "ČAV"] },
      { text: "OČI", image: "oci1.webp", audio: "oci.m4a", acceptedVariants: ["OČI", "OCI", "OŠI", "OTI", "OČI!", "OČIJA", "OI", "OČ", "OČIČ", "OČI?", "UČ"] },
      { text: "ČOPIČ", image: "copic1.webp", audio: "copic.m4a", acceptedVariants: ["ČOPIČ", "ČOPIC", "ŠOPIČ", "COPIČ", "ČOPIŠ", "ČOPIT", "ČOPIČA", "ČOPIČI", "ČOPIČU", "ČOPIČ!", "OPIČ"] },
    ]
  },
  {
    letter: "R",
    words: [
      { text: "RIBA", image: "riba1.webp", audio: "riba.m4a", acceptedVariants: ["RIBA", "LIBA", "JIBA", "REBA", "RIVA", "RIBE", "RIBI", "RIBO", "RIBA!", "IBA", "REBA"] },
      { text: "OMARA", image: "omara1.webp", audio: "omara.m4a", acceptedVariants: ["OMARA", "OMARE", "OMARI", "OMARO", "AMARA", "UMARA", "OMARA!", "MARA", "OMALA", "OMARAA"] },
      { text: "SIR", image: "sir1.webp", audio: "sir.m4a", acceptedVariants: ["SIR", "ŠIR", "ZIR", "SIL", "SI", "SIR!", "SIR?", "SIRI", "SIRA", "SIR-", "SIJ", "ŠIJ"] },
    ]
  },
];
