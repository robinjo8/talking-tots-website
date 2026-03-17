

# Redesign: Vizualni prikaz ustnic & Video navodila po vzoru "Kako deluje TomiTalk?"

## Referenčni dizajn
Sekcija "Kako deluje TomiTalk?" (FeaturesSection) ima:
- Zeleno ozadje (`bg-dragon-green`) z valovitimi SVG robovi
- Bele zaobljene kartice (`bg-background rounded-xl shadow-md p-6 min-h-[280px]`)
- Vsaka kartica: barvna ikona v zaobljenem kvadratu, krepek naslov, opis
- Carousel z loop, pagination dots (bele pike na zelenem ozadju), puščice na desktopu, brez na mobilni
- Autoplay s `useCarouselAutoPlay`

## Spremembe

### 1. `src/pages/VizualniPrikazUstnic.tsx` — popoln redesign

Celotna stran dobi zeleno ozadje (`bg-dragon-green`) z valovitimi SVG robovi (kopija iz FeaturesSection). Naslov "Vizualni prikaz ustnic" v beli barvi.

**Kartice (5 kartic za glasove K, L, R, C/S/Z, Č/Š/Ž):**
- Bela kartica (`bg-background rounded-xl shadow-md p-6`)
- Zgoraj: slika ustnic (namesto ikone) v zaobljenem okvirju — uporabi obstoječe slike (`Glas_K.png` itd.)
- Naslov: npr. "Glas K" (krepko)
- Spodaj: gumb "Zvočna navodila" (ohrani obstoječo logiko `audioUrl`)
- Flip-card logika se **odstrani** — slika je vedno vidna, klik ni potreben
- Carousel z loop, pagination dots (bele), puščice na desktopu
- Uporabi obstoječe komponente: `CarouselNavigation`, `CarouselPagination`

**Mobile:** `fixed inset-0 overflow-hidden` ostane, kartice se prilagodijo velikosti.
**Desktop:** `min-h-screen`, scrollable.
**Floating back gumb:** ostane.

### 2. `src/pages/VideoNavodila.tsx` — popoln redesign

Enaka struktura: zeleno ozadje, bel naslov "Video navodila", carousel z belimi karticami.

**Kartice (9 kartic za glasove S, Z, C, Š, Ž, Č, K, L, R):**
- Bela kartica z zaobljenim okvirjem
- Zgoraj: slika zmajčka (obstoječe slike iz bucketa `zmajcki`)
- Naslov: "Glas S" itd.
- Opis: obstoječi opisi
- Klik na kartico navigira na `/video-navodila/{letter}` (ohrani obstoječo logiko)
- Na desktopu: carousel prikaže 3 kartice hkrati (`lg:basis-1/3 md:basis-1/2`)
- Na mobilni: 1 kartica

**Mobile:** `fixed inset-0 overflow-hidden`, carousel z dots.
**Desktop:** `min-h-screen`.

### 3. Skupni elementi za obe strani
- Uporabi obstoječe komponente `CarouselNavigation` in `CarouselPagination` (iz features/)
- Uporabi `useCarouselAutoPlay` hook za autoplay (opcijsko, lahko brez)
- Header ostane na vrhu
- Pagination dots: bele na zelenem ozadju (enako kot na homepage)
- SVG valovi zgoraj in spodaj za vizualno konsistentnost

### Kaj se odstrani
- **VizualniPrikazUstnic:** Flip-card CSS logika, `flippedCardId` state — slike so vedno prikazane
- **VideoNavodila:** Grid layout, BreadcrumbNavigation — zamenjano s carousel
- Oboje: rumena črtica pod naslovom (zamenjana z zelenim ozadjem)

### Kaj ostane
- Vse slike (ustnic in zmajčkov)
- Vsi funkcionalni gumbi (zvočna navodila, navigacija na video stran)
- Floating back gumb na VizualniPrikazUstnic
- Navigacija na podstrani pri VideoNavodila
- Auth check pri VizualniPrikazUstnic
- Mobile no-scroll layout

