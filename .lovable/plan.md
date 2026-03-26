

## Plan: Zakleni GOVORNE VAJE za brezplačne uporabnike

### Problem
Stran GOVORNE VAJE (`/govorno-jezikovne-vaje`) in vse njene podstrani (Vaje motorike govoril, Moji prvi glasovi, Vizualni prikaz ustnic) so trenutno dostopne vsem prijavljenim uporabnikom — tudi brezplačnim. Potrebno jih je zakleniti, da so dostopne samo uporabnikom z aktivno naročnino (Start ali Pro).

### Spremembe

**1. `src/pages/GovornojezicovneVaje.tsx`**
Ovij vsebino z `<SubscriptionGate>`, da brezplačni uporabniki vidijo poziv za nakup naročnine.

**2. `src/pages/VajeMotorikeGovoril.tsx`**
Dodaj `<SubscriptionGate>` ovoj (za primer direktnega dostopa prek URL-ja).

**3. `src/pages/ArtikulacijaVaje.tsx`**
Dodaj `<SubscriptionGate>` ovoj.

**4. `src/pages/VizualniPrikazUstnic.tsx`**
Dodaj `<SubscriptionGate>` ovoj.

**5. `src/pages/VajeZaJezik.tsx`**
Dodaj `<SubscriptionGate>` ovoj.

**6. `src/components/ActivityOptions.tsx`**
Dodaj `'exercises'` v `PRO_ONLY_ACTIVITIES` array (vrstica 12), da se na kartici prikaže ključavnica za brezplačne uporabnike:
```
const PRO_ONLY_ACTIVITIES = ['test', 'challenges', 'exercises'];
```

**Opomba:** PRO_ONLY tu pomeni "zahteva naročnino" (Start ali Pro), ne samo Pro. Trenutna logika preverja `isPro` (`planId === 'pro'`), kar bi zaklenilo tudi Start uporabnike. Zato moram spremeniti logiko na vrstici 75 iz `isPro` na `!isSubscribed` za `exercises`, ali pa preimenovati preverjanje. Preverim natančno logiko v `ActivityOptions` in zagotovim, da Start uporabniki IMAJO dostop.

**7. Posodobitev dokumentacije**
Popravim `tomitalk_lifecycle_opis.md`:
- Stopnja 2 (brezplačen): odstranim "GOVORNE VAJE" iz dostopnih funkcionalnosti
- Stopnja 3 (Start): dodam "GOVORNE VAJE"

### Obseg
- 6 datotek spremenjenih
- 1 dokument posodobljen

