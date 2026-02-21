

## Prilagoditev preverjanja izgovorjave za starostno skupino 3-4 leta

### Povzetek

Otroci stari 3 in 4 let bodo imeli skrajsano preverjanje izgovorjave -- samo 20 besed (1 beseda na glas, vedno prva beseda = pozicija "zacetek"). Vse ostalo (shranjevanje napredka, nadaljevanje, admin pregled) ostane enako.

### Besede za skupino 3-4

| Glas | Beseda |
|------|--------|
| P | PAJEK |
| B | BIK |
| M | MIZA |
| T | TORBA |
| D | DEZNIK |
| K | KOLO |
| G | GOL |
| N | NOC |
| H | HISA |
| V | VODA |
| J | JOPA |
| F | FANT |
| L | LEV |
| S | SOK |
| Z | ZMAJ |
| C | CEV |
| S | SOTOR |
| Z | ZABA |
| C | CAJ |
| R | RIBA |

### Kako deluje zdaj

1. `articulationTestData.ts` vsebuje 20 skupin glasov, vsaka s 3 besedami (zacetek, sredina, konec) = 60 besed
2. `useArticulationTestNew` razvrsti po foneticnem redu in iterira skozi VSE besede zaporedno (indeks 0-59)
3. Starost otroka je dostopna prek `selectedChild.age` (uporabniski portal) oz. `child.age` (admin portal)
4. `total_words` se shrani v sejo v Supabase

### Nacrt sprememb

**1. `src/hooks/useArticulationTestNew.ts` -- dodaj parameter `wordsPerLetter`**

- Dodaj nov neobvezen parameter `wordsPerLetter` (privzeto `3`, za skupino 3-4 pa `1`)
- Ko je `wordsPerLetter = 1`, hook uporabi samo `words[0]` iz vsake skupine glasov
- To vpliva na:
  - `sortedArticulationData` -- filtrira besede v vsaki skupini
  - `totalWordsAll` -- postane 20 namesto 60
  - `getCurrentLetterAndPosition` -- pravilno izracuna indekse
  - `getCompletedWords` -- pravilno steje dokoncane besede
  - `positionLabel` -- vedno "zacetek" za skupino 3-4
- Vsi ostali mehanizmi (snemanje, transkripcija, shranjevanje napredka) ostanejo nespremenjeni

**2. `src/pages/ArtikuacijskiTest.tsx` -- uporabniski portal**

- Preberi `selectedChild.age` iz AuthContext
- Doloci `wordsPerLetter = (age === 3 || age === 4) ? 1 : 3`
- Posreduj `wordsPerLetter` v `useArticulationTestNew`
- Posodobi `totalWordsCount` za pravilno stevilo besed (20 ali 60)
- Posreduj pravilno `totalWords` v `useUserSessionManager.initializeSession()`

**3. `src/pages/admin/AdminArtikulacijskiTest.tsx` -- admin portal**

- Preberi `child.age` iz `useLogopedistChild(childId)`
- Doloci `wordsPerLetter` na enak nacin kot v uporabniskem portalu
- Posreduj v `useArticulationTestNew`
- Posodobi `totalWordsCount` za sejo

**4. Brez sprememb baze podatkov**

- Stolpec `total_words` ze obstaja in se bo samodejno nastavil na 20 za mlajse otroke
- Admin pregled seje deluje na podlagi dejanskih posnetkov (`articulation_word_results`), ne na podlagi `total_words`, zato bo vse pravilno prikazano
- `current_word_index` pravilno sledi napredku ne glede na skupno stevilo besed

### Tehnicni detajli

Kljucna sprememba je v `useArticulationTestNew` hooku:

```text
// Namesto uporabe vseh 3 besed na glas:
sortedArticulationData = groups.map(g => ({ ...g, words: g.words }))

// Za skupino 3-4 uporabi samo prvo besedo:
sortedArticulationData = groups.map(g => ({ 
  ...g, 
  words: g.words.slice(0, wordsPerLetter) 
}))
```

To zagotavlja, da:
- Progress grid prikazuje 20 glasov (enako kot zdaj), ampak vsak glas ima samo 1 besedo
- Indeksi besed so 0-19 namesto 0-59
- Shranjevanje in nadaljevanje deluje enako (current_word_index 0-19)
- Admin portal vidi samo posnetke ki dejansko obstajajo
- Transkripcija in ocenjevanje ostaneta nespremenjena

### Kaj ostane enako

- Celoten tok snemanja in transkripcije
- Shranjevanje in nadaljevanje seje (resume dialog)
- Prikaz v admin portalu (cakalna vrsta, pregled seje)
- Ocenjevanje s strani logopeda
- Nastavitve zahtevnosti in casa snemanja
- Progress grid vizualni prikaz (20 glasov)

