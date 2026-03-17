

# Desktop overlay kontrole — povečanje in vizualna izboljšava

## Trenutno stanje
Kontrole (progress bar + gumbi) SO že znotraj videa kot overlay na vseh napravah. Vendar so na desktopju premajhne — uporabljajo mobilne velikosti ikon (`h-4 w-4`), kar je na velikem zaslonu komaj vidno.

## Spremembe

### 1. `VideoControls.tsx` — večje ikone in gumbi na desktopju v overlay načinu
- Overlay način: na desktopju (`md:`) uporabi večje ikone (`md:h-6 md:w-6`) in večji padding (`md:p-2.5`)
- Več razmaka med gumbi na desktopju (`md:gap-5`)

### 2. `VideoProgressBar.tsx` — debelejši progress bar na desktopju
- Compact način: na desktopju uporabi debelejši trak (`md:h-1.5`), večji drag handle (`md:w-4 md:h-4`), večji tekst (`md:text-sm`)

### 3. `GenericVideoNavodila.tsx` — večji padding overlay traku na desktopju
- Overlay container: `md:px-6 md:py-3` za več prostora okoli kontrol na desktopju

### Datoteke
1. `src/components/video/VideoControls.tsx`
2. `src/components/video/VideoProgressBar.tsx`
3. `src/components/games/GenericVideoNavodila.tsx`

