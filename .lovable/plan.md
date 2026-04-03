
Plan: Uskladim /album z fullscreen principom igre Labirint tudi na desktopu

Problem
- `Album.tsx` ima za desktop še vedno “navaden” page layout (`min-h-screen pt-24 pb-12`), zato lahko stran raste po vsebini in povzroča vertikalni scroll.
- `AlbumBook.tsx` v desktop načinu še vedno uporablja `min-h-[650px]`, navigacija `1/15` pa je pod knjigo, zato na nižjih zaslonih pade izven vidnega dela.
- Oranžen gumb za nazaj obstaja samo v fullscreen mobilni/tablični veji.

Popravki

1. `src/pages/Album.tsx`
- Tudi desktop preklopim na enak fullscreen shell kot tablica: `fixed inset-0 overflow-hidden`.
- `LandscapeOverlay` ostane samo za telefon.
- Oranžen gumb za nazaj dodam tudi na desktop, enako kot na tablici/mobilu.
- `?` gumb ostane fiksen spodaj desno na vseh napravah.

2. `src/components/album/AlbumBook.tsx`
- Desktop layout preuredim iz “naravne višine” v pravo fullscreen postavitev z `visualViewport`, enako kot pri Labirintu.
- Odstranim odvisnost od `min-h-[650px]`.
- Izračunam dejansko razpoložljivo višino za knjigo:
  - minus spodnja navigacija `1/15`
  - minus prostor za spodnja fiksna gumba
- Knjiga dobi eksplicitno višino in `overflow-hidden`, da nič več ne potisne strani navzdol.
- Desktop ohrani dvojno stran, mobilni enojno stran, tablica ostane kot zdaj.
- “Compact” način razširim tudi na nizke desktop/tablične višine, ne samo na tablet landscape.

3. `src/components/album/AlbumPage.tsx`
- Dodam kompaktnejši layout za omejeno višino:
  - manj paddinga
  - nekoliko manjši sticker sloti / bolj tesne pozicije
- Številka strani na posamezni strani ostane znotraj vidnega dela knjige.

4. `src/components/album/AlbumWorldCover.tsx`
- Compact stil uporabim tudi pri nizkih viewportih na desktopu, da naslovne strani svetov ne povzročajo overflowa.

Rezultat
- `/album` bo na tablici v ležečem položaju in na desktopu deloval po istem principu kot Labirint: full screen, brez scrollanja gor/dol.
- `1/15` in puščice bodo vedno vidni.
- Oranžen gumb za nazaj bo tudi na desktop verziji.

Obseg
- `src/pages/Album.tsx`
- `src/components/album/AlbumBook.tsx`
- `src/components/album/AlbumPage.tsx`
- `src/components/album/AlbumWorldCover.tsx`
