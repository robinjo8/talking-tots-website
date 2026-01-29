
# Načrt za popravek igre Igra Ujemanja

## Problem
Pri igri `/govorne-igre/igra-ujemanja/c` se pojavi veliko zeleno polje in uporabnik ne more izbrati vseh slik.

## Vzrok napake
V komponenti `ImageTile.tsx` manjka `relative` pozicioniranje na glavnem elementu. Ko je slika označena kot "matched" (ujemanje najdeno), se prikaže zelena prekrivna plast z `absolute inset-0` stilom. Problem je, da ta absolutna pozicionirana plast potrebuje starševski element z `relative` pozicioniranjem, da ostane omejena znotraj kartice slike.

Brez `relative` na starševskem elementu se zelena prekrivna plast raztegne na prvi nadrejeni element z `relative` pozicioniranjem - v tem primeru na celotno igralno območje, kar ustvari "veliko zeleno polje" in blokira klikanje na druge slike.

## Rešitev
Dodati `relative` v className glavnega div elementa v komponenti `ImageTile.tsx`.

### Spremembe v datoteki

**src/components/matching/ImageTile.tsx** (vrstica 20-22):

Trenutna koda:
```tsx
<div
  onClick={onClick}
  className={cn(
    "flex items-center justify-center border-2 rounded-xl cursor-pointer transition-all duration-200 hover:scale-105 overflow-hidden bg-white shadow-md",
```

Nova koda:
```tsx
<div
  onClick={onClick}
  className={cn(
    "relative flex items-center justify-center border-2 rounded-xl cursor-pointer transition-all duration-200 hover:scale-105 overflow-hidden bg-white shadow-md",
```

## Tehnični povzetek
- **Napaka**: Absolutno pozicionirane prekrivne plasti (overlay) za stanje "matched" in "selected" niso pravilno omejene
- **Rešitev**: Ena vrstica spremembe - dodajanje `relative` v className
- **Prizadete komponente**: Vse igre tipa "Igra ujemanja" za vse starostne skupine (3-4, 5-6, 7-8, 9-10) in vse črke (C, Č, K, L, R, S, Š, Z, Ž)

## Pričakovani rezultat
Po popravku:
- Zelena kljukica in prekrivna plast bosta omejena samo na posamezno kartico slike
- Uporabnik bo lahko kliknil na vse slike v igri
- Igra bo normalno delovala do zaključka
