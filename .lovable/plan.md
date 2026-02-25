

## Popravek: Vse igre morajo biti vedno vidne v oknu brskalnika (brez scrollanja)

### Problem

Labirint deluje odlicno -- ne glede na velikost okna brskalnika se igra vedno prilagodi in je v celoti vidna. Ostale igre (Kolo besed, Bingo, Spomin, Sestavljanka) pa zahtevajo scrollanje, ker se ne prilagajajo velikosti okna.

### Zakaj Labirint deluje

Labirint uporablja `<canvas>` element in **direktno izracuna velikost celic** iz dejanske sirine in visine okna:

```text
CELL_SIZE = min(
  (window.innerWidth - padding) / steviloStolpcev,
  (window.innerHeight - padding) / steviloVrstic
)
```

Canvas se nato nastavi na tocno izracunano velikost -- nikoli ne preseze okna.

### Zakaj ostale igre NE delujejo

Ostale igre uporabljajo `transform: scale(scaleFactor)`, ki vizualno pomanjsa vsebino, a **ne spremeni njene layout velikosti**. Element se v dokumentu obnasa kot originalno velik, kar povzroci scrollbar. Poleg tega:

- **Kolo besed**: `overflow-auto` + `min-h-full` + `pb-24` = vsebina preseze okno
- **Bingo**: Bolje (`overflow-hidden`), a scale pristop je krhek
- **Spomin (desktop)**: `min-h-screen` brez omejitve = lahko preseze
- **Sestavljanka (desktop)**: `min-h-screen` v AppLayout = lahko preseze

### Resitev

Za vsako igro bom uporabil isti princip kot Labirint: **vsebina se mora fizicno prilagoditi oknu, ne samo vizualno pomanjsati**.

---

## 1) Kolo besed (GenericWheelGame.tsx) -- GLAVNI POPRAVEK

Trenutno stanje (vrstica 108):
```text
<div className="fixed inset-0 overflow-auto ...">
  <div className="min-h-full flex flex-col ... p-4 pb-24"
       style={{ transform: scale(scaleFactor), transformOrigin: center }}>
```

Popravek:
- Zamenjam `overflow-auto` z `overflow-hidden`
- Zamenjam `min-h-full` z `h-full`
- Odstranim `pb-24` (nepotrebno, ker so floating gumbi `fixed`)
- Namesto `transform: scale()` uporabim **dejansko omejevanje velikosti kolesa**:
  - Kolesu dodam dinamicno `max-width` in `max-height` na osnovi `windowSize`, da se fizicno prilega oknu
  - Formula: `wheelMaxSize = min(windowSize.width * 0.7, windowSize.height - reservedVertical)`
  - `reservedVertical` = naslov (~80px) + progress bar (~40px) + padding (~40px)
- Odstranim `scaleFactor` logiko (vrstice 56-62)

## 2) Bingo (GenericBingoGame.tsx) -- POPRAVEK

Trenutno stanje (vrstica 165-167):
```text
<div className="h-full flex flex-col ... gap-1 md:gap-2"
     style={{ transform: scale(scaleFactor), transformOrigin: center }}>
```

Popravek:
- Odstranim `transform: scale()` pristop
- BingoGrid in BingoReel morata biti omejena na dejansko velikost okna
- Dodam dinamicno `max-height` za grid glede na razpolozljivo visino okna
- BingoGrid ze uporablja fiksne velikosti -- dodam `max-height` wrapper, ki omejuje visino mreze

## 3) Spomin - Desktop (GenericSpominGame.tsx) -- POPRAVEK

Trenutno stanje (vrstica 300-310):
```text
<div className="min-h-screen">
  <div className="relative z-10 min-h-screen p-4">
```

Popravek:
- Zamenjam `min-h-screen` z `fixed inset-0 overflow-hidden`
- Notranjost uporabi `h-full flex flex-col` namesto `min-h-screen`
- MemoryGrid ze ima interno skaliranje -- samo omejem zunanji kontejner

## 4) Sestavljanka - Desktop (GenericSestavljankaGame.tsx) -- POPRAVEK

Trenutno stanje (vrstica 258-278):
```text
<AppLayout>
  <div className="w-full min-h-screen relative" ...>
    <div className="w-full flex justify-center items-center p-4 min-h-screen">
```

Popravek:
- Zamenjam `min-h-screen` z omejenim kontejnerjem, ki uposteva visino okna
- SimpleJigsaw ze interno izracuna velikost -- samo omejim wrapper na viewport

---

### Tehnicna sekcija

**Vrstni red implementacije:**
1. `GenericWheelGame.tsx` -- zamenjava scale pristopa z dejansko omejitvijo velikosti
2. `GenericBingoGame.tsx` -- zamenjava scale pristopa
3. `GenericSpominGame.tsx` -- desktop container fix
4. `GenericSestavljankaGame.tsx` -- desktop container fix

**Kljucni princip (enak kot Labirint):**
```text
razpolozljivaSirina = window.innerWidth
razpolozljivaVisina = window.innerHeight - reservedSpace
velikostVsebine = min(razpolozljivaSirina, razpolozljivaVisina)
```

Vsebina se fizicno prilega oknu, ne samo vizualno pomanjsa.

**Kaj ostane nespremenjeno:**
- Mobilni (touch) layout za vse igre -- ze deluje s fullscreen pristopom
- Labirint -- ze deluje odlicno
- Igra ujemanja -- locen popravek ze narejen
- Vsi dialogi, floating gumbi, navodila

**Datoteke za spremembo:**
- `src/components/games/GenericWheelGame.tsx`
- `src/components/games/GenericBingoGame.tsx`
- `src/components/games/GenericSpominGame.tsx`
- `src/components/games/GenericSestavljankaGame.tsx`

