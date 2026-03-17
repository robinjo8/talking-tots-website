

# Odstrani native fullscreen — samo auto-play na mobilni

## Problem
Ko uporabnik odpre video na mobilni, se sproži native fullscreen (`handleToggleFullscreen`). Ko pritisne sistemski gumb "nazaj", se najprej zapre fullscreen in prikaže navaden pogled — šele drugi pritisk nazaj ga dejansko preusmeri. Video stran že ima `fixed inset-0` layout, ki zapolni celoten viewport brez native fullscreen-a.

## Rešitev
V `GenericVideoNavodila.tsx` odstrani klic `handlers.handleToggleFullscreen()` iz auto-fullscreen `useEffect`-a. Obdrži samo `handlers.handlePlay()`, da se video samodejno predvaja ob nalaganju.

### Sprememba (vrstica 83-94):
```tsx
// Auto-play on mobile when video is ready
const hasAutoPlayed = useRef(false);
useEffect(() => {
  if (isMobile && !hasAutoPlayed.current && !isLoading && videoRef.current) {
    hasAutoPlayed.current = true;
    setTimeout(() => {
      handlers.handlePlay();
    }, 300);
  }
}, [isMobile, isLoading]);
```

### Datoteka
- `src/components/games/GenericVideoNavodila.tsx`

