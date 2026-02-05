
# Plan: Popravek prikaza stolpca "Starš" in manjkajočih podatkov o otrocih

## Povzetek problema

Na straneh `/admin/pending`, `/admin/my-reviews` in `/admin/all-tests` se pojavljajo naslednje težave:

| Stran | Problem |
|-------|---------|
| AdminPending | Za organizacijske otroke prikaže "Logoped" namesto imena organizacije + logopeda |
| AdminMyReviews | Ime otroka "Neznano", manjka starost in spol za organizacijske otroke |
| AdminAllTests | Enako kot MyReviews - manjkajoči podatki za organizacijske otroke |

## Vzrok problema

### 1. Hooki ne upoštevajo `source_type === 'logopedist'`

Hooki `useMyReviews` in `useAdminTests` vedno iščejo podatke o otroku v tabeli `children`:
```typescript
// Trenutna koda v useMyReviews.ts
const { data: children } = await supabase
  .from('children')  // ← Išče samo v parent tabeli
  .select('id, name, age, gender')
  .in('id', childIds);
```

Za organizacijske otroke pa so podatki v tabeli `logopedist_children`, zato dobimo:
- `child_name: "Neznano"`
- `child_age: null`
- `child_gender: null`

### 2. Napačen prikaz v stolpcu "Starš"

- Stolpec se imenuje "Starš", kar je za organizacijske otroke zavajujoče
- `usePendingTests` pravilno pridobi podatke iz obeh tabel, vendar UI prikaže samo "Logoped"

## Predlagana rešitev

### Pristop za prikaz "Izvor"

Namesto stolpca "Starš" uvedemo stolpec **"Izvor"** z dvema vrsticama:

| source_type | Prva vrstica | Druga vrstica |
|-------------|--------------|---------------|
| `parent` | Ime in priimek starša | *prazno ali "Uporabniški portal"* |
| `logopedist` | Ime organizacije (OŠ Test) | Ime logopeda (Janez Novak) |

### Vizualni prikaz

```text
┌─────────────────────────────────────────────────────────────────┐
│ IZVOR              │ OTROK     │ STAROST │ SPOL │ DATUM ODDAJE │
├────────────────────┼───────────┼─────────┼──────┼──────────────┤
│ OŠ Test            │ Tian      │ 3 leta  │ M    │ 4. feb 2026  │
│ Janez Novak        │           │         │      │              │
├────────────────────┼───────────┼─────────┼──────┼──────────────┤
│ Ana Kovač          │ Luka      │ 5 let   │ M    │ 3. feb 2026  │
│                    │           │         │      │              │
└─────────────────────────────────────────────────────────────────┘
```

## Spremembe po datotekah

### 1. Hook: `src/hooks/useMyReviews.ts`

Spremembe:
- Dodaj poizvedbo za `logopedist_children` (poleg `children`)
- Dodaj poizvedbo za `organizations` (za ime organizacije)
- Dodaj poizvedbo za `logopedist_profiles` (za ime logopeda, ki je otroka dodal)
- Razširi interface `MyReviewSession` z novimi polji

Nova polja v interface:
```typescript
export interface MyReviewSession {
  // ... obstoječa polja ...
  source_type: 'parent' | 'logopedist';
  logopedist_child_id: string | null;
  organization_id: string | null;
  organization_name: string | null;      // NOVO
  logopedist_first_name: string | null;  // NOVO (kdo je dodal otroka)
  logopedist_last_name: string | null;   // NOVO
}
```

### 2. Hook: `src/hooks/useAdminTests.ts`

Enake spremembe kot useMyReviews:
- Dodaj poizvedbo za `logopedist_children`
- Dodaj poizvedbo za `organizations`
- Dodaj poizvedbo za `logopedist_profiles` (za ime logopeda, ki je dodal)
- Razširi interface `TestSessionData`

### 3. Hook: `src/hooks/usePendingTests.ts`

Spremembe:
- Dodaj poizvedbo za `organizations` (za ime organizacije)
- Dodaj poizvedbo za `logopedist_profiles` (za ime logopeda, ki je dodal)
- Razširi interface `PendingTestSession` z `organization_name`, `logopedist_first_name`, `logopedist_last_name`

### 4. UI: `src/pages/admin/AdminPending.tsx`

Spremembe:
- Preimenuj stolpec "Starš" v "Izvor"
- Posodobi funkcijo `formatParentName` → `formatSource` za prikaz dveh vrstic
- Mobile kartice: posodobi prikaz izvora

Nova funkcija:
```typescript
function formatSource(session: PendingTestSession) {
  if (session.source_type === 'logopedist') {
    return {
      line1: session.organization_name || 'Organizacija',
      line2: [session.logopedist_first_name, session.logopedist_last_name]
        .filter(Boolean).join(' ') || null,
    };
  }
  // Parent
  const parentName = [session.parent_first_name, session.parent_last_name]
    .filter(Boolean).join(' ');
  return {
    line1: parentName || 'Neznano',
    line2: null,
  };
}
```

### 5. UI: `src/pages/admin/AdminMyReviews.tsx`

Spremembe:
- Preimenuj stolpec "Starš" v "Izvor"
- Uporabi novo funkcijo `formatSource` za prikaz dveh vrstic
- Posodobi mobile kartice

### 6. UI: `src/pages/admin/AdminTests.tsx` (AdminAllTests)

Spremembe:
- Preimenuj stolpec "Ime in priimek starša" v "Izvor"
- Uporabi novo funkcijo `formatSource`
- Posodobi mobile TestCard komponento

## Diagram toka podatkov

```text
articulation_test_sessions
├── source_type: 'parent'
│   ├── child_id → children (name, age, gender)
│   └── parent_id → profiles (first_name, last_name)
│
└── source_type: 'logopedist'
    ├── logopedist_child_id → logopedist_children (name, age, gender)
    │                         └── logopedist_id → logopedist_profiles (first_name, last_name)
    └── organization_id → organizations (name)
```

## Datoteke za spremembo

| Datoteka | Tip spremembe |
|----------|---------------|
| `src/hooks/usePendingTests.ts` | Dodaj org/logopedist podatke |
| `src/hooks/useMyReviews.ts` | Dodaj podporo za logopedist_children + org/logopedist podatke |
| `src/hooks/useAdminTests.ts` | Dodaj podporo za logopedist_children + org/logopedist podatke |
| `src/pages/admin/AdminPending.tsx` | Preimenuj stolpec, posodobi prikaz |
| `src/pages/admin/AdminMyReviews.tsx` | Preimenuj stolpec, posodobi prikaz |
| `src/pages/admin/AdminTests.tsx` | Preimenuj stolpec, posodobi prikaz |

## Rezultat po spremembi

| Scenarij | Prej | Potem |
|----------|------|-------|
| Org otrok (OŠ Test, Tian) - Izvor | "Logoped" | "OŠ Test" + "Janez Novak" |
| Org otrok (OŠ Test, Tian) - Ime otroka | "Neznano" | "Tian" |
| Org otrok (OŠ Test, Tian) - Starost | "-" | "3 leta" |
| Org otrok (OŠ Test, Tian) - Spol | "-" | "M" |
| Parent otrok - Izvor | "Ana Kovač" | "Ana Kovač" (brez spremembe) |

## Testiranje po implementaciji

1. Prijavi se kot logoped v organizaciji OŠ Test
2. Pojdi na `/admin/pending` - preveri, da je izvor pravilno prikazan
3. Pojdi na `/admin/my-reviews` - preveri:
   - Ime otroka ni več "Neznano"
   - Starost in spol sta prikazana
   - Izvor prikazuje ime organizacije + logopeda
4. Pojdi na `/admin/all-tests` - enako preverjanje
5. Prijavi se kot interni TomiTalk logoped in preveri, da parent otroke še vedno pravilno prikazuje
