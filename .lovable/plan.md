

## Popravek: Neujemanje stevila "V cakanju" med nadzorno plosco in stranjo

### Problem

Nadzorna plosca (dashboard) prikazuje **7** v cakanju, stran "V cakanju" pa le **2** primera. Razlog je, da tri razlicne poizvedbe za stevilo cakajocih sej uporabljajo razlicne filtre:

| Poizvedba | Datoteka | Filtri | Rezultat |
|-----------|----------|--------|----------|
| Dashboard stat | `useAdminStats.ts` | `status = 'pending'` | **7** |
| Sidebar badge | `useAdminCounts.ts` | `status = 'pending'` + `is_completed = true` + `assigned_to IS NULL` | **2** |
| Stran "V cakanju" | `usePendingTests.ts` | `status = 'pending'` + `is_completed = true` + `assigned_to IS NULL` + source_type filter | **2** |

Dashboard ne filtrira po `is_completed` in `assigned_to`, zato steje tudi 5 nedokoncanih (se ne oddanih) sej.

### Testni podatki v bazi

V bazi obstaja testni uporabnik `a1000000-0000-0000-0000-000000000002` (NE obstaja v `auth.users`), ki ima:
- Otroka "Lana" (`7bc1b016-...`) v tabeli `children`
- 1 sejo v `articulation_test_sessions` (`0a855759-...`)

Ti podatki so ostanki testnega seedanja in jih je treba pocistiti.

### Resitev

#### 1. Popravek `useAdminStats.ts` (vrstica 47-50)

Poizvedba za `orgPendingTests` mora uporabljati enake filtre kot stran "V cakanju":

```text
// PREJ:
.eq('status', 'pending')

// POTEM:
.eq('status', 'pending')
.eq('is_completed', true)
.is('assigned_to', null)
```

To zagotovi, da se stejejo samo dejansko oddane in neprevzete seje.

#### 2. Brisanje testnih podatkov (SQL migracija)

Pocistiti podatke testnega uporabnika `a1000000-0000-0000-0000-000000000002`:

```text
-- Izbrisi seje testnega uporabnika
DELETE FROM articulation_test_sessions 
WHERE parent_id = 'a1000000-0000-0000-0000-000000000002';

-- Izbrisi otroke testnega uporabnika
DELETE FROM children 
WHERE parent_id = 'a1000000-0000-0000-0000-000000000002';

-- Izbrisi profil testnega uporabnika (ce obstaja)
DELETE FROM profiles 
WHERE id = 'a1000000-0000-0000-0000-000000000002';
```

### Datoteke za spremembo

- **`src/hooks/useAdminStats.ts`** - dodaj `.eq('is_completed', true).is('assigned_to', null)` v poizvedbo za orgPendingTests
- **Nova SQL migracija** - brisanje testnih podatkov

### Rezultat po popravku

Po popravku bo dashboard prikazoval **2** v cakanju (enako kot stran "V cakanju" in sidebar badge), testni podatki pa bodo pocisceni.
