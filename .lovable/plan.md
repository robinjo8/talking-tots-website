

# Popravek: Artikulacija podstrani morajo biti prazne

## Problem
`ArtikulacijaVajeRouter.tsx` ob obisku `/govorno-jezikovne-vaje/artikulacija/r` naloži konfiguracijo iz `artikulacijaVajeConfig` in prikaže igro Kolo besed. To ni želeno — te strani morajo biti prazne (placeholder), ker jih boste urejali kasneje.

## Rešitev
Zamenjaj vsebino `ArtikulacijaVajeRouter.tsx` s preprosto placeholder stranjo, ki:
- Prikaže `<Header />`
- Pokaže naslov "Glas {displayLetter}" na sredini
- Pokaže sporočilo "Stran je v pripravi" ali podobno
- Ima gumb za nazaj na `/govorno-jezikovne-vaje/artikulacija`
- Na mobilni verziji ohrani oranžni back gumb

## Datoteka
- `src/components/routing/ArtikulacijaVajeRouter.tsx` — edina sprememba

