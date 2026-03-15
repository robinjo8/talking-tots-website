

# Ponovi Poved — prisilni ležeči način na tablicah

## Problem

Igra "Ponovi Poved" na tablici v pokončnem načinu prikaže desktop postavitev, ki je neustrezna. Tablica ni zaznana kot "touch device" ker ima `Math.min(width, height) >= 768px`, zato dobi desktop layout.

Druge igre (Labirint, Spomin, Zaporedja) to rešujejo z višjim pragom (`<= 900`) in klicem `safeLockLandscape()` + prikazom overlay-a "Obrni telefon" če je naprava v pokončnem načinu.

## Rešitev

### `src/components/games/PonoviPovedGame.tsx`

1. **Dodaj ločeno detekcijo tablic** — poleg obstoječega `isTouchDevice` (telefoni, `< 768`) dodaj `isTablet`:
   ```
   const [isTablet] = useState(() => {
     const hasTouch = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
     const minDim = Math.min(window.innerWidth, window.innerHeight);
     return hasTouch && minDim >= 768 && minDim <= 1200;
   });
   ```

2. **Na tablicah zakleni landscape** — dodaj `useEffect` ki ob `isTablet` pokliče `safeRequestFullscreen()` + `safeLockLandscape()` (enak vzorec kot GenericLabirintGame)

3. **Dodaj detekcijo portrait na tablici** — dodaj `isTabletPortrait` state, ki preverja orientacijo na tablicah

4. **Prikaži overlay za obračanje** — če `isTablet && isTabletPortrait`, prikaži overlay "Obrni tablico v ležeči položaj" (enak vzorec kot labirint)

5. **Ko je tablica v landscape** — uporabi obstoječo "mobile" postavitev (ki je zasnovana za ležeči način) namesto desktop postavitve

### Spremembe v logiki izbire postavitve

Trenutno igra izbira med "mobile" in "desktop" na podlagi `isMobile` (hook). Za tablico v landscape načinu je potrebno uporabiti mobile/landscape postavitev kamnov in elementov. Dodam pogoj: `const useMobileLayout = isMobile || isTablet`.

### Datoteke za spremembo
- `src/components/games/PonoviPovedGame.tsx` — vsa logika zgoraj

