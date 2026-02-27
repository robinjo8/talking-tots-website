
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
      { text: "PAJEK", image: "pajek1.webp", audio: "Pajek.mp3", acceptedVariants: ["PAJEK", "BAJEK", "PAJEC", "PAJEL", "PAJES", "PAJEK!", "PAJK", "PAJEK?", "PAJEKI", "PAJEK-", "PAJET"] },
      { text: "OPICA", image: "opica1.webp", audio: "Opica.mp3", acceptedVariants: ["OPICA", "APICA", "UPICA", "OPIKA", "OPISA", "OPIČA", "OPICE", "OPICI", "OPICO", "OPICA!", "EPIC", "APIKA", "OPIŠA"] },
      { text: "REP", image: "rep1.webp", audio: "Rep.mp3", acceptedVariants: ["REP", "LEP", "TEP", "RE", "REMP", "REP!", "REP?", "REPA", "REPE", "REP-", "JEP", "EP"] },
    ]
  },
  {
    letter: "B",
    words: [
      { text: "BIK", image: "bik1.webp", audio: "Bik.mp3", acceptedVariants: ["BIK", "PIK", "DIK", "GIK", "VIK", "FIK", "BIC", "BIG", "BIN", "BIT", "BID"] },
      { text: "OBLAK", image: "oblak1.webp", audio: "Oblak.mp3", acceptedVariants: ["OBLAK", "OBRAK", "OPLAK", "OBLAT", "OBLA", "OBLAK!", "OBLAG", "OBLAV", "OBLAN", "OBLAH", "OBLAKI", "OBJAK"] },
      { text: "BOBER", image: "bober1.webp", audio: "Bober.mp3", acceptedVariants: ["BOBER", "BOBAR", "BOBR", "BOVER", "BOPER", "BOBER!", "BOBRA", "BOBRI", "BOBRU", "DOBER", "GOBER", "OBER", "BOBEJ", "POPEL", "POPEJ", "BOPEJ", "BOPEL"] },
    ]
  },
  {
    letter: "M",
    words: [
      { text: "MIZA", image: "miza1.webp", audio: "Miza.mp3", acceptedVariants: ["MIZA", "MISA", "MIŽA", "NIZA", "BIZA", "MIZA!", "MIZE", "MIZa", "MIZA?", "MIZO", "MITA", "NISA", "MIŠA"] },
      { text: "GUMA", image: "guma1.webp", audio: "Guma.mp3", acceptedVariants: ["GUMA", "GULA", "DUMA", "GUNA", "BUMA", "GUMA!", "GUME", "GUMa", "GUMA?", "GUMO", "DUNA", "UMA", "KUMA"] },
      { text: "SEDEM", image: "sedem1.webp", audio: "Sedem.mp3", acceptedVariants: ["SEDEM", "SEDEM!", "SEDEM?", "SEDE", "SEDEm", "SEDET", "SEDEM-", "SEDEM…", "SEVEN", "SEDEN", "SETEM", "SEDM", "SETM", "SEDN", "ŠEDEM", "ŠEDM"] },
    ]
  },
  {
    letter: "T",
    words: [
      { text: "TORBA", image: "torba1.webp", audio: "Torba.mp3", acceptedVariants: ["TORBA", "TOLBA", "DORBA", "TOBA", "TORVA", "TORBA!", "TORBa", "TORBA?", "TORBE", "TORBA-", "TOJBA"] },
      { text: "STOL", image: "stol1.webp", audio: "Stol.mp3", acceptedVariants: ["STOL", "ŠTOL", "STOR", "TOL", "SKOL", "STOL!", "STOL?", "STOLI", "STOl", "STOL-", "STOU"] },
      { text: "COPAT", image: "copat1.webp", audio: "Copat.mp3", acceptedVariants: ["COPAT", "ČOPAT", "SOPAT", "TOPAT", "COPAK", "COPA", "COPAT!", "COPAT?", "COPATI", "COPAT-"] },
    ]
  },
  {
    letter: "D",
    words: [
      { text: "DEŽNIK", image: "deznik1.webp", audio: "Deznik.mp3", acceptedVariants: ["DEŽNIK", "DEZNIK", "DEŠNIK", "TEŽNIK", "BEŽNIK", "DEŽNIKI", "DEŽNIKU", "DEŽNIKA", "DEŽNK", "DEŠNIKI", "TEZNIK", "DEZNIT", "DEŽNIT", "TEZNIT", "TEŠNIT", "TEŠNIK"] },
      { text: "LADJA", image: "ladja1.webp", audio: "Ladja.mp3", acceptedVariants: ["LADJA", "LADIA", "RADJA", "NADJA", "LADJO", "LADJE", "LADJI", "LADJA!", "LAJA", "LADIJAA", "BADIA", "JADJA", "LATJA", "JATJA", "ADJA"] },
      { text: "CEDILO", image: "cedilo1.webp", audio: "Cedilo.mp3", acceptedVariants: ["CEDILO", "SEDILO", "ČEDILO", "ŠEDILO", "TEDILO", "CEDILA", "CEDILI", "CEDILU", "CEDILO!", "EDILO", "CEDIJO", "SEDIJO"] },
    ]
  },
  {
    letter: "K",
    words: [
      { text: "KOLO", image: "kolo1.webp", audio: "Kolo.mp3", acceptedVariants: ["KOLO", "KORO", "GOLO", "TOLO", "KOJO", "KOLO!", "KOLOO", "KOLO?", "KOLO-", "KOLOK", "TOJO"] },
      { text: "ROKA", image: "roka1.webp", audio: "Roka.mp3", acceptedVariants: ["ROKA", "LOKA", "JOKA", "ROGA", "ROKA!", "ROK", "ROKA?", "ROKA-", "ROKI", "ROKAHA", "OKA", "LOTA", "JOTA"] },
      { text: "RAK", image: "rak1.webp", audio: "Rak.mp3", acceptedVariants: ["RAK", "LAK", "JAK", "DAK", "GAK", "RAK!", "RAKK", "RAK?", "RAK-", "RAKO", "AK", "LAT", "JAT"] },
    ]
  },
  {
    letter: "G",
    words: [
      { text: "GOL", image: "gol1.webp", audio: "Gol.mp3", acceptedVariants: ["GOL", "KOL", "DOL", "GOR", "GOL!", "GOLL", "GOL?", "GOL-", "GOLA", "GOl", "OL"] },
      { text: "ŽOGA", image: "zoga1.webp", audio: "Zoga.mp3", acceptedVariants: ["ŽOGA", "ZOGA", "ŠOGA", "JOGA", "LOGA", "ŽOKA", "ŽOGA!", "ŽOKA!", "ŽOGAHA", "ŽOGA?", "SOGA", "ŽODA", "ŠODA"] },
      { text: "ŽAGA", image: "zaga1.webp", audio: "Zaga.mp3", acceptedVariants: ["ŽAGA", "ZAGA", "ŠAGA", "JAGA", "TAGA", "ŽAGE", "ŽAGI", "ŽAGO", "ŽAGA!", "AGA", "SAGA", "ŽADA", "ŠADA", "SADA"] },
    ]
  },
  {
    letter: "N",
    words: [
      { text: "NOČ", image: "noc1.webp", audio: "Noc.mp3", acceptedVariants: ["NOČ", "NOC", "NOŠ", "MOČ", "KOČ", "NOČ!", "NOČI", "NOČA", "NOČAA", "TOČ", "BOČ", "NOJ", "NOT", "OČ", "OŠ"] },
      { text: "BANANA", image: "banana1.webp", audio: "Banana.mp3", acceptedVariants: ["BANANA", "MANANA", "NANANA", "BANADA", "BANANA!", "BANANa", "BANANA?", "BANANE", "BANANA-", "BANANA…", "PANANA", "NANA"] },
      { text: "VOLAN", image: "volan1.webp", audio: "Volan.mp3", acceptedVariants: ["VOLAN", "BOLAN", "VORAN", "DOLAN", "VOLAM", "VOLAN!", "VOLAN?", "VOLANI", "VOLAN-", "VOLAN…", "TOLAN", "FOLAN", "OLAN"] },
    ]
  },
  {
    letter: "H",
    words: [
      { text: "HIŠA", image: "hisa1.webp", audio: "Hisa.mp3", acceptedVariants: ["HIŠA", "HISA", "IŠA", "HIŽA", "HIŠ", "HIŠA!", "BIŠA", "DIŠA", "HIŠKA", "HISA!", "HITA"] },
      { text: "JUHA", image: "juha1.webp", audio: "Juha.mp3", acceptedVariants: ["JUHA", "JULA", "DUHA", "UHA", "JUHA!", "JUH", "JUHE", "JUHAA", "JUGA", "JUFA", "JUTA", "JUA"] },
      { text: "KRUH", image: "kruh1.webp", audio: "Kruh.mp3", acceptedVariants: ["KRUH", "KLUH", "KRUH!", "KRU", "KRUH?", "KRUHHA", "GRUH", "KRUŠ", "KRUHOV", "KJUH", "KUH"] },
    ]
  },
  {
    letter: "V",
    words: [
      { text: "VODA", image: "voda1.webp", audio: "Voda.mp3", acceptedVariants: ["VODA", "VOTA", "BODA", "VOLA", "VORA", "VODA!", "VODa", "VOD", "VODE", "VODI", "UODA", "ODA", "FODA"] },
      { text: "DREVO", image: "drevo1.webp", audio: "Drevo.mp3", acceptedVariants: ["DREVO", "TREVO", "KREVO", "BREVO", "DEVO", "DREVU", "DREVA", "DREVOO", "DREVO!", "LEVO", "REVO", "DJEVO", "TJEVO", "TLEVO"] },
      { text: "SOVA", image: "sova1.webp", audio: "Sova.mp3", acceptedVariants: ["SOVA", "ZOVA", "ŠOVA", "TOVA", "BOVA", "SOVE", "SOVI", "SOVO", "SOVA!", "SOVAA", "SOFA", "OVA"] },
    ]
  },
  {
    letter: "J",
    words: [
      { text: "JOPA", image: "jopa1.webp", audio: "Jopa.mp3", acceptedVariants: ["JOPA", "JOLA", "JOTA", "DOPA", "BOPA", "JOPA!", "JOPa", "JOPAA", "JOPA?", "JOPA-"] },
      { text: "VEJA", image: "veja1.webp", audio: "Veja.mp3", acceptedVariants: ["VEJA", "VEŽA", "VEDA", "BEJA", "FEJA", "VEJA!", "VEJ", "VEJE", "VEJAA", "VEJA?", "EJA"] },
      { text: "NOJ", image: "noj1.webp", audio: "Noj.mp3", acceptedVariants: ["NOJ", "LOJ", "DOJ", "MOJ", "NO", "NOJ!", "NOJJ", "NOJ?", "NOJ-", "NOJ…", "OJ"] },
    ]
  },
  {
    letter: "F",
    words: [
      { text: "FANT", image: "fant1.webp", audio: "Fant.mp3", acceptedVariants: ["FANT", "VANT", "SANT", "HANT", "TANT", "DANT", "FANTA", "FANTI", "FANTU", "FANT!", "ANT", "FONT"] },
      { text: "MAFIN", image: "mafin1.webp", audio: "Mafin.mp3", acceptedVariants: ["MAFIN", "MAFI", "MAFIM", "MAFIN!", "MAFIR", "NAFIN", "BAFIN", "MABIN", "MAPIN", "MAFINA", "MAVIN", "NAVIN"] },
      { text: "KROF", image: "krof1.webp", audio: "Krof.mp3", acceptedVariants: ["KROF", "KLOF", "KROP", "KRO", "KROF!", "KROV", "GROF", "KROH", "KROV!", "KROFF", "TOF", "TLOF", "KOF", "KJOF", "TJOF"] },
    ]
  },
  {
    letter: "L",
    words: [
      { text: "LEV", image: "lev1.webp", audio: "Lev.mp3", acceptedVariants: ["LEV", "REV", "JEV", "LE", "LEV!", "LEVV", "LEV?", "LEV-", "LEVA", "LEVE", "LEU", "JEU"] },
      { text: "MILO", image: "milo1.webp", audio: "Milo.mp3", acceptedVariants: ["MILO", "MIRO", "NILO", "BILO", "MIDO", "MILO!", "MILOO", "MILO?", "MILO-", "MIJO", "NIJO", "MIO"] },
      { text: "ŠAL", image: "sal1.webp", audio: "Sal.mp3", acceptedVariants: ["ŠAL", "SAL", "ŽAL", "ŠAR", "TAL", "ŠAL!", "ŠAL?", "ŠALA", "ŠALI", "ŠAL-", "ŠAJ", "SAJ"] },
    ]
  },
  {
    letter: "S",
    words: [
      { text: "SOK", image: "sok1.webp", audio: "Sok.mp3", acceptedVariants: ["SOK", "ŠOK", "ZOK", "TOK", "SOK!", "SOK?", "SO", "SOK-", "SOKA", "SOKI", "SOT", "ŠOT", "OK"] },
      { text: "OSA", image: "osa1.webp", audio: "Osa.mp3", acceptedVariants: ["OSA", "OZA", "OŠA", "OLA", "OSA!", "OSA?", "OSE", "OSa", "OSA-", "OSAA", "OTA"] },
      { text: "LOS", image: "los1.webp", audio: "Los.mp3", acceptedVariants: ["LOS", "LOŠ", "LOZ", "LOT", "KOS", "MOS", "LOSA", "LOSI", "LOSU", "LOS!", "OS", "LOB", "JOS"] },
    ]
  },
  {
    letter: "Z",
    words: [
      { text: "ZMAJ", image: "zmaj1.webp", audio: "Zmaj.mp3", acceptedVariants: ["ZMAJ", "SMAJ", "ŠMAJ", "ŽMAJ", "MAJ", "ZMAJA", "ZMAJI", "ZMAJU", "ZMAJ!", "ZMAI", "ŠMAJI", "TMAJ"] },
      { text: "MIZA", image: "miza1.webp", audio: "Miza.mp3", acceptedVariants: ["MIZA", "MISA", "MIŽA", "NIZA", "BIZA", "MIZA!", "MIZE", "MIZa", "MIZA?", "MIZO", "NISA", "MIŠA", "MITA"] },
      { text: "KOZA", image: "koza1.webp", audio: "Koza_zival.mp3", acceptedVariants: ["KOZA", "KOSA", "KOŽA", "KOŠA", "BOZA", "DOZA", "KOZE", "KOZI", "KOZO", "KOZA!", "GOZA", "TOZA", "TOSA", "OZA", "OSA"] },
    ]
  },
  {
    letter: "C",
    words: [
      { text: "CEV", image: "cev1.webp", audio: "Cev.mp3", acceptedVariants: ["CEV", "SEV", "ZEV", "CEF", "CEVF", "CEV!", "TEV", "DEV", "CEVT", "CEVU", "CEU", "SEU", "ČEV", "ČEU", "ŠEV", "ŠEU"] },
      { text: "RACA", image: "raca1.webp", audio: "Raca.mp3", acceptedVariants: ["RACA", "RACE", "RACI", "RACO", "RAZA", "RAŠA", "RASA", "LACA", "NACA", "DACA", "RACA!", "ACA", "LASA", "JASA", "RAČA"] },
      { text: "ZAJEC", image: "zajec1.webp", audio: "Zajec.mp3", acceptedVariants: ["ZAJEC", "SAJEC", "ŽAJEC", "ZAJET", "ZAJES", "ZAJEC!", "ZAJC", "ZAJECI", "ZAJEK", "ZAJEL", "ŽAJEČ", "SAJES", "SAJET", "TAJET", "AJES", "ŠAJEŠ", "ŽAJEŠ"] },
    ]
  },
  {
    letter: "Š",
    words: [
      { text: "ŠOTOR", image: "sotor1.webp", audio: "Sotor.mp3", acceptedVariants: ["ŠOTOR", "SOTOR", "ŽOTOR", "ŠOTAR", "ŠOTOT", "ŠOTORA", "ŠOTORI", "ŠOTORU", "ŠOTOR!", "OTOR", "STOTOR", "ŠOTOJ", "SOTOJ", "SOTOL"] },
      { text: "PIŠKOT", image: "piskot1.webp", audio: "Piskot.mp3", acceptedVariants: ["PIŠKOT", "PISKOT", "PIŠČOT", "PIŠKOC", "PIŠKOTI", "PIŠKOTU", "PIŠKOTA", "PIŠKT", "ŠKOT", "BISKOT", "PIŠKOT!", "KOT"] },
      { text: "KOŠ", image: "kos1.webp", audio: "Kos_predmet.mp3", acceptedVariants: ["KOŠ", "KOS", "KOŽ", "KO", "TOŠ", "GOŠ", "KOŠ!", "KOŠ?", "KOŠI", "KOŠ-", "OŠ"] },
    ]
  },
  {
    letter: "Ž",
    words: [
      { text: "ŽABA", image: "zaba1.webp", audio: "Zaba.mp3", acceptedVariants: ["ŽABA", "ZABA", "ŠABA", "JABA", "TABA", "ŽABE", "ŽABI", "ŽABO", "ŽABA!", "ABA", "ŠABA", "ŠAPA", "ZAPA", "ZAVA"] },
      { text: "ROŽA", image: "roza1.webp", audio: "Roza.mp3", acceptedVariants: ["ROŽA", "ROZA", "ROŠA", "ROŽE", "LOŽA", "LOZA", "LOŠA", "JOŽA", "JOZA", "ROŽA!", "ROŽA?", "ROŽAA"] },
      { text: "LUŽA", image: "luza1.webp", audio: "Luza.mp3", acceptedVariants: ["LUŽA", "LUZA", "LUJA", "LUŠA", "BUŽA", "DUŽA", "LUŽE", "LUŽI", "LUŽO", "LUŽA!", "UŽA", "LUTA", "LUSA", "JUŽA", "JUŠA", "JUZA", "JUSA"] },
    ]
  },
  {
    letter: "Č",
    words: [
      { text: "ČAJ", image: "caj1.webp", audio: "Caj.mp3", acceptedVariants: ["ČAJ", "CAJ", "ŠAJ", "ČA", "ČAJ!", "TAJ", "DAJ", "ČAK", "ČAL", "ČAV"] },
      { text: "OČI", image: "oci1.webp", audio: "Oci.mp3", acceptedVariants: ["OČI", "OCI", "OŠI", "OTI", "OČI!", "OČIJA", "OI", "OČ", "OČIČ", "OČI?", "UČ"] },
      { text: "ČOPIČ", image: "copic1.webp", audio: "Copic.mp3", acceptedVariants: ["ČOPIČ", "ČOPIC", "ŠOPIČ", "COPIČ", "ČOPIŠ", "ČOPIT", "ČOPIČA", "ČOPIČI", "ČOPIČU", "ČOPIČ!", "OPIČ", "TOPIT", "ŠOPIŠ", "COPIC"] },
    ]
  },
  {
    letter: "R",
    words: [
      { text: "RIBA", image: "riba1.webp", audio: "Riba.mp3", acceptedVariants: ["RIBA", "LIBA", "JIBA", "REBA", "RIVA", "RIBE", "RIBI", "RIBO", "RIBA!", "IBA", "REBA", "IPA"] },
      { text: "OMARA", image: "omara1.webp", audio: "Omara.mp3", acceptedVariants: ["OMARA", "OMARE", "OMARI", "OMARO", "AMARA", "UMARA", "OMARA!", "MARA", "OMALA", "OMARAA", "OMAJA", "MAJA", "MALA"] },
      { text: "SIR", image: "sir1.webp", audio: "Sir.mp3", acceptedVariants: ["SIR", "ŠIR", "ZIR", "SIL", "SI", "SIR!", "SIR?", "SIRI", "SIRA", "SIR-", "SIJ", "ŠIJ"] },
    ]
  },
];
