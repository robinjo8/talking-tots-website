

# Načrt: Popravek predvajanja zvoka v igrah

## Problem

Gumb zvočnika v dialogih iger ne predvaja besed. Napaka v konzoli:
```
NotSupportedError: Failed to load because no supported source was found.
Audio URL that failed: .../zvocni-posnetki/cekin1.m4a
```

## Vzrok napake

Slike v bucketu `slike` imajo v imenih datoteke sufiks "1" (npr. `cekin1.webp`, `cisterna1.webp`), medtem ko zvočne datoteke v bucketu `zvocni-posnetki` tega sufiksa nimajo (npr. `cekin.m4a`, `cisterna.m4a`).

Funkcija `enrichImageWithAudio` v nekaterih igrah generira napačen URL za zvok:
```typescript
// NAPAČNO - generira "cekin1.m4a"
const baseName = image.filename.replace('.webp', '').replace('.png', '');
audio: `${baseName}.m4a`

// PRAVILNO - generira "cekin.m4a"
baseName = baseName.replace(/1$/, '');  // Odstrani zaključno "1"
audio: `${baseName}.m4a`
```

## Prizadete komponente

| Datoteka | Status | Opis |
|----------|--------|------|
| `GenericSestavljankaGame.tsx` | Napaka | `enrichImageWithAudio` ne odstranjuje sufiksa "1" |
| `GenericLabirintGame.tsx` | OK | Pravilno odstranjuje sufiks "1" |
| `PuzzleSuccessDialog.tsx` | Delno | Uporablja `image.audio` ali normalizira besedo - lahko manjka "1" odstranitev |
| `MatchingCompletionDialog.tsx` | Delno | Fallback normalizacija besede je pravilna, vendar ne pokriva vseh primerov |
| `StarCollectDialog.tsx` | Delno | Uporablja `image.audio` ali normalizira besedo |

## Rešitev

### 1. Popravek GenericSestavljankaGame.tsx

Posodobiti funkcijo `enrichImageWithAudio`, da odstrani zaključno "1":

```typescript
const enrichImageWithAudio = (image: PuzzleImage): GameImage => {
  let baseName = image.filename.replace('.webp', '').replace('.png', '');
  // Odstrani zaključno "1" (npr. "cekin1" → "cekin")
  baseName = baseName.replace(/1$/, '');
  return {
    ...image,
    audio: `${baseName}.m4a`
  };
};
```

### 2. Popravek PuzzleSuccessDialog.tsx

Posodobiti funkcijo `handlePlayAudio`, da pravilno normalizira besedo in odstrani morebitno "1":

```typescript
const handlePlayAudio = (image: ImageData) => {
  let normalizedWord = image.word
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '');
  const audioFilename = image.audio || `${normalizedWord}.m4a`;
  // Preverimo, da audio ne vsebuje "1" na koncu
  const cleanAudioFilename = audioFilename.replace(/1\.m4a$/, '.m4a');
  const audioUrl = `.../${cleanAudioFilename}`;
  playAudio(audioUrl);
};
```

### 3. Popravek MatchingCompletionDialog.tsx

Posodobiti `handlePlayAudio` funkcijo z enako logiko čiščenja:

```typescript
const handlePlayAudio = (image: MatchingGameImage) => {
  let audioUrl: string;
  
  if (image.audio_url) {
    audioUrl = image.audio_url;
  } else {
    const normalizedWord = image.word
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '');
    // Odstrani potencialni "1" na koncu
    const cleanWord = normalizedWord.replace(/1$/, '');
    audioUrl = `.../${cleanWord}.m4a`;
  }
  
  playAudio(audioUrl);
};
```

### 4. Popravek StarCollectDialog.tsx in WheelSuccessDialog.tsx

Enaka logika čiščenja za generiranje zvočnega URL-ja.

---

## Povzetek sprememb

| Datoteka | Sprememba |
|----------|-----------|
| `src/components/games/GenericSestavljankaGame.tsx` | Dodaj `baseName.replace(/1$/, '')` v `enrichImageWithAudio` |
| `src/components/puzzle/PuzzleSuccessDialog.tsx` | Posodobi `handlePlayAudio` za čiščenje audio URL |
| `src/components/matching/MatchingCompletionDialog.tsx` | Posodobi `handlePlayAudio` za čiščenje audio URL |
| `src/components/games/StarCollectDialog.tsx` | Posodobi audio URL generiranje |
| `src/components/wheel/WheelSuccessDialog.tsx` | Posodobi audio URL generiranje |

## Rezultat

Pred popravkom:
- Zvočnik ne predvaja zvoka (napaka 403 ali "no supported source")
- URL išče: `cekin1.m4a` (ne obstaja)

Po popravku:
- Zvočnik predvaja besedo pravilno
- URL išče: `cekin.m4a` (obstaja)

