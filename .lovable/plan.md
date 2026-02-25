

# Popravek: Pop-up okno se pojavi preden se končajo zvočni posnetki

## Problem
Ko se igra zaključi, se `isComplete` nastavi na `true`. V istem renderju se zaženeta dva useEffect-a:
1. Zaporedno predvajanje (ki asinhrono nastavi `isPlayingAudio = true`)
2. Preverjanje za `onGameComplete` (ki vidi `isPlayingAudio = false` ker se še ni posodobil)

Rezultat: pop-up okno se prikaže takoj, posnetki pa se predvajajo v ozadju.

## Rešitev
V vseh treh tipih iger (3-4, 5-6, 7-10):

1. **Ko se `isComplete` nastavi na `true`, hkrati nastaviti `isPlayingAudio = true`** - to prepreči, da bi onGameComplete useEffect sprožil pop-up.
2. **Klic `onGameComplete` prestaviti na konec `playSequential` funkcije** namesto v ločen useEffect (ali pa pustiti useEffect, ki bo zdaj pravilno čakal).
3. **Zmanjšati zamik med posnetki s 500ms na 300ms** za hitrejše predvajanje.

## Spremembe po datotekah

### 1. `src/hooks/useSequenceGame.ts`
- V useEffect za detekcijo zaključka (vrstice 101-111): ko se nastavi `setIsComplete(true)`, hkrati nastaviti tudi `setIsPlayingAudio(true)`
- V sequential playback useEffect (vrstice 113-138): zamik zmanjšati iz 500ms na 300ms
- Na koncu `playSequential` ne spreminjati (pustiti `setIsPlayingAudio(false)`)

### 2. `src/components/exercises/SequenceGameS.tsx` (in C, K, L, R, Z, Č, Š, Ž)
- useEffect za `onGameComplete` (vrstica 23-28) ostane enak - zdaj bo pravilno čakal ker je `isPlayingAudio` nastavljen sočasno z `isComplete`

### 3. `src/components/exercises/SequenceGame56Base.tsx`
- V useEffect za detekcijo zaključka (vrstice 147-155): ko se nastavi `setIsComplete(true)`, hkrati nastaviti `setIsPlayingAudio(true)`
- Zamik v sequential playback zmanjšati iz 500ms na 300ms

### 4. `src/components/exercises/SequenceGameBase.tsx`
- Enake spremembe kot SequenceGame56Base

## Povzetek sprememb
- 3 vrstice spremenjene v `useSequenceGame.ts`
- 2 vrstici spremenjeni v `SequenceGame56Base.tsx`
- 2 vrstici spremenjeni v `SequenceGameBase.tsx`
- Komponente za posamezne črke se NE spreminjajo

