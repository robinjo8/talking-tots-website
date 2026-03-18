

# Ponovi Poved: Tablice naj uporabljajo desktop layout

## Problem
Na vrstici 266 je: `const useMobileLayout = isMobile || isTablet;`
To prisili tablice v mobilni U-obliki layout (dva stolpca gor/dol), ki je namenjen telefonom. Na tablici v ležečem načinu je dovolj prostora za pravokotni desktop layout (7 kamnov zgoraj, 7 spodaj, 2 ob strani).

## Sprememba

### `src/components/games/PonoviPovedGame.tsx`
- Vrstica 266: spremeni `const useMobileLayout = isMobile || isTablet;` v `const useMobileLayout = isTouchDevice;`
- `isTouchDevice` = touch naprava z `Math.min(width, height) < 768`, kar vključuje samo telefone, ne tablic
- Tablice bodo še vedno ohranile: fullscreen, landscape lock, portrait overlay — vse to je vezano na `isTablet`, ne na `useMobileLayout`

To je sprememba ene vrstice. Obstoječi desktop layout se bo samodejno prilagodil velikosti zaslona tablice (scale logika na vrsticah 358-408 že poskrbi za to).

