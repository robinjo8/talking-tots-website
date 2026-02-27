

# Zamenjava .m4a z .mp3 in vključitev novih besed

## 1. Globalna zamenjava audio formatov (.m4a → .mp3)

Vse datoteke v kodi, ki referencirajo zvočne posnetke, morajo preiti iz malih črk `.m4a` na velike začetnice `.mp3`.

### Pravilo pretvorbe imen datotek
Trenutno: `kaca.m4a` (male črke, brez šumnikov)
Novo: `Kaca.mp3` (velika začetnica, brez šumnikov)

Formula: vzemi obstoječe ime, nastavi prvo črko na veliko, zamenjaj `.m4a` z `.mp3`.

### Posebni primeri - KRITIČNO

| Beseda | Trenutni audio | Novi audio | Razlaga |
|--------|---------------|------------|---------|
| KOKOŠ (žival) | `kokos.m4a` | `Kokos_zival.mp3` | Ločevanje od sadeža |
| KOKOS (sadež) | `kokos_sadez.m4a` | `Kokos_sadez.mp3` | Ohrani se |
| KOŠ (predmet) | `kos.m4a` | `Kos_predmet.mp3` | Ločevanje od živali |
| KOZA (žival) | `koza.m4a` | `Koza_zival.mp3` | Ločevanje od kože |
| KOŽA (čutilo) | `koza_skin.m4a` | `Koza_cutilo.mp3` | Novo ime |

### Datoteke za urejanje (podatkovne)

Vsaka datoteka potrebuje zamenjavo vseh `audio: "xxx.m4a"` referenc:

1. **`src/data/artikulacijaVajeConfig.ts`** (~200 referenc) - vse besedne liste za kolo besed, bingo, R začetek
2. **`src/data/bingoWordsCSredinaKonec.ts`** (~16 referenc)
3. **`src/data/bingoWordsCHSredinaKonec.ts`**
4. **`src/data/bingoWordsKSredinaKonec.ts`**
5. **`src/data/bingoWordsLSredinaKonec.ts`**
6. **`src/data/bingoWordsSSredinaKonec.ts`**
7. **`src/data/bingoWordsSHSredinaKonec.ts`**
8. **`src/data/bingoWordsZSredinaKonec.ts`**
9. **`src/data/bingoWordsZHSredinaKonec.ts`**
10. **`src/data/bingoWordsR.ts`**
11. **`src/data/kaceLestveConfig.ts`** (~100+ referenc)
12. **`src/data/matchingGameData.ts`**
13. **`src/data/threeColumnMatchingData.ts`**
14. **`src/data/ponoviPovedConfig.ts`** (~60 referenc) - vključno s celimi povedmi
15. **`src/data/metKockeConfig.ts`**
16. **`src/data/drsnaSestavljankaConfig.ts`**
17. **`src/data/igraUjemanjaConfig.ts`**
18. **`src/data/spominConfig.ts`**
19. **`src/data/zaporedjaConfig.ts`**
20. **`src/data/articulationTestData.ts`** (~60 referenc za test simulacijo)

### Datoteke za urejanje (komponente z avtogenerirano pot do avdia)

Te komponente same sestavljajo avdio URL iz imena besede + `.m4a`. Povsod je treba:
- zamenjati `.m4a` z `.mp3`
- dodati pretvorbo v veliko začetnico

21. **`src/components/games/GenericLabirintGame.tsx`** - vrstica `audio: baseName.m4a`
22. **`src/components/games/GenericSestavljankaGame.tsx`** - vrstica `audio: baseName.m4a`
23. **`src/components/games/StarCollectDialog.tsx`** - avtogeneriranje `.m4a`
24. **`src/components/matching/MatchingCompletionDialog.tsx`** - avtogeneriranje `.m4a`
25. **`src/components/wheel/WheelSuccessDialog.tsx`** - avtogeneriranje `.m4a`
26. **`src/components/puzzle/PuzzleCompletionDialog.tsx`** - avtogeneriranje `.m4a`
27. **`src/components/free-games/FreeBingoGame.tsx`** - inline besedna lista
28. **`src/components/free-games/FreeMetKockeGame.tsx`** - inline besedna lista

### Tehnicna logika za avtogeneriranje

Komponente, ki same generirajo avdio URL, potrebujejo helper funkcijo za pretvorbo:

```text
Primer: beseda "kača" → normaliziraj → "kaca" → capitalize → "Kaca" → dodaj ".mp3"
Rezultat: "Kaca.mp3"

Za posebne primere (kokoš, koš, koza, koža) se uporabi eksplicitno polje `audio` v konfiguraciji.
```

Dodam pomožno funkcijo `toAudioFilename(word: string): string` v `src/utils/audioUtils.ts`:
- odstrani šumnike
- spremeni v male črke
- nastavi prvo črko na veliko
- doda `.mp3`

---

## 2. Besede, ki se trenutno NE uporabljajo

Preveril sem celotno kodo. Te besede (za katere imaš slike in zdaj tudi zvočne posnetke) se **nikjer ne pojavljajo** v nobeni igri:

| Beseda | Slika | Audio | Vsebuje glas |
|--------|-------|-------|-------------|
| JAJCE | jajce1.webp | Jajce.mp3 | **C** na sredini |
| JEŽ | jez1.webp | Jez.mp3 | **Ž** na koncu |
| MOŽ | moz1.webp | Moz.mp3 | **Ž** na koncu |
| POLŽ | polz1.webp | Polz.mp3 | **Ž** na koncu + **L** na sredini |
| KOS (žival) | kos_zival1.webp? | Kos_zival.mp3 | **S** na koncu |
| PES | pes1.webp | Pes.mp3 | **S** na koncu |
| VOZ | voz1.webp | Voz.mp3 | **Z** na koncu |
| AVTO | avto1.webp | Avto.mp3 | Noben ciljni glas |
| DIM | dim1.webp | Dim.mp3 | Noben ciljni glas |
| DUDA | duda1.webp | Duda.mp3 | Noben ciljni glas |
| FEN | fen1.webp | Fen.mp3 | Noben ciljni glas |
| GOBA | goba1.webp | Goba.mp3 | Noben ciljni glas |
| MED | med1.webp | Med.mp3 | Noben ciljni glas |
| MUHA | muha1.webp | Muha.mp3 | Noben ciljni glas |
| NOGA | noga1.webp | Noga.mp3 | Noben ciljni glas |
| PIPA | pipa1.webp | Pipa.mp3 | Noben ciljni glas |

### Predlog kam vključiti besede, ki ustrezajo ciljnim glasovom

**C sredina/konec** - dodaj JAJCE v:
- `bingoDataCSredinaKonec` (artikulacijaVajeConfig + bingoWordsCSredinaKonec)
- `KACE_WORDS_C` (kaceLestveConfig)

**Ž sredina/konec** - dodaj JEŽ, MOŽ, POLŽ v:
- `bingoDataZHSredinaKonec` (artikulacijaVajeConfig + bingoWordsZHSredinaKonec)
- `KACE_WORDS_ZH` (kaceLestveConfig)

**L sredina/konec** - dodaj POLŽ v:
- `bingoDataLSredinaKonec` (artikulacijaVajeConfig + bingoWordsLSredinaKonec)
- `KACE_WORDS_L` (kaceLestveConfig)

**S sredina/konec** - dodaj PES, KOS v:
- `bingoDataSSredinaKonec` (artikulacijaVajeConfig + bingoWordsSSredinaKonec)
- `KACE_WORDS_S` (kaceLestveConfig)

**Z sredina/konec** - dodaj VOZ v:
- `bingoDataZSredinaKonec` (artikulacijaVajeConfig + bingoWordsZSredinaKonec)
- `KACE_WORDS_Z` (kaceLestveConfig)

### Besede brez ciljnega glasu (AVTO, DIM, DUDA, FEN, GOBA, MED, MUHA, NOGA, PIPA)

Te besede ne ustrezajo nobenemu trenutnemu artikulacijskemu glasovnemu naboru (C, Č, K, L, R, S, Š, Z, Ž). Možnosti za prihodnost:
- Dodajanje novih glasovnih kategorij (npr. glas D, glas F, glas G, glas M, glas N, glas P)
- Uporaba kot splošne besede za besedišče v razvojnih vajah

Te besede za zdaj pustimo neintegrirane, razen če želiš dodati nove glasovne kategorije.

---

## 3. Zaporedje implementacije

1. Dodam helper funkcijo `toAudioFilename()` v `audioUtils.ts`
2. Posodobim vseh ~20 podatkovnih datotek (zamenjava `.m4a` → `.mp3` z velikimi začetnicami)
3. Posodobim vseh ~8 komponent, ki avtogenerirajo avdio URL-je
4. Dodam nove besede (JAJCE, JEŽ, MOŽ, POLŽ, PES, KOS, VOZ) v ustrezne nabore
5. Preverim, da se slike za KOS (žival) imenujejo pravilno v Supabase bucketu `slike`

### Obseg dela
- ~28 datotek za urejanje
- ~2000+ vrstic z referencami `.m4a` za zamenjavo
- 7 novih besed za dodajanje v obstoječe sezname

