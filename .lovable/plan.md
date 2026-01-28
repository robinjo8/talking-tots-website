
# Načrt: Vse besedilo v pop-up oknih z velikimi tiskanimi črkami

## Pregled

Potrebno je pregledati vse pop-up dialoge znotraj iger in zagotoviti, da je VSE besedilo napisano z velikimi tiskanimi črkami (uppercase).

---

## Analiza dialošnih komponent

### 1. StarCollectDialog.tsx (Labirint - pobiranje zvezd)
**Lokacija:** `src/components/games/StarCollectDialog.tsx`

| Vrstica | Trenutno besedilo | Potrebna sprememba |
|---------|-------------------|---------------------|
| 132 | `Odlično! Pobral si {starNumber}. zvezdico!` | `ODLIČNO! POBRAL SI {starNumber}. ZVEZDICO!` |
| 136 | `KLIKNI NA SLIKO IN PONOVI BESEDO` | ✅ Že uppercase |
| 191-192 | `PREDVAJAJ` | ✅ Že uppercase |

---

### 2. MemoryPairDialog.tsx (Spomin - par dialog)
**Lokacija:** `src/components/games/MemoryPairDialog.tsx`

| Vrstica | Trenutno besedilo | Potrebna sprememba |
|---------|-------------------|---------------------|
| 126 | `Par {pairNumber} od {totalPairs}` | `PAR {pairNumber} OD {totalPairs}` |
| 131 | `KLIKNI NA SPODNJO SLIKO IN PONOVI BESEDO` | ✅ Že uppercase |
| 199 | `Ponovi` | `PONOVI` |
| 214 | `Vzemi zvezdico` | `VZEMI ZVEZDICO` |
| 216 | `Nadaljuj` | `NADALJUJ` |

---

### 3. BingoSuccessDialog.tsx (Bingo)
**Lokacija:** `src/components/bingo/BingoSuccessDialog.tsx`

| Vrstica | Trenutno besedilo | Potrebna sprememba |
|---------|-------------------|---------------------|
| 116 | `🎉 Čestitke! 🎉` / `Odlično!` | `🎉 ČESTITKE! 🎉` / `ODLIČNO!` |
| 120 | `KLIKNI NA SPODNJO SLIKO IN PONOVI BESEDO` | ✅ Že uppercase |
| 189 | `⭐ VZEMI ZVEZDICO` | ✅ Že uppercase |
| 195 | `NADALJUJ` | ✅ Že uppercase |

---

### 4. BingoCongratulationsDialog.tsx
**Lokacija:** `src/components/bingo/BingoCongratulationsDialog.tsx`

| Vrstica | Trenutno besedilo | Potrebna sprememba |
|---------|-------------------|---------------------|
| 25 | `BRAVO!` | ✅ Že uppercase |
| 36 | `⭐ VZEMI ZVEZDICO` | ✅ Že uppercase |

---

### 5. PuzzleSuccessDialog.tsx (Sestavljanke, Drsna, Poveži)
**Lokacija:** `src/components/puzzle/PuzzleSuccessDialog.tsx`

| Vrstica | Trenutno besedilo | Potrebna sprememba |
|---------|-------------------|---------------------|
| 158 | `Odlično!` | `ODLIČNO!` |
| 161 | `KLIKNI NA SPODNJE SLIKE IN PONOVI BESEDE` | ✅ Že uppercase |
| 228 | `ZAPRI` | ✅ Že uppercase |
| 238 | `VZEMI ZVEZDICO` | ✅ Že uppercase |

---

### 6. WheelSuccessDialog.tsx (Kolo sreče)
**Lokacija:** `src/components/wheel/WheelSuccessDialog.tsx`

| Vrstica | Trenutno besedilo | Potrebna sprememba |
|---------|-------------------|---------------------|
| 203 | `🎉 Čestitke! 🎉` / `Odlično!` | `🎉 ČESTITKE! 🎉` / `ODLIČNO!` |
| 207 | `KLIKNI NA SPODNJO SLIKO IN PONOVI BESEDO` | ✅ Že uppercase |
| 255 | `Izgovoril si {displayCount}/3 krat` | `IZGOVORIL SI {displayCount}/3 KRAT` |
| 256 | `(še ${3 - displayCount}x za zvezdico)` | `(ŠE ${3 - displayCount}X ZA ZVEZDICO)` |
| 280 | `VZEMI ZVEZDICO` | ✅ Že uppercase |
| 284 | `NADALJUJ` | ✅ Že uppercase |

---

### 7. StarEarnedDialog.tsx (Met kocke - zvezdica)
**Lokacija:** `src/components/dice/StarEarnedDialog.tsx`

| Vrstica | Trenutno besedilo | Potrebna sprememba |
|---------|-------------------|---------------------|
| 19 | `BRAVO!` | ✅ Že uppercase |
| 23 | `OSVOJIL SI ZVEZDICO!` | ✅ Že uppercase |
| 35 | `VZEMI ZVEZDICO` | ✅ Že uppercase |

---

### 8. DiceResultDialog.tsx (Met kocke - rezultat)
**Lokacija:** `src/components/dice/DiceResultDialog.tsx`

| Vrstica | Trenutno besedilo | Potrebna sprememba |
|---------|-------------------|---------------------|
| 143 | `ODLIČNO!` | ✅ Že uppercase |
| 148-149 | `POSLUŠAJ IN PONOVI BESEDE` | ✅ Že uppercase |
| 163-165 | Besede `.toUpperCase()` | ✅ Že uppercase |
| 171-172 | Poved `.toUpperCase()` | ✅ Že uppercase |
| 183 | `PREDVAJAJ` | ✅ Že uppercase |
| 192 | `PONOVI` | ✅ Že uppercase |
| 201 | `ZAPRI` | ✅ Že uppercase |

---

### 9. MatchingCompletionDialog.tsx (Igra ujemanja)
**Lokacija:** `src/components/matching/MatchingCompletionDialog.tsx`

| Vrstica | Trenutno besedilo | Potrebna sprememba |
|---------|-------------------|---------------------|
| 189 | `Odlično!` | `ODLIČNO!` |
| 252 | `Zapri` | `ZAPRI` |
| 262 | `Vzemi zvezdico` | `VZEMI ZVEZDICO` |
| 273 | `Nova igra` | `NOVA IGRA` |
| 278 | `Zapri` | `ZAPRI` |

---

### 10. TrophyDialog.tsx (Pokal ob 100 zvezdicah)
**Lokacija:** `src/components/exercises/TrophyDialog.tsx`

| Vrstica | Trenutno besedilo | Potrebna sprememba |
|---------|-------------------|---------------------|
| 40 | `🎉 ČESTITKE! 🎉` | ✅ Že uppercase |
| 43 | `Čestitamo {childName} za osvojeni pokal!` | `ČESTITAMO {childName} ZA OSVOJENI POKAL!` |
| 63 | `⭐ {totalStars} ZVEZD ⭐` | ✅ Že uppercase |
| 67 | `Bravo, to je tvoj {trophyNumber}. pokal!` | `BRAVO, TO JE TVOJ {trophyNumber}. POKAL!` |
| 75 | `Vzemi pokal` / `Nadaljuj z vajami` | `VZEMI POKAL` / `NADALJUJ Z VAJAMI` |

---

### 11. PonoviPovedGame.tsx - Sentence Dialog & Success Dialog
**Lokacija:** `src/components/games/PonoviPovedGame.tsx`

| Vrstica | Trenutno besedilo | Potrebna sprememba |
|---------|-------------------|---------------------|
| 952 | `ODLIČNO!` | ✅ Že uppercase |
| 957-958 | `POSLUŠAJ IN PONOVI POVED` | ✅ Že uppercase |
| 1002 | `PONOVI` | ✅ Že uppercase |
| 1014 | `NAPREJ` | ✅ Že uppercase |
| 1026 | `Opozorilo` | `OPOZORILO` |
| 1028 | `Če zapreš okno, se bo igra začela od začetka...` | `ČE ZAPREŠ OKNO, SE BO IGRA ZAČELA OD ZAČETKA...` |
| 1032 | `Ne` | `NE` |
| 1037 | `Da` | `DA` |
| 1047 | `Opozorilo` | `OPOZORILO` |
| 1049 | `Ali res želiš zapustiti igro?...` | `ALI RES ŽELIŠ ZAPUSTITI IGRO?...` |
| 1053 | `Ne` | `NE` |
| 1058 | `Da` | `DA` |
| 1068 | `Navodila` | `NAVODILA` |
| 1069-1075 | Navodilno besedilo | Uppercase za vse |
| 1080 | `Razumem` | `RAZUMEM` |
| 1094-1095 | `ČESTITKE!` | ✅ Že uppercase |
| 1099 | `Odlično si ponovil/a vse povedi!` | `ODLIČNO SI PONOVIL/A VSE POVEDI!` |
| 1133 | `⭐ Vzemi zvezdico` | `⭐ VZEMI ZVEZDICO` |

---

### 12. GenericLabirintGame.tsx - Instructions Dialog
**Lokacija:** `src/components/games/GenericLabirintGame.tsx`

| Vrstica | Trenutno besedilo | Potrebna sprememba |
|---------|-------------------|---------------------|
| 326 | `📖 Navodila` | `📖 NAVODILA` |
| 328 | `Poišči pot skozi labirint...` | `POIŠČI POT SKOZI LABIRINT...` |
| 333 | `Razumem` | `RAZUMEM` |
| 401-403 | (Enako kot zgoraj) | Enako |
| 407-408 | `Razumem` | `RAZUMEM` |

---

### 13. ConfirmDialog.tsx (Splošni potrditveni dialog)
**Lokacija:** `src/components/ui/confirm-dialog.tsx`

Ta komponenta prejema `title` in `description` kot props. Besedilo se nastavi v starševski komponenti - posodobiti je treba klice te komponente.

---

### 14. MemoryExitConfirmationDialog.tsx
**Lokacija:** `src/components/games/MemoryExitConfirmationDialog.tsx`

| Vrstica | Trenutno besedilo | Potrebna sprememba |
|---------|-------------------|---------------------|
| 18 | `Opozorilo` | `OPOZORILO` |
| 20 | `Ali res želite prekiniti igro?` | `ALI RES ŽELITE PREKINITI IGRO?` |
| 27 | `Da` | `DA` |
| 31 | `Ne` | `NE` |

---

## Povzetek sprememb

| Datoteka | Število sprememb |
|----------|------------------|
| `StarCollectDialog.tsx` | 1 |
| `MemoryPairDialog.tsx` | 4 |
| `BingoSuccessDialog.tsx` | 1 |
| `PuzzleSuccessDialog.tsx` | 1 |
| `WheelSuccessDialog.tsx` | 3 |
| `MatchingCompletionDialog.tsx` | 5 |
| `TrophyDialog.tsx` | 4 |
| `PonoviPovedGame.tsx` | ~15 |
| `GenericLabirintGame.tsx` | 6 (na 2 mestih) |
| `MemoryExitConfirmationDialog.tsx` | 4 |

**Skupno: 10 datotek, ~44 besedilnih sprememb**

---

## Tehnična implementacija

Za vsako besedilo bo potrebno:
1. Zamenjati male črke z velikimi
2. Za dinamične vrednosti (npr. `{pairNumber}`) ohraniti interpolacijo
3. Uporabiti `.toUpperCase()` za dinamične stringe kjer je primerno
