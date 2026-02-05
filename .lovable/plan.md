
# Plan: Popravek pridobivanja posnetkov za organizacijske otroke v useSessionReview

## Povzetek problema

Na strani `/admin/tests/{sessionId}` (AdminSessionReview) se za otroka Tian iz organizacije OŠ Test prikazuje **0 posnetkov**, medtem ko na strani `/admin/children/{childId}/details` prikazuje pravilno **10 posnetkov**.

### Vzrok

Hook `useSessionReview.ts` ima dve napaki za organizacijske otroke (`source_type === 'logopedist'`):

| Problem | Trenutna koda | Pravilna koda |
|---------|---------------|---------------|
| **1. Pot do posnetkov** | `${session.parent_id}/${session.child_id}/...` | `logopedist-children/${logopedist_id}/${logopedist_child_id}/...` |
| **2. Podatki o otroku** | Išče v tabeli `children` (vrne null) | Mora iskati v tabeli `logopedist_children` |

### Dokaz iz baze

```text
articulation_test_sessions (id: d4bb9391-21bc-4063-9db0-9eeb112164cf):
├── child_id: NULL ← organizacijski otroci nimajo child_id
├── logopedist_child_id: 81135446-a352-4446-95ba-c899f2d252f5
├── parent_id: ed15e179-951f-465c-930f-8f93b49ceed7 (user_id logopeda)
└── source_type: 'logopedist'

logopedist_children (id: 81135446-a352-4446-95ba-c899f2d252f5):
├── name: "Tian"
├── logopedist_id: e187a584-9c80-4515-8914-4cee5eff2548
└── (logopedist_profiles.id)
```

**Trenutna napačna pot:**
```
ed15e179-951f-465c-930f-8f93b49ceed7/null/Preverjanje-izgovorjave/Seja-1
```

**Pravilna pot:**
```
logopedist-children/e187a584-9c80-4515-8914-4cee5eff2548/81135446-a352-4446-95ba-c899f2d252f5/Preverjanje-izgovorjave/Seja-1
```

## Predlagana rešitev

### Spremembe v `src/hooks/useSessionReview.ts`

#### 1. Razširi interface SessionReviewData

Dodaj polja za organizacijske otroke:
```typescript
interface SessionReviewData {
  session: {
    // ... obstoječa polja ...
    sourceType: 'parent' | 'logopedist';
    logopedistChildId: string | null;
    organizationId: string | null;
  };
  // ...
}
```

#### 2. Posodobi pridobivanje podatkov o otroku

```typescript
// 2. Pridobi podatke o otroku - glede na source_type
let child = { name: 'Neznano', age: null, gender: null };

if (session.source_type === 'logopedist' && session.logopedist_child_id) {
  // Organizacijski otrok - išči v logopedist_children
  const { data: logopedistChild } = await supabase
    .from('logopedist_children')
    .select('name, age, gender, logopedist_id')
    .eq('id', session.logopedist_child_id)
    .single();
  
  if (logopedistChild) {
    child = {
      name: logopedistChild.name,
      age: logopedistChild.age,
      gender: logopedistChild.gender,
    };
  }
} else if (session.child_id) {
  // Parent otrok - išči v children
  const { data: parentChild } = await supabase
    .from('children')
    .select('name, age, gender')
    .eq('id', session.child_id)
    .single();
  
  if (parentChild) {
    child = parentChild;
  }
}
```

#### 3. Posodobi gradnjo poti do posnetkov

```typescript
// 4. Pridobi posnetke iz Storage - glede na source_type
let storagePath: string;

if (session.source_type === 'logopedist' && session.logopedist_child_id) {
  // Za organizacijske otroke: logopedist-children/{logopedist_id}/{child_id}/...
  // Potrebujemo logopedist_id iz logopedist_children tabele
  const { data: logopedistChild } = await supabase
    .from('logopedist_children')
    .select('logopedist_id')
    .eq('id', session.logopedist_child_id)
    .single();
  
  if (logopedistChild) {
    storagePath = `logopedist-children/${logopedistChild.logopedist_id}/${session.logopedist_child_id}/Preverjanje-izgovorjave`;
  } else {
    storagePath = ''; // Fallback - ne bo našlo posnetkov
  }
} else {
  // Za parent otroke: {parent_id}/{child_id}/...
  storagePath = `${session.parent_id}/${session.child_id}/Preverjanje-izgovorjave`;
}
```

## Diagram toka

```text
AdminSessionReview
└── useSessionReview(sessionId)
    └── fetchSessionReviewData()
        ├── 1. Pridobi articulation_test_sessions
        │
        ├── 2. Preveri source_type
        │   ├── 'logopedist' → pridobi iz logopedist_children
        │   └── 'parent' → pridobi iz children
        │
        ├── 3. Gradi storage pot
        │   ├── 'logopedist' → logopedist-children/{logopedist_id}/{logopedist_child_id}/...
        │   └── 'parent' → {parent_id}/{child_id}/...
        │
        └── 4. Pridobi posnetke iz pravilne mape
```

## Datoteke za spremembo

| Datoteka | Tip spremembe |
|----------|---------------|
| `src/hooks/useSessionReview.ts` | Posodobi logiko za organizacijske otroke |

## Rezultat po spremembi

| Scenarij | Prej | Potem |
|----------|------|-------|
| Org otrok Tian - Ime otroka | "Neznano" | "Tian" |
| Org otrok Tian - Starost | null | 3 |
| Org otrok Tian - Spol | null | "M" |
| Org otrok Tian - Posnetki | 0 | 10 (enako kot na details strani) |
| Parent otrok - brez sprememb | Deluje | Deluje |

## Testiranje po implementaciji

1. Odpri `/admin/tests/d4bb9391-21bc-4063-9db0-9eeb112164cf`
2. Preveri, da:
   - Ime otroka je "Tian" (ne "Neznano")
   - Starost in spol sta prikazana
   - Seja-1 ima 10 posnetkov (enako kot na details strani)
   - Posnetki se pravilno predvajajo
3. Preveri parent otroke - še vedno morajo delovati pravilno
