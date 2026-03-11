

# Popravek: Gumb "Prenesi aplikacijo" se ne prikaže na Android tablicah in modernih iPadih

## Problem

Dva ločena problema:

### 1. Android tablica: ni fallbacka brez `beforeinstallprompt`
`canInstall` logika (vrstica 181 v `usePWA.tsx`):
```typescript
return isInstallable || isIOSDevice;
```
Za Android naprave `canInstall` zahteva `isInstallable`, ki je `true` samo če brskalnik sproži event `beforeinstallprompt`. Če ta event ne sproži (npr. uporabnik je že zavrnila prompt, brskalnik ne izpolnjuje pogojev, ali je to Samsung Internet browser), je `canInstall = false` in gumb se sploh ne prikaže. Za iOS obstaja fallback (`isIOSDevice`), za Android pa ne.

### 2. Moderni iPadi (iPadOS 13+): napačna zaznava
Moderni iPadi se v user agent stringu javljajo kot `MacIntel` brez besede "iPad". Zato:
- `isIOSDevice` v `usePWA.tsx` je `false`
- `isMobile` v `ManualInstallButton.tsx` je `false`
- Gumb se ne prikaže

## Rešitev

### `src/hooks/usePWA.tsx`
1. Dodaj zaznavo modernih iPadov:
   ```typescript
   const isModernIPad = navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1;
   const isIOSDevice = /iPad|iPhone|iPod/.test(navigator.userAgent) || isModernIPad;
   ```
2. Dodaj novo stanje `isTablet` za Android tablete:
   ```typescript
   const isTablet = (isAndroidDevice && Math.min(screen.width, screen.height) >= 600) || isModernIPad;
   ```
3. Posodobi `canInstall` da vključi Android naprave kot fallback (za prikaz ročnih navodil):
   ```typescript
   return isInstallable || isIOSDevice || isAndroidDevice;
   ```

### `src/components/pwa/ManualInstallButton.tsx`
1. Posodobi `isMobile` da vključi moderne iPade:
   ```typescript
   const isModernIPad = navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1;
   const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) || isModernIPad;
   ```
2. V `handleInstallClick`: za Android brez nativnega prompta (`isAndroidDevice && !isInstallable`) prikaži ročna navodila (obstoječi modal z navodili za meni → "Namesti aplikacijo") namesto da ne naredi nič.

## Datoteke za spremembo
- `src/hooks/usePWA.tsx` — zaznava iPadov, `canInstall` vključi Android fallback
- `src/components/pwa/ManualInstallButton.tsx` — zaznava iPadov v `isMobile`, Android fallback na ročna navodila

