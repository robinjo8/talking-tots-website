

# Gumb za prikaz slike ust (Kolo besed - Glas S)

## Povzetek
Desno spodaj se doda nov rdeč okrogel gumb z ikono ust (LipsIcon). Ob kliku se odpre pop-up z sliko `Glas_SZC.png` iz bucketa `slike`. Pop-up se samodejno zapre po 3 sekundah ali pa ga uporabnik zapre z gumbom "ZAPRI".

## Spremembe

### `src/components/games/GenericWheelGame.tsx`

**Dodaj nov prop:** `lipsImage?: string` - opcijski, ime slike za prikaz (npr. `"Glas_SZC.png"`)

**Dodaj stanje:**
- `showLipsImage: boolean` (privzeto `false`)
- `useEffect` z `setTimeout(3000)` ki samodejno zapre pop-up ko je odprt (s cleanup)

**Dodaj v JSX:**
1. Rdeč okrogel gumb desno spodaj (`fixed bottom-4 right-4`), enak stil kot hiška gumb ampak z rdečim gradientom (`from-red-500 to-red-600`). Ikona: `LipsIcon` (bela, w-8 h-8). Gumb se prikaže samo ko je `lipsImage` prop podan.
2. `Dialog` za prikaz slike:
   - Slika iz `https://ecmtctwovkheohqwahvt.supabase.co/storage/v1/object/public/slike/{lipsImage}`
   - Pod sliko gumb "ZAPRI" za ročno zapiranje
   - Samodejno zapiranje po 3 sekundah

### `src/components/routing/KoloSreceRouter.tsx`

**Dodaj v konfiguracijo:** posreduj `lipsImage` prop za črko "s" kot `"Glas_SZC.png"`.

Ker se `GenericWheelGame` uporablja generično, bova prop dodala v router. Za zdaj samo za "s", ostale črke bodo dodane pozneje.

### `src/components/routing/admin/AdminKoloSreceRouter.tsx`

Enako - posreduj `lipsImage` za črko "s".

### `src/data/artikulacijaVajeConfig.ts`

Dodaj opcijsko polje `lipsImage?: string` v wheel config in nastavi `"Glas_SZC.png"` za glas S.

## Vizualni stil gumba
```text
fixed bottom-4 right-4 z-50
w-16 h-16 rounded-full
bg-gradient-to-r from-red-500 to-red-600
border-2 border-white/50
shadow-lg backdrop-blur-sm
hover:scale-105 transition-transform
```

## Pop-up okno
- Dialog brez naslova, samo slika in gumb ZAPRI
- Slika prikazana v polni velikosti znotraj dialoga
- Gumb "ZAPRI" pod sliko, stil: outline variant
- Auto-close po 3 sekundah z useEffect + setTimeout
