

# Popravki na strani Vizualni prikaz ustnic

## Težave
1. **Nad barvnim kvadratom** manjka napis "GLAS" / "GLASOVI" z velikimi črkami
2. **Pod barvnim kvadratom** je nepotrebno besedilo (npr. "Glas K") — odstraniti
3. **C,S,Z in Č,Š,Ž** — barvni kvadrat je premajhen, črke niso v eni vrstici — razširiti
4. **Puščice levo/desno** — bele na zelenem, slabo vidne — bela podlaga, zelena puščica
5. **Č,Š,Ž** — črke nevidne ker `app-red` **ne obstaja** v tailwind konfiguraciji (barva se ne naloži, ostane belo na belem)

## Spremembe v `src/pages/VizualniPrikazUstnic.tsx`

### 1. Besedilo na kartici
- Nad barvnim kvadratom dodaj `<p>` z besedilom `GLAS` (za eno črko) ali `GLASOVI` (za več črk), uppercase, večja pisava (`text-xl font-bold text-foreground`)
- Odstrani `<h3>` z naslovom (npr. "Glas K") in `<p>` s "Klikni za prikaz"

### 2. Barvni kvadrat za C,S,Z in Č,Š,Ž
- Za kartice z več glasovi: razširi kvadrat iz `w-24 h-24` na npr. `w-40 h-20` (ali `px-6 py-4`) da so vse črke v eni vrstici

### 3. Barva za Č,Š,Ž
- `app-red` ne obstaja v tailwind konfiguraciji — zamenjaj z `from-red-500 to-red-500/80` (ali dodaj `app-red` v config)

### 4. Puščice carousel
- `CarouselPrevious` in `CarouselNext`: zamenjaj `text-white border-white/30` z `bg-white text-dragon-green border-white hover:bg-white/90 hover:text-dragon-green`

