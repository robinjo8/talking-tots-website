

## Plan: Dodaj LipsImageButton v fullscreen (mobilni/tablični) prikaz iger

### Problem

5 iger ima ločen fullscreen layout za mobilne/tablične naprave in desktop layout. `LipsImageButton` je dodan **samo v desktop blok**, zato na telefonu in tablici ni viden.

### Prizadete igre

| Igra | Datoteka | Fullscreen blok (vrstice) | LipsButton samo v desktop (vrstica) |
|------|----------|--------------------------|--------------------------------------|
| Spomin | GenericSpominGame.tsx | 198-339 | 490 |
| Labirint | GenericLabirintGame.tsx | 261-? | 403 |
| Zaporedja | GenericZaporedjaGame.tsx | 312-? | 516 |
| Sestavljanka | GenericSestavljankaGame.tsx | 212-? | 308 |
| Poveži pare | GenericPoveziPareGame.tsx | 255-? | 371 |

Ostale igre (Kolo besed, Bingo, Drsna sestavljanka, Igra ujemanja, Met kocke) nimajo ločenega fullscreen bloka — uporabljajo en layout za vse naprave, zato LipsImageButton tam deluje pravilno.

### Popravek

V vsakem od 5 fullscreen blokov dodaj `LipsImageButton` tik pred zapiralnim `</div>` fullscreen return bloka — enako kodo kot je v desktop bloku:

```tsx
{(() => {
  const lipsImage = getLipsImageForLetter(config.displayLetter); // ali config.letter
  return lipsImage ? <LipsImageButton lipsImage={lipsImage} /> : null;
})()}
```

Gumb je `fixed bottom-4 right-4 z-50`, torej bo pravilno pozicioniran ne glede na layout.

### Obseg
- 5 datotek, vsaka dobi ~3 vrstice dodane v fullscreen blok
- Brez sprememb logike, stilov ali obstoječega delovanja
- Desktop prikaz ostane nespremenjen

