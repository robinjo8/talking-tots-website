

# Preoblikovanje mobilne verzije strani Vizualni prikaz ustnic

## Trenutno stanje
Kartica zavzema skoraj celoten zaslon (`calc(100vh - 210px)`), na sprednjem delu prikaže samo barvni kvadrat s črko. Uporabnik mora swipati med karticami ali klikniti na pike.

## Spremembe (samo mobilna verzija)

### 1. Gumbi za hitro navigacijo med glasovi
Pod naslov "Vizualni prikaz ustnic" dodam vrstico gumbov:
- **K** | **L** | **R** | **C S Z** | **Č Š Ž**
- Vsak gumb ob kliku scrollne carousel na ustrezno kartico (`carouselApi.scrollTo(index)`)
- Aktivni gumb (trenutni slide) ima polno belo ozadje, ostali so `white/20` s white tekstom
- Gumbi so zaobljeni (`rounded-full`), v eni vrstici z `flex-wrap gap-2 justify-center`

### 2. Manjše kartice z naslovom in gumbom
Namesto `minHeight: calc(100vh - 210px)` uporabim avtomatsko višino. Kartica na mobilni verziji vsebuje:
- Barvni kvadrat s črko (manjši)
- Napis pod njim (npr. "Glas K" ali "Glasovi C, S, Z")
- Gumb **"PRIKAŽI SLIKO"** ki obrne kartico (namesto klika na celo kartico)

Zadnja stran ostane enaka — slika + zvočni gumb.

### 3. Odstranitev pagination dots na mobilni verziji
Pike niso več potrebne, ker imamo gumbe za navigacijo zgoraj.

### Datoteka
Samo `src/pages/VizualniPrikazUstnic.tsx`

Desktop ostane nespremenjen.

