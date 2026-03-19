

## Prilagojene PWA navodila za vse brskalnike in naprave

### Kontekst
Imaš prav — forsiranje Chroma ni ustrezno (konkurenčna zakonodaja, DMA). PWA namestitev deluje v večini modernih brskalnikov, le koraki so različni. Namesto priporočanja Chroma bomo prikazali **navodila prilagojena brskalniku, ki ga uporabnik dejansko uporablja**.

### Trenutno stanje
- **Android + Chrome z nativnim pozivom**: Deluje pravilno (samodejni prompt)
- **Android brez nativnega poziva**: Generična navodila ("tri pike zgoraj desno") — ne ustrezajo vsem brskalnikom
- **iOS Safari**: Pravilna navodila (Share → Dodaj na začetni zaslon)
- **iOS ne-Safari**: Pravilno preusmeri na Safari
- **Huawei Browser, Samsung Internet, Firefox, Opera, Edge**: Dobijo ista generična Android navodila, ki morda ne ustrezajo

### Plan sprememb

**Datoteka: `src/components/pwa/ManualInstallButton.tsx`**

1. **Zaznava brskalnika** — dodati detekcijo za Samsung Internet, Huawei Browser, Firefox, Opera, Edge (poleg obstoječega Chrome/Safari):
   ```
   isSamsungBrowser, isHuaweiBrowser, isFirefox, isOpera, isEdge
   ```

2. **Prilagojeni koraki glede na brskalnik** — v Android manual instructions modalu zamenjati fiksna navodila z dinamičnimi:

   | Brskalnik | Korak 1 | Korak 2 |
   |---|---|---|
   | Chrome | Tri pike ⋮ zgoraj desno | "Namesti aplikacijo" ali "Dodaj na začetni zaslon" |
   | Samsung Internet | Meni ☰ spodaj desno | "Dodaj stran na" → "Začetni zaslon" |
   | Huawei Browser | Tri pike ⋮ spodaj | "Dodaj na začetni zaslon" |
   | Firefox | Tri pike ⋮ spodaj desno | "Namesti" ali "Dodaj na začetni zaslon" |
   | Opera | Tri pike ⋮ spodaj desno | "Začetni zaslon" |
   | Edge | Tri pike ··· spodaj | "Dodaj na telefon" |
   | Ostali | Odpri meni brskalnika | "Dodaj na začetni zaslon" |

3. **Podnaslov modala** — namesto fiksnega "Navodila za Android" prikazati ime brskalnika: "Navodila za Chrome", "Navodila za Samsung Internet" ipd.

4. **Dodatna pomoč** — pod koraki dodati majhno besedilo:
   > "Če te možnosti ne najdeš, poišči v meniju brskalnika možnost 'Dodaj na začetni zaslon' ali 'Namesti aplikacijo'."

**Datoteka: `src/hooks/usePWA.tsx`** — brez sprememb, detekcija OS ostane enaka.

### Obseg
Ena datoteka: `src/components/pwa/ManualInstallButton.tsx` — dodati detekcijo brskalnika in prilagoditi navodila v modalu.

