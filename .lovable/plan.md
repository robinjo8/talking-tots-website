
# Popravki igre Zaporedja - zeleno obarvanje, zvok in začetni razpored

## Povzetek
Tri spremembe za vse starostne skupine igre Zaporedja:
1. Na začetku nobena slika v spodnji vrstici ne sme biti na pravem mestu
2. Ko uporabnik postavi sliko na pravo mesto, se ta obarva zeleno in predvaja zvok besede
3. Med predvajanjem zvoka uporabnik ne more premikati slik

## Podrobnosti po starostnih skupinah

### A) Starost 3-4 (SequenceGameS, SequenceGameC, itd. + useSequenceGame + SequenceItem)

**Zagotovitev napačnega začetnega reda:** Ze implementirano v `useSequenceGame.ts` s funkcijo `shuffleUntilDifferent` - nobena slika ne začne na pravem mestu.

**Zeleno obarvanje in zvok:**
- V `SequenceGameS.tsx` (in vseh enakih komponentah za posamezne črke) dodati logiko za preverjanje, ali je slika na pravilnem mestu po vsakem premiku
- Ko se slika znajde na pravilnem mestu: obrobo spremeniti v zeleno (border-emerald-500 z zelenim sijajem)
- Predvajati audio_url te slike
- Dodati stanje `isPlayingAudio` ki blokira nadaljnje premike (disable drag)
- Ko se zvok konča (`audio.onended`), sprostiti interakcijo

Alternativa (boljša): logiko prestaviti v `useSequenceGame.ts` hook, da vrača tudi `correctIndices` (seznam indeksov kjer je slika pravilna) in `isPlayingAudio` ter `playCorrectAudio` funkcijo. Tako bodo vse komponente za 3-4 avtomatsko podprle to funkcionalnost.

**Spremembe datotek:**
- `src/hooks/useSequenceGame.ts` - dodati `correctIndices`, audio playback logiko, `isPlayingAudio` stanje
- `src/components/exercises/SequenceItem.tsx` - dodati prop `isCorrect` za zeleno obarvanje
- `src/components/exercises/SequenceGameS.tsx` (in C, K, L, R, Z, Č, Š, Ž) - uporabiti nove lastnosti iz hooka, prenesti `isCorrect` in `isPlayingAudio`

### B) Starost 5-6 (SequenceGame56Base)

**Zagotovitev napačnega začetnega reda:**
- Ko se igra premakne iz faze "select" v "arrange", potrebno premešati `placedImages` tako, da nobena slika ni na pravilnem mestu (dodati podobno `shuffleUntilDifferent` logiko)

**Zeleno obarvanje:** Ze deluje (getSlotBorderClass vrača zeleno za status "correct").

**Zvok ob pravilnem mestu:**
- Dodati `useEffect` ki spremlja spremembe v `placedImages` med fazo "arrange"
- Ko se status neke slike spremeni v "correct", predvajati njen `audio_url`
- Dodati `isPlayingAudio` stanje ki onemogoci gumbe za premikanje (ArrowLeft/ArrowRight)
- Po koncu predvajanja sprostiti interakcijo

**Spremembe datoteke:**
- `src/components/exercises/SequenceGame56Base.tsx`

### C) Starost 7-10 (SequenceGameBase)

Enake spremembe kot za 5-6 - ista koda, samo z drugačno konfiguracijo.

**Spremembe datoteke:**
- `src/components/exercises/SequenceGameBase.tsx`

---

## Tehnične podrobnosti

### useSequenceGame.ts (za starost 3-4)
```text
Novi vrnjeni podatki:
- correctIndices: number[]  (indeksi kjer je currentSequence[i].id === targetSequence[i].id)
- isPlayingAudio: boolean
- (moveItem bo blokiral premike ko je isPlayingAudio true)

Logika:
1. Po vsakem moveItem preveriti nove correctIndices
2. Ce se pojavi NOV correct indeks, predvajati audio_url te slike
3. Nastaviti isPlayingAudio = true
4. audio.onended -> isPlayingAudio = false
```

### SequenceItem.tsx (za starost 3-4)
```text
Nov prop: isCorrect?: boolean
Ko je isCorrect=true:
- border spremeniti v border-emerald-500
- dodati zeleni sij (shadow-[0_0_12px_rgba(16,185,129,0.6)])
- bg-emerald-50
```

### SequenceGame56Base.tsx in SequenceGameBase.tsx (za starost 5-6 in 7-10)
```text
1. Ob prehodu select -> arrange:
   - Premešati placedImages tako da noben ni na pravem mestu
   
2. Nov state: isPlayingAudio, prevCorrectIds (Set)
3. useEffect na placedImages v arrange fazi:
   - Izracunaj nove correct IDs
   - Ce je nov correct ID (ni v prevCorrectIds):
     -> predvajaj audio
     -> isPlayingAudio = true
     -> audio.onended -> isPlayingAudio = false
   - Posodobi prevCorrectIds
4. Onemogoci ArrowLeft/ArrowRight gumbe ko isPlayingAudio === true
```

### Zvocni posnetki
Vsaka slika iz baze ima polje `audio_url` ki ze vsebuje URL do zvocnega posnetka. Za predvajanje uporabiti `new Audio(url).play()` z `onended` callbackom.
