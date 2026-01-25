

# Načrt: Nova statusna logika "Pregledano" vs "Zaključeno"

## Povzetek sprememb

Trenutno imamo en sam končni status `completed`, ki označuje vse. Želimo ločiti:

| Status | Pomen | Kdaj se nastavi |
|--------|-------|-----------------|
| **Pregledano** | Logoped je poslušal posnetke in ocenil črke | Ko klikne "Zaključi pregled" na `/admin/tests/:id` |
| **Zaključeno** | Logoped je generiral končno poročilo | Ko generira PDF poročilo na `/admin/users/:parentId/:childId` |

### Tehnična implementacija

Ker že obstaja polje `reviewed_at` v tabeli `articulation_test_sessions`, bomo uporabili:
- `reviewed_at` = datum ko je logoped ocenil posnetke ("Pregledano")
- `completed_at` = datum ko je generirano končno poročilo ("Zaključeno")

Status `completed` v bazi ostane, ampak UI ga interpretira glede na:
- Če je `reviewed_at` nastavljen in `completed_at` NI → prikaži "Pregledano"
- Če je `completed_at` nastavljen → prikaži "Zaključeno"

---

## Datoteke za posodobitev

### 1. `src/hooks/useSessionReview.ts` (vrstica ~297)

Spremeniti funkcijo `completeReview`:

```typescript
// PRED:
.update({ status: 'completed' })

// PO:
.update({ 
  status: 'completed',
  reviewed_at: new Date().toISOString() 
})
```

### 2. `src/hooks/useAdminCounts.ts` (vrstica 37)

Spremeniti query za `myReviewsQuery` da šteje vse odprte primere (brez končnega poročila):

```typescript
// PRED:
.in('status', ['assigned', 'in_review'])

// PO - vključi tudi completed BREZ completed_at:
const { count, error } = await supabase
  .from('articulation_test_sessions')
  .select('*', { count: 'exact', head: true })
  .eq('assigned_to', profile.id)
  .or('status.in.(assigned,in_review),and(status.eq.completed,completed_at.is.null)');
```

Alternativna enostavnejša rešitev - štej vse razen tistih s `completed_at`:
```typescript
const { count } = await supabase
  .from('articulation_test_sessions')
  .select('*', { count: 'exact', head: true })
  .eq('assigned_to', profile.id)
  .is('completed_at', null);
```

### 3. `src/pages/admin/AdminMyReviews.tsx` (vrstica 45-62)

Posodobiti `StatusBadge` komponento:

```typescript
function StatusBadge({ status, reviewedAt, completedAt }: { 
  status: MyReviewSession['status'];
  reviewedAt?: string | null;
  completedAt?: string | null;
}) {
  // Če je completed_at nastavljen → Zaključeno
  if (completedAt) {
    return (
      <Badge className="bg-emerald-100 text-emerald-700 border-emerald-200">
        Zaključeno
      </Badge>
    );
  }
  
  // Če je reviewed_at nastavljen (status = completed, ampak brez poročila) → Pregledano
  if (reviewedAt || status === 'completed') {
    return (
      <Badge className="bg-purple-100 text-purple-700 border-purple-200">
        Pregledano
      </Badge>
    );
  }
  
  // assigned ali in_review → V pregledu
  return (
    <Badge className="bg-app-blue/10 text-app-blue border-app-blue/20">
      V pregledu
    </Badge>
  );
}
```

### 4. `src/pages/admin/AdminTests.tsx` (vrstica 27-52)

Enaka posodobitev za `StatusBadge`:

```typescript
const StatusBadge = ({ status, reviewedAt, completedAt }: { 
  status: TestSessionData['status'];
  reviewedAt?: string | null;
  completedAt?: string | null;
}) => {
  // V čakanju
  if (status === 'pending') {
    return (
      <Badge variant="outline" className="border-amber-500 text-amber-700 bg-amber-50">
        V čakanju
      </Badge>
    );
  }
  
  // Zaključeno (poročilo generirano)
  if (completedAt) {
    return (
      <Badge variant="outline" className="border-emerald-500 text-emerald-700 bg-emerald-50">
        Zaključeno
      </Badge>
    );
  }
  
  // Pregledano (ocene oddane, brez poročila)
  if (reviewedAt || status === 'completed') {
    return (
      <Badge variant="outline" className="border-purple-500 text-purple-700 bg-purple-50">
        Pregledano
      </Badge>
    );
  }
  
  // V obdelavi
  return (
    <Badge variant="outline" className="border-blue-500 text-blue-700 bg-blue-50">
      V obdelavi
    </Badge>
  );
};
```

### 5. `src/hooks/useMyReviews.ts`

Dodati `reviewed_at` in `completed_at` v query in interface:

```typescript
// Interface razširitev
export interface MyReviewSession {
  // ... obstoječa polja
  reviewed_at: string | null;
  completed_at: string | null;
}

// Query razširitev (vrstica 32)
.select('id, status, submitted_at, assigned_at, child_id, parent_id, reviewed_at, completed_at')
```

### 6. `src/hooks/useAdminTests.ts`

Enake spremembe - dodati `reviewed_at` in `completed_at`:

```typescript
export interface TestSessionData {
  // ... obstoječa polja
  reviewed_at: string | null;
  completed_at: string | null;
}

// Query (vrstica ~31)
.select('id, status, submitted_at, child_id, parent_id, assigned_to, reviewed_at, completed_at')
```

### 7. Filter na strani `/admin/all-tests`

Posodobiti filter opcije za status:

```typescript
<SelectItem value="pending">V čakanju</SelectItem>
<SelectItem value="in_review">V obdelavi</SelectItem>
<SelectItem value="reviewed">Pregledano</SelectItem>  // NOVO
<SelectItem value="completed">Zaključeno</SelectItem>
```

In logiko filtriranja:

```typescript
if (statusFilter === 'reviewed') {
  // Pregledano = completed status BREz completed_at
  if (session.status !== 'completed' || session.completed_at) return false;
}
if (statusFilter === 'completed') {
  // Zaključeno = ima completed_at
  if (!session.completed_at) return false;
}
```

---

## Vizualni pregled statusov

```text
┌─────────────────────────────────────────────────────────────────────────────┐
│                          DELOVNI TOK                                        │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                             │
│   pending ──► assigned ──► in_review ──► completed ──► completed            │
│      │           │            │              │              │               │
│  "V čakanju"  ─────"V obdelavi"─────    "Pregledano"   "Zaključeno"         │
│                                          reviewed_at    completed_at        │
│                                          nastavljen     nastavljen          │
│                                                                             │
└─────────────────────────────────────────────────────────────────────────────┘
```

---

## Štetje odprtih primerov v "Moji pregledi"

Številka v zavihku prikazuje vse primere BREZ končnega poročila:
- `assigned` ✓
- `in_review` ✓  
- `completed` z `reviewed_at` BREZ `completed_at` ✓

Ko logoped generira poročilo in se nastavi `completed_at`, primer "izgine" iz števca.

---

## Barvna shema statusov

| Status | Barva | Hex |
|--------|-------|-----|
| V čakanju | Amber/Oranžna | `#F59E0B` |
| V obdelavi | Modra | `#3B82F6` |
| Pregledano | Vijolična | `#8B5CF6` |
| Zaključeno | Zelena | `#10B981` |

