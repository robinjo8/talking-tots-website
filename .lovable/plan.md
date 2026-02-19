

## Popravek KOKOS / KOKOŠ -- vse igre

### Pravilna specifikacija

| Beseda | Slika | Audio |
|--------|-------|-------|
| KOKOS (sadez) | kokos_sadez1.webp | kokos_sadez.m4a |
| KOKOS (zival) | kokos1.webp | kokos.m4a |

### Najdene napake

#### 1. KOKOS (sadez) -- napacen audio (3 datoteke)

Povsod, kjer je KOKOS (sadez), je slika pravilna (`kokos_sadez1.webp`), ampak audio je napacen -- `kokos.m4a` namesto `kokos_sadez.m4a`:

| Datoteka | Vrstica | Beseda | Trenutni audio | Pravilen audio |
|----------|---------|--------|---------------|----------------|
| artikulacijaVajeConfig.ts | 268 | KOKOS | kokos.m4a | kokos_sadez.m4a |
| bingoWordsSSredinaKonec.ts | 14 | KOKOS | kokos.m4a | kokos_sadez.m4a |
| metKockeConfig.ts | 237 | kokos | kokos.m4a | kokos_sadez.m4a |

#### 2. KOKOS (zival) -- napacen audio v igri ujemanja (2 datoteki, 3 vnosi)

V matching igrah je za KOKOS (zival) audio `kokos_1.m4a` namesto `kokos.m4a`:

| Datoteka | Vrstica | Beseda | Trenutni audio | Pravilen audio |
|----------|---------|--------|---------------|----------------|
| matchingGameData.ts | 61 | KOKOS | kokos_1.m4a | kokos.m4a |
| threeColumnMatchingData.ts | 59 | KOKOS | kokos_1.m4a | kokos.m4a |
| threeColumnMatchingData.ts | 222 | kokos | kokos_1.m4a | kokos.m4a |

#### 3. Drsna sestavljanka -- audio se generira iz besede, napacno za KOKOS (sadez)

V `puzzleImages.ts` ni polja `audio`. Ko se pri drsni sestavljanki prikaze zakljucni dialog, se audio URL generira iz besede. Ker obe besedi ("KOKOS" in "KOKOS") po normalizaciji (odstranitev sumnikov) postaneta "kokos", obe dobita `kokos.m4a` -- kar je napacno za sadez (mora biti `kokos_sadez.m4a`).

Resitev:
- Dodati neobvezno polje `audio` v vmesnik `PuzzleImage` v `puzzleImages.ts`
- Nastaviti `audio: 'kokos_sadez.m4a'` za vnos KOKOS (sadez)
- Posodobiti `GenericDrsnaSestavljankaGame.tsx` da posreduje `audio_url` v zakljucni dialog

#### 4. MatchingCompletionDialog -- problematicna logika

V `MatchingCompletionDialog.tsx` (vrstica 157) je logika `replace(/1\.m4a$/, '.m4a')` ki odstrani koncni "1" iz audio URL-jev. Ce posredujemo pravilne audio URL-je, ta logika ni potrebna in lahko povzroci napake. Treba jo je odstraniti.

#### 5. Pravilni vnosi (brez sprememb)

Naslednji vnosi so ze pravilni:

| Datoteka | Vrstica | Beseda | Slika | Audio |
|----------|---------|--------|-------|-------|
| artikulacijaVajeConfig.ts | 63 | KOKOS (zival) | kokos1.webp | kokos.m4a |
| artikulacijaVajeConfig.ts | 219 | KOKOS (zival) | kokos1.webp | kokos.m4a |
| artikulacijaVajeConfig.ts | 284 | KOKOS (zival) | kokos1.webp | kokos.m4a |
| bingoWordsKSredinaKonec.ts | 22 | KOKOS (zival) | kokos1.webp | kokos.m4a |
| bingoWordsSHSredinaKonec.ts | 11 | KOKOS (zival) | kokos1.webp | kokos.m4a |
| FreeBingoGame.tsx | 16, 32 | KOKOS (zival) | kokos1.webp | kokos.m4a |
| FreeMetKockeGame.tsx | 11 | kokos (zival) | kokos1.webp | kokos.m4a |
| metKockeConfig.ts | 107, 227 | kokos (zival) | kokos1.webp | kokos.m4a |
| ponoviPovedConfig.ts | 66, 321 | Kokos (zival) | kokos1.webp | kokos.m4a |
| matchingGameData.ts | 60 | KOKOS (sadez) | kokos_sadez1.webp | kokos_sadez.m4a |
| threeColumnMatchingData.ts | 58, 221 | KOKOS (sadez) | kokos_sadez1.webp | kokos_sadez.m4a |
| puzzleImages.ts | 49 | KOKOS (sadez) | kokos_sadez1.webp | -- |
| puzzleImages.ts | 50 | KOKOS (zival) | kokos1.webp | -- |

### Povzetek sprememb (9 popravkov v 7 datotekah)

| Datoteka | Sprememba |
|----------|----------|
| src/data/artikulacijaVajeConfig.ts | Vrstica 268: audio "kokos.m4a" → "kokos_sadez.m4a" |
| src/data/bingoWordsSSredinaKonec.ts | Vrstica 14: audio "kokos.m4a" → "kokos_sadez.m4a" |
| src/data/metKockeConfig.ts | Vrstica 237: audio "kokos.m4a" → "kokos_sadez.m4a" |
| src/data/matchingGameData.ts | Vrstica 61: audio "kokos_1.m4a" → "kokos.m4a" |
| src/data/threeColumnMatchingData.ts | Vrstica 59: audio "kokos_1.m4a" → "kokos.m4a"; Vrstica 222: audio "kokos_1.m4a" → "kokos.m4a" |
| src/data/puzzleImages.ts | Dodati neobvezno polje `audio` v PuzzleImage; nastaviti `audio: 'kokos_sadez.m4a'` za KOKOS sadez |
| src/components/games/GenericDrsnaSestavljankaGame.tsx | Posredovati audio_url v completionImages iz polja audio |
| src/components/matching/MatchingCompletionDialog.tsx | Odstraniti logiko `replace(/1\.m4a$/, '.m4a')` v vrstici 157 |

