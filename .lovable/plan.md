

## Plan: Dodaj stolpec "Seja" na stran V čakanju + poenoti širine stolpcev

### Spremembe

**1. `src/hooks/usePendingTests.ts`** — dodaj `session_number` v query in interface

- Dodaj `session_number` v SELECT poizvedbo (vrstica 43)
- Dodaj `session_number: number` v interface `PendingTestSession`
- Mapiraj `session_number` v rezultat

**2. `src/pages/admin/AdminPending.tsx`** — dodaj stolpec "Seja" + poenoti širine

- Dodaj `<TableHead>Seja</TableHead>` med "Datum oddaje" in "Dejanje"
- Dodaj `<TableCell>` ki prikaže `session.session_number` (npr. "1", "2")
- Nastavi enakomerene širine stolpcev z uporabo `className="w-[...]"` ali `table-fixed` za enakomerno razporeditev:
  - Uporabnik, Otrok, Datum oddaje: večji stolpci
  - Starost, Spol, Seja: manjši stolpci
  - Dejanje: fiksna širina za gumb
- Dodaj "Seja" info tudi v mobilno kartico (`PendingCard`)

**3. Preveri ostale admin tabele** za konsistentnost širine stolpcev:
- `AdminTests.tsx` — že ima "Seje" stolpec, preveri razmerja
- `AdminMyReviews.tsx` — preveri razmerja
- `AdminUsers.tsx` — preveri razmerja

### Obseg
- `usePendingTests.ts` — 3 vrstice dodane/spremenjene
- `AdminPending.tsx` — ~10 vrstic spremenjenih (stolpec + širine)
- Ostale datoteke: le popravek širine stolpcev če je nesorazmerno

