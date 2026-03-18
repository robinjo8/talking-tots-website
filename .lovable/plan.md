

# Fix: Spomin igra ne uporablja novih .mp3 posnetkov

## Problem
`useGenericMemoryGame.tsx` vrne podatke iz Supabase brez klica `normalizeAudioUrl`. Zato se predvajajo stari `.m4a` posnetki. Vsi ostali hooki za spomin (useMemoryGameC, useMemoryGameL, itd.) že pravilno kličejo `normalizeAudioUrl`.

## Sprememba

### `src/hooks/useGenericMemoryGame.tsx`
- Dodaj import `normalizeAudioUrl` iz `@/utils/audioUtils`
- Na vrstici 47, kjer se vrnejo podatki, dodaj `.map(item => ({ ...item, audio_url: normalizeAudioUrl(item.audio_url) }))` — enako kot pri vseh ostalih hookih

To je ena vrstica spremembe. Vsi spomin igre, ki gredo skozi `GenericSpominGame` → `useGenericMemoryGame`, bodo po tem uporabljale pravilne .mp3 posnetke.

