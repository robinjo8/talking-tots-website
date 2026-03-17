

# Video stran — prilagodljiv prikaz brez naslova

## Problem
- Na desktopju video ni v celoti viden na zaslonu (potrebno scrollanje), črno ozadje ob straneh
- Na mobilni verziji so kontrole ločene od videa (pod njim)
- Naslovi "Glas C" so nepotrebni

## Rešitev

### 1. `GenericVideoNavodila.tsx` — popolna preobrazba
- **Odstrani naslove** ("Glas C" in podnaslov) — nič besedila, samo video + kontrole
- **Desktop + mobile**: `fixed inset-0` layout (kot igre), video se dinamično prilagaja razpoložljivemu prostoru z `useEffect` na `window.resize` / `visualViewport`
- Video container izračuna razpoložljivo višino: `window.innerHeight - headerHeight - controlsHeight` in nastavi `max-height` na video elementu
- Na desktopju: kontrole (play/pause/stop/restart/volume/fullscreen) ostanejo pod videom
- **Na mobilni verziji**: kontrole se preselijo **čez video** (overlay) — polprosojne ikone na dnu videa, ki izginejo po nekaj sekundah neaktivnosti (tap za prikaz)

### 2. `VideoPlayer.tsx` — podpora za overlay kontrole
- Dodam opcijski `children` prop ali `overlayControls` slot, da lahko GenericVideoNavodila vstavi kontrole znotraj video containerja
- Video element dobi dinamični `max-height` style namesto fiksnega razmerja

### 3. `VideoControls.tsx` — mobilni overlay način
- Dodam prop `overlay?: boolean`
- Ko je `overlay=true`: absolutno pozicioniranje na dnu video containerja, polprosojno ozadje, bele ikone, auto-hide po 3s

### 4. `VideoProgressBar.tsx` — integracija v overlay
- Na mobilni verziji se progress bar prikaže znotraj overlay-a (tanka črta na dnu videa)

### Datoteke za spremembo
1. `src/components/games/GenericVideoNavodila.tsx` — odstrani naslove, fixed viewport layout, dinamično skaliranje
2. `src/components/video/VideoPlayer.tsx` — children/overlay slot, dinamični max-height
3. `src/components/video/VideoControls.tsx` — overlay način za mobile
4. `src/components/video/VideoProgressBar.tsx` — kompaktni overlay stil

