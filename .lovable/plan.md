

## Plan: Album fullscreen na tablici + številke strani na desktopu

### Problem

1. **Tablica** (>=768px) dobi desktop layout z `pt-24 pb-12`, `min-h-[650px]` knjigo in scrollanjem — ni fullscreen
2. **Desktop** ima pike (dots) za navigacijo namesto uporabnega "1/30" page pickerja kot na mobilni verziji

### Spremembe

**1. `src/pages/Album.tsx`** — tablet fullscreen

Dodaj `useIsTablet` logiko (768px-1024px) ali pa poenostavi: Album vedno uporabi fullscreen layout (fixed inset-0) na vseh napravah pod ~1024px. Na desktopu (>=1024px) ohrani knjižni prikaz, ampak brez scrollanja.

Konkretno:
- Na tablici: uporabi enak `fixed inset-0 overflow-hidden` wrapper kot na mobilni verziji, z enakima gumboma (nazaj, ?) na dnu
- Razlika od mobilnega: ne prikaži `LandscapeOverlay` na tablici (ni potreben)

**2. `src/components/album/AlbumBook.tsx`** — page picker povsod

**Desktop del (vrstica 238-266)**:
- Zamenjaj pike (dots) navigacijo s klikljivim "1/30" page pickerjem (enak kot na mobilni verziji vrstica 154-161)
- Dodaj enak `Dialog` za izbiro strani kot na mobilni verziji (vrstica 164-191)
- Ohrani levo/desno puščici za navigacijo

**3. Tablet zaznavanja**

Dodam `useIsTablet` ali razširim Album.tsx z dodatnim pogojem:
- `isMobile` (< 768px): fullscreen, portrait, LandscapeOverlay
- `isTablet` (768px - 1023px): fullscreen, brez LandscapeOverlay, knjižni prikaz prilagojen na viewport
- Desktop (>= 1024px): obstoječi knjižni layout z page pickerjem namesto pik

### Obseg
- 2 datoteki: `Album.tsx`, `AlbumBook.tsx`
- ~30 vrstic spremenjenih/dodanih
- Brez novih komponent ali routov

