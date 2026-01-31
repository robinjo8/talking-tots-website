
# Plan: Popravek vrstnega reda zvezdice in pokala

## Opis problema

Ko ima uporabnik 399 zvezdic in konča sestavljanko:
1. Prikaže se dialog "ODLIČNO!" za ponovitev besed
2. Ko izgovori vse 4 besede, se avtomatsko odpre "BRAVO!" dialog
3. **NAPAKA:** Še preden uporabnik klikne "VZEMI ZVEZDICO", se že sproži `checkForNewTrophy()` 
4. To povzroči, da se pokal prikaže NAD dialogom "BRAVO!" in uporabnik ne more vzeti zvezdice

## Vzrok napake

V datoteki `src/components/puzzle/PuzzleSuccessDialog.tsx` (vrstice 42-51):

```tsx
// Auto-transition to BRAVO dialog when all recordings complete
useEffect(() => {
  if (displayImages.length > 0 && completedRecordings.size === displayImages.length && !hasAutoTransitionedRef.current) {
    hasAutoTransitionedRef.current = true;
    setTimeout(() => {
      setShowBravoDialog(true);
      onStarClaimed?.();  // ❌ NAPAKA: Kliče se TUKAJ namesto ob kliku gumba
    }, 500);
  }
}, ...);
```

`onStarClaimed()` se kliče takoj ko se prikaže BRAVO dialog, namesto ko uporabnik dejansko klikne gumb "VZEMI ZVEZDICO".

## Primerjava s pravilno implementacijo

V `MatchingCompletionDialog.tsx` je pravilno implementirano:

```tsx
// Prehod v BRAVO dialog - NE kliče onStarClaimed
setTimeout(() => {
  setShowBravoDialog(true);
  // NOTE: onStarClaimed is called when user clicks "VZEMI ZVEZDICO" button, not here
}, 500);

// Klik na gumb - TUKAJ se kliče onStarClaimed
const handleBravoClose = () => {
  setShowBravoDialog(false);
  onStarClaimed?.(); // ✅ PRAVILNO: Kliče se ob kliku gumba
  onClose();
};
```

## Tehnična sprememba

### Datoteka: `src/components/puzzle/PuzzleSuccessDialog.tsx`

**1. Odstrani `onStarClaimed` iz useEffect (vrstice 42-51):**

```tsx
// Auto-transition to BRAVO dialog when all recordings complete
useEffect(() => {
  if (displayImages.length > 0 && completedRecordings.size === displayImages.length && !hasAutoTransitionedRef.current) {
    hasAutoTransitionedRef.current = true;
    setTimeout(() => {
      setShowBravoDialog(true);
      // NE kliči onStarClaimed tukaj - kliče se ob kliku gumba
    }, 500);
  }
}, [completedRecordings.size, displayImages.length]); // Odstrani onStarClaimed iz dependencies
```

**2. Dodaj `onStarClaimed` v `handleBravoClose` (vrstice 142-146):**

```tsx
const handleBravoClose = () => {
  setShowBravoDialog(false);
  setStarClaimed(true);
  onStarClaimed?.();  // DODANO: Kliče se ob kliku gumba
  onOpenChange(false);
};
```

## Diagram pravilnega toka

```text
PRED POPRAVKOM (napačno):
┌──────────────────┐     ┌──────────────────┐     ┌──────────────────┐
│  4 besede        │────►│  BRAVO dialog    │────►│  POKAL dialog    │
│  izgovorjene     │     │  + onStarClaimed │     │  (prekrije BRAVO)│
└──────────────────┘     │  + checkTrophy   │     └──────────────────┘
                         └──────────────────┘

PO POPRAVKU (pravilno):
┌──────────────────┐     ┌──────────────────┐     ┌──────────────────┐     ┌──────────────────┐
│  4 besede        │────►│  BRAVO dialog    │────►│  Klik VZEMI      │────►│  POKAL dialog    │
│  izgovorjene     │     │  (samo prikaz)   │     │  ZVEZDICO        │     │  (pravilno)      │
└──────────────────┘     └──────────────────┘     │  + onStarClaimed │     └──────────────────┘
                                                  │  + checkTrophy   │
                                                  └──────────────────┘
```

## Prizadete igre

Ta popravek vpliva na vse igre, ki uporabljajo `PuzzleSuccessDialog`:
- Sestavljanke (vse črke in starostne skupine)
- Labirint (vse črke in starostne skupine)

Druge igre (Zaporedja, Drsna sestavljanka, Igra ujemanja) uporabljajo `MatchingCompletionDialog`, ki je že pravilno implementiran.

## Testiranje

Po implementaciji:
1. Nastavi zvezdice na 99 (ali 199, 299...)
2. Odigraj Sestavljanko do konca
3. Izgovori vse 4 besede
4. Preveri, da se prikaže BRAVO dialog z gumbom "VZEMI ZVEZDICO"
5. Šele po kliku na gumb naj se prikaže pokal dialog
