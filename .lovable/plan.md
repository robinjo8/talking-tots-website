

# Popravek prikaza videa — odstranitev črnih robov

## Problem
Video predvajalnik ima fiksno razmerje `aspect-video` (16:9) z `bg-black`, kar povzroča črne pasove ob straneh pri vertikalnih/kvadratnih videih. Na mobilnih napravah je prikaz premajhen.

## Rešitev

### 1. `src/components/video/VideoPlayer.tsx`
- Odstrani fiksno `aspect-video` razmerje — video sam določi svojo višino
- Zamenjaj `bg-black` z `bg-transparent` (ali odstrani)
- Ohrani `object-contain` za pravilno prilagajanje
- Video element dobi `rounded-lg` neposredno

### 2. `src/components/games/GenericVideoNavodila.tsx`
- **Desktop**: Odstrani belo kartico (bg-background wrapper) — video se prikaže neposredno na zelenem ozadju z zaobljenimi robovi
- **Mobile**: Video zavzame celotno širino brez paddings, kontrole so kompaktne pod njim
- Na mobilni verziji ob kliku na "Predvajaj" sproži samodejni fullscreen prek `handleToggleFullscreen` (že implementiran v `useVideoPlayer`)

### 3. `src/hooks/useVideoPlayer.ts`
- Dodaj opcijo `autoFullscreenOnPlay` za mobilne naprave — ko uporabnik klikne play, se video samodejno preklopi v fullscreen

### Datoteke za spremembo
1. `src/components/video/VideoPlayer.tsx` — odstrani aspect-video, bg-black
2. `src/components/games/GenericVideoNavodila.tsx` — poenostavi layout, odstrani belo kartico
3. `src/hooks/useVideoPlayer.ts` — auto-fullscreen na mobile ob play

