

# Spremembe na strani Artikulacija (Moji prvi glasovi)

## 1. Preimenovanje naslova
V `src/pages/ArtikulacijaVaje.tsx` zamenjam "Artikulacija" z "Moji prvi glasovi".

## 2. Preoblikovanje ArtikulacijaVajeRouter v video stran
V `src/components/routing/ArtikulacijaVajeRouter.tsx` namesto placeholder strani prikažem video predvajalnik z enakim dizajnom kot `GenericVideoNavodila`:
- Zeleno ozadje (`bg-dragon-green`)
- Bel naslov "Glas {letter}"
- Bela kartica z video predvajalnikom (VideoPlayer, VideoProgressBar, VideoControls)
- Oranžni gumb za nazaj, ki vodi na `/govorno-jezikovne-vaje/artikulacija`

Ponovno uporabim obstoječe komponente: `GenericVideoNavodila` ali neposredno `VideoPlayer`, `VideoProgressBar`, `VideoControls` in `useVideoPlayer`.

Najpreprosteje: uporabim kar `GenericVideoNavodila` komponento z dodanim prop-om za `backPath`, da gumb za nazaj vodi na pravilno stran (namesto `/video-navodila`).

## 3. Video URL-ji
Bucket `video`, base URL: `https://ecmtctwovkheohqwahvt.supabase.co/storage/v1/object/public/video/`

Mapiranje:
- c → `Glas_C.mp4`
- ch → `Glas_CH.mp4`
- r → `Glas_R.mp4`
- l → `Glas_L.mp4`
- k → `Glas_K.mp4`
- s → `Glas_S.mp4`
- sh → `Glas_SH.mp4`
- z → `Glas_Z.mp4`
- zh → `Glas_ZH.mp4`

## 4. Prilagoditev GenericVideoNavodila
Dodam opcijski prop `backPath` (default: `/video-navodila`), da lahko ArtikulacijaVajeRouter uporabi isto komponento z drugačno potjo za nazaj.

## Datoteke za spremembo
1. `src/pages/ArtikulacijaVaje.tsx` — naslov "Artikulacija" → "Moji prvi glasovi"
2. `src/components/games/GenericVideoNavodila.tsx` — dodam opcijski `backPath` prop
3. `src/components/routing/ArtikulacijaVajeRouter.tsx` — zamenjam placeholder z GenericVideoNavodila + video konfiguracija

