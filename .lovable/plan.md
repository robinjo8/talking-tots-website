

# Mobilna verzija video navodil — celozaslonski prikaz brez auto-fullscreen

## Problem
Na mobilni verziji se ob pritisku Play video samodejno preklopi v native fullscreen (`handleMobilePlay` kliče `handleToggleFullscreen`). Uporabnik želi, da video zapolni celoten zaslon znotraj brskalnika (od vrha do dna) brez native fullscreen-a.

## Spremembe

### `GenericVideoNavodila.tsx`
1. **Odstrani `handleMobilePlay`** — na mobilni verziji uporabi navaden `handlers.handlePlay` namesto `handleMobilePlay` (ki kliče fullscreen)
2. **Mobilni layout — video čez cel zaslon**: Na mobilni verziji odstrani padding (`px-0`, `pb-0`) in nastavi video container na `w-full h-full` da video zapolni celoten viewport
3. **`maxVideoHeight` na mobilni = celoten viewport**: Zmanjšaj/odstrani odbitke za padding na mobilni verziji (kontrole so overlay, torej ne rabijo dodatnega prostora)

### Konkretne spremembe:
- Vrstica 83-88: Odstrani `handleMobilePlay` funkcijo
- Vrstica 138: Spremeni `onPlay={isMobile ? handleMobilePlay : handlers.handlePlay}` → `onPlay={handlers.handlePlay}`
- Vrstica 46: Padding za mobilni nastavi na 0: `const padding = isMobile ? 0 : 48;`
- Vrstica 45: `controlsHeight` na mobilni nastavi na 0
- Vrstica 97: Mobilni padding: `pb-0 px-0 md:pb-2 md:px-8`
- Video element v `VideoPlayer.tsx`: Na mobilni dodaj `w-full h-full object-contain` da zapolni celoten prostor

### `VideoPlayer.tsx`
- Video element naj na mobilni verziji uporablja `w-full h-full` namesto samo `w-full h-auto`, da se raztegne čez celoten razpoložljiv prostor

### Datoteke
1. `src/components/games/GenericVideoNavodila.tsx`
2. `src/components/video/VideoPlayer.tsx`

