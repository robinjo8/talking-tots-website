
## Posodobitev besed v Preverjanju izgovorjave

### Vrstni red glasov

Vrstni red je že pravilno določen v `useArticulationTestNew.ts` (vrstica 7):
```
PHONETIC_ORDER = ['P', 'B', 'M', 'T', 'D', 'K', 'G', 'N', 'H', 'V', 'J', 'F', 'L', 'S', 'Z', 'C', 'Š', 'Ž', 'Č', 'R']
```
Podatki se samodejno preuredijo po tem vrstnem redu, ne glede na vrstni red v datoteki. Vrstni red v datoteki torej ni relevanten -- hook ga bo vedno uredil pravilno.

### Spremembe po glasovih

Spremembe v datoteki `src/data/articulationTestData.ts`:

**P** -- 2. beseda se zamenja (KAPA → OPICA):
- Novo: `OPICA`, slika `opica1.webp`, audio `opica.m4a`

**B** -- 3. beseda se zamenja (ZOB → BOBER):
- Novo: `BOBER`, slika `bober1.webp`, audio `bober.m4a`

**M** -- brez sprememb (MIZA, GUMA, SEDEM)

**T** -- brez sprememb (TORBA, STOL, COPAT)

**D** -- vse 3 besede se zamenjajo (DUDA, VODA, MED → DEŽNIK, LADJA, CEDILO):
- Novo: `DEŽNIK`, slika `deznik1.webp`, audio `deznik.m4a`
- Novo: `LADJA`, slika `ladja1.webp`, audio `ladja.m4a`
- Novo: `CEDILO`, slika `cedilo1.webp`, audio `cedilo.m4a`

**K** -- brez sprememb (KOLO, ROKA, RAK)

**G** -- vse 3 besede se zamenjajo (GOBA, ŽOGA, SNEG → GOL, ŽOGA, ŽAGA):
- `GOL` -- slika `gol1.webp`, audio `gol.m4a` (obstaja v L, prenese se sem)
- `ŽOGA` -- ostane (slika `zoga1.webp`, audio `zoga.m4a`)
- Novo: `ŽAGA`, slika `zaga1.webp`, audio `zaga.m4a`

**N** -- 1. beseda se zamenja (NOS → NOČ):
- Novo: `NOČ`, slika `noc1.webp`, audio `noc.m4a`

**H** -- brez sprememb (HIŠA, JUHA, KRUH)

**V** -- 2. in 3. beseda se zamenjata (KAVA, LEV → DREVO, SOVA):
- Novo: `DREVO`, slika `drevo1.webp`, audio `drevo.m4a`
- Novo: `SOVA`, slika `sova1.webp`, audio `sova.m4a`

**J** -- brez sprememb (JOPA, VEJA, NOJ)

**F** -- 1. beseda se zamenja (FEN → FANT):
- Novo: `FANT`, slika `fant1.webp`, audio `fant.m4a`

**L** -- 3. beseda se zamenja (GOL → ŠAL):
- `ŠAL`, slika `sal1.webp`, audio `sal.m4a`

**S** -- 3. beseda se zamenja (NOS → LOS):
- Novo: `LOS`, slika `los1.webp`, audio `los.m4a`

**Z** -- 1. in 3. beseda se zamenjata (ZOB, VOZ → ZMAJ, KOZA):
- Novo: `ZMAJ`, slika `zmaj1.webp`, audio `zmaj.m4a`
- Novo: `KOZA`, slika `koza1.webp`, audio `koza.m4a`

**C** -- 2. beseda se zamenja (PICA → RACA):
- Novo: `RACA`, slika `raca1.webp`, audio `raca.m4a`

**Š** -- vse 3 besede se zamenjajo (ŠAL, HIŠA, KOŠ → ŠOTOR, PIŠKOT, KOŠ):
- Novo: `ŠOTOR`, slika `sotor1.webp`, audio `sotor.m4a`
- Novo: `PIŠKOT`, slika `piskot1.webp`, audio `piskot.m4a`
- `KOŠ` -- ostane (slika `kos1.webp`, audio `kos.m4a`)

**Ž** -- vse 3 besede se zamenjajo (ŽOGA, ROŽA, JEŽ → ŽABA, ROŽA, LUŽA):
- Novo: `ŽABA`, slika `zaba1.webp`, audio `zaba.m4a`
- `ROŽA` -- ostane (slika `roza1.webp`, audio `roza.m4a`)
- Novo: `LUŽA`, slika `luza1.webp`, audio `luza.m4a`

**Č** -- 3. beseda se zamenja (LUČ → ČOPIČ):
- Novo: `ČOPIČ`, slika `copic1.webp`, audio `copic.m4a`

**R** -- vse 3 besede se zamenjajo (ROŽA, URA, SIR → RIBA, OMARA, SIR):
- Novo: `RIBA`, slika `riba1.webp`, audio `riba.m4a`
- Novo: `OMARA`, slika `omara1.webp`, audio `omara.m4a`
- `SIR` -- ostane (slika `sir1.webp`, audio `sir.m4a`)

### Sprejemljive variante za vse NOVE besede

Za vsako novo besedo se ustvari seznam `acceptedVariants`, ki upošteva:
- Tipične fonemske zamenjave pri otrocih (npr. R → L, Š → S)
- Možne napake Whisper transkripcije za slovenščino
- Različne slovnične oblike (imenovalnik, rodilnik, množina)

| Nova beseda | Variante |
|-------------|---------|
| OPICA | OPICA, APICA, UPICA, OPIKA, OPISA, OPIČA, OPICE, OPICI, OPICO, OPICA!, EPIC, APIKA |
| BOBER | BOBER, BOBAR, BOBR, BOVER, BOPER, BOBER!, BOBRA, BOBRI, BOBRU, DOBER, GOBER,OBER |
| DEŽNIK | DEŽNIK, DEZNIK, DEŠNIK, TEŽNIK, BEŽNIK, DEŽNIKI, DEŽNIKU, DEŽNIKA, DEŽNK, DEŠNIKI |
| LADJA | LADJA, LADIA, RADJA, NADJA, LADJO, LADJE, LADJI, LADJA!, LAJA, LADIJAA, BADIA |
| CEDILO | CEDILO, SEDILO, ČEDILO, ŠEDILO, TEDILO, CEDILA, CEDILI, CEDILU, CEDILO!, EDILO |
| NOČ | NOČ, NOC, NOŠ, MOČ, KOČ, NOČ!, NOČI, NOČA, NOČAA, TOČ, BOČ, NOJ |
| ŽAGA | ŽAGA, ZAGA, ŠAGA, JAGA, TAGA, ŽAGE, ŽAGI, ŽAGO, ŽAGA!, AGA, SAGA |
| DREVO | DREVO, TREVO, KREVO, BREVO, DEVO, DREVU, DREVA, DREVOO, DREVO!, LEVO, REVO |
| SOVA | SOVA, ZOVA, ŠOVA, TOVA, BOVA, SOVE, SOVI, SOVO, SOVA!, SOVAA, SOFA |
| FANT | FANT, VANT, SANT, HANT, TANT, DANT, FANTA, FANTI, FANTU, FANT!, ANT, FONT |
| LOS | LOS, LOŠ, LOZ, LOT, KOS, MOS, LOSA, LOSI, LOSU, LOS!, OS, LOB |
| ZMAJ | ZMAJ, SMAJ, ŠMAJ, ŽMAJ, MAJ, ZMAJA, ZMAJI, ZMAJU, ZMAJ!, ZMAI, ŠMAJI |
| KOZA | KOZA, KOSA, KOŽA, KOŠA, BOZA, DOZA, KOZE, KOZI, KOZO, KOZA!, GOZA, TOZA |
| RACA | RACA, RACE, RACI, RACO, RAZA, RAŠA, RASA, LACA, NACA, DACA, RACA!, ACA |
| ŠOTOR | ŠOTOR, SOTOR, ŽOTOR, ŠOTAR, ŠOTOT, ŠOTORA, ŠOTORI, ŠOTORU, ŠOTOR!, OTOR, STOTOR |
| PIŠKOT | PIŠKOT, PISKOT, PIŠČOT, PIŠKOC, PIŠKOTI, PIŠKOTU, PIŠKOTA, PIŠKT, ŠKOT, BISKOT, PIŠKOT! |
| ŽABA | ŽABA, ZABA, ŠABA, JABA, TABA, ŽABE, ŽABI, ŽABO, ŽABA!, ABA, ŠABA |
| LUŽA | LUŽA, LUZA, LUJA, LUŠA, BUŽA, DUŽA, LUŽE, LUŽI, LUŽO, LUŽA!, UŽA |
| ČOPIČ | ČOPIČ, ČOPIC, ŠOPIČ, COPIČ, ČOPIŠ, ČOPIT, ČOPIČA, ČOPIČI, ČOPIČU, ČOPIČ!, OPIČ |
| RIBA | RIBA, LIBA, JIBA, REBA, RIVA, RIBE, RIBI, RIBO, RIBA!, IBA, REBA |
| OMARA | OMARA, OMARE, OMARI, OMARO, AMARA, UMARA, OMARA!, MARA, OMALA, OMARAA |

### Besede ki ostanejo enake (brez sprememb)

Naslednje besede ostanejo točno takšne kot so (besedilo, slika, audio, variante):
- M: MIZA, GUMA, SEDEM
- T: TORBA, STOL, COPAT
- K: KOLO, ROKA, RAK
- H: HIŠA, JUHA, KRUH
- J: JOPA, VEJA, NOJ
- G: ŽOGA (2. beseda)
- Š: KOŠ (3. beseda)
- Ž: ROŽA (2. beseda)
- R: SIR (3. beseda)
- L: LEV, MILO (1. in 2. beseda)
- S: SOK, OSA (1. in 2. beseda)
- C: CEV, ZAJEC (1. in 3. beseda)
- Z: MIZA (2. beseda)
- Č: ČAJ, OČI (1. in 2. beseda)

### Tehnična izvedba

Samo ena datoteka se spremeni: `src/data/articulationTestData.ts`

- Vrstni red glasov v datoteki ni bistven (hook ga ureja po `PHONETIC_ORDER`)
- Doda se polje `audio` pri vseh besedah
- Posodobijo se `text`, `image`, `audio` in `acceptedVariants` za vsako zamenjano besedo
