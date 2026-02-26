

# Popravek gumba "Prenesi aplikacijo" - enoten, zanesljiv PWA install

## Trenutni problemi

1. **Gumb se prikaze SAMO na domaci strani** (`/`) -- nikjer drugje ga ni videti
2. **Na Android**: ce `beforeinstallprompt` event ni na voljo (ze porabljen ali brskalnik ga ne podpira), gumb prikaze navodila namesto dejanske namestitve
3. **Na iOS**: gumb prikaze navodila, HKRATI pa obstaja se locen `IOSInstallBanner` ki dela isto -- podvojeno
4. **V Header-ju** obstaja TRETJA install logika -- zmeda
5. **Po zavrnitvi**: gumb se se vedno prikaze ceprav `canInstall` ni vec true

## Resitev: en enoten gumb, ki dela pravilno

### 1. Poenostavi `ManualInstallButton.tsx`
- Odstrani omejitev `isHomepage` -- gumb naj bo viden na vseh straneh (razen v igrah in ko je ze namescena)
- **Android z `beforeinstallprompt`**: ob kliku neposredno poklici `promptInstall()` -- nativni Chrome dialog
- **Android BREZ `beforeinstallprompt`**: prikazi navodila za rocno namestitev (meni > Namesti)
- **iOS Safari**: prikazi navodila (Share > Add to Home Screen)
- **iOS NE-Safari** (Chrome, Firefox na iOS): prikazi sporocilo da mora odpreti Safari
- Dodaj preverjanje `canInstall` in dismiss logiko da se gumb ne prikaze 7 dni po zavrnitvi

### 2. Odstrani podvojene komponente
- **Odstrani `IOSInstallBanner.tsx`** -- njeno funkcionalnost prevzame enoten gumb
- **Odstrani `InstallPrompt.tsx`** -- ni v uporabi (ni v PWAProvider), samo mrtva koda
- **Odstrani `DesktopInstallBanner`** iz `InstallPrompt.tsx` -- ni v uporabi
- Posodobi `PWAProvider.tsx` da ne uvaza vec IOSInstallBanner

### 3. Pocisti Header install logiko
- Odstrani `canInstall`, `promptInstall`, `isIOSDevice`, `isStandalone`, `isInstalled` iz Header-ja
- Odstrani `showInstall` spremenljivko in `handleInstallClick` -- vse je zdaj v enotnem gumbu

### 4. Izboljsaj `usePWA` hook
- Dodaj `isDismissed` stanje za boljse sledenje zavrnjenim pozivom
- Podaljsaj dismiss trajanje s 3 na 7 dni
- Dodaj `isIOSNonSafari` zastavico za prikaz sporocila iOS uporabnikom v Chrome/Firefox

## Datoteke za urejanje

1. **`src/components/pwa/ManualInstallButton.tsx`** -- prepiši:
   - Odstrani `isHomepage` omejitev, ohrani `isGamePage` in `isInstalled` preverjanja
   - Loci logiko: Android nativni install vs Android navodila vs iOS Safari navodila vs iOS ne-Safari sporocilo
   - Dodaj dismiss gumb (X) na floating button za 7-dnevno skritje
   - Dodaj preverjanje localStorage dismiss datuma

2. **`src/components/pwa/PWAProvider.tsx`** -- odstrani IOSInstallBanner uvoz in uporabo

3. **`src/components/pwa/IOSInstallBanner.tsx`** -- IZBRISI datoteko (podvojeno)

4. **`src/components/pwa/InstallPrompt.tsx`** -- IZBRISI datoteko (neuporabljena)

5. **`src/components/Header.tsx`** -- odstrani PWA install logiko (usePWA uvoz, showInstall, handleInstallClick)

6. **`src/hooks/usePWA.tsx`** -- dodaj `isIOSNonSafari` zastavico; podaljsaj dismiss na 7 dni

## Logika odlocanja ob kliku gumba

```text
Uporabnik klikne "Prenesi aplikacijo"
  |
  +-- Android + beforeinstallprompt na voljo?
  |     DA --> poklici promptInstall() --> nativni Chrome dialog
  |     NE --> prikazi navodila (meni > Namesti aplikacijo)
  |
  +-- iOS + Safari?
  |     DA --> prikazi navodila (Share > Dodaj na zacetni zaslon)
  |
  +-- iOS + NE Safari (Chrome/Firefox)?
        DA --> prikazi sporocilo "Odpri v Safari za namestitev"
```

## Vidnost gumba

```text
Prikazi gumb CE:
  - NI namescena (isInstalled = false, isStandalone = false)
  - NI v igri (ne vsebuje /govorne-igre/)
  - JE mobilna naprava
  - NI bila zavrnjena v zadnjih 7 dneh
  - NI desktop

Skrij gumb CE:
  - Ze namescena
  - V igri
  - Desktop
  - Zavrnjena pred manj kot 7 dnevi
```

