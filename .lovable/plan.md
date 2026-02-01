
# Povzetek: Stanje gumbov za predvajanje zvoka v vseh 10 igrah

## Analiza vseh 10 iger

| # | Igra | Dialog komponenta | Gumb za zvok | Status | Problem |
|---|------|-------------------|--------------|--------|---------|
| 1 | **Drsna sestavljanka** | MatchingCompletionDialog | ✅ Prisoten | **NE DELA** | Preverja `audio_url`, ki ne obstaja |
| 2 | **Sestavljanka** | PuzzleSuccessDialog | ✅ Prisoten | **DELA** | Generira URL iz besede |
| 3 | **Povezi pare** | MatchingCompletionDialog | ✅ Prisoten | **DELA** | Ima `audio_url` iz podatkov |
| 4 | **Igra ujemanja** | MatchingCompletionDialog | ✅ Prisoten | **DELA** | Ima `audio_url` iz podatkov |
| 5 | **Zaporedja** | MatchingCompletionDialog | ✅ Prisoten | **NE DELA** | Enaka težava kot Drsna sestavljanka |
| 6 | **Labirint** | StarCollectDialog | ✅ Prisoten | **DELA** | Pravkar popravljeno |
| 7 | **Spomin** | StarCollectDialog | ✅ Prisoten | **DELA** | Ista komponenta kot Labirint |
| 8 | **Bingo** | BingoSuccessDialog | ✅ Prisoten | **DELA** | Uporablja `word.audio` |
| 9 | **Kolo besed** | WheelSuccessDialog | ✅ Prisoten | **DELA** | Generira URL iz besede |
| 10 | **Smešne povedi** | DiceResultDialog | ❌ NI gumba | N/A | Ima samo gumb PREDVAJAJ/PONOVI |
| - | **Ponovi poved** | Dialog v igri | ✅ Prisoten | **DELA** | Ima PREDVAJAJ gumb |

---

## Podrobna analiza težav

### Težava 1: MatchingCompletionDialog (vrstice 152-156)

```typescript
const handlePlayAudio = (image: MatchingGameImage) => {
  if (image.audio_url) {      // <-- Preverja audio_url
    playAudio(image.audio_url);
  }
  // Če audio_url ne obstaja, se ne zgodi NIČ!
};
```

**Prizadete igre:**
- **Drsna sestavljanka** - posreduje slike brez `audio_url`
- **Zaporedja** - posreduje slike brez `audio_url`

**Igre, ki delujejo:**
- **Povezi pare** - slike iz baze imajo `audio_url`
- **Igra ujemanja** - slike iz baze imajo `audio_url`

### Rešitev

Komponenta `MatchingCompletionDialog` potrebuje fallback logiko:

```typescript
const handlePlayAudio = (image: MatchingGameImage) => {
  let audioUrl: string;
  
  if (image.audio_url) {
    audioUrl = image.audio_url;
  } else {
    // Fallback: generiraj URL iz besede
    const normalizedWord = image.word
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '');
    audioUrl = `https://ecmtctwovkheohqwahvt.supabase.co/storage/v1/object/public/zvocni-posnetki/${normalizedWord}.m4a`;
  }
  
  playAudio(audioUrl);
};
```

---

## Plan popravkov

### Datoteka: `src/components/matching/MatchingCompletionDialog.tsx`

1. Posodobiti funkcijo `handlePlayAudio` (vrstice 152-156) z fallback logiko
2. Dodati `type="button"` na gumb za konsistentnost

**Sprememba:**
```typescript
// PREJ:
const handlePlayAudio = (image: MatchingGameImage) => {
  if (image.audio_url) {
    playAudio(image.audio_url);
  }
};

// POTEM:
const handlePlayAudio = (image: MatchingGameImage) => {
  let audioUrl: string;
  
  if (image.audio_url) {
    audioUrl = image.audio_url;
  } else {
    const normalizedWord = image.word
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '');
    audioUrl = `https://ecmtctwovkheohqwahvt.supabase.co/storage/v1/object/public/zvocni-posnetki/${normalizedWord}.m4a`;
  }
  
  playAudio(audioUrl);
};
```

3. Posodobiti JSX za gumb (vrstica 221):
```typescript
<button
  type="button"   // Dodano
  onClick={(e) => {
    e.stopPropagation();
    handlePlayAudio(image);
  }}
  className="p-2 rounded-full bg-dragon-green hover:bg-dragon-green/90 transition-colors"
  aria-label="Predvajaj besedo"
>
```

---

## Povzetek sprememb

| Datoteka | Sprememba |
|----------|-----------|
| `src/components/matching/MatchingCompletionDialog.tsx` | Dodati fallback za generiranje audio URL-ja iz besede |

---

## Rezultat po popravku

| # | Igra | Status po popravku |
|---|------|--------------------|
| 1 | Drsna sestavljanka | ✅ POPRAVLJENO |
| 2 | Sestavljanka | ✅ Že dela |
| 3 | Povezi pare | ✅ Že dela |
| 4 | Igra ujemanja | ✅ Že dela |
| 5 | Zaporedja | ✅ POPRAVLJENO |
| 6 | Labirint | ✅ Že dela |
| 7 | Spomin | ✅ Že dela |
| 8 | Bingo | ✅ Že dela |
| 9 | Kolo besed | ✅ Že dela |
| 10 | Smešne povedi | N/A (ni gumba za posamezno besedo) |

Ta en sam popravek bo odpravil težavo v dveh igrah (Drsna sestavljanka in Zaporedja).

