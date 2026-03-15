

# Popravek: Android gumb Nazaj v igri Zaporedja

## Problem

Ko uporabnik med igro na Android telefonu pritisne sistemski gumb **Nazaj**:
1. Brskalnik zapusti fullscreen (privzeto obnašanje)
2. Zaklepanje orientacije (landscape lock) se izgubi
3. Telefon se obrne v pokončni položaj in prikaže overlay "obrni telefon"
4. Tudi po vrnitvi v ležeči položaj se fullscreen in landscape lock ne obnovita -- igra ostane "zataknjena"

## Rešitev

### `src/components/games/GenericZaporedjaGame.tsx`

Dva popravka:

**1. Prestreži Android Back gumb s `popstate` eventom**

Ob mountu igre (ko je `effectiveFullscreen`) dodaj history entry z `history.pushState` in poslušaj `popstate` event. Ko uporabnik pritisne Nazaj:
- Prepreči navigacijo nazaj (dodaj nov history entry)
- Prikaži obstoječi `MemoryExitConfirmationDialog` za izhod

To je enak vzorec kot ga uporabljajo mnoge SPA igre za preprečitev nehotenega izhoda.

**2. Ob izgubi fullscreena ponovno zakleni landscape**

V obstoječem `fullscreenchange` listenerju dodaj logiko: če fullscreen ni več aktiven in je naprava touch device, poskusi znova pridobiti fullscreen in landscape lock. To pokrije primer, ko uporabnik nekako zapusti fullscreen (npr. swipe gesture), da se igra obnovi.

### Spremembe (ena datoteka)

- `src/components/games/GenericZaporedjaGame.tsx`:
  - Dodaj `useEffect` za `popstate` handler (cca 15 vrstic)
  - Dodaj `useEffect` za `fullscreenchange` re-acquire logiko (cca 10 vrstic)

### Ostale igre

Enak bug verjetno obstaja tudi v Spomin, Labirint itd. Zaenkrat popravimo samo Zaporedja. Pozneje lahko uporabimo isti vzorec v ostalih igrah.

