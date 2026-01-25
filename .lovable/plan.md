
# Plan: Posodobitev strani /admin/my-reviews in /admin/all-tests

## Povzetek sprememb

### 1. Stran /admin/my-reviews
- **Zaključeni pregledi morajo ostati vidni** - Spremeniti hook `useMyReviews.ts` da vključuje tudi status `completed`
- **Gumb "Popravi"** mora biti vedno prikazan (ne samo za completed), levo od "Ogled"

### 2. Stran /admin/all-tests (Vsa preverjanja)
- **Odstraniti gumb "Popravi"** (Pencil) - samo read-only pregled
- **Gumb "Ogled"** - dodati napis "Ogled" poleg ikone Eye
- **Filtriranje** - dodati filtre za: Starost, Spol, Status, Oddano
- **Paginacija** - 10 zapisov na stran, z možnostjo izbire 10/20/50/100

---

## Datoteke za posodobitev

### 1. `src/hooks/useMyReviews.ts`

Sprememba v vrstici 34:
```typescript
// PRED:
.in('status', ['assigned', 'in_review'])

// PO:
.in('status', ['assigned', 'in_review', 'completed'])
```

### 2. `src/pages/admin/AdminMyReviews.tsx`

Spremembe:
- Preurediti gumbe: "Popravi" levo, "Ogled" desno
- "Popravi" gumb prikazan vedno (ne samo za completed)

```tsx
// Desktop tabela - vrstica ~243:
<div className="flex items-center justify-end gap-2">
  <Button size="sm" variant="outline" onClick={() => handleNavigate(session.id + '?edit=true')}>
    <Pencil className="h-4 w-4 mr-1" />
    Popravi
  </Button>
  <Button size="sm" variant="outline" onClick={() => handleNavigate(session.id)}>
    <Eye className="h-4 w-4 mr-1" />
    Ogled
  </Button>
</div>
```

### 3. `src/pages/admin/AdminTests.tsx`

Večje spremembe:

**a) Odstranitev gumba "Popravi"** (vrstice 362-371, 129-137)

**b) Dodajanje napisa "Ogled" poleg ikone** (vrstica 360)
```tsx
<Button variant="ghost" size="sm">
  <Eye className="h-4 w-4 mr-1" />
  Ogled
</Button>
```

**c) Dodajanje filtrov** - pod iskalnikom:
```tsx
<div className="flex flex-wrap gap-4 mb-4">
  {/* Filter: Starost */}
  <Select value={ageFilter} onValueChange={setAgeFilter}>
    <SelectTrigger className="w-[140px]">
      <SelectValue placeholder="Starost" />
    </SelectTrigger>
    <SelectContent>
      <SelectItem value="all">Vse starosti</SelectItem>
      <SelectItem value="3">3 leta</SelectItem>
      <SelectItem value="4">4 leta</SelectItem>
      <SelectItem value="5">5 let</SelectItem>
      <SelectItem value="6">6 let</SelectItem>
      <SelectItem value="7+">7+ let</SelectItem>
    </SelectContent>
  </Select>

  {/* Filter: Spol */}
  <Select value={genderFilter} onValueChange={setGenderFilter}>
    <SelectTrigger className="w-[120px]">
      <SelectValue placeholder="Spol" />
    </SelectTrigger>
    <SelectContent>
      <SelectItem value="all">Vsi</SelectItem>
      <SelectItem value="m">Moški</SelectItem>
      <SelectItem value="f">Ženski</SelectItem>
    </SelectContent>
  </Select>

  {/* Filter: Status */}
  <Select value={statusFilter} onValueChange={setStatusFilter}>
    <SelectTrigger className="w-[140px]">
      <SelectValue placeholder="Status" />
    </SelectTrigger>
    <SelectContent>
      <SelectItem value="all">Vsi statusi</SelectItem>
      <SelectItem value="pending">V čakanju</SelectItem>
      <SelectItem value="in_review">V obdelavi</SelectItem>
      <SelectItem value="completed">Zaključeno</SelectItem>
    </SelectContent>
  </Select>

  {/* Filter: Oddano (datumsko obdobje) */}
  <Select value={dateFilter} onValueChange={setDateFilter}>
    <SelectTrigger className="w-[160px]">
      <SelectValue placeholder="Oddano" />
    </SelectTrigger>
    <SelectContent>
      <SelectItem value="all">Vsi datumi</SelectItem>
      <SelectItem value="today">Danes</SelectItem>
      <SelectItem value="week">Zadnji teden</SelectItem>
      <SelectItem value="month">Zadnji mesec</SelectItem>
      <SelectItem value="year">Zadnje leto</SelectItem>
    </SelectContent>
  </Select>
</div>
```

**d) Paginacija** - nova logika in UI:

Novi state:
```typescript
const [currentPage, setCurrentPage] = useState(1);
const [itemsPerPage, setItemsPerPage] = useState(10);
```

Izračun paginiranih podatkov:
```typescript
const paginatedSessions = useMemo(() => {
  const startIndex = (currentPage - 1) * itemsPerPage;
  return filteredSessions.slice(startIndex, startIndex + itemsPerPage);
}, [filteredSessions, currentPage, itemsPerPage]);

const totalPages = Math.ceil(filteredSessions.length / itemsPerPage);
```

UI za paginacijo pod tabelo:
```tsx
<div className="flex items-center justify-between mt-4 px-2">
  <div className="flex items-center gap-2 text-sm text-muted-foreground">
    <span>Prikazujem {startIndex + 1}-{Math.min(endIndex, total)} od {total}</span>
  </div>
  
  <div className="flex items-center gap-4">
    {/* Izbira na stran */}
    <div className="flex items-center gap-2">
      <span className="text-sm">Na stran:</span>
      <Select value={String(itemsPerPage)} onValueChange={(v) => setItemsPerPage(Number(v))}>
        <SelectTrigger className="w-[70px] h-8">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="10">10</SelectItem>
          <SelectItem value="20">20</SelectItem>
          <SelectItem value="50">50</SelectItem>
          <SelectItem value="100">100</SelectItem>
        </SelectContent>
      </Select>
    </div>
    
    {/* Navigacija strani */}
    <div className="flex items-center gap-1">
      <Button variant="outline" size="sm" disabled={currentPage === 1} onClick={() => setCurrentPage(p => p - 1)}>
        <ChevronLeft className="h-4 w-4" />
      </Button>
      <span className="text-sm px-2">{currentPage} / {totalPages}</span>
      <Button variant="outline" size="sm" disabled={currentPage === totalPages} onClick={() => setCurrentPage(p => p + 1)}>
        <ChevronRight className="h-4 w-4" />
      </Button>
    </div>
  </div>
</div>
```

---

## Vizualna struktura filtriranja na /admin/all-tests

```text
┌─────────────────────────────────────────────────────────────────────────────┐
│ [🔍 Išči po imenu starša ali otroka...                               ]      │
├─────────────────────────────────────────────────────────────────────────────┤
│ [Starost ▼] [Spol ▼] [Status ▼] [Oddano ▼]                                  │
├─────────────────────────────────────────────────────────────────────────────┤
│ Ime starša │ Ime otroka │ Starost │ Spol │ Status │ Oddano │ Akcije        │
├────────────┼────────────┼─────────┼──────┼────────┼────────┼───────────────┤
│ ...        │ ...        │ ...     │ ...  │ ...    │ ...    │ 👁 Ogled      │
├────────────┴────────────┴─────────┴──────┴────────┴────────┴───────────────┤
│ Prikazujem 1-10 od 45                      Na stran: [10▼]  [◀] 1/5 [▶]    │
└─────────────────────────────────────────────────────────────────────────────┘
```

---

## Novi importi za AdminTests.tsx

```typescript
import { ChevronLeft, ChevronRight } from 'lucide-react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
```

---

## Logika filtriranja

Razširiti `filteredSessions` useMemo:

```typescript
const filteredSessions = useMemo(() => {
  if (!sessions) return [];
  
  return sessions.filter(session => {
    // Iskanje
    if (searchQuery) {
      const searchLower = searchQuery.toLowerCase();
      const parentMatch = session.parent_first_name?.toLowerCase().includes(searchLower) ||
                          session.parent_last_name?.toLowerCase().includes(searchLower);
      const childMatch = session.child_name.toLowerCase().includes(searchLower);
      if (!parentMatch && !childMatch) return false;
    }
    
    // Filter: Starost
    if (ageFilter !== 'all') {
      if (ageFilter === '7+') {
        if (!session.child_age || session.child_age < 7) return false;
      } else {
        if (session.child_age !== Number(ageFilter)) return false;
      }
    }
    
    // Filter: Spol
    if (genderFilter !== 'all') {
      const gender = session.child_gender?.toLowerCase();
      if (genderFilter === 'm' && !['m', 'male', 'moški'].includes(gender || '')) return false;
      if (genderFilter === 'f' && !['f', 'female', 'ženski', 'ž', 'z'].includes(gender || '')) return false;
    }
    
    // Filter: Status
    if (statusFilter !== 'all') {
      if (statusFilter === 'in_review') {
        if (!['assigned', 'in_review'].includes(session.status)) return false;
      } else {
        if (session.status !== statusFilter) return false;
      }
    }
    
    // Filter: Datum
    if (dateFilter !== 'all' && session.submitted_at) {
      const submittedDate = new Date(session.submitted_at);
      const now = new Date();
      
      switch (dateFilter) {
        case 'today':
          if (submittedDate.toDateString() !== now.toDateString()) return false;
          break;
        case 'week':
          const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
          if (submittedDate < weekAgo) return false;
          break;
        case 'month':
          const monthAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
          if (submittedDate < monthAgo) return false;
          break;
        case 'year':
          const yearAgo = new Date(now.getTime() - 365 * 24 * 60 * 60 * 1000);
          if (submittedDate < yearAgo) return false;
          break;
      }
    }
    
    return true;
  });
}, [sessions, searchQuery, ageFilter, genderFilter, statusFilter, dateFilter]);
```

---

## Reset paginacije ob spremembi filtrov

```typescript
// Ko se filtri spremenijo, ponastavi na stran 1
useEffect(() => {
  setCurrentPage(1);
}, [searchQuery, ageFilter, genderFilter, statusFilter, dateFilter]);
```
