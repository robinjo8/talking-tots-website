

# Posodobitev besed za Bingo in Zabavno pot (Kace)

## Povzetek
Uskladiti sezname besed med igrama Bingo in Zabavna pot za vse glasove. Nekateri glasovi (K, L, R) imajo vec kot 16 besed, kar zahteva posodobitev na vec mestih.

## Stevilo besed po glasovih (po uporabnikovih navodilih)
- **C**: 16 besed (brez sprememb)
- **S**: 16 besed (brez sprememb)
- **Z**: 16 besed (brez sprememb)
- **SH**: 16 besed (brez sprememb)
- **ZH**: 16 besed (brez sprememb)
- **CH**: 16 besed (brez sprememb)
- **K**: 37 besed (dodati KOKOS + 20 novih besed v artikulacijaVajeConfig)
- **L**: 42 besed (dodati 26 novih besed v artikulacijaVajeConfig)
- **R**: 35 besed (dodati 5 novih besed v standalone + 19 novih v artikulacijaVajeConfig)
- **R-zacetek**: 18 besed (brez sprememb)

## Spremembe po datotekah

### 1. `src/data/artikulacijaVajeConfig.ts` -- razsiri bingo podatke za K, L, R

Trenutno imajo inline seznami `bingoDataKSredinaKonec`, `bingoDataLSredinaKonec` in `bingoDataRSredinaKonec` le po 16 besed. Razsiriti na polne sezname:

- **K** (16 -> 37): Dodati PAJEK, PISKOT, RAK, RAKETA, ROKA, ROLKA, SLIKA, SMREKA, SNEZAK, SOK, SVETILKA, SVINCNIK, SCETKA, SKARJE, SKATLA, SKOLJKA, SOPEK, STAMPILJKA, STORKLJA, ZVOCNIK, KOKOS (sadez)
- **L** (16 -> 42): Dodati LETALO, METLA, MILO, OBLAK, OCALA, RAVNILO, ROLKA, ROPOTULJICA, SLADOLED, SLIKA, SLON, SLUZ, SVETILKA, SAL, SKATLA, SKOLJKA, STAMPILJKA, STORKLJA, TELEFON, VILICA, VOLAN, ZASLON, ZLATO, ZEBELJ, ZELVA, ZLICA
- **R** (16 -> 35): Dodati SIR, SMREKA, SKARJE, SOTOR, STORKLJA, TORBA, TROBENTA, URA, VETRNICA, ZEBRA, ZOBOTREBEC, ZARNICA, ZERJAV, ZIRAFA, BOBER, BOROVNICE, KOZAREC, KROZNIK, MROZ

### 2. `src/data/bingoWordsKSredinaKonec.ts` -- dodaj KOKOS

Dodati besedo KOKOS (sadez) poleg obstojecega KOKOS. Spremeniti obstojecega v KOKOS z opombo da se nanasa na kokos.

### 3. `src/data/bingoWordsR.ts` -- dodaj 5 besed

Dodati: BOBER, BOROVNICE, KOZAREC, KROZNIK, MROZ (skupaj 30 -> 35 besed).

### 4. `src/data/kaceLestveConfig.ts` -- dodaj sezname besed za vse glasove

Dodati naslednje nove sezname z `acceptedVariants`:
- `KACE_WORDS_S` (16 besed iz bingo S)
- `KACE_WORDS_Z` (16 besed iz bingo Z)
- `KACE_WORDS_SH` (16 besed iz bingo SH)
- `KACE_WORDS_ZH` (16 besed iz bingo ZH)
- `KACE_WORDS_CH` (16 besed iz bingo CH)
- `KACE_WORDS_K` (37 besed iz bingo K)
- `KACE_WORDS_L` (42 besed iz bingo L)
- `KACE_WORDS_R` (35 besed iz bingo R)

Dodati helper funkcijo `getKaceWordList(letter: string)` ki vrne ustrezen seznam.

Obstojecega `KACE_WORDS_C` (16) in `KACE_WORDS_R_ZACETEK` (18) ne spreminjamo.

### 5. `src/components/routing/KaceLestveRouter.tsx` -- razsiri veljavne crke

- `VALID_LETTERS` razsiriti na `["c", "s", "z", "r-zacetek", "sh", "zh", "ch", "k", "l", "r"]`
- Zamenjati if/else z uporabo `getKaceWordList(letter)`

### 6. `src/components/routing/admin/AdminKaceLestveRouter.tsx` -- enako

- Razsiriti `VALID_LETTERS` in uporabiti `getKaceWordList`

### 7. `src/pages/KaceLestveGames.tsx` -- omogoci vse kartice

- Nastaviti `available: true` za vse glasove (sh, zh, ch, k, l, r)

### 8. `src/pages/admin/games/AdminKaceLestveGames.tsx` -- dodaj vse glasove

- Dodati kartice za vse glasove (s, z, sh, zh, ch, k, l, r) poleg obstojecih c in r-zacetek

## Datoteke za urejanje (8)
1. `src/data/artikulacijaVajeConfig.ts`
2. `src/data/bingoWordsKSredinaKonec.ts`
3. `src/data/bingoWordsR.ts`
4. `src/data/kaceLestveConfig.ts`
5. `src/components/routing/KaceLestveRouter.tsx`
6. `src/components/routing/admin/AdminKaceLestveRouter.tsx`
7. `src/pages/KaceLestveGames.tsx`
8. `src/pages/admin/games/AdminKaceLestveGames.tsx`

