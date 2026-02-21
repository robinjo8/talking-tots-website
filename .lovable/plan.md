

## Zamenjava ikone za "Jezik" z ikono ust

Ker lucide-react knjižnica nima ikone za usta (lips/mouth), bomo ustvarili lastno SVG komponento.

### Spremembe

**1. Nova datoteka: `src/components/icons/LipsIcon.tsx`**
- Ustvarimo React komponento z SVG ikono ust (lips)
- Podpira enake propse kot lucide ikone (size, className, color)

**2. `src/components/header/NavigationLinks.tsx`**
- Zamenjaj `ALargeSmall` z novo `LipsIcon` komponento za "Jezik"

**3. `src/components/header/MobileMenu.tsx`**
- Zamenjaj `ALargeSmall` z `LipsIcon` v mobilnem meniju

**4. `src/components/header/DesktopNavigation.tsx`**
- Zamenjaj `ALargeSmall` z `LipsIcon` v desktop navigaciji (ce se uporablja)

### Tehnični detajli
- SVG ikona bo oblikovana v slogu lucide ikon (outline, 24x24 viewBox, strokeWidth 2)
- Komponenta bo sprejemala `className` in `size` propse za konsistentnost z ostalimi ikonami

