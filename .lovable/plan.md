

## Zamenjava ikon v navigaciji

### Spremembe ikon

| Gumb | Trenutna ikona | Nova ikona |
|------|---------------|------------|
| Poslušanje | `Bell` (zvonček) | `Ear` (uho) |
| Govor | `Activity` (graf) | `Speech` (govoreča glava) |
| Jezik | `BookOpen` (knjiga) | `Languages` (jeziki) |
| Nastavitve | `User` (oseba) | `Settings` (zobnik) |

### Datoteke, ki se spremenijo

**1. `src/components/header/NavigationLinks.tsx`**
- Zamenjaj `Bell` z `Ear` za Poslušanje
- Zamenjaj `Activity` z `Speech` za Govor
- Zamenjaj `BookOpen` z `Languages` za Jezik

**2. `src/components/header/MobileMenu.tsx`**
- Zamenjaj `Bell` z `Ear` (vrstica 186)
- Zamenjaj `Activity` z `Speech` (vrstica 196)
- Zamenjaj `BookOpen` z `Languages` (vrstica 206)
- Zamenjaj `User` z `Settings` za gumb Nastavitve (vrstica 227)
- Posodobi import stavek

Vse ikone so del lucide-react knjiznice, zato ni potrebno namescati dodatnih paketov.

