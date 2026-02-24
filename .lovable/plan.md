

## Popravek: Status "Ni opravljeno" za nedokoncane teste na /admin/all-tests

### Problem

Ko logoped doda otroka, se ustvari seja (`articulation_test_sessions`) s `status: 'pending'` in `is_completed: false`. Na strani `/admin/all-tests` se ta seja prikaze kot "V cakanju" z datumom oddaje, kar je zavajajoce - "V cakanju" pomeni, da je otrok opravil test in caka na pregled logopeda.

Stran "V cakanju" (`/admin/pending`) pravilno filtrira samo dokoncane teste (`is_completed = true`), zato tam otroka ni. Problem je samo na `/admin/all-tests`.

### Vzrok

1. `useAdminTests` hook ne pridobiva polja `is_completed` iz baze
2. `StatusBadge` komponenta ne loci med nedokoncanim testom (`is_completed = false`) in dokoncanim testom v cakanju
3. Stolpec "Oddano" prikazuje `submitted_at`, ki se nastavi ob ustvarjanju seje (privzeta vrednost `now()`), ne ob dejanskem zakljucku testa

### Resitev

#### 1. `src/hooks/useAdminTests.ts` - dodaj `is_completed` polje

V SELECT dodat `is_completed` in ga vkljuciti v `TestSessionData` interface:

```text
// Interface:
interface TestSessionData {
  ...
  is_completed: boolean;
}

// Query - dodaj is_completed:
.select('id, status, submitted_at, reviewed_at, completed_at, child_id, parent_id, assigned_to, source_type, logopedist_child_id, organization_id, is_completed')

// Mapping:
is_completed: session.is_completed ?? false,
```

#### 2. `src/pages/admin/AdminTests.tsx` - StatusBadge z novim statusom

Dodati preverjanje `is_completed` pred ostalimi statusi:

```text
// PREJ:
if (status === 'pending') {
  return <Badge>V cakanju</Badge>;
}

// POTEM:
if (!isCompleted) {
  return <Badge variant="outline" className="border-gray-400 text-gray-600 bg-gray-50">
    Ni opravljeno
  </Badge>;
}
if (status === 'pending') {
  return <Badge>V cakanju</Badge>;
}
```

#### 3. `src/pages/admin/AdminTests.tsx` - Oddano datum

Za nedokoncane teste prikazati "-" namesto datuma:

```text
// PREJ:
<TableCell>{formatDate(session.submitted_at)}</TableCell>

// POTEM:
<TableCell>{session.is_completed ? formatDate(session.submitted_at) : '-'}</TableCell>
```

#### 4. Filtri in statistika

Dodati nov status filter "Ni opravljeno" in posodobiti statistiko:

- V `calculateTestStats` dodati `notCompleted` stevec za seje z `is_completed = false`
- V filter dropdown dodati opcijo "Ni opravljeno"
- Stevec "V cakanju" v statistiki mora stejti samo dokoncane teste v cakanju

### Datoteke za spremembo

- **`src/hooks/useAdminTests.ts`** - dodaj `is_completed` v interface, query in mapping; posodobi `calculateTestStats`
- **`src/pages/admin/AdminTests.tsx`** - StatusBadge, datum prikaz, filtri

### Kaj ostane nespremenjeno

- Hook `usePendingTests` - ze pravilno filtrira z `is_completed = true`
- Baza podatkov - brez sprememb (polje `is_completed` ze obstaja)
- Vse ostale strani admin portala

