

# Problem: Dashboard kaže 6 preverjanj namesto 3

## Vzrok

`useAdminStats.ts` (vrstica 42-44) šteje **VSE** vrstice v tabeli `articulation_test_sessions` brez filtriranja:

```typescript
const { count: orgTotalCount } = await supabase
  .from('articulation_test_sessions')
  .select('*', { count: 'exact', head: true });
```

V bazi je 6 vrstic (vključno z opuščenimi praznimi sejami). Stran `/admin/all-tests` te prazne seje filtrira ven (prikaže 3), ampak dashboard tega filtra nima.

## Rešitev

Spremeniti `useAdminStats.ts` tako, da vsi štirje organizacijski števci uporabijo **enak filter** kot `/admin/all-tests`:
- Izključi seje kjer `is_completed = false` (opuščene seje)
- Ohrani samo dokončane seje (`is_completed = true`) ali seje z nestandardnim statusom

Konkretno:
- **Preverjanja (total):** `is_completed = true` namesto brez filtra
- **V čakanju:** Že pravilno filtrira (`is_completed = true`)
- **Pregledano:** Dodaj filter `is_completed = true`
- **Zaključeno:** Že pravilno (filtrira po `completed_at`)

### Datoteka za spremembo
`src/hooks/useAdminStats.ts` — dodaj `.eq('is_completed', true)` na poizvedbe za `orgTotalCount` in `orgReviewedData`.

