

## Plan: Mobilna prilagoditev albuma — fullscreen, sličice, navigacija

### Spremembe

**1. `src/components/album/AlbumPage.tsx` — Popravek pozicij sličic za mobilno**
- Zmanjšaj velikost sličic na mobilnem (`w-[38%]`) in prilagodi pozicije tako da se ne prekrivajo
- Uporabi ločene mobilne pozicije z manjšimi sličicami in bolj razpršenim layoutom (3 vrstice x 2 stolpca z dovolj prostora)

**2. `src/pages/Album.tsx` — Fullscreen mobilni prikaz**
- Na mobilnem: uporabi `fixed inset-0 overflow-hidden` layout (kot igre)
- Dodaj landscape detekcijo in overlay za vrtenje v pokončni način (kot Ponovi poved)
- Odstrani `pt-24 pb-12 px-4` padding na mobilnem
- Dodaj plavajoči gumb "nazaj" (levo spodaj, enak stil kot "?" gumb — gradient amber→orange, w-16 h-16)
- Ikona: `ArrowLeft` ali `Home`

**3. `src/components/album/AlbumBook.tsx` — Mobilna navigacija**
- Na mobilnem: odstrani navigacijske pikice, prikaži samo številko strani (npr. "3 / 28")
- Odstrani leve/desne puščice na mobilnem (navigacija s swipe)
- Swipe levo/desno že deluje (handleTouchStart/End) — ohrani
- Album na mobilnem zapolni celoten viewport: `h-full` namesto `min-h-[500px]`
- Dinamično izračunaj velikost albuma glede na viewport (kot wheelMaxSize v GenericWheelGame)

### Tehnični detajli

- Landscape overlay: `window.innerWidth > window.innerHeight && isTouchDevice` → prikaži overlay z navodilom za vrtenje telefona
- Fullscreen layout: `fixed inset-0 overflow-hidden` z `overscroll-behavior-y: contain`
- Številka strani na mobilnem: centriran tekst pod albumom `{currentSpread + 1} / {totalSpreads}`
- Gumb nazaj: navigacija na `/moja-stran` (vstopna točka albuma po memory spec)

