
Cilj: na telefonu naj video po kliku na črko vedno zapolni celoten zaslon (brez praznega prostora zgoraj/spodaj), gumb “Nazaj” na telefonu pa naj takoj vrne na prejšnjo stran.

1) Spremembe postavitve v `GenericVideoNavodila.tsx`
- Mobilni layout preklopim iz “centriranja videa” na “full-bleed” prikaz:
  - mobilno: container za video bo `w-full h-full` (brez `items-center justify-center`),
  - višina ostane vezana na `visualViewport` (prek `maxVideoHeight`), da se prilagaja mobilnemu browser UI.
- S tem video ne bo več prikazan kot “manjši element na sredini”, ampak kot glavni fullscreen content znotraj strani.

2) Spremembe prikaza videa v `VideoPlayer.tsx`
- Mobilno preklopim video iz `object-contain` na `object-cover` in ohranim `w-full h-full`.
- Mobilno odstranim zaobljene robove (`rounded-none`), da video res “od roba do roba”.
- `maxHeight` stil uporabim samo za desktop, da mobilni fullscreen ne bo umetno omejen.

3) Back gumb na telefonu (ključni del zahteve)
- Ostanemo brez auto-native-fullscreen (to je že odstranjeno), ker native fullscreen povzroči “prvi back = izhod iz fullscreen”.
- Da uporabnik ne zaide spet v native fullscreen, v `VideoControls.tsx` na mobilnem overlayu skrijem fullscreen gumb (desktop ostane nespremenjen).
- Rezultat: en pritisk na sistemski back gumb vrne na prejšnjo route (npr. seznam črk).

4) Datoteke
- `src/components/games/GenericVideoNavodila.tsx`
- `src/components/video/VideoPlayer.tsx`
- `src/components/video/VideoControls.tsx`

Tehnične podrobnosti
- Mobilni “čez cel zaslon” bo dosežen s kombinacijo:
  - fullscreen container (`fixed inset-0` + notranji `h-full`),
  - video `object-cover` (zapolni cel viewport, po potrebi obreže robove videa),
  - onemogočen mobilni vstop v native fullscreen (da back navigacija ostane pravilna).
- Sprememba vpliva na vse strani, ki uporabljajo `GenericVideoNavodila` (tudi artikulacijske video route), kar je skladno z enotnim mobilnim vedenjem.

Validacija po implementaciji
- Telefon (portrait): klik na črko → video takoj zapolni ekran brez praznih pasov.
- Telefon: sistemski back gumb enkrat → takoj na prejšnjo stran.
- Desktop: obstoječe vedenje ostane (contain prikaz + fullscreen kontrola).
