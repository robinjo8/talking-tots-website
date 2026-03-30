

## Plan: Popravi prikaz sej na admin straneh

### Problemi

1. **AdminUserDetail** (Podrobnosti uporabnika) — prikaže seje iz **storage map** (`Preverjanje-izgovorjave/Seja-1`, `Seja-2`, itd.). V storage so ostale mape od prejšnjih simulacij (5 map namesto 3), ena mapa ima 100 datotek. To je problem odvečnih storage podatkov.

2. **AdminSessionReview** (Pregled preverjanja) — na vrstici 400 je **hardcodirano** `[1, 2, 3, 4, 5]`:
   ```ts
   (isAdditionalTest ? [1] : [1, 2, 3, 4, 5]).map(sessionNum => {
   ```
   To vedno prikaže 5 sej ne glede na dejansko stanje v bazi. Pravilno bi moralo biti **dinamično** glede na dejansko število sej v bazi + morda 1 predvidena naslednja seja.

### Popravki

**1. `src/pages/admin/AdminSessionReview.tsx` (vrstica 400)**

Zamenjaj hardcodirano `[1, 2, 3, 4, 5]` z dinamičnim seznamom na podlagi `actualSessionDates` (ki že vsebuje dejanske seje iz baze). Prikaži samo seje, ki obstajajo v bazi:

```ts
// Dinamičen seznam sej iz baze
const sessionNumbers = Array.from(actualSessionDates.keys()).sort((a, b) => a - b);
// Če ni podatkov, prikaži vsaj sejo 1 (trenutno odprto)
const displaySessions = sessionNumbers.length > 0 ? sessionNumbers : [1];

// ...
{(isAdditionalTest ? [1] : displaySessions).map(sessionNum => {
```

S tem bo prikazalo le seje, ki dejansko obstajajo (3 za Testni otrok).

**2. `src/pages/admin/AdminUserDetail.tsx` — ni potrebne spremembe kode**

Prikaz sej je pravilen (bere iz storage). Problem je v **odvečnih storage mapah** od prejšnjih simulacij. Potrebno je počistiti storage.

**3. Storage čiščenje — `Seja-4` in `Seja-5` mape**

Izbriši odvečne storage mape za Testni otrok:
- `2a5e4550-413a-4f46-893a-c94b1eaa9215/fd0dbb8a-3ee6-4414-9af9-688bf0534c6a/Preverjanje-izgovorjave/Seja-4/` (100 datotek)
- `2a5e4550-413a-4f46-893a-c94b1eaa9215/fd0dbb8a-3ee6-4414-9af9-688bf0534c6a/Preverjanje-izgovorjave/Seja-5/` (60 datotek)

To zahteva edge function ali ročno brisanje v Supabase Storage dashboardu.

**4. Posodobi `simulate-articulation-test` edge function**

Preveri ali `Ponastavi celoten cikel` že čisti storage mape. Če ne, dodaj čiščenje da se odvečne mape ne nabirajo.

### Obseg
- `src/pages/admin/AdminSessionReview.tsx` — ~5 vrstic spremenjenih (dinamičen seznam sej)
- Storage čiščenje za Testni otrok (Seja-4, Seja-5 mapi)
- Preveri reset logiko v edge function

