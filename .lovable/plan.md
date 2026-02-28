

# Popravek igre Zaporedja: Odstranitev faze "razvrsti" za starost 5-6+

## Problem
1. **Bug s premešanjem**: Ko uporabnik postavi zadnji dve sliki na pravo mesto, se vse slike avtomatsko premešajo. To se zgodi, ker igra preide iz faze "select" v fazo "arrange" in ob tem premešanjem postavi slike v nov vrstni red.
2. **Nepotrebne puščice**: Za starost 5-6+ faza razvrščanja s puščicami (levo/desno) ne dodaja vrednosti. Uporabnik naj bi samo izbiral slike in jih postavljal na prava mesta.

## Rešitev
Odstraniti fazo "arrange" iz obeh komponent (`SequenceGame56Base.tsx` in `SequenceGameBase.tsx`). Igra bo delovala tako:
- Uporabnik si zapomni vrstni red (faza "memorize")
- Klikne na polje in izbere sliko iz ponujenih (faza "select")
- **Zelena** = pravilna slika na pravem mestu
- **Oranžna** = pravilna slika, ampak na napačnem mestu
- **Rdeča** = napačna slika (ni v izboru)
- Ko so vse slike pravilne na pravih mestih, se igra zaključi (zvočno predvajanje + pop-up)

## Tehnični koraki

### 1. Posodobitev `SequenceGame56Base.tsx`
- Odstraniti `GamePhase` tip "arrange" (ostane samo "pre-countdown" | "memorize" | "select")
- Odstraniti `useEffect`, ki ob `allCorrectSelected` premešava slike in prehaja v "arrange" fazo (vrstice 124-145)
- Spremeniti preverjanje zaključka igre: namesto preverjanja v fazi "arrange", preverjati v fazi "select" ko so vse slike na pravilnih mestih
- Odstraniti `handleMoveImage` funkcijo in puščice iz renderja
- Odstraniti celoten blok `gamePhase === "arrange"` iz JSX (puščice levo/desno)
- Posodobiti navodila - odstraniti besedilo "UREDI SLIKE V PRAVILNI VRSTNI RED"
- Omogočiti klikanje na že postavljene slike za zamenjavo (uporabnik lahko klikne na polje z napačno sliko in izbere novo)

### 2. Posodobitev `SequenceGameBase.tsx`
- Enake spremembe kot za `SequenceGame56Base.tsx`:
  - Odstraniti "arrange" fazo
  - Odstraniti shuffle logiko
  - Odstraniti puščice
  - Zaključek igre ob pravilni postavitvi vseh slik v "select" fazi

### 3. Logika zaključka igre
- Nova logika: v fazi "select", ko so vse 4 (ali 5) slike postavljene in vsaka na svojem pravem mestu, se sproži:
  1. `isComplete = true`
  2. Zvočno zaporedno predvajanje (ostane enako kot sedaj)
  3. Po predvajanju se sproži `onGameComplete`

