
# Zaporedno predvajanje posnetkov ob zaključku igre (posodobljen plan)

## Povzetek sprememb
Ko uporabnik zaključi igro (vse slike v pravilnem vrstnem redu), se pred prikazom pop-up okna zaporedno predvajajo posnetki od leve proti desni. Trenutno predvajana slika dobi izrazit neon oranžen žareč rob. Med predvajanjem so interakcije onemogočene. Predvajanje posameznih posnetkov med igro (ko se posamezna slika postavi na pravo mesto) se odstrani.

## Spremembe po datotekah

### 1. `src/hooks/useSequenceGame.ts` (starost 3-4)

**Odstrani:**
- `prevCorrectIndicesRef` (vrstica 18)
- Celoten useEffect za predvajanje zvoka ob posamezni pravilni postavitvi (vrstice 86-125)

**Dodaj:**
- `activePlayingIndex: number | null` stanje (katera slika trenutno žari)
- `sequentialPlaybackRef` za preprečevanje dvojnega zagona
- Nov useEffect na `isComplete`: ko postane `true`, zažene async zaporedno predvajanje:
  ```text
  for i = 0 to currentSequence.length - 1:
    setActivePlayingIndex(i)
    setIsPlayingAudio(true)
    if currentSequence[i].audio_url:
      await playAudio(currentSequence[i].audio_url)  // čaka onended
    await delay(500)
  setActivePlayingIndex(null)
  setIsPlayingAudio(false)
  ```
- Hook vrne tudi `activePlayingIndex`
- `correctIndices` ostane za zeleno obarvanje med igro (statično, brez zvoka)
- `moveItem` blokira premike ko `isPlayingAudio === true` (to ostane)

**Vrnjeni podatki:**
```text
{ targetSequence, currentSequence, isComplete, isLoading, moveItem, resetGame,
  correctIndices, isPlayingAudio, activePlayingIndex }
```

### 2. `src/components/exercises/SequenceItem.tsx`

**Dodaj prop:** `isActivePlaying?: boolean`

**Vizualni prikaz ko `isActivePlaying === true`:**
- Prednost pred `isCorrect` in `isTarget`
- Neon oranžen žareč rob: `border-4 border-orange-400 shadow-[0_0_24px_rgba(251,146,60,0.9)]`
- Rahla povečava: `scale-105`
- Animacija pulziranja sijaja (CSS animation ali Tailwind animate-pulse na shadow)

### 3. `src/components/exercises/SequenceGameS.tsx` (in C, K, L, R, Z, Č, Š, Ž)

**Spremembe:**
- Iz hooka prebrati tudi `activePlayingIndex`
- V SequenceItem dodati prop: `isActivePlaying={activePlayingIndex === index}`
- Spremeniti `onGameComplete` logiko: namesto takojšnjega klica ob `isComplete`, počakati da se zaporedno predvajanje konča (`activePlayingIndex === null && isComplete && !isPlayingAudio`). Se pravi useEffect spremlja te tri pogoje in šele nato pokliče `onGameComplete`.

### 4. `src/components/exercises/SequenceGame56Base.tsx` (starost 5-6)

**Odstrani:**
- `prevCorrectIdsRef` (vrstica 56)
- Celoten useEffect za predvajanje zvoka ob posamezni pravilni postavitvi (vrstice 147-171)

**Dodaj:**
- `activePlayingIndex: number | null` stanje
- `sequentialPlaybackRef` za preprečevanje dvojnega zagona
- Nov useEffect na `isComplete`: ko postane `true`, zažene async zaporedno predvajanje po enakem vzorcu kot v useSequenceGame
- `onGameComplete` se pokliče šele po koncu predvajanja (namesto setTimeout 500ms)
- V renderju arrange faze: slika z `activePlayingIndex` dobi neon oranžen žareč rob (enak stil kot v SequenceItem)
- `isPlayingAudio` ostane za blokado ArrowLeft/ArrowRight gumbov

### 5. `src/components/exercises/SequenceGameBase.tsx` (starost 7-10)

Enake spremembe kot za SequenceGame56Base (vrstice 168-191 za odstranitev, isti vzorec za dodajanje).

## Vizualni stil neon oranžnega roba

Na vseh treh tipih iger bo aktivno predvajana slika imela:
```text
border-4 border-orange-400
shadow-[0_0_24px_rgba(251,146,60,0.9)]
scale-105
transition-all duration-300
```
To je izrazit, neon sijoč oranžen rob ki jasno pokaže otroku katera slika se trenutno predvaja.

## Kaj se NE spreminja
- Zeleno obarvanje (`correctIndices` / `getSlotBorderClass "correct"`) med igro ostane (statičen vizualni odziv brez zvoka)
- Logika za začetno mešanje (`shuffleUntilDifferent`) ostane nespremenjena
- `isPlayingAudio` blokada premikanja med igro ostane (zdaj se aktivira samo ob končnem zaporednem predvajanju)
