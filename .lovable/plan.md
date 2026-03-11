

# Fix: Landscape overlay ne deluje na iOS za Ponovi Poved

## Problem
Ko uporabnik na iPhonu obrne telefon v landscape, `useIsMobile()` vrne `false` (ker `window.innerWidth` postane > 768px). Zato pogoj `isLand && isMobile` na vrstici 247 nikoli ni `true` v landscape načinu in overlay se ne prikaže.

## Rešitev
Namesto da se zanašamo na `useIsMobile()` (ki temelji na širini okna), uporabimo **touch detection + iOS detection** za določanje ali gre za mobilno napravo. To zagotovi, da se overlay prikaže tudi ko je telefon obrnjen v landscape.

## Spremembe

### `src/components/games/PonoviPovedGame.tsx`

1. Dodamo state `isTouchDevice` z synchronous init (kot per projekt konvencija):
```ts
const [isTouchDevice] = useState(() => {
  if (typeof window === 'undefined') return false;
  const hasTouch = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
  const isSmallDevice = Math.min(window.innerWidth, window.innerHeight) < 768;
  return hasTouch && isSmallDevice;
});
```
Uporabimo `Math.min(width, height)` — to vrne krajšo stranico (portrait width), ki je vedno < 768 na telefonih, ne glede na orientacijo.

2. V landscape detection zamenjamo `isMobile` z `isTouchDevice`:
```ts
const isLand = window.innerWidth > window.innerHeight;
setIsLandscape(isLand && isTouchDevice);
```

3. `isMobile` ohranimo za layout odločitve (mobile vs desktop grid), `isTouchDevice` pa uporabimo samo za landscape overlay detection.

To je minimalna sprememba — 3 vrstice kode.

