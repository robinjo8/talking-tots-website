

# Preoblikovanje strani Vizualni prikaz ustnic

## Cilj
Stran `/govorno-jezikovne-vaje/vizualni-prikaz-ustnic` preoblikujemo po vzoru `/video-navodila/s` — scrollable stran z naslovom, rumeno črtico, breadcrumb navigacijo, ohranimo pa flip kartice, navigacijske gumbe in pikice.

## Spremembe (1 datoteka: `src/pages/VizualniPrikazUstnic.tsx`)

### 1. Layout strani
- Zamenjaj `h-screen overflow-hidden` z `min-h-screen bg-background` (scrollable stran)
- Dodaj `container max-w-4xl mx-auto pt-28 md:pt-32 pb-20 px-4` wrapper (enako kot GenericVideoNavodila)

### 2. Naslovni del (po vzoru /video-navodila/s)
- Naslov: `"Vizualni prikaz ustnic"` z `text-4xl md:text-5xl font-bold`
- Rumena črtica: `w-32 h-1 bg-app-yellow mx-auto rounded-full`
- Kratek opis pod naslovom
- Dodaj `BreadcrumbNavigation` pod naslovom

### 3. Navigacijski gumbi K, L, R, C S Z, Č Š Ž
- Ohrani obstoječe gumbe v dveh vrsticah, obdrži stil (border-2 border-foreground, active = bg-foreground text-white)
- Premakni jih pod breadcrumb, pred carousel

### 4. Carousel in flip kartice
- Ohrani celoten carousel z flip karticami (mobile + desktop), vse slike, naslove, audioUrl gumb
- Ohrani ločene mobile/desktop carousel API-je
- Ohrani navigacijske pikice pod carouselom

### 5. Floating back gumb
- Ohrani obstoječi oranžni ArrowLeft gumb levo spodaj, navigira na `/govorno-jezikovne-vaje`

