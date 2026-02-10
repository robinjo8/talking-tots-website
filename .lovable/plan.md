
## Problem

Igra **Ponovi Poved** nikoli ne poklice `onGameComplete?.()`, kar pomeni, da se v brezplacnem nacinu ta igra **nikoli ne stejte** kot odigrana. Uporabnik lahko igra Ponovi Poved neomejeno, brez da se zmanjsa stevec preostalih iger (3 na dan).

Vseh ostalih 8 iger pravilno klice `onGameComplete?.()` ob kliku na gumb "VZEMI ZVEZDICO".

## Popravek

**Datoteka:** `src/components/games/PonoviPovedGame.tsx` (vrstice 1079-1093)

V onClick handler gumba "VZEMI ZVEZDICO" je treba dodati klic `onGameComplete?.()` -- enako kot to pocnejo vse ostale igre.

Trenutno:
```typescript
onClick={async () => {
  recordExerciseCompletion(`ponovi-poved-${config.letter}`);
  await new Promise(resolve => setTimeout(resolve, 500));
  await checkForNewTrophy();
  setShowSuccessDialog(false);
}}
```

Po popravku:
```typescript
onClick={async () => {
  recordExerciseCompletion(`ponovi-poved-${config.letter}`);
  onGameComplete?.();   // <-- DODANO: stejemo igro kot odigrano
  await new Promise(resolve => setTimeout(resolve, 500));
  await checkForNewTrophy();
  setShowSuccessDialog(false);
}}
```

To je ena vrstica kode. Nobene druge datoteke niso prizadete.
